import{gO as E,gX as F,fq as R,im as y,gN as e,$ as p,c_ as w,fr as U,g3 as I}from"./index-Wb1mOVw9.js";import{F as P}from"./ExclamationTriangleIcon-9DU1cMT-.js";import{F as W}from"./LockClosedIcon-D1xsxU-z.js";import{L as x,u as v,h as j}from"./ModalFooter-FDXOM0ZR-tfw4j-6D.js";import{r as A}from"./Subtitle-CV-2yKE4-BsEz8Jh1.js";import{e as S}from"./Title-BnzYV3Is-Db4kBxcT.js";const M=I.div`
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
`,D={component:()=>{let{user:t}=E(),{client:b,walletProxy:u,refreshSessionAndUser:T,closePrivyModal:s}=F(),r=R(),{entropyId:f,entropyIdVerifier:$}=r.data?.recoverWallet??{},[a,m]=y.useState(!1),[i,k]=y.useState(null),[l,g]=y.useState(null);function n(){if(!a){if(l)return r.data?.setWalletPassword?.onFailure(l),void s();if(!i)return r.data?.setWalletPassword?.onFailure(Error("User exited set recovery flow")),void s()}}r.onUserCloseViaDialogOrKeybindRef.current=n;let C=!(!a&&!i);return e.jsxs(e.Fragment,l?{children:[e.jsx(x,{onClose:n},"header"),e.jsx(M,{$color:"var(--privy-color-error)",style:{alignSelf:"center"},children:e.jsx(P,{height:38,width:38,stroke:"var(--privy-color-error)"})}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Something went wrong"}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{onClick:()=>g(null),children:"Try again"}),e.jsx(j,{})]}:{children:[e.jsx(x,{onClose:n},"header"),e.jsx(W,{style:{width:"3rem",height:"3rem",alignSelf:"center"}}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Automatically secure your account"}),e.jsx(A,{style:{marginTop:"1rem"},children:"When you log into a new device, you’ll only need to authenticate to access your account. Never get logged out if you forget your password."}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{loading:a,disabled:C,onClick:()=>(async function(){m(!0);try{let o=await b.getAccessToken(),c=w(t,f);if(!o||!u||!c)return;if(!(await u.setRecovery({accessToken:o,entropyId:f,entropyIdVerifier:$,existingRecoveryMethod:c.recoveryMethod,recoveryMethod:"privy"})).entropyId)throw Error("Unable to set recovery on wallet");let d=await T();if(!d)throw Error("Unable to set recovery on wallet");let h=w(d,c.address);if(!h)throw Error("Unabled to set recovery on wallet");k(!!d),setTimeout((()=>{r.data?.setWalletPassword?.onSuccess(h),s()}),U)}catch(o){g(o)}finally{m(!1)}})(),children:i?"Success":"Confirm"}),e.jsx(j,{})]})}};export{D as SetAutomaticRecoveryScreen,D as default};
