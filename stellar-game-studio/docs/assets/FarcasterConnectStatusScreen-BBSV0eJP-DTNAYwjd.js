import{fq as L,es as U,fG as M,fA as D,gK as n,f3 as d,fB as z,et as j,fp as r,fI as F,b as B,eN as s}from"./index-BR4Qfvo1.js";import{n as W}from"./OpenLink-DZHy38vr-DMeT_sRz.js";import{C as q}from"./QrCode-DIf9iT4J-C677cxNo.js";import{$ as V}from"./ModalHeader-BEW0Qv0H-BWCcJsDR.js";import{r as P}from"./LabelXs-oqZNqbm_-CDTns88s.js";import{a as H}from"./shouldProceedtoEmbeddedWalletCreationFlow-DP_5_sAF-C72pOH8T.js";import{n as K}from"./ScreenLayout-DXc2tOGB-7ArMG6DQ.js";import{l as $}from"./farcaster-DPlSjvF5-DXSeV0uc.js";import"./browser-DN-SuPEU.js";import{C as Q}from"./check-AjXQG5cw.js";import{C as G}from"./copy-BixS4kQg.js";import"./Screen-BpvoV6mG-CPkobwQX.js";import"./index-Dq_xe9dz-CHcRlSQu.js";import"./createLucideIcon-D4oxk5XH.js";let J=s.div`
  width: 100%;
`,X=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  height: 56px;
  background: ${e=>e.$disabled?"var(--privy-color-background-2)":"var(--privy-color-background)"};
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);

  &:hover {
    border-color: ${e=>e.$disabled?"var(--privy-color-foreground-4)":"var(--privy-color-foreground-3)"};
  }
