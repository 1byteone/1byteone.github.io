var e,i,t,a,r,n,o,s,d,l,x,p,c,h,m,g,u,f,w,b,j,y,v,k,$,z,P,I,C,L,S,A,M,q,F,B,O,T,E,W,R,U,V,D,G,H,N,Y,J,K,Q,Z,X,_,ee,ie,te,ae,re,ne,oe,se,de,le,xe,pe,ce,he,me,ge,ue,fe,we,be,je,ye,ve,ke,$e,ze,Pe,Ie,Ce,Le,Se,Ae,Me,qe,Fe,Be;import{o as Oe}from"./C_JJxWoe.js";import{Ur as Te,ai as Ee}from"./DipWGRuU.js";import{a as We,o as Re}from"./DvPgvKbY2.js";import{t as Ue}from"./BbpqRa-j2.js";import{t as Ve}from"./C5rym-AJ2.js";import{t as De}from"./BhyDCI4f.js";import{n as Ge}from"./BtESo9fL.js";import{t as He}from"./BbMhDdbm2.js";import{t as Ne}from"./B5fttujl.js";import{t as Ye}from"./hVNE-_hy.js";e=Oe(Ee(),1),i=48,t=36,a=We.div`
  display: flex;
  justify-content: space-between;
  margin: 56px 0;
  background-size: cover;

  @media (max-width: 600px) {
    flex-direction: column;
    margin: 0;
  }
`,r=We.div`
  background: ${e=>e.backgroundImage?`url(${e.backgroundImage})`:"linear-gradient(155.91deg, #18191c 17.55%, #212225 77.49%)"};

  border-radius: 16px;
  background-size: cover;
  overflow: hidden;

  padding: ${i}px;
  ${e=>(e.noPadding||e.noLeftPadding)&&"padding-left: 0;"}
  ${e=>(e.noPadding||e.noRightPadding)&&"padding-right: 0;"}
  ${e=>(e.noPadding||e.noBottomPadding)&&"padding-bottom: 0;"}
  ${e=>(e.noPadding||e.noTopPadding)&&"padding-top: 0;"}

  ${e=>4===e.columns?"width: calc(66.666% - 14px);":3===e.columns?"width: calc(50% - 14px);":2===e.columns?"width: calc(33.333% - 14px);":"width: 100%;"}

  @media (max-width: 1000px) {
    ${e=>e.columns?"width: calc(50% - 14px);":"width: 100%;"}
  }

  @media (max-width: 800px) {
    padding: ${t}px;
    ${e=>(e.noPadding||e.noLeftPadding)&&"padding-left: 0;"}
    ${e=>(e.noPadding||e.noRightPadding)&&"padding-right: 0;"}
    ${e=>(e.noPadding||e.noBottomPadding)&&"padding-bottom: 0;"}
    ${e=>(e.noPadding||e.noTopPadding)&&"padding-top: 0;"}
  }

  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 28px;
  }

  ${e=>e.center?"text-align: center;":""}
`,n=We(Ve).attrs({direction:"column"})`
  justify-content: center;
  height: 100%;
`,o=We.h2`
  font-style: normal;
  font-weight: var(--font-weight-bold);
  font-size: 36px;
  line-height: 1.3em;

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 600px) {
    font-weight: var(--font-weight-semibold);
    font-size: 18px;
  }
`,s=We.h3`
  font-style: normal;
  font-weight: var(--font-weight-semibold);
  font-size: 18px;
  line-height: 1.3em;
`,d=We.div`
  font-style: normal;
  font-weight: var(--font-weight-medium);
  font-size: 17px;
  line-height: 139%;
  color: ${e=>e.color?e.color:"#8a8f98"};

  & + & {
    margin-top: 1.2em;
  }
`,l=We.a`
  display: block;
  font-style: normal;
  font-weight: var(--font-weight-bold);
  font-size: 18px;
  line-height: 131%;
  background: linear-gradient(91.83deg, #bb3b7f 2.26%, #da4a57 95.81%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,x=Te(),p=()=>(0,x.jsxs)(c,{children:[(0,x.jsxs)("div",{style:{marginBottom:"24px"},children:[(0,x.jsx)(s,{children:"React with custom emoji"}),(0,x.jsx)(d,{children:"Make the workspace your own with custom emoji. Import from Slack or upload as you go."})]}),(0,x.jsxs)(f,{children:[(0,x.jsx)(m,{src:"/static/release/partyparrot.gif",alt:"Party parrot emoji"}),(0,x.jsx)(g,{src:"/static/release/chefkiss.png",alt:"Chef’s kiss emoji"}),(0,x.jsx)(u,{src:"/static/release/lacroix.png",alt:"LaCroix emoji"})]})]}),c=We(n)`
  justify-content: space-between;
  padding-top: 32px;

  @media (max-width: 1000px) {
    padding-top: 0;
  }
