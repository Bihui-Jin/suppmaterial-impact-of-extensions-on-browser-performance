import{C as d,U as i}from"../src/options/options.js";import{e as s,l as a,f as c,j as o,k as t,s as u,z as l,A as m,y as h,_}from"./seventv.useSettings.3.0.4.js";import"./seventv.useUserAgent.3.0.4.js";import"./seventv.StarIcon.3.0.4.js";const p=e=>(l("data-v-ba25ced7"),e=e(),m(),e),v={class:"seventv-popup-inner"},b=p(()=>o("h1",null,[h(" Coming Soon "),o("p",null,"You'll be able to see all the various chats you're connected to from here!")],-1)),f={class:"onboarding-button"},g=p(()=>o("span",null,"Onboarding",-1)),x=s({__name:"PopupInner",setup(e){function n(){chrome.tabs.create({url:chrome.runtime.getURL("index.html#/onboarding/start")})}return(r,P)=>(a(),c("main",v,[b,o("div",f,[t(i,{class:"ui-button-important",onClick:n},{default:u(()=>[g,t(d,{direction:"right"})]),_:1})])]))}});const I=_(x,[["__scopeId","data-v-ba25ced7"]]),y={class:"seventv-popup"},C=s({__name:"Popup",setup(e){return(n,r)=>(a(),c("main",y,[o("div",null,[t(I)])]))}});const U=_(C,[["__scopeId","data-v-a536cadb"]]);export{U as default};