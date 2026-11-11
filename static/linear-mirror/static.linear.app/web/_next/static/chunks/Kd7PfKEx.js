var e,t,i,n,r,s,a,o,d,l,c,p,x,g,h,m,u,f,j,w,b,v,y,k,$,z,L,A,F,I,S,T,N,C,M,E,P,B,D,H,R,q,G,U,K,O,W,J,V,Q,Y,Z,X,_,ee,te,ie,ne,re,se,ae,oe,de,le,ce,pe,xe,ge,he,me,ue,fe,je,we,be,ve,ye,ke,$e,ze,Le,Ae,Fe,Ie;import{o as Se}from"./C_JJxWoe.js";import{Ur as Te,ai as Ne}from"./DipWGRuU.js";import{t as Ce}from"./nOinz7jz.js";import{a as Me}from"./DvPgvKbY2.js";import{t as Ee}from"./hVNE-_hy.js";function Pe(e){return`@supports (-webkit-background-clip: text) {\n    background: ${e};\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n\n  @supports (background-clip: text) {\n    background: ${e};\n    background-clip: text;\n  }`}function Be(e){return(0,t.jsxs)(c,{children:[(0,t.jsx)("div",{children:e.top}),(0,t.jsx)("div",{children:e.bottom})]})}function De(e){return(0,t.jsx)("a",{href:e.href,className:e.className,target:"_blank",rel:"noreferrer noopener","aria-label":e["aria-label"],children:e.children})}function He(i){const[n,r]=Ee({threshold:i.threshold||.7,triggerOnce:!0}),s=e.useMemo(()=>{if(r)return{opacity:"1",transform:"translate(0, 0)"};switch(i.from){case"bottom":return{transform:"translate(0, 20px)"};case"right":return{transform:"translate(20px, 0)"};default:return}},[r]);return(0,t.jsx)(p,{ref:n,style:s,className:i.className,children:i.children})}function Re(e){const i=`${e.url}.${e.extension}`,n=`${e.url}@2x.${e.extension}`;return(0,t.jsx)("img",{className:e.className,alt:e.alt,src:i,srcSet:`${i}, ${n} 2x`})}function qe(e,t){return`\n    background-image: url("${e}.${t}");\n    background-image: image-set(\n      url("${e}.${t}") 1x,\n      url("${e}@2x.${t}") 2x\n    );\n  `}function Ge(t){const[i,n]=e.useState(!1);return e.useEffect(()=>{const e=setTimeout(()=>{n(!0)},t);return()=>{clearTimeout(e)}},[]),i}function Ue(){const i=Ge(0),n=e.useMemo(()=>i?{opacity:"1",transform:"scale(1)"}:void 0,[i]);return(0,t.jsx)(x,{style:n,children:(0,t.jsx)(Re,{url:"/static/releases/202106/icon",extension:"png",alt:"Linear logo"})})}function Ke(){return(0,t.jsxs)(g,{children:[(0,t.jsx)(h,{children:"Linear release 2021.06"}),(0,t.jsx)(m,{children:"Grow with Linear"}),(0,t.jsx)(u,{children:"An issue tracking tool that levels up as you scale. Linear streamlines complex processes including roadmap planning and issue triaging. Customize your workspace with automated workflows and integrations for customer support. It’s faster than ever to create, import, view, search and complete issues."})]})}function Oe(){return(0,t.jsxs)(f,{children:[(0,t.jsx)(r,{style:{color:"white",textAlign:"center"},children:"Growing companies using Linear"}),(0,t.jsxs)(j,{children:[(0,t.jsx)(w,{children:(0,t.jsx)(Ce,{href:"/customers/descript",children:(0,t.jsx)("img",{alt:"Descript logo",src:"/static/releases/202106/logos/descript.svg"})})}),(0,t.jsx)(w,{children:(0,t.jsx)(Ce,{href:"/customers/expo",children:(0,t.jsx)("img",{alt:"Expo logo",src:"/static/releases/202106/logos/expo.svg"})})}),(0,t.jsx)(w,{children:(0,t.jsx)(Ce,{href:"/customers/retool",children:(0,t.jsx)("img",{alt:"Retool logo",src:"/static/releases/202106/logos/retool.svg"})})}),(0,t.jsx)(w,{children:(0,t.jsx)(Ce,{href:"/customers/unsplash",children:(0,t.jsx)("img",{alt:"Unsplash logo",src:"/static/releases/202106/logos/unsplash.svg"})})})]})]})}function We(){return(0,t.jsxs)(n,{style:{background:"linear-gradient(180deg, #1D1919 -1.59%, #130F14 93.46%)",paddingBottom:0},children:[(0,t.jsx)(s,{style:{color:"#7544A2"},children:"Timeline"}),(0,t.jsx)(o,{children:"Plan visually with live predictions"}),(0,t.jsx)(b,{children:"A roadmap that stays in sync. View and update projects from one simple interface. We calculate when projects will complete based on issue data and historical velocity so you’re always a step ahead."}),(0,t.jsx)(v,{children:(0,t.jsx)(y,{children:(0,t.jsx)("video",{loop:!0,autoPlay:!0,muted:!0,playsInline:!0,children:(0,t.jsx)("source",{"data-src":"/static/release/timeline.mp4",type:"video/mp4",src:"/static/releases/202106/timeline.mp4"})})})})]})}function Je(){const[i,r]=e.useState("create");let a;switch(i){case"create":a="Triage is your special inbox for managing issues created with integrations or by members outside of your Linear team. New issues go here first.";break;case"prioritize":a="Send issues to the backlog or escalate urgent ones to the current cycle. Ask your team for more information. You can even snooze for later.";break;case"followup":a="Link Linear issues to their related customer conversations. Automations re-open support tickets so it’s easy to track updates and follow up."}return(0,t.jsxs)(n,{style:{background:"linear-gradient(180deg, #1D1919 -1.59%, #130F14 93.46%)"},children:[(0,t.jsx)(s,{style:{color:"#bf463d"},children:"Triage"}),(0,t.jsx)(o,{children:"A simple workflow for requests and bug reports"}),(0,t.jsxs)(k,{children:[(0,t.jsx)($,{active:"create"===i,onClick:()=>r("create"),children:"Create"}),(0,t.jsx)($,{active:"prioritize"===i,onClick:()=>r("prioritize"),children:"Prioritize & Assign"}),(0,t.jsx)($,{active:"followup"===i,onClick:()=>r("followup"),children:"Follow Up"})]}),(0,t.jsx)(z,{style:{minHeight:80},children:a}),(0,t.jsxs)(F,{children:[(0,t.jsx)(A,{alt:"Hidden image",url:"/static/releases/202106/triage-1",extension:"png"}),(0,t.jsx)(L,{alt:"List of issues waiting for triage",url:"/static/releases/202106/triage-1",extension:"png",active:"create"===i}),(0,t.jsx)(L,{alt:"Modal view of an issue with action buttons to accept, merge, decline or snooze it",url:"/static/releases/202106/triage-2",extension:"png",active:"prioritize"===i}),(0,t.jsx)(L,{alt:"Modal view of an issue being edited to change its properties",url:"/static/releases/202106/triage-3",extension:"png",active:"followup"===i})]}),(0,t.jsx)(z,{style:{marginTop:50,marginBottom:30},children:"Keep a tight feedback loop with your customers wherever they are"}),(0,t.jsxs)(I,{children:[(0,t.jsx)(S,{children:(0,t.jsx)(De,{href:"https://www.zendesk.com",children:(0,t.jsx)("img",{alt:"Zendesk logo",src:"/static/releases/202106/logos/zendesk.svg"})})}),(0,t.jsx)(S,{children:(0,t.jsx)(De,{href:"https://www.intercom.com",children:(0,t.jsx)("img",{alt:"Intercom logo",src:"/static/releases/202106/logos/intercom.svg"})})}),(0,t.jsx)(S,{children:(0,t.jsx)(De,{href:"https://frontapp.com",children:(0,t.jsx)("img",{alt:"Front logo",src:"/static/releases/202106/logos/front.svg"})})}),(0,t.jsx)(S,{children:(0,t.jsx)(De,{href:"https://twitter.com",children:(0,t.jsx)("img",{alt:"Twitter logo",src:"/static/releases/202106/logos/twitter.svg"})})}),(0,t.jsx)(S,{children:(0,t.jsx)(De,{href:"https://slack.com/",children:(0,t.jsx)("img",{alt:"Slack logo",src:"/static/releases/202106/logos/slack.svg"})})})]})]})}function Ve(){return(0,t.jsx)(n,{style:{background:"linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)",padding:0},children:(0,t.jsx)(Be,{top:(0,t.jsxs)(T,{children:[(0,t.jsx)(a,{style:{marginTop:0},children:"Icons in every shape and color"}),(0,t.jsxs)(N,{children:[(0,t.jsx)(C,{children:"70 designs in 16,777,217 colors."})," Customize Linear projects and views with the perfect icons to match."]})]}),bottom:(0,t.jsx)(M,{children:(0,t.jsx)(Re,{alt:"Linear icons",url:"/static/releases/202106/icons-projects",extension:"png"})})})})}function Qe(){return(0,t.jsx)(n,{style:{background:"linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)",paddingBottom:0},children:(0,t.jsx)(Be,{top:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s,{style:{color:"#7544A2"},children:"Private teams"}),(0,t.jsx)(o,{children:"Keep some work private"}),(0,t.jsx)(E,{children:"Control access to sensitive issues and projects. Create private teams and invite members directly."})]}),bottom:(0,t.jsx)(P,{from:"bottom",children:(0,t.jsx)(Re,{alt:"Lock",url:"/static/releases/202106/lock",extension:"png"})})})})}function Ye(){return(0,t.jsxs)(B,{style:{background:"linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)"},children:[(0,t.jsxs)(D,{children:[(0,t.jsx)(r,{style:{color:"#BF463D"},children:"Fast Issue Input"}),(0,t.jsx)(a,{children:"Create issues even faster"}),(0,t.jsx)(H,{children:"Never lose context with our issue creation UI. Add properties, switch teams and apply templates in a few keystrokes–no mouse required. Properties carry over to new issues and drafts save automatically. Create issues in less time and finish work in no time."})]}),(0,t.jsx)(R,{children:(0,t.jsx)(He,{from:"right",children:(0,t.jsx)(Re,{alt:"Modal form to create a new issue",url:"/static/releases/202106/fast-issue",extension:"png"})})})]})}function Ze(){return(0,t.jsx)(q,{children:(0,t.jsxs)(G,{children:[(0,t.jsxs)(U,{children:[(0,t.jsx)(O,{}),(0,t.jsx)(W,{}),(0,t.jsx)(J,{})]}),(0,t.jsxs)(V,{children:[(0,t.jsx)(Y,{children:"#"}),(0,t.jsx)(X,{children:"TypeScript SDK and API"})]}),(0,t.jsxs)(V,{children:[(0,t.jsx)(Y,{children:"#"}),(0,t.jsx)(X,{children:"Access more tools to customize your workspace."})]}),(0,t.jsxs)(V,{children:[(0,t.jsx)(Q,{children:"#"}),(0,t.jsx)(Z,{children:"Get even more support for building apps and integrations with our TypeScript SDK."})]}),(0,t.jsxs)(V,{children:[(0,t.jsx)(Q,{children:"#"}),(0,t.jsx)(Z,{children:"Support for private OAUth applications, additional webhooks and developer docs."})]}),(0,t.jsxs)(V,{children:[(0,t.jsx)(Q,{children:"#"}),(0,t.jsx)(Z,{children:"For low code solutions, use Zapier or Google Sheets to make custom workflows and analytics."})]})]})})}function Xe(){return(0,t.jsx)(n,{style:{background:"linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)"},children:(0,t.jsx)(Be,{top:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s,{style:{color:"#7544A2"},children:"Issue Migration Assistant"}),(0,t.jsx)(o,{children:"Transition to Linear in minutes"}),(0,t.jsx)(_,{children:"Watch your issues load with their titles, descriptions, attachments, comments, assignees, projects and epics intact. The in-app importer supports four popular apps while a customizable, open source command line interface (CLI) tool supports others."})]}),bottom:(0,t.jsx)(ee,{from:"bottom",children:(0,t.jsx)(Re,{alt:"Linear logo",url:"/static/releases/202106/issue-migration",extension:"png"})})})})}function _e(){return(0,t.jsxs)(te,{children:[(0,t.jsxs)(ie,{children:[(0,t.jsx)(r,{style:{color:"white"},children:"Search"}),(0,t.jsx)(a,{children:"Powered by the backend"}),(0,t.jsxs)(re,{children:["An upgraded search finds issues across your full workspace, including the archive. It utilizes an English dictionary under the hood and understands you’ll want to see issues with related terms and not just exact matches. Even find issues using their old IDs. A new shortcut ",(0,t.jsx)(ne,{children:"o"})," then"," ",(0,t.jsx)(ne,{children:"i"})," lets you view recent issues or quickly search across issue titles."]})]}),(0,t.jsx)(se,{from:"right",threshold:.5,children:(0,t.jsxs)("picture",{children:[(0,t.jsx)("source",{media:`(max-width: ${i}px)`,srcSet:"/static/releases/202106/search-mobile.png, /static/releases/202106/search-mobile@2x.png 2x"}),(0,t.jsx)("source",{srcSet:"/static/releases/202106/search.png, /static/releases/202106/search@2x.png 2x"}),(0,t.jsx)("img",{alt:"Screenshot of Linear app on the search page",src:"/static/releases/202106/search.png"})]})})]})}function et(){return(0,t.jsx)(n,{style:{background:"radial-gradient(88.08% 88.08% at 50% 108.44%, rgba(114, 39, 110, 0.2) 0%, rgba(117, 39, 113, 0) 100%), linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)",paddingBottom:0},children:(0,t.jsx)(Be,{top:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s,{style:{color:"#7544A2"},children:"Auto archive"}),(0,t.jsx)(o,{children:"Automate instead of update"}),(0,t.jsx)(ae,{children:"Your issues, cycles, and projects archive on their own."})]}),bottom:(0,t.jsx)(oe,{from:"bottom",children:(0,t.jsx)(Re,{alt:"Archive box",url:"/static/releases/202106/auto-archive",extension:"png"})})})})}function tt(){return(0,t.jsxs)(n,{style:{background:"radial-gradient(88.08% 88.08% at 50% 108.44%, rgba(114, 39, 110, 0.2) 0%, rgba(117, 39, 113, 0) 100%), linear-gradient(118.52deg, #111317 2.76%, #130F14 94.6%)"},children:[(0,t.jsx)(l,{children:"New integrations and apps"}),(0,t.jsx)(de,{children:"A growing list of third-party integrations connects Linear to your favorite apps and key workflows."}),(0,t.jsxs)(le,{children:[(0,t.jsx)(it,{name:"Honeybadger.io",logo:"Honeybadger-io",url:"https://www.honeybadger.io"}),(0,t.jsx)(it,{name:"Netlify",logo:"Netlify",url:"https://www.netlify.com"}),(0,t.jsx)(it,{name:"Highlight",logo:"Highlight",url:"https://highlight.run"}),(0,t.jsx)(it,{name:"Nearline",logo:"nearlines",url:"https://www.nearline.io"})," ",(0,t.jsx)(it,{name:"Slab",logo:"slab",url:"https://slab.com"}),(0,t.jsx)(it,{name:"Qualdesk",logo:"In-Qualdesk",url:"https://www.qualdesk.com"}),(0,t.jsx)(it,{name:"Incident.io",logo:"incident",url:"https://incident.io"}),(0,t.jsx)(it,{name:"Jam.dev",logo:"Jam-dev",url:"https://jam.dev"}),(0,t.jsx)(it,{name:"Compass",logo:"Compass",url:"https://usecompass.app"}),(0,t.jsx)(it,{name:"Raycast",logo:"Raycast",url:"https://raycast.com"}),(0,t.jsx)(it,{name:"Codestream",logo:"codestream",url:"https://www.codestream.com"})]})]})}function it(e){return(0,t.jsxs)(ce,{href:e.url,children:[(0,t.jsx)(pe,{children:(0,t.jsx)(Re,{alt:`Logo of ${e.name}`,url:`/static/releases/202106/integrations/${e.logo}`,extension:"png"})}),(0,t.jsx)(xe,{children:e.name})]})}function nt(){return(0,t.jsxs)(ge,{children:[(0,t.jsx)(he,{children:"Fast growing startups are built on Linear"}),(0,t.jsx)(me,{children:"Linear keeps everyone aligned and working without friction. Engineers, designers, and peers – all collaborating in one tool."}),(0,t.jsx)(ue,{children:(0,t.jsx)(fe,{href:"/signup",children:"Sign up →"})})]})}function rt(){return(0,t.jsxs)(t.Fragment,{children:[je.map(e=>(0,t.jsx)(st,{customer:e},e.slug)),(0,t.jsx)(ze,{})]})}function st(e){const i=e.customer;return(0,t.jsxs)(we,{children:[(0,t.jsxs)(be,{children:[(0,t.jsx)("img",{alt:"Logo",src:`/static/releases/202106/logos/${i.slug}.svg`}),i.description?(0,t.jsx)($e,{children:i.description}):null,(0,t.jsx)(De,{href:i.url,children:i.urlName})]}),(0,t.jsxs)(ve,{children:[i.content,(0,t.jsx)(Ce,{href:`/customers/${i.slug}`,children:"Read more"}),(0,t.jsx)(ye,{children:i.name}),(0,t.jsx)(ke,{children:i.title})]})]})}function at(e){return(0,t.jsx)(Le,{style:{opacity:e.visible?1:0}})}e=Se(Ne(),1),t=Te(),i=1024,n=Me.div`
  width: 100%;
  border-radius: 12px;
  padding: var(--container-padding);
  margin-top: var(--block-gap);
`,r=Me.h2`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  font-weight: var(--font-weight-normal);
`,s=Me(r)`
  text-align: center;
`,a=Me.h3`
  font-size: 30px;
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 30px;

  @media (max-width: ${i}px) {
    font-size: 22px;
    font-weight: var(--font-weight-semibold);
  }
`,o=Me(a)`
  text-align: center;
`,d=Me.h3`
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  margin-top: 0;
  margin-bottom: 12px;
`,l=Me(d)`
  text-align: center;
`,c=Me.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`,p=Me.div`
  opacity: 0;
  transition-property: transform, opacity;
  transition-duration: 600ms;
