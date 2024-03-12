import { s } from './storage-e7df8ba2.js';

const n=n=>{let s$1;const t=()=>{s$1=s.runtime.connect(n),s$1.onDisconnect.addListener((()=>{t();}));};function o(e){return {addListener:n=>s$1[e].addListener(n),removeListener:n=>s$1[e].removeListener(n),hasListener:n=>s$1[e].hasListener(n),hasListeners:()=>s$1[e].hasListeners()}}t();const r={name:(null==n?void 0:n.name)||"",disconnect:()=>s$1.disconnect(),onDisconnect:o("onDisconnect"),onMessage:o("onMessage"),postMessage:e=>s$1.postMessage(e)};return Object.defineProperty(r,"name",{get:()=>s$1.name}),r};

export { n };
