var c=Object.defineProperty;var p=(a,e,t)=>e in a?c(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var s=(a,e,t)=>(p(a,typeof e!="symbol"?e+"":e,t),t);import{W as h}from"./seventv.useSettings.3.0.4.js";import{s as d}from"./seventv.Transform.3.0.4.js";import{a as m}from"./seventv.useUserAgent.3.0.4.js";const i=new BroadcastChannel(h);class v{constructor(){s(this,"runtimeVersion","3.0.4");s(this,"latestVersion","3.0.4");s(this,"isUpToDate",!0);s(this,"updateReady",!1);s(this,"shouldRefreshOnUpdate",!1);s(this,"updateCheckRequested",!1);i.addEventListener("message",e=>{const{type:t,data:r}=e.data;switch(t){case"seventv-update-ready":{if(!r.version||this.updateReady)return;this.latestVersion=r.version,this.checkUpdate(),this.updateReady=!0,setTimeout(()=>window.location.reload(),3e3);break}}})}checkUpdate(){return this.isUpToDate=!(d(this.latestVersion)>d(this.runtimeVersion))}async requestUpdateCheck(){return this.updateCheckRequested?"":(this.updateCheckRequested=!0,new Promise((e,t)=>{const r=o=>{const{type:u,data:n}=o.data;u==="seventv-update-check-result"&&(n.version?(e(n.version),this.latestVersion=n.version,this.checkUpdate()):t(n.status),i.removeEventListener("message",r))};i.addEventListener("message",o=>r(o)),i.postMessage({type:"seventv-update-check",data:{}})}))}}const l=m(new v);function y(){return l}export{y as u};