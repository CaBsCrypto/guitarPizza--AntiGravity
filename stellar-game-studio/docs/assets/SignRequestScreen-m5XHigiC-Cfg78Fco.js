import{dL as A,db as M,d8 as k,dd as r,fv as N,dR as E,eX as C,eY as b,da as t,dH as O,dD as p,dV as z,fw as I,fx as q}from"./index-BaKN6Yt3.js";import{h as P}from"./CopyToClipboard-DSTf_eKU-DmVXhySM.js";import{a as $}from"./Layouts-BlFm53ED-ChDCh8g8.js";import{a as F,i as V}from"./JsonTree-aPaJmPx7-DekJ2VAG.js";import{n as H}from"./ScreenLayout-BZAQ9cdJ-BXl8n-P1.js";import{c as J}from"./createLucideIcon-CwiPfTuJ.js";import"./ModalFooter-FDXOM0ZR-D7A18QWp.js";import"./Screen-C5Cvq4cJ-ChZVFugk.js";import"./index-Dq_xe9dz-B-RBP7cT.js";const K=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],Q=J("square-pen",K),W=p.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let X=e=>{if(!z(e))return e;try{let a=I(e);return a.includes("�")?e:a}catch{return e}},Y=e=>{try{let a=q.decode(e),s=new TextDecoder().decode(a);return s.includes("�")?e:s}catch{return e}},B=e=>{let{types:a,primaryType:s,...l}=e.typedData;return t.jsxs(t.Fragment,{children:[t.jsx(te,{data:l}),t.jsx(P,{text:(n=e.typedData,JSON.stringify(n,null,2)),itemName:"full payload to clipboard"})," "]});var n};const G=({method:e,messageData:a,copy:s,iconUrl:l,isLoading:n,success:g,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:y,onClose:u})=>t.jsx(H,{title:s.title,subtitle:s.description,showClose:!0,onClose:u,icon:Q,iconVariant:"subtle",helpText:x?t.jsx(ee,{children:x}):void 0,primaryCta:{label:s.buttonText,onClick:c,disabled:n||g||m,loading:n},secondaryCta:d?{label:"Not now",onClick:y,disabled:n||g||m}:void 0,watermark:!0,children:t.jsxs($,{children:[l?t.jsx(W,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,t.jsxs(Z,{children:[e==="personal_sign"&&t.jsx(T,{children:X(a)}),e==="eth_signTypedData_v4"&&t.jsx(B,{typedData:a}),e==="solana_signMessage"&&t.jsx(T,{children:Y(a)})]})]})}),ue={component:()=>{let{authenticated:e}=A(),{initializeWalletProxy:a,closePrivyModal:s}=M(),{navigate:l,data:n,onUserCloseViaDialogOrKeybindRef:g}=k(),[m,x]=r.useState(!0),[d,c]=r.useState(""),[y,u]=r.useState(),[f,w]=r.useState(null),[R,S]=r.useState(!1);r.useEffect((()=>{e||l("LandingScreen")}),[e]),r.useEffect((()=>{a(N).then((i=>{x(!1),i||(c("An error has occurred, please try again."),u(new E(new C(d,b.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))}))}),[]);let{method:v,data:_,confirmAndSign:j,onSuccess:D,onFailure:L,uiOptions:o}=n.signMessage,U={title:o?.title||"Sign message",description:o?.description||"Signing this message will not cost you any fees.",buttonText:o?.buttonText||"Sign and continue"},h=i=>{i?D(i):L(y||new E(new C("The user rejected the request.",b.E4001_USER_REJECTED_REQUEST.eipCode))),s({shouldCallAuthOnSuccess:!1}),setTimeout((()=>{w(null),c(""),u(void 0)}),200)};return g.current=()=>{h(f)},t.jsx(G,{method:v,messageData:_,copy:U,iconUrl:o?.iconUrl&&typeof o.iconUrl=="string"?o.iconUrl:void 0,isLoading:R,success:f!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:o?.isCancellable,onSign:async()=>{S(!0),c("");try{let i=await j();w(i),S(!1),setTimeout((()=>{h(i)}),O)}catch(i){console.error(i),c("An error has occurred, please try again."),u(new E(new C(d,b.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(f)})}};let Z=p.div`
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
`,te=p(F)`
  margin-top: 0;
`,T=p(V)`
  margin-top: 0;
`;export{ue as SignRequestScreen,G as SignRequestView,ue as default};
