var e,t,r,a,i,n,o,s,l,d,c,h,p,u,m,f,x,g,y,w,v,b,j,k,z,$,H,T,A,M,B,E,C,W,I,R,L,_,P,S,q,D,G,O,U,Y,N,V,X,F,K,Q,J,Z,ee,te,re,ae,ie,ne,oe,se,le,de,ce,he,pe,ue,me,fe,xe,ge,ye,we;import{o as ve,t as be}from"./C_JJxWoe.js";import{Ur as je,ai as ke}from"./DipWGRuU.js";import{t as ze}from"./D0KO9uUz.js";import{t as $e}from"./D3h6ES7Z.js";import{o as He}from"./DGLchL1f.js";import{a as Te,o as Ae}from"./DvPgvKbY2.js";import{s as Me,t as Be}from"./BbpqRa-j2.js";import{t as Ee}from"./C5rym-AJ2.js";import{t as Ce}from"./C1wQiu072.js";import{c as We,g as Ie,o as Re}from"./CIHCbIf82.js";import{n as Le,t as _e}from"./CWK6Zt102.js";import{t as Pe}from"./C6zyhSBX2.js";import{t as Se}from"./CCk75typ2.js";import{t as qe}from"./Dj4SDl1W.js";import{t as De}from"./D4UDMvSo.js";import{t as Ge}from"./Dljlao8y.js";import{t as Oe}from"./BWuOVdWQ.js";import{n as Ue,r as Ye,t as Ne}from"./DVq3wahd.js";import{t as Ve}from"./BOYWXd4P.js";function Xe(e){let t=Math.floor(e/60),r=e-60*t;return t<10&&(t="0"+t),r<10&&(r="0"+r),t+":"+r}e=He,t=ve(ke(),1),r=ve(Pe(),1),a=je(),i=Te(e=>{const i=(0,t.useRef)(null),n=(0,t.useRef)(null),o=(0,t.useRef)(null),s=(0,t.useRef)(null),[l,d]=(0,t.useState)(0),[c,h]=(0,t.useState)(!0),[p,u]=(0,t.useState)("0:00");function m(e,t=!0){if(!(i.current&&n.current&&o.current&&s.current))return;e=(0,r.default)(e,0,l);const a=(0,r.default)(e/l,0,1);n.current.setAttribute("aria-valuenow",String(e)),n.current.setAttribute("aria-valuetext",`${Xe(Math.floor(e))} of ${Xe(Math.floor(l))}`),o.current.style.transform=`scaleX(${a})`,s.current.style.left=100*a+"%",t&&(i.current.currentTime=e);const d=Math.ceil(i.current.duration-i.current.currentTime);u(Xe(d))}function f(){h(e=>(i.current&&(e?i.current.play():i.current.pause()),!e))}function x(){i.current?.duration&&d(i.current.duration-.1)}function g(){return i.current?.currentTime??0}return(0,a.jsxs)("div",{className:e.className,children:[(0,a.jsx)("audio",{ref:i,preload:"metadata",onClick:f,onTimeUpdate:function(){l||x(),i.current&&m(i.current.currentTime,!1)},onLoadedMetadata:x,onPlay:()=>h(!1),onPause:()=>h(!0),onEnded:()=>h(!0),children:e.children}),(0,a.jsxs)("div",{"audio-controls":"",children:[(0,a.jsx)("button",{onClick:f,"aria-label":c?"Play audio":"Pause audio",children:c?(0,a.jsx)(Le,{}):(0,a.jsx)(_e,{})}),(0,a.jsxs)("div",{ref:n,"audio-progress":"",role:"slider",tabIndex:0,"aria-label":"Seek","aria-valuenow":0,"aria-valuemax":l,"aria-valuemin":0,onPointerDown:function(e){if(!n.current||!o.current||!i.current)return;n.current.setPointerCapture(e.pointerId),n.current.addEventListener("pointermove",s),n.current.addEventListener("pointerup",function(e){i.current&&n.current&&o.current&&(r&&i.current.play(),o.current.style.transition="",n.current.releasePointerCapture(e.pointerId),n.current.removeEventListener("pointermove",s))},{once:!0});const t=n.current.getBoundingClientRect();o.current.style.transition="none";const r=!i.current.paused;function a(e){i.current&&m((e.pageX-t.left)/t.width*i.current.duration)}function s(e){a(e)}i.current.pause(),a(e)},onKeyDown:function(e){i.current&&(e.metaKey||e.ctrlKey||e.altKey||function(e,t){e.key in t&&(e.preventDefault(),t[e.key]())}(e,{" ":f,k:f,j:()=>m(g()-10),l:()=>m(g()+10),ArrowRight:()=>m(g()+5),ArrowLeft:()=>m(g()-5),Home:()=>m(0),End:()=>m(l),".":()=>m(g()+.04),",":()=>m(g()-.04),0:()=>m(0),1:()=>m(.1*l),2:()=>m(.2*l),3:()=>m(.3*l),4:()=>m(.4*l),5:()=>m(.5*l),6:()=>m(.6*l),7:()=>m(.7*l),8:()=>m(.8*l),9:()=>m(.9*l)}))},children:[(0,a.jsx)("div",{ref:o,"audio-progress-indicator":""}),(0,a.jsx)("div",{ref:s,"audio-progress-knob":""})]}),(0,a.jsx)("div",{"audio-duration":"",children:p})]})]})})`
  position: relative;
  border-radius: 36px;

  & audio {
    outline: none;
    display: block;
    max-width: 100%;
  }

  & [audio-controls] {
    --height: 36px;

    display: flex;
    height: var(--height);
    border-radius: var(--height);
    display: flex;
    align-items: center;

    button {
      cursor: pointer;
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      color: white;
      border-radius: 4px;

      &:hover {
        background: var(--color-bg-tertiary);
      }
    }
  }

  & [audio-progress] {
    --click-padding: -10px;

    position: relative;
    background: var(--color-bg-tertiary);
    height: 3px;
    border-radius: 3px;
    width: 100%;
    cursor: pointer;
    margin: 0 8px;

    &::before,
    &::after {
      cursor: pointer;
      user-select: none;
      content: "";
      position: absolute;
      height: calc(-1 * var(--click-padding));
      width: 100%;
    }

    &::before {
      top: var(--click-padding);
    }

    &::after {
      bottom: var(--click-padding);
    }
  }

  & [audio-progress-indicator] {
    position: relative;

    user-select: none;
    pointer-events: none;
    background: var(--color-text-quaternary);
    height: 100%;
    width: 100%;
    transform: scaleX(0.01);
    transform-origin: 0 0;
    transition: var(--transition-med) linear;
    transition-property: transform;
  }

  & [audio-progress-knob] {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    background: var(--color-text-quaternary);
  }

  & [audio-duration] {
    font-family: var(--font-monospace);
    font-size: 12px;
  }
`,n=ve($e(),1),o=({jobs:e})=>(0,a.jsx)("div",{children:Object.entries(e).map(([e,t])=>(0,a.jsxs)("div",{className:"DEHQBW_section",children:[(0,a.jsx)(Be,{as:"h4",color:"tertiary",size:"regular",weight:"normal",className:"DEHQBW_department",children:(0,a.jsx)(Se,{id:(0,n.default)(e).toLowerCase(),children:e})}),Object.entries(t).map(([e,t])=>(0,a.jsx)("div",{className:"DEHQBW_job",children:(0,a.jsxs)(Ge,{$areas:{default:'"a a a a a b b b b b c c"',tablet:'"a a a a a a a a a a c c"',mobile:'"a a a c"'},$align:"center",children:[(0,a.jsx)(Ge.A,{children:(0,a.jsxs)(Ee,{direction:"column",gap:4,children:[(0,a.jsx)(Be,{as:"p",size:"regular",weight:"medium",children:e}),(0,a.jsx)(Ee,{gap:4,className:"show-tablet",children:t.map((e,r)=>(0,a.jsxs)(Be,{size:"regular",color:"quaternary",children:[e.location,r!==t.length-1&&", "]},e.id))})]})}),(0,a.jsx)(Ge.B,{className:"hide-tablet",children:(0,a.jsx)(Ee,{gap:4,children:t.map((e,r)=>(0,a.jsxs)(Be,{size:"regular",color:"quaternary",children:[e.location,r!==t.length-1&&", "]},e.id))})}),(0,a.jsx)(Ge.C,{children:(0,a.jsx)(Ee,{justify:"end",children:(0,a.jsx)(ze,{variant:"primary",href:qe(t[0]),children:(0,a.jsx)(Be,{size:"regular",weight:"normal",children:(0,a.jsxs)(Ee,{as:"span",inline:!0,align:"center",gap:4,children:["Learn more",(0,a.jsx)(De,{color:"currentColor"})]})})})})})]})},e))]},e))}),s=(0,a.jsx)("svg",{width:"150",height:"50",viewBox:"0 0 150 50",fill:"none",children:(0,a.jsx)("path",{d:"M8.42 38.828c9.929 0 44.82-35.814 29.817-36.035s-14.21 43.795-14.21 43.795 1.314-20.576 13.449-20.576-2.984 20.594 7.607 21.256c10.59.662 25.696-20.011 14.664-20.453-11.032-.441-10.1 19.133 4.683 19.795S95.627 4.932 82.61 4.05c-13.018-.883-10.461 41.387 2.777 42.27 13.239.882 32.964-41.738 19.505-42.4-13.46-.662-10.187 42.978 1.42 42.69 3.125 0 8.65-4.747 8.848-10.204.893-10.656 8.913-9.914 8.913-9.914 8.482.723 9.106 7.072 9.106 7.072.795 3.484-3.412 12.788-10.011 12.788s-8.008-8.435-8.008-8.435",stroke:"#4D79A5",strokeWidth:"5",strokeLinecap:"round",strokeLinejoin:"round"})}),l=(0,a.jsxs)("svg",{width:"90",height:"90",viewBox:"0 0 867 867",fill:"none",children:[(0,a.jsx)("mask",{id:"readme-mask",style:{maskType:"alpha"},maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"867",height:"867",children:(0,a.jsx)("path",{d:"M352.79 860.229c2.591.486 4.226-2.64 2.362-4.504L11.275 511.848c-1.864-1.864-4.99-.229-4.504 2.362C39.583 689.357 177.643 827.417 352.79 860.229M.068 408.471c-.044.769.243 1.52.788 2.065l455.608 455.608a2.7 2.7 0 0 0 2.065.788 433.6 433.6 0 0 0 73.281-10.534c2.058-.479 2.773-3.028 1.279-4.522L15.124 333.911c-1.494-1.494-4.043-.779-4.522 1.279A433.6 433.6 0 0 0 .068 408.471M35.25 260.727a2.7 2.7 0 0 0 .57 2.986l567.467 567.468a2.7 2.7 0 0 0 2.986.569 433 433 0 0 0 54.985-28.817c1.477-.915 1.707-2.967.478-4.197L68.264 205.264c-1.23-1.229-3.282-.999-4.197.479a432.6 432.6 0 0 0-28.817 54.984m71.049-108.321a2.7 2.7 0 0 1-.13-3.681C185.698 57.585 302.709 0 433.17 0 672.768 0 867 194.233 867 433.83c0 130.461-57.586 247.472-148.725 327.001a2.7 2.7 0 0 1-3.681-.13z",fill:"#000"})}),(0,a.jsx)("g",{mask:"url(#readme-mask)",stroke:"#000",strokeWidth:"26",children:(0,a.jsx)("path",{d:"M96.793 12.512H1397.75M28.311 63.523H1329.27M-40.15 114.515h1300.96m-1369.439 51.012H1192.33m-1369.418 50.991H1123.87m-1369.44 50.991h1300.96m-1369.423 51.014H986.928m-1369.436 50.991H918.454m-1232.487 51.01H986.928M-245.57 471.519h1300.96m-1232.478 50.989H1123.87m-1232.499 51.013H1192.33M-40.15 624.514h1300.96M28.311 675.521H1329.27M96.793 726.516H1397.75M165.27 777.509h1300.96M233.732 828.518H1534.69M302.213 879.51H1603.17"})})]}),d=(0,a.jsxs)("svg",{width:"24",height:"18",viewBox:"0 0 225 170",fill:"#00ff67",children:[(0,a.jsx)("path",{d:"m0 98.241 63.365-33.53v-1.709L0 29.472V0l91.74 49.12v29.473L0 127.714z"}),(0,a.jsx)("path",{d:"M122.593 170v-25.842H225V170z"})]}),c=(0,a.jsx)("svg",{width:"66",height:"60",viewBox:"0 0 11 10",fill:"#000",children:(0,a.jsx)("path",{d:"M0 0h1v1H0zm1 1h1v1H1zm1-1h1v1H2zm0 2h1v1H2zM0 2h1v1H0zm8-2h1v1H8zm1 1h1v1H9zm1-1h1v1h-1zm0 2h1v1h-1zM8 2h1v1H8zM3 4h1v1H3zm1 1h1v1H4zm1 0h1v1H5zm0 2h1v1H5zm1 0h1v1H6zm1 0h1v1H7zm1 1h1v1H8zm1 0h1v1H9zm1 1h1v1h-1zM4 7h1v1H4zM3 7h1v1H3zM2 8h1v1H2zm4-4h1v1H6z"})}),h=Ae`
  50% {
    opacity: 0;
  }
`,p=Ae`
from {
  stroke-dashoffset: 506;
}

30%, 100% {
  stroke-dashoffset: 0;
}
`,u=Ae`
from {
  clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%);
}

50%, 100% {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
`,m=Te.div.attrs({children:d})`
  padding: 20px 15px;
  opacity: 0.7;

  /* Only flash the underscore, not the caret > */
  & svg path:nth-child(2) {
    animation: ${h} 1.2s step-start infinite;
  }
`,f=Te.div.attrs({children:s})`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg path {
    --length: 506;
    will-change: stroke-dashoffset;
    stroke-dasharray: var(--length);
    stroke-dashoffset: var(--length);

    [data-animate="true"] & {
      animation: ${p} 8s linear forwards;
    }
  }
`,x=Te.div.attrs({children:c})`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;

  [data-animate="true"] & {
    opacity: 1;
    animation: ${h} 2s steps(2) infinite;
  }
`,g=Te.div.attrs({children:l})`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    will-change: clip-path;
    clip-path: inset(100% 100% 100% 100%);

    [data-animate="true"] & {
      animation: ${u} 8s steps(8) forwards;
    }
  }
`,y=t.forwardRef((e,t)=>(0,a.jsx)(j,{ref:t,src:e.src,background:W,screenBackground:"#000",style:e.style,children:(0,a.jsx)(m,{})})),w=t.forwardRef((e,t)=>(0,a.jsx)(j,{ref:t,src:e.src,background:I,screenBackground:"#d1eff9",style:e.style,lazy:!0,children:(0,a.jsx)(f,{})})),v=t.forwardRef((e,t)=>(0,a.jsx)(j,{ref:t,src:e.src,background:R,screenBackground:"#93c4e0",style:e.style,lazy:!0,children:(0,a.jsx)(x,{})})),b=t.forwardRef((e,t)=>(0,a.jsx)(j,{ref:t,src:e.src,background:L,screenBackground:"#c4ecf8",style:e.style,lazy:!0,children:(0,a.jsx)(g,{})})),j=t.forwardRef((e,r)=>{const i=t.useRef(null),[n,o]=t.useState(!1);return t.useEffect(()=>{function e(){o(!0)}i.current&&(i.current.complete?e():i.current.addEventListener("load",e,{once:!0}))},[]),(0,a.jsxs)(k,{ref:r,style:e.style,children:[(0,a.jsx)(e.background,{}),(0,a.jsx)(E,{}),(0,a.jsx)(z,{style:{opacity:n?1:0},children:(0,a.jsx)("img",{ref:i,width:600,height:800,src:e.src,loading:e.lazy?"lazy":void 0,alt:"An old computer with a flashing screen and stickers"})}),(0,a.jsxs)(H,{$background:e.screenBackground,style:{opacity:n?1:0},children:[(0,a.jsx)($,{"aria-hidden":!0}),e.children]})]})}),k=Te.div`
  transform: translate3d(0, 0, 0);

  &:not(:first-child) {
    position: absolute;
    opacity: 0;
  }
`,z=Te.div`
  position: relative;
  display: block;
  z-index: var(--layer-image);
  width: var(--computer-width);
  height: auto;
  margin: 0 auto;

  img {
    width: var(--computer-width);
    height: auto;
  }
`,$=Te.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 300px;
  height: 215px;
  background-image: var(--screen-texture-url);
  background-size: cover;
  background-color: rgba(255, 255, 255, 0.2);
