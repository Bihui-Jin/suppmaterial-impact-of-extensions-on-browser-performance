import{o as f}from"./seventv.index.esm.3.0.4.js";import{e as p,w as s,o as v,l as h,f as w,m as y,a3 as g,a4 as k,_ as x}from"./seventv.useSettings.3.0.4.js";import{r as B}from"./seventv.useUserAgent.3.0.4.js";const C=p({__name:"UiFloating",props:{anchor:null,position:null,emitClickout:{type:Boolean},middleware:null,placement:null},emits:["clickout"],setup(u,{emit:m}){const n=u,c=B();let e;s(()=>{e==null||e(),e=void 0;const o=n.anchor,l=c.value,_=n.middleware??[],d=n.placement;if(!l)return;const i={getBoundingClientRect:()=>{var r,a;return{top:((r=n.position)==null?void 0:r[1])??0,left:((a=n.position)==null?void 0:a[0])??0,width:0,height:0}}};e=g(o??i,l,()=>{k(o??i,l,{middleware:_,placement:d}).then(({x:r,y:a})=>{l.style.top=`${a}px`,l.style.left=`${r}px`})})});let t;return s(()=>{t==null||t(),t=void 0,n.emitClickout&&(t=f(c.value,o=>m("clickout",o)))}),v(()=>{e==null||e(),t==null||t()}),(o,l)=>(h(),w("div",{ref_key:"el",ref:c,class:"floating-container"},[y(o.$slots,"default",{},void 0,!0)],512))}});const E=x(C,[["__scopeId","data-v-b9254923"]]);export{E as U};