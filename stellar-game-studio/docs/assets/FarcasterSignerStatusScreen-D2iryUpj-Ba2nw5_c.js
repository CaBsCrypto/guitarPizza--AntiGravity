import{d7 as F,d8 as T,da as I,dc as c,dG as y,d9 as t,dI as x,dD as O,dC as o}from"./index-D8f71Q81.js";import{h as q}from"./CopyToClipboard-DSTf_eKU-D5dxNmvY.js";import{n as B}from"./OpenLink-DZHy38vr-C1k7fIO7.js";import{C as E}from"./QrCode-pKF9uy8S-SxOyDFM2.js";import{n as _}from"./ScreenLayout-rsaLrlHW-BCzUTjhd.js";import{l as h}from"./farcaster-DPlSjvF5-BumJzYtD.js";import"./browser-D-1cDpJS.js";import"./ModalHeader-CPVs-20G-C821Z3cO.js";import"./Screen-CkHwbpUl-BkQYmv8p.js";import"./index-Dq_xe9dz-BVKvBPZY.js";let k="#8a63d2";const M=({appName:d,loading:m,success:u,errorMessage:e,connectUri:a,onBack:r,onClose:l,onOpenFarcaster:s})=>t.jsx(_,x.isMobile||m?x.isIOS?{title:e?e.message:"Add a signer to Farcaster",subtitle:e?e.detail:`This will allow ${d} to add casts, likes, follows, and more on your behalf.`,icon:h,iconVariant:"loading",iconLoadingStatus:{success:u,fail:!!e},primaryCta:a&&s?{label:"Open Farcaster app",onClick:s}:void 0,onBack:r,onClose:l,watermark:!0}:{title:e?e.message:"Requesting signer from Farcaster",subtitle:e?e.detail:"This should only take a moment",icon:h,iconVariant:"loading",iconLoadingStatus:{success:u,fail:!!e},onBack:r,onClose:l,watermark:!0,children:a&&x.isMobile&&t.jsx(A,{children:t.jsx(B,{text:"Take me to Farcaster",url:a,color:k})})}:{title:"Add a signer to Farcaster",subtitle:`This will allow ${d} to add casts, likes, follows, and more on your behalf.`,onBack:r,onClose:l,watermark:!0,children:t.jsxs(R,{children:[t.jsx(D,{children:a?t.jsx(E,{url:a,size:275,squareLogoElement:h}):t.jsx(P,{children:t.jsx(O,{})})}),t.jsxs(L,{children:[t.jsx(N,{children:"Or copy this link and paste it into a phone browser to open the Farcaster app."}),a&&t.jsx(q,{text:a,itemName:"link",color:k})]})]})});let A=o.div`
  margin-top: 24px;
`,R=o.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`,D=o.div`
  padding: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 275px;
`,L=o.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`,N=o.div`
  font-size: 0.875rem;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,P=o.div`
  position: relative;
  width: 82px;
  height: 82px;
`;const Y={component:()=>{let{lastScreen:d,navigateBack:m,data:u}=F(),e=T(),{requestFarcasterSignerStatus:a,closePrivyModal:r}=I(),[l,s]=c.useState(void 0),[S,v]=c.useState(!1),[j,w]=c.useState(!1),g=c.useRef([]),n=u?.farcasterSigner;c.useEffect((()=>{let b=Date.now(),i=setInterval((async()=>{if(!n?.public_key)return clearInterval(i),void s({retryable:!0,message:"Connect failed",detail:"Something went wrong. Please try again."});n.status==="approved"&&(clearInterval(i),v(!1),w(!0),g.current.push(setTimeout((()=>r({shouldCallAuthOnSuccess:!1,isSuccess:!0})),y)));let p=await a(n?.public_key),C=Date.now()-b;p.status==="approved"?(clearInterval(i),v(!1),w(!0),g.current.push(setTimeout((()=>r({shouldCallAuthOnSuccess:!1,isSuccess:!0})),y))):C>3e5?(clearInterval(i),s({retryable:!0,message:"Connect failed",detail:"The request timed out. Try again."})):p.status==="revoked"&&(clearInterval(i),s({retryable:!0,message:"Request rejected",detail:"The request was rejected. Please try again."}))}),2e3);return()=>{clearInterval(i),g.current.forEach((p=>clearTimeout(p)))}}),[]);let f=n?.status==="pending_approval"?n.signer_approval_url:void 0;return t.jsx(M,{appName:e.name,loading:S,success:j,errorMessage:l,connectUri:f,onBack:d?m:void 0,onClose:r,onOpenFarcaster:()=>{f&&(window.location.href=f)}})}};export{Y as FarcasterSignerStatusScreen,M as FarcasterSignerStatusView,Y as default};
