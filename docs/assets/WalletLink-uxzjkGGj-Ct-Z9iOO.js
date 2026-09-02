import{fm as g,gN as n,hx as j,g3 as o}from"./index-CHDG_EjL.js";import{l as $,i as a,n as d,c as h}from"./ethers-ComuOzvK-D5oJbUwL.js";import{r as k}from"./getFormattedUsdFromLamports-De3U9GlO-C446pzMl.js";import{t as y}from"./transaction-BNTP-bFm-CrebgH-D.js";const O=({weiQuantities:e,tokenPrice:r,tokenSymbol:s})=>{let i=a(e),t=r?d(i,r):void 0,l=h(i,s);return n.jsx(c,{children:t||l})},P=({weiQuantities:e,tokenPrice:r,tokenSymbol:s})=>{let i=a(e),t=r?d(i,r):void 0,l=h(i,s);return n.jsx(c,{children:t?n.jsxs(n.Fragment,{children:[n.jsx(S,{children:"USD"}),t==="<$0.01"?n.jsxs(p,{children:[n.jsx(x,{children:"<"}),"$0.01"]}):t]}):l})},D=({quantities:e,tokenPrice:r,tokenSymbol:s="SOL",tokenDecimals:i=9})=>{let t=e.reduce(((f,u)=>f+u),0n),l=r&&s==="SOL"&&i===9?k(t,r):void 0,m=s==="SOL"&&i===9?y(t):`${g(t,i)} ${s}`;return n.jsx(c,{children:l?n.jsx(n.Fragment,{children:l==="<$0.01"?n.jsxs(p,{children:[n.jsx(x,{children:"<"}),"$0.01"]}):l}):m})};let c=o.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,S=o.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,x=o.span`
  font-size: 10px;
`,p=o.span`
  display: flex;
  align-items: center;
`;function v(e,r){return`https://explorer.solana.com/account/${e}?chain=${r}`}const F=e=>n.jsx(w,{href:e.chainType==="ethereum"?$(e.chainId,e.walletAddress):v(e.walletAddress,e.chainId),target:"_blank",children:j(e.walletAddress)});let w=o.a`
  &:hover {
    text-decoration: underline;
  }
`;export{F as S,D as f,P as h,O as p};
