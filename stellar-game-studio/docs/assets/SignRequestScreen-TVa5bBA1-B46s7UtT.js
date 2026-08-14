import{fq as A,fA as N,es as k,gK as o,bq as M,bJ as b,bi as E,fU as w,fp as t,et as q,eN as p,fg as O,f0 as $,cN as z}from"./index-BR4Qfvo1.js";import{h as I}from"./CopyToClipboard-DSTf_eKU-DezbgzNl.js";import{a as P}from"./Layouts-BlFm53ED-WIa4XOzm.js";import{a as F,i as J}from"./JsonTree-aPaJmPx7-DZxx2hnD.js";import{n as V}from"./ScreenLayout-DXc2tOGB-7ArMG6DQ.js";import{c as H}from"./createLucideIcon-D4oxk5XH.js";import"./ModalHeader-BEW0Qv0H-BWCcJsDR.js";import"./Screen-BpvoV6mG-CPkobwQX.js";import"./index-Dq_xe9dz-CHcRlSQu.js";const K=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],Q=H("square-pen",K),W=p.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let B=e=>{if(!O(e))return e;try{let a=$(e);return a.includes("�")?e:a}catch{return e}},G=e=>{try{let a=z.decode(e),s=new TextDecoder().decode(a);return s.includes("�")?e:s}catch{return e}},X=e=>{let{types:a,primaryType:s,...l}=e.typedData;return t.jsxs(t.Fragment,{children:[t.jsx(te,{data:l}),t.jsx(I,{text:(i=e.typedData,JSON.stringify(i,null,2)),itemName:"full payload to clipboard"})," "]});var i};const Y=({method:e,messageData:a,copy:s,iconUrl:l,isLoading:i,success:g,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:f,onClose:u})=>t.jsx(V,{title:s.title,subtitle:s.description,showClose:!0,onClose:u,icon:Q,iconVariant:"subtle",helpText:x?t.jsx(ee,{children:x}):void 0,primaryCta:{label:s.buttonText,onClick:c,disabled:i||g||m,loading:i},secondaryCta:d?{label:"Not now",onClick:f,disabled:i||g||m}:void 0,watermark:!0,children:t.jsxs(P,{children:[l?t.jsx(W,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,t.jsxs(Z,{children:[e==="personal_sign"&&t.jsx(T,{children:B(a)}),e==="eth_signTypedData_v4"&&t.jsx(X,{typedData:a}),e==="solana_signMessage"&&t.jsx(T,{children:G(a)})]})]})}),ue={component:()=>{let{authenticated:e}=A(),{initializeWalletProxy:a,closePrivyModal:s}=N(),{navigate:l,data:i,onUserCloseViaDialogOrKeybindRef:g}=k(),[m,x]=o.useState(!0),[d,c]=o.useState(""),[f,u]=o.useState(),[y,C]=o.useState(null),[_,S]=o.useState(!1);o.useEffect((()=>{e||l("LandingScreen")}),[e]),o.useEffect((()=>{a(M).then((n=>{x(!1),n||(c("An error has occurred, please try again."),u(new b(new E(d,w.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))}))}),[]);let{method:R,data:j,confirmAndSign:v,onSuccess:D,onFailure:U,uiOptions:r}=i.signMessage,L={title:r?.title||"Sign message",description:r?.description||"Signing this message will not cost you any fees.",buttonText:r?.buttonText||"Sign and continue"},h=n=>{n?D(n):U(f||new b(new E("The user rejected the request.",w.E4001_USER_REJECTED_REQUEST.eipCode))),s({shouldCallAuthOnSuccess:!1}),setTimeout((()=>{C(null),c(""),u(void 0)}),200)};return g.current=()=>{h(y)},t.jsx(Y,{method:R,messageData:j,copy:L,iconUrl:r?.iconUrl&&typeof r.iconUrl=="string"?r.iconUrl:void 0,isLoading:_,success:y!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:r?.isCancellable,onSign:async()=>{S(!0),c("");try{let n=await v();C(n),S(!1),setTimeout((()=>{h(n)}),q)}catch(n){console.error(n),c("An error has occurred, please try again."),u(new b(new E(d,w.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(y)})}};let Z=p.div`
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
`,T=p(J)`
  margin-top: 0;
`;export{ue as SignRequestScreen,Y as SignRequestView,ue as default};
