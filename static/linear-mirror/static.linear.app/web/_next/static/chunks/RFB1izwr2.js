var e,r,t,n,i,s,a,o,l,c,u,d,m,p,f,g,h,b,v,y,x,j,w,S,R,$,L,T,_,k,z,E,N,C,F,P,D,U;import{o as I}from"./C_JJxWoe.js";import{Ur as O,ai as W}from"./DipWGRuU.js";import{t as A}from"./CjEbGxT8.js";import{t as q}from"./D0KO9uUz.js";import{t as Q}from"./Tbc7QM4C.js";import{t as X}from"./CrhVKJXH2.js";import{a as H}from"./DvPgvKbY2.js";import{t as M}from"./BbpqRa-j2.js";import{t as V}from"./Cyle13d_2.js";import{t as B}from"./B1Zk7NIj2.js";import{t as G}from"./C5rym-AJ2.js";import{t as J}from"./CZiyYYAU.js";import{t as K}from"./cCBEtYzB.js";import{t as Y}from"./BoTu5-Vy.js";import{t as Z}from"./BPWPniRV2.js";import{t as ee}from"./CdVmPjvf2.js";import{t as re}from"./HjE9mujT2.js";import{t as te}from"./Bv-rMoBQ.js";import{t as ne}from"./CTgjo2h12.js";import{t as ie}from"./zA0SDFyN2.js";import{n as se,t as ae}from"./CtPJhibi2.js";import{r as oe,t as le}from"./CNM7zJgo2.js";import{n as ce,t as ue}from"./Da_Xw8TL2.js";import{t as de}from"./oLOsZ8nz2.js";import{t as me}from"./CJAIc7nr2.js";import{t as pe}from"./CikhVEJp2.js";import{t as fe}from"./D5AIPRwg2.js";async function ge(e){const r=ue();if(!r)throw new Error("ApplicationStore is not available");const t={filename:e.name,contentType:e.type,size:e.size},n=new le;try{const i=await n.mutate(p,t,{user:r.currentUserId,useraccount:r.currentUserAccountId}),s=new Headers;return s.set("Cache-Control","public, max-age=31536000"),s.set("Content-Type",e.type),i.fileUpload.uploadFile.headers.forEach(({key:e,value:r})=>s.set(e,r)),await fetch(i.fileUpload.uploadFile.uploadUrl,{method:"PUT",headers:s,body:e}),i.fileUpload.uploadFile.assetUrl}catch(i){throw new o("Failed to upload file. Please try again.")}}function he(e,r){return e===r}function be({search:r}){const t=e.useId(),i="done"===r.status&&r.references.length>0?r.references:void 0,[s,a]=e.useState([]);i&&i!==s&&a(i);const[o,l]=e.useState(new Set),c=function(e,r,t){return"searching"===e.status?"waiting":r?r.some(e=>e.iconRef&&!t.has(e.iconRef))?"waiting":"visible":"hidden"}(r,i,o),[u,d]=e.useState(!1),m="waiting"===c?u:"visible"===c;function p(e){e&&l(r=>new Set(r).add(e))}m!==u&&d(m);const f="visible"===c;return(0,n.jsx)("div",{className:L,"data-open":u?"":void 0,inert:!u,children:(0,n.jsx)("div",{className:T,children:(0,n.jsxs)("section",{className:k,"aria-labelledby":t,"aria-busy":"waiting"===c,children:[(0,n.jsx)(M,{as:"h3",id:t,className:S,"data-visible":f?"":void 0,style:{"--stagger-index":0},size:"small",weight:"normal",color:"var(--color-text-quaternary)",wrap:"none",children:"Suggested docs"}),s.length>0&&(0,n.jsx)("ul",{className:$,inert:!f,children:s.map((e,r)=>(0,n.jsx)("li",{className:S,"data-visible":f?"":void 0,style:{"--stagger-index":r},children:(0,n.jsxs)(q,{className:R,href:e.url,tab:!0,children:[e.iconRef?(0,n.jsx)(te,{onLoad:()=>p(e.iconRef),onError:()=>p(e.iconRef),className:w,image:{_key:e.url,_type:"image",asset:{_type:"reference",_ref:e.iconRef}},width:14,height:14,alt:"",loading:"eager"}):(0,n.jsx)(pe,{}),(0,n.jsxs)(M,{size:"small",weight:"medium",truncate:!0,children:[e.title,e.section&&s.filter(r=>r.title===e.title).length>1&&(0,n.jsxs)("span",{className:_,children:[" · ",e.section]})]})]})},e.url))})]})})})}function ve({state:s,dispatch:a,submittedContent:o}){const c=ce(),p=e.useId(),w=function(r){const t=r.replace(/\s+/g," ").trim(),[n]=(o=t,l=he,c=(0,e.useRef)(o),u=(0,e.useState)({})[1],d=function(r,t,n){var i,s,a,o,l,c,u,d=this,m=(0,e.useRef)(null),p=(0,e.useRef)(0),f=(0,e.useRef)(null),g=(0,e.useRef)([]),h=(0,e.useRef)(),b=(0,e.useRef)(),v=(0,e.useRef)(r),y=(0,e.useRef)(!0);if(v.current=r,i=!0,s=!t&&0!==t&&i,"function"!=typeof r)throw new TypeError("Expected a function");return t=+t||0,a=!!(n=n||{}).leading,o=!("trailing"in n)||!!n.trailing,l="maxWait"in n,c="debounceOnServer"in n&&!!n.debounceOnServer,u=l?Math.max(+n.maxWait||0,t):null,(0,e.useEffect)(function(){return y.current=!0,function(){y.current=!1}},[]),(0,e.useMemo)(function(){var e=function(e){var r=g.current,t=h.current;return g.current=h.current=null,p.current=e,b.current=v.current.apply(t,r)},r=function(e,r){s&&cancelAnimationFrame(f.current),f.current=s?requestAnimationFrame(e):setTimeout(e,r)},n=function(e){if(!y.current)return!1;var r=e-m.current;return!m.current||r>=t||r<0||l&&e-p.current>=u},i=function(r){return f.current=null,o&&g.current?e(r):(g.current=h.current=null,b.current)},c=function e(){var s,a=Date.now();if(n(a))return i(a);y.current&&(s=t-(a-m.current),r(e,l?Math.min(s,u-(a-p.current)):s))},x=function(){var i=Date.now(),s=n(i);if(g.current=[].slice.call(arguments),h.current=d,m.current=i,s){if(!f.current&&y.current)return p.current=m.current,r(c,t),a?e(m.current):b.current;if(l)return r(c,t),e(m.current)}return f.current||r(c,t),b.current};return x.cancel=function(){f.current&&(s?cancelAnimationFrame(f.current):clearTimeout(f.current)),p.current=0,g.current=m.current=h.current=f.current=null},x.isPending=function(){return!!f.current},x.flush=function(){return f.current?i(Date.now()):b.current},x},[a,l,t,u,o,s,i,c])}((0,e.useCallback)(function(e){c.current=e,u({})},[u]),500,void 0),l((m=(0,e.useRef)(o)).current,o)||(d(o),m.current=o),[c.current,d]),i=t.length>3&&t.length<=2e3,{data:s,isLoading:a}=V(i&&t===n?["support-docs",n]:null,([,e])=>async function(e){const r=await fetch("/api/support-docs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e}),signal:AbortSignal.timeout(12e3)});if(!r.ok)throw new Error("Docs suggestions unavailable");return r.json()}(e),{revalidateIfStale:!1,revalidateOnFocus:!1,revalidateOnReconnect:!1,shouldRetryOnError:!1});var o,l,c,u,d,m;return i?t!==n||a?{status:"searching"}:{status:"done",references:s?.references??[]}:{status:"idle"}}(s.body),[S,R]=e.useState(s.files);s.files.length>0&&s.files!==S&&R(s.files);const $=s.errors.body||s.errors.files||s.errors.form,L=e.useCallback(e=>{a({errors:{...s.errors,files:e.message}})},[a,s.errors]),T=e.useCallback(e=>{a({files:[...s.files,...e],errors:{...s.errors,files:""}})},[a,s.errors,s.files]);return(0,n.jsx)(K,{initial:!1,mode:"popLayout",children:s.success?(0,n.jsx)(J.div,{initial:z,animate:E,exit:z,transition:N,children:o},"submitted"):(0,n.jsxs)(J.div,{initial:z,animate:E,exit:z,transition:N,className:j,children:[(0,n.jsxs)("div",{className:y,"data-hide":"logged-in",children:[(0,n.jsx)(M,{size:"small",color:"var(--color-text-tertiary)",align:"center",wrap:"balance",style:{maxWidth:"35ch"},children:"Log in to your Linear account so we can help you faster:"}),(0,n.jsx)(A,{variant:"secondary",size:"small",href:"/login",children:"Log in"})]}),(0,n.jsx)(ie,{onSubmit:async function(){if(c)try{a({submitting:!0,errors:{...P.errors}}),await async function(e){const n=e.map((e,r)=>{const t=s.files[r];return l.Image.includes(t.type)?`![${t.name}](${e})`:`[${s.files[r].name}](${e})`}).join("\n");return function(e,r){const t=oe`
    mutation (
      $type: String!
      $message: String!
      $disappointmentRating: Int
      $operatingSystem: String
      $browser: String
      $device: String
      $clientVersion: String
      $source: String
    ) {
      contactCreate(
        input: {
          type: $type
          message: $message
          disappointmentRating: $disappointmentRating
          operatingSystem: $operatingSystem
          browser: $browser
          device: $device
          clientVersion: $clientVersion
          source: $source
        }
      ) {
        success
      }
    }
  `;return e.mutate(t,r)}(new le,{type:t.support,message:`${s.body}\n\n${n}`.trim(),source:r.website}).catch(e=>{B.error("Support Form: error submitting message",e);const r=e.response.errors?.[0]?.extensions?.userPresentableMessage||"Error submitting your message. Please try again.";throw new Error(r)})}(await async function(){return Promise.all(s.files.map(ge)).catch(e=>{throw B.error("Support Form: error uploading files",e),new Error("Error uploading files. Please try again.")})}()),a({success:!0,errors:{...P.errors}})}catch(e){a({errors:{...s.errors,form:e.message}})}finally{a({submitting:!1})}else a({errors:{...s.errors,form:"You must log in or contact support@linear.app."}})},"data-show":"logged-in",children:(0,n.jsx)("fieldset",{disabled:s.submitting,children:(0,n.jsxs)(u,{disabled:s.submitting,acceptedTypes:C,onError:L,onChange:T,children:[(0,n.jsx)(se,{htmlFor:p,style:{textWrap:"pretty"},children:"Please share any relevant information we may need to answer your question."}),(0,n.jsx)(Y,{height:"12px"}),(0,n.jsxs)("div",{className:g,children:[(0,n.jsx)(m,{render:(0,n.jsx)("div",{className:x,children:"Drop file to attach"})}),(0,n.jsx)(ae,{rows:6,placeholder:"How do I…",id:p,value:s.body,required:!0,maxLength:2e3,onChange:e=>{a({body:e.target.value,errors:{...s.errors,body:""}})}}),(0,n.jsx)("div",{className:b,"data-open":s.files.length>0?"":void 0,inert:0===s.files.length,children:(0,n.jsx)("div",{className:v,children:(0,n.jsx)(G,{align:"center",gap:24,children:S.map(e=>(0,n.jsx)(i,{file:e,disabled:s.submitting,onRemove:()=>{a({files:s.files.filter(r=>r.id!==e.id)})}},e.id))})})})]}),(0,n.jsx)(Y,{height:"16px"}),(0,n.jsxs)(G,{align:"center",justify:"space-between",gap:8,style:{width:"100%"},children:[(0,n.jsxs)(G,{align:"center",gap:16,wrap:!0,children:[(0,n.jsx)(d,{disabled:s.submitting||s.files.length>5,style:{display:"inline-flex"},render:(0,n.jsxs)("label",{className:h,children:[(0,n.jsx)(ne,{}),(0,n.jsx)(M,{size:"small",weight:"normal",children:"Attach images or videos"})]})}),$&&(0,n.jsxs)(G,{align:"center",gap:6,children:[(0,n.jsx)(me,{className:f}),(0,n.jsx)(M,{size:"small",weight:"normal",color:"var(--color-red)",children:$})]})]}),(0,n.jsxs)(A,{variant:"secondary",type:"submit",size:"small",children:[s.submitting&&(0,n.jsx)(re,{}),"Send message"]})]}),(0,n.jsx)(be,{search:w})]})})})]},"form")})}e=I(W(),1),r=function(e){return e.app="app",e.website="website",e.linearAgent="linearAgent",e}({}),t=function(e){return e.support="support",e.question="question",e.feedback="feedback",e.sales="sales",e.exitSurvey="exitSurvey",e.mobilePreorder="mobilePreorder",e.prioritySupport="prioritySupport",e.lead="lead",e}({}),n=O(),i=r=>{const[t,i]=e.useState("");return e.useEffect(()=>{const e=[],t=URL.createObjectURL(r.file);if(e.push(t),r.file.type.includes("image"))return i(t);if(r.file.type.includes("video")){const r=document.createElement("canvas"),n=document.createElement("video"),s=r.getContext("2d");if(!s)return;n.addEventListener("loadedmetadata",()=>{r.width=n.videoWidth,r.height=n.videoHeight},{once:!0}),n.addEventListener("loadeddata",()=>{setTimeout(()=>{s.drawImage(n,0,0,n.videoWidth,n.videoHeight),r.toBlob(r=>{if(r){const t=URL.createObjectURL(r);e.push(t),i(t)}},"image/png")},100)},{once:!0}),n.src=t,n.crossOrigin="anonymous",n.preload="metadata",n.currentTime=.1,n.load()}return()=>{e.forEach(e=>URL.revokeObjectURL(e))}},[]),(0,n.jsx)(s,{style:t?{backgroundImage:`url(${t})`}:void 0,title:r.file.name,children:(0,n.jsx)(A,{onClick:r.onRemove,disabled:r.disabled,children:(0,n.jsx)(X,{})})})},s=H.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px var(--color-border-translucent);
  background-color: rgba(255, 255, 255, 0.1);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &:hover button,
  & button:focus {
    opacity: 1;
  }

  & button {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    background: #0a0c1b;
    border-radius: var(--radius-rounded);
    opacity: 0;
  }
`,a=I(Z(),1),o=class e extends Error{constructor(r){super(r),Object.setPrototypeOf(this,e.prototype)}},l={Image:["image/jpeg","image/png","image/gif","image/bmp","image/webp"],Video:["video/mp4","video/mpeg","video/quicktime","video/webm"]},c=e.createContext(void 0),u=r=>{const[t,i]=e.useState("valid"),{acceptedTypes:s,onError:l,onChange:u,maxFileSize:d,...m}=r,p=e.useCallback(e=>{const r=[];e.forEach(e=>{if(!s.includes(e.type))return void l?.(new o(`${e.name} is not a supported file type.`));if(e.size>(d??5242880))return void l?.(new o(`${e.name} is too large. The maximum file size is ${d??5}mb.`));const t=e;t.id=(0,a.default)(),r.push(t)}),r.length>0&&u?.(r)},[s,d,l,u]);function f(e){e.preventDefault(),e.stopPropagation(),i("active"),e.dataTransfer.types.some(e=>"files"!==e.toLowerCase())&&i("invalid")}function g(e){e.preventDefault(),e.stopPropagation(),i("valid")}const h=e.useMemo(()=>({acceptedTypes:s,attachFiles:p,dropState:t}),[s,p,t]);return(0,n.jsx)(c.Provider,{value:h,children:(0,n.jsx)("div",{onDrag:r.disabled?void 0:f,onDragEnter:r.disabled?void 0:f,onDragOver:r.disabled?void 0:f,onDragEnd:r.disabled?void 0:g,onDragLeave:r.disabled?void 0:g,onDrop:r.disabled?void 0:function(e){g(e);const r=Array.from(e.dataTransfer.files);if(0===r.length)return i("invalid");i("valid"),p(r)},"data-drop-state":t,...m,children:r.children})})},d=r=>{const t=e.useContext(c),i=e.useId(),{render:s,ref:a,...o}=r,l=ee({render:s,ref:a,defaultTagName:"label",props:{...o,htmlFor:i}});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("input",{id:i,className:Q.visuallyHidden,disabled:r.disabled,type:"file",multiple:!0,accept:t.acceptedTypes.join(","),onChange:e=>{const r=e.currentTarget.files?Array.from(e.currentTarget.files):void 0;r&&t.attachFiles(r),e.target.value=""}}),l]})},m=r=>{const t=e.useContext(c),{render:n,ref:i,...s}=r;return ee({render:n,ref:i,defaultTagName:"div",props:s,enabled:"active"===t.dropState})},p=oe`
  mutation FileUploadMutation(
    $filename: String!
    $contentType: String!
    $size: Int!
    $metaData: JSON
    $makePublic: Boolean
  ) {
    fileUpload(
      filename: $filename
      contentType: $contentType
      size: $size
      metaData: $metaData
      makePublic: $makePublic
    ) {
      uploadFile {
        filename
        contentType
        size
        uploadUrl
        assetUrl
        metaData
        headers {
          key
          value
        }
      }
    }
  }
`,f="zL_pcW_errorInfoIcon",g="zL_pcW_field",h="zL_pcW_fileLabel",b="zL_pcW_files",v="zL_pcW_filesInner",y="zL_pcW_loggedOutPanel",x="zL_pcW_overlay",j="zL_pcW_root",w="RX35Qa_icon",S="RX35Qa_item",R="RX35Qa_link",$="RX35Qa_links",L="RX35Qa_reveal",T="RX35Qa_root",_="RX35Qa_section",k="RX35Qa_suggestions",z={opacity:0,filter:"blur(10px)"},E={opacity:1,filter:"blur(0px)"},N={duration:.3,ease:[.25,.1,.25,1]},C=[...l.Image,...l.Video],F=(e,r)=>({...e,...r}),P={files:[],errors:{body:"",form:"",files:""},submitting:!1,success:!1,body:""},D=()=>e.useReducer(F,P),U={SupportFormPanel:function(){const[e,r]=D();return(0,n.jsx)(fe,{heading:"Tell us how we can help",isSubmitted:e.success,children:(0,n.jsx)(ve,{state:e,dispatch:r,submittedContent:(0,n.jsx)(de,{variant:"large",title:"Thanks, we’ll be in touch shortly.",description:"In the meantime, explore our Documentation to get an overview of Linear’s features and integrations.",href:"/docs",label:"Linear Docs"})})})}};export{U as export_7b656f2a2f73};