var RULERS=RULERS||{};RULERS.feedback={init:()=>{RULERS.store.get(["feedback"],({feedback:a})=>{const b=30*RULERS.vars.milisecondsPerDay;a.askedAt&&(!(b<Date.now()-a.askedAt)||a.given)||RULERS.feedback.triggerModal()})},triggerModal:()=>{RULERS.modal.open({html:RULERS.html.feedbackModal(),classes:"feedback RULERS__modal--agressive",emoji:"stars"});const a=document.getElementById("js_RULERS_stars"),b=[...a.children];b.forEach((c,d)=>{c.addEventListener("click",c=>{RULERS.feedback.starClickHandler(c.target,d+1,a,b)})});const c=[...RULERS.vars.el.modal.getElementsByClassName("js_RULERS_button_later")];c.forEach(a=>{a.addEventListener("click",RULERS.feedback.delay)});const d=document.getElementById("js_RULERS_button_cta_positive");d.addEventListener("click",RULERS.feedback.positiveCtaClickHandler);const e=document.getElementById("js_RULERS_button_cta_negative");e.addEventListener("click",RULERS.feedback.negativeCtaClickHandler)},starClickHandler:(a,b,c,d)=>{const e=document.getElementById("js_RULERS_rating_positive"),f=document.getElementById("js_RULERS_rating_negative"),g=document.getElementById("js_RULERS_modal_header"),h=document.getElementById("js_RULERS_originalButton");d.forEach(a=>a.classList.remove("selected")),a.classList.add("selected"),c.classList.add("selected"),h.classList.add("hidden"),g.classList.add("hidden"),setTimeout(()=>RULERS.vars.el.modal.classList.remove("emoji-stars"),100),9<=b?(e.classList.add("active"),f.classList.remove("active")):(f.classList.add("active"),e.classList.remove("active"))},delay:()=>{RULERS.store.set({feedback:{askedAt:Date.now(),given:!1}}),RULERS.modal.close()},positiveCtaClickHandler:()=>{window.open("https://chrome.google.com/webstore/detail/designer-tools/jiiidpmjdakhbgkbdchmhmnfbdebfnhp","_blank"),RULERS.feedback.thanks()},negativeCtaClickHandler:()=>{const a=document.getElementById("js_RULERS_rating_input").value;chrome.runtime.sendMessage({type:"sendFeedback",feedback:a}),RULERS.feedback.thanks()},thanks:()=>{RULERS.store.set({feedback:{askedAt:Date.now(),given:!0}}),RULERS.modal.open({html:RULERS.html.warningModal(chrome.i18n.getMessage("feedback_thanks_title"),chrome.i18n.getMessage("feedback_thanks_body")),emoji:"love",buttons:[{value:chrome.i18n.getMessage("general_close"),action:RULERS.modal.close,icon:"arrow"}]})}};