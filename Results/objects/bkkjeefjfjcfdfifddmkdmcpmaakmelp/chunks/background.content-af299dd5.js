import { t } from './index-f253f80e.js';
import { s, m } from './storage-e7df8ba2.js';
import { n } from './connectRuntime-46c719de.js';

class o extends t{constructor(){super(),this.fetch=async(t,e)=>{const s=Math.random().toString();return this.port.postMessage({nonce:s,path:t,body:e}),new Promise((t=>{const e=a=>{a.meta.nonce===s&&(this.port.onMessage.removeListener(e),t(a));};this.port.onMessage.addListener(e);}))},this.extensionId=s.runtime.id,this.port=this.connectToBackground(),this.port.onMessage.addListener(this.onMessage),window.addEventListener("message",(async t=>{var e,a,o;if(t.source!==window||(null===(e=t.data)||void 0===e?void 0:e.id)!==this.extensionId||"response"===(null===(a=t.data)||void 0===a?void 0:a.type))return;let n;switch(null===(o=t.data)||void 0===o?void 0:o.type){case"fetch":n=await this.fetch(t.data.data[0],t.data.data[1]);break;case"storage.get":{const[e,a]=t.data.data.split(".");n=await m[e].get(a);break}case"storage.set":{const[e,a]=t.data.data[0].split(".");n=await m[e].set(a,t.data.data[1]);break}}window.postMessage({id:this.extensionId,nonce:t.data.nonce,type:"response",data:n});}));}connectToBackground(){return n()}async onMessage(t){window.postMessage(t);}}

export { o };
