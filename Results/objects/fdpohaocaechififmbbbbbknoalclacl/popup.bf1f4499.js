(()=>{function t(t,e,r,a){Object.defineProperty(t,e,{get:r,set:a,enumerable:!0,configurable:!0})}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},a={},i=e.parcelRequire60cc;null==i&&((i=function(t){if(t in r)return r[t].exports;if(t in a){var e=a[t];delete a[t];var i={id:t,exports:{}};return r[t]=i,e.call(i.exports,i,i.exports),i.exports}var s=new Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(t,e){a[t]=e},e.parcelRequire60cc=i),i.register("eW2D8",(function(e,r){t(e.exports,"ERROR_TYPES",(()=>b)),t(e.exports,"FRAME_PERMS",(()=>x)),t(e.exports,"FRAME_PERMS_CONTAINS",(()=>y)),t(e.exports,"filesToRecord",(()=>v)),t(e.exports,"captureToFiles",(()=>E));var a=i("8rN6d"),s=i("ff4Ef"),n=i("8bPtr"),l=i("6PWuH"),o=i("95ETH"),h=i("jQEAy"),c=i("7ntRd"),u=i("eC8rE"),d=i("erNYL"),f=i("iW6yY"),g=i("2z2pA"),p=i("1RQvI"),m=i("lk6Fz"),w=i("6pLLc");const b={UNKNOWN_MESSAGE:"UnknownMessage",TIMED_OUT:"TimedOut",CHROME_TABS:h.ERROR_TYPE,MISSING_BLOB:"MissingBlob",CONTENT_SCRIPT:"ContentScript"},x={permissions:["webNavigation"],origins:["<all_urls>"]},y={permissions:["webNavigation"],origins:["https://*/*","http://*/*"]},v=(t,e,r,a,i,s)=>u.Capture.from(t,e,r,a,i,s).save(),E=(t,e,r,a,i)=>_(t,r,a,i).then((t=>{let r=t.blobs,a=t.scaleMultiplier,i=t.metadata;return Promise.all(r.map(((t,r)=>function(t,e,r){if(!t){let t=new Error(`_saveBlobToFs got no blob: ${e}, ${r}`);return t.name=b.MISSING_BLOB,Promise.reject(t)}e=function(t,e){if(!e)return t;let r=t.split("."),a=r.pop();return r.join(".")+"-"+(e+1)+"."+a}(e,r);let a=t.size+2048;return f.default.requestFs(a).then((t=>f.default.getFile(t,e,{create:!0}))).then((e=>f.default.writeFile(e,t))).then((()=>({filename:e,size:t.size})))}(t,e,r)))).then((t=>({files:t,scaleMultiplier:a,metadata:i})))})),_=(t,e,r,a)=>M(t,e,r,a).then((e=>(a.add_url&&e.canvasObjs.forEach((r=>{let a=r.ctx,i=r.width,s=(r.height,e.scaleMultiplier);a.scale(s,s),a.fillStyle="#00000055",a.fillRect(0,0,i/s,40),a.fillStyle="#fff",a.font="20px Arial",a.textBaseline="middle",a.fillText(t.url,20,20)})),e.toBlobs().then((t=>({blobs:t,scaleMultiplier:e.scaleMultiplier,metadata:e.metadata})))))),M=(R=(0,a.default)((function(t,e,r,a){var i;return(0,n.__generator)(this,(function(n){return e=e||function(){},""===t.url||"about:blank"===t.url||t.url.startsWith("about:blank#")?i=Promise.resolve().then((()=>{const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const r=e.getContext("2d");return r.fillStyle="#fff",r.fillRect(0,0,e.width,e.height),e.toDataURL()})):"chrome://newtab/"===t.url||"chrome://apps/"===t.url||"edge://newtab/"===t.url||"edge://apps/"===t.url||t.url.startsWith("https://ntp.msn.com/edge/ntp")?i=h.captureVisibleTab(t.windowId,a.fmt_details.capture):t.url.startsWith("data:image/")&&(i=Promise.resolve(t.url)),i?[2,k(i,e,a.fmt_details.canvas)]:[2,new Promise(((i,n)=>{const l=[new(0,m.default)(a.fmt_details.canvas)];let u,f,w=[];chrome.runtime.onMessage.addListener(((i,v,E)=>{try{if(void 0===u&&void 0!==i.windowWidth&&(u=i.windowWidth),void 0!==i.complete&&void 0!==i.canvasId&&l.length>1){let t=l.length,e=(t-i.canvasId-1)/t+i.complete/t;i.complete=e}switch(i.msg){case p.default.capture:var _;e(i.complete);let v=i.canvasId;if(!T(v)){let t=new Error(`Bad canvasId in capture request: ${v}`);return t.name="CaptureRequestError",n(t)}let M=w[v];if(M&&(i.clip.x+=M.left,i.clip.y+=M.top),0===v){const t={ww:i.windowWidth,wh:i.windowHeight,dpr:i.devicePixelRatio};l[v].updateMetadata(t)}return(null===(_=i.links)||void 0===_?void 0:_.length)&&l[v].appendMetadataLinks(i.links),function(t,e,r,a,i,s){return F.apply(this,arguments)}(t.windowId,i,u,l[v],r,i.isFrame?f:void 0).then((t=>{E(t||!0)})).catch(n),!0;case p.default.captureError:return n({name:b.CONTENT_SCRIPT,message:i.name+": "+i.message,stack:i.stack}),!1;case p.default.captureFrame:let R=l.length;l.push(new(0,m.default)(a.fmt_details.canvas));let k=["top","left","width","height","windowWidth"].filter((t=>!T(i[t])));if(k.length){let t=new Error(`Bad props on ${p.default.captureFrame} request: ${k.join(", ")}`);return t.name="CaptureFrameRequestError",n(t)}return w[R]=i,function(t,e,r,a,i,n,l,u,f){let p=a.id;return Promise.resolve().then((()=>o.contains(y))).then((t=>!!t||(d.trigger("needFramePermsClick",{tagName:f}),d.oncePromise("clicked").then((t=>"ok"===t.action&&o.request(x)))))).then((d=>d?c.getAllFrames({tabId:p}).then((a=>{if((a=a.filter((t=>0===t.parentFrameId))).length<=1)return a[0];let i=a.filter((e=>e.url===t));if(i.length>=1){if(1!==i.length){let e=`multiple frames found with url: ${t}`;g.default.warn(e)}return i[0]}return function(t,e,r,a){let i=r*a;return Promise.all(e.map((e=>h.executeScript(t,{frameId:e.frameId,code:"[window.innerWidth, window.innerHeight]",matchAboutBlank:!0}).then((t=>{let e=(0,s.default)(t[0],2),n=e[0],l=e[1];return Math.abs(i+n*l-Math.min(r,n)*Math.min(a,l)*2)}))))).then((t=>{let r,a;return t.forEach(((t,i)=>{(void 0===r||t<r)&&(r=t,a=e[i])})),a}))}(p,a,e,r)})).then((t=>t?I(a,t.frameId,i,n,l,u).catch((t=>{if(h.isExecuteScriptChromeError(t))return null;throw t})):null)).then((t=>n.frame_persist?t:o.remove(x).then((()=>t)))):null))}(i.url,i.width,i.height,t,e,a,R,l[R],i.tagName).then((t=>{if(!t||0===t.canvases.length)return E({skip:!0});const e=t.scaleMultiplier,r=t.pageWidth,a=t.pageHeight,i=w[R],n=[["left","left"],["right","left"],["top","top"],["bottom","top"]];t.canvases.forEach((t=>{n.forEach((r=>{let a=(0,s.default)(r,2),n=a[0],l=a[1];if(t[n]+=i[l]*e,isNaN(t[n])){const t=new Error(`attr isNaN: ${n}`);throw t.name="CanvasObjAttrError",t}}))}));const o=l[R];(o.metadata.links||[]).forEach((t=>{t.bounds.forEach((t=>{t.x+=i.left,t.y+=i.top}))})),l[R-1].appendMetadataLinks(o.metadata.links),f=t,E({width:r,height:a})})).catch(n),!0;default:let S="Unknown message received from content script: "+i.msg;return g.default.error(S),n({name:b.UNKNOWN_MESSAGE,message:S}),!1}}catch(t){g.default.error(t),n(t)}})),I(t,null,e,a,0,l[0],!0).then((()=>{const t=l[0];t.sortLinks(),i(t)})).catch((t=>n(t)))}))]}))})),function(t,e,r,a){return R.apply(this,arguments)});var R;const k=function(){var t=(0,a.default)((function(t,e,r,a){var i,s,l,o,h;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return e(0),[4,t];case 1:return i=n.sent(),e(.5),[4,(0,w.loadImage)(i)];case 2:return s=n.sent(),l=s.img,o=s.width,h=s.height,e(1),(a=a||new(0,m.default)(r)).setObjs(o,h),a.drawImage(l,0,0,o,h),[2,a]}}))}));return function(e,r,a,i){return t.apply(this,arguments)}}(),I=function(){var t=(0,a.default)((function(t,e,r,a,i,s,l){var o,c,u,d,f,p,m;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return o=6e3,[4,O(t.url)];case 1:n.sent(),c=!1,n.label=2;case 2:return n.trys.push([2,4,,5]),[4,(0,w.timeoutWrap)(h.sendMessage(t.id,{msg:"checkExists"},{frameId:e}),50,"tabs.sendSendMessage.checkExists")];case 3:return u=n.sent(),g.default.debug("Message.checkExists",u),u&&u.startTime&&"js/page/index.js"===u.script&&(c=!0),[3,5];case 4:return d=n.sent(),g.default.debug("Message.checkExists.error",d),[3,5];case 5:if(c)return[3,11];n.label=6;case 6:return n.trys.push([6,8,,11]),[4,(0,w.timeoutWrap)(C(t,e,"js/page/index.js"),o,"api._executeScript")];case 7:return n.sent(),[3,11];case 8:return f=n.sent(),l&&(h.isExecuteScriptChromeError(f)||i>0)?(p=h.captureVisibleTab(t.windowId,a.fmt_details.capture),[4,k(p,r,a.fmt_details.capture,s)]):[3,10];case 9:return n.sent(),[2,S(s)];case 10:throw f;case 11:return r(0),m={msg:"scrollPage",canvasId:i,opts:a},e=e||0,[4,h.sendMessage(t.id,m,{frameId:e})];case 12:return n.sent(),s.applyBgRegions(),[2,S(s)]}}))}));return function(e,r,a,i,s,n,l){return t.apply(this,arguments)}}(),S=t=>{const e=t.canvasObjs,r=t.scaleMultiplier||1;return{canvases:e,pageWidth:t.totalWidth/r,pageHeight:t.totalHeight/r,scaleMultiplier:r}};function O(t){return N.apply(this,arguments)}function N(){return(N=(0,a.default)((function(t){return(0,n.__generator)(this,(function(e){switch(e.label){case 0:return l.isFileUrl(t)?[4,l.isAllowedFileSchemeAccess()]:[3,2];case 1:if(!e.sent())return d.trigger("needFilePermsClick"),[2,new Promise((()=>{}))];e.label=2;case 2:return[2]}}))}))).apply(this,arguments)}function F(){return F=(0,a.default)((function(t,e,r,a,i,s){var l,o,c,u,d,f,p,m,b,x,y,v,E,_,M,R;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:if(s)return s.canvases.forEach((t=>{let e=t.canvas,r=t.left,i=t.top,s=t.width,n=t.height;a.drawImage(e,r,i,s,n)})),[2,e];l="",n.label=1;case 1:0,n.label=2;case 2:return n.trys.push([2,4,,8]),[4,h.captureVisibleTab(t,{format:"png"})];case 3:return l=n.sent(),[3,9];case 4:return o=n.sent(),h.isCaptureVisibleTabQuotaError(o)?(g.default.debug("Encountered capture quota error"),[4,(0,w.sleep)(50)]):[3,6];case 5:return n.sent(),[3,7];case 6:throw o;case 7:return[3,8];case 8:return[3,1];case 9:if(!l)throw(c=new Error("No dataURI generated for visible tab")).name="APICaptureStepError",c;return[4,(0,w.loadImage)(l)];case 10:return u=n.sent(),d=u.img,f=u.width,p=u.height,e.image={width:f,height:p},m=r===f?1:f/r,a.setScaleMultiplier(m),1!==m&&a.scaleAll(e,["x","y","totalWidth","totalHeight","capture.*","clip.*"]),a.isEmpty()&&(a.setObjs(e.totalWidth,e.totalHeight,e.canvasBg),a.size()>1&&i&&i(a.size()),e.bgRegions&&(e.bgRegions.forEach((t=>a.scaleAll(t,["sample.*","fill.*"]))),a.setBgRegions(e.bgRegions))),b=e.x+e.capture.x,x=e.y+e.capture.y,y=e.clip.width,v=e.clip.height,E=b-e.clip.x,_=x-e.clip.y,M=e.image.width,R=e.image.height,0===y||0===v?g.default.warn("Zero area mask!",JSON.stringify(e)):0===M||0===R?g.default.warn("Zero area for image!",JSON.stringify(e)):a.drawImage(d,E,_,M,R,e,{x:b,y:x,width:y,height:v}),[2,e]}}))})),F.apply(this,arguments)}function C(t,e,r){let a=""===t.url;if(function(t){let e=chrome.extension.getURL("");return t.url.substring(0,e.length)===e}(t)){let e,a=chrome.extension.getURL(r);try{e=chrome.extension.getViews({type:"tab",tabId:t.id})}catch(t){e=chrome.extension.getViews({type:"tab"})}let i=e.filter((e=>e.location.href===t.url));return i.length||g.default.error("No matching window found for: "+t.url),Promise.all(i.map((t=>new Promise(((e,r)=>{let i=t.document.createElement("script");i.src=a,i.addEventListener("load",e,!1),t.document.body.appendChild(i)})))))}{let i={file:r};return"number"==typeof e&&(i.frameId=e,e>0&&(i.matchAboutBlank=!0)),a&&(i.matchAboutBlank=!0),h.executeScript(t.id,i)}}const T=t=>"number"==typeof t})),i.register("7ntRd",(function(e,r){t(e.exports,"getAllFrames",(()=>s));const a=(0,i("3k2hL").genLastErrorFmt)("ChromeWebNavigationError"),s=t=>new Promise(((e,r)=>{chrome.webNavigation.getAllFrames(t,(t=>{let i=chrome.runtime.lastError;return i?r(a(i,"getAllFrames")):e(t)}))}))})),i.register("lk6Fz",(function(e,r){t(e.exports,"default",(()=>c));var a=i("jBCXK"),s=i("hGGFE"),n=i("j4JJz"),l=i("2z2pA");const o=28800,h=9e3;class c{size(){return this.canvasObjs.length}isEmpty(){return 0===this.canvasObjs.length}updateMetadata(t){this.metadata=(0,a.default)({},this.metadata,t)}appendMetadataLinks(t){if(t){const e=[...this.metadata.links||[],...t];this.metadata=(0,s.default)((0,a.default)({},this.metadata),{links:e})}}sortLinks(){this.metadata.links&&this.metadata.links.sort(((t,e)=>t.bounds[0].y===e.bounds[0].y?t.bounds[0].x-e.bounds[0].x:t.bounds[0].y-e.bounds[0].y))}setScaleMultiplier(t){this.scaleMultiplier=t}setObjs(t,e,r){this.totalWidth=t,this.totalHeight=e;let a,i,s,n,l,c=e>o||t>o||e*t>2592e5,u=t>e,d=c?u?o:h:t,f=c?u?h:o:e,g=Math.ceil(t/d),p=Math.ceil(e/f),m=0,w=[];for(a=0;a<p;a++)for(i=0;i<g;i++){s=document.createElement("canvas"),s.width=i==g-1&&t%d||d,s.height=a==p-1&&e%f||f;let o=s.getContext("2d");r&&(o.fillStyle=r,o.fillRect(0,0,s.width,s.height)),n=i*d,l=a*f,w.push({canvas:s,ctx:o,index:m,left:n,right:n+s.width,top:l,bottom:l+s.height,width:s.width,height:s.height}),m++}this.canvasObjs=w}toDataURLs(){return this.canvasObjs.map((t=>t.canvas.toDataURL(this.exportFormat)))}toBlobs(){return Promise.all(this.canvasObjs.map((t=>(0,n.canvasToBlob)(t.canvas,this.exportFormat))))}fillRect(t,e,r,a,i){this._filter(e,r,a,i).forEach((s=>{let n=this._shift(s,e,r);s.ctx.fillStyle=t,s.ctx.fillRect(n.x,n.y,a,i)}))}strokeRect(t,e,r,a,i){this._filter(e,r,a,i).forEach((s=>{let n=this._shift(s,e,r);s.ctx.strokeStyle=t,s.ctx.strokeRect(n.x,n.y,a,i)}))}drawImage(t,e,r,i,s,n,l){this._debugCounter++,this._filter(e,r,i,s).forEach((o=>{const h=this._shift(o,e,r),c=l?(0,a.default)({},l,this._shift(o,l.x,l.y)):void 0,u=o.ctx;if(u.save(),c){const t=new Path2D,e=c.x,r=c.y,a=c.width,i=c.height,s=Math.floor(c.x),n=Math.floor(c.y);let l=Math.ceil(c.width),o=Math.ceil(c.height);s+l<e+a&&(l+=1),n+o<r+i&&(o+=1),t.rect(s,n,l,o),u.clip(t)}if(u.drawImage(t,h.x,h.y),u.restore(),n&&"object"==typeof n&&!0===n.debug){const t=l||{x:h.x,y:h.y,width:i,height:s};let e=Math.max(0,t.x),r=Math.max(0,t.y),a=t.x<0?t.width+t.x:t.width,o=t.y<0?t.height+t.y:t.height;u.save(),u.strokeStyle="#0F0",u.lineWidth=3,u.strokeRect(e,r,a,o);const c=15;u.font=`${c}px Arial`,u.textAlign="left",u.textBaseline="top";const d=`#${this._debugCounter}: ${this._str(n)}`,f=5,g=u.measureText(d).width;u.fillStyle="rgba(0, 0, 0, .4)",u.fillRect(e,r,g+2*f,c+2*f),u.fillStyle="#FFF",u.fillText(d,e+f,r+f)}}))}_str(t){try{if("capture"===t.msg)return JSON.stringify({x:t.x,y:t.y,clip:t.clip,capture:t.capture})}catch(t){}try{return JSON.stringify(t)}catch(e){return`${t}`}}_filter(t,e,r,a){let i=t+r,s=e+a;return this.canvasObjs.filter((r=>t<r.right&&i>r.left&&e<r.bottom&&s>r.top))}_shift(t,e,r){return{x:Math.round(e-t.left),y:Math.round(r-t.top)}}_constrain(t,e,r,a,i){const s=this._shift(t,e,r),n=s.x,l=n+a,o=s.y,h=o+i,c=Math.max(0,n),u=Math.max(0,o);return{x:c,y:u,width:Math.min(t.height,l-c),height:Math.min(t.height,h-u)}}scale(t){return(t||0)*this.scaleMultiplier}scaleAll(t,e){e.forEach((e=>{if("*"===e)Object.keys(t).forEach((e=>t[e]=this.scale(t[e])));else{let r=e.indexOf(".");-1===r?t[e]=this.scale(t[e]):this.scaleAll(t[e.substring(0,r)],[e.substring(r+1)])}}))}setBgRegions(t){this.bgRegions=t}applyBgRegions(){this.bgRegions.forEach(((t,e)=>{let r=t.sample,a=t.fill;const i=new Map;this._filter(r.x,r.y,r.width,r.height).forEach((t=>{let e=this._constrain(t,r.x,r.y,r.width,r.height);if(e.width>0&&e.height>0){let r=document.createElement("canvas");r.width=e.width,r.height=e.height;let a,s=r.getContext("2d");s.drawImage(t.canvas,-e.x,-e.y);try{a=s.getImageData(0,0,e.width,e.height)}catch(t){l.default.error(t)}a&&this._getHisto(a.data,i)}}));let s=0,n=0;if(i.forEach(((t,e)=>{t>s&&(s=t,n=e)})),0!==n){const t=`rgb(${this._toRgb(n).join(", ")})`;this.fillRect(t,a.x,a.y,a.width,a.height)}}))}_getHisto(t,e){e=e||new Map;for(let r=0,a=t.length;r<a;r+=4)if(255===t[r+3]){const a=this._toInt(t[r],t[r+1],t[r+2]);e.set(a,(e.get(a)||0)+1)}return e}_toInt(t,e,r){return(t<<16)+(e<<8)+r}_toRgb(t){const e=255&t,r=255&(t>>=8);return[255&(t>>=8),r,e]}constructor(t){this.exportFormat=t,this.canvasObjs=[],this.bgRegions=[],this.scaleMultiplier=1,this.totalWidth=0,this.totalHeight=0,this.metadata={},this._debugCounter=0,this.scaleMultiplier=1,this.totalWidth=0,this.totalHeight=0,this.metadata={},this._debugCounter=0}}}))})();
//# sourceMappingURL=popup.bf1f4499.js.map