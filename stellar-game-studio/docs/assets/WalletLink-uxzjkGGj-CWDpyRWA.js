import{dr as j,da as n,dm as g,dD as o}from"./index-D1Ugr-Fq.js";import{l as $,i as c,n as d,c as h}from"./ethers-ComuOzvK-CseI0NeJ.js";import{r as k}from"./getFormattedUsdFromLamports-De3U9GlO-C446pzMl.js";import{t as y}from"./transaction-BNTP-bFm-CrebgH-D.js";const L=({weiQuantities:e,tokenPrice:r,tokenSymbol:s})=>{let i=c(e),t=r?d(i,r):void 0,l=h(i,s);return n.jsx(a,{children:t||l})},O=({weiQuantities:e,tokenPrice:r,tokenSymbol:s})=>{let i=c(e),t=r?d(i,r):void 0,l=h(i,s);return n.jsx(a,{children:t?n.jsxs(n.Fragment,{children:[n.jsx(S,{children:"USD"}),t==="<$0.01"?n.jsxs(x,{children:[n.jsx(p,{children:"<"}),"$0.01"]}):t]}):l})},P=({quantities:e,tokenPrice:r,tokenSymbol:s="SOL",tokenDecimals:i=9})=>{let t=e.reduce(((u,f)=>u+f),0n),l=r&&s==="SOL"&&i===9?k(t,r):void 0,m=s==="SOL"&&i===9?y(t):`${j(t,i)} ${s}`;return n.jsx(a,{children:l?n.jsx(n.Fragment,{children:l==="<$0.01"?n.jsxs(x,{children:[n.jsx(p,{children:"<"}),"$0.01"]}):l}):m})};let a=o.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,S=o.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,p=o.span`
  font-size: 10px;
`,x=o.span`
  display: flex;
  align-items: center;
`;function v(e,r){return`https://explorer.solana.com/account/${e}?chain=${r}`}const F=e=>n.jsx(w,{href:e.chainType==="ethereum"?$(e.chainId,e.walletAddress):v(e.walletAddress,e.chainId),target:"_blank",children:g(e.walletAddress)});let w=o.a`
  &:hover {
    text-decoration: underline;
  }
`;export{F as S,P as f,O as h,L as p};
