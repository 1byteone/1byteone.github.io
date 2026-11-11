var e,t,s,i,r,n,a,o,h,d,l,c,g,p,u,x,j,b,m,f,w,y,v,$,k,T,I,z,A,C,E,S,L,W,D,U,M,N,B,q,O,P,_,F,Z,H,Y,G,K,J,Q,R,V,X,ee,te,se,ie,re,ne,ae,oe,he,de,le,ce,ge,pe,ue,xe,je;import{o as be}from"./C_JJxWoe.js";import{Ur as me,ai as fe}from"./DipWGRuU.js";import{a as we,o as ye}from"./DvPgvKbY2.js";import{r as ve,t as $e}from"./BbpqRa-j2.js";import{t as ke}from"./C5rym-AJ2.js";import{t as Te}from"./B0kL8_Rx.js";import{t as Ie}from"./DmipTUNM.js";import{t as ze}from"./BoTu5-Vy.js";import{r as Ae}from"./Dv_GumD7.js";import{t as Ce}from"./CHkfo8LG2.js";import{t as Ee}from"./ExY4aRfB2.js";import{c as Se,l as Le,n as We,o as De,s as Ue,u as Me}from"./H28IotiV2.js";import{t as Ne}from"./C6237win.js";import"./Bv-rMoBQ.js";import{t as Be}from"./D3eQZFZl.js";import{t as qe}from"./BRrVjEfj.js";import{t as Oe}from"./ojqo1dEK.js";e=be(Ie(),1),t=be(fe(),1),s=me(),i=e=>(0,s.jsxs)(r,{...e,children:[(0,s.jsx)(n,{}),(0,s.jsx)(a,{children:e.children})]}),r=we.div`
  --dash-size: 3px;
  --dash-gap: 3px;
  --dash-color: var(--color-line-primary);

  --shadow-size: 128px;
  --hidden: transparent;
  --visible: black;

  position: relative;
  padding-left: 24px;

  @media (max-width: 700px) {
    padding-left: 8px;
  }
`,n=we.div`
  position: absolute;
  left: 24px;
  height: 100%;
  width: 1px;

  background: repeating-linear-gradient(
    to bottom,
    var(--dash-color) 0px,
    var(--dash-color) var(--dash-size),
    var(--transparent) var(--dash-size),
    var(--transparent) calc(var(--dash-size) + var(--dash-size))
  );

  mask-image: linear-gradient(
    to bottom,
    var(--hidden) 0px,
    var(--visible) var(--shadow-size),
    var(--visible) calc(100% - var(--shadow-size)),
    var(--hidden) 100%
  );

  @media (max-width: 700px) {
    left: 8px;
  }
`,a=we.div`
  padding: var(--shadow-size) 0 var(--shadow-size) 40px;
`,h=ye`
  from {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  to {
    opacity: 0;
    transform: scale(1.3);
  }
`,we(o=we.div`
  position: absolute;
  left: -28px;
  top: 16px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  box-shadow: 0 0 0 4px var(--color-bg-primary);
`)`
  background: #9c7bff;
  top: unset;
  left: -44px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    border: 2px solid #9c7bff;
    border-radius: 50%;
    height: 21px;
    width: 21px;
    animation: ${h} 2.8s ease-out infinite backwards;
  }

  &::after {
    animation-delay: 0.8s;
  }
`,we(o)`
  background: #9c7bff;
  top: unset;
  left: -44px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    border: 2px solid #9c7bff;
    border-radius: 50%;
    height: 21px;
    width: 21px;
    animation: ${h} 2.8s ease-out infinite backwards;
  }

  &::after {
    animation-delay: 0.8s;
  }
`,c={width:480,height:853},g={src:`${d="https://static.linear.app/assets/insights"}/effort/effort-filter-1.png${l="?v=5"}`,width:297,height:26},p={src:`${d}/effort/effort-filter-2.png${l}`,width:297,height:26},u={src:`${d}/effort/effort-filter-3.png${l}`,width:297,height:26},x={src:`${d}/effort/effort-1.png${l}`,...c},j={src:`${d}/effort/effort-2.png${l}`,...c},b={src:`${d}/effort/effort-3.png${l}`,...c},m={src:`${d}/effort/effort-4.png${l}`,...c},f={src:`${d}/effort/effort-5.png${l}`,...c},w={src:`${d}/effort/effort-6.png${l}`,...c},y={src:`${d}/effort/effort-7.png${l}`,...c},v={src:`${d}/effort/effort-mobile.png${l}`,width:626,height:992},$={src:`${d}/bug/bug-filter-1.png${l}`,width:224,height:26},k={src:`${d}/bug/bug-filter-2.png${l}`,width:224,height:26},T={src:`${d}/bug/bug-1.png${l}`,...c},I={src:`${d}/bug/bug-2.png${l}`,...c},z={src:`${d}/bug/bug-3.png${l}`,...c},A={src:`${d}/bug/bug-4.png${l}`,...c},C={src:`${d}/bug/bug-5.png${l}`,...c},E={src:`${d}/bug/bug-6.png${l}`,...c},S={src:`${d}/bug/bug-7.png${l}`,...c},L={src:`${d}/bug/bug-8.png${l}`,...c},W={src:`${d}/bug/bug-9.png${l}`,...c},D={src:`${d}/bug/bug-10.png${l}`,...c},U={src:`${d}/bug/bug-11.png${l}`,...c},M={src:`${d}/bug/bug-12.png${l}`,...c},N={src:`${d}/bug/bug-mobile-1.png${l}`,width:626,height:992},B={src:`${d}/bug/bug-mobile-2.png${l}`,width:626,height:992},q={src:`${d}/data/data-1.png${l}`,...c},O={src:`${d}/data/data-2.png${l}`,...c},P={src:`${d}/data/data-3.png${l}`,...c},_={src:`${d}/data/data-4.png${l}`,...c},F={src:`${d}/data/data-5.png${l}`,...c},Z={src:`${d}/data/data-6.png${l}`,...c},H={src:`${d}/data/data-7.png${l}`,...c},Y={src:`${d}/data/data-8.png${l}`,...c},G={src:`${d}/data/data-9.png${l}`,...c},K={src:`${d}/data/data-mobile.png${l}`,width:626,height:992},J=e=>{const[i,r]=t.useState(!1);return Oe({open:i,setOpen:r,title:e.eyebrow}),(0,s.jsxs)(Se,{open:i,onOpenChange:r,children:[(0,s.jsx)(Me,{render:(0,s.jsx)(Q,{icon:e.icon,eyebrow:e.eyebrow,title:e.title})}),(0,s.jsxs)(Ue,{children:[(0,s.jsx)(De,{}),(0,s.jsxs)(Ae,{className:"oZT7ua_dialogContent",children:[(0,s.jsx)(Ce,{children:(0,s.jsx)(Le,{children:e.title})}),(0,s.jsx)(We,{render:(0,s.jsx)(Te,{variant:"border",shape:"circle",className:"oZT7ua_close",children:(0,s.jsx)(Ee,{})})}),(0,s.jsx)(qe,{shadow:"vertical",style:{"--Scrollable-shadow-size":"32px","--scrollbar-gap":"5px"},className:"oZT7ua_scrollable",children:e.children})]})]})]})},Q=t.forwardRef(({icon:e,eyebrow:t,title:i,...r},n)=>(0,s.jsxs)("button",{...r,className:"oZT7ua_card hCgVwa_reset-button",ref:n,type:"button",children:[(0,s.jsxs)(ke,{align:"center",gap:8,children:[e,(0,s.jsx)($e,{as:"h3",size:"regular",color:"tertiary",weight:"normal",children:t})]}),(0,s.jsxs)(ke,{align:"end",justify:"space-between",gap:24,children:[(0,s.jsx)($e,{as:"p",size:"title-1",weight:"medium",wrap:"balance",children:i}),(0,s.jsx)(Te,{className:"oZT7ua_iconButton",variant:"border",shape:"circle",asChild:!0,children:(0,s.jsx)("div",{children:(0,s.jsx)(Be,{})})})]})]})),R=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(ue,{children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{paddingLeft:24},children:[(0,s.jsx)($e,{size:"small",color:"tertiary",children:"Effort Distribution"}),(0,s.jsx)(ze,{height:16}),(0,s.jsx)(te,{children:"“Where are we spending our resources?”"}),(0,s.jsx)(se,{children:"As CTO, you want to gain a better understanding of where the efforts of your teams are being allocated. Which projects have taken most attention recently?"})]}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsxs)(ie,{children:["As a first step, we create a custom view with all ",(0,s.jsx)(le,{id:"1",children:"completed issues"})," across all teams in your Linear workspace. Let’s filter that list down to the"," ",(0,s.jsx)(le,{id:"2",children:"last three months"})," to focus on the most recent quarter."]}),(0,s.jsxs)(ee,{children:[(0,s.jsx)(he,{target:["","3","4","5","6","7","8"],children:(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:g,alt:"A filter set to only show issues with a Completed date after 3 months ago."})})}),(0,s.jsx)(he,{target:"1",children:(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:p,alt:'A filter set to only show issues with a Completed date after 3 months ago. The "Completed date" filter type is highlighted with a green border.'})})}),(0,s.jsx)(he,{target:"2",children:(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:u,alt:'A filter set to only show issues with a Completed date after 3 months ago. The "3 months ago" qualifier is highlighted with a green border.'})})})]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsxs)(ie,{children:["To understand which streams of work your company allocated most resources to, we look at the"," ",(0,s.jsx)(le,{id:"3",children:"number of issues"})," ",(0,s.jsx)(le,{id:"4",children:"per project"}),". It seems like a lot of work was spent on your ",(0,s.jsx)(le,{id:"5",children:"AI-related projects"}),", which aligns with your Q1 goals."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsxs)(ie,{children:["Let’s narrow in and ",(0,s.jsx)(le,{id:"6",children:"segment your data"})," by team. By"," ",(0,s.jsx)(le,{id:"7",children:"applying a quick filter"}),", we get a better picture of the impact of a particular team."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsxs)(ie,{children:["We can also drill into a segment and see the exact team distribution for each project by"," ",(0,s.jsx)(le,{id:"8",children:"hovering over each slice"}),"."]})]})]})]}),(0,s.jsxs)(ee,{children:[(0,s.jsx)(he,{target:["","1","2"],children:(0,s.jsx)(de,{src:x,alt:"Insights panel showing projects ranked by issue count."})}),(0,s.jsx)(he,{target:"3",children:(0,s.jsx)(de,{src:j,alt:"Insights panel showing projects ranked by issue count. The Measure dropdown, set to Issue count, is highlighted with a green border."})}),(0,s.jsx)(he,{target:"4",children:(0,s.jsx)(de,{src:b,alt:"Insights panel showing projects ranked by issue count. The Dimension dropdown, set to Project, is highlighted with a green border."})}),(0,s.jsx)(he,{target:"5",children:(0,s.jsx)(de,{src:m,alt:'Insights panel showing projects ranked by issue count. The top two projects, "OpenAI Integration", "NLP chatbot" are highlighted with a green border.'})}),(0,s.jsx)(he,{target:"6",children:(0,s.jsx)(de,{src:f,alt:"Insights panel showing projects ranked by issue count and segmented by Team. The Segment dropdown is highlighted with a green border."})}),(0,s.jsx)(he,{target:"7",children:(0,s.jsx)(de,{src:w,alt:"Insights panel showing projects ranked by issue count. The EU Engineering team column is highlighted with a green border."})}),(0,s.jsx)(he,{target:"8",children:(0,s.jsx)(de,{src:y,alt:"Insights panel showing projects ranked by issue count. The first bar in the bar chart is hovered, representing the NLP chatbot project, with 5 issues in the Design team, 13 issues in the US Engineering team, and 32 issues in the EU Engineering team."})})]})]}),(0,s.jsxs)(je,{children:[(0,s.jsxs)("div",{style:{paddingLeft:24},children:[(0,s.jsx)($e,{size:"small",color:"tertiary",children:"Effort Distribution"}),(0,s.jsx)(ze,{height:16}),(0,s.jsx)(te,{children:"“Where are we spending our resources?”"}),(0,s.jsx)(se,{children:"As CTO, you want to gain a better understanding of where the efforts of your teams are being allocated. Which projects have taken most attention recently?"})]}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsx)(ie,{children:"We first create a custom view with all completed issues across all teams from the last three months"}),(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:g,alt:"A filter set to only show issues with a Completed date after 3 months ago."})})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsx)(ie,{children:"Number of issues per project tells us where you spent your resources"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsx)(ie,{children:"When we segment the data by team we get a better picture of the impact of a particular team"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsx)(ie,{children:"Looks like a lot of work was spent on AI-related projects"})]})]}),(0,s.jsx)(Ne,{src:v,alt:'An annotated screenshot of the Linear insights panel. The "Measure" and "Dimension" dropdowns are annotated by the number 2. The "Segment" dropdown is annotated by the number 3. The "NLP chatbot" and "OpenAI Integration" project rows are annotated by the number 4.'})]})]}),V=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(ue,{children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{paddingLeft:24},children:[(0,s.jsx)($e,{size:"small",color:"tertiary",children:"Bug clearance"}),(0,s.jsx)(ze,{height:16}),(0,s.jsx)(te,{children:"“Are we getting better at fixing bugs?”"}),(0,s.jsx)(se,{children:"Your intuition tells you that the number of reported bugs has increased in recent months. But is that actually true? And if so, is your clearance rate improving or deteriorating?"})]}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsxs)(ie,{children:["To get a sense check, let’s create a custom view with ",(0,s.jsx)(le,{id:"1",children:"all bugs"})," in your workspace. With Insights, we can now visualize ",(0,s.jsx)(le,{id:"2",children:"how many bugs"})," have been"," ",(0,s.jsx)(le,{id:"3",children:"created over time"}),"."]}),(0,s.jsxs)(ee,{children:[(0,s.jsx)(he,{target:["","2","3","4","5","6","7","8","9","10","11","12"],children:(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:$,alt:'A filter set to show issues with labels that include "Bug".'})})}),(0,s.jsx)(he,{target:"1",children:(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:k,alt:'A filter set to show issues with labels that include "Bug", highlighted with a yellow border.'})})})]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsxs)(ie,{children:["The data supports your intuition: The number of bugs has ",(0,s.jsx)(le,{id:"4",children:"indeed been going up"}),"."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsxs)(ie,{children:["The ",(0,s.jsx)(le,{id:"5",children:"segmentation option"})," allows us drill further into the data. When we"," ",(0,s.jsx)(le,{id:"6",children:"segment the data by status"}),", for example, we can see that"," ",(0,s.jsx)(le,{id:"7",children:"the bug clearance rate has also gone up"}),"."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsxs)(ie,{children:["After we ",(0,s.jsx)(le,{id:"8",children:"segment the data by team"}),", we find the answer for the increase in reported bugs: ",(0,s.jsx)(le,{id:"9",children:"the new mobile team that joined recently"})," to build the long awaited iOS app has obviously filed a lot new bugs since they came on board."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"5"}),(0,s.jsxs)(ie,{children:["Lastly, we want to look at ",(0,s.jsx)(le,{id:"10",children:"clearance latency"}),": how quickly do bugs get fixed? Cycle times seem to have been pretty constant - except for a ",(0,s.jsx)(le,{id:"11",children:"few outliers"}),". We can find out what’s going on by ",(0,s.jsx)(le,{id:"12",children:"clicking on them"}),"."]})]})]})]}),(0,s.jsxs)(ee,{children:[(0,s.jsx)(he,{target:["","1"],children:(0,s.jsx)(de,{src:T,alt:"Insights panel showing issues by created date."})}),(0,s.jsx)(he,{target:"2",children:(0,s.jsx)(de,{src:I,alt:"Insights panel showing issues by created date. The Measure dropdown, set to Issue count, is highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"3",children:(0,s.jsx)(de,{src:z,alt:"Insights panel showing issues by created date. The Dimension dropdown, set to Created date, is highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"4",children:(0,s.jsx)(de,{src:A,alt:"Insights panel showing issues by created date. There is a yellow arrow showing how the number of created issues is increasing over time."})}),(0,s.jsx)(he,{target:"5",children:(0,s.jsx)(de,{src:C,alt:'Insights panel showing issues by created date. The Segment dropdown is open, with the "Status" option hovered.'})}),(0,s.jsx)(he,{target:"6",children:(0,s.jsx)(de,{src:E,alt:"Insights panel showing issues by created date. The Segment dropdown, set to Status, is highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"7",children:(0,s.jsx)(de,{src:S,alt:'Insights panel showing issues by created date. The "Done" column is highlighted with a yellow border.'})}),(0,s.jsx)(he,{target:"8",children:(0,s.jsx)(de,{src:L,alt:"Insights panel showing issues by created date. The Segment dropdown, set to Team, is highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"9",children:(0,s.jsx)(de,{src:W,alt:"Insights panel showing issues by created date. The second to last bar in the bar chart is hovered, showing a popup of February 2023, during which the Core Engineering team created 8 issues (6.4%) and the Mobile team created 117 issues (93.6%)."})}),(0,s.jsx)(he,{target:"10",children:(0,s.jsx)(de,{src:D,alt:"Insights panel showing issues by created date. The Measure dropdown, set to Cycle time, is highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"11",children:(0,s.jsx)(de,{src:U,alt:"Insights panel showing issues by created date. A few outlier points on the scatter plot are highlighted with a yellow border."})}),(0,s.jsx)(he,{target:"12",children:(0,s.jsx)(de,{src:M,alt:'Insights panel showing issues by created date. A point on the scatter plot is hovered, showing a popup for an issue called "App keeps crashing" that took 6 weeks to complete, which is much higher than the average completion time of 2 weeks.'})})]})]}),(0,s.jsxs)(je,{children:[(0,s.jsx)(te,{children:"“Are we getting better at fixing bugs?”"}),(0,s.jsx)(se,{children:"Your intuition tells you that the number of reported bugs has increased in recent months. But is that actually true? And if so, is your clearance rate improving or deteriorating?"}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsx)(ie,{children:"To get a sense check, let’s create a custom view with all bugs in your workspace"}),(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:$,alt:'A filter set to show issues with labels that include "Bug".'})})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsx)(ie,{children:"How many bugs have been created over time?"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsx)(ie,{children:"The data supports your intuition: The number of bugs has indeed been going up."})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsx)(ie,{children:"Good news! When we segment the data by issue status, we can see that the bug clearance rate has also gone up"})]})]}),(0,s.jsx)(Ne,{src:N,alt:'An annotated screenshot of the Linear insights panel showing a bar chart of issues over time. Each bar is segmented by issue status. The "Measure: Issue Count" and "Dimension: Created date" dropdowns are annotated by the number 2. The bar chart\'s x-axis is annotated by the number 3. The blue section of the last bar in the chart (representing the segment of "Done" issues) is annotated by the number 4.'}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"5"}),(0,s.jsx)(ie,{children:"Lastly, we want to look at clearance latency: How quickly do bugs get fixed?"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"6"}),(0,s.jsx)(ie,{children:"Cycle times seem to have been pretty constant - except for a few outliers."})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"7"}),(0,s.jsx)(ie,{children:"We can find out more about each outlier by clicking on the respective dot"})]})]}),(0,s.jsx)(Ne,{src:B,alt:'An annotated screenshot of the Linear insights panel showing a scatterplot of 731 issues. The "Measure: Cycle time" dropdown is annotated by the number 5. The scatterplot\'s x-axis is annotated by the number 6. An outlier dot in the chart is clicked, representing the issue titled "App keeps crashing". This dot, and the associated popup containing issue information, is annotated by the number 7.'})]})]}),X=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(ue,{children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{paddingLeft:24},children:[(0,s.jsx)($e,{size:"small",color:"tertiary",children:"Data hygiene"}),(0,s.jsx)(ze,{height:16}),(0,s.jsx)(te,{children:"“Are we prioritizing issues consistently?”"}),(0,s.jsx)(se,{children:"You are in charge of an important, company-wide project. To ensure that everyone on the project works effectively, a decision has been made that every issue should have a priority."})]}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsxs)(ie,{children:["We can do a data quality check directly in the project by opening the insights panel and creating a report with ",(0,s.jsx)(le,{id:"2",children:"all issues"})," sorted by ",(0,s.jsx)(le,{id:"3",children:"priority"}),"."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsxs)(ie,{children:["It looks like there are still ",(0,s.jsx)(le,{id:"4",children:"a lot of issues that haven’t been prioritized"}),". We can ",(0,s.jsx)(le,{id:"5",children:"add a team segmentation"})," to the report to see if the unprioritized issues are concentrated on a specific team."]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsxs)(ie,{children:["Turns out that ",(0,s.jsx)(le,{id:"6",children:"the US engineering team hasn’t been prioritizing much of anything"}),". Time to talk to the engineering manager!"]})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsxs)(ie,{children:[(0,s.jsx)(le,{id:"7",children:"The EU engineering team has done a more thorough job"}),", but there are still a handful of issues left. Let’s apply a ",(0,s.jsx)(le,{id:"8",children:"quick filter on all unprioritized issues"})," ","and process them right away."]})]})]})]}),(0,s.jsxs)(ee,{children:[(0,s.jsx)(he,{target:"",children:(0,s.jsx)(de,{src:q,alt:"Insights panel showing issues ranked by priority."})}),(0,s.jsx)(he,{target:"1",children:(0,s.jsx)(de,{src:O,alt:"Insights panel showing issues ranked by priority. The Insights tab is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"2",children:(0,s.jsx)(de,{src:P,alt:"Insights panel showing issues ranked by priority. The Measure dropdown, set to Issue count, is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"3",children:(0,s.jsx)(de,{src:_,alt:"Insights panel showing issues ranked by priority. The Dimension dropdown, set to Priority, is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"4",children:(0,s.jsx)(de,{src:F,alt:"Insights panel showing issues ranked by priority. The first bar in the bar chart is hovered, showing a total issue count of 72."})}),(0,s.jsx)(he,{target:"5",children:(0,s.jsx)(de,{src:Z,alt:"Insights panel showing issues ranked by priority and segmented by Team. The Segment dropdown, set to Team, is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"6",children:(0,s.jsx)(de,{src:H,alt:"Insights panel showing issues ranked by priority and segmented by Team. The US Engineering column is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"7",children:(0,s.jsx)(de,{src:Y,alt:"Insights panel showing issues ranked by priority and segmented by Team. The EU Engineering team column is highlighted with a cyan border."})}),(0,s.jsx)(he,{target:"8",children:(0,s.jsx)(de,{src:G,alt:"Insights panel showing issues ranked by priority and segmented by Team. The first cell in the EU Engineering column is focused and highlighted with a cyan border. A popup shows that the EU Engineering team has 3 unprioritized issues, and the US Engineering team has 69 unprioritized issues."})})]})]}),(0,s.jsxs)(je,{children:[(0,s.jsx)(te,{children:"“Are we prioritizing issues consistently?”"}),(0,s.jsx)(se,{children:"You are in charge of an important, company-wide project. To ensure that everyone on the project works effectively, a decision has been made that every issue should have a priority."}),(0,s.jsxs)(re,{children:[(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"1"}),(0,s.jsx)(ie,{children:"Number of issues per project tells us where you spent your resources"}),(0,s.jsx)(ge,{children:(0,s.jsx)(Ne,{src:g,alt:"A filter set to only show issues with a Completed date after 3 months ago."})})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"2"}),(0,s.jsx)(ie,{children:"When we segment the data by team we get a better picture of the impact of a particular team"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"3"}),(0,s.jsx)(ie,{children:"It looks like there are still a lot of issues that haven’t been prioritized"})]}),(0,s.jsxs)(ne,{children:[(0,s.jsx)(ae,{children:"4"}),(0,s.jsx)(ie,{children:"Turns out that the US engineering team hasn’t been prioritizing much of anything. Time to talk to the engineering manager!"})]})]}),(0,s.jsx)(Ne,{src:K,alt:'An annotated screenshot of the Linear insights panel showing 4 bars in a bar chart representing the four Linear priorities: "No priority", "High", "Medium", and "Low". The insights tab of the panel is selected and annotated by the number 1. The three dropdowns, "Measure: Issue count", "Dimension: Priority", and "Segment: Team", are annotated by the number 2. The first cell of the "Engineering EU" column represents the number of "No priority" issues in that team. It contains the number 3, and is annotated by the number 3. The "Engineering US" column of the priority table beneath the graph is annotated by the number 4.'})]})]}),ee=we.div`
  display: grid;

  & > * {
    grid-area: 1 / 1;
  }
`,te=we($e).attrs({fontSize:32,lineHeight:1.3,fontWeight:510,letterSpacing:"-0.69px",as:"h3"})`
  text-indent: -0.25em;
`,se=we($e).attrs({size:"regular",as:"h4",margin:"24px 0 24px 0"})``,ie=we($e).attrs({size:"regular",as:"p",color:"#B4BCD0",margin:"0 0 40px 0"})`
  ${ve.tablet} {
    margin-bottom: 16px;
  }
`,re=we(i)`
  --shadow-size: 32px;
  // margin-left: -24px;

  ${ve.tablet} {
    margin-left: 0;
  }
`,ne=we.div`
  margin-left: -16px;
  padding-top: 8px;
  position: relative;
`,ae=we(o)`
  border: 1px solid var(--color-line-secondary);
  background: var(--color-bg-level-0);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  font-size: 10px;

  top: 12px;
  left: -34px;
`,oe=t.createContext(["",e.default]),he=e=>{const[i]=t.useContext(oe),r="string"==typeof e.target?i===e.target:e.target.includes(i);return(0,s.jsx)("div",{style:{visibility:r?"visible":"hidden"},"aria-hidden":!r,children:e.children})},de=e=>{const{target:t,...i}=e;return(0,s.jsx)(pe,{children:(0,s.jsx)(Ne,{...i})})},le=e=>{const[i,r]=t.useContext(oe);function n(){r(t=>t===e.id?"":e.id)}return(0,s.jsx)(ce,{...e,id:void 0,"data-state":i===e.id?"on":"off","aria-pressed":i===e.id,role:"button",onKeyDown:e=>{" "!==e.key&&"Enter"!==e.key||(e.preventDefault(),n())},tabIndex:0,onMouseEnter:()=>{r(e.id)},onClick:n})},ce=we.span`
  background: var(--color-bg-level-3);
  border: 1px solid var(--color-line-primary);
  border-radius: 5px;
  padding: 1px 4px;

  cursor: pointer;
  transition: 120ms;
  transition-property: background, border-color;

  &[data-state="on"],
  &.focus-visible,
  &:hover {
    background: var(--color-line-primary);
    border-color: var(--color-line-primary);
    color: var(--color-text-primary);
  }

  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
`,ge=we.div`
  margin-bottom: 16px;
  margin-top: -16px;

  ${ve.tablet} {
    margin-top: 0;
  }
`,pe=we.div`
  position: relative;
  margin-top: 54px;
  display: flex;
  padding: 8px;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    mask-image: linear-gradient(to right, transparent, black 30%);
  }
`,ue=e=>{const[i,r]=t.useState(""),n=t.useMemo(()=>[i,r],[i]);return(0,s.jsx)(oe.Provider,{value:n,children:(0,s.jsx)(xe,{...e,gap:64})})},xe=we(ke)`
  overflow-y: auto;
  max-height: 100%;
  padding-block: 32px;
  padding-inline: 16px;
  position: relative;
  isolation: isolate;
  margin-block: auto;

  & > * {
    flex: 1 1 0%;
  }

  ${ve.tablet} {
    display: none;
  }
`,je=we.div`
  display: none;

  ${ve.tablet} {
    display: block;
  }
`;export{V as BugUseCase,X as DataUseCase,R as EffortUseCase,J as UseCaseDialog};