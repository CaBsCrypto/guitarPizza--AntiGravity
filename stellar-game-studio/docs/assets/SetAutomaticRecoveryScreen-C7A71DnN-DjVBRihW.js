import{dK as E,da as F,d7 as R,dc as y,d9 as e,ey as p,eL as w,dG as U,dC as I}from"./index-D8f71Q81.js";import{F as P}from"./ExclamationTriangleIcon-CQGQHgK0.js";import{F as W}from"./LockClosedIcon-DeBy6jA-.js";import{T as x,k as v,u as j}from"./ModalHeader-CPVs-20G-C821Z3cO.js";import{r as A}from"./Subtitle-CV-2yKE4-DKGD18U8.js";import{e as S}from"./Title-BnzYV3Is-Cb9vOU-O.js";const M=I.div`
  && {
    border-width: 4px;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  aspect-ratio: 1;
  border-style: solid;
  border-color: ${t=>t.$color??"var(--privy-color-accent)"};
  border-radius: 50%;
`,N={component:()=>{let{user:t}=E(),{client:b,walletProxy:u,refreshSessionAndUser:$,closePrivyModal:s}=F(),r=R(),{entropyId:m,entropyIdVerifier:k}=r.data?.recoverWallet??{},[a,f]=y.useState(!1),[l,T]=y.useState(null),[i,h]=y.useState(null);function n(){if(!a){if(i)return r.data?.setWalletPassword?.onFailure(i),void s();if(!l)return r.data?.setWalletPassword?.onFailure(Error("User exited set recovery flow")),void s()}}r.onUserCloseViaDialogOrKeybindRef.current=n;let C=!(!a&&!l);return e.jsxs(e.Fragment,i?{children:[e.jsx(x,{onClose:n},"header"),e.jsx(M,{$color:"var(--privy-color-error)",style:{alignSelf:"center"},children:e.jsx(P,{height:38,width:38,stroke:"var(--privy-color-error)"})}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Something went wrong"}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{onClick:()=>h(null),children:"Try again"}),e.jsx(j,{})]}:{children:[e.jsx(x,{onClose:n},"header"),e.jsx(W,{style:{width:"3rem",height:"3rem",alignSelf:"center"}}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Automatically secure your account"}),e.jsx(A,{style:{marginTop:"1rem"},children:"When you log into a new device, you’ll only need to authenticate to access your account. Never get logged out if you forget your password."}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{loading:a,disabled:C,onClick:()=>(async function(){f(!0);try{let o=await b.getAccessToken(),c=w(t,m);if(!o||!u||!c)return;if(!(await u.setRecovery({accessToken:o,entropyId:m,entropyIdVerifier:k,existingRecoveryMethod:c.recoveryMethod,recoveryMethod:"privy"})).entropyId)throw Error("Unable to set recovery on wallet");let d=await $();if(!d)throw Error("Unable to set recovery on wallet");let g=w(d,c.address);if(!g)throw Error("Unabled to set recovery on wallet");T(!!d),setTimeout((()=>{r.data?.setWalletPassword?.onSuccess(g),s()}),U)}catch(o){h(o)}finally{f(!1)}})(),children:l?"Success":"Confirm"}),e.jsx(j,{})]})}};export{N as SetAutomaticRecoveryScreen,N as default};
