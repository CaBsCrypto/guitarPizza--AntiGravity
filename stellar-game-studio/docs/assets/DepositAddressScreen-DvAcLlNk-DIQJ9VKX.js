import{d8 as ee,ge as W,gf as g,dd as p,da as e,gg as _,db as k,gh as A,dE as re,dD as m,gi as te,gj as se,dm as ne}from"./index-D1Ugr-Fq.js";import{i as E,l as q,t as Q,s as Y,y as H,c as F,n as oe,a as X,d as ie,Q as K,m as ae,g as w,p as T,f as N,v as $,u as j,h as S,b as U}from"./styles-C8na4eJO-CSFUg0Ui.js";import{n as v}from"./ScreenLayout-BZAQ9cdJ-CSMUFpUf.js";import{n as G}from"./styles-DVyDvTdj-LQ10uEig.js";import{b as le}from"./ModalFooter-FDXOM0ZR-CSi-Parx.js";import{x as de}from"./QrCode-RT6d3bP5-COGvumRZ.js";import{u as ce,a as ue,s as me,b as pe,c as fe,d as he,e as ge,f as ye,g as be,F as xe}from"./floating-ui.react-Dai6lFdV.js";import{p as _e}from"./CopyableText-CQapvaMr-aCfwp3F5.js";import"./browser-Baxqii8z.js";import{T as I}from"./triangle-alert-ClkCKbwE.js";import{c as O}from"./createLucideIcon-UoDc3ngV.js";import{C as R}from"./check-DG-nGAk7.js";import{H as Ce}from"./hourglass-xFgtk7CP.js";import{C as ve}from"./chevron-down-CEx8gW81.js";import{n as ke,o as Ee,p as we,s as Te}from"./floating-ui.react-dom-Bh1XYOYc.js";import"./Screen-C5Cvq4cJ-CiWNyibm.js";import"./index-Dq_xe9dz-DmZzPN46.js";import"./copy-Clym-y95.js";const Ne=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],je=O("chevron-up",Ne);const Se=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Ue=O("info",Se);const De=[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]],Ae=O("undo-2",De);class Ie extends p.Component{static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(t,n){this.props.onError(t)}componentDidUpdate(t){t.resetKey!==this.props.resetKey&&this.state.hasError&&this.setState({hasError:!1})}render(){return this.state.hasError?null:this.props.children}constructor(...t){super(...t),this.state={hasError:!1}}}function Oe(r,t,n){let s=Number(r);return!Number.isFinite(s)||s===0?`1 ${t} ≈ ${r} ${n}`:s>=.01?`1 ${t} ≈ ${L(s)} ${n}`:`${L(1/s)} ${t} ≈ 1 ${n}`}function L(r){return r>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(r)):r>=100?new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(r):r>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(r):new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(r)}function P(r,t){let n=Number(r);if(!Number.isFinite(n)||n===0)return r;let s=t!=null?n/10**t:n;return s>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(s):s>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(s):s>=1e-4?new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(s):new Intl.NumberFormat("en-US",{maximumSignificantDigits:4}).format(s)}function D({address:r,caip2:t,config:n}){for(let s of n.currencies){let i=s.chains.find((c=>c.caip2===t&&c.address.toLowerCase()===r.toLowerCase()));if(i)return{symbol:s.symbol.toUpperCase(),decimals:i.decimals}}return{symbol:r,decimals:void 0}}function M(r,t){return t[r]?.displayName??r}function B(r,t){return r.chains.filter((n=>n.can_be_relay_deposit_source===!0)).map((n=>{let s=t.chains[n.caip2];return s?{caip2:n.caip2,displayName:s.displayName,iconUrl:s.iconUrl,vmType:s.vmType,currencyAddress:n.address,currencyDecimals:n.decimals}:null})).filter((n=>n!==null))}function V(r,t){if(!r.chains[t.destinationChain])return`Unsupported destination chain: "${t.destinationChain}". Check that the chain is in CAIP-2 format (e.g. "eip155:8453") and is supported for deposit addresses.`;let n=t.destinationCurrency.toLowerCase();return r.currencies.some((s=>s.chains.some((i=>i.caip2===t.destinationChain&&i.address.toLowerCase()===n))))?null:`Unsupported destination currency "${t.destinationCurrency}" on chain "${t.destinationChain}". Check that this token address is supported on the specified chain.`}let Re=new Set(["ROUTE_UNAVAILABLE","UNEXPECTED_STATE","TIMEOUT_WAITING_FOR_NEXT_ORDER","TIMEOUT_ORDER_COMPLETION","DEPOSIT_FAILED","DEPOSIT_REFUNDED","USER_EXITED","AMOUNT_TOO_LOW","INSUFFICIENT_LIQUIDITY","UNSUPPORTED_CHAIN","UNSUPPORTED_CURRENCY","UNSUPPORTED_ROUTE","NO_SWAP_ROUTES_FOUND","NO_INTERNAL_SWAP_ROUTES_FOUND","NO_QUOTES","SANCTIONED_WALLET_ADDRESS","REFUND_WALLET_CREATION_FAILED","DEPOSIT_ADDRESSES_NOT_ENABLED","NOT_AUTHENTICATED"]);function Fe(r){return Re.has(r)}function z(r){return Fe(r)?r:"UNKNOWN_ERROR"}function J(){let{params:r,setModalState:t}=g(),{privy:n}=k(),s=(function(){let{privy:a,refreshSessionAndUser:u}=k();return p.useCallback(((d,o)=>o?Promise.resolve({ok:!0,address:o}):A.resolveRefundAddress({privy:a,caip2:d,onWalletCreated:u})),[a,u])})(),[i,c]=p.useState(!1);return{fetchQuote:p.useCallback((async(a,u,d)=>{if(r){c(!0);try{let o=await s(a.caip2,r.refundAddress);if(!o.ok)return void t({step:"error",code:z(o.error)});let l=await n.fetchPrivyRoute(te,{body:{source_chain:a.caip2,source_currency:a.currencyAddress,destination_chain:r.destinationChain,destination_currency:r.destinationCurrency,destination_address:r.destinationAddress,refund_address:o.address,...r.slippageBps!=null?{slippage_bps:r.slippageBps}:{}}});t({step:"address",selectedCurrency:u,selectedChain:a,availableChains:d,quote:l})}catch(o){let l=o instanceof Error?o:Error(String(o)),f="status"in l&&typeof l.status=="number"?l.status:void 0;t({step:"error",code:l instanceof se&&l.code==="feature_not_enabled"?"DEPOSIT_ADDRESSES_NOT_ENABLED":f&&f>=500?"UNKNOWN_ERROR":z(l.message),message:l.message})}finally{c(!1)}}}),[r,n,s,t]),isFetching:i}}function Z(r,t){switch(r.status){case"completed":return t({step:"complete",order:r});case"refunded":return t({step:"refunded",order:r});case"failed":return t({step:"failed",order:r});case"executing":return t({step:"processing",order:r});default:return}}const $e=({sourceAmount:r,sourceSymbol:t,sourceChainName:n,sourceDecimals:s,destinationAmount:i,destSymbol:c,destChainName:a,destDecimals:u,onClose:d})=>e.jsx(E,{icon:R,iconVariant:"success",title:"Transfer complete",subtitle:i?`Received ${P(r,s)} ${t} on ${n} and converted it to ${P(i,u)} ${c} on ${a}. Funds are available to use.`:`Your ${t} has been received and is now available in your wallet.`,showClose:!0,onClose:d,primaryCta:{label:"Done",onClick:d},watermark:!1});function Le(){let{state:r,configData:t,close:n}=_("complete"),{order:s}=r,{sourceSymbol:i,sourceChainName:c,sourceDecimals:a,destSymbol:u,destChainName:d,destDecimals:o}=p.useMemo((()=>{let l=D({address:s.source_currency,caip2:s.source_chain,config:t}),f=D({address:s.destination_currency,caip2:s.destination_chain,config:t});return{sourceSymbol:l.symbol,sourceChainName:M(s.source_chain,t.chains),sourceDecimals:l.decimals,destSymbol:f.symbol,destChainName:M(s.destination_chain,t.chains),destDecimals:f.decimals}}),[s,t]);return e.jsx($e,{sourceAmount:s.source_amount,sourceSymbol:i,sourceChainName:c,sourceDecimals:a,destinationAmount:s.destination_amount,destSymbol:u,destChainName:d,destDecimals:o,onClose:n})}function Pe(){let{modalState:r,setModalState:t,config:n,retryConfig:s,close:i,createDepositAddressEvent:c}=g();if(r.step!=="error")throw Error("UNEXPECTED_STATE");let{code:a}=r,{title:u,subtitle:d,detail:o,iconVariant:l}=(b=>{switch(b){case"AMOUNT_TOO_LOW":return{title:"Amount too low",subtitle:"The deposit amount is below the minimum for this route.",detail:"Try a larger amount or a different token.",iconVariant:"warning"};case"INSUFFICIENT_LIQUIDITY":return{title:"Insufficient liquidity",subtitle:"There isn't enough liquidity for this route right now.",detail:"Try a smaller amount or a different network.",iconVariant:"warning"};case"UNSUPPORTED_CHAIN":return{title:"Unsupported chain",subtitle:"Deposits from this chain type aren't supported yet. Try a different network.",iconVariant:"warning"};case"UNSUPPORTED_CURRENCY":case"UNSUPPORTED_ROUTE":case"ROUTE_UNAVAILABLE":case"NO_SWAP_ROUTES_FOUND":case"NO_INTERNAL_SWAP_ROUTES_FOUND":case"NO_QUOTES":return{title:"Route not available",subtitle:"This deposit route isn't supported right now. Try a different token or network.",iconVariant:"warning"};case"SANCTIONED_WALLET_ADDRESS":return{title:"Address restricted",subtitle:"This address cannot be used for deposits due to compliance restrictions.",iconVariant:"warning"};case"REFUND_WALLET_CREATION_FAILED":return{title:"Unable to set up refund address",subtitle:"We couldn't create a wallet to receive refunds on this chain. Please try again or select a different network.",iconVariant:"warning"};case"DEPOSIT_ADDRESSES_NOT_ENABLED":return{title:"Not enabled",subtitle:"Deposit addresses are not enabled for this app.",iconVariant:"warning"};case"NOT_AUTHENTICATED":return{title:"Not signed in",subtitle:"Please sign in to continue with your deposit.",iconVariant:"warning"};case"TIMEOUT_WAITING_FOR_NEXT_ORDER":case"TIMEOUT_ORDER_COMPLETION":return{title:"Taking longer than expected",subtitle:"Your funds are safe. The deposit is still being processed — check back later.",iconVariant:"subtle"};default:return{title:"Something went wrong",subtitle:"We couldn't complete your request. Please try again.",iconVariant:"subtle"}}})(a),[f,y]=p.useState(!1);return e.jsx(E,{icon:I,iconVariant:l,title:u,subtitle:o?`${d} ${o}`:d,showClose:!0,onClose:i,primaryCta:{label:"Try again",onClick:async()=>{if(c({eventName:"sdk_deposit_address_action",payload:{action:"retry",step:"error",errorCode:a}}),n.status!=="ready"){y(!0);try{await s(),t({step:"token"})}catch{y(!1)}}else t({step:"token"})},loading:f},watermark:!0})}function Me(){let{state:r,close:t,createDepositAddressEvent:n}=_("failed"),{order:s}=r;return e.jsx(v,{icon:I,iconVariant:"error",title:"Transfer failed",subtitle:"Something went wrong processing your transfer.",showClose:!0,onClose:t,primaryCta:{label:"Done",onClick:t},secondaryCta:{label:"Learn about manual recovery",onClick:()=>{n({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"recovery_docs"}}),window.open("https://docs.privy.io","_blank","noopener,noreferrer")}},watermark:!0,children:e.jsxs(Be,{href:s.tracking_url,target:"_blank",rel:"noopener noreferrer",onClick:()=>{n({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"relay_reference"}})},children:["Reference: ",s.provider_request_id]})})}let Be=m.a`
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.7;
  text-decoration: underline;
  cursor: pointer;
  color: var(--privy-color-foreground-3);
`;function Ve(){let{close:r,setModalState:t,config:n,params:s,onBack:i,createDepositAddressEvent:c}=g(),[a,u]=p.useState(!1);return p.useEffect((()=>{if(a&&s){if(n.status==="ready"){let d=V(n.data,s);t(d?{step:"error",code:"ROUTE_UNAVAILABLE",message:d}:{step:"token"})}n.status==="error"&&t({step:"error",code:"ROUTE_UNAVAILABLE"})}}),[a,n,s,t]),e.jsx(E,{icon:K,iconVariant:"subtle",title:"Add funds",subtitle:"Top up your account by sending crypto from any wallet. Conversion and routing handled by Relay.",showClose:!0,onClose:r,showBack:!!i,onBack:i?()=>{c({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"intro"}}),i()}:void 0,primaryCta:{label:"Continue",onClick:()=>{if(c({eventName:"sdk_deposit_address_action",payload:{action:"continue",step:"intro"}}),n.status==="ready"&&s){let d=V(n.data,s);t(d?{step:"error",code:"ROUTE_UNAVAILABLE",message:d}:{step:"token"})}else n.status==="error"?t({step:"error",code:"ROUTE_UNAVAILABLE"}):u(!0)},loading:a&&n.status==="loading",loadingText:null},watermark:!0})}function ze(){let{state:r,setModalState:t,close:n,createDepositAddressEvent:s}=_("network"),[i,c]=p.useState(-1),{availableChains:a}=r,{confirm:u,isFetching:d}=(function(){let o=W(),{params:l}=g(),{fetchQuote:f,isFetching:y}=J();return{confirm:p.useCallback((async b=>{if(!b||!l)return;let h=o?.modalState;h&&h.step==="network"&&await f(b,h.selectedCurrency,h.availableChains)}),[l,o,f]),isFetching:y}})();return e.jsx(v,{title:"Select network",eyebrow:e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"0.375rem"},children:[e.jsx("img",{src:r.selectedCurrency.logoURI,alt:"",style:{width:"1rem",height:"1rem",borderRadius:"50%"}}),"Send ",r.selectedCurrency.symbol]}),showBack:!0,onBack:()=>{s({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"network"}}),t({step:"token"})},showClose:!0,onClose:n,watermark:!0,children:e.jsx(G,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:a.map(((o,l)=>e.jsxs(q,{$selected:i===l,disabled:d,onClick:()=>{s({eventName:"sdk_deposit_address_action",payload:{action:"network_selected",step:"network",network:o.caip2}}),c(l),u(o)},children:[e.jsx(Q,{src:o.iconUrl,alt:o.displayName}),e.jsx(Y,{children:o.displayName}),d&&l===i&&e.jsx(H,{})]},o.caip2)))})})}const We=({trackingUrl:r,onViewBlockExplorer:t,onClose:n})=>e.jsx(v,{icon:Ce,iconVariant:"subtle",title:"Transfer in progress",subtitle:"Your deposit was received and the transfer is now processing.",showClose:!0,onClose:n,secondaryCta:{label:"View on block explorer ↗",onClick:()=>{t(),window.open(r,"_blank","noopener,noreferrer")}},watermark:!1,children:e.jsxs(ae,{children:[e.jsxs(w,{children:[e.jsx(T,{$status:"done",children:e.jsx(R,{size:14,color:"var(--privy-color-icon-success)",strokeWidth:2})}),e.jsx(N,{children:"Deposit received"})]}),e.jsx($,{}),e.jsxs(w,{children:[e.jsx(T,{$status:"active",children:e.jsx(qe,{})}),e.jsx(N,{children:"Bridging"})]}),e.jsx($,{}),e.jsxs(w,{children:[e.jsx(T,{$status:"pending"}),e.jsx(N,{children:"Funds arrived"})]})]})});let qe=m.span`
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid var(--privy-color-foreground-3);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;function Qe(){let{state:r,close:t,createDepositAddressEvent:n}=_("processing");return(function({orderId:s,enabled:i}){let{privy:c}=k(),{setModalState:a}=g();p.useEffect((()=>{let u=new AbortController;return A.waitForCompletion({privy:c,orderId:s,signal:u.signal}).then((d=>{u.signal.aborted||(d.status==="success"?Z(d.order,a):d.status==="timeout"&&a({step:"error",code:"TIMEOUT_ORDER_COMPLETION"}))})),()=>{u.abort()}}),[i,s,c,a])})({orderId:r.order.id,enabled:!0}),e.jsx(We,{trackingUrl:r.order.tracking_url,onViewBlockExplorer:()=>{n({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"processing",target:"block_explorer"}})},onClose:t})}function Ye(){let{state:r,close:t,createDepositAddressEvent:n}=_("refunded"),{order:s}=r;return e.jsx(E,{icon:Ae,iconVariant:"subtle",title:"Transfer refunded",subtitle:"Your transfer was received, but the swap couldn't be completed. A refund has been started automatically.",showClose:!0,onClose:t,primaryCta:{label:"Done",onClick:t},secondaryCta:{label:"View transaction details",onClick:()=>{n({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"refunded",target:"transaction_details"}}),window.open(s.tracking_url,"_blank","noopener,noreferrer")}},watermark:!0})}function He(){let{close:r,setModalState:t,config:n,createDepositAddressEvent:s}=g(),{confirm:i,currencies:c,isFetching:a}=(function(){let{config:o,setModalState:l}=g(),{fetchQuote:f,isFetching:y}=J(),b=o.status==="ready"?o.data.currencies.filter((h=>B(h,o.data).length>0)):[];return{confirm:p.useCallback((async h=>{if(o.status!=="ready"||!h)return;let x=B(h,o.data);if(x.length!==1)l({step:"network",selectedCurrency:h,availableChains:x});else{let C=x[0];await f(C,h,x)}}),[o,f,l]),currencies:b,isFetching:y}})(),[u,d]=p.useState(-1);return e.jsx(v,{title:"Select token",subtitle:"Choose the asset you'll send.",showBack:!0,onBack:()=>{s({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"token"}}),t({step:"intro"})},showClose:!0,onClose:r,watermark:!0,children:n.status==="error"?e.jsx(F,{children:e.jsx(oe,{children:"Failed to load tokens"})}):n.status==="loading"?e.jsx(F,{children:e.jsx(re,{})}):e.jsx(G,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:c.map(((o,l)=>e.jsxs(q,{$selected:u===l,disabled:a,onClick:()=>{s({eventName:"sdk_deposit_address_action",payload:{action:"token_selected",step:"token",token:o.symbol}}),d(l),i(o)},children:[e.jsx(X,{src:o.logoURI,alt:o.symbol}),e.jsx(Y,{children:o.name}),a&&l===u?e.jsx(H,{}):e.jsx(ie,{children:o.symbol})]},o.symbol)))})})}function Xe({address:r,onClick:t}){let[n,s]=p.useState(!1);return e.jsx(e.Fragment,{children:n?e.jsx(Ke,{onClick:()=>s(!1),style:{marginTop:"1.5rem"},children:e.jsx(de,{url:r,size:312,hideLogo:!0})}):e.jsxs(Ge,{title:"Click to copy address",onClick:t,style:{marginTop:"1.5rem"},children:[e.jsxs(Je,{children:[e.jsx(Ze,{children:"Deposit address"}),e.jsx(er,{children:r})]}),e.jsx(rr,{children:e.jsx(tr,{type:"button",onClick:i=>{i.stopPropagation(),s(!0)},children:e.jsx(K,{size:16,color:"var(--privy-color-icon-muted)"})})})]})})}let Ke=m.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
`,Ge=m.div`
  display: flex;
  border-radius: var(--privy-border-radius-md);
  background: var(--privy-color-background-clicked, #f1f2f9);
  padding: 1rem;
  cursor: pointer;
  gap: 0.5rem;
`,Je=m.div`
  flex: 1;
  min-width: 0;
  text-align: left;
`,Ze=m.div`
  font-size: 0.75rem;
  color: var(--privy-color-icon-muted);
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,er=m.div`
  word-break: break-all;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  font-weight: 500;
  line-height: 1.375rem;
  color: var(--privy-color-foreground);
