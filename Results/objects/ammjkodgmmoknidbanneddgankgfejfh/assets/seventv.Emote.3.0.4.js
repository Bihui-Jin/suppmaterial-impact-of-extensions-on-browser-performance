var fe=Object.defineProperty;var _e=(e,t,s)=>t in e?fe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var X=(e,t,s)=>(_e(e,typeof t!="symbol"?t+"":t,s),s);import{a as S,l as P,ab as L,r as w,t as x,u as $,b as G,n as Y}from"./seventv.useUserAgent.3.0.4.js";import{U as R,aK as D,M as N,aI as he,e as U,w as pe,a as ve,l as f,f as _,j as p,x as b,z as ge,A as ye,_ as J,H as ae,I as be,u as V,k as re,y as O,F as W,q as le,aO as we,s as ke,aM as Ee,aP as xe}from"./seventv.useSettings.3.0.4.js";import{u as $e}from"./seventv.useWorker.3.0.4.js";import{a as ze,b as ce,i as de}from"./seventv.Transform.3.0.4.js";import{a as Se,u as Te}from"./seventv.seventv.user.gql.3.0.4.js";import{v as Ce}from"./seventv.index.esm.3.0.4.js";import{a as Me}from"./seventv.useChatEmotes.3.0.4.js";import{_ as Ae}from"./seventv.StarIcon.3.0.4.js";import{U as Pe}from"./seventv.UiFloating.3.0.4.js";function j(e,t,s){return Math.min(Math.max(e,s),t)}class je extends Error{constructor(t){super(`Failed to parse color: "${t}"`)}}var A=je;function K(e){if(typeof e!="string")throw new A(e);if(e.trim().toLowerCase()==="transparent")return[0,0,0,0];let t=e.trim();t=Oe.test(e)?Re(e):e;const s=Ne.exec(t);if(s){const d=Array.from(s).slice(1);return[...d.slice(0,3).map(o=>parseInt(B(o,2),16)),parseInt(B(d[3]||"f",2),16)/255]}const c=qe.exec(t);if(c){const d=Array.from(c).slice(1);return[...d.slice(0,3).map(o=>parseInt(o,16)),parseInt(d[3]||"ff",16)/255]}const a=Ue.exec(t);if(a){const d=Array.from(a).slice(1);return[...d.slice(0,3).map(o=>parseInt(o,10)),parseFloat(d[3]||"1")]}const u=Ie.exec(t);if(u){const[d,o,r,i]=Array.from(u).slice(1).map(parseFloat);if(j(0,100,o)!==o)throw new A(e);if(j(0,100,r)!==r)throw new A(e);return[...Fe(d,o,r),Number.isNaN(i)?1:i]}throw new A(e)}function Be(e){let t=5381,s=e.length;for(;s;)t=t*33^e.charCodeAt(--s);return(t>>>0)%2341}const ee=e=>parseInt(e.replace(/_/g,""),36),Le="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((e,t)=>{const s=ee(t.substring(0,3)),c=ee(t.substring(3)).toString(16);let a="";for(let u=0;u<6-c.length;u++)a+="0";return e[s]=`${a}${c}`,e},{});function Re(e){const t=e.toLowerCase().trim(),s=Le[Be(t)];if(!s)throw new A(e);return`#${s}`}const B=(e,t)=>Array.from(Array(t)).map(()=>e).join(""),Ne=new RegExp(`^#${B("([a-f0-9])",3)}([a-f0-9])?$`,"i"),qe=new RegExp(`^#${B("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),Ue=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${B(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),Ie=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,Oe=/^[a-z]+$/i,te=e=>Math.round(e*255),Fe=(e,t,s)=>{let c=s/100;if(t===0)return[c,c,c].map(te);const a=(e%360+360)%360/60,u=(1-Math.abs(2*c-1))*(t/100),d=u*(1-Math.abs(a%2-1));let o=0,r=0,i=0;a>=0&&a<1?(o=u,r=d):a>=1&&a<2?(o=d,r=u):a>=2&&a<3?(r=u,i=d):a>=3&&a<4?(r=d,i=u):a>=4&&a<5?(o=d,i=u):a>=5&&a<6&&(o=u,i=d);const n=c-u/2,m=o+n,h=r+n,v=i+n;return[m,h,v].map(te)};function He(e){const[t,s,c,a]=K(e).map((m,h)=>h===3?m:m/255),u=Math.max(t,s,c),d=Math.min(t,s,c),o=(u+d)/2;if(u===d)return[0,0,o,a];const r=u-d,i=o>.5?r/(2-u-d):r/(u+d);return[60*(t===u?(s-c)/r+(s<c?6:0):s===u?(c-t)/r+2:(t-s)/r+4),i,o,a]}function Ge(e,t,s,c){return`hsla(${(e%360).toFixed()}, ${j(0,100,t*100).toFixed()}%, ${j(0,100,s*100).toFixed()}%, ${parseFloat(j(0,1,c).toFixed(3))})`}function Ve(e,t){const[s,c,a,u]=He(e);return Ge(s,c,a-t,u)}function se(e){if(e==="transparent")return 0;function t(u){const d=u/255;return d<=.03928?d/12.92:Math.pow((d+.055)/1.055,2.4)}const[s,c,a]=K(e);return .2126*t(s)+.7152*t(c)+.0722*t(a)}function We(e,t){const s=se(e),c=se(t);return s>c?(s+.05)/(c+.05):(c+.05)/(s+.05)}const Qe={decorative:1.5,readable:3,aa:4.5,aaa:7};function oe(e,t="aa",s="#fff"){return We(e,s)<Qe[t]}const Q=e=>{const t=e>>>24&255,s=e>>>16&255,c=e>>>8&255,a=e&255;return`rgba(${t}, ${s}, ${c}, ${(a/255).toFixed(3)})`},Zt=e=>{if(e>1||e<0||isNaN(e))throw Error("alpha must be between 0 and 1");return Math.ceil(255*e).toString(16).toUpperCase()},F={0:{},1:{}};function Jt(e,t){let s=e.toLowerCase();const c=t?"#0f0e11":"#faf9fa";if(!oe(s,"aa",c))return s;const a=F[t][e];if(a)return a;const u=K(s).slice(0,3);if(t&&u.every(o=>o<36))return F[t][e]="#7a7a7a","#7a7a7a";let d=0;for(;oe(s,"aa",c)&&d<50;)s=Ve(s,.1*(t?-1:1)),d++;return F[t][e]=s,s}const l=S({cosmetics:{},sets:{},activeSets:new Set,entitlementBuffers:{"+":[],"-":[]},userBadges:{},userPaints:{},userEmoteSets:{},userEmoteMap:{},staticallyAssigned:{}});class Z extends Map{constructor(){super(...arguments);X(this,"providers",new Set)}hasProvider(s){return this.providers.has(s)}set(s,c){return c.provider&&this.providers.add(c.provider),super.set(s,c)}delete(s){const c=this.get(s);return c?(this.providers.delete(c.provider),super.delete(s)):!1}clear(){this.providers.clear(),super.clear()}}let q=null;R.ready().then(async()=>{const{target:e}=$e();D(()=>R.cosmetics.toArray(),o=>{l.cosmetics={};for(const r of o)l.cosmetics[r.id]||(l.cosmetics[r.id]=S(r),r.kind==="PAINT"&&ie(r))}),e.addEventListener("static_cosmetics_fetched",o=>{const{badges:r,paints:i}=o.detail;for(let n of r??[]){l.cosmetics[n.id]?n=l.cosmetics[n.id]:l.cosmetics[n.id]=S(n);for(const m of n.user_ids??[])!m||l.userBadges[m]&&l.userBadges[m].has(n.id)||(t({id:"",kind:"BADGE",ref_id:n.id,user_id:m},"+"),l.staticallyAssigned[m]={});n.user_ids&&(n.user_ids.length=0)}for(let n of i??[]){l.cosmetics[n.id]?n=l.cosmetics[n.id]:l.cosmetics[n.id]=S(n);for(const m of n.user_ids??[])!m||l.userPaints[m]||(t({id:"",kind:"PAINT",ref_id:n.id,user_id:m},"+"),l.staticallyAssigned[m]={});n.user_ids&&(n.user_ids.length=0),ie(n)}},{once:!0});function t(o,r){var i,n;if(l.staticallyAssigned[o.user_id]){for(const m of((i=l.userBadges[o.user_id])==null?void 0:i.values())??[])m.provider==="7TV"&&l.userBadges[o.user_id].delete(m.id);for(const m of((n=l.userPaints[o.user_id])==null?void 0:n.values())??[])l.userPaints[o.user_id].delete(m.id);delete l.staticallyAssigned[o.user_id]}l.entitlementBuffers[r].push(o),s()}function s(){q||(q=window.setTimeout(()=>{const o=l.entitlementBuffers["+"].splice(0,l.entitlementBuffers["+"].length),r=l.entitlementBuffers["-"].splice(0,l.entitlementBuffers["-"].length);for(const i of r){const n=a(i.kind);!n[i.user_id]||!n[i.user_id].has(i.ref_id)||n[i.user_id].delete(i.ref_id)}q=window.setTimeout(async()=>{for(const i of o){const n=a(i.kind);if(i.kind==="EMOTE_SET")n[i.user_id]||(n[i.user_id]=new Map),d(i.user_id,i.ref_id);else{n[i.user_id]||(n[i.user_id]=new Z);const m=n[i.user_id];c(i.ref_id).then(h=>{m.has(i.ref_id)||m.hasProvider(h.provider)||m.set(i.ref_id,h)})}}},10),q=null},10))}function c(o){const r=l.cosmetics[o];return r?Promise.resolve(r):N(()=>l.cosmetics[o]).not.toBeUndefined()}function a(o){return{BADGE:l.userBadges,PAINT:l.userPaints,EMOTE_SET:l.userEmoteSets}[o]}function u(o,r){const i=w(null);return l.userEmoteMap[o]={},D(()=>R.emoteSets.where("id").equals(r).first(),n=>{var m;i.value=n,l.sets[r]=i.value,l.userEmoteMap[o]=i.value.emotes.filter(h=>{var v;return h.data&&((v=h.data.state)==null?void 0:v.includes("PERSONAL"))}).reduce((h,v)=>({...h,[v.name]:v}),{}),(m=l.userEmoteSets[o])==null||m.set(r,i.value)},{until:N(l.userEmoteMap[o]).toBeUndefined().then(()=>!0)}),i}async function d(o,r){const i=u(o,r),n=await Promise.race([N(i).not.toBeNull(),N(he(1e4)).toBeTruthy().then(()=>null)]);if(!n){delete l.userEmoteMap[o],P.warn("<Cosmetics>","Emote Set could not be found",`id=${r}`);return}l.userEmoteSets[o]||(l.userEmoteSets[o]=new Map),l.userEmoteSets[o].has(r)||l.userEmoteSets[o].set(r,n),P.info("<Cosmetics>","Assigned Emote Set to user",`id=${r}`,`userID=${o}`)}e.addEventListener("entitlement_created",o=>{t(o.detail,"+")}),e.addEventListener("entitlement_deleted",o=>{t(o.detail,"-")}),R.entitlements.toArray().then(o=>{var r,i;for(const n of o){let m=!1;const h=!!l.staticallyAssigned[n.user_id];switch(n.kind){case"BADGE":if(!h&&((r=l.userBadges[n.user_id])!=null&&r.size))continue;t(n,"+"),m=!0;break;case"PAINT":if(!h&&((i=l.userPaints[n.user_id])!=null&&i.size))continue;t(n,"+"),m=!0;break;case"EMOTE_SET":d(n.user_id,n.ref_id);break}P.debug("<Cosmetics>","Assigned",o.length.toString(),"stored entitlements"),m&&(l.staticallyAssigned[n.user_id]={})}})});function Kt(e){return l.userBadges[e]||(l.userBadges[e]=new Z),l.userPaints[e]||(l.userPaints[e]=new Z),l.userEmoteMap[e]||(l.userEmoteMap[e]={}),S({paints:L(l.userPaints,e),badges:L(l.userBadges,e),emotes:L(l.userEmoteMap,e),emoteSets:L(l.userEmoteSets,e)})}const ne=new Set;let H=null;function Ze(){if(H)return H;const e=document.createElement("link");e.type="text/css",e.rel="stylesheet";const t=document.createElement("style");return t.id="seventv-paint-styles",document.head.appendChild(t),H=t.sheet??null}function ie(e){if(ne.has(e.id))return;const t=Ze();if(!t){P.error("<Cosmetics>","Could not find paint stylesheet");return}const s=`--seventv-paint-${e.id}`,c=e.data.function.toLowerCase().replace("_","-"),a=(()=>{const d=[];switch(e.data.function){case"LINEAR_GRADIENT":d.push(`${e.data.angle}deg`);break;case"RADIAL_GRADIENT":d.push(e.data.shape??"circle");break;case"URL":d.push(e.data.image_url??"");break}let o="";e.data.function!=="URL"&&(o=e.data.repeat?"repeating-":"");for(const r of e.data.stops){const i=Q(r.color);d.push(`${i} ${r.at*100}%`)}return`${o}${c}(${d.join(", ")})`})(),u=(()=>e.data.shadows?e.data.shadows.map(d=>`drop-shadow(${d.x_offset}px ${d.y_offset}px ${d.radius}px ${Q(d.color)})`).join(" "):"")();t.insertRule(` :root { ${s}-bg: ${a}; ${s}-filter: ${u}; } `,t.cssRules.length),ne.add(e.id)}function Je(){return"__APOLLO_CLIENT__"in window?__APOLLO_CLIENT__??null:null}const Ke=Se`
	query EmoteCard($emoteID: ID!, $octaneEnabled: Boolean!, $artistEnabled: Boolean!) {
		emote(id: $emoteID) {
			id
			type
			subscriptionTier @include(if: $octaneEnabled)
			token
			setID
			artist @include(if: $artistEnabled) {
				id
				login
				displayName
				profileImageURL(width: 70)
			}
			owner {
				id
				login
				displayName
				profileImageURL(width: 70)
				channel {
					id
					localEmoteSets {
						id
						emotes {
							id
							token
						}
					}
				}
				stream {
					id
					type
				}
				self {
					follower {
						followedAt
					}
					subscriptionBenefit {
						id
						tier
					}
				}
				subscriptionProducts {
					id
					displayName
					tier
					name
					url
					emotes {
						id
						token
					}
					priceInfo {
						id
						currency
						price
					}
				}
			}
			subscriptionProduct @skip(if: $octaneEnabled) {
				...subProduct
			}
			subscriptionSummaries @include(if: $octaneEnabled) {
				...subSummary
			}
			bitsBadgeTierSummary {
				threshold
				self {
					isUnlocked
					numberOfBitsUntilUnlock
				}
			}
			type
		}
	}
	fragment subSummary on SubscriptionSummary {
		id
		name
		offers {
			id
			currency
			exponent
			price
			promoDescription
		}
		emotes {
			id
			token
			subscriptionTier
		}
		url
		tier
		modifiers {
			code
			name
			subscriptionTier
		}
		self {
			subscribedTier
			cumulativeTenure
		}
	}
	fragment subProduct on SubscriptionProduct {
		id
		url
		price
		name
		tier
		interval {
			unit
		}
		state
		emotes {
			id
			setID
			token
		}
		offers {
			...subProductOfferFragment
		}
		emoteModifiers {
			...subscriptionProductEmoteModifier
		}
		self {
			cumulativeTenure: subscriptionTenure(tenureMethod: CUMULATIVE) {
				months
			}
			benefit {
				id
				tier
			}
		}
		owner {
			id
			displayName
			login
			subscriptionProducts {
				id
				tier
				url
				price
				emotes {
					id
					token
				}
				emoteModifiers {
					...subscriptionProductEmoteModifier
				}
			}
			stream {
				id
				type
			}
		}
	}
	fragment subProductOfferFragment on Offer {
		id
		tplr
		platform
		eligibility {
			benefitsStartAt
			isEligible
		}
		giftType
		listing {
			chargeModel {
				internal {
					previewPrice {
						id
						currency
						exponent
						price
						total
						discount {
							price
							total
						}
					}
					plan {
						interval {
							duration
							unit
						}
					}
				}
			}
		}
		promotion {
			id
			name
			promoDisplay {
				discountPercent
				discountType
			}
			priority
		}
		quantity {
			min
			max
		}
	}
	fragment subscriptionProductEmoteModifier on EmoteModifier {
		code
		name
	}
`,ue=e=>(ge("data-v-720bd323"),e=e(),ye(),e),Xe={class:"seventv-emote-card-container"},Ye={class:"seventv-emote-card"},De={class:"seventv-emote-card-image"},et=["srcset"],tt={class:"seventv-emote-card-display"},st={class:"seventv-emote-card-title"},ot={class:"seventv-emote-card-subtitle"},nt=["href"],it=["src"],at={key:1,class:"seventv-emote-card-data seventv-emote-card-actor"},rt=ue(()=>p("p",null,"Added by",-1)),lt={class:"seventv-emote-card-user"},ct=["src"],dt={key:2,class:"seventv-emote-card-data"},ut=ue(()=>p("p",null,"Added on",-1)),mt=U({__name:"EmoteCard",props:{emote:null,size:null},setup(e){var i;const t=e,s=w(((i=t.emote.data)==null?void 0:i.host)??null),c=w(""),a=S(r()),u=S(r()),d=w(""),o=w("");function r(){return{id:"",username:"",displayName:"",avatarURL:"",url:""}}return pe(async()=>{var n,m;if(t.emote.provider==="TWITCH"){const h=Je();if(!h)return;const v=await h.query({query:Ke,variables:{emoteID:t.emote.id,artistEnabled:!0,octaneEnabled:!0}}).catch(z=>P.error("failed to fetch emote card",z));if(!v)return;const{emote:g}=v.data;if(!g)return;const T=ze(g);s.value=T.host,g.owner&&(a.id=g.owner.id,a.username=g.owner.login,a.displayName=g.owner.displayName,a.avatarURL=g.owner.profileImageURL,a.url=`https://twitch.tv/${(n=g.owner)==null?void 0:n.login}`),d.value=((m=g.subscriptionTier)==null?void 0:m.split("_").join(" "))??g.type}else if(t.emote.provider==="7TV"){const{onResult:h}=Ce(Te,{id:t.emote.actor_id??""},()=>({enabled:!!t.emote.actor_id}));h(v=>{var g;(g=v.data)!=null&&g.user&&(u.id=v.data.user.id,u.username=v.data.user.username,u.displayName=v.data.user.display_name,u.avatarURL=v.data.user.avatar_url)}),o.value=new Date(t.emote.timestamp??0).toLocaleDateString()}}),ve(s,n=>{!n||!n.files.length||(c.value=ce(t.size[0],t.size[1],n,t.emote.provider))},{immediate:!0}),(n,m)=>(f(),_("main",Xe,[p("div",Ye,[p("div",De,[p("img",{srcset:c.value,style:{}},null,8,et)]),p("div",tt,[p("div",null,[p("h3",st,x(e.emote.name),1),p("p",ot,x(d.value),1),a.id?(f(),_("a",{key:0,class:"seventv-emote-card-user",href:a.url,target:"_blank"},[p("img",{src:a.avatarURL},null,8,it),p("span",null,x(a.displayName),1)],8,nt)):b("",!0),u.id?(f(),_("div",at,[rt,p("p",lt,[p("img",{src:u.avatarURL},null,8,ct),p("span",null,x(u.displayName),1)])])):b("",!0),o.value?(f(),_("div",dt,[ut,p("span",null,x(o.value),1)])):b("",!0)])])])]))}});const ft=J(mt,[["__scopeId","data-v-720bd323"]]),_t={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 36 36"},ht=["xlink:href"],me=U({__name:"SingleEmoji",props:{id:null},setup(e){return(t,s)=>(f(),_("svg",_t,[p("use",{"xlink:href":"#"+e.id},null,8,ht)]))}}),pt={key:0,ref:"tooltip",class:"seventv-tooltip-compact","tooltip-type":"emote"},vt={key:1,ref:"tooltip",class:"seventv-tooltip","tooltip-type":"emote"},gt=["src","srcset","alt"],yt={class:"details"},bt={class:"emote-name"},wt={key:2,class:"alias-label"},kt={key:3,class:"creator-label"},Et={class:"scope-labels"},xt={key:0,class:"label-global"},$t={key:1,class:"label-subscriber"},zt={key:2,class:"label-channel"},St={key:3,class:"label-sub-feature"},Tt={key:4,class:"label-sub-feature"},Ct={key:4},Mt={key:5,class:"divider"},At={key:6,class:"zero-width-label"},Pt=["srcset"],jt=U({__name:"EmoteTooltip",props:{emote:null,initSrc:null,overlaid:null,height:null,width:null},setup(e){var T,z,k;const t=e,s=ae("ui.compact_tooltips"),c=w("");t.emote&&t.emote.data&&t.emote.data.host.srcset&&be(()=>{c.value=ce(t.height,t.width,t.emote.data.host,t.emote.provider)},90);const a=w(t.overlaid??{}),u=w(Object.keys(a.value).length>0),d=`${t.width*3}px`,o=`${t.height*3}px`,r=t.emote.scope==="GLOBAL",i=t.emote.scope==="SUB",n=t.emote.scope==="CHANNEL",m=t.emote.scope==="PERSONAL",h=(t.emote.flags||0)!==0,v=w(null);if(t.emote.unicode){const{emojiByCode:y}=Me();v.value=y.get(t.emote.unicode)??null}const g=w("inherit");return(k=(z=(T=t.emote.data)==null?void 0:T.owner)==null?void 0:z.style)!=null&&k.color&&(g.value=Q(t.emote.data.owner.style.color)),(y,I)=>{var E,M;return $(s)?(f(),_("div",pt,[p("p",null,x(e.emote.name),1)],512)):(f(),_("div",vt,[e.emote.provider!=="EMOJI"?(f(),_("img",{key:0,ref:"imgRef",class:"tooltip-emote",src:e.initSrc,srcset:c.value,alt:e.emote.name,sizes:"auto",style:G({width:d,height:o})},null,12,gt)):(f(),V(me,{key:1,id:e.emote.id,class:"tooltip-emoji"},null,8,["id"])),p("div",yt,[p("h3",bt,x(e.emote.name),1),re(Ae,{class:"logo",provider:e.emote.provider},null,8,["provider"])]),e.emote.data&&e.emote.data.name!==e.emote.name?(f(),_("div",wt,[O(" aka "),p("span",null,x((E=e.emote.data)==null?void 0:E.name),1)])):b("",!0),(M=e.emote.data)!=null&&M.owner?(f(),_("div",kt,[O(" by "),p("span",{class:"creator-name",style:G({color:g.value})},x(e.emote.data.owner.display_name),5)])):b("",!0),p("div",Et,[r?(f(),_("div",xt,"Global Emote")):b("",!0),i?(f(),_("div",$t,"Subscriber Emote")):b("",!0),n?(f(),_("div",zt,"Channel Emote")):b("",!0),m?(f(),_("div",St,"Personal Emote")):b("",!0),h?(f(),_("div",Tt,"Zero-Width")):b("",!0)]),v.value?(f(),_("div",Ct,[p("div",null,"Emoji - "+x(v.value.group),1)])):b("",!0),u.value?(f(),_("div",Mt)):b("",!0),u.value?(f(),_("div",At,[(f(!0),_(W,null,le(a.value,C=>(f(),_("div",{key:C.id,class:"zero-width-emote"},[C.data?(f(),_("img",{key:0,class:"overlaid-emote-icon",srcset:C.data.host.srcset??$(de)(C.data.host,C.provider)},null,8,Pt)):b("",!0),O(" — "),p("span",null,x(C.name),1)]))),128))])):b("",!0)],512))}}});const Bt=J(jt,[["__scopeId","data-v-d564e136"]]),Lt=["srcset","alt"],Rt=["srcset","alt"],Nt=U({__name:"Emote",props:{emote:null,clickable:{type:Boolean},format:null,overlaid:null,unload:{type:Boolean,default:!1},scale:{default:1}},emits:["emote-click"],setup(e,{emit:t}){const s=e,c=ae("general.blur_unlisted_emotes"),a=w(),u=w(!1),d=w([0,0]),o=w(),r=w(""),i=w(0),n=w(0),m=k=>{if(!(k.target instanceof HTMLImageElement))return;const y=k.target;i.value=Math.round(y.naturalWidth/s.scale),n.value=Math.round(y.naturalHeight/s.scale),r.value=y.currentSrc,o.value=y};function h(k){var y;return(y=k.data)!=null&&y.host?s.scale!=1||!k.data.host.srcset?de(k.data.host,k.provider,void 0,2,s.scale):k.data.host.srcset:""}function v(k){s.clickable&&(u.value=!0,d.value=[k.clientX,k.clientY])}function g(){T(a.value)}const{show:T,hide:z}=we(Bt,{emote:s.emote,initSrc:r,overlaid:s.overlaid,width:i,height:n});return(k,y)=>{var I;return f(),_("div",{ref_key:"boxRef",ref:a,class:"seventv-emote-box"},[!e.emote.unicode&&e.emote.data&&e.emote.data.host?(f(),_("img",{key:0,class:Y(["seventv-chat-emote",{blur:$(c)&&((I=e.emote.data)==null?void 0:I.listed)===!1}]),srcset:e.unload?"":h(e.emote),alt:e.emote.name,loading:"lazy",decoding:"async",onLoad:m,onMouseenter:g,onMouseleave:y[0]||(y[0]=E=>$(z)()),onClick:y[1]||(y[1]=E=>[v(E),t("emote-click",E,e.emote)])},null,42,Lt)):!e.unload&&e.emote.id?(f(),V(me,{key:1,id:e.emote.id,ref_key:"boxRef",ref:a,alt:e.emote.name,class:"seventv-chat-emote seventv-emoji",style:G({width:`${e.scale*2}rem`,height:`${e.scale*2}rem`}),onMouseenter:g,onMouseleave:y[2]||(y[2]=E=>$(z)())},null,8,["id","alt","style"])):b("",!0),(f(!0),_(W,null,le(e.overlaid,E=>{var M;return f(),_(W,{key:E.id},[E.data&&E.data.host?(f(),_("img",{key:0,class:Y(["seventv-chat-emote zero-width-emote",{blur:$(c)&&((M=E.data)==null?void 0:M.listed)===!1}]),srcset:h(E),alt:" "+E.name},null,10,Rt)):b("",!0)],64)}),128)),u.value?(f(),V(Pe,{key:2,class:"seventv-emote-card-float",anchor:a.value,placement:"right-end",middleware:[$(Ee)({mainAxis:!0,crossAxis:!0}),$(xe)()],"emit-clickout":!0,onClickout:y[3]||(y[3]=E=>u.value=!1)},{default:ke(()=>[re(ft,{emote:e.emote,size:[i.value,n.value]},null,8,["emote","size"])]),_:1},8,["anchor","middleware"])):b("",!0)],512)}}});const Xt=J(Nt,[["__scopeId","data-v-db169cd2"]]);export{Q as D,Xt as E,Zt as S,Je as a,Jt as n,Kt as u};
