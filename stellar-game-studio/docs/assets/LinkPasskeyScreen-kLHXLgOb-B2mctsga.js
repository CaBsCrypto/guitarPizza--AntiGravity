import{dD as n,dL as L,fl as P,db as I,d8 as N,dd as p,da as e,de as j,df as x,el as C,fm as A}from"./index-BaKN6Yt3.js";import{a as S,c as k}from"./TodoList-CgrU7uwu-R6m1eZGp.js";import{n as g}from"./ScreenLayout-BZAQ9cdJ-BXl8n-P1.js";import{C as M}from"./circle-check-big-Dkwo_gnS.js";import{F as w}from"./fingerprint-pattern-nPGIKvEZ.js";import{c as z}from"./createLucideIcon-CwiPfTuJ.js";import"./x-DbTE9R8n.js";import"./check-wpldRMWs.js";import"./ModalFooter-FDXOM0ZR-D7A18QWp.js";import"./Screen-C5Cvq4cJ-ChZVFugk.js";import"./index-Dq_xe9dz-B-RBP7cT.js";const B=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],U=z("trash-2",B),$=({passkeys:s,name:d,isLoading:h,errorReason:m,success:l,expanded:a,onLinkPasskey:u,onUnlinkPasskey:t,onExpand:r,onBack:i,onClose:o})=>l?e.jsx(g,{title:"Passkeys updated",icon:M,iconVariant:"success",primaryCta:{label:"Done",onClick:o},onClose:o,watermark:!0}):a?e.jsx(g,{icon:w,title:"Your passkeys",onBack:i,onClose:o,watermark:!0,children:e.jsx(b,{passkeys:s,expanded:a,onUnlink:t,onExpand:r})}):e.jsxs(g,{icon:w,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:u,loading:h},onClose:o,watermark:!0,helpText:m||void 0,children:[s.length===0?e.jsx(V,{}):e.jsx(T,{children:e.jsx(b,{passkeys:s,expanded:a,onUnlink:t,onExpand:r})}),d?e.jsxs(W,{children:[e.jsx(_,{children:"New Passkey Name"}),e.jsx(D,{children:d})]}):null]});let T=n.div`
  margin-bottom: 0.75rem;
`,W=n.div`
  margin-top: 0.25rem;
`,_=n.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,D=n.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,b=({passkeys:s,expanded:d,onUnlink:h,onExpand:m})=>{let[l,a]=p.useState([]),u=d?s.length:2;return e.jsxs("div",{children:[e.jsx(Y,{children:"Your passkeys"}),e.jsxs(R,{children:[s.slice(0,u).map((t=>{return e.jsxs(G,{children:[e.jsxs("div",{children:[e.jsx(K,{children:(r=t,r.authenticatorName?r.createdWithBrowser?`${r.authenticatorName} on ${r.createdWithBrowser}`:r.authenticatorName:r.createdWithBrowser?r.createdWithOs?`${r.createdWithBrowser} on ${r.createdWithOs}`:`${r.createdWithBrowser}`:"Unknown device")}),e.jsxs(q,{children:["Last used:"," ",(t.latestVerifiedAt??t.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),e.jsx(J,{disabled:l.includes(t.credentialId),onClick:()=>(async i=>{a((o=>o.concat([i]))),await h(i),a((o=>o.filter((y=>y!==i))))})(t.credentialId),children:l.includes(t.credentialId)?e.jsx(A,{}):e.jsx(U,{size:16})})]},t.credentialId);var r})),s.length>2&&!d&&e.jsx(F,{onClick:m,children:"View all"})]})]})},V=()=>e.jsxs(S,{style:{color:"var(--privy-color-foreground)"},children:[e.jsx(k,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),e.jsx(k,{children:"Takes seconds to set up and use"}),e.jsx(k,{children:"Use your passkey to verify transactions and login to your account"})]});const de={component:()=>{let{user:s}=L(),{unlink:d}=P(),{linkWithPasskey:h,closePrivyModal:m}=I(),{data:l}=N(),a=s?.linkedAccounts.filter((c=>c.type==="passkey")),[u,t]=p.useState(!1),[r,i]=p.useState(""),[o,y]=p.useState(!1),[E,f]=p.useState(!1);return p.useEffect((()=>{a.length===0&&f(!1)}),[a.length]),e.jsx($,{passkeys:a,name:l?.passkeyAuthModalData?.name,isLoading:u,errorReason:r,success:o,expanded:E,onLinkPasskey:()=>{t(!0),h({name:l?.passkeyAuthModalData?.name}).then((()=>y(!0))).catch((c=>{if(c instanceof j){if(c.privyErrorCode===x.CANNOT_LINK_MORE_OF_TYPE)return void i("Cannot link more passkeys to account.");if(c.privyErrorCode===x.PASSKEY_NOT_ALLOWED)return void i("Passkey request timed out or rejected by user.")}i("Unknown error occurred.")})).finally((()=>{t(!1)}))},onUnlinkPasskey:async c=>(t(!0),await d({credentialId:c}).then((()=>y(!0))).catch((v=>{v instanceof j&&v.privyErrorCode===x.MISSING_MFA_CREDENTIALS?i("Cannot unlink a passkey enrolled in MFA"):i("Unknown error occurred.")})).finally((()=>{t(!1)}))),onExpand:()=>f(!0),onBack:()=>f(!1),onClose:()=>m()})}},le=n.div`
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
`;export{le as DoubleIconWrapper,F as LinkButton,de as LinkPasskeyScreen,$ as LinkPasskeyView,de as default};