`,h=We.img`
  position: absolute;
`,m=We(h)`
  width: 70px;
  right: 8%;
  bottom: 40px;
  transform: rotate(25deg);

  @media (max-width: 1000px) {
    width: 90px;
    right: 7%;
  }
`,g=We(h)`
  width: 90px;
  right: 50%;
  margin-right: -38px;
  bottom: 100px;

  @media (max-width: 1000px) {
    bottom: 150px;
  }

  @media (max-width: 600px) {
    bottom: 90px;
  }
`,u=We(h)`
  width: 70px;
  left: 8%;
  bottom: 30px;
  transform: rotate(-30deg);

  @media (max-width: 1000px) {
    width: 90px;
  }
`,f=We.div`
  position: relative;
  height: 225px;
`,w=e=>(0,x.jsxs)(b,{children:[(0,x.jsx)(v,{children:e.image}),(0,x.jsxs)(j,{children:[(0,x.jsx)(y,{children:e.title}),e.copy]})]}),b=We(n)`
  flex-direction: row;
  min-height: 210px;
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
`,j=We.div`
  padding-left: 27px;

  @media (max-width: 900px) {
    padding: 24px 0 0 0;
  }
`,y=We.h3`
  font-style: normal;
  font-weight: var(--font-weight-semibold);
  font-size: 22px;
  line-height: 27px;
  color: #f2f2f3;
  margin: 0 0 1em 0;

  span {
    font-weight: var(--font-weight-normal);
    display: block;
  }
`,v=We.div`
  flex-shrink: 0;
  border-radius: 12px;
  width: 130px;
  height: 188px;
  text-align: center;

  img {
    border-radius: 12px;
  }
`,k=()=>(0,x.jsx)(w,{image:(0,x.jsx)($,{children:(0,x.jsx)("img",{src:"/static/release/sequoia.jpg",alt:""})}),title:"Linear raises $13M Series A led by Sequoia Capital",copy:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(d,{children:"Linear is used and loved by thousands of organizations to help them deliver high quality software."}),(0,x.jsx)(z,{href:"https://medium.com/linear-app/linear-raises-13m-in-series-a-funding-from-sequoia-capital-daa0f0c43758",children:"Read more on Medium →"})]})}),$=We.div`
  flex-shrink: 0;
  border-radius: 12px;
  width: 130px;
  height: 188px;
  text-align: center;

  img {
    max-width: 100%;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.35);
  }
`,z=We(l)`
  margin-top: 1.2em;
`,P=()=>(0,x.jsx)(w,{image:(0,x.jsx)(I,{children:(0,x.jsx)("img",{src:"/static/release/linear-method.jpg",alt:""})}),title:(0,x.jsxs)(x.Fragment,{children:["Linear Method:",(0,x.jsx)("span",{children:"Practices for building"})]}),copy:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(d,{children:"Explore how we think software development should work."}),(0,x.jsx)(C,{href:"https://linear.app/method",children:"Explore Linear Method →"})]})}),I=We.div`
  img {
    width: 130px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.35);
  }
`,C=We(l)`
  margin-top: 1.2em;
`,L=We.div`
  position: relative;
  background: url(${e=>e.backgroundImage});
  background-size: cover;
  overflow: hidden;
  align-items: flex-start;

  img {
    max-width: 100%;
    box-shadow: -5px 12px 28px rgba(0, 0, 0, 0.4);
    display: block;
  }

  ${e=>{const i="thin"===e.borderWidth?"20px":"32px";switch(e.position){case"left":return`\n          padding: ${i} ${i} 0px 0px; border-radius: 0 32px 0 16px;\n        `;case"center":return`\n          padding: ${i} ${i} 0 ${i}; border-radius: 32px 32px 0 0;\n        `;case"right":return`\n          padding: ${i} 0px 0px ${i}; border-radius: 32px 0 16px 0;\n        `;default:return""}}}

  img {
    ${e=>{switch(e.position){case"left":return"border-radius: 0 12px 0 0;";case"center":return"border-radius: 12px 12px 0 0;";case"right":return"border-radius: 12px 0 0 0;";default:return""}}}
  }