`,H=Te.div`
  z-index: var(--layer-screen);
  position: absolute;
  top: 66px;
  left: 64px;
  width: 224px;
  height: 170px;
  border-radius: 7px;
  overflow: hidden;
  background: ${e=>e.$background||"#222325"};

  @media (max-width: ${e.tablet}px) {
    top: 52px;
    left: 50px;
    height: 134px;
    width: 176px;
  }

  @media (max-width: ${e.phone}px) {
    left: calc(50% - 94px);
    top: 57px;
    width: 188px;
    height: 144px;
  }
`,T=Ae`
from {
  opacity: 0;
  transform: translateX(calc((var(--page-max-width) / 2) - 50% - 64px)) translateY(calc(-1 * var(--entry-offset)));
}

50% {
  transform: translateX(calc((var(--page-max-width) / 2) - 50% - 64px));
}

75% {
  opacity: 1;
}

to {
  opacity: 1;
  transform: none;
}
`,A=Ae`
from {
  opacity: 0;
  transform: translateY(calc(-1 * var(--entry-offset)));
}

to {
  opacity: 1;
  transform: none;
}
`,M=Ae`
from {
  opacity: 0;
}

to {
  opacity: 1;
}
`,B=Te.div`
  --overflow-space: 200px;

  position: sticky;
  top: calc(50vh - 128px - 24px - var(--header-height));
  user-select: none;

  /* Align all of the position: absolute computers at the samep lace */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Entry animation */
  opacity: 0;
  transform: translateX(calc((var(--page-max-width) / 2) - 50% - 64px));
  animation: ${T} 4s var(--entry-delay) forwards;

  @media (max-width: ${e.phone}px) {
    position: relative;
    top: 0;
    width: calc(100% + (2 * var(--page-padding-inline)));
    overflow: hidden;
    padding: var(--overflow-space) var(--page-padding-inline);
    margin: calc(-1 * var(--overflow-space)) calc(-1 * var(--page-padding-inline));
    animation: ${A} 2s calc(var(--entry-stagger) / 2) forwards;
  }
