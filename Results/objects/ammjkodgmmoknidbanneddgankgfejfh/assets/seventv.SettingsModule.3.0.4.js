import{e as H,l as s,u as C,j as t,k as g,f as a,x as $,$ as K,_,K as E,a as D,y as W,F as z,q as j,i as Y,aj as Z,s as O,am as J,B as Q,ap as X,aM as ee,G as te,n as se,E as ne,ar as oe}from"./seventv.useSettings.3.0.4.js";import{d as ae}from"./seventv.useModule.3.0.4.js";import{u as N,D as ce,a as re,S as ie}from"./seventv.DropdownIcon.3.0.4.js";import{u as T}from"./seventv.useUpdater.3.0.4.js";import{L as R,G as le,U as de}from"./seventv.StarIcon.3.0.4.js";import{r as b,u as n,n as G,t as k}from"./seventv.useUserAgent.3.0.4.js";import{w as ue}from"./seventv.index.esm.3.0.4.js";import{T as _e}from"./seventv.TwClose.3.0.4.js";import{U as pe}from"./seventv.UiDraggable.3.0.4.js";const ve={class:"seventv-tw-button seventv-settings-menu-button"},ge={key:0,class:"seventv-settings-menu-button-update-flair"},he=H({__name:"SettingsMenuButton",emits:["toggle"],setup(o,{emit:e}){var v,m,p;const i=T(),c=document.createElement("div");c.id="seventv-settings-button";const l=b(c);let u=(v=document.querySelector(".top-nav__menu"))==null?void 0:v.lastChild,f="under";return u||(u=(m=document.querySelector(".modview-dock__followed-channels"))==null?void 0:m.nextSibling,f="right"),u||(u=(p=document.querySelector(".stream-chat-header"))==null?void 0:p.lastChild,f="left"),u&&u.insertBefore(l.value,u.lastChild),(x,S)=>(s(),C(K,{to:l.value},[t("div",ve,[t("button",{onClick:S[0]||(S[0]=B=>e("toggle"))},[g(R),n(i).isUpToDate?$("",!0):(s(),a("div",ge))]),t("span",{class:G(`tooltip-${n(f)}`)}," 7TV Settings ",2)])],8,["to"]))}});const fe=_(he,[["__scopeId","data-v-1722db47"]]),me={},we={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512",fill:"currentColor"},ye=t("path",{d:"M293.1 41.2c-71.1 42-104.5 130-75.2 210.4l35.3 97.1-11.3 44.4L0 305l12.9-35.6 67.2-48 36.4-100c25.7-70.5 103.6-106.8 174-81.2c.9 .3 1.7 .6 2.5 1zM97.5 374.6l117.9 42.9c-11.3 18.3-31.5 30.4-54.5 30.4c-35.4 0-64.1-28.7-64.1-64c0-3.2 .2-6.3 .7-9.3zm181.3 94.5l-13.7-37.6L286.7 347 248 240.6c-27-74.2 11.2-156.2 85.4-183.2s156.3 11.3 183.3 85.5l38.7 106.4 70.9 50.9L640 337.7 278.8 469.1zm150-16.3L545 410.6c.1 1.8 .2 3.6 .2 5.4c0 35.4-28.7 64-64.1 64c-21.6 0-40.8-10.7-52.4-27.1z"},null,-1),$e=[ye];function be(o,e){return s(),a("svg",we,$e)}const Ce=_(me,[["render",be]]),xe={},Ve={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512",fill:"currentColor"},ke=t("path",{d:"M0 0H416V320H202.7L96 384V320H0V0zM256 448V352H448V128H640V448H544v64L437.3 448H256z"},null,-1),He=[ke];function Se(o,e){return s(),a("svg",Ve,He)}const Me=_(xe,[["render",Se]]),ze={},Be={width:"17",height:"17",viewBox:"0 0 17 17",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Le=t("path",{d:"M8.5 16C12.6421 16 16 12.6421 16 8.5C16 4.35786 12.6421 1 8.5 1C4.35786 1 1 4.35786 1 8.5C1 12.6421 4.35786 16 8.5 16Z",stroke:"currentColor","stroke-width":"1.33333","stroke-linecap":"round","stroke-linejoin":"round"},null,-1),Ie=t("path",{d:"M6 6.83334H6.00833M11 6.83334H11.0083M6.41667 11C6.68823 11.2772 7.01237 11.4974 7.37011 11.6477C7.72784 11.798 8.11197 11.8754 8.5 11.8754C8.88803 11.8754 9.27216 11.798 9.62989 11.6477C9.98763 11.4974 10.3118 11.2772 10.5833 11",stroke:"currentColor","stroke-width":"1.33333","stroke-linecap":"round","stroke-linejoin":"round"},null,-1),Oe=[Le,Ie];function Ne(o,e){return s(),a("svg",Be,Oe)}const Te=_(ze,[["render",Ne]]),Ue={},Ae={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 576 512",fill:"currentColor"},Ee=t("path",{d:"M511.8 287.6H576V240L288.4 0 0 240v47.6H64.1V512H224V352H352V512H512.8l-1-224.4z"},null,-1),De=[Ee];function je(o,e){return s(),a("svg",Ae,De)}const Re=_(Ue,[["render",je]]),Ge={},Pe={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 576 512",fill:"currentColor"},qe=t("path",{d:"M575.2 80l-39.6 39.6L306.9 348.3l-79.2-79.2L456.4 40.4 496 .8 575.2 80zM205.1 291.7l79.2 79.2-.1 .1c2.5 9.3 3.8 19 3.8 29c0 61.9-50.1 112-112 112H0V448H64V400c0-61.9 50.1-112 112-112c10 0 19.8 1.3 29 3.8l.1-.1z"},null,-1),Fe=[qe];function Ke(o,e){return s(),a("svg",Pe,Fe)}const We=_(Ge,[["render",Ke]]),Ye={},Ze={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",fill:"currentColor",width:"1em",height:"1em"},Je=t("path",{d:"M192 89.6c-19.1-8.3-32-23.8-32-41.6c0-26.5 28.7-48 64-48s64 21.5 64 48c0 17.8-12.9 33.3-32 41.6V128H384V256h38.4c8.3-19.1 23.8-32 41.6-32c26.5 0 48 28.7 48 64s-21.5 64-48 64c-17.8 0-33.3-12.9-41.6-32H384V512H256V473.6c19.1-8.3 32-23.8 32-41.6c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 17.8 12.9 33.3 32 41.6V512H0V320H38.4c8.3 19.1 23.8 32 41.6 32c26.5 0 48-28.7 48-64s-21.5-64-48-64c-17.8 0-33.3 12.9-41.6 32H0V128H192V89.6z"},null,-1),Qe=[Je];function Xe(o,e){return s(),a("svg",Ze,Qe)}const et=_(Ye,[["render",Xe]]),tt={},st={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",fill:"currentColor"},nt=t("path",{d:"M185 23l-17-17L134.1 40l17 17 39 39H0V512H512V96H321.9l39-39 17-17L344 6.1 327 23l-71 71L185 23zM472 232c0 13.3-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24zM448 336c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24zM64 160H384V448H64V160z"},null,-1),ot=[nt];function at(o,e){return s(),a("svg",st,ot)}const ct=_(tt,[["render",at]]),rt={},it={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 576 512",width:"1em",height:"1em",fill:"currentColor"},lt=t("path",{d:"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"},null,-1),dt=[lt];function ut(o,e){return s(),a("svg",it,dt)}const _t=_(rt,[["render",ut]]),pt=H({__name:"IconForSettings",props:{name:{default:"general"}},setup(o){const i={Home:Re,Chat:Me,Emotes:Te,Appearance:We,Highlights:Ce,General:le,Channel:ct,Compatibility:et,"Enable YouTube":_t}[o.name];return(c,l)=>(s(),C(E(n(i))))}}),vt=["in-view","open"],gt={class:"seventv-settings-category-icon"},ht={class:"seventv-settings-expanded"},ft={class:"seventv-settings-category-contains-unseen"},mt={key:0,class:"dropdown-icon seventv-settings-expanded"},wt={key:0,class:"seventv-settings-category-dropdown seventv-settings-expanded"},yt=["onClick"],$t=H({__name:"CategoryDropdown",props:{category:null,subCategories:null,showSubCategories:{type:Boolean}},emits:["open-category","open-subcategory"],setup(o,{emit:e}){const i=o,c=N(),l=b(!1),u=b(!1);D(c.seen,v=>{let m=!1;for(const[,p]of Object.entries(c.mappedNodes[i.category]??{})){for(const x of p)if(!(v.includes(x.key)||x.type==="NONE")){m=!0;break}break}u.value=m},{immediate:!0});function f(){i.showSubCategories&&!(l.value=!l.value)||e("open-category")}return(v,m)=>(s(),a("div",{class:"seventv-settings-category","in-view":n(c).category===o.category,open:l.value},[t("div",{tabindex:"0",class:"settings-category-header",onClick:m[0]||(m[0]=p=>f())},[t("div",gt,[g(pt,{name:o.category},null,8,["name"])]),t("span",ht,[W(k(o.category)+" ",1),t("span",ft,k(u.value?"•":""),1)]),o.showSubCategories&&o.subCategories.filter(p=>p).length?(s(),a("div",mt,[g(ce)])):$("",!0)]),o.showSubCategories?(s(),a("div",wt,[(s(!0),a(z,null,j(o.subCategories,p=>(s(),a(z,{key:p},[p?(s(),a("div",{key:0,class:G(["seventv-settings-subcategory",{intersect:n(c).intersectingSubcategory===p}]),onClick:x=>e("open-subcategory",p)},k(p),11,yt)):$("",!0)],64))),128))])):$("",!0)],8,vt))}});const I=_($t,[["__scopeId","data-v-80759428"]]),bt={},Ct={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",fill:"currentColor"},xt=t("path",{d:"M160 96h32V32H160 32 0V64 448v32H32 160h32V416H160 64L64 96l96 0zM352 416L512 256 352 96H320v96H160l0 128H320v96h32z"},null,-1),Vt=[xt];function kt(o,e){return s(),a("svg",Ct,Vt)}const Ht=_(bt,[["render",kt]]),St={},Mt={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512",fill:"currentColor",width:"1em",height:"1em"},zt=t("path",{d:"M64 480V416H0v64H64zm96 0V416H96v64h64zm32 0h64V416H192v64zm160 0V416H288v64h64zm32 0h64V416H384v64zM256 160v48h48 28.1L224 316.1 115.9 208H144h48V160 80h64v80zm1.9 190.1L384 224V208 160H352 336 304V112 80 32H256 192 144V80v32 48H112 96 64v48 16L190.1 350.1 224 384l33.9-33.9z"},null,-1),Bt=[zt];function Lt(o,e){return s(),a("svg",Mt,Bt)}const It=_(St,[["render",Lt]]),Ot=["state"],Nt={class:"seventv-settings-expanded"},Tt=H({__name:"SettingsUpdateButton",setup(o){const e=T(),i=b("New Version Available"),c=b(e.latestVersion),l=b("AVAILABLE");function u(){l.value==="AVAILABLE"&&(l.value="PROGRESS",e.requestUpdateCheck().then(()=>{l.value="OK",i.value="Downloading",c.value="Please wait",e.shouldRefreshOnUpdate=!0}).catch(f=>{l.value="ERROR",i.value="Update Failed",c.value=f}))}return(f,v)=>(s(),a("div",{class:"seventv-settings-update-button",state:l.value,onClick:v[0]||(v[0]=m=>u())},[g(It),t("span",Nt,[t("span",null,k(i.value),1),t("span",null,k(c.value),1)])],8,Ot))}});const Ut=_(Tt,[["__scopeId","data-v-fff13703"]]),At={key:0,class:"seventv-settings-menu-container"},Et={class:"seventv-settings-menu"},Dt={class:"seventv-settings-header"},jt={class:"seventv-settings-header-icon"},Rt={class:"body"},Gt={class:"seventv-settings-sidebar"},Pt={class:"seventv-settings-search"},qt={class:"seventv-settings-search-icon"},Ft={class:"seventv-settings-sidebar-profile-left"},Kt={class:"seventv-settings-sidebar-profile-picture"},Wt=["src"],Yt={class:"seventv-settings-sidebar-profile-text seventv-settings-expanded"},Zt={class:"seventv-settings-settings-area"},Jt=H({__name:"SettingsMenu",setup(o){const e=N(),i=te(),c=re(),l=T(),u=document.getElementById("root")??void 0,f=b(),v=b(""),m=Y(Z,"UNKNOWN"),x=ue({compact:960,expanded:1120}).greater("expanded"),S={General:0,Chat:1,Channel:2,Highlights:3,Appearance:4,Compatibility:5};function B(h,d){switch(h){case"Compatibility":return e.switchView("compat")}e.switchView("config"),e.scrollpoint="",e.category=h,d&&se(()=>e.scrollpoint=d)}function P(h){var M;const d=i.nodes;e.mappedNodes={};const w=Object.values(d).filter(r=>r.type!="NONE"&&r.path&&r.path.length==2).sort((r,y)=>{if(!r.path)return-1;if(!y.path)return 1;const V=U(r.path[0]),A=U(y.path[0]);return V==A?r.path[1].localeCompare(y.path[1]):V-A}).filter(r=>!(!r.path||!r.label||h&&!r.label.toLowerCase().includes(h.toLowerCase())));for(const r of w){if(!((M=r.path)!=null&&M.length))continue;const y=r.path[0],V=r.path[1];e.mappedNodes[y]||(e.mappedNodes[y]={}),e.mappedNodes[y][V]||(e.mappedNodes[y][V]=[]),e.mappedNodes[y][V].push(r)}}function U(h){return h&&q(h)?S[h]:-1}function q(h){return h in S}function F(){c.openAuthorizeWindow(m)}return D([i.nodes,v],()=>{P(v.value),e.seen.length===0&&e.markSettingAsSeen(...Object.keys(i.nodes))},{immediate:!0}),(h,d)=>(s(),C(pe,{handle:f.value,"initial-anchor":n(u),"initial-middleware":[n(ee)({crossAxis:!0,mainAxis:!0,padding:{top:50}})],"initial-placement":"top"},{default:O(()=>{var L;return[n(e).open?(s(),a("div",At,[t("div",Et,[t("div",Dt,[t("div",{ref_key:"dragHandle",ref:f,class:"header-left"},[t("div",jt,[g(R)])],512),t("button",{class:"seventv-settings-header-icon seventv-header-button close-icon",onClick:d[0]||(d[0]=J(w=>n(e).open=!1,["prevent"]))},[g(_e)])]),t("div",Rt,[t("div",Gt,[t("div",Pt,[Q(t("input",{"onUpdate:modelValue":d[1]||(d[1]=w=>v.value=w),class:"seventv-settings-search-input"},null,512),[[X,v.value]]),t("div",qt,[g(ie)])]),g(de,null,{default:O(()=>[n(l).isUpToDate?$("",!0):(s(),C(Ut,{key:0})),g(I,{category:"Home","sub-categories":[],onOpenCategory:d[2]||(d[2]=()=>n(e).switchView("home"))}),(s(!0),a(z,null,j(Object.entries(n(e).mappedNodes),([w,M])=>(s(),C(I,{key:w.key,category:w,"sub-categories":Object.keys(M),"show-sub-categories":n(x),onOpenCategory:r=>B(w),onOpenSubcategory:r=>B(w,r)},null,8,["category","sub-categories","show-sub-categories","onOpenCategory","onOpenSubcategory"]))),128)),g(I,{category:"Compatibility","sub-categories":[],onOpenCategory:d[3]||(d[3]=()=>n(e).switchView("compat"))})]),_:1}),t("div",{class:"seventv-settings-sidebar-profile",onClick:d[5]||(d[5]=w=>[F(),n(e).switchView("profile")])},[t("div",Ft,[t("div",Kt,[(L=n(c).user)!=null&&L.avatar_url?(s(),a("img",{key:0,src:n(c).user.avatar_url},null,8,Wt)):$("",!0)]),t("span",Yt,k(n(c).user?n(c).user.display_name:"SIGN IN"),1)]),n(c).user?(s(),a("div",{key:0,class:"seventv-settings-sidebar-profile-logout seventv-settings-expanded",onClick:d[4]||(d[4]=w=>n(c).logout())},[g(Ht)])):$("",!0)])]),t("div",Zt,[(s(),C(E(n(e).view)))])])])])):$("",!0)]}),_:1},8,["handle","initial-anchor","initial-middleware"]))}});const Qt=_(Jt,[["__scopeId","data-v-0a217c4c"]]),Xt=[oe("ui.transparent_backgrounds","TOGGLE",{path:["Appearance","Interface"],label:"Use UI transparency",hint:"If checked some backgrounds will be transparent and blurred. This may affect performance",defaultValue:!0})],es=H({__name:"SettingsModule",setup(o){const{markAsReady:e}=ae("settings",{name:"Settings",depends_on:[]}),i=N();return e(),(c,l)=>(s(),a(z,null,[g(ne,{name:"settings-menu",appear:""},{default:O(()=>[n(i).open?(s(),C(Qt,{key:0})):$("",!0)]),_:1}),g(fe,{onToggle:l[0]||(l[0]=u=>n(i).open=!n(i).open)})],64))}});const ts=_(es,[["__scopeId","data-v-2f472553"]]),us=Object.freeze(Object.defineProperty({__proto__:null,config:Xt,default:ts},Symbol.toStringTag,{value:"Module"}));export{us as _};