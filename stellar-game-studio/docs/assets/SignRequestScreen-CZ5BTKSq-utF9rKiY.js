import{dK as A,da as N,d7 as k,dc as o,fu as M,dQ as E,eW as b,eX as C,d9 as t,dG as O,dC as p,dU as z,fv as I,fw as q}from"./index-Co0ls6JD.js";import{h as P}from"./CopyToClipboard-DSTf_eKU-iv8pkxk0.js";import{a as F}from"./Layouts-BlFm53ED-Bi9GCm3y.js";import{a as $,i as V}from"./JsonTree-aPaJmPx7-H0JEaKf6.js";import{n as H}from"./ScreenLayout-rsaLrlHW-B3sE_0Wv.js";import{c as J}from"./createLucideIcon-Ch5wk6xy.js";import"./ModalHeader-CPVs-20G-CPzEcSCD.js";import"./Screen-CkHwbpUl-DrUSzWVc.js";import"./index-Dq_xe9dz-BbMzJkb1.js";const K=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],Q=J("square-pen",K),W=p.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let G=e=>{if(!z(e))return e;try{let a=I(e);return a.includes("�")?e:a}catch{return e}},X=e=>{try{let a=q.decode(e),s=new TextDecoder().decode(a);return s.includes("�")?e:s}catch{return e}},B=e=>{let{types:a,primaryType:s,...l}=e.typedData;return t.jsxs(t.Fragment,{children:[t.jsx(te,{data:l}),t.jsx(P,{text:(n=e.typedData,JSON.stringify(n,null,2)),itemName:"full payload to clipboard"})," "]});var n};const Y=({method:e,messageData:a,copy:s,iconUrl:l,isLoading:n,success:g,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:y,onClose:u})=>t.jsx(H,{title:s.title,subtitle:s.description,showClose:!0,onClose:u,icon:Q,iconVariant:"subtle",helpText:x?t.jsx(ee,{children:x}):void 0,primaryCta:{label:s.buttonText,onClick:c,disabled:n||g||m,loading:n},secondaryCta:d?{label:"Not now",onClick:y,disabled:n||g||m}:void 0,watermark:!0,children:t.jsxs(F,{children:[l?t.jsx(W,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,t.jsxs(Z,{children:[e==="personal_sign"&&t.jsx(T,{children:G(a)}),e==="eth_signTypedData_v4"&&t.jsx(B,{typedData:a}),e==="solana_signMessage"&&t.jsx(T,{children:X(a)})]})]})}),ue={component:()=>{let{authenticated:e}=A(),{initializeWalletProxy:a,closePrivyModal:s}=N(),{navigate:l,data:n,onUserCloseViaDialogOrKeybindRef:g}=k(),[m,x]=o.useState(!0),[d,c]=o.useState(""),[y,u]=o.useState(),[f,w]=o.useState(null),[_,S]=o.useState(!1);o.useEffect((()=>{e||l("LandingScreen")}),[e]),o.useEffect((()=>{a(M).then((i=>{x(!1),i||(c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))}))}),[]);let{method:R,data:j,confirmAndSign:v,onSuccess:D,onFailure:U,uiOptions:r}=n.signMessage,L={title:r?.title||"Sign message",description:r?.description||"Signing this message will not cost you any fees.",buttonText:r?.buttonText||"Sign and continue"},h=i=>{i?D(i):U(y||new E(new b("The user rejected the request.",C.E4001_USER_REJECTED_REQUEST.eipCode))),s({shouldCallAuthOnSuccess:!1}),setTimeout((()=>{w(null),c(""),u(void 0)}),200)};return g.current=()=>{h(f)},t.jsx(Y,{method:R,messageData:j,copy:L,iconUrl:r?.iconUrl&&typeof r.iconUrl=="string"?r.iconUrl:void 0,isLoading:_,success:f!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:r?.isCancellable,onSign:async()=>{S(!0),c("");try{let i=await v();w(i),S(!1),setTimeout((()=>{h(i)}),O)}catch(i){console.error(i),c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(f)})}};let Z=p.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ee=p.p`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-error-dark);
    font-size: 14px;
    line-height: 22px;
  }
`,te=p($)`
  margin-top: 0;
`,T=p(V)`
  margin-top: 0;
`;export{ue as SignRequestScreen,Y as SignRequestView,ue as default};
