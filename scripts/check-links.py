#!/usr/bin/env python3
"""Validate resource metadata and public HTTP(S) links; do not equate blocks with broken URLs."""
import argparse
import concurrent.futures
import datetime
import ipaddress
import json
import pathlib
import re
import socket
import ssl
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]

def safe_url(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Only public HTTP(S) URLs without embedded credentials are supported.')
    for info in socket.getaddrinfo(parsed.hostname, parsed.port or (443 if parsed.scheme == 'https' else 80)):
        if not ipaddress.ip_address(info[4][0]).is_global:
            raise ValueError('Non-public redirect or address rejected.')
    return url

class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        safe_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def check(url):
    result = {'url': url, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        safe_url(url)
        # Some standalone Python installs omit the operating system's certificate store.
        context = ssl.create_default_context(cafile='/etc/ssl/cert.pem') if pathlib.Path('/etc/ssl/cert.pem').exists() else ssl.create_default_context()
        opener = urllib.request.build_opener(SafeRedirect(), urllib.request.HTTPSHandler(context=context))
        parsed = urllib.parse.urlsplit(url)
        encoded = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc.encode('idna').decode(), urllib.parse.quote(parsed.path, safe="/:@-._~!$&'()*+,;=%"), urllib.parse.quote(parsed.query, safe='=&%+/:?'), ''))
        request = urllib.request.Request(encoded, headers={'User-Agent': 'MindsEducationalResourceCheck/1.0'}, method='GET')
        with opener.open(request, timeout=12) as response:
            response.read(512)
            result.update(status='ok', http=response.status, finalURL=response.url)
    except urllib.error.HTTPError as error:
        result.update(status='blocked' if error.code in (401, 403, 429) else 'http-error', http=error.code, detail=str(error))
    except (TimeoutError, socket.timeout) as error:
        result.update(status='timeout', detail=str(error))
    except socket.gaierror as error:
        result.update(status='network-error', detail=str(error))
    except urllib.error.URLError as error:
        result.update(status='timeout' if isinstance(error.reason, (TimeoutError, socket.timeout)) else 'network-error', detail=str(error.reason))
    except Exception as error:
        result.update(status='invalid-or-unsafe', detail=str(error))
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--all', action='store_true', help='Also extract external links from application sources.')
    args = parser.parse_args()
    resources = json.loads((ROOT / 'src/data/resources.json').read_text())
    required = {'id', 'title', 'provider', 'topic', 'difficulty', 'description', 'type', 'url', 'lastVerified', 'stage'}
    if len({r['id'] for r in resources}) != len(resources):
        raise ValueError('Duplicate resource IDs.')
    for resource in resources:
        if not required.issubset(resource) or not resource['url'] or not 1 <= resource['stage'] <= 7:
            raise ValueError('Invalid resource metadata: ' + str(resource))
    urls = {r['url'] for r in resources}
    if args.all:
        sources = [ROOT / 'index.html', *list((ROOT / 'src').glob('*.js'))]
        for source in sources:
            urls.update(url for url in re.findall(r'''https?://[^\s"'<>`\\]+''', source.read_text())
                        if '${' not in url and not url.endswith(('File:', 'titles=')))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, sorted(urls)))
    lookup = {r['url']: r for r in results}
    for resource in resources:
        status = lookup[resource['url']]
        if status['status'] == 'ok':
            resource['lastVerified'] = status['checkedAt'][:10]
        resource['lastCheckStatus'] = status['status']
    (ROOT / 'src/data/resources.json').write_text(json.dumps(resources, indent=2) + '\n')
    (ROOT / 'src/data/resources.js').write_text('window.MindsResources = ' + json.dumps(resources) + ';\n')
    report = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'results': results,
              'summary': {status: sum(r['status'] == status for r in results) for status in sorted({r['status'] for r in results})}}
    (ROOT / 'docs/link-report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report['summary']))
    for result in results:
        if result['status'] != 'ok':
            print(result['status'] + ': ' + result['url'])

if __name__ == '__main__':
    main()
