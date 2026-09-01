import{dc as d,d8 as z,en as E,eq as c,er as T,es as U,et as q,eu as L,d9 as t,ev as s,dC as m,ew as R}from"./index-Co0ls6JD.js";import{V as B,m as D}from"./ModalHeader-CPVs-20G-CPzEcSCD.js";import{n as I}from"./Chip-D2-wZOHJ-Bzg2fFFR.js";const K=({value:e,onChange:u})=>t.jsx("select",{value:e,onChange:u,children:R.map((i=>t.jsxs("option",{value:i.code,children:[i.code," +",i.callCode]},i.code)))}),Z=d.forwardRef(((e,u)=>{let i=z(),[y,C]=d.useState(!1),{accountType:k}=E(),[a,h]=d.useState(""),[r,j]=d.useState(e.defaultCountry??i?.intl.defaultCountry??"US"),S=c(a,r),g=T(r),N=U(r),V=q(r),x=!S,[b,f]=d.useState(!1),P=V.length,v=o=>{let n=o.target.value;j(n),h(""),e.onChange&&e.onChange({rawPhoneNumber:a,qualifiedPhoneNumber:s(a,n),countryCode:n,isValid:c(a,r)})},w=(o,n)=>{try{let l=o.replace(/\D/g,"")===a.replace(/\D/g,"")?o:g.input(o);h(l),e.onChange&&e.onChange({rawPhoneNumber:l,qualifiedPhoneNumber:s(o,n),countryCode:n,isValid:c(o,n)})}catch(l){console.error("Error processing phone number:",l)}},p=()=>{f(!0);let o=s(a,r);e.onSubmit({rawPhoneNumber:a,qualifiedPhoneNumber:o,countryCode:r,isValid:c(a,r)}).finally((()=>f(!1)))};return d.useEffect((()=>{if(e.defaultValue){let o=L(e.defaultValue);g.reset(),v({target:{value:o.countryCode}}),w(o.phone,o.countryCode)}}),[e.defaultValue]),t.jsxs(t.Fragment,{children:[t.jsx(F,{children:t.jsxs(G,{$callingCodeLength:P,$stacked:e.stacked,children:[t.jsx(K,{value:r,onChange:v}),t.jsx("input",{ref:u,id:"phone-number-input",className:"login-method-button",type:"tel",placeholder:N,onFocus:()=>C(!0),onChange:o=>{w(o.target.value,r)},onKeyUp:o=>{o.key==="Enter"&&p()},value:a,autoComplete:"tel"}),k!=="phone"||y||e.hideRecent?e.stacked||e.noIncludeSubmitButton?t.jsx("span",{}):t.jsx(B,{isSubmitting:b,onClick:p,disabled:x,children:"Submit"}):t.jsx(I,{color:"gray",children:"Recent"})]})}),e.stacked&&!e.noIncludeSubmitButton?t.jsx(D,{loading:b,loadingText:null,onClick:p,disabled:x,children:"Submit"}):null]})}));let F=m.div`
  width: 100%;
`,G=m.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${e=>e.$callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${e=>e.$callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${e=>e.$callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    color: var(--privy-color-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: calc(100% - var(--country-code-dropdown-width));

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    padding-right: ${e=>e.$stacked?"16px":"88px"};
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > :last-child {
    right: 16px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  && > button:last-child {
    right: 0px;
    line-height: 24px;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`;export{Z as w};
