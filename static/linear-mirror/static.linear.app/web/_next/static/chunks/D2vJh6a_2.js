var e,t,r,n,a,o,i,s,d,l,c,u,p,f,v;import{o as m}from"./C_JJxWoe.js";import{Ur as h,ai as b}from"./DipWGRuU.js";import{l as g}from"./C2IMloCD.js";import{c as k,d as x,i as j,s as y,t as C,u as D}from"./C91hS4zJ.js";import{n as P,t as R}from"./Z6Gs-4fl.js";import{a as w}from"./DvPgvKbY2.js";import{o as B}from"./BbpqRa-j2.js";import{t as I}from"./T9q9vAyu2.js";import{b as M,p as E,t as V}from"./D-BNo7-q2.js";import{t as F}from"./Dohs_Jv_.js";import{r as T,t as q}from"./D4oWdBH-.js";import{n as N,t as U}from"./BvFsNBrI.js";import{t as O}from"./D5zhMR6d.js";import{t as S}from"./DHrMaNaM.js";import{a as A,c as H,i as W,n as G,o as K,t as $}from"./Bf_SV31p.js";import{n as z,t as J}from"./BvzvFGUN.js";function L(e){return{checked:n=>e.indeterminate?{}:n?{[t]:""}:{[r]:""},...H}}e=m(b(),1),t="data-checked",r="data-unchecked",n=e.createContext(void 0),a=e.createContext(void 0),o=h(),i="data-parent",s=e.forwardRef(function(t,r){const{checked:s,className:d,defaultChecked:l=!1,"aria-labelledby":c,disabled:u=!1,form:p,id:f,indeterminate:v=!1,inputRef:m,name:h,onCheckedChange:b,parent:k=!1,readOnly:w=!1,render:B,required:F=!1,uncheckedValue:T,value:q,nativeButton:S=!1,style:H,...Q}=t,{clearErrors:X}=$(),{disabled:Y,name:Z,setDirty:_,setFilled:ee,setFocused:te,setTouched:re,state:ne,validationMode:ae,validityData:oe,validation:ie}=K(),se=z(),{labelId:de,registerControlId:le,getDescriptionProps:ce}=A(),ue=e.useContext(n),pe=void 0===ue?.allValues?void 0:ue.parent,fe=void 0!==pe,ve=Y||se.disabled||ue?.disabled||u,me=Z??h,he=q??me,be=M(),ge=W({id:f||void 0,enabled:ue?.registerControlId!==le}),ke=S?ge:be;let xe={};fe&&(k?xe=pe.getParentProps():void 0!==he&&(xe=pe.getChildProps(he)));const{checked:je=s,indeterminate:ye=v,onCheckedChange:Ce,...De}=xe,Pe=ue?.value,Re=e.useRef(null),{getButtonProps:we,buttonRef:Be}=R({disabled:ve,native:S}),Ie=ue?.validation??ie,[Me,Ee]=I({controlled:void 0===he||void 0===Pe||k?je:Pe.includes(he),default:l,name:"Checkbox",state:"checked"}),Ve=fe?Boolean(je):Me,Fe=fe&&ye||v;G(Re,be,Me,void 0,!ue&&!ve,h);const Te=pe?.registerChildId,qe=e.useRef(null),Ne=Ie.registerInput,Ue=ue?he:void 0,Oe=e.useCallback(e=>Ne(e,{controlRef:Re,value:Ue}),[Ne,Ue]),Se=y(m,qe,k?void 0:Oe),Ae=J(c,de,qe,!S,ge);x(()=>{qe.current&&(qe.current.indeterminate=Fe),ue||ee(Me)},[Me,Fe,ue,ee]),O(Me,()=>{ue||(X(me),_(Me!==oe.initialValue),Ie.change(Me))});const He=D({checked:Me,disabled:ve,form:p,name:k?void 0:me,id:S?void 0:ge,required:F,ref:Se,style:me?N:U,tabIndex:-1,type:"checkbox","aria-hidden":!0,onChange(e){if(e.nativeEvent.defaultPrevented)return;if(w)return void e.preventDefault();const t=e.currentTarget.checked,r=V(E,e.nativeEvent);if(b?.(t,r),!(r.isCanceled||(Ce?.(t,r),r.isCanceled||(Ee(t),void 0===he||void 0===ue||k||fe)))){const e=t?[...ue.value,he]:ue.value.filter(e=>e!==he);ue.setValue(e,r)}},onClick(e){e.stopPropagation()},onFocus(){Re.current?.focus()}},void 0!==q?{value:(ue?Me&&q:q)||""}:j,ce,e=>Ie.getValidationProps(ve,e));e.useEffect(()=>{if(!pe||void 0===he)return;const e=pe.disabledStatesRef.current;return e.set(he,ve),()=>{e.delete(he)}},[pe,ve,he]);const We=e.useMemo(()=>({...ne,checked:Ve,disabled:ve,readOnly:w,required:F,indeterminate:Fe}),[ne,Ve,ve,w,F,Fe]),Ge=L(We),Ke=C("span",t,{state:We,ref:[Be,Re,r],props:[{id:ke,role:"checkbox","aria-checked":Fe?"mixed":Ve,"aria-readonly":w||void 0,"aria-required":F||void 0,"aria-labelledby":Ae,[i]:k?"":void 0,onFocus(){ve||te(!0)},onBlur(){const e=qe.current;e&&(re(!0),te(!1),"onBlur"===ae&&Ie.commit(ue?Pe:e.checked))},onKeyDown(e){if("Enter"!==e.key)return;if(e.preventBaseUIHandler(),e.defaultPrevented)return;const t=qe.current?.form??null,r=e.currentTarget,n=e.nativeEvent,a=e.preventDefault,o=n.preventDefault;let i=!1;e.preventDefault=()=>{i=!0,a.call(e)},n.preventDefault=()=>{i=!0,o.call(n)},o.call(n),g(r).queueMicrotask(()=>{e.preventDefault=a,n.preventDefault=o,i||function(e){if(!e)return null;for(const t of e.elements){const e=t.tagName;if("BUTTON"===e||"INPUT"===e){const e=t;if("submit"===e.type)return e}}return null}(t)?.click()})},onClick(e){if(w||ve)return;e.preventDefault();const t=qe.current;t&&P(t,e)}},Q,De,we,ce,e=>Ie.getValidationProps(ve,e)],stateAttributesMapping:Ge}),$e=Ke.props.id;return x(()=>{if(Te&&!k&&void 0!==he&&void 0!==$e)return Te(he,$e)},[Te,k,he,$e]),(0,o.jsxs)(a.Provider,{value:We,children:[Ke,!Me&&!ue&&me&&!k&&void 0!==T&&(0,o.jsx)("input",{type:"hidden",form:p,name:me,value:T,disabled:ve}),(0,o.jsx)("input",{...He,suppressHydrationWarning:!0})]})}),d=e.forwardRef(function(t,r){const{render:n,className:o,style:i,keepMounted:s=!1,...d}=t,l=function(){const t=e.useContext(a);if(void 0===t)throw new Error(k(14));return t}(),c=l.checked||l.indeterminate,{mounted:u,transitionStatus:p,setMounted:f}=T(c),v=e.useRef(null),m={...l,transitionStatus:p};q({batch:!0,enabled:!c,open:c,ref:v,onComplete(){c||f(!1)}});const h={...L(l),...F},b=s||u,g=C("span",t,{ref:[r,v],state:m,stateAttributesMapping:h,props:d});return b?g:null}),l=e=>{const{children:t,...r}=e;return(0,o.jsxs)(c,{children:[(0,o.jsxs)(p,{children:[(0,o.jsx)(o.Fragment,{children:"​"}),(0,o.jsx)(u,{...r,render:(0,o.jsx)("button",{type:"button"}),nativeButton:!0,children:(0,o.jsx)(f,{keepMounted:!0,children:(0,o.jsx)(S,{})})})]}),(0,o.jsx)(v,{children:t})]})},c=w.label`
  display: inline-flex;
  align-items: flex-start;
  cursor: pointer;
  user-select: none;
`,u=w(s)`
  ${B()}
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  min-height: 18px;

  background: transparent;
  border-radius: 5px;
  border: 1px solid var(--color-border-tertiary);
  color: var(--color-brand-text);

  &[data-checked] {
    background: var(--color-brand-bg);
    border-color: var(--color-brand-bg);
  }

  &[data-unchecked] {
    &:active {
      background: var(--color-bg-tertiary);
    }
  }
`,p=w.span`
  display: flex;
  align-items: center;
  position: relative;
`,f=w(d)`
  & svg {
    fill: currentColor;
    display: block;
    width: 12px;
    height: 12px;
  }

  &[data-unchecked] {
    opacity: 0;
  }
`,v=w.div`
  margin-left: 12px;
`;export{l as t};