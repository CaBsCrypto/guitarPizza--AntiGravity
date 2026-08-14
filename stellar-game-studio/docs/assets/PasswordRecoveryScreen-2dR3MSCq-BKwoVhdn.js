import{gK as a,fq as _,fA as T,es as E,fp as e,ct as I,fz as F,d1 as N,eN as u,er as U}from"./index-BR4Qfvo1.js";import{F as W}from"./ShieldCheckIcon-zgJbIQiq.js";import{m as O}from"./ModalHeader-BEW0Qv0H-BWCcJsDR.js";import{l as V}from"./Layouts-BlFm53ED-WIa4XOzm.js";import{g as z,h as H,u as K,b as M,k as q}from"./shared-DSGqR8b3-CsLB3Z2E.js";import{w as t}from"./Screen-BpvoV6mG-CPkobwQX.js";import"./index-Dq_xe9dz-CHcRlSQu.js";const re={component:()=>{let[o,h]=a.useState(!0),{authenticated:p,user:w}=_(),{walletProxy:y,closePrivyModal:m,createAnalyticsEvent:f,client:b}=T(),{navigate:j,data:k,onUserCloseViaDialogOrKeybindRef:A}=E(),[l,C]=a.useState(void 0),[v,n]=a.useState(""),[d,x]=a.useState(!1),{entropyId:c,entropyIdVerifier:$,onCompleteNavigateTo:g,onSuccess:S,onFailure:P}=k.recoverWallet,i=(r="User exited before their wallet could be recovered")=>{m({shouldCallAuthOnSuccess:!1}),P(typeof r=="string"?new N(r):r)};return A.current=i,a.useEffect((()=>{if(!p)return i("User must be authenticated and have a Privy wallet before it can be recovered")}),[p]),e.jsxs(t,{children:[e.jsx(t.Header,{icon:W,title:"Enter your password",subtitle:"Please provision your account on this new device. To continue, enter your recovery password.",showClose:!0,onClose:i}),e.jsx(t.Body,{children:e.jsx(B,{children:e.jsxs("div",{children:[e.jsxs(z,{children:[e.jsx(H,{type:o?"password":"text",onChange:r=>(s=>{s&&C(s)})(r.target.value),disabled:d,style:{paddingRight:"2.3rem"}}),e.jsx(K,{style:{right:"0.75rem"},children:o?e.jsx(M,{onClick:()=>h(!1)}):e.jsx(q,{onClick:()=>h(!0)})})]}),!!v&&e.jsx(D,{children:v})]})})}),e.jsxs(t.Footer,{children:[e.jsx(t.HelpText,{children:e.jsxs(V,{children:[e.jsx("h4",{children:"Why is this necessary?"}),e.jsx("p",{children:"You previously set a password for this wallet. This helps ensure only you can access it"})]})}),e.jsx(t.Actions,{children:e.jsx(L,{loading:d||!y,disabled:!l,onClick:async()=>{x(!0);let r=await b.getAccessToken(),s=I(w,c);if(!r||!s||l===null)return i("User must be authenticated and have a Privy wallet before it can be recovered");try{f({eventName:"embedded_wallet_recovery_started",payload:{walletAddress:s.address}}),await y?.recover({accessToken:r,entropyId:c,entropyIdVerifier:$,recoveryPassword:l}),n(""),g?j(g):m({shouldCallAuthOnSuccess:!1}),S?.(s),f({eventName:"embedded_wallet_recovery_completed",payload:{walletAddress:s.address}})}catch(R){F(R)?n("Invalid recovery password, please try again."):n("An error has occurred, please try again.")}finally{x(!1)}},$hideAnimations:!c&&d,children:"Recover your account"})}),e.jsx(t.Watermark,{})]})]})}};let B=u.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,D=u.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: var(--privy-color-error);
  text-align: left;
  margin-top: 0.5rem;
`,L=u(O)`
  ${({$hideAnimations:o})=>o&&U`
      && {
        // Remove animations because the recoverWallet task on the iframe partially
        // blocks the renderer, so the animation stutters and doesn't look good
        transition: none;
      }
    `}
`;export{re as PasswordRecoveryScreen,re as default};
