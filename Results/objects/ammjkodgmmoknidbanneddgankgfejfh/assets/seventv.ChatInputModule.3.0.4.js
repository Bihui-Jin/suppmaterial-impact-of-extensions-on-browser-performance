import{u as me}from"./seventv.ReactHooks.3.0.4.js";import{g as Me,a as Se,d as Ee}from"./seventv.useModule.3.0.4.js";import{_ as ce,l as d,f as S,j as U,e as K,H as D,w as Ae,u as G,s as re,k as F,F as N,q as Q,x as L,a as _e,ax as de,ay as Oe,at as se,az as Ie,a2 as ve,as as V,aw as W,m as Le,aA as $e,$ as Pe,aB as De,aC as Ne,aD as Ge,ar as H}from"./seventv.useSettings.3.0.4.js";import{u as He,m as Ue}from"./seventv.index.esm.3.0.4.js";import{u as Be}from"./seventv.main.3.0.4.js";import{i as Re}from"./seventv.Transform.3.0.4.js";import{u as je}from"./seventv.useChannelContext.3.0.4.js";import{u as Ve}from"./seventv.useChatEmotes.3.0.4.js";import{u as We,U as Fe}from"./seventv.UiConfirmPrompt.3.0.4.js";import{E as ae,u as Ke}from"./seventv.Emote.3.0.4.js";import{r as E,u as X,c as ze,t as Je,ab as qe,a as Qe}from"./seventv.useUserAgent.3.0.4.js";import{U as Xe}from"./seventv.UiFloating.3.0.4.js";import{a as Ye}from"./seventv.useFloatContext.3.0.4.js";import{_ as Ze}from"./seventv.StarIcon.3.0.4.js";const et={},tt={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 320 512",width:"1em",height:"1em",fill:"currentColor"},ot=U("path",{d:"M320 240L160 384 0 240l0-48 320 0 0 48z"},null,-1),nt=[ot];function st(T,l){return d(),S("svg",tt,nt)}const ye=ce(et,[["render",st]]),at={class:"seventv-autocomplete-floater"},rt={key:0,class:"seventv-autocomplete-floater-list",direction:"backwards"},ct={class:"seventv-autocomplete-floater-list",direction:"current"},it={key:1,class:"seventv-autocomplete-floater-list",direction:"forwards"},lt=K({__name:"ChatInputCarousel",props:{instance:null,currentMatch:null,backwardsMatches:null,forwardsMatches:null},emits:["back","forward"],setup(T,{emit:l}){const _=T,A=D("chat_input.autocomplete.carousel_arrow_keys"),x=E(null),w=E(new Set),v=E(new Set),O=E(new Set);return Ae(()=>{w.value=new Set(_.backwardsMatches),v.value=new Set(_.forwardsMatches),O.value=new Set([_.currentMatch]);const C=_.instance.domNodes.root;C&&(x.value=C)}),He("keydown",C=>{A.value&&(C.key==="ArrowLeft"?l("back",C):C.key==="ArrowRight"&&l("forward",C))},{capture:!0}),(C,g)=>x.value&&T.currentMatch.item?(d(),G(Xe,{key:0,anchor:x.value,placement:"top"},{default:re(()=>[U("div",at,[w.value.size?(d(),S("div",rt,[F(ye),(d(!0),S(N,null,Q(w.value,o=>(d(),S(N,{key:o.token},[o.item?(d(),G(ae,{key:0,emote:o.item},null,8,["emote"])):L("",!0)],64))),128))])):L("",!0),U("div",ct,[(d(!0),S(N,null,Q(O.value,o=>(d(),S(N,{key:o.token},[o.item?(d(),G(ae,{key:0,emote:o.item},null,8,["emote"])):L("",!0)],64))),128))]),v.value.size?(d(),S("div",it,[(d(!0),S(N,null,Q(v.value,o=>(d(),S(N,{key:o.token},[o.item?(d(),G(ae,{key:0,emote:o.item},null,8,["emote"])):L("",!0)],64))),128)),F(ye)])):L("",!0)])]),_:1},8,["anchor"])):L("",!0)}});const ut=ce(lt,[["__scopeId","data-v-c8f45b49"]]),pt=K({__name:"ChatInput",props:{instance:null},setup(T){var pe;const l=T,_=Me("chat-input"),A=Be(),x=je(l.instance.component.componentRef.props.channelID),w=We(x),v=Ve(x),O=Ke(((pe=A.identity)==null?void 0:pe.id)??""),C=ze(),g=D("chat_input.autocomplete.colon"),o=D("chat_input.autocomplete.colon.emoji"),k=D("chat_input.autocomplete.chatters"),I=D("chat_input.autocomplete.carousel"),ge=D("chat_input.spam.rapid_fire_send"),Y=E({}),B=3,$=E(),ie=E(""),z=E(!1),J=E(),Z=E([]),ee=E(-1),{ctrl:ke,shift:we}=Ue();function le(e,n="tab",i){const r=new Set,m=[],c=e.toLowerCase(),u=s=>({tab:s.toLowerCase().startsWith(c),colon:s.toLowerCase().includes(c)})[n];for(const[s,p]of Object.entries(O.emotes))r.has(s)||!u(s)||(r.add(s),m.push({token:s,priority:1,item:p}));for(const[s,p]of Object.entries(v.providers))if(s!="EMOJI")for(const[,M]of Object.entries(p))for(const a of M.emotes){const f=a.name;r.has(f)||!u(f)||(r.add(f),m.push({token:f,priority:2,item:a}))}if(n==="colon")for(const[s]of Object.entries(v.emojis))r.has(s)||!u(s)||(r.add(s),m.push({token:s,priority:4}));if(k.value&&n==="tab"){const s=c.startsWith("@"),p=c.replace("@",""),M=Object.entries(w.chatters);for(const[,a]of M)r.has(a.displayName)||!a.displayName.toLowerCase().startsWith(p)||m.push({token:(s?"@":"")+a.displayName+" ",priority:10})}return m.sort((s,p)=>s.priority+p.priority*(s.token.localeCompare(p.token)/.5)),typeof i=="number"&&m.length>i&&(m.length=i),m}function te(e,n){var a,f;const r=l.instance.component.componentRef,m=(a=r.state)==null?void 0:a.slateEditor;if(!m)return;const c=(f=m.selection)==null?void 0:f.anchor;if(!c)return;e&&(e.preventDefault(),e.stopImmediatePropagation());let u=m;for(const y of c.path){if(!u)break;u=u.children[y]}let s=null,p=0,M=0;if(u.type=="text"&&typeof u.text=="string"){const y=u.text,h=c.offset;for(let t=h;;t--)if(t<1||y.charAt(t-1)===" "&&t!==h){p=t;break}for(let t=h+1;;t++)if(t>y.length||y.charAt(t-1)===" "){M=t-1;break}c.offset!=p&&(s=y.substring(p,M))}if(s&&s!=" "){const y=$.value;let h,t=0,b,R=[],j=[];if(!y||y.expectedPath!=c.path||y.expectedOffset!=c.offset||y.expectedWord!=s){const P=s.endsWith(" ")?s.slice(0,-1):s;b=le(P,"tab"),h=b[t]}else b=y.matches,t=n?y.index-1:y.index+1,t%=b.length,n&&t<0&&(t=b.length-1),h=b[t];if(R=b.slice(Math.max(0,t-B),t),j=b.slice(t+1,t+B+1),j.length<B&&j.push(...b.slice(0,B-j.length).filter(P=>P!==h)),R.length<B&&R.unshift(...b.slice(R.length-B).filter(P=>P!==h)),h){const P=Ce(h.token,r.props.emotes)?h.token:`${h.token} `;z.value=!0,m.apply({type:"remove_text",path:c.path,offset:p,text:s}),m.apply({type:"insert_text",path:c.path,offset:p,text:P});const fe=p+P.length,he={path:c.path,offset:fe};m.apply({type:"set_selection",newProperties:{anchor:he,focus:he}}),$.value={index:t,matches:b,currentMatch:h,backwardsMatches:R,forwardsMatches:j,expectedOffset:fe,expectedPath:c.path,expectedWord:P}}else $.value=void 0}}function Ce(e,n){for(const i of n)for(const r of i.emotes)if(r.token==e)return!0;return!1}function be(){var r;const i=(r=l.instance.component.componentRef.state)==null?void 0:r.slateEditor;i&&(Z.value.unshift(i.children),Z.value.splice(9,1/0),ue())}function oe(e=!0){var s,p,M;const r=(s=l.instance.component.componentRef.state)==null?void 0:s.slateEditor;if(!r)return!1;const m=Z.value;let c=ee.value;if(e?c+=1:c-=1,c<-1||m.length<c)return!1;J.value||(J.value=r.children);let u;if(c<0?u=J.value:u=m[c],u){if(z.value=!0,e&&(((p=r.selection)==null?void 0:p.focus.offset)??0)>1)return!1;if(!e&&(((M=r.selection)==null?void 0:M.focus.offset)??0)<ie.value.length)return!1;for(const t in r.children)r.apply({type:"remove_node",path:[t],node:r.children[t]});for(const t in u)r.apply({type:"insert_node",path:[t],node:u[t]});const a=[];let f;if(u.length>0){const t=u.length-1;for(a.push(t),f=u[t];f&&f.children&&f.children.length>0;){const b=f.children.length-1;a.push(b),f=f.children[b]}}let y=0;f&&f.type=="text"&&f.text&&(y=f.text.length);const h={path:a,offset:y};return r.apply({type:"set_selection",newProperties:{anchor:h,focus:h}}),ee.value=c,!0}return!1}function ue(){ee.value=-1,J.value=void 0,$.value=void 0}function xe(e){switch(e.key){case"Tab":te(e,we.value);break;case"ArrowUp":oe(!0)&&(e.preventDefault(),e.stopImmediatePropagation());break;case"ArrowDown":oe(!1)&&(e.preventDefault(),e.stopImmediatePropagation());break}}function Te(e,n,...i){var u,s;if(!n.startsWith(":")||n.length<3||!g.value)return;const r=(e==null?void 0:e.call(this,n,...i))??[],m={...O.emotes,...v.active,...v.emojis},c=le(n.substring(1),"colon",25);for(let p=c.length-1;p>-1;p--){const M=c[p].token,a=m[M];if(!a||!o.value&&a.provider=="EMOJI")continue;const f=((u=a==null?void 0:a.data)==null?void 0:u.host)??{url:"",files:[]},y=f.srcset??Re(f,a.provider,C.preferredFormat),h=((s=a.provider)==null?void 0:s.split("/"))??["",""];let t=(h==null?void 0:h[0])??a.provider;switch(a.scope){case"GLOBAL":t=t==null?void 0:t.concat(" Global");break;case"PERSONAL":t=t==null?void 0:t.concat(" Personal");break}r.unshift({type:"emote",current:n,element:[a.provider==="EMOJI"?{[W]:Symbol.for("react.element"),ref:null,key:`emote-icon-${a.id}`,type:"svg",props:{style:{width:"3em",height:"3em",padding:"0.5rem"},viewBox:"0 0 36 36",children:[{[W]:Symbol.for("react.element"),ref:null,key:`emote-text-${a.id}-text`,type:"use",props:{href:`#${a.id}`}}]}}:{[W]:Symbol.for("react.element"),ref:null,key:`emote-img-${a.id}`,type:"img",props:{style:{padding:"0.5rem"},srcset:y}},{[W]:Symbol.for("react.element"),ref:null,key:`emote-text-${a.id}`,type:"span",props:{children:`${a.name}`,style:{"margin-right":"0.25rem"}}},{[W]:Symbol.for("react.element"),ref:null,key:`emote-provider-${a.id}`,type:"span",props:{children:`(${t})`,class:[`brand-color-${h[0].toLowerCase()}`]}}],replacement:a.unicode??M})}return r.length>0?r:void 0}_e(()=>l.instance.domNodes.root,(e,n)=>{e!==n&&(n instanceof HTMLElement&&de(n,"ChatAutoComplete","keydown"),e instanceof HTMLElement&&Oe(e,"ChatAutoComplete","keydown",xe,!0))},{immediate:!0}),se(l.instance.component,"onEditableValueUpdate",function(e,n,i,...r){return i&&(be(),ge.value&&ke.value&&setTimeout(()=>oe(!0),0)),z.value||ue(),z.value=!1,ie.value=n,e==null?void 0:e.call(this,n,i,...r)});const q=l.instance.component.providers.find(e=>e.autocompleteType=="mention");q&&(Y.value.mention=q,q.canBeTriggeredByTab=!1,Ie(q,"props",{value(e){w.handlers.add(e.activeChattersAPI.handleMessage)}}));const ne=l.instance.component.providers.find(e=>e.autocompleteType=="emote");return ne&&(Y.value.emote=ne,se(ne,"getMatches",Te)),se(l.instance.component,"componentDidUpdate",function(...e){_!=null&&_.instance&&typeof this.props.setTray=="function"&&(_.instance.setTray=this.props.setTray,_.instance.setModifierTray=this.props.setModifierTray,_.instance.clearModifierTray=this.props.clearModifierTray);const n=e[0];return typeof n=="function"?n.call(this,...e.slice(1)):e}),ve(()=>{const e=l.instance.component;V(e,"onEditableValueUpdate"),V(e,"props"),e.componentRef&&V(e.componentRef,"props");const n=l.instance.domNodes.root;n instanceof HTMLElement&&de(n,"ChatAutoComplete","keydown");const i=Y.value;i.mention&&(i.mention.canBeTriggeredByTab=!0,V(i.mention,"props")),i.emote&&V(i.emote,"getMatches")}),(e,n)=>$.value&&$.value.currentMatch&&X(I)?(d(),G(ut,{key:0,"current-match":$.value.currentMatch,"forwards-matches":$.value.forwardsMatches??[],"backwards-matches":$.value.backwardsMatches??[],instance:T.instance,onBack:n[0]||(n[0]=i=>te(i,!0)),onForward:n[1]||(n[1]=i=>te(i,!1))},null,8,["current-match","forwards-matches","backwards-matches","instance"])):L("",!0)}}),ft={class:"seventv-super-hint"},ht={class:"seventv-super-hint-heading"},mt={class:"seventv-super-hint-content"},dt=K({__name:"UiSuperHint",props:{title:null},setup(T){return(l,_)=>(d(),S("main",ft,[U("div",ht,[F(Ze,{provider:"7TV"}),U("span",null,Je(T.title),1)]),U("div",mt,[Le(l.$slots,"default",{},void 0,!0)])]))}});const yt=ce(dt,[["__scopeId","data-v-7de22f02"]]),_t=U("p",null,"Would you like 7TV to let you bypass this restriction?",-1),vt=K({__name:"ChatSpam",props:{instance:null,suggest:{type:Boolean}},emits:["suggest-answer"],setup(T,{emit:l}){const _=T,A=Se("chat"),x=qe(_.instance.domNodes,"root"),w=Ye(x,{enabled:()=>_.suggest,placement:"top-start",middleware:[De({mainAxis:72})]}),v=$e(!1,3e4);let O="";function C(g){return typeof g=="string"&&g===O?(g=g.replace(Ne,""),v.value=!v.value,v.value&&(g+=" "+Ge)):v.value=!1,O=g,g}return _e(A,g=>{g.instance&&g.instance.messageSendMiddleware.set("handle-dupe",C)},{immediate:!0}),ve(()=>{A.value.instance&&A.value.instance.messageSendMiddleware.delete("handle-dupe")}),(g,o)=>T.suggest&&X(w)?(d(),G(Pe,{key:0,to:X(w)},[F(yt,{title:"Suggestion"},{default:re(()=>[F(Fe,{choices:["yes","no"],onAnswer:o[0]||(o[0]=k=>l("suggest-answer",k)),onClose:o[1]||(o[1]=k=>l("suggest-answer",""))},{default:re(()=>[_t]),_:1})]),_:1})],8,["to"])):L("",!0)}});const gt=[H("chat_input.autocomplete.colon","TOGGLE",{path:["Chat","Autocompletion"],label:"Colon-completion",hint:"Allows the use of a colon (:) to open a list of partially matching emotes",defaultValue:!0}),H("chat_input.autocomplete.colon.emoji","TOGGLE",{path:["Chat","Autocompletion"],label:"Colon-completion: Emoji",disabledIf:()=>!D("chat_input.autocomplete.colon").value,hint:"Whether or not to also include emojis in the colon-completion list (This may impact performance)",defaultValue:!1}),H("chat_input.autocomplete.carousel","TOGGLE",{path:["Chat","Autocompletion"],label:"Tab-completion Carousel",hint:"Show a carousel visualization of previous and next tab-completion matches",defaultValue:!0}),H("chat_input.autocomplete.carousel_arrow_keys","TOGGLE",{path:["Chat","Autocompletion"],label:"Tab-completion Carousel: Arrow Keys",disabledIf:()=>!D("chat_input.autocomplete.carousel").value,hint:"Whether or not to allow using left/right arrow keys to navigate the tab-completion carousel",defaultValue:!0}),H("chat_input.autocomplete.chatters","TOGGLE",{path:["Chat","Autocompletion"],label:"Autocomplete chatters",hint:"Whether or not to consider the usernames of active chatters when using tab-completion",defaultValue:!0}),H("chat_input.spam.bypass_duplicate","TOGGLE",{path:["Chat","Typing"],label:"Bypass Duplicate Message Check",hint:"If enabled, you will be able to send the same message multiple times in a row",defaultValue:!1}),H("chat_input.spam.rapid_fire_send","TOGGLE",{path:["Chat","Typing"],label:"Quick Send",hint:"If enabled, you can use the Ctrl+Enter shortcut to keep the current message in the input box after sending",defaultValue:!0})],kt=K({__name:"ChatInputModule",setup(T,{expose:l}){const{markAsReady:_}=Ee("chat-input",{name:"Chat Input",depends_on:[]}),A=Qe(new WeakMap),x=D("chat_input.spam.bypass_duplicate"),w=E(null),v=me({parentSelector:".chat-input__textarea",maxDepth:50,predicate:o=>o.providers},{trackRoot:!0,containerClass:"seventv-chat-input-textarea",hooks:{update(o){var k,I;A.set(o,!!((I=(k=o.component.componentRef)==null?void 0:k.props)!=null&&I.channelID))}}}),O=[{key:"message-throughput",stateKey:""},{key:"duplicated-messages",stateKey:"lastSentMessage"}];for(const o of O)me({parentSelector:".chat-input",maxDepth:20,predicate:k=>k.props.setModifierTray&&k.key===o.key},{hooks:{update(k){switch(k.component.key){case"duplicated-messages":C(k.component);break}x.value&&(o.stateKey&&(k.component.state[o.stateKey]=null),k.component.props.setModifierTray=()=>{})}}});function C(o){if(!(x.value||w.value===!1)){if(!o.props.tray||o.props.tray.type!=="duplicated-message-error"){w.value=null;return}w.value=!0}}function g(o){if(o)switch(w.value=!1,o){case"yes":x.value=!0;break;case"no":x.value=!1;break}}return l({component:v,setTray:null,setModifierTray:null,clearModifierTray:null}),_(),(o,k)=>(d(!0),S(N,null,Q(X(v).instances,I=>(d(),S(N,{key:I.identifier},[A.get(I)?(d(),G(pt,{key:0,instance:I},null,8,["instance"])):L("",!0),A.get(I)?(d(),G(vt,{key:1,instance:I,suggest:w.value||!1,onSuggestAnswer:g},null,8,["instance","suggest"])):L("",!0)],64))),128))}}),Dt=Object.freeze(Object.defineProperty({__proto__:null,config:gt,default:kt},Symbol.toStringTag,{value:"Module"}));export{Dt as _};