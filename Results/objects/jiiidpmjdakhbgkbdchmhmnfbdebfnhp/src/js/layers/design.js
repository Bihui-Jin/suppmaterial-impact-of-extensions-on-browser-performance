var _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},RULERS=RULERS||{};RULERS.design={draw:a=>{const b=RULERS.vars.layers.design,c=()=>{const{scrollPos:c}=RULERS.vars,{correctSize:d}=RULERS.helpers,{rulerWidth:e}=RULERS.settings,f=RULERS.vars.design.scale/100*RULERS.vars.scale;let g=0;if("center"===RULERS.vars.design.alignment){const a=RULERS.vars.el.overlay.width/2+e,b=RULERS.vars.el.tmpDesign.width*f/2;g=a-b}else"right"===RULERS.vars.design.alignment&&(g=b.canvas.width-RULERS.vars.el.tmpDesign.width*f);const h={width:RULERS.vars.el.tmpDesign.width*f,height:RULERS.vars.el.tmpDesign.height*f,x:-d(c.x)+g- -RULERS.vars.design.xOffset,y:-d(c.y)+0- -RULERS.vars.design.yOffset};RULERS.vars.el.tmpDesign.removeEventListener("load",RULERS.drawOverlay.drawImage),b.save(),b.globalAlpha=RULERS.vars.design.opacity/100||1,"grayscale"===RULERS.vars.design.filter?(b.filter="grayscale()",b.drawImage(RULERS.vars.el.tmpDesign,h.x,h.y,h.width,h.height)):"difference"===RULERS.vars.design.filter?(b.filter="invert()",b.drawImage(RULERS.vars.el.tmpDesign,h.x,h.y,h.width,h.height)):b.drawImage(RULERS.vars.el.tmpDesign,h.x,h.y,h.width,h.height),b.restore(),a&&a()};RULERS.vars.design&&RULERS.vars.design.src?(RULERS.vars.el.tmpDesign.src!==RULERS.vars.design.src&&(RULERS.vars.design.buffer=null),(a=>new Promise((b,c)=>{a===RULERS.vars.el.tmpDesign.src?b():(RULERS.vars.el.tmpDesign.src="",RULERS.vars.el.tmpDesign.crossOrigin="Anonymous",RULERS.vars.el.tmpDesign.addEventListener("load",b),RULERS.vars.el.tmpDesign.addEventListener("error",c),RULERS.vars.el.tmpDesign.src=a)}))(RULERS.vars.design.src).then(()=>{c()},()=>{RULERS.vars.design.src=null,RULERS.vars.design.originalName=null,RULERS.vars.design.buffer=null,"function"==typeof a&&a(),RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[window.location.href]:_extends({},a[window.location.href],{src:null,originalName:null})})})})})):"function"==typeof a&&a()},storeDesign:(a,b)=>{if(a){(a=>new Promise((b,c)=>{const d=new FileReader;d.readAsDataURL(a),d.onload=()=>b(d.result),d.onerror=a=>c(a)}))(a.target.files[0]).then(b=>{RULERS.store.design.set({image:b,name:a.target.files[0].name},a=>{if(a.error)return void("STORAGE_FULL"===a.error&&RULERS.design.triggerStorageFullModal(a))}),RULERS.vars.design.src=b,RULERS.overlay.draw()})}else RULERS.design.delete(b)},delete:(a,b)=>{RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[b||window.location.href]:{src:null,originalName:null}})}),RULERS.vars.design.buffer=null}),b||(RULERS.vars.design.buffer=null,RULERS.vars.design.src=null),RULERS.store.design.delete(b||window.location.href),a&&a(),RULERS.overlay.draw()},changeScale:a=>{const b=a.target.value;RULERS.vars.design.buffer=null,RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[window.location.href]:_extends({},a[window.location.href],{scale:b})})})}),RULERS.vars.design.scale=b,RULERS.overlay.draw()},changeOpacity:a=>{const b=a.target.value;RULERS.vars.design.buffer=null,RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[window.location.href]:_extends({},a[window.location.href],{opacity:b})})})}),RULERS.vars.design.opacity=b,RULERS.overlay.draw()},changeXOffset:a=>{const b=a.target.value;RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[window.location.href]:_extends({},a[window.location.href],{xOffset:b})})})}),RULERS.vars.design.xOffset=b,RULERS.overlay.draw()},changeYOffset:a=>{const b=a.target.value;RULERS.store.get(["design"],({design:a})=>{RULERS.store.set({design:_extends({},a,{[window.location.href]:_extends({},a[window.location.href],{yOffset:b})})})}),RULERS.vars.design.yOffset=b,RULERS.overlay.draw()},changeFilter:a=>{RULERS.vars.design.buffer=null,RULERS.store.get(["design"],({design:b})=>{RULERS.store.set({design:_extends({},b,{[window.location.href]:_extends({},b[window.location.href],{filter:a||null})})})}),RULERS.vars.design.filter=a,RULERS.overlay.draw()},changeAlignment:a=>{RULERS.store.get(["design"],({design:b})=>{RULERS.store.set({design:_extends({},b,{[window.location.href]:_extends({},b[window.location.href],{alignment:a||null})})})}),RULERS.vars.design.alignment=a,RULERS.overlay.draw()},triggerStorageFullModal:({storage:a,freeSpaceNeeded:b,request:c})=>{RULERS.modal.open({html:RULERS.html.storageFullModal(a),classes:"storage-full",emoji:"warning",callback:()=>{const a=RULERS.vars.el.modal,d=a.querySelector("#js_RULERS__warning"),f=a.querySelector("#js_RULERS__continue_btn"),g=a.querySelector("#js_RULERS__button_ignore"),h=a.querySelector("#js_RULERS__space"),i=[...a.querySelectorAll(".js_RULERS__delete")];i.forEach(a=>{a.addEventListener("click",a=>{RULERS.design.delete(()=>{a.target.parentElement.parentElement.classList.add("deleted"),d.classList.add("done"),f.removeAttribute("disabled")},a.target.dataset.url)})}),h.innerHTML=b,g.addEventListener("click",RULERS.modal.close),f.addEventListener("click",()=>{RULERS.store.design.set({image:c.image,name:c.name}),RULERS.modal.close()})}})}};