`,S=We(L)`
  @media (max-width: 800px) {
    width: 100%;
    padding: 20px 0px 0px 20px;
    border-radius: 0 0 16px 16px;

    img {
      border-radius: 2% 0 0 0;
    }
  }
`,A=We(L)`
  @media (max-width: 1150px) {
    width: 100%;

    ${e=>{const i="20px";switch(e.position){case"left":return`padding: ${i} ${i} 0px 0px;`;case"center":case"right":return`padding: ${i} 0px 0px ${i};`;default:return""}}}

    border-radius: 0 0 16px 16px;

    img {
      min-width: 100%;
      ${e=>{switch(e.position){case"left":return"border-radius: 0 2% 0 0;";case"center":return"border-radius: 2% 0px 0 0;";case"right":return"border-radius: 2% 0 0 0;";default:return""}}}
    }
  }
`,M=()=>(0,x.jsxs)(q,{children:[(0,x.jsxs)(F,{children:[(0,x.jsx)(s,{children:"Smarter notifications"}),(0,x.jsx)(d,{children:"Trigger notifications when it matters. We added more granular notification options for desktop, email and Slack."})]}),(0,x.jsx)(B,{backgroundImage:"/static/release/bkg2.jpg",position:"right",borderWidth:"thin",children:(0,x.jsx)("img",{src:"/static/release/notifications.png",alt:"Notifications inbox"})})]}),q=We(n)`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 32px;

  @media (max-width: 1000px) {
    flex-direction: column;
    padding-top: 0;
  }
