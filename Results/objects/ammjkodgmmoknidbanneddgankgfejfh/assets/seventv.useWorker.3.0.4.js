import{ai as E}from"./seventv.useSettings.3.0.4.js";import{ac as p,l}from"./seventv.useUserAgent.3.0.4.js";const k=new p;k.setContextName("Worker/Pipe");let m=null;async function _(i,r){let a;const e="3.0.4",t=localStorage.getItem(E.WORKER_ADDR);let o=null;try{o=t?JSON.parse(t):null}catch(c){l.error("Unable to parse worker address data",String(c)),localStorage.removeItem(E.WORKER_ADDR)}let n=typeof o=="object"&&o!==null?o[e]:null;if(n&&await fetch(n).then(c=>c.ok).catch(()=>!1))l.info("Connecting to existing worker",`addr=${n}`);else{n=r,n||l.error("Unable to find address to worker");const c=await fetch(n||"").then(d=>d.blob()).catch(d=>{l.error("Unable to fetch worker data",d)});if(!c)return Promise.reject("There was an error fetching worker data");l.info("Received worker data",`(${c.size} bytes)`),n=URL.createObjectURL(c),localStorage.setItem(E.WORKER_ADDR,JSON.stringify({...o??{},[e]:n}))}return new Promise((c,d)=>{if(!n)return d("No address to worker");T(i),a=m=new SharedWorker(n,{name:"seventv-extension"}),a.port.start(),w(a.port),addEventListener("beforeunload",()=>{f("CLOSE",{})}),c(a)})}function f(i,r){m&&m.port.postMessage({type:i,data:r})}function L(){return{init:_,sendMessage:f,target:s}}function T(i){i.onmessage=r=>{const{type:a,data:e}=r.data;switch(a){case"LOG":{const{type:t,text:o,css:n,objects:u}=e;o.splice(1,0,"%c[Worker]%c"),n.splice(1,0,...Array(2).fill("color: #ca32fc;font-weight:900")),k.print(t,o,n,u);break}}}}function w(i){i.addEventListener("message",r=>{const{type:a,data:e}=r.data;switch(a){case"INIT":{s.emit("ready",{});break}case"CONFIG":{s.emit("config",e);break}case"CHANNEL_FETCHED":{const{channel:t}=e;s.emit("channel_fetched",t);break}case"COSMETIC_CREATED":{const t=e;s.emit("cosmetic_created",t);break}case"ENTITLEMENT_CREATED":{const t=e;s.emit("entitlement_created",t);break}case"ENTITLEMENT_DELETED":{const t=e;s.emit("entitlement_deleted",t);break}case"STATIC_COSMETICS_FETCHED":{const{badges:t,paints:o}=e;s.emit("static_cosmetics_fetched",{badges:t,paints:o});break}case"SYNC_TWITCH_SET":{const{out:t}=e;if(!t)return;s.emit("twitch_emote_set_data",t);break}case"EMOTE_SET_UPDATED":s.emit("emote_set_updated",e);break;case"USER_UPDATED":s.emit("user_updated",e);break}})}class b extends EventTarget{constructor(){super()}addEventListener(r,a,e){super.addEventListener(r,a,e)}removeEventListener(r,a,e){super.removeEventListener(r,a,e)}dispatchEvent(r){return super.dispatchEvent(r)}emit(r,a){this.dispatchEvent(new CustomEvent(r,{detail:a}))}}const s=new b;export{L as u};