`,E=Te.div`
  --size: 1100px;
  z-index: var(--layer-radial-bg);
  isolation: isolate;
  pointer-events: none;
  width: var(--size);
  height: var(--size);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  position: absolute;
  background: radial-gradient(var(--transparent) 0%, var(--color-bg-primary) 60%);

  @media (max-width: ${e.phone}px) {
    --size: 800px;
  }
`,C=Te.span`
  --size: 800px;
  z-index: var(--layer-grid-bg);
  pointer-events: none;
  user-select: none;
  position: absolute;
  width: var(--size);
  height: var(--size);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: ${e.phone}px) {
    --size: 600px;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    overflow: visible;
    height: var(--size);
    width: var(--size);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::after {
    border-radius: 50%;
    opacity: var(--gradient-opacity);
    filter: blur(50px);
    background: var(--gradient);
  }

  &::before {
    --grid-size: 24px;
    --grid-size-half: 12px;
    height: var(--size);
    width: var(--size);
    opacity: 0;
    animation: ${M} var(--entry-duration) 4s forwards;

    background-size: var(--grid-size) var(--grid-size);
    background-image:
      linear-gradient(
        to right,
        var(--transparent) var(--grid-size-half),
        var(--grid-color) calc(var(--grid-size-half) + 1px),
        var(--transparent) calc(var(--grid-size-half) + 1px)
      ),
      linear-gradient(
        to bottom,
        var(--transparent) var(--grid-size-half),
        var(--grid-color) calc(var(--grid-size-half) + 1px),
        var(--transparent) calc(var(--grid-size-half) + 1px)
      );
  }
`,W=Te(C)`
  --grid-color: #746cf3;
  --gradient-opacity: 0.3;
  --gradient: linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%);