`,Y=s.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`,O=s.span`
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: ${e=>e.$disabled?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  overflow: hidden;
  text-overflow: ellipsis;
  /* Use single-line truncation without nowrap to respect container width */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;

  @media (min-width: 441px) {
    font-size: 14px;
    line-height: 20px;
  }
`,Z=s(O)`
  color: var(--privy-color-foreground-3);
  font-style: italic;
`,ee=s(P)`
  margin-bottom: 0.5rem;
`,re=s(V)`
  && {
    gap: 0.375rem;
    font-size: 14px;
    flex-shrink: 0;
  }
`;const te=({value:e,title:u,placeholder:l,className:t,showCopyButton:c=!0,truncate:o,maxLength:p=40,disabled:m=!1})=>{let[f,x]=n.useState(!1),w=o&&e?((a,E,h)=>{if((a=a.startsWith("https://")?a.slice(8):a).length<=h)return a;if(E==="middle"){let y=Math.ceil(h/2)-2,S=Math.floor(h/2)-1;return`${a.slice(0,y)}...${a.slice(-S)}`}return`${a.slice(0,h-3)}...`})(e,o,p):e;return n.useEffect((()=>{if(f){let a=setTimeout((()=>x(!1)),3e3);return()=>clearTimeout(a)}}),[f]),r.jsxs(J,{className:t,children:[u&&r.jsx(ee,{children:u}),r.jsxs(X,{$disabled:m,children:[r.jsx(Y,{children:e?r.jsx(O,{$disabled:m,title:e,children:w}):r.jsx(Z,{$disabled:m,children:l||"No value"})}),c&&e&&r.jsx(re,{onClick:function(a){a.stopPropagation(),navigator.clipboard.writeText(e).then((()=>x(!0))).catch(console.error)},size:"sm",children:r.jsxs(r.Fragment,f?{children:["Copied",r.jsx(Q,{size:14})]}:{children:["Copy",r.jsx(G,{size:14})]})})]})]})},ae=({connectUri:e,loading:u,success:l,errorMessage:t,onBack:c,onClose:o,onOpenFarcaster:p})=>r.jsx(K,F.isMobile||u?F.isIOS?{title:t?t.message:"Sign in with Farcaster",subtitle:t?t.detail:"To sign in with Farcaster, please open the Farcaster app.",icon:$,iconVariant:"loading",iconLoadingStatus:{success:l,fail:!!t},primaryCta:e&&p?{label:"Open Farcaster app",onClick:p}:void 0,onBack:c,onClose:o,watermark:!0}:{title:t?t.message:"Signing in with Farcaster",subtitle:t?t.detail:"This should only take a moment",icon:$,iconVariant:"loading",iconLoadingStatus:{success:l,fail:!!t},onBack:c,onClose:o,watermark:!0,children:e&&F.isMobile&&r.jsx(ie,{children:r.jsx(W,{text:"Take me to Farcaster",url:e,color:"#8a63d2"})})}:{title:"Sign in with Farcaster",subtitle:"Scan with your phone's camera to continue.",onBack:c,onClose:o,watermark:!0,children:r.jsxs(oe,{children:[r.jsx(se,{children:e?r.jsx(q,{url:e,size:275,squareLogoElement:$}):r.jsx(ce,{children:r.jsx(B,{})})}),r.jsxs(ne,{children:[r.jsx(le,{children:"Or copy this link and paste it into a phone browser to open the Farcaster app."}),e&&r.jsx(te,{value:e,truncate:"end",maxLength:30,showCopyButton:!0,disabled:!0})]})]})}),Ce={component:()=>{let{authenticated:e,logout:u,ready:l,user:t}=L(),{lastScreen:c,navigate:o,navigateBack:p,setModalData:m}=U(),f=M(),{getAuthFlow:x,loginWithFarcaster:w,closePrivyModal:a,createAnalyticsEvent:E}=D(),[h,y]=n.useState(void 0),[S,R]=n.useState(!1),[b,I]=n.useState(!1),C=n.useRef([]),_=x(),T=_?.meta.connectUri;return n.useEffect((()=>{let g=Date.now(),k=setInterval((async()=>{let A=await _.pollForReady.execute(),N=Date.now()-g;if(A){clearInterval(k),R(!0);try{await w(),I(!0)}catch(i){let v={retryable:!1,message:"Authentication failed"};if(i?.privyErrorCode===d.ALLOWLIST_REJECTED)return void o("AllowlistRejectionScreen");if(i?.privyErrorCode===d.USER_LIMIT_REACHED)return console.error(new z(i).toString()),void o("UserLimitReachedScreen");if(i?.privyErrorCode===d.USER_DOES_NOT_EXIST)return void o("AccountNotFoundScreen");if(i?.privyErrorCode===d.LINKED_TO_ANOTHER_USER)v.detail=i.message??"This account has already been linked to another user.";else{if(i?.privyErrorCode===d.ACCOUNT_TRANSFER_REQUIRED&&i.data?.data?.nonce)return m({accountTransfer:{nonce:i.data?.data?.nonce,account:i.data?.data?.subject,displayName:i.data?.data?.account?.displayName,linkMethod:"farcaster",embeddedWalletAddress:i.data?.data?.otherUser?.embeddedWalletAddress,farcasterEmbeddedAddress:i.data?.data?.otherUser?.farcasterEmbeddedAddress}}),void o("LinkConflictScreen");i?.privyErrorCode===d.INVALID_CREDENTIALS?(v.retryable=!0,v.detail="Something went wrong. Try again."):i?.privyErrorCode===d.TOO_MANY_REQUESTS&&(v.detail="Too many requests. Please wait before trying again.")}y(v)}}else N>12e4&&(clearInterval(k),y({retryable:!0,message:"Authentication failed",detail:"The request timed out. Try again."}))}),2e3);return()=>{clearInterval(k),C.current.forEach((A=>clearTimeout(A)))}}),[]),n.useEffect((()=>{if(l&&e&&b&&t){if(f?.legal.requireUsersAcceptTerms&&!t.hasAcceptedTerms){let g=setTimeout((()=>{o("AffirmativeConsentScreen")}),j);return()=>clearTimeout(g)}b&&(H(t,f.embeddedWallets)?C.current.push(setTimeout((()=>{m({createWallet:{onSuccess:()=>{},onFailure:g=>{console.error(g),E({eventName:"embedded_wallet_creation_failure_logout",payload:{error:g,screen:"FarcasterConnectStatusScreen"}}),u()},callAuthOnSuccessOnClose:!0}}),o("EmbeddedWalletOnAccountCreateScreen")}),j)):C.current.push(setTimeout((()=>a({shouldCallAuthOnSuccess:!0,isSuccess:!0})),j)))}}),[b,l,e,t]),r.jsx(ae,{connectUri:T,loading:S,success:b,errorMessage:h,onBack:c?p:void 0,onClose:a,onOpenFarcaster:()=>{T&&(window.location.href=T)}})}};let ie=s.div`
  margin-top: 24px;
`,oe=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`,se=s.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 275px;
`,ne=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`,le=s.div`
  font-size: 0.875rem;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,ce=s.div`
  position: relative;
  width: 82px;
  height: 82px;
`;export{Ce as FarcasterConnectStatusScreen,ae as FarcasterConnectStatusView,Ce as default};
