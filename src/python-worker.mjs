// Pinned runtime; only Python's bundled standard library is loaded automatically.
import {loadPyodide} from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';
let captured='',truncated=false;
const append=text=>{if(captured.length<100000)captured+=text+'\n';else truncated=true;};
const ready=loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/',stdout:append,stderr:append});
ready.then(()=>self.postMessage({type:'ready'})).catch(error=>self.postMessage({type:'error',message:'Python could not load: '+error.message}));
self.onmessage=async event=>{
  if(event.data?.type!=='run')return;
  captured='';truncated=false;
  let globals;
  try{
    const pyodide=await ready;globals=pyodide.toPy({});
    const result=await pyodide.runPythonAsync(event.data.code,{globals});
    if(result!==undefined){append(String(result));result?.destroy?.();}
    self.postMessage({type:'result',output:captured+(truncated?'\nOutput truncated at 100,000 characters.':'')});
  }catch(error){self.postMessage({type:'execution-error',output:captured,message:error.message});}
  finally{globals?.destroy();}
};
