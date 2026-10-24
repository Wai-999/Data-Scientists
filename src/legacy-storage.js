// Preserve V4's storage keys while keeping storage failures from aborting startup.
const atlasStorage = {
  getItem(key) { try { return localStorage.getItem(key); } catch { this.warn(); return null; } },
  setItem(key, value) { try { localStorage.setItem(key, value); return true; } catch { this.warn(); return false; } },
  removeItem(key) { try { localStorage.removeItem(key); return true; } catch { this.warn(); return false; } },
  warn() {
    let banner = document.getElementById('atlasStorageWarning');
    if (!banner) { banner = document.createElement('p'); banner.id = 'atlasStorageWarning'; banner.className = 'v5feedback shell'; banner.setAttribute('role', 'status'); document.body.prepend(banner); }
    banner.textContent = 'Browser storage is unavailable. Changes cannot be saved on this device; copy your notes or export a backup before leaving.';
  }
};
