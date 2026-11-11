var o,a,t;import{a as i,o as n}from"./DvPgvKbY2.js";o=o=>n`
  0% {
    opacity: 0;
    transform: translate(${o.x||0}px, ${o.y||0}px);
    ${o.customFrom?o.customFrom:""};
  }

  100% {
    opacity: 1;
    transform: translate(0, 0);
    ${o.customTo?o.customTo:""};
  }
`,a=new Set(["x","y","customFrom","customTo","duration","delay"]),t=i.div.withConfig({shouldForwardProp:o=>!a.has(o)})`
  @media (prefers-reduced-motion: no-preference) {
    animation-name: ${a=>o(a)};
    animation-duration: ${o=>void 0!==o.duration?o.duration:.4}s;
    animation-delay: ${o=>void 0!==o.delay?o.delay:0}s;
    transition-timing-function: ease-out;
    animation-fill-mode: both;
  }
`;export{t};