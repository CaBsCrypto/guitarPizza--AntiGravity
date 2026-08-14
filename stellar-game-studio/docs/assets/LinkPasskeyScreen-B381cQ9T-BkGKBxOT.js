import{eN as n,fq as N,al as P,fA as A,es as I,gK as p,fp as e,hk as j,f3 as k,er as C,a2 as L}from"./index-BR4Qfvo1.js";import{a as S,c as x}from"./TodoList-CgrU7uwu-04alm8b9.js";import{n as g}from"./ScreenLayout-DXc2tOGB-7ArMG6DQ.js";import{C as M}from"./circle-check-big-naydcNUs.js";import{F as w}from"./fingerprint-pattern-ypNjwlmz.js";import{c as $}from"./createLucideIcon-D4oxk5XH.js";import"./check-AjXQG5cw.js";import"./ModalHeader-BEW0Qv0H-BWCcJsDR.js";import"./Screen-BpvoV6mG-CPkobwQX.js";import"./index-Dq_xe9dz-CHcRlSQu.js";const z=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],U=$("trash-2",z),W=({passkeys:s,name:c,isLoading:h,errorReason:m,success:l,expanded:a,onLinkPasskey:u,onUnlinkPasskey:t,onExpand:r,onBack:i,onClose:o})=>l?e.jsx(g,{title:"Passkeys updated",icon:M,iconVariant:"success",primaryCta:{label:"Done",onClick:o},onClose:o,watermark:!0}):a?e.jsx(g,{icon:w,title:"Your passkeys",onBack:i,onClose:o,watermark:!0,children:e.jsx(b,{passkeys:s,expanded:a,onUnlink:t,onExpand:r})}):e.jsxs(g,{icon:w,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:u,loading:h},onClose:o,watermark:!0,helpText:m||void 0,children:[s.length===0?e.jsx(D,{}):e.jsx(B,{children:e.jsx(b,{passkeys:s,expanded:a,onUnlink:t,onExpand:r})}),c?e.jsxs(T,{children:[e.jsx(_,{children:"New Passkey Name"}),e.jsx(V,{children:c})]}):null]});let B=n.div`
  margin-bottom: 0.75rem;
`,T=n.div`
  margin-top: 0.25rem;
`,_=n.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,V=n.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,b=({passkeys:s,expanded:c,onUnlink:h,onExpand:m})=>{let[l,a]=p.useState([]),u=c?s.length:2;return e.jsxs("div",{children:[e.jsx(Y,{children:"Your passkeys"}),e.jsxs(R,{children:[s.slice(0,u).map((t=>{return e.jsxs(G,{children:[e.jsxs("div",{children:[e.jsx(K,{children:(r=t,r.authenticatorName?r.createdWithBrowser?`${r.authenticatorName} on ${r.createdWithBrowser}`:r.authenticatorName:r.createdWithBrowser?r.createdWithOs?`${r.createdWithBrowser} on ${r.createdWithOs}`:`${r.createdWithBrowser}`:"Unknown device")}),e.jsxs(q,{children:["Last used:"," ",(t.latestVerifiedAt??t.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),e.jsx(J,{disabled:l.includes(t.credentialId),onClick:()=>(async i=>{a((o=>o.concat([i]))),await h(i),a((o=>o.filter((f=>f!==i))))})(t.credentialId),children:l.includes(t.credentialId)?e.jsx(L,{}):e.jsx(U,{size:16})})]},t.credentialId);var r})),s.length>2&&!c&&e.jsx(F,{onClick:m,children:"View all"})]})]})},D=()=>e.jsxs(S,{style:{color:"var(--privy-color-foreground)"},children:[e.jsx(x,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),e.jsx(x,{children:"Takes seconds to set up and use"}),e.jsx(x,{children:"Use your passkey to verify transactions and login to your account"})]});const se={component:()=>{let{user:s}=N(),{unlink:c}=P(),{linkWithPasskey:h,closePrivyModal:m}=A(),{data:l}=I(),a=s?.linkedAccounts.filter((d=>d.type==="passkey")),[u,t]=p.useState(!1),[r,i]=p.useState(""),[o,f]=p.useState(!1),[E,y]=p.useState(!1);return p.useEffect((()=>{a.length===0&&y(!1)}),[a.length]),e.jsx(W,{passkeys:a,name:l?.passkeyAuthModalData?.name,isLoading:u,errorReason:r,success:o,expanded:E,onLinkPasskey:()=>{t(!0),h({name:l?.passkeyAuthModalData?.name}).then((()=>f(!0))).catch((d=>{if(d instanceof j){if(d.privyErrorCode===k.CANNOT_LINK_MORE_OF_TYPE)return void i("Cannot link more passkeys to account.");if(d.privyErrorCode===k.PASSKEY_NOT_ALLOWED)return void i("Passkey request timed out or rejected by user.")}i("Unknown error occurred.")})).finally((()=>{t(!1)}))},onUnlinkPasskey:async d=>(t(!0),await c({credentialId:d}).then((()=>f(!0))).catch((v=>{v instanceof j&&v.privyErrorCode===k.MISSING_MFA_CREDENTIALS?i("Cannot unlink a passkey enrolled in MFA"):i("Unknown error occurred.")})).finally((()=>{t(!1)}))),onExpand:()=>y(!0),onBack:()=>y(!1),onClose:()=>m()})}},ce=n.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 90px;
  border-radius: 50%;
  svg + svg {
    margin-left: 12px;
  }
  > svg {
    z-index: 2;
    color: var(--privy-color-accent) !important;
    stroke: var(--privy-color-accent) !important;
    fill: var(--privy-color-accent) !important;
  }
`;let O=C`
  && {
    width: 100%;
    font-size: 0.875rem;
    line-height: 1rem;

    /* Tablet and Up */
    @media (min-width: 440px) {
      font-size: 14px;
    }

    display: flex;
    gap: 12px;
    justify-content: center;

    padding: 6px 8px;
    background-color: var(--privy-color-background);
    transition: background-color 200ms ease;
    color: var(--privy-color-accent) !important;

    :focus {
      outline: none;
      box-shadow: none;
    }
  }
`;const F=n.button`
  ${O}
`;let R=n.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.5rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,Y=n.div`
  line-height: 20px;
  height: 20px;
  font-size: 1em;
  font-weight: 450;
  display: flex;
  justify-content: flex-beginning;
  width: 100%;
`,K=n.div`
  font-size: 1em;
  line-height: 1.3em;
  font-weight: 500;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,q=n.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: #64668b;
  padding: 0.2em 0;
`,G=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: left;
  border-radius: 8px;
  border: 1px solid #e2e3f0 !important;
  width: 100%;
  height: 5em;
`,H=C`
  :focus,
  :hover,
  :active {
    outline: none;
  }
  display: flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
  svg {
    color: var(--privy-color-error);
  }
  svg:hover {
    color: var(--privy-color-foreground-3);
  }
`,J=n.button`
  ${H}
`;export{ce as DoubleIconWrapper,F as LinkButton,se as LinkPasskeyScreen,W as LinkPasskeyView,se as default};
