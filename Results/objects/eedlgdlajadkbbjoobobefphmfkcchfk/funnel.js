(function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s="04b8")})({"01b3":function(t,n,e){var r=e("8a5c"),o=e("71ce");t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,n=!1,e={};try{t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set,t.call(e,[]),n=e instanceof Array}catch(c){}return function(e,c){return r(e),o(c),n?t.call(e,c):e.__proto__=c,e}}():void 0)},"01c5":function(t,n,e){var r=e("ce11"),o=e("6d67"),c=e("ee8f"),i=e("aa21");t.exports=function(t,n){for(var e=o(n),a=i.f,u=c.f,f=0;f<e.length;f++){var s=e[f];r(t,s)||a(t,s,u(n,s))}}},"04b8":function(t,n,e){"use strict";e.r(n);e("0c26"),e("666b"),e("527a"),e("4586");var r=e("778b"),o=e("2942");const{storage:c}=o["a"],i=t=>new Promise((n,e)=>{o["a"].storage.sync.get(t,t=>{o["a"].runtime.lastError?e(o["a"].runtime.lastError):n(t)})}),a=t=>new Promise((n,e)=>{o["a"].storage.sync.set(t,t=>{o["a"].runtime.lastError?e(o["a"].runtime.lastError):n(t)})}),u={addon:r["j"],version:r["l"]},f=t=>{window.postMessage(JSON.stringify({...u,event:t}),"*")},s=()=>{const t=document.createElement("style");t.type="text/css",t.innerHTML="\n    .addon-hide {\n        display: none;\n    }\n\n    .addon-show {\n        display: initial;\n    }",document.head.appendChild(t)},l=()=>{"firefox"===r["j"]&&i("isConsecutiveSearch").then(({isConsecutiveSearch:t})=>{t||(f("firstSearch"),a({isConsecutiveSearch:!0}))})};window.addEventListener("load",()=>{s(),l(),f("version")})},"06f2":function(t,n,e){var r=e("ac21"),o=e("1da1"),c=e("ce11"),i=e("a356"),a=e("602b"),u=e("4f69"),f=o("wks"),s=r.Symbol,l=u?s:s&&s.withoutSetter||i;t.exports=function(t){return c(f,t)&&(a||"string"==typeof f[t])||(a&&c(s,t)?f[t]=s[t]:f[t]=l("Symbol."+t)),f[t]}},"0979":function(t,n,e){var r=e("a517");t.exports=function(t){return"object"===typeof t?null!==t:r(t)}},"0c26":function(t,n,e){"use strict";var r=e("ceca"),o=e("cb62"),c=e("4565"),i=e("4969"),a=e("b89c"),u="Array Iterator",f=i.set,s=i.getterFor(u);t.exports=a(Array,"Array",(function(t,n){f(this,{type:u,target:r(t),index:0,kind:n})}),(function(){var t=s(this),n=t.target,e=t.kind,r=t.index++;return!n||r>=n.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==e?{value:r,done:!1}:"values"==e?{value:n[r],done:!1}:{value:[r,n[r]],done:!1}}),"values"),c.Arguments=c.Array,o("keys"),o("values"),o("entries")},"0e4c":function(t,n,e){var r=e("ceca"),o=e("3069"),c=e("109d"),i=function(t){return function(n,e,i){var a,u=r(n),f=c(u),s=o(i,f);if(t&&e!=e){while(f>s)if(a=u[s++],a!=a)return!0}else for(;f>s;s++)if((t||s in u)&&u[s]===e)return t||s||0;return!t&&-1}};t.exports={includes:i(!0),indexOf:i(!1)}},"104c":function(t,n,e){var r=e("e2d3"),o=e("ce11"),c=Function.prototype,i=r&&Object.getOwnPropertyDescriptor,a=o(c,"name"),u=a&&"something"===function(){}.name,f=a&&(!r||r&&i(c,"name").configurable);t.exports={EXISTS:a,PROPER:u,CONFIGURABLE:f}},"104ce":function(t,n,e){var r=e("06f2"),o=r("toStringTag"),c={};c[o]="z",t.exports="[object z]"===String(c)},"109d":function(t,n,e){var r=e("a8e8");t.exports=function(t){return r(t.length)}},"14d3":function(t,n,e){var r=e("8a5c"),o=e("f28e");t.exports=function(t,n,e){var c,i;r(t);try{if(c=o(t,"return"),!c){if("throw"===n)throw e;return e}c=c.call(t)}catch(a){i=!0,c=a}if("throw"===n)throw e;if(i)throw c;return r(c),e}},1550:function(t,n){t.exports=!1},"1c86":function(t,n,e){var r=e("aa21").f,o=e("ce11"),c=e("06f2"),i=c("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},"1da1":function(t,n,e){var r=e("1550"),o=e("c50f");(t.exports=function(t,n){return o[t]||(o[t]=void 0!==n?n:{})})("versions",[]).push({version:"3.18.3",mode:r?"pure":"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})},"1e10":function(t,n,e){var r=e("74a5"),o=e("8a5c"),c=e("aa0d");t.exports=function(t,n){var e=arguments.length<2?c(t):n;if(r(e))return o(e.call(t));throw TypeError(String(t)+" is not iterable")}},"20fa":function(t,n,e){var r=e("e8fb");t.exports=/web0s(?!.*chrome)/i.test(r)},"210d":function(t,n,e){var r=e("3655"),o=e("a517"),c=e("4975"),i=e("7ca6"),a=e("cdc3"),u=[],f=i("Reflect","construct"),s=/^\s*(?:class|function)\b/,l=s.exec,p=!s.exec((function(){})),v=function(t){if(!o(t))return!1;try{return f(Object,u,t),!0}catch(n){return!1}},d=function(t){if(!o(t))return!1;switch(c(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}return p||!!l.call(s,a(t))};t.exports=!f||r((function(){var t;return v(v.call)||!v(Object)||!v((function(){t=!0}))||t}))?d:v},2127:function(t,n,e){"use strict";var r=e("7ca6"),o=e("aa21"),c=e("06f2"),i=e("e2d3"),a=c("species");t.exports=function(t){var n=r(t),e=o.f;i&&n&&!n[a]&&e(n,a,{configurable:!0,get:function(){return this}})}},"220f":function(t,n,e){var r=e("1da1"),o=e("a356"),c=r("keys");t.exports=function(t){return c[t]||(c[t]=o(t))}},"286a":function(t,n,e){var r,o,c,i,a=e("ac21"),u=e("a517"),f=e("3655"),s=e("7e19"),l=e("28ea"),p=e("ffe4"),v=e("be8d"),d=e("7843"),h=a.setImmediate,b=a.clearImmediate,y=a.process,g=a.MessageChannel,m=a.Dispatch,x=0,w={},O="onreadystatechange";try{r=a.location}catch(A){}var E=function(t){if(w.hasOwnProperty(t)){var n=w[t];delete w[t],n()}},S=function(t){return function(){E(t)}},j=function(t){E(t.data)},T=function(t){a.postMessage(String(t),r.protocol+"//"+r.host)};h&&b||(h=function(t){var n=[],e=arguments.length,r=1;while(e>r)n.push(arguments[r++]);return w[++x]=function(){(u(t)?t:Function(t)).apply(void 0,n)},o(x),x},b=function(t){delete w[t]},d?o=function(t){y.nextTick(S(t))}:m&&m.now?o=function(t){m.now(S(t))}:g&&!v?(c=new g,i=c.port2,c.port1.onmessage=j,o=s(i.postMessage,i,1)):a.addEventListener&&u(a.postMessage)&&!a.importScripts&&r&&"file:"!==r.protocol&&!f(T)?(o=T,a.addEventListener("message",j,!1)):o=O in p("script")?function(t){l.appendChild(p("script"))[O]=function(){l.removeChild(this),E(t)}}:function(t){setTimeout(S(t),0)}),t.exports={set:h,clear:b}},"28d3":function(t,n,e){var r=e("0979"),o=e("c672"),c=e("f28e"),i=e("48a9"),a=e("06f2"),u=a("toPrimitive");t.exports=function(t,n){if(!r(t)||o(t))return t;var e,a=c(t,u);if(a){if(void 0===n&&(n="default"),e=a.call(t,n),!r(e)||o(e))return e;throw TypeError("Can't convert object to primitive value")}return void 0===n&&(n="number"),i(t,n)}},"28ea":function(t,n,e){var r=e("7ca6");t.exports=r("document","documentElement")},2942:function(t,n,e){"use strict";const r=window.chrome||browser;n["a"]=r},"2a1f":function(t,n){t.exports={}},"2b25":function(t,n,e){"use strict";var r=e("e2d3"),o=e("3655"),c=e("cd92"),i=e("f72b"),a=e("fcab"),u=e("b871"),f=e("aea7"),s=Object.assign,l=Object.defineProperty;t.exports=!s||o((function(){if(r&&1!==s({b:1},s(l({},"a",{enumerable:!0,get:function(){l(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},n={},e=Symbol(),o="abcdefghijklmnopqrst";return t[e]=7,o.split("").forEach((function(t){n[t]=t})),7!=s({},t)[e]||c(s({},n)).join("")!=o}))?function(t,n){var e=u(t),o=arguments.length,s=1,l=i.f,p=a.f;while(o>s){var v,d=f(arguments[s++]),h=l?c(d).concat(l(d)):c(d),b=h.length,y=0;while(b>y)v=h[y++],r&&!p.call(d,v)||(e[v]=d[v])}return e}:s},"2b26":function(t,n,e){var r=e("3655");t.exports=!r((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},"2d49":function(t,n,e){var r=e("df72");t.exports=function(t,n,e){for(var o in n)r(t,o,n[o],e);return t}},"2f1f":function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},3069:function(t,n,e){var r=e("ce8f"),o=Math.max,c=Math.min;t.exports=function(t,n){var e=r(t);return e<0?o(e+n,0):c(e,n)}},3655:function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},"3ffe":function(t,n,e){var r=e("e2d3"),o=e("aa21"),c=e("2f1f");t.exports=r?function(t,n,e){return o.f(t,n,c(1,e))}:function(t,n,e){return t[n]=e,t}},"44be":function(t,n){t.exports=function(t,n,e){if(t instanceof n)return t;throw TypeError("Incorrect "+(e?e+" ":"")+"invocation")}},4565:function(t,n){t.exports={}},4586:function(t,n,e){"use strict";var r=e("7558"),o=e("1550"),c=e("ebfb"),i=e("3655"),a=e("7ca6"),u=e("a517"),f=e("af0c"),s=e("80b3"),l=e("df72"),p=!!c&&i((function(){c.prototype["finally"].call({then:function(){}},(function(){}))}));if(r({target:"Promise",proto:!0,real:!0,forced:p},{finally:function(t){var n=f(this,a("Promise")),e=u(t);return this.then(e?function(e){return s(n,t()).then((function(){return e}))}:t,e?function(e){return s(n,t()).then((function(){throw e}))}:t)}}),!o&&u(c)){var v=a("Promise").prototype["finally"];c.prototype["finally"]!==v&&l(c.prototype,"finally",v,{unsafe:!0})}},"47b7":function(t,n){t.exports=function(t){try{return{error:!1,value:t()}}catch(n){return{error:!0,value:n}}}},4833:function(t,n){const e="https://analytics.ecosia.org/analytics.js",r="https://www.ecosia.org",o="https://www.ecosia.org/search",c="https://ac.ecosia.org",i=r,a="https://info.ecosia.org",u="https://www.ecosia.org",f="https://api.ecosia.org/v1/features";t.exports={ANALYTICS_URL:e,BASE_URL:u,HOST:r,SEARCH_URL:o,AUTOCOMPLETE_URL:c,COOKIE_URL:i,INFO_URL:a,GOODALL_URL:f}},"48a9":function(t,n,e){var r=e("a517"),o=e("0979");t.exports=function(t,n){var e,c;if("string"===n&&r(e=t.toString)&&!o(c=e.call(t)))return c;if(r(e=t.valueOf)&&!o(c=e.call(t)))return c;if("string"!==n&&r(e=t.toString)&&!o(c=e.call(t)))return c;throw TypeError("Can't convert object to primitive value")}},4969:function(t,n,e){var r,o,c,i=e("cc5d"),a=e("ac21"),u=e("0979"),f=e("3ffe"),s=e("ce11"),l=e("c50f"),p=e("220f"),v=e("2a1f"),d="Object already initialized",h=a.WeakMap,b=function(t){return c(t)?o(t):r(t,{})},y=function(t){return function(n){var e;if(!u(n)||(e=o(n)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return e}};if(i||l.state){var g=l.state||(l.state=new h),m=g.get,x=g.has,w=g.set;r=function(t,n){if(x.call(g,t))throw new TypeError(d);return n.facade=t,w.call(g,t,n),n},o=function(t){return m.call(g,t)||{}},c=function(t){return x.call(g,t)}}else{var O=p("state");v[O]=!0,r=function(t,n){if(s(t,O))throw new TypeError(d);return n.facade=t,f(t,O,n),n},o=function(t){return s(t,O)?t[O]:{}},c=function(t){return s(t,O)}}t.exports={set:r,get:o,has:c,enforce:b,getterFor:y}},4975:function(t,n,e){var r=e("104ce"),o=e("a517"),c=e("c041"),i=e("06f2"),a=i("toStringTag"),u="Arguments"==c(function(){return arguments}()),f=function(t,n){try{return t[n]}catch(e){}};t.exports=r?c:function(t){var n,e,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=f(n=Object(t),a))?e:u?c(n):"Object"==(r=c(n))&&o(n.callee)?"Arguments":r}},"4ceb":function(t,n,e){"use strict";var r,o,c,i=e("3655"),a=e("a517"),u=e("ad01"),f=e("5d74"),s=e("df72"),l=e("06f2"),p=e("1550"),v=l("iterator"),d=!1;[].keys&&(c=[].keys(),"next"in c?(o=f(f(c)),o!==Object.prototype&&(r=o)):d=!0);var h=void 0==r||i((function(){var t={};return r[v].call(t)!==t}));h?r={}:p&&(r=u(r)),a(r[v])||s(r,v,(function(){return this})),t.exports={IteratorPrototype:r,BUGGY_SAFARI_ITERATORS:d}},"4f69":function(t,n,e){var r=e("602b");t.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},"527a":function(t,n,e){var r=e("7558"),o=e("2b25");r({target:"Object",stat:!0,forced:Object.assign!==o},{assign:o})},5929:function(t,n,e){var r=e("8a5c"),o=e("fab9"),c=e("109d"),i=e("7e19"),a=e("1e10"),u=e("aa0d"),f=e("14d3"),s=function(t,n){this.stopped=t,this.result=n};t.exports=function(t,n,e){var l,p,v,d,h,b,y,g=e&&e.that,m=!(!e||!e.AS_ENTRIES),x=!(!e||!e.IS_ITERATOR),w=!(!e||!e.INTERRUPTED),O=i(n,g,1+m+w),E=function(t){return l&&f(l,"normal",t),new s(!0,t)},S=function(t){return m?(r(t),w?O(t[0],t[1],E):O(t[0],t[1])):w?O(t,E):O(t)};if(x)l=t;else{if(p=u(t),!p)throw TypeError(String(t)+" is not iterable");if(o(p)){for(v=0,d=c(t);d>v;v++)if(h=S(t[v]),h&&h instanceof s)return h;return new s(!1)}l=a(t,p)}b=l.next;while(!(y=b.call(l)).done){try{h=S(y.value)}catch(j){f(l,"throw",j)}if("object"==typeof h&&h&&h instanceof s)return h}return new s(!1)}},"5af3":function(t,n){t.exports="object"==typeof window},"5bc2":function(t,n,e){var r=e("06f2"),o=r("iterator"),c=!1;try{var i=0,a={next:function(){return{done:!!i++}},return:function(){c=!0}};a[o]=function(){return this},Array.from(a,(function(){throw 2}))}catch(u){}t.exports=function(t,n){if(!n&&!c)return!1;var e=!1;try{var r={};r[o]=function(){return{next:function(){return{done:e=!0}}}},t(r)}catch(u){}return e}},"5d74":function(t,n,e){var r=e("ce11"),o=e("a517"),c=e("b871"),i=e("220f"),a=e("2b26"),u=i("IE_PROTO"),f=Object.prototype;t.exports=a?Object.getPrototypeOf:function(t){var n=c(t);if(r(n,u))return n[u];var e=n.constructor;return o(e)&&n instanceof e?e.prototype:n instanceof Object?f:null}},"5f61":function(t,n,e){var r=e("ac21");t.exports=function(t,n){var e=r.console;e&&e.error&&(1===arguments.length?e.error(t):e.error(t,n))}},"602b":function(t,n,e){var r=e("851a"),o=e("3655");t.exports=!!Object.getOwnPropertySymbols&&!o((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41}))},"666b":function(t,n,e){"use strict";var r,o,c,i,a=e("7558"),u=e("1550"),f=e("ac21"),s=e("7ca6"),l=e("ebfb"),p=e("df72"),v=e("2d49"),d=e("01b3"),h=e("1c86"),b=e("2127"),y=e("74a5"),g=e("a517"),m=e("0979"),x=e("44be"),w=e("cdc3"),O=e("5929"),E=e("5bc2"),S=e("af0c"),j=e("286a").set,T=e("f96e"),A=e("80b3"),_=e("5f61"),I=e("8092"),P=e("47b7"),R=e("4969"),C=e("f6e7"),L=e("06f2"),M=e("5af3"),N=e("7843"),D=e("851a"),F=L("species"),k="Promise",U=R.get,G=R.set,B=R.getterFor(k),H=l&&l.prototype,W=l,Y=H,z=f.TypeError,K=f.document,X=f.process,q=I.f,Q=q,J=!!(K&&K.createEvent&&f.dispatchEvent),V=g(f.PromiseRejectionEvent),$="unhandledrejection",Z="rejectionhandled",tt=0,nt=1,et=2,rt=1,ot=2,ct=!1,it=C(k,(function(){var t=w(W),n=t!==String(W);if(!n&&66===D)return!0;if(u&&!Y["finally"])return!0;if(D>=51&&/native code/.test(t))return!1;var e=new W((function(t){t(1)})),r=function(t){t((function(){}),(function(){}))},o=e.constructor={};return o[F]=r,ct=e.then((function(){}))instanceof r,!ct||!n&&M&&!V})),at=it||!E((function(t){W.all(t)["catch"]((function(){}))})),ut=function(t){var n;return!(!m(t)||!g(n=t.then))&&n},ft=function(t,n){if(!t.notified){t.notified=!0;var e=t.reactions;T((function(){var r=t.value,o=t.state==nt,c=0;while(e.length>c){var i,a,u,f=e[c++],s=o?f.ok:f.fail,l=f.resolve,p=f.reject,v=f.domain;try{s?(o||(t.rejection===ot&&vt(t),t.rejection=rt),!0===s?i=r:(v&&v.enter(),i=s(r),v&&(v.exit(),u=!0)),i===f.promise?p(z("Promise-chain cycle")):(a=ut(i))?a.call(i,l,p):l(i)):p(r)}catch(d){v&&!u&&v.exit(),p(d)}}t.reactions=[],t.notified=!1,n&&!t.rejection&&lt(t)}))}},st=function(t,n,e){var r,o;J?(r=K.createEvent("Event"),r.promise=n,r.reason=e,r.initEvent(t,!1,!0),f.dispatchEvent(r)):r={promise:n,reason:e},!V&&(o=f["on"+t])?o(r):t===$&&_("Unhandled promise rejection",e)},lt=function(t){j.call(f,(function(){var n,e=t.facade,r=t.value,o=pt(t);if(o&&(n=P((function(){N?X.emit("unhandledRejection",r,e):st($,e,r)})),t.rejection=N||pt(t)?ot:rt,n.error))throw n.value}))},pt=function(t){return t.rejection!==rt&&!t.parent},vt=function(t){j.call(f,(function(){var n=t.facade;N?X.emit("rejectionHandled",n):st(Z,n,t.value)}))},dt=function(t,n,e){return function(r){t(n,r,e)}},ht=function(t,n,e){t.done||(t.done=!0,e&&(t=e),t.value=n,t.state=et,ft(t,!0))},bt=function(t,n,e){if(!t.done){t.done=!0,e&&(t=e);try{if(t.facade===n)throw z("Promise can't be resolved itself");var r=ut(n);r?T((function(){var e={done:!1};try{r.call(n,dt(bt,e,t),dt(ht,e,t))}catch(o){ht(e,o,t)}})):(t.value=n,t.state=nt,ft(t,!1))}catch(o){ht({done:!1},o,t)}}};if(it&&(W=function(t){x(this,W,k),y(t),r.call(this);var n=U(this);try{t(dt(bt,n),dt(ht,n))}catch(e){ht(n,e)}},Y=W.prototype,r=function(t){G(this,{type:k,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:tt,value:void 0})},r.prototype=v(Y,{then:function(t,n){var e=B(this),r=q(S(this,W));return r.ok=!g(t)||t,r.fail=g(n)&&n,r.domain=N?X.domain:void 0,e.parent=!0,e.reactions.push(r),e.state!=tt&&ft(e,!1),r.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r,n=U(t);this.promise=t,this.resolve=dt(bt,n),this.reject=dt(ht,n)},I.f=q=function(t){return t===W||t===c?new o(t):Q(t)},!u&&g(l)&&H!==Object.prototype)){i=H.then,ct||(p(H,"then",(function(t,n){var e=this;return new W((function(t,n){i.call(e,t,n)})).then(t,n)}),{unsafe:!0}),p(H,"catch",Y["catch"],{unsafe:!0}));try{delete H.constructor}catch(yt){}d&&d(H,Y)}a({global:!0,wrap:!0,forced:it},{Promise:W}),h(W,k,!1,!0),b(k),c=s(k),a({target:k,stat:!0,forced:it},{reject:function(t){var n=q(this);return n.reject.call(void 0,t),n.promise}}),a({target:k,stat:!0,forced:u||it},{resolve:function(t){return A(u&&this===c?W:this,t)}}),a({target:k,stat:!0,forced:at},{all:function(t){var n=this,e=q(n),r=e.resolve,o=e.reject,c=P((function(){var e=y(n.resolve),c=[],i=0,a=1;O(t,(function(t){var u=i++,f=!1;c.push(void 0),a++,e.call(n,t).then((function(t){f||(f=!0,c[u]=t,--a||r(c))}),o)})),--a||r(c)}));return c.error&&o(c.value),e.promise},race:function(t){var n=this,e=q(n),r=e.reject,o=P((function(){var o=y(n.resolve);O(t,(function(t){o.call(n,t).then(e.resolve,r)}))}));return o.error&&r(o.value),e.promise}})},"6d67":function(t,n,e){var r=e("7ca6"),o=e("7c44"),c=e("f72b"),i=e("8a5c");t.exports=r("Reflect","ownKeys")||function(t){var n=o.f(i(t)),e=c.f;return e?n.concat(e(t)):n}},"71cb":function(t,n,e){var r=e("210d"),o=e("ae11");t.exports=function(t){if(r(t))return t;throw TypeError(o(t)+" is not a constructor")}},"71ce":function(t,n,e){var r=e("a517");t.exports=function(t){if("object"===typeof t||r(t))return t;throw TypeError("Can't set "+String(t)+" as a prototype")}},"74a5":function(t,n,e){var r=e("a517"),o=e("ae11");t.exports=function(t){if(r(t))return t;throw TypeError(o(t)+" is not a function")}},7558:function(t,n,e){var r=e("ac21"),o=e("ee8f").f,c=e("3ffe"),i=e("df72"),a=e("ca7b"),u=e("01c5"),f=e("f6e7");t.exports=function(t,n){var e,s,l,p,v,d,h=t.target,b=t.global,y=t.stat;if(s=b?r:y?r[h]||a(h,{}):(r[h]||{}).prototype,s)for(l in n){if(v=n[l],t.noTargetGet?(d=o(s,l),p=d&&d.value):p=s[l],e=f(b?l:h+(y?".":"#")+l,t.forced),!e&&void 0!==p){if(typeof v===typeof p)continue;u(v,p)}(t.sham||p&&p.sham)&&c(v,"sham",!0),i(s,l,v,t)}}},"778b":function(t,n,e){"use strict";e.d(n,"l",(function(){return a})),e.d(n,"j",(function(){return u})),e.d(n,"c",(function(){return f})),e.d(n,"h",(function(){return s})),e.d(n,"e",(function(){return l})),e.d(n,"k",(function(){return p}));var r=e("ee5e"),o=e("2942"),c=e("4833");e.d(n,"a",(function(){return c["ANALYTICS_URL"]})),e.d(n,"g",(function(){return c["HOST"]})),e.d(n,"i",(function(){return c["SEARCH_URL"]})),e.d(n,"b",(function(){return c["AUTOCOMPLETE_URL"]})),e.d(n,"d",(function(){return c["COOKIE_URL"]})),e.d(n,"f",(function(){return c["GOODALL_URL"]}));const{runtime:i}=o["a"],{version:a,target:u}=i.getManifest(),f=r["MAIN"],s="removedSites",l="experimentsCache",p=7},7843:function(t,n,e){var r=e("c041"),o=e("ac21");t.exports="process"==r(o.process)},"7c44":function(t,n,e){var r=e("d48a"),o=e("8cf7"),c=o.concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,c)}},"7ca6":function(t,n,e){var r=e("ac21"),o=e("a517"),c=function(t){return o(t)?t:void 0};t.exports=function(t,n){return arguments.length<2?c(r[t]):r[t]&&r[t][n]}},"7d15":function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(r){"object"===typeof window&&(e=window)}t.exports=e},"7e19":function(t,n,e){var r=e("74a5");t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 0:return function(){return t.call(n)};case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},8092:function(t,n,e){"use strict";var r=e("74a5"),o=function(t){var n,e;this.promise=new t((function(t,r){if(void 0!==n||void 0!==e)throw TypeError("Bad Promise constructor");n=t,e=r})),this.resolve=r(n),this.reject=r(e)};t.exports.f=function(t){return new o(t)}},"80b3":function(t,n,e){var r=e("8a5c"),o=e("0979"),c=e("8092");t.exports=function(t,n){if(r(t),o(n)&&n.constructor===t)return n;var e=c.f(t),i=e.resolve;return i(n),e.promise}},"851a":function(t,n,e){var r,o,c=e("ac21"),i=e("e8fb"),a=c.process,u=c.Deno,f=a&&a.versions||u&&u.version,s=f&&f.v8;s?(r=s.split("."),o=r[0]<4?1:r[0]+r[1]):i&&(r=i.match(/Edge\/(\d+)/),(!r||r[1]>=74)&&(r=i.match(/Chrome\/(\d+)/),r&&(o=r[1]))),t.exports=o&&+o},"8a5c":function(t,n,e){var r=e("0979");t.exports=function(t){if(r(t))return t;throw TypeError(String(t)+" is not an object")}},"8cf7":function(t,n){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},"92f9":function(t,n,e){var r=e("28d3"),o=e("c672");t.exports=function(t){var n=r(t,"string");return o(n)?n:String(n)}},a10a:function(t,n,e){"use strict";var r=e("4ceb").IteratorPrototype,o=e("ad01"),c=e("2f1f"),i=e("1c86"),a=e("4565"),u=function(){return this};t.exports=function(t,n,e){var f=n+" Iterator";return t.prototype=o(r,{next:c(1,e)}),i(t,f,!1,!0),a[f]=u,t}},a356:function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},a517:function(t,n){t.exports=function(t){return"function"===typeof t}},a678:function(t,n,e){var r=e("e2d3"),o=e("3655"),c=e("ffe4");t.exports=!r&&!o((function(){return 7!=Object.defineProperty(c("div"),"a",{get:function(){return 7}}).a}))},a8e8:function(t,n,e){var r=e("ce8f"),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},aa0d:function(t,n,e){var r=e("4975"),o=e("f28e"),c=e("4565"),i=e("06f2"),a=i("iterator");t.exports=function(t){if(void 0!=t)return o(t,a)||o(t,"@@iterator")||c[r(t)]}},aa21:function(t,n,e){var r=e("e2d3"),o=e("a678"),c=e("8a5c"),i=e("92f9"),a=Object.defineProperty;n.f=r?a:function(t,n,e){if(c(t),n=i(n),c(e),o)try{return a(t,n,e)}catch(r){}if("get"in e||"set"in e)throw TypeError("Accessors not supported");return"value"in e&&(t[n]=e.value),t}},ac21:function(t,n,e){(function(n){var e=function(t){return t&&t.Math==Math&&t};t.exports=e("object"==typeof globalThis&&globalThis)||e("object"==typeof window&&window)||e("object"==typeof self&&self)||e("object"==typeof n&&n)||function(){return this}()||Function("return this")()}).call(this,e("7d15"))},ad01:function(t,n,e){var r,o=e("8a5c"),c=e("ca59"),i=e("8cf7"),a=e("2a1f"),u=e("28ea"),f=e("ffe4"),s=e("220f"),l=">",p="<",v="prototype",d="script",h=s("IE_PROTO"),b=function(){},y=function(t){return p+d+l+t+p+"/"+d+l},g=function(t){t.write(y("")),t.close();var n=t.parentWindow.Object;return t=null,n},m=function(){var t,n=f("iframe"),e="java"+d+":";return n.style.display="none",u.appendChild(n),n.src=String(e),t=n.contentWindow.document,t.open(),t.write(y("document.F=Object")),t.close(),t.F},x=function(){try{r=new ActiveXObject("htmlfile")}catch(n){}x="undefined"!=typeof document?document.domain&&r?g(r):m():g(r);var t=i.length;while(t--)delete x[v][i[t]];return x()};a[h]=!0,t.exports=Object.create||function(t,n){var e;return null!==t?(b[v]=o(t),e=new b,b[v]=null,e[h]=t):e=x(),void 0===n?e:c(e,n)}},ae11:function(t,n){t.exports=function(t){try{return String(t)}catch(n){return"Object"}}},aea7:function(t,n,e){var r=e("3655"),o=e("c041"),c="".split;t.exports=r((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?c.call(t,""):Object(t)}:Object},af0c:function(t,n,e){var r=e("8a5c"),o=e("71cb"),c=e("06f2"),i=c("species");t.exports=function(t,n){var e,c=r(t).constructor;return void 0===c||void 0==(e=r(c)[i])?n:o(e)}},b1ec:function(t,n,e){var r=e("e8fb"),o=e("ac21");t.exports=/ipad|iphone|ipod/i.test(r)&&void 0!==o.Pebble},b871:function(t,n,e){var r=e("de90");t.exports=function(t){return Object(r(t))}},b89c:function(t,n,e){"use strict";var r=e("7558"),o=e("1550"),c=e("104c"),i=e("a517"),a=e("a10a"),u=e("5d74"),f=e("01b3"),s=e("1c86"),l=e("3ffe"),p=e("df72"),v=e("06f2"),d=e("4565"),h=e("4ceb"),b=c.PROPER,y=c.CONFIGURABLE,g=h.IteratorPrototype,m=h.BUGGY_SAFARI_ITERATORS,x=v("iterator"),w="keys",O="values",E="entries",S=function(){return this};t.exports=function(t,n,e,c,v,h,j){a(e,n,c);var T,A,_,I=function(t){if(t===v&&M)return M;if(!m&&t in C)return C[t];switch(t){case w:return function(){return new e(this,t)};case O:return function(){return new e(this,t)};case E:return function(){return new e(this,t)}}return function(){return new e(this)}},P=n+" Iterator",R=!1,C=t.prototype,L=C[x]||C["@@iterator"]||v&&C[v],M=!m&&L||I(v),N="Array"==n&&C.entries||L;if(N&&(T=u(N.call(new t)),T!==Object.prototype&&T.next&&(o||u(T)===g||(f?f(T,g):i(T[x])||p(T,x,S)),s(T,P,!0,!0),o&&(d[P]=S))),b&&v==O&&L&&L.name!==O&&(!o&&y?l(C,"name",O):(R=!0,M=function(){return L.call(this)})),v)if(A={values:I(O),keys:h?M:I(w),entries:I(E)},j)for(_ in A)(m||R||!(_ in C))&&p(C,_,A[_]);else r({target:n,proto:!0,forced:m||R},A);return o&&!j||C[x]===M||p(C,x,M,{name:v}),d[n]=M,A}},be8d:function(t,n,e){var r=e("e8fb");t.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(r)},c041:function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},c50f:function(t,n,e){var r=e("ac21"),o=e("ca7b"),c="__core-js_shared__",i=r[c]||o(c,{});t.exports=i},c672:function(t,n,e){var r=e("a517"),o=e("7ca6"),c=e("4f69");t.exports=c?function(t){return"symbol"==typeof t}:function(t){var n=o("Symbol");return r(n)&&Object(t)instanceof n}},ca59:function(t,n,e){var r=e("e2d3"),o=e("aa21"),c=e("8a5c"),i=e("cd92");t.exports=r?Object.defineProperties:function(t,n){c(t);var e,r=i(n),a=r.length,u=0;while(a>u)o.f(t,e=r[u++],n[e]);return t}},ca7b:function(t,n,e){var r=e("ac21");t.exports=function(t,n){try{Object.defineProperty(r,t,{value:n,configurable:!0,writable:!0})}catch(e){r[t]=n}return n}},cb62:function(t,n,e){var r=e("06f2"),o=e("ad01"),c=e("aa21"),i=r("unscopables"),a=Array.prototype;void 0==a[i]&&c.f(a,i,{configurable:!0,value:o(null)}),t.exports=function(t){a[i][t]=!0}},cc5d:function(t,n,e){var r=e("ac21"),o=e("a517"),c=e("cdc3"),i=r.WeakMap;t.exports=o(i)&&/native code/.test(c(i))},cd92:function(t,n,e){var r=e("d48a"),o=e("8cf7");t.exports=Object.keys||function(t){return r(t,o)}},cdc3:function(t,n,e){var r=e("a517"),o=e("c50f"),c=Function.toString;r(o.inspectSource)||(o.inspectSource=function(t){return c.call(t)}),t.exports=o.inspectSource},ce11:function(t,n,e){var r=e("b871"),o={}.hasOwnProperty;t.exports=Object.hasOwn||function(t,n){return o.call(r(t),n)}},ce8f:function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){var n=+t;return n!==n||0===n?0:(n>0?r:e)(n)}},ceca:function(t,n,e){var r=e("aea7"),o=e("de90");t.exports=function(t){return r(o(t))}},d48a:function(t,n,e){var r=e("ce11"),o=e("ceca"),c=e("0e4c").indexOf,i=e("2a1f");t.exports=function(t,n){var e,a=o(t),u=0,f=[];for(e in a)!r(i,e)&&r(a,e)&&f.push(e);while(n.length>u)r(a,e=n[u++])&&(~c(f,e)||f.push(e));return f}},de90:function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on "+t);return t}},df72:function(t,n,e){var r=e("ac21"),o=e("a517"),c=e("ce11"),i=e("3ffe"),a=e("ca7b"),u=e("cdc3"),f=e("4969"),s=e("104c").CONFIGURABLE,l=f.get,p=f.enforce,v=String(String).split("String");(t.exports=function(t,n,e,u){var f,l=!!u&&!!u.unsafe,d=!!u&&!!u.enumerable,h=!!u&&!!u.noTargetGet,b=u&&void 0!==u.name?u.name:n;o(e)&&("Symbol("===String(b).slice(0,7)&&(b="["+String(b).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!c(e,"name")||s&&e.name!==b)&&i(e,"name",b),f=p(e),f.source||(f.source=v.join("string"==typeof b?b:""))),t!==r?(l?!h&&t[n]&&(d=!0):delete t[n],d?t[n]=e:i(t,n,e)):d?t[n]=e:a(n,e)})(Function.prototype,"toString",(function(){return o(this)&&l(this).source||u(this)}))},e2d3:function(t,n,e){var r=e("3655");t.exports=!r((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},e8fb:function(t,n,e){var r=e("7ca6");t.exports=r("navigator","userAgent")||""},ebfb:function(t,n,e){var r=e("ac21");t.exports=r.Promise},ee5e:function(t,n){t.exports={EXPERIMENT_ENTITY_ID:"ECEI",LAST_DISCARDED_NOTIFICATION:"lastDiscardedNotification",LAST_READ_NOTIFICATION:"lastReadNotificationTimestamp",MAIN:"ECFG",HEIMDALL:"ECHA",LOGIN_BETA:"ECBT",INSTALL_DISMISSED:"installMg-s",TYPETAG_LEGACY:"__tt",HEADER_INSTALL_CTA_DISMISSED:"serpCtaDismiss",SEARCHES_AFTER_INSTALL:"ECSAI",CONSENT:"ECCC",WEB_CANARY:"ECWC",ECOSIA_EXPERIMENT_DATA:"ECED",REQUEST_ID:"ECRQ",APP_SNOWPLOW_ID:"app_sp"}},ee8f:function(t,n,e){var r=e("e2d3"),o=e("fcab"),c=e("2f1f"),i=e("ceca"),a=e("92f9"),u=e("ce11"),f=e("a678"),s=Object.getOwnPropertyDescriptor;n.f=r?s:function(t,n){if(t=i(t),n=a(n),f)try{return s(t,n)}catch(e){}if(u(t,n))return c(!o.f.call(t,n),t[n])}},f28e:function(t,n,e){var r=e("74a5");t.exports=function(t,n){var e=t[n];return null==e?void 0:r(e)}},f6e7:function(t,n,e){var r=e("3655"),o=e("a517"),c=/#|\.prototype\./,i=function(t,n){var e=u[a(t)];return e==s||e!=f&&(o(n)?r(n):!!n)},a=i.normalize=function(t){return String(t).replace(c,".").toLowerCase()},u=i.data={},f=i.NATIVE="N",s=i.POLYFILL="P";t.exports=i},f72b:function(t,n){n.f=Object.getOwnPropertySymbols},f96e:function(t,n,e){var r,o,c,i,a,u,f,s,l=e("ac21"),p=e("ee8f").f,v=e("286a").set,d=e("be8d"),h=e("b1ec"),b=e("20fa"),y=e("7843"),g=l.MutationObserver||l.WebKitMutationObserver,m=l.document,x=l.process,w=l.Promise,O=p(l,"queueMicrotask"),E=O&&O.value;E||(r=function(){var t,n;y&&(t=x.domain)&&t.exit();while(o){n=o.fn,o=o.next;try{n()}catch(e){throw o?i():c=void 0,e}}c=void 0,t&&t.enter()},d||y||b||!g||!m?!h&&w&&w.resolve?(f=w.resolve(void 0),f.constructor=w,s=f.then,i=function(){s.call(f,r)}):i=y?function(){x.nextTick(r)}:function(){v.call(l,r)}:(a=!0,u=m.createTextNode(""),new g(r).observe(u,{characterData:!0}),i=function(){u.data=a=!a})),t.exports=E||function(t){var n={fn:t,next:void 0};c&&(c.next=n),o||(o=n,i()),c=n}},fab9:function(t,n,e){var r=e("06f2"),o=e("4565"),c=r("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||i[c]===t)}},fcab:function(t,n,e){"use strict";var r={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,c=o&&!r.call({1:2},1);n.f=c?function(t){var n=o(this,t);return!!n&&n.enumerable}:r},ffe4:function(t,n,e){var r=e("ac21"),o=e("0979"),c=r.document,i=o(c)&&o(c.createElement);t.exports=function(t){return i?c.createElement(t):{}}}});
//# sourceMappingURL=funnel.js.map