`,F=We.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 280px;
  padding-top: ${i}px;
  padding-left: ${i}px;
  padding-right: ${i}px;

  @media (max-width: 1000px) {
    flex: auto;
    padding: ${i}px;
  }

  @media (max-width: 800px) {
    padding: ${t}px;
  }
`,B=We(S)`
  max-height: 500px;

  img {
    max-height: 100%;
  }

  @media (min-width: 1150px) {
    img {
    }
  }

  @media (max-width: 1000px) {
    border-top-left-radius: 0;
  }

  @media (max-width: 800px) {
    img {
      max-width: 110%;
    }
  }
`,O=()=>(0,x.jsxs)(T,{children:[(0,x.jsxs)("div",{children:[(0,x.jsx)(s,{children:"Integrations support OAuth2"}),(0,x.jsx)(d,{children:"Linear OAuth and GraphQL API bring more power to you and your favorite tools. Build extensions and add integrations securely."})]}),(0,x.jsx)(E,{src:"/static/release/oauth.png",alt:"OAuth2 integration"})]}),T=We(n)`
  justify-content: space-between;
`,E=We.img`
  width: 200%;
  margin-left: -55%;

  @media (max-width: 600px) {
    width: 155%;
    margin: 20px 0 -35px -30%;
  }
`,W=()=>{const[e,i]=Ye({threshold:1,triggerOnce:!0});return(0,x.jsxs)(R,{ref:e,children:[(0,x.jsxs)("div",{children:[(0,x.jsx)(s,{children:"Industry’s best performance"}),(0,x.jsx)(d,{children:"We shipped several performance improvements for speedier launch, list viewing and scrolling."})]}),(0,x.jsxs)(U,{children:[(0,x.jsx)(V,{inView:i,timeInMs:100,caption:"Open issue from list view"}),(0,x.jsx)(V,{inView:i,timeInMs:100,caption:"Add a label to 100 issues"})]})]})},R=We(n)``,U=We(Ve)`
  @media (max-width: 1150px) {
    flex-direction: column;
  }

  @media (max-width: 600px) {
    flex-direction: row;
  }

  @media (max-width: 500px) {
    flex-direction: column;
  }
`,V=i=>{const[t,a]=e.useState(1e3);e.useEffect(()=>{if(!i.inView)return;const e=setInterval(()=>{a(t=>t<=i.timeInMs?(clearInterval(e),t):t-50)},50);return()=>clearInterval(e)},[i.inView]);const r=We.div`
    font-style: normal;
    font-weight: var(--font-weight-normal);
    font-size: 64px;
    line-height: 131%;
    background: linear-gradient(91.83deg, #bb3b7f 2.26%, #da4a57 95.81%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `,n=We.div`
    background: linear-gradient(91.83deg, #bb3b7f 2.26%, #da4a57 95.81%);
    width: 31px;
    height: 6px;
    border-radius: 1px;
    margin-left: 5px;
  `,o=We.div`
    font-style: normal;
    font-weight: var(--font-weight-medium);
    font-size: 14px;
    line-height: 131%;
    margin-top: 10px;
    margin-left: 3px;
    color: #8a8f98;
  `,s=We.div`
    width: 245px;
    margin-top: 45px;
  `;return(0,x.jsxs)(s,{children:[(0,x.jsxs)(r,{children:[(t/1e3).toFixed(2),"s"]}),(0,x.jsx)(n,{}),(0,x.jsx)(o,{children:i.caption})]})},D=We.p`
  width: 660px;
  font-style: normal;
  font-weight: var(--font-weight-medium);
  font-size: 22px;
  line-height: 161%;
  text-align: center;
  color: ${e=>e.color?e.color:"rgba(255, 255, 255, 0.89)"};

  @media (max-width: 800px) {
    width: auto;
  }

  @media (max-width: 600px) {
    font-size: 22px;
  }

  @media (max-width: 500px) {
    font-size: 20px;
  }
`,G=We.a`
  ${e=>{switch(e.variant){case"dark":return"\n          background: var(--color-bg-tertiary);\n          color: var(--color-text-primary);\n        ";case"primary":return"\n          background: linear-gradient(92.88deg, #455EB5 9.16%, #5643CC 43.89%, #673FD7 64.72%);\n          color: var(--color-text-primary);\n        ";default:return"\n          background: var(--color-bg-secondary);\n          color: var(--color-text-secondary);\n        "}}}
  border-radius: ${e=>e.rounded?"15px":"10px"};
  ${e=>"large"===e.size?"min-width: 184px":""};
  font-size: ${e=>"small"===e.size?"14px":"16px"};
  padding: ${e=>"small"===e.size?"12px 24px":"16px 24px"};
  font-style: normal;
  font-weight: var(--font-weight-bold);
  line-height: 131%;
  text-align: center;
`,H=We.h1`
  max-width: 900px;
  font-style: normal;
  font-weight: 900;
  font-size: 64px;
  line-height: 131%;
  text-align: center;
  height: auto;
  margin: 0.5em 0 0;
  color: #fafafa;

  @media (max-width: 820px) {
    font-size: 48px;
  }

  @media (max-width: 600px) {
    font-size: 45px;
  }

  @media (max-width: 500px) {
    font-size: 36px;
  }
`,N=e=>{const{quote:i,author:t,logo:a,company:n,logoHeight:o,logoMargin:s,largeText:l}=e,p=We(d)`
    font-size: ${l?"19px":"18px"};
  `,c=We(Ve)`
    margin-top: 1em;
    img {
      ${o?`height: ${o}px`:"max-height: 24px"};
      ${s?`margin-top: ${s}px`:"margin-top: 8px"};
    }
  `;return(0,x.jsx)(r,{columns:3,children:(0,x.jsxs)(Ve,{direction:"column",justify:"space-between",gap:32,style:{height:"100%"},children:[(0,x.jsx)(p,{color:"var(--color-text-primary)",children:i}),(0,x.jsxs)(c,{direction:"column",align:"flex-start",children:[(0,x.jsx)(Ue,{color:"var(--color-text-tertiary)",children:t}),(0,x.jsx)("img",{src:a,alt:n})]})]})})},Y=()=>(0,x.jsxs)(Ve,{direction:"column",center:!0,children:[(0,x.jsx)(H,{children:"The next generation of startups is built on Linear"}),(0,x.jsx)(D,{color:"var(--color-text-tertiary)",children:"Linear keeps everyone aligned and working without friction. Engineers, designers, and peers all collaborating in one tool."}),(0,x.jsx)(G,{variant:"primary",size:"large",onClick:()=>{window.location.href=De.supported?"/signup":"/browser-compatibility"},children:"Sign up →"}),(0,x.jsxs)(Ve,{direction:"column",style:{margin:"104px 0"},children:[(0,x.jsxs)(J,{children:[(0,x.jsx)(N,{quote:(0,x.jsxs)("div",{children:["Before everything was scattered across GitHub, notes, reminders, Google Docs and just a bunch of different places.",(0,x.jsx)("br",{}),(0,x.jsx)("br",{}),"We've centralized all of it in Linear and greatly benefited from all of the automations."]}),author:"Brian Vallelunga, Founder & CEO",logo:"/static/release/logos/doppler.svg",company:"Doppler"}),(0,x.jsx)(N,{quote:(0,x.jsxs)("div",{children:["I think that one of the things that really high performing teams do is go from product feedback and into an execution. You err towards speed of execution because that’s how you find product-market fit and that’s ultimately what “make something people want” means.",(0,x.jsx)("br",{}),(0,x.jsx)("br",{}),"Linear, in my opinion, is optimized for this and where it’s best in class."]}),author:"Troy Goode, Co-founder & CEO",logo:"/static/release/logos/courier.svg",company:"Courier",logoHeight:24})]}),(0,x.jsxs)(J,{children:[(0,x.jsx)(N,{quote:"Our product got better and our releases got shorter and we’ve had fewer bugs because we now have every single detail written down in Linear.",author:"Michael Lukaszczyk, CEO & Co-founder",logo:"/static/release/logos/graphcms.svg",company:"GraphCMS"}),(0,x.jsx)(N,{quote:"When we're talking about something, whether it’s over Zoom or in Slack, it doesn't become real until it goes into Linear. It’s become the nucleus of our organization.",author:"Amanda Peyton, CEO & Co-founder",logo:"/static/release/logos/braid.png",company:"Braid"})]}),(0,x.jsxs)(J,{children:[(0,x.jsx)(N,{quote:"Using the tool creates a sense of momentum. It goes beyond just issue tracking.",author:"Kurt Ruppel, CTO & Co-founder",logo:"/static/release/logos/middesk.svg",company:"Middesk"}),(0,x.jsx)(N,{quote:"In a remote world communication tools are everything. You move as fast as your communication tools.",author:"Dani Grant, Co-founder",logo:"/static/release/logos/jam.svg",company:"Jam",logoHeight:26,logoMargin:4,largeText:!0})]})]})]}),J=We(a)`
  margin: 16px 0;
`,K=e=>{const a=e.backgroundImageUrl||"/static/release/bkg2.jpg",r=We(o)`
    flex: 0 0 400px;
    margin-right: 60px;
    padding: 0;

    @media (max-width: 1000px) {
      flex: auto;
    }
  `,s=We.div`
    flex-grow: 1;
  `,d=We(Ve)`
    margin: 36px;
    padding: ${i}px;

    @media (max-width: 1000px) {
      flex-direction: column;
    }

    @media (max-width: 800px) {
      padding: ${t}px;
      margin: 0;
    }
  `,l=We(S)`
    margin: 0 ${i}px;

    @media (max-width: 800px) {
      margin: 0;
    }
  `;return(0,x.jsxs)(n,{children:[(0,x.jsxs)(d,{children:[(0,x.jsx)(r,{children:e.title}),(0,x.jsx)(s,{children:e.copy})]}),(0,x.jsx)(l,{backgroundImage:a,position:"center",children:(0,x.jsx)("img",{src:e.imageUrl,alt:e.imageAlt})})]})},Q=()=>(0,x.jsx)(K,{title:"Roadmap: Codify the company direction",imageUrl:"/static/release/roadmap.png",imageAlt:"Roadmap",copy:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(d,{children:"Set milestones to tie projects to larger company goals and motivate your team. Clarify the company direction so that everyone knows why their work matters and how to prioritize it. View all company projects in one streamlined view and easily identify what needs your attention."}),(0,x.jsx)(d,{children:(0,x.jsx)(l,{href:"https://linear.app/method/roadmap",children:"Method: The How and Why of Roadmaps →"})})]})}),Z=()=>(0,x.jsx)(ne,{children:(0,x.jsxs)(Ge,{size:"narrow",children:[(0,x.jsxs)(ae,{children:[(0,x.jsx)(oe,{}),(0,x.jsx)(se,{}),(0,x.jsx)(de,{}),(0,x.jsx)(le,{src:"/static/release/mask2.svg",width:"158",alt:""})]}),(0,x.jsx)(Ne,{duration:1.5,delay:1,customFrom:"letter-spacing: 0.5vw",customTo:"letter-spacing: 0.3vw",children:(0,x.jsx)(re,{children:"Linear Release 2020.12"})}),(0,x.jsx)(Ne,{duration:1.5,delay:1,children:(0,x.jsx)(H,{children:"Next level for builders"})}),(0,x.jsx)(Ne,{duration:1.5,delay:1,children:(0,x.jsx)(D,{children:"In this release, we are taking our software development tool to the next level. Linear fits into your builder workflow even better with a product roadmap, customizable views, list controls, sorting options and an enhanced sub-issue editor."})})]})}),X=Re`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`,_=Re`
  0% {
    transform: scale(20);
  }
  100% {
    transform: scale(1);
  }
`,ee=Re`
  0% {
    transform: scale(2) rotate(90deg);
    opacity: 0;
  }

  60% {
    transform: scale(0.8) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`,ie=Re`
  0% {
    transform: rotate(0deg);
    filter: blur(15px);
    border-radius: 0%;
  }

  33% {
    transform: rotate(-15deg) translate(5px, -5px) scale(0.9);
    filter: blur(30px);
    border-radius: 35%;
  }

  67% {
    transform: rotate(-5deg) translate(-5px, -5px) scale(1.1);
    filter: blur(25px);
    border-radius: 30%;
  }

  100% {
    transform: rotate(0deg);
    filter: blur(15px);
    border-radius: 0%;
  }
`,te=Re`
  0% {
    transform: scale(0.5, 0.2);
    opacity: 0;
    animation-timing-function: ease-in;
  }

  20% {
    transform: scale(0.6, 0.9);
    opacity: 1;
  }

  100% {
    transform: scale(20, 0.3);
    opacity: 0;
  }
`,ae=We.div`
  position: relative;
  height: 240px;
  width: 340px;

  @media (max-width: 600px) {
    transform: scale(0.8);
  }
`,re=We.h4`
  font-style: normal;
  font-weight: var(--font-weight-normal);
  font-size: 14px;
  line-height: 131%;
  text-align: center;
  letter-spacing: 0.19em;
  text-transform: uppercase;
  background: linear-gradient(91.83deg, #bb3b7f 2.26%, #da4a57 95.81%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,ne=We.div`
  margin-top: 24px;
  padding: 160px 0 0 0;
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  position: relative;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  @media (max-width: 600px) {
    margin-top: 0;
    padding-top: 40px;
    margin-bottom: 48px;
  }
