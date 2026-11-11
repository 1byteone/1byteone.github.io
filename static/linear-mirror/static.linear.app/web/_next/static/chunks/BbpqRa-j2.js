var e,t,i,a,n,r,l,o,s,g;import{o as h}from"./C_JJxWoe.js";import{ai as p}from"./DipWGRuU.js";import{t as c}from"./BS9CVKc_.js";import{a as d,i as w}from"./DvPgvKbY2.js";import{t as f}from"./WnOndYt32.js";function v(){return w`
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    background-clip: text;
    -webkit-background-clip: text;
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    color: unset;
  `}function m(){return w`
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  `}e=h(p(),1),t=()=>{const[t,i]=e.useState({width:void 0,height:void 0});return e.useEffect(()=>{function e(){i({width:window.innerWidth,height:window.innerHeight})}return e(),window.addEventListener("resize",e),window.addEventListener("orientationchange",e),()=>{window.removeEventListener("resize",e),window.removeEventListener("orientationchange",e)}},[]),t},a={mobile:"@media "+(i={mobile:"(max-width: 640px)",tablet:"(max-width: 768px)",laptop:"(max-width: 1024px)",desktop:"(max-width: 1280px)",wide:"(max-width: 1536px)",all:"(min-width: 0px)"}).mobile,tablet:"@media "+i.tablet,laptop:"@media "+i.laptop,desktop:"@media "+i.desktop,wide:"@media "+i.wide,all:"@media "+i.all},n=()=>{const e=t();if(void 0!==e.width)return e.width<640?"mobile":e.width<768?"tablet":e.width<1024?"laptop":e.width<1280?"desktop":"wide"},r=e=>{switch(e){case"annotation":return w`
        font-size: 11px;
        line-height: 14px;
        letter-spacing: 0;
      `;case"tiny":return w`
        font-size: var(--text-tiny-size);
        line-height: var(--text-tiny-line-height);
        letter-spacing: var(--text-tiny-letter-spacing);
      `;case"micro":return w`
        font-size: var(--text-micro-size);
        line-height: var(--text-micro-line-height);
        letter-spacing: var(--text-micro-letter-spacing);
      `;case"mini":return w`
        font-size: var(--text-mini-size);
        line-height: var(--text-mini-line-height);
        letter-spacing: var(--text-mini-letter-spacing);
      `;case"small":return w`
        font-size: var(--text-small-size);
        line-height: var(--text-small-line-height);
        letter-spacing: var(--text-small-letter-spacing);
      `;case"regular":return w`
        font-size: var(--text-regular-size);
        line-height: var(--text-regular-line-height);
        letter-spacing: var(--text-regular-letter-spacing);
      `;case"large":return w`
        font-size: var(--text-large-size);
        line-height: var(--text-large-line-height);
        letter-spacing: var(--text-large-letter-spacing);
      `;case"title-1":return w`
        font-size: var(--title-1-size);
        line-height: var(--title-1-line-height);
        letter-spacing: var(--title-1-letter-spacing);
      `;case"title-2":return w`
        font-size: var(--title-2-size);
        line-height: var(--title-2-line-height);
        letter-spacing: var(--title-2-letter-spacing);
      `;case"title-3":return w`
        font-size: var(--title-3-size);
        line-height: var(--title-3-line-height);
        letter-spacing: var(--title-3-letter-spacing);
      `;case"title-4":return w`
        font-size: var(--title-4-size);
        line-height: var(--title-4-line-height);
        letter-spacing: var(--title-4-letter-spacing);
      `;case"title-5":return w`
        font-size: var(--title-5-size);
        line-height: var(--title-5-line-height);
        letter-spacing: var(--title-5-letter-spacing);
      `;case"title-6":return w`
        font-size: var(--title-6-size);
        line-height: var(--title-6-line-height);
        letter-spacing: var(--title-6-letter-spacing);
      `;case"title-7":return w`
        font-size: var(--title-7-size);
        line-height: var(--title-7-line-height);
        letter-spacing: var(--title-7-letter-spacing);
      `;case"title-8":return w`
        font-size: var(--title-8-size);
        line-height: var(--title-8-line-height);
        letter-spacing: var(--title-8-letter-spacing);
      `;case"title-9":return w`
        font-size: var(--title-9-size);
        line-height: var(--title-9-line-height);
        letter-spacing: var(--title-9-letter-spacing);
      `;default:throw new c(e)}},l={primary:"var(--color-text-primary)",secondary:"var(--color-text-secondary)",tertiary:"var(--color-text-tertiary)",quaternary:"var(--color-text-quaternary)"},o=e=>{return w`
  ${()=>"string"==typeof e.size?r(e.size):e.size?w`
        ${r(e.size.initial)}

        ${e.size.wide&&w`
            ${a.wide} {
              ${r(e.size.wide)}
            }
          `}

        ${e.size.desktop&&w`
            ${a.desktop} {
              ${r(e.size.desktop)}
            }
          `}

        ${e.size.laptop&&w`
            ${a.laptop} {
              ${r(e.size.laptop)}
            }
          `}

        ${e.size.tablet&&w`
            ${a.tablet} {
              ${r(e.size.tablet)}
            }
          `}

        ${e.size.mobile&&w`
            ${a.mobile} {
              ${r(e.size.mobile)}
            }
          `}
      `:void 0};

  color: ${e.color?l[e.color]??e.color:void 0};
  margin: ${e.margin};
  ${"none"===e.wrap&&w`
      white-space: nowrap;
    `}
  ${"wrap"===e.wrap&&w`
      white-space: normal;
    `}
  ${"balance"===e.wrap&&w`
      text-wrap: balance;
    `}
  ${"pretty"===e.wrap&&w`
      text-wrap: pretty;
    `}
  ${"character"===e.wrap&&w`
      overflow-wrap: anywhere;
    `}
  ${"word"===e.wrap&&w`
      overflow-wrap: break-word;
    `}
  ${"justify"===e.align&&w`
      hyphens: auto;
    `}
  ${e.transform&&w`
      text-transform: ${e.transform};
    `}
  ${"none"===e.select&&w`
      user-select: none;
    `}

  ${e.tabularNums&&w`
      font-variant-numeric: tabular-nums;
      /* Alternative digits (3, 4, 6, 9) */
      font-feature-settings: var(--font-settings), "ss01";
    `}

  ${"mono"===e.font&&w`
      font-family: var(--font-monospace);
      font-feature-settings: normal;
      font-variation-settings: normal;
      letter-spacing: normal;
    `}
  ${"serif-display"===e.font&&w`
      font-family: var(--font-serif-display);
      font-feature-settings: normal;
      font-variation-settings: normal;
    `}

  ${e.truncate&&("boolean"==typeof e.truncate?w`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `:(t=e.truncate,w`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${t};
    overflow: hidden;
    overflow-wrap: anywhere;
  `))}

  ${e.gradient&&w`
      background: ${e.gradient};
      ${v()};

      /* Text with gradient text and short line-height will cut off descenders */
      /* Ensure they are visible by adding padding-bottom */
      padding-bottom: 0.13em;

      &::selection,
      & *::selection {
        background: var(--color-selection-dim);
      }
    `}

  ${()=>"string"==typeof e.align?w`
        text-align: ${e.align};
      `:e.align?w`
        text-align: ${e.align.initial};

        ${e.align.wide&&w`
            ${a.wide} {
              text-align: ${e.align.wide};
            }
          `}

        ${e.align.desktop&&w`
            ${a.desktop} {
              text-align: ${e.align.desktop};
            }
          `}

        ${e.align.laptop&&w`
            ${a.laptop} {
              text-align: ${e.align.laptop};
            }
          `}

        ${e.align.tablet&&w`
            ${a.tablet} {
              text-align: ${e.align.tablet};
            }
          `}

        ${e.align.mobile&&w`
            ${a.mobile} {
              text-align: ${e.align.mobile};
            }
          `}
      `:void 0}

  /* Raw values should override type/kind presets */

  ${e.fontSize&&w`
      font-size: ${f(e.fontSize)};
    `}

  ${e.lineHeight&&w`
      line-height: ${e.lineHeight};
    `}

  ${e.letterSpacing&&w`
      letter-spacing: ${e.letterSpacing};
    `}

  ${e.weight&&w`
      font-weight: ${"light"===e.weight?"var(--font-weight-light)":"normal"===e.weight?"var(--font-weight-normal)":"medium"===e.weight?"var(--font-weight-medium)":"semibold"===e.weight?"var(--font-weight-semibold)":"bold"===e.weight?"var(--font-weight-bold)":"var(--font-weight-normal)"};
    `}

  ${e.fontWeight&&w`
      font-weight: ${e.fontWeight};
    `}

  u& {
    text-decoration: underline;
    text-decoration-style: solid;
    text-decoration-thickness: 1.5px;
    text-decoration-color: var(--color-text-quaternary);
    text-underline-offset: 2.5px;
  }

  sup& {
    position: relative;
    vertical-align: initial;
    top: -0.5em;
    font-size: 0.6em;
  }

  code& {
    font-family: var(--font-monospace);
    font-size: 0.9em;
    background: none;
    padding: 0;
  }

  label& {
    user-select: none;
  }
`;var t},s=new Set(["kind","color","weight","fontWeight","fontSize","lineHeight","letterSpacing","transform","align","truncate","gradient","tabularNums","margin","theme","wrap","select","font"]),g=d.span.withConfig({shouldForwardProp:e=>!s.has(e)})`
  ${o}
`;export{t as a,n as i,i as n,m as o,a as r,v as s,g as t};