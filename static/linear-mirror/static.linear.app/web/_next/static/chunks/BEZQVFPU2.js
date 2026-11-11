var e,i,n,t,o,a,s,r,l,c,d;import{o as p}from"./C_JJxWoe.js";import{Ur as u,ai as m}from"./DipWGRuU.js";import{t as h}from"./PPnH9BIT.js";import{a as f,o as y}from"./DvPgvKbY2.js";import{t as w}from"./B1Zk7NIj2.js";import{r as b,t as j}from"./C-nF0bO-2.js";import{t as x}from"./CZiyYYAU.js";import{t as v}from"./D_fdNqax2.js";import{t as C}from"./DtPCCDNE.js";import{n as g,r as k,t as N}from"./wOmZMTtH.js";import{t as O}from"./ETCSznfT.js";import{t as $}from"./CNgSfc5O.js";function E(e){return`${r}${e}`}function F(e){return e.toLowerCase().replace(/[^a-z0-9]/g,"")}function L(e){const i=document.getElementById(E(e));if(i)return i;const n=F(e);for(const t of Array.from(document.querySelectorAll(`[id^="${r}"]`)))if(F(t.id.slice(12))===n)return t;return null}function A(){const i=e.useContext(l);if(!i)throw new Error("Collapsible primitives must be rendered inside a <CollapsibleGroup>");return i}function I(){const i=e.useContext(c);if(!i)throw new Error("Collapsible primitives must be rendered inside a <CollapsibleItem>");return i}function U(n){const t=function(n={}){const{exclusive:t=!1}=n,[o,a]=e.useState([]),r=e.useCallback(e=>{a(i=>t?[e]:i.includes(e)?i:[...i,e])},[t]),l=e.useCallback(e=>{history.replaceState(null,""," "),a(i=>i.filter(i=>i!==e))},[]),c=e.useCallback(async e=>{try{window.location.hash=`${s}${e}`,await navigator.clipboard.writeText(window.location.href),b({type:j.Success,title:"URL copied to your clipboard",icon:(0,i.jsx)(C,{})})}catch(n){w.error(n),b({type:j.Error,title:(0,i.jsxs)(i.Fragment,{children:["Failed to copy the URL to your clipboard:",(0,i.jsx)("br",{}),window.location.href]}),icon:(0,i.jsx)(O,{})})}},[]);e.useEffect(()=>{if(!window.location.hash.startsWith(s))return;const e=L(window.location.hash.slice(13));return e?(r(e.id.slice(12)),M(e)):void 0},[]);const d=e.useCallback(e=>o.includes(e),[o]);return e.useMemo(()=>({isOpen:d,open:r,close:l,copyLink:c}),[d,r,l,c])}({exclusive:n.exclusive});return(0,i.jsx)(l.Provider,{value:t,children:n.children})}function q(n){const{id:t,children:o,...a}=n,s=A(),r=s.isOpen(t),{open:l,close:d}=s,p=e.useCallback(e=>e?l(t):d(t),[d,t,l]),u=e.useMemo(()=>({id:t,open:r,onOpenChange:p}),[t,r,p]);return(0,i.jsx)(c.Provider,{value:u,children:(0,i.jsx)(k,{...a,id:E(t),open:r,onOpenChange:p,children:o})})}function R(e){const{className:n,tooltip:t="Copy link",ariaLabel:o,children:a}=e,s=A(),r=I(),l=(0,i.jsx)("a",{className:n,"aria-label":o,href:`#${E(r.id)}`,"data-collapsible-open":r.open,onClick:()=>{s.open(r.id),s.copyLink(r.id)},children:a});return t?(0,i.jsx)(v,{title:t,delayDuration:0,sideOffset:8,asChild:!0,children:l}):l}function S(n){const{className:t,innerClassName:o,children:a}=n,{open:r,onOpenChange:l}=I(),c=e.useRef(null);return $({ref:c,isActive:r,onFound:e.useCallback(()=>l(!0),[])}),e.useEffect(()=>{if(!window.location.hash.startsWith(s))return;const e=L(window.location.hash.slice(13));return e&&c.current?.contains(e)?(l(!0),M(e)):void 0},[]),(0,i.jsx)(N,{ref:c,className:t,tabIndex:r?void 0:-1,keepMounted:!0,hidden:!1,children:(0,i.jsx)(x.div,{initial:{height:0},animate:{height:r?"auto":0},transition:{type:"spring",damping:18,mass:.2,stiffness:280},children:(0,i.jsx)(x.div,{initial:!1,animate:{opacity:r?1:0},transition:{type:"spring",delay:r?.1:0,damping:18,mass:.5,stiffness:200},className:h(o),children:a})})})}function M(e){const i=()=>{e.scrollIntoView({behavior:"instant",block:"start"})},n=requestAnimationFrame(i),t=window.setTimeout(i,400);return()=>{cancelAnimationFrame(n),clearTimeout(t)}}e=p(m(),1),i=u(),n=e=>(0,i.jsx)(k,{open:e.open,onOpenChange:e.onOpenChange,className:e.className,children:(0,i.jsx)(N,{render:(0,i.jsx)(a,{}),children:e.children})}),t=y`
  from {
    height: 0;
    opacity: 0;
  }

  10% {
    opacity: 0;
  }

  to {
    opacity: 1;
    height: var(--collapsible-panel-height);
  }
`,o=y`
  from {
    height: var(--collapsible-panel-height);
    opacity: 1;
  }

  60% {
    opacity: 0;
  }

  to {
    height: 0;
    opacity: 0;
  }
`,a=f.div`
  overflow: hidden;
  width: 100%;

  @media (prefers-reduced-motion: no-preference) {
    &[data-open] {
      animation: ${t} 320ms var(--ease-in-out-quad) forwards;
    }

    /* Base UI checks for an animation in the frame before it adds data-ending-style,
       so the exit keyframes must apply as soon as the panel is data-closed. */
    &[data-closed] {
      animation: ${o} 320ms var(--ease-in-out-quad) forwards;
    }
  }
`,s="#collapsible-",r="collapsible-",l=e.createContext(null),c=e.createContext(null),d=g;export{R as a,q as i,S as n,d as o,U as r,n as t};