`,oe=We.div`
  animation: ${te} 1.2s cubic-bezier(0.6, 0, 0.15, 1);
  animation-delay: 0.9s;
  animation-fill-mode: both;
  width: 176px;
  height: 176px;
  background: conic-gradient(
    from 230.29deg at 51.63% 52.16%,
    #2400ff 0deg,
    #0087ff 67.5deg,
    #ff1d7a 198.75deg,
    #f5381b 251.25deg,
    #ff5335 301.88deg,
    #691eff 360deg
  );
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  filter: blur(16px);
  text-align: center;
  color: #ff0000;
`,se=We.div`
  animation:
    ${ee} 1.7s cubic-bezier(0.85, 0, 0.15, 1),
    ${ie} 20s ease-in-out 1.7s infinite both;
  animation-fill-mode: forwards;
  width: 176px;
  height: 176px;
  background: conic-gradient(
    from 230.29deg at 51.63% 52.16%,
    #2400ff 0deg,
    #0087ff 67.5deg,
    #ff1d7a 198.75deg,
    #f5381b 251.25deg,
    #ff5335 301.88deg,
    #691eff 360deg
  );
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  filter: blur(16px);
  text-align: center;
`,de=We.div`
  animation: ${X} 2s cubic-bezier(0.64, 0, 0.78, 0);
  animation-fill-mode: forwards;
  width: 175px;
  height: 175px;
  border: 10px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0);