`,rr=m.div`
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
`,tr=m.button`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    border-radius: var(--privy-border-radius-xs);

    &:hover {
      background: var(--privy-color-background);
    }

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`;function sr({quote:r,selectedCurrency:t,selectedChain:n,destinationSymbol:s}){let[i,c]=p.useState(!1),a=t.symbol.toUpperCase(),u=n.displayName,d=p.useRef(null);return e.jsxs(nr,{children:[e.jsxs(or,{onClick:p.useCallback((()=>{let o=document.getElementById("privy-modal-content");o&&(d.current&&clearTimeout(d.current),o.style.transition="none",d.current=setTimeout((()=>{o.style.transition="",d.current=null}),160)),c((l=>!l))}),[]),children:[e.jsxs(ir,{children:[t.logoURI&&e.jsx(X,{src:t.logoURI,alt:a,style:{width:"2rem",height:"2rem"}}),n.iconUrl&&e.jsx(ar,{src:n.iconUrl,alt:u})]}),e.jsxs(lr,{children:[e.jsx(dr,{children:"You send"}),e.jsxs(cr,{children:[a," on ",u]})]}),e.jsx(ur,{children:e.jsx(i?je:ve,{size:16})})]}),e.jsx(hr,{$expanded:i,children:e.jsx(gr,{children:e.jsxs(mr,{children:[r.indicative_rate&&e.jsxs(j,{children:[e.jsx(S,{children:"Conversion rate"}),e.jsxs(U,{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[Oe(r.indicative_rate,a,s.toUpperCase()),e.jsx(yr,{content:"Estimated rate based on current market conditions. Final execution price may vary depending on transfer size and routing."})]})]}),e.jsxs(j,{children:[e.jsx(S,{children:"Max slippage"}),e.jsxs(U,{children:[(r.slippage_bps/100).toFixed(1),"%"]})]}),e.jsxs(j,{children:[e.jsx(S,{children:"Refund address"}),e.jsx(U,{children:e.jsx(_e,{value:r.refund_address,iconOnly:!0,iconSize:11,children:ne(r.refund_address,4,4)})})]})]})})}),e.jsxs(pr,{children:[e.jsx(I,{size:16,color:"var(--privy-color-icon-muted)",style:{flexShrink:0}}),e.jsxs(fr,{children:["Only send ",e.jsx("strong",{children:a})," on ",e.jsx("strong",{children:u}),". Other assets may be lost."]})]})]})}let nr=m.div`
  border-radius: var(--privy-border-radius-md);
  border: 1px solid var(--privy-color-foreground-4);
  overflow: hidden;
