import{fq as E,fA as F,es as R,gK as y,fp as e,cK as p,ct as w,et as U,eN as A}from"./index-BR4Qfvo1.js";import{F as I}from"./ExclamationTriangleIcon-UQ5bVBoC.js";import{F as P}from"./LockClosedIcon-CUEheYkr.js";import{T as x,k as v,u as j}from"./ModalHeader-BEW0Qv0H-BWCcJsDR.js";import{r as W}from"./Subtitle-CV-2yKE4-BF9LipFN.js";import{e as S}from"./Title-BnzYV3Is-Tpo67y3i.js";const M=A.div`
  && {
    border-width: 4px;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  aspect-ratio: 1;
  border-style: solid;
  border-color: ${o=>o.$color??"var(--privy-color-accent)"};
  border-radius: 50%;
`,O={component:()=>{let{user:o}=E(),{client:b,walletProxy:u,refreshSessionAndUser:$,closePrivyModal:s}=F(),r=R(),{entropyId:f,entropyIdVerifier:k}=r.data?.recoverWallet??{},[a,m]=y.useState(!1),[l,T]=y.useState(null),[i,h]=y.useState(null);function n(){if(!a){if(i)return r.data?.setWalletPassword?.onFailure(i),void s();if(!l)return r.data?.setWalletPassword?.onFailure(Error("User exited set recovery flow")),void s()}}r.onUserCloseViaDialogOrKeybindRef.current=n;let C=!(!a&&!l);return e.jsxs(e.Fragment,i?{children:[e.jsx(x,{onClose:n},"header"),e.jsx(M,{$color:"var(--privy-color-error)",style:{alignSelf:"center"},children:e.jsx(I,{height:38,width:38,stroke:"var(--privy-color-error)"})}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Something went wrong"}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{onClick:()=>h(null),children:"Try again"}),e.jsx(j,{})]}:{children:[e.jsx(x,{onClose:n},"header"),e.jsx(P,{style:{width:"3rem",height:"3rem",alignSelf:"center"}}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Automatically secure your account"}),e.jsx(W,{style:{marginTop:"1rem"},children:"When you log into a new device, you’ll only need to authenticate to access your account. Never get logged out if you forget your password."}),e.jsx(p,{style:{minHeight:"2rem"}}),e.jsx(v,{loading:a,disabled:C,onClick:()=>(async function(){m(!0);try{let t=await b.getAccessToken(),c=w(o,f);if(!t||!u||!c)return;if(!(await u.setRecovery({accessToken:t,entropyId:f,entropyIdVerifier:k,existingRecoveryMethod:c.recoveryMethod,recoveryMethod:"privy"})).entropyId)throw Error("Unable to set recovery on wallet");let d=await $();if(!d)throw Error("Unable to set recovery on wallet");let g=w(d,c.address);if(!g)throw Error("Unabled to set recovery on wallet");T(!!d),setTimeout((()=>{r.data?.setWalletPassword?.onSuccess(g),s()}),U)}catch(t){h(t)}finally{m(!1)}})(),children:l?"Success":"Confirm"}),e.jsx(j,{})]})}};export{O as SetAutomaticRecoveryScreen,O as default};