`,le=We.img`
  animation: ${_} 1.2s cubic-bezier(0, 0.32, 0.3, 1);
  border-radius: 22px;
  width: 158px;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 8px;
  left: 0;
  right: 0;
  opacity: 0.95;
  text-align: center;
  height: auto;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.14);
`,xe=()=>(0,x.jsxs)(pe,{children:[(0,x.jsxs)(ce,{children:[(0,x.jsx)(s,{children:"Streamlined views"}),(0,x.jsx)(d,{children:"Show relevant information. Hide the rest. Display options let you see the work how you want to."}),(0,x.jsx)(d,{children:"Search faster with content search for lists and boards."})]}),(0,x.jsx)(he,{backgroundImage:"/static/release/bkg2.jpg",position:"left",borderWidth:"thin",children:(0,x.jsx)("img",{src:"/static/release/view-options.png",alt:"View options menu"})})]}),pe=We(n)`
  flex-direction: row-reverse;
  justify-content: space-between;
  height: 450px;

  @media (max-width: 1150px) {
    height: auto;
    flex-direction: column;
  }
`,ce=We.div`
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 220px;
  align-self: center;
  padding-right: 48px;

  @media (max-width: 1150px) {
    flex: auto;
    padding: ${i}px;
  }

  @media (max-width: 800px) {
    padding: ${t}px;
  }
