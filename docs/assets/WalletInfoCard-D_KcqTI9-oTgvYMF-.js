import{im as m,gN as e,g3 as r}from"./index-wQ7HOzQP.js";import{f as p}from"./ModalFooter-FDXOM0ZR-CEYEVJyA.js";import{e as f}from"./ErrorMessage-D8VaAP5m-dXUJNGGK.js";import{r as x}from"./LabelXs-oqZNqbm_-Nm5avcsX.js";import{d as h}from"./Address-P0fi9aXn-Bg33S5T8.js";import{d as g}from"./shared-FM0rljBt-DbSxVgs-.js";import{C as j}from"./check-CvSFYNlW.js";import{C as u}from"./copy-D_vpCWuT.js";let v=r(g)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,y=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,C=r.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,w=r.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,b=r(x)`
  text-align: left;
  margin-bottom: 0.5rem;
`,z=r(f)`
  margin-top: 0.25rem;
`,E=r(p)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;const P=({errMsg:t,balance:o,address:a,className:c,title:n,showCopyButton:d=!1})=>{let[s,l]=m.useState(!1);return m.useEffect((()=>{if(s){let i=setTimeout((()=>l(!1)),3e3);return()=>clearTimeout(i)}}),[s]),e.jsxs("div",{children:[n&&e.jsx(b,{children:n}),e.jsx(v,{className:c,$state:t?"error":void 0,children:e.jsxs(y,{children:[e.jsxs(C,{children:[e.jsx(h,{address:a,showCopyIcon:!1}),o!==void 0&&e.jsx(w,{children:o})]}),d&&e.jsx(E,{onClick:function(i){i.stopPropagation(),navigator.clipboard.writeText(a).then((()=>l(!0))).catch(console.error)},size:"sm",children:e.jsxs(e.Fragment,s?{children:["Copied",e.jsx(j,{size:14})]}:{children:["Copy",e.jsx(u,{size:14})]})})]})}),t&&e.jsx(z,{children:t})]})};export{P as j};
