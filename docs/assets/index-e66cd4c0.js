var oe=Object.defineProperty;var se=(e,t,n)=>t in e?oe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var at=(e,t,n)=>(se(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const c of i)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const c={};return i.integrity&&(c.integrity=i.integrity),i.referrerPolicy&&(c.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?c.credentials="include":i.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(i){if(i.ep)return;i.ep=!0;const c=n(i);fetch(i.href,c)}})();function O(){}const st=e=>e;function xt(e,t){for(const n in t)e[n]=t[n];return e}function Gt(e){return e()}function Lt(){return Object.create(null)}function L(e){e.forEach(Gt)}function z(e){return typeof e=="function"}function X(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function le(e){return Object.keys(e).length===0}function ce(e,...t){if(e==null)return O;const n=e.subscribe(...t);return n.unsubscribe?()=>n.unsubscribe():n}function Jt(e,t,n){e.$$.on_destroy.push(ce(t,n))}function Rt(e){return e??""}function ue(e,t,n){return e.set(n),t}const Kt=typeof window<"u";let lt=Kt?()=>window.performance.now():()=>Date.now(),wt=Kt?e=>requestAnimationFrame(e):O;const G=new Set;function Ut(e){G.forEach(t=>{t.c(e)||(G.delete(t),t.f())}),G.size!==0&&wt(Ut)}function ct(e){let t;return G.size===0&&wt(Ut),{promise:new Promise(n=>{G.add(t={c:e,f:n})}),abort(){G.delete(t)}}}function $(e,t){e.appendChild(t)}function Qt(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function fe(e){const t=w("style");return ae(Qt(e),t),t.sheet}function ae(e,t){return $(e.head||e,t),t.sheet}function M(e,t,n){e.insertBefore(t,n||null)}function S(e){e.parentNode&&e.parentNode.removeChild(e)}function w(e){return document.createElement(e)}function Y(e){return document.createTextNode(e)}function N(){return Y(" ")}function de(){return Y("")}function P(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function vt(e){return function(t){return t.preventDefault(),e.call(this,t)}}function E(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function pe(e){return Array.from(e.childNodes)}function St(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function At(e,t){e.value=t??""}function rt(e,t,n){e.classList[n?"add":"remove"](t)}function _e(e,t,{bubbles:n=!1,cancelable:r=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(e,n,r,t),i}const it=new Map;let ot=0;function he(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}function ge(e,t){const n={stylesheet:fe(t),rules:{}};return it.set(e,n),n}function Q(e,t,n,r,i,c,l,o=0){const a=16.666/r;let u=`{
`;for(let d=0;d<=1;d+=a){const m=t+(n-t)*c(d);u+=d*100+`%{${l(m,1-m)}}
`}const _=u+`100% {${l(n,1-n)}}
}`,h=`__svelte_${he(_)}_${o}`,g=Qt(e),{stylesheet:f,rules:s}=it.get(g)||ge(g,e);s[h]||(s[h]=!0,f.insertRule(`@keyframes ${h} ${_}`,f.cssRules.length));const p=e.style.animation||"";return e.style.animation=`${p?`${p}, `:""}${h} ${r}ms linear ${i}ms 1 both`,ot+=1,h}function V(e,t){const n=(e.style.animation||"").split(", "),r=n.filter(t?c=>c.indexOf(t)<0:c=>c.indexOf("__svelte")===-1),i=n.length-r.length;i&&(e.style.animation=r.join(", "),ot-=i,ot||me())}function me(){wt(()=>{ot||(it.forEach(e=>{const{ownerNode:t}=e.stylesheet;t&&S(t)}),it.clear())})}function Vt(e,t,n,r){if(!t)return O;const i=e.getBoundingClientRect();if(t.left===i.left&&t.right===i.right&&t.top===i.top&&t.bottom===i.bottom)return O;const{delay:c=0,duration:l=300,easing:o=st,start:a=lt()+c,end:u=a+l,tick:_=O,css:h}=n(e,{from:t,to:i},r);let g=!0,f=!1,s;function p(){h&&(s=Q(e,0,1,l,c,o,h)),c||(f=!0)}function d(){h&&V(e,s),g=!1}return ct(m=>{if(!f&&m>=a&&(f=!0),f&&m>=u&&(_(1,0),d()),!g)return!1;if(f){const b=m-a,v=0+1*o(b/l);_(v,1-v)}return!0}),p(),_(0,1),d}function Xt(e){const t=getComputedStyle(e);if(t.position!=="absolute"&&t.position!=="fixed"){const{width:n,height:r}=t,i=e.getBoundingClientRect();e.style.position="absolute",e.style.width=n,e.style.height=r,Ot(e,i)}}function Ot(e,t){const n=e.getBoundingClientRect();if(t.left!==n.left||t.top!==n.top){const r=getComputedStyle(e),i=r.transform==="none"?"":r.transform;e.style.transform=`${i} translate(${t.left-n.left}px, ${t.top-n.top}px)`}}let Tt;function U(e){Tt=e}const W=[],Ft=[];let J=[];const Pt=[],ye=Promise.resolve();let ht=!1;function be(){ht||(ht=!0,ye.then(Yt))}function F(e){J.push(e)}const dt=new Set;let D=0;function Yt(){if(D!==0)return;const e=Tt;do{try{for(;D<W.length;){const t=W[D];D++,U(t),$e(t.$$)}}catch(t){throw W.length=0,D=0,t}for(U(null),W.length=0,D=0;Ft.length;)Ft.pop()();for(let t=0;t<J.length;t+=1){const n=J[t];dt.has(n)||(dt.add(n),n())}J.length=0}while(W.length);for(;Pt.length;)Pt.pop()();ht=!1,dt.clear(),U(e)}function $e(e){if(e.fragment!==null){e.update(),L(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(F)}}function ke(e){const t=[],n=[];J.forEach(r=>e.indexOf(r)===-1?t.push(r):n.push(r)),n.forEach(r=>r()),J=t}let K;function Ct(){return K||(K=Promise.resolve(),K.then(()=>{K=null})),K}function B(e,t,n){e.dispatchEvent(_e(`${t?"intro":"outro"}${n}`))}const tt=new Set;let A;function gt(){A={r:0,c:[],p:A}}function mt(){A.r||L(A.c),A=A.p}function j(e,t){e&&e.i&&(tt.delete(e),e.i(t))}function I(e,t,n,r){if(e&&e.o){if(tt.has(e))return;tt.add(e),A.c.push(()=>{tt.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}else r&&r()}const Et={duration:0};function Zt(e,t,n){const r={direction:"in"};let i=t(e,n,r),c=!1,l,o,a=0;function u(){l&&V(e,l)}function _(){const{delay:g=0,duration:f=300,easing:s=st,tick:p=O,css:d}=i||Et;d&&(l=Q(e,0,1,f,g,s,d,a++)),p(0,1);const m=lt()+g,b=m+f;o&&o.abort(),c=!0,F(()=>B(e,!0,"start")),o=ct(v=>{if(c){if(v>=b)return p(1,0),B(e,!0,"end"),u(),c=!1;if(v>=m){const T=s((v-m)/f);p(T,1-T)}}return c})}let h=!1;return{start(){h||(h=!0,V(e),z(i)?(i=i(r),Ct().then(_)):_())},invalidate(){h=!1},end(){c&&(u(),c=!1)}}}function te(e,t,n){const r={direction:"out"};let i=t(e,n,r),c=!0,l;const o=A;o.r+=1;function a(){const{delay:u=0,duration:_=300,easing:h=st,tick:g=O,css:f}=i||Et;f&&(l=Q(e,1,0,_,u,h,f));const s=lt()+u,p=s+_;F(()=>B(e,!1,"start")),ct(d=>{if(c){if(d>=p)return g(0,1),B(e,!1,"end"),--o.r||L(o.c),!1;if(d>=s){const m=h((d-s)/_);g(1-m,m)}}return c})}return z(i)?Ct().then(()=>{i=i(r),a()}):a(),{end(u){u&&i.tick&&i.tick(1,0),c&&(l&&V(e,l),c=!1)}}}function jt(e,t,n,r){const i={direction:"both"};let c=t(e,n,i),l=r?0:1,o=null,a=null,u=null;function _(){u&&V(e,u)}function h(f,s){const p=f.b-l;return s*=Math.abs(p),{a:l,b:f.b,d:p,duration:s,start:f.start,end:f.start+s,group:f.group}}function g(f){const{delay:s=0,duration:p=300,easing:d=st,tick:m=O,css:b}=c||Et,v={start:lt()+s,b:f};f||(v.group=A,A.r+=1),o||a?a=v:(b&&(_(),u=Q(e,l,f,p,s,d,b)),f&&m(0,1),o=h(v,p),F(()=>B(e,f,"start")),ct(T=>{if(a&&T>a.start&&(o=h(a,p),a=null,B(e,o.b,"start"),b&&(_(),u=Q(e,l,o.b,o.duration,0,d,c.css))),o){if(T>=o.end)m(l=o.b,1-l),B(e,o.b,"end"),a||(o.b?_():--o.group.r||L(o.group.c)),o=null;else if(T>=o.start){const C=T-o.start;l=o.a+o.d*d(C/o.duration),m(l,1-l)}}return!!(o||a)}))}return{run(f){z(c)?Ct().then(()=>{c=c(i),g(f)}):g(f)},end(){_(),o=a=null}}}function ee(e,t){I(e,1,1,()=>{t.delete(e.key)})}function Bt(e,t){e.f(),ee(e,t)}function yt(e,t,n,r,i,c,l,o,a,u,_,h){let g=e.length,f=c.length,s=g;const p={};for(;s--;)p[e[s].key]=s;const d=[],m=new Map,b=new Map,v=[];for(s=f;s--;){const y=h(i,c,s),x=n(y);let R=l.get(x);R?r&&v.push(()=>R.p(y,t)):(R=u(x,y),R.c()),m.set(x,d[s]=R),x in p&&b.set(x,Math.abs(s-p[x]))}const T=new Set,C=new Set;function k(y){j(y,1),y.m(o,_),l.set(y.key,y),_=y.first,f--}for(;g&&f;){const y=d[f-1],x=e[g-1],R=y.key,Z=x.key;y===x?(_=y.first,g--,f--):m.has(Z)?!l.has(R)||T.has(R)?k(y):C.has(Z)?g--:b.get(R)>b.get(Z)?(C.add(R),k(y)):(T.add(Z),g--):(a(x,l),g--)}for(;g--;){const y=e[g];m.has(y.key)||a(y,l)}for(;f;)k(d[f-1]);return L(v),d}function pt(e){e&&e.c()}function et(e,t,n,r){const{fragment:i,after_update:c}=e.$$;i&&i.m(t,n),r||F(()=>{const l=e.$$.on_mount.map(Gt).filter(z);e.$$.on_destroy?e.$$.on_destroy.push(...l):L(l),e.$$.on_mount=[]}),c.forEach(F)}function nt(e,t){const n=e.$$;n.fragment!==null&&(ke(n.after_update),L(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function we(e,t){e.$$.dirty[0]===-1&&(W.push(e),be(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ut(e,t,n,r,i,c,l,o=[-1]){const a=Tt;U(e);const u=e.$$={fragment:null,ctx:[],props:c,update:O,not_equal:i,bound:Lt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(a?a.$$.context:[])),callbacks:Lt(),dirty:o,skip_bound:!1,root:t.target||a.$$.root};l&&l(u.root);let _=!1;if(u.ctx=n?n(e,t.props||{},(h,g,...f)=>{const s=f.length?f[0]:g;return u.ctx&&i(u.ctx[h],u.ctx[h]=s)&&(!u.skip_bound&&u.bound[h]&&u.bound[h](s),_&&we(e,h)),g}):[],u.update(),_=!0,L(u.before_update),u.fragment=r?r(u.ctx):!1,t.target){if(t.hydrate){const h=pe(t.target);u.fragment&&u.fragment.l(h),h.forEach(S)}else u.fragment&&u.fragment.c();t.intro&&j(e.$$.fragment),et(e,t.target,t.anchor,t.customElement),Yt()}U(a)}class ft{$destroy(){nt(this,1),this.$destroy=O}$on(t,n){if(!z(n))return O;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(t){this.$$set&&!le(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function ve(e){return typeof e=="object"}function Se(e){return e instanceof Array}class Oe{constructor(){at(this,"subs",new Set);at(this,"subscribe",t=>(t(this._dat()),this.subs.add(t),()=>{this.subs.delete(t)}))}refresh(){const t=this._dat();this.subs.forEach(n=>n(t))}_dat(){return Array.from(Mt.values())}}const _t="rawTodos",Mt=new Map;let bt=0;function Te(e){return ve(e)&&typeof e.description=="string"&&typeof e.done=="boolean"}const q=new Oe;function ne(e,t=!0){e.id||(e.id=++bt),Mt.set(e.id,e),t&&q.refresh()}function Ce(e,t=!0){Mt.delete(e.id),t&&q.refresh()}const re={todos:q,add:ne,remove:Ce};if(localStorage){let e;try{e=JSON.parse(localStorage.getItem(_t))}catch(t){localStorage.removeItem(_t),console.error("Error while initializing Todos: ",t)}Se(e)&&(e=e.filter(t=>Te(t)?(t.id&&(typeof(t==null?void 0:t.id)=="number"?bt=Math.max(bt,t.id):delete t.id),!0):!1),e.forEach(t=>ne(t,!1))),q.subscribe(t=>localStorage.setItem(_t,JSON.stringify(t)))}const H=[];function Ee(e,t=O){let n;const r=new Set;function i(o){if(X(e,o)&&(e=o,n)){const a=!H.length;for(const u of r)u[1](),H.push(u,e);if(a){for(let u=0;u<H.length;u+=2)H[u][0](H[u+1]);H.length=0}}}function c(o){i(o(e))}function l(o,a=O){const u=[o,a];return r.add(u),r.size===1&&(n=t(i)||O),o(e),()=>{r.delete(u),r.size===0&&n&&(n(),n=null)}}return{set:i,update:c,subscribe:l}}function Nt(e){const t=e-1;return t*t*t+1}function Me(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}function $t(e,{delay:t=0,duration:n=400,easing:r=Nt,axis:i="y"}={}){const c=getComputedStyle(e),l=+c.opacity,o=i==="y"?"height":"width",a=parseFloat(c[o]),u=i==="y"?["top","bottom"]:["left","right"],_=u.map(m=>`${m[0].toUpperCase()}${m.slice(1)}`),h=parseFloat(c[`padding${_[0]}`]),g=parseFloat(c[`padding${_[1]}`]),f=parseFloat(c[`margin${_[0]}`]),s=parseFloat(c[`margin${_[1]}`]),p=parseFloat(c[`border${_[0]}Width`]),d=parseFloat(c[`border${_[1]}Width`]);return{delay:t,duration:n,easing:r,css:m=>`overflow: hidden;opacity: ${Math.min(m*20,1)*l};${o}: ${m*a}px;padding-${u[0]}: ${m*h}px;padding-${u[1]}: ${m*g}px;margin-${u[0]}: ${m*f}px;margin-${u[1]}: ${m*s}px;border-${u[0]}-width: ${m*p}px;border-${u[1]}-width: ${m*d}px;`}}function Ne(e){var{fallback:t}=e,n=Me(e,["fallback"]);const r=new Map,i=new Map;function c(o,a,u){const{delay:_=0,duration:h=y=>Math.sqrt(y)*30,easing:g=Nt}=xt(xt({},n),u),f=o.getBoundingClientRect(),s=a.getBoundingClientRect(),p=f.left-s.left,d=f.top-s.top,m=f.width/s.width,b=f.height/s.height,v=Math.sqrt(p*p+d*d),T=getComputedStyle(a),C=T.transform==="none"?"":T.transform,k=+T.opacity;return{delay:_,duration:z(h)?h(v):h,easing:g,css:(y,x)=>`
				opacity: ${y*k};
				transform-origin: top left;
				transform: ${C} translate(${x*p}px,${x*d}px) scale(${y+(1-y)*m}, ${y+(1-y)*b});
			`}}function l(o,a,u){return(_,h)=>(o.set(h.key,_),()=>{if(a.has(h.key)){const g=a.get(h.key);return a.delete(h.key),c(g,_,h)}return o.delete(h.key),t&&t(_,h,u)})}return[l(i,r,!1),l(r,i,!0)]}function It(e,t,n){const r=e.slice();return r[3]=t[n],r}function qt(e,t){let n,r=t[3].msg+"",i,c,l,o,a;return{key:e,first:null,c(){n=w("article"),i=Y(r),c=N(),E(n,"class",l=Rt(t[3].cssClass)+" svelte-lwkk25"),this.first=n},m(u,_){M(u,n,_),$(n,i),$(n,c),a=!0},p(u,_){t=u,(!a||_&1)&&r!==(r=t[3].msg+"")&&St(i,r),(!a||_&1&&l!==(l=Rt(t[3].cssClass)+" svelte-lwkk25"))&&E(n,"class",l)},i(u){a||(F(()=>{o||(o=jt(n,$t,{duration:250},!0)),o.run(1)}),a=!0)},o(u){o||(o=jt(n,$t,{duration:250},!1)),o.run(0),a=!1},d(u){u&&S(n),u&&o&&o.end()}}}function xe(e){let t,n=[],r=new Map,i,c=e[0];const l=o=>o[3].id;for(let o=0;o<c.length;o+=1){let a=It(e,c,o),u=l(a);r.set(u,n[o]=qt(u,a))}return{c(){t=w("div");for(let o=0;o<n.length;o+=1)n[o].c();E(t,"class","toastcontainer svelte-lwkk25")},m(o,a){M(o,t,a);for(let u=0;u<n.length;u+=1)n[u]&&n[u].m(t,null);i=!0},p(o,[a]){a&1&&(c=o[0],gt(),n=yt(n,a,l,1,o,c,r,t,ee,qt,null,It),mt())},i(o){if(!i){for(let a=0;a<c.length;a+=1)j(n[a]);i=!0}},o(o){for(let a=0;a<n.length;a+=1)I(n[a]);i=!1},d(o){o&&S(t);for(let a=0;a<n.length;a+=1)n[a].d()}}}let Le=1;const kt=Ee([]);function Re(e,t,n=4){kt.update(r=>(r.push({id:Le++,msg:e,cssClass:t,timeout:n}),r))}function Ae(e,t,n){let r;Jt(e,kt,l=>n(0,r=l));let i;function c(){!i&&r.length&&(i=window.setTimeout(()=>{r.forEach(l=>l.timeout--),ue(kt,r=r.filter(l=>l.timeout>0),r),i=void 0,c()},1e3))}return e.$$.update=()=>{e.$$.dirty&1&&r.length&&c()},[r]}class Fe extends ft{constructor(t){super(),ut(this,t,Ae,xe,X,{})}}function Pe(e){let t,n,r,i,c,l;return{c(){t=w("div"),n=w("input"),r=N(),i=w("button"),E(n,"type","text"),E(i,"class","fa fa-circle-plus svelte-tupxg1"),E(t,"class","svelte-tupxg1")},m(o,a){M(o,t,a),$(t,n),At(n,e[0].description),$(t,r),$(t,i),c||(l=[P(n,"input",e[2]),P(i,"click",vt(e[1]))],c=!0)},p(o,[a]){a&1&&n.value!==o[0].description&&At(n,o[0].description)},i:O,o:O,d(o){o&&S(t),c=!1,L(l)}}}function je(e,t,n){let r={description:"",done:!1};const i=()=>{r.description.trim()==""?Re("noting to add","alert"):(n(0,r.description=r.description.trim(),r),re.add(r),n(0,r={description:"",done:!1}))};function c(){r.description=this.value,n(0,r)}return[r,i,c]}class Be extends ft{constructor(t){super(),ut(this,t,je,Pe,X,{})}}function ie(e,{from:t,to:n},r={}){const i=getComputedStyle(e),c=i.transform==="none"?"":i.transform,[l,o]=i.transformOrigin.split(" ").map(parseFloat),a=t.left+t.width*l/n.width-(n.left+l),u=t.top+t.height*o/n.height-(n.top+o),{delay:_=0,duration:h=f=>Math.sqrt(f)*120,easing:g=Nt}=r;return{delay:_,duration:z(h)?h(Math.sqrt(a*a+u*u)):h,easing:g,css:(f,s)=>{const p=s*a,d=s*u,m=f+s*t.width/n.width,b=f+s*t.height/n.height;return`transform: ${c} translate(${p}px, ${d}px) scale(${m}, ${b});`}}}function zt(e,t,n){const r=e.slice();return r[13]=t[n],r[14]=t,r[15]=n,r}function Dt(e,t,n){const r=e.slice();return r[13]=t[n],r[16]=t,r[17]=n,r}function Ht(e,t){let n,r,i,c,l,o=t[13].description+"",a,u,_,h,g,f,s=O,p,d,m;function b(){t[7].call(i,t[16],t[17])}function v(){return t[8](t[13],t[16],t[17])}function T(){return t[9](t[13])}return{key:e,first:null,c(){n=w("article"),r=w("span"),i=w("input"),c=N(),l=w("span"),a=Y(o),u=N(),_=w("button"),E(i,"type","checkbox"),E(l,"class","txt svelte-4lutm4"),E(_,"class","fa fa-trash-can"),E(_,"title","delete"),E(n,"class","svelte-4lutm4"),rt(n,"done",t[13].done),this.first=n},m(C,k){M(C,n,k),$(n,r),$(r,i),i.checked=t[13].done,$(n,c),$(n,l),$(l,a),$(n,u),$(n,_),p=!0,d||(m=[P(i,"change",b),P(i,"click",v),P(_,"click",vt(T))],d=!0)},p(C,k){t=C,k&2&&(i.checked=t[13].done),(!p||k&2)&&o!==(o=t[13].description+"")&&St(a,o),(!p||k&2)&&rt(n,"done",t[13].done)},r(){f=n.getBoundingClientRect()},f(){Xt(n),s(),Ot(n,f)},a(){s(),s=Vt(n,f,ie,{duration:250})},i(C){p||(C&&F(()=>{g&&g.end(1),h=Zt(n,t[4],{key:t[13].id}),h.start()}),p=!0)},o(C){h&&h.invalidate(),g=te(n,t[3],{key:t[13].id}),p=!1},d(C){C&&S(n),C&&g&&g.end(),d=!1,L(m)}}}function Wt(e,t){let n,r,i,c,l,o=t[13].description+"",a,u,_,h,g,f,s,p=O,d,m,b;function v(){t[10].call(i,t[14],t[15])}function T(){return t[11](t[13],t[14],t[15])}function C(){return t[12](t[13])}return{key:e,first:null,c(){n=w("article"),r=w("span"),i=w("input"),c=N(),l=w("span"),a=Y(o),u=N(),_=w("button"),h=N(),E(i,"type","checkbox"),E(l,"class","txt svelte-4lutm4"),E(_,"class","fa fa-trash-can"),E(_,"title","delete"),E(n,"class","svelte-4lutm4"),rt(n,"done",t[13].done),this.first=n},m(k,y){M(k,n,y),$(n,r),$(r,i),i.checked=t[13].done,$(n,c),$(n,l),$(l,a),$(n,u),$(n,_),$(n,h),d=!0,m||(b=[P(i,"change",v),P(i,"click",T),P(_,"click",vt(C))],m=!0)},p(k,y){t=k,y&1&&(i.checked=t[13].done),(!d||y&1)&&o!==(o=t[13].description+"")&&St(a,o),(!d||y&1)&&rt(n,"done",t[13].done)},r(){s=n.getBoundingClientRect()},f(){Xt(n),p(),Ot(n,s)},a(){p(),p=Vt(n,s,ie,{duration:250})},i(k){d||(k&&F(()=>{f&&f.end(1),g=Zt(n,t[4],{key:t[13].id}),g.start()}),d=!0)},o(k){g&&g.invalidate(),f=te(n,t[3],{key:t[13].id}),d=!1},d(k){k&&S(n),k&&f&&f.end(),m=!1,L(b)}}}function Ie(e){let t=[],n=new Map,r,i,c,l=[],o=new Map,a,u,_=e[1];const h=s=>s[13].id;for(let s=0;s<_.length;s+=1){let p=Dt(e,_,s),d=h(p);n.set(d,t[s]=Ht(d,p))}let g=e[0];const f=s=>s[13].id;for(let s=0;s<g.length;s+=1){let p=zt(e,g,s),d=f(p);o.set(d,l[s]=Wt(d,p))}return{c(){for(let s=0;s<t.length;s+=1)t[s].c();r=N(),i=w("h3"),i.textContent="Done:",c=N();for(let s=0;s<l.length;s+=1)l[s].c();a=de()},m(s,p){for(let d=0;d<t.length;d+=1)t[d]&&t[d].m(s,p);M(s,r,p),M(s,i,p),M(s,c,p);for(let d=0;d<l.length;d+=1)l[d]&&l[d].m(s,p);M(s,a,p),u=!0},p(s,[p]){if(p&6){_=s[1],gt();for(let d=0;d<t.length;d+=1)t[d].r();t=yt(t,p,h,1,s,_,n,r.parentNode,Bt,Ht,r,Dt);for(let d=0;d<t.length;d+=1)t[d].a();mt()}if(p&5){g=s[0],gt();for(let d=0;d<l.length;d+=1)l[d].r();l=yt(l,p,f,1,s,g,o,a.parentNode,Bt,Wt,a,zt);for(let d=0;d<l.length;d+=1)l[d].a();mt()}},i(s){if(!u){for(let p=0;p<_.length;p+=1)j(t[p]);for(let p=0;p<g.length;p+=1)j(l[p]);u=!0}},o(s){for(let p=0;p<t.length;p+=1)I(t[p]);for(let p=0;p<l.length;p+=1)I(l[p]);u=!1},d(s){for(let p=0;p<t.length;p+=1)t[p].d(s);s&&S(r),s&&S(i),s&&S(c);for(let p=0;p<l.length;p+=1)l[p].d(s);s&&S(a)}}}function qe(e,t,n){let r,i,c,l;Jt(e,q,d=>n(6,l=d));const o=d=>{confirm("remove todo permanently ?")&&re.remove(d)},[a,u]=Ne({fallback:$t});function _(d,m){d[m].done=this.checked,n(1,i),n(5,r),n(6,l)}const h=(d,m,b)=>{n(1,m[b].done=!d.done,i),q.refresh()},g=d=>o(d);function f(d,m){d[m].done=this.checked,n(0,c),n(5,r),n(6,l)}const s=(d,m,b)=>{n(0,m[b].done=!d.done,c),q.refresh()},p=d=>o(d);return e.$$.update=()=>{e.$$.dirty&64&&n(5,r=[...l].reverse()),e.$$.dirty&32&&n(1,i=r.filter(d=>!d.done)),e.$$.dirty&32&&n(0,c=r.filter(d=>d.done))},[c,i,o,a,u,r,l,_,h,g,f,s,p]}class ze extends ft{constructor(t){super(),ut(this,t,qe,Ie,X,{})}}function De(e){let t,n,r,i,c,l,o,a,u,_,h,g;return c=new Fe({}),u=new Be({}),h=new ze({}),{c(){t=w("base"),n=N(),r=w("nav"),r.innerHTML=`<ul><li><strong>HelloWorld Todo&#39;s</strong></li></ul> 
    <ul><li><a href="https://github.com/Rocco-Gossmann/SvelteHelloWorldTodos" target="_blank">GitHub</a></li></ul>`,i=N(),pt(c.$$.fragment),l=N(),o=w("h1"),o.textContent="Todos",a=N(),pt(u.$$.fragment),_=N(),pt(h.$$.fragment),E(t,"href","/SvelteHelloWorldTodos"),E(o,"class","text-center")},m(f,s){$(document.head,t),M(f,n,s),M(f,r,s),M(f,i,s),et(c,f,s),M(f,l,s),M(f,o,s),M(f,a,s),et(u,f,s),M(f,_,s),et(h,f,s),g=!0},p:O,i(f){g||(j(c.$$.fragment,f),j(u.$$.fragment,f),j(h.$$.fragment,f),g=!0)},o(f){I(c.$$.fragment,f),I(u.$$.fragment,f),I(h.$$.fragment,f),g=!1},d(f){S(t),f&&S(n),f&&S(r),f&&S(i),nt(c,f),f&&S(l),f&&S(o),f&&S(a),nt(u,f),f&&S(_),nt(h,f)}}}class He extends ft{constructor(t){super(),ut(this,t,null,De,X,{})}}new He({target:document.getElementById("app")});