`,he=We(A)`
  align-self: flex-end;
  align-items: flex-start;
  justify-content: flex-end;
  height: 400px;

  img {
    height: 400px;
    box-shadow: 0 0 28px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 1150px) {
    img {
      height: auto;
    }
  }
`,me=()=>(0,x.jsxs)(ge,{children:[(0,x.jsxs)(ue,{children:[(0,x.jsx)(s,{children:"Enhanced sub-issues"}),(0,x.jsx)(d,{children:"We redesigned sub-issue creation and navigation for a faster, more complete experience. Add a description, labels and cycles directly from the issue editor."})]}),(0,x.jsx)(fe,{backgroundImage:"/static/release/bkg2.jpg",position:"center",borderWidth:"thin",children:(0,x.jsx)("img",{src:"/static/release/sub-issues.png",alt:"Sub-issues in Linear"})})]}),ge=We(n)`
  justify-content: space-between;
`,ue=We.div`
  padding: ${i}px;

  @media (max-width: 800px) {
    padding: ${t}px;
  }
`,fe=We(A)`
  margin: 0 48px;

  @media (max-width: 1150px) {
    margin: 0;
  }
`,we=()=>(0,x.jsxs)(be,{children:[(0,x.jsxs)(je,{children:[(0,x.jsx)(ye,{children:"Tactile feel"}),(0,x.jsx)(ve,{children:"Update multiple issues quickly and confidently with smoother issue selection, contextual menus for mouse users and global undo."})]}),(0,x.jsx)("video",{loop:!0,autoPlay:!0,muted:!0,playsInline:!0,children:(0,x.jsx)("source",{"data-src":"/static/release/tactile.mp4",type:"video/mp4",src:"/static/release/tactile.mp4"})})]}),be=We(Ve)`
  position: relative;
  height: 45vw;
  max-height: 460px;
  justify-content: space-between;
  overflow: hidden;

  @media (max-width: 1000px) {
    flex-direction: column;
    max-height: none;
    height: auto;
  }

  img,
  video {
    align-self: flex-end;
    max-width: 71%;
    margin-bottom: -1px;
    margin-right: -5px;
    border-radius: 9px 0 0 0;
    box-shadow: -5px 12px 28px rgba(0, 0, 0, 0.4);

    @media (max-width: 1000px) {
      align-self: center;
      max-width: calc(100% - 2 * ${i}px);
      margin: 0;
      border-radius: 9px 9px 0 0;
    }

    @media (max-width: 600px) {
      align-self: flex-end;
      max-width: calc(100% - ${t}px);
      border-radius: 9px 0 0 0;
    }
  }
`,je=We.div`
  margin: 10vh 0 0 48px;
  width: 230px;

  @media (max-width: 1000px) {
    width: auto;
    margin: ${i}px 96px 24px ${i}px;
  }

  @media (max-width: 600px) {
    margin: ${t}px ${t}px 24px ${t}px;
  }
`,ye=We.h2`
  font-style: normal;
  font-weight: var(--font-weight-bold);
  font-size: 24px;
  line-height: 131%;
  color: #f0eeee;
`,ve=We.p`
  font-style: normal;
  font-weight: var(--font-weight-semibold);
  font-size: 18px;
  line-height: 139%;
  color: #ffffff;