`,x=Me.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  line-height: 0;
  user-select: none;
  margin-top: calc(var(--block-gap) + var(--container-padding));
  opacity: 0;
  transform: scale(0.5);
  transition-property: opacity, transform;
  transition-duration: ${800}ms;

  & > img {
    width: 100%;
    object-fit: contain;
  }
`,g=Me(n)`
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
`,h=Me.p`
  text-transform: uppercase;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.2em;
`,m=Me.h1`
  text-align: center;
  font-weight: 900;
  font-size: 60px;
  margin: 10px 0;

  @media (max-width: ${i}px) {
    font-size: 40px;
  }
`,u=Me.p`
  text-align: center;
  max-width: 700px;
  font-weight: var(--font-weight-medium);
  font-size: 22px;
  margin: 20px auto;
  line-height: 1.4;

  @media (max-width: ${i}px) {
    font-size: 16px;
  }
`,f=Me.div`
  margin: 0 auto;
  padding: 120px 0;
  ${qe("/static/releases/202106/background-logo","png")}
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`,j=Me.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${i}px) {
    max-width: 400px;
  }
`,w=Me.li`
  list-style: none;
  height: 30px;
  margin: 20px;
`,b=Me.p`
  text-align: center;
  max-width: 640px;
  font-size: var(--font-size);
  font-weight: var(--font-weight-medium);
  margin: 20px auto 40px;
