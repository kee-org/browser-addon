(function(){"use strict";var br=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Me={},kr={get exports(){return Me},set exports(t){Me=t}};(function(t,e){(function(i,o){o(t)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:br,function(i){var o,a;if(!((a=(o=globalThis.chrome)==null?void 0:o.runtime)!=null&&a.id))throw new Error("This script should only be loaded in a browser extension.");if(typeof globalThis.browser>"u"||Object.getPrototypeOf(globalThis.browser)!==Object.prototype){const n="The message port closed before a response was received.",s=r=>{const c={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(c).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class l extends WeakMap{constructor(f,w=void 0){super(w),this.createItem=f}get(f){return this.has(f)||this.set(f,this.createItem(f)),super.get(f)}}const d=M=>M&&typeof M=="object"&&typeof M.then=="function",u=(M,f)=>(...w)=>{r.runtime.lastError?M.reject(new Error(r.runtime.lastError.message)):f.singleCallbackArg||w.length<=1&&f.singleCallbackArg!==!1?M.resolve(w[0]):M.resolve(w)},p=M=>M==1?"argument":"arguments",g=(M,f)=>function(b,...z){if(z.length<f.minArgs)throw new Error(`Expected at least ${f.minArgs} ${p(f.minArgs)} for ${M}(), got ${z.length}`);if(z.length>f.maxArgs)throw new Error(`Expected at most ${f.maxArgs} ${p(f.maxArgs)} for ${M}(), got ${z.length}`);return new Promise((V,le)=>{if(f.fallbackToNoCallback)try{b[M](...z,u({resolve:V,reject:le},f))}catch(U){console.warn(`${M} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,U),b[M](...z),f.fallbackToNoCallback=!1,f.noCallback=!0,V()}else f.noCallback?(b[M](...z),V()):b[M](...z,u({resolve:V,reject:le},f))})},v=(M,f,w)=>new Proxy(f,{apply(b,z,V){return w.call(z,M,...V)}});let y=Function.call.bind(Object.prototype.hasOwnProperty);const A=(M,f={},w={})=>{let b=Object.create(null),z={has(le,U){return U in M||U in b},get(le,U,Q){if(U in b)return b[U];if(!(U in M))return;let _=M[U];if(typeof _=="function")if(typeof f[U]=="function")_=v(M,M[U],f[U]);else if(y(w,U)){let Y=g(U,w[U]);_=v(M,M[U],Y)}else _=_.bind(M);else if(typeof _=="object"&&_!==null&&(y(f,U)||y(w,U)))_=A(_,f[U],w[U]);else if(y(w,"*"))_=A(_,f[U],w["*"]);else return Object.defineProperty(b,U,{configurable:!0,enumerable:!0,get(){return M[U]},set(Y){M[U]=Y}}),_;return b[U]=_,_},set(le,U,Q,_){return U in b?b[U]=Q:M[U]=Q,!0},defineProperty(le,U,Q){return Reflect.defineProperty(b,U,Q)},deleteProperty(le,U){return Reflect.deleteProperty(b,U)}},V=Object.create(M);return new Proxy(V,z)},P=M=>({addListener(f,w,...b){f.addListener(M.get(w),...b)},hasListener(f,w){return f.hasListener(M.get(w))},removeListener(f,w){f.removeListener(M.get(w))}}),B=new l(M=>typeof M!="function"?M:function(w){const b=A(w,{},{getContent:{minArgs:0,maxArgs:0}});M(b)}),H=new l(M=>typeof M!="function"?M:function(w,b,z){let V=!1,le,U=new Promise(K=>{le=function(te){V=!0,K(te)}}),Q;try{Q=M(w,b,le)}catch(K){Q=Promise.reject(K)}const _=Q!==!0&&d(Q);if(Q!==!0&&!_&&!V)return!1;const Y=K=>{K.then(te=>{z(te)},te=>{let we;te&&(te instanceof Error||typeof te.message=="string")?we=te.message:we="An unexpected error occurred",z({__mozWebExtensionPolyfillReject__:!0,message:we})}).catch(te=>{console.error("Failed to send onMessage rejected reply",te)})};return Y(_?Q:U),!0}),F=({reject:M,resolve:f},w)=>{r.runtime.lastError?r.runtime.lastError.message===n?f():M(new Error(r.runtime.lastError.message)):w&&w.__mozWebExtensionPolyfillReject__?M(new Error(w.message)):f(w)},X=(M,f,w,...b)=>{if(b.length<f.minArgs)throw new Error(`Expected at least ${f.minArgs} ${p(f.minArgs)} for ${M}(), got ${b.length}`);if(b.length>f.maxArgs)throw new Error(`Expected at most ${f.maxArgs} ${p(f.maxArgs)} for ${M}(), got ${b.length}`);return new Promise((z,V)=>{const le=F.bind(null,{resolve:z,reject:V});b.push(le),w.sendMessage(...b)})},se={devtools:{network:{onRequestFinished:P(B)}},runtime:{onMessage:P(H),onMessageExternal:P(H),sendMessage:X.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:X.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},D={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return c.privacy={network:{"*":D},services:{"*":D},websites:{"*":D}},A(r,se,c)};i.exports=s(chrome)}else i.exports=globalThis.browser})})(kr);class Va{}class Ae{}class $a{}class yr{}const Li=new $a;Li.pageRegex=new Ae,Li.pageRegex["^.*$"]={config:{preventSaveNotification:!1,listMatchingCaseSensitive:!1,blackList:{form:{names:["search"],ids:["search"]},fields:{names:["search","q","query"],ids:["search","q"]}},whiteList:{form:{names:["login"],ids:["login"]},fields:{names:["username","j_username","user_name","user","user-name","login","vb_login_username","name","user name","user id","user-id","userid","email","e-mail","id","form_loginname","wpname","mail","loginid","login id","login_name","openid_identifier","authentication_email","openid","auth_email","auth_id","authentication_identifier","authentication_id","customer_number","customernumber","onlineid"],ids:["username","j_username","user_name","user","user-name","login","vb_login_username","name","user-id","userid","email","e-mail","id","form_loginname","wpname","mail","loginid","login_name","openid_identifier","authentication_email","openid","auth_email","auth_id","authentication_identifier","authentication_id","customer_number","customernumber","onlineid"]}},preferredEntryUuid:null},matchWeight:0,source:"Default"};class Wa{migrateToVersion8(e){Object.assign(e,{overWriteFieldsAutomatically:!1,version:8})}migrateToVersion7(e){e.notificationCountSavePassword>6?Object.assign(e,{notificationCountSavePassword:6,version:7}):Object.assign(e,{version:7})}migrateToVersion6(e){Object.assign(e,{animateWhenOfferingSave:!0,version:6})}migrateToVersion5(e){Object.assign(e,{notifyPasswordAvailableForPaste:!0,version:5})}migrateToVersion4(e){let i=2;e.logLevel===1&&(i=1),Object.assign(e,{logLevel:i,version:4})}migrateToVersion3(e){e.notificationCountGeneric==null&&(e.notificationCountGeneric=0),e.notificationCountSavePassword==null&&(e.notificationCountSavePassword=0),Object.assign(e,{currentSearchTermTimeout:30,version:3})}migrateToVersion2(e){let i=new $a;if(!e.config||e.config.length==0){i=Li;return}i.pageRegex=new Ae,i.hostExact=new Ae,i.pagePrefix=new Ae,i.pageRegex["^.*$"]={matchWeight:0,config:this.migrateIndividualSiteConfigSettingsToV2(e.config[0].config),source:"Migration"};for(let o=1;o<e.config.length;o++){const a=e.config[o].url;if(a.indexOf("://")==-1)continue;const n=a.substr(a.indexOf("://")+3);if(n.length<=1)continue;const s=this.migrateIndividualSiteConfigSettingsToV2(e.config[o].config),r=n.indexOf("/");if(r>-1||r==n.lastIndexOf("/")){const c=r>-1?n.substr(0,r):n;i.hostExact[c]={config:s,matchWeight:100,source:"Migration"}}else{let c=200;for(const l in i.pagePrefix)n.startsWith(l)&&c++;i.pagePrefix[n]={config:s,matchWeight:c,source:"Migration"}}}Object.assign(e,{siteConfig:i,config:null,version:2})}migrateIndividualSiteConfigSettingsToV2(e){const i=new Va;return e.preventSaveNotification==null&&(i.preventSaveNotification=e.preventSaveNotification),e.interestingForms&&(e.interestingForms.name_w&&(i.whiteList?i.whiteList.form?i.whiteList.form.names||(i.whiteList.form.names=[]):i.whiteList.form={names:[]}:i.whiteList={form:{names:[]}},i.whiteList.form.names=e.interestingForms.name_w),e.interestingForms.id_w&&(i.whiteList?i.whiteList.form?i.whiteList.form.ids||(i.whiteList.form.ids=[]):i.whiteList.form={ids:[]}:i.whiteList={form:{ids:[]}},i.whiteList.form.ids=e.interestingForms.id_w),e.interestingForms.name_b&&(i.blackList?i.blackList.form?i.blackList.form.names||(i.blackList.form.names=[]):i.blackList.form={names:[]}:i.blackList={form:{names:[]}},i.blackList.form.names=e.interestingForms.name_b),e.interestingForms.id_b&&(i.blackList?i.blackList.form?i.blackList.form.ids||(i.blackList.form.ids=[]):i.blackList.form={ids:[]}:i.blackList={form:{ids:[]}},i.blackList.form.ids=e.interestingForms.id_b),e.interestingForms.f_name_w&&(i.whiteList?i.whiteList.fields?i.whiteList.fields.names||(i.whiteList.fields.names=[]):i.whiteList.fields={names:[]}:i.whiteList={fields:{names:[]}},i.whiteList.fields.names=e.interestingForms.f_name_w),e.interestingForms.f_id_w&&(i.whiteList?i.whiteList.fields?i.whiteList.fields.ids||(i.whiteList.fields.ids=[]):i.whiteList.fields={ids:[]}:i.whiteList={fields:{ids:[]}},i.whiteList.fields.ids=e.interestingForms.f_id_w),e.interestingForms.f_name_b&&(i.blackList?i.blackList.fields?i.blackList.fields.names||(i.blackList.fields.names=[]):i.blackList.fields={names:[]}:i.blackList={fields:{names:[]}},i.blackList.fields.names=e.interestingForms.f_name_b),e.interestingForms.f_id_b&&(i.blackList?i.blackList.fields?i.blackList.fields.ids||(i.blackList.fields.ids=[]):i.blackList.fields={ids:[]}:i.blackList={fields:{ids:[]}},i.blackList.fields.ids=e.interestingForms.f_id_b)),i}}const Dt=2147483647,Ge=36,Co=1,ei=26,wr=38,jr=700,qa=72,Ja=128,Ya="-",vr=/^xn--/,Sr=/[^\0-\x7F]/,Lr=/[\x2E\u3002\uFF0E\uFF61]/g,Cr={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},Ao=Ge-Co,Ke=Math.floor,xo=String.fromCharCode;function ct(t){throw new RangeError(Cr[t])}function Ar(t,e){const i=[];let o=t.length;for(;o--;)i[o]=e(t[o]);return i}function Xa(t,e){const i=t.split("@");let o="";i.length>1&&(o=i[0]+"@",t=i[1]),t=t.replace(Lr,".");const a=t.split("."),n=Ar(a,e).join(".");return o+n}function Za(t){const e=[];let i=0;const o=t.length;for(;i<o;){const a=t.charCodeAt(i++);if(a>=55296&&a<=56319&&i<o){const n=t.charCodeAt(i++);(n&64512)==56320?e.push(((a&1023)<<10)+(n&1023)+65536):(e.push(a),i--)}else e.push(a)}return e}const xr=t=>String.fromCodePoint(...t),Ir=function(t){return t>=48&&t<58?26+(t-48):t>=65&&t<91?t-65:t>=97&&t<123?t-97:Ge},Qa=function(t,e){return t+22+75*(t<26)-((e!=0)<<5)},en=function(t,e,i){let o=0;for(t=i?Ke(t/jr):t>>1,t+=Ke(t/e);t>Ao*ei>>1;o+=Ge)t=Ke(t/Ao);return Ke(o+(Ao+1)*t/(t+wr))},tn=function(t){const e=[],i=t.length;let o=0,a=Ja,n=qa,s=t.lastIndexOf(Ya);s<0&&(s=0);for(let r=0;r<s;++r)t.charCodeAt(r)>=128&&ct("not-basic"),e.push(t.charCodeAt(r));for(let r=s>0?s+1:0;r<i;){const c=o;for(let d=1,u=Ge;;u+=Ge){r>=i&&ct("invalid-input");const p=Ir(t.charCodeAt(r++));p>=Ge&&ct("invalid-input"),p>Ke((Dt-o)/d)&&ct("overflow"),o+=p*d;const g=u<=n?Co:u>=n+ei?ei:u-n;if(p<g)break;const v=Ge-g;d>Ke(Dt/v)&&ct("overflow"),d*=v}const l=e.length+1;n=en(o-c,l,c==0),Ke(o/l)>Dt-a&&ct("overflow"),a+=Ke(o/l),o%=l,e.splice(o++,0,a)}return String.fromCodePoint(...e)},on=function(t){const e=[];t=Za(t);const i=t.length;let o=Ja,a=0,n=qa;for(const c of t)c<128&&e.push(xo(c));const s=e.length;let r=s;for(s&&e.push(Ya);r<i;){let c=Dt;for(const d of t)d>=o&&d<c&&(c=d);const l=r+1;c-o>Ke((Dt-a)/l)&&ct("overflow"),a+=(c-o)*l,o=c;for(const d of t)if(d<o&&++a>Dt&&ct("overflow"),d===o){let u=a;for(let p=Ge;;p+=Ge){const g=p<=n?Co:p>=n+ei?ei:p-n;if(u<g)break;const v=u-g,y=Ge-g;e.push(xo(Qa(g+v%y,0))),u=Ke(v/y)}e.push(xo(Qa(u,0))),n=en(a,l,r===s),a=0,++r}++a,++o}return e.join("")},Ci={version:"2.1.0",ucs2:{decode:Za,encode:xr},decode:tn,encode:on,toASCII:function(t){return Xa(t,function(e){return Sr.test(e)?"xn--"+on(e):e})},toUnicode:function(t){return Xa(t,function(e){return vr.test(e)?tn(e.slice(4).toLowerCase()):e})}},lt=256,an=100,Io=399,nn=101,Te="",Ai=2;class Rr{constructor(){this.version="3.0",this._wasmMemory=null,this._pslBuffer32=null,this._pslBuffer8=null,this._pslByteLength=0,this._hostnameArg=Te,this._getPublicSuffixPosWASM=null,this._getPublicSuffixPos=this._getPublicSuffixPosJS,this._wasmPromise=null}_allocateBuffers(e){if(this._pslByteLength=e+3&-4,!(this._pslBuffer32!==null&&this._pslBuffer32.byteLength>=this._pslByteLength)){if(this._wasmMemory!==null){const i=this._pslByteLength+65535>>>16,o=this._wasmMemory.buffer.byteLength>>>16,a=i-o;a>0&&(this._wasmMemory.grow(a),this._pslBuffer32=new Uint32Array(this._wasmMemory.buffer),this._pslBuffer8=new Uint8Array(this._wasmMemory.buffer))}else this._pslBuffer8=new Uint8Array(this._pslByteLength),this._pslBuffer32=new Uint32Array(this._pslBuffer8.buffer);this._hostnameArg=Te,this._pslBuffer8[lt]=0}}parse(e,i){const o={l:Te,f:0,c:null};{const a=function(l,d){let u=l.length,p=u-d.length;if(p!==0)return p;for(let g=0;g<u;g++)if(p=l.charCodeAt(g)-d.charCodeAt(g),p!==0)return p;return 0},n=function(l,d){let u=o,p=l.length;for(;p>0;){const g=l.lastIndexOf(".",p-1),v=l.slice(g+1,p);if(p=g,Array.isArray(u.c)===!1){const P={l:v,f:0,c:null};u.c=[P],u=P;continue}let y=0,A=u.c.length;for(;y<A;){const P=y+A>>>1,B=a(v,u.c[P].l);if(B<0){if(A=P,A===y){const H={l:v,f:0,c:null};u.c.splice(y,0,H),u=H;break}continue}if(B>0){if(y=P+1,y===A){const H={l:v,f:0,c:null};u.c.splice(A,0,H),u=H;break}continue}u=u.c[P];break}}u.f|=1,d&&(u.f|=2)};n("*",!1);const s=/[^*a-z0-9.-]/,r=e.length;let c=0;for(;c<r;){let l=e.indexOf(`
`,c);l===-1&&(l=e.indexOf("\r",c),l===-1&&(l=r));let d=e.slice(c,l);c=l+1;const u=d.indexOf("//");u!==-1&&(d=d.slice(0,u)),d=d.trim();const p=d.length>0&&d.charCodeAt(0)===33;p&&(d=d.slice(1)),d.length!==0&&(s.test(d)&&(d=i(d.toLowerCase())),!(d.length>253)&&n(d,p))}}{const a=new Map,n=[],s=[],r=function(p){const g=n.length;for(let v=0;v<p;v++)n.push(0);return g},c=function(p,g){const v=g.l.length,y=g.c!==null?g.c.length:0;if(n[p+0]=y<<16|g.f<<8|v,v<=4){let P=0;v>0&&(P|=g.l.charCodeAt(0),v>1&&(P|=g.l.charCodeAt(1)<<8,v>2&&(P|=g.l.charCodeAt(2)<<16,v>3&&(P|=g.l.charCodeAt(3)<<24)))),n[p+1]=P}else{let P=a.get(g.l);if(typeof P>"u"){P=s.length;for(let B=0;B<v;B++)s.push(g.l.charCodeAt(B));a.set(g.l,P)}n[p+1]=P}if(Array.isArray(g.c)===!1){n[p+2]=0;return}const A=r(y*3);n[p+2]=A;for(let P=0;P<y;P++)c(A+P*3,g.c[P])};r(128);const l=r(3);c(l,o),n[an]=l;const d=n.length<<2;n[nn]=d;const u=(n.length<<2)+(s.length+3&-4);this._allocateBuffers(u),this._pslBuffer32.set(n),this._pslBuffer8.set(s,n.length<<2)}}_setHostnameArg(e){const i=this._pslBuffer8;if(e===this._hostnameArg)return i[lt];if(e===null||e.length===0)return this._hostnameArg=Te,i[lt]=0;e=e.toLowerCase(),this._hostnameArg=e;let o=e.length;o>255&&(o=255),i[lt]=o;let a=o,n=lt+1;for(;a--;){const s=e.charCodeAt(a);s===46&&(i[n+0]=a+1,i[n+1]=a,n+=2),i[a]=s}return i[n]=0,o}_getPublicSuffixPosJS(){const e=this._pslBuffer8,i=this._pslBuffer32,o=i[nn];let a=this._pslBuffer32[an],n=-1,s=lt;for(;;){const r=e[s+1],c=e[s+0]-r;let l=i[a+0]>>>16;if(l===0)break;const d=i[a+2];let u=0,p=0;for(;u<l;){const g=u+l>>>1,v=d+g+(g<<1),y=i[v+0]&255;let A=c-y;if(A===0){const P=y<=4?v+1<<2:o+i[v+1];for(let B=0;B<c&&(A=e[r+B]-e[P+B],A===0);B++);}if(A<0)l=g;else if(A>0)u=g+1;else{p=v;break}}if(p===0){if(i[d+1]!==42)break;e[Io]=1,p=d}if(a=p,i[a+0]&512){if(s>lt)return s-2;break}if(i[a+0]&256&&(n=s),r===0)break;s+=2}return n}getPublicSuffix(e){if(this._pslBuffer32===null)return Te;const i=this._setHostnameArg(e),o=this._pslBuffer8;if(i===0||o[0]===46)return Te;const a=this._getPublicSuffixPos();if(a===-1)return Te;const n=o[a+1];return n===0?this._hostnameArg:this._hostnameArg.slice(n)}getDomain(e){if(this._pslBuffer32===null)return Te;const i=this._setHostnameArg(e),o=this._pslBuffer8;if(i===0||o[0]===46)return Te;const a=this._getPublicSuffixPos();if(a===-1||o[a+1]===0)return Te;const n=o[a+3];return n===0?this._hostnameArg:this._hostnameArg.slice(n)}suffixInPSL(e){if(this._pslBuffer32===null)return!1;const i=this._setHostnameArg(e),o=this._pslBuffer8;if(i===0||o[0]===46)return!1;o[Io]=0;const a=this._getPublicSuffixPos();return a!==-1&&o[a+1]===0&&o[Io]!==1}toSelfie(e=null){if(this._pslBuffer8===null)return"";if(e!==null){const i=e.encode(this._pslBuffer8.buffer,this._pslByteLength);return`${Ai}	${i}`}return{magic:Ai,buf32:Array.from(new Uint32Array(this._pslBuffer8.buffer,0,this._pslByteLength>>>2))}}fromSelfie(e,i=null){let o=0;if(typeof e=="string"&&e.length!==0&&i!==null){const a=e.indexOf("	");if(a===-1||e.slice(0,a)!==`${Ai}`)return!1;const n=e.slice(a+1);if(o=i.decodeSize(n),o===0)return!1;this._allocateBuffers(o),i.decode(n,this._pslBuffer8.buffer)}else if(e.magic===Ai&&Array.isArray(e.buf32))o=e.buf32.length<<2,this._allocateBuffers(o),this._pslBuffer32.set(e.buf32);else return!1;return this._hostnameArg=Te,this._pslBuffer8[lt]=0,!0}async enableWASM({customFetch:e=null}={}){const i=async({customFetch:a})=>{const n=new URL("data:application/wasm;base64,AGFzbQEAAAABBQFgAAF/AhMBB2ltcG9ydHMGbWVtb3J5AgABAwIBAAcWARJnZXRQdWJsaWNTdWZmaXhQb3MAAArVAgHSAgETf0GUAygCACEAQZADKAIAQQJ0IQFBgAIhAkF/IQMCQANAIAItAAAgAi0AASIEayEFIAEvAQIiCkUNASABKAIIQQJ0IQdBACIJIQgCQANAIAkgCk8NASAJIApqQQF2IgxBAnQiECAQQQF0aiAHaiINLQAAIQ4gBSAOayILRQRAIA5BBE0EQCANQQRqIQ8FIAAgDSgCBGohDwsgBCIQIAVqIRIgDyERAkADQCAQLQAAIBEtAABrIgsNASAQQQFqIhAgEkYNASARQQFqIREMAAsLCyALQQBIBEAgDCEKDAELIAtBAEoEQCAMQQFqIQkMAQsgDSEICwsgCEUEQCAHKAIEQSpHDQJBjwNBAToAACAHIQgLIAgiAS0AASIQQQJxBEAgAkGAAksEQCACQX5qDwsMAgsgEEEBcQRAIAIhAwsgBEUNASACQQJqIQIMAAsLIAML",self.location);if(a!==null){const s=await a(n);return WebAssembly.compile(await s.arrayBuffer())}return WebAssembly.compileStreaming(fetch(n))},o=async({customFetch:a})=>{if(typeof WebAssembly!="object")return!1;const n=new Uint32Array(1),s=new Uint8Array(n.buffer);if(n[0]=1,s[0]!==1)return!1;try{const r=await i({customFetch:a});if(!(r instanceof WebAssembly.Module))return!1;const c=this._pslBuffer8!==null?this._pslBuffer8.byteLength+65535>>>16:1,l=new WebAssembly.Memory({initial:c}),d=await WebAssembly.instantiate(r,{imports:{memory:l}});if(!(d instanceof WebAssembly.Instance))return!1;const u=l.buffer.byteLength>>>16,p=this._pslBuffer8!==null?this._pslBuffer8.byteLength+65535>>>16:0;if(p>u&&l.grow(p-u),this._pslBuffer32!==null){const g=new Uint8Array(l.buffer),v=new Uint32Array(l.buffer);v.set(this._pslBuffer32),this._pslBuffer8=g,this._pslBuffer32=v}return this._wasmMemory=l,this._getPublicSuffixPosWASM=d.exports.getPublicSuffixPos,this._getPublicSuffixPos=this._getPublicSuffixPosWASM,!0}catch(r){console.info(r)}return!1};return this._wasmPromise===null&&(this._wasmPromise=o({customFetch:e})),this._wasmPromise}async disableWASM(){let e=this._wasmPromise!==null?await this._wasmPromise:!1;if(this._getPublicSuffixPos=this._getPublicSuffixPosJS,this._getPublicSuffixPosWASM=null,this._wasmMemory!==null){if(this._pslBuffer32!==null){const i=new Uint8Array(this._pslByteLength),o=new Uint32Array(i.buffer);o.set(this._pslBuffer32),this._pslBuffer8=i,this._pslBuffer32=o}this._wasmMemory=null}return this._wasmPromise=null,e}}const Ro=new Rr,zr=`// This Source Code Form is subject to the terms of the Mozilla Public
    // License, v. 2.0. If a copy of the MPL was not distributed with this
    // file, You can obtain one at https://mozilla.org/MPL/2.0/.

    // Please pull this list from, and only from https://publicsuffix.org/list/public_suffix_list.dat,
    // rather than any other VCS sites. Pulling from any other URL is not guaranteed to be supported.

    // Instructions on pulling and using this list can be found at https://publicsuffix.org/list/.

    // ===BEGIN ICANN DOMAINS===

    // ac : http://nic.ac/rules.htm
    ac
    com.ac
    edu.ac
    gov.ac
    net.ac
    mil.ac
    org.ac

    // ad : https://en.wikipedia.org/wiki/.ad
    ad
    nom.ad

    // ae : https://tdra.gov.ae/en/aeda/ae-policies
    ae
    co.ae
    net.ae
    org.ae
    sch.ae
    ac.ae
    gov.ae
    mil.ae

    // aero : see https://www.information.aero/index.php?id=66
    aero
    accident-investigation.aero
    accident-prevention.aero
    aerobatic.aero
    aeroclub.aero
    aerodrome.aero
    agents.aero
    aircraft.aero
    airline.aero
    airport.aero
    air-surveillance.aero
    airtraffic.aero
    air-traffic-control.aero
    ambulance.aero
    amusement.aero
    association.aero
    author.aero
    ballooning.aero
    broker.aero
    caa.aero
    cargo.aero
    catering.aero
    certification.aero
    championship.aero
    charter.aero
    civilaviation.aero
    club.aero
    conference.aero
    consultant.aero
    consulting.aero
    control.aero
    council.aero
    crew.aero
    design.aero
    dgca.aero
    educator.aero
    emergency.aero
    engine.aero
    engineer.aero
    entertainment.aero
    equipment.aero
    exchange.aero
    express.aero
    federation.aero
    flight.aero
    fuel.aero
    gliding.aero
    government.aero
    groundhandling.aero
    group.aero
    hanggliding.aero
    homebuilt.aero
    insurance.aero
    journal.aero
    journalist.aero
    leasing.aero
    logistics.aero
    magazine.aero
    maintenance.aero
    media.aero
    microlight.aero
    modelling.aero
    navigation.aero
    parachuting.aero
    paragliding.aero
    passenger-association.aero
    pilot.aero
    press.aero
    production.aero
    recreation.aero
    repbody.aero
    res.aero
    research.aero
    rotorcraft.aero
    safety.aero
    scientist.aero
    services.aero
    show.aero
    skydiving.aero
    software.aero
    student.aero
    trader.aero
    trading.aero
    trainer.aero
    union.aero
    workinggroup.aero
    works.aero

    // af : http://www.nic.af/help.jsp
    af
    gov.af
    com.af
    org.af
    net.af
    edu.af

    // ag : http://www.nic.ag/prices.htm
    ag
    com.ag
    org.ag
    net.ag
    co.ag
    nom.ag

    // ai : http://nic.com.ai/
    ai
    off.ai
    com.ai
    net.ai
    org.ai

    // al : http://www.ert.gov.al/ert_alb/faq_det.html?Id=31
    al
    com.al
    edu.al
    gov.al
    mil.al
    net.al
    org.al

    // am : https://www.amnic.net/policy/en/Policy_EN.pdf
    am
    co.am
    com.am
    commune.am
    net.am
    org.am

    // ao : https://en.wikipedia.org/wiki/.ao
    // http://www.dns.ao/REGISTR.DOC
    ao
    ed.ao
    gv.ao
    og.ao
    co.ao
    pb.ao
    it.ao

    // aq : https://en.wikipedia.org/wiki/.aq
    aq

    // ar : https://nic.ar/es/nic-argentina/normativa
    ar
    bet.ar
    com.ar
    coop.ar
    edu.ar
    gob.ar
    gov.ar
    int.ar
    mil.ar
    musica.ar
    mutual.ar
    net.ar
    org.ar
    senasa.ar
    tur.ar

    // arpa : https://en.wikipedia.org/wiki/.arpa
    // Confirmed by registry <iana-questions@icann.org> 2008-06-18
    arpa
    e164.arpa
    in-addr.arpa
    ip6.arpa
    iris.arpa
    uri.arpa
    urn.arpa

    // as : https://en.wikipedia.org/wiki/.as
    as
    gov.as

    // asia : https://en.wikipedia.org/wiki/.asia
    asia

    // at : https://en.wikipedia.org/wiki/.at
    // Confirmed by registry <it@nic.at> 2008-06-17
    at
    ac.at
    co.at
    gv.at
    or.at
    sth.ac.at

    // au : https://en.wikipedia.org/wiki/.au
    // http://www.auda.org.au/
    au
    // 2LDs
    com.au
    net.au
    org.au
    edu.au
    gov.au
    asn.au
    id.au
    // Historic 2LDs (closed to new registration, but sites still exist)
    info.au
    conf.au
    oz.au
    // CGDNs - http://www.cgdn.org.au/
    act.au
    nsw.au
    nt.au
    qld.au
    sa.au
    tas.au
    vic.au
    wa.au
    // 3LDs
    act.edu.au
    catholic.edu.au
    // eq.edu.au - Removed at the request of the Queensland Department of Education
    nsw.edu.au
    nt.edu.au
    qld.edu.au
    sa.edu.au
    tas.edu.au
    vic.edu.au
    wa.edu.au
    // act.gov.au  Bug 984824 - Removed at request of Greg Tankard
    // nsw.gov.au  Bug 547985 - Removed at request of <Shae.Donelan@services.nsw.gov.au>
    // nt.gov.au  Bug 940478 - Removed at request of Greg Connors <Greg.Connors@nt.gov.au>
    qld.gov.au
    sa.gov.au
    tas.gov.au
    vic.gov.au
    wa.gov.au
    // 4LDs
    // education.tas.edu.au - Removed at the request of the Department of Education Tasmania
    schools.nsw.edu.au

    // aw : https://en.wikipedia.org/wiki/.aw
    aw
    com.aw

    // ax : https://en.wikipedia.org/wiki/.ax
    ax

    // az : https://en.wikipedia.org/wiki/.az
    az
    com.az
    net.az
    int.az
    gov.az
    org.az
    edu.az
    info.az
    pp.az
    mil.az
    name.az
    pro.az
    biz.az

    // ba : http://nic.ba/users_data/files/pravilnik_o_registraciji.pdf
    ba
    com.ba
    edu.ba
    gov.ba
    mil.ba
    net.ba
    org.ba

    // bb : https://en.wikipedia.org/wiki/.bb
    bb
    biz.bb
    co.bb
    com.bb
    edu.bb
    gov.bb
    info.bb
    net.bb
    org.bb
    store.bb
    tv.bb

    // bd : https://en.wikipedia.org/wiki/.bd
    *.bd

    // be : https://en.wikipedia.org/wiki/.be
    // Confirmed by registry <tech@dns.be> 2008-06-08
    be
    ac.be

    // bf : https://en.wikipedia.org/wiki/.bf
    bf
    gov.bf

    // bg : https://en.wikipedia.org/wiki/.bg
    // https://www.register.bg/user/static/rules/en/index.html
    bg
    a.bg
    b.bg
    c.bg
    d.bg
    e.bg
    f.bg
    g.bg
    h.bg
    i.bg
    j.bg
    k.bg
    l.bg
    m.bg
    n.bg
    o.bg
    p.bg
    q.bg
    r.bg
    s.bg
    t.bg
    u.bg
    v.bg
    w.bg
    x.bg
    y.bg
    z.bg
    0.bg
    1.bg
    2.bg
    3.bg
    4.bg
    5.bg
    6.bg
    7.bg
    8.bg
    9.bg

    // bh : https://en.wikipedia.org/wiki/.bh
    bh
    com.bh
    edu.bh
    net.bh
    org.bh
    gov.bh

    // bi : https://en.wikipedia.org/wiki/.bi
    // http://whois.nic.bi/
    bi
    co.bi
    com.bi
    edu.bi
    or.bi
    org.bi

    // biz : https://en.wikipedia.org/wiki/.biz
    biz

    // bj : https://en.wikipedia.org/wiki/.bj
    bj
    asso.bj
    barreau.bj
    gouv.bj

    // bm : http://www.bermudanic.bm/dnr-text.txt
    bm
    com.bm
    edu.bm
    gov.bm
    net.bm
    org.bm

    // bn : http://www.bnnic.bn/faqs
    bn
    com.bn
    edu.bn
    gov.bn
    net.bn
    org.bn

    // bo : https://nic.bo/delegacion2015.php#h-1.10
    bo
    com.bo
    edu.bo
    gob.bo
    int.bo
    org.bo
    net.bo
    mil.bo
    tv.bo
    web.bo
    // Social Domains
    academia.bo
    agro.bo
    arte.bo
    blog.bo
    bolivia.bo
    ciencia.bo
    cooperativa.bo
    democracia.bo
    deporte.bo
    ecologia.bo
    economia.bo
    empresa.bo
    indigena.bo
    industria.bo
    info.bo
    medicina.bo
    movimiento.bo
    musica.bo
    natural.bo
    nombre.bo
    noticias.bo
    patria.bo
    politica.bo
    profesional.bo
    plurinacional.bo
    pueblo.bo
    revista.bo
    salud.bo
    tecnologia.bo
    tksat.bo
    transporte.bo
    wiki.bo

    // br : http://registro.br/dominio/categoria.html
    // Submitted by registry <fneves@registro.br>
    br
    9guacu.br
    abc.br
    adm.br
    adv.br
    agr.br
    aju.br
    am.br
    anani.br
    aparecida.br
    app.br
    arq.br
    art.br
    ato.br
    b.br
    barueri.br
    belem.br
    bhz.br
    bib.br
    bio.br
    blog.br
    bmd.br
    boavista.br
    bsb.br
    campinagrande.br
    campinas.br
    caxias.br
    cim.br
    cng.br
    cnt.br
    com.br
    contagem.br
    coop.br
    coz.br
    cri.br
    cuiaba.br
    curitiba.br
    def.br
    des.br
    det.br
    dev.br
    ecn.br
    eco.br
    edu.br
    emp.br
    enf.br
    eng.br
    esp.br
    etc.br
    eti.br
    far.br
    feira.br
    flog.br
    floripa.br
    fm.br
    fnd.br
    fortal.br
    fot.br
    foz.br
    fst.br
    g12.br
    geo.br
    ggf.br
    goiania.br
    gov.br
    // gov.br 26 states + df https://en.wikipedia.org/wiki/States_of_Brazil
    ac.gov.br
    al.gov.br
    am.gov.br
    ap.gov.br
    ba.gov.br
    ce.gov.br
    df.gov.br
    es.gov.br
    go.gov.br
    ma.gov.br
    mg.gov.br
    ms.gov.br
    mt.gov.br
    pa.gov.br
    pb.gov.br
    pe.gov.br
    pi.gov.br
    pr.gov.br
    rj.gov.br
    rn.gov.br
    ro.gov.br
    rr.gov.br
    rs.gov.br
    sc.gov.br
    se.gov.br
    sp.gov.br
    to.gov.br
    gru.br
    imb.br
    ind.br
    inf.br
    jab.br
    jampa.br
    jdf.br
    joinville.br
    jor.br
    jus.br
    leg.br
    lel.br
    log.br
    londrina.br
    macapa.br
    maceio.br
    manaus.br
    maringa.br
    mat.br
    med.br
    mil.br
    morena.br
    mp.br
    mus.br
    natal.br
    net.br
    niteroi.br
    *.nom.br
    not.br
    ntr.br
    odo.br
    ong.br
    org.br
    osasco.br
    palmas.br
    poa.br
    ppg.br
    pro.br
    psc.br
    psi.br
    pvh.br
    qsl.br
    radio.br
    rec.br
    recife.br
    rep.br
    ribeirao.br
    rio.br
    riobranco.br
    riopreto.br
    salvador.br
    sampa.br
    santamaria.br
    santoandre.br
    saobernardo.br
    saogonca.br
    seg.br
    sjc.br
    slg.br
    slz.br
    sorocaba.br
    srv.br
    taxi.br
    tc.br
    tec.br
    teo.br
    the.br
    tmp.br
    trd.br
    tur.br
    tv.br
    udi.br
    vet.br
    vix.br
    vlog.br
    wiki.br
    zlg.br

    // bs : http://www.nic.bs/rules.html
    bs
    com.bs
    net.bs
    org.bs
    edu.bs
    gov.bs

    // bt : https://en.wikipedia.org/wiki/.bt
    bt
    com.bt
    edu.bt
    gov.bt
    net.bt
    org.bt

    // bv : No registrations at this time.
    // Submitted by registry <jarle@uninett.no>
    bv

    // bw : https://en.wikipedia.org/wiki/.bw
    // http://www.gobin.info/domainname/bw.doc
    // list of other 2nd level tlds ?
    bw
    co.bw
    org.bw

    // by : https://en.wikipedia.org/wiki/.by
    // http://tld.by/rules_2006_en.html
    // list of other 2nd level tlds ?
    by
    gov.by
    mil.by
    // Official information does not indicate that com.by is a reserved
    // second-level domain, but it's being used as one (see www.google.com.by and
    // www.yahoo.com.by, for example), so we list it here for safety's sake.
    com.by

    // http://hoster.by/
    of.by

    // bz : https://en.wikipedia.org/wiki/.bz
    // http://www.belizenic.bz/
    bz
    com.bz
    net.bz
    org.bz
    edu.bz
    gov.bz

    // ca : https://en.wikipedia.org/wiki/.ca
    ca
    // ca geographical names
    ab.ca
    bc.ca
    mb.ca
    nb.ca
    nf.ca
    nl.ca
    ns.ca
    nt.ca
    nu.ca
    on.ca
    pe.ca
    qc.ca
    sk.ca
    yk.ca
    // gc.ca: https://en.wikipedia.org/wiki/.gc.ca
    // see also: http://registry.gc.ca/en/SubdomainFAQ
    gc.ca

    // cat : https://en.wikipedia.org/wiki/.cat
    cat

    // cc : https://en.wikipedia.org/wiki/.cc
    cc

    // cd : https://en.wikipedia.org/wiki/.cd
    // see also: https://www.nic.cd/domain/insertDomain_2.jsp?act=1
    cd
    gov.cd

    // cf : https://en.wikipedia.org/wiki/.cf
    cf

    // cg : https://en.wikipedia.org/wiki/.cg
    cg

    // ch : https://en.wikipedia.org/wiki/.ch
    ch

    // ci : https://en.wikipedia.org/wiki/.ci
    // http://www.nic.ci/index.php?page=charte
    ci
    org.ci
    or.ci
    com.ci
    co.ci
    edu.ci
    ed.ci
    ac.ci
    net.ci
    go.ci
    asso.ci
    aéroport.ci
    int.ci
    presse.ci
    md.ci
    gouv.ci

    // ck : https://en.wikipedia.org/wiki/.ck
    *.ck
    !www.ck

    // cl : https://www.nic.cl
    // Confirmed by .CL registry <hsalgado@nic.cl>
    cl
    co.cl
    gob.cl
    gov.cl
    mil.cl

    // cm : https://en.wikipedia.org/wiki/.cm plus bug 981927
    cm
    co.cm
    com.cm
    gov.cm
    net.cm

    // cn : https://en.wikipedia.org/wiki/.cn
    // Submitted by registry <tanyaling@cnnic.cn>
    cn
    ac.cn
    com.cn
    edu.cn
    gov.cn
    net.cn
    org.cn
    mil.cn
    公司.cn
    网络.cn
    網絡.cn
    // cn geographic names
    ah.cn
    bj.cn
    cq.cn
    fj.cn
    gd.cn
    gs.cn
    gz.cn
    gx.cn
    ha.cn
    hb.cn
    he.cn
    hi.cn
    hl.cn
    hn.cn
    jl.cn
    js.cn
    jx.cn
    ln.cn
    nm.cn
    nx.cn
    qh.cn
    sc.cn
    sd.cn
    sh.cn
    sn.cn
    sx.cn
    tj.cn
    xj.cn
    xz.cn
    yn.cn
    zj.cn
    hk.cn
    mo.cn
    tw.cn

    // co : https://en.wikipedia.org/wiki/.co
    // Submitted by registry <tecnico@uniandes.edu.co>
    co
    arts.co
    com.co
    edu.co
    firm.co
    gov.co
    info.co
    int.co
    mil.co
    net.co
    nom.co
    org.co
    rec.co
    web.co

    // com : https://en.wikipedia.org/wiki/.com
    com

    // coop : https://en.wikipedia.org/wiki/.coop
    coop

    // cr : http://www.nic.cr/niccr_publico/showRegistroDominiosScreen.do
    cr
    ac.cr
    co.cr
    ed.cr
    fi.cr
    go.cr
    or.cr
    sa.cr

    // cu : https://en.wikipedia.org/wiki/.cu
    cu
    com.cu
    edu.cu
    org.cu
    net.cu
    gov.cu
    inf.cu

    // cv : https://en.wikipedia.org/wiki/.cv
    // cv : http://www.dns.cv/tldcv_portal/do?com=DS;5446457100;111;+PAGE(4000018)+K-CAT-CODIGO(RDOM)+RCNT(100); <- registration rules
    cv
    com.cv
    edu.cv
    int.cv
    nome.cv
    org.cv

    // cw : http://www.una.cw/cw_registry/
    // Confirmed by registry <registry@una.net> 2013-03-26
    cw
    com.cw
    edu.cw
    net.cw
    org.cw

    // cx : https://en.wikipedia.org/wiki/.cx
    // list of other 2nd level tlds ?
    cx
    gov.cx

    // cy : http://www.nic.cy/
    // Submitted by registry Panayiotou Fotia <cydns@ucy.ac.cy>
    // namespace policies URL https://www.nic.cy/portal//sites/default/files/symfonia_gia_eggrafi.pdf
    cy
    ac.cy
    biz.cy
    com.cy
    ekloges.cy
    gov.cy
    ltd.cy
    mil.cy
    net.cy
    org.cy
    press.cy
    pro.cy
    tm.cy

    // cz : https://en.wikipedia.org/wiki/.cz
    cz

    // de : https://en.wikipedia.org/wiki/.de
    // Confirmed by registry <ops@denic.de> (with technical
    // reservations) 2008-07-01
    de

    // dj : https://en.wikipedia.org/wiki/.dj
    dj

    // dk : https://en.wikipedia.org/wiki/.dk
    // Confirmed by registry <robert@dk-hostmaster.dk> 2008-06-17
    dk

    // dm : https://en.wikipedia.org/wiki/.dm
    dm
    com.dm
    net.dm
    org.dm
    edu.dm
    gov.dm

    // do : https://en.wikipedia.org/wiki/.do
    do
    art.do
    com.do
    edu.do
    gob.do
    gov.do
    mil.do
    net.do
    org.do
    sld.do
    web.do

    // dz : http://www.nic.dz/images/pdf_nic/charte.pdf
    dz
    art.dz
    asso.dz
    com.dz
    edu.dz
    gov.dz
    org.dz
    net.dz
    pol.dz
    soc.dz
    tm.dz

    // ec : http://www.nic.ec/reg/paso1.asp
    // Submitted by registry <vabboud@nic.ec>
    ec
    com.ec
    info.ec
    net.ec
    fin.ec
    k12.ec
    med.ec
    pro.ec
    org.ec
    edu.ec
    gov.ec
    gob.ec
    mil.ec

    // edu : https://en.wikipedia.org/wiki/.edu
    edu

    // ee : http://www.eenet.ee/EENet/dom_reeglid.html#lisa_B
    ee
    edu.ee
    gov.ee
    riik.ee
    lib.ee
    med.ee
    com.ee
    pri.ee
    aip.ee
    org.ee
    fie.ee

    // eg : https://en.wikipedia.org/wiki/.eg
    eg
    com.eg
    edu.eg
    eun.eg
    gov.eg
    mil.eg
    name.eg
    net.eg
    org.eg
    sci.eg

    // er : https://en.wikipedia.org/wiki/.er
    *.er

    // es : https://www.nic.es/site_ingles/ingles/dominios/index.html
    es
    com.es
    nom.es
    org.es
    gob.es
    edu.es

    // et : https://en.wikipedia.org/wiki/.et
    et
    com.et
    gov.et
    org.et
    edu.et
    biz.et
    name.et
    info.et
    net.et

    // eu : https://en.wikipedia.org/wiki/.eu
    eu

    // fi : https://en.wikipedia.org/wiki/.fi
    fi
    // aland.fi : https://en.wikipedia.org/wiki/.ax
    // This domain is being phased out in favor of .ax. As there are still many
    // domains under aland.fi, we still keep it on the list until aland.fi is
    // completely removed.
    // TODO: Check for updates (expected to be phased out around Q1/2009)
    aland.fi

    // fj : http://domains.fj/
    // Submitted by registry <garth.miller@cocca.org.nz> 2020-02-11
    fj
    ac.fj
    biz.fj
    com.fj
    gov.fj
    info.fj
    mil.fj
    name.fj
    net.fj
    org.fj
    pro.fj

    // fk : https://en.wikipedia.org/wiki/.fk
    *.fk

    // fm : https://en.wikipedia.org/wiki/.fm
    com.fm
    edu.fm
    net.fm
    org.fm
    fm

    // fo : https://en.wikipedia.org/wiki/.fo
    fo

    // fr : http://www.afnic.fr/
    // domaines descriptifs : https://www.afnic.fr/medias/documents/Cadre_legal/Afnic_Naming_Policy_12122016_VEN.pdf
    fr
    asso.fr
    com.fr
    gouv.fr
    nom.fr
    prd.fr
    tm.fr
    // domaines sectoriels : https://www.afnic.fr/en/products-and-services/the-fr-tld/sector-based-fr-domains-4.html
    aeroport.fr
    avocat.fr
    avoues.fr
    cci.fr
    chambagri.fr
    chirurgiens-dentistes.fr
    experts-comptables.fr
    geometre-expert.fr
    greta.fr
    huissier-justice.fr
    medecin.fr
    notaires.fr
    pharmacien.fr
    port.fr
    veterinaire.fr

    // ga : https://en.wikipedia.org/wiki/.ga
    ga

    // gb : This registry is effectively dormant
    // Submitted by registry <Damien.Shaw@ja.net>
    gb

    // gd : https://en.wikipedia.org/wiki/.gd
    edu.gd
    gov.gd
    gd

    // ge : http://www.nic.net.ge/policy_en.pdf
    ge
    com.ge
    edu.ge
    gov.ge
    org.ge
    mil.ge
    net.ge
    pvt.ge

    // gf : https://en.wikipedia.org/wiki/.gf
    gf

    // gg : http://www.channelisles.net/register-domains/
    // Confirmed by registry <nigel@channelisles.net> 2013-11-28
    gg
    co.gg
    net.gg
    org.gg

    // gh : https://en.wikipedia.org/wiki/.gh
    // see also: http://www.nic.gh/reg_now.php
    // Although domains directly at second level are not possible at the moment,
    // they have been possible for some time and may come back.
    gh
    com.gh
    edu.gh
    gov.gh
    org.gh
    mil.gh

    // gi : http://www.nic.gi/rules.html
    gi
    com.gi
    ltd.gi
    gov.gi
    mod.gi
    edu.gi
    org.gi

    // gl : https://en.wikipedia.org/wiki/.gl
    // http://nic.gl
    gl
    co.gl
    com.gl
    edu.gl
    net.gl
    org.gl

    // gm : http://www.nic.gm/htmlpages%5Cgm-policy.htm
    gm

    // gn : http://psg.com/dns/gn/gn.txt
    // Submitted by registry <randy@psg.com>
    gn
    ac.gn
    com.gn
    edu.gn
    gov.gn
    org.gn
    net.gn

    // gov : https://en.wikipedia.org/wiki/.gov
    gov

    // gp : http://www.nic.gp/index.php?lang=en
    gp
    com.gp
    net.gp
    mobi.gp
    edu.gp
    org.gp
    asso.gp

    // gq : https://en.wikipedia.org/wiki/.gq
    gq

    // gr : https://grweb.ics.forth.gr/english/1617-B-2005.html
    // Submitted by registry <segred@ics.forth.gr>
    gr
    com.gr
    edu.gr
    net.gr
    org.gr
    gov.gr

    // gs : https://en.wikipedia.org/wiki/.gs
    gs

    // gt : https://www.gt/sitio/registration_policy.php?lang=en
    gt
    com.gt
    edu.gt
    gob.gt
    ind.gt
    mil.gt
    net.gt
    org.gt

    // gu : http://gadao.gov.gu/register.html
    // University of Guam : https://www.uog.edu
    // Submitted by uognoc@triton.uog.edu
    gu
    com.gu
    edu.gu
    gov.gu
    guam.gu
    info.gu
    net.gu
    org.gu
    web.gu

    // gw : https://en.wikipedia.org/wiki/.gw
    // gw : https://nic.gw/regras/
    gw

    // gy : https://en.wikipedia.org/wiki/.gy
    // http://registry.gy/
    gy
    co.gy
    com.gy
    edu.gy
    gov.gy
    net.gy
    org.gy

    // hk : https://www.hkirc.hk
    // Submitted by registry <hk.tech@hkirc.hk>
    hk
    com.hk
    edu.hk
    gov.hk
    idv.hk
    net.hk
    org.hk
    公司.hk
    教育.hk
    敎育.hk
    政府.hk
    個人.hk
    个人.hk
    箇人.hk
    網络.hk
    网络.hk
    组織.hk
    網絡.hk
    网絡.hk
    组织.hk
    組織.hk
    組织.hk

    // hm : https://en.wikipedia.org/wiki/.hm
    hm

    // hn : http://www.nic.hn/politicas/ps02,,05.html
    hn
    com.hn
    edu.hn
    org.hn
    net.hn
    mil.hn
    gob.hn

    // hr : http://www.dns.hr/documents/pdf/HRTLD-regulations.pdf
    hr
    iz.hr
    from.hr
    name.hr
    com.hr

    // ht : http://www.nic.ht/info/charte.cfm
    ht
    com.ht
    shop.ht
    firm.ht
    info.ht
    adult.ht
    net.ht
    pro.ht
    org.ht
    med.ht
    art.ht
    coop.ht
    pol.ht
    asso.ht
    edu.ht
    rel.ht
    gouv.ht
    perso.ht

    // hu : http://www.domain.hu/domain/English/sld.html
    // Confirmed by registry <pasztor@iszt.hu> 2008-06-12
    hu
    co.hu
    info.hu
    org.hu
    priv.hu
    sport.hu
    tm.hu
    2000.hu
    agrar.hu
    bolt.hu
    casino.hu
    city.hu
    erotica.hu
    erotika.hu
    film.hu
    forum.hu
    games.hu
    hotel.hu
    ingatlan.hu
    jogasz.hu
    konyvelo.hu
    lakas.hu
    media.hu
    news.hu
    reklam.hu
    sex.hu
    shop.hu
    suli.hu
    szex.hu
    tozsde.hu
    utazas.hu
    video.hu

    // id : https://pandi.id/en/domain/registration-requirements/
    id
    ac.id
    biz.id
    co.id
    desa.id
    go.id
    mil.id
    my.id
    net.id
    or.id
    ponpes.id
    sch.id
    web.id

    // ie : https://en.wikipedia.org/wiki/.ie
    ie
    gov.ie

    // il :         http://www.isoc.org.il/domains/
    // see also:    https://en.isoc.org.il/il-cctld/registration-rules
    // ISOC-IL      (operated by .il Registry)
    il
    ac.il
    co.il
    gov.il
    idf.il
    k12.il
    muni.il
    net.il
    org.il
    // xn--4dbrk0ce ("Israel", Hebrew) : IL
    ישראל
    // xn--4dbgdty6c.xn--4dbrk0ce.
    אקדמיה.ישראל
    // xn--5dbhl8d.xn--4dbrk0ce.
    ישוב.ישראל
    // xn--8dbq2a.xn--4dbrk0ce.
    צהל.ישראל
    // xn--hebda8b.xn--4dbrk0ce.
    ממשל.ישראל

    // im : https://www.nic.im/
    // Submitted by registry <info@nic.im>
    im
    ac.im
    co.im
    com.im
    ltd.co.im
    net.im
    org.im
    plc.co.im
    tt.im
    tv.im

    // in : https://en.wikipedia.org/wiki/.in
    // see also: https://registry.in/policies
    // Please note, that nic.in is not an official eTLD, but used by most
    // government institutions.
    in
    5g.in
    6g.in
    ac.in
    ai.in
    am.in
    bihar.in
    biz.in
    business.in
    ca.in
    cn.in
    co.in
    com.in
    coop.in
    cs.in
    delhi.in
    dr.in
    edu.in
    er.in
    firm.in
    gen.in
    gov.in
    gujarat.in
    ind.in
    info.in
    int.in
    internet.in
    io.in
    me.in
    mil.in
    net.in
    nic.in
    org.in
    pg.in
    post.in
    pro.in
    res.in
    travel.in
    tv.in
    uk.in
    up.in
    us.in

    // info : https://en.wikipedia.org/wiki/.info
    info

    // int : https://en.wikipedia.org/wiki/.int
    // Confirmed by registry <iana-questions@icann.org> 2008-06-18
    int
    eu.int

    // io : http://www.nic.io/rules.htm
    // list of other 2nd level tlds ?
    io
    com.io

    // iq : http://www.cmc.iq/english/iq/iqregister1.htm
    iq
    gov.iq
    edu.iq
    mil.iq
    com.iq
    org.iq
    net.iq

    // ir : http://www.nic.ir/Terms_and_Conditions_ir,_Appendix_1_Domain_Rules
    // Also see http://www.nic.ir/Internationalized_Domain_Names
    // Two <iran>.ir entries added at request of <tech-team@nic.ir>, 2010-04-16
    ir
    ac.ir
    co.ir
    gov.ir
    id.ir
    net.ir
    org.ir
    sch.ir
    // xn--mgba3a4f16a.ir (<iran>.ir, Persian YEH)
    ایران.ir
    // xn--mgba3a4fra.ir (<iran>.ir, Arabic YEH)
    ايران.ir

    // is : http://www.isnic.is/domain/rules.php
    // Confirmed by registry <marius@isgate.is> 2008-12-06
    is
    net.is
    com.is
    edu.is
    gov.is
    org.is
    int.is

    // it : https://en.wikipedia.org/wiki/.it
    it
    gov.it
    edu.it
    // Reserved geo-names (regions and provinces):
    // https://www.nic.it/sites/default/files/archivio/docs/Regulation_assignation_v7.1.pdf
    // Regions
    abr.it
    abruzzo.it
    aosta-valley.it
    aostavalley.it
    bas.it
    basilicata.it
    cal.it
    calabria.it
    cam.it
    campania.it
    emilia-romagna.it
    emiliaromagna.it
    emr.it
    friuli-v-giulia.it
    friuli-ve-giulia.it
    friuli-vegiulia.it
    friuli-venezia-giulia.it
    friuli-veneziagiulia.it
    friuli-vgiulia.it
    friuliv-giulia.it
    friulive-giulia.it
    friulivegiulia.it
    friulivenezia-giulia.it
    friuliveneziagiulia.it
    friulivgiulia.it
    fvg.it
    laz.it
    lazio.it
    lig.it
    liguria.it
    lom.it
    lombardia.it
    lombardy.it
    lucania.it
    mar.it
    marche.it
    mol.it
    molise.it
    piedmont.it
    piemonte.it
    pmn.it
    pug.it
    puglia.it
    sar.it
    sardegna.it
    sardinia.it
    sic.it
    sicilia.it
    sicily.it
    taa.it
    tos.it
    toscana.it
    trentin-sud-tirol.it
    trentin-süd-tirol.it
    trentin-sudtirol.it
    trentin-südtirol.it
    trentin-sued-tirol.it
    trentin-suedtirol.it
    trentino-a-adige.it
    trentino-aadige.it
    trentino-alto-adige.it
    trentino-altoadige.it
    trentino-s-tirol.it
    trentino-stirol.it
    trentino-sud-tirol.it
    trentino-süd-tirol.it
    trentino-sudtirol.it
    trentino-südtirol.it
    trentino-sued-tirol.it
    trentino-suedtirol.it
    trentino.it
    trentinoa-adige.it
    trentinoaadige.it
    trentinoalto-adige.it
    trentinoaltoadige.it
    trentinos-tirol.it
    trentinostirol.it
    trentinosud-tirol.it
    trentinosüd-tirol.it
    trentinosudtirol.it
    trentinosüdtirol.it
    trentinosued-tirol.it
    trentinosuedtirol.it
    trentinsud-tirol.it
    trentinsüd-tirol.it
    trentinsudtirol.it
    trentinsüdtirol.it
    trentinsued-tirol.it
    trentinsuedtirol.it
    tuscany.it
    umb.it
    umbria.it
    val-d-aosta.it
    val-daosta.it
    vald-aosta.it
    valdaosta.it
    valle-aosta.it
    valle-d-aosta.it
    valle-daosta.it
    valleaosta.it
    valled-aosta.it
    valledaosta.it
    vallee-aoste.it
    vallée-aoste.it
    vallee-d-aoste.it
    vallée-d-aoste.it
    valleeaoste.it
    valléeaoste.it
    valleedaoste.it
    valléedaoste.it
    vao.it
    vda.it
    ven.it
    veneto.it
    // Provinces
    ag.it
    agrigento.it
    al.it
    alessandria.it
    alto-adige.it
    altoadige.it
    an.it
    ancona.it
    andria-barletta-trani.it
    andria-trani-barletta.it
    andriabarlettatrani.it
    andriatranibarletta.it
    ao.it
    aosta.it
    aoste.it
    ap.it
    aq.it
    aquila.it
    ar.it
    arezzo.it
    ascoli-piceno.it
    ascolipiceno.it
    asti.it
    at.it
    av.it
    avellino.it
    ba.it
    balsan-sudtirol.it
    balsan-südtirol.it
    balsan-suedtirol.it
    balsan.it
    bari.it
    barletta-trani-andria.it
    barlettatraniandria.it
    belluno.it
    benevento.it
    bergamo.it
    bg.it
    bi.it
    biella.it
    bl.it
    bn.it
    bo.it
    bologna.it
    bolzano-altoadige.it
    bolzano.it
    bozen-sudtirol.it
    bozen-südtirol.it
    bozen-suedtirol.it
    bozen.it
    br.it
    brescia.it
    brindisi.it
    bs.it
    bt.it
    bulsan-sudtirol.it
    bulsan-südtirol.it
    bulsan-suedtirol.it
    bulsan.it
    bz.it
    ca.it
    cagliari.it
    caltanissetta.it
    campidano-medio.it
    campidanomedio.it
    campobasso.it
    carbonia-iglesias.it
    carboniaiglesias.it
    carrara-massa.it
    carraramassa.it
    caserta.it
    catania.it
    catanzaro.it
    cb.it
    ce.it
    cesena-forli.it
    cesena-forlì.it
    cesenaforli.it
    cesenaforlì.it
    ch.it
    chieti.it
    ci.it
    cl.it
    cn.it
    co.it
    como.it
    cosenza.it
    cr.it
    cremona.it
    crotone.it
    cs.it
    ct.it
    cuneo.it
    cz.it
    dell-ogliastra.it
    dellogliastra.it
    en.it
    enna.it
    fc.it
    fe.it
    fermo.it
    ferrara.it
    fg.it
    fi.it
    firenze.it
    florence.it
    fm.it
    foggia.it
    forli-cesena.it
    forlì-cesena.it
    forlicesena.it
    forlìcesena.it
    fr.it
    frosinone.it
    ge.it
    genoa.it
    genova.it
    go.it
    gorizia.it
    gr.it
    grosseto.it
    iglesias-carbonia.it
    iglesiascarbonia.it
    im.it
    imperia.it
    is.it
    isernia.it
    kr.it
    la-spezia.it
    laquila.it
    laspezia.it
    latina.it
    lc.it
    le.it
    lecce.it
    lecco.it
    li.it
    livorno.it
    lo.it
    lodi.it
    lt.it
    lu.it
    lucca.it
    macerata.it
    mantova.it
    massa-carrara.it
    massacarrara.it
    matera.it
    mb.it
    mc.it
    me.it
    medio-campidano.it
    mediocampidano.it
    messina.it
    mi.it
    milan.it
    milano.it
    mn.it
    mo.it
    modena.it
    monza-brianza.it
    monza-e-della-brianza.it
    monza.it
    monzabrianza.it
    monzaebrianza.it
    monzaedellabrianza.it
    ms.it
    mt.it
    na.it
    naples.it
    napoli.it
    no.it
    novara.it
    nu.it
    nuoro.it
    og.it
    ogliastra.it
    olbia-tempio.it
    olbiatempio.it
    or.it
    oristano.it
    ot.it
    pa.it
    padova.it
    padua.it
    palermo.it
    parma.it
    pavia.it
    pc.it
    pd.it
    pe.it
    perugia.it
    pesaro-urbino.it
    pesarourbino.it
    pescara.it
    pg.it
    pi.it
    piacenza.it
    pisa.it
    pistoia.it
    pn.it
    po.it
    pordenone.it
    potenza.it
    pr.it
    prato.it
    pt.it
    pu.it
    pv.it
    pz.it
    ra.it
    ragusa.it
    ravenna.it
    rc.it
    re.it
    reggio-calabria.it
    reggio-emilia.it
    reggiocalabria.it
    reggioemilia.it
    rg.it
    ri.it
    rieti.it
    rimini.it
    rm.it
    rn.it
    ro.it
    roma.it
    rome.it
    rovigo.it
    sa.it
    salerno.it
    sassari.it
    savona.it
    si.it
    siena.it
    siracusa.it
    so.it
    sondrio.it
    sp.it
    sr.it
    ss.it
    suedtirol.it
    südtirol.it
    sv.it
    ta.it
    taranto.it
    te.it
    tempio-olbia.it
    tempioolbia.it
    teramo.it
    terni.it
    tn.it
    to.it
    torino.it
    tp.it
    tr.it
    trani-andria-barletta.it
    trani-barletta-andria.it
    traniandriabarletta.it
    tranibarlettaandria.it
    trapani.it
    trento.it
    treviso.it
    trieste.it
    ts.it
    turin.it
    tv.it
    ud.it
    udine.it
    urbino-pesaro.it
    urbinopesaro.it
    va.it
    varese.it
    vb.it
    vc.it
    ve.it
    venezia.it
    venice.it
    verbania.it
    vercelli.it
    verona.it
    vi.it
    vibo-valentia.it
    vibovalentia.it
    vicenza.it
    viterbo.it
    vr.it
    vs.it
    vt.it
    vv.it

    // je : http://www.channelisles.net/register-domains/
    // Confirmed by registry <nigel@channelisles.net> 2013-11-28
    je
    co.je
    net.je
    org.je

    // jm : http://www.com.jm/register.html
    *.jm

    // jo : http://www.dns.jo/Registration_policy.aspx
    jo
    com.jo
    org.jo
    net.jo
    edu.jo
    sch.jo
    gov.jo
    mil.jo
    name.jo

    // jobs : https://en.wikipedia.org/wiki/.jobs
    jobs

    // jp : https://en.wikipedia.org/wiki/.jp
    // http://jprs.co.jp/en/jpdomain.html
    // Submitted by registry <info@jprs.jp>
    jp
    // jp organizational type names
    ac.jp
    ad.jp
    co.jp
    ed.jp
    go.jp
    gr.jp
    lg.jp
    ne.jp
    or.jp
    // jp prefecture type names
    aichi.jp
    akita.jp
    aomori.jp
    chiba.jp
    ehime.jp
    fukui.jp
    fukuoka.jp
    fukushima.jp
    gifu.jp
    gunma.jp
    hiroshima.jp
    hokkaido.jp
    hyogo.jp
    ibaraki.jp
    ishikawa.jp
    iwate.jp
    kagawa.jp
    kagoshima.jp
    kanagawa.jp
    kochi.jp
    kumamoto.jp
    kyoto.jp
    mie.jp
    miyagi.jp
    miyazaki.jp
    nagano.jp
    nagasaki.jp
    nara.jp
    niigata.jp
    oita.jp
    okayama.jp
    okinawa.jp
    osaka.jp
    saga.jp
    saitama.jp
    shiga.jp
    shimane.jp
    shizuoka.jp
    tochigi.jp
    tokushima.jp
    tokyo.jp
    tottori.jp
    toyama.jp
    wakayama.jp
    yamagata.jp
    yamaguchi.jp
    yamanashi.jp
    栃木.jp
    愛知.jp
    愛媛.jp
    兵庫.jp
    熊本.jp
    茨城.jp
    北海道.jp
    千葉.jp
    和歌山.jp
    長崎.jp
    長野.jp
    新潟.jp
    青森.jp
    静岡.jp
    東京.jp
    石川.jp
    埼玉.jp
    三重.jp
    京都.jp
    佐賀.jp
    大分.jp
    大阪.jp
    奈良.jp
    宮城.jp
    宮崎.jp
    富山.jp
    山口.jp
    山形.jp
    山梨.jp
    岩手.jp
    岐阜.jp
    岡山.jp
    島根.jp
    広島.jp
    徳島.jp
    沖縄.jp
    滋賀.jp
    神奈川.jp
    福井.jp
    福岡.jp
    福島.jp
    秋田.jp
    群馬.jp
    香川.jp
    高知.jp
    鳥取.jp
    鹿児島.jp
    // jp geographic type names
    // http://jprs.jp/doc/rule/saisoku-1.html
    *.kawasaki.jp
    *.kitakyushu.jp
    *.kobe.jp
    *.nagoya.jp
    *.sapporo.jp
    *.sendai.jp
    *.yokohama.jp
    !city.kawasaki.jp
    !city.kitakyushu.jp
    !city.kobe.jp
    !city.nagoya.jp
    !city.sapporo.jp
    !city.sendai.jp
    !city.yokohama.jp
    // 4th level registration
    aisai.aichi.jp
    ama.aichi.jp
    anjo.aichi.jp
    asuke.aichi.jp
    chiryu.aichi.jp
    chita.aichi.jp
    fuso.aichi.jp
    gamagori.aichi.jp
    handa.aichi.jp
    hazu.aichi.jp
    hekinan.aichi.jp
    higashiura.aichi.jp
    ichinomiya.aichi.jp
    inazawa.aichi.jp
    inuyama.aichi.jp
    isshiki.aichi.jp
    iwakura.aichi.jp
    kanie.aichi.jp
    kariya.aichi.jp
    kasugai.aichi.jp
    kira.aichi.jp
    kiyosu.aichi.jp
    komaki.aichi.jp
    konan.aichi.jp
    kota.aichi.jp
    mihama.aichi.jp
    miyoshi.aichi.jp
    nishio.aichi.jp
    nisshin.aichi.jp
    obu.aichi.jp
    oguchi.aichi.jp
    oharu.aichi.jp
    okazaki.aichi.jp
    owariasahi.aichi.jp
    seto.aichi.jp
    shikatsu.aichi.jp
    shinshiro.aichi.jp
    shitara.aichi.jp
    tahara.aichi.jp
    takahama.aichi.jp
    tobishima.aichi.jp
    toei.aichi.jp
    togo.aichi.jp
    tokai.aichi.jp
    tokoname.aichi.jp
    toyoake.aichi.jp
    toyohashi.aichi.jp
    toyokawa.aichi.jp
    toyone.aichi.jp
    toyota.aichi.jp
    tsushima.aichi.jp
    yatomi.aichi.jp
    akita.akita.jp
    daisen.akita.jp
    fujisato.akita.jp
    gojome.akita.jp
    hachirogata.akita.jp
    happou.akita.jp
    higashinaruse.akita.jp
    honjo.akita.jp
    honjyo.akita.jp
    ikawa.akita.jp
    kamikoani.akita.jp
    kamioka.akita.jp
    katagami.akita.jp
    kazuno.akita.jp
    kitaakita.akita.jp
    kosaka.akita.jp
    kyowa.akita.jp
    misato.akita.jp
    mitane.akita.jp
    moriyoshi.akita.jp
    nikaho.akita.jp
    noshiro.akita.jp
    odate.akita.jp
    oga.akita.jp
    ogata.akita.jp
    semboku.akita.jp
    yokote.akita.jp
    yurihonjo.akita.jp
    aomori.aomori.jp
    gonohe.aomori.jp
    hachinohe.aomori.jp
    hashikami.aomori.jp
    hiranai.aomori.jp
    hirosaki.aomori.jp
    itayanagi.aomori.jp
    kuroishi.aomori.jp
    misawa.aomori.jp
    mutsu.aomori.jp
    nakadomari.aomori.jp
    noheji.aomori.jp
    oirase.aomori.jp
    owani.aomori.jp
    rokunohe.aomori.jp
    sannohe.aomori.jp
    shichinohe.aomori.jp
    shingo.aomori.jp
    takko.aomori.jp
    towada.aomori.jp
    tsugaru.aomori.jp
    tsuruta.aomori.jp
    abiko.chiba.jp
    asahi.chiba.jp
    chonan.chiba.jp
    chosei.chiba.jp
    choshi.chiba.jp
    chuo.chiba.jp
    funabashi.chiba.jp
    futtsu.chiba.jp
    hanamigawa.chiba.jp
    ichihara.chiba.jp
    ichikawa.chiba.jp
    ichinomiya.chiba.jp
    inzai.chiba.jp
    isumi.chiba.jp
    kamagaya.chiba.jp
    kamogawa.chiba.jp
    kashiwa.chiba.jp
    katori.chiba.jp
    katsuura.chiba.jp
    kimitsu.chiba.jp
    kisarazu.chiba.jp
    kozaki.chiba.jp
    kujukuri.chiba.jp
    kyonan.chiba.jp
    matsudo.chiba.jp
    midori.chiba.jp
    mihama.chiba.jp
    minamiboso.chiba.jp
    mobara.chiba.jp
    mutsuzawa.chiba.jp
    nagara.chiba.jp
    nagareyama.chiba.jp
    narashino.chiba.jp
    narita.chiba.jp
    noda.chiba.jp
    oamishirasato.chiba.jp
    omigawa.chiba.jp
    onjuku.chiba.jp
    otaki.chiba.jp
    sakae.chiba.jp
    sakura.chiba.jp
    shimofusa.chiba.jp
    shirako.chiba.jp
    shiroi.chiba.jp
    shisui.chiba.jp
    sodegaura.chiba.jp
    sosa.chiba.jp
    tako.chiba.jp
    tateyama.chiba.jp
    togane.chiba.jp
    tohnosho.chiba.jp
    tomisato.chiba.jp
    urayasu.chiba.jp
    yachimata.chiba.jp
    yachiyo.chiba.jp
    yokaichiba.chiba.jp
    yokoshibahikari.chiba.jp
    yotsukaido.chiba.jp
    ainan.ehime.jp
    honai.ehime.jp
    ikata.ehime.jp
    imabari.ehime.jp
    iyo.ehime.jp
    kamijima.ehime.jp
    kihoku.ehime.jp
    kumakogen.ehime.jp
    masaki.ehime.jp
    matsuno.ehime.jp
    matsuyama.ehime.jp
    namikata.ehime.jp
    niihama.ehime.jp
    ozu.ehime.jp
    saijo.ehime.jp
    seiyo.ehime.jp
    shikokuchuo.ehime.jp
    tobe.ehime.jp
    toon.ehime.jp
    uchiko.ehime.jp
    uwajima.ehime.jp
    yawatahama.ehime.jp
    echizen.fukui.jp
    eiheiji.fukui.jp
    fukui.fukui.jp
    ikeda.fukui.jp
    katsuyama.fukui.jp
    mihama.fukui.jp
    minamiechizen.fukui.jp
    obama.fukui.jp
    ohi.fukui.jp
    ono.fukui.jp
    sabae.fukui.jp
    sakai.fukui.jp
    takahama.fukui.jp
    tsuruga.fukui.jp
    wakasa.fukui.jp
    ashiya.fukuoka.jp
    buzen.fukuoka.jp
    chikugo.fukuoka.jp
    chikuho.fukuoka.jp
    chikujo.fukuoka.jp
    chikushino.fukuoka.jp
    chikuzen.fukuoka.jp
    chuo.fukuoka.jp
    dazaifu.fukuoka.jp
    fukuchi.fukuoka.jp
    hakata.fukuoka.jp
    higashi.fukuoka.jp
    hirokawa.fukuoka.jp
    hisayama.fukuoka.jp
    iizuka.fukuoka.jp
    inatsuki.fukuoka.jp
    kaho.fukuoka.jp
    kasuga.fukuoka.jp
    kasuya.fukuoka.jp
    kawara.fukuoka.jp
    keisen.fukuoka.jp
    koga.fukuoka.jp
    kurate.fukuoka.jp
    kurogi.fukuoka.jp
    kurume.fukuoka.jp
    minami.fukuoka.jp
    miyako.fukuoka.jp
    miyama.fukuoka.jp
    miyawaka.fukuoka.jp
    mizumaki.fukuoka.jp
    munakata.fukuoka.jp
    nakagawa.fukuoka.jp
    nakama.fukuoka.jp
    nishi.fukuoka.jp
    nogata.fukuoka.jp
    ogori.fukuoka.jp
    okagaki.fukuoka.jp
    okawa.fukuoka.jp
    oki.fukuoka.jp
    omuta.fukuoka.jp
    onga.fukuoka.jp
    onojo.fukuoka.jp
    oto.fukuoka.jp
    saigawa.fukuoka.jp
    sasaguri.fukuoka.jp
    shingu.fukuoka.jp
    shinyoshitomi.fukuoka.jp
    shonai.fukuoka.jp
    soeda.fukuoka.jp
    sue.fukuoka.jp
    tachiarai.fukuoka.jp
    tagawa.fukuoka.jp
    takata.fukuoka.jp
    toho.fukuoka.jp
    toyotsu.fukuoka.jp
    tsuiki.fukuoka.jp
    ukiha.fukuoka.jp
    umi.fukuoka.jp
    usui.fukuoka.jp
    yamada.fukuoka.jp
    yame.fukuoka.jp
    yanagawa.fukuoka.jp
    yukuhashi.fukuoka.jp
    aizubange.fukushima.jp
    aizumisato.fukushima.jp
    aizuwakamatsu.fukushima.jp
    asakawa.fukushima.jp
    bandai.fukushima.jp
    date.fukushima.jp
    fukushima.fukushima.jp
    furudono.fukushima.jp
    futaba.fukushima.jp
    hanawa.fukushima.jp
    higashi.fukushima.jp
    hirata.fukushima.jp
    hirono.fukushima.jp
    iitate.fukushima.jp
    inawashiro.fukushima.jp
    ishikawa.fukushima.jp
    iwaki.fukushima.jp
    izumizaki.fukushima.jp
    kagamiishi.fukushima.jp
    kaneyama.fukushima.jp
    kawamata.fukushima.jp
    kitakata.fukushima.jp
    kitashiobara.fukushima.jp
    koori.fukushima.jp
    koriyama.fukushima.jp
    kunimi.fukushima.jp
    miharu.fukushima.jp
    mishima.fukushima.jp
    namie.fukushima.jp
    nango.fukushima.jp
    nishiaizu.fukushima.jp
    nishigo.fukushima.jp
    okuma.fukushima.jp
    omotego.fukushima.jp
    ono.fukushima.jp
    otama.fukushima.jp
    samegawa.fukushima.jp
    shimogo.fukushima.jp
    shirakawa.fukushima.jp
    showa.fukushima.jp
    soma.fukushima.jp
    sukagawa.fukushima.jp
    taishin.fukushima.jp
    tamakawa.fukushima.jp
    tanagura.fukushima.jp
    tenei.fukushima.jp
    yabuki.fukushima.jp
    yamato.fukushima.jp
    yamatsuri.fukushima.jp
    yanaizu.fukushima.jp
    yugawa.fukushima.jp
    anpachi.gifu.jp
    ena.gifu.jp
    gifu.gifu.jp
    ginan.gifu.jp
    godo.gifu.jp
    gujo.gifu.jp
    hashima.gifu.jp
    hichiso.gifu.jp
    hida.gifu.jp
    higashishirakawa.gifu.jp
    ibigawa.gifu.jp
    ikeda.gifu.jp
    kakamigahara.gifu.jp
    kani.gifu.jp
    kasahara.gifu.jp
    kasamatsu.gifu.jp
    kawaue.gifu.jp
    kitagata.gifu.jp
    mino.gifu.jp
    minokamo.gifu.jp
    mitake.gifu.jp
    mizunami.gifu.jp
    motosu.gifu.jp
    nakatsugawa.gifu.jp
    ogaki.gifu.jp
    sakahogi.gifu.jp
    seki.gifu.jp
    sekigahara.gifu.jp
    shirakawa.gifu.jp
    tajimi.gifu.jp
    takayama.gifu.jp
    tarui.gifu.jp
    toki.gifu.jp
    tomika.gifu.jp
    wanouchi.gifu.jp
    yamagata.gifu.jp
    yaotsu.gifu.jp
    yoro.gifu.jp
    annaka.gunma.jp
    chiyoda.gunma.jp
    fujioka.gunma.jp
    higashiagatsuma.gunma.jp
    isesaki.gunma.jp
    itakura.gunma.jp
    kanna.gunma.jp
    kanra.gunma.jp
    katashina.gunma.jp
    kawaba.gunma.jp
    kiryu.gunma.jp
    kusatsu.gunma.jp
    maebashi.gunma.jp
    meiwa.gunma.jp
    midori.gunma.jp
    minakami.gunma.jp
    naganohara.gunma.jp
    nakanojo.gunma.jp
    nanmoku.gunma.jp
    numata.gunma.jp
    oizumi.gunma.jp
    ora.gunma.jp
    ota.gunma.jp
    shibukawa.gunma.jp
    shimonita.gunma.jp
    shinto.gunma.jp
    showa.gunma.jp
    takasaki.gunma.jp
    takayama.gunma.jp
    tamamura.gunma.jp
    tatebayashi.gunma.jp
    tomioka.gunma.jp
    tsukiyono.gunma.jp
    tsumagoi.gunma.jp
    ueno.gunma.jp
    yoshioka.gunma.jp
    asaminami.hiroshima.jp
    daiwa.hiroshima.jp
    etajima.hiroshima.jp
    fuchu.hiroshima.jp
    fukuyama.hiroshima.jp
    hatsukaichi.hiroshima.jp
    higashihiroshima.hiroshima.jp
    hongo.hiroshima.jp
    jinsekikogen.hiroshima.jp
    kaita.hiroshima.jp
    kui.hiroshima.jp
    kumano.hiroshima.jp
    kure.hiroshima.jp
    mihara.hiroshima.jp
    miyoshi.hiroshima.jp
    naka.hiroshima.jp
    onomichi.hiroshima.jp
    osakikamijima.hiroshima.jp
    otake.hiroshima.jp
    saka.hiroshima.jp
    sera.hiroshima.jp
    seranishi.hiroshima.jp
    shinichi.hiroshima.jp
    shobara.hiroshima.jp
    takehara.hiroshima.jp
    abashiri.hokkaido.jp
    abira.hokkaido.jp
    aibetsu.hokkaido.jp
    akabira.hokkaido.jp
    akkeshi.hokkaido.jp
    asahikawa.hokkaido.jp
    ashibetsu.hokkaido.jp
    ashoro.hokkaido.jp
    assabu.hokkaido.jp
    atsuma.hokkaido.jp
    bibai.hokkaido.jp
    biei.hokkaido.jp
    bifuka.hokkaido.jp
    bihoro.hokkaido.jp
    biratori.hokkaido.jp
    chippubetsu.hokkaido.jp
    chitose.hokkaido.jp
    date.hokkaido.jp
    ebetsu.hokkaido.jp
    embetsu.hokkaido.jp
    eniwa.hokkaido.jp
    erimo.hokkaido.jp
    esan.hokkaido.jp
    esashi.hokkaido.jp
    fukagawa.hokkaido.jp
    fukushima.hokkaido.jp
    furano.hokkaido.jp
    furubira.hokkaido.jp
    haboro.hokkaido.jp
    hakodate.hokkaido.jp
    hamatonbetsu.hokkaido.jp
    hidaka.hokkaido.jp
    higashikagura.hokkaido.jp
    higashikawa.hokkaido.jp
    hiroo.hokkaido.jp
    hokuryu.hokkaido.jp
    hokuto.hokkaido.jp
    honbetsu.hokkaido.jp
    horokanai.hokkaido.jp
    horonobe.hokkaido.jp
    ikeda.hokkaido.jp
    imakane.hokkaido.jp
    ishikari.hokkaido.jp
    iwamizawa.hokkaido.jp
    iwanai.hokkaido.jp
    kamifurano.hokkaido.jp
    kamikawa.hokkaido.jp
    kamishihoro.hokkaido.jp
    kamisunagawa.hokkaido.jp
    kamoenai.hokkaido.jp
    kayabe.hokkaido.jp
    kembuchi.hokkaido.jp
    kikonai.hokkaido.jp
    kimobetsu.hokkaido.jp
    kitahiroshima.hokkaido.jp
    kitami.hokkaido.jp
    kiyosato.hokkaido.jp
    koshimizu.hokkaido.jp
    kunneppu.hokkaido.jp
    kuriyama.hokkaido.jp
    kuromatsunai.hokkaido.jp
    kushiro.hokkaido.jp
    kutchan.hokkaido.jp
    kyowa.hokkaido.jp
    mashike.hokkaido.jp
    matsumae.hokkaido.jp
    mikasa.hokkaido.jp
    minamifurano.hokkaido.jp
    mombetsu.hokkaido.jp
    moseushi.hokkaido.jp
    mukawa.hokkaido.jp
    muroran.hokkaido.jp
    naie.hokkaido.jp
    nakagawa.hokkaido.jp
    nakasatsunai.hokkaido.jp
    nakatombetsu.hokkaido.jp
    nanae.hokkaido.jp
    nanporo.hokkaido.jp
    nayoro.hokkaido.jp
    nemuro.hokkaido.jp
    niikappu.hokkaido.jp
    niki.hokkaido.jp
    nishiokoppe.hokkaido.jp
    noboribetsu.hokkaido.jp
    numata.hokkaido.jp
    obihiro.hokkaido.jp
    obira.hokkaido.jp
    oketo.hokkaido.jp
    okoppe.hokkaido.jp
    otaru.hokkaido.jp
    otobe.hokkaido.jp
    otofuke.hokkaido.jp
    otoineppu.hokkaido.jp
    oumu.hokkaido.jp
    ozora.hokkaido.jp
    pippu.hokkaido.jp
    rankoshi.hokkaido.jp
    rebun.hokkaido.jp
    rikubetsu.hokkaido.jp
    rishiri.hokkaido.jp
    rishirifuji.hokkaido.jp
    saroma.hokkaido.jp
    sarufutsu.hokkaido.jp
    shakotan.hokkaido.jp
    shari.hokkaido.jp
    shibecha.hokkaido.jp
    shibetsu.hokkaido.jp
    shikabe.hokkaido.jp
    shikaoi.hokkaido.jp
    shimamaki.hokkaido.jp
    shimizu.hokkaido.jp
    shimokawa.hokkaido.jp
    shinshinotsu.hokkaido.jp
    shintoku.hokkaido.jp
    shiranuka.hokkaido.jp
    shiraoi.hokkaido.jp
    shiriuchi.hokkaido.jp
    sobetsu.hokkaido.jp
    sunagawa.hokkaido.jp
    taiki.hokkaido.jp
    takasu.hokkaido.jp
    takikawa.hokkaido.jp
    takinoue.hokkaido.jp
    teshikaga.hokkaido.jp
    tobetsu.hokkaido.jp
    tohma.hokkaido.jp
    tomakomai.hokkaido.jp
    tomari.hokkaido.jp
    toya.hokkaido.jp
    toyako.hokkaido.jp
    toyotomi.hokkaido.jp
    toyoura.hokkaido.jp
    tsubetsu.hokkaido.jp
    tsukigata.hokkaido.jp
    urakawa.hokkaido.jp
    urausu.hokkaido.jp
    uryu.hokkaido.jp
    utashinai.hokkaido.jp
    wakkanai.hokkaido.jp
    wassamu.hokkaido.jp
    yakumo.hokkaido.jp
    yoichi.hokkaido.jp
    aioi.hyogo.jp
    akashi.hyogo.jp
    ako.hyogo.jp
    amagasaki.hyogo.jp
    aogaki.hyogo.jp
    asago.hyogo.jp
    ashiya.hyogo.jp
    awaji.hyogo.jp
    fukusaki.hyogo.jp
    goshiki.hyogo.jp
    harima.hyogo.jp
    himeji.hyogo.jp
    ichikawa.hyogo.jp
    inagawa.hyogo.jp
    itami.hyogo.jp
    kakogawa.hyogo.jp
    kamigori.hyogo.jp
    kamikawa.hyogo.jp
    kasai.hyogo.jp
    kasuga.hyogo.jp
    kawanishi.hyogo.jp
    miki.hyogo.jp
    minamiawaji.hyogo.jp
    nishinomiya.hyogo.jp
    nishiwaki.hyogo.jp
    ono.hyogo.jp
    sanda.hyogo.jp
    sannan.hyogo.jp
    sasayama.hyogo.jp
    sayo.hyogo.jp
    shingu.hyogo.jp
    shinonsen.hyogo.jp
    shiso.hyogo.jp
    sumoto.hyogo.jp
    taishi.hyogo.jp
    taka.hyogo.jp
    takarazuka.hyogo.jp
    takasago.hyogo.jp
    takino.hyogo.jp
    tamba.hyogo.jp
    tatsuno.hyogo.jp
    toyooka.hyogo.jp
    yabu.hyogo.jp
    yashiro.hyogo.jp
    yoka.hyogo.jp
    yokawa.hyogo.jp
    ami.ibaraki.jp
    asahi.ibaraki.jp
    bando.ibaraki.jp
    chikusei.ibaraki.jp
    daigo.ibaraki.jp
    fujishiro.ibaraki.jp
    hitachi.ibaraki.jp
    hitachinaka.ibaraki.jp
    hitachiomiya.ibaraki.jp
    hitachiota.ibaraki.jp
    ibaraki.ibaraki.jp
    ina.ibaraki.jp
    inashiki.ibaraki.jp
    itako.ibaraki.jp
    iwama.ibaraki.jp
    joso.ibaraki.jp
    kamisu.ibaraki.jp
    kasama.ibaraki.jp
    kashima.ibaraki.jp
    kasumigaura.ibaraki.jp
    koga.ibaraki.jp
    miho.ibaraki.jp
    mito.ibaraki.jp
    moriya.ibaraki.jp
    naka.ibaraki.jp
    namegata.ibaraki.jp
    oarai.ibaraki.jp
    ogawa.ibaraki.jp
    omitama.ibaraki.jp
    ryugasaki.ibaraki.jp
    sakai.ibaraki.jp
    sakuragawa.ibaraki.jp
    shimodate.ibaraki.jp
    shimotsuma.ibaraki.jp
    shirosato.ibaraki.jp
    sowa.ibaraki.jp
    suifu.ibaraki.jp
    takahagi.ibaraki.jp
    tamatsukuri.ibaraki.jp
    tokai.ibaraki.jp
    tomobe.ibaraki.jp
    tone.ibaraki.jp
    toride.ibaraki.jp
    tsuchiura.ibaraki.jp
    tsukuba.ibaraki.jp
    uchihara.ibaraki.jp
    ushiku.ibaraki.jp
    yachiyo.ibaraki.jp
    yamagata.ibaraki.jp
    yawara.ibaraki.jp
    yuki.ibaraki.jp
    anamizu.ishikawa.jp
    hakui.ishikawa.jp
    hakusan.ishikawa.jp
    kaga.ishikawa.jp
    kahoku.ishikawa.jp
    kanazawa.ishikawa.jp
    kawakita.ishikawa.jp
    komatsu.ishikawa.jp
    nakanoto.ishikawa.jp
    nanao.ishikawa.jp
    nomi.ishikawa.jp
    nonoichi.ishikawa.jp
    noto.ishikawa.jp
    shika.ishikawa.jp
    suzu.ishikawa.jp
    tsubata.ishikawa.jp
    tsurugi.ishikawa.jp
    uchinada.ishikawa.jp
    wajima.ishikawa.jp
    fudai.iwate.jp
    fujisawa.iwate.jp
    hanamaki.iwate.jp
    hiraizumi.iwate.jp
    hirono.iwate.jp
    ichinohe.iwate.jp
    ichinoseki.iwate.jp
    iwaizumi.iwate.jp
    iwate.iwate.jp
    joboji.iwate.jp
    kamaishi.iwate.jp
    kanegasaki.iwate.jp
    karumai.iwate.jp
    kawai.iwate.jp
    kitakami.iwate.jp
    kuji.iwate.jp
    kunohe.iwate.jp
    kuzumaki.iwate.jp
    miyako.iwate.jp
    mizusawa.iwate.jp
    morioka.iwate.jp
    ninohe.iwate.jp
    noda.iwate.jp
    ofunato.iwate.jp
    oshu.iwate.jp
    otsuchi.iwate.jp
    rikuzentakata.iwate.jp
    shiwa.iwate.jp
    shizukuishi.iwate.jp
    sumita.iwate.jp
    tanohata.iwate.jp
    tono.iwate.jp
    yahaba.iwate.jp
    yamada.iwate.jp
    ayagawa.kagawa.jp
    higashikagawa.kagawa.jp
    kanonji.kagawa.jp
    kotohira.kagawa.jp
    manno.kagawa.jp
    marugame.kagawa.jp
    mitoyo.kagawa.jp
    naoshima.kagawa.jp
    sanuki.kagawa.jp
    tadotsu.kagawa.jp
    takamatsu.kagawa.jp
    tonosho.kagawa.jp
    uchinomi.kagawa.jp
    utazu.kagawa.jp
    zentsuji.kagawa.jp
    akune.kagoshima.jp
    amami.kagoshima.jp
    hioki.kagoshima.jp
    isa.kagoshima.jp
    isen.kagoshima.jp
    izumi.kagoshima.jp
    kagoshima.kagoshima.jp
    kanoya.kagoshima.jp
    kawanabe.kagoshima.jp
    kinko.kagoshima.jp
    kouyama.kagoshima.jp
    makurazaki.kagoshima.jp
    matsumoto.kagoshima.jp
    minamitane.kagoshima.jp
    nakatane.kagoshima.jp
    nishinoomote.kagoshima.jp
    satsumasendai.kagoshima.jp
    soo.kagoshima.jp
    tarumizu.kagoshima.jp
    yusui.kagoshima.jp
    aikawa.kanagawa.jp
    atsugi.kanagawa.jp
    ayase.kanagawa.jp
    chigasaki.kanagawa.jp
    ebina.kanagawa.jp
    fujisawa.kanagawa.jp
    hadano.kanagawa.jp
    hakone.kanagawa.jp
    hiratsuka.kanagawa.jp
    isehara.kanagawa.jp
    kaisei.kanagawa.jp
    kamakura.kanagawa.jp
    kiyokawa.kanagawa.jp
    matsuda.kanagawa.jp
    minamiashigara.kanagawa.jp
    miura.kanagawa.jp
    nakai.kanagawa.jp
    ninomiya.kanagawa.jp
    odawara.kanagawa.jp
    oi.kanagawa.jp
    oiso.kanagawa.jp
    sagamihara.kanagawa.jp
    samukawa.kanagawa.jp
    tsukui.kanagawa.jp
    yamakita.kanagawa.jp
    yamato.kanagawa.jp
    yokosuka.kanagawa.jp
    yugawara.kanagawa.jp
    zama.kanagawa.jp
    zushi.kanagawa.jp
    aki.kochi.jp
    geisei.kochi.jp
    hidaka.kochi.jp
    higashitsuno.kochi.jp
    ino.kochi.jp
    kagami.kochi.jp
    kami.kochi.jp
    kitagawa.kochi.jp
    kochi.kochi.jp
    mihara.kochi.jp
    motoyama.kochi.jp
    muroto.kochi.jp
    nahari.kochi.jp
    nakamura.kochi.jp
    nankoku.kochi.jp
    nishitosa.kochi.jp
    niyodogawa.kochi.jp
    ochi.kochi.jp
    okawa.kochi.jp
    otoyo.kochi.jp
    otsuki.kochi.jp
    sakawa.kochi.jp
    sukumo.kochi.jp
    susaki.kochi.jp
    tosa.kochi.jp
    tosashimizu.kochi.jp
    toyo.kochi.jp
    tsuno.kochi.jp
    umaji.kochi.jp
    yasuda.kochi.jp
    yusuhara.kochi.jp
    amakusa.kumamoto.jp
    arao.kumamoto.jp
    aso.kumamoto.jp
    choyo.kumamoto.jp
    gyokuto.kumamoto.jp
    kamiamakusa.kumamoto.jp
    kikuchi.kumamoto.jp
    kumamoto.kumamoto.jp
    mashiki.kumamoto.jp
    mifune.kumamoto.jp
    minamata.kumamoto.jp
    minamioguni.kumamoto.jp
    nagasu.kumamoto.jp
    nishihara.kumamoto.jp
    oguni.kumamoto.jp
    ozu.kumamoto.jp
    sumoto.kumamoto.jp
    takamori.kumamoto.jp
    uki.kumamoto.jp
    uto.kumamoto.jp
    yamaga.kumamoto.jp
    yamato.kumamoto.jp
    yatsushiro.kumamoto.jp
    ayabe.kyoto.jp
    fukuchiyama.kyoto.jp
    higashiyama.kyoto.jp
    ide.kyoto.jp
    ine.kyoto.jp
    joyo.kyoto.jp
    kameoka.kyoto.jp
    kamo.kyoto.jp
    kita.kyoto.jp
    kizu.kyoto.jp
    kumiyama.kyoto.jp
    kyotamba.kyoto.jp
    kyotanabe.kyoto.jp
    kyotango.kyoto.jp
    maizuru.kyoto.jp
    minami.kyoto.jp
    minamiyamashiro.kyoto.jp
    miyazu.kyoto.jp
    muko.kyoto.jp
    nagaokakyo.kyoto.jp
    nakagyo.kyoto.jp
    nantan.kyoto.jp
    oyamazaki.kyoto.jp
    sakyo.kyoto.jp
    seika.kyoto.jp
    tanabe.kyoto.jp
    uji.kyoto.jp
    ujitawara.kyoto.jp
    wazuka.kyoto.jp
    yamashina.kyoto.jp
    yawata.kyoto.jp
    asahi.mie.jp
    inabe.mie.jp
    ise.mie.jp
    kameyama.mie.jp
    kawagoe.mie.jp
    kiho.mie.jp
    kisosaki.mie.jp
    kiwa.mie.jp
    komono.mie.jp
    kumano.mie.jp
    kuwana.mie.jp
    matsusaka.mie.jp
    meiwa.mie.jp
    mihama.mie.jp
    minamiise.mie.jp
    misugi.mie.jp
    miyama.mie.jp
    nabari.mie.jp
    shima.mie.jp
    suzuka.mie.jp
    tado.mie.jp
    taiki.mie.jp
    taki.mie.jp
    tamaki.mie.jp
    toba.mie.jp
    tsu.mie.jp
    udono.mie.jp
    ureshino.mie.jp
    watarai.mie.jp
    yokkaichi.mie.jp
    furukawa.miyagi.jp
    higashimatsushima.miyagi.jp
    ishinomaki.miyagi.jp
    iwanuma.miyagi.jp
    kakuda.miyagi.jp
    kami.miyagi.jp
    kawasaki.miyagi.jp
    marumori.miyagi.jp
    matsushima.miyagi.jp
    minamisanriku.miyagi.jp
    misato.miyagi.jp
    murata.miyagi.jp
    natori.miyagi.jp
    ogawara.miyagi.jp
    ohira.miyagi.jp
    onagawa.miyagi.jp
    osaki.miyagi.jp
    rifu.miyagi.jp
    semine.miyagi.jp
    shibata.miyagi.jp
    shichikashuku.miyagi.jp
    shikama.miyagi.jp
    shiogama.miyagi.jp
    shiroishi.miyagi.jp
    tagajo.miyagi.jp
    taiwa.miyagi.jp
    tome.miyagi.jp
    tomiya.miyagi.jp
    wakuya.miyagi.jp
    watari.miyagi.jp
    yamamoto.miyagi.jp
    zao.miyagi.jp
    aya.miyazaki.jp
    ebino.miyazaki.jp
    gokase.miyazaki.jp
    hyuga.miyazaki.jp
    kadogawa.miyazaki.jp
    kawaminami.miyazaki.jp
    kijo.miyazaki.jp
    kitagawa.miyazaki.jp
    kitakata.miyazaki.jp
    kitaura.miyazaki.jp
    kobayashi.miyazaki.jp
    kunitomi.miyazaki.jp
    kushima.miyazaki.jp
    mimata.miyazaki.jp
    miyakonojo.miyazaki.jp
    miyazaki.miyazaki.jp
    morotsuka.miyazaki.jp
    nichinan.miyazaki.jp
    nishimera.miyazaki.jp
    nobeoka.miyazaki.jp
    saito.miyazaki.jp
    shiiba.miyazaki.jp
    shintomi.miyazaki.jp
    takaharu.miyazaki.jp
    takanabe.miyazaki.jp
    takazaki.miyazaki.jp
    tsuno.miyazaki.jp
    achi.nagano.jp
    agematsu.nagano.jp
    anan.nagano.jp
    aoki.nagano.jp
    asahi.nagano.jp
    azumino.nagano.jp
    chikuhoku.nagano.jp
    chikuma.nagano.jp
    chino.nagano.jp
    fujimi.nagano.jp
    hakuba.nagano.jp
    hara.nagano.jp
    hiraya.nagano.jp
    iida.nagano.jp
    iijima.nagano.jp
    iiyama.nagano.jp
    iizuna.nagano.jp
    ikeda.nagano.jp
    ikusaka.nagano.jp
    ina.nagano.jp
    karuizawa.nagano.jp
    kawakami.nagano.jp
    kiso.nagano.jp
    kisofukushima.nagano.jp
    kitaaiki.nagano.jp
    komagane.nagano.jp
    komoro.nagano.jp
    matsukawa.nagano.jp
    matsumoto.nagano.jp
    miasa.nagano.jp
    minamiaiki.nagano.jp
    minamimaki.nagano.jp
    minamiminowa.nagano.jp
    minowa.nagano.jp
    miyada.nagano.jp
    miyota.nagano.jp
    mochizuki.nagano.jp
    nagano.nagano.jp
    nagawa.nagano.jp
    nagiso.nagano.jp
    nakagawa.nagano.jp
    nakano.nagano.jp
    nozawaonsen.nagano.jp
    obuse.nagano.jp
    ogawa.nagano.jp
    okaya.nagano.jp
    omachi.nagano.jp
    omi.nagano.jp
    ookuwa.nagano.jp
    ooshika.nagano.jp
    otaki.nagano.jp
    otari.nagano.jp
    sakae.nagano.jp
    sakaki.nagano.jp
    saku.nagano.jp
    sakuho.nagano.jp
    shimosuwa.nagano.jp
    shinanomachi.nagano.jp
    shiojiri.nagano.jp
    suwa.nagano.jp
    suzaka.nagano.jp
    takagi.nagano.jp
    takamori.nagano.jp
    takayama.nagano.jp
    tateshina.nagano.jp
    tatsuno.nagano.jp
    togakushi.nagano.jp
    togura.nagano.jp
    tomi.nagano.jp
    ueda.nagano.jp
    wada.nagano.jp
    yamagata.nagano.jp
    yamanouchi.nagano.jp
    yasaka.nagano.jp
    yasuoka.nagano.jp
    chijiwa.nagasaki.jp
    futsu.nagasaki.jp
    goto.nagasaki.jp
    hasami.nagasaki.jp
    hirado.nagasaki.jp
    iki.nagasaki.jp
    isahaya.nagasaki.jp
    kawatana.nagasaki.jp
    kuchinotsu.nagasaki.jp
    matsuura.nagasaki.jp
    nagasaki.nagasaki.jp
    obama.nagasaki.jp
    omura.nagasaki.jp
    oseto.nagasaki.jp
    saikai.nagasaki.jp
    sasebo.nagasaki.jp
    seihi.nagasaki.jp
    shimabara.nagasaki.jp
    shinkamigoto.nagasaki.jp
    togitsu.nagasaki.jp
    tsushima.nagasaki.jp
    unzen.nagasaki.jp
    ando.nara.jp
    gose.nara.jp
    heguri.nara.jp
    higashiyoshino.nara.jp
    ikaruga.nara.jp
    ikoma.nara.jp
    kamikitayama.nara.jp
    kanmaki.nara.jp
    kashiba.nara.jp
    kashihara.nara.jp
    katsuragi.nara.jp
    kawai.nara.jp
    kawakami.nara.jp
    kawanishi.nara.jp
    koryo.nara.jp
    kurotaki.nara.jp
    mitsue.nara.jp
    miyake.nara.jp
    nara.nara.jp
    nosegawa.nara.jp
    oji.nara.jp
    ouda.nara.jp
    oyodo.nara.jp
    sakurai.nara.jp
    sango.nara.jp
    shimoichi.nara.jp
    shimokitayama.nara.jp
    shinjo.nara.jp
    soni.nara.jp
    takatori.nara.jp
    tawaramoto.nara.jp
    tenkawa.nara.jp
    tenri.nara.jp
    uda.nara.jp
    yamatokoriyama.nara.jp
    yamatotakada.nara.jp
    yamazoe.nara.jp
    yoshino.nara.jp
    aga.niigata.jp
    agano.niigata.jp
    gosen.niigata.jp
    itoigawa.niigata.jp
    izumozaki.niigata.jp
    joetsu.niigata.jp
    kamo.niigata.jp
    kariwa.niigata.jp
    kashiwazaki.niigata.jp
    minamiuonuma.niigata.jp
    mitsuke.niigata.jp
    muika.niigata.jp
    murakami.niigata.jp
    myoko.niigata.jp
    nagaoka.niigata.jp
    niigata.niigata.jp
    ojiya.niigata.jp
    omi.niigata.jp
    sado.niigata.jp
    sanjo.niigata.jp
    seiro.niigata.jp
    seirou.niigata.jp
    sekikawa.niigata.jp
    shibata.niigata.jp
    tagami.niigata.jp
    tainai.niigata.jp
    tochio.niigata.jp
    tokamachi.niigata.jp
    tsubame.niigata.jp
    tsunan.niigata.jp
    uonuma.niigata.jp
    yahiko.niigata.jp
    yoita.niigata.jp
    yuzawa.niigata.jp
    beppu.oita.jp
    bungoono.oita.jp
    bungotakada.oita.jp
    hasama.oita.jp
    hiji.oita.jp
    himeshima.oita.jp
    hita.oita.jp
    kamitsue.oita.jp
    kokonoe.oita.jp
    kuju.oita.jp
    kunisaki.oita.jp
    kusu.oita.jp
    oita.oita.jp
    saiki.oita.jp
    taketa.oita.jp
    tsukumi.oita.jp
    usa.oita.jp
    usuki.oita.jp
    yufu.oita.jp
    akaiwa.okayama.jp
    asakuchi.okayama.jp
    bizen.okayama.jp
    hayashima.okayama.jp
    ibara.okayama.jp
    kagamino.okayama.jp
    kasaoka.okayama.jp
    kibichuo.okayama.jp
    kumenan.okayama.jp
    kurashiki.okayama.jp
    maniwa.okayama.jp
    misaki.okayama.jp
    nagi.okayama.jp
    niimi.okayama.jp
    nishiawakura.okayama.jp
    okayama.okayama.jp
    satosho.okayama.jp
    setouchi.okayama.jp
    shinjo.okayama.jp
    shoo.okayama.jp
    soja.okayama.jp
    takahashi.okayama.jp
    tamano.okayama.jp
    tsuyama.okayama.jp
    wake.okayama.jp
    yakage.okayama.jp
    aguni.okinawa.jp
    ginowan.okinawa.jp
    ginoza.okinawa.jp
    gushikami.okinawa.jp
    haebaru.okinawa.jp
    higashi.okinawa.jp
    hirara.okinawa.jp
    iheya.okinawa.jp
    ishigaki.okinawa.jp
    ishikawa.okinawa.jp
    itoman.okinawa.jp
    izena.okinawa.jp
    kadena.okinawa.jp
    kin.okinawa.jp
    kitadaito.okinawa.jp
    kitanakagusuku.okinawa.jp
    kumejima.okinawa.jp
    kunigami.okinawa.jp
    minamidaito.okinawa.jp
    motobu.okinawa.jp
    nago.okinawa.jp
    naha.okinawa.jp
    nakagusuku.okinawa.jp
    nakijin.okinawa.jp
    nanjo.okinawa.jp
    nishihara.okinawa.jp
    ogimi.okinawa.jp
    okinawa.okinawa.jp
    onna.okinawa.jp
    shimoji.okinawa.jp
    taketomi.okinawa.jp
    tarama.okinawa.jp
    tokashiki.okinawa.jp
    tomigusuku.okinawa.jp
    tonaki.okinawa.jp
    urasoe.okinawa.jp
    uruma.okinawa.jp
    yaese.okinawa.jp
    yomitan.okinawa.jp
    yonabaru.okinawa.jp
    yonaguni.okinawa.jp
    zamami.okinawa.jp
    abeno.osaka.jp
    chihayaakasaka.osaka.jp
    chuo.osaka.jp
    daito.osaka.jp
    fujiidera.osaka.jp
    habikino.osaka.jp
    hannan.osaka.jp
    higashiosaka.osaka.jp
    higashisumiyoshi.osaka.jp
    higashiyodogawa.osaka.jp
    hirakata.osaka.jp
    ibaraki.osaka.jp
    ikeda.osaka.jp
    izumi.osaka.jp
    izumiotsu.osaka.jp
    izumisano.osaka.jp
    kadoma.osaka.jp
    kaizuka.osaka.jp
    kanan.osaka.jp
    kashiwara.osaka.jp
    katano.osaka.jp
    kawachinagano.osaka.jp
    kishiwada.osaka.jp
    kita.osaka.jp
    kumatori.osaka.jp
    matsubara.osaka.jp
    minato.osaka.jp
    minoh.osaka.jp
    misaki.osaka.jp
    moriguchi.osaka.jp
    neyagawa.osaka.jp
    nishi.osaka.jp
    nose.osaka.jp
    osakasayama.osaka.jp
    sakai.osaka.jp
    sayama.osaka.jp
    sennan.osaka.jp
    settsu.osaka.jp
    shijonawate.osaka.jp
    shimamoto.osaka.jp
    suita.osaka.jp
    tadaoka.osaka.jp
    taishi.osaka.jp
    tajiri.osaka.jp
    takaishi.osaka.jp
    takatsuki.osaka.jp
    tondabayashi.osaka.jp
    toyonaka.osaka.jp
    toyono.osaka.jp
    yao.osaka.jp
    ariake.saga.jp
    arita.saga.jp
    fukudomi.saga.jp
    genkai.saga.jp
    hamatama.saga.jp
    hizen.saga.jp
    imari.saga.jp
    kamimine.saga.jp
    kanzaki.saga.jp
    karatsu.saga.jp
    kashima.saga.jp
    kitagata.saga.jp
    kitahata.saga.jp
    kiyama.saga.jp
    kouhoku.saga.jp
    kyuragi.saga.jp
    nishiarita.saga.jp
    ogi.saga.jp
    omachi.saga.jp
    ouchi.saga.jp
    saga.saga.jp
    shiroishi.saga.jp
    taku.saga.jp
    tara.saga.jp
    tosu.saga.jp
    yoshinogari.saga.jp
    arakawa.saitama.jp
    asaka.saitama.jp
    chichibu.saitama.jp
    fujimi.saitama.jp
    fujimino.saitama.jp
    fukaya.saitama.jp
    hanno.saitama.jp
    hanyu.saitama.jp
    hasuda.saitama.jp
    hatogaya.saitama.jp
    hatoyama.saitama.jp
    hidaka.saitama.jp
    higashichichibu.saitama.jp
    higashimatsuyama.saitama.jp
    honjo.saitama.jp
    ina.saitama.jp
    iruma.saitama.jp
    iwatsuki.saitama.jp
    kamiizumi.saitama.jp
    kamikawa.saitama.jp
    kamisato.saitama.jp
    kasukabe.saitama.jp
    kawagoe.saitama.jp
    kawaguchi.saitama.jp
    kawajima.saitama.jp
    kazo.saitama.jp
    kitamoto.saitama.jp
    koshigaya.saitama.jp
    kounosu.saitama.jp
    kuki.saitama.jp
    kumagaya.saitama.jp
    matsubushi.saitama.jp
    minano.saitama.jp
    misato.saitama.jp
    miyashiro.saitama.jp
    miyoshi.saitama.jp
    moroyama.saitama.jp
    nagatoro.saitama.jp
    namegawa.saitama.jp
    niiza.saitama.jp
    ogano.saitama.jp
    ogawa.saitama.jp
    ogose.saitama.jp
    okegawa.saitama.jp
    omiya.saitama.jp
    otaki.saitama.jp
    ranzan.saitama.jp
    ryokami.saitama.jp
    saitama.saitama.jp
    sakado.saitama.jp
    satte.saitama.jp
    sayama.saitama.jp
    shiki.saitama.jp
    shiraoka.saitama.jp
    soka.saitama.jp
    sugito.saitama.jp
    toda.saitama.jp
    tokigawa.saitama.jp
    tokorozawa.saitama.jp
    tsurugashima.saitama.jp
    urawa.saitama.jp
    warabi.saitama.jp
    yashio.saitama.jp
    yokoze.saitama.jp
    yono.saitama.jp
    yorii.saitama.jp
    yoshida.saitama.jp
    yoshikawa.saitama.jp
    yoshimi.saitama.jp
    aisho.shiga.jp
    gamo.shiga.jp
    higashiomi.shiga.jp
    hikone.shiga.jp
    koka.shiga.jp
    konan.shiga.jp
    kosei.shiga.jp
    koto.shiga.jp
    kusatsu.shiga.jp
    maibara.shiga.jp
    moriyama.shiga.jp
    nagahama.shiga.jp
    nishiazai.shiga.jp
    notogawa.shiga.jp
    omihachiman.shiga.jp
    otsu.shiga.jp
    ritto.shiga.jp
    ryuoh.shiga.jp
    takashima.shiga.jp
    takatsuki.shiga.jp
    torahime.shiga.jp
    toyosato.shiga.jp
    yasu.shiga.jp
    akagi.shimane.jp
    ama.shimane.jp
    gotsu.shimane.jp
    hamada.shimane.jp
    higashiizumo.shimane.jp
    hikawa.shimane.jp
    hikimi.shimane.jp
    izumo.shimane.jp
    kakinoki.shimane.jp
    masuda.shimane.jp
    matsue.shimane.jp
    misato.shimane.jp
    nishinoshima.shimane.jp
    ohda.shimane.jp
    okinoshima.shimane.jp
    okuizumo.shimane.jp
    shimane.shimane.jp
    tamayu.shimane.jp
    tsuwano.shimane.jp
    unnan.shimane.jp
    yakumo.shimane.jp
    yasugi.shimane.jp
    yatsuka.shimane.jp
    arai.shizuoka.jp
    atami.shizuoka.jp
    fuji.shizuoka.jp
    fujieda.shizuoka.jp
    fujikawa.shizuoka.jp
    fujinomiya.shizuoka.jp
    fukuroi.shizuoka.jp
    gotemba.shizuoka.jp
    haibara.shizuoka.jp
    hamamatsu.shizuoka.jp
    higashiizu.shizuoka.jp
    ito.shizuoka.jp
    iwata.shizuoka.jp
    izu.shizuoka.jp
    izunokuni.shizuoka.jp
    kakegawa.shizuoka.jp
    kannami.shizuoka.jp
    kawanehon.shizuoka.jp
    kawazu.shizuoka.jp
    kikugawa.shizuoka.jp
    kosai.shizuoka.jp
    makinohara.shizuoka.jp
    matsuzaki.shizuoka.jp
    minamiizu.shizuoka.jp
    mishima.shizuoka.jp
    morimachi.shizuoka.jp
    nishiizu.shizuoka.jp
    numazu.shizuoka.jp
    omaezaki.shizuoka.jp
    shimada.shizuoka.jp
    shimizu.shizuoka.jp
    shimoda.shizuoka.jp
    shizuoka.shizuoka.jp
    susono.shizuoka.jp
    yaizu.shizuoka.jp
    yoshida.shizuoka.jp
    ashikaga.tochigi.jp
    bato.tochigi.jp
    haga.tochigi.jp
    ichikai.tochigi.jp
    iwafune.tochigi.jp
    kaminokawa.tochigi.jp
    kanuma.tochigi.jp
    karasuyama.tochigi.jp
    kuroiso.tochigi.jp
    mashiko.tochigi.jp
    mibu.tochigi.jp
    moka.tochigi.jp
    motegi.tochigi.jp
    nasu.tochigi.jp
    nasushiobara.tochigi.jp
    nikko.tochigi.jp
    nishikata.tochigi.jp
    nogi.tochigi.jp
    ohira.tochigi.jp
    ohtawara.tochigi.jp
    oyama.tochigi.jp
    sakura.tochigi.jp
    sano.tochigi.jp
    shimotsuke.tochigi.jp
    shioya.tochigi.jp
    takanezawa.tochigi.jp
    tochigi.tochigi.jp
    tsuga.tochigi.jp
    ujiie.tochigi.jp
    utsunomiya.tochigi.jp
    yaita.tochigi.jp
    aizumi.tokushima.jp
    anan.tokushima.jp
    ichiba.tokushima.jp
    itano.tokushima.jp
    kainan.tokushima.jp
    komatsushima.tokushima.jp
    matsushige.tokushima.jp
    mima.tokushima.jp
    minami.tokushima.jp
    miyoshi.tokushima.jp
    mugi.tokushima.jp
    nakagawa.tokushima.jp
    naruto.tokushima.jp
    sanagochi.tokushima.jp
    shishikui.tokushima.jp
    tokushima.tokushima.jp
    wajiki.tokushima.jp
    adachi.tokyo.jp
    akiruno.tokyo.jp
    akishima.tokyo.jp
    aogashima.tokyo.jp
    arakawa.tokyo.jp
    bunkyo.tokyo.jp
    chiyoda.tokyo.jp
    chofu.tokyo.jp
    chuo.tokyo.jp
    edogawa.tokyo.jp
    fuchu.tokyo.jp
    fussa.tokyo.jp
    hachijo.tokyo.jp
    hachioji.tokyo.jp
    hamura.tokyo.jp
    higashikurume.tokyo.jp
    higashimurayama.tokyo.jp
    higashiyamato.tokyo.jp
    hino.tokyo.jp
    hinode.tokyo.jp
    hinohara.tokyo.jp
    inagi.tokyo.jp
    itabashi.tokyo.jp
    katsushika.tokyo.jp
    kita.tokyo.jp
    kiyose.tokyo.jp
    kodaira.tokyo.jp
    koganei.tokyo.jp
    kokubunji.tokyo.jp
    komae.tokyo.jp
    koto.tokyo.jp
    kouzushima.tokyo.jp
    kunitachi.tokyo.jp
    machida.tokyo.jp
    meguro.tokyo.jp
    minato.tokyo.jp
    mitaka.tokyo.jp
    mizuho.tokyo.jp
    musashimurayama.tokyo.jp
    musashino.tokyo.jp
    nakano.tokyo.jp
    nerima.tokyo.jp
    ogasawara.tokyo.jp
    okutama.tokyo.jp
    ome.tokyo.jp
    oshima.tokyo.jp
    ota.tokyo.jp
    setagaya.tokyo.jp
    shibuya.tokyo.jp
    shinagawa.tokyo.jp
    shinjuku.tokyo.jp
    suginami.tokyo.jp
    sumida.tokyo.jp
    tachikawa.tokyo.jp
    taito.tokyo.jp
    tama.tokyo.jp
    toshima.tokyo.jp
    chizu.tottori.jp
    hino.tottori.jp
    kawahara.tottori.jp
    koge.tottori.jp
    kotoura.tottori.jp
    misasa.tottori.jp
    nanbu.tottori.jp
    nichinan.tottori.jp
    sakaiminato.tottori.jp
    tottori.tottori.jp
    wakasa.tottori.jp
    yazu.tottori.jp
    yonago.tottori.jp
    asahi.toyama.jp
    fuchu.toyama.jp
    fukumitsu.toyama.jp
    funahashi.toyama.jp
    himi.toyama.jp
    imizu.toyama.jp
    inami.toyama.jp
    johana.toyama.jp
    kamiichi.toyama.jp
    kurobe.toyama.jp
    nakaniikawa.toyama.jp
    namerikawa.toyama.jp
    nanto.toyama.jp
    nyuzen.toyama.jp
    oyabe.toyama.jp
    taira.toyama.jp
    takaoka.toyama.jp
    tateyama.toyama.jp
    toga.toyama.jp
    tonami.toyama.jp
    toyama.toyama.jp
    unazuki.toyama.jp
    uozu.toyama.jp
    yamada.toyama.jp
    arida.wakayama.jp
    aridagawa.wakayama.jp
    gobo.wakayama.jp
    hashimoto.wakayama.jp
    hidaka.wakayama.jp
    hirogawa.wakayama.jp
    inami.wakayama.jp
    iwade.wakayama.jp
    kainan.wakayama.jp
    kamitonda.wakayama.jp
    katsuragi.wakayama.jp
    kimino.wakayama.jp
    kinokawa.wakayama.jp
    kitayama.wakayama.jp
    koya.wakayama.jp
    koza.wakayama.jp
    kozagawa.wakayama.jp
    kudoyama.wakayama.jp
    kushimoto.wakayama.jp
    mihama.wakayama.jp
    misato.wakayama.jp
    nachikatsuura.wakayama.jp
    shingu.wakayama.jp
    shirahama.wakayama.jp
    taiji.wakayama.jp
    tanabe.wakayama.jp
    wakayama.wakayama.jp
    yuasa.wakayama.jp
    yura.wakayama.jp
    asahi.yamagata.jp
    funagata.yamagata.jp
    higashine.yamagata.jp
    iide.yamagata.jp
    kahoku.yamagata.jp
    kaminoyama.yamagata.jp
    kaneyama.yamagata.jp
    kawanishi.yamagata.jp
    mamurogawa.yamagata.jp
    mikawa.yamagata.jp
    murayama.yamagata.jp
    nagai.yamagata.jp
    nakayama.yamagata.jp
    nanyo.yamagata.jp
    nishikawa.yamagata.jp
    obanazawa.yamagata.jp
    oe.yamagata.jp
    oguni.yamagata.jp
    ohkura.yamagata.jp
    oishida.yamagata.jp
    sagae.yamagata.jp
    sakata.yamagata.jp
    sakegawa.yamagata.jp
    shinjo.yamagata.jp
    shirataka.yamagata.jp
    shonai.yamagata.jp
    takahata.yamagata.jp
    tendo.yamagata.jp
    tozawa.yamagata.jp
    tsuruoka.yamagata.jp
    yamagata.yamagata.jp
    yamanobe.yamagata.jp
    yonezawa.yamagata.jp
    yuza.yamagata.jp
    abu.yamaguchi.jp
    hagi.yamaguchi.jp
    hikari.yamaguchi.jp
    hofu.yamaguchi.jp
    iwakuni.yamaguchi.jp
    kudamatsu.yamaguchi.jp
    mitou.yamaguchi.jp
    nagato.yamaguchi.jp
    oshima.yamaguchi.jp
    shimonoseki.yamaguchi.jp
    shunan.yamaguchi.jp
    tabuse.yamaguchi.jp
    tokuyama.yamaguchi.jp
    toyota.yamaguchi.jp
    ube.yamaguchi.jp
    yuu.yamaguchi.jp
    chuo.yamanashi.jp
    doshi.yamanashi.jp
    fuefuki.yamanashi.jp
    fujikawa.yamanashi.jp
    fujikawaguchiko.yamanashi.jp
    fujiyoshida.yamanashi.jp
    hayakawa.yamanashi.jp
    hokuto.yamanashi.jp
    ichikawamisato.yamanashi.jp
    kai.yamanashi.jp
    kofu.yamanashi.jp
    koshu.yamanashi.jp
    kosuge.yamanashi.jp
    minami-alps.yamanashi.jp
    minobu.yamanashi.jp
    nakamichi.yamanashi.jp
    nanbu.yamanashi.jp
    narusawa.yamanashi.jp
    nirasaki.yamanashi.jp
    nishikatsura.yamanashi.jp
    oshino.yamanashi.jp
    otsuki.yamanashi.jp
    showa.yamanashi.jp
    tabayama.yamanashi.jp
    tsuru.yamanashi.jp
    uenohara.yamanashi.jp
    yamanakako.yamanashi.jp
    yamanashi.yamanashi.jp

    // ke : http://www.kenic.or.ke/index.php/en/ke-domains/ke-domains
    ke
    ac.ke
    co.ke
    go.ke
    info.ke
    me.ke
    mobi.ke
    ne.ke
    or.ke
    sc.ke

    // kg : http://www.domain.kg/dmn_n.html
    kg
    org.kg
    net.kg
    com.kg
    edu.kg
    gov.kg
    mil.kg

    // kh : http://www.mptc.gov.kh/dns_registration.htm
    *.kh

    // ki : http://www.ki/dns/index.html
    ki
    edu.ki
    biz.ki
    net.ki
    org.ki
    gov.ki
    info.ki
    com.ki

    // km : https://en.wikipedia.org/wiki/.km
    // http://www.domaine.km/documents/charte.doc
    km
    org.km
    nom.km
    gov.km
    prd.km
    tm.km
    edu.km
    mil.km
    ass.km
    com.km
    // These are only mentioned as proposed suggestions at domaine.km, but
    // https://en.wikipedia.org/wiki/.km says they're available for registration:
    coop.km
    asso.km
    presse.km
    medecin.km
    notaires.km
    pharmaciens.km
    veterinaire.km
    gouv.km

    // kn : https://en.wikipedia.org/wiki/.kn
    // http://www.dot.kn/domainRules.html
    kn
    net.kn
    org.kn
    edu.kn
    gov.kn

    // kp : http://www.kcce.kp/en_index.php
    kp
    com.kp
    edu.kp
    gov.kp
    org.kp
    rep.kp
    tra.kp

    // kr : https://en.wikipedia.org/wiki/.kr
    // see also: http://domain.nida.or.kr/eng/registration.jsp
    kr
    ac.kr
    co.kr
    es.kr
    go.kr
    hs.kr
    kg.kr
    mil.kr
    ms.kr
    ne.kr
    or.kr
    pe.kr
    re.kr
    sc.kr
    // kr geographical names
    busan.kr
    chungbuk.kr
    chungnam.kr
    daegu.kr
    daejeon.kr
    gangwon.kr
    gwangju.kr
    gyeongbuk.kr
    gyeonggi.kr
    gyeongnam.kr
    incheon.kr
    jeju.kr
    jeonbuk.kr
    jeonnam.kr
    seoul.kr
    ulsan.kr

    // kw : https://www.nic.kw/policies/
    // Confirmed by registry <nic.tech@citra.gov.kw>
    kw
    com.kw
    edu.kw
    emb.kw
    gov.kw
    ind.kw
    net.kw
    org.kw

    // ky : http://www.icta.ky/da_ky_reg_dom.php
    // Confirmed by registry <kysupport@perimeterusa.com> 2008-06-17
    ky
    com.ky
    edu.ky
    net.ky
    org.ky

    // kz : https://en.wikipedia.org/wiki/.kz
    // see also: http://www.nic.kz/rules/index.jsp
    kz
    org.kz
    edu.kz
    net.kz
    gov.kz
    mil.kz
    com.kz

    // la : https://en.wikipedia.org/wiki/.la
    // Submitted by registry <gavin.brown@nic.la>
    la
    int.la
    net.la
    info.la
    edu.la
    gov.la
    per.la
    com.la
    org.la

    // lb : https://en.wikipedia.org/wiki/.lb
    // Submitted by registry <randy@psg.com>
    lb
    com.lb
    edu.lb
    gov.lb
    net.lb
    org.lb

    // lc : https://en.wikipedia.org/wiki/.lc
    // see also: http://www.nic.lc/rules.htm
    lc
    com.lc
    net.lc
    co.lc
    org.lc
    edu.lc
    gov.lc

    // li : https://en.wikipedia.org/wiki/.li
    li

    // lk : https://www.nic.lk/index.php/domain-registration/lk-domain-naming-structure
    lk
    gov.lk
    sch.lk
    net.lk
    int.lk
    com.lk
    org.lk
    edu.lk
    ngo.lk
    soc.lk
    web.lk
    ltd.lk
    assn.lk
    grp.lk
    hotel.lk
    ac.lk

    // lr : http://psg.com/dns/lr/lr.txt
    // Submitted by registry <randy@psg.com>
    lr
    com.lr
    edu.lr
    gov.lr
    org.lr
    net.lr

    // ls : http://www.nic.ls/
    // Confirmed by registry <lsadmin@nic.ls>
    ls
    ac.ls
    biz.ls
    co.ls
    edu.ls
    gov.ls
    info.ls
    net.ls
    org.ls
    sc.ls

    // lt : https://en.wikipedia.org/wiki/.lt
    lt
    // gov.lt : http://www.gov.lt/index_en.php
    gov.lt

    // lu : http://www.dns.lu/en/
    lu

    // lv : http://www.nic.lv/DNS/En/generic.php
    lv
    com.lv
    edu.lv
    gov.lv
    org.lv
    mil.lv
    id.lv
    net.lv
    asn.lv
    conf.lv

    // ly : http://www.nic.ly/regulations.php
    ly
    com.ly
    net.ly
    gov.ly
    plc.ly
    edu.ly
    sch.ly
    med.ly
    org.ly
    id.ly

    // ma : https://en.wikipedia.org/wiki/.ma
    // http://www.anrt.ma/fr/admin/download/upload/file_fr782.pdf
    ma
    co.ma
    net.ma
    gov.ma
    org.ma
    ac.ma
    press.ma

    // mc : http://www.nic.mc/
    mc
    tm.mc
    asso.mc

    // md : https://en.wikipedia.org/wiki/.md
    md

    // me : https://en.wikipedia.org/wiki/.me
    me
    co.me
    net.me
    org.me
    edu.me
    ac.me
    gov.me
    its.me
    priv.me

    // mg : http://nic.mg/nicmg/?page_id=39
    mg
    org.mg
    nom.mg
    gov.mg
    prd.mg
    tm.mg
    edu.mg
    mil.mg
    com.mg
    co.mg

    // mh : https://en.wikipedia.org/wiki/.mh
    mh

    // mil : https://en.wikipedia.org/wiki/.mil
    mil

    // mk : https://en.wikipedia.org/wiki/.mk
    // see also: http://dns.marnet.net.mk/postapka.php
    mk
    com.mk
    org.mk
    net.mk
    edu.mk
    gov.mk
    inf.mk
    name.mk

    // ml : http://www.gobin.info/domainname/ml-template.doc
    // see also: https://en.wikipedia.org/wiki/.ml
    ml
    com.ml
    edu.ml
    gouv.ml
    gov.ml
    net.ml
    org.ml
    presse.ml

    // mm : https://en.wikipedia.org/wiki/.mm
    *.mm

    // mn : https://en.wikipedia.org/wiki/.mn
    mn
    gov.mn
    edu.mn
    org.mn

    // mo : http://www.monic.net.mo/
    mo
    com.mo
    net.mo
    org.mo
    edu.mo
    gov.mo

    // mobi : https://en.wikipedia.org/wiki/.mobi
    mobi

    // mp : http://www.dot.mp/
    // Confirmed by registry <dcamacho@saipan.com> 2008-06-17
    mp

    // mq : https://en.wikipedia.org/wiki/.mq
    mq

    // mr : https://en.wikipedia.org/wiki/.mr
    mr
    gov.mr

    // ms : http://www.nic.ms/pdf/MS_Domain_Name_Rules.pdf
    ms
    com.ms
    edu.ms
    gov.ms
    net.ms
    org.ms

    // mt : https://www.nic.org.mt/go/policy
    // Submitted by registry <help@nic.org.mt>
    mt
    com.mt
    edu.mt
    net.mt
    org.mt

    // mu : https://en.wikipedia.org/wiki/.mu
    mu
    com.mu
    net.mu
    org.mu
    gov.mu
    ac.mu
    co.mu
    or.mu

    // museum : http://about.museum/naming/
    // http://index.museum/
    museum
    academy.museum
    agriculture.museum
    air.museum
    airguard.museum
    alabama.museum
    alaska.museum
    amber.museum
    ambulance.museum
    american.museum
    americana.museum
    americanantiques.museum
    americanart.museum
    amsterdam.museum
    and.museum
    annefrank.museum
    anthro.museum
    anthropology.museum
    antiques.museum
    aquarium.museum
    arboretum.museum
    archaeological.museum
    archaeology.museum
    architecture.museum
    art.museum
    artanddesign.museum
    artcenter.museum
    artdeco.museum
    arteducation.museum
    artgallery.museum
    arts.museum
    artsandcrafts.museum
    asmatart.museum
    assassination.museum
    assisi.museum
    association.museum
    astronomy.museum
    atlanta.museum
    austin.museum
    australia.museum
    automotive.museum
    aviation.museum
    axis.museum
    badajoz.museum
    baghdad.museum
    bahn.museum
    bale.museum
    baltimore.museum
    barcelona.museum
    baseball.museum
    basel.museum
    baths.museum
    bauern.museum
    beauxarts.museum
    beeldengeluid.museum
    bellevue.museum
    bergbau.museum
    berkeley.museum
    berlin.museum
    bern.museum
    bible.museum
    bilbao.museum
    bill.museum
    birdart.museum
    birthplace.museum
    bonn.museum
    boston.museum
    botanical.museum
    botanicalgarden.museum
    botanicgarden.museum
    botany.museum
    brandywinevalley.museum
    brasil.museum
    bristol.museum
    british.museum
    britishcolumbia.museum
    broadcast.museum
    brunel.museum
    brussel.museum
    brussels.museum
    bruxelles.museum
    building.museum
    burghof.museum
    bus.museum
    bushey.museum
    cadaques.museum
    california.museum
    cambridge.museum
    can.museum
    canada.museum
    capebreton.museum
    carrier.museum
    cartoonart.museum
    casadelamoneda.museum
    castle.museum
    castres.museum
    celtic.museum
    center.museum
    chattanooga.museum
    cheltenham.museum
    chesapeakebay.museum
    chicago.museum
    children.museum
    childrens.museum
    childrensgarden.museum
    chiropractic.museum
    chocolate.museum
    christiansburg.museum
    cincinnati.museum
    cinema.museum
    circus.museum
    civilisation.museum
    civilization.museum
    civilwar.museum
    clinton.museum
    clock.museum
    coal.museum
    coastaldefence.museum
    cody.museum
    coldwar.museum
    collection.museum
    colonialwilliamsburg.museum
    coloradoplateau.museum
    columbia.museum
    columbus.museum
    communication.museum
    communications.museum
    community.museum
    computer.museum
    computerhistory.museum
    comunicações.museum
    contemporary.museum
    contemporaryart.museum
    convent.museum
    copenhagen.museum
    corporation.museum
    correios-e-telecomunicações.museum
    corvette.museum
    costume.museum
    countryestate.museum
    county.museum
    crafts.museum
    cranbrook.museum
    creation.museum
    cultural.museum
    culturalcenter.museum
    culture.museum
    cyber.museum
    cymru.museum
    dali.museum
    dallas.museum
    database.museum
    ddr.museum
    decorativearts.museum
    delaware.museum
    delmenhorst.museum
    denmark.museum
    depot.museum
    design.museum
    detroit.museum
    dinosaur.museum
    discovery.museum
    dolls.museum
    donostia.museum
    durham.museum
    eastafrica.museum
    eastcoast.museum
    education.museum
    educational.museum
    egyptian.museum
    eisenbahn.museum
    elburg.museum
    elvendrell.museum
    embroidery.museum
    encyclopedic.museum
    england.museum
    entomology.museum
    environment.museum
    environmentalconservation.museum
    epilepsy.museum
    essex.museum
    estate.museum
    ethnology.museum
    exeter.museum
    exhibition.museum
    family.museum
    farm.museum
    farmequipment.museum
    farmers.museum
    farmstead.museum
    field.museum
    figueres.museum
    filatelia.museum
    film.museum
    fineart.museum
    finearts.museum
    finland.museum
    flanders.museum
    florida.museum
    force.museum
    fortmissoula.museum
    fortworth.museum
    foundation.museum
    francaise.museum
    frankfurt.museum
    franziskaner.museum
    freemasonry.museum
    freiburg.museum
    fribourg.museum
    frog.museum
    fundacio.museum
    furniture.museum
    gallery.museum
    garden.museum
    gateway.museum
    geelvinck.museum
    gemological.museum
    geology.museum
    georgia.museum
    giessen.museum
    glas.museum
    glass.museum
    gorge.museum
    grandrapids.museum
    graz.museum
    guernsey.museum
    halloffame.museum
    hamburg.museum
    handson.museum
    harvestcelebration.museum
    hawaii.museum
    health.museum
    heimatunduhren.museum
    hellas.museum
    helsinki.museum
    hembygdsforbund.museum
    heritage.museum
    histoire.museum
    historical.museum
    historicalsociety.museum
    historichouses.museum
    historisch.museum
    historisches.museum
    history.museum
    historyofscience.museum
    horology.museum
    house.museum
    humanities.museum
    illustration.museum
    imageandsound.museum
    indian.museum
    indiana.museum
    indianapolis.museum
    indianmarket.museum
    intelligence.museum
    interactive.museum
    iraq.museum
    iron.museum
    isleofman.museum
    jamison.museum
    jefferson.museum
    jerusalem.museum
    jewelry.museum
    jewish.museum
    jewishart.museum
    jfk.museum
    journalism.museum
    judaica.museum
    judygarland.museum
    juedisches.museum
    juif.museum
    karate.museum
    karikatur.museum
    kids.museum
    koebenhavn.museum
    koeln.museum
    kunst.museum
    kunstsammlung.museum
    kunstunddesign.museum
    labor.museum
    labour.museum
    lajolla.museum
    lancashire.museum
    landes.museum
    lans.museum
    läns.museum
    larsson.museum
    lewismiller.museum
    lincoln.museum
    linz.museum
    living.museum
    livinghistory.museum
    localhistory.museum
    london.museum
    losangeles.museum
    louvre.museum
    loyalist.museum
    lucerne.museum
    luxembourg.museum
    luzern.museum
    mad.museum
    madrid.museum
    mallorca.museum
    manchester.museum
    mansion.museum
    mansions.museum
    manx.museum
    marburg.museum
    maritime.museum
    maritimo.museum
    maryland.museum
    marylhurst.museum
    media.museum
    medical.museum
    medizinhistorisches.museum
    meeres.museum
    memorial.museum
    mesaverde.museum
    michigan.museum
    midatlantic.museum
    military.museum
    mill.museum
    miners.museum
    mining.museum
    minnesota.museum
    missile.museum
    missoula.museum
    modern.museum
    moma.museum
    money.museum
    monmouth.museum
    monticello.museum
    montreal.museum
    moscow.museum
    motorcycle.museum
    muenchen.museum
    muenster.museum
    mulhouse.museum
    muncie.museum
    museet.museum
    museumcenter.museum
    museumvereniging.museum
    music.museum
    national.museum
    nationalfirearms.museum
    nationalheritage.museum
    nativeamerican.museum
    naturalhistory.museum
    naturalhistorymuseum.museum
    naturalsciences.museum
    nature.museum
    naturhistorisches.museum
    natuurwetenschappen.museum
    naumburg.museum
    naval.museum
    nebraska.museum
    neues.museum
    newhampshire.museum
    newjersey.museum
    newmexico.museum
    newport.museum
    newspaper.museum
    newyork.museum
    niepce.museum
    norfolk.museum
    north.museum
    nrw.museum
    nyc.museum
    nyny.museum
    oceanographic.museum
    oceanographique.museum
    omaha.museum
    online.museum
    ontario.museum
    openair.museum
    oregon.museum
    oregontrail.museum
    otago.museum
    oxford.museum
    pacific.museum
    paderborn.museum
    palace.museum
    paleo.museum
    palmsprings.museum
    panama.museum
    paris.museum
    pasadena.museum
    pharmacy.museum
    philadelphia.museum
    philadelphiaarea.museum
    philately.museum
    phoenix.museum
    photography.museum
    pilots.museum
    pittsburgh.museum
    planetarium.museum
    plantation.museum
    plants.museum
    plaza.museum
    portal.museum
    portland.museum
    portlligat.museum
    posts-and-telecommunications.museum
    preservation.museum
    presidio.museum
    press.museum
    project.museum
    public.museum
    pubol.museum
    quebec.museum
    railroad.museum
    railway.museum
    research.museum
    resistance.museum
    riodejaneiro.museum
    rochester.museum
    rockart.museum
    roma.museum
    russia.museum
    saintlouis.museum
    salem.museum
    salvadordali.museum
    salzburg.museum
    sandiego.museum
    sanfrancisco.museum
    santabarbara.museum
    santacruz.museum
    santafe.museum
    saskatchewan.museum
    satx.museum
    savannahga.museum
    schlesisches.museum
    schoenbrunn.museum
    schokoladen.museum
    school.museum
    schweiz.museum
    science.museum
    scienceandhistory.museum
    scienceandindustry.museum
    sciencecenter.museum
    sciencecenters.museum
    science-fiction.museum
    sciencehistory.museum
    sciences.museum
    sciencesnaturelles.museum
    scotland.museum
    seaport.museum
    settlement.museum
    settlers.museum
    shell.museum
    sherbrooke.museum
    sibenik.museum
    silk.museum
    ski.museum
    skole.museum
    society.museum
    sologne.museum
    soundandvision.museum
    southcarolina.museum
    southwest.museum
    space.museum
    spy.museum
    square.museum
    stadt.museum
    stalbans.museum
    starnberg.museum
    state.museum
    stateofdelaware.museum
    station.museum
    steam.museum
    steiermark.museum
    stjohn.museum
    stockholm.museum
    stpetersburg.museum
    stuttgart.museum
    suisse.museum
    surgeonshall.museum
    surrey.museum
    svizzera.museum
    sweden.museum
    sydney.museum
    tank.museum
    tcm.museum
    technology.museum
    telekommunikation.museum
    television.museum
    texas.museum
    textile.museum
    theater.museum
    time.museum
    timekeeping.museum
    topology.museum
    torino.museum
    touch.museum
    town.museum
    transport.museum
    tree.museum
    trolley.museum
    trust.museum
    trustee.museum
    uhren.museum
    ulm.museum
    undersea.museum
    university.museum
    usa.museum
    usantiques.museum
    usarts.museum
    uscountryestate.museum
    usculture.museum
    usdecorativearts.museum
    usgarden.museum
    ushistory.museum
    ushuaia.museum
    uslivinghistory.museum
    utah.museum
    uvic.museum
    valley.museum
    vantaa.museum
    versailles.museum
    viking.museum
    village.museum
    virginia.museum
    virtual.museum
    virtuel.museum
    vlaanderen.museum
    volkenkunde.museum
    wales.museum
    wallonie.museum
    war.museum
    washingtondc.museum
    watchandclock.museum
    watch-and-clock.museum
    western.museum
    westfalen.museum
    whaling.museum
    wildlife.museum
    williamsburg.museum
    windmill.museum
    workshop.museum
    york.museum
    yorkshire.museum
    yosemite.museum
    youth.museum
    zoological.museum
    zoology.museum
    ירושלים.museum
    иком.museum

    // mv : https://en.wikipedia.org/wiki/.mv
    // "mv" included because, contra Wikipedia, google.mv exists.
    mv
    aero.mv
    biz.mv
    com.mv
    coop.mv
    edu.mv
    gov.mv
    info.mv
    int.mv
    mil.mv
    museum.mv
    name.mv
    net.mv
    org.mv
    pro.mv

    // mw : http://www.registrar.mw/
    mw
    ac.mw
    biz.mw
    co.mw
    com.mw
    coop.mw
    edu.mw
    gov.mw
    int.mw
    museum.mw
    net.mw
    org.mw

    // mx : http://www.nic.mx/
    // Submitted by registry <farias@nic.mx>
    mx
    com.mx
    org.mx
    gob.mx
    edu.mx
    net.mx

    // my : http://www.mynic.my/
    // Available strings: https://mynic.my/resources/domains/buying-a-domain/
    my
    biz.my
    com.my
    edu.my
    gov.my
    mil.my
    name.my
    net.my
    org.my

    // mz : http://www.uem.mz/
    // Submitted by registry <antonio@uem.mz>
    mz
    ac.mz
    adv.mz
    co.mz
    edu.mz
    gov.mz
    mil.mz
    net.mz
    org.mz

    // na : http://www.na-nic.com.na/
    // http://www.info.na/domain/
    na
    info.na
    pro.na
    name.na
    school.na
    or.na
    dr.na
    us.na
    mx.na
    ca.na
    in.na
    cc.na
    tv.na
    ws.na
    mobi.na
    co.na
    com.na
    org.na

    // name : has 2nd-level tlds, but there's no list of them
    name

    // nc : http://www.cctld.nc/
    nc
    asso.nc
    nom.nc

    // ne : https://en.wikipedia.org/wiki/.ne
    ne

    // net : https://en.wikipedia.org/wiki/.net
    net

    // nf : https://en.wikipedia.org/wiki/.nf
    nf
    com.nf
    net.nf
    per.nf
    rec.nf
    web.nf
    arts.nf
    firm.nf
    info.nf
    other.nf
    store.nf

    // ng : http://www.nira.org.ng/index.php/join-us/register-ng-domain/189-nira-slds
    ng
    com.ng
    edu.ng
    gov.ng
    i.ng
    mil.ng
    mobi.ng
    name.ng
    net.ng
    org.ng
    sch.ng

    // ni : http://www.nic.ni/
    ni
    ac.ni
    biz.ni
    co.ni
    com.ni
    edu.ni
    gob.ni
    in.ni
    info.ni
    int.ni
    mil.ni
    net.ni
    nom.ni
    org.ni
    web.ni

    // nl : https://en.wikipedia.org/wiki/.nl
    //      https://www.sidn.nl/
    //      ccTLD for the Netherlands
    nl

    // no : https://www.norid.no/en/om-domenenavn/regelverk-for-no/
    // Norid geographical second level domains : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-b/
    // Norid category second level domains : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-c/
    // Norid category second-level domains managed by parties other than Norid : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-d/
    // RSS feed: https://teknisk.norid.no/en/feed/
    no
    // Norid category second level domains : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-c/
    fhs.no
    vgs.no
    fylkesbibl.no
    folkebibl.no
    museum.no
    idrett.no
    priv.no
    // Norid category second-level domains managed by parties other than Norid : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-d/
    mil.no
    stat.no
    dep.no
    kommune.no
    herad.no
    // Norid geographical second level domains : https://www.norid.no/en/om-domenenavn/regelverk-for-no/vedlegg-b/
    // counties
    aa.no
    ah.no
    bu.no
    fm.no
    hl.no
    hm.no
    jan-mayen.no
    mr.no
    nl.no
    nt.no
    of.no
    ol.no
    oslo.no
    rl.no
    sf.no
    st.no
    svalbard.no
    tm.no
    tr.no
    va.no
    vf.no
    // primary and lower secondary schools per county
    gs.aa.no
    gs.ah.no
    gs.bu.no
    gs.fm.no
    gs.hl.no
    gs.hm.no
    gs.jan-mayen.no
    gs.mr.no
    gs.nl.no
    gs.nt.no
    gs.of.no
    gs.ol.no
    gs.oslo.no
    gs.rl.no
    gs.sf.no
    gs.st.no
    gs.svalbard.no
    gs.tm.no
    gs.tr.no
    gs.va.no
    gs.vf.no
    // cities
    akrehamn.no
    åkrehamn.no
    algard.no
    ålgård.no
    arna.no
    brumunddal.no
    bryne.no
    bronnoysund.no
    brønnøysund.no
    drobak.no
    drøbak.no
    egersund.no
    fetsund.no
    floro.no
    florø.no
    fredrikstad.no
    hokksund.no
    honefoss.no
    hønefoss.no
    jessheim.no
    jorpeland.no
    jørpeland.no
    kirkenes.no
    kopervik.no
    krokstadelva.no
    langevag.no
    langevåg.no
    leirvik.no
    mjondalen.no
    mjøndalen.no
    mo-i-rana.no
    mosjoen.no
    mosjøen.no
    nesoddtangen.no
    orkanger.no
    osoyro.no
    osøyro.no
    raholt.no
    råholt.no
    sandnessjoen.no
    sandnessjøen.no
    skedsmokorset.no
    slattum.no
    spjelkavik.no
    stathelle.no
    stavern.no
    stjordalshalsen.no
    stjørdalshalsen.no
    tananger.no
    tranby.no
    vossevangen.no
    // communities
    afjord.no
    åfjord.no
    agdenes.no
    al.no
    ål.no
    alesund.no
    ålesund.no
    alstahaug.no
    alta.no
    áltá.no
    alaheadju.no
    álaheadju.no
    alvdal.no
    amli.no
    åmli.no
    amot.no
    åmot.no
    andebu.no
    andoy.no
    andøy.no
    andasuolo.no
    ardal.no
    årdal.no
    aremark.no
    arendal.no
    ås.no
    aseral.no
    åseral.no
    asker.no
    askim.no
    askvoll.no
    askoy.no
    askøy.no
    asnes.no
    åsnes.no
    audnedaln.no
    aukra.no
    aure.no
    aurland.no
    aurskog-holand.no
    aurskog-høland.no
    austevoll.no
    austrheim.no
    averoy.no
    averøy.no
    balestrand.no
    ballangen.no
    balat.no
    bálát.no
    balsfjord.no
    bahccavuotna.no
    báhccavuotna.no
    bamble.no
    bardu.no
    beardu.no
    beiarn.no
    bajddar.no
    bájddar.no
    baidar.no
    báidár.no
    berg.no
    bergen.no
    berlevag.no
    berlevåg.no
    bearalvahki.no
    bearalváhki.no
    bindal.no
    birkenes.no
    bjarkoy.no
    bjarkøy.no
    bjerkreim.no
    bjugn.no
    bodo.no
    bodø.no
    badaddja.no
    bådåddjå.no
    budejju.no
    bokn.no
    bremanger.no
    bronnoy.no
    brønnøy.no
    bygland.no
    bykle.no
    barum.no
    bærum.no
    bo.telemark.no
    bø.telemark.no
    bo.nordland.no
    bø.nordland.no
    bievat.no
    bievát.no
    bomlo.no
    bømlo.no
    batsfjord.no
    båtsfjord.no
    bahcavuotna.no
    báhcavuotna.no
    dovre.no
    drammen.no
    drangedal.no
    dyroy.no
    dyrøy.no
    donna.no
    dønna.no
    eid.no
    eidfjord.no
    eidsberg.no
    eidskog.no
    eidsvoll.no
    eigersund.no
    elverum.no
    enebakk.no
    engerdal.no
    etne.no
    etnedal.no
    evenes.no
    evenassi.no
    evenášši.no
    evje-og-hornnes.no
    farsund.no
    fauske.no
    fuossko.no
    fuoisku.no
    fedje.no
    fet.no
    finnoy.no
    finnøy.no
    fitjar.no
    fjaler.no
    fjell.no
    flakstad.no
    flatanger.no
    flekkefjord.no
    flesberg.no
    flora.no
    fla.no
    flå.no
    folldal.no
    forsand.no
    fosnes.no
    frei.no
    frogn.no
    froland.no
    frosta.no
    frana.no
    fræna.no
    froya.no
    frøya.no
    fusa.no
    fyresdal.no
    forde.no
    førde.no
    gamvik.no
    gangaviika.no
    gáŋgaviika.no
    gaular.no
    gausdal.no
    gildeskal.no
    gildeskål.no
    giske.no
    gjemnes.no
    gjerdrum.no
    gjerstad.no
    gjesdal.no
    gjovik.no
    gjøvik.no
    gloppen.no
    gol.no
    gran.no
    grane.no
    granvin.no
    gratangen.no
    grimstad.no
    grong.no
    kraanghke.no
    kråanghke.no
    grue.no
    gulen.no
    hadsel.no
    halden.no
    halsa.no
    hamar.no
    hamaroy.no
    habmer.no
    hábmer.no
    hapmir.no
    hápmir.no
    hammerfest.no
    hammarfeasta.no
    hámmárfeasta.no
    haram.no
    hareid.no
    harstad.no
    hasvik.no
    aknoluokta.no
    ákŋoluokta.no
    hattfjelldal.no
    aarborte.no
    haugesund.no
    hemne.no
    hemnes.no
    hemsedal.no
    heroy.more-og-romsdal.no
    herøy.møre-og-romsdal.no
    heroy.nordland.no
    herøy.nordland.no
    hitra.no
    hjartdal.no
    hjelmeland.no
    hobol.no
    hobøl.no
    hof.no
    hol.no
    hole.no
    holmestrand.no
    holtalen.no
    holtålen.no
    hornindal.no
    horten.no
    hurdal.no
    hurum.no
    hvaler.no
    hyllestad.no
    hagebostad.no
    hægebostad.no
    hoyanger.no
    høyanger.no
    hoylandet.no
    høylandet.no
    ha.no
    hå.no
    ibestad.no
    inderoy.no
    inderøy.no
    iveland.no
    jevnaker.no
    jondal.no
    jolster.no
    jølster.no
    karasjok.no
    karasjohka.no
    kárášjohka.no
    karlsoy.no
    galsa.no
    gálsá.no
    karmoy.no
    karmøy.no
    kautokeino.no
    guovdageaidnu.no
    klepp.no
    klabu.no
    klæbu.no
    kongsberg.no
    kongsvinger.no
    kragero.no
    kragerø.no
    kristiansand.no
    kristiansund.no
    krodsherad.no
    krødsherad.no
    kvalsund.no
    rahkkeravju.no
    ráhkkerávju.no
    kvam.no
    kvinesdal.no
    kvinnherad.no
    kviteseid.no
    kvitsoy.no
    kvitsøy.no
    kvafjord.no
    kvæfjord.no
    giehtavuoatna.no
    kvanangen.no
    kvænangen.no
    navuotna.no
    návuotna.no
    kafjord.no
    kåfjord.no
    gaivuotna.no
    gáivuotna.no
    larvik.no
    lavangen.no
    lavagis.no
    loabat.no
    loabát.no
    lebesby.no
    davvesiida.no
    leikanger.no
    leirfjord.no
    leka.no
    leksvik.no
    lenvik.no
    leangaviika.no
    leaŋgaviika.no
    lesja.no
    levanger.no
    lier.no
    lierne.no
    lillehammer.no
    lillesand.no
    lindesnes.no
    lindas.no
    lindås.no
    lom.no
    loppa.no
    lahppi.no
    láhppi.no
    lund.no
    lunner.no
    luroy.no
    lurøy.no
    luster.no
    lyngdal.no
    lyngen.no
    ivgu.no
    lardal.no
    lerdal.no
    lærdal.no
    lodingen.no
    lødingen.no
    lorenskog.no
    lørenskog.no
    loten.no
    løten.no
    malvik.no
    masoy.no
    måsøy.no
    muosat.no
    muosát.no
    mandal.no
    marker.no
    marnardal.no
    masfjorden.no
    meland.no
    meldal.no
    melhus.no
    meloy.no
    meløy.no
    meraker.no
    meråker.no
    moareke.no
    moåreke.no
    midsund.no
    midtre-gauldal.no
    modalen.no
    modum.no
    molde.no
    moskenes.no
    moss.no
    mosvik.no
    malselv.no
    målselv.no
    malatvuopmi.no
    málatvuopmi.no
    namdalseid.no
    aejrie.no
    namsos.no
    namsskogan.no
    naamesjevuemie.no
    nååmesjevuemie.no
    laakesvuemie.no
    nannestad.no
    narvik.no
    narviika.no
    naustdal.no
    nedre-eiker.no
    nes.akershus.no
    nes.buskerud.no
    nesna.no
    nesodden.no
    nesseby.no
    unjarga.no
    unjárga.no
    nesset.no
    nissedal.no
    nittedal.no
    nord-aurdal.no
    nord-fron.no
    nord-odal.no
    norddal.no
    nordkapp.no
    davvenjarga.no
    davvenjárga.no
    nordre-land.no
    nordreisa.no
    raisa.no
    ráisa.no
    nore-og-uvdal.no
    notodden.no
    naroy.no
    nærøy.no
    notteroy.no
    nøtterøy.no
    odda.no
    oksnes.no
    øksnes.no
    oppdal.no
    oppegard.no
    oppegård.no
    orkdal.no
    orland.no
    ørland.no
    orskog.no
    ørskog.no
    orsta.no
    ørsta.no
    os.hedmark.no
    os.hordaland.no
    osen.no
    osteroy.no
    osterøy.no
    ostre-toten.no
    østre-toten.no
    overhalla.no
    ovre-eiker.no
    øvre-eiker.no
    oyer.no
    øyer.no
    oygarden.no
    øygarden.no
    oystre-slidre.no
    øystre-slidre.no
    porsanger.no
    porsangu.no
    porsáŋgu.no
    porsgrunn.no
    radoy.no
    radøy.no
    rakkestad.no
    rana.no
    ruovat.no
    randaberg.no
    rauma.no
    rendalen.no
    rennebu.no
    rennesoy.no
    rennesøy.no
    rindal.no
    ringebu.no
    ringerike.no
    ringsaker.no
    rissa.no
    risor.no
    risør.no
    roan.no
    rollag.no
    rygge.no
    ralingen.no
    rælingen.no
    rodoy.no
    rødøy.no
    romskog.no
    rømskog.no
    roros.no
    røros.no
    rost.no
    røst.no
    royken.no
    røyken.no
    royrvik.no
    røyrvik.no
    rade.no
    råde.no
    salangen.no
    siellak.no
    saltdal.no
    salat.no
    sálát.no
    sálat.no
    samnanger.no
    sande.more-og-romsdal.no
    sande.møre-og-romsdal.no
    sande.vestfold.no
    sandefjord.no
    sandnes.no
    sandoy.no
    sandøy.no
    sarpsborg.no
    sauda.no
    sauherad.no
    sel.no
    selbu.no
    selje.no
    seljord.no
    sigdal.no
    siljan.no
    sirdal.no
    skaun.no
    skedsmo.no
    ski.no
    skien.no
    skiptvet.no
    skjervoy.no
    skjervøy.no
    skierva.no
    skiervá.no
    skjak.no
    skjåk.no
    skodje.no
    skanland.no
    skånland.no
    skanit.no
    skánit.no
    smola.no
    smøla.no
    snillfjord.no
    snasa.no
    snåsa.no
    snoasa.no
    snaase.no
    snåase.no
    sogndal.no
    sokndal.no
    sola.no
    solund.no
    songdalen.no
    sortland.no
    spydeberg.no
    stange.no
    stavanger.no
    steigen.no
    steinkjer.no
    stjordal.no
    stjørdal.no
    stokke.no
    stor-elvdal.no
    stord.no
    stordal.no
    storfjord.no
    omasvuotna.no
    strand.no
    stranda.no
    stryn.no
    sula.no
    suldal.no
    sund.no
    sunndal.no
    surnadal.no
    sveio.no
    svelvik.no
    sykkylven.no
    sogne.no
    søgne.no
    somna.no
    sømna.no
    sondre-land.no
    søndre-land.no
    sor-aurdal.no
    sør-aurdal.no
    sor-fron.no
    sør-fron.no
    sor-odal.no
    sør-odal.no
    sor-varanger.no
    sør-varanger.no
    matta-varjjat.no
    mátta-várjjat.no
    sorfold.no
    sørfold.no
    sorreisa.no
    sørreisa.no
    sorum.no
    sørum.no
    tana.no
    deatnu.no
    time.no
    tingvoll.no
    tinn.no
    tjeldsund.no
    dielddanuorri.no
    tjome.no
    tjøme.no
    tokke.no
    tolga.no
    torsken.no
    tranoy.no
    tranøy.no
    tromso.no
    tromsø.no
    tromsa.no
    romsa.no
    trondheim.no
    troandin.no
    trysil.no
    trana.no
    træna.no
    trogstad.no
    trøgstad.no
    tvedestrand.no
    tydal.no
    tynset.no
    tysfjord.no
    divtasvuodna.no
    divttasvuotna.no
    tysnes.no
    tysvar.no
    tysvær.no
    tonsberg.no
    tønsberg.no
    ullensaker.no
    ullensvang.no
    ulvik.no
    utsira.no
    vadso.no
    vadsø.no
    cahcesuolo.no
    čáhcesuolo.no
    vaksdal.no
    valle.no
    vang.no
    vanylven.no
    vardo.no
    vardø.no
    varggat.no
    várggát.no
    vefsn.no
    vaapste.no
    vega.no
    vegarshei.no
    vegårshei.no
    vennesla.no
    verdal.no
    verran.no
    vestby.no
    vestnes.no
    vestre-slidre.no
    vestre-toten.no
    vestvagoy.no
    vestvågøy.no
    vevelstad.no
    vik.no
    vikna.no
    vindafjord.no
    volda.no
    voss.no
    varoy.no
    værøy.no
    vagan.no
    vågan.no
    voagat.no
    vagsoy.no
    vågsøy.no
    vaga.no
    vågå.no
    valer.ostfold.no
    våler.østfold.no
    valer.hedmark.no
    våler.hedmark.no

    // np : http://www.mos.com.np/register.html
    *.np

    // nr : http://cenpac.net.nr/dns/index.html
    // Submitted by registry <technician@cenpac.net.nr>
    nr
    biz.nr
    info.nr
    gov.nr
    edu.nr
    org.nr
    net.nr
    com.nr

    // nu : https://en.wikipedia.org/wiki/.nu
    nu

    // nz : https://en.wikipedia.org/wiki/.nz
    // Submitted by registry <jay@nzrs.net.nz>
    nz
    ac.nz
    co.nz
    cri.nz
    geek.nz
    gen.nz
    govt.nz
    health.nz
    iwi.nz
    kiwi.nz
    maori.nz
    mil.nz
    māori.nz
    net.nz
    org.nz
    parliament.nz
    school.nz

    // om : https://en.wikipedia.org/wiki/.om
    om
    co.om
    com.om
    edu.om
    gov.om
    med.om
    museum.om
    net.om
    org.om
    pro.om

    // onion : https://tools.ietf.org/html/rfc7686
    onion

    // org : https://en.wikipedia.org/wiki/.org
    org

    // pa : http://www.nic.pa/
    // Some additional second level "domains" resolve directly as hostnames, such as
    // pannet.pa, so we add a rule for "pa".
    pa
    ac.pa
    gob.pa
    com.pa
    org.pa
    sld.pa
    edu.pa
    net.pa
    ing.pa
    abo.pa
    med.pa
    nom.pa

    // pe : https://www.nic.pe/InformeFinalComision.pdf
    pe
    edu.pe
    gob.pe
    nom.pe
    mil.pe
    org.pe
    com.pe
    net.pe

    // pf : http://www.gobin.info/domainname/formulaire-pf.pdf
    pf
    com.pf
    org.pf
    edu.pf

    // pg : https://en.wikipedia.org/wiki/.pg
    *.pg

    // ph : http://www.domains.ph/FAQ2.asp
    // Submitted by registry <jed@email.com.ph>
    ph
    com.ph
    net.ph
    org.ph
    gov.ph
    edu.ph
    ngo.ph
    mil.ph
    i.ph

    // pk : http://pk5.pknic.net.pk/pk5/msgNamepk.PK
    pk
    com.pk
    net.pk
    edu.pk
    org.pk
    fam.pk
    biz.pk
    web.pk
    gov.pk
    gob.pk
    gok.pk
    gon.pk
    gop.pk
    gos.pk
    info.pk

    // pl http://www.dns.pl/english/index.html
    // Submitted by registry
    pl
    com.pl
    net.pl
    org.pl
    // pl functional domains (http://www.dns.pl/english/index.html)
    aid.pl
    agro.pl
    atm.pl
    auto.pl
    biz.pl
    edu.pl
    gmina.pl
    gsm.pl
    info.pl
    mail.pl
    miasta.pl
    media.pl
    mil.pl
    nieruchomosci.pl
    nom.pl
    pc.pl
    powiat.pl
    priv.pl
    realestate.pl
    rel.pl
    sex.pl
    shop.pl
    sklep.pl
    sos.pl
    szkola.pl
    targi.pl
    tm.pl
    tourism.pl
    travel.pl
    turystyka.pl
    // Government domains
    gov.pl
    ap.gov.pl
    ic.gov.pl
    is.gov.pl
    us.gov.pl
    kmpsp.gov.pl
    kppsp.gov.pl
    kwpsp.gov.pl
    psp.gov.pl
    wskr.gov.pl
    kwp.gov.pl
    mw.gov.pl
    ug.gov.pl
    um.gov.pl
    umig.gov.pl
    ugim.gov.pl
    upow.gov.pl
    uw.gov.pl
    starostwo.gov.pl
    pa.gov.pl
    po.gov.pl
    psse.gov.pl
    pup.gov.pl
    rzgw.gov.pl
    sa.gov.pl
    so.gov.pl
    sr.gov.pl
    wsa.gov.pl
    sko.gov.pl
    uzs.gov.pl
    wiih.gov.pl
    winb.gov.pl
    pinb.gov.pl
    wios.gov.pl
    witd.gov.pl
    wzmiuw.gov.pl
    piw.gov.pl
    wiw.gov.pl
    griw.gov.pl
    wif.gov.pl
    oum.gov.pl
    sdn.gov.pl
    zp.gov.pl
    uppo.gov.pl
    mup.gov.pl
    wuoz.gov.pl
    konsulat.gov.pl
    oirm.gov.pl
    // pl regional domains (http://www.dns.pl/english/index.html)
    augustow.pl
    babia-gora.pl
    bedzin.pl
    beskidy.pl
    bialowieza.pl
    bialystok.pl
    bielawa.pl
    bieszczady.pl
    boleslawiec.pl
    bydgoszcz.pl
    bytom.pl
    cieszyn.pl
    czeladz.pl
    czest.pl
    dlugoleka.pl
    elblag.pl
    elk.pl
    glogow.pl
    gniezno.pl
    gorlice.pl
    grajewo.pl
    ilawa.pl
    jaworzno.pl
    jelenia-gora.pl
    jgora.pl
    kalisz.pl
    kazimierz-dolny.pl
    karpacz.pl
    kartuzy.pl
    kaszuby.pl
    katowice.pl
    kepno.pl
    ketrzyn.pl
    klodzko.pl
    kobierzyce.pl
    kolobrzeg.pl
    konin.pl
    konskowola.pl
    kutno.pl
    lapy.pl
    lebork.pl
    legnica.pl
    lezajsk.pl
    limanowa.pl
    lomza.pl
    lowicz.pl
    lubin.pl
    lukow.pl
    malbork.pl
    malopolska.pl
    mazowsze.pl
    mazury.pl
    mielec.pl
    mielno.pl
    mragowo.pl
    naklo.pl
    nowaruda.pl
    nysa.pl
    olawa.pl
    olecko.pl
    olkusz.pl
    olsztyn.pl
    opoczno.pl
    opole.pl
    ostroda.pl
    ostroleka.pl
    ostrowiec.pl
    ostrowwlkp.pl
    pila.pl
    pisz.pl
    podhale.pl
    podlasie.pl
    polkowice.pl
    pomorze.pl
    pomorskie.pl
    prochowice.pl
    pruszkow.pl
    przeworsk.pl
    pulawy.pl
    radom.pl
    rawa-maz.pl
    rybnik.pl
    rzeszow.pl
    sanok.pl
    sejny.pl
    slask.pl
    slupsk.pl
    sosnowiec.pl
    stalowa-wola.pl
    skoczow.pl
    starachowice.pl
    stargard.pl
    suwalki.pl
    swidnica.pl
    swiebodzin.pl
    swinoujscie.pl
    szczecin.pl
    szczytno.pl
    tarnobrzeg.pl
    tgory.pl
    turek.pl
    tychy.pl
    ustka.pl
    walbrzych.pl
    warmia.pl
    warszawa.pl
    waw.pl
    wegrow.pl
    wielun.pl
    wlocl.pl
    wloclawek.pl
    wodzislaw.pl
    wolomin.pl
    wroclaw.pl
    zachpomor.pl
    zagan.pl
    zarow.pl
    zgora.pl
    zgorzelec.pl

    // pm : http://www.afnic.fr/medias/documents/AFNIC-naming-policy2012.pdf
    pm

    // pn : http://www.government.pn/PnRegistry/policies.htm
    pn
    gov.pn
    co.pn
    org.pn
    edu.pn
    net.pn

    // post : https://en.wikipedia.org/wiki/.post
    post

    // pr : http://www.nic.pr/index.asp?f=1
    pr
    com.pr
    net.pr
    org.pr
    gov.pr
    edu.pr
    isla.pr
    pro.pr
    biz.pr
    info.pr
    name.pr
    // these aren't mentioned on nic.pr, but on https://en.wikipedia.org/wiki/.pr
    est.pr
    prof.pr
    ac.pr

    // pro : http://registry.pro/get-pro
    pro
    aaa.pro
    aca.pro
    acct.pro
    avocat.pro
    bar.pro
    cpa.pro
    eng.pro
    jur.pro
    law.pro
    med.pro
    recht.pro

    // ps : https://en.wikipedia.org/wiki/.ps
    // http://www.nic.ps/registration/policy.html#reg
    ps
    edu.ps
    gov.ps
    sec.ps
    plo.ps
    com.ps
    org.ps
    net.ps

    // pt : https://www.dns.pt/en/domain/pt-terms-and-conditions-registration-rules/
    pt
    net.pt
    gov.pt
    org.pt
    edu.pt
    int.pt
    publ.pt
    com.pt
    nome.pt

    // pw : https://en.wikipedia.org/wiki/.pw
    pw
    co.pw
    ne.pw
    or.pw
    ed.pw
    go.pw
    belau.pw

    // py : http://www.nic.py/pautas.html#seccion_9
    // Submitted by registry
    py
    com.py
    coop.py
    edu.py
    gov.py
    mil.py
    net.py
    org.py

    // qa : http://domains.qa/en/
    qa
    com.qa
    edu.qa
    gov.qa
    mil.qa
    name.qa
    net.qa
    org.qa
    sch.qa

    // re : http://www.afnic.re/obtenir/chartes/nommage-re/annexe-descriptifs
    re
    asso.re
    com.re
    nom.re

    // ro : http://www.rotld.ro/
    ro
    arts.ro
    com.ro
    firm.ro
    info.ro
    nom.ro
    nt.ro
    org.ro
    rec.ro
    store.ro
    tm.ro
    www.ro

    // rs : https://www.rnids.rs/en/domains/national-domains
    rs
    ac.rs
    co.rs
    edu.rs
    gov.rs
    in.rs
    org.rs

    // ru : https://cctld.ru/files/pdf/docs/en/rules_ru-rf.pdf
    // Submitted by George Georgievsky <gug@cctld.ru>
    ru

    // rw : https://www.ricta.org.rw/sites/default/files/resources/registry_registrar_contract_0.pdf
    rw
    ac.rw
    co.rw
    coop.rw
    gov.rw
    mil.rw
    net.rw
    org.rw

    // sa : http://www.nic.net.sa/
    sa
    com.sa
    net.sa
    org.sa
    gov.sa
    med.sa
    pub.sa
    edu.sa
    sch.sa

    // sb : http://www.sbnic.net.sb/
    // Submitted by registry <lee.humphries@telekom.com.sb>
    sb
    com.sb
    edu.sb
    gov.sb
    net.sb
    org.sb

    // sc : http://www.nic.sc/
    sc
    com.sc
    gov.sc
    net.sc
    org.sc
    edu.sc

    // sd : http://www.isoc.sd/sudanic.isoc.sd/billing_pricing.htm
    // Submitted by registry <admin@isoc.sd>
    sd
    com.sd
    net.sd
    org.sd
    edu.sd
    med.sd
    tv.sd
    gov.sd
    info.sd

    // se : https://en.wikipedia.org/wiki/.se
    // Submitted by registry <patrik.wallstrom@iis.se>
    se
    a.se
    ac.se
    b.se
    bd.se
    brand.se
    c.se
    d.se
    e.se
    f.se
    fh.se
    fhsk.se
    fhv.se
    g.se
    h.se
    i.se
    k.se
    komforb.se
    kommunalforbund.se
    komvux.se
    l.se
    lanbib.se
    m.se
    n.se
    naturbruksgymn.se
    o.se
    org.se
    p.se
    parti.se
    pp.se
    press.se
    r.se
    s.se
    t.se
    tm.se
    u.se
    w.se
    x.se
    y.se
    z.se

    // sg : http://www.nic.net.sg/page/registration-policies-procedures-and-guidelines
    sg
    com.sg
    net.sg
    org.sg
    gov.sg
    edu.sg
    per.sg

    // sh : http://nic.sh/rules.htm
    sh
    com.sh
    net.sh
    gov.sh
    org.sh
    mil.sh

    // si : https://en.wikipedia.org/wiki/.si
    si

    // sj : No registrations at this time.
    // Submitted by registry <jarle@uninett.no>
    sj

    // sk : https://en.wikipedia.org/wiki/.sk
    // list of 2nd level domains ?
    sk

    // sl : http://www.nic.sl
    // Submitted by registry <adam@neoip.com>
    sl
    com.sl
    net.sl
    edu.sl
    gov.sl
    org.sl

    // sm : https://en.wikipedia.org/wiki/.sm
    sm

    // sn : https://en.wikipedia.org/wiki/.sn
    sn
    art.sn
    com.sn
    edu.sn
    gouv.sn
    org.sn
    perso.sn
    univ.sn

    // so : http://sonic.so/policies/
    so
    com.so
    edu.so
    gov.so
    me.so
    net.so
    org.so

    // sr : https://en.wikipedia.org/wiki/.sr
    sr

    // ss : https://registry.nic.ss/
    // Submitted by registry <technical@nic.ss>
    ss
    biz.ss
    com.ss
    edu.ss
    gov.ss
    me.ss
    net.ss
    org.ss
    sch.ss

    // st : http://www.nic.st/html/policyrules/
    st
    co.st
    com.st
    consulado.st
    edu.st
    embaixada.st
    mil.st
    net.st
    org.st
    principe.st
    saotome.st
    store.st

    // su : https://en.wikipedia.org/wiki/.su
    su

    // sv : http://www.svnet.org.sv/niveldos.pdf
    sv
    com.sv
    edu.sv
    gob.sv
    org.sv
    red.sv

    // sx : https://en.wikipedia.org/wiki/.sx
    // Submitted by registry <jcvignes@openregistry.com>
    sx
    gov.sx

    // sy : https://en.wikipedia.org/wiki/.sy
    // see also: http://www.gobin.info/domainname/sy.doc
    sy
    edu.sy
    gov.sy
    net.sy
    mil.sy
    com.sy
    org.sy

    // sz : https://en.wikipedia.org/wiki/.sz
    // http://www.sispa.org.sz/
    sz
    co.sz
    ac.sz
    org.sz

    // tc : https://en.wikipedia.org/wiki/.tc
    tc

    // td : https://en.wikipedia.org/wiki/.td
    td

    // tel: https://en.wikipedia.org/wiki/.tel
    // http://www.telnic.org/
    tel

    // tf : https://en.wikipedia.org/wiki/.tf
    tf

    // tg : https://en.wikipedia.org/wiki/.tg
    // http://www.nic.tg/
    tg

    // th : https://en.wikipedia.org/wiki/.th
    // Submitted by registry <krit@thains.co.th>
    th
    ac.th
    co.th
    go.th
    in.th
    mi.th
    net.th
    or.th

    // tj : http://www.nic.tj/policy.html
    tj
    ac.tj
    biz.tj
    co.tj
    com.tj
    edu.tj
    go.tj
    gov.tj
    int.tj
    mil.tj
    name.tj
    net.tj
    nic.tj
    org.tj
    test.tj
    web.tj

    // tk : https://en.wikipedia.org/wiki/.tk
    tk

    // tl : https://en.wikipedia.org/wiki/.tl
    tl
    gov.tl

    // tm : http://www.nic.tm/local.html
    tm
    com.tm
    co.tm
    org.tm
    net.tm
    nom.tm
    gov.tm
    mil.tm
    edu.tm

    // tn : http://www.registre.tn/fr/
    // https://whois.ati.tn/
    tn
    com.tn
    ens.tn
    fin.tn
    gov.tn
    ind.tn
    info.tn
    intl.tn
    mincom.tn
    nat.tn
    net.tn
    org.tn
    perso.tn
    tourism.tn

    // to : https://en.wikipedia.org/wiki/.to
    // Submitted by registry <egullich@colo.to>
    to
    com.to
    gov.to
    net.to
    org.to
    edu.to
    mil.to

    // tr : https://nic.tr/
    // https://nic.tr/forms/eng/policies.pdf
    // https://nic.tr/index.php?USRACTN=PRICELST
    tr
    av.tr
    bbs.tr
    bel.tr
    biz.tr
    com.tr
    dr.tr
    edu.tr
    gen.tr
    gov.tr
    info.tr
    mil.tr
    k12.tr
    kep.tr
    name.tr
    net.tr
    org.tr
    pol.tr
    tel.tr
    tsk.tr
    tv.tr
    web.tr
    // Used by Northern Cyprus
    nc.tr
    // Used by government agencies of Northern Cyprus
    gov.nc.tr

    // tt : http://www.nic.tt/
    tt
    co.tt
    com.tt
    org.tt
    net.tt
    biz.tt
    info.tt
    pro.tt
    int.tt
    coop.tt
    jobs.tt
    mobi.tt
    travel.tt
    museum.tt
    aero.tt
    name.tt
    gov.tt
    edu.tt

    // tv : https://en.wikipedia.org/wiki/.tv
    // Not listing any 2LDs as reserved since none seem to exist in practice,
    // Wikipedia notwithstanding.
    tv

    // tw : https://en.wikipedia.org/wiki/.tw
    tw
    edu.tw
    gov.tw
    mil.tw
    com.tw
    net.tw
    org.tw
    idv.tw
    game.tw
    ebiz.tw
    club.tw
    網路.tw
    組織.tw
    商業.tw

    // tz : http://www.tznic.or.tz/index.php/domains
    // Submitted by registry <manager@tznic.or.tz>
    tz
    ac.tz
    co.tz
    go.tz
    hotel.tz
    info.tz
    me.tz
    mil.tz
    mobi.tz
    ne.tz
    or.tz
    sc.tz
    tv.tz

    // ua : https://hostmaster.ua/policy/?ua
    // Submitted by registry <dk@cctld.ua>
    ua
    // ua 2LD
    com.ua
    edu.ua
    gov.ua
    in.ua
    net.ua
    org.ua
    // ua geographic names
    // https://hostmaster.ua/2ld/
    cherkassy.ua
    cherkasy.ua
    chernigov.ua
    chernihiv.ua
    chernivtsi.ua
    chernovtsy.ua
    ck.ua
    cn.ua
    cr.ua
    crimea.ua
    cv.ua
    dn.ua
    dnepropetrovsk.ua
    dnipropetrovsk.ua
    donetsk.ua
    dp.ua
    if.ua
    ivano-frankivsk.ua
    kh.ua
    kharkiv.ua
    kharkov.ua
    kherson.ua
    khmelnitskiy.ua
    khmelnytskyi.ua
    kiev.ua
    kirovograd.ua
    km.ua
    kr.ua
    krym.ua
    ks.ua
    kv.ua
    kyiv.ua
    lg.ua
    lt.ua
    lugansk.ua
    lutsk.ua
    lv.ua
    lviv.ua
    mk.ua
    mykolaiv.ua
    nikolaev.ua
    od.ua
    odesa.ua
    odessa.ua
    pl.ua
    poltava.ua
    rivne.ua
    rovno.ua
    rv.ua
    sb.ua
    sebastopol.ua
    sevastopol.ua
    sm.ua
    sumy.ua
    te.ua
    ternopil.ua
    uz.ua
    uzhgorod.ua
    vinnica.ua
    vinnytsia.ua
    vn.ua
    volyn.ua
    yalta.ua
    zaporizhzhe.ua
    zaporizhzhia.ua
    zhitomir.ua
    zhytomyr.ua
    zp.ua
    zt.ua

    // ug : https://www.registry.co.ug/
    ug
    co.ug
    or.ug
    ac.ug
    sc.ug
    go.ug
    ne.ug
    com.ug
    org.ug

    // uk : https://en.wikipedia.org/wiki/.uk
    // Submitted by registry <Michael.Daly@nominet.org.uk>
    uk
    ac.uk
    co.uk
    gov.uk
    ltd.uk
    me.uk
    net.uk
    nhs.uk
    org.uk
    plc.uk
    police.uk
    *.sch.uk

    // us : https://en.wikipedia.org/wiki/.us
    us
    dni.us
    fed.us
    isa.us
    kids.us
    nsn.us
    // us geographic names
    ak.us
    al.us
    ar.us
    as.us
    az.us
    ca.us
    co.us
    ct.us
    dc.us
    de.us
    fl.us
    ga.us
    gu.us
    hi.us
    ia.us
    id.us
    il.us
    in.us
    ks.us
    ky.us
    la.us
    ma.us
    md.us
    me.us
    mi.us
    mn.us
    mo.us
    ms.us
    mt.us
    nc.us
    nd.us
    ne.us
    nh.us
    nj.us
    nm.us
    nv.us
    ny.us
    oh.us
    ok.us
    or.us
    pa.us
    pr.us
    ri.us
    sc.us
    sd.us
    tn.us
    tx.us
    ut.us
    vi.us
    vt.us
    va.us
    wa.us
    wi.us
    wv.us
    wy.us
    // The registrar notes several more specific domains available in each state,
    // such as state.*.us, dst.*.us, etc., but resolution of these is somewhat
    // haphazard; in some states these domains resolve as addresses, while in others
    // only subdomains are available, or even nothing at all. We include the
    // most common ones where it's clear that different sites are different
    // entities.
    k12.ak.us
    k12.al.us
    k12.ar.us
    k12.as.us
    k12.az.us
    k12.ca.us
    k12.co.us
    k12.ct.us
    k12.dc.us
    k12.de.us
    k12.fl.us
    k12.ga.us
    k12.gu.us
    // k12.hi.us  Bug 614565 - Hawaii has a state-wide DOE login
    k12.ia.us
    k12.id.us
    k12.il.us
    k12.in.us
    k12.ks.us
    k12.ky.us
    k12.la.us
    k12.ma.us
    k12.md.us
    k12.me.us
    k12.mi.us
    k12.mn.us
    k12.mo.us
    k12.ms.us
    k12.mt.us
    k12.nc.us
    // k12.nd.us  Bug 1028347 - Removed at request of Travis Rosso <trossow@nd.gov>
    k12.ne.us
    k12.nh.us
    k12.nj.us
    k12.nm.us
    k12.nv.us
    k12.ny.us
    k12.oh.us
    k12.ok.us
    k12.or.us
    k12.pa.us
    k12.pr.us
    // k12.ri.us  Removed at request of Kim Cournoyer <netsupport@staff.ri.net>
    k12.sc.us
    // k12.sd.us  Bug 934131 - Removed at request of James Booze <James.Booze@k12.sd.us>
    k12.tn.us
    k12.tx.us
    k12.ut.us
    k12.vi.us
    k12.vt.us
    k12.va.us
    k12.wa.us
    k12.wi.us
    // k12.wv.us  Bug 947705 - Removed at request of Verne Britton <verne@wvnet.edu>
    k12.wy.us
    cc.ak.us
    cc.al.us
    cc.ar.us
    cc.as.us
    cc.az.us
    cc.ca.us
    cc.co.us
    cc.ct.us
    cc.dc.us
    cc.de.us
    cc.fl.us
    cc.ga.us
    cc.gu.us
    cc.hi.us
    cc.ia.us
    cc.id.us
    cc.il.us
    cc.in.us
    cc.ks.us
    cc.ky.us
    cc.la.us
    cc.ma.us
    cc.md.us
    cc.me.us
    cc.mi.us
    cc.mn.us
    cc.mo.us
    cc.ms.us
    cc.mt.us
    cc.nc.us
    cc.nd.us
    cc.ne.us
    cc.nh.us
    cc.nj.us
    cc.nm.us
    cc.nv.us
    cc.ny.us
    cc.oh.us
    cc.ok.us
    cc.or.us
    cc.pa.us
    cc.pr.us
    cc.ri.us
    cc.sc.us
    cc.sd.us
    cc.tn.us
    cc.tx.us
    cc.ut.us
    cc.vi.us
    cc.vt.us
    cc.va.us
    cc.wa.us
    cc.wi.us
    cc.wv.us
    cc.wy.us
    lib.ak.us
    lib.al.us
    lib.ar.us
    lib.as.us
    lib.az.us
    lib.ca.us
    lib.co.us
    lib.ct.us
    lib.dc.us
    // lib.de.us  Issue #243 - Moved to Private section at request of Ed Moore <Ed.Moore@lib.de.us>
    lib.fl.us
    lib.ga.us
    lib.gu.us
    lib.hi.us
    lib.ia.us
    lib.id.us
    lib.il.us
    lib.in.us
    lib.ks.us
    lib.ky.us
    lib.la.us
    lib.ma.us
    lib.md.us
    lib.me.us
    lib.mi.us
    lib.mn.us
    lib.mo.us
    lib.ms.us
    lib.mt.us
    lib.nc.us
    lib.nd.us
    lib.ne.us
    lib.nh.us
    lib.nj.us
    lib.nm.us
    lib.nv.us
    lib.ny.us
    lib.oh.us
    lib.ok.us
    lib.or.us
    lib.pa.us
    lib.pr.us
    lib.ri.us
    lib.sc.us
    lib.sd.us
    lib.tn.us
    lib.tx.us
    lib.ut.us
    lib.vi.us
    lib.vt.us
    lib.va.us
    lib.wa.us
    lib.wi.us
    // lib.wv.us  Bug 941670 - Removed at request of Larry W Arnold <arnold@wvlc.lib.wv.us>
    lib.wy.us
    // k12.ma.us contains school districts in Massachusetts. The 4LDs are
    //  managed independently except for private (PVT), charter (CHTR) and
    //  parochial (PAROCH) schools.  Those are delegated directly to the
    //  5LD operators.   <k12-ma-hostmaster _ at _ rsuc.gweep.net>
    pvt.k12.ma.us
    chtr.k12.ma.us
    paroch.k12.ma.us
    // Merit Network, Inc. maintains the registry for =~ /(k12|cc|lib).mi.us/ and the following
    //    see also: http://domreg.merit.edu
    //    see also: whois -h whois.domreg.merit.edu help
    ann-arbor.mi.us
    cog.mi.us
    dst.mi.us
    eaton.mi.us
    gen.mi.us
    mus.mi.us
    tec.mi.us
    washtenaw.mi.us

    // uy : http://www.nic.org.uy/
    uy
    com.uy
    edu.uy
    gub.uy
    mil.uy
    net.uy
    org.uy

    // uz : http://www.reg.uz/
    uz
    co.uz
    com.uz
    net.uz
    org.uz

    // va : https://en.wikipedia.org/wiki/.va
    va

    // vc : https://en.wikipedia.org/wiki/.vc
    // Submitted by registry <kshah@ca.afilias.info>
    vc
    com.vc
    net.vc
    org.vc
    gov.vc
    mil.vc
    edu.vc

    // ve : https://registro.nic.ve/
    // Submitted by registry nic@nic.ve and nicve@conatel.gob.ve
    ve
    arts.ve
    bib.ve
    co.ve
    com.ve
    e12.ve
    edu.ve
    firm.ve
    gob.ve
    gov.ve
    info.ve
    int.ve
    mil.ve
    net.ve
    nom.ve
    org.ve
    rar.ve
    rec.ve
    store.ve
    tec.ve
    web.ve

    // vg : https://en.wikipedia.org/wiki/.vg
    vg

    // vi : http://www.nic.vi/newdomainform.htm
    // http://www.nic.vi/Domain_Rules/body_domain_rules.html indicates some other
    // TLDs are "reserved", such as edu.vi and gov.vi, but doesn't actually say they
    // are available for registration (which they do not seem to be).
    vi
    co.vi
    com.vi
    k12.vi
    net.vi
    org.vi

    // vn : https://www.dot.vn/vnnic/vnnic/domainregistration.jsp
    vn
    com.vn
    net.vn
    org.vn
    edu.vn
    gov.vn
    int.vn
    ac.vn
    biz.vn
    info.vn
    name.vn
    pro.vn
    health.vn

    // vu : https://en.wikipedia.org/wiki/.vu
    // http://www.vunic.vu/
    vu
    com.vu
    edu.vu
    net.vu
    org.vu

    // wf : http://www.afnic.fr/medias/documents/AFNIC-naming-policy2012.pdf
    wf

    // ws : https://en.wikipedia.org/wiki/.ws
    // http://samoanic.ws/index.dhtml
    ws
    com.ws
    net.ws
    org.ws
    gov.ws
    edu.ws

    // yt : http://www.afnic.fr/medias/documents/AFNIC-naming-policy2012.pdf
    yt

    // IDN ccTLDs
    // When submitting patches, please maintain a sort by ISO 3166 ccTLD, then
    // U-label, and follow this format:
    // // A-Label ("<Latin renderings>", <language name>[, variant info]) : <ISO 3166 ccTLD>
    // // [sponsoring org]
    // U-Label

    // xn--mgbaam7a8h ("Emerat", Arabic) : AE
    // http://nic.ae/english/arabicdomain/rules.jsp
    امارات

    // xn--y9a3aq ("hye", Armenian) : AM
    // ISOC AM (operated by .am Registry)
    հայ

    // xn--54b7fta0cc ("Bangla", Bangla) : BD
    বাংলা

    // xn--90ae ("bg", Bulgarian) : BG
    бг

    // xn--mgbcpq6gpa1a ("albahrain", Arabic) : BH
    البحرين

    // xn--90ais ("bel", Belarusian/Russian Cyrillic) : BY
    // Operated by .by registry
    бел

    // xn--fiqs8s ("Zhongguo/China", Chinese, Simplified) : CN
    // CNNIC
    // http://cnnic.cn/html/Dir/2005/10/11/3218.htm
    中国

    // xn--fiqz9s ("Zhongguo/China", Chinese, Traditional) : CN
    // CNNIC
    // http://cnnic.cn/html/Dir/2005/10/11/3218.htm
    中國

    // xn--lgbbat1ad8j ("Algeria/Al Jazair", Arabic) : DZ
    الجزائر

    // xn--wgbh1c ("Egypt/Masr", Arabic) : EG
    // http://www.dotmasr.eg/
    مصر

    // xn--e1a4c ("eu", Cyrillic) : EU
    // https://eurid.eu
    ею

    // xn--qxa6a ("eu", Greek) : EU
    // https://eurid.eu
    ευ

    // xn--mgbah1a3hjkrd ("Mauritania", Arabic) : MR
    موريتانيا

    // xn--node ("ge", Georgian Mkhedruli) : GE
    გე

    // xn--qxam ("el", Greek) : GR
    // Hellenic Ministry of Infrastructure, Transport, and Networks
    ελ

    // xn--j6w193g ("Hong Kong", Chinese) : HK
    // https://www.hkirc.hk
    // Submitted by registry <hk.tech@hkirc.hk>
    // https://www.hkirc.hk/content.jsp?id=30#!/34
    香港
    公司.香港
    教育.香港
    政府.香港
    個人.香港
    網絡.香港
    組織.香港

    // xn--2scrj9c ("Bharat", Kannada) : IN
    // India
    ಭಾರತ

    // xn--3hcrj9c ("Bharat", Oriya) : IN
    // India
    ଭାରତ

    // xn--45br5cyl ("Bharatam", Assamese) : IN
    // India
    ভাৰত

    // xn--h2breg3eve ("Bharatam", Sanskrit) : IN
    // India
    भारतम्

    // xn--h2brj9c8c ("Bharot", Santali) : IN
    // India
    भारोत

    // xn--mgbgu82a ("Bharat", Sindhi) : IN
    // India
    ڀارت

    // xn--rvc1e0am3e ("Bharatam", Malayalam) : IN
    // India
    ഭാരതം

    // xn--h2brj9c ("Bharat", Devanagari) : IN
    // India
    भारत

    // xn--mgbbh1a ("Bharat", Kashmiri) : IN
    // India
    بارت

    // xn--mgbbh1a71e ("Bharat", Arabic) : IN
    // India
    بھارت

    // xn--fpcrj9c3d ("Bharat", Telugu) : IN
    // India
    భారత్

    // xn--gecrj9c ("Bharat", Gujarati) : IN
    // India
    ભારત

    // xn--s9brj9c ("Bharat", Gurmukhi) : IN
    // India
    ਭਾਰਤ

    // xn--45brj9c ("Bharat", Bengali) : IN
    // India
    ভারত

    // xn--xkc2dl3a5ee0h ("India", Tamil) : IN
    // India
    இந்தியா

    // xn--mgba3a4f16a ("Iran", Persian) : IR
    ایران

    // xn--mgba3a4fra ("Iran", Arabic) : IR
    ايران

    // xn--mgbtx2b ("Iraq", Arabic) : IQ
    // Communications and Media Commission
    عراق

    // xn--mgbayh7gpa ("al-Ordon", Arabic) : JO
    // National Information Technology Center (NITC)
    // Royal Scientific Society, Al-Jubeiha
    الاردن

    // xn--3e0b707e ("Republic of Korea", Hangul) : KR
    한국

    // xn--80ao21a ("Kaz", Kazakh) : KZ
    қаз

    // xn--q7ce6a ("Lao", Lao) : LA
    ລາວ

    // xn--fzc2c9e2c ("Lanka", Sinhalese-Sinhala) : LK
    // https://nic.lk
    ලංකා

    // xn--xkc2al3hye2a ("Ilangai", Tamil) : LK
    // https://nic.lk
    இலங்கை

    // xn--mgbc0a9azcg ("Morocco/al-Maghrib", Arabic) : MA
    المغرب

    // xn--d1alf ("mkd", Macedonian) : MK
    // MARnet
    мкд

    // xn--l1acc ("mon", Mongolian) : MN
    мон

    // xn--mix891f ("Macao", Chinese, Traditional) : MO
    // MONIC / HNET Asia (Registry Operator for .mo)
    澳門

    // xn--mix082f ("Macao", Chinese, Simplified) : MO
    澳门

    // xn--mgbx4cd0ab ("Malaysia", Malay) : MY
    مليسيا

    // xn--mgb9awbf ("Oman", Arabic) : OM
    عمان

    // xn--mgbai9azgqp6j ("Pakistan", Urdu/Arabic) : PK
    پاکستان

    // xn--mgbai9a5eva00b ("Pakistan", Urdu/Arabic, variant) : PK
    پاكستان

    // xn--ygbi2ammx ("Falasteen", Arabic) : PS
    // The Palestinian National Internet Naming Authority (PNINA)
    // http://www.pnina.ps
    فلسطين

    // xn--90a3ac ("srb", Cyrillic) : RS
    // https://www.rnids.rs/en/domains/national-domains
    срб
    пр.срб
    орг.срб
    обр.срб
    од.срб
    упр.срб
    ак.срб

    // xn--p1ai ("rf", Russian-Cyrillic) : RU
    // https://cctld.ru/files/pdf/docs/en/rules_ru-rf.pdf
    // Submitted by George Georgievsky <gug@cctld.ru>
    рф

    // xn--wgbl6a ("Qatar", Arabic) : QA
    // http://www.ict.gov.qa/
    قطر

    // xn--mgberp4a5d4ar ("AlSaudiah", Arabic) : SA
    // http://www.nic.net.sa/
    السعودية

    // xn--mgberp4a5d4a87g ("AlSaudiah", Arabic, variant)  : SA
    السعودیة

    // xn--mgbqly7c0a67fbc ("AlSaudiah", Arabic, variant) : SA
    السعودیۃ

    // xn--mgbqly7cvafr ("AlSaudiah", Arabic, variant) : SA
    السعوديه

    // xn--mgbpl2fh ("sudan", Arabic) : SD
    // Operated by .sd registry
    سودان

    // xn--yfro4i67o Singapore ("Singapore", Chinese) : SG
    新加坡

    // xn--clchc0ea0b2g2a9gcd ("Singapore", Tamil) : SG
    சிங்கப்பூர்

    // xn--ogbpf8fl ("Syria", Arabic) : SY
    سورية

    // xn--mgbtf8fl ("Syria", Arabic, variant) : SY
    سوريا

    // xn--o3cw4h ("Thai", Thai) : TH
    // http://www.thnic.co.th
    ไทย
    ศึกษา.ไทย
    ธุรกิจ.ไทย
    รัฐบาล.ไทย
    ทหาร.ไทย
    เน็ต.ไทย
    องค์กร.ไทย

    // xn--pgbs0dh ("Tunisia", Arabic) : TN
    // http://nic.tn
    تونس

    // xn--kpry57d ("Taiwan", Chinese, Traditional) : TW
    // http://www.twnic.net/english/dn/dn_07a.htm
    台灣

    // xn--kprw13d ("Taiwan", Chinese, Simplified) : TW
    // http://www.twnic.net/english/dn/dn_07a.htm
    台湾

    // xn--nnx388a ("Taiwan", Chinese, variant) : TW
    臺灣

    // xn--j1amh ("ukr", Cyrillic) : UA
    укр

    // xn--mgb2ddes ("AlYemen", Arabic) : YE
    اليمن

    // xxx : http://icmregistry.com
    xxx

    // ye : http://www.y.net.ye/services/domain_name.htm
    ye
    com.ye
    edu.ye
    gov.ye
    net.ye
    mil.ye
    org.ye

    // za : https://www.zadna.org.za/content/page/domain-information/
    ac.za
    agric.za
    alt.za
    co.za
    edu.za
    gov.za
    grondar.za
    law.za
    mil.za
    net.za
    ngo.za
    nic.za
    nis.za
    nom.za
    org.za
    school.za
    tm.za
    web.za

    // zm : https://zicta.zm/
    // Submitted by registry <info@zicta.zm>
    zm
    ac.zm
    biz.zm
    co.zm
    com.zm
    edu.zm
    gov.zm
    info.zm
    mil.zm
    net.zm
    org.zm
    sch.zm

    // zw : https://www.potraz.gov.zw/
    // Confirmed by registry <bmtengwa@potraz.gov.zw> 2017-01-25
    zw
    ac.zw
    co.zw
    gov.zw
    mil.zw
    org.zw


    // newGTLDs

    // List of new gTLDs imported from https://www.icann.org/resources/registries/gtlds/v2/gtlds.json on 2022-12-07T15:13:11Z
    // This list is auto-generated, don't edit it manually.
    // aaa : 2015-02-26 American Automobile Association, Inc.
    aaa

    // aarp : 2015-05-21 AARP
    aarp

    // abarth : 2015-07-30 Fiat Chrysler Automobiles N.V.
    abarth

    // abb : 2014-10-24 ABB Ltd
    abb

    // abbott : 2014-07-24 Abbott Laboratories, Inc.
    abbott

    // abbvie : 2015-07-30 AbbVie Inc.
    abbvie

    // abc : 2015-07-30 Disney Enterprises, Inc.
    abc

    // able : 2015-06-25 Able Inc.
    able

    // abogado : 2014-04-24 Registry Services, LLC
    abogado

    // abudhabi : 2015-07-30 Abu Dhabi Systems and Information Centre
    abudhabi

    // academy : 2013-11-07 Binky Moon, LLC
    academy

    // accenture : 2014-08-15 Accenture plc
    accenture

    // accountant : 2014-11-20 dot Accountant Limited
    accountant

    // accountants : 2014-03-20 Binky Moon, LLC
    accountants

    // aco : 2015-01-08 ACO Severin Ahlmann GmbH & Co. KG
    aco

    // actor : 2013-12-12 Dog Beach, LLC
    actor

    // ads : 2014-12-04 Charleston Road Registry Inc.
    ads

    // adult : 2014-10-16 ICM Registry AD LLC
    adult

    // aeg : 2015-03-19 Aktiebolaget Electrolux
    aeg

    // aetna : 2015-05-21 Aetna Life Insurance Company
    aetna

    // afl : 2014-10-02 Australian Football League
    afl

    // africa : 2014-03-24 ZA Central Registry NPC trading as Registry.Africa
    africa

    // agakhan : 2015-04-23 Fondation Aga Khan (Aga Khan Foundation)
    agakhan

    // agency : 2013-11-14 Binky Moon, LLC
    agency

    // aig : 2014-12-18 American International Group, Inc.
    aig

    // airbus : 2015-07-30 Airbus S.A.S.
    airbus

    // airforce : 2014-03-06 Dog Beach, LLC
    airforce

    // airtel : 2014-10-24 Bharti Airtel Limited
    airtel

    // akdn : 2015-04-23 Fondation Aga Khan (Aga Khan Foundation)
    akdn

    // alfaromeo : 2015-07-31 Fiat Chrysler Automobiles N.V.
    alfaromeo

    // alibaba : 2015-01-15 Alibaba Group Holding Limited
    alibaba

    // alipay : 2015-01-15 Alibaba Group Holding Limited
    alipay

    // allfinanz : 2014-07-03 Allfinanz Deutsche Vermögensberatung Aktiengesellschaft
    allfinanz

    // allstate : 2015-07-31 Allstate Fire and Casualty Insurance Company
    allstate

    // ally : 2015-06-18 Ally Financial Inc.
    ally

    // alsace : 2014-07-02 Region Grand Est
    alsace

    // alstom : 2015-07-30 ALSTOM
    alstom

    // amazon : 2019-12-19 Amazon Registry Services, Inc.
    amazon

    // americanexpress : 2015-07-31 American Express Travel Related Services Company, Inc.
    americanexpress

    // americanfamily : 2015-07-23 AmFam, Inc.
    americanfamily

    // amex : 2015-07-31 American Express Travel Related Services Company, Inc.
    amex

    // amfam : 2015-07-23 AmFam, Inc.
    amfam

    // amica : 2015-05-28 Amica Mutual Insurance Company
    amica

    // amsterdam : 2014-07-24 Gemeente Amsterdam
    amsterdam

    // analytics : 2014-12-18 Campus IP LLC
    analytics

    // android : 2014-08-07 Charleston Road Registry Inc.
    android

    // anquan : 2015-01-08 Beijing Qihu Keji Co., Ltd.
    anquan

    // anz : 2015-07-31 Australia and New Zealand Banking Group Limited
    anz

    // aol : 2015-09-17 Oath Inc.
    aol

    // apartments : 2014-12-11 Binky Moon, LLC
    apartments

    // app : 2015-05-14 Charleston Road Registry Inc.
    app

    // apple : 2015-05-14 Apple Inc.
    apple

    // aquarelle : 2014-07-24 Aquarelle.com
    aquarelle

    // arab : 2015-11-12 League of Arab States
    arab

    // aramco : 2014-11-20 Aramco Services Company
    aramco

    // archi : 2014-02-06 Identity Digital Limited
    archi

    // army : 2014-03-06 Dog Beach, LLC
    army

    // art : 2016-03-24 UK Creative Ideas Limited
    art

    // arte : 2014-12-11 Association Relative à la Télévision Européenne G.E.I.E.
    arte

    // asda : 2015-07-31 Wal-Mart Stores, Inc.
    asda

    // associates : 2014-03-06 Binky Moon, LLC
    associates

    // athleta : 2015-07-30 The Gap, Inc.
    athleta

    // attorney : 2014-03-20 Dog Beach, LLC
    attorney

    // auction : 2014-03-20 Dog Beach, LLC
    auction

    // audi : 2015-05-21 AUDI Aktiengesellschaft
    audi

    // audible : 2015-06-25 Amazon Registry Services, Inc.
    audible

    // audio : 2014-03-20 XYZ.COM LLC
    audio

    // auspost : 2015-08-13 Australian Postal Corporation
    auspost

    // author : 2014-12-18 Amazon Registry Services, Inc.
    author

    // auto : 2014-11-13 XYZ.COM LLC
    auto

    // autos : 2014-01-09 XYZ.COM LLC
    autos

    // avianca : 2015-01-08 Avianca Inc.
    avianca

    // aws : 2015-06-25 AWS Registry LLC
    aws

    // axa : 2013-12-19 AXA Group Operations SAS
    axa

    // azure : 2014-12-18 Microsoft Corporation
    azure

    // baby : 2015-04-09 XYZ.COM LLC
    baby

    // baidu : 2015-01-08 Baidu, Inc.
    baidu

    // banamex : 2015-07-30 Citigroup Inc.
    banamex

    // bananarepublic : 2015-07-31 The Gap, Inc.
    bananarepublic

    // band : 2014-06-12 Dog Beach, LLC
    band

    // bank : 2014-09-25 fTLD Registry Services LLC
    bank

    // bar : 2013-12-12 Punto 2012 Sociedad Anonima Promotora de Inversion de Capital Variable
    bar

    // barcelona : 2014-07-24 Municipi de Barcelona
    barcelona

    // barclaycard : 2014-11-20 Barclays Bank PLC
    barclaycard

    // barclays : 2014-11-20 Barclays Bank PLC
    barclays

    // barefoot : 2015-06-11 Gallo Vineyards, Inc.
    barefoot

    // bargains : 2013-11-14 Binky Moon, LLC
    bargains

    // baseball : 2015-10-29 MLB Advanced Media DH, LLC
    baseball

    // basketball : 2015-08-20 Fédération Internationale de Basketball (FIBA)
    basketball

    // bauhaus : 2014-04-17 Werkhaus GmbH
    bauhaus

    // bayern : 2014-01-23 Bayern Connect GmbH
    bayern

    // bbc : 2014-12-18 British Broadcasting Corporation
    bbc

    // bbt : 2015-07-23 BB&T Corporation
    bbt

    // bbva : 2014-10-02 BANCO BILBAO VIZCAYA ARGENTARIA, S.A.
    bbva

    // bcg : 2015-04-02 The Boston Consulting Group, Inc.
    bcg

    // bcn : 2014-07-24 Municipi de Barcelona
    bcn

    // beats : 2015-05-14 Beats Electronics, LLC
    beats

    // beauty : 2015-12-03 XYZ.COM LLC
    beauty

    // beer : 2014-01-09 Registry Services, LLC
    beer

    // bentley : 2014-12-18 Bentley Motors Limited
    bentley

    // berlin : 2013-10-31 dotBERLIN GmbH & Co. KG
    berlin

    // best : 2013-12-19 BestTLD Pty Ltd
    best

    // bestbuy : 2015-07-31 BBY Solutions, Inc.
    bestbuy

    // bet : 2015-05-07 Identity Digital Limited
    bet

    // bharti : 2014-01-09 Bharti Enterprises (Holding) Private Limited
    bharti

    // bible : 2014-06-19 American Bible Society
    bible

    // bid : 2013-12-19 dot Bid Limited
    bid

    // bike : 2013-08-27 Binky Moon, LLC
    bike

    // bing : 2014-12-18 Microsoft Corporation
    bing

    // bingo : 2014-12-04 Binky Moon, LLC
    bingo

    // bio : 2014-03-06 Identity Digital Limited
    bio

    // black : 2014-01-16 Identity Digital Limited
    black

    // blackfriday : 2014-01-16 Registry Services, LLC
    blackfriday

    // blockbuster : 2015-07-30 Dish DBS Corporation
    blockbuster

    // blog : 2015-05-14 Knock Knock WHOIS There, LLC
    blog

    // bloomberg : 2014-07-17 Bloomberg IP Holdings LLC
    bloomberg

    // blue : 2013-11-07 Identity Digital Limited
    blue

    // bms : 2014-10-30 Bristol-Myers Squibb Company
    bms

    // bmw : 2014-01-09 Bayerische Motoren Werke Aktiengesellschaft
    bmw

    // bnpparibas : 2014-05-29 BNP Paribas
    bnpparibas

    // boats : 2014-12-04 XYZ.COM LLC
    boats

    // boehringer : 2015-07-09 Boehringer Ingelheim International GmbH
    boehringer

    // bofa : 2015-07-31 Bank of America Corporation
    bofa

    // bom : 2014-10-16 Núcleo de Informação e Coordenação do Ponto BR - NIC.br
    bom

    // bond : 2014-06-05 ShortDot SA
    bond

    // boo : 2014-01-30 Charleston Road Registry Inc.
    boo

    // book : 2015-08-27 Amazon Registry Services, Inc.
    book

    // booking : 2015-07-16 Booking.com B.V.
    booking

    // bosch : 2015-06-18 Robert Bosch GMBH
    bosch

    // bostik : 2015-05-28 Bostik SA
    bostik

    // boston : 2015-12-10 Registry Services, LLC
    boston

    // bot : 2014-12-18 Amazon Registry Services, Inc.
    bot

    // boutique : 2013-11-14 Binky Moon, LLC
    boutique

    // box : 2015-11-12 Intercap Registry Inc.
    box

    // bradesco : 2014-12-18 Banco Bradesco S.A.
    bradesco

    // bridgestone : 2014-12-18 Bridgestone Corporation
    bridgestone

    // broadway : 2014-12-22 Celebrate Broadway, Inc.
    broadway

    // broker : 2014-12-11 Dog Beach, LLC
    broker

    // brother : 2015-01-29 Brother Industries, Ltd.
    brother

    // brussels : 2014-02-06 DNS.be vzw
    brussels

    // build : 2013-11-07 Plan Bee LLC
    build

    // builders : 2013-11-07 Binky Moon, LLC
    builders

    // business : 2013-11-07 Binky Moon, LLC
    business

    // buy : 2014-12-18 Amazon Registry Services, Inc.
    buy

    // buzz : 2013-10-02 DOTSTRATEGY CO.
    buzz

    // bzh : 2014-02-27 Association www.bzh
    bzh

    // cab : 2013-10-24 Binky Moon, LLC
    cab

    // cafe : 2015-02-11 Binky Moon, LLC
    cafe

    // cal : 2014-07-24 Charleston Road Registry Inc.
    cal

    // call : 2014-12-18 Amazon Registry Services, Inc.
    call

    // calvinklein : 2015-07-30 PVH gTLD Holdings LLC
    calvinklein

    // cam : 2016-04-21 Cam Connecting SARL
    cam

    // camera : 2013-08-27 Binky Moon, LLC
    camera

    // camp : 2013-11-07 Binky Moon, LLC
    camp

    // canon : 2014-09-12 Canon Inc.
    canon

    // capetown : 2014-03-24 ZA Central Registry NPC trading as ZA Central Registry
    capetown

    // capital : 2014-03-06 Binky Moon, LLC
    capital

    // capitalone : 2015-08-06 Capital One Financial Corporation
    capitalone

    // car : 2015-01-22 XYZ.COM LLC
    car

    // caravan : 2013-12-12 Caravan International, Inc.
    caravan

    // cards : 2013-12-05 Binky Moon, LLC
    cards

    // care : 2014-03-06 Binky Moon, LLC
    care

    // career : 2013-10-09 dotCareer LLC
    career

    // careers : 2013-10-02 Binky Moon, LLC
    careers

    // cars : 2014-11-13 XYZ.COM LLC
    cars

    // casa : 2013-11-21 Registry Services, LLC
    casa

    // case : 2015-09-03 Digity, LLC
    case

    // cash : 2014-03-06 Binky Moon, LLC
    cash

    // casino : 2014-12-18 Binky Moon, LLC
    casino

    // catering : 2013-12-05 Binky Moon, LLC
    catering

    // catholic : 2015-10-21 Pontificium Consilium de Comunicationibus Socialibus (PCCS) (Pontifical Council for Social Communication)
    catholic

    // cba : 2014-06-26 COMMONWEALTH BANK OF AUSTRALIA
    cba

    // cbn : 2014-08-22 The Christian Broadcasting Network, Inc.
    cbn

    // cbre : 2015-07-02 CBRE, Inc.
    cbre

    // cbs : 2015-08-06 CBS Domains Inc.
    cbs

    // center : 2013-11-07 Binky Moon, LLC
    center

    // ceo : 2013-11-07 CEOTLD Pty Ltd
    ceo

    // cern : 2014-06-05 European Organization for Nuclear Research ("CERN")
    cern

    // cfa : 2014-08-28 CFA Institute
    cfa

    // cfd : 2014-12-11 ShortDot SA
    cfd

    // chanel : 2015-04-09 Chanel International B.V.
    chanel

    // channel : 2014-05-08 Charleston Road Registry Inc.
    channel

    // charity : 2018-04-11 Public Interest Registry
    charity

    // chase : 2015-04-30 JPMorgan Chase Bank, National Association
    chase

    // chat : 2014-12-04 Binky Moon, LLC
    chat

    // cheap : 2013-11-14 Binky Moon, LLC
    cheap

    // chintai : 2015-06-11 CHINTAI Corporation
    chintai

    // christmas : 2013-11-21 XYZ.COM LLC
    christmas

    // chrome : 2014-07-24 Charleston Road Registry Inc.
    chrome

    // church : 2014-02-06 Binky Moon, LLC
    church

    // cipriani : 2015-02-19 Hotel Cipriani Srl
    cipriani

    // circle : 2014-12-18 Amazon Registry Services, Inc.
    circle

    // cisco : 2014-12-22 Cisco Technology, Inc.
    cisco

    // citadel : 2015-07-23 Citadel Domain LLC
    citadel

    // citi : 2015-07-30 Citigroup Inc.
    citi

    // citic : 2014-01-09 CITIC Group Corporation
    citic

    // city : 2014-05-29 Binky Moon, LLC
    city

    // cityeats : 2014-12-11 Lifestyle Domain Holdings, Inc.
    cityeats

    // claims : 2014-03-20 Binky Moon, LLC
    claims

    // cleaning : 2013-12-05 Binky Moon, LLC
    cleaning

    // click : 2014-06-05 Internet Naming Company LLC
    click

    // clinic : 2014-03-20 Binky Moon, LLC
    clinic

    // clinique : 2015-10-01 The Estée Lauder Companies Inc.
    clinique

    // clothing : 2013-08-27 Binky Moon, LLC
    clothing

    // cloud : 2015-04-16 Aruba PEC S.p.A.
    cloud

    // club : 2013-11-08 Registry Services, LLC
    club

    // clubmed : 2015-06-25 Club Méditerranée S.A.
    clubmed

    // coach : 2014-10-09 Binky Moon, LLC
    coach

    // codes : 2013-10-31 Binky Moon, LLC
    codes

    // coffee : 2013-10-17 Binky Moon, LLC
    coffee

    // college : 2014-01-16 XYZ.COM LLC
    college

    // cologne : 2014-02-05 dotKoeln GmbH
    cologne

    // comcast : 2015-07-23 Comcast IP Holdings I, LLC
    comcast

    // commbank : 2014-06-26 COMMONWEALTH BANK OF AUSTRALIA
    commbank

    // community : 2013-12-05 Binky Moon, LLC
    community

    // company : 2013-11-07 Binky Moon, LLC
    company

    // compare : 2015-10-08 Registry Services, LLC
    compare

    // computer : 2013-10-24 Binky Moon, LLC
    computer

    // comsec : 2015-01-08 VeriSign, Inc.
    comsec

    // condos : 2013-12-05 Binky Moon, LLC
    condos

    // construction : 2013-09-16 Binky Moon, LLC
    construction

    // consulting : 2013-12-05 Dog Beach, LLC
    consulting

    // contact : 2015-01-08 Dog Beach, LLC
    contact

    // contractors : 2013-09-10 Binky Moon, LLC
    contractors

    // cooking : 2013-11-21 Registry Services, LLC
    cooking

    // cookingchannel : 2015-07-02 Lifestyle Domain Holdings, Inc.
    cookingchannel

    // cool : 2013-11-14 Binky Moon, LLC
    cool

    // corsica : 2014-09-25 Collectivité de Corse
    corsica

    // country : 2013-12-19 Internet Naming Company LLC
    country

    // coupon : 2015-02-26 Amazon Registry Services, Inc.
    coupon

    // coupons : 2015-03-26 Binky Moon, LLC
    coupons

    // courses : 2014-12-04 Registry Services, LLC
    courses

    // cpa : 2019-06-10 American Institute of Certified Public Accountants
    cpa

    // credit : 2014-03-20 Binky Moon, LLC
    credit

    // creditcard : 2014-03-20 Binky Moon, LLC
    creditcard

    // creditunion : 2015-01-22 DotCooperation LLC
    creditunion

    // cricket : 2014-10-09 dot Cricket Limited
    cricket

    // crown : 2014-10-24 Crown Equipment Corporation
    crown

    // crs : 2014-04-03 Federated Co-operatives Limited
    crs

    // cruise : 2015-12-10 Viking River Cruises (Bermuda) Ltd.
    cruise

    // cruises : 2013-12-05 Binky Moon, LLC
    cruises

    // cuisinella : 2014-04-03 SCHMIDT GROUPE S.A.S.
    cuisinella

    // cymru : 2014-05-08 Nominet UK
    cymru

    // cyou : 2015-01-22 ShortDot SA
    cyou

    // dabur : 2014-02-06 Dabur India Limited
    dabur

    // dad : 2014-01-23 Charleston Road Registry Inc.
    dad

    // dance : 2013-10-24 Dog Beach, LLC
    dance

    // data : 2016-06-02 Dish DBS Corporation
    data

    // date : 2014-11-20 dot Date Limited
    date

    // dating : 2013-12-05 Binky Moon, LLC
    dating

    // datsun : 2014-03-27 NISSAN MOTOR CO., LTD.
    datsun

    // day : 2014-01-30 Charleston Road Registry Inc.
    day

    // dclk : 2014-11-20 Charleston Road Registry Inc.
    dclk

    // dds : 2015-05-07 Registry Services, LLC
    dds

    // deal : 2015-06-25 Amazon Registry Services, Inc.
    deal

    // dealer : 2014-12-22 Intercap Registry Inc.
    dealer

    // deals : 2014-05-22 Binky Moon, LLC
    deals

    // degree : 2014-03-06 Dog Beach, LLC
    degree

    // delivery : 2014-09-11 Binky Moon, LLC
    delivery

    // dell : 2014-10-24 Dell Inc.
    dell

    // deloitte : 2015-07-31 Deloitte Touche Tohmatsu
    deloitte

    // delta : 2015-02-19 Delta Air Lines, Inc.
    delta

    // democrat : 2013-10-24 Dog Beach, LLC
    democrat

    // dental : 2014-03-20 Binky Moon, LLC
    dental

    // dentist : 2014-03-20 Dog Beach, LLC
    dentist

    // desi : 2013-11-14 Desi Networks LLC
    desi

    // design : 2014-11-07 Registry Services, LLC
    design

    // dev : 2014-10-16 Charleston Road Registry Inc.
    dev

    // dhl : 2015-07-23 Deutsche Post AG
    dhl

    // diamonds : 2013-09-22 Binky Moon, LLC
    diamonds

    // diet : 2014-06-26 XYZ.COM LLC
    diet

    // digital : 2014-03-06 Binky Moon, LLC
    digital

    // direct : 2014-04-10 Binky Moon, LLC
    direct

    // directory : 2013-09-20 Binky Moon, LLC
    directory

    // discount : 2014-03-06 Binky Moon, LLC
    discount

    // discover : 2015-07-23 Discover Financial Services
    discover

    // dish : 2015-07-30 Dish DBS Corporation
    dish

    // diy : 2015-11-05 Lifestyle Domain Holdings, Inc.
    diy

    // dnp : 2013-12-13 Dai Nippon Printing Co., Ltd.
    dnp

    // docs : 2014-10-16 Charleston Road Registry Inc.
    docs

    // doctor : 2016-06-02 Binky Moon, LLC
    doctor

    // dog : 2014-12-04 Binky Moon, LLC
    dog

    // domains : 2013-10-17 Binky Moon, LLC
    domains

    // dot : 2015-05-21 Dish DBS Corporation
    dot

    // download : 2014-11-20 dot Support Limited
    download

    // drive : 2015-03-05 Charleston Road Registry Inc.
    drive

    // dtv : 2015-06-04 Dish DBS Corporation
    dtv

    // dubai : 2015-01-01 Dubai Smart Government Department
    dubai

    // dunlop : 2015-07-02 The Goodyear Tire & Rubber Company
    dunlop

    // dupont : 2015-06-25 DuPont Specialty Products USA, LLC
    dupont

    // durban : 2014-03-24 ZA Central Registry NPC trading as ZA Central Registry
    durban

    // dvag : 2014-06-23 Deutsche Vermögensberatung Aktiengesellschaft DVAG
    dvag

    // dvr : 2016-05-26 DISH Technologies L.L.C.
    dvr

    // earth : 2014-12-04 Interlink Systems Innovation Institute K.K.
    earth

    // eat : 2014-01-23 Charleston Road Registry Inc.
    eat

    // eco : 2016-07-08 Big Room Inc.
    eco

    // edeka : 2014-12-18 EDEKA Verband kaufmännischer Genossenschaften e.V.
    edeka

    // education : 2013-11-07 Binky Moon, LLC
    education

    // email : 2013-10-31 Binky Moon, LLC
    email

    // emerck : 2014-04-03 Merck KGaA
    emerck

    // energy : 2014-09-11 Binky Moon, LLC
    energy

    // engineer : 2014-03-06 Dog Beach, LLC
    engineer

    // engineering : 2014-03-06 Binky Moon, LLC
    engineering

    // enterprises : 2013-09-20 Binky Moon, LLC
    enterprises

    // epson : 2014-12-04 Seiko Epson Corporation
    epson

    // equipment : 2013-08-27 Binky Moon, LLC
    equipment

    // ericsson : 2015-07-09 Telefonaktiebolaget L M Ericsson
    ericsson

    // erni : 2014-04-03 ERNI Group Holding AG
    erni

    // esq : 2014-05-08 Charleston Road Registry Inc.
    esq

    // estate : 2013-08-27 Binky Moon, LLC
    estate

    // etisalat : 2015-09-03 Emirates Telecommunications Corporation (trading as Etisalat)
    etisalat

    // eurovision : 2014-04-24 European Broadcasting Union (EBU)
    eurovision

    // eus : 2013-12-12 Puntueus Fundazioa
    eus

    // events : 2013-12-05 Binky Moon, LLC
    events

    // exchange : 2014-03-06 Binky Moon, LLC
    exchange

    // expert : 2013-11-21 Binky Moon, LLC
    expert

    // exposed : 2013-12-05 Binky Moon, LLC
    exposed

    // express : 2015-02-11 Binky Moon, LLC
    express

    // extraspace : 2015-05-14 Extra Space Storage LLC
    extraspace

    // fage : 2014-12-18 Fage International S.A.
    fage

    // fail : 2014-03-06 Binky Moon, LLC
    fail

    // fairwinds : 2014-11-13 FairWinds Partners, LLC
    fairwinds

    // faith : 2014-11-20 dot Faith Limited
    faith

    // family : 2015-04-02 Dog Beach, LLC
    family

    // fan : 2014-03-06 Dog Beach, LLC
    fan

    // fans : 2014-11-07 ZDNS International Limited
    fans

    // farm : 2013-11-07 Binky Moon, LLC
    farm

    // farmers : 2015-07-09 Farmers Insurance Exchange
    farmers

    // fashion : 2014-07-03 Registry Services, LLC
    fashion

    // fast : 2014-12-18 Amazon Registry Services, Inc.
    fast

    // fedex : 2015-08-06 Federal Express Corporation
    fedex

    // feedback : 2013-12-19 Top Level Spectrum, Inc.
    feedback

    // ferrari : 2015-07-31 Fiat Chrysler Automobiles N.V.
    ferrari

    // ferrero : 2014-12-18 Ferrero Trading Lux S.A.
    ferrero

    // fiat : 2015-07-31 Fiat Chrysler Automobiles N.V.
    fiat

    // fidelity : 2015-07-30 Fidelity Brokerage Services LLC
    fidelity

    // fido : 2015-08-06 Rogers Communications Canada Inc.
    fido

    // film : 2015-01-08 Motion Picture Domain Registry Pty Ltd
    film

    // final : 2014-10-16 Núcleo de Informação e Coordenação do Ponto BR - NIC.br
    final

    // finance : 2014-03-20 Binky Moon, LLC
    finance

    // financial : 2014-03-06 Binky Moon, LLC
    financial

    // fire : 2015-06-25 Amazon Registry Services, Inc.
    fire

    // firestone : 2014-12-18 Bridgestone Licensing Services, Inc
    firestone

    // firmdale : 2014-03-27 Firmdale Holdings Limited
    firmdale

    // fish : 2013-12-12 Binky Moon, LLC
    fish

    // fishing : 2013-11-21 Registry Services, LLC
    fishing

    // fit : 2014-11-07 Registry Services, LLC
    fit

    // fitness : 2014-03-06 Binky Moon, LLC
    fitness

    // flickr : 2015-04-02 Flickr, Inc.
    flickr

    // flights : 2013-12-05 Binky Moon, LLC
    flights

    // flir : 2015-07-23 FLIR Systems, Inc.
    flir

    // florist : 2013-11-07 Binky Moon, LLC
    florist

    // flowers : 2014-10-09 XYZ.COM LLC
    flowers

    // fly : 2014-05-08 Charleston Road Registry Inc.
    fly

    // foo : 2014-01-23 Charleston Road Registry Inc.
    foo

    // food : 2016-04-21 Lifestyle Domain Holdings, Inc.
    food

    // foodnetwork : 2015-07-02 Lifestyle Domain Holdings, Inc.
    foodnetwork

    // football : 2014-12-18 Binky Moon, LLC
    football

    // ford : 2014-11-13 Ford Motor Company
    ford

    // forex : 2014-12-11 Dog Beach, LLC
    forex

    // forsale : 2014-05-22 Dog Beach, LLC
    forsale

    // forum : 2015-04-02 Fegistry, LLC
    forum

    // foundation : 2013-12-05 Public Interest Registry
    foundation

    // fox : 2015-09-11 FOX Registry, LLC
    fox

    // free : 2015-12-10 Amazon Registry Services, Inc.
    free

    // fresenius : 2015-07-30 Fresenius Immobilien-Verwaltungs-GmbH
    fresenius

    // frl : 2014-05-15 FRLregistry B.V.
    frl

    // frogans : 2013-12-19 OP3FT
    frogans

    // frontdoor : 2015-07-02 Lifestyle Domain Holdings, Inc.
    frontdoor

    // frontier : 2015-02-05 Frontier Communications Corporation
    frontier

    // ftr : 2015-07-16 Frontier Communications Corporation
    ftr

    // fujitsu : 2015-07-30 Fujitsu Limited
    fujitsu

    // fun : 2016-01-14 Radix FZC
    fun

    // fund : 2014-03-20 Binky Moon, LLC
    fund

    // furniture : 2014-03-20 Binky Moon, LLC
    furniture

    // futbol : 2013-09-20 Dog Beach, LLC
    futbol

    // fyi : 2015-04-02 Binky Moon, LLC
    fyi

    // gal : 2013-11-07 Asociación puntoGAL
    gal

    // gallery : 2013-09-13 Binky Moon, LLC
    gallery

    // gallo : 2015-06-11 Gallo Vineyards, Inc.
    gallo

    // gallup : 2015-02-19 Gallup, Inc.
    gallup

    // game : 2015-05-28 XYZ.COM LLC
    game

    // games : 2015-05-28 Dog Beach, LLC
    games

    // gap : 2015-07-31 The Gap, Inc.
    gap

    // garden : 2014-06-26 Registry Services, LLC
    garden

    // gay : 2019-05-23 Top Level Design, LLC
    gay

    // gbiz : 2014-07-17 Charleston Road Registry Inc.
    gbiz

    // gdn : 2014-07-31 Joint Stock Company "Navigation-information systems"
    gdn

    // gea : 2014-12-04 GEA Group Aktiengesellschaft
    gea

    // gent : 2014-01-23 Easyhost BV
    gent

    // genting : 2015-03-12 Resorts World Inc Pte. Ltd.
    genting

    // george : 2015-07-31 Wal-Mart Stores, Inc.
    george

    // ggee : 2014-01-09 GMO Internet, Inc.
    ggee

    // gift : 2013-10-17 DotGift, LLC
    gift

    // gifts : 2014-07-03 Binky Moon, LLC
    gifts

    // gives : 2014-03-06 Public Interest Registry
    gives

    // giving : 2014-11-13 Public Interest Registry
    giving

    // glass : 2013-11-07 Binky Moon, LLC
    glass

    // gle : 2014-07-24 Charleston Road Registry Inc.
    gle

    // global : 2014-04-17 Dot Global Domain Registry Limited
    global

    // globo : 2013-12-19 Globo Comunicação e Participações S.A
    globo

    // gmail : 2014-05-01 Charleston Road Registry Inc.
    gmail

    // gmbh : 2016-01-29 Binky Moon, LLC
    gmbh

    // gmo : 2014-01-09 GMO Internet, Inc.
    gmo

    // gmx : 2014-04-24 1&1 Mail & Media GmbH
    gmx

    // godaddy : 2015-07-23 Go Daddy East, LLC
    godaddy

    // gold : 2015-01-22 Binky Moon, LLC
    gold

    // goldpoint : 2014-11-20 YODOBASHI CAMERA CO.,LTD.
    goldpoint

    // golf : 2014-12-18 Binky Moon, LLC
    golf

    // goo : 2014-12-18 NTT Resonant Inc.
    goo

    // goodyear : 2015-07-02 The Goodyear Tire & Rubber Company
    goodyear

    // goog : 2014-11-20 Charleston Road Registry Inc.
    goog

    // google : 2014-07-24 Charleston Road Registry Inc.
    google

    // gop : 2014-01-16 Republican State Leadership Committee, Inc.
    gop

    // got : 2014-12-18 Amazon Registry Services, Inc.
    got

    // grainger : 2015-05-07 Grainger Registry Services, LLC
    grainger

    // graphics : 2013-09-13 Binky Moon, LLC
    graphics

    // gratis : 2014-03-20 Binky Moon, LLC
    gratis

    // green : 2014-05-08 Identity Digital Limited
    green

    // gripe : 2014-03-06 Binky Moon, LLC
    gripe

    // grocery : 2016-06-16 Wal-Mart Stores, Inc.
    grocery

    // group : 2014-08-15 Binky Moon, LLC
    group

    // guardian : 2015-07-30 The Guardian Life Insurance Company of America
    guardian

    // gucci : 2014-11-13 Guccio Gucci S.p.a.
    gucci

    // guge : 2014-08-28 Charleston Road Registry Inc.
    guge

    // guide : 2013-09-13 Binky Moon, LLC
    guide

    // guitars : 2013-11-14 XYZ.COM LLC
    guitars

    // guru : 2013-08-27 Binky Moon, LLC
    guru

    // hair : 2015-12-03 XYZ.COM LLC
    hair

    // hamburg : 2014-02-20 Hamburg Top-Level-Domain GmbH
    hamburg

    // hangout : 2014-11-13 Charleston Road Registry Inc.
    hangout

    // haus : 2013-12-05 Dog Beach, LLC
    haus

    // hbo : 2015-07-30 HBO Registry Services, Inc.
    hbo

    // hdfc : 2015-07-30 HOUSING DEVELOPMENT FINANCE CORPORATION LIMITED
    hdfc

    // hdfcbank : 2015-02-12 HDFC Bank Limited
    hdfcbank

    // health : 2015-02-11 DotHealth, LLC
    health

    // healthcare : 2014-06-12 Binky Moon, LLC
    healthcare

    // help : 2014-06-26 Innovation service Limited
    help

    // helsinki : 2015-02-05 City of Helsinki
    helsinki

    // here : 2014-02-06 Charleston Road Registry Inc.
    here

    // hermes : 2014-07-10 HERMES INTERNATIONAL
    hermes

    // hgtv : 2015-07-02 Lifestyle Domain Holdings, Inc.
    hgtv

    // hiphop : 2014-03-06 Dot Hip Hop, LLC
    hiphop

    // hisamitsu : 2015-07-16 Hisamitsu Pharmaceutical Co.,Inc.
    hisamitsu

    // hitachi : 2014-10-31 Hitachi, Ltd.
    hitachi

    // hiv : 2014-03-13 Internet Naming Company LLC
    hiv

    // hkt : 2015-05-14 PCCW-HKT DataCom Services Limited
    hkt

    // hockey : 2015-03-19 Binky Moon, LLC
    hockey

    // holdings : 2013-08-27 Binky Moon, LLC
    holdings

    // holiday : 2013-11-07 Binky Moon, LLC
    holiday

    // homedepot : 2015-04-02 Home Depot Product Authority, LLC
    homedepot

    // homegoods : 2015-07-16 The TJX Companies, Inc.
    homegoods

    // homes : 2014-01-09 XYZ.COM LLC
    homes

    // homesense : 2015-07-16 The TJX Companies, Inc.
    homesense

    // honda : 2014-12-18 Honda Motor Co., Ltd.
    honda

    // horse : 2013-11-21 Registry Services, LLC
    horse

    // hospital : 2016-10-20 Binky Moon, LLC
    hospital

    // host : 2014-04-17 Radix FZC
    host

    // hosting : 2014-05-29 XYZ.COM LLC
    hosting

    // hot : 2015-08-27 Amazon Registry Services, Inc.
    hot

    // hoteles : 2015-03-05 Travel Reservations SRL
    hoteles

    // hotels : 2016-04-07 Booking.com B.V.
    hotels

    // hotmail : 2014-12-18 Microsoft Corporation
    hotmail

    // house : 2013-11-07 Binky Moon, LLC
    house

    // how : 2014-01-23 Charleston Road Registry Inc.
    how

    // hsbc : 2014-10-24 HSBC Global Services (UK) Limited
    hsbc

    // hughes : 2015-07-30 Hughes Satellite Systems Corporation
    hughes

    // hyatt : 2015-07-30 Hyatt GTLD, L.L.C.
    hyatt

    // hyundai : 2015-07-09 Hyundai Motor Company
    hyundai

    // ibm : 2014-07-31 International Business Machines Corporation
    ibm

    // icbc : 2015-02-19 Industrial and Commercial Bank of China Limited
    icbc

    // ice : 2014-10-30 IntercontinentalExchange, Inc.
    ice

    // icu : 2015-01-08 ShortDot SA
    icu

    // ieee : 2015-07-23 IEEE Global LLC
    ieee

    // ifm : 2014-01-30 ifm electronic gmbh
    ifm

    // ikano : 2015-07-09 Ikano S.A.
    ikano

    // imamat : 2015-08-06 Fondation Aga Khan (Aga Khan Foundation)
    imamat

    // imdb : 2015-06-25 Amazon Registry Services, Inc.
    imdb

    // immo : 2014-07-10 Binky Moon, LLC
    immo

    // immobilien : 2013-11-07 Dog Beach, LLC
    immobilien

    // inc : 2018-03-10 Intercap Registry Inc.
    inc

    // industries : 2013-12-05 Binky Moon, LLC
    industries

    // infiniti : 2014-03-27 NISSAN MOTOR CO., LTD.
    infiniti

    // ing : 2014-01-23 Charleston Road Registry Inc.
    ing

    // ink : 2013-12-05 Top Level Design, LLC
    ink

    // institute : 2013-11-07 Binky Moon, LLC
    institute

    // insurance : 2015-02-19 fTLD Registry Services LLC
    insurance

    // insure : 2014-03-20 Binky Moon, LLC
    insure

    // international : 2013-11-07 Binky Moon, LLC
    international

    // intuit : 2015-07-30 Intuit Administrative Services, Inc.
    intuit

    // investments : 2014-03-20 Binky Moon, LLC
    investments

    // ipiranga : 2014-08-28 Ipiranga Produtos de Petroleo S.A.
    ipiranga

    // irish : 2014-08-07 Binky Moon, LLC
    irish

    // ismaili : 2015-08-06 Fondation Aga Khan (Aga Khan Foundation)
    ismaili

    // ist : 2014-08-28 Istanbul Metropolitan Municipality
    ist

    // istanbul : 2014-08-28 Istanbul Metropolitan Municipality
    istanbul

    // itau : 2014-10-02 Itau Unibanco Holding S.A.
    itau

    // itv : 2015-07-09 ITV Services Limited
    itv

    // jaguar : 2014-11-13 Jaguar Land Rover Ltd
    jaguar

    // java : 2014-06-19 Oracle Corporation
    java

    // jcb : 2014-11-20 JCB Co., Ltd.
    jcb

    // jeep : 2015-07-30 FCA US LLC.
    jeep

    // jetzt : 2014-01-09 Binky Moon, LLC
    jetzt

    // jewelry : 2015-03-05 Binky Moon, LLC
    jewelry

    // jio : 2015-04-02 Reliance Industries Limited
    jio

    // jll : 2015-04-02 Jones Lang LaSalle Incorporated
    jll

    // jmp : 2015-03-26 Matrix IP LLC
    jmp

    // jnj : 2015-06-18 Johnson & Johnson Services, Inc.
    jnj

    // joburg : 2014-03-24 ZA Central Registry NPC trading as ZA Central Registry
    joburg

    // jot : 2014-12-18 Amazon Registry Services, Inc.
    jot

    // joy : 2014-12-18 Amazon Registry Services, Inc.
    joy

    // jpmorgan : 2015-04-30 JPMorgan Chase Bank, National Association
    jpmorgan

    // jprs : 2014-09-18 Japan Registry Services Co., Ltd.
    jprs

    // juegos : 2014-03-20 Internet Naming Company LLC
    juegos

    // juniper : 2015-07-30 JUNIPER NETWORKS, INC.
    juniper

    // kaufen : 2013-11-07 Dog Beach, LLC
    kaufen

    // kddi : 2014-09-12 KDDI CORPORATION
    kddi

    // kerryhotels : 2015-04-30 Kerry Trading Co. Limited
    kerryhotels

    // kerrylogistics : 2015-04-09 Kerry Trading Co. Limited
    kerrylogistics

    // kerryproperties : 2015-04-09 Kerry Trading Co. Limited
    kerryproperties

    // kfh : 2014-12-04 Kuwait Finance House
    kfh

    // kia : 2015-07-09 KIA MOTORS CORPORATION
    kia

    // kids : 2021-08-13 DotKids Foundation Limited
    kids

    // kim : 2013-09-23 Identity Digital Limited
    kim

    // kinder : 2014-11-07 Ferrero Trading Lux S.A.
    kinder

    // kindle : 2015-06-25 Amazon Registry Services, Inc.
    kindle

    // kitchen : 2013-09-20 Binky Moon, LLC
    kitchen

    // kiwi : 2013-09-20 DOT KIWI LIMITED
    kiwi

    // koeln : 2014-01-09 dotKoeln GmbH
    koeln

    // komatsu : 2015-01-08 Komatsu Ltd.
    komatsu

    // kosher : 2015-08-20 Kosher Marketing Assets LLC
    kosher

    // kpmg : 2015-04-23 KPMG International Cooperative (KPMG International Genossenschaft)
    kpmg

    // kpn : 2015-01-08 Koninklijke KPN N.V.
    kpn

    // krd : 2013-12-05 KRG Department of Information Technology
    krd

    // kred : 2013-12-19 KredTLD Pty Ltd
    kred

    // kuokgroup : 2015-04-09 Kerry Trading Co. Limited
    kuokgroup

    // kyoto : 2014-11-07 Academic Institution: Kyoto Jyoho Gakuen
    kyoto

    // lacaixa : 2014-01-09 Fundación Bancaria Caixa d’Estalvis i Pensions de Barcelona, “la Caixa”
    lacaixa

    // lamborghini : 2015-06-04 Automobili Lamborghini S.p.A.
    lamborghini

    // lamer : 2015-10-01 The Estée Lauder Companies Inc.
    lamer

    // lancaster : 2015-02-12 LANCASTER
    lancaster

    // lancia : 2015-07-31 Fiat Chrysler Automobiles N.V.
    lancia

    // land : 2013-09-10 Binky Moon, LLC
    land

    // landrover : 2014-11-13 Jaguar Land Rover Ltd
    landrover

    // lanxess : 2015-07-30 LANXESS Corporation
    lanxess

    // lasalle : 2015-04-02 Jones Lang LaSalle Incorporated
    lasalle

    // lat : 2014-10-16 XYZ.COM LLC
    lat

    // latino : 2015-07-30 Dish DBS Corporation
    latino

    // latrobe : 2014-06-16 La Trobe University
    latrobe

    // law : 2015-01-22 Registry Services, LLC
    law

    // lawyer : 2014-03-20 Dog Beach, LLC
    lawyer

    // lds : 2014-03-20 IRI Domain Management, LLC
    lds

    // lease : 2014-03-06 Binky Moon, LLC
    lease

    // leclerc : 2014-08-07 A.C.D. LEC Association des Centres Distributeurs Edouard Leclerc
    leclerc

    // lefrak : 2015-07-16 LeFrak Organization, Inc.
    lefrak

    // legal : 2014-10-16 Binky Moon, LLC
    legal

    // lego : 2015-07-16 LEGO Juris A/S
    lego

    // lexus : 2015-04-23 TOYOTA MOTOR CORPORATION
    lexus

    // lgbt : 2014-05-08 Identity Digital Limited
    lgbt

    // lidl : 2014-09-18 Schwarz Domains und Services GmbH & Co. KG
    lidl

    // life : 2014-02-06 Binky Moon, LLC
    life

    // lifeinsurance : 2015-01-15 American Council of Life Insurers
    lifeinsurance

    // lifestyle : 2014-12-11 Lifestyle Domain Holdings, Inc.
    lifestyle

    // lighting : 2013-08-27 Binky Moon, LLC
    lighting

    // like : 2014-12-18 Amazon Registry Services, Inc.
    like

    // lilly : 2015-07-31 Eli Lilly and Company
    lilly

    // limited : 2014-03-06 Binky Moon, LLC
    limited

    // limo : 2013-10-17 Binky Moon, LLC
    limo

    // lincoln : 2014-11-13 Ford Motor Company
    lincoln

    // linde : 2014-12-04 Linde Aktiengesellschaft
    linde

    // link : 2013-11-14 Nova Registry Ltd
    link

    // lipsy : 2015-06-25 Lipsy Ltd
    lipsy

    // live : 2014-12-04 Dog Beach, LLC
    live

    // living : 2015-07-30 Lifestyle Domain Holdings, Inc.
    living

    // llc : 2017-12-14 Identity Digital Limited
    llc

    // llp : 2019-08-26 Intercap Registry Inc.
    llp

    // loan : 2014-11-20 dot Loan Limited
    loan

    // loans : 2014-03-20 Binky Moon, LLC
    loans

    // locker : 2015-06-04 Dish DBS Corporation
    locker

    // locus : 2015-06-25 Locus Analytics LLC
    locus

    // loft : 2015-07-30 Annco, Inc.
    loft

    // lol : 2015-01-30 XYZ.COM LLC
    lol

    // london : 2013-11-14 Dot London Domains Limited
    london

    // lotte : 2014-11-07 Lotte Holdings Co., Ltd.
    lotte

    // lotto : 2014-04-10 Identity Digital Limited
    lotto

    // love : 2014-12-22 Merchant Law Group LLP
    love

    // lpl : 2015-07-30 LPL Holdings, Inc.
    lpl

    // lplfinancial : 2015-07-30 LPL Holdings, Inc.
    lplfinancial

    // ltd : 2014-09-25 Binky Moon, LLC
    ltd

    // ltda : 2014-04-17 InterNetX, Corp
    ltda

    // lundbeck : 2015-08-06 H. Lundbeck A/S
    lundbeck

    // luxe : 2014-01-09 Registry Services, LLC
    luxe

    // luxury : 2013-10-17 Luxury Partners, LLC
    luxury

    // macys : 2015-07-31 Macys, Inc.
    macys

    // madrid : 2014-05-01 Comunidad de Madrid
    madrid

    // maif : 2014-10-02 Mutuelle Assurance Instituteur France (MAIF)
    maif

    // maison : 2013-12-05 Binky Moon, LLC
    maison

    // makeup : 2015-01-15 XYZ.COM LLC
    makeup

    // man : 2014-12-04 MAN SE
    man

    // management : 2013-11-07 Binky Moon, LLC
    management

    // mango : 2013-10-24 PUNTO FA S.L.
    mango

    // map : 2016-06-09 Charleston Road Registry Inc.
    map

    // market : 2014-03-06 Dog Beach, LLC
    market

    // marketing : 2013-11-07 Binky Moon, LLC
    marketing

    // markets : 2014-12-11 Dog Beach, LLC
    markets

    // marriott : 2014-10-09 Marriott Worldwide Corporation
    marriott

    // marshalls : 2015-07-16 The TJX Companies, Inc.
    marshalls

    // maserati : 2015-07-31 Fiat Chrysler Automobiles N.V.
    maserati

    // mattel : 2015-08-06 Mattel Sites, Inc.
    mattel

    // mba : 2015-04-02 Binky Moon, LLC
    mba

    // mckinsey : 2015-07-31 McKinsey Holdings, Inc.
    mckinsey

    // med : 2015-08-06 Medistry LLC
    med

    // media : 2014-03-06 Binky Moon, LLC
    media

    // meet : 2014-01-16 Charleston Road Registry Inc.
    meet

    // melbourne : 2014-05-29 The Crown in right of the State of Victoria, represented by its Department of State Development, Business and Innovation
    melbourne

    // meme : 2014-01-30 Charleston Road Registry Inc.
    meme

    // memorial : 2014-10-16 Dog Beach, LLC
    memorial

    // men : 2015-02-26 Exclusive Registry Limited
    men

    // menu : 2013-09-11 Dot Menu Registry, LLC
    menu

    // merckmsd : 2016-07-14 MSD Registry Holdings, Inc.
    merckmsd

    // miami : 2013-12-19 Registry Services, LLC
    miami

    // microsoft : 2014-12-18 Microsoft Corporation
    microsoft

    // mini : 2014-01-09 Bayerische Motoren Werke Aktiengesellschaft
    mini

    // mint : 2015-07-30 Intuit Administrative Services, Inc.
    mint

    // mit : 2015-07-02 Massachusetts Institute of Technology
    mit

    // mitsubishi : 2015-07-23 Mitsubishi Corporation
    mitsubishi

    // mlb : 2015-05-21 MLB Advanced Media DH, LLC
    mlb

    // mls : 2015-04-23 The Canadian Real Estate Association
    mls

    // mma : 2014-11-07 MMA IARD
    mma

    // mobile : 2016-06-02 Dish DBS Corporation
    mobile

    // moda : 2013-11-07 Dog Beach, LLC
    moda

    // moe : 2013-11-13 Interlink Systems Innovation Institute K.K.
    moe

    // moi : 2014-12-18 Amazon Registry Services, Inc.
    moi

    // mom : 2015-04-16 XYZ.COM LLC
    mom

    // monash : 2013-09-30 Monash University
    monash

    // money : 2014-10-16 Binky Moon, LLC
    money

    // monster : 2015-09-11 XYZ.COM LLC
    monster

    // mormon : 2013-12-05 IRI Domain Management, LLC
    mormon

    // mortgage : 2014-03-20 Dog Beach, LLC
    mortgage

    // moscow : 2013-12-19 Foundation for Assistance for Internet Technologies and Infrastructure Development (FAITID)
    moscow

    // moto : 2015-06-04 Motorola Trademark Holdings, LLC
    moto

    // motorcycles : 2014-01-09 XYZ.COM LLC
    motorcycles

    // mov : 2014-01-30 Charleston Road Registry Inc.
    mov

    // movie : 2015-02-05 Binky Moon, LLC
    movie

    // msd : 2015-07-23 MSD Registry Holdings, Inc.
    msd

    // mtn : 2014-12-04 MTN Dubai Limited
    mtn

    // mtr : 2015-03-12 MTR Corporation Limited
    mtr

    // music : 2021-05-04 DotMusic Limited
    music

    // mutual : 2015-04-02 Northwestern Mutual MU TLD Registry, LLC
    mutual

    // nab : 2015-08-20 National Australia Bank Limited
    nab

    // nagoya : 2013-10-24 GMO Registry, Inc.
    nagoya

    // natura : 2015-03-12 NATURA COSMÉTICOS S.A.
    natura

    // navy : 2014-03-06 Dog Beach, LLC
    navy

    // nba : 2015-07-31 NBA REGISTRY, LLC
    nba

    // nec : 2015-01-08 NEC Corporation
    nec

    // netbank : 2014-06-26 COMMONWEALTH BANK OF AUSTRALIA
    netbank

    // netflix : 2015-06-18 Netflix, Inc.
    netflix

    // network : 2013-11-14 Binky Moon, LLC
    network

    // neustar : 2013-12-05 NeuStar, Inc.
    neustar

    // new : 2014-01-30 Charleston Road Registry Inc.
    new

    // news : 2014-12-18 Dog Beach, LLC
    news

    // next : 2015-06-18 Next plc
    next

    // nextdirect : 2015-06-18 Next plc
    nextdirect

    // nexus : 2014-07-24 Charleston Road Registry Inc.
    nexus

    // nfl : 2015-07-23 NFL Reg Ops LLC
    nfl

    // ngo : 2014-03-06 Public Interest Registry
    ngo

    // nhk : 2014-02-13 Japan Broadcasting Corporation (NHK)
    nhk

    // nico : 2014-12-04 DWANGO Co., Ltd.
    nico

    // nike : 2015-07-23 NIKE, Inc.
    nike

    // nikon : 2015-05-21 NIKON CORPORATION
    nikon

    // ninja : 2013-11-07 Dog Beach, LLC
    ninja

    // nissan : 2014-03-27 NISSAN MOTOR CO., LTD.
    nissan

    // nissay : 2015-10-29 Nippon Life Insurance Company
    nissay

    // nokia : 2015-01-08 Nokia Corporation
    nokia

    // northwesternmutual : 2015-06-18 Northwestern Mutual Registry, LLC
    northwesternmutual

    // norton : 2014-12-04 NortonLifeLock Inc.
    norton

    // now : 2015-06-25 Amazon Registry Services, Inc.
    now

    // nowruz : 2014-09-04 Asia Green IT System Bilgisayar San. ve Tic. Ltd. Sti.
    nowruz

    // nowtv : 2015-05-14 Starbucks (HK) Limited
    nowtv

    // nra : 2014-05-22 NRA Holdings Company, INC.
    nra

    // nrw : 2013-11-21 Minds + Machines GmbH
    nrw

    // ntt : 2014-10-31 NIPPON TELEGRAPH AND TELEPHONE CORPORATION
    ntt

    // nyc : 2014-01-23 The City of New York by and through the New York City Department of Information Technology & Telecommunications
    nyc

    // obi : 2014-09-25 OBI Group Holding SE & Co. KGaA
    obi

    // observer : 2015-04-30 Dog Beach, LLC
    observer

    // office : 2015-03-12 Microsoft Corporation
    office

    // okinawa : 2013-12-05 BRregistry, Inc.
    okinawa

    // olayan : 2015-05-14 Crescent Holding GmbH
    olayan

    // olayangroup : 2015-05-14 Crescent Holding GmbH
    olayangroup

    // oldnavy : 2015-07-31 The Gap, Inc.
    oldnavy

    // ollo : 2015-06-04 Dish DBS Corporation
    ollo

    // omega : 2015-01-08 The Swatch Group Ltd
    omega

    // one : 2014-11-07 One.com A/S
    one

    // ong : 2014-03-06 Public Interest Registry
    ong

    // onl : 2013-09-16 iRegistry GmbH
    onl

    // online : 2015-01-15 Radix FZC
    online

    // ooo : 2014-01-09 INFIBEAM AVENUES LIMITED
    ooo

    // open : 2015-07-31 American Express Travel Related Services Company, Inc.
    open

    // oracle : 2014-06-19 Oracle Corporation
    oracle

    // orange : 2015-03-12 Orange Brand Services Limited
    orange

    // organic : 2014-03-27 Identity Digital Limited
    organic

    // origins : 2015-10-01 The Estée Lauder Companies Inc.
    origins

    // osaka : 2014-09-04 Osaka Registry Co., Ltd.
    osaka

    // otsuka : 2013-10-11 Otsuka Holdings Co., Ltd.
    otsuka

    // ott : 2015-06-04 Dish DBS Corporation
    ott

    // ovh : 2014-01-16 MédiaBC
    ovh

    // page : 2014-12-04 Charleston Road Registry Inc.
    page

    // panasonic : 2015-07-30 Panasonic Corporation
    panasonic

    // paris : 2014-01-30 City of Paris
    paris

    // pars : 2014-09-04 Asia Green IT System Bilgisayar San. ve Tic. Ltd. Sti.
    pars

    // partners : 2013-12-05 Binky Moon, LLC
    partners

    // parts : 2013-12-05 Binky Moon, LLC
    parts

    // party : 2014-09-11 Blue Sky Registry Limited
    party

    // passagens : 2015-03-05 Travel Reservations SRL
    passagens

    // pay : 2015-08-27 Amazon Registry Services, Inc.
    pay

    // pccw : 2015-05-14 PCCW Enterprises Limited
    pccw

    // pet : 2015-05-07 Identity Digital Limited
    pet

    // pfizer : 2015-09-11 Pfizer Inc.
    pfizer

    // pharmacy : 2014-06-19 National Association of Boards of Pharmacy
    pharmacy

    // phd : 2016-07-28 Charleston Road Registry Inc.
    phd

    // philips : 2014-11-07 Koninklijke Philips N.V.
    philips

    // phone : 2016-06-02 Dish DBS Corporation
    phone

    // photo : 2013-11-14 Registry Services, LLC
    photo

    // photography : 2013-09-20 Binky Moon, LLC
    photography

    // photos : 2013-10-17 Binky Moon, LLC
    photos

    // physio : 2014-05-01 PhysBiz Pty Ltd
    physio

    // pics : 2013-11-14 XYZ.COM LLC
    pics

    // pictet : 2014-06-26 Pictet Europe S.A.
    pictet

    // pictures : 2014-03-06 Binky Moon, LLC
    pictures

    // pid : 2015-01-08 Top Level Spectrum, Inc.
    pid

    // pin : 2014-12-18 Amazon Registry Services, Inc.
    pin

    // ping : 2015-06-11 Ping Registry Provider, Inc.
    ping

    // pink : 2013-10-01 Identity Digital Limited
    pink

    // pioneer : 2015-07-16 Pioneer Corporation
    pioneer

    // pizza : 2014-06-26 Binky Moon, LLC
    pizza

    // place : 2014-04-24 Binky Moon, LLC
    place

    // play : 2015-03-05 Charleston Road Registry Inc.
    play

    // playstation : 2015-07-02 Sony Interactive Entertainment Inc.
    playstation

    // plumbing : 2013-09-10 Binky Moon, LLC
    plumbing

    // plus : 2015-02-05 Binky Moon, LLC
    plus

    // pnc : 2015-07-02 PNC Domain Co., LLC
    pnc

    // pohl : 2014-06-23 Deutsche Vermögensberatung Aktiengesellschaft DVAG
    pohl

    // poker : 2014-07-03 Identity Digital Limited
    poker

    // politie : 2015-08-20 Politie Nederland
    politie

    // porn : 2014-10-16 ICM Registry PN LLC
    porn

    // pramerica : 2015-07-30 Prudential Financial, Inc.
    pramerica

    // praxi : 2013-12-05 Praxi S.p.A.
    praxi

    // press : 2014-04-03 Radix FZC
    press

    // prime : 2015-06-25 Amazon Registry Services, Inc.
    prime

    // prod : 2014-01-23 Charleston Road Registry Inc.
    prod

    // productions : 2013-12-05 Binky Moon, LLC
    productions

    // prof : 2014-07-24 Charleston Road Registry Inc.
    prof

    // progressive : 2015-07-23 Progressive Casualty Insurance Company
    progressive

    // promo : 2014-12-18 Identity Digital Limited
    promo

    // properties : 2013-12-05 Binky Moon, LLC
    properties

    // property : 2014-05-22 Internet Naming Company LLC
    property

    // protection : 2015-04-23 XYZ.COM LLC
    protection

    // pru : 2015-07-30 Prudential Financial, Inc.
    pru

    // prudential : 2015-07-30 Prudential Financial, Inc.
    prudential

    // pub : 2013-12-12 Dog Beach, LLC
    pub

    // pwc : 2015-10-29 PricewaterhouseCoopers LLP
    pwc

    // qpon : 2013-11-14 dotCOOL, Inc.
    qpon

    // quebec : 2013-12-19 PointQuébec Inc
    quebec

    // quest : 2015-03-26 XYZ.COM LLC
    quest

    // racing : 2014-12-04 Premier Registry Limited
    racing

    // radio : 2016-07-21 European Broadcasting Union (EBU)
    radio

    // read : 2014-12-18 Amazon Registry Services, Inc.
    read

    // realestate : 2015-09-11 dotRealEstate LLC
    realestate

    // realtor : 2014-05-29 Real Estate Domains LLC
    realtor

    // realty : 2015-03-19 Dog Beach, LLC
    realty

    // recipes : 2013-10-17 Binky Moon, LLC
    recipes

    // red : 2013-11-07 Identity Digital Limited
    red

    // redstone : 2014-10-31 Redstone Haute Couture Co., Ltd.
    redstone

    // redumbrella : 2015-03-26 Travelers TLD, LLC
    redumbrella

    // rehab : 2014-03-06 Dog Beach, LLC
    rehab

    // reise : 2014-03-13 Binky Moon, LLC
    reise

    // reisen : 2014-03-06 Binky Moon, LLC
    reisen

    // reit : 2014-09-04 National Association of Real Estate Investment Trusts, Inc.
    reit

    // reliance : 2015-04-02 Reliance Industries Limited
    reliance

    // ren : 2013-12-12 ZDNS International Limited
    ren

    // rent : 2014-12-04 XYZ.COM LLC
    rent

    // rentals : 2013-12-05 Binky Moon, LLC
    rentals

    // repair : 2013-11-07 Binky Moon, LLC
    repair

    // report : 2013-12-05 Binky Moon, LLC
    report

    // republican : 2014-03-20 Dog Beach, LLC
    republican

    // rest : 2013-12-19 Punto 2012 Sociedad Anonima Promotora de Inversion de Capital Variable
    rest

    // restaurant : 2014-07-03 Binky Moon, LLC
    restaurant

    // review : 2014-11-20 dot Review Limited
    review

    // reviews : 2013-09-13 Dog Beach, LLC
    reviews

    // rexroth : 2015-06-18 Robert Bosch GMBH
    rexroth

    // rich : 2013-11-21 iRegistry GmbH
    rich

    // richardli : 2015-05-14 Pacific Century Asset Management (HK) Limited
    richardli

    // ricoh : 2014-11-20 Ricoh Company, Ltd.
    ricoh

    // ril : 2015-04-02 Reliance Industries Limited
    ril

    // rio : 2014-02-27 Empresa Municipal de Informática SA - IPLANRIO
    rio

    // rip : 2014-07-10 Dog Beach, LLC
    rip

    // rocher : 2014-12-18 Ferrero Trading Lux S.A.
    rocher

    // rocks : 2013-11-14 Dog Beach, LLC
    rocks

    // rodeo : 2013-12-19 Registry Services, LLC
    rodeo

    // rogers : 2015-08-06 Rogers Communications Canada Inc.
    rogers

    // room : 2014-12-18 Amazon Registry Services, Inc.
    room

    // rsvp : 2014-05-08 Charleston Road Registry Inc.
    rsvp

    // rugby : 2016-12-15 World Rugby Strategic Developments Limited
    rugby

    // ruhr : 2013-10-02 dotSaarland GmbH
    ruhr

    // run : 2015-03-19 Binky Moon, LLC
    run

    // rwe : 2015-04-02 RWE AG
    rwe

    // ryukyu : 2014-01-09 BRregistry, Inc.
    ryukyu

    // saarland : 2013-12-12 dotSaarland GmbH
    saarland

    // safe : 2014-12-18 Amazon Registry Services, Inc.
    safe

    // safety : 2015-01-08 Safety Registry Services, LLC.
    safety

    // sakura : 2014-12-18 SAKURA Internet Inc.
    sakura

    // sale : 2014-10-16 Dog Beach, LLC
    sale

    // salon : 2014-12-11 Binky Moon, LLC
    salon

    // samsclub : 2015-07-31 Wal-Mart Stores, Inc.
    samsclub

    // samsung : 2014-04-03 SAMSUNG SDS CO., LTD
    samsung

    // sandvik : 2014-11-13 Sandvik AB
    sandvik

    // sandvikcoromant : 2014-11-07 Sandvik AB
    sandvikcoromant

    // sanofi : 2014-10-09 Sanofi
    sanofi

    // sap : 2014-03-27 SAP AG
    sap

    // sarl : 2014-07-03 Binky Moon, LLC
    sarl

    // sas : 2015-04-02 Research IP LLC
    sas

    // save : 2015-06-25 Amazon Registry Services, Inc.
    save

    // saxo : 2014-10-31 Saxo Bank A/S
    saxo

    // sbi : 2015-03-12 STATE BANK OF INDIA
    sbi

    // sbs : 2014-11-07 ShortDot SA
    sbs

    // sca : 2014-03-13 SVENSKA CELLULOSA AKTIEBOLAGET SCA (publ)
    sca

    // scb : 2014-02-20 The Siam Commercial Bank Public Company Limited ("SCB")
    scb

    // schaeffler : 2015-08-06 Schaeffler Technologies AG & Co. KG
    schaeffler

    // schmidt : 2014-04-03 SCHMIDT GROUPE S.A.S.
    schmidt

    // scholarships : 2014-04-24 Scholarships.com, LLC
    scholarships

    // school : 2014-12-18 Binky Moon, LLC
    school

    // schule : 2014-03-06 Binky Moon, LLC
    schule

    // schwarz : 2014-09-18 Schwarz Domains und Services GmbH & Co. KG
    schwarz

    // science : 2014-09-11 dot Science Limited
    science

    // scot : 2014-01-23 Dot Scot Registry Limited
    scot

    // search : 2016-06-09 Charleston Road Registry Inc.
    search

    // seat : 2014-05-22 SEAT, S.A. (Sociedad Unipersonal)
    seat

    // secure : 2015-08-27 Amazon Registry Services, Inc.
    secure

    // security : 2015-05-14 XYZ.COM LLC
    security

    // seek : 2014-12-04 Seek Limited
    seek

    // select : 2015-10-08 Registry Services, LLC
    select

    // sener : 2014-10-24 Sener Ingeniería y Sistemas, S.A.
    sener

    // services : 2014-02-27 Binky Moon, LLC
    services

    // ses : 2015-07-23 SES
    ses

    // seven : 2015-08-06 Seven West Media Ltd
    seven

    // sew : 2014-07-17 SEW-EURODRIVE GmbH & Co KG
    sew

    // sex : 2014-11-13 ICM Registry SX LLC
    sex

    // sexy : 2013-09-11 Internet Naming Company LLC
    sexy

    // sfr : 2015-08-13 Societe Francaise du Radiotelephone - SFR
    sfr

    // shangrila : 2015-09-03 Shangri‐La International Hotel Management Limited
    shangrila

    // sharp : 2014-05-01 Sharp Corporation
    sharp

    // shaw : 2015-04-23 Shaw Cablesystems G.P.
    shaw

    // shell : 2015-07-30 Shell Information Technology International Inc
    shell

    // shia : 2014-09-04 Asia Green IT System Bilgisayar San. ve Tic. Ltd. Sti.
    shia

    // shiksha : 2013-11-14 Identity Digital Limited
    shiksha

    // shoes : 2013-10-02 Binky Moon, LLC
    shoes

    // shop : 2016-04-08 GMO Registry, Inc.
    shop

    // shopping : 2016-03-31 Binky Moon, LLC
    shopping

    // shouji : 2015-01-08 Beijing Qihu Keji Co., Ltd.
    shouji

    // show : 2015-03-05 Binky Moon, LLC
    show

    // showtime : 2015-08-06 CBS Domains Inc.
    showtime

    // silk : 2015-06-25 Amazon Registry Services, Inc.
    silk

    // sina : 2015-03-12 Sina Corporation
    sina

    // singles : 2013-08-27 Binky Moon, LLC
    singles

    // site : 2015-01-15 Radix FZC
    site

    // ski : 2015-04-09 Identity Digital Limited
    ski

    // skin : 2015-01-15 XYZ.COM LLC
    skin

    // sky : 2014-06-19 Sky International AG
    sky

    // skype : 2014-12-18 Microsoft Corporation
    skype

    // sling : 2015-07-30 DISH Technologies L.L.C.
    sling

    // smart : 2015-07-09 Smart Communications, Inc. (SMART)
    smart

    // smile : 2014-12-18 Amazon Registry Services, Inc.
    smile

    // sncf : 2015-02-19 Société Nationale des Chemins de fer Francais S N C F
    sncf

    // soccer : 2015-03-26 Binky Moon, LLC
    soccer

    // social : 2013-11-07 Dog Beach, LLC
    social

    // softbank : 2015-07-02 SoftBank Group Corp.
    softbank

    // software : 2014-03-20 Dog Beach, LLC
    software

    // sohu : 2013-12-19 Sohu.com Limited
    sohu

    // solar : 2013-11-07 Binky Moon, LLC
    solar

    // solutions : 2013-11-07 Binky Moon, LLC
    solutions

    // song : 2015-02-26 Amazon Registry Services, Inc.
    song

    // sony : 2015-01-08 Sony Corporation
    sony

    // soy : 2014-01-23 Charleston Road Registry Inc.
    soy

    // spa : 2019-09-19 Asia Spa and Wellness Promotion Council Limited
    spa

    // space : 2014-04-03 Radix FZC
    space

    // sport : 2017-11-16 Global Association of International Sports Federations (GAISF)
    sport

    // spot : 2015-02-26 Amazon Registry Services, Inc.
    spot

    // srl : 2015-05-07 InterNetX, Corp
    srl

    // stada : 2014-11-13 STADA Arzneimittel AG
    stada

    // staples : 2015-07-30 Staples, Inc.
    staples

    // star : 2015-01-08 Star India Private Limited
    star

    // statebank : 2015-03-12 STATE BANK OF INDIA
    statebank

    // statefarm : 2015-07-30 State Farm Mutual Automobile Insurance Company
    statefarm

    // stc : 2014-10-09 Saudi Telecom Company
    stc

    // stcgroup : 2014-10-09 Saudi Telecom Company
    stcgroup

    // stockholm : 2014-12-18 Stockholms kommun
    stockholm

    // storage : 2014-12-22 XYZ.COM LLC
    storage

    // store : 2015-04-09 Radix FZC
    store

    // stream : 2016-01-08 dot Stream Limited
    stream

    // studio : 2015-02-11 Dog Beach, LLC
    studio

    // study : 2014-12-11 Registry Services, LLC
    study

    // style : 2014-12-04 Binky Moon, LLC
    style

    // sucks : 2014-12-22 Vox Populi Registry Ltd.
    sucks

    // supplies : 2013-12-19 Binky Moon, LLC
    supplies

    // supply : 2013-12-19 Binky Moon, LLC
    supply

    // support : 2013-10-24 Binky Moon, LLC
    support

    // surf : 2014-01-09 Registry Services, LLC
    surf

    // surgery : 2014-03-20 Binky Moon, LLC
    surgery

    // suzuki : 2014-02-20 SUZUKI MOTOR CORPORATION
    suzuki

    // swatch : 2015-01-08 The Swatch Group Ltd
    swatch

    // swiss : 2014-10-16 Swiss Confederation
    swiss

    // sydney : 2014-09-18 State of New South Wales, Department of Premier and Cabinet
    sydney

    // systems : 2013-11-07 Binky Moon, LLC
    systems

    // tab : 2014-12-04 Tabcorp Holdings Limited
    tab

    // taipei : 2014-07-10 Taipei City Government
    taipei

    // talk : 2015-04-09 Amazon Registry Services, Inc.
    talk

    // taobao : 2015-01-15 Alibaba Group Holding Limited
    taobao

    // target : 2015-07-31 Target Domain Holdings, LLC
    target

    // tatamotors : 2015-03-12 Tata Motors Ltd
    tatamotors

    // tatar : 2014-04-24 Limited Liability Company "Coordination Center of Regional Domain of Tatarstan Republic"
    tatar

    // tattoo : 2013-08-30 Top Level Design, LLC
    tattoo

    // tax : 2014-03-20 Binky Moon, LLC
    tax

    // taxi : 2015-03-19 Binky Moon, LLC
    taxi

    // tci : 2014-09-12 Asia Green IT System Bilgisayar San. ve Tic. Ltd. Sti.
    tci

    // tdk : 2015-06-11 TDK Corporation
    tdk

    // team : 2015-03-05 Binky Moon, LLC
    team

    // tech : 2015-01-30 Radix FZC
    tech

    // technology : 2013-09-13 Binky Moon, LLC
    technology

    // temasek : 2014-08-07 Temasek Holdings (Private) Limited
    temasek

    // tennis : 2014-12-04 Binky Moon, LLC
    tennis

    // teva : 2015-07-02 Teva Pharmaceutical Industries Limited
    teva

    // thd : 2015-04-02 Home Depot Product Authority, LLC
    thd

    // theater : 2015-03-19 Binky Moon, LLC
    theater

    // theatre : 2015-05-07 XYZ.COM LLC
    theatre

    // tiaa : 2015-07-23 Teachers Insurance and Annuity Association of America
    tiaa

    // tickets : 2015-02-05 XYZ.COM LLC
    tickets

    // tienda : 2013-11-14 Binky Moon, LLC
    tienda

    // tiffany : 2015-01-30 Tiffany and Company
    tiffany

    // tips : 2013-09-20 Binky Moon, LLC
    tips

    // tires : 2014-11-07 Binky Moon, LLC
    tires

    // tirol : 2014-04-24 punkt Tirol GmbH
    tirol

    // tjmaxx : 2015-07-16 The TJX Companies, Inc.
    tjmaxx

    // tjx : 2015-07-16 The TJX Companies, Inc.
    tjx

    // tkmaxx : 2015-07-16 The TJX Companies, Inc.
    tkmaxx

    // tmall : 2015-01-15 Alibaba Group Holding Limited
    tmall

    // today : 2013-09-20 Binky Moon, LLC
    today

    // tokyo : 2013-11-13 GMO Registry, Inc.
    tokyo

    // tools : 2013-11-21 Binky Moon, LLC
    tools

    // top : 2014-03-20 .TOP Registry
    top

    // toray : 2014-12-18 Toray Industries, Inc.
    toray

    // toshiba : 2014-04-10 TOSHIBA Corporation
    toshiba

    // total : 2015-08-06 TOTAL SE
    total

    // tours : 2015-01-22 Binky Moon, LLC
    tours

    // town : 2014-03-06 Binky Moon, LLC
    town

    // toyota : 2015-04-23 TOYOTA MOTOR CORPORATION
    toyota

    // toys : 2014-03-06 Binky Moon, LLC
    toys

    // trade : 2014-01-23 Elite Registry Limited
    trade

    // trading : 2014-12-11 Dog Beach, LLC
    trading

    // training : 2013-11-07 Binky Moon, LLC
    training

    // travel : 2015-10-09 Dog Beach, LLC
    travel

    // travelchannel : 2015-07-02 Lifestyle Domain Holdings, Inc.
    travelchannel

    // travelers : 2015-03-26 Travelers TLD, LLC
    travelers

    // travelersinsurance : 2015-03-26 Travelers TLD, LLC
    travelersinsurance

    // trust : 2014-10-16 Internet Naming Company LLC
    trust

    // trv : 2015-03-26 Travelers TLD, LLC
    trv

    // tube : 2015-06-11 Latin American Telecom LLC
    tube

    // tui : 2014-07-03 TUI AG
    tui

    // tunes : 2015-02-26 Amazon Registry Services, Inc.
    tunes

    // tushu : 2014-12-18 Amazon Registry Services, Inc.
    tushu

    // tvs : 2015-02-19 T V SUNDRAM IYENGAR  & SONS LIMITED
    tvs

    // ubank : 2015-08-20 National Australia Bank Limited
    ubank

    // ubs : 2014-12-11 UBS AG
    ubs

    // unicom : 2015-10-15 China United Network Communications Corporation Limited
    unicom

    // university : 2014-03-06 Binky Moon, LLC
    university

    // uno : 2013-09-11 Radix FZC
    uno

    // uol : 2014-05-01 UBN INTERNET LTDA.
    uol

    // ups : 2015-06-25 UPS Market Driver, Inc.
    ups

    // vacations : 2013-12-05 Binky Moon, LLC
    vacations

    // vana : 2014-12-11 Lifestyle Domain Holdings, Inc.
    vana

    // vanguard : 2015-09-03 The Vanguard Group, Inc.
    vanguard

    // vegas : 2014-01-16 Dot Vegas, Inc.
    vegas

    // ventures : 2013-08-27 Binky Moon, LLC
    ventures

    // verisign : 2015-08-13 VeriSign, Inc.
    verisign

    // versicherung : 2014-03-20 tldbox GmbH
    versicherung

    // vet : 2014-03-06 Dog Beach, LLC
    vet

    // viajes : 2013-10-17 Binky Moon, LLC
    viajes

    // video : 2014-10-16 Dog Beach, LLC
    video

    // vig : 2015-05-14 VIENNA INSURANCE GROUP AG Wiener Versicherung Gruppe
    vig

    // viking : 2015-04-02 Viking River Cruises (Bermuda) Ltd.
    viking

    // villas : 2013-12-05 Binky Moon, LLC
    villas

    // vin : 2015-06-18 Binky Moon, LLC
    vin

    // vip : 2015-01-22 Registry Services, LLC
    vip

    // virgin : 2014-09-25 Virgin Enterprises Limited
    virgin

    // visa : 2015-07-30 Visa Worldwide Pte. Limited
    visa

    // vision : 2013-12-05 Binky Moon, LLC
    vision

    // viva : 2014-11-07 Saudi Telecom Company
    viva

    // vivo : 2015-07-31 Telefonica Brasil S.A.
    vivo

    // vlaanderen : 2014-02-06 DNS.be vzw
    vlaanderen

    // vodka : 2013-12-19 Registry Services, LLC
    vodka

    // volkswagen : 2015-05-14 Volkswagen Group of America Inc.
    volkswagen

    // volvo : 2015-11-12 Volvo Holding Sverige Aktiebolag
    volvo

    // vote : 2013-11-21 Monolith Registry LLC
    vote

    // voting : 2013-11-13 Valuetainment Corp.
    voting

    // voto : 2013-11-21 Monolith Registry LLC
    voto

    // voyage : 2013-08-27 Binky Moon, LLC
    voyage

    // vuelos : 2015-03-05 Travel Reservations SRL
    vuelos

    // wales : 2014-05-08 Nominet UK
    wales

    // walmart : 2015-07-31 Wal-Mart Stores, Inc.
    walmart

    // walter : 2014-11-13 Sandvik AB
    walter

    // wang : 2013-10-24 Zodiac Wang Limited
    wang

    // wanggou : 2014-12-18 Amazon Registry Services, Inc.
    wanggou

    // watch : 2013-11-14 Binky Moon, LLC
    watch

    // watches : 2014-12-22 Identity Digital Limited
    watches

    // weather : 2015-01-08 International Business Machines Corporation
    weather

    // weatherchannel : 2015-03-12 International Business Machines Corporation
    weatherchannel

    // webcam : 2014-01-23 dot Webcam Limited
    webcam

    // weber : 2015-06-04 Saint-Gobain Weber SA
    weber

    // website : 2014-04-03 Radix FZC
    website

    // wedding : 2014-04-24 Registry Services, LLC
    wedding

    // weibo : 2015-03-05 Sina Corporation
    weibo

    // weir : 2015-01-29 Weir Group IP Limited
    weir

    // whoswho : 2014-02-20 Who's Who Registry
    whoswho

    // wien : 2013-10-28 punkt.wien GmbH
    wien

    // wiki : 2013-11-07 Top Level Design, LLC
    wiki

    // williamhill : 2014-03-13 William Hill Organization Limited
    williamhill

    // win : 2014-11-20 First Registry Limited
    win

    // windows : 2014-12-18 Microsoft Corporation
    windows

    // wine : 2015-06-18 Binky Moon, LLC
    wine

    // winners : 2015-07-16 The TJX Companies, Inc.
    winners

    // wme : 2014-02-13 William Morris Endeavor Entertainment, LLC
    wme

    // wolterskluwer : 2015-08-06 Wolters Kluwer N.V.
    wolterskluwer

    // woodside : 2015-07-09 Woodside Petroleum Limited
    woodside

    // work : 2013-12-19 Registry Services, LLC
    work

    // works : 2013-11-14 Binky Moon, LLC
    works

    // world : 2014-06-12 Binky Moon, LLC
    world

    // wow : 2015-10-08 Amazon Registry Services, Inc.
    wow

    // wtc : 2013-12-19 World Trade Centers Association, Inc.
    wtc

    // wtf : 2014-03-06 Binky Moon, LLC
    wtf

    // xbox : 2014-12-18 Microsoft Corporation
    xbox

    // xerox : 2014-10-24 Xerox DNHC LLC
    xerox

    // xfinity : 2015-07-09 Comcast IP Holdings I, LLC
    xfinity

    // xihuan : 2015-01-08 Beijing Qihu Keji Co., Ltd.
    xihuan

    // xin : 2014-12-11 Elegant Leader Limited
    xin

    // xn--11b4c3d : 2015-01-15 VeriSign Sarl
    कॉम

    // xn--1ck2e1b : 2015-02-26 Amazon Registry Services, Inc.
    セール

    // xn--1qqw23a : 2014-01-09 Guangzhou YU Wei Information Technology Co., Ltd.
    佛山

    // xn--30rr7y : 2014-06-12 Excellent First Limited
    慈善

    // xn--3bst00m : 2013-09-13 Eagle Horizon Limited
    集团

    // xn--3ds443g : 2013-09-08 TLD REGISTRY LIMITED OY
    在线

    // xn--3pxu8k : 2015-01-15 VeriSign Sarl
    点看

    // xn--42c2d9a : 2015-01-15 VeriSign Sarl
    คอม

    // xn--45q11c : 2013-11-21 Zodiac Gemini Ltd
    八卦

    // xn--4gbrim : 2013-10-04 Helium TLDs Ltd
    موقع

    // xn--55qw42g : 2013-11-08 China Organizational Name Administration Center
    公益

    // xn--55qx5d : 2013-11-14 China Internet Network Information Center (CNNIC)
    公司

    // xn--5su34j936bgsg : 2015-09-03 Shangri‐La International Hotel Management Limited
    香格里拉

    // xn--5tzm5g : 2014-12-22 Global Website TLD Asia Limited
    网站

    // xn--6frz82g : 2013-09-23 Identity Digital Limited
    移动

    // xn--6qq986b3xl : 2013-09-13 Tycoon Treasure Limited
    我爱你

    // xn--80adxhks : 2013-12-19 Foundation for Assistance for Internet Technologies and Infrastructure Development (FAITID)
    москва

    // xn--80aqecdr1a : 2015-10-21 Pontificium Consilium de Comunicationibus Socialibus (PCCS) (Pontifical Council for Social Communication)
    католик

    // xn--80asehdb : 2013-07-14 CORE Association
    онлайн

    // xn--80aswg : 2013-07-14 CORE Association
    сайт

    // xn--8y0a063a : 2015-03-26 China United Network Communications Corporation Limited
    联通

    // xn--9dbq2a : 2015-01-15 VeriSign Sarl
    קום

    // xn--9et52u : 2014-06-12 RISE VICTORY LIMITED
    时尚

    // xn--9krt00a : 2015-03-12 Sina Corporation
    微博

    // xn--b4w605ferd : 2014-08-07 Temasek Holdings (Private) Limited
    淡马锡

    // xn--bck1b9a5dre4c : 2015-02-26 Amazon Registry Services, Inc.
    ファッション

    // xn--c1avg : 2013-11-14 Public Interest Registry
    орг

    // xn--c2br7g : 2015-01-15 VeriSign Sarl
    नेट

    // xn--cck2b3b : 2015-02-26 Amazon Registry Services, Inc.
    ストア

    // xn--cckwcxetd : 2019-12-19 Amazon Registry Services, Inc.
    アマゾン

    // xn--cg4bki : 2013-09-27 SAMSUNG SDS CO., LTD
    삼성

    // xn--czr694b : 2014-01-16 Internet DotTrademark Organisation Limited
    商标

    // xn--czrs0t : 2013-12-19 Binky Moon, LLC
    商店

    // xn--czru2d : 2013-11-21 Zodiac Aquarius Limited
    商城

    // xn--d1acj3b : 2013-11-20 The Foundation for Network Initiatives “The Smart Internet”
    дети

    // xn--eckvdtc9d : 2014-12-18 Amazon Registry Services, Inc.
    ポイント

    // xn--efvy88h : 2014-08-22 Guangzhou YU Wei Information Technology Co., Ltd.
    新闻

    // xn--fct429k : 2015-04-09 Amazon Registry Services, Inc.
    家電

    // xn--fhbei : 2015-01-15 VeriSign Sarl
    كوم

    // xn--fiq228c5hs : 2013-09-08 TLD REGISTRY LIMITED OY
    中文网

    // xn--fiq64b : 2013-10-14 CITIC Group Corporation
    中信

    // xn--fjq720a : 2014-05-22 Binky Moon, LLC
    娱乐

    // xn--flw351e : 2014-07-31 Charleston Road Registry Inc.
    谷歌

    // xn--fzys8d69uvgm : 2015-05-14 PCCW Enterprises Limited
    電訊盈科

    // xn--g2xx48c : 2015-01-30 Nawang Heli(Xiamen) Network Service Co., LTD.
    购物

    // xn--gckr3f0f : 2015-02-26 Amazon Registry Services, Inc.
    クラウド

    // xn--gk3at1e : 2015-10-08 Amazon Registry Services, Inc.
    通販

    // xn--hxt814e : 2014-05-15 Zodiac Taurus Limited
    网店

    // xn--i1b6b1a6a2e : 2013-11-14 Public Interest Registry
    संगठन

    // xn--imr513n : 2014-12-11 Internet DotTrademark Organisation Limited
    餐厅

    // xn--io0a7i : 2013-11-14 China Internet Network Information Center (CNNIC)
    网络

    // xn--j1aef : 2015-01-15 VeriSign Sarl
    ком

    // xn--jlq480n2rg : 2019-12-19 Amazon Registry Services, Inc.
    亚马逊

    // xn--jvr189m : 2015-02-26 Amazon Registry Services, Inc.
    食品

    // xn--kcrx77d1x4a : 2014-11-07 Koninklijke Philips N.V.
    飞利浦

    // xn--kput3i : 2014-02-13 Beijing RITT-Net Technology Development Co., Ltd
    手机

    // xn--mgba3a3ejt : 2014-11-20 Aramco Services Company
    ارامكو

    // xn--mgba7c0bbn0a : 2015-05-14 Crescent Holding GmbH
    العليان

    // xn--mgbaakc7dvf : 2015-09-03 Emirates Telecommunications Corporation (trading as Etisalat)
    اتصالات

    // xn--mgbab2bd : 2013-10-31 CORE Association
    بازار

    // xn--mgbca7dzdo : 2015-07-30 Abu Dhabi Systems and Information Centre
    ابوظبي

    // xn--mgbi4ecexp : 2015-10-21 Pontificium Consilium de Comunicationibus Socialibus (PCCS) (Pontifical Council for Social Communication)
    كاثوليك

    // xn--mgbt3dhd : 2014-09-04 Asia Green IT System Bilgisayar San. ve Tic. Ltd. Sti.
    همراه

    // xn--mk1bu44c : 2015-01-15 VeriSign Sarl
    닷컴

    // xn--mxtq1m : 2014-03-06 Net-Chinese Co., Ltd.
    政府

    // xn--ngbc5azd : 2013-07-13 International Domain Registry Pty. Ltd.
    شبكة

    // xn--ngbe9e0a : 2014-12-04 Kuwait Finance House
    بيتك

    // xn--ngbrx : 2015-11-12 League of Arab States
    عرب

    // xn--nqv7f : 2013-11-14 Public Interest Registry
    机构

    // xn--nqv7fs00ema : 2013-11-14 Public Interest Registry
    组织机构

    // xn--nyqy26a : 2014-11-07 Stable Tone Limited
    健康

    // xn--otu796d : 2017-08-06 Jiang Yu Liang Cai Technology Company Limited
    招聘

    // xn--p1acf : 2013-12-12 Rusnames Limited
    рус

    // xn--pssy2u : 2015-01-15 VeriSign Sarl
    大拿

    // xn--q9jyb4c : 2013-09-17 Charleston Road Registry Inc.
    みんな

    // xn--qcka1pmc : 2014-07-31 Charleston Road Registry Inc.
    グーグル

    // xn--rhqv96g : 2013-09-11 Stable Tone Limited
    世界

    // xn--rovu88b : 2015-02-26 Amazon Registry Services, Inc.
    書籍

    // xn--ses554g : 2014-01-16 KNET Co., Ltd.
    网址

    // xn--t60b56a : 2015-01-15 VeriSign Sarl
    닷넷

    // xn--tckwe : 2015-01-15 VeriSign Sarl
    コム

    // xn--tiq49xqyj : 2015-10-21 Pontificium Consilium de Comunicationibus Socialibus (PCCS) (Pontifical Council for Social Communication)
    天主教

    // xn--unup4y : 2013-07-14 Binky Moon, LLC
    游戏

    // xn--vermgensberater-ctb : 2014-06-23 Deutsche Vermögensberatung Aktiengesellschaft DVAG
    vermögensberater

    // xn--vermgensberatung-pwb : 2014-06-23 Deutsche Vermögensberatung Aktiengesellschaft DVAG
    vermögensberatung

    // xn--vhquv : 2013-08-27 Binky Moon, LLC
    企业

    // xn--vuq861b : 2014-10-16 Beijing Tele-info Network Technology Co., Ltd.
    信息

    // xn--w4r85el8fhu5dnra : 2015-04-30 Kerry Trading Co. Limited
    嘉里大酒店

    // xn--w4rs40l : 2015-07-30 Kerry Trading Co. Limited
    嘉里

    // xn--xhq521b : 2013-11-14 Guangzhou YU Wei Information Technology Co., Ltd.
    广东

    // xn--zfr164b : 2013-11-08 China Organizational Name Administration Center
    政务

    // xyz : 2013-12-05 XYZ.COM LLC
    xyz

    // yachts : 2014-01-09 XYZ.COM LLC
    yachts

    // yahoo : 2015-04-02 Oath Inc.
    yahoo

    // yamaxun : 2014-12-18 Amazon Registry Services, Inc.
    yamaxun

    // yandex : 2014-04-10 Yandex Europe B.V.
    yandex

    // yodobashi : 2014-11-20 YODOBASHI CAMERA CO.,LTD.
    yodobashi

    // yoga : 2014-05-29 Registry Services, LLC
    yoga

    // yokohama : 2013-12-12 GMO Registry, Inc.
    yokohama

    // you : 2015-04-09 Amazon Registry Services, Inc.
    you

    // youtube : 2014-05-01 Charleston Road Registry Inc.
    youtube

    // yun : 2015-01-08 Beijing Qihu Keji Co., Ltd.
    yun

    // zappos : 2015-06-25 Amazon Registry Services, Inc.
    zappos

    // zara : 2014-11-07 Industria de Diseño Textil, S.A. (INDITEX, S.A.)
    zara

    // zero : 2014-12-18 Amazon Registry Services, Inc.
    zero

    // zip : 2014-05-08 Charleston Road Registry Inc.
    zip

    // zone : 2013-11-14 Binky Moon, LLC
    zone

    // zuerich : 2014-11-07 Kanton Zürich (Canton of Zurich)
    zuerich


    // ===END ICANN DOMAINS===
    // ===BEGIN PRIVATE DOMAINS===
    // (Note: these are in alphabetical order by company name)

    // 1GB LLC : https://www.1gb.ua/
    // Submitted by 1GB LLC <noc@1gb.com.ua>
    cc.ua
    inf.ua
    ltd.ua

    // 611coin : https://611project.org/
    611.to

    // Aaron Marais' Gitlab pages: https://lab.aaronleem.co.za
    // Submitted by Aaron Marais <its_me@aaronleem.co.za>
    graphox.us

    // accesso Technology Group, plc. : https://accesso.com/
    // Submitted by accesso Team <accessoecommerce@accesso.com>
    *.devcdnaccesso.com

    // Acorn Labs : https://acorn.io
    // Submitted by Craig Jellick <domains@acorn.io>
    *.on-acorn.io

    // ActiveTrail: https://www.activetrail.biz/
    // Submitted by Ofer Kalaora <postmaster@activetrail.com>
    activetrail.biz

    // Adobe : https://www.adobe.com/
    // Submitted by Ian Boston <boston@adobe.com> and Lars Trieloff <trieloff@adobe.com>
    adobeaemcloud.com
    *.dev.adobeaemcloud.com
    hlx.live
    adobeaemcloud.net
    hlx.page
    hlx3.page

    // Agnat sp. z o.o. : https://domena.pl
    // Submitted by Przemyslaw Plewa <it-admin@domena.pl>
    beep.pl

    // Airkit : https://www.airkit.com/
    // Submitted by Grant Cooksey <security@airkit.com>
    airkitapps.com
    airkitapps-au.com
    airkitapps.eu

    // Aiven: https://aiven.io/
    // Submitted by Etienne Stalmans <security@aiven.io>
    aivencloud.com

    // alboto.ca : http://alboto.ca
    // Submitted by Anton Avramov <avramov@alboto.ca>
    barsy.ca

    // Alces Software Ltd : http://alces-software.com
    // Submitted by Mark J. Titorenko <mark.titorenko@alces-software.com>
    *.compute.estate
    *.alces.network

    // all-inkl.com : https://all-inkl.com
    // Submitted by Werner Kaltofen <wk@all-inkl.com>
    kasserver.com

    // Altervista: https://www.altervista.org
    // Submitted by Carlo Cannas <tech_staff@altervista.it>
    altervista.org

    // alwaysdata : https://www.alwaysdata.com
    // Submitted by Cyril <admin@alwaysdata.com>
    alwaysdata.net

    // Amaze Software : https://amaze.co
    // Submitted by Domain Admin <domainadmin@amaze.co>
    myamaze.net

    // Amazon : https://www.amazon.com/
    // Submitted by AWS Security <psl-maintainers@amazon.com>
    // Subsections of Amazon/subsidiaries will appear until "concludes" tag

    // Amazon CloudFront
    // Submitted by Donavan Miller <donavanm@amazon.com>
    // Reference: 54144616-fd49-4435-8535-19c6a601bdb3
    cloudfront.net

    // Amazon EC2
    // Submitted by Luke Wells <psl-maintainers@amazon.com>
    // Reference: 4c38fa71-58ac-4768-99e5-689c1767e537
    *.compute.amazonaws.com
    *.compute-1.amazonaws.com
    *.compute.amazonaws.com.cn
    us-east-1.amazonaws.com

    // Amazon S3
    // Submitted by Luke Wells <psl-maintainers@amazon.com>
    // Reference: d068bd97-f0a9-4838-a6d8-954b622ef4ae
    s3.cn-north-1.amazonaws.com.cn
    s3.dualstack.ap-northeast-1.amazonaws.com
    s3.dualstack.ap-northeast-2.amazonaws.com
    s3.ap-northeast-2.amazonaws.com
    s3-website.ap-northeast-2.amazonaws.com
    s3.dualstack.ap-south-1.amazonaws.com
    s3.ap-south-1.amazonaws.com
    s3-website.ap-south-1.amazonaws.com
    s3.dualstack.ap-southeast-1.amazonaws.com
    s3.dualstack.ap-southeast-2.amazonaws.com
    s3.dualstack.ca-central-1.amazonaws.com
    s3.ca-central-1.amazonaws.com
    s3-website.ca-central-1.amazonaws.com
    s3.dualstack.eu-central-1.amazonaws.com
    s3.eu-central-1.amazonaws.com
    s3-website.eu-central-1.amazonaws.com
    s3.dualstack.eu-west-1.amazonaws.com
    s3.dualstack.eu-west-2.amazonaws.com
    s3.eu-west-2.amazonaws.com
    s3-website.eu-west-2.amazonaws.com
    s3.dualstack.eu-west-3.amazonaws.com
    s3.eu-west-3.amazonaws.com
    s3-website.eu-west-3.amazonaws.com
    s3.amazonaws.com
    s3-ap-northeast-1.amazonaws.com
    s3-ap-northeast-2.amazonaws.com
    s3-ap-south-1.amazonaws.com
    s3-ap-southeast-1.amazonaws.com
    s3-ap-southeast-2.amazonaws.com
    s3-ca-central-1.amazonaws.com
    s3-eu-central-1.amazonaws.com
    s3-eu-west-1.amazonaws.com
    s3-eu-west-2.amazonaws.com
    s3-eu-west-3.amazonaws.com
    s3-external-1.amazonaws.com
    s3-fips-us-gov-west-1.amazonaws.com
    s3-sa-east-1.amazonaws.com
    s3-us-east-2.amazonaws.com
    s3-us-gov-west-1.amazonaws.com
    s3-us-west-1.amazonaws.com
    s3-us-west-2.amazonaws.com
    s3-website-ap-northeast-1.amazonaws.com
    s3-website-ap-southeast-1.amazonaws.com
    s3-website-ap-southeast-2.amazonaws.com
    s3-website-eu-west-1.amazonaws.com
    s3-website-sa-east-1.amazonaws.com
    s3-website-us-east-1.amazonaws.com
    s3-website-us-west-1.amazonaws.com
    s3-website-us-west-2.amazonaws.com
    s3.dualstack.sa-east-1.amazonaws.com
    s3.dualstack.us-east-1.amazonaws.com
    s3.dualstack.us-east-2.amazonaws.com
    s3.us-east-2.amazonaws.com
    s3-website.us-east-2.amazonaws.com

    // AWS Cloud9
    // Submitted by: AWS Security <psl-maintainers@amazon.com>
    // Reference: 2b6dfa9a-3a7f-4367-b2e7-0321e77c0d59
    vfs.cloud9.af-south-1.amazonaws.com
    webview-assets.cloud9.af-south-1.amazonaws.com
    vfs.cloud9.ap-east-1.amazonaws.com
    webview-assets.cloud9.ap-east-1.amazonaws.com
    vfs.cloud9.ap-northeast-1.amazonaws.com
    webview-assets.cloud9.ap-northeast-1.amazonaws.com
    vfs.cloud9.ap-northeast-2.amazonaws.com
    webview-assets.cloud9.ap-northeast-2.amazonaws.com
    vfs.cloud9.ap-northeast-3.amazonaws.com
    webview-assets.cloud9.ap-northeast-3.amazonaws.com
    vfs.cloud9.ap-south-1.amazonaws.com
    webview-assets.cloud9.ap-south-1.amazonaws.com
    vfs.cloud9.ap-southeast-1.amazonaws.com
    webview-assets.cloud9.ap-southeast-1.amazonaws.com
    vfs.cloud9.ap-southeast-2.amazonaws.com
    webview-assets.cloud9.ap-southeast-2.amazonaws.com
    vfs.cloud9.ca-central-1.amazonaws.com
    webview-assets.cloud9.ca-central-1.amazonaws.com
    vfs.cloud9.eu-central-1.amazonaws.com
    webview-assets.cloud9.eu-central-1.amazonaws.com
    vfs.cloud9.eu-north-1.amazonaws.com
    webview-assets.cloud9.eu-north-1.amazonaws.com
    vfs.cloud9.eu-south-1.amazonaws.com
    webview-assets.cloud9.eu-south-1.amazonaws.com
    vfs.cloud9.eu-west-1.amazonaws.com
    webview-assets.cloud9.eu-west-1.amazonaws.com
    vfs.cloud9.eu-west-2.amazonaws.com
    webview-assets.cloud9.eu-west-2.amazonaws.com
    vfs.cloud9.eu-west-3.amazonaws.com
    webview-assets.cloud9.eu-west-3.amazonaws.com
    vfs.cloud9.me-south-1.amazonaws.com
    webview-assets.cloud9.me-south-1.amazonaws.com
    vfs.cloud9.sa-east-1.amazonaws.com
    webview-assets.cloud9.sa-east-1.amazonaws.com
    vfs.cloud9.us-east-1.amazonaws.com
    webview-assets.cloud9.us-east-1.amazonaws.com
    vfs.cloud9.us-east-2.amazonaws.com
    webview-assets.cloud9.us-east-2.amazonaws.com
    vfs.cloud9.us-west-1.amazonaws.com
    webview-assets.cloud9.us-west-1.amazonaws.com
    vfs.cloud9.us-west-2.amazonaws.com
    webview-assets.cloud9.us-west-2.amazonaws.com

    // AWS Elastic Beanstalk
    // Submitted by Luke Wells <psl-maintainers@amazon.com>
    // Reference: aa202394-43a0-4857-b245-8db04549137e
    cn-north-1.eb.amazonaws.com.cn
    cn-northwest-1.eb.amazonaws.com.cn
    elasticbeanstalk.com
    ap-northeast-1.elasticbeanstalk.com
    ap-northeast-2.elasticbeanstalk.com
    ap-northeast-3.elasticbeanstalk.com
    ap-south-1.elasticbeanstalk.com
    ap-southeast-1.elasticbeanstalk.com
    ap-southeast-2.elasticbeanstalk.com
    ca-central-1.elasticbeanstalk.com
    eu-central-1.elasticbeanstalk.com
    eu-west-1.elasticbeanstalk.com
    eu-west-2.elasticbeanstalk.com
    eu-west-3.elasticbeanstalk.com
    sa-east-1.elasticbeanstalk.com
    us-east-1.elasticbeanstalk.com
    us-east-2.elasticbeanstalk.com
    us-gov-west-1.elasticbeanstalk.com
    us-west-1.elasticbeanstalk.com
    us-west-2.elasticbeanstalk.com

    // (AWS) Elastic Load Balancing
    // Submitted by Luke Wells <psl-maintainers@amazon.com>
    // Reference: 12a3d528-1bac-4433-a359-a395867ffed2
    *.elb.amazonaws.com.cn
    *.elb.amazonaws.com

    // AWS Global Accelerator
    // Submitted by Daniel Massaguer <psl-maintainers@amazon.com>
    // Reference: d916759d-a08b-4241-b536-4db887383a6a
    awsglobalaccelerator.com

    // eero
    // Submitted by Yue Kang <eero-dynamic-dns@amazon.com>
    // Reference: 264afe70-f62c-4c02-8ab9-b5281ed24461
    eero.online
    eero-stage.online

    // concludes Amazon

    // Amune : https://amune.org/
    // Submitted by Team Amune <cert@amune.org>
    t3l3p0rt.net
    tele.amune.org

    // Apigee : https://apigee.com/
    // Submitted by Apigee Security Team <security@apigee.com>
    apigee.io

    // Apphud : https://apphud.com
    // Submitted by Alexander Selivanov <alex@apphud.com>
    siiites.com

    // Appspace : https://www.appspace.com
    // Submitted by Appspace Security Team <security@appspace.com>
    appspacehosted.com
    appspaceusercontent.com

    // Appudo UG (haftungsbeschränkt) : https://www.appudo.com
    // Submitted by Alexander Hochbaum <admin@appudo.com>
    appudo.net

    // Aptible : https://www.aptible.com/
    // Submitted by Thomas Orozco <thomas@aptible.com>
    on-aptible.com

    // ASEINet : https://www.aseinet.com/
    // Submitted by Asei SEKIGUCHI <mail@aseinet.com>
    user.aseinet.ne.jp
    gv.vc
    d.gv.vc

    // Asociación Amigos de la Informática "Euskalamiga" : http://encounter.eus/
    // Submitted by Hector Martin <marcan@euskalencounter.org>
    user.party.eus

    // Association potager.org : https://potager.org/
    // Submitted by Lunar <jardiniers@potager.org>
    pimienta.org
    poivron.org
    potager.org
    sweetpepper.org

    // ASUSTOR Inc. : http://www.asustor.com
    // Submitted by Vincent Tseng <vincenttseng@asustor.com>
    myasustor.com

    // Atlassian : https://atlassian.com
    // Submitted by Sam Smyth <devloop@atlassian.com>
    cdn.prod.atlassian-dev.net

    // Authentick UG (haftungsbeschränkt) : https://authentick.net
    // Submitted by Lukas Reschke <lukas@authentick.net>
    translated.page

    // AVM : https://avm.de
    // Submitted by Andreas Weise <a.weise@avm.de>
    myfritz.net

    // AVStack Pte. Ltd. : https://avstack.io
    // Submitted by Jasper Hugo <jasper@avstack.io>
    onavstack.net

    // AW AdvisorWebsites.com Software Inc : https://advisorwebsites.com
    // Submitted by James Kennedy <domains@advisorwebsites.com>
    *.awdev.ca
    *.advisor.ws

    // AZ.pl sp. z.o.o: https://az.pl
    // Submitted by Krzysztof Wolski <krzysztof.wolski@home.eu>
    ecommerce-shop.pl

    // b-data GmbH : https://www.b-data.io
    // Submitted by Olivier Benz <olivier.benz@b-data.ch>
    b-data.io

    // backplane : https://www.backplane.io
    // Submitted by Anthony Voutas <anthony@backplane.io>
    backplaneapp.io

    // Balena : https://www.balena.io
    // Submitted by Petros Angelatos <petrosagg@balena.io>
    balena-devices.com

    // University of Banja Luka : https://unibl.org
    // Domains for Republic of Srpska administrative entity.
    // Submitted by Marko Ivanovic <kormang@hotmail.rs>
    rs.ba

    // Banzai Cloud
    // Submitted by Janos Matyas <info@banzaicloud.com>
    *.banzai.cloud
    app.banzaicloud.io
    *.backyards.banzaicloud.io

    // BASE, Inc. : https://binc.jp
    // Submitted by Yuya NAGASAWA <public-suffix-list@binc.jp>
    base.ec
    official.ec
    buyshop.jp
    fashionstore.jp
    handcrafted.jp
    kawaiishop.jp
    supersale.jp
    theshop.jp
    shopselect.net
    base.shop

    // BeagleBoard.org Foundation : https://beagleboard.org
    // Submitted by Jason Kridner <jkridner@beagleboard.org>
    beagleboard.io

    // Beget Ltd
    // Submitted by Lev Nekrasov <lnekrasov@beget.com>
    *.beget.app

    // BetaInABox
    // Submitted by Adrian <adrian@betainabox.com>
    betainabox.com

    // BinaryLane : http://www.binarylane.com
    // Submitted by Nathan O'Sullivan <nathan@mammoth.com.au>
    bnr.la

    // Bitbucket : http://bitbucket.org
    // Submitted by Andy Ortlieb <aortlieb@atlassian.com>
    bitbucket.io

    // Blackbaud, Inc. : https://www.blackbaud.com
    // Submitted by Paul Crowder <paul.crowder@blackbaud.com>
    blackbaudcdn.net

    // Blatech : http://www.blatech.net
    // Submitted by Luke Bratch <luke@bratch.co.uk>
    of.je

    // Blue Bite, LLC : https://bluebite.com
    // Submitted by Joshua Weiss <admin.engineering@bluebite.com>
    bluebite.io

    // Boomla : https://boomla.com
    // Submitted by Tibor Halter <thalter@boomla.com>
    boomla.net

    // Boutir : https://www.boutir.com
    // Submitted by Eric Ng Ka Ka <ngkaka@boutir.com>
    boutir.com

    // Boxfuse : https://boxfuse.com
    // Submitted by Axel Fontaine <axel@boxfuse.com>
    boxfuse.io

    // bplaced : https://www.bplaced.net/
    // Submitted by Miroslav Bozic <security@bplaced.net>
    square7.ch
    bplaced.com
    bplaced.de
    square7.de
    bplaced.net
    square7.net

    // Brendly : https://brendly.rs
    // Submitted by Dusan Radovanovic <dusan.radovanovic@brendly.rs>
    shop.brendly.rs

    // BrowserSafetyMark
    // Submitted by Dave Tharp <browsersafetymark.io@quicinc.com>
    browsersafetymark.io

    // Bytemark Hosting : https://www.bytemark.co.uk
    // Submitted by Paul Cammish <paul.cammish@bytemark.co.uk>
    uk0.bigv.io
    dh.bytemark.co.uk
    vm.bytemark.co.uk

    // Caf.js Labs LLC : https://www.cafjs.com
    // Submitted by Antonio Lain <antlai@cafjs.com>
    cafjs.com

    // callidomus : https://www.callidomus.com/
    // Submitted by Marcus Popp <admin@callidomus.com>
    mycd.eu

    // Carrd : https://carrd.co
    // Submitted by AJ <aj@carrd.co>
    drr.ac
    uwu.ai
    carrd.co
    crd.co
    ju.mp

    // CentralNic : http://www.centralnic.com/names/domains
    // Submitted by registry <gavin.brown@centralnic.com>
    ae.org
    br.com
    cn.com
    com.de
    com.se
    de.com
    eu.com
    gb.net
    hu.net
    jp.net
    jpn.com
    mex.com
    ru.com
    sa.com
    se.net
    uk.com
    uk.net
    us.com
    za.bz
    za.com

    // No longer operated by CentralNic, these entries should be adopted and/or removed by current operators
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    ar.com
    hu.com
    kr.com
    no.com
    qc.com
    uy.com

    // Africa.com Web Solutions Ltd : https://registry.africa.com
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    africa.com

    // iDOT Services Limited : http://www.domain.gr.com
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    gr.com

    // Radix FZC : http://domains.in.net
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    in.net
    web.in

    // US REGISTRY LLC : http://us.org
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    us.org

    // co.com Registry, LLC : https://registry.co.com
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    co.com

    // Roar Domains LLC : https://roar.basketball/
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    aus.basketball
    nz.basketball

    // BRS Media : https://brsmedia.com/
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    radio.am
    radio.fm

    // c.la : http://www.c.la/
    c.la

    // certmgr.org : https://certmgr.org
    // Submitted by B. Blechschmidt <hostmaster@certmgr.org>
    certmgr.org

    // Cityhost LLC  : https://cityhost.ua
    // Submitted by Maksym Rivtin <support@cityhost.net.ua>
    cx.ua

    // Civilized Discourse Construction Kit, Inc. : https://www.discourse.org/
    // Submitted by Rishabh Nambiar & Michael Brown <team@discourse.org>
    discourse.group
    discourse.team

    // Clever Cloud : https://www.clever-cloud.com/
    // Submitted by Quentin Adam <noc@clever-cloud.com>
    cleverapps.io

    // Clerk : https://www.clerk.dev
    // Submitted by Colin Sidoti <systems@clerk.dev>
    clerk.app
    clerkstage.app
    *.lcl.dev
    *.lclstage.dev
    *.stg.dev
    *.stgstage.dev

    // ClickRising : https://clickrising.com/
    // Submitted by Umut Gumeli <infrastructure-publicsuffixlist@clickrising.com>
    clickrising.net

    // Cloud66 : https://www.cloud66.com/
    // Submitted by Khash Sajadi <khash@cloud66.com>
    c66.me
    cloud66.ws
    cloud66.zone

    // CloudAccess.net : https://www.cloudaccess.net/
    // Submitted by Pawel Panek <noc@cloudaccess.net>
    jdevcloud.com
    wpdevcloud.com
    cloudaccess.host
    freesite.host
    cloudaccess.net

    // cloudControl : https://www.cloudcontrol.com/
    // Submitted by Tobias Wilken <tw@cloudcontrol.com>
    cloudcontrolled.com
    cloudcontrolapp.com

    // Cloudera, Inc. : https://www.cloudera.com/
    // Submitted by Kedarnath Waikar <security@cloudera.com>
    *.cloudera.site

    // Cloudflare, Inc. : https://www.cloudflare.com/
    // Submitted by Cloudflare Team <publicsuffixlist@cloudflare.com>
    cf-ipfs.com
    cloudflare-ipfs.com
    trycloudflare.com
    pages.dev
    r2.dev
    workers.dev

    // Clovyr : https://clovyr.io
    // Submitted by Patrick Nielsen <patrick@clovyr.io>
    wnext.app

    // co.ca : http://registry.co.ca/
    co.ca

    // Co & Co : https://co-co.nl/
    // Submitted by Govert Versluis <govert@co-co.nl>
    *.otap.co

    // i-registry s.r.o. : http://www.i-registry.cz/
    // Submitted by Martin Semrad <semrad@i-registry.cz>
    co.cz

    // CDN77.com : http://www.cdn77.com
    // Submitted by Jan Krpes <jan.krpes@cdn77.com>
    c.cdn77.org
    cdn77-ssl.net
    r.cdn77.net
    rsc.cdn77.org
    ssl.origin.cdn77-secure.org

    // Cloud DNS Ltd : http://www.cloudns.net
    // Submitted by Aleksander Hristov <noc@cloudns.net>
    cloudns.asia
    cloudns.biz
    cloudns.club
    cloudns.cc
    cloudns.eu
    cloudns.in
    cloudns.info
    cloudns.org
    cloudns.pro
    cloudns.pw
    cloudns.us

    // CNPY : https://cnpy.gdn
    // Submitted by Angelo Gladding <angelo@lahacker.net>
    cnpy.gdn

    // Codeberg e. V. : https://codeberg.org
    // Submitted by Moritz Marquardt <git@momar.de>
    codeberg.page

    // CoDNS B.V.
    co.nl
    co.no

    // Combell.com : https://www.combell.com
    // Submitted by Thomas Wouters <thomas.wouters@combellgroup.com>
    webhosting.be
    hosting-cluster.nl

    // Coordination Center for TLD RU and XN--P1AI : https://cctld.ru/en/domains/domens_ru/reserved/
    // Submitted by George Georgievsky <gug@cctld.ru>
    ac.ru
    edu.ru
    gov.ru
    int.ru
    mil.ru
    test.ru

    // COSIMO GmbH : http://www.cosimo.de
    // Submitted by Rene Marticke <rmarticke@cosimo.de>
    dyn.cosidns.de
    dynamisches-dns.de
    dnsupdater.de
    internet-dns.de
    l-o-g-i-n.de
    dynamic-dns.info
    feste-ip.net
    knx-server.net
    static-access.net

    // Craynic, s.r.o. : http://www.craynic.com/
    // Submitted by Ales Krajnik <ales.krajnik@craynic.com>
    realm.cz

    // Cryptonomic : https://cryptonomic.net/
    // Submitted by Andrew Cady <public-suffix-list@cryptonomic.net>
    *.cryptonomic.net

    // Cupcake : https://cupcake.io/
    // Submitted by Jonathan Rudenberg <jonathan@cupcake.io>
    cupcake.is

    // Curv UG : https://curv-labs.de/
    // Submitted by Marvin Wiesner <Marvin@curv-labs.de>
    curv.dev

    // Customer OCI - Oracle Dyn https://cloud.oracle.com/home https://dyn.com/dns/
    // Submitted by Gregory Drake <support@dyn.com>
    // Note: This is intended to also include customer-oci.com due to wildcards implicitly including the current label
    *.customer-oci.com
    *.oci.customer-oci.com
    *.ocp.customer-oci.com
    *.ocs.customer-oci.com

    // cyon GmbH : https://www.cyon.ch/
    // Submitted by Dominic Luechinger <dol@cyon.ch>
    cyon.link
    cyon.site

    // Danger Science Group: https://dangerscience.com/
    // Submitted by Skylar MacDonald <skylar@dangerscience.com>
    fnwk.site
    folionetwork.site
    platform0.app

    // Daplie, Inc : https://daplie.com
    // Submitted by AJ ONeal <aj@daplie.com>
    daplie.me
    localhost.daplie.me

    // Datto, Inc. : https://www.datto.com/
    // Submitted by Philipp Heckel <ph@datto.com>
    dattolocal.com
    dattorelay.com
    dattoweb.com
    mydatto.com
    dattolocal.net
    mydatto.net

    // Dansk.net : http://www.dansk.net/
    // Submitted by Anani Voule <digital@digital.co.dk>
    biz.dk
    co.dk
    firm.dk
    reg.dk
    store.dk

    // dappnode.io : https://dappnode.io/
    // Submitted by Abel Boldu / DAppNode Team <community@dappnode.io>
    dyndns.dappnode.io

    // dapps.earth : https://dapps.earth/
    // Submitted by Daniil Burdakov <icqkill@gmail.com>
    *.dapps.earth
    *.bzz.dapps.earth

    // Dark, Inc. : https://darklang.com
    // Submitted by Paul Biggar <ops@darklang.com>
    builtwithdark.com

    // DataDetect, LLC. : https://datadetect.com
    // Submitted by Andrew Banchich <abanchich@sceven.com>
    demo.datadetect.com
    instance.datadetect.com

    // Datawire, Inc : https://www.datawire.io
    // Submitted by Richard Li <secalert@datawire.io>
    edgestack.me

    // DDNS5 : https://ddns5.com
    // Submitted by Cameron Elliott <cameron@cameronelliott.com>
    ddns5.com

    // Debian : https://www.debian.org/
    // Submitted by Peter Palfrader / Debian Sysadmin Team <dsa-publicsuffixlist@debian.org>
    debian.net

    // Deno Land Inc : https://deno.com/
    // Submitted by Luca Casonato <hostmaster@deno.com>
    deno.dev
    deno-staging.dev

    // deSEC : https://desec.io/
    // Submitted by Peter Thomassen <peter@desec.io>
    dedyn.io

    // Deta: https://www.deta.sh/
    // Submitted by Aavash Shrestha <aavash@deta.sh>
    deta.app
    deta.dev

    // Diher Solutions : https://diher.solutions
    // Submitted by Didi Hermawan <mail@diher.solutions>
    *.rss.my.id
    *.diher.solutions

    // Discord Inc : https://discord.com
    // Submitted by Sahn Lam <slam@discordapp.com>
    discordsays.com
    discordsez.com

    // DNS Africa Ltd https://dns.business
    // Submitted by Calvin Browne <calvin@dns.business>
    jozi.biz

    // DNShome : https://www.dnshome.de/
    // Submitted by Norbert Auler <mail@dnshome.de>
    dnshome.de

    // DotArai : https://www.dotarai.com/
    // Submitted by Atsadawat Netcharadsang <atsadawat@dotarai.co.th>
    online.th
    shop.th

    // DrayTek Corp. : https://www.draytek.com/
    // Submitted by Paul Fang <mis@draytek.com>
    drayddns.com

    // DreamCommerce : https://shoper.pl/
    // Submitted by Konrad Kotarba <konrad.kotarba@dreamcommerce.com>
    shoparena.pl

    // DreamHost : http://www.dreamhost.com/
    // Submitted by Andrew Farmer <andrew.farmer@dreamhost.com>
    dreamhosters.com

    // Drobo : http://www.drobo.com/
    // Submitted by Ricardo Padilha <rpadilha@drobo.com>
    mydrobo.com

    // Drud Holdings, LLC. : https://www.drud.com/
    // Submitted by Kevin Bridges <kevin@drud.com>
    drud.io
    drud.us

    // DuckDNS : http://www.duckdns.org/
    // Submitted by Richard Harper <richard@duckdns.org>
    duckdns.org

    // Bip : https://bip.sh
    // Submitted by Joel Kennedy <joel@bip.sh>
    bip.sh

    // bitbridge.net : Submitted by Craig Welch, abeliidev@gmail.com
    bitbridge.net

    // dy.fi : http://dy.fi/
    // Submitted by Heikki Hannikainen <hessu@hes.iki.fi>
    dy.fi
    tunk.org

    // DynDNS.com : http://www.dyndns.com/services/dns/dyndns/
    dyndns-at-home.com
    dyndns-at-work.com
    dyndns-blog.com
    dyndns-free.com
    dyndns-home.com
    dyndns-ip.com
    dyndns-mail.com
    dyndns-office.com
    dyndns-pics.com
    dyndns-remote.com
    dyndns-server.com
    dyndns-web.com
    dyndns-wiki.com
    dyndns-work.com
    dyndns.biz
    dyndns.info
    dyndns.org
    dyndns.tv
    at-band-camp.net
    ath.cx
    barrel-of-knowledge.info
    barrell-of-knowledge.info
    better-than.tv
    blogdns.com
    blogdns.net
    blogdns.org
    blogsite.org
    boldlygoingnowhere.org
    broke-it.net
    buyshouses.net
    cechire.com
    dnsalias.com
    dnsalias.net
    dnsalias.org
    dnsdojo.com
    dnsdojo.net
    dnsdojo.org
    does-it.net
    doesntexist.com
    doesntexist.org
    dontexist.com
    dontexist.net
    dontexist.org
    doomdns.com
    doomdns.org
    dvrdns.org
    dyn-o-saur.com
    dynalias.com
    dynalias.net
    dynalias.org
    dynathome.net
    dyndns.ws
    endofinternet.net
    endofinternet.org
    endoftheinternet.org
    est-a-la-maison.com
    est-a-la-masion.com
    est-le-patron.com
    est-mon-blogueur.com
    for-better.biz
    for-more.biz
    for-our.info
    for-some.biz
    for-the.biz
    forgot.her.name
    forgot.his.name
    from-ak.com
    from-al.com
    from-ar.com
    from-az.net
    from-ca.com
    from-co.net
    from-ct.com
    from-dc.com
    from-de.com
    from-fl.com
    from-ga.com
    from-hi.com
    from-ia.com
    from-id.com
    from-il.com
    from-in.com
    from-ks.com
    from-ky.com
    from-la.net
    from-ma.com
    from-md.com
    from-me.org
    from-mi.com
    from-mn.com
    from-mo.com
    from-ms.com
    from-mt.com
    from-nc.com
    from-nd.com
    from-ne.com
    from-nh.com
    from-nj.com
    from-nm.com
    from-nv.com
    from-ny.net
    from-oh.com
    from-ok.com
    from-or.com
    from-pa.com
    from-pr.com
    from-ri.com
    from-sc.com
    from-sd.com
    from-tn.com
    from-tx.com
    from-ut.com
    from-va.com
    from-vt.com
    from-wa.com
    from-wi.com
    from-wv.com
    from-wy.com
    ftpaccess.cc
    fuettertdasnetz.de
    game-host.org
    game-server.cc
    getmyip.com
    gets-it.net
    go.dyndns.org
    gotdns.com
    gotdns.org
    groks-the.info
    groks-this.info
    ham-radio-op.net
    here-for-more.info
    hobby-site.com
    hobby-site.org
    home.dyndns.org
    homedns.org
    homeftp.net
    homeftp.org
    homeip.net
    homelinux.com
    homelinux.net
    homelinux.org
    homeunix.com
    homeunix.net
    homeunix.org
    iamallama.com
    in-the-band.net
    is-a-anarchist.com
    is-a-blogger.com
    is-a-bookkeeper.com
    is-a-bruinsfan.org
    is-a-bulls-fan.com
    is-a-candidate.org
    is-a-caterer.com
    is-a-celticsfan.org
    is-a-chef.com
    is-a-chef.net
    is-a-chef.org
    is-a-conservative.com
    is-a-cpa.com
    is-a-cubicle-slave.com
    is-a-democrat.com
    is-a-designer.com
    is-a-doctor.com
    is-a-financialadvisor.com
    is-a-geek.com
    is-a-geek.net
    is-a-geek.org
    is-a-green.com
    is-a-guru.com
    is-a-hard-worker.com
    is-a-hunter.com
    is-a-knight.org
    is-a-landscaper.com
    is-a-lawyer.com
    is-a-liberal.com
    is-a-libertarian.com
    is-a-linux-user.org
    is-a-llama.com
    is-a-musician.com
    is-a-nascarfan.com
    is-a-nurse.com
    is-a-painter.com
    is-a-patsfan.org
    is-a-personaltrainer.com
    is-a-photographer.com
    is-a-player.com
    is-a-republican.com
    is-a-rockstar.com
    is-a-socialist.com
    is-a-soxfan.org
    is-a-student.com
    is-a-teacher.com
    is-a-techie.com
    is-a-therapist.com
    is-an-accountant.com
    is-an-actor.com
    is-an-actress.com
    is-an-anarchist.com
    is-an-artist.com
    is-an-engineer.com
    is-an-entertainer.com
    is-by.us
    is-certified.com
    is-found.org
    is-gone.com
    is-into-anime.com
    is-into-cars.com
    is-into-cartoons.com
    is-into-games.com
    is-leet.com
    is-lost.org
    is-not-certified.com
    is-saved.org
    is-slick.com
    is-uberleet.com
    is-very-bad.org
    is-very-evil.org
    is-very-good.org
    is-very-nice.org
    is-very-sweet.org
    is-with-theband.com
    isa-geek.com
    isa-geek.net
    isa-geek.org
    isa-hockeynut.com
    issmarterthanyou.com
    isteingeek.de
    istmein.de
    kicks-ass.net
    kicks-ass.org
    knowsitall.info
    land-4-sale.us
    lebtimnetz.de
    leitungsen.de
    likes-pie.com
    likescandy.com
    merseine.nu
    mine.nu
    misconfused.org
    mypets.ws
    myphotos.cc
    neat-url.com
    office-on-the.net
    on-the-web.tv
    podzone.net
    podzone.org
    readmyblog.org
    saves-the-whales.com
    scrapper-site.net
    scrapping.cc
    selfip.biz
    selfip.com
    selfip.info
    selfip.net
    selfip.org
    sells-for-less.com
    sells-for-u.com
    sells-it.net
    sellsyourhome.org
    servebbs.com
    servebbs.net
    servebbs.org
    serveftp.net
    serveftp.org
    servegame.org
    shacknet.nu
    simple-url.com
    space-to-rent.com
    stuff-4-sale.org
    stuff-4-sale.us
    teaches-yoga.com
    thruhere.net
    traeumtgerade.de
    webhop.biz
    webhop.info
    webhop.net
    webhop.org
    worse-than.tv
    writesthisblog.com

    // ddnss.de : https://www.ddnss.de/
    // Submitted by Robert Niedziela <webmaster@ddnss.de>
    ddnss.de
    dyn.ddnss.de
    dyndns.ddnss.de
    dyndns1.de
    dyn-ip24.de
    home-webserver.de
    dyn.home-webserver.de
    myhome-server.de
    ddnss.org

    // Definima : http://www.definima.com/
    // Submitted by Maxence Bitterli <maxence@definima.com>
    definima.net
    definima.io

    // DigitalOcean App Platform : https://www.digitalocean.com/products/app-platform/
    // Submitted by Braxton Huggins <psl-maintainers@digitalocean.com>
    ondigitalocean.app

    // DigitalOcean Spaces : https://www.digitalocean.com/products/spaces/
    // Submitted by Robin H. Johnson <psl-maintainers@digitalocean.com>
    *.digitaloceanspaces.com

    // dnstrace.pro : https://dnstrace.pro/
    // Submitted by Chris Partridge <chris@partridge.tech>
    bci.dnstrace.pro

    // Dynu.com : https://www.dynu.com/
    // Submitted by Sue Ye <sue@dynu.com>
    ddnsfree.com
    ddnsgeek.com
    giize.com
    gleeze.com
    kozow.com
    loseyourip.com
    ooguy.com
    theworkpc.com
    casacam.net
    dynu.net
    accesscam.org
    camdvr.org
    freeddns.org
    mywire.org
    webredirect.org
    myddns.rocks
    blogsite.xyz

    // dynv6 : https://dynv6.com
    // Submitted by Dominik Menke <dom@digineo.de>
    dynv6.net

    // E4YOU spol. s.r.o. : https://e4you.cz/
    // Submitted by Vladimir Dudr <info@e4you.cz>
    e4.cz

    // Easypanel : https://easypanel.io
    // Submitted by Andrei Canta <andrei@easypanel.io>
    easypanel.app
    easypanel.host

    // Elementor : Elementor Ltd.
    // Submitted by Anton Barkan <antonb@elementor.com>
    elementor.cloud
    elementor.cool

    // En root‽ : https://en-root.org
    // Submitted by Emmanuel Raviart <emmanuel@raviart.com>
    en-root.fr

    // Enalean SAS: https://www.enalean.com
    // Submitted by Thomas Cottier <thomas.cottier@enalean.com>
    mytuleap.com
    tuleap-partners.com

    // Encoretivity AB: https://encore.dev
    // Submitted by André Eriksson <andre@encore.dev>
    encr.app
    encoreapi.com

    // ECG Robotics, Inc: https://ecgrobotics.org
    // Submitted by <frc1533@ecgrobotics.org>
    onred.one
    staging.onred.one

    // encoway GmbH : https://www.encoway.de
    // Submitted by Marcel Daus <cloudops@encoway.de>
    eu.encoway.cloud

    // EU.org https://eu.org/
    // Submitted by Pierre Beyssac <hostmaster@eu.org>
    eu.org
    al.eu.org
    asso.eu.org
    at.eu.org
    au.eu.org
    be.eu.org
    bg.eu.org
    ca.eu.org
    cd.eu.org
    ch.eu.org
    cn.eu.org
    cy.eu.org
    cz.eu.org
    de.eu.org
    dk.eu.org
    edu.eu.org
    ee.eu.org
    es.eu.org
    fi.eu.org
    fr.eu.org
    gr.eu.org
    hr.eu.org
    hu.eu.org
    ie.eu.org
    il.eu.org
    in.eu.org
    int.eu.org
    is.eu.org
    it.eu.org
    jp.eu.org
    kr.eu.org
    lt.eu.org
    lu.eu.org
    lv.eu.org
    mc.eu.org
    me.eu.org
    mk.eu.org
    mt.eu.org
    my.eu.org
    net.eu.org
    ng.eu.org
    nl.eu.org
    no.eu.org
    nz.eu.org
    paris.eu.org
    pl.eu.org
    pt.eu.org
    q-a.eu.org
    ro.eu.org
    ru.eu.org
    se.eu.org
    si.eu.org
    sk.eu.org
    tr.eu.org
    uk.eu.org
    us.eu.org

    // Eurobyte : https://eurobyte.ru
    // Submitted by Evgeniy Subbotin <e.subbotin@eurobyte.ru>
    eurodir.ru

    // Evennode : http://www.evennode.com/
    // Submitted by Michal Kralik <support@evennode.com>
    eu-1.evennode.com
    eu-2.evennode.com
    eu-3.evennode.com
    eu-4.evennode.com
    us-1.evennode.com
    us-2.evennode.com
    us-3.evennode.com
    us-4.evennode.com

    // eDirect Corp. : https://hosting.url.com.tw/
    // Submitted by C.S. chang <cschang@corp.url.com.tw>
    twmail.cc
    twmail.net
    twmail.org
    mymailer.com.tw
    url.tw

    // Fabrica Technologies, Inc. : https://www.fabrica.dev/
    // Submitted by Eric Jiang <eric@fabrica.dev>
    onfabrica.com

    // Facebook, Inc.
    // Submitted by Peter Ruibal <public-suffix@fb.com>
    apps.fbsbx.com

    // FAITID : https://faitid.org/
    // Submitted by Maxim Alzoba <tech.contact@faitid.org>
    // https://www.flexireg.net/stat_info
    ru.net
    adygeya.ru
    bashkiria.ru
    bir.ru
    cbg.ru
    com.ru
    dagestan.ru
    grozny.ru
    kalmykia.ru
    kustanai.ru
    marine.ru
    mordovia.ru
    msk.ru
    mytis.ru
    nalchik.ru
    nov.ru
    pyatigorsk.ru
    spb.ru
    vladikavkaz.ru
    vladimir.ru
    abkhazia.su
    adygeya.su
    aktyubinsk.su
    arkhangelsk.su
    armenia.su
    ashgabad.su
    azerbaijan.su
    balashov.su
    bashkiria.su
    bryansk.su
    bukhara.su
    chimkent.su
    dagestan.su
    east-kazakhstan.su
    exnet.su
    georgia.su
    grozny.su
    ivanovo.su
    jambyl.su
    kalmykia.su
    kaluga.su
    karacol.su
    karaganda.su
    karelia.su
    khakassia.su
    krasnodar.su
    kurgan.su
    kustanai.su
    lenug.su
    mangyshlak.su
    mordovia.su
    msk.su
    murmansk.su
    nalchik.su
    navoi.su
    north-kazakhstan.su
    nov.su
    obninsk.su
    penza.su
    pokrovsk.su
    sochi.su
    spb.su
    tashkent.su
    termez.su
    togliatti.su
    troitsk.su
    tselinograd.su
    tula.su
    tuva.su
    vladikavkaz.su
    vladimir.su
    vologda.su

    // Fancy Bits, LLC : http://getchannels.com
    // Submitted by Aman Gupta <aman@getchannels.com>
    channelsdvr.net
    u.channelsdvr.net

    // Fastly Inc. : http://www.fastly.com/
    // Submitted by Fastly Security <security@fastly.com>
    edgecompute.app
    fastly-terrarium.com
    fastlylb.net
    map.fastlylb.net
    freetls.fastly.net
    map.fastly.net
    a.prod.fastly.net
    global.prod.fastly.net
    a.ssl.fastly.net
    b.ssl.fastly.net
    global.ssl.fastly.net

    // Fastmail : https://www.fastmail.com/
    // Submitted by Marc Bradshaw <marc@fastmailteam.com>
    *.user.fm

    // FASTVPS EESTI OU : https://fastvps.ru/
    // Submitted by Likhachev Vasiliy <lihachev@fastvps.ru>
    fastvps-server.com
    fastvps.host
    myfast.host
    fastvps.site
    myfast.space

    // Fedora : https://fedoraproject.org/
    // submitted by Patrick Uiterwijk <puiterwijk@fedoraproject.org>
    fedorainfracloud.org
    fedorapeople.org
    cloud.fedoraproject.org
    app.os.fedoraproject.org
    app.os.stg.fedoraproject.org

    // FearWorks Media Ltd. : https://fearworksmedia.co.uk
    // submitted by Keith Fairley <domains@fearworksmedia.co.uk>
    conn.uk
    copro.uk
    hosp.uk

    // Fermax : https://fermax.com/
    // submitted by Koen Van Isterdael <k.vanisterdael@fermax.be>
    mydobiss.com

    // FH Muenster : https://www.fh-muenster.de
    // Submitted by Robin Naundorf <r.naundorf@fh-muenster.de>
    fh-muenster.io

    // Filegear Inc. : https://www.filegear.com
    // Submitted by Jason Zhu <jason@owtware.com>
    filegear.me
    filegear-au.me
    filegear-de.me
    filegear-gb.me
    filegear-ie.me
    filegear-jp.me
    filegear-sg.me

    // Firebase, Inc.
    // Submitted by Chris Raynor <chris@firebase.com>
    firebaseapp.com

    // Firewebkit : https://www.firewebkit.com
    // Submitted by Majid Qureshi <mqureshi@amrayn.com>
    fireweb.app

    // FLAP : https://www.flap.cloud
    // Submitted by Louis Chemineau <louis@chmn.me>
    flap.id

    // FlashDrive : https://flashdrive.io
    // Submitted by Eric Chan <support@flashdrive.io>
    onflashdrive.app
    fldrv.com

    // fly.io: https://fly.io
    // Submitted by Kurt Mackey <kurt@fly.io>
    fly.dev
    edgeapp.net
    shw.io

    // Flynn : https://flynn.io
    // Submitted by Jonathan Rudenberg <jonathan@flynn.io>
    flynnhosting.net

    // Forgerock : https://www.forgerock.com
    // Submitted by Roderick Parr <roderick.parr@forgerock.com>
    forgeblocks.com
    id.forgerock.io

    // Framer : https://www.framer.com
    // Submitted by Koen Rouwhorst <koenrh@framer.com>
    framer.app
    framercanvas.com
    framer.media
    framer.photos
    framer.website
    framer.wiki

    // Frusky MEDIA&PR : https://www.frusky.de
    // Submitted by Victor Pupynin <hallo@frusky.de>
    *.frusky.de

    // RavPage : https://www.ravpage.co.il
    // Submitted by Roni Horowitz <roni@responder.co.il>
    ravpage.co.il

    // Frederik Braun https://frederik-braun.com
    // Submitted by Frederik Braun <fb@frederik-braun.com>
    0e.vc

    // Freebox : http://www.freebox.fr
    // Submitted by Romain Fliedel <rfliedel@freebox.fr>
    freebox-os.com
    freeboxos.com
    fbx-os.fr
    fbxos.fr
    freebox-os.fr
    freeboxos.fr

    // freedesktop.org : https://www.freedesktop.org
    // Submitted by Daniel Stone <daniel@fooishbar.org>
    freedesktop.org

    // freemyip.com : https://freemyip.com
    // Submitted by Cadence <contact@freemyip.com>
    freemyip.com

    // FunkFeuer - Verein zur Förderung freier Netze : https://www.funkfeuer.at
    // Submitted by Daniel A. Maierhofer <vorstand@funkfeuer.at>
    wien.funkfeuer.at

    // Futureweb OG : http://www.futureweb.at
    // Submitted by Andreas Schnederle-Wagner <schnederle@futureweb.at>
    *.futurecms.at
    *.ex.futurecms.at
    *.in.futurecms.at
    futurehosting.at
    futuremailing.at
    *.ex.ortsinfo.at
    *.kunden.ortsinfo.at
    *.statics.cloud

    // GDS : https://www.gov.uk/service-manual/technology/managing-domain-names
    // Submitted by Stephen Ford <hostmaster@digital.cabinet-office.gov.uk>
    independent-commission.uk
    independent-inquest.uk
    independent-inquiry.uk
    independent-panel.uk
    independent-review.uk
    public-inquiry.uk
    royal-commission.uk
    campaign.gov.uk
    service.gov.uk

    // CDDO : https://www.gov.uk/guidance/get-an-api-domain-on-govuk
    // Submitted by Jamie Tanna <jamie.tanna@digital.cabinet-office.gov.uk>
    api.gov.uk

    // Gehirn Inc. : https://www.gehirn.co.jp/
    // Submitted by Kohei YOSHIDA <tech@gehirn.co.jp>
    gehirn.ne.jp
    usercontent.jp

    // Gentlent, Inc. : https://www.gentlent.com
    // Submitted by Tom Klein <tom@gentlent.com>
    gentapps.com
    gentlentapis.com
    lab.ms
    cdn-edges.net

    // Ghost Foundation : https://ghost.org
    // Submitted by Matt Hanley <security@ghost.org>
    ghost.io

    // GignoSystemJapan: http://gsj.bz
    // Submitted by GignoSystemJapan <kakutou-ec@gsj.bz>
    gsj.bz

    // GitHub, Inc.
    // Submitted by Patrick Toomey <security@github.com>
    githubusercontent.com
    githubpreview.dev
    github.io

    // GitLab, Inc.
    // Submitted by Alex Hanselka <alex@gitlab.com>
    gitlab.io

    // Gitplac.si - https://gitplac.si
    // Submitted by Aljaž Starc <me@aljaxus.eu>
    gitapp.si
    gitpage.si

    // Glitch, Inc : https://glitch.com
    // Submitted by Mads Hartmann <mads@glitch.com>
    glitch.me

    // Global NOG Alliance : https://nogalliance.org/
    // Submitted by Sander Steffann <sander@nogalliance.org>
    nog.community

    // Globe Hosting SRL : https://www.globehosting.com/
    // Submitted by Gavin Brown <gavin.brown@centralnic.com>
    co.ro
    shop.ro

    // GMO Pepabo, Inc. : https://pepabo.com/
    // Submitted by Hosting Div <admin@pepabo.com>
    lolipop.io
    angry.jp
    babyblue.jp
    babymilk.jp
    backdrop.jp
    bambina.jp
    bitter.jp
    blush.jp
    boo.jp
    boy.jp
    boyfriend.jp
    but.jp
    candypop.jp
    capoo.jp
    catfood.jp
    cheap.jp
    chicappa.jp
    chillout.jp
    chips.jp
    chowder.jp
    chu.jp
    ciao.jp
    cocotte.jp
    coolblog.jp
    cranky.jp
    cutegirl.jp
    daa.jp
    deca.jp
    deci.jp
    digick.jp
    egoism.jp
    fakefur.jp
    fem.jp
    flier.jp
    floppy.jp
    fool.jp
    frenchkiss.jp
    girlfriend.jp
    girly.jp
    gloomy.jp
    gonna.jp
    greater.jp
    hacca.jp
    heavy.jp
    her.jp
    hiho.jp
    hippy.jp
    holy.jp
    hungry.jp
    icurus.jp
    itigo.jp
    jellybean.jp
    kikirara.jp
    kill.jp
    kilo.jp
    kuron.jp
    littlestar.jp
    lolipopmc.jp
    lolitapunk.jp
    lomo.jp
    lovepop.jp
    lovesick.jp
    main.jp
    mods.jp
    mond.jp
    mongolian.jp
    moo.jp
    namaste.jp
    nikita.jp
    nobushi.jp
    noor.jp
    oops.jp
    parallel.jp
    parasite.jp
    pecori.jp
    peewee.jp
    penne.jp
    pepper.jp
    perma.jp
    pigboat.jp
    pinoko.jp
    punyu.jp
    pupu.jp
    pussycat.jp
    pya.jp
    raindrop.jp
    readymade.jp
    sadist.jp
    schoolbus.jp
    secret.jp
    staba.jp
    stripper.jp
    sub.jp
    sunnyday.jp
    thick.jp
    tonkotsu.jp
    under.jp
    upper.jp
    velvet.jp
    verse.jp
    versus.jp
    vivian.jp
    watson.jp
    weblike.jp
    whitesnow.jp
    zombie.jp
    heteml.net

    // GOV.UK Platform as a Service : https://www.cloud.service.gov.uk/
    // Submitted by Tom Whitwell <gov-uk-paas-support@digital.cabinet-office.gov.uk>
    cloudapps.digital
    london.cloudapps.digital

    // GOV.UK Pay : https://www.payments.service.gov.uk/
    // Submitted by Richard Baker <richard.baker@digital.cabinet-office.gov.uk>
    pymnt.uk

    // UKHomeOffice : https://www.gov.uk/government/organisations/home-office
    // Submitted by Jon Shanks <jon.shanks@digital.homeoffice.gov.uk>
    homeoffice.gov.uk

    // GlobeHosting, Inc.
    // Submitted by Zoltan Egresi <egresi@globehosting.com>
    ro.im

    // GoIP DNS Services : http://www.goip.de
    // Submitted by Christian Poulter <milchstrasse@goip.de>
    goip.de

    // Google, Inc.
    // Submitted by Eduardo Vela <evn@google.com>
    run.app
    a.run.app
    web.app
    *.0emm.com
    appspot.com
    *.r.appspot.com
    codespot.com
    googleapis.com
    googlecode.com
    pagespeedmobilizer.com
    publishproxy.com
    withgoogle.com
    withyoutube.com
    *.gateway.dev
    cloud.goog
    translate.goog
    *.usercontent.goog
    cloudfunctions.net
    blogspot.ae
    blogspot.al
    blogspot.am
    blogspot.ba
    blogspot.be
    blogspot.bg
    blogspot.bj
    blogspot.ca
    blogspot.cf
    blogspot.ch
    blogspot.cl
    blogspot.co.at
    blogspot.co.id
    blogspot.co.il
    blogspot.co.ke
    blogspot.co.nz
    blogspot.co.uk
    blogspot.co.za
    blogspot.com
    blogspot.com.ar
    blogspot.com.au
    blogspot.com.br
    blogspot.com.by
    blogspot.com.co
    blogspot.com.cy
    blogspot.com.ee
    blogspot.com.eg
    blogspot.com.es
    blogspot.com.mt
    blogspot.com.ng
    blogspot.com.tr
    blogspot.com.uy
    blogspot.cv
    blogspot.cz
    blogspot.de
    blogspot.dk
    blogspot.fi
    blogspot.fr
    blogspot.gr
    blogspot.hk
    blogspot.hr
    blogspot.hu
    blogspot.ie
    blogspot.in
    blogspot.is
    blogspot.it
    blogspot.jp
    blogspot.kr
    blogspot.li
    blogspot.lt
    blogspot.lu
    blogspot.md
    blogspot.mk
    blogspot.mr
    blogspot.mx
    blogspot.my
    blogspot.nl
    blogspot.no
    blogspot.pe
    blogspot.pt
    blogspot.qa
    blogspot.re
    blogspot.ro
    blogspot.rs
    blogspot.ru
    blogspot.se
    blogspot.sg
    blogspot.si
    blogspot.sk
    blogspot.sn
    blogspot.td
    blogspot.tw
    blogspot.ug
    blogspot.vn

    // Goupile : https://goupile.fr
    // Submitted by Niels Martignene <hello@goupile.fr>
    goupile.fr

    // Government of the Netherlands: https://www.government.nl
    // Submitted by <domeinnaam@minaz.nl>
    gov.nl

    // Group 53, LLC : https://www.group53.com
    // Submitted by Tyler Todd <noc@nova53.net>
    awsmppl.com

    // GünstigBestellen : https://günstigbestellen.de
    // Submitted by Furkan Akkoc <info@hendelzon.de>
    günstigbestellen.de
    günstigliefern.de

    // Hakaran group: http://hakaran.cz
    // Submitted by Arseniy Sokolov <security@hakaran.cz>
    fin.ci
    free.hr
    caa.li
    ua.rs
    conf.se

    // Handshake : https://handshake.org
    // Submitted by Mike Damm <md@md.vc>
    hs.zone
    hs.run

    // Hashbang : https://hashbang.sh
    hashbang.sh

    // Hasura : https://hasura.io
    // Submitted by Shahidh K Muhammed <shahidh@hasura.io>
    hasura.app
    hasura-app.io

    // Heilbronn University of Applied Sciences - Faculty Informatics (GitLab Pages): https://www.hs-heilbronn.de
    // Submitted by Richard Zowalla <mi-admin@hs-heilbronn.de>
    pages.it.hs-heilbronn.de

    // Hepforge : https://www.hepforge.org
    // Submitted by David Grellscheid <admin@hepforge.org>
    hepforge.org

    // Heroku : https://www.heroku.com/
    // Submitted by Tom Maher <tmaher@heroku.com>
    herokuapp.com
    herokussl.com

    // Hibernating Rhinos
    // Submitted by Oren Eini <oren@ravendb.net>
    ravendb.cloud
    ravendb.community
    ravendb.me
    development.run
    ravendb.run

    // home.pl S.A.: https://home.pl
    // Submitted by Krzysztof Wolski <krzysztof.wolski@home.eu>
    homesklep.pl

    // Hong Kong Productivity Council: https://www.hkpc.org/
    // Submitted by SECaaS Team <summchan@hkpc.org>
    secaas.hk

    // Hoplix : https://www.hoplix.com
    // Submitted by Danilo De Franco<info@hoplix.shop>
    hoplix.shop


    // HOSTBIP REGISTRY : https://www.hostbip.com/
    // Submitted by Atanunu Igbunuroghene <publicsuffixlist@hostbip.com>
    orx.biz
    biz.gl
    col.ng
    firm.ng
    gen.ng
    ltd.ng
    ngo.ng
    edu.scot
    sch.so

    // HostyHosting (hostyhosting.com)
    hostyhosting.io

    // Häkkinen.fi
    // Submitted by Eero Häkkinen <Eero+psl@Häkkinen.fi>
    häkkinen.fi

    // Ici la Lune : http://www.icilalune.com/
    // Submitted by Simon Morvan <simon@icilalune.com>
    *.moonscale.io
    moonscale.net

    // iki.fi
    // Submitted by Hannu Aronsson <haa@iki.fi>
    iki.fi

    // iliad italia: https://www.iliad.it
    // Submitted by Marios Makassikis <mmakassikis@freebox.fr>
    ibxos.it
    iliadboxos.it

    // Impertrix Solutions : <https://impertrixcdn.com>
    // Submitted by Zhixiang Zhao <csuite@impertrix.com>
    impertrixcdn.com
    impertrix.com

    // Incsub, LLC: https://incsub.com/
    // Submitted by Aaron Edwards <sysadmins@incsub.com>
    smushcdn.com
    wphostedmail.com
    wpmucdn.com
    tempurl.host
    wpmudev.host

    // Individual Network Berlin e.V. : https://www.in-berlin.de/
    // Submitted by Christian Seitz <chris@in-berlin.de>
    dyn-berlin.de
    in-berlin.de
    in-brb.de
    in-butter.de
    in-dsl.de
    in-dsl.net
    in-dsl.org
    in-vpn.de
    in-vpn.net
    in-vpn.org

    // info.at : http://www.info.at/
    biz.at
    info.at

    // info.cx : http://info.cx
    // Submitted by Jacob Slater <whois@igloo.to>
    info.cx

    // Interlegis : http://www.interlegis.leg.br
    // Submitted by Gabriel Ferreira <registrobr@interlegis.leg.br>
    ac.leg.br
    al.leg.br
    am.leg.br
    ap.leg.br
    ba.leg.br
    ce.leg.br
    df.leg.br
    es.leg.br
    go.leg.br
    ma.leg.br
    mg.leg.br
    ms.leg.br
    mt.leg.br
    pa.leg.br
    pb.leg.br
    pe.leg.br
    pi.leg.br
    pr.leg.br
    rj.leg.br
    rn.leg.br
    ro.leg.br
    rr.leg.br
    rs.leg.br
    sc.leg.br
    se.leg.br
    sp.leg.br
    to.leg.br

    // intermetrics GmbH : https://pixolino.com/
    // Submitted by Wolfgang Schwarz <admin@intermetrics.de>
    pixolino.com

    // Internet-Pro, LLP: https://netangels.ru/
    // Submitted by Vasiliy Sheredeko <piphon@gmail.com>
    na4u.ru

    // iopsys software solutions AB : https://iopsys.eu/
    // Submitted by Roman Azarenko <roman.azarenko@iopsys.eu>
    iopsys.se

    // IPiFony Systems, Inc. : https://www.ipifony.com/
    // Submitted by Matthew Hardeman <mhardeman@ipifony.com>
    ipifony.net

    // IServ GmbH : https://iserv.de
    // Submitted by Mario Hoberg <info@iserv.de>
    iservschule.de
    mein-iserv.de
    schulplattform.de
    schulserver.de
    test-iserv.de
    iserv.dev

    // I-O DATA DEVICE, INC. : http://www.iodata.com/
    // Submitted by Yuji Minagawa <domains-admin@iodata.jp>
    iobb.net

    // Jelastic, Inc. : https://jelastic.com/
    // Submitted by Ihor Kolodyuk <ik@jelastic.com>
    mel.cloudlets.com.au
    cloud.interhostsolutions.be
    users.scale.virtualcloud.com.br
    mycloud.by
    alp1.ae.flow.ch
    appengine.flow.ch
    es-1.axarnet.cloud
    diadem.cloud
    vip.jelastic.cloud
    jele.cloud
    it1.eur.aruba.jenv-aruba.cloud
    it1.jenv-aruba.cloud
    keliweb.cloud
    cs.keliweb.cloud
    oxa.cloud
    tn.oxa.cloud
    uk.oxa.cloud
    primetel.cloud
    uk.primetel.cloud
    ca.reclaim.cloud
    uk.reclaim.cloud
    us.reclaim.cloud
    ch.trendhosting.cloud
    de.trendhosting.cloud
    jele.club
    amscompute.com
    clicketcloud.com
    dopaas.com
    hidora.com
    paas.hosted-by-previder.com
    rag-cloud.hosteur.com
    rag-cloud-ch.hosteur.com
    jcloud.ik-server.com
    jcloud-ver-jpc.ik-server.com
    demo.jelastic.com
    kilatiron.com
    paas.massivegrid.com
    jed.wafaicloud.com
    lon.wafaicloud.com
    ryd.wafaicloud.com
    j.scaleforce.com.cy
    jelastic.dogado.eu
    fi.cloudplatform.fi
    demo.datacenter.fi
    paas.datacenter.fi
    jele.host
    mircloud.host
    paas.beebyte.io
    sekd1.beebyteapp.io
    jele.io
    cloud-fr1.unispace.io
    jc.neen.it
    cloud.jelastic.open.tim.it
    jcloud.kz
    upaas.kazteleport.kz
    cloudjiffy.net
    fra1-de.cloudjiffy.net
    west1-us.cloudjiffy.net
    jls-sto1.elastx.net
    jls-sto2.elastx.net
    jls-sto3.elastx.net
    faststacks.net
    fr-1.paas.massivegrid.net
    lon-1.paas.massivegrid.net
    lon-2.paas.massivegrid.net
    ny-1.paas.massivegrid.net
    ny-2.paas.massivegrid.net
    sg-1.paas.massivegrid.net
    jelastic.saveincloud.net
    nordeste-idc.saveincloud.net
    j.scaleforce.net
    jelastic.tsukaeru.net
    sdscloud.pl
    unicloud.pl
    mircloud.ru
    jelastic.regruhosting.ru
    enscaled.sg
    jele.site
    jelastic.team
    orangecloud.tn
    j.layershift.co.uk
    phx.enscaled.us
    mircloud.us

    // Jino : https://www.jino.ru
    // Submitted by Sergey Ulyashin <ulyashin@jino.ru>
    myjino.ru
    *.hosting.myjino.ru
    *.landing.myjino.ru
    *.spectrum.myjino.ru
    *.vps.myjino.ru

    // Jotelulu S.L. : https://jotelulu.com
    // Submitted by Daniel Fariña <ingenieria@jotelulu.com>
    jotelulu.cloud

    // Joyent : https://www.joyent.com/
    // Submitted by Brian Bennett <brian.bennett@joyent.com>
    *.triton.zone
    *.cns.joyent.com

    // JS.ORG : http://dns.js.org
    // Submitted by Stefan Keim <admin@js.org>
    js.org

    // KaasHosting : http://www.kaashosting.nl/
    // Submitted by Wouter Bakker <hostmaster@kaashosting.nl>
    kaas.gg
    khplay.nl

    // Kakao : https://www.kakaocorp.com/
    // Submitted by JaeYoong Lee <cec@kakaocorp.com>
    ktistory.com

    // Kapsi : https://kapsi.fi
    // Submitted by Tomi Juntunen <erani@kapsi.fi>
    kapsi.fi

    // Keyweb AG : https://www.keyweb.de
    // Submitted by Martin Dannehl <postmaster@keymachine.de>
    keymachine.de

    // KingHost : https://king.host
    // Submitted by Felipe Keller Braz <felipebraz@kinghost.com.br>
    kinghost.net
    uni5.net

    // KnightPoint Systems, LLC : http://www.knightpoint.com/
    // Submitted by Roy Keene <rkeene@knightpoint.com>
    knightpoint.systems

    // KoobinEvent, SL: https://www.koobin.com
    // Submitted by Iván Oliva <ivan.oliva@koobin.com>
    koobin.events

    // KUROKU LTD : https://kuroku.ltd/
    // Submitted by DisposaBoy <security@oya.to>
    oya.to

    // Katholieke Universiteit Leuven: https://www.kuleuven.be
    // Submitted by Abuse KU Leuven <abuse@kuleuven.be>
    kuleuven.cloud
    ezproxy.kuleuven.be

    // .KRD : http://nic.krd/data/krd/Registration%20Policy.pdf
    co.krd
    edu.krd

    // Krellian Ltd. : https://krellian.com
    // Submitted by Ben Francis <ben@krellian.com>
    krellian.net
    webthings.io

    // LCube - Professional hosting e.K. : https://www.lcube-webhosting.de
    // Submitted by Lars Laehn <info@lcube.de>
    git-repos.de
    lcube-server.de
    svn-repos.de

    // Leadpages : https://www.leadpages.net
    // Submitted by Greg Dallavalle <domains@leadpages.net>
    leadpages.co
    lpages.co
    lpusercontent.com

    // Lelux.fi : https://lelux.fi/
    // Submitted by Lelux Admin <publisuffix@lelux.site>
    lelux.site

    // Lifetime Hosting : https://Lifetime.Hosting/
    // Submitted by Mike Fillator <support@lifetime.hosting>
    co.business
    co.education
    co.events
    co.financial
    co.network
    co.place
    co.technology

    // Lightmaker Property Manager, Inc. : https://app.lmpm.com/
    // Submitted by Greg Holland <greg.holland@lmpm.com>
    app.lmpm.com

    // linkyard ldt: https://www.linkyard.ch/
    // Submitted by Mario Siegenthaler <mario.siegenthaler@linkyard.ch>
    linkyard.cloud
    linkyard-cloud.ch

    // Linode : https://linode.com
    // Submitted by <security@linode.com>
    members.linode.com
    *.nodebalancer.linode.com
    *.linodeobjects.com
    ip.linodeusercontent.com

    // LiquidNet Ltd : http://www.liquidnetlimited.com/
    // Submitted by Victor Velchev <admin@liquidnetlimited.com>
    we.bs

    // Localcert : https://localcert.dev
    // Submitted by Lann Martin <security@localcert.dev>
    *.user.localcert.dev

    // localzone.xyz
    // Submitted by Kenny Niehage <hello@yahe.sh>
    localzone.xyz

    // Log'in Line : https://www.loginline.com/
    // Submitted by Rémi Mach <remi.mach@loginline.com>
    loginline.app
    loginline.dev
    loginline.io
    loginline.services
    loginline.site

    // Lokalized : https://lokalized.nl
    // Submitted by Noah Taheij <noah@lokalized.nl>
    servers.run

    // Lõhmus Family, The
    // Submitted by Heiki Lõhmus <hostmaster at lohmus dot me>
    lohmus.me

    // LubMAN UMCS Sp. z o.o : https://lubman.pl/
    // Submitted by Ireneusz Maliszewski <ireneusz.maliszewski@lubman.pl>
    krasnik.pl
    leczna.pl
    lubartow.pl
    lublin.pl
    poniatowa.pl
    swidnik.pl

    // Lug.org.uk : https://lug.org.uk
    // Submitted by Jon Spriggs <admin@lug.org.uk>
    glug.org.uk
    lug.org.uk
    lugs.org.uk

    // Lukanet Ltd : https://lukanet.com
    // Submitted by Anton Avramov <register@lukanet.com>
    barsy.bg
    barsy.co.uk
    barsyonline.co.uk
    barsycenter.com
    barsyonline.com
    barsy.club
    barsy.de
    barsy.eu
    barsy.in
    barsy.info
    barsy.io
    barsy.me
    barsy.menu
    barsy.mobi
    barsy.net
    barsy.online
    barsy.org
    barsy.pro
    barsy.pub
    barsy.ro
    barsy.shop
    barsy.site
    barsy.support
    barsy.uk

    // Magento Commerce
    // Submitted by Damien Tournoud <dtournoud@magento.cloud>
    *.magentosite.cloud

    // May First - People Link : https://mayfirst.org/
    // Submitted by Jamie McClelland <info@mayfirst.org>
    mayfirst.info
    mayfirst.org

    // Mail.Ru Group : https://hb.cldmail.ru
    // Submitted by Ilya Zaretskiy <zaretskiy@corp.mail.ru>
    hb.cldmail.ru

    // Mail Transfer Platform : https://www.neupeer.com
    // Submitted by Li Hui <lihui@neupeer.com>
    cn.vu

    // Maze Play: https://www.mazeplay.com
    // Submitted by Adam Humpherys <adam@mws.dev>
    mazeplay.com

    // mcpe.me : https://mcpe.me
    // Submitted by Noa Heyl <hi@noa.dev>
    mcpe.me

    // McHost : https://mchost.ru
    // Submitted by Evgeniy Subbotin <e.subbotin@mchost.ru>
    mcdir.me
    mcdir.ru
    mcpre.ru
    vps.mcdir.ru

    // Mediatech : https://mediatech.by
    // Submitted by Evgeniy Kozhuhovskiy <ugenk@mediatech.by>
    mediatech.by
    mediatech.dev

    // Medicom Health : https://medicomhealth.com
    // Submitted by Michael Olson <molson@medicomhealth.com>
    hra.health

    // Memset hosting : https://www.memset.com
    // Submitted by Tom Whitwell <domains@memset.com>
    miniserver.com
    memset.net

    // Messerli Informatik AG : https://www.messerli.ch/
    // Submitted by Ruben Schmidmeister <psl-maintainers@messerli.ch>
    messerli.app

    // MetaCentrum, CESNET z.s.p.o. : https://www.metacentrum.cz/en/
    // Submitted by Zdeněk Šustr <zdenek.sustr@cesnet.cz>
    *.cloud.metacentrum.cz
    custom.metacentrum.cz

    // MetaCentrum, CESNET z.s.p.o. : https://www.metacentrum.cz/en/
    // Submitted by Radim Janča <janca@cesnet.cz>
    flt.cloud.muni.cz
    usr.cloud.muni.cz

    // Meteor Development Group : https://www.meteor.com/hosting
    // Submitted by Pierre Carrier <pierre@meteor.com>
    meteorapp.com
    eu.meteorapp.com

    // Michau Enterprises Limited : http://www.co.pl/
    co.pl

    // Microsoft Corporation : http://microsoft.com
    // Submitted by Public Suffix List Admin <msftpsladmin@microsoft.com>
    *.azurecontainer.io
    azurewebsites.net
    azure-mobile.net
    cloudapp.net
    azurestaticapps.net
    1.azurestaticapps.net
    2.azurestaticapps.net
    centralus.azurestaticapps.net
    eastasia.azurestaticapps.net
    eastus2.azurestaticapps.net
    westeurope.azurestaticapps.net
    westus2.azurestaticapps.net

    // minion.systems : http://minion.systems
    // Submitted by Robert Böttinger <r@minion.systems>
    csx.cc

    // Mintere : https://mintere.com/
    // Submitted by Ben Aubin <security@mintere.com>
    mintere.site

    // MobileEducation, LLC : https://joinforte.com
    // Submitted by Grayson Martin <grayson.martin@mobileeducation.us>
    forte.id

    // Mozilla Corporation : https://mozilla.com
    // Submitted by Ben Francis <bfrancis@mozilla.com>
    mozilla-iot.org

    // Mozilla Foundation : https://mozilla.org/
    // Submitted by glob <glob@mozilla.com>
    bmoattachments.org

    // MSK-IX : https://www.msk-ix.ru/
    // Submitted by Khannanov Roman <r.khannanov@msk-ix.ru>
    net.ru
    org.ru
    pp.ru

    // Mythic Beasts : https://www.mythic-beasts.com
    // Submitted by Paul Cammish <kelduum@mythic-beasts.com>
    hostedpi.com
    customer.mythic-beasts.com
    caracal.mythic-beasts.com
    fentiger.mythic-beasts.com
    lynx.mythic-beasts.com
    ocelot.mythic-beasts.com
    oncilla.mythic-beasts.com
    onza.mythic-beasts.com
    sphinx.mythic-beasts.com
    vs.mythic-beasts.com
    x.mythic-beasts.com
    yali.mythic-beasts.com
    cust.retrosnub.co.uk

    // Nabu Casa : https://www.nabucasa.com
    // Submitted by Paulus Schoutsen <infra@nabucasa.com>
    ui.nabu.casa

    // Net at Work Gmbh : https://www.netatwork.de
    // Submitted by Jan Jaeschke <jan.jaeschke@netatwork.de>
    cloud.nospamproxy.com

    // Netlify : https://www.netlify.com
    // Submitted by Jessica Parsons <jessica@netlify.com>
    netlify.app

    // Neustar Inc.
    // Submitted by Trung Tran <Trung.Tran@neustar.biz>
    4u.com

    // ngrok : https://ngrok.com/
    // Submitted by Alan Shreve <alan@ngrok.com>
    ngrok.io

    // Nimbus Hosting Ltd. : https://www.nimbushosting.co.uk/
    // Submitted by Nicholas Ford <nick@nimbushosting.co.uk>
    nh-serv.co.uk

    // NFSN, Inc. : https://www.NearlyFreeSpeech.NET/
    // Submitted by Jeff Wheelhouse <support@nearlyfreespeech.net>
    nfshost.com

    // Noop : https://noop.app
    // Submitted by Nathaniel Schweinberg <noop@rearc.io>
    *.developer.app
    noop.app

    // Northflank Ltd. : https://northflank.com/
    // Submitted by Marco Suter <marco@northflank.com>
    *.northflank.app
    *.build.run
    *.code.run
    *.database.run
    *.migration.run

    // Noticeable : https://noticeable.io
    // Submitted by Laurent Pellegrino <security@noticeable.io>
    noticeable.news

    // Now-DNS : https://now-dns.com
    // Submitted by Steve Russell <steve@now-dns.com>
    dnsking.ch
    mypi.co
    n4t.co
    001www.com
    ddnslive.com
    myiphost.com
    forumz.info
    16-b.it
    32-b.it
    64-b.it
    soundcast.me
    tcp4.me
    dnsup.net
    hicam.net
    now-dns.net
    ownip.net
    vpndns.net
    dynserv.org
    now-dns.org
    x443.pw
    now-dns.top
    ntdll.top
    freeddns.us
    crafting.xyz
    zapto.xyz

    // nsupdate.info : https://www.nsupdate.info/
    // Submitted by Thomas Waldmann <info@nsupdate.info>
    nsupdate.info
    nerdpol.ovh

    // No-IP.com : https://noip.com/
    // Submitted by Deven Reza <publicsuffixlist@noip.com>
    blogsyte.com
    brasilia.me
    cable-modem.org
    ciscofreak.com
    collegefan.org
    couchpotatofries.org
    damnserver.com
    ddns.me
    ditchyourip.com
    dnsfor.me
    dnsiskinky.com
    dvrcam.info
    dynns.com
    eating-organic.net
    fantasyleague.cc
    geekgalaxy.com
    golffan.us
    health-carereform.com
    homesecuritymac.com
    homesecuritypc.com
    hopto.me
    ilovecollege.info
    loginto.me
    mlbfan.org
    mmafan.biz
    myactivedirectory.com
    mydissent.net
    myeffect.net
    mymediapc.net
    mypsx.net
    mysecuritycamera.com
    mysecuritycamera.net
    mysecuritycamera.org
    net-freaks.com
    nflfan.org
    nhlfan.net
    no-ip.ca
    no-ip.co.uk
    no-ip.net
    noip.us
    onthewifi.com
    pgafan.net
    point2this.com
    pointto.us
    privatizehealthinsurance.net
    quicksytes.com
    read-books.org
    securitytactics.com
    serveexchange.com
    servehumour.com
    servep2p.com
    servesarcasm.com
    stufftoread.com
    ufcfan.org
    unusualperson.com
    workisboring.com
    3utilities.com
    bounceme.net
    ddns.net
    ddnsking.com
    gotdns.ch
    hopto.org
    myftp.biz
    myftp.org
    myvnc.com
    no-ip.biz
    no-ip.info
    no-ip.org
    noip.me
    redirectme.net
    servebeer.com
    serveblog.net
    servecounterstrike.com
    serveftp.com
    servegame.com
    servehalflife.com
    servehttp.com
    serveirc.com
    serveminecraft.net
    servemp3.com
    servepics.com
    servequake.com
    sytes.net
    webhop.me
    zapto.org

    // NodeArt : https://nodeart.io
    // Submitted by Konstantin Nosov <Nosov@nodeart.io>
    stage.nodeart.io

    // Nucleos Inc. : https://nucleos.com
    // Submitted by Piotr Zduniak <piotr@nucleos.com>
    pcloud.host

    // NYC.mn : http://www.information.nyc.mn
    // Submitted by Matthew Brown <mattbrown@nyc.mn>
    nyc.mn

    // Observable, Inc. : https://observablehq.com
    // Submitted by Mike Bostock <dns@observablehq.com>
    static.observableusercontent.com

    // Octopodal Solutions, LLC. : https://ulterius.io/
    // Submitted by Andrew Sampson <andrew@ulterius.io>
    cya.gg

    // OMG.LOL : <https://omg.lol>
    // Submitted by Adam Newbold <adam@omg.lol>
    omg.lol

    // Omnibond Systems, LLC. : https://www.omnibond.com
    // Submitted by Cole Estep <cole@omnibond.com>
    cloudycluster.net

    // OmniWe Limited: https://omniwe.com
    // Submitted by Vicary Archangel <vicary@omniwe.com>
    omniwe.site

    // One.com: https://www.one.com/
    // Submitted by Jacob Bunk Nielsen <jbn@one.com>
    123hjemmeside.dk
    123hjemmeside.no
    123homepage.it
    123kotisivu.fi
    123minsida.se
    123miweb.es
    123paginaweb.pt
    123sait.ru
    123siteweb.fr
    123webseite.at
    123webseite.de
    123website.be
    123website.ch
    123website.lu
    123website.nl
    service.one
    simplesite.com
    simplesite.com.br
    simplesite.gr
    simplesite.pl

    // One Fold Media : http://www.onefoldmedia.com/
    // Submitted by Eddie Jones <eddie@onefoldmedia.com>
    nid.io

    // Open Social : https://www.getopensocial.com/
    // Submitted by Alexander Varwijk <security@getopensocial.com>
    opensocial.site

    // OpenCraft GmbH : http://opencraft.com/
    // Submitted by Sven Marnach <sven@opencraft.com>
    opencraft.hosting

    // OpenResearch GmbH: https://openresearch.com/
    // Submitted by Philipp Schmid <ops@openresearch.com>
    orsites.com

    // Opera Software, A.S.A.
    // Submitted by Yngve Pettersen <yngve@opera.com>
    operaunite.com

    // Orange : https://www.orange.com
    // Submitted by Alexandre Linte <alexandre.linte@orange.com>
    tech.orange

    // Oursky Limited : https://authgear.com/, https://skygear.io/
    // Submitted by Authgear Team <hello@authgear.com>, Skygear Developer <hello@skygear.io>
    authgear-staging.com
    authgearapps.com
    skygearapp.com

    // OutSystems
    // Submitted by Duarte Santos <domain-admin@outsystemscloud.com>
    outsystemscloud.com

    // OVHcloud: https://ovhcloud.com
    // Submitted by Vincent Cassé <vincent.casse@ovhcloud.com>
    *.webpaas.ovh.net
    *.hosting.ovh.net

    // OwnProvider GmbH: http://www.ownprovider.com
    // Submitted by Jan Moennich <jan.moennich@ownprovider.com>
    ownprovider.com
    own.pm

    // OwO : https://whats-th.is/
    // Submitted by Dean Sheather <dean@deansheather.com>
    *.owo.codes

    // OX : http://www.ox.rs
    // Submitted by Adam Grand <webmaster@mail.ox.rs>
    ox.rs

    // oy.lc
    // Submitted by Charly Coste <changaco@changaco.oy.lc>
    oy.lc

    // Pagefog : https://pagefog.com/
    // Submitted by Derek Myers <derek@pagefog.com>
    pgfog.com

    // Pagefront : https://www.pagefronthq.com/
    // Submitted by Jason Kriss <jason@pagefronthq.com>
    pagefrontapp.com

    // PageXL : https://pagexl.com
    // Submitted by Yann Guichard <yann@pagexl.com>
    pagexl.com

    // Paywhirl, Inc : https://paywhirl.com/
    // Submitted by Daniel Netzer <dan@paywhirl.com>
    *.paywhirl.com

    // pcarrier.ca Software Inc: https://pcarrier.ca/
    // Submitted by Pierre Carrier <pc@rrier.ca>
    bar0.net
    bar1.net
    bar2.net
    rdv.to

    // .pl domains (grandfathered)
    art.pl
    gliwice.pl
    krakow.pl
    poznan.pl
    wroc.pl
    zakopane.pl

    // Pantheon Systems, Inc. : https://pantheon.io/
    // Submitted by Gary Dylina <gary@pantheon.io>
    pantheonsite.io
    gotpantheon.com

    // Peplink | Pepwave : http://peplink.com/
    // Submitted by Steve Leung <steveleung@peplink.com>
    mypep.link

    // Perspecta : https://perspecta.com/
    // Submitted by Kenneth Van Alstyne <kvanalstyne@perspecta.com>
    perspecta.cloud

    // PE Ulyanov Kirill Sergeevich : https://airy.host
    // Submitted by Kirill Ulyanov <k.ulyanov@airy.host>
    lk3.ru

    // Planet-Work : https://www.planet-work.com/
    // Submitted by Frédéric VANNIÈRE <f.vanniere@planet-work.com>
    on-web.fr

    // Platform.sh : https://platform.sh
    // Submitted by Nikola Kotur <nikola@platform.sh>
    bc.platform.sh
    ent.platform.sh
    eu.platform.sh
    us.platform.sh
    *.platformsh.site
    *.tst.site

    // Platter: https://platter.dev
    // Submitted by Patrick Flor <patrick@platter.dev>
    platter-app.com
    platter-app.dev
    platterp.us

    // Plesk : https://www.plesk.com/
    // Submitted by Anton Akhtyamov <program-managers@plesk.com>
    pdns.page
    plesk.page
    pleskns.com

    // Port53 : https://port53.io/
    // Submitted by Maximilian Schieder <maxi@zeug.co>
    dyn53.io

    // Porter : https://porter.run/
    // Submitted by Rudraksh MK <rudi@porter.run>
    onporter.run

    // Positive Codes Technology Company : http://co.bn/faq.html
    // Submitted by Zulfais <pc@co.bn>
    co.bn

    // Postman, Inc : https://postman.com
    // Submitted by Rahul Dhawan <security@postman.com>
    postman-echo.com
    pstmn.io
    mock.pstmn.io
    httpbin.org

    //prequalifyme.today : https://prequalifyme.today
    //Submitted by DeepakTiwari deepak@ivylead.io
    prequalifyme.today

    // prgmr.com : https://prgmr.com/
    // Submitted by Sarah Newman <owner@prgmr.com>
    xen.prgmr.com

    // priv.at : http://www.nic.priv.at/
    // Submitted by registry <lendl@nic.at>
    priv.at

    // privacytools.io : https://www.privacytools.io/
    // Submitted by Jonah Aragon <jonah@privacytools.io>
    prvcy.page

    // Protocol Labs : https://protocol.ai/
    // Submitted by Michael Burns <noc@protocol.ai>
    *.dweb.link

    // Protonet GmbH : http://protonet.io
    // Submitted by Martin Meier <admin@protonet.io>
    protonet.io

    // Publication Presse Communication SARL : https://ppcom.fr
    // Submitted by Yaacov Akiba Slama <admin@chirurgiens-dentistes-en-france.fr>
    chirurgiens-dentistes-en-france.fr
    byen.site

    // pubtls.org: https://www.pubtls.org
    // Submitted by Kor Nielsen <kor@pubtls.org>
    pubtls.org

    // PythonAnywhere LLP: https://www.pythonanywhere.com
    // Submitted by Giles Thomas <giles@pythonanywhere.com>
    pythonanywhere.com
    eu.pythonanywhere.com

    // QOTO, Org.
    // Submitted by Jeffrey Phillips Freeman <jeffrey.freeman@qoto.org>
    qoto.io

    // Qualifio : https://qualifio.com/
    // Submitted by Xavier De Cock <xdecock@gmail.com>
    qualifioapp.com

    // QuickBackend: https://www.quickbackend.com
    // Submitted by Dani Biro <dani@pymet.com>
    qbuser.com

    // Rad Web Hosting: https://radwebhosting.com
    // Submitted by Scott Claeys <s.claeys@radwebhosting.com>
    cloudsite.builders

    // Redgate Software: https://red-gate.com
    // Submitted by Andrew Farries <andrew.farries@red-gate.com>
    instances.spawn.cc

    // Redstar Consultants : https://www.redstarconsultants.com/
    // Submitted by Jons Slemmer <jons@redstarconsultants.com>
    instantcloud.cn

    // Russian Academy of Sciences
    // Submitted by Tech Support <support@rasnet.ru>
    ras.ru

    // QA2
    // Submitted by Daniel Dent (https://www.danieldent.com/)
    qa2.com

    // QCX
    // Submitted by Cassandra Beelen <cassandra@beelen.one>
    qcx.io
    *.sys.qcx.io

    // QNAP System Inc : https://www.qnap.com
    // Submitted by Nick Chang <nickchang@qnap.com>
    dev-myqnapcloud.com
    alpha-myqnapcloud.com
    myqnapcloud.com

    // Quip : https://quip.com
    // Submitted by Patrick Linehan <plinehan@quip.com>
    *.quipelements.com

    // Qutheory LLC : http://qutheory.io
    // Submitted by Jonas Schwartz <jonas@qutheory.io>
    vapor.cloud
    vaporcloud.io

    // Rackmaze LLC : https://www.rackmaze.com
    // Submitted by Kirill Pertsev <kika@rackmaze.com>
    rackmaze.com
    rackmaze.net

    // Rakuten Games, Inc : https://dev.viberplay.io
    // Submitted by Joshua Zhang <public-suffix@rgames.jp>
    g.vbrplsbx.io

    // Rancher Labs, Inc : https://rancher.com
    // Submitted by Vincent Fiduccia <domains@rancher.com>
    *.on-k3s.io
    *.on-rancher.cloud
    *.on-rio.io

    // Read The Docs, Inc : https://www.readthedocs.org
    // Submitted by David Fischer <team@readthedocs.org>
    readthedocs.io

    // Red Hat, Inc. OpenShift : https://openshift.redhat.com/
    // Submitted by Tim Kramer <tkramer@rhcloud.com>
    rhcloud.com

    // Render : https://render.com
    // Submitted by Anurag Goel <dev@render.com>
    app.render.com
    onrender.com

    // Repl.it : https://repl.it
    // Submitted by Lincoln Bergeson <lincoln@replit.com>
    firewalledreplit.co
    id.firewalledreplit.co
    repl.co
    id.repl.co
    repl.run

    // Resin.io : https://resin.io
    // Submitted by Tim Perry <tim@resin.io>
    resindevice.io
    devices.resinstaging.io

    // RethinkDB : https://www.rethinkdb.com/
    // Submitted by Chris Kastorff <info@rethinkdb.com>
    hzc.io

    // Revitalised Limited : http://www.revitalised.co.uk
    // Submitted by Jack Price <jack@revitalised.co.uk>
    wellbeingzone.eu
    wellbeingzone.co.uk

    // Rico Developments Limited : https://adimo.co
    // Submitted by Colin Brown <hello@adimo.co>
    adimo.co.uk

    // Riseup Networks : https://riseup.net
    // Submitted by Micah Anderson <micah@riseup.net>
    itcouldbewor.se

    // Rochester Institute of Technology : http://www.rit.edu/
    // Submitted by Jennifer Herting <jchits@rit.edu>
    git-pages.rit.edu

    // Rocky Enterprise Software Foundation : https://resf.org
    // Submitted by Neil Hanlon <neil@resf.org>
    rocky.page

    // Rusnames Limited: http://rusnames.ru/
    // Submitted by Sergey Zotov <admin@rusnames.ru>
    биз.рус
    ком.рус
    крым.рус
    мир.рус
    мск.рус
    орг.рус
    самара.рус
    сочи.рус
    спб.рус
    я.рус

    // Salesforce.com, Inc. https://salesforce.com/
    // Submitted by Michael Biven <mbiven@salesforce.com>
    *.builder.code.com
    *.dev-builder.code.com
    *.stg-builder.code.com

    // Sandstorm Development Group, Inc. : https://sandcats.io/
    // Submitted by Asheesh Laroia <asheesh@sandstorm.io>
    sandcats.io

    // SBE network solutions GmbH : https://www.sbe.de/
    // Submitted by Norman Meilick <nm@sbe.de>
    logoip.de
    logoip.com

    // Scaleway : https://www.scaleway.com/
    // Submitted by Rémy Léone <rleone@scaleway.com>
    fr-par-1.baremetal.scw.cloud
    fr-par-2.baremetal.scw.cloud
    nl-ams-1.baremetal.scw.cloud
    fnc.fr-par.scw.cloud
    functions.fnc.fr-par.scw.cloud
    k8s.fr-par.scw.cloud
    nodes.k8s.fr-par.scw.cloud
    s3.fr-par.scw.cloud
    s3-website.fr-par.scw.cloud
    whm.fr-par.scw.cloud
    priv.instances.scw.cloud
    pub.instances.scw.cloud
    k8s.scw.cloud
    k8s.nl-ams.scw.cloud
    nodes.k8s.nl-ams.scw.cloud
    s3.nl-ams.scw.cloud
    s3-website.nl-ams.scw.cloud
    whm.nl-ams.scw.cloud
    k8s.pl-waw.scw.cloud
    nodes.k8s.pl-waw.scw.cloud
    s3.pl-waw.scw.cloud
    s3-website.pl-waw.scw.cloud
    scalebook.scw.cloud
    smartlabeling.scw.cloud
    dedibox.fr

    // schokokeks.org GbR : https://schokokeks.org/
    // Submitted by Hanno Böck <hanno@schokokeks.org>
    schokokeks.net

    // Scottish Government: https://www.gov.scot
    // Submitted by Martin Ellis <martin.ellis@gov.scot>
    gov.scot
    service.gov.scot

    // Scry Security : http://www.scrysec.com
    // Submitted by Shante Adam <shante@skyhat.io>
    scrysec.com

    // Securepoint GmbH : https://www.securepoint.de
    // Submitted by Erik Anders <erik.anders@securepoint.de>
    firewall-gateway.com
    firewall-gateway.de
    my-gateway.de
    my-router.de
    spdns.de
    spdns.eu
    firewall-gateway.net
    my-firewall.org
    myfirewall.org
    spdns.org

    // Seidat : https://www.seidat.com
    // Submitted by Artem Kondratev <accounts@seidat.com>
    seidat.net

    // Sellfy : https://sellfy.com
    // Submitted by Yuriy Romadin <contact@sellfy.com>
    sellfy.store

    // Senseering GmbH : https://www.senseering.de
    // Submitted by Felix Mönckemeyer <f.moenckemeyer@senseering.de>
    senseering.net

    // Sendmsg: https://www.sendmsg.co.il
    // Submitted by Assaf Stern <domains@comstar.co.il>
    minisite.ms

    // Service Magnet : https://myservicemagnet.com
    // Submitted by Dave Sanders <dave@myservicemagnet.com>
    magnet.page

    // Service Online LLC : http://drs.ua/
    // Submitted by Serhii Bulakh <support@drs.ua>
    biz.ua
    co.ua
    pp.ua

    // Shift Crypto AG : https://shiftcrypto.ch
    // Submitted by alex <alex@shiftcrypto.ch>
    shiftcrypto.dev
    shiftcrypto.io

    // ShiftEdit : https://shiftedit.net/
    // Submitted by Adam Jimenez <adam@shiftcreate.com>
    shiftedit.io

    // Shopblocks : http://www.shopblocks.com/
    // Submitted by Alex Bowers <alex@shopblocks.com>
    myshopblocks.com

    // Shopify : https://www.shopify.com
    // Submitted by Alex Richter <alex.richter@shopify.com>
    myshopify.com

    // Shopit : https://www.shopitcommerce.com/
    // Submitted by Craig McMahon <craig@shopitcommerce.com>
    shopitsite.com

    // shopware AG : https://shopware.com
    // Submitted by Jens Küper <cloud@shopware.com>
    shopware.store

    // Siemens Mobility GmbH
    // Submitted by Oliver Graebner <security@mo-siemens.io>
    mo-siemens.io

    // SinaAppEngine : http://sae.sina.com.cn/
    // Submitted by SinaAppEngine <saesupport@sinacloud.com>
    1kapp.com
    appchizi.com
    applinzi.com
    sinaapp.com
    vipsinaapp.com

    // Siteleaf : https://www.siteleaf.com/
    // Submitted by Skylar Challand <support@siteleaf.com>
    siteleaf.net

    // Skyhat : http://www.skyhat.io
    // Submitted by Shante Adam <shante@skyhat.io>
    bounty-full.com
    alpha.bounty-full.com
    beta.bounty-full.com

    // Small Technology Foundation : https://small-tech.org
    // Submitted by Aral Balkan <aral@small-tech.org>
    small-web.org

    // Smoove.io : https://www.smoove.io/
    // Submitted by Dan Kozak <dan@smoove.io>
    vp4.me

    // Snowflake Inc : https://www.snowflake.com/
    // Submitted by Faith Olapade <faith.olapade@snowflake.com>
    streamlitapp.com

    // Snowplow Analytics : https://snowplowanalytics.com/
    // Submitted by Ian Streeter <ian@snowplowanalytics.com>
    try-snowplow.com

    // SourceHut : https://sourcehut.org
    // Submitted by Drew DeVault <sir@cmpwn.com>
    srht.site

    // Stackhero : https://www.stackhero.io
    // Submitted by Adrien Gillon <adrien+public-suffix-list@stackhero.io>
    stackhero-network.com

    // Staclar : https://staclar.com
    // Submitted by Q Misell <q@staclar.com>
    musician.io
    // Submitted by Matthias Merkel <matthias.merkel@staclar.com>
    novecore.site

    // staticland : https://static.land
    // Submitted by Seth Vincent <sethvincent@gmail.com>
    static.land
    dev.static.land
    sites.static.land

    // Storebase : https://www.storebase.io
    // Submitted by Tony Schirmer <tony@storebase.io>
    storebase.store

    // Strategic System Consulting (eApps Hosting): https://www.eapps.com/
    // Submitted by Alex Oancea <aoancea@cloudscale365.com>
    vps-host.net
    atl.jelastic.vps-host.net
    njs.jelastic.vps-host.net
    ric.jelastic.vps-host.net

    // Sony Interactive Entertainment LLC : https://sie.com/
    // Submitted by David Coles <david.coles@sony.com>
    playstation-cloud.com

    // SourceLair PC : https://www.sourcelair.com
    // Submitted by Antonis Kalipetis <akalipetis@sourcelair.com>
    apps.lair.io
    *.stolos.io

    // SpaceKit : https://www.spacekit.io/
    // Submitted by Reza Akhavan <spacekit.io@gmail.com>
    spacekit.io

    // SpeedPartner GmbH: https://www.speedpartner.de/
    // Submitted by Stefan Neufeind <info@speedpartner.de>
    customer.speedpartner.de

    // Spreadshop (sprd.net AG) : https://www.spreadshop.com/
    // Submitted by Martin Breest <security@spreadshop.com>
    myspreadshop.at
    myspreadshop.com.au
    myspreadshop.be
    myspreadshop.ca
    myspreadshop.ch
    myspreadshop.com
    myspreadshop.de
    myspreadshop.dk
    myspreadshop.es
    myspreadshop.fi
    myspreadshop.fr
    myspreadshop.ie
    myspreadshop.it
    myspreadshop.net
    myspreadshop.nl
    myspreadshop.no
    myspreadshop.pl
    myspreadshop.se
    myspreadshop.co.uk

    // Standard Library : https://stdlib.com
    // Submitted by Jacob Lee <jacob@stdlib.com>
    api.stdlib.com

    // Storj Labs Inc. : https://storj.io/
    // Submitted by Philip Hutchins <hostmaster@storj.io>
    storj.farm

    // Studenten Net Twente : http://www.snt.utwente.nl/
    // Submitted by Silke Hofstra <syscom@snt.utwente.nl>
    utwente.io

    // Student-Run Computing Facility : https://www.srcf.net/
    // Submitted by Edwin Balani <sysadmins@srcf.net>
    soc.srcf.net
    user.srcf.net

    // Sub 6 Limited: http://www.sub6.com
    // Submitted by Dan Miller <dm@sub6.com>
    temp-dns.com

    // Supabase : https://supabase.io
    // Submitted by Inian Parameshwaran <security@supabase.io>
    supabase.co
    supabase.in
    supabase.net
    su.paba.se

    // Symfony, SAS : https://symfony.com/
    // Submitted by Fabien Potencier <fabien@symfony.com>
    *.s5y.io
    *.sensiosite.cloud

    // Syncloud : https://syncloud.org
    // Submitted by Boris Rybalkin <syncloud@syncloud.it>
    syncloud.it

    // Synology, Inc. : https://www.synology.com/
    // Submitted by Rony Weng <ronyweng@synology.com>
    dscloud.biz
    direct.quickconnect.cn
    dsmynas.com
    familyds.com
    diskstation.me
    dscloud.me
    i234.me
    myds.me
    synology.me
    dscloud.mobi
    dsmynas.net
    familyds.net
    dsmynas.org
    familyds.org
    vpnplus.to
    direct.quickconnect.to

    // Tabit Technologies Ltd. : https://tabit.cloud/
    // Submitted by Oren Agiv <oren@tabit.cloud>
    tabitorder.co.il
    mytabit.co.il
    mytabit.com

    // TAIFUN Software AG : http://taifun-software.de
    // Submitted by Bjoern Henke <dev-server@taifun-software.de>
    taifun-dns.de

    // Tailscale Inc. : https://www.tailscale.com
    // Submitted by David Anderson <danderson@tailscale.com>
    beta.tailscale.net
    ts.net

    // TASK geographical domains (www.task.gda.pl/uslugi/dns)
    gda.pl
    gdansk.pl
    gdynia.pl
    med.pl
    sopot.pl

    // team.blue https://team.blue
    // Submitted by Cedric Dubois <cedric.dubois@team.blue>
    site.tb-hosting.com

    // Teckids e.V. : https://www.teckids.org
    // Submitted by Dominik George <dominik.george@teckids.org>
    edugit.io
    s3.teckids.org

    // Telebit : https://telebit.cloud
    // Submitted by AJ ONeal <aj@telebit.cloud>
    telebit.app
    telebit.io
    *.telebit.xyz

    // Thingdust AG : https://thingdust.com/
    // Submitted by Adrian Imboden <adi@thingdust.com>
    *.firenet.ch
    *.svc.firenet.ch
    reservd.com
    thingdustdata.com
    cust.dev.thingdust.io
    cust.disrec.thingdust.io
    cust.prod.thingdust.io
    cust.testing.thingdust.io
    reservd.dev.thingdust.io
    reservd.disrec.thingdust.io
    reservd.testing.thingdust.io

    // ticket i/O GmbH : https://ticket.io
    // Submitted by Christian Franke <it@ticket.io>
    tickets.io

    // Tlon.io : https://tlon.io
    // Submitted by Mark Staarink <mark@tlon.io>
    arvo.network
    azimuth.network
    tlon.network

    // Tor Project, Inc. : https://torproject.org
    // Submitted by Antoine Beaupré <anarcat@torproject.org
    torproject.net
    pages.torproject.net

    // TownNews.com : http://www.townnews.com
    // Submitted by Dustin Ward <dward@townnews.com>
    bloxcms.com
    townnews-staging.com

    // TrafficPlex GmbH : https://www.trafficplex.de/
    // Submitted by Phillipp Röll <phillipp.roell@trafficplex.de>
    12hp.at
    2ix.at
    4lima.at
    lima-city.at
    12hp.ch
    2ix.ch
    4lima.ch
    lima-city.ch
    trafficplex.cloud
    de.cool
    12hp.de
    2ix.de
    4lima.de
    lima-city.de
    1337.pictures
    clan.rip
    lima-city.rocks
    webspace.rocks
    lima.zone

    // TransIP : https://www.transip.nl
    // Submitted by Rory Breuk <rbreuk@transip.nl>
    *.transurl.be
    *.transurl.eu
    *.transurl.nl

    // TransIP: https://www.transip.nl
    // Submitted by Cedric Dubois <cedric.dubois@team.blue>
    site.transip.me

    // TuxFamily : http://tuxfamily.org
    // Submitted by TuxFamily administrators <adm@staff.tuxfamily.org>
    tuxfamily.org

    // TwoDNS : https://www.twodns.de/
    // Submitted by TwoDNS-Support <support@two-dns.de>
    dd-dns.de
    diskstation.eu
    diskstation.org
    dray-dns.de
    draydns.de
    dyn-vpn.de
    dynvpn.de
    mein-vigor.de
    my-vigor.de
    my-wan.de
    syno-ds.de
    synology-diskstation.de
    synology-ds.de

    // Typedream : https://typedream.com
    // Submitted by Putri Karunia <putri@typedream.com>
    typedream.app

    // Typeform : https://www.typeform.com
    // Submitted by Sergi Ferriz <sergi.ferriz@typeform.com>
    pro.typeform.com

    // Uberspace : https://uberspace.de
    // Submitted by Moritz Werner <mwerner@jonaspasche.com>
    uber.space
    *.uberspace.de

    // UDR Limited : http://www.udr.hk.com
    // Submitted by registry <hostmaster@udr.hk.com>
    hk.com
    hk.org
    ltd.hk
    inc.hk

    // UNIVERSAL DOMAIN REGISTRY : https://www.udr.org.yt/
    // see also: whois -h whois.udr.org.yt help
    // Submitted by Atanunu Igbunuroghene <publicsuffixlist@udr.org.yt>
    name.pm
    sch.tf
    biz.wf
    sch.wf
    org.yt

    // United Gameserver GmbH : https://united-gameserver.de
    // Submitted by Stefan Schwarz <sysadm@united-gameserver.de>
    virtualuser.de
    virtual-user.de

    // Upli : https://upli.io
    // Submitted by Lenny Bakkalian <lenny.bakkalian@gmail.com>
    upli.io

    // urown.net : https://urown.net
    // Submitted by Hostmaster <hostmaster@urown.net>
    urown.cloud
    dnsupdate.info

    // .US
    // Submitted by Ed Moore <Ed.Moore@lib.de.us>
    lib.de.us

    // VeryPositive SIA : http://very.lv
    // Submitted by Danko Aleksejevs <danko@very.lv>
    2038.io

    // Vercel, Inc : https://vercel.com/
    // Submitted by Connor Davis <security@vercel.com>
    vercel.app
    vercel.dev
    now.sh

    // Viprinet Europe GmbH : http://www.viprinet.com
    // Submitted by Simon Kissel <hostmaster@viprinet.com>
    router.management

    // Virtual-Info : https://www.virtual-info.info/
    // Submitted by Adnan RIHAN <hostmaster@v-info.info>
    v-info.info

    // Voorloper.com: https://voorloper.com
    // Submitted by Nathan van Bakel <info@voorloper.com>
    voorloper.cloud

    // Voxel.sh DNS : https://voxel.sh/dns/
    // Submitted by Mia Rehlinger <dns@voxel.sh>
    neko.am
    nyaa.am
    be.ax
    cat.ax
    es.ax
    eu.ax
    gg.ax
    mc.ax
    us.ax
    xy.ax
    nl.ci
    xx.gl
    app.gp
    blog.gt
    de.gt
    to.gt
    be.gy
    cc.hn
    blog.kg
    io.kg
    jp.kg
    tv.kg
    uk.kg
    us.kg
    de.ls
    at.md
    de.md
    jp.md
    to.md
    indie.porn
    vxl.sh
    ch.tc
    me.tc
    we.tc
    nyan.to
    at.vg
    blog.vu
    dev.vu
    me.vu

    // V.UA Domain Administrator : https://domain.v.ua/
    // Submitted by Serhii Rostilo <sergey@rostilo.kiev.ua>
    v.ua

    // Vultr Objects : https://www.vultr.com/products/object-storage/
    // Submitted by Niels Maumenee <storage@vultr.com>
    *.vultrobjects.com

    // Waffle Computer Inc., Ltd. : https://docs.waffleinfo.com
    // Submitted by Masayuki Note <masa@blade.wafflecell.com>
    wafflecell.com

    // WebHare bv: https://www.webhare.com/
    // Submitted by Arnold Hendriks <info@webhare.com>
    *.webhare.dev

    // WebHotelier Technologies Ltd: https://www.webhotelier.net/
    // Submitted by Apostolos Tsakpinis <apostolos.tsakpinis@gmail.com>
    reserve-online.net
    reserve-online.com
    bookonline.app
    hotelwithflight.com

    // WeDeploy by Liferay, Inc. : https://www.wedeploy.com
    // Submitted by Henrique Vicente <security@wedeploy.com>
    wedeploy.io
    wedeploy.me
    wedeploy.sh

    // Western Digital Technologies, Inc : https://www.wdc.com
    // Submitted by Jung Jin <jungseok.jin@wdc.com>
    remotewd.com

    // WIARD Enterprises : https://wiardweb.com
    // Submitted by Kidd Hustle <kiddhustle@wiardweb.com>
    pages.wiardweb.com

    // Wikimedia Labs : https://wikitech.wikimedia.org
    // Submitted by Arturo Borrero Gonzalez <aborrero@wikimedia.org>
    wmflabs.org
    toolforge.org
    wmcloud.org

    // WISP : https://wisp.gg
    // Submitted by Stepan Fedotov <stepan@wisp.gg>
    panel.gg
    daemon.panel.gg

    // Wizard Zines : https://wizardzines.com
    // Submitted by Julia Evans <julia@wizardzines.com>
    messwithdns.com

    // WoltLab GmbH : https://www.woltlab.com
    // Submitted by Tim Düsterhus <security@woltlab.cloud>
    woltlab-demo.com
    myforum.community
    community-pro.de
    diskussionsbereich.de
    community-pro.net
    meinforum.net

    // Woods Valldata : https://www.woodsvalldata.co.uk/
    // Submitted by Chris Whittle <chris.whittle@woodsvalldata.co.uk>
    affinitylottery.org.uk
    raffleentry.org.uk
    weeklylottery.org.uk

    // WP Engine : https://wpengine.com/
    // Submitted by Michael Smith <michael.smith@wpengine.com>
    // Submitted by Brandon DuRette <brandon.durette@wpengine.com>
    wpenginepowered.com
    js.wpenginepowered.com

    // Wix.com, Inc. : https://www.wix.com
    // Submitted by Shahar Talmi <shahar@wix.com>
    wixsite.com
    editorx.io

    // XenonCloud GbR: https://xenoncloud.net
    // Submitted by Julian Uphoff <publicsuffixlist@xenoncloud.net>
    half.host

    // XnBay Technology : http://www.xnbay.com/
    // Submitted by XnBay Developer <developer.xncloud@gmail.com>
    xnbay.com
    u2.xnbay.com
    u2-local.xnbay.com

    // XS4ALL Internet bv : https://www.xs4all.nl/
    // Submitted by Daniel Mostertman <unixbeheer+publicsuffix@xs4all.net>
    cistron.nl
    demon.nl
    xs4all.space

    // Yandex.Cloud LLC: https://cloud.yandex.com
    // Submitted by Alexander Lodin <security+psl@yandex-team.ru>
    yandexcloud.net
    storage.yandexcloud.net
    website.yandexcloud.net

    // YesCourse Pty Ltd : https://yescourse.com
    // Submitted by Atul Bhouraskar <atul@yescourse.com>
    official.academy

    // Yola : https://www.yola.com/
    // Submitted by Stefano Rivera <stefano@yola.com>
    yolasite.com

    // Yombo : https://yombo.net
    // Submitted by Mitch Schwenk <mitch@yombo.net>
    ybo.faith
    yombo.me
    homelink.one
    ybo.party
    ybo.review
    ybo.science
    ybo.trade

    // Yunohost : https://yunohost.org
    // Submitted by Valentin Grimaud <security@yunohost.org>
    ynh.fr
    nohost.me
    noho.st

    // ZaNiC : http://www.za.net/
    // Submitted by registry <hostmaster@nic.za.net>
    za.net
    za.org

    // Zine EOOD : https://zine.bg/
    // Submitted by Martin Angelov <martin@zine.bg>
    bss.design

    // Zitcom A/S : https://www.zitcom.dk
    // Submitted by Emil Stahl <esp@zitcom.dk>
    basicserver.io
    virtualserver.io
    enterprisecloud.nu

    // ===END PRIVATE DOMAINS===

`;class Pr{constructor(){this.pslInitialised=!1}versionAsInt(e){let i=0;for(let o=0;o<e.length;o++)i=i*256+e[o];return i}versionAsArray(e){const i=[0,0,0];for(let o=i.length-1;o>=0;o--){const a=e&255;i[o]=a,e=(e-a)/256}return i}versionAsString(e){let i="";const o=this.versionAsArray(e);for(let a=0;a<o.length;a++)a>0&&(i+="."),i+=o[a].toString();return i}toHexString(e){return("0"+e.toString(16)).slice(-2)}BigIntFromRandom(e){const i=new Uint8Array(e);window.crypto.getRandomValues(i);const o=Array.from(i).map(this.toHexString).join("");return BigInteger.parse(o,16)}hash(e,i="hex",o="SHA-256"){let a;return typeof e=="string"?a=new TextEncoder().encode(e):a=e,crypto.subtle.digest({name:o},a).then(n=>i=="base64"?_e.byteArrayToBase64(n):Array.from(new Uint8Array(n)).map(this.toHexString).join(""))}intToByteArray(e){const i=[0,0,0,0];for(let o=i.length-1;o>=0;o--){const a=e&255;i[o]=a,e=(e-a)/256}return i}intArrayToByteArray(e){const i=new Array(e.length*4);for(let o=0;o<e.length;o++){let a=e[o];for(let n=3;n>=0;n--){const s=a&255;i[o*4+n]=s,a=(a-s)/256}}return i}stringToByteArray(e){return new TextEncoder().encode(e)}base64toByteArrayForHMAC(e,i,o=null){const a=atob(e),n=a.length;let s=0;if(!o){const r=new ArrayBuffer(n+i);o=new Uint8Array(r),s=20}for(let r=0;r<n;r++)o[r+s]=a.charCodeAt(r);return o}base64toByteArray(e){const i=atob(e),o=i.length,a=new ArrayBuffer(o),n=new Uint8Array(a);for(let s=0;s<o;s++)n[s]=i.charCodeAt(s);return n}byteArrayToBase64(e){let i="";const o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=new Uint8Array(e),n=a.byteLength,s=n%3,r=n-s;let c,l,d,u,p;for(let g=0;g<r;g=g+3)p=a[g]<<16|a[g+1]<<8|a[g+2],c=(p&16515072)>>18,l=(p&258048)>>12,d=(p&4032)>>6,u=p&63,i+=o[c]+o[l]+o[d]+o[u];return s==1?(p=a[r],c=(p&252)>>2,l=(p&3)<<4,i+=o[c]+o[l]+"=="):s==2&&(p=a[r]<<8|a[r+1],c=(p&64512)>>10,l=(p&1008)>>4,d=(p&15)<<2,i+=o[c]+o[l]+o[d]+"="),i}hexStringToByteArray(e,i=null){if(e.length%2!==0)throw Error("Must have an even number of hex digits to convert to bytes");const o=e.length/2;i||(i=new Uint8Array(o));for(let a=0;a<o;a++)i[a]=parseInt(e.substr(a*2,2),16);return i}newGUID(){const e=[];for(let r=0;r<256;r++)e[r]=(r<16?"0":"")+r.toString(16);const i=new Uint32Array(4);window.crypto.getRandomValues(i);const o=i[0],a=i[1],n=i[2],s=i[3];return e[o&255]+e[o>>8&255]+e[o>>16&255]+e[o>>24&255]+"-"+e[a&255]+e[a>>8&255]+"-"+e[a>>16&15|64]+e[a>>24&255]+"-"+e[n&63|128]+e[n>>8&255]+"-"+e[n>>16&255]+e[n>>24&255]+e[s&255]+e[s>>8&255]+e[s>>16&255]+e[s>>24&255]}base64urlDecode(e){return atob(e.replace(/-/g,"+").replace(/_/g,"/"))}binaryToByteArray(e){const i=e.length,o=new ArrayBuffer(i),a=new Uint8Array(o);for(let n=0;n<i;n++)a[n]=e.charCodeAt(n);return a}base64urltoByteArray(e){const i=this.base64urlDecode(e);return this.binaryToByteArray(i)}get psl(){if(!Ro)throw new Error("publicSuffixList library not present");return this.pslInitialised||(Ro.parse(zr,Ci.toASCII),this.pslInitialised=!0),Ro}}function zo(t,e){if(t===e)return!0;if(t&&e&&typeof t=="object"&&typeof e=="object"){if(t.constructor!==e.constructor)return!1;let i,o;if(Array.isArray(t)){if(i=t.length,i!==e.length)return!1;for(o=i;o--!==0;)if(!zo(t[o],e[o]))return!1;return!0}if(t.constructor===RegExp)return t.source===e.source&&t.flags===e.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();const a=Object.keys(t);if(i=a.length,i!==Object.keys(e).length)return!1;for(o=i;o--!==0;)if(!Object.prototype.hasOwnProperty.call(e,a[o]))return!1;for(o=i;o--!==0;){const n=a[o];if(!zo(t[n],e[n]))return!1}return!0}return t!==t&&e!==e}const _e=new Pr,Mr=[EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,globalThis.DOMException,globalThis.AssertionError,globalThis.SystemError].filter(Boolean).map(t=>[t.name,t]),Tr=new Map(Mr),_r=[{property:"name",enumerable:!1},{property:"message",enumerable:!1},{property:"stack",enumerable:!1},{property:"code",enumerable:!0},{property:"cause",enumerable:!1}],Po=Symbol(".toJSON was called"),Er=t=>{t[Po]=!0;const e=t.toJSON();return delete t[Po],e},Fr=t=>Tr.get(t)??Error,sn=({from:t,seen:e,to:i,forceEnumerable:o,maxDepth:a,depth:n,useToJSON:s,serialize:r})=>{if(!i)if(Array.isArray(t))i=[];else if(!r&&rn(t)){const l=Fr(t.name);i=new l}else i={};if(e.push(t),n>=a)return i;if(s&&typeof t.toJSON=="function"&&t[Po]!==!0)return Er(t);const c=l=>sn({from:l,seen:[...e],forceEnumerable:o,maxDepth:a,depth:n,useToJSON:s,serialize:r});for(const[l,d]of Object.entries(t)){if(typeof Buffer=="function"&&Buffer.isBuffer(d)){i[l]="[object Buffer]";continue}if(d!==null&&typeof d=="object"&&typeof d.pipe=="function"){i[l]="[object Stream]";continue}if(typeof d!="function"){if(!d||typeof d!="object"){i[l]=d;continue}if(!e.includes(t[l])){n++,i[l]=c(t[l]);continue}i[l]="[Circular]"}}for(const{property:l,enumerable:d}of _r)typeof t[l]<"u"&&t[l]!==null&&Object.defineProperty(i,l,{value:rn(t[l])?c(t[l]):t[l],enumerable:o?!0:d,configurable:!0,writable:!0});return i};function Br(t,e={}){const{maxDepth:i=Number.POSITIVE_INFINITY,useToJSON:o=!0}=e;return typeof t=="object"&&t!==null?sn({from:t,seen:[],forceEnumerable:!0,maxDepth:i,depth:0,useToJSON:o,serialize:!0}):typeof t=="function"?`[Function: ${t.name??"anonymous"}]`:t}function rn(t){return Boolean(t)&&typeof t=="object"&&"name"in t&&"message"in t&&"stack"in t}class Or{constructor(){this.defaultLevel=4,this.outputStarted=!1,this.config={logLevel:this.defaultLevel}}attachConfig(e){this.debug("Logging system config updated at "+Date()),this.config=e}formatMessage(e,i){return!e&&!i?"":(this.outputStarted||(e="* "+e,this.outputStarted=!0),i&&(e+=` Error: ${JSON.stringify(Br(i))}`),e)}debug(e){this.config.logLevel>=4&&(e=this.formatMessage(e),e.length>0&&(console.debug(e),this.config.logLevel>=4&&this.send(4,e)))}info(e){this.config.logLevel>=3&&(e=this.formatMessage(e),e.length>0&&(console.info(e),this.config.logLevel>=4&&this.send(3,e)))}warn(e){this.config.logLevel>=2&&(e=this.formatMessage(e),e.length>0&&(console.warn(e),this.config.logLevel>=4&&this.send(2,e)))}error(e,i){this.config.logLevel>=1&&(e=this.formatMessage(e,i),e.length>0&&(console.error(e),this.config.logLevel>=4&&this.send(1,e)))}send(e,i){}stackTrace(){console.groupCollapsed("%c Stack Trace","color:cream; font-style: normal;"),console.debug(new Error().stack),console.groupEnd()}}const ne=new Or,Mo=8,G=new yr;G.autoFillDialogs=!1,G.autoFillForms=!0,G.autoFillFormsWithMultipleMatches=!1,G.autoSubmitForms=!1,G.autoSubmitDialogs=!1,G.autoSubmitMatchedForms=!1,G.connSLClient=2,G.connSLServerMin=2,G.keePassDBToOpen="",G.keePassMRUDB="",G.KeePassRPCWebSocketPort=12546,G.KPRPCUsername="",G.KPRPCStoredKeys={},G.lastConnectedToKeePass="",G.listAllOpenDBs=!0,G.logLevel=ne.defaultLevel,G.logMethodConsole=!1,G.logMethodFile=!1,G.logSensitiveData=!1,G.metricsUsageDisabled=!1,G.metricsUserId="",G.notifyWhenEntryUpdated=!0,G.notifyWhenLateDiscovery=!1,G.notifyWhenLoggedOut=!1,G.overWriteFieldsAutomatically=!1,G.rememberMRUDB=!0,G.rememberMRUGroup=!0,G.saveFavicons=!0,G.searchAllOpenDBs=!0,G.config=null,G.siteConfig=Li,G.tutorialProgress="",G.version=Mo,G.triggerChangeInputEventAfterFill=!1,G.autoSubmitNetworkAuthWithSingleMatch=!1,G.searchNetworkAuth=!0,G.notificationCountGeneric=0,G.notificationCountSavePassword=0,G.currentSearchTermTimeout=30,G.notifyPasswordAvailableForPaste=!0,G.animateWhenOfferingSave=!0,G.keeVaultLaunchMessageDismissed=!1,G.keeVaultLaunchStart=864e13,G.keeVaultLaunchEnd=864e13,G.manualSubmitOverrideProhibited=!1,G.theme=null,G.hideConfirmationAfterSave=!1,G.mustShowReleaseNotesAtStartup=!1,G.autoFillFieldsWithExistingValue=!1;class Dr{constructor(){this.maxCharsPerPage=1e4,this._listeners=[],this.current=G,Me.storage.onChanged.addListener((e,i)=>this.reloadOnStorageChange(e,i))}addChangeListener(e){this._listeners.push(e)}reloadOnStorageChange(e,i){Pe.reload(()=>this._listeners.forEach(o=>o(e,i)))}async setASAP(e){Object.assign(this.current,e),await this.save()}splitStringToPages(e){const i=Math.ceil(e.length/this.maxCharsPerPage),o=new Array(i);for(let a=0,n=0;a<i;++a,n+=this.maxCharsPerPage)o[a]=e.substr(n,this.maxCharsPerPage);return o}async save(){const e=JSON.stringify(this.current),i=this.splitStringToPages(e),o={};o.keeConfigPageCount=i.length;for(let a=0;a<i.length;a++)o["keeConfigPage"+a]=i[a];await Me.storage.local.set(o)}load(e){Me.storage.local.get().then(i=>{const o=i.keeConfigPageCount;if(o){let a="";for(let n=0;n<o;n++){const s=i["keeConfigPage"+n];s&&(a+=s)}a&&(this.current=JSON.parse(a))}else{const a=i.keefoxConfigPageCount;if(a){let n="";for(let s=0;s<a;s++){const r=i["keefoxConfigPage"+s];r&&(n+=r)}n&&(this.current=JSON.parse(n))}}this.fixInvalidConfigData(),this.migrateToLatestVersion(),e()})}fixInvalidConfigData(){let e=!1;this.current.KPRPCStoredKeys==null&&(this.current.KPRPCStoredKeys={},e=!0),e&&this.save()}migrateToLatestVersion(){if(this.current.version>=Mo)return;const e=new Wa;switch(this.current.version){case 1:e.migrateToVersion2(this.current);case 2:e.migrateToVersion3(this.current);case 3:e.migrateToVersion4(this.current);case 4:e.migrateToVersion5(this.current);case 5:e.migrateToVersion6(this.current);case 6:e.migrateToVersion7(this.current);case 7:e.migrateToVersion8(this.current)}this.save()}migrateFromRemoteToLatestVersion(){if(this.current.version>=Mo)return;const e=new Wa;switch(this.current.version){case 5:e.migrateToVersion6(this.current);case 6:e.migrateToVersion7(this.current)}this.save()}reload(e){Me.storage.local.get().then(i=>{const o=i.keeConfigPageCount;if(o){let a="";for(let n=0;n<o;n++){const s=i["keeConfigPage"+n];s&&(a+=s)}a&&(this.current=Object.assign(this.current,JSON.parse(a)))}e&&e()})}siteConfigLookupFor(e,i){if(e=="Domain"){if(i=="Exact")return this.current.siteConfig.domainExact||(this.current.siteConfig.domainExact=new Ae),this.current.siteConfig.domainExact;if(i=="Prefix")return this.current.siteConfig.domainPrefix||(this.current.siteConfig.domainPrefix=new Ae),this.current.siteConfig.domainPrefix;if(i=="Regex")return this.current.siteConfig.domainRegex||(this.current.siteConfig.domainRegex=new Ae),this.current.siteConfig.domainRegex}else if(e=="Host"){if(i=="Exact")return this.current.siteConfig.hostExact||(this.current.siteConfig.hostExact=new Ae),this.current.siteConfig.hostExact;if(i=="Prefix")return this.current.siteConfig.hostPrefix||(this.current.siteConfig.hostPrefix=new Ae),this.current.siteConfig.hostPrefix;if(i=="Regex")return this.current.siteConfig.hostRegex||(this.current.siteConfig.hostRegex=new Ae),this.current.siteConfig.hostRegex}else if(e=="Page"){if(i=="Exact")return this.current.siteConfig.pageExact||(this.current.siteConfig.pageExact=new Ae),this.current.siteConfig.pageExact;if(i=="Prefix")return this.current.siteConfig.pagePrefix||(this.current.siteConfig.pagePrefix=new Ae),this.current.siteConfig.pagePrefix;if(i=="Regex")return this.current.siteConfig.pageRegex||(this.current.siteConfig.pageRegex=new Ae),this.current.siteConfig.pageRegex}return null}siteConfigFor(e){const i=this.findAllConfigsFor(e);return i.sort((o,a)=>a.matchWeight-o.matchWeight),this.deriveConfigFromMatches(i)}findAllConfigsFor(e){const i=[],o=new URL(e),a=o.host,n=a+o.pathname,s=_e.psl.getDomain(a);for(const r in this.current.siteConfig.domainExact)r===s&&i.push(this.current.siteConfig.domainExact[r]);for(const r in this.current.siteConfig.hostExact)r===a&&i.push(this.current.siteConfig.hostExact[r]);for(const r in this.current.siteConfig.pageExact)r===n&&i.push(this.current.siteConfig.pageExact[r]);for(const r in this.current.siteConfig.domainPrefix)s.startsWith(r)&&i.push(this.current.siteConfig.domainPrefix[r]);for(const r in this.current.siteConfig.hostPrefix)a.startsWith(r)&&i.push(this.current.siteConfig.hostPrefix[r]);for(const r in this.current.siteConfig.pagePrefix)n.startsWith(r)&&i.push(this.current.siteConfig.pagePrefix[r]);for(const r in this.current.siteConfig.domainRegex)new RegExp(r).test(s)&&i.push(this.current.siteConfig.domainRegex[r]);for(const r in this.current.siteConfig.hostRegex)new RegExp(r).test(a)&&i.push(this.current.siteConfig.hostRegex[r]);for(const r in this.current.siteConfig.pageRegex)new RegExp(r).test(n)&&i.push(this.current.siteConfig.pageRegex[r]);return i}findAllConfigsAndIndexFor(e){const i=[],o=new URL(e),a=o.host,n=a+o.pathname,s=_e.psl.getDomain(a);for(const r in this.current.siteConfig.domainExact)r===s&&i.push({node:this.current.siteConfig.domainExact[r],target:"Domain",method:"Exact",lookupValue:r});for(const r in this.current.siteConfig.hostExact)r===a&&i.push({node:this.current.siteConfig.hostExact[r],target:"Host",method:"Exact",lookupValue:r});for(const r in this.current.siteConfig.pageExact)r===n&&i.push({node:this.current.siteConfig.pageExact[r],target:"Page",method:"Exact",lookupValue:r});for(const r in this.current.siteConfig.domainPrefix)s.startsWith(r)&&i.push({node:this.current.siteConfig.domainPrefix[r],target:"Domain",method:"Prefix",lookupValue:r});for(const r in this.current.siteConfig.hostPrefix)a.startsWith(r)&&i.push({node:this.current.siteConfig.hostPrefix[r],target:"Host",method:"Prefix",lookupValue:r});for(const r in this.current.siteConfig.pagePrefix)n.startsWith(r)&&i.push({node:this.current.siteConfig.pagePrefix[r],target:"Page",method:"Prefix",lookupValue:r});for(const r in this.current.siteConfig.domainRegex)new RegExp(r).test(s)&&i.push({node:this.current.siteConfig.domainRegex[r],target:"Domain",method:"Regex",lookupValue:r});for(const r in this.current.siteConfig.hostRegex)new RegExp(r).test(a)&&i.push({node:this.current.siteConfig.hostRegex[r],target:"Host",method:"Regex",lookupValue:r});for(const r in this.current.siteConfig.pageRegex)new RegExp(r).test(n)&&i.push({node:this.current.siteConfig.pageRegex[r],target:"Page",method:"Regex",lookupValue:r});return i}deriveConfigFromMatches(e){const i={};return e.forEach(o=>{o.config.preventSaveNotification!==void 0&&i.preventSaveNotification==null&&(i.preventSaveNotification=o.config.preventSaveNotification),o.config.listMatchingCaseSensitive!==void 0&&i.listMatchingCaseSensitive==null&&(i.listMatchingCaseSensitive=o.config.listMatchingCaseSensitive),o.config.blackList!==void 0&&(i.blackList===void 0&&(i.blackList={}),o.config.blackList.form!==void 0&&(i.blackList.form===void 0&&(i.blackList.form={}),o.config.blackList.form.ids!==void 0&&i.blackList.form.ids===void 0&&(i.blackList.form.ids=o.config.blackList.form.ids),o.config.blackList.form.names!==void 0&&i.blackList.form.names===void 0&&(i.blackList.form.names=o.config.blackList.form.names)),o.config.blackList.fields!==void 0&&(i.blackList.fields===void 0&&(i.blackList.fields={}),o.config.blackList.fields.ids!==void 0&&i.blackList.fields.ids===void 0&&(i.blackList.fields.ids=o.config.blackList.fields.ids),o.config.blackList.fields.names!==void 0&&i.blackList.fields.names===void 0&&(i.blackList.fields.names=o.config.blackList.fields.names))),o.config.whiteList!==void 0&&(i.whiteList===void 0&&(i.whiteList={}),o.config.whiteList.form!==void 0&&(i.whiteList.form===void 0&&(i.whiteList.form={}),o.config.whiteList.form.ids!==void 0&&i.whiteList.form.ids===void 0&&(i.whiteList.form.ids=o.config.whiteList.form.ids),o.config.whiteList.form.names!==void 0&&i.whiteList.form.names===void 0&&(i.whiteList.form.names=o.config.whiteList.form.names)),o.config.whiteList.fields!==void 0&&(i.whiteList.fields===void 0&&(i.whiteList.fields={}),o.config.whiteList.fields.ids!==void 0&&i.whiteList.fields.ids===void 0&&(i.whiteList.fields.ids=o.config.whiteList.fields.ids),o.config.whiteList.fields.names!==void 0&&i.whiteList.fields.names===void 0&&(i.whiteList.fields.names=o.config.whiteList.fields.names))),o.config.preferredEntryUuid!==void 0&&i.preferredEntryUuid==null&&(i.preferredEntryUuid=o.config.preferredEntryUuid)}),i}normalizeFormProperty(e,i){return typeof e!="string"?null:i?e.toLowerCase():e}isFormInteresting(e,i,o){var H,F,X,se,D,M,f,w,b,z,V,le,U,Q,_,Y;const a=i.listMatchingCaseSensitive!==!0,n=o.map(K=>{var te,we;return a?(te=K.locators[0])==null?void 0:te.id.toLowerCase():(we=K.locators[0])==null?void 0:we.id}).filter(Boolean),s=o.map(K=>{var te,we;return a?(te=K.locators[0])==null?void 0:te.name.toLowerCase():(we=K.locators[0])==null?void 0:we.name}).filter(Boolean),r=this.normalizeFormProperty(e.id,a),c=this.normalizeFormProperty(e.name,a),l=(((F=(H=i==null?void 0:i.blackList)==null?void 0:H.form)==null?void 0:F.ids)||[]).map(K=>a?K==null?void 0:K.toLowerCase():K).filter(Boolean),d=(((se=(X=i==null?void 0:i.blackList)==null?void 0:X.form)==null?void 0:se.names)||[]).map(K=>a?K==null?void 0:K.toLowerCase():K).filter(Boolean),u=(((M=(D=i==null?void 0:i.blackList)==null?void 0:D.fields)==null?void 0:M.ids)||[]).map(K=>a?K==null?void 0:K.toLowerCase():K).filter(Boolean),p=(((w=(f=i==null?void 0:i.blackList)==null?void 0:f.fields)==null?void 0:w.names)||[]).map(K=>a?K==null?void 0:K.toLowerCase():K).filter(Boolean);if(l.indexOf(r)>=0||d.indexOf(c)>=0||u.some(K=>n.find(te=>K===te)!==void 0)||p.some(K=>s.find(te=>K===te)!==void 0))return!1;const v=((z=(b=i==null?void 0:i.whiteList)==null?void 0:b.form)==null?void 0:z.ids)||[],y=((le=(V=i==null?void 0:i.whiteList)==null?void 0:V.form)==null?void 0:le.names)||[],A=((Q=(U=i==null?void 0:i.whiteList)==null?void 0:U.fields)==null?void 0:Q.ids)||[],P=((Y=(_=i==null?void 0:i.whiteList)==null?void 0:_.fields)==null?void 0:Y.names)||[];return v.indexOf(r)>=0||y.indexOf(c)>=0||A.some(K=>n.find(te=>K===te)!==void 0)||P.some(K=>s.find(te=>K===te)!==void 0)?!0:null}get activeTheme(){return this.current.theme||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}togglePreferredEntryUuid(e,i){let o;try{o=new URL(i)}catch{ne.error("Invalid URL supplied to togglePreferredEntryUuid. Preferred entry will not be altered.");return}const a="Domain",n=this.findAllConfigsAndIndexFor(i),r=this.siteConfigFor(i).preferredEntryUuid;r===e?n.forEach(c=>{c.node.config.preferredEntryUuid===e&&this.removePreferredEntryUuid(c)}):(n.forEach(c=>{c.node.config.preferredEntryUuid===r&&this.leastSpecificTarget(a,c.target)===a&&this.removePreferredEntryUuid(c)}),this.addSiteConfigParameters({preferredEntryUuid:e},o,a,"Exact","Auto")),this.save()}removePreferredEntryUuid(e){if(e.node.config.preferredEntryUuid=null,e.node.source==="Auto"&&this.equalsDefaultSiteConfig(e.node.config)){const i=this.siteConfigLookupFor(e.target,e.method);delete i[e.lookupValue]}}equalsDefaultSiteConfig(e){return!(typeof e.preferredEntryUuid=="boolean"||typeof e.preventSaveNotification=="boolean"||typeof e.listMatchingCaseSensitive=="boolean"||e.whiteList||e.blackList)}leastSpecificTarget(e,i){return e==="Domain"||i==="Domain"?"Domain":e==="Host"||i==="Host"?"Host":"Page"}valueFromUrl(e,i){const o=e.host;if(i==="Host")return o;if(i==="Page")return o+e.pathname;if(i==="Domain")return _e.psl.getDomain(o)}addSiteConfigParameters(e,i,o,a,n){const s=this.valueFromUrl(i,o),r=Pe.siteConfigLookupFor(o,a);r[s]||(r[s]={config:new Va,source:n,matchWeight:100}),Object.assign(r[s].config,e)}}const Pe=new Dr;class jt{}jt.MatchedLogins={id:"KeeAddonPanelMatchedLogins",height:300,width:400,name:"matchedLoginsLegacy",autoCloseTime:0,legacy:!0},jt.GeneratePasswordLegacy={id:"KeeAddonPanelGeneratePassword",height:300,width:400,name:"generatePasswordLegacy",autoCloseTime:0,legacy:!0},jt.GeneratePassword={id:"KeeAddonPanelGeneratePassword",height:500,width:450,name:"generatePassword",autoCloseTime:0,legacy:!1};class ti{constructor(e,i,o){this.target=i,this.options=e,this.parentFrameId=o}createPanel(){this.options.name=="generatePassword"&&(this.elementToRefocus=document.activeElement),this.container=document.createElement("div");const e=this.container.attachShadow({mode:"closed"});this.container.id=this.options.id;const i=document.createElement("style");i.textContent=`:host(div) {
            display: block !important;
            position: absolute !important;
            z-index: 2147483647 !important;
        }`,e.appendChild(i),this.target?(this.targetRelativeRect=this.target.getBoundingClientRect(),this.positionPanel()):(this.container.style.setProperty("width",this.options.width+"px","important"),this.container.style.setProperty("height",this.options.height+"px","important"),this.container.style.setProperty("top",(window.innerHeight-this.options.height)/2+window.scrollY+"px","important"),this.container.style.setProperty("left",(window.innerWidth-this.options.width)/2+window.scrollX+"px","important"));const o=document.createElement("iframe");o.setAttribute("sandbox","allow-scripts allow-same-origin"),o.setAttribute("allow",""),o.style.setProperty("width","100%","important"),o.style.setProperty("height","100%","important"),o.style.setProperty("visibility","visible","important"),o.style.setProperty("display","block","important"),o.style.setProperty("position","relative","important"),o.style.setProperty("background-color",Pe.activeTheme==="dark"?"#1e1e1e":"#ffffff","important"),o.setAttribute("scrolling","no"),this.options.legacy?o.style.setProperty("border","none","important"):(o.style.setProperty("border","2px solid #1a466b","important"),o.style.setProperty("border-radius","8px","important")),e.appendChild(o);const a=Me.extension.getURL(`panels/panels${this.options.legacy?"Legacy":""}.html`);o.src=`${a}?parentFrameId=${this.parentFrameId}&autoCloseTime=${this.options.autoCloseTime}&panel=${this.options.name}&theme=${Pe.activeTheme}`;const n=document.getElementsByTagName("body");if(n&&n.length>0)n[0].appendChild(this.container);else{const s=document.getElementsByTagName("frameset");s&&s.length>0&&s[0].insertAdjacentElement("afterend",this.container)}}updateBoundingClientRect(){const e=this.targetRelativeRect;this.targetRelativeRect=this.target.getBoundingClientRect(),(e.top!=this.targetRelativeRect.top||e.bottom!=this.targetRelativeRect.bottom||e.left!=this.targetRelativeRect.left||e.right!=this.targetRelativeRect.right)&&this.positionPanel()}positionPanel(){const e=this.options.height;let i=e;const o=this.options.width;let a=!1;const n=this.targetRelativeRect.top+window.scrollY,s=this.targetRelativeRect.bottom+window.scrollY,r=this.targetRelativeRect.right-12,c=this.targetRelativeRect.bottom+e;if(c>window.innerHeight){const g=this.targetRelativeRect.top-e;if(g>=0)a=!0;else{const v=c-window.innerHeight,y=-g;v>y?(a=!0,i=e-y):i=e-v}}const l=r-this.targetRelativeRect.left;let d;l<o?d=Math.min(this.targetRelativeRect.left,window.innerWidth-o):d=r-o;const u=a?n-i:s,p=d+window.scrollX;this.container.style.setProperty("width",o+"px","important"),this.container.style.setProperty("height",i+"px","important"),this.container.style.setProperty("top",u+"px","important"),this.container.style.setProperty("left",p+"px","important")}closePanel(){const e=document.getElementById(this.options.id);if(e&&e.parentNode.removeChild(e),this.elementToRefocus)try{this.elementToRefocus.focus()}catch{}}}var Ve=(t=>(t.CloseAllPanels="closeAllPanels",t.DetectForms="detectForms",t.ResetForms="resetForms",t.GetPasswordProfiles="getPasswordProfiles",t.GeneratePassword="generatePassword",t.ManualFill="manualFill",t.Primary="primary",t.ShowMatchedLoginsPanel="showMatchedLoginsPanel",t.PageHide="pageHide",t.OpenKeePass="openkeepass",t.CreateEntry="createEntry",t.UpdateEntry="updateEntry",t))(Ve||{});class Nr{constructor(e,i,o,a){this.myPort=e,this.parentFrameId=i,this.formUtils=o,this.createMatchedLoginsPanelNearNode=a,this.fieldsWithIcons=[],this.KEEFOX_ICON_16="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAEtlZSBsb2dvN59B9AAAABB0RVh0QXV0aG9yAEtlZSBWYXVsdGXwy5UAAAH8SURBVDiNhZDfS1NhGMc/z3vOEHea0lgXrkisvArWTUSlF9XFIKj/waugtP+hey/M5vpFN0Eg4UVB0WARSglC0IX2AwwtzdywppYsz862875dzLmDbfTcvd/n8/0+X16JX74Sxgt9AHrYmYhVfTbZ88Z6/SeWVEC/szF1brGvVDT2JRqzVLLUCTl28Xrbtq8LwL76JtU1axLhLTm/2A/A1JFp5txOM5RPSCBgM2ypLrWQSXkID+tqd8jljLMpjvgMRFcY2P+NsPI57WxId8gN+HmwkEl5NoBUuWUsrgIqZnu7xLXol6CBmF1mudIOUDU2aQAFsPoq/RkjGYB5L4KnFXvH04p5zwHAwNP8i/TybgAAYkYBitpieL0XP2D2geH1XorarqG6xgIEP0XiycH3wHGAU+0b3D44h6sthvIJZt3OOvYulx07WTcFuxojjeSlSq3u13KYT6VIAwowewOwttoeIRSC2sx2lIqpY5KPdhx43DLg+8yIK3A/qJ111gmJrtmNvvNx4ka5ZQCA0pIGKho0QET5AAYoVUXf+4ffK6y8HMsBEyVtuQC/dQgfMRjG17J3f/w3AEArc7Oo7fD4r0OMFI6ijShRarQZK81EgHhycBro23lO5rLpC824pg0AxEjjotD0OoDdarFaiT053Lb2VhB/uePn81bcX+xXu7resl9RAAAAAElFTkSuQmCC"}removeKeeIconFromAllFields(){for(const e of this.fieldsWithIcons){const i=e.DOMelement;i&&(i.removeEventListener("click",this),i.removeEventListener("mousemove",this),i.style.setProperty("background-image",""),i.style.setProperty("background-repeat",""),i.style.setProperty("background-attachment",""),i.style.setProperty("background-size",""),i.style.setProperty("background-position",""))}this.fieldsWithIcons=[],this.passwordFields=null,this.otherFields=null}addKeeIconToFields(e,i,o){this.passwordFields=e,this.otherFields=i,o.length>1?this.getLabelledIcon(o.length.toString()):this.afterImageLoaded(this.KEEFOX_ICON_16)}skipField(e){return!this.formUtils.isATextFormFieldType(e.field.type)&&e.field.type!="password"||!e.DOMelement||e.DOMelement instanceof HTMLSelectElement||!e.DOMelement.isConnected||e.DOMelement.maxLength>0&&e.DOMelement.maxLength<=3||e.DOMelement.offsetWidth<50}addIcon(e,i){this.fieldsWithIcons.push(e);const o=e.DOMelement;o.addEventListener("click",this),o.addEventListener("mousemove",this),o.style.setProperty("background-image","url('"+i+"')","important"),o.style.setProperty("background-repeat","no-repeat","important"),o.style.setProperty("background-attachment","scroll","important"),o.style.setProperty("background-size","16px 16px","important"),o.style.setProperty("background-position","calc(100% - 4px) 50%","important"),o.style.setProperty("cursor","auto");const a=window.getComputedStyle(e.DOMelement).getPropertyValue("transition-property");["all","background"].some(n=>a.includes(n))&&e.DOMelement.style.setProperty("transition","none","important"),this.overrideBoxShadows(o)}handleEvent(e){e.type==="click"&&this.showMatchedLoginsPanel(e),e.type==="mousemove"&&this.hoverOverInput(e)}limitFields(e){return e.filter(o=>!this.skipField(o)).sort((o,a)=>o.highestScore===a.highestScore?0:o.highestScore<a.highestScore?1:-1).slice(0,2)}afterImageLoaded(e){const i=this.limitFields(this.passwordFields),o=this.limitFields(this.otherFields);for(const a of i.concat(o))this.addIcon(a,e)}overrideBoxShadows(e){const i=window.getComputedStyle(e);if(i){const o=[];o.push(i.getPropertyValue("box-shadow")),o.push(i.getPropertyValue("-webkit-box-shadow")),o.push(i.getPropertyValue("-moz-box-shadow")),o.some(a=>a.indexOf("inset"))&&(e.style.setProperty("box-shadow","initial","important"),e.style.setProperty("-webkit-box-shadow","initial","important"),e.style.setProperty("-moz-box-shadow","initial","important"))}}showMatchedLoginsPanel(e){const i=e.target.getBoundingClientRect(),o=i.left+i.width-22;e.clientX>o&&i.top<=e.clientY&&e.clientY<=i.bottom&&(this.parentFrameId!==0?this.myPort.postMessage({action:Ve.ShowMatchedLoginsPanel}):this.createMatchedLoginsPanelNearNode(e.target))}hoverOverInput(e){if(e.target.disabled)return;const i=e.target.getBoundingClientRect(),o=i.left+i.width-22;if(e.clientX>o){e.target.style.setProperty("cursor","pointer","important");return}e.target.style.setProperty("cursor","auto")}getLabelledIcon(e){const i=document.createElement("canvas");i.height=16,i.width=16;const o=document.createElement("img");o.addEventListener("load",()=>{const a=i.getContext("2d");a.drawImage(o,0,0),a.fillStyle="white",a.fillRect(6,8,10,8),a.fillStyle="red",a.font="8px Arial",a.fillText(e,7,15),this.afterImageLoaded(i.toDataURL())}),o.src=this.KEEFOX_ICON_16}}class Ur{}var cn=(t=>(t.Event="event",t.Websocket="websocket",t))(cn||{});class xi{constructor(e){this.icon=e.icon||{version:1,iconImageData:""},this.usernameValue=e.usernameValue||"<no username>",this.usernameName=e.usernameName||"<no username>",this.path=e.path||"UNKNOWN PATH",this.title=e.title||"",this.uRLs=e.uRLs||[],this.url=(e==null?void 0:e.url)||"",this.uuid=e.uuid||_e.newGUID(),this.dbFileName=e.dbFileName||"",this.relevanceScore=e.relevanceScore,this.fullDetails=e.fullDetails,this.isPreferredMatch=e.isPreferredMatch}static fromEntry(e){var i,o;return new xi({icon:e.icon,usernameValue:(i=et.getUsernameField(e))==null?void 0:i.value,usernameName:(o=et.getUsernameField(e))==null?void 0:o.name,title:e.title,uRLs:e.URLs,url:e==null?void 0:e.URLs[0],uuid:e.uuid,dbFileName:e.database.fileName,fullDetails:e,isPreferredMatch:e.isPreferredMatch})}static fromKPRPCEntrySummaryDTO(e,i,o){return new xi({icon:{version:1,iconImageData:e.iconImageData},usernameValue:e.usernameValue,usernameName:e.usernameName,path:i,title:e.title,uRLs:e.uRLs,url:e==null?void 0:e.uRLs[0],uuid:e.uniqueID,dbFileName:o})}}class ii{constructor(e){this.title=e.title||"",this.uuid=e.uuid||_e.newGUID(),this.icon=e.icon||{version:1,iconImageData:""},this.path=e.path||"UNKNOWN PATH",this.entrySummaries=e.entrySummaries||[],this.groups=e.groups||[]}static fromKPRPCGroupDTO(e,i){return new ii({title:e.title,uuid:e.uniqueID,icon:{version:1,iconImageData:e.iconImageData},path:e.path,entrySummaries:e.childLightEntries.map(o=>xi.fromKPRPCEntrySummaryDTO(o,e.path,i)),groups:e.childGroups.map(o=>this.fromKPRPCGroupDTO(o,i))})}static containsId(e,i){return!!(e.uuid===i||e.groups&&e.groups.some(o=>ii.containsId(o,i)))}}class To{constructor(e){this.name=e.name||"",this.fileName=e.fileName||"",this.icon=e.icon||{version:1,iconImageData:""},this.root=e.root||new ii({}),this.active=e.active||!1,this.sessionType=e.sessionType||cn.Event,this.sessionFeatures=e.sessionFeatures||[""]}static fromKPRPCDatabaseDTO(e,i,o){return new To({name:e.name,fileName:e.fileName,icon:{version:1,iconImageData:e.iconImageData},root:ii.fromKPRPCGroupDTO(e.root,e.fileName),active:e.active,sessionType:i,sessionFeatures:o})}}function Qe(t){return Me.i18n.getMessage(t)||t}function _o(t,e){return Me.i18n.getMessage(t,e)||t}class ln{constructor(e){this.id=e.id||"",this.name=e.name||"",this.type=e.type||"",this.query=e.query,this.labels=e.labels,this.autocompleteValues=e.autocompleteValues}}class Hr{}var ve=(t=>(t.radio="FFTradio",t.username="FFTusername",t.text="FFTtext",t.password="FFTpassword",t.select="FFTselect",t.checkbox="FFTcheckbox",t))(ve||{});class xe{constructor(e){this.name=e.name||"",this.value=e.value||"",this.resetValue=e.resetValue||"",this.uuid=e.uuid||_e.newGUID(),this.type=e.type||"text",this.locators=e.locators||[]}static getDisplayValueInternal(e,i,o){return e.type==="boolean"?e.value==="KEEFOX_CHECKED_FLAG_TRUE"?Qe("enabled"):Qe("disabled"):e.type==="password"&&!i?o:e.value}static getDisplayValue(e,i){return xe.getDisplayValueInternal(e,i,"*".repeat(e.value.length))}static getDisplayName(e){return e.name==="KeePass username"?Qe("username"):e.name==="KeePass password"?Qe("password"):e.name?e.name:"[ "+Qe("no_name")+" ]"}static getDisplayTooltip(e,i){return xe.getDisplayName(e)+": "+xe.getDisplayValueInternal(e,i,Qe("click_to_reveal_hide"))}static typeFromDOMtype(e){switch(e){case"password":return"password";case"radio":return"existing";case"checkbox":return"boolean";case"select-one":return"existing";default:return"text"}}static combineDomFieldLists(e,i,o){const a=[];return e>=0&&i[e]&&a.push(i[e]),o.forEach(n=>{a.push(n)}),i.forEach((n,s)=>{s!==e&&a.push(n)}),a}static fromDOM(e,i,o){const a=Gr(e);return new xe({uuid:_e.newGUID(),name:a&&a.length?a[0]:e.name,locators:[new ln({name:e.name,id:e.id,type:i,labels:a,autocompleteValues:Kr(e)})],value:o,type:xe.typeFromDOMtype(i)})}static fromKPRPCFieldDTO(e){let i="text",o="text";switch(e.type){case ve.password:i="password",o="password";break;case ve.radio:i="existing",o="radio";break;case ve.checkbox:i="boolean",o="checkbox";break;case ve.select:i="existing",o="select";break;case ve.username:i="text",o="text";break;case ve.text:i="text",o="text";break}return new xe({name:e.displayName||e.name,uuid:_e.newGUID(),value:e.value,resetValue:e.value,type:i,locators:[new ln({id:e.id,name:e.name,type:o})]})}static toKPRPCFieldDTO(e,i){let o;switch(e.locators[0].type){case"password":o=ve.password;break;case"radio":o=ve.radio;break;case"checkbox":o=ve.checkbox;break;case"select-one":o=ve.select;break;default:o=i?ve.username:ve.text;break}return{displayName:e.name,id:e.locators[0].id,name:e.locators[0].name,type:o,value:e.value,page:-1}}}function Gr(t){var n,s,r,c;const e=[],i=((n=t.labels)==null?void 0:n.length)||0;for(let l=0;l<i;l++){const d=t.labels[l];d!=null&&d.innerText&&e.push(d.innerText)}const o=(s=t.getAttribute("aria-label"))==null?void 0:s.toLowerCase();o&&e.push(o);const a=[];return(r=t.getAttribute("aria-labelledby"))==null||r.trim().split(" ").forEach(l=>{l&&a.push(l)}),(c=t.getAttribute("aria-describedby"))==null||c.trim().split(" ").forEach(l=>{l&&a.push(l)}),a.forEach(l=>{const d=document.getElementById(l);d!=null&&d.innerText&&e.push(d.innerText)}),e.length?e:void 0}function Kr(t){var i,o;const e=[];return(o=(i=t.attributes.autocomplete)==null?void 0:i.value)==null||o.trim().split(" ").forEach(a=>{a&&e.push(a.toLowerCase())}),e.length?e:void 0}class Ii{constructor(e){this.title=e.title||"",this.uuid=e.uuid||_e.newGUID(),this.icon=e.icon||{version:1,iconImageData:""},this.path=e.path||"UNKNOWN PATH"}static fromKPRPCGroupSummaryDTO(e){return new Ii({title:e.title,uuid:e.uniqueID,icon:{version:1,iconImageData:e.iconImageData},path:e.path})}static fromGroup(e){return new Ii({title:e.title,uuid:e.uuid,icon:e.icon,path:e.path})}}class et{constructor(e){this.alwaysAutoFill=e.alwaysAutoFill||!1,this.alwaysAutoSubmit=e.alwaysAutoSubmit||!1,this.neverAutoFill=e.neverAutoFill||!1,this.neverAutoSubmit=e.neverAutoSubmit||!1,this.URLs=e.URLs||[],this.fields=e.fields||[],this.httpRealm=e.httpRealm||"",this.parentGroup=e.parentGroup||null,this.uuid=e.uuid||_e.newGUID(),this.title=e.title||"",this.matchAccuracy=e.matchAccuracy||0,this.icon=e.icon||{version:1,iconImageData:""},this.database=e.database||new To({}),this.relevanceScore=e.relevanceScore,this.lowFieldMatchRatio=e.lowFieldMatchRatio,this.formIndex=e.formIndex,this.entryIndex=e.entryIndex,this.isPreferredMatch=e.isPreferredMatch}static getUsernameField(e){return e.fields.find(i=>i.type==="text")}static getPasswordField(e){return e.fields.find(i=>i.type==="password")}static fromKPRPCEntryDTO(e,i){const o=[];let a=1;const n=e.formFieldList.findIndex(l=>l.type===ve.username),s=e.formFieldList.map(l=>(l.page>a&&(a=l.page),xe.fromKPRPCFieldDTO(l))),r=s.findIndex(l=>l.type==="password");return n>-1&&o.push(s[n]),r>-1&&o.push(s[r]),s.forEach((l,d)=>{d!==n&&d!==r&&o.push(l)}),new et({URLs:e.uRLs,neverAutoFill:e.neverAutoFill,alwaysAutoFill:e.alwaysAutoFill,neverAutoSubmit:e.neverAutoSubmit,alwaysAutoSubmit:e.alwaysAutoSubmit,icon:{version:1,iconImageData:e.iconImageData},parentGroup:Ii.fromKPRPCGroupSummaryDTO(e.parent),database:i,matchAccuracy:e.matchAccuracy,httpRealm:e.hTTPRealm,uuid:e.uniqueID,title:e.title,fields:o})}static toKPRPCEntryDTO(e){const i=new Hr;return i.alwaysAutoFill=e.alwaysAutoFill,i.alwaysAutoSubmit=e.alwaysAutoSubmit,i.formFieldList=e.fields.map((o,a)=>xe.toKPRPCFieldDTO(o,a===0)),i.hTTPRealm=e.httpRealm,i.iconImageData=e.icon.iconImageData,i.neverAutoFill=e.neverAutoFill,i.neverAutoSubmit=e.neverAutoSubmit,i.title=e.title,i.uRLs=e.URLs,i}}function ut(t,e){const i=Object.create(null),o=t.split(",");for(let a=0;a<o.length;a++)i[o[a]]=!0;return e?a=>!!i[a.toLowerCase()]:a=>!!i[a]}function Eo(t){if($(t)){const e={};for(let i=0;i<t.length;i++){const o=t[i],a=me(o)?qr(o):Eo(o);if(a)for(const n in a)e[n]=a[n]}return e}else{if(me(t))return t;if(re(t))return t}}const Vr=/;(?![^(]*\))/g,$r=/:([^]+)/,Wr=/\/\*.*?\*\//gs;function qr(t){const e={};return t.replace(Wr,"").split(Vr).forEach(i=>{if(i){const o=i.split($r);o.length>1&&(e[o[0].trim()]=o[1].trim())}}),e}function Fo(t){let e="";if(me(t))e=t;else if($(t))for(let i=0;i<t.length;i++){const o=Fo(t[i]);o&&(e+=o+" ")}else if(re(t))for(const i in t)t[i]&&(e+=i+" ");return e.trim()}const Jr="html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot",Yr="svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view",Xr=ut(Jr),Zr=ut(Yr),Qr=ut("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function un(t){return!!t||t===""}const oe=Object.freeze({}),oi=Object.freeze([]),Se=()=>{},mn=()=>!1,ec=/^on[^a-z]/,ai=t=>ec.test(t),Ri=t=>t.startsWith("onUpdate:"),ue=Object.assign,Bo=(t,e)=>{const i=t.indexOf(e);i>-1&&t.splice(i,1)},tc=Object.prototype.hasOwnProperty,Z=(t,e)=>tc.call(t,e),$=Array.isArray,Nt=t=>zi(t)==="[object Map]",ic=t=>zi(t)==="[object Set]",W=t=>typeof t=="function",me=t=>typeof t=="string",Oo=t=>typeof t=="symbol",re=t=>t!==null&&typeof t=="object",Do=t=>re(t)&&W(t.then)&&W(t.catch),oc=Object.prototype.toString,zi=t=>oc.call(t),No=t=>zi(t).slice(8,-1),ac=t=>zi(t)==="[object Object]",Uo=t=>me(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,Pi=ut(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),nc=ut("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"),Mi=t=>{const e=Object.create(null);return i=>e[i]||(e[i]=t(i))},sc=/-(\w)/g,Ut=Mi(t=>t.replace(sc,(e,i)=>i?i.toUpperCase():"")),rc=/\B([A-Z])/g,mt=Mi(t=>t.replace(rc,"-$1").toLowerCase()),Ti=Mi(t=>t.charAt(0).toUpperCase()+t.slice(1)),vt=Mi(t=>t?`on${Ti(t)}`:""),ni=(t,e)=>!Object.is(t,e),si=(t,e)=>{for(let i=0;i<t.length;i++)t[i](e)},_i=(t,e,i)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:i})},dn=t=>{const e=parseFloat(t);return isNaN(e)?t:e};let pn;const hn=()=>pn||(pn=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Ei(t,...e){console.warn(`[Vue warn] ${t}`,...e)}let Ie;class gn{constructor(e=!1){this.detached=e,this.active=!0,this.effects=[],this.cleanups=[],this.parent=Ie,!e&&Ie&&(this.index=(Ie.scopes||(Ie.scopes=[])).push(this)-1)}run(e){if(this.active){const i=Ie;try{return Ie=this,e()}finally{Ie=i}}else Ei("cannot run an inactive effect scope.")}on(){Ie=this}off(){Ie=this.parent}stop(e){if(this.active){let i,o;for(i=0,o=this.effects.length;i<o;i++)this.effects[i].stop();for(i=0,o=this.cleanups.length;i<o;i++)this.cleanups[i]();if(this.scopes)for(i=0,o=this.scopes.length;i<o;i++)this.scopes[i].stop(!0);if(!this.detached&&this.parent&&!e){const a=this.parent.scopes.pop();a&&a!==this&&(this.parent.scopes[this.index]=a,a.index=this.index)}this.parent=void 0,this.active=!1}}}function fn(t){return new gn(t)}function cc(t,e=Ie){e&&e.active&&e.effects.push(t)}function lc(){return Ie}function uc(t){Ie?Ie.cleanups.push(t):Ei("onScopeDispose() is called when there is no active effect scope to be associated with.")}const Ho=t=>{const e=new Set(t);return e.w=0,e.n=0,e},bn=t=>(t.w&dt)>0,kn=t=>(t.n&dt)>0,mc=({deps:t})=>{if(t.length)for(let e=0;e<t.length;e++)t[e].w|=dt},dc=t=>{const{deps:e}=t;if(e.length){let i=0;for(let o=0;o<e.length;o++){const a=e[o];bn(a)&&!kn(a)?a.delete(t):e[i++]=a,a.w&=~dt,a.n&=~dt}e.length=i}},Go=new WeakMap;let ri=0,dt=1;const Ko=30;let ke;const St=Symbol("iterate"),Vo=Symbol("Map key iterate");class $o{constructor(e,i=null,o){this.fn=e,this.scheduler=i,this.active=!0,this.deps=[],this.parent=void 0,cc(this,o)}run(){if(!this.active)return this.fn();let e=ke,i=pt;for(;e;){if(e===this)return;e=e.parent}try{return this.parent=ke,ke=this,pt=!0,dt=1<<++ri,ri<=Ko?mc(this):yn(this),this.fn()}finally{ri<=Ko&&dc(this),dt=1<<--ri,ke=this.parent,pt=i,this.parent=void 0,this.deferStop&&this.stop()}}stop(){ke===this?this.deferStop=!0:this.active&&(yn(this),this.onStop&&this.onStop(),this.active=!1)}}function yn(t){const{deps:e}=t;if(e.length){for(let i=0;i<e.length;i++)e[i].delete(t);e.length=0}}let pt=!0;const wn=[];function Lt(){wn.push(pt),pt=!1}function Ct(){const t=wn.pop();pt=t===void 0?!0:t}function Re(t,e,i){if(pt&&ke){let o=Go.get(t);o||Go.set(t,o=new Map);let a=o.get(i);a||o.set(i,a=Ho()),jn(a,{effect:ke,target:t,type:e,key:i})}}function jn(t,e){let i=!1;ri<=Ko?kn(t)||(t.n|=dt,i=!bn(t)):i=!t.has(ke),i&&(t.add(ke),ke.deps.push(t),ke.onTrack&&ke.onTrack(Object.assign({effect:ke},e)))}function tt(t,e,i,o,a,n){const s=Go.get(t);if(!s)return;let r=[];if(e==="clear")r=[...s.values()];else if(i==="length"&&$(t)){const l=dn(o);s.forEach((d,u)=>{(u==="length"||u>=l)&&r.push(d)})}else switch(i!==void 0&&r.push(s.get(i)),e){case"add":$(t)?Uo(i)&&r.push(s.get("length")):(r.push(s.get(St)),Nt(t)&&r.push(s.get(Vo)));break;case"delete":$(t)||(r.push(s.get(St)),Nt(t)&&r.push(s.get(Vo)));break;case"set":Nt(t)&&r.push(s.get(St));break}const c={target:t,type:e,key:i,newValue:o,oldValue:a,oldTarget:n};if(r.length===1)r[0]&&Wo(r[0],c);else{const l=[];for(const d of r)d&&l.push(...d);Wo(Ho(l),c)}}function Wo(t,e){const i=$(t)?t:[...t];for(const o of i)o.computed&&vn(o,e);for(const o of i)o.computed||vn(o,e)}function vn(t,e){(t!==ke||t.allowRecurse)&&(t.onTrigger&&t.onTrigger(ue({effect:t},e)),t.scheduler?t.scheduler():t.run())}const pc=ut("__proto__,__v_isRef,__isVue"),Sn=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Oo)),hc=Fi(),gc=Fi(!1,!0),fc=Fi(!0),bc=Fi(!0,!0),Ln=kc();function kc(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...i){const o=q(this);for(let n=0,s=this.length;n<s;n++)Re(o,"get",n+"");const a=o[e](...i);return a===-1||a===!1?o[e](...i.map(q)):a}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...i){Lt();const o=q(this)[e].apply(this,i);return Ct(),o}}),t}function Fi(t=!1,e=!1){return function(o,a,n){if(a==="__v_isReactive")return!t;if(a==="__v_isReadonly")return t;if(a==="__v_isShallow")return e;if(a==="__v_raw"&&n===(t?e?Fn:En:e?_n:Tn).get(o))return o;const s=$(o);if(!t&&s&&Z(Ln,a))return Reflect.get(Ln,a,n);const r=Reflect.get(o,a,n);return(Oo(a)?Sn.has(a):pc(a))||(t||Re(o,"get",a),e)?r:ce(r)?s&&Uo(a)?r:r.value:re(r)?t?Bn(r):Ki(r):r}}const yc=Cn(),wc=Cn(!0);function Cn(t=!1){return function(i,o,a,n){let s=i[o];if(gt(s)&&ce(s)&&!ce(a))return!1;if(!t&&(!$i(a)&&!gt(a)&&(s=q(s),a=q(a)),!$(i)&&ce(s)&&!ce(a)))return s.value=a,!0;const r=$(i)&&Uo(o)?Number(o)<i.length:Z(i,o),c=Reflect.set(i,o,a,n);return i===q(n)&&(r?ni(a,s)&&tt(i,"set",o,a,s):tt(i,"add",o,a)),c}}function jc(t,e){const i=Z(t,e),o=t[e],a=Reflect.deleteProperty(t,e);return a&&i&&tt(t,"delete",e,void 0,o),a}function vc(t,e){const i=Reflect.has(t,e);return(!Oo(e)||!Sn.has(e))&&Re(t,"has",e),i}function Sc(t){return Re(t,"iterate",$(t)?"length":St),Reflect.ownKeys(t)}const An={get:hc,set:yc,deleteProperty:jc,has:vc,ownKeys:Sc},xn={get:fc,set(t,e){return Ei(`Set operation on key "${String(e)}" failed: target is readonly.`,t),!0},deleteProperty(t,e){return Ei(`Delete operation on key "${String(e)}" failed: target is readonly.`,t),!0}},Lc=ue({},An,{get:gc,set:wc}),Cc=ue({},xn,{get:bc}),qo=t=>t,Bi=t=>Reflect.getPrototypeOf(t);function Oi(t,e,i=!1,o=!1){t=t.__v_raw;const a=q(t),n=q(e);i||(e!==n&&Re(a,"get",e),Re(a,"get",n));const{has:s}=Bi(a),r=o?qo:i?Jo:ci;if(s.call(a,e))return r(t.get(e));if(s.call(a,n))return r(t.get(n));t!==a&&t.get(e)}function Di(t,e=!1){const i=this.__v_raw,o=q(i),a=q(t);return e||(t!==a&&Re(o,"has",t),Re(o,"has",a)),t===a?i.has(t):i.has(t)||i.has(a)}function Ni(t,e=!1){return t=t.__v_raw,!e&&Re(q(t),"iterate",St),Reflect.get(t,"size",t)}function In(t){t=q(t);const e=q(this);return Bi(e).has.call(e,t)||(e.add(t),tt(e,"add",t,t)),this}function Rn(t,e){e=q(e);const i=q(this),{has:o,get:a}=Bi(i);let n=o.call(i,t);n?Mn(i,o,t):(t=q(t),n=o.call(i,t));const s=a.call(i,t);return i.set(t,e),n?ni(e,s)&&tt(i,"set",t,e,s):tt(i,"add",t,e),this}function zn(t){const e=q(this),{has:i,get:o}=Bi(e);let a=i.call(e,t);a?Mn(e,i,t):(t=q(t),a=i.call(e,t));const n=o?o.call(e,t):void 0,s=e.delete(t);return a&&tt(e,"delete",t,void 0,n),s}function Pn(){const t=q(this),e=t.size!==0,i=Nt(t)?new Map(t):new Set(t),o=t.clear();return e&&tt(t,"clear",void 0,void 0,i),o}function Ui(t,e){return function(o,a){const n=this,s=n.__v_raw,r=q(s),c=e?qo:t?Jo:ci;return!t&&Re(r,"iterate",St),s.forEach((l,d)=>o.call(a,c(l),c(d),n))}}function Hi(t,e,i){return function(...o){const a=this.__v_raw,n=q(a),s=Nt(n),r=t==="entries"||t===Symbol.iterator&&s,c=t==="keys"&&s,l=a[t](...o),d=i?qo:e?Jo:ci;return!e&&Re(n,"iterate",c?Vo:St),{next(){const{value:u,done:p}=l.next();return p?{value:u,done:p}:{value:r?[d(u[0]),d(u[1])]:d(u),done:p}},[Symbol.iterator](){return this}}}}function ht(t){return function(...e){{const i=e[0]?`on key "${e[0]}" `:"";console.warn(`${Ti(t)} operation ${i}failed: target is readonly.`,q(this))}return t==="delete"?!1:this}}function Ac(){const t={get(n){return Oi(this,n)},get size(){return Ni(this)},has:Di,add:In,set:Rn,delete:zn,clear:Pn,forEach:Ui(!1,!1)},e={get(n){return Oi(this,n,!1,!0)},get size(){return Ni(this)},has:Di,add:In,set:Rn,delete:zn,clear:Pn,forEach:Ui(!1,!0)},i={get(n){return Oi(this,n,!0)},get size(){return Ni(this,!0)},has(n){return Di.call(this,n,!0)},add:ht("add"),set:ht("set"),delete:ht("delete"),clear:ht("clear"),forEach:Ui(!0,!1)},o={get(n){return Oi(this,n,!0,!0)},get size(){return Ni(this,!0)},has(n){return Di.call(this,n,!0)},add:ht("add"),set:ht("set"),delete:ht("delete"),clear:ht("clear"),forEach:Ui(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(n=>{t[n]=Hi(n,!1,!1),i[n]=Hi(n,!0,!1),e[n]=Hi(n,!1,!0),o[n]=Hi(n,!0,!0)}),[t,i,e,o]}const[xc,Ic,Rc,zc]=Ac();function Gi(t,e){const i=e?t?zc:Rc:t?Ic:xc;return(o,a,n)=>a==="__v_isReactive"?!t:a==="__v_isReadonly"?t:a==="__v_raw"?o:Reflect.get(Z(i,a)&&a in o?i:o,a,n)}const Pc={get:Gi(!1,!1)},Mc={get:Gi(!1,!0)},Tc={get:Gi(!0,!1)},_c={get:Gi(!0,!0)};function Mn(t,e,i){const o=q(i);if(o!==i&&e.call(t,o)){const a=No(t);console.warn(`Reactive ${a} contains both the raw and reactive versions of the same object${a==="Map"?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}const Tn=new WeakMap,_n=new WeakMap,En=new WeakMap,Fn=new WeakMap;function Ec(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Fc(t){return t.__v_skip||!Object.isExtensible(t)?0:Ec(No(t))}function Ki(t){return gt(t)?t:Vi(t,!1,An,Pc,Tn)}function Bc(t){return Vi(t,!1,Lc,Mc,_n)}function Bn(t){return Vi(t,!0,xn,Tc,En)}function Ht(t){return Vi(t,!0,Cc,_c,Fn)}function Vi(t,e,i,o,a){if(!re(t))return console.warn(`value cannot be made reactive: ${String(t)}`),t;if(t.__v_raw&&!(e&&t.__v_isReactive))return t;const n=a.get(t);if(n)return n;const s=Fc(t);if(s===0)return t;const r=new Proxy(t,s===2?o:i);return a.set(t,r),r}function $e(t){return gt(t)?$e(t.__v_raw):!!(t&&t.__v_isReactive)}function gt(t){return!!(t&&t.__v_isReadonly)}function $i(t){return!!(t&&t.__v_isShallow)}function Wi(t){return $e(t)||gt(t)}function q(t){const e=t&&t.__v_raw;return e?q(e):t}function Ee(t){return _i(t,"__v_skip",!0),t}const ci=t=>re(t)?Ki(t):t,Jo=t=>re(t)?Bn(t):t;function On(t){pt&&ke&&(t=q(t),jn(t.dep||(t.dep=Ho()),{target:t,type:"get",key:"value"}))}function Dn(t,e){t=q(t),t.dep&&Wo(t.dep,{target:t,type:"set",key:"value",newValue:e})}function ce(t){return!!(t&&t.__v_isRef===!0)}function Yo(t){return Oc(t,!1)}function Oc(t,e){return ce(t)?t:new Dc(t,e)}class Dc{constructor(e,i){this.__v_isShallow=i,this.dep=void 0,this.__v_isRef=!0,this._rawValue=i?e:q(e),this._value=i?e:ci(e)}get value(){return On(this),this._value}set value(e){const i=this.__v_isShallow||$i(e)||gt(e);e=i?e:q(e),ni(e,this._rawValue)&&(this._rawValue=e,this._value=i?e:ci(e),Dn(this,e))}}function Nn(t){return ce(t)?t.value:t}const Nc={get:(t,e,i)=>Nn(Reflect.get(t,e,i)),set:(t,e,i,o)=>{const a=t[e];return ce(a)&&!ce(i)?(a.value=i,!0):Reflect.set(t,e,i,o)}};function Un(t){return $e(t)?t:new Proxy(t,Nc)}function Hn(t){Wi(t)||console.warn("toRefs() expects a reactive object but received a plain one.");const e=$(t)?new Array(t.length):{};for(const i in t)e[i]=qi(t,i);return e}class Uc{constructor(e,i,o){this._object=e,this._key=i,this._defaultValue=o,this.__v_isRef=!0}get value(){const e=this._object[this._key];return e===void 0?this._defaultValue:e}set value(e){this._object[this._key]=e}}function qi(t,e,i){const o=t[e];return ce(o)?o:new Uc(t,e,i)}var Gn;class Hc{constructor(e,i,o,a){this._setter=i,this.dep=void 0,this.__v_isRef=!0,this[Gn]=!1,this._dirty=!0,this.effect=new $o(e,()=>{this._dirty||(this._dirty=!0,Dn(this))}),this.effect.computed=this,this.effect.active=this._cacheable=!a,this.__v_isReadonly=o}get value(){const e=q(this);return On(e),(e._dirty||!e._cacheable)&&(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e)}}Gn="__v_isReadonly";function Gc(t,e,i=!1){let o,a;const n=W(t);n?(o=t,a=()=>{console.warn("Write operation failed: computed value is readonly")}):(o=t.get,a=t.set);const s=new Hc(o,a,n||!a,i);return e&&!i&&(s.effect.onTrack=e.onTrack,s.effect.onTrigger=e.onTrigger),s}const At=[];function Ji(t){At.push(t)}function Yi(){At.pop()}function I(t,...e){Lt();const i=At.length?At[At.length-1].component:null,o=i&&i.appContext.config.warnHandler,a=Kc();if(o)it(o,i,11,[t+e.join(""),i&&i.proxy,a.map(({vnode:n})=>`at <${mo(i,n.type)}>`).join(`
`),a]);else{const n=[`[Vue warn]: ${t}`,...e];a.length&&n.push(`
`,...Vc(a)),console.warn(...n)}Ct()}function Kc(){let t=At[At.length-1];if(!t)return[];const e=[];for(;t;){const i=e[0];i&&i.vnode===t?i.recurseCount++:e.push({vnode:t,recurseCount:0});const o=t.component&&t.component.parent;t=o&&o.vnode}return e}function Vc(t){const e=[];return t.forEach((i,o)=>{e.push(...o===0?[]:[`
`],...$c(i))}),e}function $c({vnode:t,recurseCount:e}){const i=e>0?`... (${e} recursive calls)`:"",o=t.component?t.component.parent==null:!1,a=` at <${mo(t.component,t.type,o)}`,n=">"+i;return t.props?[a,...Wc(t.props),n]:[a+n]}function Wc(t){const e=[],i=Object.keys(t);return i.slice(0,3).forEach(o=>{e.push(...Kn(o,t[o]))}),i.length>3&&e.push(" ..."),e}function Kn(t,e,i){return me(e)?(e=JSON.stringify(e),i?e:[`${t}=${e}`]):typeof e=="number"||typeof e=="boolean"||e==null?i?e:[`${t}=${e}`]:ce(e)?(e=Kn(t,q(e.value),!0),i?e:[`${t}=Ref<`,e,">"]):W(e)?[`${t}=fn${e.name?`<${e.name}>`:""}`]:(e=q(e),i?e:[`${t}=`,e])}const Xo={sp:"serverPrefetch hook",bc:"beforeCreate hook",c:"created hook",bm:"beforeMount hook",m:"mounted hook",bu:"beforeUpdate hook",u:"updated",bum:"beforeUnmount hook",um:"unmounted hook",a:"activated hook",da:"deactivated hook",ec:"errorCaptured hook",rtc:"renderTracked hook",rtg:"renderTriggered hook",[0]:"setup function",[1]:"render function",[2]:"watcher getter",[3]:"watcher callback",[4]:"watcher cleanup function",[5]:"native event handler",[6]:"component event handler",[7]:"vnode hook",[8]:"directive hook",[9]:"transition hook",[10]:"app errorHandler",[11]:"app warnHandler",[12]:"ref function",[13]:"async component loader",[14]:"scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"};function it(t,e,i,o){let a;try{a=o?t(...o):t()}catch(n){Xi(n,e,i)}return a}function Fe(t,e,i,o){if(W(t)){const n=it(t,e,i,o);return n&&Do(n)&&n.catch(s=>{Xi(s,e,i)}),n}const a=[];for(let n=0;n<t.length;n++)a.push(Fe(t[n],e,i,o));return a}function Xi(t,e,i,o=!0){const a=e?e.vnode:null;if(e){let n=e.parent;const s=e.proxy,r=Xo[i];for(;n;){const l=n.ec;if(l){for(let d=0;d<l.length;d++)if(l[d](t,s,r)===!1)return}n=n.parent}const c=e.appContext.config.errorHandler;if(c){it(c,null,10,[t,s,r]);return}}qc(t,i,a,o)}function qc(t,e,i,o=!0){{const a=Xo[e];if(i&&Ji(i),I(`Unhandled error${a?` during execution of ${a}`:""}`),i&&Yi(),o)throw t;console.error(t)}}let li=!1,Zo=!1;const fe=[];let We=0;const Gt=[];let qe=null,ft=0;const Vn=Promise.resolve();let Qo=null;const Jc=100;function ea(t){const e=Qo||Vn;return t?e.then(this?t.bind(this):t):e}function Yc(t){let e=We+1,i=fe.length;for(;e<i;){const o=e+i>>>1;ui(fe[o])<t?e=o+1:i=o}return e}function Zi(t){(!fe.length||!fe.includes(t,li&&t.allowRecurse?We+1:We))&&(t.id==null?fe.push(t):fe.splice(Yc(t.id),0,t),$n())}function $n(){!li&&!Zo&&(Zo=!0,Qo=Vn.then(Yn))}function Xc(t){const e=fe.indexOf(t);e>We&&fe.splice(e,1)}function Wn(t){$(t)?Gt.push(...t):(!qe||!qe.includes(t,t.allowRecurse?ft+1:ft))&&Gt.push(t),$n()}function qn(t,e=li?We+1:0){for(t=t||new Map;e<fe.length;e++){const i=fe[e];if(i&&i.pre){if(ta(t,i))continue;fe.splice(e,1),e--,i()}}}function Jn(t){if(Gt.length){const e=[...new Set(Gt)];if(Gt.length=0,qe){qe.push(...e);return}for(qe=e,t=t||new Map,qe.sort((i,o)=>ui(i)-ui(o)),ft=0;ft<qe.length;ft++)ta(t,qe[ft])||qe[ft]();qe=null,ft=0}}const ui=t=>t.id==null?1/0:t.id,Zc=(t,e)=>{const i=ui(t)-ui(e);if(i===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return i};function Yn(t){Zo=!1,li=!0,t=t||new Map,fe.sort(Zc);const e=i=>ta(t,i);try{for(We=0;We<fe.length;We++){const i=fe[We];if(i&&i.active!==!1){if(e(i))continue;it(i,null,14)}}}finally{We=0,fe.length=0,Jn(t),li=!1,Qo=null,(fe.length||Gt.length)&&Yn(t)}}function ta(t,e){if(!t.has(e))t.set(e,1);else{const i=t.get(e);if(i>Jc){const o=e.ownerInstance,a=o&&_s(o.type);return I(`Maximum recursive updates exceeded${a?` in component <${a}>`:""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`),!0}else t.set(e,i+1)}}let xt=!1;const Kt=new Set;hn().__VUE_HMR_RUNTIME__={createRecord:ia(Xn),rerender:ia(tl),reload:ia(il)};const It=new Map;function Qc(t){const e=t.type.__hmrId;let i=It.get(e);i||(Xn(e,t.type),i=It.get(e)),i.instances.add(t)}function el(t){It.get(t.type.__hmrId).instances.delete(t)}function Xn(t,e){return It.has(t)?!1:(It.set(t,{initialDef:mi(e),instances:new Set}),!0)}function mi(t){return Es(t)?t.__vccOpts:t}function tl(t,e){const i=It.get(t);i&&(i.initialDef.render=e,[...i.instances].forEach(o=>{e&&(o.render=e,mi(o.type).render=e),o.renderCache=[],xt=!0,o.update(),xt=!1}))}function il(t,e){const i=It.get(t);if(!i)return;e=mi(e),Zn(i.initialDef,e);const o=[...i.instances];for(const a of o){const n=mi(a.type);Kt.has(n)||(n!==i.initialDef&&Zn(n,e),Kt.add(n)),a.appContext.optionsCache.delete(a.type),a.ceReload?(Kt.add(n),a.ceReload(e.styles),Kt.delete(n)):a.parent?Zi(a.parent.update):a.appContext.reload?a.appContext.reload():typeof window<"u"?window.location.reload():console.warn("[HMR] Root or manually mounted instance modified. Full reload required.")}Wn(()=>{for(const a of o)Kt.delete(mi(a.type))})}function Zn(t,e){ue(t,e);for(const i in t)i!=="__file"&&!(i in e)&&delete t[i]}function ia(t){return(e,i)=>{try{return t(e,i)}catch(o){console.error(o),console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.")}}}let Je,di=[],oa=!1;function pi(t,...e){Je?Je.emit(t,...e):oa||di.push({event:t,args:e})}function Qn(t,e){var i,o;Je=t,Je?(Je.enabled=!0,di.forEach(({event:a,args:n})=>Je.emit(a,...n)),di=[]):typeof window<"u"&&window.HTMLElement&&!(!((o=(i=window.navigator)===null||i===void 0?void 0:i.userAgent)===null||o===void 0)&&o.includes("jsdom"))?((e.__VUE_DEVTOOLS_HOOK_REPLAY__=e.__VUE_DEVTOOLS_HOOK_REPLAY__||[]).push(n=>{Qn(n,e)}),setTimeout(()=>{Je||(e.__VUE_DEVTOOLS_HOOK_REPLAY__=null,oa=!0,di=[])},3e3)):(oa=!0,di=[])}function ol(t,e){pi("app:init",t,e,{Fragment:Ye,Text:bi,Comment:Be,Static:co})}function al(t){pi("app:unmount",t)}const nl=aa("component:added"),es=aa("component:updated"),sl=aa("component:removed"),rl=t=>{Je&&typeof Je.cleanupBuffer=="function"&&!Je.cleanupBuffer(t)&&sl(t)};function aa(t){return e=>{pi(t,e.appContext.app,e.uid,e.parent?e.parent.uid:void 0,e)}}const cl=ts("perf:start"),ll=ts("perf:end");function ts(t){return(e,i,o)=>{pi(t,e.appContext.app,e.uid,e,i,o)}}function ul(t,e,i){pi("component:emit",t.appContext.app,t,e,i)}function ml(t,e,...i){if(t.isUnmounted)return;const o=t.vnode.props||oe;{const{emitsOptions:d,propsOptions:[u]}=t;if(d)if(!(e in d))(!u||!(vt(e)in u))&&I(`Component emitted event "${e}" but it is neither declared in the emits option nor as an "${vt(e)}" prop.`);else{const p=d[e];W(p)&&(p(...i)||I(`Invalid event arguments: event validation failed for event "${e}".`))}}let a=i;const n=e.startsWith("update:"),s=n&&e.slice(7);if(s&&s in o){const d=`${s==="modelValue"?"model":s}Modifiers`,{number:u,trim:p}=o[d]||oe;p&&(a=i.map(g=>me(g)?g.trim():g)),u&&(a=i.map(dn))}ul(t,e,a);{const d=e.toLowerCase();d!==e&&o[vt(d)]&&I(`Event "${d}" is emitted in component ${mo(t,t.type)} but the handler is registered for "${e}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${mt(e)}" instead of "${e}".`)}let r,c=o[r=vt(e)]||o[r=vt(Ut(e))];!c&&n&&(c=o[r=vt(mt(e))]),c&&Fe(c,t,6,a);const l=o[r+"Once"];if(l){if(!t.emitted)t.emitted={};else if(t.emitted[r])return;t.emitted[r]=!0,Fe(l,t,6,a)}}function is(t,e,i=!1){const o=e.emitsCache,a=o.get(t);if(a!==void 0)return a;const n=t.emits;let s={},r=!1;if(!W(t)){const c=l=>{const d=is(l,e,!0);d&&(r=!0,ue(s,d))};!i&&e.mixins.length&&e.mixins.forEach(c),t.extends&&c(t.extends),t.mixins&&t.mixins.forEach(c)}return!n&&!r?(re(t)&&o.set(t,null),null):($(n)?n.forEach(c=>s[c]=null):ue(s,n),re(t)&&o.set(t,s),s)}function Qi(t,e){return!t||!ai(e)?!1:(e=e.slice(2).replace(/Once$/,""),Z(t,e[0].toLowerCase()+e.slice(1))||Z(t,mt(e))||Z(t,e))}let ze=null,os=null;function eo(t){const e=ze;return ze=t,os=t&&t.type.__scopeId||null,e}function dl(t,e=ze,i){if(!e||t._n)return t;const o=(...a)=>{o._d&&Is(-1);const n=eo(e);let s;try{s=t(...a)}finally{eo(n),o._d&&Is(1)}return es(e),s};return o._n=!0,o._c=!0,o._d=!0,o}let na=!1;function to(){na=!0}function sa(t){const{type:e,vnode:i,proxy:o,withProxy:a,props:n,propsOptions:[s],slots:r,attrs:c,emit:l,render:d,renderCache:u,data:p,setupState:g,ctx:v,inheritAttrs:y}=t;let A,P;const B=eo(t);na=!1;try{if(i.shapeFlag&4){const X=a||o;A=Oe(d.call(X,X,u,n,g,p,v)),P=c}else{const X=e;c===n&&to(),A=Oe(X.length>1?X(n,{get attrs(){return to(),c},slots:r,emit:l}):X(n,null)),P=e.props?c:hl(c)}}catch(X){Xi(X,t,1),A=Tt(Be)}let H=A,F;if(A.patchFlag>0&&A.patchFlag&2048&&([H,F]=pl(A)),P&&y!==!1){const X=Object.keys(P),{shapeFlag:se}=H;if(X.length){if(se&7)s&&X.some(Ri)&&(P=gl(P,s)),H=kt(H,P);else if(!na&&H.type!==Be){const D=Object.keys(c),M=[],f=[];for(let w=0,b=D.length;w<b;w++){const z=D[w];ai(z)?Ri(z)||M.push(z[2].toLowerCase()+z.slice(3)):f.push(z)}f.length&&I(`Extraneous non-props attributes (${f.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.`),M.length&&I(`Extraneous non-emits event listeners (${M.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`)}}}return i.dirs&&(ns(H)||I("Runtime directive used on component with non-element root node. The directives will not function as intended."),H=kt(H),H.dirs=H.dirs?H.dirs.concat(i.dirs):i.dirs),i.transition&&(ns(H)||I("Component inside <Transition> renders non-element root node that cannot be animated."),H.transition=i.transition),F?F(H):A=H,eo(B),A}const pl=t=>{const e=t.children,i=t.dynamicChildren,o=as(e);if(!o)return[t,void 0];const a=e.indexOf(o),n=i?i.indexOf(o):-1,s=r=>{e[a]=r,i&&(n>-1?i[n]=r:r.patchFlag>0&&(t.dynamicChildren=[...i,r]))};return[Oe(o),s]};function as(t){let e;for(let i=0;i<t.length;i++){const o=t[i];if(ya(o)){if(o.type!==Be||o.children==="v-if"){if(e)return;e=o}}else return}return e}const hl=t=>{let e;for(const i in t)(i==="class"||i==="style"||ai(i))&&((e||(e={}))[i]=t[i]);return e},gl=(t,e)=>{const i={};for(const o in t)(!Ri(o)||!(o.slice(9)in e))&&(i[o]=t[o]);return i},ns=t=>t.shapeFlag&7||t.type===Be;function fl(t,e,i){const{props:o,children:a,component:n}=t,{props:s,children:r,patchFlag:c}=e,l=n.emitsOptions;if((a||r)&&xt||e.dirs||e.transition)return!0;if(i&&c>=0){if(c&1024)return!0;if(c&16)return o?ss(o,s,l):!!s;if(c&8){const d=e.dynamicProps;for(let u=0;u<d.length;u++){const p=d[u];if(s[p]!==o[p]&&!Qi(l,p))return!0}}}else return(a||r)&&(!r||!r.$stable)?!0:o===s?!1:o?s?ss(o,s,l):!0:!!s;return!1}function ss(t,e,i){const o=Object.keys(e);if(o.length!==Object.keys(t).length)return!0;for(let a=0;a<o.length;a++){const n=o[a];if(e[n]!==t[n]&&!Qi(i,n))return!0}return!1}function bl({vnode:t,parent:e},i){for(;e&&e.subTree===t;)(t=e.vnode).el=i,e=e.parent}const kl=t=>t.__isSuspense;function yl(t,e){e&&e.pendingBranch?$(t)?e.effects.push(...t):e.effects.push(t):Wn(t)}function wl(t,e){if(!pe)I("provide() can only be used inside setup().");else{let i=pe.provides;const o=pe.parent&&pe.parent.provides;o===i&&(i=pe.provides=Object.create(o)),i[t]=e}}function hi(t,e,i=!1){const o=pe||ze;if(o){const a=o.parent==null?o.vnode.appContext&&o.vnode.appContext.provides:o.parent.provides;if(a&&t in a)return a[t];if(arguments.length>1)return i&&W(e)?e.call(o.proxy):e;I(`injection "${String(t)}" not found.`)}else I("inject() can only be used inside setup() or functional components.")}const io={};function gi(t,e,i){return W(e)||I("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."),rs(t,e,i)}function rs(t,e,{immediate:i,deep:o,flush:a,onTrack:n,onTrigger:s}=oe){e||(i!==void 0&&I('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'),o!==void 0&&I('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'));const r=F=>{I("Invalid watch source: ",F,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},c=pe;let l,d=!1,u=!1;if(ce(t)?(l=()=>t.value,d=$i(t)):$e(t)?(l=()=>t,o=!0):$(t)?(u=!0,d=t.some(F=>$e(F)||$i(F)),l=()=>t.map(F=>{if(ce(F))return F.value;if($e(F))return Vt(F);if(W(F))return it(F,c,2);r(F)})):W(t)?e?l=()=>it(t,c,2):l=()=>{if(!(c&&c.isUnmounted))return p&&p(),Fe(t,c,3,[g])}:(l=Se,r(t)),e&&o){const F=l;l=()=>Vt(F())}let p,g=F=>{p=B.onStop=()=>{it(F,c,4)}},v;if(yi)if(g=Se,e?i&&Fe(e,c,3,[l(),u?[]:void 0,g]):l(),a==="sync"){const F=Iu();v=F.__watcherHandles||(F.__watcherHandles=[])}else return Se;let y=u?new Array(t.length).fill(io):io;const A=()=>{if(B.active)if(e){const F=B.run();(o||d||(u?F.some((X,se)=>ni(X,y[se])):ni(F,y)))&&(p&&p(),Fe(e,c,3,[F,y===io?void 0:u&&y[0]===io?[]:y,g]),y=F)}else B.run()};A.allowRecurse=!!e;let P;a==="sync"?P=A:a==="post"?P=()=>Le(A,c&&c.suspense):(A.pre=!0,c&&(A.id=c.uid),P=()=>Zi(A));const B=new $o(l,P);B.onTrack=n,B.onTrigger=s,e?i?A():y=B.run():a==="post"?Le(B.run.bind(B),c&&c.suspense):B.run();const H=()=>{B.stop(),c&&c.scope&&Bo(c.scope.effects,B)};return v&&v.push(H),H}function jl(t,e,i){const o=this.proxy,a=me(t)?t.includes(".")?cs(o,t):()=>o[t]:t.bind(o,o);let n;W(e)?n=e:(n=e.handler,i=e);const s=pe;Wt(this);const r=rs(a,n.bind(o),i);return s?Wt(s):_t(),r}function cs(t,e){const i=e.split(".");return()=>{let o=t;for(let a=0;a<i.length&&o;a++)o=o[i[a]];return o}}function Vt(t,e){if(!re(t)||t.__v_skip||(e=e||new Set,e.has(t)))return t;if(e.add(t),ce(t))Vt(t.value,e);else if($(t))for(let i=0;i<t.length;i++)Vt(t[i],e);else if(ic(t)||Nt(t))t.forEach(i=>{Vt(i,e)});else if(ac(t))for(const i in t)Vt(t[i],e);return t}function vl(t){return W(t)?{setup:t,name:t.name}:t}const oo=t=>!!t.type.__asyncLoader,ra=t=>t.type.__isKeepAlive;function Sl(t,e){ls(t,"a",e)}function Ll(t,e){ls(t,"da",e)}function ls(t,e,i=pe){const o=t.__wdc||(t.__wdc=()=>{let a=i;for(;a;){if(a.isDeactivated)return;a=a.parent}return t()});if(ao(e,o,i),i){let a=i.parent;for(;a&&a.parent;)ra(a.parent.vnode)&&Cl(o,e,i,a),a=a.parent}}function Cl(t,e,i,o){const a=ao(e,t,o,!0);us(()=>{Bo(o[e],a)},i)}function ao(t,e,i=pe,o=!1){if(i){const a=i[t]||(i[t]=[]),n=e.__weh||(e.__weh=(...s)=>{if(i.isUnmounted)return;Lt(),Wt(i);const r=Fe(e,i,t,s);return _t(),Ct(),r});return o?a.unshift(n):a.push(n),n}else{const a=vt(Xo[t].replace(/ hook$/,""));I(`${a} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`)}}const ot=t=>(e,i=pe)=>(!yi||t==="sp")&&ao(t,(...o)=>e(...o),i),Al=ot("bm"),xl=ot("m"),Il=ot("bu"),Rl=ot("u"),zl=ot("bum"),us=ot("um"),Pl=ot("sp"),Ml=ot("rtg"),Tl=ot("rtc");function _l(t,e=pe){ao("ec",t,e)}function ms(t){nc(t)&&I("Do not use built-in directive ids as custom directive id: "+t)}function Rt(t,e,i,o){const a=t.dirs,n=e&&e.dirs;for(let s=0;s<a.length;s++){const r=a[s];n&&(r.oldValue=n[s].value);let c=r.dir[o];c&&(Lt(),Fe(c,i,8,[t.el,r,t,e]),Ct())}}const El=Symbol(),ca=t=>t?Ps(t)?Sa(t)||t.proxy:ca(t.parent):null,zt=ue(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>Ht(t.props),$attrs:t=>Ht(t.attrs),$slots:t=>Ht(t.slots),$refs:t=>Ht(t.refs),$parent:t=>ca(t.parent),$root:t=>ca(t.root),$emit:t=>t.emit,$options:t=>da(t),$forceUpdate:t=>t.f||(t.f=()=>Zi(t.update)),$nextTick:t=>t.n||(t.n=ea.bind(t.proxy)),$watch:t=>jl.bind(t)}),la=t=>t==="_"||t==="$",ua=(t,e)=>t!==oe&&!t.__isScriptSetup&&Z(t,e),ds={get({_:t},e){const{ctx:i,setupState:o,data:a,props:n,accessCache:s,type:r,appContext:c}=t;if(e==="__isVue")return!0;let l;if(e[0]!=="$"){const g=s[e];if(g!==void 0)switch(g){case 1:return o[e];case 2:return a[e];case 4:return i[e];case 3:return n[e]}else{if(ua(o,e))return s[e]=1,o[e];if(a!==oe&&Z(a,e))return s[e]=2,a[e];if((l=t.propsOptions[0])&&Z(l,e))return s[e]=3,n[e];if(i!==oe&&Z(i,e))return s[e]=4,i[e];ma&&(s[e]=0)}}const d=zt[e];let u,p;if(d)return e==="$attrs"&&(Re(t,"get",e),to()),d(t);if((u=r.__cssModules)&&(u=u[e]))return u;if(i!==oe&&Z(i,e))return s[e]=4,i[e];if(p=c.config.globalProperties,Z(p,e))return p[e];ze&&(!me(e)||e.indexOf("__v")!==0)&&(a!==oe&&la(e[0])&&Z(a,e)?I(`Property ${JSON.stringify(e)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`):t===ze&&I(`Property ${JSON.stringify(e)} was accessed during render but is not defined on instance.`))},set({_:t},e,i){const{data:o,setupState:a,ctx:n}=t;return ua(a,e)?(a[e]=i,!0):a.__isScriptSetup&&Z(a,e)?(I(`Cannot mutate <script setup> binding "${e}" from Options API.`),!1):o!==oe&&Z(o,e)?(o[e]=i,!0):Z(t.props,e)?(I(`Attempting to mutate prop "${e}". Props are readonly.`),!1):e[0]==="$"&&e.slice(1)in t?(I(`Attempting to mutate public property "${e}". Properties starting with $ are reserved and readonly.`),!1):(e in t.appContext.config.globalProperties?Object.defineProperty(n,e,{enumerable:!0,configurable:!0,value:i}):n[e]=i,!0)},has({_:{data:t,setupState:e,accessCache:i,ctx:o,appContext:a,propsOptions:n}},s){let r;return!!i[s]||t!==oe&&Z(t,s)||ua(e,s)||(r=n[0])&&Z(r,s)||Z(o,s)||Z(zt,s)||Z(a.config.globalProperties,s)},defineProperty(t,e,i){return i.get!=null?t._.accessCache[e]=0:Z(i,"value")&&this.set(t,e,i.value,null),Reflect.defineProperty(t,e,i)}};ds.ownKeys=t=>(I("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."),Reflect.ownKeys(t));function Fl(t){const e={};return Object.defineProperty(e,"_",{configurable:!0,enumerable:!1,get:()=>t}),Object.keys(zt).forEach(i=>{Object.defineProperty(e,i,{configurable:!0,enumerable:!1,get:()=>zt[i](t),set:Se})}),e}function Bl(t){const{ctx:e,propsOptions:[i]}=t;i&&Object.keys(i).forEach(o=>{Object.defineProperty(e,o,{enumerable:!0,configurable:!0,get:()=>t.props[o],set:Se})})}function Ol(t){const{ctx:e,setupState:i}=t;Object.keys(q(i)).forEach(o=>{if(!i.__isScriptSetup){if(la(o[0])){I(`setup() return property ${JSON.stringify(o)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);return}Object.defineProperty(e,o,{enumerable:!0,configurable:!0,get:()=>i[o],set:Se})}})}function Dl(){const t=Object.create(null);return(e,i)=>{t[i]?I(`${e} property "${i}" is already defined in ${t[i]}.`):t[i]=e}}let ma=!0;function Nl(t){const e=da(t),i=t.proxy,o=t.ctx;ma=!1,e.beforeCreate&&ps(e.beforeCreate,t,"bc");const{data:a,computed:n,methods:s,watch:r,provide:c,inject:l,created:d,beforeMount:u,mounted:p,beforeUpdate:g,updated:v,activated:y,deactivated:A,beforeDestroy:P,beforeUnmount:B,destroyed:H,unmounted:F,render:X,renderTracked:se,renderTriggered:D,errorCaptured:M,serverPrefetch:f,expose:w,inheritAttrs:b,components:z,directives:V,filters:le}=e,U=Dl();{const[_]=t.propsOptions;if(_)for(const Y in _)U("Props",Y)}if(l&&Ul(l,o,U,t.appContext.config.unwrapInjectedRef),s)for(const _ in s){const Y=s[_];W(Y)?(Object.defineProperty(o,_,{value:Y.bind(i),configurable:!0,enumerable:!0,writable:!0}),U("Methods",_)):I(`Method "${_}" has type "${typeof Y}" in the component definition. Did you reference the function correctly?`)}if(a){W(a)||I("The data option must be a function. Plain object usage is no longer supported.");const _=a.call(i,i);if(Do(_)&&I("data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."),!re(_))I("data() should return an object.");else{t.data=Ki(_);for(const Y in _)U("Data",Y),la(Y[0])||Object.defineProperty(o,Y,{configurable:!0,enumerable:!0,get:()=>_[Y],set:Se})}}if(ma=!0,n)for(const _ in n){const Y=n[_],K=W(Y)?Y.bind(i,i):W(Y.get)?Y.get.bind(i,i):Se;K===Se&&I(`Computed property "${_}" has no getter.`);const te=!W(Y)&&W(Y.set)?Y.set.bind(i):()=>{I(`Write operation failed: computed property "${_}" is readonly.`)},we=La({get:K,set:te});Object.defineProperty(o,_,{enumerable:!0,configurable:!0,get:()=>we.value,set:Xt=>we.value=Xt}),U("Computed",_)}if(r)for(const _ in r)hs(r[_],o,i,_);if(c){const _=W(c)?c.call(i):c;Reflect.ownKeys(_).forEach(Y=>{wl(Y,_[Y])})}d&&ps(d,t,"c");function Q(_,Y){$(Y)?Y.forEach(K=>_(K.bind(i))):Y&&_(Y.bind(i))}if(Q(Al,u),Q(xl,p),Q(Il,g),Q(Rl,v),Q(Sl,y),Q(Ll,A),Q(_l,M),Q(Tl,se),Q(Ml,D),Q(zl,B),Q(us,F),Q(Pl,f),$(w))if(w.length){const _=t.exposed||(t.exposed={});w.forEach(Y=>{Object.defineProperty(_,Y,{get:()=>i[Y],set:K=>i[Y]=K})})}else t.exposed||(t.exposed={});X&&t.render===Se&&(t.render=X),b!=null&&(t.inheritAttrs=b),z&&(t.components=z),V&&(t.directives=V)}function Ul(t,e,i=Se,o=!1){$(t)&&(t=pa(t));for(const a in t){const n=t[a];let s;re(n)?"default"in n?s=hi(n.from||a,n.default,!0):s=hi(n.from||a):s=hi(n),ce(s)?o?Object.defineProperty(e,a,{enumerable:!0,configurable:!0,get:()=>s.value,set:r=>s.value=r}):(I(`injected property "${a}" is a ref and will be auto-unwrapped and no longer needs \`.value\` in the next minor release. To opt-in to the new behavior now, set \`app.config.unwrapInjectedRef = true\` (this config is temporary and will not be needed in the future.)`),e[a]=s):e[a]=s,i("Inject",a)}}function ps(t,e,i){Fe($(t)?t.map(o=>o.bind(e.proxy)):t.bind(e.proxy),e,i)}function hs(t,e,i,o){const a=o.includes(".")?cs(i,o):()=>i[o];if(me(t)){const n=e[t];W(n)?gi(a,n):I(`Invalid watch handler specified by key "${t}"`,n)}else if(W(t))gi(a,t.bind(i));else if(re(t))if($(t))t.forEach(n=>hs(n,e,i,o));else{const n=W(t.handler)?t.handler.bind(i):e[t.handler];W(n)?gi(a,n,t):I(`Invalid watch handler specified by key "${t.handler}"`,n)}else I(`Invalid watch option: "${o}"`,t)}function da(t){const e=t.type,{mixins:i,extends:o}=e,{mixins:a,optionsCache:n,config:{optionMergeStrategies:s}}=t.appContext,r=n.get(e);let c;return r?c=r:!a.length&&!i&&!o?c=e:(c={},a.length&&a.forEach(l=>no(c,l,s,!0)),no(c,e,s)),re(e)&&n.set(e,c),c}function no(t,e,i,o=!1){const{mixins:a,extends:n}=e;n&&no(t,n,i,!0),a&&a.forEach(s=>no(t,s,i,!0));for(const s in e)if(o&&s==="expose")I('"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.');else{const r=Hl[s]||i&&i[s];t[s]=r?r(t[s],e[s]):e[s]}return t}const Hl={data:gs,props:Pt,emits:Pt,methods:Pt,computed:Pt,beforeCreate:ye,created:ye,beforeMount:ye,mounted:ye,beforeUpdate:ye,updated:ye,beforeDestroy:ye,beforeUnmount:ye,destroyed:ye,unmounted:ye,activated:ye,deactivated:ye,errorCaptured:ye,serverPrefetch:ye,components:Pt,directives:Pt,watch:Kl,provide:gs,inject:Gl};function gs(t,e){return e?t?function(){return ue(W(t)?t.call(this,this):t,W(e)?e.call(this,this):e)}:e:t}function Gl(t,e){return Pt(pa(t),pa(e))}function pa(t){if($(t)){const e={};for(let i=0;i<t.length;i++)e[t[i]]=t[i];return e}return t}function ye(t,e){return t?[...new Set([].concat(t,e))]:e}function Pt(t,e){return t?ue(ue(Object.create(null),t),e):e}function Kl(t,e){if(!t)return e;if(!e)return t;const i=ue(Object.create(null),t);for(const o in e)i[o]=ye(t[o],e[o]);return i}function Vl(t,e,i,o=!1){const a={},n={};_i(n,lo,1),t.propsDefaults=Object.create(null),fs(t,e,a,n);for(const s in t.propsOptions[0])s in a||(a[s]=void 0);js(e||{},a,t),i?t.props=o?a:Bc(a):t.type.props?t.props=a:t.props=n,t.attrs=n}function $l(t){for(;t;){if(t.type.__hmrId)return!0;t=t.parent}}function Wl(t,e,i,o){const{props:a,attrs:n,vnode:{patchFlag:s}}=t,r=q(a),[c]=t.propsOptions;let l=!1;if(!$l(t)&&(o||s>0)&&!(s&16)){if(s&8){const d=t.vnode.dynamicProps;for(let u=0;u<d.length;u++){let p=d[u];if(Qi(t.emitsOptions,p))continue;const g=e[p];if(c)if(Z(n,p))g!==n[p]&&(n[p]=g,l=!0);else{const v=Ut(p);a[v]=ha(c,r,v,g,t,!1)}else g!==n[p]&&(n[p]=g,l=!0)}}}else{fs(t,e,a,n)&&(l=!0);let d;for(const u in r)(!e||!Z(e,u)&&((d=mt(u))===u||!Z(e,d)))&&(c?i&&(i[u]!==void 0||i[d]!==void 0)&&(a[u]=ha(c,r,u,void 0,t,!0)):delete a[u]);if(n!==r)for(const u in n)(!e||!Z(e,u))&&(delete n[u],l=!0)}l&&tt(t,"set","$attrs"),js(e||{},a,t)}function fs(t,e,i,o){const[a,n]=t.propsOptions;let s=!1,r;if(e)for(let c in e){if(Pi(c))continue;const l=e[c];let d;a&&Z(a,d=Ut(c))?!n||!n.includes(d)?i[d]=l:(r||(r={}))[d]=l:Qi(t.emitsOptions,c)||(!(c in o)||l!==o[c])&&(o[c]=l,s=!0)}if(n){const c=q(i),l=r||oe;for(let d=0;d<n.length;d++){const u=n[d];i[u]=ha(a,c,u,l[u],t,!Z(l,u))}}return s}function ha(t,e,i,o,a,n){const s=t[i];if(s!=null){const r=Z(s,"default");if(r&&o===void 0){const c=s.default;if(s.type!==Function&&W(c)){const{propsDefaults:l}=a;i in l?o=l[i]:(Wt(a),o=l[i]=c.call(null,e),_t())}else o=c}s[0]&&(n&&!r?o=!1:s[1]&&(o===""||o===mt(i))&&(o=!0))}return o}function bs(t,e,i=!1){const o=e.propsCache,a=o.get(t);if(a)return a;const n=t.props,s={},r=[];let c=!1;if(!W(t)){const d=u=>{c=!0;const[p,g]=bs(u,e,!0);ue(s,p),g&&r.push(...g)};!i&&e.mixins.length&&e.mixins.forEach(d),t.extends&&d(t.extends),t.mixins&&t.mixins.forEach(d)}if(!n&&!c)return re(t)&&o.set(t,oi),oi;if($(n))for(let d=0;d<n.length;d++){me(n[d])||I("props must be strings when using array syntax.",n[d]);const u=Ut(n[d]);ks(u)&&(s[u]=oe)}else if(n){re(n)||I("invalid props options",n);for(const d in n){const u=Ut(d);if(ks(u)){const p=n[d],g=s[u]=$(p)||W(p)?{type:p}:Object.assign({},p);if(g){const v=ws(Boolean,g.type),y=ws(String,g.type);g[0]=v>-1,g[1]=y<0||v<y,(v>-1||Z(g,"default"))&&r.push(u)}}}}const l=[s,r];return re(t)&&o.set(t,l),l}function ks(t){return t[0]!=="$"?!0:(I(`Invalid prop name: "${t}" is a reserved property.`),!1)}function ga(t){const e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:t===null?"null":""}function ys(t,e){return ga(t)===ga(e)}function ws(t,e){return $(e)?e.findIndex(i=>ys(i,t)):W(e)&&ys(e,t)?0:-1}function js(t,e,i){const o=q(e),a=i.propsOptions[0];for(const n in a){let s=a[n];s!=null&&ql(n,o[n],s,!Z(t,n)&&!Z(t,mt(n)))}}function ql(t,e,i,o){const{type:a,required:n,validator:s}=i;if(n&&o){I('Missing required prop: "'+t+'"');return}if(!(e==null&&!i.required)){if(a!=null&&a!==!0){let r=!1;const c=$(a)?a:[a],l=[];for(let d=0;d<c.length&&!r;d++){const{valid:u,expectedType:p}=Yl(e,c[d]);l.push(p||""),r=u}if(!r){I(Xl(t,e,l));return}}s&&!s(e)&&I('Invalid prop: custom validator check failed for prop "'+t+'".')}}const Jl=ut("String,Number,Boolean,Function,Symbol,BigInt");function Yl(t,e){let i;const o=ga(e);if(Jl(o)){const a=typeof t;i=a===o.toLowerCase(),!i&&a==="object"&&(i=t instanceof e)}else o==="Object"?i=re(t):o==="Array"?i=$(t):o==="null"?i=t===null:i=t instanceof e;return{valid:i,expectedType:o}}function Xl(t,e,i){let o=`Invalid prop: type check failed for prop "${t}". Expected ${i.map(Ti).join(" | ")}`;const a=i[0],n=No(e),s=vs(e,a),r=vs(e,n);return i.length===1&&Ss(a)&&!Zl(a,n)&&(o+=` with value ${s}`),o+=`, got ${n} `,Ss(n)&&(o+=`with value ${r}.`),o}function vs(t,e){return e==="String"?`"${t}"`:e==="Number"?`${Number(t)}`:`${t}`}function Ss(t){return["string","number","boolean"].some(i=>t.toLowerCase()===i)}function Zl(...t){return t.some(e=>e.toLowerCase()==="boolean")}const Ls=t=>t[0]==="_"||t==="$stable",fa=t=>$(t)?t.map(Oe):[Oe(t)],Ql=(t,e,i)=>{if(e._n)return e;const o=dl((...a)=>(pe&&I(`Slot "${t}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`),fa(e(...a))),i);return o._c=!1,o},Cs=(t,e,i)=>{const o=t._ctx;for(const a in t){if(Ls(a))continue;const n=t[a];if(W(n))e[a]=Ql(a,n,o);else if(n!=null){I(`Non-function value encountered for slot "${a}". Prefer function slots for better performance.`);const s=fa(n);e[a]=()=>s}}},As=(t,e)=>{ra(t.vnode)||I("Non-function value encountered for default slot. Prefer function slots for better performance.");const i=fa(e);t.slots.default=()=>i},eu=(t,e)=>{if(t.vnode.shapeFlag&32){const i=e._;i?(t.slots=q(e),_i(e,"_",i)):Cs(e,t.slots={})}else t.slots={},e&&As(t,e);_i(t.slots,lo,1)},tu=(t,e,i)=>{const{vnode:o,slots:a}=t;let n=!0,s=oe;if(o.shapeFlag&32){const r=e._;r?xt?ue(a,e):i&&r===1?n=!1:(ue(a,e),!i&&r===1&&delete a._):(n=!e.$stable,Cs(e,a)),s=e}else e&&(As(t,e),s={default:1});if(n)for(const r in a)!Ls(r)&&!(r in s)&&delete a[r]};function xs(){return{app:null,config:{isNativeTag:mn,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let iu=0;function ou(t,e){return function(o,a=null){W(o)||(o=Object.assign({},o)),a!=null&&!re(a)&&(I("root props passed to app.mount() must be an object."),a=null);const n=xs(),s=new Set;let r=!1;const c=n.app={_uid:iu++,_component:o,_props:a,_container:null,_context:n,_instance:null,version:Fs,get config(){return n.config},set config(l){I("app.config cannot be replaced. Modify individual options instead.")},use(l,...d){return s.has(l)?I("Plugin has already been applied to target app."):l&&W(l.install)?(s.add(l),l.install(c,...d)):W(l)?(s.add(l),l(c,...d)):I('A plugin must either be a function or an object with an "install" function.'),c},mixin(l){return n.mixins.includes(l)?I("Mixin has already been applied to target app"+(l.name?`: ${l.name}`:"")):n.mixins.push(l),c},component(l,d){return ja(l,n.config),d?(n.components[l]&&I(`Component "${l}" has already been registered in target app.`),n.components[l]=d,c):n.components[l]},directive(l,d){return ms(l),d?(n.directives[l]&&I(`Directive "${l}" has already been registered in target app.`),n.directives[l]=d,c):n.directives[l]},mount(l,d,u){if(r)I("App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`");else{l.__vue_app__&&I("There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first.");const p=Tt(o,a);return p.appContext=n,n.reload=()=>{t(kt(p),l,u)},d&&e?e(p,l):t(p,l,u),r=!0,c._container=l,l.__vue_app__=c,c._instance=p.component,ol(c,Fs),Sa(p.component)||p.component.proxy}},unmount(){r?(t(null,c._container),c._instance=null,al(c),delete c._container.__vue_app__):I("Cannot unmount an app that is not mounted.")},provide(l,d){return l in n.provides&&I(`App already provides property with key "${String(l)}". It will be overwritten with the new value.`),n.provides[l]=d,c}};return c}}function ba(t,e,i,o,a=!1){if($(t)){t.forEach((p,g)=>ba(p,e&&($(e)?e[g]:e),i,o,a));return}if(oo(o)&&!a)return;const n=o.shapeFlag&4?Sa(o.component)||o.component.proxy:o.el,s=a?null:n,{i:r,r:c}=t;if(!r){I("Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.");return}const l=e&&e.r,d=r.refs===oe?r.refs={}:r.refs,u=r.setupState;if(l!=null&&l!==c&&(me(l)?(d[l]=null,Z(u,l)&&(u[l]=null)):ce(l)&&(l.value=null)),W(c))it(c,r,12,[s,d]);else{const p=me(c),g=ce(c);if(p||g){const v=()=>{if(t.f){const y=p?Z(u,c)?u[c]:d[c]:c.value;a?$(y)&&Bo(y,n):$(y)?y.includes(n)||y.push(n):p?(d[c]=[n],Z(u,c)&&(u[c]=d[c])):(c.value=[n],t.k&&(d[t.k]=c.value))}else p?(d[c]=s,Z(u,c)&&(u[c]=s)):g?(c.value=s,t.k&&(d[t.k]=s)):I("Invalid template ref type:",c,`(${typeof c})`)};s?(v.id=-1,Le(v,i)):v()}else I("Invalid template ref type:",c,`(${typeof c})`)}}let fi,bt;function at(t,e){t.appContext.config.performance&&so()&&bt.mark(`vue-${e}-${t.uid}`),cl(t,e,so()?bt.now():Date.now())}function nt(t,e){if(t.appContext.config.performance&&so()){const i=`vue-${e}-${t.uid}`,o=i+":end";bt.mark(o),bt.measure(`<${mo(t,t.type)}> ${e}`,i,o),bt.clearMarks(i),bt.clearMarks(o)}ll(t,e,so()?bt.now():Date.now())}function so(){return fi!==void 0||(typeof window<"u"&&window.performance?(fi=!0,bt=window.performance):fi=!1),fi}function au(){const t=[];if(t.length){const e=t.length>1;console.warn(`Feature flag${e?"s":""} ${t.join(", ")} ${e?"are":"is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`)}}const Le=yl;function nu(t){return su(t)}function su(t,e){au();const i=hn();i.__VUE__=!0,Qn(i.__VUE_DEVTOOLS_GLOBAL_HOOK__,i);const{insert:o,remove:a,patchProp:n,createElement:s,createText:r,createComment:c,setText:l,setElementText:d,parentNode:u,nextSibling:p,setScopeId:g=Se,insertStaticContent:v}=t,y=(m,h,k,S=null,j=null,x=null,T=!1,C=null,R=xt?!1:!!h.dynamicChildren)=>{if(m===h)return;m&&!ki(m,h)&&(S=Lo(m),wt(m,j,x,!0),m=null),h.patchFlag===-2&&(R=!1,h.dynamicChildren=null);const{type:L,ref:O,shapeFlag:E}=h;switch(L){case bi:A(m,h,k,S);break;case Be:P(m,h,k,S);break;case co:m==null?B(h,k,S,T):H(m,h,k,T);break;case Ye:V(m,h,k,S,j,x,T,C,R);break;default:E&1?se(m,h,k,S,j,x,T,C,R):E&6?le(m,h,k,S,j,x,T,C,R):E&64||E&128?L.process(m,h,k,S,j,x,T,C,R,Zt):I("Invalid VNode type:",L,`(${typeof L})`)}O!=null&&j&&ba(O,m&&m.ref,x,h||m,!h)},A=(m,h,k,S)=>{if(m==null)o(h.el=r(h.children),k,S);else{const j=h.el=m.el;h.children!==m.children&&l(j,h.children)}},P=(m,h,k,S)=>{m==null?o(h.el=c(h.children||""),k,S):h.el=m.el},B=(m,h,k,S)=>{[m.el,m.anchor]=v(m.children,h,k,S,m.el,m.anchor)},H=(m,h,k,S)=>{if(h.children!==m.children){const j=p(m.anchor);X(m),[h.el,h.anchor]=v(h.children,k,j,S)}else h.el=m.el,h.anchor=m.anchor},F=({el:m,anchor:h},k,S)=>{let j;for(;m&&m!==h;)j=p(m),o(m,k,S),m=j;o(h,k,S)},X=({el:m,anchor:h})=>{let k;for(;m&&m!==h;)k=p(m),a(m),m=k;a(h)},se=(m,h,k,S,j,x,T,C,R)=>{T=T||h.type==="svg",m==null?D(h,k,S,j,x,T,C,R):w(m,h,j,x,T,C,R)},D=(m,h,k,S,j,x,T,C)=>{let R,L;const{type:O,props:E,shapeFlag:N,transition:J,dirs:ee}=m;if(R=m.el=s(m.type,x,E&&E.is,E),N&8?d(R,m.children):N&16&&f(m.children,R,null,S,j,x&&O!=="foreignObject",T,C),ee&&Rt(m,null,S,"created"),E){for(const ie in E)ie!=="value"&&!Pi(ie)&&n(R,ie,null,E[ie],x,m.children,S,j,rt);"value"in E&&n(R,"value",null,E.value),(L=E.onVnodeBeforeMount)&&Xe(L,S,m)}M(R,m,m.scopeId,T,S),Object.defineProperty(R,"__vnode",{value:m,enumerable:!1}),Object.defineProperty(R,"__vueParentComponent",{value:S,enumerable:!1}),ee&&Rt(m,null,S,"beforeMount");const ae=(!j||j&&!j.pendingBranch)&&J&&!J.persisted;ae&&J.beforeEnter(R),o(R,h,k),((L=E&&E.onVnodeMounted)||ae||ee)&&Le(()=>{L&&Xe(L,S,m),ae&&J.enter(R),ee&&Rt(m,null,S,"mounted")},j)},M=(m,h,k,S,j)=>{if(k&&g(m,k),S)for(let x=0;x<S.length;x++)g(m,S[x]);if(j){let x=j.subTree;if(x.patchFlag>0&&x.patchFlag&2048&&(x=as(x.children)||x),h===x){const T=j.vnode;M(m,T,T.scopeId,T.slotScopeIds,j.parent)}}},f=(m,h,k,S,j,x,T,C,R=0)=>{for(let L=R;L<m.length;L++){const O=m[L]=C?yt(m[L]):Oe(m[L]);y(null,O,h,k,S,j,x,T,C)}},w=(m,h,k,S,j,x,T)=>{const C=h.el=m.el;let{patchFlag:R,dynamicChildren:L,dirs:O}=h;R|=m.patchFlag&16;const E=m.props||oe,N=h.props||oe;let J;k&&Mt(k,!1),(J=N.onVnodeBeforeUpdate)&&Xe(J,k,h,m),O&&Rt(h,m,k,"beforeUpdate"),k&&Mt(k,!0),xt&&(R=0,T=!1,L=null);const ee=j&&h.type!=="foreignObject";if(L?(b(m.dynamicChildren,L,C,k,S,ee,x),k&&k.type.__hmrId&&ro(m,h)):T||K(m,h,C,null,k,S,ee,x,!1),R>0){if(R&16)z(C,h,E,N,k,S,j);else if(R&2&&E.class!==N.class&&n(C,"class",null,N.class,j),R&4&&n(C,"style",E.style,N.style,j),R&8){const ae=h.dynamicProps;for(let ie=0;ie<ae.length;ie++){const de=ae[ie],He=E[de],Qt=N[de];(Qt!==He||de==="value")&&n(C,de,He,Qt,j,m.children,k,S,rt)}}R&1&&m.children!==h.children&&d(C,h.children)}else!T&&L==null&&z(C,h,E,N,k,S,j);((J=N.onVnodeUpdated)||O)&&Le(()=>{J&&Xe(J,k,h,m),O&&Rt(h,m,k,"updated")},S)},b=(m,h,k,S,j,x,T)=>{for(let C=0;C<h.length;C++){const R=m[C],L=h[C],O=R.el&&(R.type===Ye||!ki(R,L)||R.shapeFlag&70)?u(R.el):k;y(R,L,O,null,S,j,x,T,!0)}},z=(m,h,k,S,j,x,T)=>{if(k!==S){if(k!==oe)for(const C in k)!Pi(C)&&!(C in S)&&n(m,C,k[C],null,T,h.children,j,x,rt);for(const C in S){if(Pi(C))continue;const R=S[C],L=k[C];R!==L&&C!=="value"&&n(m,C,L,R,T,h.children,j,x,rt)}"value"in S&&n(m,"value",k.value,S.value)}},V=(m,h,k,S,j,x,T,C,R)=>{const L=h.el=m?m.el:r(""),O=h.anchor=m?m.anchor:r("");let{patchFlag:E,dynamicChildren:N,slotScopeIds:J}=h;(xt||E&2048)&&(E=0,R=!1,N=null),J&&(C=C?C.concat(J):J),m==null?(o(L,k,S),o(O,k,S),f(h.children,k,O,j,x,T,C,R)):E>0&&E&64&&N&&m.dynamicChildren?(b(m.dynamicChildren,N,k,j,x,T,C),j&&j.type.__hmrId?ro(m,h):(h.key!=null||j&&h===j.subTree)&&ro(m,h,!0)):K(m,h,k,O,j,x,T,C,R)},le=(m,h,k,S,j,x,T,C,R)=>{h.slotScopeIds=C,m==null?h.shapeFlag&512?j.ctx.activate(h,k,S,T,R):U(h,k,S,j,x,T,R):Q(m,h,R)},U=(m,h,k,S,j,x,T)=>{const C=m.component=bu(m,S,j);if(C.type.__hmrId&&Qc(C),Ji(m),at(C,"mount"),ra(m)&&(C.ctx.renderer=Zt),at(C,"init"),wu(C),nt(C,"init"),C.asyncDep){if(j&&j.registerDep(C,_),!m.el){const R=C.subTree=Tt(Be);P(null,R,h,k)}return}_(C,m,h,k,j,x,T),Yi(),nt(C,"mount")},Q=(m,h,k)=>{const S=h.component=m.component;if(fl(m,h,k))if(S.asyncDep&&!S.asyncResolved){Ji(h),Y(S,h,k),Yi();return}else S.next=h,Xc(S.update),S.update();else h.el=m.el,S.vnode=h},_=(m,h,k,S,j,x,T)=>{const C=()=>{if(m.isMounted){let{next:O,bu:E,u:N,parent:J,vnode:ee}=m,ae=O,ie;Ji(O||m.vnode),Mt(m,!1),O?(O.el=ee.el,Y(m,O,T)):O=ee,E&&si(E),(ie=O.props&&O.props.onVnodeBeforeUpdate)&&Xe(ie,J,O,ee),Mt(m,!0),at(m,"render");const de=sa(m);nt(m,"render");const He=m.subTree;m.subTree=de,at(m,"patch"),y(He,de,u(He.el),Lo(He),m,j,x),nt(m,"patch"),O.el=de.el,ae===null&&bl(m,de.el),N&&Le(N,j),(ie=O.props&&O.props.onVnodeUpdated)&&Le(()=>Xe(ie,J,O,ee),j),es(m),Yi()}else{let O;const{el:E,props:N}=h,{bm:J,m:ee,parent:ae}=m,ie=oo(h);if(Mt(m,!1),J&&si(J),!ie&&(O=N&&N.onVnodeBeforeMount)&&Xe(O,ae,h),Mt(m,!0),E&&Ka){const de=()=>{at(m,"render"),m.subTree=sa(m),nt(m,"render"),at(m,"hydrate"),Ka(E,m.subTree,m,j,null),nt(m,"hydrate")};ie?h.type.__asyncLoader().then(()=>!m.isUnmounted&&de()):de()}else{at(m,"render");const de=m.subTree=sa(m);nt(m,"render"),at(m,"patch"),y(null,de,k,S,m,j,x),nt(m,"patch"),h.el=de.el}if(ee&&Le(ee,j),!ie&&(O=N&&N.onVnodeMounted)){const de=h;Le(()=>Xe(O,ae,de),j)}(h.shapeFlag&256||ae&&oo(ae.vnode)&&ae.vnode.shapeFlag&256)&&m.a&&Le(m.a,j),m.isMounted=!0,nl(m),h=k=S=null}},R=m.effect=new $o(C,()=>Zi(L),m.scope),L=m.update=()=>R.run();L.id=m.uid,Mt(m,!0),R.onTrack=m.rtc?O=>si(m.rtc,O):void 0,R.onTrigger=m.rtg?O=>si(m.rtg,O):void 0,L.ownerInstance=m,L()},Y=(m,h,k)=>{h.component=m;const S=m.vnode.props;m.vnode=h,m.next=null,Wl(m,h.props,S,k),tu(m,h.children,k),Lt(),qn(),Ct()},K=(m,h,k,S,j,x,T,C,R=!1)=>{const L=m&&m.children,O=m?m.shapeFlag:0,E=h.children,{patchFlag:N,shapeFlag:J}=h;if(N>0){if(N&128){we(L,E,k,S,j,x,T,C,R);return}else if(N&256){te(L,E,k,S,j,x,T,C,R);return}}J&8?(O&16&&rt(L,j,x),E!==L&&d(k,E)):O&16?J&16?we(L,E,k,S,j,x,T,C,R):rt(L,j,x,!0):(O&8&&d(k,""),J&16&&f(E,k,S,j,x,T,C,R))},te=(m,h,k,S,j,x,T,C,R)=>{m=m||oi,h=h||oi;const L=m.length,O=h.length,E=Math.min(L,O);let N;for(N=0;N<E;N++){const J=h[N]=R?yt(h[N]):Oe(h[N]);y(m[N],J,k,null,j,x,T,C,R)}L>O?rt(m,j,x,!0,!1,E):f(h,k,S,j,x,T,C,R,E)},we=(m,h,k,S,j,x,T,C,R)=>{let L=0;const O=h.length;let E=m.length-1,N=O-1;for(;L<=E&&L<=N;){const J=m[L],ee=h[L]=R?yt(h[L]):Oe(h[L]);if(ki(J,ee))y(J,ee,k,null,j,x,T,C,R);else break;L++}for(;L<=E&&L<=N;){const J=m[E],ee=h[N]=R?yt(h[N]):Oe(h[N]);if(ki(J,ee))y(J,ee,k,null,j,x,T,C,R);else break;E--,N--}if(L>E){if(L<=N){const J=N+1,ee=J<O?h[J].el:S;for(;L<=N;)y(null,h[L]=R?yt(h[L]):Oe(h[L]),k,ee,j,x,T,C,R),L++}}else if(L>N)for(;L<=E;)wt(m[L],j,x,!0),L++;else{const J=L,ee=L,ae=new Map;for(L=ee;L<=N;L++){const je=h[L]=R?yt(h[L]):Oe(h[L]);je.key!=null&&(ae.has(je.key)&&I("Duplicate keys found during update:",JSON.stringify(je.key),"Make sure keys are unique."),ae.set(je.key,L))}let ie,de=0;const He=N-ee+1;let Qt=!1,hr=0;const Si=new Array(He);for(L=0;L<He;L++)Si[L]=0;for(L=J;L<=E;L++){const je=m[L];if(de>=He){wt(je,j,x,!0);continue}let Ze;if(je.key!=null)Ze=ae.get(je.key);else for(ie=ee;ie<=N;ie++)if(Si[ie-ee]===0&&ki(je,h[ie])){Ze=ie;break}Ze===void 0?wt(je,j,x,!0):(Si[Ze-ee]=L+1,Ze>=hr?hr=Ze:Qt=!0,y(je,h[Ze],k,null,j,x,T,C,R),de++)}const gr=Qt?ru(Si):oi;for(ie=gr.length-1,L=He-1;L>=0;L--){const je=ee+L,Ze=h[je],fr=je+1<O?h[je+1].el:S;Si[L]===0?y(null,Ze,k,fr,j,x,T,C,R):Qt&&(ie<0||L!==gr[ie]?Xt(Ze,k,fr,2):ie--)}}},Xt=(m,h,k,S,j=null)=>{const{el:x,type:T,transition:C,children:R,shapeFlag:L}=m;if(L&6){Xt(m.component.subTree,h,k,S);return}if(L&128){m.suspense.move(h,k,S);return}if(L&64){T.move(m,h,k,Zt);return}if(T===Ye){o(x,h,k);for(let E=0;E<R.length;E++)Xt(R[E],h,k,S);o(m.anchor,h,k);return}if(T===co){F(m,h,k);return}if(S!==2&&L&1&&C)if(S===0)C.beforeEnter(x),o(x,h,k),Le(()=>C.enter(x),j);else{const{leave:E,delayLeave:N,afterLeave:J}=C,ee=()=>o(x,h,k),ae=()=>{E(x,()=>{ee(),J&&J()})};N?N(x,ee,ae):ae()}else o(x,h,k)},wt=(m,h,k,S=!1,j=!1)=>{const{type:x,props:T,ref:C,children:R,dynamicChildren:L,shapeFlag:O,patchFlag:E,dirs:N}=m;if(C!=null&&ba(C,null,k,m,!0),O&256){h.ctx.deactivate(m);return}const J=O&1&&N,ee=!oo(m);let ae;if(ee&&(ae=T&&T.onVnodeBeforeUnmount)&&Xe(ae,h,m),O&6)Hm(m.component,k,S);else{if(O&128){m.suspense.unmount(k,S);return}J&&Rt(m,null,h,"beforeUnmount"),O&64?m.type.remove(m,h,k,j,Zt,S):L&&(x!==Ye||E>0&&E&64)?rt(L,h,k,!1,!0):(x===Ye&&E&384||!j&&O&16)&&rt(R,h,k),S&&Ha(m)}(ee&&(ae=T&&T.onVnodeUnmounted)||J)&&Le(()=>{ae&&Xe(ae,h,m),J&&Rt(m,null,h,"unmounted")},k)},Ha=m=>{const{type:h,el:k,anchor:S,transition:j}=m;if(h===Ye){m.patchFlag>0&&m.patchFlag&2048&&j&&!j.persisted?m.children.forEach(T=>{T.type===Be?a(T.el):Ha(T)}):Um(k,S);return}if(h===co){X(m);return}const x=()=>{a(k),j&&!j.persisted&&j.afterLeave&&j.afterLeave()};if(m.shapeFlag&1&&j&&!j.persisted){const{leave:T,delayLeave:C}=j,R=()=>T(k,x);C?C(m.el,x,R):R()}else x()},Um=(m,h)=>{let k;for(;m!==h;)k=p(m),a(m),m=k;a(h)},Hm=(m,h,k)=>{m.type.__hmrId&&el(m);const{bum:S,scope:j,update:x,subTree:T,um:C}=m;S&&si(S),j.stop(),x&&(x.active=!1,wt(T,m,h,k)),C&&Le(C,h),Le(()=>{m.isUnmounted=!0},h),h&&h.pendingBranch&&!h.isUnmounted&&m.asyncDep&&!m.asyncResolved&&m.suspenseId===h.pendingId&&(h.deps--,h.deps===0&&h.resolve()),rl(m)},rt=(m,h,k,S=!1,j=!1,x=0)=>{for(let T=x;T<m.length;T++)wt(m[T],h,k,S,j)},Lo=m=>m.shapeFlag&6?Lo(m.component.subTree):m.shapeFlag&128?m.suspense.next():p(m.anchor||m.el),pr=(m,h,k)=>{m==null?h._vnode&&wt(h._vnode,null,null,!0):y(h._vnode||null,m,h,null,null,null,k),qn(),Jn(),h._vnode=m},Zt={p:y,um:wt,m:Xt,r:Ha,mt:U,mc:f,pc:K,pbc:b,n:Lo,o:t};let Ga,Ka;return e&&([Ga,Ka]=e(Zt)),{render:pr,hydrate:Ga,createApp:ou(pr,Ga)}}function Mt({effect:t,update:e},i){t.allowRecurse=e.allowRecurse=i}function ro(t,e,i=!1){const o=t.children,a=e.children;if($(o)&&$(a))for(let n=0;n<o.length;n++){const s=o[n];let r=a[n];r.shapeFlag&1&&!r.dynamicChildren&&((r.patchFlag<=0||r.patchFlag===32)&&(r=a[n]=yt(a[n]),r.el=s.el),i||ro(s,r)),r.type===bi&&(r.el=s.el),r.type===Be&&!r.el&&(r.el=s.el)}}function ru(t){const e=t.slice(),i=[0];let o,a,n,s,r;const c=t.length;for(o=0;o<c;o++){const l=t[o];if(l!==0){if(a=i[i.length-1],t[a]<l){e[o]=a,i.push(o);continue}for(n=0,s=i.length-1;n<s;)r=n+s>>1,t[i[r]]<l?n=r+1:s=r;l<t[i[n]]&&(n>0&&(e[o]=i[n-1]),i[n]=o)}}for(n=i.length,s=i[n-1];n-- >0;)i[n]=s,s=e[s];return i}const cu=t=>t.__isTeleport,Ye=Symbol("Fragment"),bi=Symbol("Text"),Be=Symbol("Comment"),co=Symbol("Static");let $t=null,ka=1;function Is(t){ka+=t}function ya(t){return t?t.__v_isVNode===!0:!1}function ki(t,e){return e.shapeFlag&6&&Kt.has(e.type)?(t.shapeFlag&=-257,e.shapeFlag&=-513,!1):t.type===e.type&&t.key===e.key}const lu=(...t)=>mu(...t),lo="__vInternal",Rs=({key:t})=>t??null,uo=({ref:t,ref_key:e,ref_for:i})=>t!=null?me(t)||ce(t)||W(t)?{i:ze,r:t,k:e,f:!!i}:t:null;function uu(t,e=null,i=null,o=0,a=null,n=t===Ye?0:1,s=!1,r=!1){const c={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Rs(e),ref:e&&uo(e),scopeId:os,slotScopeIds:null,children:i,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:n,patchFlag:o,dynamicProps:a,dynamicChildren:null,appContext:null,ctx:ze};return r?(wa(c,i),n&128&&t.normalize(c)):i&&(c.shapeFlag|=me(i)?8:16),c.key!==c.key&&I("VNode created with invalid key (NaN). VNode type:",c.type),ka>0&&!s&&$t&&(c.patchFlag>0||n&6)&&c.patchFlag!==32&&$t.push(c),c}const Tt=lu;function mu(t,e=null,i=null,o=0,a=null,n=!1){if((!t||t===El)&&(t||I(`Invalid vnode type when creating vnode: ${t}.`),t=Be),ya(t)){const r=kt(t,e,!0);return i&&wa(r,i),ka>0&&!n&&$t&&(r.shapeFlag&6?$t[$t.indexOf(t)]=r:$t.push(r)),r.patchFlag|=-2,r}if(Es(t)&&(t=t.__vccOpts),e){e=du(e);let{class:r,style:c}=e;r&&!me(r)&&(e.class=Fo(r)),re(c)&&(Wi(c)&&!$(c)&&(c=ue({},c)),e.style=Eo(c))}const s=me(t)?1:kl(t)?128:cu(t)?64:re(t)?4:W(t)?2:0;return s&4&&Wi(t)&&(t=q(t),I("Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",`
Component that was made reactive: `,t)),uu(t,e,i,o,a,s,n,!0)}function du(t){return t?Wi(t)||lo in t?ue({},t):t:null}function kt(t,e,i=!1){const{props:o,ref:a,patchFlag:n,children:s}=t,r=e?hu(o||{},e):o;return{__v_isVNode:!0,__v_skip:!0,type:t.type,props:r,key:r&&Rs(r),ref:e&&e.ref?i&&a?$(a)?a.concat(uo(e)):[a,uo(e)]:uo(e):a,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:n===-1&&$(s)?s.map(zs):s,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ye?n===-1?16:n|16:n,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:t.transition,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&kt(t.ssContent),ssFallback:t.ssFallback&&kt(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx}}function zs(t){const e=kt(t);return $(t.children)&&(e.children=t.children.map(zs)),e}function pu(t=" ",e=0){return Tt(bi,null,t,e)}function Oe(t){return t==null||typeof t=="boolean"?Tt(Be):$(t)?Tt(Ye,null,t.slice()):typeof t=="object"?yt(t):Tt(bi,null,String(t))}function yt(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:kt(t)}function wa(t,e){let i=0;const{shapeFlag:o}=t;if(e==null)e=null;else if($(e))i=16;else if(typeof e=="object")if(o&65){const a=e.default;a&&(a._c&&(a._d=!1),wa(t,a()),a._c&&(a._d=!0));return}else{i=32;const a=e._;!a&&!(lo in e)?e._ctx=ze:a===3&&ze&&(ze.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else W(e)?(e={default:e,_ctx:ze},i=32):(e=String(e),o&64?(i=16,e=[pu(e)]):i=8);t.children=e,t.shapeFlag|=i}function hu(...t){const e={};for(let i=0;i<t.length;i++){const o=t[i];for(const a in o)if(a==="class")e.class!==o.class&&(e.class=Fo([e.class,o.class]));else if(a==="style")e.style=Eo([e.style,o.style]);else if(ai(a)){const n=e[a],s=o[a];s&&n!==s&&!($(n)&&n.includes(s))&&(e[a]=n?[].concat(n,s):s)}else a!==""&&(e[a]=o[a])}return e}function Xe(t,e,i,o=null){Fe(t,e,7,[i,o])}const gu=xs();let fu=0;function bu(t,e,i){const o=t.type,a=(e?e.appContext:t.appContext)||gu,n={uid:fu++,vnode:t,type:o,parent:e,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,scope:new gn(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(a.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:bs(o,a),emitsOptions:is(o,a),emit:null,emitted:null,propsDefaults:oe,inheritAttrs:o.inheritAttrs,ctx:oe,data:oe,props:oe,attrs:oe,slots:oe,refs:oe,setupState:oe,setupContext:null,suspense:i,suspenseId:i?i.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return n.ctx=Fl(n),n.root=e?e.root:n,n.emit=ml.bind(null,n),t.ce&&t.ce(n),n}let pe=null;const ku=()=>pe||ze,Wt=t=>{pe=t,t.scope.on()},_t=()=>{pe&&pe.scope.off(),pe=null},yu=ut("slot,component");function ja(t,e){const i=e.isNativeTag||mn;(yu(t)||i(t))&&I("Do not use built-in or reserved HTML elements as component id: "+t)}function Ps(t){return t.vnode.shapeFlag&4}let yi=!1;function wu(t,e=!1){yi=e;const{props:i,children:o}=t.vnode,a=Ps(t);Vl(t,i,a,e),eu(t,o);const n=a?ju(t,e):void 0;return yi=!1,n}function ju(t,e){var i;const o=t.type;{if(o.name&&ja(o.name,t.appContext.config),o.components){const n=Object.keys(o.components);for(let s=0;s<n.length;s++)ja(n[s],t.appContext.config)}if(o.directives){const n=Object.keys(o.directives);for(let s=0;s<n.length;s++)ms(n[s])}o.compilerOptions&&vu()&&I('"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.')}t.accessCache=Object.create(null),t.proxy=Ee(new Proxy(t.ctx,ds)),Bl(t);const{setup:a}=o;if(a){const n=t.setupContext=a.length>1?Lu(t):null;Wt(t),Lt();const s=it(a,t,0,[Ht(t.props),n]);if(Ct(),_t(),Do(s)){if(s.then(_t,_t),e)return s.then(r=>{Ms(t,r,e)}).catch(r=>{Xi(r,t,0)});if(t.asyncDep=s,!t.suspense){const r=(i=o.name)!==null&&i!==void 0?i:"Anonymous";I(`Component <${r}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`)}}else Ms(t,s,e)}else Ts(t,e)}function Ms(t,e,i){W(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:re(e)?(ya(e)&&I("setup() should not return VNodes directly - return a render function instead."),t.devtoolsRawSetupState=e,t.setupState=Un(e),Ol(t)):e!==void 0&&I(`setup() should return an object. Received: ${e===null?"null":typeof e}`),Ts(t,i)}let va;const vu=()=>!va;function Ts(t,e,i){const o=t.type;if(!t.render){if(!e&&va&&!o.render){const a=o.template||da(t).template;if(a){at(t,"compile");const{isCustomElement:n,compilerOptions:s}=t.appContext.config,{delimiters:r,compilerOptions:c}=o,l=ue(ue({isCustomElement:n,delimiters:r},s),c);o.render=va(a,l),nt(t,"compile")}}t.render=o.render||Se}Wt(t),Lt(),Nl(t),Ct(),_t(),!o.render&&t.render===Se&&!e&&(o.template?I('Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'):I("Component is missing template or render function."))}function Su(t){return new Proxy(t.attrs,{get(e,i){return to(),Re(t,"get","$attrs"),e[i]},set(){return I("setupContext.attrs is readonly."),!1},deleteProperty(){return I("setupContext.attrs is readonly."),!1}})}function Lu(t){const e=o=>{t.exposed&&I("expose() should be called only once per setup()."),t.exposed=o||{}};let i;return Object.freeze({get attrs(){return i||(i=Su(t))},get slots(){return Ht(t.slots)},get emit(){return(o,...a)=>t.emit(o,...a)},expose:e})}function Sa(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(Un(Ee(t.exposed)),{get(e,i){if(i in e)return e[i];if(i in zt)return zt[i](t)},has(e,i){return i in e||i in zt}}))}const Cu=/(?:^|[-_])(\w)/g,Au=t=>t.replace(Cu,e=>e.toUpperCase()).replace(/[-_]/g,"");function _s(t,e=!0){return W(t)?t.displayName||t.name:t.name||e&&t.__name}function mo(t,e,i=!1){let o=_s(e);if(!o&&e.__file){const a=e.__file.match(/([^/\\]+)\.\w+$/);a&&(o=a[1])}if(!o&&t&&t.parent){const a=n=>{for(const s in n)if(n[s]===e)return s};o=a(t.components||t.parent.type.components)||a(t.appContext.components)}return o?Au(o):i?"App":"Anonymous"}function Es(t){return W(t)&&"__vccOpts"in t}const La=(t,e)=>Gc(t,e,yi),xu=Symbol("ssrContext"),Iu=()=>{{const t=hi(xu);return t||I("Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."),t}};function Ca(t){return!!(t&&t.__v_isShallow)}function Ru(){if(typeof window>"u")return;const t={style:"color:#3ba776"},e={style:"color:#0b1bc9"},i={style:"color:#b62e24"},o={style:"color:#9d288c"},a={header(u){return re(u)?u.__isVue?["div",t,"VueInstance"]:ce(u)?["div",{},["span",t,d(u)],"<",r(u.value),">"]:$e(u)?["div",{},["span",t,Ca(u)?"ShallowReactive":"Reactive"],"<",r(u),`>${gt(u)?" (readonly)":""}`]:gt(u)?["div",{},["span",t,Ca(u)?"ShallowReadonly":"Readonly"],"<",r(u),">"]:null:null},hasBody(u){return u&&u.__isVue},body(u){if(u&&u.__isVue)return["div",{},...n(u.$)]}};function n(u){const p=[];u.type.props&&u.props&&p.push(s("props",q(u.props))),u.setupState!==oe&&p.push(s("setup",u.setupState)),u.data!==oe&&p.push(s("data",q(u.data)));const g=c(u,"computed");g&&p.push(s("computed",g));const v=c(u,"inject");return v&&p.push(s("injected",v)),p.push(["div",{},["span",{style:o.style+";opacity:0.66"},"$ (internal): "],["object",{object:u}]]),p}function s(u,p){return p=ue({},p),Object.keys(p).length?["div",{style:"line-height:1.25em;margin-bottom:0.6em"},["div",{style:"color:#476582"},u],["div",{style:"padding-left:1.25em"},...Object.keys(p).map(g=>["div",{},["span",o,g+": "],r(p[g],!1)])]]:["span",{}]}function r(u,p=!0){return typeof u=="number"?["span",e,u]:typeof u=="string"?["span",i,JSON.stringify(u)]:typeof u=="boolean"?["span",o,u]:re(u)?["object",{object:p?q(u):u}]:["span",i,String(u)]}function c(u,p){const g=u.type;if(W(g))return;const v={};for(const y in u.ctx)l(g,y,p)&&(v[y]=u.ctx[y]);return v}function l(u,p,g){const v=u[g];if($(v)&&v.includes(p)||re(v)&&p in v||u.extends&&l(u.extends,p,g)||u.mixins&&u.mixins.some(y=>l(y,p,g)))return!0}function d(u){return Ca(u)?"ShallowRef":u.effect?"ComputedRef":"Ref"}window.devtoolsFormatters?window.devtoolsFormatters.push(a):window.devtoolsFormatters=[a]}const Fs="3.2.45",zu="http://www.w3.org/2000/svg",Et=typeof document<"u"?document:null,Bs=Et&&Et.createElement("template"),Pu={insert:(t,e,i)=>{e.insertBefore(t,i||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,i,o)=>{const a=e?Et.createElementNS(zu,t):Et.createElement(t,i?{is:i}:void 0);return t==="select"&&o&&o.multiple!=null&&a.setAttribute("multiple",o.multiple),a},createText:t=>Et.createTextNode(t),createComment:t=>Et.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Et.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,i,o,a,n){const s=i?i.previousSibling:e.lastChild;if(a&&(a===n||a.nextSibling))for(;e.insertBefore(a.cloneNode(!0),i),!(a===n||!(a=a.nextSibling)););else{Bs.innerHTML=o?`<svg>${t}</svg>`:t;const r=Bs.content;if(o){const c=r.firstChild;for(;c.firstChild;)r.appendChild(c.firstChild);r.removeChild(c)}e.insertBefore(r,i)}return[s?s.nextSibling:e.firstChild,i?i.previousSibling:e.lastChild]}};function Mu(t,e,i){const o=t._vtc;o&&(e=(e?[e,...o]:[...o]).join(" ")),e==null?t.removeAttribute("class"):i?t.setAttribute("class",e):t.className=e}function Tu(t,e,i){const o=t.style,a=me(i);if(i&&!a){for(const n in i)Aa(o,n,i[n]);if(e&&!me(e))for(const n in e)i[n]==null&&Aa(o,n,"")}else{const n=o.display;a?e!==i&&(o.cssText=i):e&&t.removeAttribute("style"),"_vod"in t&&(o.display=n)}}const _u=/[^\\];\s*$/,Os=/\s*!important$/;function Aa(t,e,i){if($(i))i.forEach(o=>Aa(t,e,o));else if(i==null&&(i=""),_u.test(i)&&I(`Unexpected semicolon at the end of '${e}' style value: '${i}'`),e.startsWith("--"))t.setProperty(e,i);else{const o=Eu(t,e);Os.test(i)?t.setProperty(mt(o),i.replace(Os,""),"important"):t[o]=i}}const Ds=["Webkit","Moz","ms"],xa={};function Eu(t,e){const i=xa[e];if(i)return i;let o=Ut(e);if(o!=="filter"&&o in t)return xa[e]=o;o=Ti(o);for(let a=0;a<Ds.length;a++){const n=Ds[a]+o;if(n in t)return xa[e]=n}return e}const Ns="http://www.w3.org/1999/xlink";function Fu(t,e,i,o,a){if(o&&e.startsWith("xlink:"))i==null?t.removeAttributeNS(Ns,e.slice(6,e.length)):t.setAttributeNS(Ns,e,i);else{const n=Qr(e);i==null||n&&!un(i)?t.removeAttribute(e):t.setAttribute(e,n?"":i)}}function Bu(t,e,i,o,a,n,s){if(e==="innerHTML"||e==="textContent"){o&&s(o,a,n),t[e]=i??"";return}if(e==="value"&&t.tagName!=="PROGRESS"&&!t.tagName.includes("-")){t._value=i;const c=i??"";(t.value!==c||t.tagName==="OPTION")&&(t.value=c),i==null&&t.removeAttribute(e);return}let r=!1;if(i===""||i==null){const c=typeof t[e];c==="boolean"?i=un(i):i==null&&c==="string"?(i="",r=!0):c==="number"&&(i=0,r=!0)}try{t[e]=i}catch(c){r||I(`Failed setting prop "${e}" on <${t.tagName.toLowerCase()}>: value ${i} is invalid.`,c)}r&&t.removeAttribute(e)}function Ou(t,e,i,o){t.addEventListener(e,i,o)}function Du(t,e,i,o){t.removeEventListener(e,i,o)}function Nu(t,e,i,o,a=null){const n=t._vei||(t._vei={}),s=n[e];if(o&&s)s.value=o;else{const[r,c]=Uu(e);if(o){const l=n[e]=Ku(o,a);Ou(t,r,l,c)}else s&&(Du(t,r,s,c),n[e]=void 0)}}const Us=/(?:Once|Passive|Capture)$/;function Uu(t){let e;if(Us.test(t)){e={};let o;for(;o=t.match(Us);)t=t.slice(0,t.length-o[0].length),e[o[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):mt(t.slice(2)),e]}let Ia=0;const Hu=Promise.resolve(),Gu=()=>Ia||(Hu.then(()=>Ia=0),Ia=Date.now());function Ku(t,e){const i=o=>{if(!o._vts)o._vts=Date.now();else if(o._vts<=i.attached)return;Fe(Vu(o,i.value),e,5,[o])};return i.value=t,i.attached=Gu(),i}function Vu(t,e){if($(e)){const i=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{i.call(t),t._stopped=!0},e.map(o=>a=>!a._stopped&&o&&o(a))}else return e}const Hs=/^on[a-z]/,$u=(t,e,i,o,a=!1,n,s,r,c)=>{e==="class"?Mu(t,o,a):e==="style"?Tu(t,i,o):ai(e)?Ri(e)||Nu(t,e,i,o,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Wu(t,e,o,a))?Bu(t,e,o,n,s,r,c):(e==="true-value"?t._trueValue=o:e==="false-value"&&(t._falseValue=o),Fu(t,e,o,a))};function Wu(t,e,i,o){return o?!!(e==="innerHTML"||e==="textContent"||e in t&&Hs.test(e)&&W(i)):e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA"||Hs.test(e)&&me(i)?!1:e in t}const qu=ue({patchProp:$u},Pu);let Gs;function Ju(){return Gs||(Gs=nu(qu))}const Yu=(...t)=>{const e=Ju().createApp(...t);Xu(e),Zu(e);const{mount:i}=e;return e.mount=o=>{const a=Qu(o);if(!a)return;const n=e._component;!W(n)&&!n.render&&!n.template&&(n.template=a.innerHTML),a.innerHTML="";const s=i(a,!1,a instanceof SVGElement);return a instanceof Element&&(a.removeAttribute("v-cloak"),a.setAttribute("data-v-app","")),s},e};function Xu(t){Object.defineProperty(t.config,"isNativeTag",{value:e=>Xr(e)||Zr(e),writable:!1})}function Zu(t){{const e=t.config.isCustomElement;Object.defineProperty(t.config,"isCustomElement",{get(){return e},set(){I("The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.")}});const i=t.config.compilerOptions,o='The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom';Object.defineProperty(t.config,"compilerOptions",{get(){return I(o),i},set(){I(o)}})}}function Qu(t){if(me(t)){const e=document.querySelector(t);return e||I(`Failed to mount app: mount target selector "${t}" returned null.`),e}return window.ShadowRoot&&t instanceof window.ShadowRoot&&t.mode==="closed"&&I('mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'),t}function em(){Ru()}em();var tm=!1;function po(t,e,i){return Array.isArray(t)?(t.length=Math.max(t.length,e),t.splice(e,1,i),i):(t[e]=i,i)}function Ra(t,e){if(Array.isArray(t)){t.splice(e,1);return}delete t[e]}function im(){return Ks().__VUE_DEVTOOLS_GLOBAL_HOOK__}function Ks(){return typeof navigator<"u"&&typeof window<"u"?window:typeof global<"u"?global:{}}const om=typeof Proxy=="function",am="devtools-plugin:setup",nm="plugin:settings:set";let qt,za;function sm(){var t;return qt!==void 0||(typeof window<"u"&&window.performance?(qt=!0,za=window.performance):typeof global<"u"&&(!((t=global.perf_hooks)===null||t===void 0)&&t.performance)?(qt=!0,za=global.perf_hooks.performance):qt=!1),qt}function rm(){return sm()?za.now():Date.now()}class cm{constructor(e,i){this.target=null,this.targetQueue=[],this.onQueue=[],this.plugin=e,this.hook=i;const o={};if(e.settings)for(const s in e.settings){const r=e.settings[s];o[s]=r.defaultValue}const a=`__vue-devtools-plugin-settings__${e.id}`;let n=Object.assign({},o);try{const s=localStorage.getItem(a),r=JSON.parse(s);Object.assign(n,r)}catch{}this.fallbacks={getSettings(){return n},setSettings(s){try{localStorage.setItem(a,JSON.stringify(s))}catch{}n=s},now(){return rm()}},i&&i.on(nm,(s,r)=>{s===this.plugin.id&&this.fallbacks.setSettings(r)}),this.proxiedOn=new Proxy({},{get:(s,r)=>this.target?this.target.on[r]:(...c)=>{this.onQueue.push({method:r,args:c})}}),this.proxiedTarget=new Proxy({},{get:(s,r)=>this.target?this.target[r]:r==="on"?this.proxiedOn:Object.keys(this.fallbacks).includes(r)?(...c)=>(this.targetQueue.push({method:r,args:c,resolve:()=>{}}),this.fallbacks[r](...c)):(...c)=>new Promise(l=>{this.targetQueue.push({method:r,args:c,resolve:l})})})}async setRealTarget(e){this.target=e;for(const i of this.onQueue)this.target.on[i.method](...i.args);for(const i of this.targetQueue)i.resolve(await this.target[i.method](...i.args))}}function Vs(t,e){const i=t,o=Ks(),a=im(),n=om&&i.enableEarlyProxy;if(a&&(o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__||!n))a.emit(am,t,e);else{const s=n?new cm(i,a):null;(o.__VUE_DEVTOOLS_PLUGINS__=o.__VUE_DEVTOOLS_PLUGINS__||[]).push({pluginDescriptor:i,setupFn:e,proxy:s}),s&&e(s.proxiedTarget)}}/*!
  * pinia v2.0.29
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */let Pa;const wi=t=>Pa=t,$s=Symbol("pinia");function Ft(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var De;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(De||(De={}));const ho=typeof window<"u",go=ho,Ws=(()=>typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof global=="object"&&global.global===global?global:typeof globalThis=="object"?globalThis:{HTMLElement:null})();function lm(t,{autoBom:e=!1}={}){return e&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t}function Ma(t,e,i){const o=new XMLHttpRequest;o.open("GET",t),o.responseType="blob",o.onload=function(){Ys(o.response,e,i)},o.onerror=function(){console.error("could not download file")},o.send()}function qs(t){const e=new XMLHttpRequest;e.open("HEAD",t,!1);try{e.send()}catch{}return e.status>=200&&e.status<=299}function fo(t){try{t.dispatchEvent(new MouseEvent("click"))}catch{const i=document.createEvent("MouseEvents");i.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(i)}}const bo=typeof navigator=="object"?navigator:{userAgent:""},Js=(()=>/Macintosh/.test(bo.userAgent)&&/AppleWebKit/.test(bo.userAgent)&&!/Safari/.test(bo.userAgent))(),Ys=ho?typeof HTMLAnchorElement<"u"&&"download"in HTMLAnchorElement.prototype&&!Js?um:"msSaveOrOpenBlob"in bo?mm:dm:()=>{};function um(t,e="download",i){const o=document.createElement("a");o.download=e,o.rel="noopener",typeof t=="string"?(o.href=t,o.origin!==location.origin?qs(o.href)?Ma(t,e,i):(o.target="_blank",fo(o)):fo(o)):(o.href=URL.createObjectURL(t),setTimeout(function(){URL.revokeObjectURL(o.href)},4e4),setTimeout(function(){fo(o)},0))}function mm(t,e="download",i){if(typeof t=="string")if(qs(t))Ma(t,e,i);else{const o=document.createElement("a");o.href=t,o.target="_blank",setTimeout(function(){fo(o)})}else navigator.msSaveOrOpenBlob(lm(t,i),e)}function dm(t,e,i,o){if(o=o||open("","_blank"),o&&(o.document.title=o.document.body.innerText="downloading..."),typeof t=="string")return Ma(t,e,i);const a=t.type==="application/octet-stream",n=/constructor/i.test(String(Ws.HTMLElement))||"safari"in Ws,s=/CriOS\/[\d]+/.test(navigator.userAgent);if((s||a&&n||Js)&&typeof FileReader<"u"){const r=new FileReader;r.onloadend=function(){let c=r.result;if(typeof c!="string")throw o=null,new Error("Wrong reader.result type");c=s?c:c.replace(/^data:[^;]*;/,"data:attachment/file;"),o?o.location.href=c:location.assign(c),o=null},r.readAsDataURL(t)}else{const r=URL.createObjectURL(t);o?o.location.assign(r):location.href=r,o=null,setTimeout(function(){URL.revokeObjectURL(r)},4e4)}}function he(t,e){const i="🍍 "+t;typeof __VUE_DEVTOOLS_TOAST__=="function"?__VUE_DEVTOOLS_TOAST__(i,e):e==="error"?console.error(i):e==="warn"?console.warn(i):console.log(i)}function Ta(t){return"_a"in t&&"install"in t}function Xs(){if(!("clipboard"in navigator))return he("Your browser doesn't support the Clipboard API","error"),!0}function Zs(t){return t instanceof Error&&t.message.toLowerCase().includes("document is not focused")?(he('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.',"warn"),!0):!1}async function pm(t){if(!Xs())try{await navigator.clipboard.writeText(JSON.stringify(t.state.value)),he("Global state copied to clipboard.")}catch(e){if(Zs(e))return;he("Failed to serialize the state. Check the console for more details.","error"),console.error(e)}}async function hm(t){if(!Xs())try{t.state.value=JSON.parse(await navigator.clipboard.readText()),he("Global state pasted from clipboard.")}catch(e){if(Zs(e))return;he("Failed to deserialize the state from clipboard. Check the console for more details.","error"),console.error(e)}}async function gm(t){try{Ys(new Blob([JSON.stringify(t.state.value)],{type:"text/plain;charset=utf-8"}),"pinia-state.json")}catch(e){he("Failed to export the state as JSON. Check the console for more details.","error"),console.error(e)}}let st;function fm(){st||(st=document.createElement("input"),st.type="file",st.accept=".json");function t(){return new Promise((e,i)=>{st.onchange=async()=>{const o=st.files;if(!o)return e(null);const a=o.item(0);return e(a?{text:await a.text(),file:a}:null)},st.oncancel=()=>e(null),st.onerror=i,st.click()})}return t}async function bm(t){try{const i=await(await fm())();if(!i)return;const{text:o,file:a}=i;t.state.value=JSON.parse(o),he(`Global state imported from "${a.name}".`)}catch(e){he("Failed to export the state as JSON. Check the console for more details.","error"),console.error(e)}}function Ne(t){return{_custom:{display:t}}}const Qs="🍍 Pinia (root)",_a="_root";function km(t){return Ta(t)?{id:_a,label:Qs}:{id:t.$id,label:t.$id}}function ym(t){if(Ta(t)){const i=Array.from(t._s.keys()),o=t._s;return{state:i.map(n=>({editable:!0,key:n,value:t.state.value[n]})),getters:i.filter(n=>o.get(n)._getters).map(n=>{const s=o.get(n);return{editable:!1,key:n,value:s._getters.reduce((r,c)=>(r[c]=s[c],r),{})}})}}const e={state:Object.keys(t.$state).map(i=>({editable:!0,key:i,value:t.$state[i]}))};return t._getters&&t._getters.length&&(e.getters=t._getters.map(i=>({editable:!1,key:i,value:t[i]}))),t._customProperties.size&&(e.customProperties=Array.from(t._customProperties).map(i=>({editable:!0,key:i,value:t[i]}))),e}function wm(t){return t?Array.isArray(t)?t.reduce((e,i)=>(e.keys.push(i.key),e.operations.push(i.type),e.oldValue[i.key]=i.oldValue,e.newValue[i.key]=i.newValue,e),{oldValue:{},keys:[],operations:[],newValue:{}}):{operation:Ne(t.type),key:Ne(t.key),oldValue:t.oldValue,newValue:t.newValue}:{}}function jm(t){switch(t){case De.direct:return"mutation";case De.patchFunction:return"$patch";case De.patchObject:return"$patch";default:return"unknown"}}let Jt=!0;const ko=[],Bt="pinia:mutations",be="pinia",yo=t=>"🍍 "+t;function vm(t,e){Vs({id:"dev.esm.pinia",label:"Pinia 🍍",logo:"https://pinia.vuejs.org/logo.svg",packageName:"pinia",homepage:"https://pinia.vuejs.org",componentStateTypes:ko,app:t},i=>{typeof i.now!="function"&&he("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."),i.addTimelineLayer({id:Bt,label:"Pinia 🍍",color:15064968}),i.addInspector({id:be,label:"Pinia 🍍",icon:"storage",treeFilterPlaceholder:"Search stores",actions:[{icon:"content_copy",action:()=>{pm(e)},tooltip:"Serialize and copy the state"},{icon:"content_paste",action:async()=>{await hm(e),i.sendInspectorTree(be),i.sendInspectorState(be)},tooltip:"Replace the state with the content of your clipboard"},{icon:"save",action:()=>{gm(e)},tooltip:"Save the state as a JSON file"},{icon:"folder_open",action:async()=>{await bm(e),i.sendInspectorTree(be),i.sendInspectorState(be)},tooltip:"Import the state from a JSON file"}],nodeActions:[{icon:"restore",tooltip:"Reset the state (option store only)",action:o=>{const a=e._s.get(o);a?a._isOptionsAPI?(a.$reset(),he(`Store "${o}" reset.`)):he(`Cannot reset "${o}" store because it's a setup store.`,"warn"):he(`Cannot reset "${o}" store because it wasn't found.`,"warn")}}]}),i.on.inspectComponent((o,a)=>{const n=o.componentInstance&&o.componentInstance.proxy;if(n&&n._pStores){const s=o.componentInstance.proxy._pStores;Object.values(s).forEach(r=>{o.instanceData.state.push({type:yo(r.$id),key:"state",editable:!0,value:r._isOptionsAPI?{_custom:{value:q(r.$state),actions:[{icon:"restore",tooltip:"Reset the state of this store",action:()=>r.$reset()}]}}:Object.keys(r.$state).reduce((c,l)=>(c[l]=r.$state[l],c),{})}),r._getters&&r._getters.length&&o.instanceData.state.push({type:yo(r.$id),key:"getters",editable:!1,value:r._getters.reduce((c,l)=>{try{c[l]=r[l]}catch(d){c[l]=d}return c},{})})})}}),i.on.getInspectorTree(o=>{if(o.app===t&&o.inspectorId===be){let a=[e];a=a.concat(Array.from(e._s.values())),o.rootNodes=(o.filter?a.filter(n=>"$id"in n?n.$id.toLowerCase().includes(o.filter.toLowerCase()):Qs.toLowerCase().includes(o.filter.toLowerCase())):a).map(km)}}),i.on.getInspectorState(o=>{if(o.app===t&&o.inspectorId===be){const a=o.nodeId===_a?e:e._s.get(o.nodeId);if(!a)return;a&&(o.state=ym(a))}}),i.on.editInspectorState((o,a)=>{if(o.app===t&&o.inspectorId===be){const n=o.nodeId===_a?e:e._s.get(o.nodeId);if(!n)return he(`store "${o.nodeId}" not found`,"error");const{path:s}=o;Ta(n)?s.unshift("state"):(s.length!==1||!n._customProperties.has(s[0])||s[0]in n.$state)&&s.unshift("$state"),Jt=!1,o.set(n,s,o.state.value),Jt=!0}}),i.on.editComponentState(o=>{if(o.type.startsWith("🍍")){const a=o.type.replace(/^🍍\s*/,""),n=e._s.get(a);if(!n)return he(`store "${a}" not found`,"error");const{path:s}=o;if(s[0]!=="state")return he(`Invalid path for store "${a}":
${s}
Only state can be modified.`);s[0]="$state",Jt=!1,o.set(n,s,o.state.value),Jt=!0}})})}function Sm(t,e){ko.includes(yo(e.$id))||ko.push(yo(e.$id)),Vs({id:"dev.esm.pinia",label:"Pinia 🍍",logo:"https://pinia.vuejs.org/logo.svg",packageName:"pinia",homepage:"https://pinia.vuejs.org",componentStateTypes:ko,app:t,settings:{logStoreChanges:{label:"Notify about new/deleted stores",type:"boolean",defaultValue:!0}}},i=>{const o=typeof i.now=="function"?i.now.bind(i):Date.now;e.$onAction(({after:s,onError:r,name:c,args:l})=>{const d=er++;i.addTimelineEvent({layerId:Bt,event:{time:o(),title:"🛫 "+c,subtitle:"start",data:{store:Ne(e.$id),action:Ne(c),args:l},groupId:d}}),s(u=>{Ot=void 0,i.addTimelineEvent({layerId:Bt,event:{time:o(),title:"🛬 "+c,subtitle:"end",data:{store:Ne(e.$id),action:Ne(c),args:l,result:u},groupId:d}})}),r(u=>{Ot=void 0,i.addTimelineEvent({layerId:Bt,event:{time:o(),logType:"error",title:"💥 "+c,subtitle:"end",data:{store:Ne(e.$id),action:Ne(c),args:l,error:u},groupId:d}})})},!0),e._customProperties.forEach(s=>{gi(()=>Nn(e[s]),(r,c)=>{i.notifyComponentUpdate(),i.sendInspectorState(be),Jt&&i.addTimelineEvent({layerId:Bt,event:{time:o(),title:"Change",subtitle:s,data:{newValue:r,oldValue:c},groupId:Ot}})},{deep:!0})}),e.$subscribe(({events:s,type:r},c)=>{if(i.notifyComponentUpdate(),i.sendInspectorState(be),!Jt)return;const l={time:o(),title:jm(r),data:{store:Ne(e.$id),...wm(s)},groupId:Ot};Ot=void 0,r===De.patchFunction?l.subtitle="⤵️":r===De.patchObject?l.subtitle="🧩":s&&!Array.isArray(s)&&(l.subtitle=s.type),s&&(l.data["rawEvent(s)"]={_custom:{display:"DebuggerEvent",type:"object",tooltip:"raw DebuggerEvent[]",value:s}}),i.addTimelineEvent({layerId:Bt,event:l})},{detached:!0,flush:"sync"});const a=e._hotUpdate;e._hotUpdate=Ee(s=>{a(s),i.addTimelineEvent({layerId:Bt,event:{time:o(),title:"🔥 "+e.$id,subtitle:"HMR update",data:{store:Ne(e.$id),info:Ne("HMR update")}}}),i.notifyComponentUpdate(),i.sendInspectorTree(be),i.sendInspectorState(be)});const{$dispose:n}=e;e.$dispose=()=>{n(),i.notifyComponentUpdate(),i.sendInspectorTree(be),i.sendInspectorState(be),i.getSettings().logStoreChanges&&he(`Disposed "${e.$id}" store 🗑`)},i.notifyComponentUpdate(),i.sendInspectorTree(be),i.sendInspectorState(be),i.getSettings().logStoreChanges&&he(`"${e.$id}" store installed 🆕`)})}let er=0,Ot;function tr(t,e){const i=e.reduce((o,a)=>(o[a]=q(t)[a],o),{});for(const o in i)t[o]=function(){const a=er,n=new Proxy(t,{get(...s){return Ot=a,Reflect.get(...s)},set(...s){return Ot=a,Reflect.set(...s)}});return i[o].apply(n,arguments)}}function Lm({app:t,store:e,options:i}){if(!e.$id.startsWith("__hot:")){if(i.state&&(e._isOptionsAPI=!0),typeof i.state=="function"){tr(e,Object.keys(i.actions));const o=e._hotUpdate;q(e)._hotUpdate=function(a){o.apply(this,arguments),tr(e,Object.keys(a._hmrPayload.actions))}}Sm(t,e)}}function Cm(){const t=fn(!0),e=t.run(()=>Yo({}));let i=[],o=[];const a=Ee({install(n){wi(a),a._a=n,n.provide($s,a),n.config.globalProperties.$pinia=a,go&&vm(n,a),o.forEach(s=>i.push(s)),o=[]},use(n){return!this._a&&!tm?o.push(n):i.push(n),this},_p:i,_a:null,_e:t,_s:new Map,state:e});return go&&typeof Proxy<"u"&&a.use(Lm),a}function ir(t,e){for(const i in e){const o=e[i];if(!(i in t))continue;const a=t[i];Ft(a)&&Ft(o)&&!ce(o)&&!$e(o)?t[i]=ir(a,o):t[i]=o}return t}const Am=()=>{};function or(t,e,i,o=Am){t.push(e);const a=()=>{const n=t.indexOf(e);n>-1&&(t.splice(n,1),o())};return!i&&lc()&&uc(a),a}function Yt(t,...e){t.slice().forEach(i=>{i(...e)})}function Ea(t,e){t instanceof Map&&e instanceof Map&&e.forEach((i,o)=>t.set(o,i)),t instanceof Set&&e instanceof Set&&e.forEach(t.add,t);for(const i in e){if(!e.hasOwnProperty(i))continue;const o=e[i],a=t[i];Ft(a)&&Ft(o)&&t.hasOwnProperty(i)&&!ce(o)&&!$e(o)?t[i]=Ea(a,o):t[i]=o}return t}const xm=Symbol("pinia:skipHydration");function Im(t){return!Ft(t)||!t.hasOwnProperty(xm)}const{assign:Ue}=Object;function ar(t){return!!(ce(t)&&t.effect)}function nr(t,e,i,o){const{state:a,actions:n,getters:s}=e,r=i.state.value[t];let c;function l(){!r&&!o&&(i.state.value[t]=a?a():{});const d=Hn(o?Yo(a?a():{}).value:i.state.value[t]);return Ue(d,n,Object.keys(s||{}).reduce((u,p)=>(p in d&&console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${p}" in store "${t}".`),u[p]=Ee(La(()=>{wi(i);const g=i._s.get(t);return s[p].call(g,g)})),u),{}))}return c=Fa(t,l,e,i,o,!0),c.$reset=function(){const u=a?a():{};this.$patch(p=>{Ue(p,u)})},c}function Fa(t,e,i={},o,a,n){let s;const r=Ue({actions:{}},i);if(!o._e.active)throw new Error("Pinia destroyed");const c={deep:!0};c.onTrigger=f=>{l?g=f:l==!1&&!D._hotUpdating&&(Array.isArray(g)?g.push(f):console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."))};let l,d,u=Ee([]),p=Ee([]),g;const v=o.state.value[t];!n&&!v&&!a&&(o.state.value[t]={});const y=Yo({});let A;function P(f){let w;l=d=!1,g=[],typeof f=="function"?(f(o.state.value[t]),w={type:De.patchFunction,storeId:t,events:g}):(Ea(o.state.value[t],f),w={type:De.patchObject,payload:f,storeId:t,events:g});const b=A=Symbol();ea().then(()=>{A===b&&(l=!0)}),d=!0,Yt(u,w,o.state.value[t])}const B=()=>{throw new Error(`🍍: Store "${t}" is built using the setup syntax and does not implement $reset().`)};function H(){s.stop(),u=[],p=[],o._s.delete(t)}function F(f,w){return function(){wi(o);const b=Array.from(arguments),z=[],V=[];function le(_){z.push(_)}function U(_){V.push(_)}Yt(p,{args:b,name:f,store:D,after:le,onError:U});let Q;try{Q=w.apply(this&&this.$id===t?this:D,b)}catch(_){throw Yt(V,_),_}return Q instanceof Promise?Q.then(_=>(Yt(z,_),_)).catch(_=>(Yt(V,_),Promise.reject(_))):(Yt(z,Q),Q)}}const X=Ee({actions:{},getters:{},state:[],hotState:y}),se={_p:o,$id:t,$onAction:or.bind(null,p),$patch:P,$reset:B,$subscribe(f,w={}){const b=or(u,f,w.detached,()=>z()),z=s.run(()=>gi(()=>o.state.value[t],V=>{(w.flush==="sync"?d:l)&&f({storeId:t,type:De.direct,events:g},V)},Ue({},c,w)));return b},$dispose:H},D=Ki(Ue({_hmrPayload:X,_customProperties:Ee(new Set)},se));o._s.set(t,D);const M=o._e.run(()=>(s=fn(),s.run(()=>e())));for(const f in M){const w=M[f];if(ce(w)&&!ar(w)||$e(w))a?po(y.value,f,qi(M,f)):n||(v&&Im(w)&&(ce(w)?w.value=v[f]:Ea(w,v[f])),o.state.value[t][f]=w),X.state.push(f);else if(typeof w=="function"){const b=a?w:F(f,w);M[f]=b,X.actions[f]=w,r.actions[f]=w}else ar(w)&&(X.getters[f]=n?i.getters[f]:w,ho&&(M._getters||(M._getters=Ee([]))).push(f))}if(Ue(D,M),Ue(q(D),M),Object.defineProperty(D,"$state",{get:()=>a?y.value:o.state.value[t],set:f=>{if(a)throw new Error("cannot set hotState");P(w=>{Ue(w,f)})}}),D._hotUpdate=Ee(f=>{D._hotUpdating=!0,f._hmrPayload.state.forEach(w=>{if(w in D.$state){const b=f.$state[w],z=D.$state[w];typeof b=="object"&&Ft(b)&&Ft(z)?ir(b,z):f.$state[w]=z}po(D,w,qi(f.$state,w))}),Object.keys(D.$state).forEach(w=>{w in f.$state||Ra(D,w)}),l=!1,d=!1,o.state.value[t]=qi(f._hmrPayload,"hotState"),d=!0,ea().then(()=>{l=!0});for(const w in f._hmrPayload.actions){const b=f[w];po(D,w,F(w,b))}for(const w in f._hmrPayload.getters){const b=f._hmrPayload.getters[w],z=n?La(()=>(wi(o),b.call(D,D))):b;po(D,w,z)}Object.keys(D._hmrPayload.getters).forEach(w=>{w in f._hmrPayload.getters||Ra(D,w)}),Object.keys(D._hmrPayload.actions).forEach(w=>{w in f._hmrPayload.actions||Ra(D,w)}),D._hmrPayload=f._hmrPayload,D._getters=f._getters,D._hotUpdating=!1}),go){const f={writable:!0,configurable:!0,enumerable:!1};["_p","_hmrPayload","_getters","_customProperties"].forEach(w=>{Object.defineProperty(D,w,{value:D[w],...f})})}return o._p.forEach(f=>{if(go){const w=s.run(()=>f({store:D,app:o._a,pinia:o,options:r}));Object.keys(w||{}).forEach(b=>D._customProperties.add(b)),Ue(D,w)}else Ue(D,s.run(()=>f({store:D,app:o._a,pinia:o,options:r})))}),D.$state&&typeof D.$state=="object"&&typeof D.$state.constructor=="function"&&!D.$state.constructor.toString().includes("[native code]")&&console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${D.$id}".`),v&&n&&i.hydrate&&i.hydrate(D.$state,v),l=!0,d=!0,D}function Rm(t,e,i){let o,a;const n=typeof e=="function";typeof t=="string"?(o=t,a=n?i:e):(a=t,o=t.id);function s(r,c){const l=ku();if(r=r||l&&hi($s,null),r&&wi(r),!Pa)throw new Error(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);r=Pa,r._s.has(o)||(n?Fa(o,e,a,r):nr(o,a,r),s._pinia=r);const d=r._s.get(o);if(c){const u="__hot:"+o,p=n?Fa(u,e,a,r,!0):nr(u,Ue({},a),r,!0);c._hotUpdate(p),delete r.state.value[u],r._s.delete(u)}if(ho&&l&&l.proxy&&!c){const u=l.proxy,p="_pStores"in u?u._pStores:u._pStores={};p[o]=d}return d}return s.$id=o,s}class zm{constructor(){this.newEntry=new et({})}}const Pm={latestConnectionError:"",lastKeePassRPCRefresh:0,ActiveKeePassDatabaseIndex:-1,KeePassDatabases:[],PasswordProfiles:[],notifications:[],connected:!1,connectedWebsocket:!1,currentSearchTerm:null,loginsFound:!1,searchResults:null,saveState:new zm,generatedPassword:"",saveEntryResult:{result:null,receivedAt:new Date,fileName:null,uuid:null},entryUpdateStartedAtTimestamp:0};var Ba=(t=>(t.Event="event",t.Websocket="websocket",t))(Ba||{});function Mm(t,e){return Rm(t,e)}const sr=Mm("kee",{state:()=>Pm,getters:{showGeneratePasswordLink:t=>t.connected,showMatchedLogins:t=>!!t.loginsFound,showNotifications:t=>t.notifications&&!!t.notifications.length,databaseIsOpen:t=>t.connected&&!!t.KeePassDatabases.length,databaseName:t=>{if(t.KeePassDatabases&&t.KeePassDatabases.length&&t.ActiveKeePassDatabaseIndex>=0){const e=t.KeePassDatabases[t.ActiveKeePassDatabaseIndex];return e.name?e.name:e.fileName.replace(/^.*[\\/]/,"")}return""},connectionStatus(t){return t.connected?t.KeePassDatabases.length>1?_o("multiplePasswordSourcesEnabled",[t.KeePassDatabases.length.toString()]):t.KeePassDatabases.length==1?this.databaseName:Qe("notifyBarLoginToKeePassButton_tip"):Qe("notifyBarLaunchKeePassButton_tip")},connectionStatusDetail(t){if(t.connected){if(t.KeePassDatabases.length>1)return _o("loggedInMultiple_tip",[t.KeePassDatabases.length.toString(),this.databaseName]);if(t.KeePassDatabases.length==1)return _o("loggedIn_tip",this.databaseName)}return Qe("notifyBarLaunchKeePass_label")},showOpenKeePassButton:t=>{if(t.connectedWebsocket){const e=t.KeePassDatabases.some(o=>o.sessionType===Ba.Websocket),i=t.KeePassDatabases.some(o=>o.sessionType===Ba.Websocket&&o.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE")>=0);return!!(!e||i)}else return!1}},actions:{updateActiveKeePassDatabaseIndex(t){this.$patch({ActiveKeePassDatabaseIndex:t})},updateConnected(t){this.$patch({connected:t})},updateConnectedWebsocket(t){this.$patch({connectedWebsocket:t})},updateCurrentSearchTerm(t){this.$patch({currentSearchTerm:t})},updateKeePassDatabases(t){this.$patch({KeePassDatabases:t})},updateLastKeePassRPCRefresh(t){this.$patch({lastKeePassRPCRefresh:t})},updateLatestConnectionError(t){this.$patch({latestConnectionError:t})},updateLoginsFound(t){this.$patch({loginsFound:t||!1})},updateNotifications(t){this.$patch({notifications:t})},updatePasswordProfiles(t){this.$patch({PasswordProfiles:t})},updateGeneratedPassword(t){this.$patch({generatedPassword:t})},updateSubmittedData(t){this.$patch({saveState:{submittedData:t||null}})},updateSaveState(t){this.$patch({saveState:t||null})},updateSearchResults(t){this.$patch({searchResults:t||null})},updateSearchResultWithFullDetails(t){const e=JSON.parse(JSON.stringify(this.searchResults)),i=t.uuid;for(const o of e)if(o.uuid===i){o.fullDetails=t||null;break}this.$patch({searchResults:e})},addNotification(t){const e=JSON.parse(JSON.stringify(this.notifications));e.push(t),this.$patch({notifications:e})},updateSaveEntryResult(t){this.$patch({saveEntryResult:t||null})},removeFieldFromActiveEntry(t){const e=JSON.parse(JSON.stringify(this.saveState.newEntry.fields)),i=e.findIndex(n=>n.type==="text"),o=e.findIndex(n=>n.type==="password"),a=e.findIndex(n=>n.uuid===(t||null));if(e.splice(a,1),a===i){const n=e.findIndex(s=>s.type==="text");if(n>=0){const s=e.splice(n,1)[0];e.splice(a,0,new xe({...s,name:"KeePass username"}))}}else if(a===o){const n=e.findIndex(s=>s.type==="password");if(n>=0){const s=e.splice(n,1)[0];e.splice(a,0,new xe({...s,name:"KeePass password"}))}}ne.debug(`before ${JSON.stringify(this.saveState)}`),this.$patch({saveState:{newEntry:{fields:e}}}),ne.debug(`after ${JSON.stringify(this.saveState)}`)},updateEntryUpdateStartedAtTimestamp(t){this.$patch({entryUpdateStartedAtTimestamp:t||null})}}});let Oa,Da;function Tm(){return Da||(Da=Cm()),Oa||(Oa=Yu(vl),Oa.use(Da)),sr()}const rr=sr();class _m{constructor(e,i,o,a,n,s,r){this.myPort=e,this.parentFrameId=i,this.formUtils=o,this.formSaving=a,this.Logger=n,this.config=s,this.matchFinder=r,this.findLoginOp={},this.matchResult=new Ur,this.formFinderTimer=null,this.keeFieldIcon=new Nr(e,i,o,this.createMatchedLoginsPanelNearNode.bind(this))}executePrimaryAction(){this.matchResult.entries&&this.matchResult.entries.length>0&&this.matchResult.mostRelevantFormIndex!=null&&this.matchResult.mostRelevantFormIndex>=0&&(this.matchResult.entries[this.matchResult.mostRelevantFormIndex].length==1?(this.fillAndSubmit(!1,this.matchResult.mostRelevantFormIndex,0),this.closeMatchedLoginsPanel()):this.matchResult.entries[this.matchResult.mostRelevantFormIndex].length>1&&(this.closeMatchedLoginsPanel(),this.matchedLoginsPanelStub=new ti(jt.MatchedLogins,null,this.parentFrameId),this.matchedLoginsPanelStub.createPanel()))}createMatchedLoginsPanelInCenter(e){this.closeMatchedLoginsPanel(),this.matchedLoginsPanelStub=new ti(jt.MatchedLogins,null,e),this.matchedLoginsPanelStub.createPanel()}createMatchedLoginsPanelNearNode(e){this.closeMatchedLoginsPanel(),this.matchedLoginsPanelStub=new ti(jt.MatchedLogins,e,this.parentFrameId),this.matchedLoginsPanelStub.createPanel(),this.matchedLoginsPanelStubRaf=requestAnimationFrame(()=>this.updateMatchedLoginsPanelPosition())}closeMatchedLoginsPanel(){this.matchedLoginsPanelStub&&this.matchedLoginsPanelStub.closePanel(),this.matchedLoginsPanelStub=null,cancelAnimationFrame(this.matchedLoginsPanelStubRaf)}updateMatchedLoginsPanelPosition(){this.matchedLoginsPanelStub.updateBoundingClientRect(),this.matchedLoginsPanelStubRaf=requestAnimationFrame(()=>this.updateMatchedLoginsPanelPosition())}calculateFieldMatchScore(e,i,o,a,n){const s=e.field;let r=1;return s.type!==i.type?0:(s.locators[0].id!=null&&s.locators[0].id!=null&&s.locators[0].id!=""&&s.locators[0].id==i.locators[0].id?r+=50:a.punishWrongIDAndName&&i.locators[0].id&&(r-=5),s.locators[0].name!=null&&s.locators[0].name!=null&&s.locators[0].name!=""&&s.locators[0].name==i.locators[0].name?r+=40:a.punishWrongIDAndName&&i.locators[0].name&&(r-=5),s.locators[0].type==="radio"&&s.value!=null&&s.value!=null&&s.value!=""&&s.value==i.value&&(r+=30),n===void 0&&this.formUtils.isDOMElementVisible(e.DOMelement)&&(n=!0),r+=n?35:0,r)}fillMatchedFields(e,i,o,a){e.sort(function(s,r){return r.score-s.score});const n=[];for(;e.length>0&&e[0].score>0;){const s=e[0].formFieldIndex,r=e[0].dataFieldIndex,c=o[s],l=i[r],d=c.DOMelement,u=this.getFormFieldCurrentValue(d,c.field.locators[0].type);a&&u&&u!==d.keeInitialDetectedValue?this.Logger.info("Not filling field because it's not empty and was edited by user since last load/fill"):a&&u&&!Pe.current.autoFillFieldsWithExistingValue?this.Logger.info("Not filling field because it's not empty and user preference is to prevent automatic fill"):(this.Logger.info("We will populate field "+s+" (id:"+c.field.locators[0].id+")"),this.fillASingleField(d,c.field.locators[0].type,l.value)),n.push({id:c.field.locators[0].id,DOMelement:d,name:c.field.locators[0].name,value:l.value}),e=e.filter(function(p){return p.dataFieldIndex!=r&&p.formFieldIndex!=s}),e.sort(function(p,g){return g.score-p.score})}return n}getFormFieldCurrentValue(e,i){let o=e.value;return e instanceof HTMLInputElement&&i==="checkbox"&&(e.checked?o="KEEFOX_CHECKED_FLAG_TRUE":o="KEEFOX_CHECKED_FLAG_FALSE"),o}fillASingleField(e,i,o){i=="select-one"?e.value=o:e instanceof HTMLInputElement&&i=="checkbox"?o=="KEEFOX_CHECKED_FLAG_TRUE"?e.checked=!0:e.checked=!1:e instanceof HTMLInputElement&&i=="radio"?e.checked=!0:e.value=o,e.keeInitialDetectedValue=o,e.dispatchEvent(new UIEvent("input",{view:window,bubbles:!0,cancelable:!0})),e.dispatchEvent(new UIEvent("change",{view:window,bubbles:!0,cancelable:!0}))}fillManyFormFields(e,i,o,a,n){if(this.Logger.debug("_fillManyFormFields started"),e==null||e==null||i==null||i==null)return;this.Logger.debug("We've received the data we need"),this.Logger.info("Filling form fields for page "+o);const s=[];for(let r=0;r<e.length;r++)for(let c=0;c<i.length;c++){const l=this.calculateFieldMatchScore(e[r],i[c],o,a);this.Logger.debug("Suitability of putting data field "+c+" into form field "+r+" (id: "+e[r].field.locators[0].id+") is "+l),s.push({score:l,dataFieldIndex:c,formFieldIndex:r})}return this.fillMatchedFields(s,i,e,n)}initMatchResult(e){this.matchResult.UUID="",this.matchResult.entries=[],this.matchResult.mostRelevantFormIndex=null,this.matchResult.mustAutoFillForm=!1,this.matchResult.cannotAutoFillForm=!1,this.matchResult.mustAutoSubmitForm=!1,this.matchResult.cannotAutoSubmitForm=!1,e.UUID!=null&&e.UUID!=null&&e.UUID!=""&&(this.matchResult.UUID=e.UUID,this.matchResult.dbFileName=e.dbFileName,this.matchResult.mustAutoFillForm=!0,e.mustAutoSubmitForm&&(this.matchResult.mustAutoSubmitForm=!0)),this.matchResult.doc=window.document,this.matchResult.formReadyForSubmit=!1,this.matchResult.autofillOnSuccess=e.autofillOnSuccess,this.matchResult.autosubmitOnSuccess=e.autosubmitOnSuccess,this.matchResult.notifyUserOnSuccess=e.notifyUserOnSuccess,this.matchResult.wrappers=[],this.matchResult.allMatchingLogins=[],this.matchResult.formRelevanceScores=[],this.matchResult.submitTargets=[],this.matchResult.usernameIndexArray=[],this.matchResult.passwordFieldsArray=[],this.matchResult.otherFieldsArray=[],this.matchResult.requestCount=0,this.matchResult.responseCount=0,this.matchResult.requestIds=[]}findMatchesInThisFrame(e={}){this.semanticWhitelistCache={},this.semanticBlacklistCache={},this.formFinderTimer!==null&&(clearTimeout(this.formFinderTimer),this.formFinderTimer=null),window.document.forms.length>50&&this.Logger.debug("Too many forms on this page. Assuming it is not a login page and avoiding looking for login forms in order to avoid performance impact.");let i=new Array;for(let r=0;r<window.document.forms.length;r++)i.push(window.document.forms.item(r));const o=this.scanForOrphanedFields(window.document);if(o&&(i=Array.prototype.slice.call(i),i.push(o)),!i||i.length==0){this.Logger.info("No forms found on this page.");return}const a=new URL(window.document.URL);a.hostname=Ci.toUnicode(a.hostname),this.Logger.info("Finding matches in a document. readyState: "+window.document.readyState),this.initMatchResult(e),this.matchResult.forms=i;const n=Pe.siteConfigFor(a.href);this.Logger.debug("findMatches processing "+i.length+" forms");let s=!1;for(let r=0;r<i.length;r++){const c=i[r];this.matchResult.entries[r]=[],this.matchResult.formRelevanceScores[r]=0,this.Logger.debug("about to get form fields");let l;try{l=this.formUtils.getFormFields(c,!1,50)}catch(P){this.Logger.debug("Lost interest in this form after finding too many fields"+P);continue}const d=l.actualUsernameIndex,u=l.pwFields,p=l.otherFields;let g=null;if(g=Pe.isFormInteresting(c,n,p.map(P=>P.field)),g===!1){this.Logger.debug("Lost interest in this form after inspecting field names and IDs");continue}const v=u==null||u.length<=0||u[0]==null,y=d<0||p==null||p.length<=0||p[d]==null;if(v&&(y||g!==!0)){this.Logger.debug("No password field found in this form and either there are no other fields or no whitelisted text field or form element");continue}let A;v?A=p[d].DOMelement:A=u[0].DOMelement,this.attachSubmitHandlers(c,A,r),this.matchResult.usernameIndexArray[r]=d,this.matchResult.passwordFieldsArray[r]=u,this.matchResult.otherFieldsArray[r]=p,this.matchResult.submitTargets[r]=A,s?(this.Logger.debug("form["+r+"]: reusing entries from last form."),this.findLoginOp.formIndexes.push(r)):(this.findLoginOp.forms=i,this.findLoginOp.formIndexes=[r],this.findLoginOp.wrappedBy=this.matchResult,this.matchResult.wrappers[r]=this.findLoginOp,this.matchResult.requestCount++,this.matchFinder(a.href),s=!0)}}async attachSubmitHandlers(e,i,o){try{await Promise.resolve();const a=performance.now(),n=this.findSubmitButton(e,i);this.formSaving.addSubmitHandler(n,e),ne.info("Submit handlers attached asynchronously to form "+o+" in "+(performance.now()-a)+"ms")}catch(a){ne.warn("Exception while adding submit handler. Message: "+a.message)}}scanForOrphanedFields(e){const i=new Date().getTime(),o=[];let a=null;const n=e.getElementsByTagName("input");for(const r of n)r.form||o.push(r);o.length>0&&(a={elements:o,id:"Kee-pseudo-form",name:"Kee-pseudo-form",ownerDocument:e,getElementsByTagName:function(){return this.elements},querySelectorAll:function(){return[]},submit:function(){},offsetParent:!0,addEventListener:function(){},removeEventListener:function(){}});const s=new Date().getTime();return this.Logger.debug("scanForOrphanedFields took: "+(s-i)),a}findLoginsResultHandler(e){if(!e)return;const i=e.filter(o=>et.getUsernameField(o)||et.getPasswordField(o));this.matchResult=this.getRelevanceOfLoginMatchesAgainstAllForms(i,this.findLoginOp,this.matchResult),this.fillAndSubmit(!0)}getRelevanceOfLoginMatchesAgainstAllForms(e,i,o){const a=JSON.stringify(e);let n=!1;for(let s=0;s<i.forms.length;s++){if(i.formIndexes.indexOf(s)==-1||(o.entries[s]=JSON.parse(a),o.entries[s].length==0))continue;this.Logger.info("match found!");const r=this.formUtils.isDOMElementVisible(o.submitTargets[s]);this.Logger.debug("formVisible: "+r);const c={other:o.otherFieldsArray[s].map(l=>this.formUtils.isDOMElementVisible(l.DOMelement)),password:o.passwordFieldsArray[s].map(l=>this.formUtils.isDOMElementVisible(l.DOMelement))};for(let l=0;l<o.entries[s].length;l++){const u={punishWrongIDAndName:rr.KeePassDatabases.find(v=>v.fileName===o.entries[s][l].database.fileName).sessionFeatures.indexOf("KPRPC_FIELD_DEFAULT_NAME_AND_ID_EMPTY")>=0},{score:p,lowFieldMatchRatio:g}=this.calculateRelevanceScore(o.entries[s][l],o.passwordFieldsArray[s],o.otherFieldsArray[s],o.currentPage,r,u,c);o.entries[s][l].relevanceScore=p,o.entries[s][l].lowFieldMatchRatio=g,o.entries[s][l].formIndex=s,o.entries[s][l].entryIndex=l,(!n||o.entries[s][l].relevanceScore>o.allMatchingLogins[l].relevanceScore)&&(this.Logger.debug("Higher relevance score found for entry "+l+" with formIndex "+o.entries[s][l].formIndex+" ("+i.forms[s].id+")"),o.allMatchingLogins[l]=o.entries[s][l])}n=!0,o.entries[s].forEach(function(l){l.relevanceScore>o.formRelevanceScores[s]&&(o.formRelevanceScores[s]=l.relevanceScore)}),this.Logger.debug("Relevance of form "+s+" ("+i.forms[s].id+") is "+o.formRelevanceScores[s])}return o}getMostRelevantForm(e){const i=this.matchResult;if(!i)return{bestFormIndex:0,bestRelevanceScore:0,bestFindMatchesResult:void 0};let o=0;return e>=0?o=e:i.formRelevanceScores.forEach((a,n)=>{this.Logger.debug("Relevance of form is "+a),a>i.formRelevanceScores[o]&&(o=n)}),this.Logger.debug("The most relevant form is #"+o),{bestFormIndex:o,bestRelevanceScore:i.formRelevanceScores[o],bestFindMatchesResult:i}}fillAndSubmit(e,i,o){this.Logger.debug("fillAndSubmit started. automated: "+e+", formIndex: "+i+", entryIndex: "+o);const a=this.matchResult;let n;if(!a)return;const s=!e&&(a.mostRelevantFormIndex!==null&&a.mostRelevantFormIndex>=0||typeof i<"u")&&typeof o<"u";s||(a.mostRelevantFormIndex=this.getMostRelevantForm().bestFormIndex),i!==null&&i>=0&&(a.mostRelevantFormIndex=i);const r=a.forms[a.mostRelevantFormIndex],c=a.passwordFieldsArray[a.mostRelevantFormIndex],l=a.otherFieldsArray[a.mostRelevantFormIndex],d=this.sortMatchedEntries(a.entries[a.mostRelevantFormIndex]),u=this.flagUserPreferredEntry(d);!s&&a.entries[a.mostRelevantFormIndex].length>0&&(this.myPort.postMessage({entries:u}),this.keeFieldIcon.addKeeIconToFields(c,l,u));let p=null,g={fill:!1,submit:!1},v=!1;if(a.cannotAutoFillForm=!1,a.cannotAutoSubmitForm=!1,e&&a.autofillOnSuccess===!1&&(a.cannotAutoFillForm=!0),e&&a.autosubmitOnSuccess===!1&&(a.cannotAutoSubmitForm=!0),!a.cannotAutoFillForm){this.Logger.debug("We are allowed to auto-fill this form."),o>=0&&(p=a.entries[a.mostRelevantFormIndex][o],a.UUID=null,a.dbFileName=null);let y=!1;if(p==null&&a.entries[a.mostRelevantFormIndex].length==1)p=a.entries[a.mostRelevantFormIndex][0],y=!0;else if(a.UUID!=null&&a.UUID!=null&&a.UUID!=""){this.Logger.debug("We've been told to use an entry with this UUID: "+a.UUID);for(let A=0;A<a.entries[a.mostRelevantFormIndex].length;A++)if(a.entries[a.mostRelevantFormIndex][A].uuid==a.UUID){p=a.entries[a.mostRelevantFormIndex][A];break}p==null&&this.Logger.warn("Could not find the required KeePass entry. Maybe the website redirected you to a different domain or hostname?")}else p==null&&(!a.entries[a.mostRelevantFormIndex]||!a.entries[a.mostRelevantFormIndex].length)?this.Logger.debug("No entries for form."):p==null&&(this.Logger.debug("Multiple entries for form, so using preferred or most relevant."),p=u.find(A=>A.isPreferredMatch)||u[0],v=!0,y=!0);if(e&&y&&p!=null&&(p.relevanceScore<1?(this.Logger.info("Our selected entry is not relevant enough to exceed our threshold so will not be auto-filled."),p=null):p.lowFieldMatchRatio&&(this.Logger.info("Our selected entry has a low field match ratio so will not be auto-filled."),p=null)),p!=null){const A=s||(e&&v&&!this.config.autoFillFormsWithMultipleMatches?!1:this.config.autoFillForms),P=s?this.config.autoSubmitMatchedForms:this.config.autoSubmitForms;if(g={fill:A,submit:P},s||(p.alwaysAutoFill&&(g.fill=!0),p.neverAutoFill&&(g.fill=!1)),(!s||!this.config.manualSubmitOverrideProhibited)&&(p.alwaysAutoSubmit&&(g.submit=!0),p.neverAutoSubmit&&(g.submit=!1)),g.fill||a.mustAutoFillForm){this.Logger.debug("Going to auto-fill a form");const H={punishWrongIDAndName:rr.KeePassDatabases.find(se=>se.fileName===p.database.fileName).sessionFeatures.indexOf("KPRPC_FIELD_DEFAULT_NAME_AND_ID_EMPTY")>=0},F=this.fillManyFormFields(l,p.fields.filter(se=>se.type!=="password"),-1,H,e),X=this.fillManyFormFields(c,p.fields.filter(se=>se.type==="password"),-1,H,e);a.formReadyForSubmit=!0,a.lastFilledPasswords=X,a.lastFilledOther=F,X&&X.length>0?n=X[0].DOMelement:F&&F.length>0&&(n=F[0].DOMelement),this.formSaving.updateMatchResult(a)}}}a.formReadyForSubmit&&(a.UUID==null||a.UUID==null||a.UUID=="")&&(this.Logger.debug("Syncing UUID to: "+p.uuid),a.UUID=p.uuid,a.dbFileName=p.database.fileName),!a.cannotAutoSubmitForm&&(g.submit||a.mustAutoSubmitForm)&&a.formReadyForSubmit?(this.Logger.info("Auto-submitting form..."),this.submitForm(r,n)):s?this.Logger.debug("Matched entry request is not being auto-submitted."):this.matchResult.allMatchingLogins.length>0?e?this.Logger.debug("Automatic form fill complete."):this.Logger.debug("Manual form fill complete."):this.Logger.info("Nothing to fill.")}sortMatchedEntries(e){return e.map(i=>new et({...i})).sort((i,o)=>o.relevanceScore-i.relevanceScore)}flagUserPreferredEntry(e){const i=new URL(window.document.URL);i.hostname=Ci.toUnicode(i.hostname);const o=Pe.siteConfigFor(i.href);return e.map(a=>new et({...a,isPreferredMatch:o.preferredEntryUuid===a.uuid}))}findSubmitButton(e,i){const o=[];let v=0;const y=(b,z)=>this.commonAncestorDistance(b,z,A),A=new Map,P=this.formUtils;function B(b,z){v>z+60+100||((P.isDOMElementVisible(b)||!P.isDOMElementVisible(i))&&(z+=60),v>z+100)||(o.push({distance:y(b,i),element:b,score:z}),v=z)}function H(b){var V;const z=[];return b.hasAttribute("aria-label")&&z.push(b.getAttribute("aria-label").toLowerCase()),(V=b.getAttribute("aria-labelledby"))==null||V.trim().split(" ").forEach(le=>{if(le){const U=e.ownerDocument.getElementById(le);U&&U.innerText&&z.push(U.innerText.toLowerCase())}}),z}if(Array.from(e.ownerDocument.getElementsByTagName("button")).forEach(b=>{if(b.isConnected&&(!b.type||b.type!="reset")){const z=[];b.name&&z.push(b.name.toLowerCase()),b.textContent&&z.push(b.textContent.toLowerCase()),b.value&&z.push(b.value.toLowerCase()),z.push(...H(b));let V=this.scoreAdjustmentForMagicWords(z,50,this.semanticWhitelistCache,this.semanticBlacklistCache);V+=b.form&&b.form==e?60:40,B(b,V)}}),Array.from(e.getElementsByTagName("input")).forEach(b=>{if(b.isConnected&&b.type!=null){let z=0;if(b.type=="submit"||b.type=="button"){b.name&&(z+=this.scoreAdjustmentForMagicWords([b.name.toLowerCase()],50,this.semanticWhitelistCache,this.semanticBlacklistCache));const V=[];b.value&&V.push(b.value.toLowerCase()),V.push(...H(b)),V.length>0&&(z+=this.scoreAdjustmentForMagicWords(V,40,this.semanticWhitelistCache,this.semanticBlacklistCache)),b.id&&(z+=this.scoreAdjustmentForMagicWords([b.id.toLowerCase()],20,this.semanticWhitelistCache,this.semanticBlacklistCache))}if(b.type=="submit"||b.type=="button"||b.type=="image"){let V=z;V+=b.type=="button"?30:b.type=="image"?40:50,B(b,V)}}}),Array.from(e.ownerDocument.querySelectorAll("[role=button]:not(button)")).forEach(b=>{if(!b.isConnected)return;const z=[];b.name&&z.push(b.name.toLowerCase()),b.id&&z.push(b.id.toLowerCase()),b.title&&z.push(b.title.toLowerCase()),b.innerText&&z.push(b.innerText.toLowerCase()),b.dataSet&&b.dataSet.length>0&&b.dataSet.tooltip&&z.push(b.dataSet.tooltip.toLowerCase()),z.push(...H(b));let V=this.scoreAdjustmentForMagicWords(z,50,this.semanticWhitelistCache,this.semanticBlacklistCache);V+=b.form&&b.form==e?20:10,B(b,V)}),o.length<=0)return null;if(o.length===1)return o[0].element;const F=o.sort((b,z)=>b.distance>z.distance?-1:b.distance<z.distance?1:0),X=F[0].distance-F[F.length-1].distance,se=Math.min(100,20*X);let D=1/F.length,M=F[0].distance;F.forEach((b,z,V)=>{b.distance<M&&(D=(z+1)/V.length,M=b.distance),b.score+=D*se});let f=F[0].score,w=F[0].element;for(let b=1;b<F.length;b++)F[b].score>f&&(f=F[b].score,w=F[b].element);return w}scoreAdjustmentForMagicWords(e,i,o,a){const n=["submit","login","enter","log in","signin","sign in","next","continue"],s=["reset","cancel","back","abort","undo","exit","empty","clear","captcha","totp","forgot","dismiss","delete","show","reveal"];let r=!1,c=!1;for(let l=0;l<e.length&&!r;l++){if(!e[l])continue;const d=e[l].trim();if(d){if(o[d]===!0){r=!0;break}if(o[d]!==!1)for(let u=0;u<n.length;u++)if(d.indexOf(n[u])>=0){r=!0,o[d]=!0;break}else o[d]=!1}}for(let l=0;l<e.length&&!c;l++){if(!e[l])continue;const d=e[l].trim();if(d){if(a[d]===!0){c=!0;break}if(a[d]!==!1)for(let u=0;u<s.length;u++)if(d.indexOf(s[u])>=0){c=!0,a[d]=!0;break}else a[d]=!1}}return r&&c?0:c?-1*i:r?i:0}commonAncestorDistance(e,i,o){let a=1,n=!1;const s=[];let r=0;for(;e=e.parentElement;){const c=o.get(e);if(c!==void 0){a+=c,r=c+1,n=!0;break}if(s.push(e),e.contains(i)){n=!0;break}a++}if(n){if(s.length>0)for(let c=r;c<a&&s.length>0;c++){const l=s.pop();o.set(l,c)}return a}else return 9007199254740991}submitForm(e,i){const o=this.findSubmitButton(e,i);this.formSaving.removeAllSubmitHandlers(),o!=null?(this.Logger.debug("Submiting using element: "+o.name+": "+o.id),o.click()):(this.Logger.debug("Submiting using form"),e.submit())}calculateRelevanceScore(e,i,o,a,n,s,r){let c=0,l=!1;c+=e.matchAccuracy,n||(c-=20);const d=.501,[u,p]=this.determineRelevanceScores("other",o,e.fields.filter(f=>f.type!=="password"),a,s,r.other),[g,v]=this.determineRelevanceScores("password",i,e.fields.filter(f=>f.type==="password"),a,s,r.password),y=u+g,A=i.concat(o).filter(f=>f.field.locators[0].id||f.field.locators[0].name||f.field.value).length,P=e.fields.filter(f=>f.locators[0].id||f.locators[0].name||f.value).length,B=i.concat(o).filter(f=>(f.field.type==="password"||f.field.type==="text")&&(f.field.locators[0].id||f.field.locators[0].name)).length,H=e.fields.filter(f=>(f.type==="password"||f.type==="text")&&(f.locators[0].id||f.locators[0].name||f.value)).length,F=p.filter(f=>f===!0).length+v.filter(f=>f===!0).length,X=i.filter(f=>{var w;return(w=f.field.locators[0].autocompleteValues)==null?void 0:w.some(b=>b==="new-password")}).length,se=Math.min(H+X,F)/Math.max(1,B);this.Logger.debug("formFieldCount: "+A+", loginFieldCount: "+P+", loginFieldCountForAutofill: "+H+", formFieldCountForAutofill: "+B+", formMatchedFieldCountForAutofill: "+F+", numberOfNewPasswordFields: "+X+", fieldMatchRatio: "+se),se<d&&(this.Logger.info(e.uuid+" will be forced to not auto-fill because the form field match ratio ("+se+") is not high enough."),l=!0);const M=y/Math.max(A,P)/(Math.abs(A-P)+1);return c+=M,this.Logger.info("Relevance for "+e.uuid+" is: "+c),{score:c,lowFieldMatchRatio:l}}determineRelevanceScores(e,i,o,a,n,s){var d;let r=0;const c=1,l=[];for(let u=0;u<i.length;u++){let p=0;const g=i[u].field;(d=g.locators[0].autocompleteValues)!=null&&d.some(v=>v==="new-password")&&(l[u]=!0);for(let v=0;v<o.length;v++){const y=this.calculateFieldMatchScore(i[u],o[v],a,n,s[u]);this.Logger.debug("Suitability of putting "+e+" field "+v+" into form field "+u+" (id: "+g.locators[0].id+") is "+y),y>p&&(p=y);const A=y-(s[u]?0:10);(g.type==="text"||g.type==="password")&&A>=c&&o[v].value&&!l[u]&&(l[u]=!0),(i[u].highestScore==null||y>i[u].highestScore)&&(i[u].highestScore=y)}r+=p}return[r,l]}removeKeeIconFromAllFields(){this.keeFieldIcon.removeKeeIconFromAllFields()}}class Em{}class Fm{constructor(e){this.findLoginOps=[],this.matchResults=[],this.Logger=e}countAllDocuments(e){if(!this.isUriWeCanFill(e.location))return 0;let i=1;if(e.frames.length>0){const o=e.frames;for(let a=0;a<o.length;a++)i+=this.countAllDocuments(o[a])}return i}isUriWeCanFill(e){return e.protocol=="http:"||e.protocol=="https:"||e.protocol=="file:"}isATextFormFieldType(e){return!(e=="checkbox"||e=="select-one"||e=="radio"||e=="password"||e=="hidden"||e=="submit"||e=="button"||e=="file"||e=="image"||e=="reset")}isAKnownUsernameString(e){const i=e.toLowerCase();return i=="username"||i=="j_username"||i=="user_name"||i=="user"||i=="user-name"||i=="login"||i=="vb_login_username"||i=="name"||i=="user name"||i=="user id"||i=="user-id"||i=="userid"||i=="email"||i=="e-mail"||i=="id"||i=="form_loginname"||i=="wpname"||i=="mail"||i=="loginid"||i=="login id"||i=="login_name"||i=="openid_identifier"||i=="authentication_email"||i=="openid"||i=="auth_email"||i=="auth_id"||i=="authentication_identifier"||i=="authentication_id"||i=="customer_number"||i=="customernumber"||i=="onlineid"}getFormFields(e,i,o){var v;const a=[],n=[],s=[];let r=-1,c=-1,l=-1;const d=e.elements.length,u=d<2e3?d:2e3;for(let y=0;y<u;y++){if(s.length>o)throw new Error("Too many fields");if(e.elements[y].localName.toLowerCase()=="object"||e.elements[y].localName.toLowerCase()=="keygen"||e.elements[y].localName.toLowerCase()=="output"||e.elements[y].localName.toLowerCase()!="input"&&(e.elements[y].type==null||e.elements[y].type==null))continue;const A=e.elements[y].type.toLowerCase();if(A=="fieldset"||A!="password"&&!this.isATextFormFieldType(A)&&A!="checkbox"&&A!="radio"&&A!="select-one"||A=="radio"&&i&&e.elements[y].checked==!1||A=="password"&&i&&!e.elements[y].value||A=="select-one"&&i&&!e.elements[y].value)continue;this.Logger.debug(`processing field with domtype ${A}...`),s[s.length]={index:y,element:new Em,type:A};let P=e.elements[y].value;A=="checkbox"&&(e.elements[y].checked?P="KEEFOX_CHECKED_FLAG_TRUE":P="KEEFOX_CHECKED_FLAG_FALSE");const B=xe.fromDOM(e.elements[y],A,P);s[s.length-1].element.field=B,s[s.length-1].element.DOMelement=e.elements[y],A=="password"&&r==-1&&(r=s.length-1),this.isATextFormFieldType(A)&&c==-1&&(this.isAKnownUsernameString(e.elements[y].name)||(v=B.locators[0].labels)!=null&&v.some(H=>this.isAKnownUsernameString(H)))&&(c=s.length-1),e.elements[y].keeInitialDetectedValue==null&&(e.elements[y].keeInitialDetectedValue=P)}c!=-1?l=c:r>0&&(l=r-1),this.Logger.debug("usernameIndex: "+l);let p=0,g=0;for(let y=0;y<s.length;y++)s[y].type=="password"?a[a.length]=s[y].element:(this.isATextFormFieldType(s[y].type)||s[y].type=="checkbox"||s[y].type=="radio"||s[y].type=="select-one")&&(n[n.length]=s[y].element,y==l?g=p:p++);return this.Logger.debug("actualUsernameIndex: "+g),this.Logger.debug("otherFields.length:"+n.length),{actualUsernameIndex:g,pwFields:a,otherFields:n}}isDOMElementVisible(e){return!(!e.offsetParent&&e.offsetHeight===0&&e.offsetWidth===0)}}class Bm{constructor(e,i,o){this.myPort=e,this.SubmitHandlerAttachments=[],this.Logger=i,this.formUtils=o}addSubmitHandler(e,i){const o=a=>this.submitHandler(a,i);this.SubmitHandlerAttachments.push({target:e,form:i,handler:o}),e&&e.addEventListener("click",o),i.addEventListener("submit",o)}removeAllSubmitHandlers(){this.SubmitHandlerAttachments.forEach(e=>{e.target&&e.target.removeEventListener("click",e.handler),e.form.removeEventListener("submit",e.handler)}),this.SubmitHandlerAttachments=[]}updateMatchResult(e){this.matchResult=e}submitHandler(e,i){this.Logger.debug("submitHandler called"),this.removeAllSubmitHandlers();const o=i.ownerDocument,a=new URL(o.URL);if(a.hostname=Ci.toUnicode(a.hostname),Pe.siteConfigFor(a.href).preventSaveNotification)return;let s=!1,r=!1;const c=[];let l;try{l=this.formUtils.getFormFields(i,!0,50)}catch(P){this.Logger.warn("Lost interest in this form after finding too many fields"+P);return}const d=l.actualUsernameIndex,u=l.pwFields,p=l.otherFields;if(u.length>1){let P=-1;for(let B=0;B<u.length&&P==-1;B++)for(let H=B+1;H<u.length&&P==-1;H++)u[H].field.value==u[B].field.value&&(P=H);if(P==-1){this.Logger.debug("multiple passwords found (with no identical values)");for(let B=0;B<u.length;B++)c.push(u[B])}else this.Logger.debug("Looks like a password change form or new registration form has been submitted"),u.length==2?(c.push(u[0]),s=!1,r=!0):(s=!1,r=!1,c.push(u[P]))}else u!=null&&u[0]!=null&&u[0]!=null&&c.push(u[0]);const g=this.removeEmptyFields(c),v=this.removeEmptyFields(p),y=!this.matchResult||!this.matchResult.lastFilledPasswords||this.hasFieldBeenModified(g,this.matchResult.lastFilledPasswords),A=!this.matchResult||!this.matchResult.lastFilledOther||this.hasFieldBeenModified(v,this.matchResult.lastFilledOther);if(y||A){const P={url:a.href,fields:xe.combineDomFieldLists(d,v.map(B=>B.field),g.map(B=>B.field)),title:o.title||a.hostname,isPasswordChangeForm:s,isRegistrationForm:r};this.myPort.postMessage({submittedData:P})}}removeEmptyFields(e){return e.filter(i=>i.field.value||i.field.type==="boolean")}hasFieldBeenModified(e,i){return!!i.find(o=>{const a=e.find(n=>o.DOMelement==n.DOMelement);return!a||a.field.value!=o.value})}}const cr=jt.GeneratePassword;class Om{constructor(e){this.parentFrameId=e}createGeneratePasswordPanel(){this.closeGeneratePasswordPanel(),this.generatePasswordPanelStub=new ti(cr,null,this.parentFrameId),this.generatePasswordPanelStub.createPanel()}createGeneratePasswordPanelNearNode(e){this.closeGeneratePasswordPanel(),this.generatePasswordPanelStub=new ti(cr,e,this.parentFrameId),this.generatePasswordPanelStub.createPanel(),this.generatePasswordPanelStubRaf=requestAnimationFrame(()=>this.updateGeneratePasswordPanelPosition())}closeGeneratePasswordPanel(){this.generatePasswordPanelStub&&this.generatePasswordPanelStub.closePanel(),this.generatePasswordPanelStub=null,cancelAnimationFrame(this.generatePasswordPanelStubRaf)}updateGeneratePasswordPanelPosition(){this.generatePasswordPanelStub.updateBoundingClientRect(),this.generatePasswordPanelStubRaf=requestAnimationFrame(()=>this.updateGeneratePasswordPanelPosition())}}class Dm{constructor(){this.receivedPayloads=[],this.initialized=!1,this.pendingMutations=[]}init(e,i,o,a){this.store=e,this.store.$subscribe(n=>{if(n.type==De.patchObject)this.handleLocallyGeneratedMutation(n);else throw new Error("Pinia generated a non-object mutation. We don't think we can support this and need to know that it is possible for it to happen! Tell us now or weird things will happen.")}),this.sendMutationPayload=o,this.store.$patch(i),this.initialized=!0,this.processPendingLocallySourcedMutations(),a&&a()}reset(e){this.store.$patch(e)}onRemoteMutationPayload(e){this.initialized&&(ne.warn("processing payload: "+JSON.stringify(e)),this.receivedPayloads.push(e),this.store.$patch(e))}handleLocallyGeneratedMutation(e){if(!this.initialized)return this.pendingMutations.push(e);if(!this.receivedPayloads.length)return this.sendMutationPayload(e.payload);for(let i=this.receivedPayloads.length-1;i>=0;i--)if(zo(this.receivedPayloads[i],e.payload)){ne.debug("payload is deepequal"),this.receivedPayloads.splice(i,1);break}else i==0&&(ne.debug("payload is not deepequal to any remotely received payload so will send"),this.sendMutationPayload(e.payload))}processPendingLocallySourcedMutations(){if(this.pendingMutations.length)for(let e=0;e<this.pendingMutations.length;e++)this.sendMutationPayload(this.pendingMutations[e].payload),this.pendingMutations.splice(e,1)}}class Nm{postMessage(e){this.port.postMessage(e)}startup(e){this.port=Me.runtime.connect({name:e})}shutdown(){this.port=null}get raw(){return this.port}}const Ce=new Nm;var ji;ji?ne&&ne.error?ne.error("Duplicate Kee content script instance detected! Found this many other instances: "+ji):console.error("Duplicate Kee content script instance detected! Found this many other instances: "+ji):ji=0,ji+=1;let wo,ge,vi,jo,vo,So,Na=!1,lr,ur=!1,mr=!1,dr,Ua;if(document.body){let t=function(s){Ce.postMessage({findMatches:{uri:s}})},e=function(){if(window.location.hostname.endsWith("tutorial-addon.kee.pm")){const s=document.createElement("KeeFoxAddonStateTransferElement");s.setAttribute("state",JSON.stringify({connected:n.connected,version:Me.runtime.getManifest().version,dbLoaded:n.KeePassDatabases.length>0,sessionNames:n.KeePassDatabases.map(c=>c.sessionType.toString()).filter((c,l,d)=>d.indexOf(c)===l)})),document.documentElement.appendChild(s);const r=new Event("KeeFoxAddonStateTransferEvent",{bubbles:!0,cancelable:!1});s.dispatchEvent(r)}},i=function(s){vo=s,ne.attachConfig(Pe.current),wo=new Fm(ne),vi=new Bm(Ce.raw,ne,wo),ge=new _m(Ce.raw,vo,wo,vi,ne,Pe.current,t),jo=new Om(vo),Ua.observe(document.body,{childList:!0,subtree:!0}),e()},o=function(){ne.debug("content page starting");try{a(),Ce.raw==null&&ne.warn("Failed to connect to messaging port. We'll try again later.")}catch(s){ne.warn("Failed to connect to messaging port. We'll try again later. Exception message: "+s.message)}lr=window.setInterval(()=>{if(Ce.raw==null){ne.info("Messaging port was not established at page startup. Retrying now...");try{a(),Ce.raw==null&&ne.warn("Failed to connect to messaging port. We'll try again later.")}catch(s){ne.warn("Failed to connect to messaging port. We'll try again later. Exception message: "+s.message)}}else clearInterval(lr)},5e3),ne.debug("content page ready")},a=function(){if(Ce.raw){ne.warn("port already set to '"+Ce.raw.name+"'. Skipping startup because it should already be underway but is taking a long time.");return}So=new Dm,Ce.startup("page"),Ce.raw.onMessage.addListener(function(s){if(ne.debug("In browser content page script, received message from background script"),s.initialState&&So.init(n,s.initialState,r=>{const c=JSON.stringify(r);ne.debug("New non-background page mutation: "+c),Ce.postMessage({mutation:JSON.parse(c)})}),s.mutation){So.onRemoteMutationPayload(s.mutation);return}Na?s.action==Ve.DetectForms&&(s.resetState&&So.reset(s.resetState),ge.removeKeeIconFromAllFields(),vi.removeAllSubmitHandlers(),n.entryUpdateStartedAtTimestamp>=Date.now()-2e4?ge.findMatchesInThisFrame({autofillOnSuccess:!1,autosubmitOnSuccess:!1}):ge.findMatchesInThisFrame()):(i(s.frameId),ge.findMatchesInThisFrame(),Na=!0),s.findMatchesResult&&ge.findLoginsResultHandler(s.findMatchesResult),s.action==Ve.ManualFill&&s.selectedEntryIndex!=null&&(ge.closeMatchedLoginsPanel(),ge.fillAndSubmit(!1,null,s.selectedEntryIndex)),s.action==Ve.ResetForms&&(ge.removeKeeIconFromAllFields(),vi.removeAllSubmitHandlers()),s.action==Ve.Primary&&ge.executePrimaryAction(),s.action==Ve.GeneratePassword&&jo.createGeneratePasswordPanel(),s.action==Ve.CloseAllPanels&&(jo.closeGeneratePasswordPanel(),ge.closeMatchedLoginsPanel()),s.action==Ve.ShowMatchedLoginsPanel&&ge.createMatchedLoginsPanelInCenter(s.frameId)})};const n=Tm();Ua=new MutationObserver(s=>{if(ge.formFinderTimer!==null||!n.connected||n.ActiveKeePassDatabaseIndex<0)return;let r=!1;const c=["form","input","select"];s.forEach(l=>{if(!r&&l.type==="childList"&&l.addedNodes.length>0)for(const d of l.addedNodes){if(r)break;for(let u=0;u<c.length;u++){const p=d;if(p.querySelector&&p.querySelector(c[u])){r=!0;break}}}}),r&&(ge.formFinderTimer=window.setTimeout(ge.findMatchesInThisFrame.bind(ge),500))}),window.addEventListener("pageshow",()=>{ur=!0,clearTimeout(dr),mr&&o()}),window.addEventListener("pagehide",()=>{Ua.disconnect(),Ce.raw&&Ce.postMessage({action:Ve.PageHide}),ge.removeKeeIconFromAllFields(),Ce.shutdown(),Na=!1,vo=void 0,wo=void 0,vi=void 0,ge=void 0,jo=void 0}),Pe.load(()=>{mr=!0,ur?o():dr=window.setTimeout(o,1500)})}})();