`,ke=i=>{const{images:t,...a}=i,[r,n]=e.useState(0);return(0,x.jsxs)(Ve,{direction:"column",center:!0,...a,children:[(0,x.jsx)(ze,{justify:"space-between",center:!0,children:t.map((e,i)=>{const t=i===r;return(0,x.jsx)($e,{color:t?"var(--color-text-primary)":"var(--color-text-tertiary)",active:t,onClick:()=>n(i),children:e.title},i)})}),(0,x.jsx)(Ie,{backgroundImage:"/static/release/bkg.jpg",position:"center",children:t.map((e,i)=>(0,x.jsx)(Pe,{className:i!==r?"inactive":"active",children:(0,x.jsx)(Ce,{src:e.url,alt:e.title})},i))})]})},$e=We(Ue)`
  padding-bottom: 16px;
  margin: 0 32px;
  position: relative;

  &:hover {
    cursor: pointer;
    color: var(--color-text-secondary);
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background: ${e=>e.active?"linear-gradient(91.83deg, #BB3B7F 2.26%, #DA4A57 95.81%)":"transparent"};
    z-index: 1;
  }
`,ze=We(Ve)`
  margin: 0 -32px 48px -32px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: calc(100% - 64px);
    height: 2px;
    bottom: 0;
    left: 32px;
    background: var(--color-border-primary);
  }

  @media screen and (min-width: 736px) and (max-width: 980px) {
    &::after {
      width: calc(100% - 32px);
      left: 16px;
    }

    > * {
      margin: 0px 16px;
    }
  }

  @media screen and (max-width: 736px) {
    flex-wrap: wrap;
    margin-bottom: 24px;

    &::after {
      background: transparent;
    }

    > * {
      margin: 0px 16px 16px 16px;
    }
  }
`,Pe=We.div`
  width: 100%;

  &.active {
    opacity: 1;
    z-index: 1;
  }
  &.inactive {
    transition:
      opacity 0.7s,
      z-index 0.3s linear;
    z-index: 0;
    opacity: 0;
    height: 0;
  }
`,Ie=We(S)`
  display: block;
`,Ce=We.img`
  width: 100%;
`,Le=["Pale","Ash","Dawn","Midnight"],Se=()=>(0,x.jsxs)(Ae,{children:[(0,x.jsxs)(Me,{children:[(0,x.jsx)(o,{children:"A theme for every occasion"}),(0,x.jsx)(d,{children:"Use one of our themes or create your own to match your other tools."})]}),(0,x.jsx)(qe,{images:Le.map(e=>({title:e,url:`/static/release/themes/${e.toLowerCase()}.png`}))})]}),Ae=We.div`
  padding: ${i}px;
  padding-bottom: 0;

  @media (max-width: 800px) {
    padding: 0;
  }
`,Me=We.div`
  @media (max-width: 800px) {
    padding: ${t}px ${t}px 0 ${t}px;
  }
`,qe=We(ke)`
  margin-top: 64px;
`,Fe=()=>(0,x.jsx)(K,{title:"Views: Add faster workflows",copy:(0,x.jsx)(d,{children:"Create and save custom views that include exactly the issues you want to see. Focus better by filtering only relevant issues. Save time by creating views for common workflows. Manage work across teams easily with new all team and multi-team views. Share views with your team or workspace to make sure everyone’s on the same page."}),imageUrl:"/static/release/views.png",imageAlt:"Custom views"}),Be={default:function(){return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(Z,{}),(0,x.jsx)(Ne,{duration:2,delay:1.5,children:(0,x.jsxs)(Ge,{size:"narrow",children:[(0,x.jsx)(a,{children:(0,x.jsx)(r,{backgroundImage:"/static/release/bkg2.jpg",noPadding:!0,children:(0,x.jsx)(we,{})})}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{noPadding:!0,children:(0,x.jsx)(Q,{})})}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{columns:3,children:(0,x.jsx)(W,{})}),(0,x.jsx)(r,{columns:3,noPadding:!0,children:(0,x.jsx)(xe,{})})]}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{noPadding:!0,children:(0,x.jsx)(Fe,{})})}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{columns:4,noPadding:!0,children:(0,x.jsx)(M,{})}),(0,x.jsx)(r,{columns:2,children:(0,x.jsx)(p,{})})]}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{columns:2,children:(0,x.jsx)(O,{})}),(0,x.jsx)(r,{columns:4,noPadding:!0,children:(0,x.jsx)(me,{})})]}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{center:!0,noPadding:!0,children:(0,x.jsx)(Se,{})})}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{columns:3,children:(0,x.jsx)(P,{})}),(0,x.jsx)(r,{columns:3,children:(0,x.jsx)(k,{})})]}),(0,x.jsx)(He,{margin:"24px 0"}),(0,x.jsx)(Y,{})]})})]})}};export{Be as export_b232d9a62233};