`,v=Me.div`
  background: linear-gradient(282.19deg, #4145a7 7.6%, #7843a2 50.93%, #c44636 95.17%);
  padding: 26px;
  padding-bottom: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  @media (max-width: ${i}px) {
    margin-left: calc(-1 * var(--container-padding));
    margin-right: calc(-1 * var(--container-padding));
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  @media (max-width: ${600}px) {
    padding: 13px;
    padding-bottom: 0;
  }
`,y=Me.div`
  line-height: 0;
  padding: 16px;
  padding-bottom: 0;
  background: linear-gradient(118.52deg, rgba(17, 19, 23, 0.8) 2.76%, rgba(19, 15, 20, 0.8) 94.6%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;

  & > video {
    width: 100%;
    border: 1px solid rgba(112, 113, 114, 0.5);
    border-bottom: 0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    ${"box-shadow: 0px 20px 24px rgba(0, 0, 0, 0.3);"}
  }

  @media (max-width: ${600}px) {
    padding: 8px;
    padding-bottom: 0;
  }
`,k=Me.div`
  width: 100%;
  display: flex;
  justify-content: center;
`,$=Me.span`
  margin: 0 30px;
  opacity: ${e=>e.active?"1":"0.5"};
  border-bottom: ${e=>e.active?"2px solid #AF4655":"0"};
  padding: 8px 0;
  color: white;
  touch-action: manipulation;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`,z=Me.p`
  text-align: center;
  max-width: 640px;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size);
  margin: 20px auto;
`,L=Me(Re)`
  position: absolute;
  display: block;
  top: 16px;
  right: 26px;
  left: 26px;
  width: calc(100% - 2 * 26px);
  opacity: ${e=>e.active?"1":"0"};
  transition-property: opacity;
  transition-duration: 600ms;
  ${"filter: drop-shadow(0px 20px 24px rgba(0, 0, 0, 0.3));"}
`,A=Me(Re)`
  opacity: 0;
  display: block;
  width: 100%;
`,F=Me.div`
  position: relative;
  background: linear-gradient(285.87deg, #4145a7 17.92%, #7843a2 61.41%, #c44636 105.81%);
  padding: 16px 26px;
  border-radius: 12px;
  margin: 0 auto;
  max-width: calc(890px + 2 * 26px);
`,I=Me.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`,S=Me.li`
  list-style: none;
  margin: 0 10px;

  @media (max-width: ${600}px) {
    max-width: 20%;
    margin: 0;
    padding: 5px;

    img {
      width: 100%;
    }
  }
`,T=Me.div`
  padding: var(--container-padding);
  padding-bottom: 0;
`,N=Me.div`
  font-size: var(--font-size);
`,C=Me.span`
  ${Pe("linear-gradient(90deg,#49e4b6 0%,#ea78df 22.92%,#6488e2 42.19%,#49c6b5 58.33%,#f3f75c 75.52%,#f15880 100%)")}
`,M=Me.div`
  width: 100%;
  padding: 30px;

  & > img {
    width: 100%;
    object-fit: contain;
  }
`,E=Me.p`
  text-align: center;
  font-size: var(--font-size);
`,P=Me(He)`
  margin-left: calc(-1 * var(--container-padding));
  margin-right: calc(-1 * var(--container-padding));
  line-height: 0;

  & > img {
    width: 100%;
    object-fit: contain;
  }
`,B=Me(n)`
  display: flex;

  @media (max-width: ${i}px) {
    flex-direction: column;
  }
`,D=Me.div`
  flex: 1;
  padding-right: 40px;

  @media (max-width: ${i}px) {
    padding: 0;
  }
`,H=Me.p`
  font-size: var(--font-size);
`,R=Me.div`
  flex: 2;
  padding: 38px 32px;
  background: linear-gradient(301.66deg, #4145a7 -21.78%, #7843a2 26.06%, #c44636 74.91%);
  border-radius: 12px;

  & img {
    width: 100%;
    object-fit: contain;
    ${"filter: drop-shadow(0px 20px 24px rgba(0, 0, 0, 0.3));"}
  }

  @media (max-width: ${600}px) {
    margin: calc(-1 * var(--container-padding));
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 16px 12px;
  }
`,q=Me(n)`
  background: linear-gradient(301.66deg, #4145a7 -21.78%, #7843a2 26.06%, #c44636 74.91%);

  @media (max-width: ${600}px) {
    padding: 20px;
  }
`,G=Me.div`
  font-family: "IBM Plex Mono", monospace;
  font-size: var(--font-size);
  line-height: 2em;
  font-weight: var(--font-weight-normal);
  background-color: #130f14;
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: ${32}px;
  ${"box-shadow: 0px 20px 24px rgba(0, 0, 0, 0.3);"}
`,U=Me.div`
  display: flex;
  padding: 14px;
  background-color: #111317;
  margin-bottom: ${32}px;
`,K=Me.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
`,O=Me(K)`
  background-color: #ed6a5c;
`,W=Me(K)`
  background-color: #edc152;
`,J=Me(K)`
  background-color: #58a84c;
`,V=Me.div`
  display: flex;
  padding: 0 ${32}px;
`,Q=Me.span`
  flex: none;
  margin-right: 8px;
`,Y=Me(Q)`
  color: #bb2b49;
`,Z=Me.span`
  flex: auto;
`,X=Me(Z)`
  ${Pe("linear-gradient(106.62deg, #bb2b49 6.68%, #ea4f34 82.69%)")}
`,_=Me.p`
  text-align: center;
  max-width: 450px;
  margin: 20px auto;
  font-size: var(--font-size);
`,ee=Me(He)`
  margin-left: calc(-1 * var(--container-padding));
  margin-right: calc(-1 * var(--container-padding));

  > img {
    width: 100%;
    object-fit: contain;
  }
`,te=Me(n)`
  display: flex;
  background: linear-gradient(92.81deg, #4145a7 -15.93%, #7843a2 43.38%, #c44636 103.94%);
  padding-right: 0;
  padding-bottom: 0;

  @media (max-width: ${600}px) {
    flex-direction: column;
  }
`,ie=Me.div`
  flex: 1;
  padding-bottom: var(--container-padding);
  margin-right: var(--container-padding);
`,ne=Me.code``,re=Me.p`
  font-size: var(--font-size);
  font-weight: var(--font-weight-medium);
  margin-bottom: 0;

  & > ${ne} {
    font-size: var(--font-size);
    background: #3c3f44;
    padding: 2px 6px;
    border-radius: 4px;
    margin: 0;
  }
`,se=Me(He)`
  flex: 2;

  line-height: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  & picture {
    width: 100%;
    /* Probably due to decimal pixels, sometime you could have 1px on the right of the image where you could see the background of the container, this translate will ensure this never happens. */
    transform: translateX(2px);
  }

  & img {
    width: 100%;
    object-fit: contain;
  }

  @media (max-width: ${600}px) {
    margin-left: 0;
  }
`,ae=Me.p`
  text-align: center;
  font-size: var(--font-size);
`,oe=Me(He)`
  margin: 0 auto;
  max-width: 475px;
  line-height: 0;

  > img {
    width: 100%;
    object-fit: contain;
  }
`,de=Me.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: var(--font-size);
`,le=Me.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`,ce=Me(De)`
  display: flex;
  align-items: center;
  background: #1f2023;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
  margin: 7px 8px;
  color: white;
`,pe=Me.div`
  flex: none;
  line-height: 0;
  border-radius: 6px;
  overflow: hidden;
`,xe=Me.div`
  flex: auto;
  font-size: 16px;
  margin-left: 16px;
`,ge=Me(n)`
  background: linear-gradient(2.95deg, rgba(17, 19, 23, 0) 2.86%, #130f14 97.96%);

  @media (min-width: ${i+1}px) {
    padding-top: 120px;
  }
`,he=Me.h2`
  font-size: 60px;
  line-height: 1.2;
  font-weight: 900;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${i}px) {
    font-size: 40px;
  }
`,me=Me.p`
  font-size: 22px;
  font-weight: var(--font-weight-medium);
  text-align: center;
  max-width: 700px;
  margin: 46px auto;

  @media (max-width: ${i}px) {
    font-size: 18px;
  }
`,ue=Me.div`
  display: flex;
  justify-content: center;
`,fe=Me(Ce)`
  background: linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%);
  padding: 14px 45px;
  text-align: center;
  color: white;
  border-radius: 12px;
  border: 0;
  font-size: 19px;
  font-weight: var(--font-weight-bold);
  margin: 0 auto;
  touch-action: manipulation;
`,je=[{slug:"descript",url:"https://descript.com",urlName:"descript.com",name:"Andrew Mason",title:"Founder & CEO",description:"All-in-one video editing, as easy as a doc",content:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{children:"Linear’s performance is incredible - the best perceived speed of any web app I’ve ever used."}),(0,t.jsx)("p",{children:"Linear is different. It has a better model and structure for engineering orgs. Sprints, points, priority, and status are all treated as first class properties of tasks. Search and filtering are powerful and the timeline view is one of the best I’ve seen."})]})},{slug:"loom",url:"https://loom.com",urlName:"loom.com",name:"Justin “Vegetables” Reidy",title:"Senior Engineering Manager ",description:"Bringing video messaging to work",content:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{children:"We tried Linear and suddenly all our task management problems went away. I think one of the main reasons was the speed. The team felt that they could get into the tool, find what they were looking for or figure out what they needed to do, and then get back to work."}),(0,t.jsx)("p",{children:"That combined with the Inbox was helpful because now engineers felt like they could go to a single place to see what mattered to them. They didn’t have to go and look at the entire board or search through all the issues to figure it out."})]})},{slug:"expo",url:"https://expo.io",urlName:"expo.io",name:"Brent Vatne",title:"Engineering Manager ",description:"The easiest way to develop, test, and ship universal apps",content:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{children:"A couple of things changed once the full team was on Linear. One is that we're able to track what is going on in a distributed company which had been hard to do with random docs and outdated lists. Everything is synced in Linear across views and with GitHub, so it’s always up to date. This means people are able to communicate better. They see what is happening and know who to ask questions or what is next."}),(0,t.jsx)("p",{children:"The second thing is that using Linear built a culture around taking action. We started keeping better track of issues that used to get lost in Slack messages or conversations. It was so fast to create an issue and even enjoyable that people now create issues instead of talking about them."})]})}],we=Me.div`
  max-width: 1000px;
  margin: 15px auto;
  display: flex;
  background: linear-gradient(118.52deg, #111317 2.76%, #130f14 94.6%);
  padding: 60px;
  border-radius: 12px;

  @media (max-width: ${i}px) {
    flex-direction: column;
  }
`,be=Me.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 100px;
  padding-bottom: 24px;

  & > img {
    height: 30px;
  }

  @media (max-width: ${i}px) {
    padding-right: 0;
  }
`,ve=Me.div`
  flex: 2;

  & > p:first-child {
    margin-top: 0;
  }
`,ye=Me.p`
  font-size: 16px;
  color: #f7f8f8;
  margin-top: 40px;
  margin-bottom: 6px;
`,ke=Me.p`
  font-size: 16px;
  color: #8a8f98;
  margin-top: 6px;
`,$e=Me.p`
  font-size: 16px;
  color: #8a8f98;
  margin-top: 40px;

  @media (max-width: ${i}px) {
    margin-top: 20px;
  }
`,ze=Me.div`
  margin-bottom: 100px;
`,Le=Me.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${qe("/static/releases/202106/header-desktop","png")}
  background-position: center top;
  background-repeat: no-repeat;
  transition: opacity ${800}ms;

  @media (max-width: ${i}px) {
    ${qe("/static/releases/202106/header-mobile","png")}
  }

  @media (max-width: 550px) {
    background-position: center -50px;
  }

  @media (max-width: 350px) {
    background-position: center -75px;
  }
`,Ae=Me.div`
  opacity: 0;
  transition: opacity ${800}ms;
  z-index: 1;
`,Fe=Me.div`
  --block-gap: 46px;
  --container-padding: 48px;
  --font-size: 18px;

  display: flex;
  max-width: 1240px;
  width: 95%;
  margin: 0 auto;
  overflow: hidden;

  & > ${n}:not(:first-child) {
    margin-left: var(--block-gap);
  }

  @media (max-width: ${i}px) {
    --container-padding: 36px;
    --font-size: 16px;

    flex-direction: column;

    & > ${n}:not(:first-child) {
      margin-left: 0;
    }
  }
`,Ie={Release202106:function(){const e=Ge(400),i=Ge(800);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(at,{visible:e}),(0,t.jsx)(Fe,{children:(0,t.jsx)(Ue,{})}),(0,t.jsxs)(Ae,{style:{opacity:i?1:0},children:[(0,t.jsx)(Fe,{children:(0,t.jsx)(Ke,{})}),(0,t.jsx)(Fe,{children:(0,t.jsx)(Oe,{})}),(0,t.jsx)(Fe,{children:(0,t.jsx)(We,{})}),(0,t.jsx)(Fe,{children:(0,t.jsx)(Je,{})}),(0,t.jsxs)(Fe,{children:[(0,t.jsx)(Ve,{}),(0,t.jsx)(Qe,{})]}),(0,t.jsx)(Fe,{children:(0,t.jsx)(Ye,{})}),(0,t.jsxs)(Fe,{children:[(0,t.jsx)(Ze,{}),(0,t.jsx)(Xe,{})]}),(0,t.jsx)(Fe,{children:(0,t.jsx)(_e,{})}),(0,t.jsxs)(Fe,{children:[(0,t.jsx)(et,{}),(0,t.jsx)(tt,{})]}),(0,t.jsx)(Fe,{children:(0,t.jsx)(nt,{})}),(0,t.jsx)(Fe,{style:{flexDirection:"column"},children:(0,t.jsx)(rt,{})})]})]})}};export{Ie as export_25704097f48c};