var RULERS=RULERS||{};RULERS.onboarding={tmpGuideX:0,tmpGuideY:0,init:()=>{RULERS.onboarding.step1(),RULERS.helpers.lockScrolling()},step1:()=>{RULERS.modal.open({html:RULERS.html.warningModal(chrome.i18n.getMessage("onboarding_step1_title"),chrome.i18n.getMessage("onboarding_step1_body")),emoji:"tada",buttons:[{value:chrome.i18n.getMessage("onboarding_button_skip_all"),action:RULERS.onboarding.close},{value:chrome.i18n.getMessage("onboarding_button_start"),action:RULERS.onboarding.step2,icon:"arrow"}]})},step2:()=>{const{rulerWidth:a}=RULERS.settings;RULERS.modal.open({html:RULERS.html.warningModal(chrome.i18n.getMessage("onboarding_step2_title"),chrome.i18n.getMessage("onboarding_step2_body")),emoji:"lookingglass",buttons:[{value:chrome.i18n.getMessage("modal_skip"),action:RULERS.onboarding.close},{value:chrome.i18n.getMessage("modal_next"),action:RULERS.onboarding.step3,icon:"arrow"}],callback:()=>{const b=RULERS.vars.el.modal.getBoundingClientRect();RULERS.onboarding.pointTo(b.x,b.y+b.height),RULERS.onboarding.tmpGuideX=b.x-a,RULERS.onboarding.tmpGuideY=b.y+b.height-a,RULERS.guides.addGuide({direction:"v",position:RULERS.onboarding.tmpGuideX,temporary:!0}),RULERS.guides.addGuide({direction:"h",position:RULERS.onboarding.tmpGuideY,temporary:!0})}})},step3:()=>{RULERS.guides.removeGuide({direction:"v",position:RULERS.onboarding.tmpGuideX}),RULERS.guides.removeGuide({direction:"h",position:RULERS.onboarding.tmpGuideY}),RULERS.modal.open({html:RULERS.html.warningModal(chrome.i18n.getMessage("onboarding_step3_title"),chrome.i18n.getMessage("onboarding_step3_body")),emoji:"mindblown",buttons:[{value:chrome.i18n.getMessage("modal_skip"),action:RULERS.onboarding.close},{value:RULERS.plus.isPlus()?chrome.i18n.getMessage("modal_close"):chrome.i18n.getMessage("modal_next"),action:RULERS.onboarding.step4,icon:"arrow"}],callback:()=>{const a=RULERS.vars.el.modal.getBoundingClientRect();RULERS.onboarding.pointTo(a.x+a.width/2,a.y+a.height/2,1.5),RULERS.vars.selectedEl=RULERS.vars.el.modal,RULERS.overlay.draw()}})},step4:()=>{if(RULERS.plus.isPlus())return void RULERS.onboarding.close();const{rulerWidth:a}=RULERS.settings;RULERS.modal.open({html:RULERS.html.warningModal(chrome.i18n.getMessage("onboarding_step4_title"),chrome.i18n.getMessage("onboarding_step4_body")),emoji:"stars",buttons:[{value:chrome.i18n.getMessage("onboarding_button_no"),action:RULERS.onboarding.close},{value:chrome.i18n.getMessage("onboarding_button_buy"),action:()=>{RULERS.onboarding.close(RULERS.plus.triggerModal),RULERS.onboarding.unPoint()},icon:"arrow"}]}),RULERS.onboarding.pointTo(a/2,a/2,.8)},pointTo:(a,b,c=1)=>{RULERS.vars.el.pointer||(RULERS.vars.el.pointer=document.createElement("DIV"),RULERS.vars.el.pointer.id="RULERS_pointer",RULERS.vars.el.container.insertBefore(RULERS.vars.el.pointer,RULERS.vars.el.modal),setTimeout(()=>{RULERS.vars.el.pointer.classList.add("visible")},30)),RULERS.vars.el.pointer.style.transform=`translate(${a}px, ${b}px) scale(${c})`},unPoint:()=>{RULERS.vars.el.pointer.classList.remove("visible"),setTimeout(()=>{RULERS.vars.el.pointer.remove()},300)},close:()=>{RULERS.modal.close(),RULERS.onboarding.unPoint(),RULERS.guides.removeGuide({direction:"v",position:RULERS.onboarding.tmpGuideX}),RULERS.guides.removeGuide({direction:"h",position:RULERS.onboarding.tmpGuideY}),RULERS.helpers.unlockScrolling()}};