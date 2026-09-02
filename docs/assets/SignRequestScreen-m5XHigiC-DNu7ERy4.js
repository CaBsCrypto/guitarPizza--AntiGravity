import{gO as A,gX as M,fq as N,im as r,bI as O,he as E,R as b,bH as C,gN as t,fr as k,g3 as g,gF as I,gj as q,dv as z}from"./index-wQ7HOzQP.js";import{h as F}from"./CopyToClipboard-DSTf_eKU-BYIU5jgr.js";import{a as P}from"./Layouts-BlFm53ED-crhC9tfi.js";import{a as $,i as H}from"./JsonTree-aPaJmPx7-47cYk-bh.js";import{n as V}from"./ScreenLayout-BZAQ9cdJ-BszaMqpu.js";import{c as J}from"./createLucideIcon-CIiA81bN.js";import"./ModalFooter-FDXOM0ZR-CEYEVJyA.js";import"./Screen-C5Cvq4cJ-WKuod5_c.js";import"./index-Dq_xe9dz-BqhZDR3e.js";const K=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],Q=J("square-pen",K),W=g.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let X=e=>{if(!I(e))return e;try{let a=q(e);return a.includes("�")?e:a}catch{return e}},B=e=>{try{let a=z.decode(e),s=new TextDecoder().decode(a);return s.includes("�")?e:s}catch{return e}},G=e=>{let{types:a,primaryType:s,...l}=e.typedData;return t.jsxs(t.Fragment,{children:[t.jsx(te,{data:l}),t.jsx(F,{text:(n=e.typedData,JSON.stringify(n,null,2)),itemName:"full payload to clipboard"})," "]});var n};const Y=({method:e,messageData:a,copy:s,iconUrl:l,isLoading:n,success:p,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:y,onClose:u})=>t.jsx(V,{title:s.title,subtitle:s.description,showClose:!0,onClose:u,icon:Q,iconVariant:"subtle",helpText:x?t.jsx(ee,{children:x}):void 0,primaryCta:{label:s.buttonText,onClick:c,disabled:n||p||m,loading:n},secondaryCta:d?{label:"Not now",onClick:y,disabled:n||p||m}:void 0,watermark:!0,children:t.jsxs(P,{children:[l?t.jsx(W,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,t.jsxs(Z,{children:[e==="personal_sign"&&t.jsx(w,{children:X(a)}),e==="eth_signTypedData_v4"&&t.jsx(G,{typedData:a}),e==="solana_signMessage"&&t.jsx(w,{children:B(a)})]})]})}),ue={component:()=>{let{authenticated:e}=A(),{initializeWalletProxy:a,closePrivyModal:s}=M(),{navigate:l,data:n,onUserCloseViaDialogOrKeybindRef:p}=N(),[m,x]=r.useState(!0),[d,c]=r.useState(""),[y,u]=r.useState(),[f,T]=r.useState(null),[R,S]=r.useState(!1);r.useEffect((()=>{e||l("LandingScreen")}),[e]),r.useEffect((()=>{a(O).then((i=>{x(!1),i||(c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))}))}),[]);let{method:v,data:_,confirmAndSign:j,onSuccess:D,onFailure:L,uiOptions:o}=n.signMessage,U={title:o?.title||"Sign message",description:o?.description||"Signing this message will not cost you any fees.",buttonText:o?.buttonText||"Sign and continue"},h=i=>{i?D(i):L(y||new E(new b("The user rejected the request.",C.E4001_USER_REJECTED_REQUEST.eipCode))),s({shouldCallAuthOnSuccess:!1}),setTimeout((()=>{T(null),c(""),u(void 0)}),200)};return p.current=()=>{h(f)},t.jsx(Y,{method:v,messageData:_,copy:U,iconUrl:o?.iconUrl&&typeof o.iconUrl=="string"?o.iconUrl:void 0,isLoading:R,success:f!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:o?.isCancellable,onSign:async()=>{S(!0),c("");try{let i=await j();T(i),S(!1),setTimeout((()=>{h(i)}),k)}catch(i){console.error(i),c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(f)})}};let Z=g.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ee=g.p`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-error-dark);
    font-size: 14px;
    line-height: 22px;
  }
`,te=g($)`
  margin-top: 0;
`,w=g(H)`
  margin-top: 0;
`;export{ue as SignRequestScreen,Y as SignRequestView,ue as default};