`,I=Te(C)`
  --grid-color: #a9a1ff;
  --gradient-opacity: 0.6;
  --gradient: linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64%);
`,R=Te(C)`
  --grid-color: #46e3b7;
  --gradient-opacity: 0.6;
  --gradient: linear-gradient(124.31deg, #46e3b7 0.18%, #2f7ad0 89.82%);
`,L=Te(C)`
  --grid-color: #f3bd6c;
  --gradient-opacity: 0.6;
  --gradient: linear-gradient(285.49deg, #f537f9 -14.61%, #f7c12b 106.06%);
`,_=Te.div`
  @media (min-width: ${e.phone}px) {
    display: none;
  }
`,P=e=>{const r=Ye();Ue([r.ref],(e,t)=>{Ne(t,e)});const i=t.Children.only(e.children);return t.isValidElement(i)?(0,a.jsx)(_,{children:(0,a.jsx)(B,{children:t.cloneElement(i,{ref:e=>{r.ref.current=e,r.computer.current=e}})})}):null},S=Ae`
	to {
		background-position: -200%;
	}
`,q=e=>(0,a.jsx)(Y,{type:e.type,className:e.type,children:e.children}),D=Ae`
  from {
    transform: rotate(0.00001deg);
  }

  50% {
    transform: translateY(-2px);
  }

  to {
    transform: rotate(0.00001deg);
    background-position: -200%;
  }
`,G=Ae`
  2%,
  60%,
  63%,
  78%,
  81% {
    transform: none;
    opacity: 1;
  }

  62% {
    transform: translate(-2px, 0) skew(21deg);
  }

  80% {
    opacity: 0.4;
    transform: translate(2px, 0) skew(-15deg);
  }
`,O=Ae`
  2%,
  64% {
    transform: none;
  }
  4%,
  60% {
    transform: none;
  }
  62% {
    transform: translate(13px, -1px) skew(-13deg);
  }
`,U=Ae`
  2%,
  64% {
    transform: none;
  }
  4%,
  60% {
    transform: none;
  }
  62% {
    transform: translate(-22px, 5px) skew(21deg);
  }
`,Y=Te.span`
  --a: #db91cb;
  --b: #9a5eff;

  @media (dynamic-range: high) or (color-gamut: p3) {
    --a: color(display-p3 0.858824 0.568627 0.796078 / 1);
    --b: color(display-p3 0.57 0.38 0.97);
  }

  overflow: visible;
  cursor: default;
  position: relative;
  font-weight: var(--font-weight-medium);
  background: linear-gradient(120deg, var(--a) 0%, var(--b) 50%, var(--a) 100%);
  background-size: 200% auto;
  ${Me()}
  animation: ${S} 3s linear infinite forwards;

  &::selection {
    background: var(--color-selection-dim);
  }

  &.dark {
    --a: #999;
    --b: #555;

    display: inline-block;
    background: none;
    color: #777;
    -webkit-text-fill-color: unset;

    &::before,
    &::after {
      content: "${e=>e.children}";
      position: absolute;
      background: none;
      display: inline-block;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }

    &::before {
      clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    }

    &::after {
      clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: ${G} 1s linear infinite;

      &::before {
        animation: ${O} 1s linear infinite;
      }

      &::after {
        animation: ${U} 1.5s linear infinite;
      }
    }

    @media (prefers-reduced-motion: no-preference) and (hover: none) {
      animation: ${G} 1s linear infinite;

      &::before {
        animation: ${O} 1s linear infinite;
      }

      &::after {
        animation: ${U} 1.5s linear infinite;
      }
    }
  }

  &.dream {
    --a: #ffb1bf;
    --b: #db91cb;
    display: inline-block;
    transition: 200ms;
    transform: translateZ(0, 0, 0);
    transition-property: text-shadow;

    @media (prefers-reduced-motion: no-preference) {
      &:hover {
        text-shadow: rgba(246, 193, 43, 0.7) 0 0 20px;
        animation: ${D} 3s ease-in-out infinite;
      }
    }

    @media (prefers-reduced-motion: no-preference) and (hover: none) {
      & {
        animation: ${D} 3s ease-in-out infinite;
      }
    }
  }
`,N=Te.span`
  position: relative;
  display: inline-block;
  margin-right: 16px;

  &::after {
    content: "${e=>e.$count}";
    display: block;
    width: 14px;
    height: 14px;
    position: absolute;
    right: -16px;
    top: 0px;
    border-radius: 50%;
    color: white;
    background: red;
    user-select: none;
    font-size: 10px;
    font-weight: var(--font-weight-medium);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,V=be((e,t)=>{var r=Math.floor,a=Math.random;t.exports=function(e,t){return e+r(a()*(t-e+1))}}),X=be((e,t)=>{var r=Ie(),a=Re(),i=We(),n=Ce();t.exports=function(e,t,o){if(!n(o))return!1;var s=typeof t;return!!("number"==s?a(o)&&i(t,o.length):"string"==s&&t in o)&&r(o[t],e)}}),F=ve(be((e,t)=>{var r=V(),a=X(),i=Ve(),n=parseFloat,o=Math.min,s=Math.random;t.exports=function(e,t,l){var d,c;return l&&"boolean"!=typeof l&&a(e,t,l)&&(t=l=void 0),void 0===l&&("boolean"==typeof t?(l=t,t=void 0):"boolean"==typeof e&&(l=e,e=void 0)),void 0===e&&void 0===t?(e=0,t=1):(e=i(e),void 0===t?(t=e,e=0):t=i(t)),e>t&&(d=e,e=t,t=d),l||e%1||t%1?(c=s(),o(e+c*(t-e+n("1e-"+((c+"").length-1))),t)):r(e,t)}})(),1),K=e=>{const r=Oe(),[i,n]=t.useState(!r&&Boolean(e.alwaysAnimate)),o=[t.useRef(null),t.useRef(null),t.useRef(null)];t.useEffect(()=>{const e=window.matchMedia("(hover: none)").matches;!r&&e&&n(!0)},[]),t.useEffect(()=>{if(i){let t=0;const r=setInterval(()=>{const e=o[t];if(e?.current){const t=(0,F.default)(-20,80)+"%",r=(0,F.default)(-20,80)+"%";e.current.style.left=t,e.current.style.top=r,e.current.style.opacity="1",e.current.removeAttribute("animate"),e.current.offsetWidth,e.current.setAttribute("animate","1")}t=(t+1)%o.length},e.frequency??250);return()=>clearInterval(r)}},[i,e.frequency]);const s=e.Sparkle??Q;return(0,a.jsxs)(te,{...e,onPointerEnter:e.alwaysAnimate?void 0:()=>n(!0),onPointerLeave:e.alwaysAnimate?void 0:()=>n(!1),children:[o.map((e,t)=>(0,a.jsx)(s,{ref:o[t]},`sparkle-${t}`)),e.children]})},Q=t.forwardRef((e,t)=>(0,a.jsx)(ee,{ref:t,"aria-hidden":!0,children:(0,a.jsx)(re,{width:"20",height:"20",viewBox:"0 0 68 68",fill:"#8253D5",children:(0,a.jsx)("path",{d:"M26.5 25.5C19.004 33.37 0 34 0 34s19.101 1.368 26.5 9.5C33.234 50.901 34 68 34 68s2.988-17.293 10.5-24.5C51.643 36.647 68 34 68 34s-16.305-1.906-23.5-8.5C36.56 18.224 34 0 34 0s-.34 17.984-7.5 25.5"})})})),t.forwardRef((e,t)=>(0,a.jsx)(ee,{ref:t,"aria-hidden":!0,children:(0,a.jsxs)(re,{width:"24",height:"22",viewBox:"0 0 24 22",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{filter:"blur(1px)"},children:[(0,a.jsx)("path",{d:"M12.973 9.429V0h-2.895v9.429H.236v2.095h9.842V22h2.895V11.524h9.263V9.429z",fill:"url(#paint0_radial_494_869)"}),(0,a.jsx)("path",{d:"m11.706 9.42-4.98-4.506-1.528 1.383 4.98 4.505-5.199 4.703 1.107 1.001 5.198-4.703 5.532 5.006 1.529-1.383-5.533-5.006 4.892-4.426-1.106-1z",fill:"url(#paint1_radial_494_869)"}),(0,a.jsxs)("defs",{children:[(0,a.jsxs)("radialGradient",{id:"paint0_radial_494_869",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(11.8153 10.4762) rotate(90) scale(11.5238 12.7368)",children:[(0,a.jsx)("stop",{stopColor:"white"}),(0,a.jsx)("stop",{offset:"0.806326",stopColor:"white",stopOpacity:"0"})]}),(0,a.jsxs)("radialGradient",{id:"paint1_radial_494_869",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(11.6476 10.4731) rotate(42.1376) scale(8.20713 9.0258)",children:[(0,a.jsx)("stop",{stopColor:"white"}),(0,a.jsx)("stop",{offset:"0.806326",stopColor:"white",stopOpacity:"0"})]})]})]})})),J=Ae`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`,Z=Ae`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`,ee=Te.span`
  z-index: -1;
  position: absolute;
  display: block;
  opacity: 0;
  pointer-events: none;
  user-select: none;

  &[animate] {
    animation: ${J} 700ms forwards;
  }
`,te=Te.span`
  display: inline-block;
  position: relative;
  z-index: 1;
`,re=Te.svg`
  display: block;
  opacity: 0.5;

  [animate] & {
    animation: ${Z} 1000ms linear;
  }
`,ae=({jobs:e,images:t})=>{const r=Ye(),i=Ye(),n=Ye(),s=Ye();Ue([i.ref,n.ref,s.ref],(e,t)=>{let r,a=[];t===i.ref.current?(r=i.computer.current,a=[n.computer.current,s.computer.current]):t===n.ref.current?(r=n.computer.current,a=[s.computer.current]):t===s.ref.current&&(r=s.computer.current),r&&(Ne(r,e),a.forEach(e=>{e&&Ne(e,0)}))});const[l,d,c,h,p]=t;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(xe,{$top:0,$direction:"bottom"}),(0,a.jsxs)(ne,{style:{"--screen-texture-url":`url("${p}")`},children:[(0,a.jsx)(fe,{children:(0,a.jsx)(de,{children:"Readme"})}),(0,a.jsxs)(B,{children:[(0,a.jsx)(y,{src:l,ref:r.computer}),(0,a.jsx)(w,{src:d,ref:i.computer}),(0,a.jsx)(v,{src:c,ref:n.computer}),(0,a.jsx)(b,{src:h,ref:s.computer})]}),(0,a.jsxs)(oe,{children:[(0,a.jsx)(me,{children:(0,a.jsx)(de,{children:"Readme"})}),(0,a.jsxs)(ye,{children:[(0,a.jsxs)(pe,{children:["This is not a manifesto.",(0,a.jsx)("br",{}),"This is not a codex, not a whitepaper, and not a secret master plan."]}),(0,a.jsxs)(pe,{children:["This is just a simple story.",(0,a.jsx)("br",{})," A story told in three acts."]}),(0,a.jsxs)(pe,{children:["This is a simple story, but a good story.",(0,a.jsx)("br",{}),"Like all simple stories, it has a beginning, a middle and an end.",(0,a.jsx)("br",{}),"Like all good stories, it’s a"," ",(0,a.jsx)(K,{children:(0,a.jsx)(q,{type:"linear",children:"story about magic."})})]}),(0,a.jsxs)(pe,{children:["This is a story waiting to be read.",(0,a.jsx)("br",{}),"Ideally in one sitting and with a hot beverage by your side.",(0,a.jsx)("br",{}),"It is waiting to be read by the one person it was specifically written for.",(0,a.jsx)("br",{})]}),(0,a.jsx)(pe,{children:(0,a.jsx)("b",{children:"That person is you."})})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Part 01"}),(0,a.jsxs)(ce,{ref:i.ref,children:["The Past",(0,a.jsx)("br",{})," ",(0,a.jsx)("em",{children:"(how we got here)"})]}),(0,a.jsx)(P,{children:(0,a.jsx)(w,{src:d})}),(0,a.jsx)(pe,{children:"Remember the first time you logged on to the internet?"}),(0,a.jsx)(pe,{children:"Depending on how old you are, you might have had to connect your computer to an old 56k dial up modem which made a weird noise of electronic squawks and beeps."}),(0,a.jsx)(ie,{}),(0,a.jsx)(pe,{children:"And then, once a connection had been established, you suddenly had access to a completely new world. A world of seemingly infinite yet unknown possibilities. A world full of ideas, resources and thoughts from people all around the globe. A world waiting for you to be explored."}),(0,a.jsxs)(pe,{children:["It was mind blowing."," ",(0,a.jsx)(K,{children:(0,a.jsx)(q,{type:"light",children:"A magical moment."})})]}),(0,a.jsx)(pe,{children:"Everyone of us has experienced their own transformative moments with computers. The first time you touched a touchscreen. The first time you wrote and executed a line of code. The first time you discovered a video game that completely consumed you."}),(0,a.jsx)(pe,{children:"It’s often difficult to describe these moments because, like magic, they lie beyond articulation. They have to be experienced."}),(0,a.jsx)(pe,{children:"Computers are not magic in themselves. It’s the software that runs on them, the interaction between bits and atoms, that makes them magical."}),(0,a.jsx)(pe,{children:"One ingredient of computer magic is software’s ability to create even more magical experiences. It’s a tool for tools. Great software supports human intellect. But magical software enhances human creativity."}),(0,a.jsx)(pe,{children:"The early pioneers of modern computing described computers as “dream machines”. What got them excited about computers was not so much what they were, but everything they had the potential to be."}),(0,a.jsx)(pe,{children:"This is the other facet of software magic: It stretches our imagination beyond what we thought was possible. Great software makes us feel like we live in the future. But magical software allows us to imagine the future that comes after it."}),(0,a.jsx)(pe,{children:"We look back at these magical moments with nostalgia."}),(0,a.jsx)(pe,{children:(0,a.jsx)("b",{children:"What happened to them?"})})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Part 02"}),(0,a.jsxs)(ce,{ref:n.ref,children:["The Present",(0,a.jsx)("br",{})," ",(0,a.jsx)("em",{children:"(the status quo)"})]}),(0,a.jsx)(P,{children:(0,a.jsx)(v,{src:c})}),(0,a.jsx)(pe,{children:"We now live in a world where computers have become ubiquitous. They are everywhere, in all shapes and sizes, available to us whenever we need them. We have dream machines at work, at home, and in each of our pockets."}),(0,a.jsx)(pe,{children:"The computing capacity of these machines is mind boggling. Even the most audacious cyber-visionaries of the past would not have predicted the power available at our fingertips today."}),(0,a.jsx)(pe,{children:"As a result, the world we live in today is shaped and dominated by bits rather than just atoms. Software now touches every arena of human society and more and more aspects of our lives depend on it."}),(0,a.jsxs)(pe,{children:["It sounds like the future.",(0,a.jsx)("br",{}),"But it’s not the future we envisioned."]}),(0,a.jsx)(pe,{children:"While software is indeed everywhere, truly magical software has become incredibly rare. It was slowly suppressed and pushed away by dark forces."}),(0,a.jsxs)(pe,{children:["Enter the ",(0,a.jsx)(q,{type:"dark",children:"villains of this story."})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Dark Force 01"}),(0,a.jsx)(he,{children:"Noise & Distraction"}),(0,a.jsxs)(pe,{children:["The idea of augmenting our work with the help of software was well intended. But instead of creativity enhancing superpowers, we got attention-seeking productivity silos."," ",(0,a.jsx)(N,{$count:1,children:"Alerts"})," here,"," ",(0,a.jsx)(N,{$count:10,children:"notifications"})," there. We are spending more time with the coordination of our work than with the work we actually want to get done. Our dream machines are more powerful than ever before, but their output is riddled with noise and distractions."]})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Dark Force 02"}),(0,a.jsx)(he,{children:"Uniform sameness"}),(0,a.jsx)(pe,{children:"As competition intensifies, founders rush to get their products out into the market. Product teams literally work in sprints. Craftsmanship was replaced with growth hacks. It’s not just the software itself that lacks personality; has every tech company hired the same illustrator? Our once so lively dreams have become positively lifeless."})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Dark Force 03"}),(0,a.jsx)(he,{children:"The future is stuck in the past"}),(0,a.jsx)(pe,{children:"A famous quote says that the best way to predict the future is to invent it. Essentially, this is what the magic of software is all about: It lets us paint a vision of the future while simultaneously providing us with the tools to make that future a reality. And yet, ironically, the tools and principles with which we build the future are stuck in the past. The Agile Manifesto was published more than 20 years ago. Its terminology and fundamentals are outdated. But there’s also no definitive methodology that has taken its place."})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(pe,{children:"While we were busy dreaming up visionary ideas we failed to see the dark forces that crept in and clouded our plans. We have arrived at our destination, but it’s not the destination we had in mind. Error 404: Utopian future not found."}),(0,a.jsx)(pe,{children:(0,a.jsx)(q,{type:"dark",children:"The magic of software was lost along the way."})}),(0,a.jsxs)(pe,{children:["But not all hope is lost. ",(0,a.jsx)("br",{}),"What if we can bring it back?"]})]})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(ue,{children:"Part 03"}),(0,a.jsxs)(ce,{ref:s.ref,children:["The Future",(0,a.jsx)("br",{})," ",(0,a.jsx)("em",{children:"(the quest we are on)"})]}),(0,a.jsx)(P,{children:(0,a.jsx)(b,{src:h})}),(0,a.jsxs)(pe,{children:["In the not so distant past, a small group of individuals got together and decided to change the status quo. They decided to go on a quest and bring back the ",(0,a.jsx)(q,{type:"dream",children:"magic of software"}),"."]}),(0,a.jsxs)(pe,{children:["That small group is us. ",(0,a.jsx)("br",{}),"We are the toolmakers in this story."]}),(0,a.jsx)(pe,{children:"Every great story contains a sacred artifact of great importance. A legendary sword. A secret key. A mystical elixir. A powerful tool without which the battle against evil couldn’t be won."}),(0,a.jsx)(pe,{children:"Our mission is to create the tool for the story at hand. A tool that feels magical, but more importantly, a tool that grants whoever owns it the ability to create magic."}),(0,a.jsx)(pe,{children:"The tool we are building is the fastest of its kind. It is incredibly easy to use, but also grows more powerful with each interaction. And it comes with new and refined methodologies and practices around it to truly unleash its power."}),(0,a.jsxs)(pe,{children:["We chose to name it ",(0,a.jsx)("b",{children:"Linear"})," to signify progress."]}),(0,a.jsx)(pe,{children:"To bring back the magic of software, however, it needs more than just a powerful tool. A powerful tool needs a powerful operator, just like a magical story needs a courageous hero or heroine."}),(0,a.jsx)(pe,{children:"The real protagonists of this story are the creators. The designers who invent the dream worlds of tomorrow. The engineers who turn dreams into realities. The entrepreneurs who want to create impact. The ambitious teams who craft software experiences that truly feel magical again."}),(0,a.jsx)(pe,{children:"If technology is an expression of humanity’s dreams, then the future of technology is only bound by the limits of our dreams. We need to bring back the magic of software because it is the only way to push the boundaries of our dreams. Because it is the only way to give our dream machines back their real meaning."}),(0,a.jsx)(pe,{children:"We are coming to the end of our little tale and you might be wondering where you fit into all of this. After all, wasn’t this story specifically written for you?"}),(0,a.jsx)(pe,{children:"Indeed it was, dear reader."}),(0,a.jsx)(pe,{children:"We have reached the end of this page but only the beginning of our real story. And as fortune may have it, you have been elected to partake in its next chapters."}),(0,a.jsxs)(pe,{children:["Who you play in these chapters is for you to decide. You might be an engineer. You might be a designer. You might be a recruiter or a marketer. All that is certain is that you will help us to"," ",(0,a.jsx)(q,{type:"dream",children:"bring back the magic of software"}),"."]}),(0,a.jsxs)(pe,{children:["This is your call to adventure.",(0,a.jsx)("br",{}),"Hurry up and answer it.",(0,a.jsx)("br",{})]}),(0,a.jsx)(pe,{children:(0,a.jsx)("b",{children:"We are waiting for you."})})]}),(0,a.jsxs)(ye,{children:[(0,a.jsx)(he,{children:"Choose your character"}),(0,a.jsx)(o,{jobs:e})]})]})]}),(0,a.jsx)(xe,{$bottom:0,$direction:"top"})]})},ie=()=>(0,a.jsxs)(i,{children:[(0,a.jsx)("source",{src:"https://static.linear.app/assets/dialup.mp3",type:"audio/mpeg"}),(0,a.jsx)(pe,{children:"Your browser does not support HTML5 audio."})]}),ne=Te.div`
  /* Define stacking order for the illustrations */
  --layer-grid-bg: 0;
  --layer-radial-bg: 2;
  --layer-image: 2;
  --layer-screen: 3;
  --layer-text: 2;

  /* Computer sizing */
  --computer-width: 350px;

  /* Safari does not correctly handle "transparent", so use rgba() */
  /* https://twitter.com/shuding_/status/1479470507879804935?s=20 */
  --transparent: rgba(0, 0, 0, 0);

  /* Animation variables */
  --entry-duration: 800ms;
  --entry-stagger: 200ms;
  --entry-delay: 400ms;
  --entry-offset: 30px;
  --computer-delay: calc(7 * var(--entry-stagger) + var(--entry-delay));

  margin: 0 auto;
  padding: 120px 24px;
  position: relative;
  display: flex;
  align-items: flex-start;

  @media (max-width: ${e.tablet}px) {
    --computer-width: 275px;
  }

  @media (max-width: ${e.phone}px) {
    --computer-width: 300px;
    padding: 48px 24px;
    flex-direction: column;
    align-items: center;
  }

  /* EB Garamond Font */
  @font-face {
    font-family: "EB Garamond";
    font-display: block;
    src: url("https://static.linear.app/fonts/EBGaramond-Regular-subset.woff2") format("woff2");
    font-weight: 400;
  }

  @font-face {
    font-family: "EB Garamond";
    font-display: block;
    src: url("https://static.linear.app/fonts/EBGaramond-Italic-subset.woff2") format("woff2");
    font-weight: 400;
    font-style: italic;
  }
`,oe=Te.article`
  display: flex;
  flex: 1;
  flex-direction: column;
  z-index: var(--layer-text);

  font-size: clamp(16px, 1vw, 22px);
  max-width: 60ch;
  margin-left: 128px;

  @media (max-width: ${e.tablet}px) {
    margin-left: 64px;
  }

  @media (max-width: ${e.phone}px) {
    margin-left: 0;
  }
`,se=Ae`
  from {
    opacity: 0;
    transform: translateX(-64px) translateY(var(--entry-offset));
  }

  50%{
    transform: translateX(-64px) translateY(0);
  }

  75% {
    opacity: 1;
  }

  to {
    opacity: 1;
    transform: none;
  }
`,le=Ae`
  from {
    opacity: 0;
    transform: translateY(var(--entry-offset));
  }

  to {
    opacity: 1;
    transform: none;
  }
`,de=Te.h1`
  position: relative;
  z-index: var(--layer-text);
  font-weight: var(--font-weight-normal);
  font-size: 4.5em;
  line-height: 1;
  font-family:
    EB Garamond,
    serif;
  color: var(--color-text-primary);

  opacity: 0;
  transform: translateX(-64px);
  animation: ${se} 4s var(--entry-delay) forwards;

  @media (max-width: ${e.phone}px) {
    text-align: center;
    transform: none;
    animation: ${le} 2s var(--entry-delay) forwards;
  }
`,ce=Te.h2`
  position: relative;
  z-index: var(--layer-text);
  font-family:
    EB Garamond,
    serif;
  font-size: 4em;
  line-height: 1.125;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);

  @media (max-width: ${e.phone}px) {
    text-align: center;
    margin-bottom: 64px;
  }
`,he=Te.h3`
  position: relative;
  z-index: var(--layer-text);
  font-family:
    EB Garamond,
    serif;
  font-size: 2.25em;
  line-height: 1.125;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);

  @media (max-width: ${e.phone}px) {
    text-align: center;
  }
`,pe=Te.p`
  position: relative;
  z-index: var(--layer-text);
  font-size: 1em;
  line-height: 1.75;
  color: var(--color-text-secondary);
  margin: 28px 0;
`,ue=Te.span`
  display: block;
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;

  @media (max-width: ${e.phone}px) {
    text-align: center;
  }
`,me=Te.div`
  @media (max-width: ${e.phone+1}px) {
    display: none;
  }
`,fe=Te.div`
  @media (min-width: ${e.phone}px) {
    display: none;
  }
`,xe=Te.div`
  --direction: ${e=>e.$direction&&"bottom"!==e.$direction?"0deg":"180deg"};
  --shadow-size: 128px;
  ${e=>e.$top?`top: ${e.$top}px;`:""}
  ${e=>e.$bottom?`bottom: ${e.$bottom}px;`:""}

  pointer-events: none;
  position: sticky;
  height: var(--shadow-size);
  margin-top: calc(-1 * var(--shadow-size));
  background: linear-gradient(var(--direction), var(--color-bg-primary) 0%, transparent 100%);
  width: 100%;
  z-index: 4;

  @media (max-width: ${e.phone}px) {
    --shadow-size: 64px;
  }
`,ge=Ae`
  to {
    opacity: 1;
  }
`,ye=Te.section`
  position: relative;
  opacity: 0;
  animation: ${ge} var(--entry-duration) 3.6s ease forwards;

  & + & {
    margin-top: 4em;
  }

  & > & {
    margin-top: 3em;
  }

  @media (max-width: ${e.phone}px) {
    animation-delay: 2s;
  }
`,we={default:ae};export{we as export_2aa8ac7289a8};