`,or=m.button`
  && {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--privy-color-foreground);
    outline: none;
    box-shadow: none;

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`,ir=m.span`
  position: relative;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
`,ar=m(Q)`
  && {
    position: absolute;
    top: -0.125rem;
    right: -0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    box-sizing: content-box;
    border: 1.5px solid #fff;
    background-color: #fff;
  }
`,lr=m.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,dr=m.span`
  font-size: 0.75rem;
  color: var(--privy-color-foreground-3);
  line-height: 1rem;
`,cr=m.span`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`,ur=m.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-clicked, #f1f2f9);
  color: var(--privy-color-foreground-3);
`,mr=m.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0.75rem;

  & > * {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--privy-color-foreground-4);
  }

  & > *:last-child {
    border-bottom: none;
  }
`,pr=m.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.75rem 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--privy-border-radius-sm);
  background: #f8f9fc;
`,fr=m.span`
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-icon-muted);
  text-align: left;
`,hr=m.div`
  display: grid;
  grid-template-rows: ${({$expanded:r})=>r?"1fr":"0fr"};
  transition: grid-template-rows 150ms ease-out;
`,gr=m.div`
  overflow: hidden;
`;function yr({content:r}){let[t,n]=p.useState(!1),{refs:s,floatingStyles:i,context:c}=ce({open:t,onOpenChange:n,placement:"top",whileElementsMounted:ke,middleware:[Ee(6),we(),Te({padding:8})]}),a=ue(c,{move:!1,handleClose:me()}),u=pe(c),{getReferenceProps:d,getFloatingProps:o}=fe([a,u,he(c),ge(c),ye(c,{role:"tooltip"})]),{isMounted:l,styles:f}=be(c,{duration:150});return e.jsxs(e.Fragment,{children:[e.jsx("button",{ref:s.setReference,type:"button","aria-label":"More information about conversion rate",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:"none",background:"none",color:"var(--privy-color-icon-muted)",cursor:"pointer"},...d(),children:e.jsx(Ue,{size:14})}),l&&e.jsx(xe,{root:document.getElementById("privy-modal-content")??void 0,children:e.jsx(br,{ref:s.setFloating,style:{...i,...f},...o(),children:r})})]})}let br=m.div`
  max-width: 13rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--privy-border-radius-sm, 0.375rem);
  background: var(--privy-color-foreground);
  color: var(--privy-color-background);
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 400;
  text-align: left;
  z-index: 10;
`;const xr=({quote:r,selectedCurrency:t,selectedChain:n,destinationSymbol:s,onBack:i,onClose:c})=>{let[a,u]=p.useState(!1),d=t?.symbol?.toUpperCase()??"funds",o=n?.displayName??"",l=async()=>{a||(await navigator.clipboard.writeText(r.deposit_address),u(!0),setTimeout((()=>u(!1)),2e3))};return e.jsxs(v,{title:`Send ${d}${o?` on ${o}`:""}`,subtitle:"Send funds to the address below. Conversion and routing handled by Relay.",showBack:!0,onBack:i,showClose:!0,onClose:c,watermark:!1,children:[e.jsx(sr,{quote:r,selectedCurrency:t,selectedChain:n,destinationSymbol:s}),e.jsx(Xe,{address:r.deposit_address,onClick:l}),e.jsx(le,{style:{marginTop:"1rem",marginBottom:"0.5rem",...a?{backgroundColor:"var(--privy-color-icon-success)",borderColor:"var(--privy-color-icon-success)"}:{}},onClick:l,children:a?e.jsxs(e.Fragment,{children:["Copied ",e.jsx(R,{size:16,style:{marginLeft:"0.25rem"}})]}):"Copy address"}),e.jsx(_r,{children:"Routing and bridging are handled by Relay. Privy does not control execution timing, liquidity, or transaction outcomes."})]})};let _r=m.p`
  && {
    margin: 0.5rem 0 0;
    font-size: 0.6875rem;
    line-height: 1.125rem;
    color: var(--privy-color-icon-muted);
    text-align: center;
  }
`;function Cr(){let{state:r,configData:t,setModalState:n,close:s,params:i,createDepositAddressEvent:c}=_("address"),{quote:a,selectedCurrency:u,selectedChain:d,availableChains:o}=r;return(function({depositAddressId:l,enabled:f,quoteCreatedAt:y}){let{privy:b}=k(),{setModalState:h}=g();p.useEffect((()=>{if(!l)return;let x=new AbortController;return A.waitForDeposit({privy:b,depositAddressId:l,quoteCreatedAt:y,signal:x.signal}).then((C=>{x.signal.aborted||(C.status==="success"?Z(C.order,h):C.status==="timeout"&&h({step:"error",code:"TIMEOUT_WAITING_FOR_NEXT_ORDER"}))})),()=>{x.abort()}}),[f,l,b,y,h])})({depositAddressId:a.id,enabled:!0,quoteCreatedAt:a.created_at}),e.jsx(xr,{quote:a,selectedCurrency:u,selectedChain:d,destinationSymbol:p.useMemo((()=>D({address:i.destinationCurrency,caip2:i.destinationChain,config:t}).symbol),[i,t]),onBack:()=>{c({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"address"}}),n({step:"network",selectedCurrency:u,availableChains:o})},onClose:s})}function vr(){let{modalState:r,setModalState:t}=g();return e.jsx(Ie,{onError:n=>t({step:"error",code:"UNEXPECTED_STATE",message:n.message}),resetKey:r.step,children:e.jsx(kr,{})})}function kr(){let{modalState:r}=g();switch(r.step){case"intro":return e.jsx(Ve,{});case"token":return e.jsx(He,{});case"network":return e.jsx(ze,{});case"address":return e.jsx(Cr,{});case"processing":return e.jsx(Qe,{});case"complete":return e.jsx(Le,{});case"refunded":return e.jsx(Ye,{});case"failed":return e.jsx(Me,{});case"error":return e.jsx(Pe,{});default:return null}}var Vr={component:()=>{let{onUserCloseViaDialogOrKeybindRef:r}=ee(),t=W(),{close:n,config:s}=g();return p.useEffect((()=>{r.current=n}),[r,n]),p.useEffect((()=>{if(s.status==="ready"){for(let i of s.data.currencies)new Image().src=i.logoURI;for(let i of Object.values(s.data.chains))new Image().src=i.iconUrl}}),[s]),t?e.jsx(vr,{}):null}};export{Vr as default};
