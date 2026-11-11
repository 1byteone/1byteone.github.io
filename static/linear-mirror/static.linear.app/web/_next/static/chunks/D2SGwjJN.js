var t,r,e,s,o,a,n;import{o as i}from"./C_JJxWoe.js";import{Ur as l,ai as m}from"./DipWGRuU.js";import{a as c}from"./DvPgvKbY2.js";import{t as f}from"./D6APSEOU2.js";import{t as x}from"./CHkfo8LG2.js";import{t as j}from"./BWuOVdWQ.js";import{n as h}from"./DVq3wahd.js";t=i(m(),1),r=i(f(),1),e=l(),s=t=>j()?(0,e.jsx)(e.Fragment,{children:t.text}):(0,e.jsx)(o,{...t}),o=s=>{const[o,i]=t.useState(s.text),[l,m]=t.useState(0),c=t.useRef(null);function f(t){const r=t.split("");for(let e=0;e<r.length;e++)n.includes(r[e])&&(r[e]=n[Math.floor(Math.random()*n.length)]);return r.join("")}return t.useEffect(()=>{i(f(s.text))},[]),h([c],(0,r.default)(t=>{const r=t/(1/s.text.length);m(Math.floor(r)),i(f(s.text))},50),{endVh:40}),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(x,{children:s.text}),(0,e.jsxs)(a,{ref:c,"aria-hidden":!0,children:[(0,e.jsx)("span",{children:s.text.slice(0,l)}),o.slice(l)]})]})},a=c.span`
  color: var(--color-text-tertiary);

  & span {
    color: var(--color-text-primary);
  }
`,n="abcdefghijklmnopqrstuvwxyz0123456789";export{s as t};