(this["webpackJsonppicwatermark-image-recognition-v2"]=this["webpackJsonppicwatermark-image-recognition-v2"]||[]).push([[0],{115:function(e){e.exports=JSON.parse('{"watermark-not-found.message":"Nikt nie podpisa\u0142 tego zdj\u0119cia, b\u0105d\u017a pierwszy!","watermark-found.basic-info":"Podstawowe informacje","watermark-found.comments":"Komentarze","watermark-found.owner":"W\u0142a\u015bciciel","watermark-found.author":"Autor","watermark-found.title":"Tytu\u0142","watermark-found.url":"URL","watermark-found.hlt":"Ukryte linki","watermark-found.tags":"Tagi","find-more.button.signFile":"Podpisz zdj\u0119cie","find-more.button.seeMore":"Zobacz wi\u0119cej","lowResolution.error":"Rozdzielczo\u015b\u0107 wybranego zdj\u0119cia jest za ma\u0142a (mniejsza od 200x200px).","main.error":"Co\u015b posz\u0142o nie tak, spr\xf3buj ponownie.","settings":"Ustawienia","settings.hltToggle":"Otwieranie ukrytych link\xf3w przy uruchomieniu"}')},116:function(e){e.exports=JSON.parse('{"watermark-not-found.message":"Nobody has signed this image, be the first!","watermark-found.basic-info":"Basic info","watermark-found.comments":"Comments","watermark-found.owner":"Owner","watermark-found.author":"Author","watermark-found.title":"Title","watermark-found.url":"URL","watermark-found.hlt":"Hidden links","watermark-found.tags":"Tags","find-more.button.signFile":"Sign image","find-more.button.seeMore":"See more","lowResolution.error":"Picture resolution to low. Must be more then 200x200.","main.error":"Something went wrong. Please try again.","settings":"Settings","settings.hltToggle":"Open hidden links as default"}')},138:function(e,t,a){e.exports=a(177)},177:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(14),o=a.n(c),l=a(19),i=a(20),u=a(22),m=a(21),s=a(23),p=a(213),d=a(214),f=a(215),h=a(118),g=a(216),E=a(5),b=a(204);function v(){return r.a.createElement(h.a,{variant:"body2",color:"textSecondary"},"Copyright \xa9 ",r.a.createElement(b.a,{color:"inherit",href:"https://picwatermark.pl"},"Picwatermark.pl")," ",(new Date).getFullYear(),".")}var w=a(117),y=Object(w.a)({typography:{fontFamily:"'Lato', sans-serif"},palette:{primary:{main:"#0075c0"},secondary:{main:"#FFCA28"}}}),O=a(212),j=a(211),k=a(207),x=a(25),S=a(208),C=a(113),N=a.n(C),D=a(181),T=a(228),U=a(231),z=a(96),I=a.n(z),P=a(230),R=a(205),W=a(206),F=function(){var e=r.a.useState("true"===localStorage.getItem("openHlt")||!1),t=Object(x.a)(e,2),a=t[0],n=t[1];r.a.useEffect((function(){localStorage.setItem("openHlt","".concat(a))}),[a]);return r.a.createElement(R.a,{control:r.a.createElement(P.a,{checked:a,onChange:function(e){n(e.target.checked)},color:"primary",inputProps:{"aria-label":"primary checkbox"}}),label:r.a.createElement(W.a,{id:"settings.hltToggle"})})},B=Object(k.a)((function(e){return Object(S.a)({typography:{padding:e.spacing(2)}})}));function A(){var e=B(),t=r.a.useState(null),a=Object(x.a)(t,2),n=a[0],c=a[1],o=Boolean(n),l=o?"popover":void 0;return r.a.createElement("div",null,r.a.createElement(U.a,{title:r.a.createElement(W.a,{id:"settings"})},r.a.createElement(D.a,{"aria-label":"settings-icon",onClick:function(e){c(e.currentTarget)}},r.a.createElement(N.a,{style:{color:I.a[50]}}))),r.a.createElement(T.a,{id:l,open:o,anchorEl:n,onClose:function(){c(null)},anchorOrigin:{vertical:"bottom",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"}},r.a.createElement(h.a,{className:e.typography},r.a.createElement(F,null))))}var M=Object(k.a)((function(e){return{titleContent:{display:"flex",flexDirection:"row",justifyContent:"space-between"}}})),H=function(){var e=M();return r.a.createElement(j.a,{position:"relative"},r.a.createElement(O.a,{className:e.titleContent},r.a.createElement(h.a,{variant:"subtitle1",color:"inherit"},"Picwatermark"),r.a.createElement(A,null)))},J=function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:this.props.classes.root},r.a.createElement(p.a,null),r.a.createElement(d.a,{theme:y},r.a.createElement(H,null),r.a.createElement(f.a,{component:"main",className:this.props.classes.main,maxWidth:"lg"},r.a.createElement(h.a,{variant:"h4",component:"h3",gutterBottom:!0},r.a.createElement(g.a,{className:this.props.classes.divider}),this.props.children)),r.a.createElement("footer",{className:this.props.classes.footer},r.a.createElement(v,null))))}}]),t}(r.a.PureComponent),L=Object(E.a)((function(e){return{root:{backgroundColor:e.palette.background.paper,display:"flex",flexDirection:"column",minWidth:"500px",minHeight:"100vh"},main:{padding:e.spacing(2,3)},divider:{display:"none"},footer:{padding:e.spacing(2,3),marginTop:"auto",backgroundColor:e.palette.grey[200]}}}))(J),_=a(226),G=Object(k.a)((function(e){return Object(S.a)({image:{maxWidth:"70%",maxHeight:"70%"},typography:{display:"flex",justifyContent:"center",margin:e.spacing(2,0)}})})),K=function(e){var t=e.pictureUrl,a=G();return r.a.createElement(h.a,{className:a.typography,gutterBottom:!0},r.a.createElement("img",{className:a.image,src:t,alt:""}))};var Y=a(217),Z=Object(k.a)((function(e){return Object(S.a)({typography:{display:"flex",justifyContent:"flex-end",margin:e.spacing(2,0),alignItems:"baseline"}})}));function q(e){var t=e.uuid,a=r.a.createElement(W.a,{id:"find-more.button.seeMore"});null===t&&(a=r.a.createElement(W.a,{id:"find-more.button.signFile"}));var n=Z();return r.a.createElement(h.a,{className:n.typography,gutterBottom:!0},r.a.createElement(Y.a,{onClick:function(e){return function(e){e.preventDefault(),chrome.tabs.create({url:null!==t?"https://picwatermark.pl/#/picture/".concat(t):"https://picwatermark.pl"},(function(e){console.log(e)}))}(e)},variant:"contained",color:"primary"},a))}var Q=a(219),V=a(85),X=a.n(V),$=a(220),ee=a(232),te=a(221),ae=a(222),ne=a(223),re=a(224),ce=a(225),oe=a(114),le=a.n(oe),ie=a(59),ue=a.n(ie),me=a(83),se="https://picwatermark.pl/api/core/v1",pe=a(218),de=a(233),fe=a(229);function he(e){return r.a.createElement(fe.a,Object.assign({elevation:6,variant:"filled"},e))}var ge=Object(k.a)((function(e){return{root:{width:"100%","& > * + *":{marginTop:e.spacing(2)}}}})),Ee=function(e){var t=e.messageId,a=ge();return r.a.createElement("div",{className:a.root},r.a.createElement(he,{severity:"error"},r.a.createElement(W.a,{id:t})))};Ee.defaultProps={messageId:"main.error"};var be=Object(k.a)((function(e){return Object(S.a)({backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff",padding:e.spacing(0,3)}})})),ve=function(){var e=be(),t=r.a.useState(!0),a=Object(x.a)(t,2),n=a[0],c=a[1];return r.a.createElement(de.a,{className:e.backdrop,open:n,onClick:function(){c(!1),window.close()}},r.a.createElement(Ee,null))},we=a(97),ye=a.n(we),Oe=function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(i.a)(t,[{key:"getParsedDate",value:function(){var e=this.props.date;return"string"!==typeof e?e:e.endsWith("+0000")?e:"".concat(e,"+0000")}},{key:"render",value:function(){var e=this.getParsedDate();return r.a.createElement(U.a,{title:r.a.createElement(ye.a,null,e.toString())},r.a.createElement(ye.a,{fromNow:!0},e.toString()))}}]),t}(n.PureComponent),je=Object(k.a)((function(e){return Object(S.a)({timestamp:{color:"#888"}})}));function ke(e){var t=e.comment,a=je();return r.a.createElement(pe.a,{container:!0,direction:"column",spacing:1},r.a.createElement(pe.a,{item:!0},r.a.createElement(pe.a,{container:!0,spacing:1,alignItems:"center"},r.a.createElement(pe.a,{item:!0},r.a.createElement(pe.a,{container:!0,direction:"column"},r.a.createElement(pe.a,{item:!0},r.a.createElement(h.a,{variant:"subtitle2"},t.authorName)),r.a.createElement(pe.a,{item:!0},r.a.createElement(h.a,{variant:"body2",className:a.timestamp},t.createdDate?r.a.createElement(Oe,{date:t.createdDate}):null)))))),r.a.createElement(pe.a,{item:!0},r.a.createElement(h.a,{variant:"subtitle1"},t.text)))}var xe=Object(k.a)((function(e){return Object(S.a)({table:{minWidth:550},heading:{fontSize:e.typography.pxToRem(15),fontWeight:e.typography.fontWeightRegular}})}));function Se(e){var t=e.uuid,a=xe(),c=function(e){var t=Object(n.useState)([]),a=Object(x.a)(t,2),r=a[0],c=a[1],o=Object(n.useState)(""),l=Object(x.a)(o,2),i=l[0],u=l[1];return Object(n.useEffect)((function(){Object(me.a)(ue.a.mark((function t(){var a;return ue.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a={method:"GET",headers:{"Content-Type":"application/json"}},t.next=3,fetch("".concat(se,"/picture/").concat(e,"/comments"),a).then((function(e){return e.json()})).then((function(e){return c(e)})).catch((function(e){return u(e)}));case 3:case"end":return t.stop()}}),t)})))()}),[e]),[r,i]}(t),o=Object(x.a)(c,2),l=o[0],i=o[1];return l.empty?null:i?r.a.createElement(ve,null):(null===l||void 0===l?void 0:l.content)?r.a.createElement(ee.a,null,r.a.createElement(Q.a,{expandIcon:r.a.createElement(X.a,null),"aria-controls":"panel2a-content",id:"panel2a-header"},r.a.createElement(h.a,{className:a.heading},r.a.createElement(W.a,{id:"watermark-found.comments"}))),r.a.createElement($.a,null,r.a.createElement(te.a,null,r.a.createElement(ae.a,{className:a.table,size:"small","aria-label":"a dense table"},r.a.createElement(ne.a,null,l.content.map((function(e){return r.a.createElement(re.a,{key:e.id},r.a.createElement(ce.a,{align:"left"},r.a.createElement(pe.a,{item:!0},r.a.createElement(ke,{comment:e}))))}))))))):null}var Ce=function(e){var t=e.url,a=e.hlt,n=r.a.useCallback((function(){chrome.tabs.create({url:t},(function(){chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT,{focused:!0})}))}),[t]);r.a.useEffect((function(){t&&a&&"true"===localStorage.getItem("openHlt")&&n()}),[a,n,t]);return r.a.createElement(b.a,{onClick:function(e){e.preventDefault(),n()},component:"button",variant:"body2"},t)},Ne=Object(k.a)((function(e){return Object(S.a)({heading:{fontSize:e.typography.pxToRem(15),fontWeight:e.typography.fontWeightRegular}})})),De=function(e){var t=e.info,a=Ne();return r.a.createElement(r.a.Fragment,null,r.a.createElement(ee.a,{defaultExpanded:!0},r.a.createElement(Q.a,{expandIcon:r.a.createElement(X.a,null),"aria-controls":"panel-metadata-content",id:"panel-metadata-header"},r.a.createElement(h.a,{className:a.heading},r.a.createElement(W.a,{id:"watermark-found.basic-info"}))),r.a.createElement($.a,null,r.a.createElement(te.a,null,r.a.createElement(ae.a,{size:"small","aria-label":"a dense table"},r.a.createElement(ne.a,null,r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.owner"})),r.a.createElement(ce.a,{align:"left"},t.pictureDTO.ownerName)),r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.author"})),r.a.createElement(ce.a,{align:"left"},t.pictureDTO.author)),r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.title"})),r.a.createElement(ce.a,{align:"left"},t.pictureDTO.title)),r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.url"})),r.a.createElement(ce.a,{align:"left"},r.a.createElement(Ce,{url:t.pictureDTO.url}))),r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.hlt"})),r.a.createElement(ce.a,{align:"left"},r.a.createElement(Ce,{url:t.pictureDTO.hlt,hlt:!0}))),r.a.createElement(re.a,null,r.a.createElement(ce.a,{component:"th",scope:"row"},r.a.createElement(W.a,{id:"watermark-found.tags"})),r.a.createElement(ce.a,{align:"left"},function(e){if(!e.tags)return null;e.tags.map((function(e){return r.a.createElement(le.a,{key:e,label:e})}))}(t.pictureDTO)))))))),r.a.createElement(Se,{uuid:t.pictureDTO.uuid}))},Te=Object(k.a)((function(e){return Object(S.a)({root:{width:"100%",display:"flex",flexDirection:"column"}})})),Ue=function(e){var t=e.info,a=Te();return r.a.createElement("div",{className:a.root},r.a.createElement(De,{info:t}),r.a.createElement(q,{uuid:t.pictureDTO.uuid}))},ze=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(h.a,{variant:"h6",component:"h5",gutterBottom:!0},r.a.createElement(W.a,{id:"watermark-not-found.message"})),r.a.createElement(q,{uuid:null}))},Ie=function(){var e=Object(me.a)(ue.a.mark((function e(t,a){var n,r,c;return ue.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pictureBase64:t,url:a})},e.next=3,fetch("".concat(se,"/picture/decode"),n);case 3:return r=e.sent,e.next=6,r.json();case 6:return c=e.sent,e.abrupt("return",{data:c,responseStatus:r.status});case 8:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),Pe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={data:{},responseStatus:null},a}return Object(s.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e,t=this,a=this.props,n=a.pictureUrl,r=a.pageUrl;(e=n,fetch(e).then((function(e){return e.blob()})).then((function(e){return new Promise((function(t,a){var n=new FileReader;n.onloadend=function(){return t(n.result)},n.onerror=a,n.readAsDataURL(e)}))}))).then((function(e){var a=function(e){var t=e.split(",",2);return t[1]||t[0]}(e);Ie(a,r).then((function(e){t.setState({data:e.data,responseStatus:e.responseStatus})}))}))}},{key:"render",value:function(){var e=this.state.responseStatus;return e?200===e?r.a.createElement(Ue,{info:this.state.data}):404===e?r.a.createElement(ze,null):422===e?r.a.createElement(Ee,{messageId:"lowResolution.error"}):r.a.createElement(ve,null):r.a.createElement(_.a,{variant:"rect",width:636,height:246,animation:"wave"})}}]),t}(r.a.Component),Re=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={hasError:!1},a}return Object(s.a)(t,e),Object(i.a)(t,[{key:"componentDidCatch",value:function(e,t){console.error("Error Boundary catch an error",e,t)}},{key:"render",value:function(){return this.state.hasError?r.a.createElement(ve,null):this.props.children}}],[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}]),t}(r.a.Component),We=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={pictureUrl:"",pageUrl:""},a}return Object(s.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this;chrome.runtime.sendMessage({appReady:!0},(function(t){var a=t.pictureUrl,n=t.pageUrl;e.setState({pictureUrl:a,pageUrl:n})}))}},{key:"render",value:function(){return this.state.pictureUrl||this.state.pageUrl?r.a.createElement(Re,null,r.a.createElement(K,{pictureUrl:this.state.pictureUrl}),r.a.createElement(Pe,{pictureUrl:this.state.pictureUrl,pageUrl:this.state.pageUrl})):r.a.createElement(_.a,{variant:"rect",width:600,height:300,animation:"wave"})}}]),t}(r.a.Component),Fe=a(115),Be=a(116),Ae=a(227),Me={pl:Fe,en:Be},He=navigator.language.split(/[-_]/)[0],Je=function(e){return r.a.createElement(Ae.a,{locale:He,messages:Me[He]},e.children)},Le=function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement(Je,null,r.a.createElement(L,null,r.a.createElement(We,null)))}}]),t}(n.PureComponent);o.a.render(r.a.createElement(Le,null),document.getElementById("root"))}},[[138,1,2]]]);
//# sourceMappingURL=main.19ad392a.chunk.js.map