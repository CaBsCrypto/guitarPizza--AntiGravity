const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/features-BHoQ7UAq.js","assets/vendor-viem-Cgtp5ekC.js","assets/vendor-privy-uOEXquY0.js","assets/basic-NAOEwdJw.js","assets/index-6T1xdCbh.js","assets/w3m-modal-BDhOjW1y.js"])))=>i.map(i=>d[i]);
import { J as Td, _ as _i, E as ei, ah as Bu, G as nc, V as ti, ax as rc } from "./vendor-viem-Cgtp5ekC.js";
import { W as Fu, y as ju, $ as Fo, I as er, f as Wu, v as Dt, a4 as yt, g as W, h as _s, C as qu, n as Hu, j as Ir, a1 as jo, e as tr, m as Vu, o as Ku, c as zu, d as Gu, p as vn, A as Yu, z as Ju, t as ts, U as sr, N as Ta, q as Xu, D as ka, F as Oa, u as Pr, a6 as Pa, P as ic, a as Zu, b as Qu, Z as oc, x as dn, s as kd, H as ps, B as es, S as ks, r as Od, __tla as __tla_0 } from "./vendor-privy-uOEXquY0.js";
let gI, He, xa, Mn, bI, Zn, Ou, ni, Ye, jd, Lt, Ii, Hs, ue, Pd, _, it, wI, te, ns, It, Oe, yI, Cs, Je, Xe, Na, T1, vt, Bt, ee, yn, Ut, Bd, se, p, H, L, vi, S, me, ZA, J, Ks, le, cp, X, Q, rs, $, Xp, vr, fI, CI, mI;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    var ac = {};
    let Rd;
    S = {
        WC_NAME_SUFFIX: ".reown.id",
        WC_NAME_SUFFIX_LEGACY: ".wcn.id",
        BLOCKCHAIN_API_RPC_URL: "https://rpc.walletconnect.org",
        PULSE_API_URL: "https://pulse.walletconnect.org",
        W3M_API_URL: "https://api.web3modal.org",
        CONNECTOR_ID: {
            WALLET_CONNECT: "walletConnect",
            INJECTED: "injected",
            WALLET_STANDARD: "announced",
            COINBASE: "coinbaseWallet",
            COINBASE_SDK: "coinbaseWalletSDK",
            SAFE: "safe",
            LEDGER: "ledger",
            OKX: "okx",
            EIP6963: "eip6963",
            AUTH: "ID_AUTH"
        },
        CONNECTOR_NAMES: {
            AUTH: "Auth"
        },
        AUTH_CONNECTOR_SUPPORTED_CHAINS: [
            "eip155",
            "solana"
        ],
        LIMITS: {
            PENDING_TRANSACTIONS: 99
        },
        CHAIN: {
            EVM: "eip155",
            SOLANA: "solana",
            POLKADOT: "polkadot",
            BITCOIN: "bip122"
        },
        CHAIN_NAME_MAP: {
            eip155: "EVM Networks",
            solana: "Solana",
            polkadot: "Polkadot",
            bip122: "Bitcoin",
            cosmos: "Cosmos",
            sui: "Sui",
            stacks: "Stacks"
        },
        ADAPTER_TYPES: {
            BITCOIN: "bitcoin",
            SOLANA: "solana",
            WAGMI: "wagmi",
            ETHERS: "ethers",
            ETHERS5: "ethers5"
        },
        USDT_CONTRACT_ADDRESSES: [
            "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
            "0x919C1c267BC06a7039e03fcc2eF738525769109c",
            "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
            "0x55d398326f99059fF775485246999027B3197955",
            "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
        ],
        SOLANA_SPL_TOKEN_ADDRESSES: {
            SOL: "So11111111111111111111111111111111111111112"
        },
        HTTP_STATUS_CODES: {
            SERVER_ERROR: 500,
            TOO_MANY_REQUESTS: 429,
            SERVICE_UNAVAILABLE: 503,
            FORBIDDEN: 403
        },
        UNSUPPORTED_NETWORK_NAME: "Unknown Network",
        SECURE_SITE_SDK_ORIGIN: (typeof process < "u" && typeof ac < "u" ? ac.NEXT_PUBLIC_SECURE_SITE_ORIGIN : void 0) || "https://secure.walletconnect.org",
        REMOTE_FEATURES_ALERTS: {
            MULTI_WALLET_NOT_ENABLED: {
                DEFAULT: {
                    displayMessage: "Multi-Wallet Not Enabled",
                    debugMessage: "Multi-wallet support is not enabled. Please enable it in your AppKit configuration at cloud.reown.com."
                },
                CONNECTIONS_HOOK: {
                    displayMessage: "Multi-Wallet Not Enabled",
                    debugMessage: "Multi-wallet support is not enabled. Please enable it in your AppKit configuration at cloud.reown.com to use the useAppKitConnections hook."
                },
                CONNECTION_HOOK: {
                    displayMessage: "Multi-Wallet Not Enabled",
                    debugMessage: "Multi-wallet support is not enabled. Please enable it in your AppKit configuration at cloud.reown.com to use the useAppKitConnection hook."
                }
            }
        },
        IS_DEVELOPMENT: typeof process < "u" && !1
    };
    Pd = {
        caipNetworkIdToNumber (t) {
            return t ? Number(t.split(":")[1]) : void 0;
        },
        parseEvmChainId (t) {
            return typeof t == "string" ? this.caipNetworkIdToNumber(t) : t;
        },
        getNetworksByNamespace (t, e) {
            return t?.filter((s)=>s.chainNamespace === e) || [];
        },
        getFirstNetworkByNamespace (t, e) {
            return this.getNetworksByNamespace(t, e)[0];
        },
        getNetworkNameByCaipNetworkId (t, e) {
            if (!e) return;
            const s = t.find((r)=>r.caipNetworkId === e);
            if (s) return s.name;
            const [n] = e.split(":");
            return S.CHAIN_NAME_MAP?.[n] || void 0;
        }
    };
    Rd = [
        "eip155",
        "solana",
        "polkadot",
        "bip122",
        "cosmos",
        "sui",
        "stacks"
    ];
    var ep = 20, tp = 1, wn = 1e6, cc = 1e6, sp = -7, np = 21, rp = !1, jr = "[big.js] ", An = jr + "Invalid ", Vi = An + "decimal places", ip = An + "rounding mode", xd = jr + "Division by zero", Ne = {}, as = void 0, op = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    function $d() {
        function t(e) {
            var s = this;
            if (!(s instanceof t)) return e === as ? $d() : new t(e);
            if (e instanceof t) s.s = e.s, s.e = e.e, s.c = e.c.slice();
            else {
                if (typeof e != "string") {
                    if (t.strict === !0 && typeof e != "bigint") throw TypeError(An + "value");
                    e = e === 0 && 1 / e < 0 ? "-0" : String(e);
                }
                ap(s, e);
            }
            s.constructor = t;
        }
        return t.prototype = Ne, t.DP = ep, t.RM = tp, t.NE = sp, t.PE = np, t.strict = rp, t.roundDown = 0, t.roundHalfUp = 1, t.roundHalfEven = 2, t.roundUp = 3, t;
    }
    function ap(t, e) {
        var s, n, r;
        if (!op.test(e)) throw Error(An + "number");
        for(t.s = e.charAt(0) == "-" ? (e = e.slice(1), -1) : 1, (s = e.indexOf(".")) > -1 && (e = e.replace(".", "")), (n = e.search(/e/i)) > 0 ? (s < 0 && (s = n), s += +e.slice(n + 1), e = e.substring(0, n)) : s < 0 && (s = e.length), r = e.length, n = 0; n < r && e.charAt(n) == "0";)++n;
        if (n == r) t.c = [
            t.e = 0
        ];
        else {
            for(; r > 0 && e.charAt(--r) == "0";);
            for(t.e = s - n - 1, t.c = [], s = 0; n <= r;)t.c[s++] = +e.charAt(n++);
        }
        return t;
    }
    function In(t, e, s, n) {
        var r = t.c;
        if (s === as && (s = t.constructor.RM), s !== 0 && s !== 1 && s !== 2 && s !== 3) throw Error(ip);
        if (e < 1) n = s === 3 && (n || !!r[0]) || e === 0 && (s === 1 && r[0] >= 5 || s === 2 && (r[0] > 5 || r[0] === 5 && (n || r[1] !== as))), r.length = 1, n ? (t.e = t.e - e + 1, r[0] = 1) : r[0] = t.e = 0;
        else if (e < r.length) {
            if (n = s === 1 && r[e] >= 5 || s === 2 && (r[e] > 5 || r[e] === 5 && (n || r[e + 1] !== as || r[e - 1] & 1)) || s === 3 && (n || !!r[0]), r.length = e, n) {
                for(; ++r[--e] > 9;)if (r[e] = 0, e === 0) {
                    ++t.e, r.unshift(1);
                    break;
                }
            }
            for(e = r.length; !r[--e];)r.pop();
        }
        return t;
    }
    function Nn(t, e, s) {
        var n = t.e, r = t.c.join(""), i = r.length;
        if (e) r = r.charAt(0) + (i > 1 ? "." + r.slice(1) : "") + (n < 0 ? "e" : "e+") + n;
        else if (n < 0) {
            for(; ++n;)r = "0" + r;
            r = "0." + r;
        } else if (n > 0) if (++n > i) for(n -= i; n--;)r += "0";
        else n < i && (r = r.slice(0, n) + "." + r.slice(n));
        else i > 1 && (r = r.charAt(0) + "." + r.slice(1));
        return t.s < 0 && s ? "-" + r : r;
    }
    Ne.abs = function() {
        var t = new this.constructor(this);
        return t.s = 1, t;
    };
    Ne.cmp = function(t) {
        var e, s = this, n = s.c, r = (t = new s.constructor(t)).c, i = s.s, o = t.s, a = s.e, c = t.e;
        if (!n[0] || !r[0]) return n[0] ? i : r[0] ? -o : 0;
        if (i != o) return i;
        if (e = i < 0, a != c) return a > c ^ e ? 1 : -1;
        for(o = (a = n.length) < (c = r.length) ? a : c, i = -1; ++i < o;)if (n[i] != r[i]) return n[i] > r[i] ^ e ? 1 : -1;
        return a == c ? 0 : a > c ^ e ? 1 : -1;
    };
    Ne.div = function(t) {
        var e = this, s = e.constructor, n = e.c, r = (t = new s(t)).c, i = e.s == t.s ? 1 : -1, o = s.DP;
        if (o !== ~~o || o < 0 || o > wn) throw Error(Vi);
        if (!r[0]) throw Error(xd);
        if (!n[0]) return t.s = i, t.c = [
            t.e = 0
        ], t;
        var a, c, l, d, h, u = r.slice(), f = a = r.length, g = n.length, w = n.slice(0, a), m = w.length, A = t, v = A.c = [], P = 0, j = o + (A.e = e.e - t.e) + 1;
        for(A.s = i, i = j < 0 ? 0 : j, u.unshift(0); m++ < a;)w.push(0);
        do {
            for(l = 0; l < 10; l++){
                if (a != (m = w.length)) d = a > m ? 1 : -1;
                else for(h = -1, d = 0; ++h < a;)if (r[h] != w[h]) {
                    d = r[h] > w[h] ? 1 : -1;
                    break;
                }
                if (d < 0) {
                    for(c = m == a ? r : u; m;){
                        if (w[--m] < c[m]) {
                            for(h = m; h && !w[--h];)w[h] = 9;
                            --w[h], w[m] += 10;
                        }
                        w[m] -= c[m];
                    }
                    for(; !w[0];)w.shift();
                } else break;
            }
            v[P++] = d ? l : ++l, w[0] && d ? w[m] = n[f] || 0 : w = [
                n[f]
            ];
        }while ((f++ < g || w[0] !== as) && i--);
        return !v[0] && P != 1 && (v.shift(), A.e--, j--), P > j && In(A, j, s.RM, w[0] !== as), A;
    };
    Ne.eq = function(t) {
        return this.cmp(t) === 0;
    };
    Ne.gt = function(t) {
        return this.cmp(t) > 0;
    };
    Ne.gte = function(t) {
        return this.cmp(t) > -1;
    };
    Ne.lt = function(t) {
        return this.cmp(t) < 0;
    };
    Ne.lte = function(t) {
        return this.cmp(t) < 1;
    };
    Ne.minus = Ne.sub = function(t) {
        var e, s, n, r, i = this, o = i.constructor, a = i.s, c = (t = new o(t)).s;
        if (a != c) return t.s = -c, i.plus(t);
        var l = i.c.slice(), d = i.e, h = t.c, u = t.e;
        if (!l[0] || !h[0]) return h[0] ? t.s = -c : l[0] ? t = new o(i) : t.s = 1, t;
        if (a = d - u) {
            for((r = a < 0) ? (a = -a, n = l) : (u = d, n = h), n.reverse(), c = a; c--;)n.push(0);
            n.reverse();
        } else for(s = ((r = l.length < h.length) ? l : h).length, a = c = 0; c < s; c++)if (l[c] != h[c]) {
            r = l[c] < h[c];
            break;
        }
        if (r && (n = l, l = h, h = n, t.s = -t.s), (c = (s = h.length) - (e = l.length)) > 0) for(; c--;)l[e++] = 0;
        for(c = e; s > a;){
            if (l[--s] < h[s]) {
                for(e = s; e && !l[--e];)l[e] = 9;
                --l[e], l[s] += 10;
            }
            l[s] -= h[s];
        }
        for(; l[--c] === 0;)l.pop();
        for(; l[0] === 0;)l.shift(), --u;
        return l[0] || (t.s = 1, l = [
            u = 0
        ]), t.c = l, t.e = u, t;
    };
    Ne.mod = function(t) {
        var e, s = this, n = s.constructor, r = s.s, i = (t = new n(t)).s;
        if (!t.c[0]) throw Error(xd);
        return s.s = t.s = 1, e = t.cmp(s) == 1, s.s = r, t.s = i, e ? new n(s) : (r = n.DP, i = n.RM, n.DP = n.RM = 0, s = s.div(t), n.DP = r, n.RM = i, this.minus(s.times(t)));
    };
    Ne.neg = function() {
        var t = new this.constructor(this);
        return t.s = -t.s, t;
    };
    Ne.plus = Ne.add = function(t) {
        var e, s, n, r = this, i = r.constructor;
        if (t = new i(t), r.s != t.s) return t.s = -t.s, r.minus(t);
        var o = r.e, a = r.c, c = t.e, l = t.c;
        if (!a[0] || !l[0]) return l[0] || (a[0] ? t = new i(r) : t.s = r.s), t;
        if (a = a.slice(), e = o - c) {
            for(e > 0 ? (c = o, n = l) : (e = -e, n = a), n.reverse(); e--;)n.push(0);
            n.reverse();
        }
        for(a.length - l.length < 0 && (n = l, l = a, a = n), e = l.length, s = 0; e; a[e] %= 10)s = (a[--e] = a[e] + l[e] + s) / 10 | 0;
        for(s && (a.unshift(s), ++c), e = a.length; a[--e] === 0;)a.pop();
        return t.c = a, t.e = c, t;
    };
    Ne.pow = function(t) {
        var e = this, s = new e.constructor("1"), n = s, r = t < 0;
        if (t !== ~~t || t < -cc || t > cc) throw Error(An + "exponent");
        for(r && (t = -t); t & 1 && (n = n.times(e)), t >>= 1, !!t;)e = e.times(e);
        return r ? s.div(n) : n;
    };
    Ne.prec = function(t, e) {
        if (t !== ~~t || t < 1 || t > wn) throw Error(An + "precision");
        return In(new this.constructor(this), t, e);
    };
    Ne.round = function(t, e) {
        if (t === as) t = 0;
        else if (t !== ~~t || t < -wn || t > wn) throw Error(Vi);
        return In(new this.constructor(this), t + this.e + 1, e);
    };
    Ne.sqrt = function() {
        var t, e, s, n = this, r = n.constructor, i = n.s, o = n.e, a = new r("0.5");
        if (!n.c[0]) return new r(n);
        if (i < 0) throw Error(jr + "No square root");
        i = Math.sqrt(+Nn(n, !0, !0)), i === 0 || i === 1 / 0 ? (e = n.c.join(""), e.length + o & 1 || (e += "0"), i = Math.sqrt(e), o = ((o + 1) / 2 | 0) - (o < 0 || o & 1), t = new r((i == 1 / 0 ? "5e" : (i = i.toExponential()).slice(0, i.indexOf("e") + 1)) + o)) : t = new r(i + ""), o = t.e + (r.DP += 4);
        do s = t, t = a.times(s.plus(n.div(s)));
        while (s.c.slice(0, o).join("") !== t.c.slice(0, o).join(""));
        return In(t, (r.DP -= 4) + t.e + 1, r.RM);
    };
    Ne.times = Ne.mul = function(t) {
        var e, s = this, n = s.constructor, r = s.c, i = (t = new n(t)).c, o = r.length, a = i.length, c = s.e, l = t.e;
        if (t.s = s.s == t.s ? 1 : -1, !r[0] || !i[0]) return t.c = [
            t.e = 0
        ], t;
        for(t.e = c + l, o < a && (e = r, r = i, i = e, l = o, o = a, a = l), e = new Array(l = o + a); l--;)e[l] = 0;
        for(c = a; c--;){
            for(a = 0, l = o + c; l > c;)a = e[l] + i[c] * r[l - c - 1] + a, e[l--] = a % 10, a = a / 10 | 0;
            e[l] = a;
        }
        for(a ? ++t.e : e.shift(), c = e.length; !e[--c];)e.pop();
        return t.c = e, t;
    };
    Ne.toExponential = function(t, e) {
        var s = this, n = s.c[0];
        if (t !== as) {
            if (t !== ~~t || t < 0 || t > wn) throw Error(Vi);
            for(s = In(new s.constructor(s), ++t, e); s.c.length < t;)s.c.push(0);
        }
        return Nn(s, !0, !!n);
    };
    Ne.toFixed = function(t, e) {
        var s = this, n = s.c[0];
        if (t !== as) {
            if (t !== ~~t || t < 0 || t > wn) throw Error(Vi);
            for(s = In(new s.constructor(s), t + s.e + 1, e), t = t + s.e + 1; s.c.length < t;)s.c.push(0);
        }
        return Nn(s, !1, !!n);
    };
    Ne[Symbol.for("nodejs.util.inspect.custom")] = Ne.toJSON = Ne.toString = function() {
        var t = this, e = t.constructor;
        return Nn(t, t.e <= e.NE || t.e >= e.PE, !!t.c[0]);
    };
    Ne.toNumber = function() {
        var t = +Nn(this, !0, !0);
        if (this.constructor.strict === !0 && !this.eq(t.toString())) throw Error(jr + "Imprecise conversion");
        return t;
    };
    Ne.toPrecision = function(t, e) {
        var s = this, n = s.constructor, r = s.c[0];
        if (t !== as) {
            if (t !== ~~t || t < 1 || t > wn) throw Error(An + "precision");
            for(s = In(new n(s), t, e); s.c.length < t;)s.c.push(0);
        }
        return Nn(s, t <= s.e || s.e <= n.NE || s.e >= n.PE, !!r);
    };
    Ne.valueOf = function() {
        var t = this, e = t.constructor;
        if (e.strict === !0) throw Error(jr + "valueOf disallowed");
        return Nn(t, t.e <= e.NE || t.e >= e.PE, !0);
    };
    var Os = $d();
    let lp, dp, hp, up;
    cp = {
        bigNumber (t) {
            return t ? new Os(t) : new Os(0);
        },
        multiply (t, e) {
            if (t === void 0 || e === void 0) return new Os(0);
            const s = new Os(t), n = new Os(e);
            return s.times(n);
        },
        toFixed (t, e = 2) {
            return t === void 0 || t === "" ? new Os(0).toFixed(e) : new Os(t).toFixed(e);
        },
        formatNumberToLocalString (t, e = 2) {
            return t === void 0 || t === "" ? "0.00" : typeof t == "number" ? t.toLocaleString("en-US", {
                maximumFractionDigits: e,
                minimumFractionDigits: e,
                roundingMode: "floor"
            }) : parseFloat(t).toLocaleString("en-US", {
                maximumFractionDigits: e,
                minimumFractionDigits: e,
                roundingMode: "floor"
            });
        },
        parseLocalStringToNumber (t) {
            if (t === void 0 || t === "") return 0;
            const e = t.replace(/,/gu, "");
            return new Os(e).toNumber();
        }
    };
    lp = [
        {
            type: "function",
            name: "transfer",
            stateMutability: "nonpayable",
            inputs: [
                {
                    name: "_to",
                    type: "address"
                },
                {
                    name: "_value",
                    type: "uint256"
                }
            ],
            outputs: [
                {
                    name: "",
                    type: "bool"
                }
            ]
        },
        {
            type: "function",
            name: "transferFrom",
            stateMutability: "nonpayable",
            inputs: [
                {
                    name: "_from",
                    type: "address"
                },
                {
                    name: "_to",
                    type: "address"
                },
                {
                    name: "_value",
                    type: "uint256"
                }
            ],
            outputs: [
                {
                    name: "",
                    type: "bool"
                }
            ]
        }
    ];
    dp = [
        {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
                {
                    name: "spender",
                    type: "address"
                },
                {
                    name: "amount",
                    type: "uint256"
                }
            ],
            outputs: [
                {
                    type: "bool"
                }
            ]
        }
    ];
    hp = [
        {
            type: "function",
            name: "transfer",
            stateMutability: "nonpayable",
            inputs: [
                {
                    name: "recipient",
                    type: "address"
                },
                {
                    name: "amount",
                    type: "uint256"
                }
            ],
            outputs: []
        },
        {
            type: "function",
            name: "transferFrom",
            stateMutability: "nonpayable",
            inputs: [
                {
                    name: "sender",
                    type: "address"
                },
                {
                    name: "recipient",
                    type: "address"
                },
                {
                    name: "amount",
                    type: "uint256"
                }
            ],
            outputs: [
                {
                    name: "",
                    type: "bool"
                }
            ]
        }
    ];
    up = {
        getERC20Abi: (t)=>S.USDT_CONTRACT_ADDRESSES.includes(t) ? hp : lp,
        getSwapAbi: ()=>dp
    };
    it = {
        validateCaipAddress (t) {
            if (t.split(":")?.length !== 3) throw new Error("Invalid CAIP Address");
            return t;
        },
        parseCaipAddress (t) {
            const e = t.split(":");
            if (e.length !== 3) throw new Error(`Invalid CAIP-10 address: ${t}`);
            const [s, n, r] = e;
            if (!s || !n || !r) throw new Error(`Invalid CAIP-10 address: ${t}`);
            return {
                chainNamespace: s,
                chainId: n,
                address: r
            };
        },
        parseCaipNetworkId (t) {
            const e = t.split(":");
            if (e.length !== 2) throw new Error(`Invalid CAIP-2 network id: ${t}`);
            const [s, n] = e;
            if (!s || !n) throw new Error(`Invalid CAIP-2 network id: ${t}`);
            return {
                chainNamespace: s,
                chainId: n
            };
        }
    };
    Ks = {
        RPC_ERROR_CODE: {
            USER_REJECTED_REQUEST: 4001
        },
        PROVIDER_RPC_ERROR_NAME: {
            PROVIDER_RPC: "ProviderRpcError",
            USER_REJECTED_REQUEST: "UserRejectedRequestError"
        },
        isRpcProviderError (t) {
            try {
                if (typeof t == "object" && t !== null) {
                    const e = t, s = typeof e.message == "string", n = typeof e.code == "number";
                    return s && n;
                }
                return !1;
            } catch  {
                return !1;
            }
        },
        isUserRejectedMessage (t) {
            return t.toLowerCase().includes("user rejected") || t.toLowerCase().includes("user cancelled") || t.toLowerCase().includes("user canceled");
        },
        isUserRejectedRequestError (t) {
            return Ks.isRpcProviderError(t) ? t.code === Ks.RPC_ERROR_CODE.USER_REJECTED_REQUEST || Ks.isUserRejectedMessage(t.message) : t instanceof Error ? Ks.isUserRejectedMessage(t.message) : !1;
        }
    };
    class pp extends Error {
        constructor(e, s){
            super(s.message, {
                cause: e
            }), this.name = Ks.PROVIDER_RPC_ERROR_NAME.PROVIDER_RPC, this.code = s.code;
        }
    }
    class Ud extends pp {
        constructor(e){
            super(e, {
                code: Ks.RPC_ERROR_CODE.USER_REJECTED_REQUEST,
                message: "User rejected the request"
            }), this.name = Ks.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST;
        }
    }
    Q = {
        WALLET_ID: "@appkit/wallet_id",
        WALLET_NAME: "@appkit/wallet_name",
        SOLANA_WALLET: "@appkit/solana_wallet",
        SOLANA_CAIP_CHAIN: "@appkit/solana_caip_chain",
        ACTIVE_CAIP_NETWORK_ID: "@appkit/active_caip_network_id",
        CONNECTED_SOCIAL: "@appkit/connected_social",
        CONNECTED_SOCIAL_USERNAME: "@appkit-wallet/SOCIAL_USERNAME",
        RECENT_WALLETS: "@appkit/recent_wallets",
        RECENT_WALLET: "@appkit/recent_wallet",
        DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE",
        ACTIVE_NAMESPACE: "@appkit/active_namespace",
        CONNECTED_NAMESPACES: "@appkit/connected_namespaces",
        CONNECTION_STATUS: "@appkit/connection_status",
        SIWX_AUTH_TOKEN: "@appkit/siwx-auth-token",
        SIWX_NONCE_TOKEN: "@appkit/siwx-nonce-token",
        TELEGRAM_SOCIAL_PROVIDER: "@appkit/social_provider",
        NATIVE_BALANCE_CACHE: "@appkit/native_balance_cache",
        PORTFOLIO_CACHE: "@appkit/portfolio_cache",
        ENS_CACHE: "@appkit/ens_cache",
        IDENTITY_CACHE: "@appkit/identity_cache",
        PREFERRED_ACCOUNT_TYPES: "@appkit/preferred_account_types",
        CONNECTIONS: "@appkit/connections",
        DISCONNECTED_CONNECTOR_IDS: "@appkit/disconnected_connector_ids",
        HISTORY_TRANSACTIONS_CACHE: "@appkit/history_transactions_cache",
        TOKEN_PRICE_CACHE: "@appkit/token_price_cache",
        RECENT_EMAILS: "@appkit/recent_emails",
        LATEST_APPKIT_VERSION: "@appkit/latest_version"
    };
    function io(t) {
        if (!t) throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");
        return `@appkit/${t}:connected_connector_id`;
    }
    X = {
        setItem (t, e) {
            yr() && e !== void 0 && localStorage.setItem(t, e);
        },
        getItem (t) {
            if (yr()) return localStorage.getItem(t) || void 0;
        },
        removeItem (t) {
            yr() && localStorage.removeItem(t);
        },
        clear () {
            yr() && localStorage.clear();
        }
    };
    function yr() {
        return typeof window < "u" && typeof localStorage < "u";
    }
    function Si(t, e) {
        return e === "light" ? {
            "--w3m-accent": t?.["--w3m-accent"] || "hsla(231, 100%, 70%, 1)",
            "--w3m-background": "#fff"
        } : {
            "--w3m-accent": t?.["--w3m-accent"] || "hsla(230, 100%, 67%, 1)",
            "--w3m-background": "#202020"
        };
    }
    const fp = Symbol(), lc = Object.getPrototypeOf, Wo = new WeakMap, gp = (t)=>t && (Wo.has(t) ? Wo.get(t) : lc(t) === Object.prototype || lc(t) === Array.prototype), mp = (t)=>gp(t) && t[fp] || null, dc = (t, e = !0)=>{
        Wo.set(t, e);
    }, Ti = {}, Ra = (t)=>typeof t == "object" && t !== null, wp = (t)=>Ra(t) && !Wr.has(t) && (Array.isArray(t) || !(Symbol.iterator in t)) && !(t instanceof WeakMap) && !(t instanceof WeakSet) && !(t instanceof Error) && !(t instanceof Number) && !(t instanceof Date) && !(t instanceof String) && !(t instanceof RegExp) && !(t instanceof ArrayBuffer) && !(t instanceof Promise), Dd = (t, e)=>{
        const s = qo.get(t);
        if (s?.[0] === e) return s[1];
        const n = Array.isArray(t) ? [] : Object.create(Object.getPrototypeOf(t));
        return dc(n, !0), qo.set(t, [
            e,
            n
        ]), Reflect.ownKeys(t).forEach((r)=>{
            if (Object.getOwnPropertyDescriptor(n, r)) return;
            const i = Reflect.get(t, r), { enumerable: o } = Reflect.getOwnPropertyDescriptor(t, r), a = {
                value: i,
                enumerable: o,
                configurable: !0
            };
            if (Wr.has(i)) dc(i, !1);
            else if (Gs.has(i)) {
                const [c, l] = Gs.get(i);
                a.value = Dd(c, l());
            }
            Object.defineProperty(n, r, a);
        }), Object.preventExtensions(n);
    }, yp = (t, e, s, n)=>({
            deleteProperty (r, i) {
                const o = Reflect.get(r, i);
                s(i);
                const a = Reflect.deleteProperty(r, i);
                return a && n([
                    "delete",
                    [
                        i
                    ],
                    o
                ]), a;
            },
            set (r, i, o, a) {
                const c = !t() && Reflect.has(r, i), l = Reflect.get(r, i, a);
                if (c && (hc(l, o) || Rr.has(o) && hc(l, Rr.get(o)))) return !0;
                s(i), Ra(o) && (o = mp(o) || o);
                const d = !Gs.has(o) && Cp(o) ? Oe(o) : o;
                return e(i, d), Reflect.set(r, i, d, a), n([
                    "set",
                    [
                        i
                    ],
                    o,
                    l
                ]), !0;
            }
        }), Gs = new WeakMap, Wr = new WeakSet, qo = new WeakMap, mi = [
        1
    ], Rr = new WeakMap;
    let hc = Object.is, bp = (t, e)=>new Proxy(t, e), Cp = wp, Ep = Dd, vp = yp;
    Oe = function(t = {}) {
        if (!Ra(t)) throw new Error("object required");
        const e = Rr.get(t);
        if (e) return e;
        let s = mi[0];
        const n = new Set, r = (m, A = ++mi[0])=>{
            s !== A && (i = s = A, n.forEach((v)=>v(m, A)));
        };
        let i = s;
        const o = (m = mi[0])=>(i !== m && (i = m, c.forEach(([A])=>{
                const v = A[1](m);
                v > s && (s = v);
            })), s), a = (m)=>(A, v)=>{
                const P = [
                    ...A
                ];
                P[1] = [
                    m,
                    ...P[1]
                ], r(P, v);
            }, c = new Map, l = (m, A)=>{
            const v = !Wr.has(A) && Gs.get(A);
            if (v) {
                if ((Ti ? "production" : void 0) !== "production" && c.has(m)) throw new Error("prop listener already exists");
                if (n.size) {
                    const P = v[2](a(m));
                    c.set(m, [
                        v,
                        P
                    ]);
                } else c.set(m, [
                    v
                ]);
            }
        }, d = (m)=>{
            var A;
            const v = c.get(m);
            v && (c.delete(m), (A = v[1]) == null || A.call(v));
        }, h = (m)=>(n.add(m), n.size === 1 && c.forEach(([v, P], j)=>{
                if ((Ti ? "production" : void 0) !== "production" && P) throw new Error("remove already exists");
                const G = v[2](a(j));
                c.set(j, [
                    v,
                    G
                ]);
            }), ()=>{
                n.delete(m), n.size === 0 && c.forEach(([v, P], j)=>{
                    P && (P(), c.set(j, [
                        v
                    ]));
                });
            });
        let u = !0;
        const f = vp(()=>u, l, d, r), g = bp(t, f);
        Rr.set(t, g);
        const w = [
            t,
            o,
            h
        ];
        return Gs.set(g, w), Reflect.ownKeys(t).forEach((m)=>{
            const A = Object.getOwnPropertyDescriptor(t, m);
            "value" in A && A.writable && (g[m] = t[m]);
        }), u = !1, g;
    };
    Je = function(t, e, s) {
        const n = Gs.get(t);
        (Ti ? "production" : void 0) !== "production" && !n && console.warn("Please use proxy object");
        let r;
        const i = [], o = n[2];
        let a = !1;
        const l = o((d)=>{
            i.push(d), r || (r = Promise.resolve().then(()=>{
                r = void 0, a && e(i.splice(0));
            }));
        });
        return a = !0, ()=>{
            a = !1, l();
        };
    };
    function xr(t) {
        const e = Gs.get(t);
        (Ti ? "production" : void 0) !== "production" && !e && console.warn("Please use proxy object");
        const [s, n] = e;
        return Ep(s, n());
    }
    function Yn(t) {
        return Wr.add(t), t;
    }
    function Ap() {
        return {
            proxyStateMap: Gs,
            refSet: Wr,
            snapCache: qo,
            versionHolder: mi,
            proxyCache: Rr
        };
    }
    Xe = function(t, e, s, n) {
        let r = t[e];
        return Je(t, ()=>{
            const i = t[e];
            Object.is(r, i) || s(r = i);
        });
    };
    const { proxyStateMap: Ip, snapCache: Np } = Ap(), si = (t)=>Ip.has(t);
    function _p(t) {
        const e = [];
        let s = 0;
        const n = new Map, r = new WeakMap, i = ()=>{
            const l = Np.get(a), d = l?.[1];
            if (d && !r.has(d)) {
                const h = new Map(n);
                r.set(d, h);
            }
        }, o = (l)=>r.get(l) || n, a = {
            data: e,
            index: s,
            epoch: 0,
            get size () {
                return si(this) || i(), o(this).size;
            },
            get (l) {
                const h = o(this).get(l);
                if (h === void 0) {
                    this.epoch;
                    return;
                }
                return this.data[h];
            },
            has (l) {
                const d = o(this);
                return this.epoch, d.has(l);
            },
            set (l, d) {
                if (!si(this)) throw new Error("Cannot perform mutations on a snapshot");
                const h = n.get(l);
                return h === void 0 ? (n.set(l, this.index), this.data[this.index++] = d) : this.data[h] = d, this.epoch++, this;
            },
            delete (l) {
                if (!si(this)) throw new Error("Cannot perform mutations on a snapshot");
                const d = n.get(l);
                return d === void 0 ? !1 : (delete this.data[d], n.delete(l), this.epoch++, !0);
            },
            clear () {
                if (!si(this)) throw new Error("Cannot perform mutations on a snapshot");
                this.data.length = 0, this.index = 0, this.epoch++, n.clear();
            },
            forEach (l) {
                this.epoch, o(this).forEach((h, u)=>{
                    l(this.data[h], u, this);
                });
            },
            *entries () {
                this.epoch;
                const l = o(this);
                for (const [d, h] of l)yield [
                    d,
                    this.data[h]
                ];
            },
            *keys () {
                this.epoch;
                const l = o(this);
                for (const d of l.keys())yield d;
            },
            *values () {
                this.epoch;
                const l = o(this);
                for (const d of l.values())yield this.data[d];
            },
            [Symbol.iterator] () {
                return this.entries();
            },
            get [Symbol.toStringTag] () {
                return "Map";
            },
            toJSON () {
                return new Map(this.entries());
            }
        }, c = Oe(a);
        return Object.defineProperties(c, {
            size: {
                enumerable: !1
            },
            index: {
                enumerable: !1
            },
            epoch: {
                enumerable: !1
            },
            data: {
                enumerable: !1
            },
            toJSON: {
                enumerable: !1
            }
        }), Object.seal(c), c;
    }
    var uc = {};
    let oo, Ld, Sp;
    oo = (typeof process < "u" && typeof uc < "u" ? uc.NEXT_PUBLIC_SECURE_SITE_ORIGIN : void 0) || "https://secure.walletconnect.org";
    Ld = [
        {
            label: "Meld.io",
            name: "meld",
            feeRange: "1-2%",
            url: "https://meldcrypto.com",
            supportedChains: [
                "eip155",
                "solana"
            ]
        }
    ];
    Sp = "WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU";
    me = {
        FOUR_MINUTES_MS: 24e4,
        TEN_SEC_MS: 1e4,
        FIVE_SEC_MS: 5e3,
        THREE_SEC_MS: 3e3,
        ONE_SEC_MS: 1e3,
        SECURE_SITE: oo,
        SECURE_SITE_DASHBOARD: `${oo}/dashboard`,
        SECURE_SITE_FAVICON: `${oo}/images/favicon.png`,
        SOLANA_NATIVE_TOKEN_ADDRESS: "So11111111111111111111111111111111111111111",
        RESTRICTED_TIMEZONES: [
            "ASIA/SHANGHAI",
            "ASIA/URUMQI",
            "ASIA/CHONGQING",
            "ASIA/HARBIN",
            "ASIA/KASHGAR",
            "ASIA/MACAU",
            "ASIA/HONG_KONG",
            "ASIA/MACAO",
            "ASIA/BEIJING",
            "ASIA/HARBIN"
        ],
        SWAP_SUGGESTED_TOKENS: [
            "ETH",
            "UNI",
            "1INCH",
            "AAVE",
            "SOL",
            "ADA",
            "AVAX",
            "DOT",
            "LINK",
            "NITRO",
            "GAIA",
            "MILK",
            "TRX",
            "NEAR",
            "GNO",
            "WBTC",
            "DAI",
            "WETH",
            "USDC",
            "USDT",
            "ARB",
            "BAL",
            "BICO",
            "CRV",
            "ENS",
            "MATIC",
            "OP"
        ],
        SWAP_POPULAR_TOKENS: [
            "ETH",
            "UNI",
            "1INCH",
            "AAVE",
            "SOL",
            "ADA",
            "AVAX",
            "DOT",
            "LINK",
            "NITRO",
            "GAIA",
            "MILK",
            "TRX",
            "NEAR",
            "GNO",
            "WBTC",
            "DAI",
            "WETH",
            "USDC",
            "USDT",
            "ARB",
            "BAL",
            "BICO",
            "CRV",
            "ENS",
            "MATIC",
            "OP",
            "METAL",
            "DAI",
            "CHAMP",
            "WOLF",
            "SALE",
            "BAL",
            "BUSD",
            "MUST",
            "BTCpx",
            "ROUTE",
            "HEX",
            "WELT",
            "amDAI",
            "VSQ",
            "VISION",
            "AURUM",
            "pSP",
            "SNX",
            "VC",
            "LINK",
            "CHP",
            "amUSDT",
            "SPHERE",
            "FOX",
            "GIDDY",
            "GFC",
            "OMEN",
            "OX_OLD",
            "DE",
            "WNT"
        ],
        BALANCE_SUPPORTED_CHAINS: [
            S.CHAIN.EVM,
            S.CHAIN.SOLANA
        ],
        SEND_PARAMS_SUPPORTED_CHAINS: [
            S.CHAIN.EVM
        ],
        SWAP_SUPPORTED_NETWORKS: [
            "eip155:1",
            "eip155:42161",
            "eip155:10",
            "eip155:324",
            "eip155:8453",
            "eip155:56",
            "eip155:137",
            "eip155:100",
            "eip155:43114",
            "eip155:250",
            "eip155:8217",
            "eip155:1313161554"
        ],
        NAMES_SUPPORTED_CHAIN_NAMESPACES: [
            S.CHAIN.EVM
        ],
        ONRAMP_SUPPORTED_CHAIN_NAMESPACES: [
            S.CHAIN.EVM,
            S.CHAIN.SOLANA
        ],
        PAY_WITH_EXCHANGE_SUPPORTED_CHAIN_NAMESPACES: [
            S.CHAIN.EVM,
            S.CHAIN.SOLANA
        ],
        ACTIVITY_ENABLED_CHAIN_NAMESPACES: [
            S.CHAIN.EVM
        ],
        NATIVE_TOKEN_ADDRESS: {
            eip155: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            solana: "So11111111111111111111111111111111111111111",
            polkadot: "0x",
            bip122: "0x",
            cosmos: "0x",
            sui: "0x",
            stacks: "0x"
        },
        CONVERT_SLIPPAGE_TOLERANCE: 1,
        CONNECT_LABELS: {
            MOBILE: "Open and continue in the wallet app",
            WEB: "Open and continue in the wallet app"
        },
        SEND_SUPPORTED_NAMESPACES: [
            S.CHAIN.EVM,
            S.CHAIN.SOLANA
        ],
        DEFAULT_REMOTE_FEATURES: {
            swaps: [
                "1inch"
            ],
            onramp: [
                "meld"
            ],
            email: !0,
            socials: [
                "google",
                "x",
                "discord",
                "farcaster",
                "github",
                "apple",
                "facebook"
            ],
            activity: !0,
            reownBranding: !0,
            multiWallet: !1,
            emailCapture: !1,
            payWithExchange: !1,
            payments: !1,
            reownAuthentication: !1
        },
        DEFAULT_REMOTE_FEATURES_DISABLED: {
            email: !1,
            socials: !1,
            swaps: !1,
            onramp: !1,
            activity: !1,
            reownBranding: !1,
            emailCapture: !1,
            reownAuthentication: !1
        },
        DEFAULT_FEATURES: {
            receive: !0,
            send: !0,
            emailShowWallets: !0,
            connectorTypeOrder: [
                "walletConnect",
                "recent",
                "injected",
                "featured",
                "custom",
                "external",
                "recommended"
            ],
            analytics: !0,
            allWallets: !0,
            legalCheckbox: !1,
            smartSessions: !1,
            collapseWallets: !1,
            walletFeaturesOrder: [
                "onramp",
                "swaps",
                "receive",
                "send"
            ],
            connectMethodsOrder: void 0,
            pay: !1,
            reownAuthentication: !1
        },
        DEFAULT_SOCIALS: [
            "google",
            "x",
            "farcaster",
            "discord",
            "apple",
            "github",
            "facebook"
        ],
        DEFAULT_ACCOUNT_TYPES: {
            bip122: "payment",
            eip155: "smartAccount",
            polkadot: "eoa",
            solana: "eoa"
        },
        ADAPTER_TYPES: {
            UNIVERSAL: "universal",
            SOLANA: "solana",
            WAGMI: "wagmi",
            ETHERS: "ethers",
            ETHERS5: "ethers5",
            BITCOIN: "bitcoin"
        },
        SIWX_DEFAULTS: {
            signOutOnDisconnect: !0
        }
    };
    $ = {
        cacheExpiry: {
            portfolio: 3e4,
            nativeBalance: 3e4,
            ens: 3e5,
            identity: 3e5,
            transactionsHistory: 15e3,
            tokenPrice: 15e3,
            latestAppKitVersion: 6048e5
        },
        isCacheExpired (t, e) {
            return Date.now() - t > e;
        },
        getActiveNetworkProps () {
            const t = $.getActiveNamespace(), e = $.getActiveCaipNetworkId(), s = e ? e.split(":")[1] : void 0, n = s ? isNaN(Number(s)) ? s : Number(s) : void 0;
            return {
                namespace: t,
                caipNetworkId: e,
                chainId: n
            };
        },
        setWalletConnectDeepLink ({ name: t, href: e }) {
            try {
                X.setItem(Q.DEEPLINK_CHOICE, JSON.stringify({
                    href: e,
                    name: t
                }));
            } catch  {
                console.info("Unable to set WalletConnect deep link");
            }
        },
        getWalletConnectDeepLink () {
            try {
                const t = X.getItem(Q.DEEPLINK_CHOICE);
                if (t) return JSON.parse(t);
            } catch  {
                console.info("Unable to get WalletConnect deep link");
            }
        },
        deleteWalletConnectDeepLink () {
            try {
                X.removeItem(Q.DEEPLINK_CHOICE);
            } catch  {
                console.info("Unable to delete WalletConnect deep link");
            }
        },
        setActiveNamespace (t) {
            try {
                X.setItem(Q.ACTIVE_NAMESPACE, t);
            } catch  {
                console.info("Unable to set active namespace");
            }
        },
        setActiveCaipNetworkId (t) {
            try {
                X.setItem(Q.ACTIVE_CAIP_NETWORK_ID, t), $.setActiveNamespace(t.split(":")[0]);
            } catch  {
                console.info("Unable to set active caip network id");
            }
        },
        getActiveCaipNetworkId () {
            try {
                return X.getItem(Q.ACTIVE_CAIP_NETWORK_ID);
            } catch  {
                console.info("Unable to get active caip network id");
                return;
            }
        },
        deleteActiveCaipNetworkId () {
            try {
                X.removeItem(Q.ACTIVE_CAIP_NETWORK_ID);
            } catch  {
                console.info("Unable to delete active caip network id");
            }
        },
        deleteConnectedConnectorId (t) {
            try {
                const e = io(t);
                X.removeItem(e);
            } catch  {
                console.info("Unable to delete connected connector id");
            }
        },
        setAppKitRecent (t) {
            try {
                const e = $.getRecentWallets();
                e.find((n)=>n.id === t.id) || (e.unshift(t), e.length > 2 && e.pop(), X.setItem(Q.RECENT_WALLETS, JSON.stringify(e)), X.setItem(Q.RECENT_WALLET, JSON.stringify(t)));
            } catch  {
                console.info("Unable to set AppKit recent");
            }
        },
        getRecentWallets () {
            try {
                const t = X.getItem(Q.RECENT_WALLETS);
                return t ? JSON.parse(t) : [];
            } catch  {
                console.info("Unable to get AppKit recent");
            }
            return [];
        },
        getRecentWallet () {
            try {
                const t = X.getItem(Q.RECENT_WALLET);
                return t ? JSON.parse(t) : null;
            } catch  {
                console.info("Unable to get AppKit recent");
            }
            return null;
        },
        deleteRecentWallet () {
            try {
                X.removeItem(Q.RECENT_WALLET);
            } catch  {
                console.info("Unable to delete AppKit recent");
            }
        },
        setConnectedConnectorId (t, e) {
            try {
                const s = io(t);
                X.setItem(s, e);
            } catch  {
                console.info("Unable to set Connected Connector Id");
            }
        },
        getActiveNamespace () {
            try {
                return X.getItem(Q.ACTIVE_NAMESPACE);
            } catch  {
                console.info("Unable to get active namespace");
            }
        },
        getConnectedConnectorId (t) {
            if (t) try {
                const e = io(t);
                return X.getItem(e);
            } catch  {
                console.info("Unable to get connected connector id in namespace", t);
            }
        },
        setConnectedSocialProvider (t) {
            try {
                X.setItem(Q.CONNECTED_SOCIAL, t);
            } catch  {
                console.info("Unable to set connected social provider");
            }
        },
        getConnectedSocialProvider () {
            try {
                return X.getItem(Q.CONNECTED_SOCIAL);
            } catch  {
                console.info("Unable to get connected social provider");
            }
        },
        deleteConnectedSocialProvider () {
            try {
                X.removeItem(Q.CONNECTED_SOCIAL);
            } catch  {
                console.info("Unable to delete connected social provider");
            }
        },
        getConnectedSocialUsername () {
            try {
                return X.getItem(Q.CONNECTED_SOCIAL_USERNAME);
            } catch  {
                console.info("Unable to get connected social username");
            }
        },
        getStoredActiveCaipNetworkId () {
            return X.getItem(Q.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1];
        },
        setConnectionStatus (t) {
            try {
                X.setItem(Q.CONNECTION_STATUS, t);
            } catch  {
                console.info("Unable to set connection status");
            }
        },
        getConnectionStatus () {
            try {
                return X.getItem(Q.CONNECTION_STATUS);
            } catch  {
                return;
            }
        },
        getConnectedNamespaces () {
            try {
                const t = X.getItem(Q.CONNECTED_NAMESPACES);
                return t?.length ? t.split(",") : [];
            } catch  {
                return [];
            }
        },
        setConnectedNamespaces (t) {
            try {
                const e = Array.from(new Set(t));
                X.setItem(Q.CONNECTED_NAMESPACES, e.join(","));
            } catch  {
                console.info("Unable to set namespaces in storage");
            }
        },
        addConnectedNamespace (t) {
            try {
                const e = $.getConnectedNamespaces();
                e.includes(t) || (e.push(t), $.setConnectedNamespaces(e));
            } catch  {
                console.info("Unable to add connected namespace");
            }
        },
        removeConnectedNamespace (t) {
            try {
                const e = $.getConnectedNamespaces(), s = e.indexOf(t);
                s > -1 && (e.splice(s, 1), $.setConnectedNamespaces(e));
            } catch  {
                console.info("Unable to remove connected namespace");
            }
        },
        getTelegramSocialProvider () {
            try {
                return X.getItem(Q.TELEGRAM_SOCIAL_PROVIDER);
            } catch  {
                return console.info("Unable to get telegram social provider"), null;
            }
        },
        setTelegramSocialProvider (t) {
            try {
                X.setItem(Q.TELEGRAM_SOCIAL_PROVIDER, t);
            } catch  {
                console.info("Unable to set telegram social provider");
            }
        },
        removeTelegramSocialProvider () {
            try {
                X.removeItem(Q.TELEGRAM_SOCIAL_PROVIDER);
            } catch  {
                console.info("Unable to remove telegram social provider");
            }
        },
        getBalanceCache () {
            let t = {};
            try {
                const e = X.getItem(Q.PORTFOLIO_CACHE);
                t = e ? JSON.parse(e) : {};
            } catch  {
                console.info("Unable to get balance cache");
            }
            return t;
        },
        removeAddressFromBalanceCache (t) {
            try {
                const e = $.getBalanceCache();
                X.setItem(Q.PORTFOLIO_CACHE, JSON.stringify({
                    ...e,
                    [t]: void 0
                }));
            } catch  {
                console.info("Unable to remove address from balance cache", t);
            }
        },
        getBalanceCacheForCaipAddress (t) {
            try {
                const s = $.getBalanceCache()[t];
                if (s && !this.isCacheExpired(s.timestamp, this.cacheExpiry.portfolio)) return s.balance;
                $.removeAddressFromBalanceCache(t);
            } catch  {
                console.info("Unable to get balance cache for address", t);
            }
        },
        updateBalanceCache (t) {
            try {
                const e = $.getBalanceCache();
                e[t.caipAddress] = t, X.setItem(Q.PORTFOLIO_CACHE, JSON.stringify(e));
            } catch  {
                console.info("Unable to update balance cache", t);
            }
        },
        getNativeBalanceCache () {
            let t = {};
            try {
                const e = X.getItem(Q.NATIVE_BALANCE_CACHE);
                t = e ? JSON.parse(e) : {};
            } catch  {
                console.info("Unable to get balance cache");
            }
            return t;
        },
        removeAddressFromNativeBalanceCache (t) {
            try {
                const e = $.getBalanceCache();
                X.setItem(Q.NATIVE_BALANCE_CACHE, JSON.stringify({
                    ...e,
                    [t]: void 0
                }));
            } catch  {
                console.info("Unable to remove address from balance cache", t);
            }
        },
        getNativeBalanceCacheForCaipAddress (t) {
            try {
                const s = $.getNativeBalanceCache()[t];
                if (s && !this.isCacheExpired(s.timestamp, this.cacheExpiry.nativeBalance)) return s;
                console.info("Discarding cache for address", t), $.removeAddressFromBalanceCache(t);
            } catch  {
                console.info("Unable to get balance cache for address", t);
            }
        },
        updateNativeBalanceCache (t) {
            try {
                const e = $.getNativeBalanceCache();
                e[t.caipAddress] = t, X.setItem(Q.NATIVE_BALANCE_CACHE, JSON.stringify(e));
            } catch  {
                console.info("Unable to update balance cache", t);
            }
        },
        getEnsCache () {
            let t = {};
            try {
                const e = X.getItem(Q.ENS_CACHE);
                t = e ? JSON.parse(e) : {};
            } catch  {
                console.info("Unable to get ens name cache");
            }
            return t;
        },
        getEnsFromCacheForAddress (t) {
            try {
                const s = $.getEnsCache()[t];
                if (s && !this.isCacheExpired(s.timestamp, this.cacheExpiry.ens)) return s.ens;
                $.removeEnsFromCache(t);
            } catch  {
                console.info("Unable to get ens name from cache", t);
            }
        },
        updateEnsCache (t) {
            try {
                const e = $.getEnsCache();
                e[t.address] = t, X.setItem(Q.ENS_CACHE, JSON.stringify(e));
            } catch  {
                console.info("Unable to update ens name cache", t);
            }
        },
        removeEnsFromCache (t) {
            try {
                const e = $.getEnsCache();
                X.setItem(Q.ENS_CACHE, JSON.stringify({
                    ...e,
                    [t]: void 0
                }));
            } catch  {
                console.info("Unable to remove ens name from cache", t);
            }
        },
        getIdentityCache () {
            let t = {};
            try {
                const e = X.getItem(Q.IDENTITY_CACHE);
                t = e ? JSON.parse(e) : {};
            } catch  {
                console.info("Unable to get identity cache");
            }
            return t;
        },
        getIdentityFromCacheForAddress (t) {
            try {
                const s = $.getIdentityCache()[t];
                if (s && !this.isCacheExpired(s.timestamp, this.cacheExpiry.identity)) return s.identity;
                $.removeIdentityFromCache(t);
            } catch  {
                console.info("Unable to get identity from cache", t);
            }
        },
        updateIdentityCache (t) {
            try {
                const e = $.getIdentityCache();
                e[t.address] = {
                    identity: t.identity,
                    timestamp: t.timestamp
                }, X.setItem(Q.IDENTITY_CACHE, JSON.stringify(e));
            } catch  {
                console.info("Unable to update identity cache", t);
            }
        },
        removeIdentityFromCache (t) {
            try {
                const e = $.getIdentityCache();
                X.setItem(Q.IDENTITY_CACHE, JSON.stringify({
                    ...e,
                    [t]: void 0
                }));
            } catch  {
                console.info("Unable to remove identity from cache", t);
            }
        },
        clearAddressCache () {
            try {
                X.removeItem(Q.PORTFOLIO_CACHE), X.removeItem(Q.NATIVE_BALANCE_CACHE), X.removeItem(Q.ENS_CACHE), X.removeItem(Q.IDENTITY_CACHE), X.removeItem(Q.HISTORY_TRANSACTIONS_CACHE);
            } catch  {
                console.info("Unable to clear address cache");
            }
        },
        setPreferredAccountTypes (t) {
            try {
                X.setItem(Q.PREFERRED_ACCOUNT_TYPES, JSON.stringify(t));
            } catch  {
                console.info("Unable to set preferred account types", t);
            }
        },
        getPreferredAccountTypes () {
            try {
                const t = X.getItem(Q.PREFERRED_ACCOUNT_TYPES);
                return t ? JSON.parse(t) : {};
            } catch  {
                console.info("Unable to get preferred account types");
            }
            return {};
        },
        setConnections (t, e) {
            try {
                const s = $.getConnections(), n = s[e] ?? [], r = new Map;
                for (const o of n)r.set(o.connectorId, {
                    ...o
                });
                for (const o of t){
                    const a = r.get(o.connectorId), c = o.connectorId === S.CONNECTOR_ID.AUTH;
                    if (a && !c) {
                        const l = new Set(a.accounts.map((h)=>h.address.toLowerCase())), d = o.accounts.filter((h)=>!l.has(h.address.toLowerCase()));
                        a.accounts.push(...d);
                    } else r.set(o.connectorId, {
                        ...o
                    });
                }
                const i = {
                    ...s,
                    [e]: Array.from(r.values())
                };
                X.setItem(Q.CONNECTIONS, JSON.stringify(i));
            } catch (s) {
                console.error("Unable to sync connections to storage", s);
            }
        },
        getConnections () {
            try {
                const t = X.getItem(Q.CONNECTIONS);
                return t ? JSON.parse(t) : {};
            } catch (t) {
                return console.error("Unable to get connections from storage", t), {};
            }
        },
        deleteAddressFromConnection ({ connectorId: t, address: e, namespace: s }) {
            try {
                const n = $.getConnections(), r = n[s] ?? [], i = new Map(r.map((a)=>[
                        a.connectorId,
                        a
                    ])), o = i.get(t);
                o && (o.accounts.filter((c)=>c.address.toLowerCase() !== e.toLowerCase()).length === 0 ? i.delete(t) : i.set(t, {
                    ...o,
                    accounts: o.accounts.filter((c)=>c.address.toLowerCase() !== e.toLowerCase())
                })), X.setItem(Q.CONNECTIONS, JSON.stringify({
                    ...n,
                    [s]: Array.from(i.values())
                }));
            } catch  {
                console.error(`Unable to remove address "${e}" from connector "${t}" in namespace "${s}"`);
            }
        },
        getDisconnectedConnectorIds () {
            try {
                const t = X.getItem(Q.DISCONNECTED_CONNECTOR_IDS);
                return t ? JSON.parse(t) : {};
            } catch  {
                console.info("Unable to get disconnected connector ids");
            }
            return {};
        },
        addDisconnectedConnectorId (t, e) {
            try {
                const s = $.getDisconnectedConnectorIds(), n = s[e] ?? [];
                n.push(t), X.setItem(Q.DISCONNECTED_CONNECTOR_IDS, JSON.stringify({
                    ...s,
                    [e]: Array.from(new Set(n))
                }));
            } catch  {
                console.error(`Unable to set disconnected connector id "${t}" for namespace "${e}"`);
            }
        },
        removeDisconnectedConnectorId (t, e) {
            try {
                const s = $.getDisconnectedConnectorIds();
                let n = s[e] ?? [];
                n = n.filter((r)=>r.toLowerCase() !== t.toLowerCase()), X.setItem(Q.DISCONNECTED_CONNECTOR_IDS, JSON.stringify({
                    ...s,
                    [e]: Array.from(new Set(n))
                }));
            } catch  {
                console.error(`Unable to remove disconnected connector id "${t}" for namespace "${e}"`);
            }
        },
        isConnectorDisconnected (t, e) {
            try {
                return ($.getDisconnectedConnectorIds()[e] ?? []).some((r)=>r.toLowerCase() === t.toLowerCase());
            } catch  {
                console.info(`Unable to get disconnected connector id "${t}" for namespace "${e}"`);
            }
            return !1;
        },
        getTransactionsCache () {
            try {
                const t = X.getItem(Q.HISTORY_TRANSACTIONS_CACHE);
                return t ? JSON.parse(t) : {};
            } catch  {
                console.info("Unable to get transactions cache");
            }
            return {};
        },
        getTransactionsCacheForAddress ({ address: t, chainId: e = "" }) {
            try {
                const n = $.getTransactionsCache()[t]?.[e];
                if (n && !this.isCacheExpired(n.timestamp, this.cacheExpiry.transactionsHistory)) return n.transactions;
                $.removeTransactionsCache({
                    address: t,
                    chainId: e
                });
            } catch  {
                console.info("Unable to get transactions cache");
            }
        },
        updateTransactionsCache ({ address: t, chainId: e = "", timestamp: s, transactions: n }) {
            try {
                const r = $.getTransactionsCache();
                r[t] = {
                    ...r[t],
                    [e]: {
                        timestamp: s,
                        transactions: n
                    }
                }, X.setItem(Q.HISTORY_TRANSACTIONS_CACHE, JSON.stringify(r));
            } catch  {
                console.info("Unable to update transactions cache", {
                    address: t,
                    chainId: e,
                    timestamp: s,
                    transactions: n
                });
            }
        },
        removeTransactionsCache ({ address: t, chainId: e }) {
            try {
                const s = $.getTransactionsCache(), n = s?.[t] || {}, { [e]: r, ...i } = n;
                X.setItem(Q.HISTORY_TRANSACTIONS_CACHE, JSON.stringify({
                    ...s,
                    [t]: i
                }));
            } catch  {
                console.info("Unable to remove transactions cache", {
                    address: t,
                    chainId: e
                });
            }
        },
        getTokenPriceCache () {
            try {
                const t = X.getItem(Q.TOKEN_PRICE_CACHE);
                return t ? JSON.parse(t) : {};
            } catch  {
                console.info("Unable to get token price cache");
            }
            return {};
        },
        getTokenPriceCacheForAddresses (t) {
            try {
                const s = $.getTokenPriceCache()[t.join(",")];
                if (s && !this.isCacheExpired(s.timestamp, this.cacheExpiry.tokenPrice)) return s.tokenPrice;
                $.removeTokenPriceCache(t);
            } catch  {
                console.info("Unable to get token price cache for addresses", t);
            }
        },
        updateTokenPriceCache (t) {
            try {
                const e = $.getTokenPriceCache();
                e[t.addresses.join(",")] = {
                    timestamp: t.timestamp,
                    tokenPrice: t.tokenPrice
                }, X.setItem(Q.TOKEN_PRICE_CACHE, JSON.stringify(e));
            } catch  {
                console.info("Unable to update token price cache", t);
            }
        },
        removeTokenPriceCache (t) {
            try {
                const e = $.getTokenPriceCache();
                X.setItem(Q.TOKEN_PRICE_CACHE, JSON.stringify({
                    ...e,
                    [t.join(",")]: void 0
                }));
            } catch  {
                console.info("Unable to remove token price cache", t);
            }
        },
        getLatestAppKitVersion () {
            try {
                const t = this.getLatestAppKitVersionCache(), e = t?.version;
                return e && !this.isCacheExpired(t.timestamp, this.cacheExpiry.latestAppKitVersion) ? e : void 0;
            } catch  {
                console.info("Unable to get latest AppKit version");
            }
        },
        getLatestAppKitVersionCache () {
            try {
                const t = X.getItem(Q.LATEST_APPKIT_VERSION);
                return t ? JSON.parse(t) : {};
            } catch  {
                console.info("Unable to get latest AppKit version cache");
            }
            return {};
        },
        updateLatestAppKitVersion (t) {
            try {
                const e = $.getLatestAppKitVersionCache();
                e.timestamp = t.timestamp, e.version = t.version, X.setItem(Q.LATEST_APPKIT_VERSION, JSON.stringify(e));
            } catch  {
                console.info("Unable to update latest AppKit version on local storage", t);
            }
        }
    };
    J = {
        isMobile () {
            return this.isClient() ? !!(window?.matchMedia && typeof window.matchMedia == "function" && window.matchMedia("(pointer:coarse)")?.matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)) : !1;
        },
        checkCaipNetwork (t, e = "") {
            return t?.caipNetworkId.toLocaleLowerCase().includes(e.toLowerCase());
        },
        isAndroid () {
            if (!this.isMobile()) return !1;
            const t = window?.navigator.userAgent.toLowerCase();
            return J.isMobile() && t.includes("android");
        },
        isIos () {
            if (!this.isMobile()) return !1;
            const t = window?.navigator.userAgent.toLowerCase();
            return t.includes("iphone") || t.includes("ipad");
        },
        isSafari () {
            return this.isClient() ? (window?.navigator.userAgent.toLowerCase()).includes("safari") : !1;
        },
        isClient () {
            return typeof window < "u";
        },
        isPairingExpired (t) {
            return t ? t - Date.now() <= me.TEN_SEC_MS : !0;
        },
        isAllowedRetry (t, e = me.ONE_SEC_MS) {
            return Date.now() - t >= e;
        },
        copyToClopboard (t) {
            navigator.clipboard.writeText(t);
        },
        isIframe () {
            try {
                return window?.self !== window?.top;
            } catch  {
                return !1;
            }
        },
        isSafeApp () {
            if (J.isClient() && window.self !== window.top) try {
                const t = window?.location?.ancestorOrigins?.[0], e = "https://app.safe.global";
                if (t) {
                    const s = new URL(t), n = new URL(e);
                    return s.hostname === n.hostname;
                }
            } catch  {
                return !1;
            }
            return !1;
        },
        getPairingExpiry () {
            return Date.now() + me.FOUR_MINUTES_MS;
        },
        getNetworkId (t) {
            return t?.split(":")[1];
        },
        getPlainAddress (t) {
            return t?.split(":")[2];
        },
        async wait (t) {
            return new Promise((e)=>{
                setTimeout(e, t);
            });
        },
        debounce (t, e = 500) {
            let s;
            return (...n)=>{
                function r() {
                    t(...n);
                }
                s && clearTimeout(s), s = setTimeout(r, e);
            };
        },
        isHttpUrl (t) {
            return t.startsWith("http://") || t.startsWith("https://");
        },
        formatNativeUrl (t, e, s = null) {
            if (J.isHttpUrl(t)) return this.formatUniversalUrl(t, e);
            let n = t, r = s;
            n && (n.includes("://") || (n = t.replaceAll("/", "").replaceAll(":", ""), n = `${n}://`), n.endsWith("/") || (n = `${n}/`)), r && !r?.endsWith("/") && (r = `${r}/`), this.isTelegram() && this.isAndroid() && (e = encodeURIComponent(e));
            const i = encodeURIComponent(e);
            return {
                redirect: `${n}wc?uri=${i}`,
                redirectUniversalLink: r ? `${r}wc?uri=${i}` : void 0,
                href: n
            };
        },
        formatUniversalUrl (t, e) {
            if (!J.isHttpUrl(t)) return this.formatNativeUrl(t, e);
            let s = t;
            s.endsWith("/") || (s = `${s}/`);
            const n = encodeURIComponent(e);
            return {
                redirect: `${s}wc?uri=${n}`,
                href: s
            };
        },
        getOpenTargetForPlatform (t) {
            return t === "popupWindow" ? t : this.isTelegram() ? $.getTelegramSocialProvider() ? "_top" : "_blank" : t;
        },
        openHref (t, e, s) {
            window?.open(t, this.getOpenTargetForPlatform(e), s || "noreferrer noopener");
        },
        returnOpenHref (t, e, s) {
            return window?.open(t, this.getOpenTargetForPlatform(e), s || "noreferrer noopener");
        },
        isTelegram () {
            return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
        },
        isPWA () {
            if (typeof window > "u") return !1;
            const t = window?.matchMedia && typeof window.matchMedia == "function" ? window.matchMedia("(display-mode: standalone)")?.matches : !1, e = window?.navigator?.standalone;
            return !!(t || e);
        },
        async preloadImage (t) {
            const e = new Promise((s, n)=>{
                const r = new Image;
                r.onload = s, r.onerror = n, r.crossOrigin = "anonymous", r.src = t;
            });
            return Promise.race([
                e,
                J.wait(2e3)
            ]);
        },
        parseBalance (t, e) {
            let s = "0.000";
            if (typeof t == "string") {
                const c = Number(t);
                if (!isNaN(c)) {
                    const l = (Math.floor(c * 1e3) / 1e3).toFixed(3);
                    l && (s = l);
                }
            }
            const [n, r] = s.split("."), i = n || "0", o = r || "000";
            return {
                formattedText: `${i}.${o}${e ? ` ${e}` : ""}`,
                value: i,
                decimals: o,
                symbol: e
            };
        },
        getApiUrl () {
            return S.W3M_API_URL;
        },
        getBlockchainApiUrl () {
            return S.BLOCKCHAIN_API_RPC_URL;
        },
        getAnalyticsUrl () {
            return S.PULSE_API_URL;
        },
        getUUID () {
            return crypto?.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t)=>{
                const e = Math.random() * 16 | 0;
                return (t === "x" ? e : e & 3 | 8).toString(16);
            });
        },
        parseError (t) {
            return typeof t == "string" ? t : typeof t?.issues?.[0]?.message == "string" ? t.issues[0].message : t instanceof Error ? t.message : "Unknown error";
        },
        sortRequestedNetworks (t, e = []) {
            const s = {};
            return e && t && (t.forEach((n, r)=>{
                s[n] = r;
            }), e.sort((n, r)=>{
                const i = s[n.id], o = s[r.id];
                return i !== void 0 && o !== void 0 ? i - o : i !== void 0 ? -1 : o !== void 0 ? 1 : 0;
            })), e;
        },
        calculateBalance (t) {
            let e = 0;
            for (const s of t)e += s.value ?? 0;
            return e;
        },
        formatTokenBalance (t) {
            const e = t.toFixed(2), [s, n] = e.split(".");
            return {
                dollars: s,
                pennies: n
            };
        },
        isAddress (t, e = "eip155") {
            switch(e){
                case "eip155":
                    if (/^(?:0x)?[0-9a-f]{40}$/iu.test(t)) {
                        if (/^(?:0x)?[0-9a-f]{40}$/iu.test(t) || /^(?:0x)?[0-9A-F]{40}$/iu.test(t)) return !0;
                    } else return !1;
                    return !1;
                case "solana":
                    return /[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(t);
                default:
                    return !1;
            }
        },
        uniqueBy (t, e) {
            const s = new Set;
            return t.filter((n)=>{
                const r = n[e];
                return s.has(r) ? !1 : (s.add(r), !0);
            });
        },
        generateSdkVersion (t, e, s) {
            const r = t.length === 0 ? me.ADAPTER_TYPES.UNIVERSAL : t.map((i)=>i.adapterType).join(",");
            return `${e}-${r}-${s}`;
        },
        createAccount (t, e, s, n, r) {
            return {
                namespace: t,
                address: e,
                type: s,
                publicKey: n,
                path: r
            };
        },
        isCaipAddress (t) {
            if (typeof t != "string") return !1;
            const e = t.split(":"), s = e[0];
            return e.filter(Boolean).length === 3 && s in S.CHAIN_NAME_MAP;
        },
        getAccount (t) {
            return t ? typeof t == "string" ? {
                address: t,
                chainId: void 0
            } : {
                address: t.address,
                chainId: t.chainId
            } : {
                address: void 0,
                chainId: void 0
            };
        },
        isMac () {
            const t = window?.navigator.userAgent.toLowerCase();
            return t.includes("macintosh") && !t.includes("safari");
        },
        formatTelegramSocialLoginUrl (t) {
            const e = `--${encodeURIComponent(window?.location.href)}`, s = "state=";
            if (new URL(t).host === "auth.magic.link") {
                const r = "provider_authorization_url=", i = t.substring(t.indexOf(r) + r.length), o = this.injectIntoUrl(decodeURIComponent(i), s, e);
                return t.replace(i, encodeURIComponent(o));
            }
            return this.injectIntoUrl(t, s, e);
        },
        injectIntoUrl (t, e, s) {
            const n = t.indexOf(e);
            if (n === -1) throw new Error(`${e} parameter not found in the URL: ${t}`);
            const r = t.indexOf("&", n), i = e.length, o = r !== -1 ? r : t.length, a = t.substring(0, n + i), c = t.substring(n + i, o), l = t.substring(r), d = c + s;
            return a + d + l;
        }
    };
    async function or(...t) {
        const e = await fetch(...t);
        if (!e.ok) throw new Error(`HTTP status code: ${e.status}`, {
            cause: e
        });
        return e;
    }
    class qr {
        constructor({ baseUrl: e, clientId: s }){
            this.baseUrl = e, this.clientId = s;
        }
        async get({ headers: e, signal: s, cache: n, ...r }) {
            const i = this.createUrl(r);
            return (await or(i, {
                method: "GET",
                headers: e,
                signal: s,
                cache: n
            })).json();
        }
        async getBlob({ headers: e, signal: s, ...n }) {
            const r = this.createUrl(n);
            return (await or(r, {
                method: "GET",
                headers: e,
                signal: s
            })).blob();
        }
        async post({ body: e, headers: s, signal: n, ...r }) {
            const i = this.createUrl(r);
            return (await or(i, {
                method: "POST",
                headers: s,
                body: e ? JSON.stringify(e) : void 0,
                signal: n
            })).json();
        }
        async put({ body: e, headers: s, signal: n, ...r }) {
            const i = this.createUrl(r);
            return (await or(i, {
                method: "PUT",
                headers: s,
                body: e ? JSON.stringify(e) : void 0,
                signal: n
            })).json();
        }
        async delete({ body: e, headers: s, signal: n, ...r }) {
            const i = this.createUrl(r);
            return (await or(i, {
                method: "DELETE",
                headers: s,
                body: e ? JSON.stringify(e) : void 0,
                signal: n
            })).json();
        }
        createUrl({ path: e, params: s }) {
            const n = new URL(e, this.baseUrl);
            return s && Object.entries(s).forEach(([r, i])=>{
                i && n.searchParams.append(r, i);
            }), this.clientId && n.searchParams.append("clientId", this.clientId), n;
        }
        sendBeacon({ body: e, ...s }) {
            const n = this.createUrl(s);
            return navigator.sendBeacon(n.toString(), e ? JSON.stringify(e) : void 0);
        }
    }
    let Ho, Z, rn, Fe, Tp, kp, Md, lt, Rt, Op, Pp, Rp, xp, $p, Ps, Up;
    Ho = {
        getFeatureValue (t, e) {
            const s = e?.[t];
            return s === void 0 ? me.DEFAULT_FEATURES[t] : s;
        },
        filterSocialsByPlatform (t) {
            if (!t || !t.length) return t;
            if (J.isTelegram()) {
                if (J.isIos()) return t.filter((e)=>e !== "google");
                if (J.isMac()) return t.filter((e)=>e !== "x");
                if (J.isAndroid()) return t.filter((e)=>![
                        "facebook",
                        "x"
                    ].includes(e));
            }
            return t;
        },
        isSocialsEnabled () {
            return Array.isArray(_.state.features?.socials) && _.state.features?.socials.length > 0 || Array.isArray(_.state.remoteFeatures?.socials) && _.state.remoteFeatures?.socials.length > 0;
        },
        isEmailEnabled () {
            return !!(_.state.features?.email || _.state.remoteFeatures?.email);
        }
    };
    Z = Oe({
        features: me.DEFAULT_FEATURES,
        projectId: "",
        sdkType: "appkit",
        sdkVersion: "html-wagmi-undefined",
        defaultAccountTypes: me.DEFAULT_ACCOUNT_TYPES,
        enableNetworkSwitch: !0,
        experimental_preferUniversalLinks: !1,
        remoteFeatures: {},
        enableMobileFullScreen: !1
    });
    _ = {
        state: Z,
        subscribeKey (t, e) {
            return Xe(Z, t, e);
        },
        setOptions (t) {
            Object.assign(Z, t);
        },
        setRemoteFeatures (t) {
            if (!t) return;
            const e = {
                ...Z.remoteFeatures,
                ...t
            };
            Z.remoteFeatures = e, Z.remoteFeatures?.socials && (Z.remoteFeatures.socials = Ho.filterSocialsByPlatform(Z.remoteFeatures.socials)), Z.features?.pay && (Z.remoteFeatures.email = !1, Z.remoteFeatures.socials = !1);
        },
        setFeatures (t) {
            if (!t) return;
            Z.features || (Z.features = me.DEFAULT_FEATURES);
            const e = {
                ...Z.features,
                ...t
            };
            Z.features = e, Z.features?.pay && Z.remoteFeatures && (Z.remoteFeatures.email = !1, Z.remoteFeatures.socials = !1);
        },
        setProjectId (t) {
            Z.projectId = t;
        },
        setCustomRpcUrls (t) {
            Z.customRpcUrls = t;
        },
        setAllWallets (t) {
            Z.allWallets = t;
        },
        setIncludeWalletIds (t) {
            Z.includeWalletIds = t;
        },
        setExcludeWalletIds (t) {
            Z.excludeWalletIds = t;
        },
        setFeaturedWalletIds (t) {
            Z.featuredWalletIds = t;
        },
        setTokens (t) {
            Z.tokens = t;
        },
        setTermsConditionsUrl (t) {
            Z.termsConditionsUrl = t;
        },
        setPrivacyPolicyUrl (t) {
            Z.privacyPolicyUrl = t;
        },
        setCustomWallets (t) {
            Z.customWallets = t;
        },
        setIsSiweEnabled (t) {
            Z.isSiweEnabled = t;
        },
        setIsUniversalProvider (t) {
            Z.isUniversalProvider = t;
        },
        setSdkVersion (t) {
            Z.sdkVersion = t;
        },
        setMetadata (t) {
            Z.metadata = t;
        },
        setDisableAppend (t) {
            Z.disableAppend = t;
        },
        setEIP6963Enabled (t) {
            Z.enableEIP6963 = t;
        },
        setDebug (t) {
            Z.debug = t;
        },
        setEnableWalletGuide (t) {
            Z.enableWalletGuide = t;
        },
        setEnableAuthLogger (t) {
            Z.enableAuthLogger = t;
        },
        setEnableWallets (t) {
            Z.enableWallets = t;
        },
        setPreferUniversalLinks (t) {
            Z.experimental_preferUniversalLinks = t;
        },
        setSIWX (t) {
            if (t) for (const [e, s] of Object.entries(me.SIWX_DEFAULTS))t[e] ??= s;
            Z.siwx = t;
        },
        setConnectMethodsOrder (t) {
            Z.features = {
                ...Z.features,
                connectMethodsOrder: t
            };
        },
        setWalletFeaturesOrder (t) {
            Z.features = {
                ...Z.features,
                walletFeaturesOrder: t
            };
        },
        setSocialsOrder (t) {
            Z.remoteFeatures = {
                ...Z.remoteFeatures,
                socials: t
            };
        },
        setCollapseWallets (t) {
            Z.features = {
                ...Z.features,
                collapseWallets: t
            };
        },
        setEnableEmbedded (t) {
            Z.enableEmbedded = t;
        },
        setAllowUnsupportedChain (t) {
            Z.allowUnsupportedChain = t;
        },
        setManualWCControl (t) {
            Z.manualWCControl = t;
        },
        setEnableNetworkSwitch (t) {
            Z.enableNetworkSwitch = t;
        },
        setEnableMobileFullScreen (t) {
            Z.enableMobileFullScreen = J.isMobile() && t;
        },
        setEnableReconnect (t) {
            Z.enableReconnect = t;
        },
        setDefaultAccountTypes (t = {}) {
            Object.entries(t).forEach(([e, s])=>{
                s && (Z.defaultAccountTypes[e] = s);
            });
        },
        setUniversalProviderConfigOverride (t) {
            Z.universalProviderConfigOverride = t;
        },
        getUniversalProviderConfigOverride () {
            return Z.universalProviderConfigOverride;
        },
        getSnapshot () {
            return xr(Z);
        }
    };
    rn = Object.freeze({
        message: "",
        variant: "success",
        svg: void 0,
        open: !1,
        autoClose: !0
    });
    Fe = Oe({
        ...rn
    });
    Tp = {
        state: Fe,
        subscribeKey (t, e) {
            return Xe(Fe, t, e);
        },
        showLoading (t, e = {}) {
            this._showMessage({
                message: t,
                variant: "loading",
                ...e
            });
        },
        showSuccess (t) {
            this._showMessage({
                message: t,
                variant: "success"
            });
        },
        showSvg (t, e) {
            this._showMessage({
                message: t,
                svg: e
            });
        },
        showError (t) {
            const e = J.parseError(t);
            this._showMessage({
                message: e,
                variant: "error"
            });
        },
        hide () {
            Fe.message = rn.message, Fe.variant = rn.variant, Fe.svg = rn.svg, Fe.open = rn.open, Fe.autoClose = rn.autoClose;
        },
        _showMessage ({ message: t, svg: e, variant: s = "success", autoClose: n = rn.autoClose }) {
            Fe.open ? (Fe.open = !1, setTimeout(()=>{
                Fe.message = t, Fe.variant = s, Fe.svg = e, Fe.open = !0, Fe.autoClose = n;
            }, 150)) : (Fe.message = t, Fe.variant = s, Fe.svg = e, Fe.open = !0, Fe.autoClose = n);
        }
    };
    rs = Tp;
    kp = {
        purchaseCurrencies: [
            {
                id: "2b92315d-eab7-5bef-84fa-089a131333f5",
                name: "USD Coin",
                symbol: "USDC",
                networks: [
                    {
                        name: "ethereum-mainnet",
                        display_name: "Ethereum",
                        chain_id: "1",
                        contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                    },
                    {
                        name: "polygon-mainnet",
                        display_name: "Polygon",
                        chain_id: "137",
                        contract_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
                    }
                ]
            },
            {
                id: "2b92315d-eab7-5bef-84fa-089a131333f5",
                name: "Ether",
                symbol: "ETH",
                networks: [
                    {
                        name: "ethereum-mainnet",
                        display_name: "Ethereum",
                        chain_id: "1",
                        contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                    },
                    {
                        name: "polygon-mainnet",
                        display_name: "Polygon",
                        chain_id: "137",
                        contract_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
                    }
                ]
            }
        ],
        paymentCurrencies: [
            {
                id: "USD",
                payment_method_limits: [
                    {
                        id: "card",
                        min: "10.00",
                        max: "7500.00"
                    },
                    {
                        id: "ach_bank_account",
                        min: "10.00",
                        max: "25000.00"
                    }
                ]
            },
            {
                id: "EUR",
                payment_method_limits: [
                    {
                        id: "card",
                        min: "10.00",
                        max: "7500.00"
                    },
                    {
                        id: "ach_bank_account",
                        min: "10.00",
                        max: "25000.00"
                    }
                ]
            }
        ]
    };
    Md = J.getBlockchainApiUrl();
    lt = Oe({
        clientId: null,
        api: new qr({
            baseUrl: Md,
            clientId: null
        }),
        supportedChains: {
            http: [],
            ws: []
        }
    });
    se = {
        state: lt,
        async get (t) {
            const { st: e, sv: s } = se.getSdkProperties(), n = _.state.projectId, r = {
                ...t.params || {},
                st: e,
                sv: s,
                projectId: n
            };
            return lt.api.get({
                ...t,
                params: r
            });
        },
        getSdkProperties () {
            const { sdkType: t, sdkVersion: e } = _.state;
            return {
                st: t || "unknown",
                sv: e || "unknown"
            };
        },
        async isNetworkSupported (t) {
            if (!t) return !1;
            try {
                lt.supportedChains.http.length || await se.getSupportedNetworks();
            } catch  {
                return !1;
            }
            return lt.supportedChains.http.includes(t);
        },
        async getSupportedNetworks () {
            try {
                const t = await se.get({
                    path: "v1/supported-chains"
                });
                return lt.supportedChains = t, t;
            } catch  {
                return lt.supportedChains;
            }
        },
        async fetchIdentity ({ address: t }) {
            const e = $.getIdentityFromCacheForAddress(t);
            if (e) return e;
            const s = await se.get({
                path: `/v1/identity/${t}`,
                params: {
                    sender: p.state.activeCaipAddress ? J.getPlainAddress(p.state.activeCaipAddress) : void 0
                }
            });
            return $.updateIdentityCache({
                address: t,
                identity: s,
                timestamp: Date.now()
            }), s;
        },
        async fetchTransactions ({ account: t, cursor: e, signal: s, cache: n, chainId: r }) {
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) return {
                data: [],
                next: void 0
            };
            const o = $.getTransactionsCacheForAddress({
                address: t,
                chainId: r
            });
            if (o) return o;
            const a = await se.get({
                path: `/v1/account/${t}/history`,
                params: {
                    cursor: e,
                    chainId: r
                },
                signal: s,
                cache: n
            });
            return $.updateTransactionsCache({
                address: t,
                chainId: r,
                timestamp: Date.now(),
                transactions: a
            }), a;
        },
        async fetchSwapQuote ({ amount: t, userAddress: e, from: s, to: n, gasPrice: r }) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: "/v1/convert/quotes",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {
                    amount: t,
                    userAddress: e,
                    from: s,
                    to: n,
                    gasPrice: r
                }
            }) : {
                quotes: []
            };
        },
        async fetchSwapTokens ({ chainId: t }) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: "/v1/convert/tokens",
                params: {
                    chainId: t
                }
            }) : {
                tokens: []
            };
        },
        async fetchTokenPrice ({ addresses: t }) {
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) return {
                fungibles: []
            };
            const s = $.getTokenPriceCacheForAddresses(t);
            if (s) return s;
            const n = await lt.api.post({
                path: "/v1/fungible/price",
                body: {
                    currency: "usd",
                    addresses: t,
                    projectId: _.state.projectId
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return $.updateTokenPriceCache({
                addresses: t,
                timestamp: Date.now(),
                tokenPrice: n
            }), n;
        },
        async fetchSwapAllowance ({ tokenAddress: t, userAddress: e }) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: "/v1/convert/allowance",
                params: {
                    tokenAddress: t,
                    userAddress: e
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }) : {
                allowance: "0"
            };
        },
        async fetchGasPrice ({ chainId: t }) {
            const { st: e, sv: s } = se.getSdkProperties();
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) throw new Error("Network not supported for Gas Price");
            return se.get({
                path: "/v1/convert/gas-price",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {
                    chainId: t,
                    st: e,
                    sv: s
                }
            });
        },
        async generateSwapCalldata ({ amount: t, from: e, to: s, userAddress: n, disableEstimate: r }) {
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) throw new Error("Network not supported for Swaps");
            return lt.api.post({
                path: "/v1/convert/build-transaction",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    amount: t,
                    eip155: {
                        slippage: me.CONVERT_SLIPPAGE_TOLERANCE
                    },
                    projectId: _.state.projectId,
                    from: e,
                    to: s,
                    userAddress: n,
                    disableEstimate: r
                }
            });
        },
        async generateApproveCalldata ({ from: t, to: e, userAddress: s }) {
            const { st: n, sv: r } = se.getSdkProperties();
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) throw new Error("Network not supported for Swaps");
            return se.get({
                path: "/v1/convert/build-approve",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {
                    userAddress: s,
                    from: t,
                    to: e,
                    st: n,
                    sv: r
                }
            });
        },
        async getBalance (t, e, s) {
            const { st: n, sv: r } = se.getSdkProperties();
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) return rs.showError("Token Balance Unavailable"), {
                balances: []
            };
            const o = `${e}:${t}`, a = $.getBalanceCacheForCaipAddress(o);
            if (a) return a;
            const c = await se.get({
                path: `/v1/account/${t}/balance`,
                params: {
                    currency: "usd",
                    chainId: e,
                    forceUpdate: s,
                    st: n,
                    sv: r
                }
            });
            return $.updateBalanceCache({
                caipAddress: o,
                balance: c,
                timestamp: Date.now()
            }), c;
        },
        async lookupEnsName (t) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: `/v1/profile/account/${t}`,
                params: {
                    apiVersion: "2"
                }
            }) : {
                addresses: {},
                attributes: []
            };
        },
        async reverseLookupEnsName ({ address: t }) {
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) return [];
            const s = p.getAccountData()?.address;
            return se.get({
                path: `/v1/profile/reverse/${t}`,
                params: {
                    sender: s,
                    apiVersion: "2"
                }
            });
        },
        async getEnsNameSuggestions (t) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: `/v1/profile/suggestions/${t}`,
                params: {
                    zone: "reown.id"
                }
            }) : {
                suggestions: []
            };
        },
        async registerEnsName ({ coinType: t, address: e, message: s, signature: n }) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? lt.api.post({
                path: "/v1/profile/account",
                body: {
                    coin_type: t,
                    address: e,
                    message: s,
                    signature: n
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }) : {
                success: !1
            };
        },
        async generateOnRampURL ({ destinationWallets: t, partnerUserId: e, defaultNetwork: s, purchaseAmount: n, paymentAmount: r }) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? (await lt.api.post({
                path: "/v1/generators/onrampurl",
                params: {
                    projectId: _.state.projectId
                },
                body: {
                    destinationWallets: t,
                    defaultNetwork: s,
                    partnerUserId: e,
                    defaultExperience: "buy",
                    presetCryptoAmount: n,
                    presetFiatAmount: r
                }
            })).url : "";
        },
        async getOnrampOptions () {
            if (!await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId)) return {
                paymentCurrencies: [],
                purchaseCurrencies: []
            };
            try {
                return await se.get({
                    path: "/v1/onramp/options"
                });
            } catch  {
                return kp;
            }
        },
        async getOnrampQuote ({ purchaseCurrency: t, paymentCurrency: e, amount: s, network: n }) {
            try {
                return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? await lt.api.post({
                    path: "/v1/onramp/quote",
                    params: {
                        projectId: _.state.projectId
                    },
                    body: {
                        purchaseCurrency: t,
                        paymentCurrency: e,
                        amount: s,
                        network: n
                    }
                }) : null;
            } catch  {
                return {
                    networkFee: {
                        amount: s,
                        currency: e.id
                    },
                    paymentSubtotal: {
                        amount: s,
                        currency: e.id
                    },
                    paymentTotal: {
                        amount: s,
                        currency: e.id
                    },
                    purchaseAmount: {
                        amount: s,
                        currency: e.id
                    },
                    quoteId: "mocked-quote-id"
                };
            }
        },
        async getSmartSessions (t) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? se.get({
                path: `/v1/sessions/${t}`
            }) : [];
        },
        async revokeSmartSession (t, e, s) {
            return await se.isNetworkSupported(p.state.activeCaipNetwork?.caipNetworkId) ? lt.api.post({
                path: `/v1/sessions/${t}/revoke`,
                params: {
                    projectId: _.state.projectId
                },
                body: {
                    pci: e,
                    signature: s
                }
            }) : {
                success: !1
            };
        },
        setClientId (t) {
            lt.clientId = t, lt.api = new qr({
                baseUrl: Md,
                clientId: t
            });
        }
    };
    Cs = {
        SAFE_RPC_METHODS: [
            "eth_accounts",
            "eth_blockNumber",
            "eth_call",
            "eth_chainId",
            "eth_estimateGas",
            "eth_feeHistory",
            "eth_gasPrice",
            "eth_getAccount",
            "eth_getBalance",
            "eth_getBlockByHash",
            "eth_getBlockByNumber",
            "eth_getBlockReceipts",
            "eth_getBlockTransactionCountByHash",
            "eth_getBlockTransactionCountByNumber",
            "eth_getCode",
            "eth_getFilterChanges",
            "eth_getFilterLogs",
            "eth_getLogs",
            "eth_getProof",
            "eth_getStorageAt",
            "eth_getTransactionByBlockHashAndIndex",
            "eth_getTransactionByBlockNumberAndIndex",
            "eth_getTransactionByHash",
            "eth_getTransactionCount",
            "eth_getTransactionReceipt",
            "eth_getUncleCountByBlockHash",
            "eth_getUncleCountByBlockNumber",
            "eth_maxPriorityFeePerGas",
            "eth_newBlockFilter",
            "eth_newFilter",
            "eth_newPendingTransactionFilter",
            "eth_sendRawTransaction",
            "eth_syncing",
            "eth_uninstallFilter",
            "wallet_getCapabilities",
            "wallet_getCallsStatus",
            "eth_getUserOperationReceipt",
            "eth_estimateUserOperationGas",
            "eth_getUserOperationByHash",
            "eth_supportedEntryPoints",
            "wallet_getAssets"
        ],
        NOT_SAFE_RPC_METHODS: [
            "personal_sign",
            "eth_signTypedData_v4",
            "eth_sendTransaction",
            "solana_signMessage",
            "solana_signTransaction",
            "solana_signAllTransactions",
            "solana_signAndSendTransaction",
            "wallet_sendCalls",
            "wallet_grantPermissions",
            "wallet_revokePermissions",
            "eth_sendUserOperation"
        ],
        GET_CHAIN_ID: "eth_chainId",
        RPC_METHOD_NOT_ALLOWED_MESSAGE: "Requested RPC call is not allowed",
        RPC_METHOD_NOT_ALLOWED_UI_MESSAGE: "Action not allowed",
        ACCOUNT_TYPES: {
            EOA: "eoa",
            SMART_ACCOUNT: "smartAccount"
        }
    };
    Rt = {
        PHANTOM: {
            id: "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
            url: "https://phantom.app"
        },
        SOLFLARE: {
            id: "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",
            url: "https://solflare.com"
        },
        COINBASE: {
            id: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
            url: "https://go.cb-w.com"
        },
        BINANCE: {
            id: "2fafea35bb471d22889ccb49c08d99dd0a18a37982602c33f696a5723934ba25",
            appId: "yFK5FCqYprrXDiVFbhyRx7",
            deeplink: "bnc://app.binance.com/mp/app",
            url: "https://app.binance.com/en/download"
        }
    };
    Op = {
        handleMobileDeeplinkRedirect (t, e) {
            const s = window.location.href, n = encodeURIComponent(s);
            if (t === Rt.PHANTOM.id && !("phantom" in window)) {
                const r = s.startsWith("https") ? "https" : "http", i = s.split("/")[2], o = encodeURIComponent(`${r}://${i}`);
                window.location.href = `${Rt.PHANTOM.url}/ul/browse/${n}?ref=${o}`;
            }
            if (t === Rt.SOLFLARE.id && !("solflare" in window) && (window.location.href = `${Rt.SOLFLARE.url}/ul/v1/browse/${n}?ref=${n}`), e === S.CHAIN.SOLANA && t === Rt.COINBASE.id && !("coinbaseSolana" in window) && (window.location.href = `${Rt.COINBASE.url}/dapp?cb_url=${n}`), e === S.CHAIN.BITCOIN && t === Rt.BINANCE.id && !("binancew3w" in window)) {
                const r = p.state.activeCaipNetwork, i = window.btoa("/pages/browser/index"), o = window.btoa(`url=${n}&defaultChainId=${r?.id ?? 1}`), a = new URL(Rt.BINANCE.deeplink);
                a.searchParams.set("appId", Rt.BINANCE.appId), a.searchParams.set("startPagePath", i), a.searchParams.set("startPageQuery", o);
                const c = new URL(Rt.BINANCE.url);
                c.searchParams.set("_dp", window.btoa(a.toString())), window.location.href = c.toString();
            }
        }
    };
    Pp = Object.freeze({
        enabled: !0,
        events: []
    });
    Rp = new qr({
        baseUrl: J.getAnalyticsUrl(),
        clientId: null
    });
    xp = 5;
    $p = 60 * 1e3;
    Ps = Oe({
        ...Pp
    });
    Up = {
        state: Ps,
        subscribeKey (t, e) {
            return Xe(Ps, t, e);
        },
        async sendError (t, e) {
            if (!Ps.enabled) return;
            const s = Date.now();
            if (Ps.events.filter((i)=>{
                const o = new Date(i.properties.timestamp || "").getTime();
                return s - o < $p;
            }).length >= xp) return;
            const r = {
                type: "error",
                event: e,
                properties: {
                    errorType: t.name,
                    errorMessage: t.message,
                    stackTrace: t.stack,
                    timestamp: new Date().toISOString()
                }
            };
            Ps.events.push(r);
            try {
                if (typeof window > "u") return;
                const { projectId: i, sdkType: o, sdkVersion: a } = _.state;
                await Rp.post({
                    path: "/e",
                    params: {
                        projectId: i,
                        st: o,
                        sv: a || "html-wagmi-4.2.2"
                    },
                    body: {
                        eventId: J.getUUID(),
                        url: window.location.href,
                        domain: window.location.hostname,
                        timestamp: new Date().toISOString(),
                        props: {
                            type: "error",
                            event: e,
                            errorType: t.name,
                            errorMessage: t.message,
                            stackTrace: t.stack
                        }
                    }
                });
            } catch  {}
        },
        enable () {
            Ps.enabled = !0;
        },
        disable () {
            Ps.enabled = !1;
        },
        clearEvents () {
            Ps.events = [];
        }
    };
    yn = class extends Error {
        constructor(e, s, n){
            super(e), this.originalName = "AppKitError", this.name = "AppKitError", this.category = s, this.originalError = n, n && n instanceof Error && (this.originalName = n.name), Object.setPrototypeOf(this, yn.prototype);
            let r = !1;
            if (n instanceof Error && typeof n.stack == "string" && n.stack) {
                const i = n.stack, o = i.indexOf(`
`);
                if (o > -1) {
                    const a = i.substring(o + 1);
                    this.stack = `${this.name}: ${this.message}
${a}`, r = !0;
                }
            }
            r || (Error.captureStackTrace ? Error.captureStackTrace(this, yn) : this.stack || (this.stack = `${this.name}: ${this.message}`));
        }
    };
    function pc(t, e) {
        let s = "";
        try {
            t instanceof Error ? s = t.message : typeof t == "string" ? s = t : typeof t == "object" && t !== null ? Object.keys(t).length === 0 ? s = "Unknown error" : s = t?.message || JSON.stringify(t) : s = String(t);
        } catch (r) {
            s = "Unknown error", console.error("Error parsing error message", r);
        }
        const n = t instanceof yn ? t : new yn(s, e, t);
        throw Up.sendError(n, n.category), n;
    }
    Bt = function(t, e = "INTERNAL_SDK_ERROR") {
        const s = {};
        return Object.keys(t).forEach((n)=>{
            const r = t[n];
            if (typeof r == "function") {
                let i = r;
                r.constructor.name === "AsyncFunction" ? i = async (...o)=>{
                    try {
                        return await r(...o);
                    } catch (a) {
                        return pc(a, e);
                    }
                } : i = (...o)=>{
                    try {
                        return r(...o);
                    } catch (a) {
                        return pc(a, e);
                    }
                }, s[n] = i;
            } else s[n] = r;
        }), s;
    };
    let Ct, Dp, Lp, ao, Mp, Bp, Fp, jp, fc, $e, Wp, dt, qp, gc, Hp, re, ve, Vp, hs, Vo, Fd, Kp, ye, zp, Gp, ar;
    Ct = Oe({
        walletImages: {},
        networkImages: {},
        chainImages: {},
        connectorImages: {},
        tokenImages: {},
        currencyImages: {}
    });
    Dp = {
        state: Ct,
        subscribeNetworkImages (t) {
            return Je(Ct.networkImages, ()=>t(Ct.networkImages));
        },
        subscribeKey (t, e) {
            return Xe(Ct, t, e);
        },
        subscribe (t) {
            return Je(Ct, ()=>t(Ct));
        },
        setWalletImage (t, e) {
            Ct.walletImages[t] = e;
        },
        setNetworkImage (t, e) {
            Ct.networkImages[t] = e;
        },
        setChainImage (t, e) {
            Ct.chainImages[t] = e;
        },
        setConnectorImage (t, e) {
            Ct.connectorImages = {
                ...Ct.connectorImages,
                [t]: e
            };
        },
        setTokenImage (t, e) {
            Ct.tokenImages[t] = e;
        },
        setCurrencyImage (t, e) {
            Ct.currencyImages[t] = e;
        }
    };
    Ut = Bt(Dp);
    Lp = {
        eip155: "ba0ba0cd-17c6-4806-ad93-f9d174f17900",
        solana: "a1b58899-f671-4276-6a5e-56ca5bd59700",
        polkadot: "",
        bip122: "0b4838db-0161-4ffe-022d-532bf03dba00",
        cosmos: "",
        sui: "",
        stacks: ""
    };
    ao = Oe({
        networkImagePromises: {}
    });
    Bd = {
        async fetchWalletImage (t) {
            if (t) return await ee._fetchWalletImage(t), this.getWalletImageById(t);
        },
        async fetchNetworkImage (t) {
            if (!t) return;
            const e = this.getNetworkImageById(t);
            return e || (ao.networkImagePromises[t] || (ao.networkImagePromises[t] = ee._fetchNetworkImage(t)), await ao.networkImagePromises[t], this.getNetworkImageById(t));
        },
        getWalletImageById (t) {
            if (t) return Ut.state.walletImages[t];
        },
        getWalletImage (t) {
            if (t?.image_url) return t?.image_url;
            if (t?.image_id) return Ut.state.walletImages[t.image_id];
        },
        getNetworkImage (t) {
            if (t?.assets?.imageUrl) return t?.assets?.imageUrl;
            if (t?.assets?.imageId) return Ut.state.networkImages[t.assets.imageId];
        },
        getNetworkImageById (t) {
            if (t) return Ut.state.networkImages[t];
        },
        getConnectorImage (t) {
            if (t?.imageUrl) return t.imageUrl;
            if (t?.info?.icon) return t.info.icon;
            if (t?.imageId) return Ut.state.connectorImages[t.imageId];
        },
        getChainImage (t) {
            return Ut.state.networkImages[Lp[t]];
        },
        getTokenImage (t) {
            if (t) return Ut.state.tokenImages[t];
        }
    };
    Mp = J.getAnalyticsUrl();
    Bp = new qr({
        baseUrl: Mp,
        clientId: null
    });
    Fp = [
        "MODAL_CREATED"
    ];
    jp = 45;
    fc = 1e3 * 10;
    $e = Oe({
        timestamp: Date.now(),
        lastFlush: Date.now(),
        reportedErrors: {},
        data: {
            type: "track",
            event: "MODAL_CREATED"
        },
        pendingEvents: [],
        subscribedToVisibilityChange: !1,
        walletImpressions: []
    });
    le = {
        state: $e,
        subscribe (t) {
            return Je($e, ()=>t($e));
        },
        getSdkProperties () {
            const { projectId: t, sdkType: e, sdkVersion: s } = _.state;
            return {
                projectId: t,
                st: e,
                sv: s || "html-wagmi-4.2.2"
            };
        },
        shouldFlushEvents () {
            const t = JSON.stringify($e.pendingEvents).length / 1024 > jp, e = $e.lastFlush + fc < Date.now();
            return t || e;
        },
        _setPendingEvent (t) {
            try {
                let e = p.getAccountData()?.address;
                if ("address" in t.data && t.data.address && (e = t.data.address), Fp.includes(t.data.event) || typeof window > "u") return;
                const s = p.getActiveCaipNetwork()?.caipNetworkId;
                this.state.pendingEvents.push({
                    eventId: J.getUUID(),
                    url: window.location.href,
                    domain: window.location.hostname,
                    timestamp: t.timestamp,
                    props: {
                        ...t.data,
                        address: e,
                        properties: {
                            ..."properties" in t.data ? t.data.properties : {},
                            caipNetworkId: s
                        }
                    }
                }), $e.reportedErrors.FORBIDDEN = !1, le.shouldFlushEvents() && le._submitPendingEvents();
            } catch (e) {
                console.warn("_setPendingEvent", e);
            }
        },
        sendEvent (t) {
            $e.timestamp = Date.now(), $e.data = t;
            const e = [
                "INITIALIZE",
                "CONNECT_SUCCESS",
                "SOCIAL_LOGIN_SUCCESS"
            ];
            (_.state.features?.analytics || e.includes(t.event)) && le._setPendingEvent($e), this.subscribeToFlushTriggers();
        },
        sendWalletImpressionEvent (t) {
            $e.walletImpressions.push(t);
        },
        _transformPendingEventsForBatch (t) {
            try {
                return t.filter((e)=>e.props.event !== "WALLET_IMPRESSION");
            } catch  {
                return t;
            }
        },
        _submitPendingEvents () {
            if ($e.lastFlush = Date.now(), !($e.pendingEvents.length === 0 && $e.walletImpressions.length === 0)) try {
                const t = le._transformPendingEventsForBatch($e.pendingEvents);
                $e.walletImpressions.length && t.push({
                    eventId: J.getUUID(),
                    url: window.location.href,
                    domain: window.location.hostname,
                    timestamp: Date.now(),
                    props: {
                        type: "track",
                        event: "WALLET_IMPRESSION",
                        items: [
                            ...$e.walletImpressions
                        ]
                    }
                }), Bp.sendBeacon({
                    path: "/batch",
                    params: le.getSdkProperties(),
                    body: t
                }), $e.reportedErrors.FORBIDDEN = !1, $e.pendingEvents = [], $e.walletImpressions = [];
            } catch  {
                $e.reportedErrors.FORBIDDEN = !0;
            }
        },
        subscribeToFlushTriggers () {
            $e.subscribedToVisibilityChange || typeof document > "u" || ($e.subscribedToVisibilityChange = !0, document?.addEventListener?.("visibilitychange", ()=>{
                document.visibilityState === "hidden" && le._submitPendingEvents();
            }), document?.addEventListener?.("freeze", ()=>{
                le._submitPendingEvents();
            }), window?.addEventListener?.("pagehide", ()=>{
                le._submitPendingEvents();
            }), setInterval(()=>{
                le._submitPendingEvents();
            }, fc));
        }
    };
    Wp = J.getApiUrl();
    dt = new qr({
        baseUrl: Wp,
        clientId: null
    });
    qp = 40;
    gc = 4;
    Hp = 20;
    re = Oe({
        promises: {},
        page: 1,
        count: 0,
        featured: [],
        allFeatured: [],
        recommended: [],
        allRecommended: [],
        wallets: [],
        filteredWallets: [],
        search: [],
        isAnalyticsEnabled: !1,
        excludedWallets: [],
        isFetchingRecommendedWallets: !1,
        explorerWallets: [],
        explorerFilteredWallets: []
    });
    ee = {
        state: re,
        subscribeKey (t, e) {
            return Xe(re, t, e);
        },
        _getSdkProperties () {
            const { projectId: t, sdkType: e, sdkVersion: s } = _.state;
            return {
                projectId: t,
                st: e || "appkit",
                sv: s || "html-wagmi-4.2.2"
            };
        },
        _filterOutExtensions (t) {
            return _.state.isUniversalProvider ? t.filter((e)=>!!(e.mobile_link || e.desktop_link || e.webapp_link)) : t;
        },
        async _fetchWalletImage (t) {
            const e = `${dt.baseUrl}/getWalletImage/${t}`, s = await dt.getBlob({
                path: e,
                params: ee._getSdkProperties()
            });
            Ut.setWalletImage(t, URL.createObjectURL(s));
        },
        async _fetchNetworkImage (t) {
            const e = `${dt.baseUrl}/public/getAssetImage/${t}`, s = await dt.getBlob({
                path: e,
                params: ee._getSdkProperties()
            });
            Ut.setNetworkImage(t, URL.createObjectURL(s));
        },
        async _fetchConnectorImage (t) {
            const e = `${dt.baseUrl}/public/getAssetImage/${t}`, s = await dt.getBlob({
                path: e,
                params: ee._getSdkProperties()
            });
            Ut.setConnectorImage(t, URL.createObjectURL(s));
        },
        async _fetchCurrencyImage (t) {
            const e = `${dt.baseUrl}/public/getCurrencyImage/${t}`, s = await dt.getBlob({
                path: e,
                params: ee._getSdkProperties()
            });
            Ut.setCurrencyImage(t, URL.createObjectURL(s));
        },
        async _fetchTokenImage (t) {
            const e = `${dt.baseUrl}/public/getTokenImage/${t}`, s = await dt.getBlob({
                path: e,
                params: ee._getSdkProperties()
            });
            Ut.setTokenImage(t, URL.createObjectURL(s));
        },
        _filterWalletsByPlatform (t) {
            const e = t.length, s = J.isMobile() ? t?.filter((r)=>r.mobile_link || r.webapp_link ? !0 : Object.values(Rt).map((o)=>o.id).includes(r.id)) : t, n = e - s.length;
            return {
                filteredWallets: s,
                mobileFilteredOutWalletsLength: n
            };
        },
        async fetchProjectConfig () {
            return (await dt.get({
                path: "/appkit/v1/config",
                params: ee._getSdkProperties()
            })).features;
        },
        async fetchAllowedOrigins () {
            try {
                const { allowedOrigins: t } = await dt.get({
                    path: "/projects/v1/origins",
                    params: ee._getSdkProperties()
                });
                return t;
            } catch (t) {
                if (t instanceof Error && t.cause instanceof Response) {
                    const e = t.cause.status;
                    if (e === S.HTTP_STATUS_CODES.TOO_MANY_REQUESTS) throw new Error("RATE_LIMITED", {
                        cause: t
                    });
                    if (e >= S.HTTP_STATUS_CODES.SERVER_ERROR && e < 600) throw new Error("SERVER_ERROR", {
                        cause: t
                    });
                    return [];
                }
                return [];
            }
        },
        async fetchNetworkImages () {
            const e = p.getAllRequestedCaipNetworks()?.map(({ assets: s })=>s?.imageId).filter(Boolean).filter((s)=>!Bd.getNetworkImageById(s));
            e && await Promise.allSettled(e.map((s)=>ee._fetchNetworkImage(s)));
        },
        async fetchConnectorImages () {
            const { connectors: t } = L.state, e = t.map(({ imageId: s })=>s).filter(Boolean);
            await Promise.allSettled(e.map((s)=>ee._fetchConnectorImage(s)));
        },
        async fetchCurrencyImages (t = []) {
            await Promise.allSettled(t.map((e)=>ee._fetchCurrencyImage(e)));
        },
        async fetchTokenImages (t = []) {
            await Promise.allSettled(t.map((e)=>ee._fetchTokenImage(e)));
        },
        async fetchWallets (t) {
            const e = t.exclude ?? [];
            ee._getSdkProperties().sv.startsWith("html-core-") && e.push(...Object.values(Rt).map((o)=>o.id));
            const n = await dt.get({
                path: "/getWallets",
                params: {
                    ...ee._getSdkProperties(),
                    ...t,
                    page: String(t.page),
                    entries: String(t.entries),
                    include: t.include?.join(","),
                    exclude: e.join(",")
                }
            }), { filteredWallets: r, mobileFilteredOutWalletsLength: i } = ee._filterWalletsByPlatform(n?.data);
            return {
                data: r || [],
                count: n?.count,
                mobileFilteredOutWalletsLength: i
            };
        },
        async prefetchWalletRanks () {
            const t = L.state.connectors;
            if (!t?.length) return;
            const e = {
                page: 1,
                entries: 20,
                badge: "certified"
            };
            if (e.names = t.map((r)=>r.name).join(","), p.state.activeChain === S.CHAIN.EVM) {
                const r = [
                    ...t.flatMap((i)=>i.connectors?.map((o)=>o.info?.rdns) || []),
                    ...t.map((i)=>i.info?.rdns)
                ].filter((i)=>typeof i == "string" && i.length > 0);
                r.length && (e.rdns = r.join(","));
            }
            const { data: s } = await ee.fetchWallets(e);
            re.explorerWallets = s;
            const n = p.getRequestedCaipNetworkIds().join(",");
            re.explorerFilteredWallets = s.filter((r)=>r.chains?.some((i)=>n.includes(i)));
        },
        async fetchFeaturedWallets () {
            const { featuredWalletIds: t } = _.state;
            if (t?.length) {
                const e = {
                    ...ee._getSdkProperties(),
                    page: 1,
                    entries: t?.length ?? gc,
                    include: t
                }, { data: s } = await ee.fetchWallets(e), n = [
                    ...s
                ].sort((i, o)=>t.indexOf(i.id) - t.indexOf(o.id)), r = n.map((i)=>i.image_id).filter(Boolean);
                await Promise.allSettled(r.map((i)=>ee._fetchWalletImage(i))), re.featured = n, re.allFeatured = n;
            }
        },
        async fetchRecommendedWallets () {
            try {
                re.isFetchingRecommendedWallets = !0;
                const { includeWalletIds: t, excludeWalletIds: e, featuredWalletIds: s } = _.state, n = [
                    ...e ?? [],
                    ...s ?? []
                ].filter(Boolean), r = p.getRequestedCaipNetworkIds().join(","), i = {
                    page: 1,
                    entries: gc,
                    include: t,
                    exclude: n,
                    chains: r
                }, { data: o, count: a } = await ee.fetchWallets(i), c = $.getRecentWallets(), l = o.map((h)=>h.image_id).filter(Boolean), d = c.map((h)=>h.image_id).filter(Boolean);
                await Promise.allSettled([
                    ...l,
                    ...d
                ].map((h)=>ee._fetchWalletImage(h))), re.recommended = o, re.allRecommended = o, re.count = a ?? 0;
            } catch  {} finally{
                re.isFetchingRecommendedWallets = !1;
            }
        },
        async fetchWalletsByPage ({ page: t }) {
            const { includeWalletIds: e, excludeWalletIds: s, featuredWalletIds: n } = _.state, r = p.getRequestedCaipNetworkIds().join(","), i = [
                ...re.recommended.map(({ id: h })=>h),
                ...s ?? [],
                ...n ?? []
            ].filter(Boolean), o = {
                page: t,
                entries: qp,
                include: e,
                exclude: i,
                chains: r
            }, { data: a, count: c, mobileFilteredOutWalletsLength: l } = await ee.fetchWallets(o);
            re.mobileFilteredOutWalletsLength = l + (re.mobileFilteredOutWalletsLength ?? 0);
            const d = a.slice(0, Hp).map((h)=>h.image_id).filter(Boolean);
            await Promise.allSettled(d.map((h)=>ee._fetchWalletImage(h))), re.wallets = J.uniqueBy([
                ...re.wallets,
                ...ee._filterOutExtensions(a)
            ], "id").filter((h)=>h.chains?.some((u)=>r.includes(u))), re.count = c > re.count ? c : re.count, re.page = t;
        },
        async initializeExcludedWallets ({ ids: t }) {
            const e = {
                page: 1,
                entries: t.length,
                include: t
            }, { data: s } = await ee.fetchWallets(e);
            s && s.forEach((n)=>{
                re.excludedWallets.push({
                    rdns: n.rdns,
                    name: n.name
                });
            });
        },
        async searchWallet ({ search: t, badge: e }) {
            const { includeWalletIds: s, excludeWalletIds: n } = _.state, r = p.getRequestedCaipNetworkIds().join(",");
            re.search = [];
            const i = {
                page: 1,
                entries: 100,
                search: t?.trim(),
                badge_type: e,
                include: s,
                exclude: n,
                chains: r
            }, { data: o } = await ee.fetchWallets(i);
            le.sendEvent({
                type: "track",
                event: "SEARCH_WALLET",
                properties: {
                    badge: e ?? "",
                    search: t ?? ""
                }
            });
            const a = o.map((c)=>c.image_id).filter(Boolean);
            await Promise.allSettled([
                ...a.map((c)=>ee._fetchWalletImage(c)),
                J.wait(300)
            ]), re.search = ee._filterOutExtensions(o);
        },
        initPromise (t, e) {
            const s = re.promises[t];
            return s || (re.promises[t] = e());
        },
        prefetch ({ fetchConnectorImages: t = !0, fetchFeaturedWallets: e = !0, fetchRecommendedWallets: s = !0, fetchNetworkImages: n = !0, fetchWalletRanks: r = !0 } = {}) {
            const i = [
                t && ee.initPromise("connectorImages", ee.fetchConnectorImages),
                e && ee.initPromise("featuredWallets", ee.fetchFeaturedWallets),
                s && ee.initPromise("recommendedWallets", ee.fetchRecommendedWallets),
                n && ee.initPromise("networkImages", ee.fetchNetworkImages),
                r && ee.initPromise("walletRanks", ee.prefetchWalletRanks)
            ].filter(Boolean);
            return Promise.allSettled(i);
        },
        prefetchAnalyticsConfig () {
            _.state.features?.analytics && ee.fetchAnalyticsConfig();
        },
        async fetchAnalyticsConfig () {
            try {
                const { isAnalyticsEnabled: t } = await dt.get({
                    path: "/getAnalyticsConfig",
                    params: ee._getSdkProperties()
                });
                _.setFeatures({
                    analytics: t
                });
            } catch  {
                _.setFeatures({
                    analytics: !1
                });
            }
        },
        filterByNamespaces (t) {
            if (!t?.length) {
                re.featured = re.allFeatured, re.recommended = re.allRecommended;
                return;
            }
            const e = p.getRequestedCaipNetworkIds().join(",");
            re.featured = re.allFeatured.filter((s)=>s.chains?.some((n)=>e.includes(n))), re.recommended = re.allRecommended.filter((s)=>s.chains?.some((n)=>e.includes(n))), re.filteredWallets = re.wallets.filter((s)=>s.chains?.some((n)=>e.includes(n)));
        },
        clearFilterByNamespaces () {
            re.filteredWallets = [];
        },
        setFilterByNamespace (t) {
            if (!t) {
                re.featured = re.allFeatured, re.recommended = re.allRecommended;
                return;
            }
            const e = p.getRequestedCaipNetworkIds().join(",");
            re.featured = re.allFeatured.filter((s)=>s.chains?.some((n)=>e.includes(n))), re.recommended = re.allRecommended.filter((s)=>s.chains?.some((n)=>e.includes(n))), re.filteredWallets = re.wallets.filter((s)=>s.chains?.some((n)=>e.includes(n)));
        }
    };
    ve = Oe({
        view: "Connect",
        history: [
            "Connect"
        ],
        transactionStack: []
    });
    Vp = {
        state: ve,
        subscribeKey (t, e) {
            return Xe(ve, t, e);
        },
        pushTransactionStack (t) {
            ve.transactionStack.push(t);
        },
        popTransactionStack (t) {
            const e = ve.transactionStack.pop();
            if (!e) return;
            const { onSuccess: s, onError: n, onCancel: r } = e;
            switch(t){
                case "success":
                    s?.();
                    break;
                case "error":
                    n?.(), te.goBack();
                    break;
                case "cancel":
                    r?.(), te.goBack();
                    break;
            }
        },
        push (t, e) {
            t !== ve.view && (ve.view = t, ve.history.push(t), ve.data = e);
        },
        reset (t, e) {
            ve.view = t, ve.history = [
                t
            ], ve.data = e;
        },
        replace (t, e) {
            ve.history.at(-1) === t || (ve.view = t, ve.history[ve.history.length - 1] = t, ve.data = e);
        },
        goBack () {
            const t = p.state.activeCaipAddress, e = te.state.view === "ConnectingFarcaster", s = !t && e;
            if (ve.history.length > 1) {
                ve.history.pop();
                const [n] = ve.history.slice(-1);
                n && (t && n === "Connect" ? ve.view = "Account" : ve.view = n);
            } else ue.close();
            ve.data?.wallet && (ve.data.wallet = void 0), ve.data?.redirectView && (ve.data.redirectView = void 0), setTimeout(()=>{
                if (s) {
                    p.setAccountProp("farcasterUrl", void 0, p.state.activeChain);
                    const n = L.getAuthConnector();
                    n?.provider?.reload();
                    const r = xr(_.state);
                    n?.provider?.syncDappData?.({
                        metadata: r.metadata,
                        sdkVersion: r.sdkVersion,
                        projectId: r.projectId,
                        sdkType: r.sdkType
                    });
                }
            }, 100);
        },
        goBackToIndex (t) {
            if (ve.history.length > 1) {
                ve.history = ve.history.slice(0, t + 1);
                const [e] = ve.history.slice(-1);
                e && (ve.view = e);
            }
        },
        goBackOrCloseModal () {
            te.state.history.length > 1 ? te.goBack() : ue.close();
        }
    };
    te = Bt(Vp);
    hs = Oe({
        themeMode: "dark",
        themeVariables: {},
        w3mThemeVariables: void 0
    });
    Vo = {
        state: hs,
        subscribe (t) {
            return Je(hs, ()=>t(hs));
        },
        setThemeMode (t) {
            hs.themeMode = t;
            try {
                const e = L.getAuthConnector();
                if (e) {
                    const s = Vo.getSnapshot().themeVariables;
                    e.provider.syncTheme({
                        themeMode: t,
                        themeVariables: s,
                        w3mThemeVariables: Si(s, t)
                    });
                }
            } catch  {
                console.info("Unable to sync theme to auth connector");
            }
        },
        setThemeVariables (t) {
            hs.themeVariables = {
                ...hs.themeVariables,
                ...t
            };
            try {
                const e = L.getAuthConnector();
                if (e) {
                    const s = Vo.getSnapshot().themeVariables;
                    e.provider.syncTheme({
                        themeVariables: s,
                        w3mThemeVariables: Si(hs.themeVariables, hs.themeMode)
                    });
                }
            } catch  {
                console.info("Unable to sync theme to auth connector");
            }
        },
        getSnapshot () {
            return xr(hs);
        }
    };
    It = Bt(Vo);
    Fd = Object.fromEntries(Rd.map((t)=>[
            t,
            void 0
        ]));
    Kp = Object.fromEntries(Rd.map((t)=>[
            t,
            !0
        ]));
    ye = Oe({
        allConnectors: [],
        connectors: [],
        activeConnector: void 0,
        filterByNamespace: void 0,
        activeConnectorIds: Fd,
        filterByNamespaceMap: Kp
    });
    zp = {
        state: ye,
        subscribe (t) {
            return Je(ye, ()=>{
                t(ye);
            });
        },
        subscribeKey (t, e) {
            return Xe(ye, t, e);
        },
        initialize (t) {
            t.forEach((e)=>{
                const s = $.getConnectedConnectorId(e);
                s && L.setConnectorId(s, e);
            });
        },
        setActiveConnector (t) {
            t && (ye.activeConnector = Yn(t));
        },
        setConnectors (t) {
            t.filter((r)=>!ye.allConnectors.some((i)=>i.id === r.id && L.getConnectorName(i.name) === L.getConnectorName(r.name) && i.chain === r.chain)).forEach((r)=>{
                r.type !== "MULTI_CHAIN" && ye.allConnectors.push(Yn(r));
            });
            const s = L.getEnabledNamespaces(), n = L.getEnabledConnectors(s);
            ye.connectors = L.mergeMultiChainConnectors(n);
        },
        filterByNamespaces (t) {
            Object.keys(ye.filterByNamespaceMap).forEach((e)=>{
                ye.filterByNamespaceMap[e] = !1;
            }), t.forEach((e)=>{
                ye.filterByNamespaceMap[e] = !0;
            }), L.updateConnectorsForEnabledNamespaces();
        },
        filterByNamespace (t, e) {
            ye.filterByNamespaceMap[t] = e, L.updateConnectorsForEnabledNamespaces();
        },
        updateConnectorsForEnabledNamespaces () {
            const t = L.getEnabledNamespaces(), e = L.getEnabledConnectors(t), s = L.areAllNamespacesEnabled();
            ye.connectors = L.mergeMultiChainConnectors(e), s ? ee.clearFilterByNamespaces() : ee.filterByNamespaces(t);
        },
        getEnabledNamespaces () {
            return Object.entries(ye.filterByNamespaceMap).filter(([t, e])=>e).map(([t])=>t);
        },
        getEnabledConnectors (t) {
            return ye.allConnectors.filter((e)=>t.includes(e.chain));
        },
        areAllNamespacesEnabled () {
            return Object.values(ye.filterByNamespaceMap).every((t)=>t);
        },
        mergeMultiChainConnectors (t) {
            const e = L.generateConnectorMapByName(t), s = [];
            return e.forEach((n)=>{
                const r = n[0], i = r?.id === S.CONNECTOR_ID.AUTH;
                n.length > 1 && r ? s.push({
                    name: r.name,
                    imageUrl: r.imageUrl,
                    imageId: r.imageId,
                    connectors: [
                        ...n
                    ],
                    type: i ? "AUTH" : "MULTI_CHAIN",
                    chain: "eip155",
                    id: r?.id || ""
                }) : r && s.push(r);
            }), s;
        },
        generateConnectorMapByName (t) {
            const e = new Map;
            return t.forEach((s)=>{
                const { name: n } = s, r = L.getConnectorName(n);
                if (!r) return;
                const i = e.get(r) || [];
                i.find((a)=>a.chain === s.chain) || i.push(s), e.set(r, i);
            }), e;
        },
        getConnectorName (t) {
            return t && ({
                "Trust Wallet": "Trust"
            }[t] || t);
        },
        getUniqueConnectorsByName (t) {
            const e = [];
            return t.forEach((s)=>{
                e.find((n)=>n.chain === s.chain) || e.push(s);
            }), e;
        },
        addConnector (t) {
            if (t.id === S.CONNECTOR_ID.AUTH) {
                const e = t, s = xr(_.state), n = It.getSnapshot().themeMode, r = It.getSnapshot().themeVariables;
                e?.provider?.syncDappData?.({
                    metadata: s.metadata,
                    sdkVersion: s.sdkVersion,
                    projectId: s.projectId,
                    sdkType: s.sdkType
                }), e?.provider?.syncTheme({
                    themeMode: n,
                    themeVariables: r,
                    w3mThemeVariables: Si(r, n)
                }), L.setConnectors([
                    t
                ]);
            } else L.setConnectors([
                t
            ]);
        },
        getAuthConnector (t) {
            const e = t || p.state.activeChain, s = ye.connectors.find((n)=>n.id === S.CONNECTOR_ID.AUTH);
            if (s) return s?.connectors?.length ? s.connectors.find((r)=>r.chain === e) : s;
        },
        getAnnouncedConnectorRdns () {
            return ye.connectors.filter((t)=>t.type === "ANNOUNCED").map((t)=>t.info?.rdns);
        },
        getConnectorById (t) {
            return ye.allConnectors.find((e)=>e.id === t);
        },
        getConnector ({ id: t, rdns: e, namespace: s }) {
            const n = s || p.state.activeChain;
            return ye.allConnectors.filter((i)=>i.chain === n).find((i)=>i.explorerId === t || i.info?.rdns === e);
        },
        syncIfAuthConnector (t) {
            if (t.id !== "ID_AUTH") return;
            const e = t, s = xr(_.state), n = It.getSnapshot().themeMode, r = It.getSnapshot().themeVariables;
            e?.provider?.syncDappData?.({
                metadata: s.metadata,
                sdkVersion: s.sdkVersion,
                sdkType: s.sdkType,
                projectId: s.projectId
            }), e.provider.syncTheme({
                themeMode: n,
                themeVariables: r,
                w3mThemeVariables: Si(r, n)
            });
        },
        getConnectorsByNamespace (t) {
            const e = ye.allConnectors.filter((s)=>s.chain === t);
            return L.mergeMultiChainConnectors(e);
        },
        canSwitchToSmartAccount (t) {
            return p.checkIfSmartAccountEnabled() && Lt(t) === Cs.ACCOUNT_TYPES.EOA;
        },
        selectWalletConnector (t) {
            const e = te.state.data?.redirectView, s = L.getConnector({
                id: t.id,
                rdns: t.rdns
            });
            Op.handleMobileDeeplinkRedirect(s?.explorerId || t.id, p.state.activeChain), s ? te.push("ConnectingExternal", {
                connector: s,
                wallet: t,
                redirectView: e
            }) : te.push("ConnectingWalletConnect", {
                wallet: t,
                redirectView: e
            });
        },
        getConnectors (t) {
            return t ? L.getConnectorsByNamespace(t) : L.mergeMultiChainConnectors(ye.allConnectors);
        },
        setFilterByNamespace (t) {
            ye.filterByNamespace = t, ye.connectors = L.getConnectors(t), ee.setFilterByNamespace(t);
        },
        setConnectorId (t, e) {
            t && (ye.activeConnectorIds = {
                ...ye.activeConnectorIds,
                [e]: t
            }, $.setConnectedConnectorId(e, t));
        },
        removeConnectorId (t) {
            ye.activeConnectorIds = {
                ...ye.activeConnectorIds,
                [t]: void 0
            }, $.deleteConnectedConnectorId(t);
        },
        getConnectorId (t) {
            if (t) return ye.activeConnectorIds[t];
        },
        isConnected (t) {
            return t ? !!ye.activeConnectorIds[t] : Object.values(ye.activeConnectorIds).some((e)=>!!e);
        },
        resetConnectorIds () {
            ye.activeConnectorIds = {
                ...Fd
            };
        }
    };
    L = Bt(zp);
    Gp = 1e3;
    ar = {
        checkNamespaceConnectorId (t, e) {
            return L.getConnectorId(t) === e;
        },
        isSocialProvider (t) {
            return me.DEFAULT_REMOTE_FEATURES.socials.includes(t);
        },
        connectWalletConnect ({ walletConnect: t, connector: e, closeModalOnConnect: s = !0, redirectViewOnModalClose: n = "Connect", onOpen: r, onConnect: i }) {
            return new Promise((o, a)=>{
                if (t && L.setActiveConnector(e), r?.(J.isMobile() && t), n) {
                    const l = ue.subscribeKey("open", (d)=>{
                        d || (te.state.view !== n && te.replace(n), l(), a(new Error("Modal closed")));
                    });
                }
                const c = p.subscribeKey("activeCaipAddress", (l)=>{
                    l && (i?.(), s && ue.close(), c(), o(it.parseCaipAddress(l)));
                });
            });
        },
        connectExternal (t) {
            return new Promise((e, s)=>{
                const n = p.subscribeKey("activeCaipAddress", (r)=>{
                    r && (ue.close(), n(), e(it.parseCaipAddress(r)));
                });
                H.connectExternal(t, t.chain).catch(()=>{
                    n(), s(new Error("Connection rejected"));
                });
            });
        },
        connectSocial ({ social: t, namespace: e, closeModalOnConnect: s = !0, onOpenFarcaster: n, onConnect: r }) {
            const i = p.getAccountData(e);
            let o = i?.socialWindow, a = i?.socialProvider, c = !1, l = null;
            const d = e || p.state.activeChain, h = p.subscribeKey("activeCaipAddress", (u)=>{
                u && (s && ue.close(), h());
            });
            return new Promise((u, f)=>{
                async function g(m) {
                    if (m.data?.resultUri) if (m.origin === S.SECURE_SITE_SDK_ORIGIN) {
                        window.removeEventListener("message", g, !1);
                        try {
                            const A = L.getAuthConnector(d);
                            if (A && !c) {
                                const v = p.getAccountData(d);
                                o && (o.close(), p.setAccountProp("socialWindow", void 0, d), o = v?.socialWindow), c = !0;
                                const P = m.data.resultUri;
                                if (a && le.sendEvent({
                                    type: "track",
                                    event: "SOCIAL_LOGIN_REQUEST_USER_DATA",
                                    properties: {
                                        provider: a
                                    }
                                }), a) {
                                    $.setConnectedSocialProvider(a), await H.connectExternal({
                                        id: A.id,
                                        type: A.type,
                                        socialUri: P
                                    }, A.chain);
                                    const j = p.state.activeCaipAddress;
                                    if (!j) {
                                        f(new Error("Failed to connect"));
                                        return;
                                    }
                                    u(it.parseCaipAddress(j)), le.sendEvent({
                                        type: "track",
                                        event: "SOCIAL_LOGIN_SUCCESS",
                                        properties: {
                                            provider: a
                                        }
                                    });
                                }
                            }
                        } catch (A) {
                            a && le.sendEvent({
                                type: "track",
                                event: "SOCIAL_LOGIN_ERROR",
                                properties: {
                                    provider: a,
                                    message: J.parseError(A)
                                }
                            }), f(new Error("Failed to connect"));
                        }
                    } else a && le.sendEvent({
                        type: "track",
                        event: "SOCIAL_LOGIN_ERROR",
                        properties: {
                            provider: a,
                            message: "Untrusted Origin"
                        }
                    });
                }
                async function w() {
                    if (t) {
                        const m = p.getAccountData(d);
                        p.setAccountProp("socialProvider", t, d), a = m?.socialProvider, le.sendEvent({
                            type: "track",
                            event: "SOCIAL_LOGIN_STARTED",
                            properties: {
                                provider: a
                            }
                        });
                    }
                    if (a === "farcaster") {
                        n?.();
                        const m = ue.subscribeKey("open", (v)=>{
                            !v && t === "farcaster" && (f(new Error("Popup closed")), r?.(), m());
                        }), A = L.getAuthConnector();
                        if (A && !p.getAccountData(d)?.farcasterUrl) try {
                            const { url: P } = await A.provider.getFarcasterUri();
                            p.setAccountProp("farcasterUrl", P, d);
                        } catch  {
                            f(new Error("Failed to connect to farcaster"));
                        }
                    } else {
                        const m = L.getAuthConnector();
                        l = J.returnOpenHref(`${S.SECURE_SITE_SDK_ORIGIN}/loading`, "popupWindow", "width=600,height=800,scrollbars=yes");
                        try {
                            if (m && a) {
                                const { uri: A } = await m.provider.getSocialRedirectUri({
                                    provider: a
                                });
                                if (l && A) {
                                    p.setAccountProp("socialWindow", Yn(l), d), o = i?.socialWindow, l.location.href = A;
                                    const v = setInterval(()=>{
                                        o?.closed && !c && (f(new Error("Popup closed")), clearInterval(v));
                                    }, 1e3);
                                    window.addEventListener("message", g, !1);
                                } else l?.close(), f(new Error("Failed to initiate social connection"));
                            }
                        } catch  {
                            f(new Error("Failed to initiate social connection")), l?.close();
                        }
                    }
                }
                w();
            });
        },
        connectEmail ({ closeModalOnConnect: t = !0, redirectViewOnModalClose: e = "Connect", onOpen: s, onConnect: n }) {
            return new Promise((r, i)=>{
                if (s?.(), e) {
                    const a = ue.subscribeKey("open", (c)=>{
                        c || (te.state.view !== e && te.replace(e), a(), i(new Error("Modal closed")));
                    });
                }
                const o = p.subscribeKey("activeCaipAddress", (a)=>{
                    a && (n?.(), t && ue.close(), o(), r(it.parseCaipAddress(a)));
                });
            });
        },
        async updateEmail () {
            const t = $.getConnectedConnectorId(p.state.activeChain), e = L.getAuthConnector();
            if (!e) throw new Error("No auth connector found");
            if (t !== S.CONNECTOR_ID.AUTH) throw new Error("Not connected to email or social");
            const s = e.provider.getEmail() ?? "";
            return await ue.open({
                view: "UpdateEmailWallet",
                data: {
                    email: s,
                    redirectView: void 0
                }
            }), new Promise((n, r)=>{
                const i = setInterval(()=>{
                    const a = e.provider.getEmail() ?? "";
                    a !== s && (ue.close(), clearInterval(i), o(), n({
                        email: a
                    }));
                }, Gp), o = ue.subscribeKey("open", (a)=>{
                    a || (te.state.view !== "Connect" && te.push("Connect"), clearInterval(i), o(), r(new Error("Modal closed")));
                });
            });
        },
        canSwitchToSmartAccount (t) {
            return p.checkIfSmartAccountEnabled() && Lt(t) === Cs.ACCOUNT_TYPES.EOA;
        }
    };
    jd = function() {
        const t = p.state.activeCaipNetwork?.chainNamespace || "eip155", e = p.state.activeCaipNetwork?.id || 1, s = me.NATIVE_TOKEN_ADDRESS[t];
        return `${t}:${e}:${s}`;
    };
    Lt = function(t) {
        return p.getAccountData(t)?.preferredAccountType;
    };
    ni = function(t) {
        return p.state.activeCaipNetwork;
    };
    const ki = {
        getConnectionStatus (t, e) {
            const s = L.state.activeConnectorIds[e], n = H.getConnections(e);
            return !!s && t.connectorId === s ? "connected" : n.some((o)=>o.connectorId.toLowerCase() === t.connectorId.toLowerCase()) ? "active" : "disconnected";
        },
        excludeConnectorAddressFromConnections ({ connections: t, connectorId: e, addresses: s }) {
            return t.map((n)=>{
                if ((e ? n.connectorId.toLowerCase() === e.toLowerCase() : !1) && s) {
                    const i = n.accounts.filter((o)=>!s.some((c)=>c.toLowerCase() === o.address.toLowerCase()));
                    return {
                        ...n,
                        accounts: i
                    };
                }
                return n;
            });
        },
        excludeExistingConnections (t, e) {
            const s = new Set(t);
            return e.filter((n)=>!s.has(n.connectorId));
        },
        getConnectionsByConnectorId (t, e) {
            return t.filter((s)=>s.connectorId.toLowerCase() === e.toLowerCase());
        },
        getConnectionsData (t) {
            const e = !!_.state.remoteFeatures?.multiWallet, s = L.state.activeConnectorIds[t], n = H.getConnections(t), i = (H.state.recentConnections.get(t) ?? []).filter((a)=>L.getConnectorById(a.connectorId)), o = ki.excludeExistingConnections([
                ...n.map((a)=>a.connectorId),
                ...s ? [
                    s
                ] : []
            ], i);
            return e ? {
                connections: n,
                recentConnections: o
            } : {
                connections: n.filter((a)=>a.connectorId.toLowerCase() === s?.toLowerCase()),
                recentConnections: []
            };
        }
    }, Pe = Oe({
        transactions: [],
        transactionsByYear: {},
        lastNetworkInView: void 0,
        loading: !1,
        empty: !1,
        next: void 0
    }), Yp = {
        state: Pe,
        subscribe (t) {
            return Je(Pe, ()=>t(Pe));
        },
        setLastNetworkInView (t) {
            Pe.lastNetworkInView = t;
        },
        async fetchTransactions (t) {
            if (!t) throw new Error("Transactions can't be fetched without an accountAddress");
            Pe.loading = !0;
            try {
                const e = await se.fetchTransactions({
                    account: t,
                    cursor: Pe.next,
                    chainId: p.state.activeCaipNetwork?.caipNetworkId
                }), s = wi.filterSpamTransactions(e.data), n = wi.filterByConnectedChain(s), r = [
                    ...Pe.transactions,
                    ...n
                ];
                Pe.loading = !1, Pe.transactions = r, Pe.transactionsByYear = wi.groupTransactionsByYearAndMonth(Pe.transactionsByYear, n), Pe.empty = r.length === 0, Pe.next = e.next ? e.next : void 0;
            } catch  {
                const s = p.state.activeChain;
                le.sendEvent({
                    type: "track",
                    event: "ERROR_FETCH_TRANSACTIONS",
                    properties: {
                        address: t,
                        projectId: _.state.projectId,
                        cursor: Pe.next,
                        isSmartAccount: Lt(s) === Cs.ACCOUNT_TYPES.SMART_ACCOUNT
                    }
                }), rs.showError("Failed to fetch transactions"), Pe.loading = !1, Pe.empty = !0, Pe.next = void 0;
            }
        },
        groupTransactionsByYearAndMonth (t = {}, e = []) {
            const s = t;
            return e.forEach((n)=>{
                const r = new Date(n.metadata.minedAt).getFullYear(), i = new Date(n.metadata.minedAt).getMonth(), o = s[r] ?? {}, c = (o[i] ?? []).filter((l)=>l.id !== n.id);
                s[r] = {
                    ...o,
                    [i]: [
                        ...c,
                        n
                    ].sort((l, d)=>new Date(d.metadata.minedAt).getTime() - new Date(l.metadata.minedAt).getTime())
                };
            }), s;
        },
        filterSpamTransactions (t) {
            return t.filter((e)=>!e.transfers.every((n)=>n.nft_info?.flags.is_spam === !0));
        },
        filterByConnectedChain (t) {
            const e = p.state.activeCaipNetwork?.caipNetworkId;
            return t.filter((n)=>n.metadata.chain === e);
        },
        clearCursor () {
            Pe.next = void 0;
        },
        resetTransactions () {
            Pe.transactions = [], Pe.transactionsByYear = {}, Pe.lastNetworkInView = void 0, Pe.loading = !1, Pe.empty = !1, Pe.next = void 0;
        }
    }, wi = Bt(Yp, "API_ERROR"), be = Oe({
        connections: new Map,
        recentConnections: new Map,
        isSwitchingConnection: !1,
        wcError: !1,
        buffering: !1,
        status: "disconnected"
    });
    let Qs;
    let Jp, co;
    Jp = {
        state: be,
        subscribe (t) {
            return Je(be, ()=>t(be));
        },
        subscribeKey (t, e) {
            return Xe(be, t, e);
        },
        _getClient () {
            return be._client;
        },
        setClient (t) {
            be._client = Yn(t);
        },
        initialize (t) {
            const e = t.filter((s)=>!!s.namespace).map((s)=>s.namespace);
            H.syncStorageConnections(e);
        },
        syncStorageConnections (t) {
            const e = $.getConnections(), s = t ?? Array.from(p.state.chains.keys());
            for (const n of s){
                const r = e[n] ?? [], i = new Map(be.recentConnections);
                i.set(n, r), be.recentConnections = i;
            }
        },
        getConnections (t) {
            return t ? be.connections.get(t) ?? [] : [];
        },
        hasAnyConnection (t) {
            const e = H.state.connections;
            return Array.from(e.values()).flatMap((s)=>s).some(({ connectorId: s })=>s === t);
        },
        async connectWalletConnect ({ cache: t = "auto" } = {}) {
            const e = J.isTelegram() || J.isSafari() && J.isIos();
            if (t === "always" || t === "auto" && e) {
                if (Qs) {
                    await Qs, Qs = void 0;
                    return;
                }
                if (!J.isPairingExpired(be?.wcPairingExpiry)) {
                    const s = be.wcUri;
                    be.wcUri = s;
                    return;
                }
                Qs = H._getClient()?.connectWalletConnect?.().catch(()=>{}), H.state.status = "connecting", await Qs, Qs = void 0, be.wcPairingExpiry = void 0, H.state.status = "connected";
            } else await H._getClient()?.connectWalletConnect?.();
        },
        async connectExternal (t, e, s = !0) {
            const n = await H._getClient()?.connectExternal?.(t);
            return s && p.setActiveNamespace(e), n;
        },
        async reconnectExternal (t) {
            await H._getClient()?.reconnectExternal?.(t);
            const e = t.chain || p.state.activeChain;
            e && L.setConnectorId(t.id, e);
        },
        async setPreferredAccountType (t, e) {
            if (!e) return;
            ue.setLoading(!0, p.state.activeChain);
            const s = L.getAuthConnector();
            s && (p.setAccountProp("preferredAccountType", t, e), await s.provider.setPreferredAccount(t), $.setPreferredAccountTypes(Object.entries(p.state.chains).reduce((n, [r, i])=>{
                const o = r, a = Lt(o);
                return a !== void 0 && (n[o] = a), n;
            }, {})), await H.reconnectExternal(s), ue.setLoading(!1, p.state.activeChain), le.sendEvent({
                type: "track",
                event: "SET_PREFERRED_ACCOUNT_TYPE",
                properties: {
                    accountType: t,
                    network: p.state.activeCaipNetwork?.caipNetworkId || ""
                }
            }));
        },
        async signMessage (t) {
            return H._getClient()?.signMessage(t);
        },
        parseUnits (t, e) {
            return H._getClient()?.parseUnits(t, e);
        },
        formatUnits (t, e) {
            return H._getClient()?.formatUnits(t, e);
        },
        updateBalance (t) {
            return H._getClient()?.updateBalance(t);
        },
        async sendTransaction (t) {
            return H._getClient()?.sendTransaction(t);
        },
        async getCapabilities (t) {
            return H._getClient()?.getCapabilities(t);
        },
        async grantPermissions (t) {
            return H._getClient()?.grantPermissions(t);
        },
        async walletGetAssets (t) {
            return H._getClient()?.walletGetAssets(t) ?? {};
        },
        async estimateGas (t) {
            return H._getClient()?.estimateGas(t);
        },
        async writeContract (t) {
            return H._getClient()?.writeContract(t);
        },
        async getEnsAddress (t) {
            return H._getClient()?.getEnsAddress(t);
        },
        async getEnsAvatar (t) {
            return H._getClient()?.getEnsAvatar(t);
        },
        checkInstalled (t) {
            return H._getClient()?.checkInstalled?.(t) || !1;
        },
        resetWcConnection () {
            be.wcUri = void 0, be.wcPairingExpiry = void 0, be.wcLinking = void 0, be.recentWallet = void 0, be.status = "disconnected", wi.resetTransactions(), $.deleteWalletConnectDeepLink(), $.deleteRecentWallet();
        },
        resetUri () {
            be.wcUri = void 0, be.wcPairingExpiry = void 0, Qs = void 0;
        },
        finalizeWcConnection (t) {
            const { wcLinking: e, recentWallet: s } = H.state;
            e && $.setWalletConnectDeepLink(e), s && $.setAppKitRecent(s), t && le.sendEvent({
                type: "track",
                event: "CONNECT_SUCCESS",
                address: t,
                properties: {
                    method: e ? "mobile" : "qrcode",
                    name: te.state.data?.wallet?.name || "Unknown",
                    view: te.state.view,
                    walletRank: s?.order
                }
            });
        },
        setWcBasic (t) {
            be.wcBasic = t;
        },
        setUri (t) {
            be.wcUri = t, be.wcPairingExpiry = J.getPairingExpiry();
        },
        setWcLinking (t) {
            be.wcLinking = t;
        },
        setWcError (t) {
            be.wcError = t, be.buffering = !1;
        },
        setRecentWallet (t) {
            be.recentWallet = t;
        },
        setBuffering (t) {
            be.buffering = t;
        },
        setStatus (t) {
            be.status = t;
        },
        setIsSwitchingConnection (t) {
            be.isSwitchingConnection = t;
        },
        async disconnect ({ id: t, namespace: e, initialDisconnect: s } = {}) {
            try {
                await H._getClient()?.disconnect({
                    id: t,
                    chainNamespace: e,
                    initialDisconnect: s
                });
            } catch (n) {
                throw new yn("Failed to disconnect", "INTERNAL_SDK_ERROR", n);
            }
        },
        async disconnectConnector ({ id: t, namespace: e }) {
            try {
                await H._getClient()?.disconnectConnector({
                    id: t,
                    namespace: e
                });
            } catch (s) {
                throw new yn("Failed to disconnect connector", "INTERNAL_SDK_ERROR", s);
            }
        },
        setConnections (t, e) {
            const s = new Map(be.connections);
            s.set(e, t), be.connections = s;
        },
        async handleAuthAccountSwitch ({ address: t, namespace: e }) {
            const n = p.getAccountData(e)?.user?.accounts?.find((i)=>i.type === "smartAccount"), r = n && n.address.toLowerCase() === t.toLowerCase() && ar.canSwitchToSmartAccount(e) ? "smartAccount" : "eoa";
            await H.setPreferredAccountType(r, e);
        },
        async handleActiveConnection ({ connection: t, namespace: e, address: s }) {
            const n = L.getConnectorById(t.connectorId), r = t.connectorId === S.CONNECTOR_ID.AUTH;
            if (!n) throw new Error(`No connector found for connection: ${t.connectorId}`);
            if (r) r && s && await H.handleAuthAccountSwitch({
                address: s,
                namespace: e
            });
            else return (await H.connectExternal({
                id: n.id,
                type: n.type,
                provider: n.provider,
                address: s,
                chain: e
            }, e))?.address;
            return s;
        },
        async handleDisconnectedConnection ({ connection: t, namespace: e, address: s, closeModalOnConnect: n }) {
            const r = L.getConnectorById(t.connectorId), i = t.auth?.name?.toLowerCase(), o = t.connectorId === S.CONNECTOR_ID.AUTH, a = t.connectorId === S.CONNECTOR_ID.WALLET_CONNECT;
            if (!r) throw new Error(`No connector found for connection: ${t.connectorId}`);
            let c;
            if (o) if (i && ar.isSocialProvider(i)) {
                const { address: l } = await ar.connectSocial({
                    social: i,
                    closeModalOnConnect: n,
                    onOpenFarcaster () {
                        ue.open({
                            view: "ConnectingFarcaster"
                        });
                    },
                    onConnect () {
                        te.replace("ProfileWallets");
                    }
                });
                c = l;
            } else {
                const { address: l } = await ar.connectEmail({
                    closeModalOnConnect: n,
                    onOpen () {
                        ue.open({
                            view: "EmailLogin"
                        });
                    },
                    onConnect () {
                        te.replace("ProfileWallets");
                    }
                });
                c = l;
            }
            else if (a) {
                const { address: l } = await ar.connectWalletConnect({
                    walletConnect: !0,
                    connector: r,
                    closeModalOnConnect: n,
                    onOpen (d) {
                        const h = d ? "AllWallets" : "ConnectingWalletConnect";
                        ue.state.open ? te.push(h) : ue.open({
                            view: h
                        });
                    },
                    onConnect () {
                        te.replace("ProfileWallets");
                    }
                });
                c = l;
            } else {
                const l = await H.connectExternal({
                    id: r.id,
                    type: r.type,
                    provider: r.provider,
                    chain: e
                }, e);
                l && (c = l.address);
            }
            return o && s && await H.handleAuthAccountSwitch({
                address: s,
                namespace: e
            }), c;
        },
        async switchConnection ({ connection: t, address: e, namespace: s, closeModalOnConnect: n, onChange: r }) {
            let i;
            const o = p.getAccountData(s)?.caipAddress;
            if (o) {
                const { address: c } = it.parseCaipAddress(o);
                i = c;
            }
            const a = ki.getConnectionStatus(t, s);
            switch(a){
                case "connected":
                case "active":
                    {
                        const c = await H.handleActiveConnection({
                            connection: t,
                            namespace: s,
                            address: e
                        });
                        if (i && c) {
                            const l = c.toLowerCase() !== i.toLowerCase();
                            r?.({
                                address: c,
                                namespace: s,
                                hasSwitchedAccount: l,
                                hasSwitchedWallet: a === "active"
                            });
                        }
                        break;
                    }
                case "disconnected":
                    {
                        const c = await H.handleDisconnectedConnection({
                            connection: t,
                            namespace: s,
                            address: e,
                            closeModalOnConnect: n
                        });
                        c && r?.({
                            address: c,
                            namespace: s,
                            hasSwitchedAccount: !0,
                            hasSwitchedWallet: !0
                        });
                        break;
                    }
                default:
                    throw new Error(`Invalid connection status: ${a}`);
            }
        }
    };
    H = Bt(Jp);
    co = {
        createBalance (t, e) {
            const s = {
                name: t.metadata.name || "",
                symbol: t.metadata.symbol || "",
                decimals: t.metadata.decimals || 0,
                value: t.metadata.value || 0,
                price: t.metadata.price || 0,
                iconUrl: t.metadata.iconUrl || ""
            };
            return {
                name: s.name,
                symbol: s.symbol,
                chainId: e,
                address: t.address === "native" ? void 0 : this.convertAddressToCAIP10Address(t.address, e),
                value: s.value,
                price: s.price,
                quantity: {
                    decimals: s.decimals.toString(),
                    numeric: this.convertHexToBalance({
                        hex: t.balance,
                        decimals: s.decimals
                    })
                },
                iconUrl: s.iconUrl
            };
        },
        convertHexToBalance ({ hex: t, decimals: e }) {
            return Td(BigInt(t), e);
        },
        convertAddressToCAIP10Address (t, e) {
            return `${e}:${t}`;
        },
        createCAIP2ChainId (t, e) {
            return `${e}:${parseInt(t, 16)}`;
        },
        getChainIdHexFromCAIP2ChainId (t) {
            const e = t.split(":");
            if (e.length < 2 || !e[1]) return "0x0";
            const s = e[1], n = parseInt(s, 10);
            return isNaN(n) ? "0x0" : `0x${n.toString(16)}`;
        },
        isWalletGetAssetsResponse (t) {
            return typeof t != "object" || t === null ? !1 : Object.values(t).every((e)=>Array.isArray(e) && e.every((s)=>this.isValidAsset(s)));
        },
        isValidAsset (t) {
            return typeof t == "object" && t !== null && typeof t.address == "string" && typeof t.balance == "string" && (t.type === "ERC20" || t.type === "NATIVE") && typeof t.metadata == "object" && t.metadata !== null && typeof t.metadata.name == "string" && typeof t.metadata.symbol == "string" && typeof t.metadata.decimals == "number" && typeof t.metadata.price == "number" && typeof t.metadata.iconUrl == "string";
        }
    };
    let lo;
    async function mc() {
        if (!lo) {
            const { createPublicClient: t, http: e, defineChain: s } = await _i(async ()=>{
                const { createPublicClient: n, http: r, defineChain: i } = await import("./vendor-viem-Cgtp5ekC.js").then((o)=>o.W);
                return {
                    createPublicClient: n,
                    http: r,
                    defineChain: i
                };
            }, []);
            lo = {
                createPublicClient: t,
                http: e,
                defineChain: s
            };
        }
        return lo;
    }
    let Ko, kn, Es, ge, Zp, ce, ho, ri, q, Wd, Qp, ht, ef, Oi, ut, xe, Nr, zo, tf, we, sf, Go, jt, nf, wc, rf, St, of, _r, af, cf;
    Ko = {
        getBlockchainApiRpcUrl (t, e) {
            const s = new URL("https://rpc.walletconnect.org/v1/");
            return s.searchParams.set("chainId", t), s.searchParams.set("projectId", e), s.toString();
        },
        async getViemChain (t) {
            const { defineChain: e } = await mc(), { chainId: s } = it.parseCaipNetworkId(t.caipNetworkId);
            return e({
                ...t,
                id: Number(s)
            });
        },
        async createViemPublicClient (t) {
            const { createPublicClient: e, http: s } = await mc(), n = _.state.projectId, r = await Ko.getViemChain(t);
            if (!r) throw new Error(`Chain ${t.caipNetworkId} not found in viem/chains`);
            return e({
                chain: r,
                transport: s(Ko.getBlockchainApiRpcUrl(t.caipNetworkId, n))
            });
        }
    };
    xa = {
        async getMyTokensWithBalance (t) {
            const e = p.getAccountData()?.address, s = p.state.activeCaipNetwork, n = L.getConnectorId("eip155") === S.CONNECTOR_ID.AUTH;
            if (!e || !s) return [];
            const r = `${s.caipNetworkId}:${e}`, i = $.getBalanceCacheForCaipAddress(r);
            if (i) return i.balances;
            if (s.chainNamespace === S.CHAIN.EVM && n) {
                const a = await this.getEIP155Balances(e, s);
                if (a) return this.filterLowQualityTokens(a);
            }
            const o = await se.getBalance(e, s.caipNetworkId, t);
            return this.filterLowQualityTokens(o.balances);
        },
        async getEIP155Balances (t, e) {
            try {
                const s = co.getChainIdHexFromCAIP2ChainId(e.caipNetworkId);
                if (!(await H.getCapabilities(t))?.[s]?.assetDiscovery?.supported) return null;
                const r = await H.walletGetAssets({
                    account: t,
                    chainFilter: [
                        s
                    ]
                });
                if (!co.isWalletGetAssetsResponse(r)) return null;
                const o = (r[s] || []).map((a)=>co.createBalance(a, e.caipNetworkId));
                return $.updateBalanceCache({
                    caipAddress: `${e.caipNetworkId}:${t}`,
                    balance: {
                        balances: o
                    },
                    timestamp: Date.now()
                }), o;
            } catch  {
                return null;
            }
        },
        filterLowQualityTokens (t) {
            return t.filter((e)=>e.quantity.decimals !== "0");
        },
        async fetchERC20Balance ({ caipAddress: t, assetAddress: e, caipNetwork: s }) {
            const n = await Ko.createViemPublicClient(s), { address: r } = it.parseCaipAddress(t), [{ result: i }, { result: o }, { result: a }, { result: c }] = await n.multicall({
                contracts: [
                    {
                        address: e,
                        functionName: "name",
                        args: [],
                        abi: ei
                    },
                    {
                        address: e,
                        functionName: "symbol",
                        args: [],
                        abi: ei
                    },
                    {
                        address: e,
                        functionName: "balanceOf",
                        args: [
                            r
                        ],
                        abi: ei
                    },
                    {
                        address: e,
                        functionName: "decimals",
                        args: [],
                        abi: ei
                    }
                ]
            });
            return {
                name: i,
                symbol: o,
                decimals: c,
                balance: a && c ? Td(a, c) : "0"
            };
        }
    };
    kn = Oe({
        loading: !1,
        open: !1,
        selectedNetworkId: void 0,
        activeChain: void 0,
        initialized: !1
    });
    Es = {
        state: kn,
        subscribe (t) {
            return Je(kn, ()=>t(kn));
        },
        subscribeOpen (t) {
            return Xe(kn, "open", t);
        },
        set (t) {
            Object.assign(kn, {
                ...kn,
                ...t
            });
        }
    };
    Xp = {
        async getTokenList (t) {
            return (await se.fetchSwapTokens({
                chainId: t
            }))?.tokens?.map((n)=>({
                    ...n,
                    eip2612: !1,
                    quantity: {
                        decimals: "0",
                        numeric: "0"
                    },
                    price: 0,
                    value: 0
                })) || [];
        },
        async fetchGasPrice () {
            const t = p.state.activeCaipNetwork;
            if (!t) return null;
            try {
                if (t.chainNamespace === "solana") {
                    const e = (await H?.estimateGas({
                        chainNamespace: "solana"
                    }))?.toString();
                    return {
                        standard: e,
                        fast: e,
                        instant: e
                    };
                } else return await se.fetchGasPrice({
                    chainId: t.caipNetworkId
                });
            } catch  {
                return null;
            }
        },
        async fetchSwapAllowance ({ tokenAddress: t, userAddress: e, sourceTokenAmount: s, sourceTokenDecimals: n }) {
            const r = await se.fetchSwapAllowance({
                tokenAddress: t,
                userAddress: e
            });
            if (r?.allowance && s && n) {
                const i = H.parseUnits(s, n) || 0;
                return BigInt(r.allowance) >= i;
            }
            return !1;
        },
        async getMyTokensWithBalance (t) {
            const e = await xa.getMyTokensWithBalance(t);
            return p.setAccountProp("tokenBalance", e, p.state.activeChain), this.mapBalancesToSwapTokens(e);
        },
        mapBalancesToSwapTokens (t) {
            return t?.map((e)=>({
                    ...e,
                    address: e?.address ? e.address : jd(),
                    decimals: parseInt(e.quantity.decimals, 10),
                    logoUri: e.iconUrl,
                    eip2612: !1
                })) || [];
        },
        async handleSwapError (t) {
            try {
                const e = t?.cause;
                return e?.json && (await e.json())?.reasons?.[0]?.description?.includes("insufficient liquidity") ? "Insufficient liquidity" : void 0;
            } catch  {
                return;
            }
        }
    };
    ge = Oe({
        tokenBalances: [],
        loading: !1
    });
    Zp = {
        state: ge,
        subscribe (t) {
            return Je(ge, ()=>t(ge));
        },
        subscribeKey (t, e) {
            return Xe(ge, t, e);
        },
        setToken (t) {
            t && (ge.token = Yn(t));
        },
        setTokenAmount (t) {
            ge.sendTokenAmount = t;
        },
        setReceiverAddress (t) {
            ge.receiverAddress = t;
        },
        setReceiverProfileImageUrl (t) {
            ge.receiverProfileImageUrl = t;
        },
        setReceiverProfileName (t) {
            ge.receiverProfileName = t;
        },
        setNetworkBalanceInUsd (t) {
            ge.networkBalanceInUSD = t;
        },
        setLoading (t) {
            ge.loading = t;
        },
        getSdkEventProperties (t) {
            return {
                message: J.parseError(t),
                isSmartAccount: Lt(p.state.activeChain) === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                token: ge.token?.symbol || "",
                amount: ge.sendTokenAmount ?? 0,
                network: p.state.activeCaipNetwork?.caipNetworkId || ""
            };
        },
        async sendToken () {
            try {
                switch(ce.setLoading(!0), p.state.activeCaipNetwork?.chainNamespace){
                    case "eip155":
                        await ce.sendEvmToken();
                        return;
                    case "solana":
                        await ce.sendSolanaToken();
                        return;
                    default:
                        throw new Error("Unsupported chain");
                }
            } catch (t) {
                throw Ks.isUserRejectedRequestError(t) ? new Ud(t) : t;
            } finally{
                ce.setLoading(!1);
            }
        },
        async sendEvmToken () {
            const t = p.state.activeChain;
            if (!t) throw new Error("SendController:sendEvmToken - activeChainNamespace is required");
            const e = Lt(t);
            if (!ce.state.sendTokenAmount || !ce.state.receiverAddress) throw new Error("An amount and receiver address are required");
            if (!ce.state.token) throw new Error("A token is required");
            if (ce.state.token?.address) {
                le.sendEvent({
                    type: "track",
                    event: "SEND_INITIATED",
                    properties: {
                        isSmartAccount: e === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                        token: ce.state.token.address,
                        amount: ce.state.sendTokenAmount,
                        network: p.state.activeCaipNetwork?.caipNetworkId || ""
                    }
                });
                const { hash: s } = await ce.sendERC20Token({
                    receiverAddress: ce.state.receiverAddress,
                    tokenAddress: ce.state.token.address,
                    sendTokenAmount: ce.state.sendTokenAmount,
                    decimals: ce.state.token.quantity.decimals
                });
                s && (ge.hash = s);
            } else {
                le.sendEvent({
                    type: "track",
                    event: "SEND_INITIATED",
                    properties: {
                        isSmartAccount: e === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                        token: ce.state.token.symbol || "",
                        amount: ce.state.sendTokenAmount,
                        network: p.state.activeCaipNetwork?.caipNetworkId || ""
                    }
                });
                const { hash: s } = await ce.sendNativeToken({
                    receiverAddress: ce.state.receiverAddress,
                    sendTokenAmount: ce.state.sendTokenAmount,
                    decimals: ce.state.token.quantity.decimals
                });
                s && (ge.hash = s);
            }
        },
        async fetchTokenBalance (t) {
            ge.loading = !0;
            const e = p.state.activeChain, s = p.state.activeCaipNetwork?.caipNetworkId, n = p.state.activeCaipNetwork?.chainNamespace, r = p.getAccountData(e)?.caipAddress ?? p.state.activeCaipAddress, i = r ? J.getPlainAddress(r) : void 0;
            if (ge.lastRetry && !J.isAllowedRetry(ge.lastRetry, 30 * me.ONE_SEC_MS)) return ge.loading = !1, [];
            try {
                if (i && s && n) {
                    const o = await xa.getMyTokensWithBalance();
                    return ge.tokenBalances = o, ge.lastRetry = void 0, o;
                }
            } catch (o) {
                ge.lastRetry = Date.now(), t?.(o), rs.showError("Token Balance Unavailable");
            } finally{
                ge.loading = !1;
            }
            return [];
        },
        fetchNetworkBalance () {
            if (ge.tokenBalances.length === 0) return;
            const t = Xp.mapBalancesToSwapTokens(ge.tokenBalances);
            if (!t) return;
            const e = t.find((s)=>s.address === jd());
            e && (ge.networkBalanceInUSD = e ? cp.multiply(e.quantity.numeric, e.price).toString() : "0");
        },
        async sendNativeToken (t) {
            te.pushTransactionStack({});
            const e = t.receiverAddress, s = p.getAccountData()?.address, n = H.parseUnits(t.sendTokenAmount.toString(), Number(t.decimals)), i = await H.sendTransaction({
                chainNamespace: S.CHAIN.EVM,
                to: e,
                address: s,
                data: "0x",
                value: n ?? BigInt(0)
            });
            return le.sendEvent({
                type: "track",
                event: "SEND_SUCCESS",
                properties: {
                    isSmartAccount: Lt("eip155") === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                    token: ce.state.token?.symbol || "",
                    amount: t.sendTokenAmount,
                    network: p.state.activeCaipNetwork?.caipNetworkId || "",
                    hash: i || ""
                }
            }), H._getClient()?.updateBalance("eip155"), ce.resetSend(), {
                hash: i
            };
        },
        async sendERC20Token (t) {
            te.pushTransactionStack({
                onSuccess () {
                    te.replace("Account");
                }
            });
            const e = H.parseUnits(t.sendTokenAmount.toString(), Number(t.decimals)), s = p.getAccountData()?.address;
            if (s && t.sendTokenAmount && t.receiverAddress && t.tokenAddress) {
                const n = J.getPlainAddress(t.tokenAddress);
                if (!n) throw new Error("SendController:sendERC20Token - tokenAddress is required");
                const r = await H.writeContract({
                    fromAddress: s,
                    tokenAddress: n,
                    args: [
                        t.receiverAddress,
                        e ?? BigInt(0)
                    ],
                    method: "transfer",
                    abi: up.getERC20Abi(n),
                    chainNamespace: S.CHAIN.EVM
                });
                return le.sendEvent({
                    type: "track",
                    event: "SEND_SUCCESS",
                    properties: {
                        isSmartAccount: Lt("eip155") === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                        token: ce.state.token?.symbol || "",
                        amount: t.sendTokenAmount,
                        network: p.state.activeCaipNetwork?.caipNetworkId || "",
                        hash: r || ""
                    }
                }), ce.resetSend(), {
                    hash: r
                };
            }
            return {
                hash: void 0
            };
        },
        async sendSolanaToken () {
            if (!ce.state.sendTokenAmount || !ce.state.receiverAddress) throw new Error("An amount and receiver address are required");
            te.pushTransactionStack({
                onSuccess () {
                    te.replace("Account");
                }
            });
            let t;
            ce.state.token && ce.state.token.address !== me.SOLANA_NATIVE_TOKEN_ADDRESS && (J.isCaipAddress(ce.state.token.address) ? t = J.getPlainAddress(ce.state.token.address) : t = ce.state.token.address);
            const e = await H.sendTransaction({
                chainNamespace: "solana",
                tokenMint: t,
                to: ce.state.receiverAddress,
                value: ce.state.sendTokenAmount
            });
            e && (ge.hash = e), H._getClient()?.updateBalance("solana"), ce.resetSend();
        },
        resetSend () {
            ge.token = void 0, ge.sendTokenAmount = void 0, ge.receiverAddress = void 0, ge.receiverProfileImageUrl = void 0, ge.receiverProfileName = void 0, ge.loading = !1, ge.tokenBalances = [];
        }
    };
    ce = Bt(Zp);
    ho = {
        currentTab: 0,
        tokenBalance: [],
        smartAccountDeployed: !1,
        addressLabels: new Map,
        user: void 0,
        preferredAccountType: void 0
    };
    ri = {
        caipNetwork: void 0,
        supportsAllNetworks: !0,
        smartAccountEnabledNetworks: []
    };
    q = Oe({
        chains: _p(),
        activeCaipAddress: void 0,
        activeChain: void 0,
        activeCaipNetwork: void 0,
        noAdapters: !1,
        universalAdapter: {
            networkControllerClient: void 0,
            connectionControllerClient: void 0
        },
        isSwitchingNamespace: !1
    });
    Wd = {
        state: q,
        subscribe (t) {
            return Je(q, ()=>{
                t(q);
            });
        },
        subscribeKey (t, e) {
            return Xe(q, t, e);
        },
        subscribeAccountStateProp (t, e, s) {
            const n = s || q.activeChain;
            return n ? Xe(q.chains.get(n)?.accountState || {}, t, e) : ()=>{};
        },
        subscribeChainProp (t, e, s) {
            let n;
            return Je(q.chains, ()=>{
                const r = s || q.activeChain;
                if (r) {
                    const i = q.chains.get(r)?.[t];
                    n !== i && (n = i, e(i));
                }
            });
        },
        initialize (t, e, s) {
            const { chainId: n, namespace: r } = $.getActiveNetworkProps(), i = e?.find((d)=>d.id.toString() === n?.toString()), a = t.find((d)=>d?.namespace === r) || t?.[0], c = t.map((d)=>d.namespace).filter((d)=>d !== void 0), l = _.state.enableEmbedded ? new Set([
                ...c
            ]) : new Set([
                ...e?.map((d)=>d.chainNamespace) ?? []
            ]);
            (t?.length === 0 || !a) && (q.noAdapters = !0), q.noAdapters || (q.activeChain = a?.namespace, q.activeCaipNetwork = i, p.setChainNetworkData(a?.namespace, {
                caipNetwork: i
            }), q.activeChain && Es.set({
                activeChain: a?.namespace
            })), l.forEach((d)=>{
                const h = e?.filter((g)=>g.chainNamespace === d), u = $.getPreferredAccountTypes() || {}, f = {
                    ..._.state.defaultAccountTypes,
                    ...u
                };
                p.state.chains.set(d, {
                    namespace: d,
                    networkState: Oe({
                        ...ri,
                        caipNetwork: h?.[0]
                    }),
                    accountState: Oe({
                        ...ho,
                        preferredAccountType: f[d]
                    }),
                    caipNetworks: h ?? [],
                    ...s
                }), p.setRequestedCaipNetworks(h ?? [], d);
            });
        },
        removeAdapter (t) {
            if (q.activeChain === t) {
                const e = Array.from(q.chains.entries()).find(([s])=>s !== t);
                if (e) {
                    const s = e[1]?.caipNetworks?.[0];
                    s && p.setActiveCaipNetwork(s);
                }
            }
            q.chains.delete(t);
        },
        addAdapter (t, { networkControllerClient: e, connectionControllerClient: s }, n) {
            if (!t.namespace) throw new Error("ChainController:addAdapter - adapter must have a namespace");
            q.chains.set(t.namespace, {
                namespace: t.namespace,
                networkState: {
                    ...ri,
                    caipNetwork: n[0]
                },
                accountState: {
                    ...ho
                },
                caipNetworks: n,
                connectionControllerClient: s,
                networkControllerClient: e
            }), p.setRequestedCaipNetworks(n?.filter((r)=>r.chainNamespace === t.namespace) ?? [], t.namespace);
        },
        addNetwork (t) {
            const e = q.chains.get(t.chainNamespace);
            if (e) {
                const s = [
                    ...e.caipNetworks || []
                ];
                e.caipNetworks?.find((n)=>n.id === t.id) || s.push(t), q.chains.set(t.chainNamespace, {
                    ...e,
                    caipNetworks: s
                }), p.setRequestedCaipNetworks(s, t.chainNamespace), L.filterByNamespace(t.chainNamespace, !0);
            }
        },
        removeNetwork (t, e) {
            const s = q.chains.get(t);
            if (s) {
                const n = q.activeCaipNetwork?.id === e, r = [
                    ...s.caipNetworks?.filter((i)=>i.id !== e) || []
                ];
                n && s?.caipNetworks?.[0] && p.setActiveCaipNetwork(s.caipNetworks[0]), q.chains.set(t, {
                    ...s,
                    caipNetworks: r
                }), p.setRequestedCaipNetworks(r || [], t), r.length === 0 && L.filterByNamespace(t, !1);
            }
        },
        setAdapterNetworkState (t, e) {
            const s = q.chains.get(t);
            s && (s.networkState = {
                ...s.networkState || ri,
                ...e
            }, q.chains.set(t, s));
        },
        setChainAccountData (t, e, s = !0) {
            if (!t) throw new Error("Chain is required to update chain account data");
            const n = q.chains.get(t);
            if (n) {
                const r = {
                    ...n.accountState || ho,
                    ...e
                };
                q.chains.set(t, {
                    ...n,
                    accountState: r
                }), (q.chains.size === 1 || q.activeChain === t) && e.caipAddress && (q.activeCaipAddress = e.caipAddress);
            }
        },
        setChainNetworkData (t, e) {
            if (!t) return;
            const s = q.chains.get(t);
            if (s) {
                const n = {
                    ...s.networkState || ri,
                    ...e
                };
                q.chains.set(t, {
                    ...s,
                    networkState: n
                });
            }
        },
        setAccountProp (t, e, s, n = !0) {
            p.setChainAccountData(s, {
                [t]: e
            }, n);
        },
        setActiveNamespace (t) {
            q.activeChain = t;
            const e = t ? q.chains.get(t) : void 0, s = e?.networkState?.caipNetwork;
            s?.id && t && (q.activeCaipAddress = e?.accountState?.caipAddress, q.activeCaipNetwork = s, p.setChainNetworkData(t, {
                caipNetwork: s
            }), $.setActiveCaipNetworkId(s?.caipNetworkId), Es.set({
                activeChain: t,
                selectedNetworkId: s?.caipNetworkId
            }));
        },
        setActiveCaipNetwork (t) {
            if (!t) return;
            const e = q.activeChain === t.chainNamespace;
            e || p.setIsSwitchingNamespace(!0);
            const s = q.chains.get(t.chainNamespace);
            q.activeChain = t.chainNamespace, q.activeCaipNetwork = t, p.setChainNetworkData(t.chainNamespace, {
                caipNetwork: t
            });
            let n = s?.accountState?.address;
            if (n) q.activeCaipAddress = `${t.chainNamespace}:${t.id}:${n}`;
            else if (e && q.activeCaipAddress) {
                const { address: i } = it.parseCaipAddress(q.activeCaipAddress);
                n = i, q.activeCaipAddress = `${t.caipNetworkId}:${n}`;
            } else q.activeCaipAddress = void 0;
            p.setChainAccountData(t.chainNamespace, {
                address: n,
                caipAddress: q.activeCaipAddress
            }), ce.resetSend(), Es.set({
                activeChain: q.activeChain,
                selectedNetworkId: q.activeCaipNetwork?.caipNetworkId
            }), $.setActiveCaipNetworkId(t.caipNetworkId), !p.checkIfSupportedNetwork(t.chainNamespace) && _.state.enableNetworkSwitch && !_.state.allowUnsupportedChain && !H.state.wcBasic && p.showUnsupportedChainUI();
        },
        addCaipNetwork (t) {
            if (!t) return;
            const e = q.chains.get(t.chainNamespace);
            e && e?.caipNetworks?.push(t);
        },
        async switchActiveNamespace (t) {
            if (!t) return;
            const e = t !== p.state.activeChain, s = p.getNetworkData(t)?.caipNetwork, n = p.getCaipNetworkByNamespace(t, s?.id);
            e && n && await p.switchActiveNetwork(n);
        },
        async switchActiveNetwork (t, { throwOnFailure: e = !1 } = {}) {
            const s = p.state.activeChain;
            if (!s) throw new Error("ChainController:switchActiveNetwork - namespace is required");
            const r = !p.state.chains.get(s)?.caipNetworks?.some((o)=>o.id === q.activeCaipNetwork?.id), i = p.getNetworkControllerClient(t.chainNamespace);
            if (i) {
                try {
                    await i.switchCaipNetwork(t), r && ue.close();
                } catch (o) {
                    if (e) throw o;
                    te.goBack();
                }
                le.sendEvent({
                    type: "track",
                    event: "SWITCH_NETWORK",
                    properties: {
                        network: t.caipNetworkId
                    }
                });
            }
        },
        getNetworkControllerClient (t) {
            const e = t || q.activeChain;
            if (!e) throw new Error("ChainController:getNetworkControllerClient - chain is required");
            const s = q.chains.get(e);
            if (!s) throw new Error("Chain adapter not found");
            if (!s.networkControllerClient) throw new Error("NetworkController client not set");
            return s.networkControllerClient;
        },
        getConnectionControllerClient (t) {
            const e = t || q.activeChain;
            if (!e) throw new Error("Chain is required to get connection controller client");
            const s = q.chains.get(e);
            if (!s?.connectionControllerClient) throw new Error("ConnectionController client not set");
            return s.connectionControllerClient;
        },
        getNetworkProp (t, e) {
            const s = q.chains.get(e)?.networkState;
            if (s) return s[t];
        },
        getRequestedCaipNetworks (t) {
            const e = q.chains.get(t), { approvedCaipNetworkIds: s = [], requestedCaipNetworks: n = [] } = e?.networkState || {};
            return J.sortRequestedNetworks(s, n).filter((o)=>o?.id);
        },
        getAllRequestedCaipNetworks () {
            const t = [];
            return q.chains.forEach((e)=>{
                if (!e.namespace) throw new Error("ChainController:getAllRequestedCaipNetworks - chainAdapter must have a namespace");
                const s = p.getRequestedCaipNetworks(e.namespace);
                t.push(...s);
            }), t;
        },
        setRequestedCaipNetworks (t, e) {
            p.setAdapterNetworkState(e, {
                requestedCaipNetworks: t
            });
            const n = p.getAllRequestedCaipNetworks().map((i)=>i.chainNamespace), r = Array.from(new Set(n));
            L.filterByNamespaces(r);
        },
        getAllApprovedCaipNetworkIds () {
            const t = [];
            return q.chains.forEach((e)=>{
                if (!e.namespace) throw new Error("ChainController:getAllApprovedCaipNetworkIds - chainAdapter must have a namespace");
                const s = p.getApprovedCaipNetworkIds(e.namespace);
                t.push(...s);
            }), t;
        },
        getActiveCaipNetwork (t) {
            return t ? q.chains.get(t)?.networkState?.caipNetwork : q.activeCaipNetwork;
        },
        getActiveCaipAddress () {
            return q.activeCaipAddress;
        },
        getApprovedCaipNetworkIds (t) {
            return q.chains.get(t)?.networkState?.approvedCaipNetworkIds || [];
        },
        async setApprovedCaipNetworksData (t) {
            const s = await p.getNetworkControllerClient()?.getApprovedCaipNetworksData();
            p.setAdapterNetworkState(t, {
                approvedCaipNetworkIds: s?.approvedCaipNetworkIds,
                supportsAllNetworks: s?.supportsAllNetworks
            });
        },
        checkIfSupportedNetwork (t, e) {
            const s = e || q.activeCaipNetwork?.caipNetworkId, n = p.getRequestedCaipNetworks(t);
            return n.length ? n?.some((r)=>r.caipNetworkId === s) : !0;
        },
        checkIfSupportedChainId (t) {
            return q.activeChain ? p.getRequestedCaipNetworks(q.activeChain)?.some((s)=>s.id === t) : !0;
        },
        setSmartAccountEnabledNetworks (t, e) {
            p.setAdapterNetworkState(e, {
                smartAccountEnabledNetworks: t
            });
        },
        checkIfSmartAccountEnabled () {
            const t = Pd.caipNetworkIdToNumber(q.activeCaipNetwork?.caipNetworkId), e = q.activeChain;
            return !e || !t ? !1 : !!p.getNetworkProp("smartAccountEnabledNetworks", e)?.includes(Number(t));
        },
        showUnsupportedChainUI () {
            ue.open({
                view: "UnsupportedChain"
            });
        },
        checkIfNamesSupported () {
            const t = q.activeCaipNetwork;
            return !!(t?.chainNamespace && me.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(t.chainNamespace));
        },
        resetNetwork (t) {
            p.setAdapterNetworkState(t, {
                approvedCaipNetworkIds: void 0,
                supportsAllNetworks: !0
            });
        },
        resetAccount (t) {
            const e = t;
            if (!e) throw new Error("Chain is required to set account prop");
            const s = p.state.chains.get(e)?.accountState?.preferredAccountType, n = _.state.defaultAccountTypes[e];
            q.activeCaipAddress = void 0, p.setChainAccountData(e, {
                smartAccountDeployed: !1,
                currentTab: 0,
                caipAddress: void 0,
                address: void 0,
                balance: void 0,
                balanceSymbol: void 0,
                profileName: void 0,
                profileImage: void 0,
                addressExplorerUrl: void 0,
                tokenBalance: [],
                connectedWalletInfo: void 0,
                preferredAccountType: n || s,
                socialProvider: void 0,
                socialWindow: void 0,
                farcasterUrl: void 0,
                user: void 0,
                status: "disconnected"
            }), L.removeConnectorId(e);
        },
        setIsSwitchingNamespace (t) {
            q.isSwitchingNamespace = t;
        },
        getFirstCaipNetworkSupportsAuthConnector () {
            const t = [];
            let e;
            if (q.chains.forEach((s)=>{
                S.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((n)=>n === s.namespace) && s.namespace && t.push(s.namespace);
            }), t.length > 0) {
                const s = t[0];
                return e = s ? q.chains.get(s)?.caipNetworks?.[0] : void 0, e;
            }
        },
        getAccountData (t) {
            const e = t || q.activeChain;
            if (e) return p.state.chains.get(e)?.accountState;
        },
        getNetworkData (t) {
            const e = t || q.activeChain;
            if (e) return p.state.chains.get(e)?.networkState;
        },
        getCaipNetworkByNamespace (t, e) {
            if (!t) return;
            const s = p.state.chains.get(t), n = s?.caipNetworks?.find((r)=>r.id === e);
            return n || s?.networkState?.caipNetwork || s?.caipNetworks?.[0];
        },
        getRequestedCaipNetworkIds () {
            const t = L.state.filterByNamespace;
            return (t ? [
                q.chains.get(t)
            ] : Array.from(q.chains.values())).flatMap((s)=>s?.caipNetworks || []).map((s)=>s.caipNetworkId);
        },
        getCaipNetworks (t) {
            return t ? p.getRequestedCaipNetworks(t) : p.getAllRequestedCaipNetworks();
        },
        getCaipNetworkById (t, e) {
            return Wd.getCaipNetworks(e).find((s)=>s.id.toString() === t.toString() || s.caipNetworkId.toString() === t.toString());
        },
        setLastConnectedSIWECaipNetwork (t) {
            q.lastConnectedSIWECaipNetwork = t;
        },
        getLastConnectedSIWECaipNetwork () {
            return q.lastConnectedSIWECaipNetwork;
        },
        async fetchTokenBalance (t) {
            const e = p.getAccountData();
            if (!e) return [];
            const s = p.state.activeCaipNetwork?.caipNetworkId, n = p.state.activeCaipNetwork?.chainNamespace, r = p.state.activeCaipAddress, i = r ? J.getPlainAddress(r) : void 0;
            if (p.setAccountProp("balanceLoading", !0, n), e.lastRetry && !J.isAllowedRetry(e.lastRetry, 30 * me.ONE_SEC_MS)) return p.setAccountProp("balanceLoading", !1, n), [];
            try {
                if (i && s && n) {
                    const o = await xa.getMyTokensWithBalance();
                    return p.setAccountProp("tokenBalance", o, n), p.setAccountProp("lastRetry", void 0, n), p.setAccountProp("balanceLoading", !1, n), o;
                }
            } catch (o) {
                p.setAccountProp("lastRetry", Date.now(), n), t?.(o), rs.showError("Token Balance Unavailable");
            } finally{
                p.setAccountProp("balanceLoading", !1, n);
            }
            return [];
        },
        isCaipNetworkDisabled (t) {
            const e = t.chainNamespace, s = !!p.getAccountData(e)?.caipAddress, n = p.getAllApprovedCaipNetworkIds(), r = p.getNetworkProp("supportsAllNetworks", e) !== !1, i = L.getConnectorId(e), o = L.getAuthConnector(), a = i === S.CONNECTOR_ID.AUTH && o;
            return !s || r || a ? !1 : !n?.includes(t.caipNetworkId);
        }
    };
    p = Bt(Wd);
    Qp = {
        onSwitchNetwork ({ network: t, ignoreSwitchConfirmation: e = !1 }) {
            const s = p.state.activeCaipNetwork, n = p.state.activeChain, r = te.state.data;
            if (t.id === s?.id) return;
            const o = !!p.getAccountData(n)?.address, a = !!p.getAccountData(t.chainNamespace)?.address, c = t.chainNamespace !== n, d = L.getConnectorId(n) === S.CONNECTOR_ID.AUTH, h = S.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((u)=>u === t.chainNamespace);
            e || d && h ? te.push("SwitchNetwork", {
                ...r,
                network: t
            }) : o && c && !a ? te.push("SwitchActiveChain", {
                switchToChain: t.chainNamespace,
                navigateTo: "Connect",
                navigateWithReplace: !0,
                network: t
            }) : te.push("SwitchNetwork", {
                ...r,
                network: t
            });
        }
    };
    ht = Oe({
        loading: !1,
        loadingNamespaceMap: new Map,
        open: !1,
        shake: !1,
        namespace: void 0
    });
    ef = {
        state: ht,
        subscribe (t) {
            return Je(ht, ()=>t(ht));
        },
        subscribeKey (t, e) {
            return Xe(ht, t, e);
        },
        async open (t) {
            const e = t?.namespace, s = p.state.activeChain, n = e && e !== s, r = p.getAccountData(t?.namespace)?.caipAddress, i = p.state.noAdapters;
            if (H.state.wcBasic ? ee.prefetch({
                fetchNetworkImages: !1,
                fetchConnectorImages: !1,
                fetchWalletRanks: !1
            }) : await ee.prefetch(), L.setFilterByNamespace(t?.namespace), ue.setLoading(!0, e), e && n) {
                const o = p.getNetworkData(e)?.caipNetwork || p.getRequestedCaipNetworks(e)[0];
                o && (i ? (await p.switchActiveNetwork(o), te.push("ConnectingWalletConnectBasic")) : Qp.onSwitchNetwork({
                    network: o,
                    ignoreSwitchConfirmation: !0
                }));
            } else _.state.manualWCControl || i && !r ? J.isMobile() ? te.reset("AllWallets") : te.reset("ConnectingWalletConnectBasic") : t?.view ? te.reset(t.view, t.data) : r ? te.reset("Account") : te.reset("Connect");
            ht.open = !0, Es.set({
                open: !0
            }), le.sendEvent({
                type: "track",
                event: "MODAL_OPEN",
                properties: {
                    connected: !!r
                }
            });
        },
        close () {
            const t = _.state.enableEmbedded, e = !!p.state.activeCaipAddress;
            ht.open && le.sendEvent({
                type: "track",
                event: "MODAL_CLOSE",
                properties: {
                    connected: e
                }
            }), ht.open = !1, te.reset("Connect"), ue.clearLoading(), t ? e ? te.replace("Account") : te.push("Connect") : Es.set({
                open: !1
            }), H.resetUri();
        },
        setLoading (t, e) {
            e && ht.loadingNamespaceMap.set(e, t), ht.loading = t, Es.set({
                loading: t
            });
        },
        clearLoading () {
            ht.loadingNamespaceMap.clear(), ht.loading = !1, Es.set({
                loading: !1
            });
        },
        shake () {
            ht.shake || (ht.shake = !0, setTimeout(()=>{
                ht.shake = !1;
            }, 500));
        }
    };
    ue = Bt(ef);
    Oi = {
        eip155: void 0,
        solana: void 0,
        polkadot: void 0,
        bip122: void 0,
        cosmos: void 0,
        sui: void 0,
        stacks: void 0
    };
    ut = Oe({
        providers: {
            ...Oi
        },
        providerIds: {
            ...Oi
        }
    });
    xe = {
        state: ut,
        subscribeKey (t, e) {
            return Xe(ut, t, e);
        },
        subscribe (t) {
            return Je(ut, ()=>{
                t(ut);
            });
        },
        subscribeProviders (t) {
            return Je(ut.providers, ()=>t(ut.providers));
        },
        setProvider (t, e) {
            t && e && (ut.providers[t] = Yn(e));
        },
        getProvider (t) {
            if (t) return ut.providers[t];
        },
        setProviderId (t, e) {
            e && (ut.providerIds[t] = e);
        },
        getProviderId (t) {
            if (t) return ut.providerIds[t];
        },
        reset () {
            ut.providers = {
                ...Oi
            }, ut.providerIds = {
                ...Oi
            };
        },
        resetChain (t) {
            ut.providers[t] = void 0, ut.providerIds[t] = void 0;
        }
    };
    Nr = {
        id: "2b92315d-eab7-5bef-84fa-089a131333f5",
        name: "USD Coin",
        symbol: "USDC",
        networks: [
            {
                name: "ethereum-mainnet",
                display_name: "Ethereum",
                chain_id: "1",
                contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            {
                name: "polygon-mainnet",
                display_name: "Polygon",
                chain_id: "137",
                contract_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            }
        ]
    };
    zo = {
        id: "USD",
        payment_method_limits: [
            {
                id: "card",
                min: "10.00",
                max: "7500.00"
            },
            {
                id: "ach_bank_account",
                min: "10.00",
                max: "25000.00"
            }
        ]
    };
    tf = {
        providers: Ld,
        selectedProvider: null,
        error: null,
        purchaseCurrency: Nr,
        paymentCurrency: zo,
        purchaseCurrencies: [
            Nr
        ],
        paymentCurrencies: [],
        quotesLoading: !1
    };
    we = Oe(tf);
    sf = {
        state: we,
        subscribe (t) {
            return Je(we, ()=>t(we));
        },
        subscribeKey (t, e) {
            return Xe(we, t, e);
        },
        setSelectedProvider (t) {
            if (t && t.name === "meld") {
                const e = p.state.activeChain, s = e === S.CHAIN.SOLANA ? "SOL" : "USDC", n = e ? p.state.chains.get(e)?.accountState?.address ?? "" : "", r = new URL(t.url);
                r.searchParams.append("publicKey", Sp), r.searchParams.append("destinationCurrencyCode", s), r.searchParams.append("walletAddress", n), r.searchParams.append("externalCustomerId", _.state.projectId), we.selectedProvider = {
                    ...t,
                    url: r.toString()
                };
            } else we.selectedProvider = t;
        },
        setOnrampProviders (t) {
            if (Array.isArray(t) && t.every((e)=>typeof e == "string")) {
                const e = t, s = Ld.filter((n)=>e.includes(n.name));
                we.providers = s;
            } else we.providers = [];
        },
        setPurchaseCurrency (t) {
            we.purchaseCurrency = t;
        },
        setPaymentCurrency (t) {
            we.paymentCurrency = t;
        },
        setPurchaseAmount (t) {
            Go.state.purchaseAmount = t;
        },
        setPaymentAmount (t) {
            Go.state.paymentAmount = t;
        },
        async getAvailableCurrencies () {
            const t = await se.getOnrampOptions();
            we.purchaseCurrencies = t.purchaseCurrencies, we.paymentCurrencies = t.paymentCurrencies, we.paymentCurrency = t.paymentCurrencies[0] || zo, we.purchaseCurrency = t.purchaseCurrencies[0] || Nr, await ee.fetchCurrencyImages(t.paymentCurrencies.map((e)=>e.id)), await ee.fetchTokenImages(t.purchaseCurrencies.map((e)=>e.symbol));
        },
        async getQuote () {
            we.quotesLoading = !0;
            try {
                const t = await se.getOnrampQuote({
                    purchaseCurrency: we.purchaseCurrency,
                    paymentCurrency: we.paymentCurrency,
                    amount: we.paymentAmount?.toString() || "0",
                    network: we.purchaseCurrency?.symbol
                });
                return we.quotesLoading = !1, we.purchaseAmount = Number(t?.purchaseAmount.amount), t;
            } catch (t) {
                return we.error = t.message, we.quotesLoading = !1, null;
            } finally{
                we.quotesLoading = !1;
            }
        },
        resetState () {
            we.selectedProvider = null, we.error = null, we.purchaseCurrency = Nr, we.paymentCurrency = zo, we.purchaseCurrencies = [
                Nr
            ], we.paymentCurrencies = [], we.paymentAmount = void 0, we.purchaseAmount = void 0, we.quotesLoading = !1;
        }
    };
    Go = Bt(sf);
    jt = Oe({
        message: "",
        variant: "info",
        open: !1
    });
    nf = {
        state: jt,
        subscribeKey (t, e) {
            return Xe(jt, t, e);
        },
        open (t, e) {
            const { debug: s } = _.state, { code: n, displayMessage: r, debugMessage: i } = t;
            r && s && (jt.message = r, jt.variant = e, jt.open = !0), i && console.error(typeof i == "function" ? i() : i, n ? {
                code: n
            } : void 0);
        },
        warn (t, e, s) {
            jt.open = !0, jt.message = t, jt.variant = "warning", e && console.warn(e, s);
        },
        close () {
            jt.open = !1, jt.message = "", jt.variant = "info";
        }
    };
    vt = Bt(nf);
    wc = 2147483648;
    rf = {
        convertEVMChainIdToCoinType (t) {
            if (t >= wc) throw new Error("Invalid chainId");
            return (wc | t) >>> 0;
        }
    };
    St = Oe({
        suggestions: [],
        loading: !1
    });
    of = {
        state: St,
        subscribe (t) {
            return Je(St, ()=>t(St));
        },
        subscribeKey (t, e) {
            return Xe(St, t, e);
        },
        async resolveName (t) {
            try {
                return await se.lookupEnsName(t);
            } catch (e) {
                const s = e;
                throw new Error(s?.reasons?.[0]?.description || "Error resolving name");
            }
        },
        async isNameRegistered (t) {
            try {
                return await se.lookupEnsName(t), !0;
            } catch  {
                return !1;
            }
        },
        async getSuggestions (t) {
            try {
                St.loading = !0, St.suggestions = [];
                const e = await se.getEnsNameSuggestions(t);
                return St.suggestions = e.suggestions || [], St.suggestions;
            } catch (e) {
                const s = _r.parseEnsApiError(e, "Error fetching name suggestions");
                throw new Error(s);
            } finally{
                St.loading = !1;
            }
        },
        async getNamesForAddress (t) {
            try {
                if (!p.state.activeCaipNetwork) return [];
                const s = $.getEnsFromCacheForAddress(t);
                if (s) return s;
                const n = await se.reverseLookupEnsName({
                    address: t
                });
                return $.updateEnsCache({
                    address: t,
                    ens: n,
                    timestamp: Date.now()
                }), n;
            } catch (e) {
                const s = _r.parseEnsApiError(e, "Error fetching names for address");
                throw new Error(s);
            }
        },
        async registerName (t) {
            const e = p.state.activeCaipNetwork, s = p.getAccountData(e?.chainNamespace)?.address, n = L.getAuthConnector();
            if (!e) throw new Error("Network not found");
            if (!s || !n) throw new Error("Address or auth connector not found");
            St.loading = !0;
            try {
                const r = JSON.stringify({
                    name: t,
                    attributes: {},
                    timestamp: Math.floor(Date.now() / 1e3)
                });
                te.pushTransactionStack({
                    onCancel () {
                        te.replace("RegisterAccountName");
                    }
                });
                const i = await H.signMessage(r);
                St.loading = !1;
                const o = e.id;
                if (!o) throw new Error("Network not found");
                const a = rf.convertEVMChainIdToCoinType(Number(o));
                await se.registerEnsName({
                    coinType: a,
                    address: s,
                    signature: i,
                    message: r
                }), p.setAccountProp("profileName", t, e.chainNamespace), $.updateEnsCache({
                    address: s,
                    ens: [
                        {
                            name: t,
                            registered_at: new Date().toISOString(),
                            updated_at: void 0,
                            addresses: {},
                            attributes: []
                        }
                    ],
                    timestamp: Date.now()
                }), te.replace("RegisterAccountNameSuccess");
            } catch (r) {
                const i = _r.parseEnsApiError(r, `Error registering name ${t}`);
                throw te.replace("RegisterAccountName"), new Error(i);
            } finally{
                St.loading = !1;
            }
        },
        validateName (t) {
            return /^[a-zA-Z0-9-]{4,}$/u.test(t);
        },
        parseEnsApiError (t, e) {
            return t?.reasons?.[0]?.description || e;
        }
    };
    _r = Bt(of);
    af = {
        asset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
    };
    cf = {
        asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    };
    var uo, yc;
    function lf() {
        if (yc) return uo;
        yc = 1;
        const t = Fu();
        uo = r;
        const e = G().console || {}, s = {
            mapHttpRequest: g,
            mapHttpResponse: g,
            wrapRequestSerializer: w,
            wrapResponseSerializer: w,
            wrapErrorSerializer: w,
            req: g,
            res: g,
            err: u
        };
        function n(b, R) {
            return Array.isArray(b) ? b.filter(function(N) {
                return N !== "!stdSerializers.err";
            }) : b === !0 ? Object.keys(R) : !1;
        }
        function r(b) {
            b = b || {}, b.browser = b.browser || {};
            const R = b.browser.transmit;
            if (R && typeof R.send != "function") throw Error("pino: transmit option must have a send function");
            const U = b.browser.write || e;
            b.browser.write && (b.browser.asObject = !0);
            const N = b.serializers || {}, M = n(b.browser.serialize, N);
            let Y = b.browser.serialize;
            Array.isArray(b.browser.serialize) && b.browser.serialize.indexOf("!stdSerializers.err") > -1 && (Y = !1);
            const O = [
                "error",
                "fatal",
                "warn",
                "info",
                "debug",
                "trace"
            ];
            typeof U == "function" && (U.error = U.fatal = U.warn = U.info = U.debug = U.trace = U), b.enabled === !1 && (b.level = "silent");
            const C = b.level || "info", y = Object.create(U);
            y.log || (y.log = m), Object.defineProperty(y, "levelVal", {
                get: k
            }), Object.defineProperty(y, "level", {
                get: D,
                set: B
            });
            const E = {
                transmit: R,
                serialize: M,
                asObject: b.browser.asObject,
                levels: O,
                timestamp: f(b)
            };
            y.levels = r.levels, y.level = C, y.setMaxListeners = y.getMaxListeners = y.emit = y.addListener = y.on = y.prependListener = y.once = y.prependOnceListener = y.removeListener = y.removeAllListeners = y.listeners = y.listenerCount = y.eventNames = y.write = y.flush = m, y.serializers = N, y._serialize = M, y._stdErrSerialize = Y, y.child = I, R && (y._logEvent = h());
            function k() {
                return this.level === "silent" ? 1 / 0 : this.levels.values[this.level];
            }
            function D() {
                return this._level;
            }
            function B(T) {
                if (T !== "silent" && !this.levels.values[T]) throw Error("unknown level " + T);
                this._level = T, i(E, y, "error", "log"), i(E, y, "fatal", "error"), i(E, y, "warn", "error"), i(E, y, "info", "log"), i(E, y, "debug", "log"), i(E, y, "trace", "log");
            }
            function I(T, V) {
                if (!T) throw new Error("missing bindings for child Pino");
                V = V || {}, M && T.serializers && (V.serializers = T.serializers);
                const K = V.serializers;
                if (M && K) {
                    var ae = Object.assign({}, N, K), oe = b.browser.serialize === !0 ? Object.keys(ae) : M;
                    delete T.serializers, c([
                        T
                    ], oe, ae, this._stdErrSerialize);
                }
                function ne(ie) {
                    this._childLevel = (ie._childLevel | 0) + 1, this.error = l(ie, T, "error"), this.fatal = l(ie, T, "fatal"), this.warn = l(ie, T, "warn"), this.info = l(ie, T, "info"), this.debug = l(ie, T, "debug"), this.trace = l(ie, T, "trace"), ae && (this.serializers = ae, this._serialize = oe), R && (this._logEvent = h([].concat(ie._logEvent.bindings, T)));
                }
                return ne.prototype = this, new ne(this);
            }
            return y;
        }
        r.levels = {
            values: {
                fatal: 60,
                error: 50,
                warn: 40,
                info: 30,
                debug: 20,
                trace: 10
            },
            labels: {
                10: "trace",
                20: "debug",
                30: "info",
                40: "warn",
                50: "error",
                60: "fatal"
            }
        }, r.stdSerializers = s, r.stdTimeFunctions = Object.assign({}, {
            nullTime: A,
            epochTime: v,
            unixTime: P,
            isoTime: j
        });
        function i(b, R, U, N) {
            const M = Object.getPrototypeOf(R);
            R[U] = R.levelVal > R.levels.values[U] ? m : M[U] ? M[U] : e[U] || e[N] || m, o(b, R, U);
        }
        function o(b, R, U) {
            !b.transmit && R[U] === m || (R[U] = (function(N) {
                return function() {
                    const Y = b.timestamp(), O = new Array(arguments.length), C = Object.getPrototypeOf && Object.getPrototypeOf(this) === e ? e : this;
                    for(var y = 0; y < O.length; y++)O[y] = arguments[y];
                    if (b.serialize && !b.asObject && c(O, this._serialize, this.serializers, this._stdErrSerialize), b.asObject ? N.call(C, a(this, U, O, Y)) : N.apply(C, O), b.transmit) {
                        const E = b.transmit.level || R.level, k = r.levels.values[E], D = r.levels.values[U];
                        if (D < k) return;
                        d(this, {
                            ts: Y,
                            methodLevel: U,
                            methodValue: D,
                            transmitValue: r.levels.values[b.transmit.level || R.level],
                            send: b.transmit.send,
                            val: R.levelVal
                        }, O);
                    }
                };
            })(R[U]));
        }
        function a(b, R, U, N) {
            b._serialize && c(U, b._serialize, b.serializers, b._stdErrSerialize);
            const M = U.slice();
            let Y = M[0];
            const O = {};
            N && (O.time = N), O.level = r.levels.values[R];
            let C = (b._childLevel | 0) + 1;
            if (C < 1 && (C = 1), Y !== null && typeof Y == "object") {
                for(; C-- && typeof M[0] == "object";)Object.assign(O, M.shift());
                Y = M.length ? t(M.shift(), M) : void 0;
            } else typeof Y == "string" && (Y = t(M.shift(), M));
            return Y !== void 0 && (O.msg = Y), O;
        }
        function c(b, R, U, N) {
            for(const M in b)if (N && b[M] instanceof Error) b[M] = r.stdSerializers.err(b[M]);
            else if (typeof b[M] == "object" && !Array.isArray(b[M])) for(const Y in b[M])R && R.indexOf(Y) > -1 && Y in U && (b[M][Y] = U[Y](b[M][Y]));
        }
        function l(b, R, U) {
            return function() {
                const N = new Array(1 + arguments.length);
                N[0] = R;
                for(var M = 1; M < N.length; M++)N[M] = arguments[M - 1];
                return b[U].apply(this, N);
            };
        }
        function d(b, R, U) {
            const N = R.send, M = R.ts, Y = R.methodLevel, O = R.methodValue, C = R.val, y = b._logEvent.bindings;
            c(U, b._serialize || Object.keys(b.serializers), b.serializers, b._stdErrSerialize === void 0 ? !0 : b._stdErrSerialize), b._logEvent.ts = M, b._logEvent.messages = U.filter(function(E) {
                return y.indexOf(E) === -1;
            }), b._logEvent.level.label = Y, b._logEvent.level.value = O, N(Y, b._logEvent, C), b._logEvent = h(y);
        }
        function h(b) {
            return {
                ts: 0,
                messages: [],
                bindings: b || [],
                level: {
                    label: "",
                    value: 0
                }
            };
        }
        function u(b) {
            const R = {
                type: b.constructor.name,
                msg: b.message,
                stack: b.stack
            };
            for(const U in b)R[U] === void 0 && (R[U] = b[U]);
            return R;
        }
        function f(b) {
            return typeof b.timestamp == "function" ? b.timestamp : b.timestamp === !1 ? A : v;
        }
        function g() {
            return {};
        }
        function w(b) {
            return b;
        }
        function m() {}
        function A() {
            return !1;
        }
        function v() {
            return Date.now();
        }
        function P() {
            return Math.round(Date.now() / 1e3);
        }
        function j() {
            return new Date(Date.now()).toISOString();
        }
        function G() {
            function b(R) {
                return typeof R < "u" && R;
            }
            try {
                return typeof globalThis < "u" || Object.defineProperty(Object.prototype, "globalThis", {
                    get: function() {
                        return delete Object.prototype.globalThis, this.globalThis = this;
                    },
                    configurable: !0
                }), globalThis;
            } catch  {
                return b(self) || b(window) || b(this) || {};
            }
        }
        return uo;
    }
    var Ln = lf();
    const Hr = ju(Ln), df = {
        level: "info"
    }, Vr = "custom_context", $a = 1e3 * 1024;
    let hf = class {
        constructor(e){
            this.nodeValue = e, this.sizeInBytes = new TextEncoder().encode(this.nodeValue).length, this.next = null;
        }
        get value() {
            return this.nodeValue;
        }
        get size() {
            return this.sizeInBytes;
        }
    }, bc = class {
        constructor(e){
            this.head = null, this.tail = null, this.lengthInNodes = 0, this.maxSizeInBytes = e, this.sizeInBytes = 0;
        }
        append(e) {
            const s = new hf(e);
            if (s.size > this.maxSizeInBytes) throw new Error(`[LinkedList] Value too big to insert into list: ${e} with size ${s.size}`);
            for(; this.size + s.size > this.maxSizeInBytes;)this.shift();
            this.head ? (this.tail && (this.tail.next = s), this.tail = s) : (this.head = s, this.tail = s), this.lengthInNodes++, this.sizeInBytes += s.size;
        }
        shift() {
            if (!this.head) return;
            const e = this.head;
            this.head = this.head.next, this.head || (this.tail = null), this.lengthInNodes--, this.sizeInBytes -= e.size;
        }
        toArray() {
            const e = [];
            let s = this.head;
            for(; s !== null;)e.push(s.value), s = s.next;
            return e;
        }
        get length() {
            return this.lengthInNodes;
        }
        get size() {
            return this.sizeInBytes;
        }
        toOrderedArray() {
            return Array.from(this);
        }
        [Symbol.iterator]() {
            let e = this.head;
            return {
                next: ()=>{
                    if (!e) return {
                        done: !0,
                        value: null
                    };
                    const s = e.value;
                    return e = e.next, {
                        done: !1,
                        value: s
                    };
                }
            };
        }
    }, qd = class {
        constructor(e, s = $a){
            this.level = e ?? "error", this.levelValue = Ln.levels.values[this.level], this.MAX_LOG_SIZE_IN_BYTES = s, this.logs = new bc(this.MAX_LOG_SIZE_IN_BYTES);
        }
        forwardToConsole(e, s) {
            s === Ln.levels.values.error ? console.error(e) : s === Ln.levels.values.warn ? console.warn(e) : s === Ln.levels.values.debug ? console.debug(e) : s === Ln.levels.values.trace ? console.trace(e) : console.log(e);
        }
        appendToLogs(e) {
            this.logs.append(Fo({
                timestamp: new Date().toISOString(),
                log: e
            }));
            const s = typeof e == "string" ? JSON.parse(e).level : e.level;
            s >= this.levelValue && this.forwardToConsole(e, s);
        }
        getLogs() {
            return this.logs;
        }
        clearLogs() {
            this.logs = new bc(this.MAX_LOG_SIZE_IN_BYTES);
        }
        getLogArray() {
            return Array.from(this.logs);
        }
        logsToBlob(e) {
            const s = this.getLogArray();
            return s.push(Fo({
                extraMetadata: e
            })), new Blob(s, {
                type: "application/json"
            });
        }
    }, uf = class {
        constructor(e, s = $a){
            this.baseChunkLogger = new qd(e, s);
        }
        write(e) {
            this.baseChunkLogger.appendToLogs(e);
        }
        getLogs() {
            return this.baseChunkLogger.getLogs();
        }
        clearLogs() {
            this.baseChunkLogger.clearLogs();
        }
        getLogArray() {
            return this.baseChunkLogger.getLogArray();
        }
        logsToBlob(e) {
            return this.baseChunkLogger.logsToBlob(e);
        }
        downloadLogsBlobInBrowser(e) {
            const s = URL.createObjectURL(this.logsToBlob(e)), n = document.createElement("a");
            n.href = s, n.download = `walletconnect-logs-${new Date().toISOString()}.txt`, document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(s);
        }
    }, pf = class {
        constructor(e, s = $a){
            this.baseChunkLogger = new qd(e, s);
        }
        write(e) {
            this.baseChunkLogger.appendToLogs(e);
        }
        getLogs() {
            return this.baseChunkLogger.getLogs();
        }
        clearLogs() {
            this.baseChunkLogger.clearLogs();
        }
        getLogArray() {
            return this.baseChunkLogger.getLogArray();
        }
        logsToBlob(e) {
            return this.baseChunkLogger.logsToBlob(e);
        }
    };
    var ff = Object.defineProperty, gf = Object.defineProperties, mf = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, wf = Object.prototype.hasOwnProperty, yf = Object.prototype.propertyIsEnumerable, Ec = (t, e, s)=>e in t ? ff(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Pi = (t, e)=>{
        for(var s in e || (e = {}))wf.call(e, s) && Ec(t, s, e[s]);
        if (Cc) for (var s of Cc(e))yf.call(e, s) && Ec(t, s, e[s]);
        return t;
    }, Ri = (t, e)=>gf(t, mf(e));
    function Kr(t) {
        return Ri(Pi({}, t), {
            level: t?.level || df.level
        });
    }
    function bf(t, e = Vr) {
        return t[e] || "";
    }
    function Cf(t, e, s = Vr) {
        return t[s] = e, t;
    }
    function bt(t, e = Vr) {
        let s = "";
        return typeof t.bindings > "u" ? s = bf(t, e) : s = t.bindings().context || "", s;
    }
    function Ef(t, e, s = Vr) {
        const n = bt(t, s);
        return n.trim() ? `${n}/${e}` : e;
    }
    function ct(t, e, s = Vr) {
        const n = Ef(t, e, s), r = t.child({
            context: n
        });
        return Cf(r, n, s);
    }
    function vf(t) {
        var e, s;
        const n = new uf((e = t.opts) == null ? void 0 : e.level, t.maxSizeInBytes);
        return {
            logger: Hr(Ri(Pi({}, t.opts), {
                level: "trace",
                browser: Ri(Pi({}, (s = t.opts) == null ? void 0 : s.browser), {
                    write: (r)=>n.write(r)
                })
            })),
            chunkLoggerController: n
        };
    }
    function Af(t) {
        var e;
        const s = new pf((e = t.opts) == null ? void 0 : e.level, t.maxSizeInBytes);
        return {
            logger: Hr(Ri(Pi({}, t.opts), {
                level: "trace"
            }), s),
            chunkLoggerController: s
        };
    }
    function Hd(t) {
        return typeof t.loggerOverride < "u" && typeof t.loggerOverride != "string" ? {
            logger: t.loggerOverride,
            chunkLoggerController: null
        } : typeof window < "u" ? vf(t) : Af(t);
    }
    var If = Object.defineProperty, Nf = (t, e, s)=>e in t ? If(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, vc = (t, e, s)=>Nf(t, typeof e != "symbol" ? e + "" : e, s);
    let _f = class extends er {
        constructor(e){
            super(), this.opts = e, vc(this, "protocol", "wc"), vc(this, "version", 2);
        }
    };
    var Sf = Object.defineProperty, Tf = (t, e, s)=>e in t ? Sf(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, kf = (t, e, s)=>Tf(t, e + "", s);
    let Of = class extends er {
        constructor(e, s){
            super(), this.core = e, this.logger = s, kf(this, "records", new Map);
        }
    }, Pf = class {
        constructor(e, s){
            this.logger = e, this.core = s;
        }
    }, Rf = class extends er {
        constructor(e, s){
            super(), this.relayer = e, this.logger = s;
        }
    }, xf = class extends er {
        constructor(e){
            super();
        }
    }, $f = class {
        constructor(e, s, n, r){
            this.core = e, this.logger = s, this.name = n;
        }
    }, Uf = class extends er {
        constructor(e, s){
            super(), this.relayer = e, this.logger = s;
        }
    }, Df = class extends er {
        constructor(e, s){
            super(), this.core = e, this.logger = s;
        }
    }, Lf = class {
        constructor(e, s, n){
            this.core = e, this.logger = s, this.store = n;
        }
    }, Mf = class {
        constructor(e, s){
            this.projectId = e, this.logger = s;
        }
    }, Bf = class {
        constructor(e, s, n){
            this.core = e, this.logger = s, this.telemetryEnabled = n;
        }
    };
    var Ff = Object.defineProperty, jf = (t, e, s)=>e in t ? Ff(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Ac = (t, e, s)=>jf(t, typeof e != "symbol" ? e + "" : e, s);
    let Wf = class {
        constructor(e){
            this.opts = e, Ac(this, "protocol", "wc"), Ac(this, "version", 2);
        }
    }, qf = class {
        constructor(e){
            this.client = e;
        }
    };
    var Hf = {};
    const Vf = ":";
    function As(t) {
        const [e, s] = t.split(Vf);
        return {
            namespace: e,
            reference: s
        };
    }
    function Vd(t, e) {
        return t.includes(":") ? [
            t
        ] : e.chains || [];
    }
    var Kf = Object.defineProperty, zf = Object.defineProperties, Gf = Object.getOwnPropertyDescriptors, Ic = Object.getOwnPropertySymbols, Yf = Object.prototype.hasOwnProperty, Jf = Object.prototype.propertyIsEnumerable, Yo = (t, e, s)=>e in t ? Kf(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Nc = (t, e)=>{
        for(var s in e || (e = {}))Yf.call(e, s) && Yo(t, s, e[s]);
        if (Ic) for (var s of Ic(e))Jf.call(e, s) && Yo(t, s, e[s]);
        return t;
    }, Xf = (t, e)=>zf(t, Gf(e)), _c = (t, e, s)=>Yo(t, typeof e != "symbol" ? e + "" : e, s);
    const Zf = "ReactNative", _t = {
        reactNative: "react-native",
        node: "node",
        browser: "browser",
        unknown: "unknown"
    }, Qf = "js";
    function xi() {
        return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
    }
    function Js() {
        return !_s.getDocument() && !!_s.getNavigator() && navigator.product === Zf;
    }
    function eg() {
        return Js() && typeof globalThis < "u" && typeof globalThis?.Platform < "u" && globalThis?.Platform.OS === "android";
    }
    function tg() {
        return Js() && typeof globalThis < "u" && typeof globalThis?.Platform < "u" && globalThis?.Platform.OS === "ios";
    }
    function nr() {
        return !xi() && !!_s.getNavigator() && !!_s.getDocument();
    }
    function zr() {
        return Js() ? _t.reactNative : xi() ? _t.node : nr() ? _t.browser : _t.unknown;
    }
    function Sc() {
        var t;
        try {
            return Js() && typeof globalThis < "u" && typeof globalThis?.Application < "u" ? (t = globalThis.Application) == null ? void 0 : t.applicationId : void 0;
        } catch  {
            return;
        }
    }
    function sg(t, e) {
        const s = new URLSearchParams(t);
        return Object.entries(e).sort(([n], [r])=>n.localeCompare(r)).forEach(([n, r])=>{
            r != null && s.set(n, String(r));
        }), s.toString();
    }
    function ng(t) {
        var e, s;
        const n = Kd();
        try {
            return t != null && t.url && n.url && new URL(t.url).host !== new URL(n.url).host && (console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${n.url}. This is probably unintended and can lead to issues.`), t.url = n.url), (e = t?.icons) != null && e.length && t.icons.length > 0 && (t.icons = t.icons.filter((r)=>r !== "")), Xf(Nc(Nc({}, n), t), {
                url: t?.url || n.url,
                name: t?.name || n.name,
                description: t?.description || n.description,
                icons: (s = t?.icons) != null && s.length && t.icons.length > 0 ? t.icons : n.icons
            });
        } catch (r) {
            return console.warn("Error populating app metadata", r), t || n;
        }
    }
    function Kd() {
        return Wu.getWindowMetadata() || {
            name: "",
            description: "",
            url: "",
            icons: [
                ""
            ]
        };
    }
    function rg() {
        if (zr() === _t.reactNative && typeof globalThis < "u" && typeof globalThis?.Platform < "u") {
            const { OS: s, Version: n } = globalThis.Platform;
            return [
                s,
                n
            ].join("-");
        }
        const t = Hu();
        if (t === null) return "unknown";
        const e = t.os ? t.os.replace(" ", "").toLowerCase() : "unknown";
        return t.type === "browser" ? [
            e,
            t.name,
            t.version
        ].join("-") : [
            e,
            t.version
        ].join("-");
    }
    function ig() {
        var t;
        const e = zr();
        return e === _t.browser ? [
            e,
            ((t = _s.getLocation()) == null ? void 0 : t.host) || "unknown"
        ].join(":") : e;
    }
    function zd(t, e, s) {
        const n = rg(), r = ig();
        return [
            [
                t,
                e
            ].join("-"),
            [
                Qf,
                s
            ].join("-"),
            n,
            r
        ].join("/");
    }
    function og({ protocol: t, version: e, relayUrl: s, sdkVersion: n, auth: r, projectId: i, useOnCloseEvent: o, bundleId: a, packageName: c }) {
        const l = s.split("?"), d = zd(t, e, n), h = {
            auth: r,
            ua: d,
            projectId: i,
            useOnCloseEvent: o,
            packageName: c || void 0,
            bundleId: a || void 0
        }, u = sg(l[1] || "", h);
        return l[0] + "?" + u;
    }
    function hn(t, e) {
        return t.filter((s)=>e.includes(s)).length === t.length;
    }
    function Jo(t) {
        return Object.fromEntries(t.entries());
    }
    function Xo(t) {
        return new Map(Object.entries(t));
    }
    function on(t = W.FIVE_MINUTES, e) {
        const s = W.toMiliseconds(t || W.FIVE_MINUTES);
        let n, r, i, o;
        return {
            resolve: (a)=>{
                i && n && (clearTimeout(i), n(a), o = Promise.resolve(a));
            },
            reject: (a)=>{
                i && r && (clearTimeout(i), r(a));
            },
            done: ()=>new Promise((a, c)=>{
                    if (o) return a(o);
                    i = setTimeout(()=>{
                        const l = new Error(e);
                        o = Promise.reject(l), c(l);
                    }, s), n = a, r = c;
                })
        };
    }
    function is(t, e, s) {
        return new Promise(async (n, r)=>{
            const i = setTimeout(()=>r(new Error(s)), e);
            try {
                const o = await t;
                n(o);
            } catch (o) {
                r(o);
            }
            clearTimeout(i);
        });
    }
    function Gd(t, e) {
        if (typeof e == "string" && e.startsWith(`${t}:`)) return e;
        if (t.toLowerCase() === "topic") {
            if (typeof e != "string") throw new Error('Value must be "string" for expirer target type: topic');
            return `topic:${e}`;
        } else if (t.toLowerCase() === "id") {
            if (typeof e != "number") throw new Error('Value must be "number" for expirer target type: id');
            return `id:${e}`;
        }
        throw new Error(`Unknown expirer target type: ${t}`);
    }
    function ag(t) {
        return Gd("topic", t);
    }
    function cg(t) {
        return Gd("id", t);
    }
    function Yd(t) {
        const [e, s] = t.split(":"), n = {
            id: void 0,
            topic: void 0
        };
        if (e === "topic" && typeof s == "string") n.topic = s;
        else if (e === "id" && Number.isInteger(Number(s))) n.id = Number(s);
        else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${s}`);
        return n;
    }
    function Me(t, e) {
        return W.fromMiliseconds(Date.now() + W.toMiliseconds(t));
    }
    function ss(t) {
        return Date.now() >= W.toMiliseconds(t);
    }
    function Ae(t, e) {
        return `${t}${e ? `:${e}` : ""}`;
    }
    function cs(t = [], e = []) {
        return [
            ...new Set([
                ...t,
                ...e
            ])
        ];
    }
    async function lg({ id: t, topic: e, wcDeepLink: s }) {
        var n;
        try {
            if (!s) return;
            const r = typeof s == "string" ? JSON.parse(s) : s, i = r?.href;
            if (typeof i != "string") return;
            const o = dg(i, t, e), a = zr();
            if (a === _t.browser) {
                if (!((n = _s.getDocument()) != null && n.hasFocus())) {
                    console.warn("Document does not have focus, skipping deeplink.");
                    return;
                }
                hg(o);
            } else a === _t.reactNative && typeof globalThis?.Linking < "u" && await globalThis.Linking.openURL(o);
        } catch (r) {
            console.error(r);
        }
    }
    function dg(t, e, s) {
        const n = `requestId=${e}&sessionTopic=${s}`;
        t.endsWith("/") && (t = t.slice(0, -1));
        let r = `${t}`;
        if (t.startsWith("https://t.me")) {
            const i = t.includes("?") ? "&startapp=" : "?startapp=";
            r = `${r}${i}${gg(n, !0)}`;
        } else r = `${r}/wc?${n}`;
        return r;
    }
    function hg(t) {
        let e = "_self";
        fg() ? e = "_top" : (pg() || t.startsWith("https://") || t.startsWith("http://")) && (e = "_blank"), window.open(t, e, "noreferrer noopener");
    }
    async function ug(t, e) {
        let s = "";
        try {
            if (nr() && (s = localStorage.getItem(e), s)) return s;
            s = await t.getItem(e);
        } catch (n) {
            console.error(n);
        }
        return s;
    }
    function Tc(t, e) {
        if (!t.includes(e)) return null;
        const s = t.split(/([&,?,=])/), n = s.indexOf(e);
        return s[n + 2];
    }
    function kc() {
        return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t)=>{
            const e = Math.random() * 16 | 0;
            return (t === "x" ? e : e & 3 | 8).toString(16);
        });
    }
    function Ua() {
        return typeof process < "u" && Hf.IS_VITEST === "true";
    }
    function pg() {
        return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
    }
    function fg() {
        try {
            return window.self !== window.top;
        } catch  {
            return !1;
        }
    }
    function gg(t, e = !1) {
        const s = Buffer.from(t).toString("base64");
        return e ? s.replace(/[=]/g, "") : s;
    }
    function Jd(t) {
        return Buffer.from(t, "base64").toString("utf-8");
    }
    function mg(t) {
        return new Promise((e)=>setTimeout(e, t));
    }
    let wg = class {
        constructor({ limit: e }){
            _c(this, "limit"), _c(this, "set"), this.limit = e, this.set = new Set;
        }
        add(e) {
            if (!this.set.has(e)) {
                if (this.set.size >= this.limit) {
                    const s = this.set.values().next().value;
                    s && this.set.delete(s);
                }
                this.set.add(e);
            }
        }
        has(e) {
            return this.set.has(e);
        }
    };
    const ii = BigInt(2 ** 32 - 1), Oc = BigInt(32);
    function Xd(t, e = !1) {
        return e ? {
            h: Number(t & ii),
            l: Number(t >> Oc & ii)
        } : {
            h: Number(t >> Oc & ii) | 0,
            l: Number(t & ii) | 0
        };
    }
    function Zd(t, e = !1) {
        const s = t.length;
        let n = new Uint32Array(s), r = new Uint32Array(s);
        for(let i = 0; i < s; i++){
            const { h: o, l: a } = Xd(t[i], e);
            [n[i], r[i]] = [
                o,
                a
            ];
        }
        return [
            n,
            r
        ];
    }
    const Pc = (t, e, s)=>t >>> s, Rc = (t, e, s)=>t << 32 - s | e >>> s, Bs = (t, e, s)=>t >>> s | e << 32 - s, Fs = (t, e, s)=>t << 32 - s | e >>> s, br = (t, e, s)=>t << 64 - s | e >>> s - 32, Cr = (t, e, s)=>t >>> s - 32 | e << 64 - s, yg = (t, e)=>e, bg = (t, e)=>t, Cg = (t, e, s)=>t << s | e >>> 32 - s, Eg = (t, e, s)=>e << s | t >>> 32 - s, vg = (t, e, s)=>e << s - 32 | t >>> 64 - s, Ag = (t, e, s)=>t << s - 32 | e >>> 64 - s;
    function Ht(t, e, s, n) {
        const r = (e >>> 0) + (n >>> 0);
        return {
            h: t + s + (r / 2 ** 32 | 0) | 0,
            l: r | 0
        };
    }
    const Da = (t, e, s)=>(t >>> 0) + (e >>> 0) + (s >>> 0), La = (t, e, s, n)=>e + s + n + (t / 2 ** 32 | 0) | 0, Ig = (t, e, s, n)=>(t >>> 0) + (e >>> 0) + (s >>> 0) + (n >>> 0), Ng = (t, e, s, n, r)=>e + s + n + r + (t / 2 ** 32 | 0) | 0, _g = (t, e, s, n, r)=>(t >>> 0) + (e >>> 0) + (s >>> 0) + (n >>> 0) + (r >>> 0), Sg = (t, e, s, n, r, i)=>e + s + n + r + i + (t / 2 ** 32 | 0) | 0, On = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    function Ki(t) {
        return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
    }
    function Ss(t) {
        if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
    }
    function Yt(t, ...e) {
        if (!Ki(t)) throw new Error("Uint8Array expected");
        if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
    }
    function zi(t) {
        if (typeof t != "function" || typeof t.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
        Ss(t.outputLen), Ss(t.blockLen);
    }
    function Ys(t, e = !0) {
        if (t.destroyed) throw new Error("Hash instance has been destroyed");
        if (e && t.finished) throw new Error("Hash#digest() has already been called");
    }
    function Ma(t, e) {
        Yt(t);
        const s = e.outputLen;
        if (t.length < s) throw new Error("digestInto() expects output buffer of length at least " + s);
    }
    function $r(t) {
        return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
    }
    function Mt(...t) {
        for(let e = 0; e < t.length; e++)t[e].fill(0);
    }
    function po(t) {
        return new DataView(t.buffer, t.byteOffset, t.byteLength);
    }
    function Jt(t, e) {
        return t << 32 - e | t >>> e;
    }
    const Qd = new Uint8Array(new Uint32Array([
        287454020
    ]).buffer)[0] === 68;
    function eh(t) {
        return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
    }
    const fs = Qd ? (t)=>t : (t)=>eh(t);
    function Tg(t) {
        for(let e = 0; e < t.length; e++)t[e] = eh(t[e]);
        return t;
    }
    const js = Qd ? (t)=>t : Tg, th = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", kg = Array.from({
        length: 256
    }, (t, e)=>e.toString(16).padStart(2, "0"));
    function Hn(t) {
        if (Yt(t), th) return t.toHex();
        let e = "";
        for(let s = 0; s < t.length; s++)e += kg[t[s]];
        return e;
    }
    const us = {
        _0: 48,
        _9: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
    };
    function xc(t) {
        if (t >= us._0 && t <= us._9) return t - us._0;
        if (t >= us.A && t <= us.F) return t - (us.A - 10);
        if (t >= us.a && t <= us.f) return t - (us.a - 10);
    }
    function $i(t) {
        if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
        if (th) return Uint8Array.fromHex(t);
        const e = t.length, s = e / 2;
        if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
        const n = new Uint8Array(s);
        for(let r = 0, i = 0; r < s; r++, i += 2){
            const o = xc(t.charCodeAt(i)), a = xc(t.charCodeAt(i + 1));
            if (o === void 0 || a === void 0) {
                const c = t[i] + t[i + 1];
                throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
            }
            n[r] = o * 16 + a;
        }
        return n;
    }
    function sh(t) {
        if (typeof t != "string") throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(t));
    }
    function zt(t) {
        return typeof t == "string" && (t = sh(t)), Yt(t), t;
    }
    function Ws(...t) {
        let e = 0;
        for(let n = 0; n < t.length; n++){
            const r = t[n];
            Yt(r), e += r.length;
        }
        const s = new Uint8Array(e);
        for(let n = 0, r = 0; n < t.length; n++){
            const i = t[n];
            s.set(i, r), r += i.length;
        }
        return s;
    }
    class Gi {
    }
    function Gr(t) {
        const e = (n)=>t().update(zt(n)).digest(), s = t();
        return e.outputLen = s.outputLen, e.blockLen = s.blockLen, e.create = ()=>t(), e;
    }
    function Og(t) {
        const e = (n, r)=>t(r).update(zt(n)).digest(), s = t({});
        return e.outputLen = s.outputLen, e.blockLen = s.blockLen, e.create = (n)=>t(n), e;
    }
    function _n(t = 32) {
        if (On && typeof On.getRandomValues == "function") return On.getRandomValues(new Uint8Array(t));
        if (On && typeof On.randomBytes == "function") return Uint8Array.from(On.randomBytes(t));
        throw new Error("crypto.getRandomValues must be defined");
    }
    const Pg = BigInt(0), cr = BigInt(1), Rg = BigInt(2), xg = BigInt(7), $g = BigInt(256), Ug = BigInt(113), nh = [], rh = [], ih = [];
    for(let t = 0, e = cr, s = 1, n = 0; t < 24; t++){
        [s, n] = [
            n,
            (2 * s + 3 * n) % 5
        ], nh.push(2 * (5 * n + s)), rh.push((t + 1) * (t + 2) / 2 % 64);
        let r = Pg;
        for(let i = 0; i < 7; i++)e = (e << cr ^ (e >> xg) * Ug) % $g, e & Rg && (r ^= cr << (cr << BigInt(i)) - cr);
        ih.push(r);
    }
    const oh = Zd(ih, !0), Dg = oh[0], Lg = oh[1], $c = (t, e, s)=>s > 32 ? vg(t, e, s) : Cg(t, e, s), Uc = (t, e, s)=>s > 32 ? Ag(t, e, s) : Eg(t, e, s);
    function Mg(t, e = 24) {
        const s = new Uint32Array(10);
        for(let n = 24 - e; n < 24; n++){
            for(let o = 0; o < 10; o++)s[o] = t[o] ^ t[o + 10] ^ t[o + 20] ^ t[o + 30] ^ t[o + 40];
            for(let o = 0; o < 10; o += 2){
                const a = (o + 8) % 10, c = (o + 2) % 10, l = s[c], d = s[c + 1], h = $c(l, d, 1) ^ s[a], u = Uc(l, d, 1) ^ s[a + 1];
                for(let f = 0; f < 50; f += 10)t[o + f] ^= h, t[o + f + 1] ^= u;
            }
            let r = t[2], i = t[3];
            for(let o = 0; o < 24; o++){
                const a = rh[o], c = $c(r, i, a), l = Uc(r, i, a), d = nh[o];
                r = t[d], i = t[d + 1], t[d] = c, t[d + 1] = l;
            }
            for(let o = 0; o < 50; o += 10){
                for(let a = 0; a < 10; a++)s[a] = t[o + a];
                for(let a = 0; a < 10; a++)t[o + a] ^= ~s[(a + 2) % 10] & s[(a + 4) % 10];
            }
            t[0] ^= Dg[n], t[1] ^= Lg[n];
        }
        Mt(s);
    }
    let Bg = class ah extends Gi {
        constructor(e, s, n, r = !1, i = 24){
            if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = e, this.suffix = s, this.outputLen = n, this.enableXOF = r, this.rounds = i, Ss(n), !(0 < e && e < 200)) throw new Error("only keccak-f1600 function is supported");
            this.state = new Uint8Array(200), this.state32 = $r(this.state);
        }
        clone() {
            return this._cloneInto();
        }
        keccak() {
            js(this.state32), Mg(this.state32, this.rounds), js(this.state32), this.posOut = 0, this.pos = 0;
        }
        update(e) {
            Ys(this), e = zt(e), Yt(e);
            const { blockLen: s, state: n } = this, r = e.length;
            for(let i = 0; i < r;){
                const o = Math.min(s - this.pos, r - i);
                for(let a = 0; a < o; a++)n[this.pos++] ^= e[i++];
                this.pos === s && this.keccak();
            }
            return this;
        }
        finish() {
            if (this.finished) return;
            this.finished = !0;
            const { state: e, suffix: s, pos: n, blockLen: r } = this;
            e[n] ^= s, (s & 128) !== 0 && n === r - 1 && this.keccak(), e[r - 1] ^= 128, this.keccak();
        }
        writeInto(e) {
            Ys(this, !1), Yt(e), this.finish();
            const s = this.state, { blockLen: n } = this;
            for(let r = 0, i = e.length; r < i;){
                this.posOut >= n && this.keccak();
                const o = Math.min(n - this.posOut, i - r);
                e.set(s.subarray(this.posOut, this.posOut + o), r), this.posOut += o, r += o;
            }
            return e;
        }
        xofInto(e) {
            if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
            return this.writeInto(e);
        }
        xof(e) {
            return Ss(e), this.xofInto(new Uint8Array(e));
        }
        digestInto(e) {
            if (Ma(e, this), this.finished) throw new Error("digest() was already called");
            return this.writeInto(e), this.destroy(), e;
        }
        digest() {
            return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
            this.destroyed = !0, Mt(this.state);
        }
        _cloneInto(e) {
            const { blockLen: s, suffix: n, outputLen: r, rounds: i, enableXOF: o } = this;
            return e || (e = new ah(s, n, r, o, i)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = i, e.suffix = n, e.outputLen = r, e.enableXOF = o, e.destroyed = this.destroyed, e;
        }
    };
    const Fg = (t, e, s)=>Gr(()=>new Bg(e, t, s)), jg = Fg(1, 136, 256 / 8);
    function Wg(t, e, s, n) {
        if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, s, n);
        const r = BigInt(32), i = BigInt(4294967295), o = Number(s >> r & i), a = Number(s & i), c = n ? 4 : 0, l = n ? 0 : 4;
        t.setUint32(e + c, o, n), t.setUint32(e + l, a, n);
    }
    function qg(t, e, s) {
        return t & e ^ ~t & s;
    }
    function Hg(t, e, s) {
        return t & e ^ t & s ^ e & s;
    }
    let ch = class extends Gi {
        constructor(e, s, n, r){
            super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = s, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = po(this.buffer);
        }
        update(e) {
            Ys(this), e = zt(e), Yt(e);
            const { view: s, buffer: n, blockLen: r } = this, i = e.length;
            for(let o = 0; o < i;){
                const a = Math.min(r - this.pos, i - o);
                if (a === r) {
                    const c = po(e);
                    for(; r <= i - o; o += r)this.process(c, o);
                    continue;
                }
                n.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === r && (this.process(s, 0), this.pos = 0);
            }
            return this.length += e.length, this.roundClean(), this;
        }
        digestInto(e) {
            Ys(this), Ma(e, this), this.finished = !0;
            const { buffer: s, view: n, blockLen: r, isLE: i } = this;
            let { pos: o } = this;
            s[o++] = 128, Mt(this.buffer.subarray(o)), this.padOffset > r - o && (this.process(n, 0), o = 0);
            for(let h = o; h < r; h++)s[h] = 0;
            Wg(n, r - 8, BigInt(this.length * 8), i), this.process(n, 0);
            const a = po(e), c = this.outputLen;
            if (c % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const l = c / 4, d = this.get();
            if (l > d.length) throw new Error("_sha2: outputLen bigger than state");
            for(let h = 0; h < l; h++)a.setUint32(4 * h, d[h], i);
        }
        digest() {
            const { buffer: e, outputLen: s } = this;
            this.digestInto(e);
            const n = e.slice(0, s);
            return this.destroy(), n;
        }
        _cloneInto(e) {
            e || (e = new this.constructor), e.set(...this.get());
            const { blockLen: s, buffer: n, length: r, finished: i, destroyed: o, pos: a } = this;
            return e.destroyed = o, e.finished = i, e.length = r, e.pos = a, r % s && e.buffer.set(n), e;
        }
        clone() {
            return this._cloneInto();
        }
    };
    const Rs = Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
    ]), Qe = Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
    ]), et = Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
    ]), Vg = Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
    ]), xs = new Uint32Array(64);
    class Kg extends ch {
        constructor(e = 32){
            super(64, e, 8, !1), this.A = Rs[0] | 0, this.B = Rs[1] | 0, this.C = Rs[2] | 0, this.D = Rs[3] | 0, this.E = Rs[4] | 0, this.F = Rs[5] | 0, this.G = Rs[6] | 0, this.H = Rs[7] | 0;
        }
        get() {
            const { A: e, B: s, C: n, D: r, E: i, F: o, G: a, H: c } = this;
            return [
                e,
                s,
                n,
                r,
                i,
                o,
                a,
                c
            ];
        }
        set(e, s, n, r, i, o, a, c) {
            this.A = e | 0, this.B = s | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
        }
        process(e, s) {
            for(let h = 0; h < 16; h++, s += 4)xs[h] = e.getUint32(s, !1);
            for(let h = 16; h < 64; h++){
                const u = xs[h - 15], f = xs[h - 2], g = Jt(u, 7) ^ Jt(u, 18) ^ u >>> 3, w = Jt(f, 17) ^ Jt(f, 19) ^ f >>> 10;
                xs[h] = w + xs[h - 7] + g + xs[h - 16] | 0;
            }
            let { A: n, B: r, C: i, D: o, E: a, F: c, G: l, H: d } = this;
            for(let h = 0; h < 64; h++){
                const u = Jt(a, 6) ^ Jt(a, 11) ^ Jt(a, 25), f = d + u + qg(a, c, l) + Vg[h] + xs[h] | 0, g = (Jt(n, 2) ^ Jt(n, 13) ^ Jt(n, 22)) + Hg(n, r, i) | 0;
                d = l, l = c, c = a, a = o + f | 0, o = i, i = r, r = n, n = f + g | 0;
            }
            n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, d = d + this.H | 0, this.set(n, r, i, o, a, c, l, d);
        }
        roundClean() {
            Mt(xs);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), Mt(this.buffer);
        }
    }
    const lh = Zd([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
    ].map((t)=>BigInt(t))), zg = lh[0], Gg = lh[1], $s = new Uint32Array(80), Us = new Uint32Array(80);
    let Ba = class extends ch {
        constructor(e = 64){
            super(128, e, 16, !1), this.Ah = et[0] | 0, this.Al = et[1] | 0, this.Bh = et[2] | 0, this.Bl = et[3] | 0, this.Ch = et[4] | 0, this.Cl = et[5] | 0, this.Dh = et[6] | 0, this.Dl = et[7] | 0, this.Eh = et[8] | 0, this.El = et[9] | 0, this.Fh = et[10] | 0, this.Fl = et[11] | 0, this.Gh = et[12] | 0, this.Gl = et[13] | 0, this.Hh = et[14] | 0, this.Hl = et[15] | 0;
        }
        get() {
            const { Ah: e, Al: s, Bh: n, Bl: r, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: d, Fh: h, Fl: u, Gh: f, Gl: g, Hh: w, Hl: m } = this;
            return [
                e,
                s,
                n,
                r,
                i,
                o,
                a,
                c,
                l,
                d,
                h,
                u,
                f,
                g,
                w,
                m
            ];
        }
        set(e, s, n, r, i, o, a, c, l, d, h, u, f, g, w, m) {
            this.Ah = e | 0, this.Al = s | 0, this.Bh = n | 0, this.Bl = r | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = d | 0, this.Fh = h | 0, this.Fl = u | 0, this.Gh = f | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = m | 0;
        }
        process(e, s) {
            for(let P = 0; P < 16; P++, s += 4)$s[P] = e.getUint32(s), Us[P] = e.getUint32(s += 4);
            for(let P = 16; P < 80; P++){
                const j = $s[P - 15] | 0, G = Us[P - 15] | 0, b = Bs(j, G, 1) ^ Bs(j, G, 8) ^ Pc(j, G, 7), R = Fs(j, G, 1) ^ Fs(j, G, 8) ^ Rc(j, G, 7), U = $s[P - 2] | 0, N = Us[P - 2] | 0, M = Bs(U, N, 19) ^ br(U, N, 61) ^ Pc(U, N, 6), Y = Fs(U, N, 19) ^ Cr(U, N, 61) ^ Rc(U, N, 6), O = Ig(R, Y, Us[P - 7], Us[P - 16]), C = Ng(O, b, M, $s[P - 7], $s[P - 16]);
                $s[P] = C | 0, Us[P] = O | 0;
            }
            let { Ah: n, Al: r, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: d, Eh: h, El: u, Fh: f, Fl: g, Gh: w, Gl: m, Hh: A, Hl: v } = this;
            for(let P = 0; P < 80; P++){
                const j = Bs(h, u, 14) ^ Bs(h, u, 18) ^ br(h, u, 41), G = Fs(h, u, 14) ^ Fs(h, u, 18) ^ Cr(h, u, 41), b = h & f ^ ~h & w, R = u & g ^ ~u & m, U = _g(v, G, R, Gg[P], Us[P]), N = Sg(U, A, j, b, zg[P], $s[P]), M = U | 0, Y = Bs(n, r, 28) ^ br(n, r, 34) ^ br(n, r, 39), O = Fs(n, r, 28) ^ Cr(n, r, 34) ^ Cr(n, r, 39), C = n & i ^ n & a ^ i & a, y = r & o ^ r & c ^ o & c;
                A = w | 0, v = m | 0, w = f | 0, m = g | 0, f = h | 0, g = u | 0, { h, l: u } = Ht(l | 0, d | 0, N | 0, M | 0), l = a | 0, d = c | 0, a = i | 0, c = o | 0, i = n | 0, o = r | 0;
                const E = Da(M, O, y);
                n = La(E, N, Y, C), r = E | 0;
            }
            ({ h: n, l: r } = Ht(this.Ah | 0, this.Al | 0, n | 0, r | 0)), { h: i, l: o } = Ht(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ht(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: d } = Ht(this.Dh | 0, this.Dl | 0, l | 0, d | 0), { h, l: u } = Ht(this.Eh | 0, this.El | 0, h | 0, u | 0), { h: f, l: g } = Ht(this.Fh | 0, this.Fl | 0, f | 0, g | 0), { h: w, l: m } = Ht(this.Gh | 0, this.Gl | 0, w | 0, m | 0), { h: A, l: v } = Ht(this.Hh | 0, this.Hl | 0, A | 0, v | 0), this.set(n, r, i, o, a, c, l, d, h, u, f, g, w, m, A, v);
        }
        roundClean() {
            Mt($s, Us);
        }
        destroy() {
            Mt(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    };
    class Yg extends Ba {
        constructor(){
            super(48), this.Ah = Qe[0] | 0, this.Al = Qe[1] | 0, this.Bh = Qe[2] | 0, this.Bl = Qe[3] | 0, this.Ch = Qe[4] | 0, this.Cl = Qe[5] | 0, this.Dh = Qe[6] | 0, this.Dl = Qe[7] | 0, this.Eh = Qe[8] | 0, this.El = Qe[9] | 0, this.Fh = Qe[10] | 0, this.Fl = Qe[11] | 0, this.Gh = Qe[12] | 0, this.Gl = Qe[13] | 0, this.Hh = Qe[14] | 0, this.Hl = Qe[15] | 0;
        }
    }
    const tt = Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
    ]);
    class Jg extends Ba {
        constructor(){
            super(32), this.Ah = tt[0] | 0, this.Al = tt[1] | 0, this.Bh = tt[2] | 0, this.Bl = tt[3] | 0, this.Ch = tt[4] | 0, this.Cl = tt[5] | 0, this.Dh = tt[6] | 0, this.Dl = tt[7] | 0, this.Eh = tt[8] | 0, this.El = tt[9] | 0, this.Fh = tt[10] | 0, this.Fl = tt[11] | 0, this.Gh = tt[12] | 0, this.Gl = tt[13] | 0, this.Hh = tt[14] | 0, this.Hl = tt[15] | 0;
        }
    }
    const Yi = Gr(()=>new Kg), Xg = Gr(()=>new Ba), Zg = Gr(()=>new Yg), Qg = Gr(()=>new Jg), em = Uint8Array.from([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3,
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4,
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8,
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13,
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9,
        12,
        5,
        1,
        15,
        14,
        13,
        4,
        10,
        0,
        7,
        6,
        3,
        9,
        2,
        8,
        11,
        13,
        11,
        7,
        14,
        12,
        1,
        3,
        9,
        5,
        0,
        15,
        4,
        8,
        6,
        2,
        10,
        6,
        15,
        14,
        9,
        11,
        3,
        0,
        8,
        12,
        2,
        13,
        7,
        1,
        4,
        10,
        5,
        10,
        2,
        8,
        4,
        7,
        6,
        1,
        5,
        15,
        11,
        9,
        14,
        3,
        12,
        13,
        0,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3,
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4,
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8,
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13,
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9
    ]), je = Uint32Array.from([
        4089235720,
        1779033703,
        2227873595,
        3144134277,
        4271175723,
        1013904242,
        1595750129,
        2773480762,
        2917565137,
        1359893119,
        725511199,
        2600822924,
        4215389547,
        528734635,
        327033209,
        1541459225
    ]), z = new Uint32Array(32);
    function Ds(t, e, s, n, r, i) {
        const o = r[i], a = r[i + 1];
        let c = z[2 * t], l = z[2 * t + 1], d = z[2 * e], h = z[2 * e + 1], u = z[2 * s], f = z[2 * s + 1], g = z[2 * n], w = z[2 * n + 1], m = Da(c, d, o);
        l = La(m, l, h, a), c = m | 0, { Dh: w, Dl: g } = {
            Dh: w ^ l,
            Dl: g ^ c
        }, { Dh: w, Dl: g } = {
            Dh: yg(w, g),
            Dl: bg(w)
        }, { h: f, l: u } = Ht(f, u, w, g), { Bh: h, Bl: d } = {
            Bh: h ^ f,
            Bl: d ^ u
        }, { Bh: h, Bl: d } = {
            Bh: Bs(h, d, 24),
            Bl: Fs(h, d, 24)
        }, z[2 * t] = c, z[2 * t + 1] = l, z[2 * e] = d, z[2 * e + 1] = h, z[2 * s] = u, z[2 * s + 1] = f, z[2 * n] = g, z[2 * n + 1] = w;
    }
    function Ls(t, e, s, n, r, i) {
        const o = r[i], a = r[i + 1];
        let c = z[2 * t], l = z[2 * t + 1], d = z[2 * e], h = z[2 * e + 1], u = z[2 * s], f = z[2 * s + 1], g = z[2 * n], w = z[2 * n + 1], m = Da(c, d, o);
        l = La(m, l, h, a), c = m | 0, { Dh: w, Dl: g } = {
            Dh: w ^ l,
            Dl: g ^ c
        }, { Dh: w, Dl: g } = {
            Dh: Bs(w, g, 16),
            Dl: Fs(w, g, 16)
        }, { h: f, l: u } = Ht(f, u, w, g), { Bh: h, Bl: d } = {
            Bh: h ^ f,
            Bl: d ^ u
        }, { Bh: h, Bl: d } = {
            Bh: br(h, d, 63),
            Bl: Cr(h, d, 63)
        }, z[2 * t] = c, z[2 * t + 1] = l, z[2 * e] = d, z[2 * e + 1] = h, z[2 * s] = u, z[2 * s + 1] = f, z[2 * n] = g, z[2 * n + 1] = w;
    }
    function tm(t, e = {}, s, n, r) {
        if (Ss(s), t < 0 || t > s) throw new Error("outputLen bigger than keyLen");
        const { key: i, salt: o, personalization: a } = e;
        if (i !== void 0 && (i.length < 1 || i.length > s)) throw new Error("key length must be undefined or 1.." + s);
        if (o !== void 0 && o.length !== n) throw new Error("salt must be undefined or " + n);
        if (a !== void 0 && a.length !== r) throw new Error("personalization must be undefined or " + r);
    }
    class sm extends Gi {
        constructor(e, s){
            super(), this.finished = !1, this.destroyed = !1, this.length = 0, this.pos = 0, Ss(e), Ss(s), this.blockLen = e, this.outputLen = s, this.buffer = new Uint8Array(e), this.buffer32 = $r(this.buffer);
        }
        update(e) {
            Ys(this), e = zt(e), Yt(e);
            const { blockLen: s, buffer: n, buffer32: r } = this, i = e.length, o = e.byteOffset, a = e.buffer;
            for(let c = 0; c < i;){
                this.pos === s && (js(r), this.compress(r, 0, !1), js(r), this.pos = 0);
                const l = Math.min(s - this.pos, i - c), d = o + c;
                if (l === s && !(d % 4) && c + l < i) {
                    const h = new Uint32Array(a, d, Math.floor((i - c) / 4));
                    js(h);
                    for(let u = 0; c + s < i; u += r.length, c += s)this.length += s, this.compress(h, u, !1);
                    js(h);
                    continue;
                }
                n.set(e.subarray(c, c + l), this.pos), this.pos += l, this.length += l, c += l;
            }
            return this;
        }
        digestInto(e) {
            Ys(this), Ma(e, this);
            const { pos: s, buffer32: n } = this;
            this.finished = !0, Mt(this.buffer.subarray(s)), js(n), this.compress(n, 0, !0), js(n);
            const r = $r(e);
            this.get().forEach((i, o)=>r[o] = fs(i));
        }
        digest() {
            const { buffer: e, outputLen: s } = this;
            this.digestInto(e);
            const n = e.slice(0, s);
            return this.destroy(), n;
        }
        _cloneInto(e) {
            const { buffer: s, length: n, finished: r, destroyed: i, outputLen: o, pos: a } = this;
            return e || (e = new this.constructor({
                dkLen: o
            })), e.set(...this.get()), e.buffer.set(s), e.destroyed = i, e.finished = r, e.length = n, e.pos = a, e.outputLen = o, e;
        }
        clone() {
            return this._cloneInto();
        }
    }
    class nm extends sm {
        constructor(e = {}){
            const s = e.dkLen === void 0 ? 64 : e.dkLen;
            super(128, s), this.v0l = je[0] | 0, this.v0h = je[1] | 0, this.v1l = je[2] | 0, this.v1h = je[3] | 0, this.v2l = je[4] | 0, this.v2h = je[5] | 0, this.v3l = je[6] | 0, this.v3h = je[7] | 0, this.v4l = je[8] | 0, this.v4h = je[9] | 0, this.v5l = je[10] | 0, this.v5h = je[11] | 0, this.v6l = je[12] | 0, this.v6h = je[13] | 0, this.v7l = je[14] | 0, this.v7h = je[15] | 0, tm(s, e, 64, 16, 16);
            let { key: n, personalization: r, salt: i } = e, o = 0;
            if (n !== void 0 && (n = zt(n), o = n.length), this.v0l ^= this.outputLen | o << 8 | 65536 | 1 << 24, i !== void 0) {
                i = zt(i);
                const a = $r(i);
                this.v4l ^= fs(a[0]), this.v4h ^= fs(a[1]), this.v5l ^= fs(a[2]), this.v5h ^= fs(a[3]);
            }
            if (r !== void 0) {
                r = zt(r);
                const a = $r(r);
                this.v6l ^= fs(a[0]), this.v6h ^= fs(a[1]), this.v7l ^= fs(a[2]), this.v7h ^= fs(a[3]);
            }
            if (n !== void 0) {
                const a = new Uint8Array(this.blockLen);
                a.set(n), this.update(a);
            }
        }
        get() {
            let { v0l: e, v0h: s, v1l: n, v1h: r, v2l: i, v2h: o, v3l: a, v3h: c, v4l: l, v4h: d, v5l: h, v5h: u, v6l: f, v6h: g, v7l: w, v7h: m } = this;
            return [
                e,
                s,
                n,
                r,
                i,
                o,
                a,
                c,
                l,
                d,
                h,
                u,
                f,
                g,
                w,
                m
            ];
        }
        set(e, s, n, r, i, o, a, c, l, d, h, u, f, g, w, m) {
            this.v0l = e | 0, this.v0h = s | 0, this.v1l = n | 0, this.v1h = r | 0, this.v2l = i | 0, this.v2h = o | 0, this.v3l = a | 0, this.v3h = c | 0, this.v4l = l | 0, this.v4h = d | 0, this.v5l = h | 0, this.v5h = u | 0, this.v6l = f | 0, this.v6h = g | 0, this.v7l = w | 0, this.v7h = m | 0;
        }
        compress(e, s, n) {
            this.get().forEach((c, l)=>z[l] = c), z.set(je, 16);
            let { h: r, l: i } = Xd(BigInt(this.length));
            z[24] = je[8] ^ i, z[25] = je[9] ^ r, n && (z[28] = ~z[28], z[29] = ~z[29]);
            let o = 0;
            const a = em;
            for(let c = 0; c < 12; c++)Ds(0, 4, 8, 12, e, s + 2 * a[o++]), Ls(0, 4, 8, 12, e, s + 2 * a[o++]), Ds(1, 5, 9, 13, e, s + 2 * a[o++]), Ls(1, 5, 9, 13, e, s + 2 * a[o++]), Ds(2, 6, 10, 14, e, s + 2 * a[o++]), Ls(2, 6, 10, 14, e, s + 2 * a[o++]), Ds(3, 7, 11, 15, e, s + 2 * a[o++]), Ls(3, 7, 11, 15, e, s + 2 * a[o++]), Ds(0, 5, 10, 15, e, s + 2 * a[o++]), Ls(0, 5, 10, 15, e, s + 2 * a[o++]), Ds(1, 6, 11, 12, e, s + 2 * a[o++]), Ls(1, 6, 11, 12, e, s + 2 * a[o++]), Ds(2, 7, 8, 13, e, s + 2 * a[o++]), Ls(2, 7, 8, 13, e, s + 2 * a[o++]), Ds(3, 4, 9, 14, e, s + 2 * a[o++]), Ls(3, 4, 9, 14, e, s + 2 * a[o++]);
            this.v0l ^= z[0] ^ z[16], this.v0h ^= z[1] ^ z[17], this.v1l ^= z[2] ^ z[18], this.v1h ^= z[3] ^ z[19], this.v2l ^= z[4] ^ z[20], this.v2h ^= z[5] ^ z[21], this.v3l ^= z[6] ^ z[22], this.v3h ^= z[7] ^ z[23], this.v4l ^= z[8] ^ z[24], this.v4h ^= z[9] ^ z[25], this.v5l ^= z[10] ^ z[26], this.v5h ^= z[11] ^ z[27], this.v6l ^= z[12] ^ z[28], this.v6h ^= z[13] ^ z[29], this.v7l ^= z[14] ^ z[30], this.v7h ^= z[15] ^ z[31], Mt(z);
        }
        destroy() {
            this.destroyed = !0, Mt(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
    const rm = Og((t)=>new nm(t)), im = "https://rpc.walletconnect.org/v1";
    function dh(t) {
        const e = `Ethereum Signed Message:
${t.length}`, s = new TextEncoder().encode(e + t);
        return "0x" + Buffer.from(jg(s)).toString("hex");
    }
    async function om(t, e, s, n, r, i) {
        switch(s.t){
            case "eip191":
                return await am(t, e, s.s);
            case "eip1271":
                return await cm(t, e, s.s, n, r, i);
            default:
                throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${s.t}`);
        }
    }
    async function am(t, e, s) {
        return (await Bu({
            hash: dh(e),
            signature: s
        })).toLowerCase() === t.toLowerCase();
    }
    async function cm(t, e, s, n, r, i) {
        const o = As(n);
        if (!o.namespace || !o.reference) throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${n}`);
        try {
            const a = "0x1626ba7e", c = "0000000000000000000000000000000000000000000000000000000000000040", l = s.substring(2), d = (l.length / 2).toString(16).padStart(64, "0"), h = (e.startsWith("0x") ? e : dh(e)).substring(2), u = a + h + c + d + l, f = await fetch(`${i || im}/?chainId=${n}&projectId=${r}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    id: lm(),
                    jsonrpc: "2.0",
                    method: "eth_call",
                    params: [
                        {
                            to: t,
                            data: u
                        },
                        "latest"
                    ]
                })
            }), { result: g } = await f.json();
            return g ? g.slice(0, a.length).toLowerCase() === a.toLowerCase() : !1;
        } catch (a) {
            return console.error("isValidEip1271Signature: ", a), !1;
        }
    }
    function lm() {
        return Date.now() + Math.floor(Math.random() * 1e3);
    }
    function dm(t) {
        const e = atob(t), s = new Uint8Array(e.length);
        for(let o = 0; o < e.length; o++)s[o] = e.charCodeAt(o);
        const n = s[0];
        if (n === 0) throw new Error("No signatures found");
        const r = 1 + n * 64;
        if (s.length < r) throw new Error("Transaction data too short for claimed signature count");
        if (s.length < 100) throw new Error("Transaction too short");
        const i = Buffer.from(t, "base64").slice(1, 65);
        return tr.encode(i);
    }
    function hm(t) {
        const e = new Uint8Array(Buffer.from(t, "base64")), s = Array.from("TransactionData::").map((i)=>i.charCodeAt(0)), n = new Uint8Array(s.length + e.length);
        n.set(s), n.set(e, s.length);
        const r = rm(n, {
            dkLen: 32
        });
        return tr.encode(r);
    }
    function Dc(t) {
        const e = new Uint8Array(Yi(um(t)));
        return tr.encode(e);
    }
    function um(t) {
        if (t instanceof Uint8Array) return t;
        if (Array.isArray(t)) return new Uint8Array(t);
        if (typeof t == "object" && t != null && t.data) return new Uint8Array(Object.values(t.data));
        if (typeof t == "object" && t) return new Uint8Array(Object.values(t));
        throw new Error("getNearUint8ArrayFromBytes: Unexpected result type from bytes array");
    }
    function Lc(t) {
        const e = Buffer.from(t, "base64"), s = Vu(e).txn;
        if (!s) throw new Error("Invalid signed transaction: missing 'txn' field");
        const n = Ku(s), r = Buffer.from("TX"), i = Buffer.concat([
            r,
            Buffer.from(n)
        ]), o = Qg(i);
        return zu.encode(o).replace(/=+$/, "");
    }
    function fo(t) {
        const e = [];
        let s = BigInt(t);
        for(; s >= BigInt(128);)e.push(Number(s & BigInt(127) | BigInt(128))), s >>= BigInt(7);
        return e.push(Number(s)), Buffer.from(e);
    }
    function pm(t) {
        const e = Buffer.from(t.signed.bodyBytes, "base64"), s = Buffer.from(t.signed.authInfoBytes, "base64"), n = Buffer.from(t.signature.signature, "base64"), r = [];
        r.push(Buffer.from([
            10
        ])), r.push(fo(e.length)), r.push(e), r.push(Buffer.from([
            18
        ])), r.push(fo(s.length)), r.push(s), r.push(Buffer.from([
            26
        ])), r.push(fo(n.length)), r.push(n);
        const i = Buffer.concat(r), o = Yi(i);
        return Buffer.from(o).toString("hex").toUpperCase();
    }
    function fm(t) {
        var e, s;
        const n = [];
        try {
            if (typeof t == "string") return n.push(t), n;
            if (typeof t != "object") return n;
            t != null && t.id && n.push(t.id);
            const r = (s = (e = t?.capabilities) == null ? void 0 : e.caip345) == null ? void 0 : s.transactionHashes;
            r && n.push(...r);
        } catch (r) {
            console.warn("getWalletSendCallsHashes failed: ", r);
        }
        return n;
    }
    var gm = Object.defineProperty, mm = Object.defineProperties, wm = Object.getOwnPropertyDescriptors, Mc = Object.getOwnPropertySymbols, ym = Object.prototype.hasOwnProperty, bm = Object.prototype.propertyIsEnumerable, Bc = (t, e, s)=>e in t ? gm(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Cm = (t, e)=>{
        for(var s in e || (e = {}))ym.call(e, s) && Bc(t, s, e[s]);
        if (Mc) for (var s of Mc(e))bm.call(e, s) && Bc(t, s, e[s]);
        return t;
    }, Em = (t, e)=>mm(t, wm(e));
    const vm = "did:pkh:", Fa = (t)=>t?.split(":"), Am = (t)=>{
        const e = t && Fa(t);
        if (e) return t.includes(vm) ? e[3] : e[1];
    }, Zo = (t)=>{
        const e = t && Fa(t);
        if (e) return e[2] + ":" + e[3];
    }, Ui = (t)=>{
        const e = t && Fa(t);
        if (e) return e.pop();
    };
    async function Fc(t) {
        const { cacao: e, projectId: s } = t, { s: n, p: r } = e, i = hh(r, r.iss), o = Ui(r.iss);
        return await om(o, i, n, Zo(r.iss), s);
    }
    const hh = (t, e)=>{
        const s = `${t.domain} wants you to sign in with your Ethereum account:`, n = Ui(e);
        if (!t.aud && !t.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
        let r = t.statement || void 0;
        const i = `URI: ${t.aud || t.uri}`, o = `Version: ${t.version}`, a = `Chain ID: ${Am(e)}`, c = `Nonce: ${t.nonce}`, l = `Issued At: ${t.iat}`, d = t.exp ? `Expiration Time: ${t.exp}` : void 0, h = t.nbf ? `Not Before: ${t.nbf}` : void 0, u = t.requestId ? `Request ID: ${t.requestId}` : void 0, f = t.resources ? `Resources:${t.resources.map((w)=>`
- ${w}`).join("")}` : void 0, g = yi(t.resources);
        if (g) {
            const w = Ur(g);
            r = Rm(r, w);
        }
        return [
            s,
            n,
            "",
            r,
            "",
            i,
            o,
            a,
            c,
            l,
            d,
            h,
            u,
            f
        ].filter((w)=>w != null).join(`
`);
    };
    function Im(t) {
        return Buffer.from(JSON.stringify(t)).toString("base64");
    }
    function Nm(t) {
        return JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
    }
    function bn(t) {
        if (!t) throw new Error("No recap provided, value is undefined");
        if (!t.att) throw new Error("No `att` property found");
        const e = Object.keys(t.att);
        if (!(e != null && e.length)) throw new Error("No resources found in `att` property");
        e.forEach((s)=>{
            const n = t.att[s];
            if (Array.isArray(n)) throw new Error(`Resource must be an object: ${s}`);
            if (typeof n != "object") throw new Error(`Resource must be an object: ${s}`);
            if (!Object.keys(n).length) throw new Error(`Resource object is empty: ${s}`);
            Object.keys(n).forEach((r)=>{
                const i = n[r];
                if (!Array.isArray(i)) throw new Error(`Ability limits ${r} must be an array of objects, found: ${i}`);
                if (!i.length) throw new Error(`Value of ${r} is empty array, must be an array with objects`);
                i.forEach((o)=>{
                    if (typeof o != "object") throw new Error(`Ability limits (${r}) must be an array of objects, found: ${o}`);
                });
            });
        });
    }
    function _m(t, e, s, n = {}) {
        return s?.sort((r, i)=>r.localeCompare(i)), {
            att: {
                [t]: Sm(e, s, n)
            }
        };
    }
    function Sm(t, e, s = {}) {
        e = e?.sort((r, i)=>r.localeCompare(i));
        const n = e.map((r)=>({
                [`${t}/${r}`]: [
                    s
                ]
            }));
        return Object.assign({}, ...n);
    }
    function uh(t) {
        return bn(t), `urn:recap:${Im(t).replace(/=/g, "")}`;
    }
    function Ur(t) {
        const e = Nm(t.replace("urn:recap:", ""));
        return bn(e), e;
    }
    function Tm(t, e, s) {
        const n = _m(t, e, s);
        return uh(n);
    }
    function km(t) {
        return t && t.includes("urn:recap:");
    }
    function Om(t, e) {
        const s = Ur(t), n = Ur(e), r = Pm(s, n);
        return uh(r);
    }
    function Pm(t, e) {
        bn(t), bn(e);
        const s = Object.keys(t.att).concat(Object.keys(e.att)).sort((r, i)=>r.localeCompare(i)), n = {
            att: {}
        };
        return s.forEach((r)=>{
            var i, o;
            Object.keys(((i = t.att) == null ? void 0 : i[r]) || {}).concat(Object.keys(((o = e.att) == null ? void 0 : o[r]) || {})).sort((a, c)=>a.localeCompare(c)).forEach((a)=>{
                var c, l;
                n.att[r] = Em(Cm({}, n.att[r]), {
                    [a]: ((c = t.att[r]) == null ? void 0 : c[a]) || ((l = e.att[r]) == null ? void 0 : l[a])
                });
            });
        }), n;
    }
    function Rm(t = "", e) {
        bn(e);
        const s = "I further authorize the stated URI to perform the following actions on my behalf: ";
        if (t.includes(s)) return t;
        const n = [];
        let r = 0;
        Object.keys(e.att).forEach((a)=>{
            const c = Object.keys(e.att[a]).map((h)=>({
                    ability: h.split("/")[0],
                    action: h.split("/")[1]
                }));
            c.sort((h, u)=>h.action.localeCompare(u.action));
            const l = {};
            c.forEach((h)=>{
                l[h.ability] || (l[h.ability] = []), l[h.ability].push(h.action);
            });
            const d = Object.keys(l).map((h)=>(r++, `(${r}) '${h}': '${l[h].join("', '")}' for '${a}'.`));
            n.push(d.join(", ").replace(".,", "."));
        });
        const i = n.join(" "), o = `${s}${i}`;
        return `${t ? t + " " : ""}${o}`;
    }
    function jc(t) {
        var e;
        const s = Ur(t);
        bn(s);
        const n = (e = s.att) == null ? void 0 : e.eip155;
        return n ? Object.keys(n).map((r)=>r.split("/")[1]) : [];
    }
    function Wc(t) {
        const e = Ur(t);
        bn(e);
        const s = [];
        return Object.values(e.att).forEach((n)=>{
            Object.values(n).forEach((r)=>{
                var i;
                (i = r?.[0]) != null && i.chains && s.push(r[0].chains);
            });
        }), [
            ...new Set(s.flat())
        ];
    }
    function yi(t) {
        if (!t) return;
        const e = t?.[t.length - 1];
        return km(e) ? e : void 0;
    }
    function ph(t) {
        return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
    }
    function Qo(t) {
        if (typeof t != "boolean") throw new Error(`boolean expected, not ${t}`);
    }
    function go(t) {
        if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
    }
    function gt(t, ...e) {
        if (!ph(t)) throw new Error("Uint8Array expected");
        if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
    }
    function qc(t, e = !0) {
        if (t.destroyed) throw new Error("Hash instance has been destroyed");
        if (e && t.finished) throw new Error("Hash#digest() has already been called");
    }
    function xm(t, e) {
        gt(t);
        const s = e.outputLen;
        if (t.length < s) throw new Error("digestInto() expects output buffer of length at least " + s);
    }
    function zs(t) {
        return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
    }
    function Jn(...t) {
        for(let e = 0; e < t.length; e++)t[e].fill(0);
    }
    function $m(t) {
        return new DataView(t.buffer, t.byteOffset, t.byteLength);
    }
    const Um = new Uint8Array(new Uint32Array([
        287454020
    ]).buffer)[0] === 68;
    function Dm(t) {
        if (typeof t != "string") throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(t));
    }
    function ea(t) {
        if (typeof t == "string") t = Dm(t);
        else if (ph(t)) t = ta(t);
        else throw new Error("Uint8Array expected, got " + typeof t);
        return t;
    }
    function Lm(t, e) {
        if (e == null || typeof e != "object") throw new Error("options must be defined");
        return Object.assign(t, e);
    }
    function Mm(t, e) {
        if (t.length !== e.length) return !1;
        let s = 0;
        for(let n = 0; n < t.length; n++)s |= t[n] ^ e[n];
        return s === 0;
    }
    const Bm = (t, e)=>{
        function s(n, ...r) {
            if (gt(n), !Um) throw new Error("Non little-endian hardware is not yet supported");
            if (t.nonceLength !== void 0) {
                const l = r[0];
                if (!l) throw new Error("nonce / iv required");
                t.varSizeNonce ? gt(l) : gt(l, t.nonceLength);
            }
            const i = t.tagLength;
            i && r[1] !== void 0 && gt(r[1]);
            const o = e(n, ...r), a = (l, d)=>{
                if (d !== void 0) {
                    if (l !== 2) throw new Error("cipher output not supported");
                    gt(d);
                }
            };
            let c = !1;
            return {
                encrypt (l, d) {
                    if (c) throw new Error("cannot encrypt() twice with same key + nonce");
                    return c = !0, gt(l), a(o.encrypt.length, d), o.encrypt(l, d);
                },
                decrypt (l, d) {
                    if (gt(l), i && l.length < i) throw new Error("invalid ciphertext length: smaller than tagLength=" + i);
                    return a(o.decrypt.length, d), o.decrypt(l, d);
                }
            };
        }
        return Object.assign(s, t), s;
    };
    function Hc(t, e, s = !0) {
        if (e === void 0) return new Uint8Array(t);
        if (e.length !== t) throw new Error("invalid output length, expected " + t + ", got: " + e.length);
        if (s && !jm(e)) throw new Error("invalid output, must be aligned");
        return e;
    }
    function Vc(t, e, s, n) {
        if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, s, n);
        const r = BigInt(32), i = BigInt(4294967295), o = Number(s >> r & i), a = Number(s & i);
        t.setUint32(e + 4, o, n), t.setUint32(e + 0, a, n);
    }
    function Fm(t, e, s) {
        Qo(s);
        const n = new Uint8Array(16), r = $m(n);
        return Vc(r, 0, BigInt(e), s), Vc(r, 8, BigInt(t), s), n;
    }
    function jm(t) {
        return t.byteOffset % 4 === 0;
    }
    function ta(t) {
        return Uint8Array.from(t);
    }
    const fh = (t)=>Uint8Array.from(t.split("").map((e)=>e.charCodeAt(0))), Wm = fh("expand 16-byte k"), qm = fh("expand 32-byte k"), Hm = zs(Wm), Vm = zs(qm);
    function Ce(t, e) {
        return t << e | t >>> 32 - e;
    }
    function sa(t) {
        return t.byteOffset % 4 === 0;
    }
    const oi = 64, Km = 16, gh = 2 ** 32 - 1, Kc = new Uint32Array;
    function zm(t, e, s, n, r, i, o, a) {
        const c = r.length, l = new Uint8Array(oi), d = zs(l), h = sa(r) && sa(i), u = h ? zs(r) : Kc, f = h ? zs(i) : Kc;
        for(let g = 0; g < c; o++){
            if (t(e, s, n, d, o, a), o >= gh) throw new Error("arx: counter overflow");
            const w = Math.min(oi, c - g);
            if (h && w === oi) {
                const m = g / 4;
                if (g % 4 !== 0) throw new Error("arx: invalid block position");
                for(let A = 0, v; A < Km; A++)v = m + A, f[v] = u[v] ^ d[A];
                g += oi;
                continue;
            }
            for(let m = 0, A; m < w; m++)A = g + m, i[A] = r[A] ^ l[m];
            g += w;
        }
    }
    function Gm(t, e) {
        const { allowShortKeys: s, extendNonceFn: n, counterLength: r, counterRight: i, rounds: o } = Lm({
            allowShortKeys: !1,
            counterLength: 8,
            counterRight: !1,
            rounds: 20
        }, e);
        if (typeof t != "function") throw new Error("core must be a function");
        return go(r), go(o), Qo(i), Qo(s), (a, c, l, d, h = 0)=>{
            gt(a), gt(c), gt(l);
            const u = l.length;
            if (d === void 0 && (d = new Uint8Array(u)), gt(d), go(h), h < 0 || h >= gh) throw new Error("arx: counter overflow");
            if (d.length < u) throw new Error(`arx: output (${d.length}) is shorter than data (${u})`);
            const f = [];
            let g = a.length, w, m;
            if (g === 32) f.push(w = ta(a)), m = Vm;
            else if (g === 16 && s) w = new Uint8Array(32), w.set(a), w.set(a, 16), m = Hm, f.push(w);
            else throw new Error(`arx: invalid 32-byte key, got length=${g}`);
            sa(c) || f.push(c = ta(c));
            const A = zs(w);
            if (n) {
                if (c.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
                n(m, A, zs(c.subarray(0, 16)), A), c = c.subarray(16);
            }
            const v = 16 - r;
            if (v !== c.length) throw new Error(`arx: nonce must be ${v} or 16 bytes`);
            if (v !== 12) {
                const j = new Uint8Array(12);
                j.set(c, i ? 0 : 12 - c.length), c = j, f.push(c);
            }
            const P = zs(c);
            return zm(t, m, A, P, l, d, h, o), Jn(...f), d;
        };
    }
    const Ve = (t, e)=>t[e++] & 255 | (t[e++] & 255) << 8;
    class Ym {
        constructor(e){
            this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, e = ea(e), gt(e, 32);
            const s = Ve(e, 0), n = Ve(e, 2), r = Ve(e, 4), i = Ve(e, 6), o = Ve(e, 8), a = Ve(e, 10), c = Ve(e, 12), l = Ve(e, 14);
            this.r[0] = s & 8191, this.r[1] = (s >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | o << 12) & 255, this.r[5] = o >>> 1 & 8190, this.r[6] = (o >>> 14 | a << 2) & 8191, this.r[7] = (a >>> 11 | c << 5) & 8065, this.r[8] = (c >>> 8 | l << 8) & 8191, this.r[9] = l >>> 5 & 127;
            for(let d = 0; d < 8; d++)this.pad[d] = Ve(e, 16 + 2 * d);
        }
        process(e, s, n = !1) {
            const r = n ? 0 : 2048, { h: i, r: o } = this, a = o[0], c = o[1], l = o[2], d = o[3], h = o[4], u = o[5], f = o[6], g = o[7], w = o[8], m = o[9], A = Ve(e, s + 0), v = Ve(e, s + 2), P = Ve(e, s + 4), j = Ve(e, s + 6), G = Ve(e, s + 8), b = Ve(e, s + 10), R = Ve(e, s + 12), U = Ve(e, s + 14);
            let N = i[0] + (A & 8191), M = i[1] + ((A >>> 13 | v << 3) & 8191), Y = i[2] + ((v >>> 10 | P << 6) & 8191), O = i[3] + ((P >>> 7 | j << 9) & 8191), C = i[4] + ((j >>> 4 | G << 12) & 8191), y = i[5] + (G >>> 1 & 8191), E = i[6] + ((G >>> 14 | b << 2) & 8191), k = i[7] + ((b >>> 11 | R << 5) & 8191), D = i[8] + ((R >>> 8 | U << 8) & 8191), B = i[9] + (U >>> 5 | r), I = 0, T = I + N * a + M * (5 * m) + Y * (5 * w) + O * (5 * g) + C * (5 * f);
            I = T >>> 13, T &= 8191, T += y * (5 * u) + E * (5 * h) + k * (5 * d) + D * (5 * l) + B * (5 * c), I += T >>> 13, T &= 8191;
            let V = I + N * c + M * a + Y * (5 * m) + O * (5 * w) + C * (5 * g);
            I = V >>> 13, V &= 8191, V += y * (5 * f) + E * (5 * u) + k * (5 * h) + D * (5 * d) + B * (5 * l), I += V >>> 13, V &= 8191;
            let K = I + N * l + M * c + Y * a + O * (5 * m) + C * (5 * w);
            I = K >>> 13, K &= 8191, K += y * (5 * g) + E * (5 * f) + k * (5 * u) + D * (5 * h) + B * (5 * d), I += K >>> 13, K &= 8191;
            let ae = I + N * d + M * l + Y * c + O * a + C * (5 * m);
            I = ae >>> 13, ae &= 8191, ae += y * (5 * w) + E * (5 * g) + k * (5 * f) + D * (5 * u) + B * (5 * h), I += ae >>> 13, ae &= 8191;
            let oe = I + N * h + M * d + Y * l + O * c + C * a;
            I = oe >>> 13, oe &= 8191, oe += y * (5 * m) + E * (5 * w) + k * (5 * g) + D * (5 * f) + B * (5 * u), I += oe >>> 13, oe &= 8191;
            let ne = I + N * u + M * h + Y * d + O * l + C * c;
            I = ne >>> 13, ne &= 8191, ne += y * a + E * (5 * m) + k * (5 * w) + D * (5 * g) + B * (5 * f), I += ne >>> 13, ne &= 8191;
            let ie = I + N * f + M * u + Y * h + O * d + C * l;
            I = ie >>> 13, ie &= 8191, ie += y * c + E * a + k * (5 * m) + D * (5 * w) + B * (5 * g), I += ie >>> 13, ie &= 8191;
            let de = I + N * g + M * f + Y * u + O * h + C * d;
            I = de >>> 13, de &= 8191, de += y * l + E * c + k * a + D * (5 * m) + B * (5 * w), I += de >>> 13, de &= 8191;
            let Te = I + N * w + M * g + Y * f + O * u + C * h;
            I = Te >>> 13, Te &= 8191, Te += y * d + E * l + k * c + D * a + B * (5 * m), I += Te >>> 13, Te &= 8191;
            let he = I + N * m + M * w + Y * g + O * f + C * u;
            I = he >>> 13, he &= 8191, he += y * h + E * d + k * l + D * c + B * a, I += he >>> 13, he &= 8191, I = (I << 2) + I | 0, I = I + T | 0, T = I & 8191, I = I >>> 13, V += I, i[0] = T, i[1] = V, i[2] = K, i[3] = ae, i[4] = oe, i[5] = ne, i[6] = ie, i[7] = de, i[8] = Te, i[9] = he;
        }
        finalize() {
            const { h: e, pad: s } = this, n = new Uint16Array(10);
            let r = e[1] >>> 13;
            e[1] &= 8191;
            for(let a = 2; a < 10; a++)e[a] += r, r = e[a] >>> 13, e[a] &= 8191;
            e[0] += r * 5, r = e[0] >>> 13, e[0] &= 8191, e[1] += r, r = e[1] >>> 13, e[1] &= 8191, e[2] += r, n[0] = e[0] + 5, r = n[0] >>> 13, n[0] &= 8191;
            for(let a = 1; a < 10; a++)n[a] = e[a] + r, r = n[a] >>> 13, n[a] &= 8191;
            n[9] -= 8192;
            let i = (r ^ 1) - 1;
            for(let a = 0; a < 10; a++)n[a] &= i;
            i = ~i;
            for(let a = 0; a < 10; a++)e[a] = e[a] & i | n[a];
            e[0] = (e[0] | e[1] << 13) & 65535, e[1] = (e[1] >>> 3 | e[2] << 10) & 65535, e[2] = (e[2] >>> 6 | e[3] << 7) & 65535, e[3] = (e[3] >>> 9 | e[4] << 4) & 65535, e[4] = (e[4] >>> 12 | e[5] << 1 | e[6] << 14) & 65535, e[5] = (e[6] >>> 2 | e[7] << 11) & 65535, e[6] = (e[7] >>> 5 | e[8] << 8) & 65535, e[7] = (e[8] >>> 8 | e[9] << 5) & 65535;
            let o = e[0] + s[0];
            e[0] = o & 65535;
            for(let a = 1; a < 8; a++)o = (e[a] + s[a] | 0) + (o >>> 16) | 0, e[a] = o & 65535;
            Jn(n);
        }
        update(e) {
            qc(this), e = ea(e), gt(e);
            const { buffer: s, blockLen: n } = this, r = e.length;
            for(let i = 0; i < r;){
                const o = Math.min(n - this.pos, r - i);
                if (o === n) {
                    for(; n <= r - i; i += n)this.process(e, i);
                    continue;
                }
                s.set(e.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === n && (this.process(s, 0, !1), this.pos = 0);
            }
            return this;
        }
        destroy() {
            Jn(this.h, this.r, this.buffer, this.pad);
        }
        digestInto(e) {
            qc(this), xm(e, this), this.finished = !0;
            const { buffer: s, h: n } = this;
            let { pos: r } = this;
            if (r) {
                for(s[r++] = 1; r < 16; r++)s[r] = 0;
                this.process(s, 0, !0);
            }
            this.finalize();
            let i = 0;
            for(let o = 0; o < 8; o++)e[i++] = n[o] >>> 0, e[i++] = n[o] >>> 8;
            return e;
        }
        digest() {
            const { buffer: e, outputLen: s } = this;
            this.digestInto(e);
            const n = e.slice(0, s);
            return this.destroy(), n;
        }
    }
    function Jm(t) {
        const e = (n, r)=>t(r).update(ea(n)).digest(), s = t(new Uint8Array(32));
        return e.outputLen = s.outputLen, e.blockLen = s.blockLen, e.create = (n)=>t(n), e;
    }
    const Xm = Jm((t)=>new Ym(t));
    function Zm(t, e, s, n, r, i = 20) {
        let o = t[0], a = t[1], c = t[2], l = t[3], d = e[0], h = e[1], u = e[2], f = e[3], g = e[4], w = e[5], m = e[6], A = e[7], v = r, P = s[0], j = s[1], G = s[2], b = o, R = a, U = c, N = l, M = d, Y = h, O = u, C = f, y = g, E = w, k = m, D = A, B = v, I = P, T = j, V = G;
        for(let ae = 0; ae < i; ae += 2)b = b + M | 0, B = Ce(B ^ b, 16), y = y + B | 0, M = Ce(M ^ y, 12), b = b + M | 0, B = Ce(B ^ b, 8), y = y + B | 0, M = Ce(M ^ y, 7), R = R + Y | 0, I = Ce(I ^ R, 16), E = E + I | 0, Y = Ce(Y ^ E, 12), R = R + Y | 0, I = Ce(I ^ R, 8), E = E + I | 0, Y = Ce(Y ^ E, 7), U = U + O | 0, T = Ce(T ^ U, 16), k = k + T | 0, O = Ce(O ^ k, 12), U = U + O | 0, T = Ce(T ^ U, 8), k = k + T | 0, O = Ce(O ^ k, 7), N = N + C | 0, V = Ce(V ^ N, 16), D = D + V | 0, C = Ce(C ^ D, 12), N = N + C | 0, V = Ce(V ^ N, 8), D = D + V | 0, C = Ce(C ^ D, 7), b = b + Y | 0, V = Ce(V ^ b, 16), k = k + V | 0, Y = Ce(Y ^ k, 12), b = b + Y | 0, V = Ce(V ^ b, 8), k = k + V | 0, Y = Ce(Y ^ k, 7), R = R + O | 0, B = Ce(B ^ R, 16), D = D + B | 0, O = Ce(O ^ D, 12), R = R + O | 0, B = Ce(B ^ R, 8), D = D + B | 0, O = Ce(O ^ D, 7), U = U + C | 0, I = Ce(I ^ U, 16), y = y + I | 0, C = Ce(C ^ y, 12), U = U + C | 0, I = Ce(I ^ U, 8), y = y + I | 0, C = Ce(C ^ y, 7), N = N + M | 0, T = Ce(T ^ N, 16), E = E + T | 0, M = Ce(M ^ E, 12), N = N + M | 0, T = Ce(T ^ N, 8), E = E + T | 0, M = Ce(M ^ E, 7);
        let K = 0;
        n[K++] = o + b | 0, n[K++] = a + R | 0, n[K++] = c + U | 0, n[K++] = l + N | 0, n[K++] = d + M | 0, n[K++] = h + Y | 0, n[K++] = u + O | 0, n[K++] = f + C | 0, n[K++] = g + y | 0, n[K++] = w + E | 0, n[K++] = m + k | 0, n[K++] = A + D | 0, n[K++] = v + B | 0, n[K++] = P + I | 0, n[K++] = j + T | 0, n[K++] = G + V | 0;
    }
    const Qm = Gm(Zm, {
        counterRight: !1,
        counterLength: 4,
        allowShortKeys: !1
    }), ew = new Uint8Array(16), zc = (t, e)=>{
        t.update(e);
        const s = e.length % 16;
        s && t.update(ew.subarray(s));
    }, tw = new Uint8Array(32);
    function Gc(t, e, s, n, r) {
        const i = t(e, s, tw), o = Xm.create(i);
        r && zc(o, r), zc(o, n);
        const a = Fm(n.length, r ? r.length : 0, !0);
        o.update(a);
        const c = o.digest();
        return Jn(i, a), c;
    }
    const sw = (t)=>(e, s, n)=>({
                encrypt (r, i) {
                    const o = r.length;
                    i = Hc(o + 16, i, !1), i.set(r);
                    const a = i.subarray(0, -16);
                    t(e, s, a, a, 1);
                    const c = Gc(t, e, s, a, n);
                    return i.set(c, o), Jn(c), i;
                },
                decrypt (r, i) {
                    i = Hc(r.length - 16, i, !1);
                    const o = r.subarray(0, -16), a = r.subarray(-16), c = Gc(t, e, s, o, n);
                    if (!Mm(a, c)) throw new Error("invalid tag");
                    return i.set(r.subarray(0, -16)), t(e, s, i, i, 1), Jn(c), i;
                }
            }), mh = Bm({
        blockSize: 64,
        nonceLength: 12,
        tagLength: 16
    }, sw(Qm));
    let wh = class extends Gi {
        constructor(e, s){
            super(), this.finished = !1, this.destroyed = !1, zi(e);
            const n = zt(s);
            if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
            this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
            const r = this.blockLen, i = new Uint8Array(r);
            i.set(n.length > r ? e.create().update(n).digest() : n);
            for(let o = 0; o < i.length; o++)i[o] ^= 54;
            this.iHash.update(i), this.oHash = e.create();
            for(let o = 0; o < i.length; o++)i[o] ^= 106;
            this.oHash.update(i), Mt(i);
        }
        update(e) {
            return Ys(this), this.iHash.update(e), this;
        }
        digestInto(e) {
            Ys(this), Yt(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
        }
        digest() {
            const e = new Uint8Array(this.oHash.outputLen);
            return this.digestInto(e), e;
        }
        _cloneInto(e) {
            e || (e = Object.create(Object.getPrototypeOf(this), {}));
            const { oHash: s, iHash: n, finished: r, destroyed: i, blockLen: o, outputLen: a } = this;
            return e = e, e.finished = r, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = s._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
        }
        clone() {
            return this._cloneInto();
        }
        destroy() {
            this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
        }
    };
    const Ji = (t, e, s)=>new wh(t, e).update(s).digest();
    Ji.create = (t, e)=>new wh(t, e);
    function nw(t, e, s) {
        return zi(t), s === void 0 && (s = new Uint8Array(t.outputLen)), Ji(t, zt(s), zt(e));
    }
    const mo = Uint8Array.from([
        0
    ]), Yc = Uint8Array.of();
    function rw(t, e, s, n = 32) {
        zi(t), Ss(n);
        const r = t.outputLen;
        if (n > 255 * r) throw new Error("Length should be <= 255*HashLen");
        const i = Math.ceil(n / r);
        s === void 0 && (s = Yc);
        const o = new Uint8Array(i * r), a = Ji.create(t, e), c = a._cloneInto(), l = new Uint8Array(a.outputLen);
        for(let d = 0; d < i; d++)mo[0] = d + 1, c.update(d === 0 ? Yc : l).update(s).update(mo).digestInto(l), o.set(l, r * d), a._cloneInto(c);
        return a.destroy(), c.destroy(), Mt(l, mo), o.slice(0, n);
    }
    const iw = (t, e, s, n, r)=>rw(t, nw(t, e, s), n, r), Xi = Yi, ja = BigInt(0), na = BigInt(1);
    function Di(t, e = "") {
        if (typeof t != "boolean") {
            const s = e && `"${e}"`;
            throw new Error(s + "expected boolean, got type=" + typeof t);
        }
        return t;
    }
    function un(t, e, s = "") {
        const n = Ki(t), r = t?.length, i = e !== void 0;
        if (!n || i && r !== e) {
            const o = s && `"${s}" `, a = i ? ` of length ${e}` : "", c = n ? `length=${r}` : `type=${typeof t}`;
            throw new Error(o + "expected Uint8Array" + a + ", got " + c);
        }
        return t;
    }
    function ai(t) {
        const e = t.toString(16);
        return e.length & 1 ? "0" + e : e;
    }
    function yh(t) {
        if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
        return t === "" ? ja : BigInt("0x" + t);
    }
    function Zi(t) {
        return yh(Hn(t));
    }
    function Li(t) {
        return Yt(t), yh(Hn(Uint8Array.from(t).reverse()));
    }
    function Wa(t, e) {
        return $i(t.toString(16).padStart(e * 2, "0"));
    }
    function qa(t, e) {
        return Wa(t, e).reverse();
    }
    function rt(t, e, s) {
        let n;
        if (typeof e == "string") try {
            n = $i(e);
        } catch (i) {
            throw new Error(t + " must be hex string or Uint8Array, cause: " + i);
        }
        else if (Ki(e)) n = Uint8Array.from(e);
        else throw new Error(t + " must be hex string or Uint8Array");
        const r = n.length;
        if (typeof s == "number" && r !== s) throw new Error(t + " of length " + s + " expected, got " + r);
        return n;
    }
    const wo = (t)=>typeof t == "bigint" && ja <= t;
    function ow(t, e, s) {
        return wo(t) && wo(e) && wo(s) && e <= t && t < s;
    }
    function ra(t, e, s, n) {
        if (!ow(e, s, n)) throw new Error("expected valid " + t + ": " + s + " <= n < " + n + ", got " + e);
    }
    function bh(t) {
        let e;
        for(e = 0; t > ja; t >>= na, e += 1);
        return e;
    }
    const Yr = (t)=>(na << BigInt(t)) - na;
    function aw(t, e, s) {
        if (typeof t != "number" || t < 2) throw new Error("hashLen must be a number");
        if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
        if (typeof s != "function") throw new Error("hmacFn must be a function");
        const n = (u)=>new Uint8Array(u), r = (u)=>Uint8Array.of(u);
        let i = n(t), o = n(t), a = 0;
        const c = ()=>{
            i.fill(1), o.fill(0), a = 0;
        }, l = (...u)=>s(o, i, ...u), d = (u = n(0))=>{
            o = l(r(0), u), i = l(), u.length !== 0 && (o = l(r(1), u), i = l());
        }, h = ()=>{
            if (a++ >= 1e3) throw new Error("drbg: tried 1000 values");
            let u = 0;
            const f = [];
            for(; u < e;){
                i = l();
                const g = i.slice();
                f.push(g), u += i.length;
            }
            return Ws(...f);
        };
        return (u, f)=>{
            c(), d(u);
            let g;
            for(; !(g = f(h()));)d();
            return c(), g;
        };
    }
    function Qi(t, e, s = {}) {
        if (!t || typeof t != "object") throw new Error("expected valid options object");
        function n(r, i, o) {
            const a = t[r];
            if (o && a === void 0) return;
            const c = typeof a;
            if (c !== i || a === null) throw new Error(`param "${r}" is invalid: expected ${i}, got ${c}`);
        }
        Object.entries(e).forEach(([r, i])=>n(r, i, !1)), Object.entries(s).forEach(([r, i])=>n(r, i, !0));
    }
    function Jc(t) {
        const e = new WeakMap;
        return (s, ...n)=>{
            const r = e.get(s);
            if (r !== void 0) return r;
            const i = t(s, ...n);
            return e.set(s, i), i;
        };
    }
    const wt = BigInt(0), ot = BigInt(1), pn = BigInt(2), Ch = BigInt(3), Eh = BigInt(4), vh = BigInt(5), cw = BigInt(7), Ah = BigInt(8), lw = BigInt(9), Ih = BigInt(16);
    function Nt(t, e) {
        const s = t % e;
        return s >= wt ? s : e + s;
    }
    function qt(t, e, s) {
        let n = t;
        for(; e-- > wt;)n *= n, n %= s;
        return n;
    }
    function Xc(t, e) {
        if (t === wt) throw new Error("invert: expected non-zero number");
        if (e <= wt) throw new Error("invert: expected positive modulus, got " + e);
        let s = Nt(t, e), n = e, r = wt, i = ot;
        for(; s !== wt;){
            const o = n / s, a = n % s, c = r - i * o;
            n = s, s = a, r = i, i = c;
        }
        if (n !== ot) throw new Error("invert: does not exist");
        return Nt(r, e);
    }
    function Ha(t, e, s) {
        if (!t.eql(t.sqr(e), s)) throw new Error("Cannot find square root");
    }
    function Nh(t, e) {
        const s = (t.ORDER + ot) / Eh, n = t.pow(e, s);
        return Ha(t, n, e), n;
    }
    function dw(t, e) {
        const s = (t.ORDER - vh) / Ah, n = t.mul(e, pn), r = t.pow(n, s), i = t.mul(e, r), o = t.mul(t.mul(i, pn), r), a = t.mul(i, t.sub(o, t.ONE));
        return Ha(t, a, e), a;
    }
    function hw(t) {
        const e = Xs(t), s = _h(t), n = s(e, e.neg(e.ONE)), r = s(e, n), i = s(e, e.neg(n)), o = (t + cw) / Ih;
        return (a, c)=>{
            let l = a.pow(c, o), d = a.mul(l, n);
            const h = a.mul(l, r), u = a.mul(l, i), f = a.eql(a.sqr(d), c), g = a.eql(a.sqr(h), c);
            l = a.cmov(l, d, f), d = a.cmov(u, h, g);
            const w = a.eql(a.sqr(d), c), m = a.cmov(l, d, w);
            return Ha(a, m, c), m;
        };
    }
    function _h(t) {
        if (t < Ch) throw new Error("sqrt is not defined for small field");
        let e = t - ot, s = 0;
        for(; e % pn === wt;)e /= pn, s++;
        let n = pn;
        const r = Xs(t);
        for(; Zc(r, n) === 1;)if (n++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
        if (s === 1) return Nh;
        let i = r.pow(n, e);
        const o = (e + ot) / pn;
        return function(a, c) {
            if (a.is0(c)) return c;
            if (Zc(a, c) !== 1) throw new Error("Cannot find square root");
            let l = s, d = a.mul(a.ONE, i), h = a.pow(c, e), u = a.pow(c, o);
            for(; !a.eql(h, a.ONE);){
                if (a.is0(h)) return a.ZERO;
                let f = 1, g = a.sqr(h);
                for(; !a.eql(g, a.ONE);)if (f++, g = a.sqr(g), f === l) throw new Error("Cannot find square root");
                const w = ot << BigInt(l - f - 1), m = a.pow(d, w);
                l = f, d = a.sqr(m), h = a.mul(h, d), u = a.mul(u, m);
            }
            return u;
        };
    }
    function uw(t) {
        return t % Eh === Ch ? Nh : t % Ah === vh ? dw : t % Ih === lw ? hw(t) : _h(t);
    }
    const pw = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
    ];
    function fw(t) {
        const e = {
            ORDER: "bigint",
            MASK: "bigint",
            BYTES: "number",
            BITS: "number"
        }, s = pw.reduce((n, r)=>(n[r] = "function", n), e);
        return Qi(t, s), t;
    }
    function gw(t, e, s) {
        if (s < wt) throw new Error("invalid exponent, negatives unsupported");
        if (s === wt) return t.ONE;
        if (s === ot) return e;
        let n = t.ONE, r = e;
        for(; s > wt;)s & ot && (n = t.mul(n, r)), r = t.sqr(r), s >>= ot;
        return n;
    }
    function Sh(t, e, s = !1) {
        const n = new Array(e.length).fill(s ? t.ZERO : void 0), r = e.reduce((o, a, c)=>t.is0(a) ? o : (n[c] = o, t.mul(o, a)), t.ONE), i = t.inv(r);
        return e.reduceRight((o, a, c)=>t.is0(a) ? o : (n[c] = t.mul(o, n[c]), t.mul(o, a)), i), n;
    }
    function Zc(t, e) {
        const s = (t.ORDER - ot) / pn, n = t.pow(e, s), r = t.eql(n, t.ONE), i = t.eql(n, t.ZERO), o = t.eql(n, t.neg(t.ONE));
        if (!r && !i && !o) throw new Error("invalid Legendre symbol result");
        return r ? 1 : i ? 0 : -1;
    }
    function Th(t, e) {
        e !== void 0 && Ss(e);
        const s = e !== void 0 ? e : t.toString(2).length, n = Math.ceil(s / 8);
        return {
            nBitLength: s,
            nByteLength: n
        };
    }
    function Xs(t, e, s = !1, n = {}) {
        if (t <= wt) throw new Error("invalid field: expected ORDER > 0, got " + t);
        let r, i, o = !1, a;
        if (typeof e == "object" && e != null) {
            if (n.sqrt || s) throw new Error("cannot specify opts in two arguments");
            const u = e;
            u.BITS && (r = u.BITS), u.sqrt && (i = u.sqrt), typeof u.isLE == "boolean" && (s = u.isLE), typeof u.modFromBytes == "boolean" && (o = u.modFromBytes), a = u.allowedLengths;
        } else typeof e == "number" && (r = e), n.sqrt && (i = n.sqrt);
        const { nBitLength: c, nByteLength: l } = Th(t, r);
        if (l > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
        let d;
        const h = Object.freeze({
            ORDER: t,
            isLE: s,
            BITS: c,
            BYTES: l,
            MASK: Yr(c),
            ZERO: wt,
            ONE: ot,
            allowedLengths: a,
            create: (u)=>Nt(u, t),
            isValid: (u)=>{
                if (typeof u != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof u);
                return wt <= u && u < t;
            },
            is0: (u)=>u === wt,
            isValidNot0: (u)=>!h.is0(u) && h.isValid(u),
            isOdd: (u)=>(u & ot) === ot,
            neg: (u)=>Nt(-u, t),
            eql: (u, f)=>u === f,
            sqr: (u)=>Nt(u * u, t),
            add: (u, f)=>Nt(u + f, t),
            sub: (u, f)=>Nt(u - f, t),
            mul: (u, f)=>Nt(u * f, t),
            pow: (u, f)=>gw(h, u, f),
            div: (u, f)=>Nt(u * Xc(f, t), t),
            sqrN: (u)=>u * u,
            addN: (u, f)=>u + f,
            subN: (u, f)=>u - f,
            mulN: (u, f)=>u * f,
            inv: (u)=>Xc(u, t),
            sqrt: i || ((u)=>(d || (d = uw(t)), d(h, u))),
            toBytes: (u)=>s ? qa(u, l) : Wa(u, l),
            fromBytes: (u, f = !0)=>{
                if (a) {
                    if (!a.includes(u.length) || u.length > l) throw new Error("Field.fromBytes: expected " + a + " bytes, got " + u.length);
                    const w = new Uint8Array(l);
                    w.set(u, s ? 0 : w.length - u.length), u = w;
                }
                if (u.length !== l) throw new Error("Field.fromBytes: expected " + l + " bytes, got " + u.length);
                let g = s ? Li(u) : Zi(u);
                if (o && (g = Nt(g, t)), !f && !h.isValid(g)) throw new Error("invalid field element: outside of range 0..ORDER");
                return g;
            },
            invertBatch: (u)=>Sh(h, u),
            cmov: (u, f, g)=>g ? f : u
        });
        return Object.freeze(h);
    }
    function kh(t) {
        if (typeof t != "bigint") throw new Error("field order must be bigint");
        const e = t.toString(2).length;
        return Math.ceil(e / 8);
    }
    function Oh(t) {
        const e = kh(t);
        return e + Math.ceil(e / 2);
    }
    function mw(t, e, s = !1) {
        const n = t.length, r = kh(e), i = Oh(e);
        if (n < 16 || n < i || n > 1024) throw new Error("expected " + i + "-1024 bytes of input, got " + n);
        const o = s ? Li(t) : Zi(t), a = Nt(o, e - ot) + ot;
        return s ? qa(a, r) : Wa(a, r);
    }
    const Xn = BigInt(0), fn = BigInt(1);
    function Mi(t, e) {
        const s = e.negate();
        return t ? s : e;
    }
    function yo(t, e) {
        const s = Sh(t.Fp, e.map((n)=>n.Z));
        return e.map((n, r)=>t.fromAffine(n.toAffine(s[r])));
    }
    function Ph(t, e) {
        if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
    }
    function bo(t, e) {
        Ph(t, e);
        const s = Math.ceil(e / t) + 1, n = 2 ** (t - 1), r = 2 ** t, i = Yr(t), o = BigInt(t);
        return {
            windows: s,
            windowSize: n,
            mask: i,
            maxNumber: r,
            shiftBy: o
        };
    }
    function Qc(t, e, s) {
        const { windowSize: n, mask: r, maxNumber: i, shiftBy: o } = s;
        let a = Number(t & r), c = t >> o;
        a > n && (a -= i, c += fn);
        const l = e * n, d = l + Math.abs(a) - 1, h = a === 0, u = a < 0, f = e % 2 !== 0;
        return {
            nextN: c,
            offset: d,
            isZero: h,
            isNeg: u,
            isNegF: f,
            offsetF: l
        };
    }
    function ww(t, e) {
        if (!Array.isArray(t)) throw new Error("array expected");
        t.forEach((s, n)=>{
            if (!(s instanceof e)) throw new Error("invalid point at index " + n);
        });
    }
    function yw(t, e) {
        if (!Array.isArray(t)) throw new Error("array of scalars expected");
        t.forEach((s, n)=>{
            if (!e.isValid(s)) throw new Error("invalid scalar at index " + n);
        });
    }
    const Co = new WeakMap, Rh = new WeakMap;
    function Eo(t) {
        return Rh.get(t) || 1;
    }
    function el(t) {
        if (t !== Xn) throw new Error("invalid wNAF");
    }
    class bw {
        constructor(e, s){
            this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = s;
        }
        _unsafeLadder(e, s, n = this.ZERO) {
            let r = e;
            for(; s > Xn;)s & fn && (n = n.add(r)), r = r.double(), s >>= fn;
            return n;
        }
        precomputeWindow(e, s) {
            const { windows: n, windowSize: r } = bo(s, this.bits), i = [];
            let o = e, a = o;
            for(let c = 0; c < n; c++){
                a = o, i.push(a);
                for(let l = 1; l < r; l++)a = a.add(o), i.push(a);
                o = a.double();
            }
            return i;
        }
        wNAF(e, s, n) {
            if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
            let r = this.ZERO, i = this.BASE;
            const o = bo(e, this.bits);
            for(let a = 0; a < o.windows; a++){
                const { nextN: c, offset: l, isZero: d, isNeg: h, isNegF: u, offsetF: f } = Qc(n, a, o);
                n = c, d ? i = i.add(Mi(u, s[f])) : r = r.add(Mi(h, s[l]));
            }
            return el(n), {
                p: r,
                f: i
            };
        }
        wNAFUnsafe(e, s, n, r = this.ZERO) {
            const i = bo(e, this.bits);
            for(let o = 0; o < i.windows && n !== Xn; o++){
                const { nextN: a, offset: c, isZero: l, isNeg: d } = Qc(n, o, i);
                if (n = a, !l) {
                    const h = s[c];
                    r = r.add(d ? h.negate() : h);
                }
            }
            return el(n), r;
        }
        getPrecomputes(e, s, n) {
            let r = Co.get(s);
            return r || (r = this.precomputeWindow(s, e), e !== 1 && (typeof n == "function" && (r = n(r)), Co.set(s, r))), r;
        }
        cached(e, s, n) {
            const r = Eo(e);
            return this.wNAF(r, this.getPrecomputes(r, e, n), s);
        }
        unsafe(e, s, n, r) {
            const i = Eo(e);
            return i === 1 ? this._unsafeLadder(e, s, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), s, r);
        }
        createCache(e, s) {
            Ph(s, this.bits), Rh.set(e, s), Co.delete(e);
        }
        hasCache(e) {
            return Eo(e) !== 1;
        }
    }
    function Cw(t, e, s, n) {
        let r = e, i = t.ZERO, o = t.ZERO;
        for(; s > Xn || n > Xn;)s & fn && (i = i.add(r)), n & fn && (o = o.add(r)), r = r.double(), s >>= fn, n >>= fn;
        return {
            p1: i,
            p2: o
        };
    }
    function Ew(t, e, s, n) {
        ww(s, t), yw(n, e);
        const r = s.length, i = n.length;
        if (r !== i) throw new Error("arrays of points and scalars must have equal length");
        const o = t.ZERO, a = bh(BigInt(r));
        let c = 1;
        a > 12 ? c = a - 3 : a > 4 ? c = a - 2 : a > 0 && (c = 2);
        const l = Yr(c), d = new Array(Number(l) + 1).fill(o), h = Math.floor((e.BITS - 1) / c) * c;
        let u = o;
        for(let f = h; f >= 0; f -= c){
            d.fill(o);
            for(let w = 0; w < i; w++){
                const m = n[w], A = Number(m >> BigInt(f) & l);
                d[A] = d[A].add(s[w]);
            }
            let g = o;
            for(let w = d.length - 1, m = o; w > 0; w--)m = m.add(d[w]), g = g.add(m);
            if (u = u.add(g), f !== 0) for(let w = 0; w < c; w++)u = u.double();
        }
        return u;
    }
    function tl(t, e, s) {
        if (e) {
            if (e.ORDER !== t) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
            return fw(e), e;
        } else return Xs(t, {
            isLE: s
        });
    }
    function vw(t, e, s = {}, n) {
        if (n === void 0 && (n = t === "edwards"), !e || typeof e != "object") throw new Error(`expected valid ${t} CURVE object`);
        for (const a of [
            "p",
            "n",
            "h"
        ]){
            const c = e[a];
            if (!(typeof c == "bigint" && c > Xn)) throw new Error(`CURVE.${a} must be positive bigint`);
        }
        const r = tl(e.p, s.Fp, n), i = tl(e.n, s.Fn, n), o = [
            "Gx",
            "Gy",
            "a",
            "b"
        ];
        for (const a of o)if (!r.isValid(e[a])) throw new Error(`CURVE.${a} must be valid field element of CURVE.Fp`);
        return e = Object.freeze(Object.assign({}, e)), {
            CURVE: e,
            Fp: r,
            Fn: i
        };
    }
    BigInt(0), BigInt(1), BigInt(2), BigInt(8), sh("HashToScalar-");
    const lr = BigInt(0), Pn = BigInt(1), ci = BigInt(2);
    function Aw(t) {
        return Qi(t, {
            adjustScalarBytes: "function",
            powPminus2: "function"
        }), Object.freeze({
            ...t
        });
    }
    function Iw(t) {
        const e = Aw(t), { P: s, type: n, adjustScalarBytes: r, powPminus2: i, randomBytes: o } = e, a = n === "x25519";
        if (!a && n !== "x448") throw new Error("invalid type");
        const c = o || _n, l = a ? 255 : 448, d = a ? 32 : 56, h = BigInt(a ? 9 : 5), u = BigInt(a ? 121665 : 39081), f = a ? ci ** BigInt(254) : ci ** BigInt(447), g = a ? BigInt(8) * ci ** BigInt(251) - Pn : BigInt(4) * ci ** BigInt(445) - Pn, w = f + g + Pn, m = (O)=>Nt(O, s), A = v(h);
        function v(O) {
            return qa(m(O), d);
        }
        function P(O) {
            const C = rt("u coordinate", O, d);
            return a && (C[31] &= 127), m(Li(C));
        }
        function j(O) {
            return Li(r(rt("scalar", O, d)));
        }
        function G(O, C) {
            const y = U(P(C), j(O));
            if (y === lr) throw new Error("invalid private or public key received");
            return v(y);
        }
        function b(O) {
            return G(O, A);
        }
        function R(O, C, y) {
            const E = m(O * (C - y));
            return C = m(C - E), y = m(y + E), {
                x_2: C,
                x_3: y
            };
        }
        function U(O, C) {
            ra("u", O, lr, s), ra("scalar", C, f, w);
            const y = C, E = O;
            let k = Pn, D = lr, B = O, I = Pn, T = lr;
            for(let K = BigInt(l - 1); K >= lr; K--){
                const ae = y >> K & Pn;
                T ^= ae, { x_2: k, x_3: B } = R(T, k, B), { x_2: D, x_3: I } = R(T, D, I), T = ae;
                const oe = k + D, ne = m(oe * oe), ie = k - D, de = m(ie * ie), Te = ne - de, he = B + I, Ue = B - I, Ft = m(Ue * oe), Ts = m(he * ie), Zs = Ft + Ts, Tn = Ft - Ts;
                B = m(Zs * Zs), I = m(E * m(Tn * Tn)), k = m(ne * de), D = m(Te * (ne + m(u * Te)));
            }
            ({ x_2: k, x_3: B } = R(T, k, B)), { x_2: D, x_3: I } = R(T, D, I);
            const V = i(D);
            return m(k * V);
        }
        const N = {
            secretKey: d,
            publicKey: d,
            seed: d
        }, M = (O = c(d))=>(Yt(O, N.seed), O);
        function Y(O) {
            const C = M(O);
            return {
                secretKey: C,
                publicKey: b(C)
            };
        }
        return {
            keygen: Y,
            getSharedSecret: (O, C)=>G(O, C),
            getPublicKey: (O)=>b(O),
            scalarMult: G,
            scalarMultBase: b,
            utils: {
                randomSecretKey: M,
                randomPrivateKey: M
            },
            GuBytes: A.slice(),
            lengths: N
        };
    }
    const Nw = BigInt(1), sl = BigInt(2), _w = BigInt(3), Sw = BigInt(5);
    BigInt(8);
    const xh = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), Tw = {
        p: xh,
        n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
        a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
        d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
        Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
        Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
    };
    function kw(t) {
        const e = BigInt(10), s = BigInt(20), n = BigInt(40), r = BigInt(80), i = xh, o = t * t % i * t % i, a = qt(o, sl, i) * o % i, c = qt(a, Nw, i) * t % i, l = qt(c, Sw, i) * c % i, d = qt(l, e, i) * l % i, h = qt(d, s, i) * d % i, u = qt(h, n, i) * h % i, f = qt(u, r, i) * u % i, g = qt(f, r, i) * u % i, w = qt(g, e, i) * l % i;
        return {
            pow_p_5_8: qt(w, sl, i) * t % i,
            b2: o
        };
    }
    function Ow(t) {
        return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
    }
    const Pw = Xs(Tw.p, {
        isLE: !0
    }), ia = (()=>{
        const t = Pw.ORDER;
        return Iw({
            P: t,
            type: "x25519",
            powPminus2: (e)=>{
                const { pow_p_5_8: s, b2: n } = kw(e);
                return Nt(qt(s, _w, t) * n, t);
            },
            adjustScalarBytes: Ow
        });
    })(), nl = (t, e)=>(t + (t >= 0 ? e : -e) / $h) / e;
    function Rw(t, e, s) {
        const [[n, r], [i, o]] = e, a = nl(o * t, s), c = nl(-r * t, s);
        let l = t - a * n - c * i, d = -a * r - c * o;
        const h = l < vs, u = d < vs;
        h && (l = -l), u && (d = -d);
        const f = Yr(Math.ceil(bh(s) / 2)) + Vn;
        if (l < vs || l >= f || d < vs || d >= f) throw new Error("splitScalar (endomorphism): failed, k=" + t);
        return {
            k1neg: h,
            k1: l,
            k2neg: u,
            k2: d
        };
    }
    function oa(t) {
        if (![
            "compact",
            "recovered",
            "der"
        ].includes(t)) throw new Error('Signature format must be "compact", "recovered", or "der"');
        return t;
    }
    function vo(t, e) {
        const s = {};
        for (let n of Object.keys(e))s[n] = t[n] === void 0 ? e[n] : t[n];
        return Di(s.lowS, "lowS"), Di(s.prehash, "prehash"), s.format !== void 0 && oa(s.format), s;
    }
    class xw extends Error {
        constructor(e = ""){
            super(e);
        }
    }
    const bs = {
        Err: xw,
        _tlv: {
            encode: (t, e)=>{
                const { Err: s } = bs;
                if (t < 0 || t > 256) throw new s("tlv.encode: wrong tag");
                if (e.length & 1) throw new s("tlv.encode: unpadded data");
                const n = e.length / 2, r = ai(n);
                if (r.length / 2 & 128) throw new s("tlv.encode: long form length too big");
                const i = n > 127 ? ai(r.length / 2 | 128) : "";
                return ai(t) + i + r + e;
            },
            decode (t, e) {
                const { Err: s } = bs;
                let n = 0;
                if (t < 0 || t > 256) throw new s("tlv.encode: wrong tag");
                if (e.length < 2 || e[n++] !== t) throw new s("tlv.decode: wrong tlv");
                const r = e[n++], i = !!(r & 128);
                let o = 0;
                if (!i) o = r;
                else {
                    const c = r & 127;
                    if (!c) throw new s("tlv.decode(long): indefinite length not supported");
                    if (c > 4) throw new s("tlv.decode(long): byte length is too big");
                    const l = e.subarray(n, n + c);
                    if (l.length !== c) throw new s("tlv.decode: length bytes not complete");
                    if (l[0] === 0) throw new s("tlv.decode(long): zero leftmost byte");
                    for (const d of l)o = o << 8 | d;
                    if (n += c, o < 128) throw new s("tlv.decode(long): not minimal encoding");
                }
                const a = e.subarray(n, n + o);
                if (a.length !== o) throw new s("tlv.decode: wrong value length");
                return {
                    v: a,
                    l: e.subarray(n + o)
                };
            }
        },
        _int: {
            encode (t) {
                const { Err: e } = bs;
                if (t < vs) throw new e("integer: negative integers are not allowed");
                let s = ai(t);
                if (Number.parseInt(s[0], 16) & 8 && (s = "00" + s), s.length & 1) throw new e("unexpected DER parsing assertion: unpadded hex");
                return s;
            },
            decode (t) {
                const { Err: e } = bs;
                if (t[0] & 128) throw new e("invalid signature integer: negative");
                if (t[0] === 0 && !(t[1] & 128)) throw new e("invalid signature integer: unnecessary leading zero");
                return Zi(t);
            }
        },
        toSig (t) {
            const { Err: e, _int: s, _tlv: n } = bs, r = rt("signature", t), { v: i, l: o } = n.decode(48, r);
            if (o.length) throw new e("invalid signature: left bytes after parsing");
            const { v: a, l: c } = n.decode(2, i), { v: l, l: d } = n.decode(2, c);
            if (d.length) throw new e("invalid signature: left bytes after parsing");
            return {
                r: s.decode(a),
                s: s.decode(l)
            };
        },
        hexFromSig (t) {
            const { _tlv: e, _int: s } = bs, n = e.encode(2, s.encode(t.r)), r = e.encode(2, s.encode(t.s)), i = n + r;
            return e.encode(48, i);
        }
    }, vs = BigInt(0), Vn = BigInt(1), $h = BigInt(2), li = BigInt(3), $w = BigInt(4);
    function Fn(t, e) {
        const { BYTES: s } = t;
        let n;
        if (typeof e == "bigint") n = e;
        else {
            let r = rt("private key", e);
            try {
                n = t.fromBytes(r);
            } catch  {
                throw new Error(`invalid private key: expected ui8a of size ${s}, got ${typeof e}`);
            }
        }
        if (!t.isValidNot0(n)) throw new Error("invalid private key: out of range [1..N-1]");
        return n;
    }
    function Uw(t, e = {}) {
        const s = vw("weierstrass", t, e), { Fp: n, Fn: r } = s;
        let i = s.CURVE;
        const { h: o, n: a } = i;
        Qi(e, {}, {
            allowInfinityPoint: "boolean",
            clearCofactor: "function",
            isTorsionFree: "function",
            fromBytes: "function",
            toBytes: "function",
            endo: "object",
            wrapPrivateKey: "boolean"
        });
        const { endo: c } = e;
        if (c && (!n.is0(i.a) || typeof c.beta != "bigint" || !Array.isArray(c.basises))) throw new Error('invalid endo: expected "beta": bigint and "basises": array');
        const l = Dh(n, r);
        function d() {
            if (!n.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
        }
        function h(O, C, y) {
            const { x: E, y: k } = C.toAffine(), D = n.toBytes(E);
            if (Di(y, "isCompressed"), y) {
                d();
                const B = !n.isOdd(k);
                return Ws(Uh(B), D);
            } else return Ws(Uint8Array.of(4), D, n.toBytes(k));
        }
        function u(O) {
            un(O, void 0, "Point");
            const { publicKey: C, publicKeyUncompressed: y } = l, E = O.length, k = O[0], D = O.subarray(1);
            if (E === C && (k === 2 || k === 3)) {
                const B = n.fromBytes(D);
                if (!n.isValid(B)) throw new Error("bad point: is not on curve, wrong x");
                const I = w(B);
                let T;
                try {
                    T = n.sqrt(I);
                } catch (K) {
                    const ae = K instanceof Error ? ": " + K.message : "";
                    throw new Error("bad point: is not on curve, sqrt error" + ae);
                }
                d();
                const V = n.isOdd(T);
                return (k & 1) === 1 !== V && (T = n.neg(T)), {
                    x: B,
                    y: T
                };
            } else if (E === y && k === 4) {
                const B = n.BYTES, I = n.fromBytes(D.subarray(0, B)), T = n.fromBytes(D.subarray(B, B * 2));
                if (!m(I, T)) throw new Error("bad point: is not on curve");
                return {
                    x: I,
                    y: T
                };
            } else throw new Error(`bad point: got length ${E}, expected compressed=${C} or uncompressed=${y}`);
        }
        const f = e.toBytes || h, g = e.fromBytes || u;
        function w(O) {
            const C = n.sqr(O), y = n.mul(C, O);
            return n.add(n.add(y, n.mul(O, i.a)), i.b);
        }
        function m(O, C) {
            const y = n.sqr(C), E = w(O);
            return n.eql(y, E);
        }
        if (!m(i.Gx, i.Gy)) throw new Error("bad curve params: generator point");
        const A = n.mul(n.pow(i.a, li), $w), v = n.mul(n.sqr(i.b), BigInt(27));
        if (n.is0(n.add(A, v))) throw new Error("bad curve params: a or b");
        function P(O, C, y = !1) {
            if (!n.isValid(C) || y && n.is0(C)) throw new Error(`bad point coordinate ${O}`);
            return C;
        }
        function j(O) {
            if (!(O instanceof N)) throw new Error("ProjectivePoint expected");
        }
        function G(O) {
            if (!c || !c.basises) throw new Error("no endo");
            return Rw(O, c.basises, r.ORDER);
        }
        const b = Jc((O, C)=>{
            const { X: y, Y: E, Z: k } = O;
            if (n.eql(k, n.ONE)) return {
                x: y,
                y: E
            };
            const D = O.is0();
            C == null && (C = D ? n.ONE : n.inv(k));
            const B = n.mul(y, C), I = n.mul(E, C), T = n.mul(k, C);
            if (D) return {
                x: n.ZERO,
                y: n.ZERO
            };
            if (!n.eql(T, n.ONE)) throw new Error("invZ was invalid");
            return {
                x: B,
                y: I
            };
        }), R = Jc((O)=>{
            if (O.is0()) {
                if (e.allowInfinityPoint && !n.is0(O.Y)) return;
                throw new Error("bad point: ZERO");
            }
            const { x: C, y } = O.toAffine();
            if (!n.isValid(C) || !n.isValid(y)) throw new Error("bad point: x or y not field elements");
            if (!m(C, y)) throw new Error("bad point: equation left != right");
            if (!O.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
            return !0;
        });
        function U(O, C, y, E, k) {
            return y = new N(n.mul(y.X, O), y.Y, y.Z), C = Mi(E, C), y = Mi(k, y), C.add(y);
        }
        class N {
            constructor(C, y, E){
                this.X = P("x", C), this.Y = P("y", y, !0), this.Z = P("z", E), Object.freeze(this);
            }
            static CURVE() {
                return i;
            }
            static fromAffine(C) {
                const { x: y, y: E } = C || {};
                if (!C || !n.isValid(y) || !n.isValid(E)) throw new Error("invalid affine point");
                if (C instanceof N) throw new Error("projective point not allowed");
                return n.is0(y) && n.is0(E) ? N.ZERO : new N(y, E, n.ONE);
            }
            static fromBytes(C) {
                const y = N.fromAffine(g(un(C, void 0, "point")));
                return y.assertValidity(), y;
            }
            static fromHex(C) {
                return N.fromBytes(rt("pointHex", C));
            }
            get x() {
                return this.toAffine().x;
            }
            get y() {
                return this.toAffine().y;
            }
            precompute(C = 8, y = !0) {
                return Y.createCache(this, C), y || this.multiply(li), this;
            }
            assertValidity() {
                R(this);
            }
            hasEvenY() {
                const { y: C } = this.toAffine();
                if (!n.isOdd) throw new Error("Field doesn't support isOdd");
                return !n.isOdd(C);
            }
            equals(C) {
                j(C);
                const { X: y, Y: E, Z: k } = this, { X: D, Y: B, Z: I } = C, T = n.eql(n.mul(y, I), n.mul(D, k)), V = n.eql(n.mul(E, I), n.mul(B, k));
                return T && V;
            }
            negate() {
                return new N(this.X, n.neg(this.Y), this.Z);
            }
            double() {
                const { a: C, b: y } = i, E = n.mul(y, li), { X: k, Y: D, Z: B } = this;
                let I = n.ZERO, T = n.ZERO, V = n.ZERO, K = n.mul(k, k), ae = n.mul(D, D), oe = n.mul(B, B), ne = n.mul(k, D);
                return ne = n.add(ne, ne), V = n.mul(k, B), V = n.add(V, V), I = n.mul(C, V), T = n.mul(E, oe), T = n.add(I, T), I = n.sub(ae, T), T = n.add(ae, T), T = n.mul(I, T), I = n.mul(ne, I), V = n.mul(E, V), oe = n.mul(C, oe), ne = n.sub(K, oe), ne = n.mul(C, ne), ne = n.add(ne, V), V = n.add(K, K), K = n.add(V, K), K = n.add(K, oe), K = n.mul(K, ne), T = n.add(T, K), oe = n.mul(D, B), oe = n.add(oe, oe), K = n.mul(oe, ne), I = n.sub(I, K), V = n.mul(oe, ae), V = n.add(V, V), V = n.add(V, V), new N(I, T, V);
            }
            add(C) {
                j(C);
                const { X: y, Y: E, Z: k } = this, { X: D, Y: B, Z: I } = C;
                let T = n.ZERO, V = n.ZERO, K = n.ZERO;
                const ae = i.a, oe = n.mul(i.b, li);
                let ne = n.mul(y, D), ie = n.mul(E, B), de = n.mul(k, I), Te = n.add(y, E), he = n.add(D, B);
                Te = n.mul(Te, he), he = n.add(ne, ie), Te = n.sub(Te, he), he = n.add(y, k);
                let Ue = n.add(D, I);
                return he = n.mul(he, Ue), Ue = n.add(ne, de), he = n.sub(he, Ue), Ue = n.add(E, k), T = n.add(B, I), Ue = n.mul(Ue, T), T = n.add(ie, de), Ue = n.sub(Ue, T), K = n.mul(ae, he), T = n.mul(oe, de), K = n.add(T, K), T = n.sub(ie, K), K = n.add(ie, K), V = n.mul(T, K), ie = n.add(ne, ne), ie = n.add(ie, ne), de = n.mul(ae, de), he = n.mul(oe, he), ie = n.add(ie, de), de = n.sub(ne, de), de = n.mul(ae, de), he = n.add(he, de), ne = n.mul(ie, he), V = n.add(V, ne), ne = n.mul(Ue, he), T = n.mul(Te, T), T = n.sub(T, ne), ne = n.mul(Te, ie), K = n.mul(Ue, K), K = n.add(K, ne), new N(T, V, K);
            }
            subtract(C) {
                return this.add(C.negate());
            }
            is0() {
                return this.equals(N.ZERO);
            }
            multiply(C) {
                const { endo: y } = e;
                if (!r.isValidNot0(C)) throw new Error("invalid scalar: out of range");
                let E, k;
                const D = (B)=>Y.cached(this, B, (I)=>yo(N, I));
                if (y) {
                    const { k1neg: B, k1: I, k2neg: T, k2: V } = G(C), { p: K, f: ae } = D(I), { p: oe, f: ne } = D(V);
                    k = ae.add(ne), E = U(y.beta, K, oe, B, T);
                } else {
                    const { p: B, f: I } = D(C);
                    E = B, k = I;
                }
                return yo(N, [
                    E,
                    k
                ])[0];
            }
            multiplyUnsafe(C) {
                const { endo: y } = e, E = this;
                if (!r.isValid(C)) throw new Error("invalid scalar: out of range");
                if (C === vs || E.is0()) return N.ZERO;
                if (C === Vn) return E;
                if (Y.hasCache(this)) return this.multiply(C);
                if (y) {
                    const { k1neg: k, k1: D, k2neg: B, k2: I } = G(C), { p1: T, p2: V } = Cw(N, E, D, I);
                    return U(y.beta, T, V, k, B);
                } else return Y.unsafe(E, C);
            }
            multiplyAndAddUnsafe(C, y, E) {
                const k = this.multiplyUnsafe(y).add(C.multiplyUnsafe(E));
                return k.is0() ? void 0 : k;
            }
            toAffine(C) {
                return b(this, C);
            }
            isTorsionFree() {
                const { isTorsionFree: C } = e;
                return o === Vn ? !0 : C ? C(N, this) : Y.unsafe(this, a).is0();
            }
            clearCofactor() {
                const { clearCofactor: C } = e;
                return o === Vn ? this : C ? C(N, this) : this.multiplyUnsafe(o);
            }
            isSmallOrder() {
                return this.multiplyUnsafe(o).is0();
            }
            toBytes(C = !0) {
                return Di(C, "isCompressed"), this.assertValidity(), f(N, this, C);
            }
            toHex(C = !0) {
                return Hn(this.toBytes(C));
            }
            toString() {
                return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
            }
            get px() {
                return this.X;
            }
            get py() {
                return this.X;
            }
            get pz() {
                return this.Z;
            }
            toRawBytes(C = !0) {
                return this.toBytes(C);
            }
            _setWindowSize(C) {
                this.precompute(C);
            }
            static normalizeZ(C) {
                return yo(N, C);
            }
            static msm(C, y) {
                return Ew(N, r, C, y);
            }
            static fromPrivateKey(C) {
                return N.BASE.multiply(Fn(r, C));
            }
        }
        N.BASE = new N(i.Gx, i.Gy, n.ONE), N.ZERO = new N(n.ZERO, n.ONE, n.ZERO), N.Fp = n, N.Fn = r;
        const M = r.BITS, Y = new bw(N, e.endo ? Math.ceil(M / 2) : M);
        return N.BASE.precompute(8), N;
    }
    function Uh(t) {
        return Uint8Array.of(t ? 2 : 3);
    }
    function Dh(t, e) {
        return {
            secretKey: e.BYTES,
            publicKey: 1 + t.BYTES,
            publicKeyUncompressed: 1 + 2 * t.BYTES,
            publicKeyHasPrefix: !0,
            signature: 2 * e.BYTES
        };
    }
    function Dw(t, e = {}) {
        const { Fn: s } = t, n = e.randomBytes || _n, r = Object.assign(Dh(t.Fp, s), {
            seed: Oh(s.ORDER)
        });
        function i(u) {
            try {
                return !!Fn(s, u);
            } catch  {
                return !1;
            }
        }
        function o(u, f) {
            const { publicKey: g, publicKeyUncompressed: w } = r;
            try {
                const m = u.length;
                return f === !0 && m !== g || f === !1 && m !== w ? !1 : !!t.fromBytes(u);
            } catch  {
                return !1;
            }
        }
        function a(u = n(r.seed)) {
            return mw(un(u, r.seed, "seed"), s.ORDER);
        }
        function c(u, f = !0) {
            return t.BASE.multiply(Fn(s, u)).toBytes(f);
        }
        function l(u) {
            const f = a(u);
            return {
                secretKey: f,
                publicKey: c(f)
            };
        }
        function d(u) {
            if (typeof u == "bigint") return !1;
            if (u instanceof t) return !0;
            const { secretKey: f, publicKey: g, publicKeyUncompressed: w } = r;
            if (s.allowedLengths || f === g) return;
            const m = rt("key", u).length;
            return m === g || m === w;
        }
        function h(u, f, g = !0) {
            if (d(u) === !0) throw new Error("first arg must be private key");
            if (d(f) === !1) throw new Error("second arg must be public key");
            const w = Fn(s, u);
            return t.fromHex(f).multiply(w).toBytes(g);
        }
        return Object.freeze({
            getPublicKey: c,
            getSharedSecret: h,
            keygen: l,
            Point: t,
            utils: {
                isValidSecretKey: i,
                isValidPublicKey: o,
                randomSecretKey: a,
                isValidPrivateKey: i,
                randomPrivateKey: a,
                normPrivateKeyToScalar: (u)=>Fn(s, u),
                precompute (u = 8, f = t.BASE) {
                    return f.precompute(u, !1);
                }
            },
            lengths: r
        });
    }
    function Lw(t, e, s = {}) {
        zi(e), Qi(s, {}, {
            hmac: "function",
            lowS: "boolean",
            randomBytes: "function",
            bits2int: "function",
            bits2int_modN: "function"
        });
        const n = s.randomBytes || _n, r = s.hmac || ((y, ...E)=>Ji(e, y, Ws(...E))), { Fp: i, Fn: o } = t, { ORDER: a, BITS: c } = o, { keygen: l, getPublicKey: d, getSharedSecret: h, utils: u, lengths: f } = Dw(t, s), g = {
            prehash: !1,
            lowS: typeof s.lowS == "boolean" ? s.lowS : !1,
            format: void 0,
            extraEntropy: !1
        }, w = "compact";
        function m(y) {
            const E = a >> Vn;
            return y > E;
        }
        function A(y, E) {
            if (!o.isValidNot0(E)) throw new Error(`invalid signature ${y}: out of range 1..Point.Fn.ORDER`);
            return E;
        }
        function v(y, E) {
            oa(E);
            const k = f.signature, D = E === "compact" ? k : E === "recovered" ? k + 1 : void 0;
            return un(y, D, `${E} signature`);
        }
        class P {
            constructor(E, k, D){
                this.r = A("r", E), this.s = A("s", k), D != null && (this.recovery = D), Object.freeze(this);
            }
            static fromBytes(E, k = w) {
                v(E, k);
                let D;
                if (k === "der") {
                    const { r: V, s: K } = bs.toSig(un(E));
                    return new P(V, K);
                }
                k === "recovered" && (D = E[0], k = "compact", E = E.subarray(1));
                const B = o.BYTES, I = E.subarray(0, B), T = E.subarray(B, B * 2);
                return new P(o.fromBytes(I), o.fromBytes(T), D);
            }
            static fromHex(E, k) {
                return this.fromBytes($i(E), k);
            }
            addRecoveryBit(E) {
                return new P(this.r, this.s, E);
            }
            recoverPublicKey(E) {
                const k = i.ORDER, { r: D, s: B, recovery: I } = this;
                if (I == null || ![
                    0,
                    1,
                    2,
                    3
                ].includes(I)) throw new Error("recovery id invalid");
                if (a * $h < k && I > 1) throw new Error("recovery id is ambiguous for h>1 curve");
                const T = I === 2 || I === 3 ? D + a : D;
                if (!i.isValid(T)) throw new Error("recovery id 2 or 3 invalid");
                const V = i.toBytes(T), K = t.fromBytes(Ws(Uh((I & 1) === 0), V)), ae = o.inv(T), oe = G(rt("msgHash", E)), ne = o.create(-oe * ae), ie = o.create(B * ae), de = t.BASE.multiplyUnsafe(ne).add(K.multiplyUnsafe(ie));
                if (de.is0()) throw new Error("point at infinify");
                return de.assertValidity(), de;
            }
            hasHighS() {
                return m(this.s);
            }
            toBytes(E = w) {
                if (oa(E), E === "der") return $i(bs.hexFromSig(this));
                const k = o.toBytes(this.r), D = o.toBytes(this.s);
                if (E === "recovered") {
                    if (this.recovery == null) throw new Error("recovery bit must be present");
                    return Ws(Uint8Array.of(this.recovery), k, D);
                }
                return Ws(k, D);
            }
            toHex(E) {
                return Hn(this.toBytes(E));
            }
            assertValidity() {}
            static fromCompact(E) {
                return P.fromBytes(rt("sig", E), "compact");
            }
            static fromDER(E) {
                return P.fromBytes(rt("sig", E), "der");
            }
            normalizeS() {
                return this.hasHighS() ? new P(this.r, o.neg(this.s), this.recovery) : this;
            }
            toDERRawBytes() {
                return this.toBytes("der");
            }
            toDERHex() {
                return Hn(this.toBytes("der"));
            }
            toCompactRawBytes() {
                return this.toBytes("compact");
            }
            toCompactHex() {
                return Hn(this.toBytes("compact"));
            }
        }
        const j = s.bits2int || function(y) {
            if (y.length > 8192) throw new Error("input is too large");
            const E = Zi(y), k = y.length * 8 - c;
            return k > 0 ? E >> BigInt(k) : E;
        }, G = s.bits2int_modN || function(y) {
            return o.create(j(y));
        }, b = Yr(c);
        function R(y) {
            return ra("num < 2^" + c, y, vs, b), o.toBytes(y);
        }
        function U(y, E) {
            return un(y, void 0, "message"), E ? un(e(y), void 0, "prehashed message") : y;
        }
        function N(y, E, k) {
            if ([
                "recovered",
                "canonical"
            ].some((ie)=>ie in k)) throw new Error("sign() legacy options not supported");
            const { lowS: D, prehash: B, extraEntropy: I } = vo(k, g);
            y = U(y, B);
            const T = G(y), V = Fn(o, E), K = [
                R(V),
                R(T)
            ];
            if (I != null && I !== !1) {
                const ie = I === !0 ? n(f.secretKey) : I;
                K.push(rt("extraEntropy", ie));
            }
            const ae = Ws(...K), oe = T;
            function ne(ie) {
                const de = j(ie);
                if (!o.isValidNot0(de)) return;
                const Te = o.inv(de), he = t.BASE.multiply(de).toAffine(), Ue = o.create(he.x);
                if (Ue === vs) return;
                const Ft = o.create(Te * o.create(oe + Ue * V));
                if (Ft === vs) return;
                let Ts = (he.x === Ue ? 0 : 2) | Number(he.y & Vn), Zs = Ft;
                return D && m(Ft) && (Zs = o.neg(Ft), Ts ^= 1), new P(Ue, Zs, Ts);
            }
            return {
                seed: ae,
                k2sig: ne
            };
        }
        function M(y, E, k = {}) {
            y = rt("message", y);
            const { seed: D, k2sig: B } = N(y, E, k);
            return aw(e.outputLen, o.BYTES, r)(D, B);
        }
        function Y(y) {
            let E;
            const k = typeof y == "string" || Ki(y), D = !k && y !== null && typeof y == "object" && typeof y.r == "bigint" && typeof y.s == "bigint";
            if (!k && !D) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
            if (D) E = new P(y.r, y.s);
            else if (k) {
                try {
                    E = P.fromBytes(rt("sig", y), "der");
                } catch (B) {
                    if (!(B instanceof bs.Err)) throw B;
                }
                if (!E) try {
                    E = P.fromBytes(rt("sig", y), "compact");
                } catch  {
                    return !1;
                }
            }
            return E || !1;
        }
        function O(y, E, k, D = {}) {
            const { lowS: B, prehash: I, format: T } = vo(D, g);
            if (k = rt("publicKey", k), E = U(rt("message", E), I), "strict" in D) throw new Error("options.strict was renamed to lowS");
            const V = T === void 0 ? Y(y) : P.fromBytes(rt("sig", y), T);
            if (V === !1) return !1;
            try {
                const K = t.fromBytes(k);
                if (B && V.hasHighS()) return !1;
                const { r: ae, s: oe } = V, ne = G(E), ie = o.inv(oe), de = o.create(ne * ie), Te = o.create(ae * ie), he = t.BASE.multiplyUnsafe(de).add(K.multiplyUnsafe(Te));
                return he.is0() ? !1 : o.create(he.x) === ae;
            } catch  {
                return !1;
            }
        }
        function C(y, E, k = {}) {
            const { prehash: D } = vo(k, g);
            return E = U(E, D), P.fromBytes(y, "recovered").recoverPublicKey(E).toBytes();
        }
        return Object.freeze({
            keygen: l,
            getPublicKey: d,
            getSharedSecret: h,
            utils: u,
            lengths: f,
            Point: t,
            sign: M,
            verify: O,
            recoverPublicKey: C,
            Signature: P,
            hash: e
        });
    }
    function Mw(t) {
        const e = {
            a: t.a,
            b: t.b,
            p: t.Fp.ORDER,
            n: t.n,
            h: t.h,
            Gx: t.Gx,
            Gy: t.Gy
        }, s = t.Fp;
        let n = t.allowedPrivateKeyLengths ? Array.from(new Set(t.allowedPrivateKeyLengths.map((o)=>Math.ceil(o / 2)))) : void 0;
        const r = Xs(e.n, {
            BITS: t.nBitLength,
            allowedLengths: n,
            modFromBytes: t.wrapPrivateKey
        }), i = {
            Fp: s,
            Fn: r,
            allowInfinityPoint: t.allowInfinityPoint,
            endo: t.endo,
            isTorsionFree: t.isTorsionFree,
            clearCofactor: t.clearCofactor,
            fromBytes: t.fromBytes,
            toBytes: t.toBytes
        };
        return {
            CURVE: e,
            curveOpts: i
        };
    }
    function Bw(t) {
        const { CURVE: e, curveOpts: s } = Mw(t), n = {
            hmac: t.hmac,
            randomBytes: t.randomBytes,
            lowS: t.lowS,
            bits2int: t.bits2int,
            bits2int_modN: t.bits2int_modN
        };
        return {
            CURVE: e,
            curveOpts: s,
            hash: t.hash,
            ecdsaOpts: n
        };
    }
    function Fw(t, e) {
        const s = e.Point;
        return Object.assign({}, e, {
            ProjectivePoint: s,
            CURVE: Object.assign({}, t, Th(s.Fn.ORDER, s.Fn.BITS))
        });
    }
    function jw(t) {
        const { CURVE: e, curveOpts: s, hash: n, ecdsaOpts: r } = Bw(t), i = Uw(e, s), o = Lw(i, n, r);
        return Fw(t, o);
    }
    function aa(t, e) {
        const s = (n)=>jw({
                ...t,
                hash: n
            });
        return {
            ...s(e),
            create: s
        };
    }
    const Lh = {
        p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
        n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
        h: BigInt(1),
        a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
        b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
        Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
        Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
    }, Mh = {
        p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
        n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
        h: BigInt(1),
        a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
        b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
        Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
        Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
    }, Bh = {
        p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
        n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
        h: BigInt(1),
        a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
        b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
        Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
        Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
    }, Ww = Xs(Lh.p), qw = Xs(Mh.p), Hw = Xs(Bh.p), Vw = aa({
        ...Lh,
        Fp: Ww,
        lowS: !1
    }, Yi);
    aa({
        ...Mh,
        Fp: qw,
        lowS: !1
    }, Zg), aa({
        ...Bh,
        Fp: Hw,
        lowS: !1,
        allowedPrivateKeyLengths: [
            130,
            131,
            132
        ]
    }, Xg);
    const Kw = Vw, Fh = "base10", at = "base16", mt = "base64pad", qs = "base64url", Jr = "utf8", jh = 0, Is = 1, Xr = 2, zw = 0, rl = 1, Sr = 12, Va = 32;
    function Gw() {
        const t = ia.utils.randomPrivateKey(), e = ia.getPublicKey(t);
        return {
            privateKey: yt(t, at),
            publicKey: yt(e, at)
        };
    }
    function ca() {
        const t = _n(Va);
        return yt(t, at);
    }
    function Yw(t, e) {
        const s = ia.getSharedSecret(Dt(t, at), Dt(e, at)), n = iw(Xi, s, void 0, void 0, Va);
        return yt(n, at);
    }
    function bi(t) {
        const e = Xi(Dt(t, at));
        return yt(e, at);
    }
    function $t(t) {
        const e = Xi(Dt(t, Jr));
        return yt(e, at);
    }
    function Wh(t) {
        return Dt(`${t}`, Fh);
    }
    function Cn(t) {
        return Number(yt(t, Fh));
    }
    function qh(t) {
        return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    function Hh(t) {
        const e = t.replace(/-/g, "+").replace(/_/g, "/"), s = (4 - e.length % 4) % 4;
        return e + "=".repeat(s);
    }
    function Jw(t) {
        const e = Wh(typeof t.type < "u" ? t.type : jh);
        if (Cn(e) === Is && typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
        const s = typeof t.senderPublicKey < "u" ? Dt(t.senderPublicKey, at) : void 0, n = typeof t.iv < "u" ? Dt(t.iv, at) : _n(Sr), r = Dt(t.symKey, at), i = mh(r, n).encrypt(Dt(t.message, Jr)), o = Vh({
            type: e,
            sealed: i,
            iv: n,
            senderPublicKey: s
        });
        return t.encoding === qs ? qh(o) : o;
    }
    function Xw(t) {
        const e = Dt(t.symKey, at), { sealed: s, iv: n } = Dr({
            encoded: t.encoded,
            encoding: t.encoding
        }), r = mh(e, n).decrypt(s);
        if (r === null) throw new Error("Failed to decrypt");
        return yt(r, Jr);
    }
    function Zw(t, e) {
        const s = Wh(Xr), n = _n(Sr), r = Dt(t, Jr), i = Vh({
            type: s,
            sealed: r,
            iv: n
        });
        return e === qs ? qh(i) : i;
    }
    function Qw(t, e) {
        const { sealed: s } = Dr({
            encoded: t,
            encoding: e
        });
        return yt(s, Jr);
    }
    function Vh(t) {
        if (Cn(t.type) === Xr) return yt(Ir([
            t.type,
            t.sealed
        ]), mt);
        if (Cn(t.type) === Is) {
            if (typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
            return yt(Ir([
                t.type,
                t.senderPublicKey,
                t.iv,
                t.sealed
            ]), mt);
        }
        return yt(Ir([
            t.type,
            t.iv,
            t.sealed
        ]), mt);
    }
    function Dr(t) {
        const e = (t.encoding || mt) === qs ? Hh(t.encoded) : t.encoded, s = Dt(e, mt), n = s.slice(zw, rl), r = rl;
        if (Cn(n) === Is) {
            const c = r + Va, l = c + Sr, d = s.slice(r, c), h = s.slice(c, l), u = s.slice(l);
            return {
                type: n,
                sealed: u,
                iv: h,
                senderPublicKey: d
            };
        }
        if (Cn(n) === Xr) {
            const c = s.slice(r), l = _n(Sr);
            return {
                type: n,
                sealed: c,
                iv: l
            };
        }
        const i = r + Sr, o = s.slice(r, i), a = s.slice(i);
        return {
            type: n,
            sealed: a,
            iv: o
        };
    }
    function ey(t, e) {
        const s = Dr({
            encoded: t,
            encoding: e?.encoding
        });
        return Kh({
            type: Cn(s.type),
            senderPublicKey: typeof s.senderPublicKey < "u" ? yt(s.senderPublicKey, at) : void 0,
            receiverPublicKey: e?.receiverPublicKey
        });
    }
    function Kh(t) {
        const e = t?.type || jh;
        if (e === Is) {
            if (typeof t?.senderPublicKey > "u") throw new Error("missing sender public key");
            if (typeof t?.receiverPublicKey > "u") throw new Error("missing receiver public key");
        }
        return {
            type: e,
            senderPublicKey: t?.senderPublicKey,
            receiverPublicKey: t?.receiverPublicKey
        };
    }
    function il(t) {
        return t.type === Is && typeof t.senderPublicKey == "string" && typeof t.receiverPublicKey == "string";
    }
    function ol(t) {
        return t.type === Xr;
    }
    function ty(t) {
        const e = Buffer.from(t.x, "base64"), s = Buffer.from(t.y, "base64");
        return Ir([
            new Uint8Array([
                4
            ]),
            e,
            s
        ]);
    }
    function sy(t, e) {
        const [s, n, r] = t.split("."), i = Buffer.from(Hh(r), "base64");
        if (i.length !== 64) throw new Error("Invalid signature length");
        const o = i.slice(0, 32), a = i.slice(32, 64), c = `${s}.${n}`, l = Xi(c), d = ty(e);
        if (!Kw.verify(Ir([
            o,
            a
        ]), l, d)) throw new Error("Invalid signature");
        return jo(t).payload;
    }
    const ny = "irn";
    function Bi(t) {
        return t?.relay || {
            protocol: ny
        };
    }
    function jn(t) {
        const e = qu[t];
        if (typeof e > "u") throw new Error(`Relay Protocol not supported: ${t}`);
        return e;
    }
    var ry = Object.defineProperty, iy = Object.defineProperties, oy = Object.getOwnPropertyDescriptors, al = Object.getOwnPropertySymbols, ay = Object.prototype.hasOwnProperty, cy = Object.prototype.propertyIsEnumerable, cl = (t, e, s)=>e in t ? ry(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Ao = (t, e)=>{
        for(var s in e || (e = {}))ay.call(e, s) && cl(t, s, e[s]);
        if (al) for (var s of al(e))cy.call(e, s) && cl(t, s, e[s]);
        return t;
    }, ly = (t, e)=>iy(t, oy(e));
    function dy(t, e = "-") {
        const s = {}, n = "relay" + e;
        return Object.keys(t).forEach((r)=>{
            if (r.startsWith(n)) {
                const i = r.replace(n, ""), o = t[r];
                s[i] = o;
            }
        }), s;
    }
    function ll(t) {
        if (!t.includes("wc:")) {
            const l = Jd(t);
            l != null && l.includes("wc:") && (t = l);
        }
        t = t.includes("wc://") ? t.replace("wc://", "") : t, t = t.includes("wc:") ? t.replace("wc:", "") : t;
        const e = t.indexOf(":"), s = t.indexOf("?") !== -1 ? t.indexOf("?") : void 0, n = t.substring(0, e), r = t.substring(e + 1, s).split("@"), i = typeof s < "u" ? t.substring(s) : "", o = new URLSearchParams(i), a = Object.fromEntries(o.entries()), c = typeof a.methods == "string" ? a.methods.split(",") : void 0;
        return {
            protocol: n,
            topic: hy(r[0]),
            version: parseInt(r[1], 10),
            symKey: a.symKey,
            relay: dy(a),
            methods: c,
            expiryTimestamp: a.expiryTimestamp ? parseInt(a.expiryTimestamp, 10) : void 0
        };
    }
    function hy(t) {
        return t.startsWith("//") ? t.substring(2) : t;
    }
    function uy(t, e = "-") {
        const s = "relay", n = {};
        return Object.keys(t).forEach((r)=>{
            const i = r, o = s + e + i;
            t[i] && (n[o] = t[i]);
        }), n;
    }
    function dl(t) {
        const e = new URLSearchParams, s = Ao(Ao(ly(Ao({}, uy(t.relay)), {
            symKey: t.symKey
        }), t.expiryTimestamp && {
            expiryTimestamp: t.expiryTimestamp.toString()
        }), t.methods && {
            methods: t.methods.join(",")
        });
        return Object.entries(s).sort(([n], [r])=>n.localeCompare(r)).forEach(([n, r])=>{
            r !== void 0 && e.append(n, String(r));
        }), `${t.protocol}:${t.topic}@${t.version}?${e}`;
    }
    function di(t, e, s) {
        return `${t}?wc_ev=${s}&topic=${e}`;
    }
    var py = Object.defineProperty, fy = Object.defineProperties, gy = Object.getOwnPropertyDescriptors, hl = Object.getOwnPropertySymbols, my = Object.prototype.hasOwnProperty, wy = Object.prototype.propertyIsEnumerable, ul = (t, e, s)=>e in t ? py(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, yy = (t, e)=>{
        for(var s in e || (e = {}))my.call(e, s) && ul(t, s, e[s]);
        if (hl) for (var s of hl(e))wy.call(e, s) && ul(t, s, e[s]);
        return t;
    }, by = (t, e)=>fy(t, gy(e));
    function rr(t) {
        const e = [];
        return t.forEach((s)=>{
            const [n, r] = s.split(":");
            e.push(`${n}:${r}`);
        }), e;
    }
    function Cy(t) {
        const e = [];
        return Object.values(t).forEach((s)=>{
            e.push(...rr(s.accounts));
        }), e;
    }
    function Ey(t, e) {
        const s = [];
        return Object.values(t).forEach((n)=>{
            rr(n.accounts).includes(e) && s.push(...n.methods);
        }), s;
    }
    function vy(t, e) {
        const s = [];
        return Object.values(t).forEach((n)=>{
            rr(n.accounts).includes(e) && s.push(...n.events);
        }), s;
    }
    function eo(t) {
        return t.includes(":");
    }
    function Wn(t) {
        return eo(t) ? t.split(":")[0] : t;
    }
    function pl(t) {
        var e, s, n;
        const r = {};
        if (!ls(t)) return r;
        for (const [i, o] of Object.entries(t)){
            const a = eo(i) ? [
                i
            ] : o.chains, c = o.methods || [], l = o.events || [], d = Wn(i);
            r[d] = by(yy({}, r[d]), {
                chains: cs(a, (e = r[d]) == null ? void 0 : e.chains),
                methods: cs(c, (s = r[d]) == null ? void 0 : s.methods),
                events: cs(l, (n = r[d]) == null ? void 0 : n.events)
            });
        }
        return r;
    }
    function Ay(t) {
        const e = {};
        return t?.forEach((s)=>{
            var n;
            const [r, i] = s.split(":");
            e[r] || (e[r] = {
                accounts: [],
                chains: [],
                events: [],
                methods: []
            }), e[r].accounts.push(s), (n = e[r].chains) == null || n.push(`${r}:${i}`);
        }), e;
    }
    function fl(t, e) {
        e = e.map((n)=>n.replace("did:pkh:", ""));
        const s = Ay(e);
        for (const [n, r] of Object.entries(s))r.methods ? r.methods = cs(r.methods, t) : r.methods = t, r.events = [
            "chainChanged",
            "accountsChanged"
        ];
        return s;
    }
    function Iy(t, e) {
        var s, n, r, i, o, a;
        const c = pl(t), l = pl(e), d = {}, h = Object.keys(c).concat(Object.keys(l));
        for (const u of h)d[u] = {
            chains: cs((s = c[u]) == null ? void 0 : s.chains, (n = l[u]) == null ? void 0 : n.chains),
            methods: cs((r = c[u]) == null ? void 0 : r.methods, (i = l[u]) == null ? void 0 : i.methods),
            events: cs((o = c[u]) == null ? void 0 : o.events, (a = l[u]) == null ? void 0 : a.events)
        };
        return d;
    }
    const Ny = {
        INVALID_METHOD: {
            message: "Invalid method.",
            code: 1001
        },
        INVALID_EVENT: {
            message: "Invalid event.",
            code: 1002
        },
        INVALID_UPDATE_REQUEST: {
            message: "Invalid update request.",
            code: 1003
        },
        INVALID_EXTEND_REQUEST: {
            message: "Invalid extend request.",
            code: 1004
        },
        INVALID_SESSION_SETTLE_REQUEST: {
            message: "Invalid session settle request.",
            code: 1005
        },
        UNAUTHORIZED_METHOD: {
            message: "Unauthorized method.",
            code: 3001
        },
        UNAUTHORIZED_EVENT: {
            message: "Unauthorized event.",
            code: 3002
        },
        UNAUTHORIZED_UPDATE_REQUEST: {
            message: "Unauthorized update request.",
            code: 3003
        },
        UNAUTHORIZED_EXTEND_REQUEST: {
            message: "Unauthorized extend request.",
            code: 3004
        },
        USER_REJECTED: {
            message: "User rejected.",
            code: 5e3
        },
        USER_REJECTED_CHAINS: {
            message: "User rejected chains.",
            code: 5001
        },
        USER_REJECTED_METHODS: {
            message: "User rejected methods.",
            code: 5002
        },
        USER_REJECTED_EVENTS: {
            message: "User rejected events.",
            code: 5003
        },
        UNSUPPORTED_CHAINS: {
            message: "Unsupported chains.",
            code: 5100
        },
        UNSUPPORTED_METHODS: {
            message: "Unsupported methods.",
            code: 5101
        },
        UNSUPPORTED_EVENTS: {
            message: "Unsupported events.",
            code: 5102
        },
        UNSUPPORTED_ACCOUNTS: {
            message: "Unsupported accounts.",
            code: 5103
        },
        UNSUPPORTED_NAMESPACE_KEY: {
            message: "Unsupported namespace key.",
            code: 5104
        },
        USER_DISCONNECTED: {
            message: "User disconnected.",
            code: 6e3
        },
        SESSION_SETTLEMENT_FAILED: {
            message: "Session settlement failed.",
            code: 7e3
        },
        WC_METHOD_UNSUPPORTED: {
            message: "Unsupported wc_ method.",
            code: 10001
        }
    }, _y = {
        NOT_INITIALIZED: {
            message: "Not initialized.",
            code: 1
        },
        NO_MATCHING_KEY: {
            message: "No matching key.",
            code: 2
        },
        RESTORE_WILL_OVERRIDE: {
            message: "Restore will override.",
            code: 3
        },
        RESUBSCRIBED: {
            message: "Resubscribed.",
            code: 4
        },
        MISSING_OR_INVALID: {
            message: "Missing or invalid.",
            code: 5
        },
        EXPIRED: {
            message: "Expired.",
            code: 6
        },
        UNKNOWN_TYPE: {
            message: "Unknown type.",
            code: 7
        },
        MISMATCHED_TOPIC: {
            message: "Mismatched topic.",
            code: 8
        },
        NON_CONFORMING_NAMESPACES: {
            message: "Non conforming namespaces.",
            code: 9
        }
    };
    function F(t, e) {
        const { message: s, code: n } = _y[t];
        return {
            message: e ? `${s} ${e}` : s,
            code: n
        };
    }
    function Re(t, e) {
        const { message: s, code: n } = Ny[t];
        return {
            message: e ? `${s} ${e}` : s,
            code: n
        };
    }
    function Ns(t, e) {
        return !!Array.isArray(t);
    }
    function ls(t) {
        return Object.getPrototypeOf(t) === Object.prototype && Object.keys(t).length;
    }
    function We(t) {
        return typeof t > "u";
    }
    function Be(t, e) {
        return e && We(t) ? !0 : typeof t == "string" && !!t.trim().length;
    }
    function Ka(t, e) {
        return e && We(t) ? !0 : typeof t == "number" && !isNaN(t);
    }
    function Sy(t, e) {
        const { requiredNamespaces: s } = e, n = Object.keys(t.namespaces), r = Object.keys(s);
        let i = !0;
        return hn(r, n) ? (n.forEach((o)=>{
            const { accounts: a, methods: c, events: l } = t.namespaces[o], d = rr(a), h = s[o];
            (!hn(Vd(o, h), d) || !hn(h.methods, c) || !hn(h.events, l)) && (i = !1);
        }), i) : !1;
    }
    function Fi(t) {
        return Be(t, !1) && t.includes(":") ? t.split(":").length === 2 : !1;
    }
    function Ty(t) {
        if (Be(t, !1) && t.includes(":")) {
            const e = t.split(":");
            if (e.length === 3) {
                const s = e[0] + ":" + e[1];
                return !!e[2] && Fi(s);
            }
        }
        return !1;
    }
    function ky(t) {
        function e(s) {
            try {
                return typeof new URL(s) < "u";
            } catch  {
                return !1;
            }
        }
        try {
            if (Be(t, !1)) {
                if (e(t)) return !0;
                const s = Jd(t);
                return e(s);
            }
        } catch  {}
        return !1;
    }
    function Oy(t) {
        var e;
        return (e = t?.proposer) == null ? void 0 : e.publicKey;
    }
    function Py(t) {
        return t?.topic;
    }
    function Ry(t, e) {
        let s = null;
        return Be(t?.publicKey, !1) || (s = F("MISSING_OR_INVALID", `${e} controller public key should be a string`)), s;
    }
    function gl(t) {
        let e = !0;
        return Ns(t) ? t.length && (e = t.every((s)=>Be(s, !1))) : e = !1, e;
    }
    function xy(t, e, s) {
        let n = null;
        return Ns(e) && e.length ? e.forEach((r)=>{
            n || Fi(r) || (n = Re("UNSUPPORTED_CHAINS", `${s}, chain ${r} should be a string and conform to "namespace:chainId" format`));
        }) : Fi(t) || (n = Re("UNSUPPORTED_CHAINS", `${s}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), n;
    }
    function $y(t, e, s) {
        let n = null;
        return Object.entries(t).forEach(([r, i])=>{
            if (n) return;
            const o = xy(r, Vd(r, i), `${e} ${s}`);
            o && (n = o);
        }), n;
    }
    function Uy(t, e) {
        let s = null;
        return Ns(t) ? t.forEach((n)=>{
            s || Ty(n) || (s = Re("UNSUPPORTED_ACCOUNTS", `${e}, account ${n} should be a string and conform to "namespace:chainId:address" format`));
        }) : s = Re("UNSUPPORTED_ACCOUNTS", `${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), s;
    }
    function Dy(t, e) {
        let s = null;
        return Object.values(t).forEach((n)=>{
            if (s) return;
            const r = Uy(n?.accounts, `${e} namespace`);
            r && (s = r);
        }), s;
    }
    function Ly(t, e) {
        let s = null;
        return gl(t?.methods) ? gl(t?.events) || (s = Re("UNSUPPORTED_EVENTS", `${e}, events should be an array of strings or empty array for no events`)) : s = Re("UNSUPPORTED_METHODS", `${e}, methods should be an array of strings or empty array for no methods`), s;
    }
    function zh(t, e) {
        let s = null;
        return Object.values(t).forEach((n)=>{
            if (s) return;
            const r = Ly(n, `${e}, namespace`);
            r && (s = r);
        }), s;
    }
    function My(t, e, s) {
        let n = null;
        if (t && ls(t)) {
            const r = zh(t, e);
            r && (n = r);
            const i = $y(t, e, s);
            i && (n = i);
        } else n = F("MISSING_OR_INVALID", `${e}, ${s} should be an object with data`);
        return n;
    }
    function Io(t, e) {
        let s = null;
        if (t && ls(t)) {
            const n = zh(t, e);
            n && (s = n);
            const r = Dy(t, e);
            r && (s = r);
        } else s = F("MISSING_OR_INVALID", `${e}, namespaces should be an object with data`);
        return s;
    }
    function Gh(t) {
        return Be(t.protocol, !0);
    }
    function By(t, e) {
        let s = !1;
        return t ? t && Ns(t) && t.length && t.forEach((n)=>{
            s = Gh(n);
        }) : s = !0, s;
    }
    function Fy(t) {
        return typeof t == "number";
    }
    function ft(t) {
        return typeof t < "u" && typeof t !== null;
    }
    function jy(t) {
        return !(!t || typeof t != "object" || !t.code || !Ka(t.code, !1) || !t.message || !Be(t.message, !1));
    }
    function Wy(t) {
        return !(We(t) || !Be(t.method, !1));
    }
    function qy(t) {
        return !(We(t) || We(t.result) && We(t.error) || !Ka(t.id, !1) || !Be(t.jsonrpc, !1));
    }
    function Hy(t) {
        return !(We(t) || !Be(t.name, !1));
    }
    function ml(t, e) {
        return !(!Fi(e) || !Cy(t).includes(e));
    }
    function Vy(t, e, s) {
        return Be(s, !1) ? Ey(t, e).includes(s) : !1;
    }
    function Ky(t, e, s) {
        return Be(s, !1) ? vy(t, e).includes(s) : !1;
    }
    function wl(t, e, s) {
        let n = null;
        const r = zy(t), i = Gy(e), o = Object.keys(r), a = Object.keys(i), c = yl(Object.keys(t)), l = yl(Object.keys(e)), d = c.filter((h)=>!l.includes(h));
        return d.length && (n = F("NON_CONFORMING_NAMESPACES", `${s} namespaces keys don't satisfy requiredNamespaces.
      Required: ${d.toString()}
      Received: ${Object.keys(e).toString()}`)), hn(o, a) || (n = F("NON_CONFORMING_NAMESPACES", `${s} namespaces chains don't satisfy required namespaces.
      Required: ${o.toString()}
      Approved: ${a.toString()}`)), Object.keys(e).forEach((h)=>{
            if (!h.includes(":") || n) return;
            const u = rr(e[h].accounts);
            u.includes(h) || (n = F("NON_CONFORMING_NAMESPACES", `${s} namespaces accounts don't satisfy namespace accounts for ${h}
        Required: ${h}
        Approved: ${u.toString()}`));
        }), o.forEach((h)=>{
            n || (hn(r[h].methods, i[h].methods) ? hn(r[h].events, i[h].events) || (n = F("NON_CONFORMING_NAMESPACES", `${s} namespaces events don't satisfy namespace events for ${h}`)) : n = F("NON_CONFORMING_NAMESPACES", `${s} namespaces methods don't satisfy namespace methods for ${h}`));
        }), n;
    }
    function zy(t) {
        const e = {};
        return Object.keys(t).forEach((s)=>{
            var n;
            s.includes(":") ? e[s] = t[s] : (n = t[s].chains) == null || n.forEach((r)=>{
                e[r] = {
                    methods: t[s].methods,
                    events: t[s].events
                };
            });
        }), e;
    }
    function yl(t) {
        return [
            ...new Set(t.map((e)=>e.includes(":") ? e.split(":")[0] : e))
        ];
    }
    function Gy(t) {
        const e = {};
        return Object.keys(t).forEach((s)=>{
            s.includes(":") ? e[s] = t[s] : rr(t[s].accounts)?.forEach((r)=>{
                e[r] = {
                    accounts: t[s].accounts.filter((i)=>i.includes(`${r}:`)),
                    methods: t[s].methods,
                    events: t[s].events
                };
            });
        }), e;
    }
    function Yy(t, e) {
        return Ka(t, !1) && t <= e.max && t >= e.min;
    }
    function bl() {
        const t = zr();
        return new Promise((e)=>{
            switch(t){
                case _t.browser:
                    e(Jy());
                    break;
                case _t.reactNative:
                    e(Xy());
                    break;
                case _t.node:
                    e(Zy());
                    break;
                default:
                    e(!0);
            }
        });
    }
    function Jy() {
        return nr() && navigator?.onLine;
    }
    async function Xy() {
        return Js() && typeof globalThis < "u" && globalThis != null && globalThis.NetInfo ? (await globalThis?.NetInfo.fetch())?.isConnected : !0;
    }
    function Zy() {
        return !0;
    }
    function Qy(t) {
        switch(zr()){
            case _t.browser:
                eb(t);
                break;
            case _t.reactNative:
                tb(t);
                break;
        }
    }
    function eb(t) {
        !Js() && nr() && (window.addEventListener("online", ()=>t(!0)), window.addEventListener("offline", ()=>t(!1)));
    }
    function tb(t) {
        Js() && typeof globalThis < "u" && globalThis != null && globalThis.NetInfo && globalThis?.NetInfo.addEventListener((e)=>t(e?.isConnected));
    }
    function sb() {
        var t;
        return nr() && _s.getDocument() ? ((t = _s.getDocument()) == null ? void 0 : t.visibilityState) === "visible" : !0;
    }
    const No = {};
    class dr {
        static get(e) {
            return No[e];
        }
        static set(e, s) {
            No[e] = s;
        }
        static delete(e) {
            delete No[e];
        }
    }
    function nb(t) {
        const e = tr.decode(t);
        if (e.length < 33) throw new Error("Too short to contain a public key");
        return e.slice(1, 33);
    }
    function rb({ publicKey: t, signature: e, payload: s }) {
        var n;
        const r = la(s.method), i = 128 | parseInt(((n = s.version) == null ? void 0 : n.toString()) || "4"), o = ab(s.address), a = s.era === "00" ? new Uint8Array([
            0
        ]) : la(s.era);
        if (a.length !== 1 && a.length !== 2) throw new Error("Invalid era length");
        const c = parseInt(s.nonce, 16), l = new Uint8Array([
            c & 255,
            c >> 8 & 255
        ]), d = BigInt(`0x${ob(s.tip)}`), h = lb(d), u = new Uint8Array([
            0,
            ...t,
            o,
            ...e,
            ...a,
            ...l,
            ...h,
            ...r
        ]), f = cb(u.length + 1);
        return new Uint8Array([
            ...f,
            i,
            ...u
        ]);
    }
    function ib(t) {
        const e = la(t), s = Gu.blake2b(e, void 0, 32);
        return "0x" + Buffer.from(s).toString("hex");
    }
    function la(t) {
        return new Uint8Array(t.replace(/^0x/, "").match(/.{1,2}/g).map((e)=>parseInt(e, 16)));
    }
    function ob(t) {
        return t.startsWith("0x") ? t.slice(2) : t;
    }
    function ab(t) {
        const e = tr.decode(t)[0];
        return e === 42 ? 0 : e === 60 ? 2 : 1;
    }
    function cb(t) {
        if (t < 64) return new Uint8Array([
            t << 2
        ]);
        if (t < 16384) {
            const e = t << 2 | 1;
            return new Uint8Array([
                e & 255,
                e >> 8 & 255
            ]);
        } else if (t < 1 << 30) {
            const e = t << 2 | 2;
            return new Uint8Array([
                e & 255,
                e >> 8 & 255,
                e >> 16 & 255,
                e >> 24 & 255
            ]);
        } else throw new Error("Compact encoding > 2^30 not supported");
    }
    function lb(t) {
        if (t < BigInt(1) << BigInt(6)) return new Uint8Array([
            Number(t << BigInt(2))
        ]);
        if (t < BigInt(1) << BigInt(14)) {
            const e = t << BigInt(2) | BigInt(1);
            return new Uint8Array([
                Number(e & BigInt(255)),
                Number(e >> BigInt(8) & BigInt(255))
            ]);
        } else if (t < BigInt(1) << BigInt(30)) {
            const e = t << BigInt(2) | BigInt(2);
            return new Uint8Array([
                Number(e & BigInt(255)),
                Number(e >> BigInt(8) & BigInt(255)),
                Number(e >> BigInt(16) & BigInt(255)),
                Number(e >> BigInt(24) & BigInt(255))
            ]);
        } else throw new Error("BigInt compact encoding not supported > 2^30");
    }
    function db(t) {
        const e = Uint8Array.from(Buffer.from(t.signature, "hex")), s = nb(t.transaction.address), n = rb({
            publicKey: s,
            signature: e,
            payload: t.transaction
        }), r = Buffer.from(n).toString("hex");
        return ib(r);
    }
    var hb = {};
    const Yh = "wc", Jh = 2, da = "core", ds = `${Yh}@2:${da}:`, ub = {
        logger: "error"
    }, pb = {
        database: ":memory:"
    }, fb = "crypto", Cl = "client_ed25519_seed", gb = W.ONE_DAY, mb = "keychain", wb = "0.3", yb = "messages", bb = "0.3", Cb = W.SIX_HOURS, Eb = "publisher", Xh = "irn", vb = "error", Zh = "wss://relay.walletconnect.org", Ab = "relayer", De = {
        message: "relayer_message",
        message_ack: "relayer_message_ack",
        connect: "relayer_connect",
        disconnect: "relayer_disconnect",
        error: "relayer_error",
        connection_stalled: "relayer_connection_stalled",
        transport_closed: "relayer_transport_closed",
        publish: "relayer_publish"
    }, Ib = "_subscription", Tt = {
        payload: "payload",
        connect: "connect",
        disconnect: "disconnect",
        error: "error"
    }, Nb = .1, ha = "2.21.9", ke = {
        link_mode: "link_mode",
        relay: "relay"
    }, Ci = {
        inbound: "inbound",
        outbound: "outbound"
    }, _b = "0.3", Sb = "WALLETCONNECT_CLIENT_ID", El = "WALLETCONNECT_LINK_MODE_APPS", At = {
        created: "subscription_created",
        deleted: "subscription_deleted",
        expired: "subscription_expired",
        disabled: "subscription_disabled",
        sync: "subscription_sync",
        resubscribed: "subscription_resubscribed"
    }, Tb = "subscription", kb = "0.3", Ob = "pairing", Pb = "0.3", hr = {
        wc_pairingDelete: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1e3
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1001
            }
        },
        wc_pairingPing: {
            req: {
                ttl: W.THIRTY_SECONDS,
                prompt: !1,
                tag: 1002
            },
            res: {
                ttl: W.THIRTY_SECONDS,
                prompt: !1,
                tag: 1003
            }
        },
        unregistered_method: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 0
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 0
            }
        }
    }, an = {
        create: "pairing_create",
        expire: "pairing_expire",
        delete: "pairing_delete",
        ping: "pairing_ping"
    }, Wt = {
        created: "history_created",
        updated: "history_updated",
        deleted: "history_deleted",
        sync: "history_sync"
    }, Rb = "history", xb = "0.3", $b = "expirer", xt = {
        created: "expirer_created",
        deleted: "expirer_deleted",
        expired: "expirer_expired",
        sync: "expirer_sync"
    }, Ub = "0.3", Db = "verify-api", Lb = "https://verify.walletconnect.com", Qh = "https://verify.walletconnect.org", Tr = Qh, Mb = `${Tr}/v3`, Bb = [
        Lb,
        Qh
    ], Fb = "echo", jb = "https://echo.walletconnect.com", Qt = {
        pairing_started: "pairing_started",
        pairing_uri_validation_success: "pairing_uri_validation_success",
        pairing_uri_not_expired: "pairing_uri_not_expired",
        store_new_pairing: "store_new_pairing",
        subscribing_pairing_topic: "subscribing_pairing_topic",
        subscribe_pairing_topic_success: "subscribe_pairing_topic_success",
        existing_pairing: "existing_pairing",
        pairing_not_expired: "pairing_not_expired",
        emit_inactive_pairing: "emit_inactive_pairing",
        emit_session_proposal: "emit_session_proposal",
        subscribing_to_pairing_topic: "subscribing_to_pairing_topic"
    }, gs = {
        no_wss_connection: "no_wss_connection",
        no_internet_connection: "no_internet_connection",
        malformed_pairing_uri: "malformed_pairing_uri",
        active_pairing_already_exists: "active_pairing_already_exists",
        subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure",
        pairing_expired: "pairing_expired",
        proposal_expired: "proposal_expired",
        proposal_listener_not_found: "proposal_listener_not_found"
    }, Ms = {
        session_approve_started: "session_approve_started",
        proposal_not_expired: "proposal_not_expired",
        session_namespaces_validation_success: "session_namespaces_validation_success",
        create_session_topic: "create_session_topic",
        subscribing_session_topic: "subscribing_session_topic",
        subscribe_session_topic_success: "subscribe_session_topic_success",
        publishing_session_approve: "publishing_session_approve",
        session_approve_publish_success: "session_approve_publish_success",
        store_session: "store_session",
        publishing_session_settle: "publishing_session_settle",
        session_settle_publish_success: "session_settle_publish_success"
    }, ur = {
        no_internet_connection: "no_internet_connection",
        no_wss_connection: "no_wss_connection",
        proposal_expired: "proposal_expired",
        subscribe_session_topic_failure: "subscribe_session_topic_failure",
        session_approve_publish_failure: "session_approve_publish_failure",
        session_settle_publish_failure: "session_settle_publish_failure",
        session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure",
        proposal_not_found: "proposal_not_found"
    }, en = {
        authenticated_session_approve_started: "authenticated_session_approve_started",
        create_authenticated_session_topic: "create_authenticated_session_topic",
        cacaos_verified: "cacaos_verified",
        store_authenticated_session: "store_authenticated_session",
        subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic",
        subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success",
        publishing_authenticated_session_approve: "publishing_authenticated_session_approve"
    }, pr = {
        no_internet_connection: "no_internet_connection",
        invalid_cacao: "invalid_cacao",
        subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure",
        authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure",
        authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found"
    }, Wb = .1, qb = "event-client", Hb = 86400, Vb = "https://pulse.walletconnect.org/batch";
    function Kb(t, e) {
        if (t.length >= 255) throw new TypeError("Alphabet too long");
        for(var s = new Uint8Array(256), n = 0; n < s.length; n++)s[n] = 255;
        for(var r = 0; r < t.length; r++){
            var i = t.charAt(r), o = i.charCodeAt(0);
            if (s[o] !== 255) throw new TypeError(i + " is ambiguous");
            s[o] = r;
        }
        var a = t.length, c = t.charAt(0), l = Math.log(a) / Math.log(256), d = Math.log(256) / Math.log(a);
        function h(g) {
            if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
            if (g.length === 0) return "";
            for(var w = 0, m = 0, A = 0, v = g.length; A !== v && g[A] === 0;)A++, w++;
            for(var P = (v - A) * d + 1 >>> 0, j = new Uint8Array(P); A !== v;){
                for(var G = g[A], b = 0, R = P - 1; (G !== 0 || b < m) && R !== -1; R--, b++)G += 256 * j[R] >>> 0, j[R] = G % a >>> 0, G = G / a >>> 0;
                if (G !== 0) throw new Error("Non-zero carry");
                m = b, A++;
            }
            for(var U = P - m; U !== P && j[U] === 0;)U++;
            for(var N = c.repeat(w); U < P; ++U)N += t.charAt(j[U]);
            return N;
        }
        function u(g) {
            if (typeof g != "string") throw new TypeError("Expected String");
            if (g.length === 0) return new Uint8Array;
            var w = 0;
            if (g[w] !== " ") {
                for(var m = 0, A = 0; g[w] === c;)m++, w++;
                for(var v = (g.length - w) * l + 1 >>> 0, P = new Uint8Array(v); g[w];){
                    var j = s[g.charCodeAt(w)];
                    if (j === 255) return;
                    for(var G = 0, b = v - 1; (j !== 0 || G < A) && b !== -1; b--, G++)j += a * P[b] >>> 0, P[b] = j % 256 >>> 0, j = j / 256 >>> 0;
                    if (j !== 0) throw new Error("Non-zero carry");
                    A = G, w++;
                }
                if (g[w] !== " ") {
                    for(var R = v - A; R !== v && P[R] === 0;)R++;
                    for(var U = new Uint8Array(m + (v - R)), N = m; R !== v;)U[N++] = P[R++];
                    return U;
                }
            }
        }
        function f(g) {
            var w = u(g);
            if (w) return w;
            throw new Error(`Non-${e} character`);
        }
        return {
            encode: h,
            decodeUnsafe: u,
            decode: f
        };
    }
    var zb = Kb, Gb = zb;
    const eu = (t)=>{
        if (t instanceof Uint8Array && t.constructor.name === "Uint8Array") return t;
        if (t instanceof ArrayBuffer) return new Uint8Array(t);
        if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
        throw new Error("Unknown type, must be binary type");
    }, Yb = (t)=>new TextEncoder().encode(t), Jb = (t)=>new TextDecoder().decode(t);
    class Xb {
        constructor(e, s, n){
            this.name = e, this.prefix = s, this.baseEncode = n;
        }
        encode(e) {
            if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
            throw Error("Unknown type, must be binary type");
        }
    }
    class Zb {
        constructor(e, s, n){
            if (this.name = e, this.prefix = s, s.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
            this.prefixCodePoint = s.codePointAt(0), this.baseDecode = n;
        }
        decode(e) {
            if (typeof e == "string") {
                if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
                return this.baseDecode(e.slice(this.prefix.length));
            } else throw Error("Can only multibase decode strings");
        }
        or(e) {
            return tu(this, e);
        }
    }
    class Qb {
        constructor(e){
            this.decoders = e;
        }
        or(e) {
            return tu(this, e);
        }
        decode(e) {
            const s = e[0], n = this.decoders[s];
            if (n) return n.decode(e);
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
    }
    const tu = (t, e)=>new Qb({
            ...t.decoders || {
                [t.prefix]: t
            },
            ...e.decoders || {
                [e.prefix]: e
            }
        });
    class e0 {
        constructor(e, s, n, r){
            this.name = e, this.prefix = s, this.baseEncode = n, this.baseDecode = r, this.encoder = new Xb(e, s, n), this.decoder = new Zb(e, s, r);
        }
        encode(e) {
            return this.encoder.encode(e);
        }
        decode(e) {
            return this.decoder.decode(e);
        }
    }
    const to = ({ name: t, prefix: e, encode: s, decode: n })=>new e0(t, e, s, n), Zr = ({ prefix: t, name: e, alphabet: s })=>{
        const { encode: n, decode: r } = Gb(s, e);
        return to({
            prefix: t,
            name: e,
            encode: n,
            decode: (i)=>eu(r(i))
        });
    }, t0 = (t, e, s, n)=>{
        const r = {};
        for(let d = 0; d < e.length; ++d)r[e[d]] = d;
        let i = t.length;
        for(; t[i - 1] === "=";)--i;
        const o = new Uint8Array(i * s / 8 | 0);
        let a = 0, c = 0, l = 0;
        for(let d = 0; d < i; ++d){
            const h = r[t[d]];
            if (h === void 0) throw new SyntaxError(`Non-${n} character`);
            c = c << s | h, a += s, a >= 8 && (a -= 8, o[l++] = 255 & c >> a);
        }
        if (a >= s || 255 & c << 8 - a) throw new SyntaxError("Unexpected end of data");
        return o;
    }, s0 = (t, e, s)=>{
        const n = e[e.length - 1] === "=", r = (1 << s) - 1;
        let i = "", o = 0, a = 0;
        for(let c = 0; c < t.length; ++c)for(a = a << 8 | t[c], o += 8; o > s;)o -= s, i += e[r & a >> o];
        if (o && (i += e[r & a << s - o]), n) for(; i.length * s & 7;)i += "=";
        return i;
    }, Ze = ({ name: t, prefix: e, bitsPerChar: s, alphabet: n })=>to({
            prefix: e,
            name: t,
            encode (r) {
                return s0(r, n, s);
            },
            decode (r) {
                return t0(r, n, s, t);
            }
        }), n0 = to({
        prefix: "\0",
        name: "identity",
        encode: (t)=>Jb(t),
        decode: (t)=>Yb(t)
    });
    var r0 = Object.freeze({
        __proto__: null,
        identity: n0
    });
    const i0 = Ze({
        prefix: "0",
        name: "base2",
        alphabet: "01",
        bitsPerChar: 1
    });
    var o0 = Object.freeze({
        __proto__: null,
        base2: i0
    });
    const a0 = Ze({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3
    });
    var c0 = Object.freeze({
        __proto__: null,
        base8: a0
    });
    const l0 = Zr({
        prefix: "9",
        name: "base10",
        alphabet: "0123456789"
    });
    var d0 = Object.freeze({
        __proto__: null,
        base10: l0
    });
    const h0 = Ze({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4
    }), u0 = Ze({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4
    });
    var p0 = Object.freeze({
        __proto__: null,
        base16: h0,
        base16upper: u0
    });
    const f0 = Ze({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5
    }), g0 = Ze({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5
    }), m0 = Ze({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5
    }), w0 = Ze({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5
    }), y0 = Ze({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5
    }), b0 = Ze({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5
    }), C0 = Ze({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5
    }), E0 = Ze({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5
    }), v0 = Ze({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5
    });
    var A0 = Object.freeze({
        __proto__: null,
        base32: f0,
        base32upper: g0,
        base32pad: m0,
        base32padupper: w0,
        base32hex: y0,
        base32hexupper: b0,
        base32hexpad: C0,
        base32hexpadupper: E0,
        base32z: v0
    });
    const I0 = Zr({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
    }), N0 = Zr({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
    var _0 = Object.freeze({
        __proto__: null,
        base36: I0,
        base36upper: N0
    });
    const S0 = Zr({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    }), T0 = Zr({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    });
    var k0 = Object.freeze({
        __proto__: null,
        base58btc: S0,
        base58flickr: T0
    });
    const O0 = Ze({
        prefix: "m",
        name: "base64",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6
    }), P0 = Ze({
        prefix: "M",
        name: "base64pad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6
    }), R0 = Ze({
        prefix: "u",
        name: "base64url",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6
    }), x0 = Ze({
        prefix: "U",
        name: "base64urlpad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6
    });
    var $0 = Object.freeze({
        __proto__: null,
        base64: O0,
        base64pad: P0,
        base64url: R0,
        base64urlpad: x0
    });
    const su = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), U0 = su.reduce((t, e, s)=>(t[s] = e, t), []), D0 = su.reduce((t, e, s)=>(t[e.codePointAt(0)] = s, t), []);
    function L0(t) {
        return t.reduce((e, s)=>(e += U0[s], e), "");
    }
    function M0(t) {
        const e = [];
        for (const s of t){
            const n = D0[s.codePointAt(0)];
            if (n === void 0) throw new Error(`Non-base256emoji character: ${s}`);
            e.push(n);
        }
        return new Uint8Array(e);
    }
    const B0 = to({
        prefix: "🚀",
        name: "base256emoji",
        encode: L0,
        decode: M0
    });
    var F0 = Object.freeze({
        __proto__: null,
        base256emoji: B0
    }), j0 = nu, vl = 128, W0 = -128, q0 = Math.pow(2, 31);
    function nu(t, e, s) {
        e = e || [], s = s || 0;
        for(var n = s; t >= q0;)e[s++] = t & 255 | vl, t /= 128;
        for(; t & W0;)e[s++] = t & 255 | vl, t >>>= 7;
        return e[s] = t | 0, nu.bytes = s - n + 1, e;
    }
    var H0 = ua, V0 = 128, Al = 127;
    function ua(t, n) {
        var s = 0, n = n || 0, r = 0, i = n, o, a = t.length;
        do {
            if (i >= a) throw ua.bytes = 0, new RangeError("Could not decode varint");
            o = t[i++], s += r < 28 ? (o & Al) << r : (o & Al) * Math.pow(2, r), r += 7;
        }while (o >= V0);
        return ua.bytes = i - n, s;
    }
    var K0 = Math.pow(2, 7), z0 = Math.pow(2, 14), G0 = Math.pow(2, 21), Y0 = Math.pow(2, 28), J0 = Math.pow(2, 35), X0 = Math.pow(2, 42), Z0 = Math.pow(2, 49), Q0 = Math.pow(2, 56), eC = Math.pow(2, 63), tC = function(t) {
        return t < K0 ? 1 : t < z0 ? 2 : t < G0 ? 3 : t < Y0 ? 4 : t < J0 ? 5 : t < X0 ? 6 : t < Z0 ? 7 : t < Q0 ? 8 : t < eC ? 9 : 10;
    }, sC = {
        encode: j0,
        decode: H0,
        encodingLength: tC
    }, ru = sC;
    const Il = (t, e, s = 0)=>(ru.encode(t, e, s), e), Nl = (t)=>ru.encodingLength(t), pa = (t, e)=>{
        const s = e.byteLength, n = Nl(t), r = n + Nl(s), i = new Uint8Array(r + s);
        return Il(t, i, 0), Il(s, i, n), i.set(e, r), new nC(t, s, e, i);
    };
    class nC {
        constructor(e, s, n, r){
            this.code = e, this.size = s, this.digest = n, this.bytes = r;
        }
    }
    const iu = ({ name: t, code: e, encode: s })=>new rC(t, e, s);
    class rC {
        constructor(e, s, n){
            this.name = e, this.code = s, this.encode = n;
        }
        digest(e) {
            if (e instanceof Uint8Array) {
                const s = this.encode(e);
                return s instanceof Uint8Array ? pa(this.code, s) : s.then((n)=>pa(this.code, n));
            } else throw Error("Unknown type, must be binary type");
        }
    }
    const ou = (t)=>async (e)=>new Uint8Array(await crypto.subtle.digest(t, e)), iC = iu({
        name: "sha2-256",
        code: 18,
        encode: ou("SHA-256")
    }), oC = iu({
        name: "sha2-512",
        code: 19,
        encode: ou("SHA-512")
    });
    var aC = Object.freeze({
        __proto__: null,
        sha256: iC,
        sha512: oC
    });
    const au = 0, cC = "identity", cu = eu, lC = (t)=>pa(au, cu(t)), dC = {
        code: au,
        name: cC,
        encode: cu,
        digest: lC
    };
    var hC = Object.freeze({
        __proto__: null,
        identity: dC
    });
    new TextEncoder, new TextDecoder;
    const _l = {
        ...r0,
        ...o0,
        ...c0,
        ...d0,
        ...p0,
        ...A0,
        ..._0,
        ...k0,
        ...$0,
        ...F0
    };
    ({
        ...aC,
        ...hC
    });
    function lu(t) {
        return globalThis.Buffer != null ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
    }
    function uC(t = 0) {
        return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? lu(globalThis.Buffer.allocUnsafe(t)) : new Uint8Array(t);
    }
    function du(t, e, s, n) {
        return {
            name: t,
            prefix: e,
            encoder: {
                name: t,
                prefix: e,
                encode: s
            },
            decoder: {
                decode: n
            }
        };
    }
    const Sl = du("utf8", "u", (t)=>"u" + new TextDecoder("utf8").decode(t), (t)=>new TextEncoder().encode(t.substring(1))), _o = du("ascii", "a", (t)=>{
        let e = "a";
        for(let s = 0; s < t.length; s++)e += String.fromCharCode(t[s]);
        return e;
    }, (t)=>{
        t = t.substring(1);
        const e = uC(t.length);
        for(let s = 0; s < t.length; s++)e[s] = t.charCodeAt(s);
        return e;
    }), pC = {
        utf8: Sl,
        "utf-8": Sl,
        hex: _l.base16,
        latin1: _o,
        ascii: _o,
        binary: _o,
        ..._l
    };
    function fC(t, e = "utf8") {
        const s = pC[e];
        if (!s) throw new Error(`Unsupported encoding "${e}"`);
        return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? lu(globalThis.Buffer.from(t, "utf-8")) : s.decoder.decode(`${s.prefix}${t}`);
    }
    var gC = Object.defineProperty, mC = (t, e, s)=>e in t ? gC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Xt = (t, e, s)=>mC(t, typeof e != "symbol" ? e + "" : e, s);
    class wC {
        constructor(e, s){
            this.core = e, this.logger = s, Xt(this, "keychain", new Map), Xt(this, "name", mb), Xt(this, "version", wb), Xt(this, "initialized", !1), Xt(this, "storagePrefix", ds), Xt(this, "init", async ()=>{
                if (!this.initialized) {
                    const n = await this.getKeyChain();
                    typeof n < "u" && (this.keychain = n), this.initialized = !0;
                }
            }), Xt(this, "has", (n)=>(this.isInitialized(), this.keychain.has(n))), Xt(this, "set", async (n, r)=>{
                this.isInitialized(), this.keychain.set(n, r), await this.persist();
            }), Xt(this, "get", (n)=>{
                this.isInitialized();
                const r = this.keychain.get(n);
                if (typeof r > "u") {
                    const { message: i } = F("NO_MATCHING_KEY", `${this.name}: ${n}`);
                    throw new Error(i);
                }
                return r;
            }), Xt(this, "del", async (n)=>{
                this.isInitialized(), this.keychain.delete(n), await this.persist();
            }), this.core = e, this.logger = ct(s, this.name);
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
        }
        async setKeyChain(e) {
            await this.core.storage.setItem(this.storageKey, Jo(e));
        }
        async getKeyChain() {
            const e = await this.core.storage.getItem(this.storageKey);
            return typeof e < "u" ? Xo(e) : void 0;
        }
        async persist() {
            await this.setKeyChain(this.keychain);
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var yC = Object.defineProperty, bC = (t, e, s)=>e in t ? yC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Ke = (t, e, s)=>bC(t, typeof e != "symbol" ? e + "" : e, s);
    class CC {
        constructor(e, s, n){
            this.core = e, this.logger = s, Ke(this, "name", fb), Ke(this, "keychain"), Ke(this, "randomSessionIdentifier", ca()), Ke(this, "initialized", !1), Ke(this, "init", async ()=>{
                this.initialized || (await this.keychain.init(), this.initialized = !0);
            }), Ke(this, "hasKeys", (r)=>(this.isInitialized(), this.keychain.has(r))), Ke(this, "getClientId", async ()=>{
                this.isInitialized();
                const r = await this.getClientSeed(), i = ic(r);
                return Zu(i.publicKey);
            }), Ke(this, "generateKeyPair", ()=>{
                this.isInitialized();
                const r = Gw();
                return this.setPrivateKey(r.publicKey, r.privateKey);
            }), Ke(this, "signJWT", async (r)=>{
                this.isInitialized();
                const i = await this.getClientSeed(), o = ic(i), a = this.randomSessionIdentifier;
                return await Qu(a, r, gb, o);
            }), Ke(this, "generateSharedKey", (r, i, o)=>{
                this.isInitialized();
                const a = this.getPrivateKey(r), c = Yw(a, i);
                return this.setSymKey(c, o);
            }), Ke(this, "setSymKey", async (r, i)=>{
                this.isInitialized();
                const o = i || bi(r);
                return await this.keychain.set(o, r), o;
            }), Ke(this, "deleteKeyPair", async (r)=>{
                this.isInitialized(), await this.keychain.del(r);
            }), Ke(this, "deleteSymKey", async (r)=>{
                this.isInitialized(), await this.keychain.del(r);
            }), Ke(this, "encode", async (r, i, o)=>{
                this.isInitialized();
                const a = Kh(o), c = Fo(i);
                if (ol(a)) return Zw(c, o?.encoding);
                if (il(a)) {
                    const u = a.senderPublicKey, f = a.receiverPublicKey;
                    r = await this.generateSharedKey(u, f);
                }
                const l = this.getSymKey(r), { type: d, senderPublicKey: h } = a;
                return Jw({
                    type: d,
                    symKey: l,
                    message: c,
                    senderPublicKey: h,
                    encoding: o?.encoding
                });
            }), Ke(this, "decode", async (r, i, o)=>{
                this.isInitialized();
                const a = ey(i, o);
                if (ol(a)) {
                    const c = Qw(i, o?.encoding);
                    return oc(c);
                }
                if (il(a)) {
                    const c = a.receiverPublicKey, l = a.senderPublicKey;
                    r = await this.generateSharedKey(c, l);
                }
                try {
                    const c = this.getSymKey(r), l = Xw({
                        symKey: c,
                        encoded: i,
                        encoding: o?.encoding
                    });
                    return oc(l);
                } catch (c) {
                    this.logger.error(`Failed to decode message from topic: '${r}', clientId: '${await this.getClientId()}'`), this.logger.error(c);
                }
            }), Ke(this, "getPayloadType", (r, i = mt)=>{
                const o = Dr({
                    encoded: r,
                    encoding: i
                });
                return Cn(o.type);
            }), Ke(this, "getPayloadSenderPublicKey", (r, i = mt)=>{
                const o = Dr({
                    encoded: r,
                    encoding: i
                });
                return o.senderPublicKey ? yt(o.senderPublicKey, at) : void 0;
            }), this.core = e, this.logger = ct(s, this.name), this.keychain = n || new wC(this.core, this.logger);
        }
        get context() {
            return bt(this.logger);
        }
        async setPrivateKey(e, s) {
            return await this.keychain.set(e, s), e;
        }
        getPrivateKey(e) {
            return this.keychain.get(e);
        }
        async getClientSeed() {
            let e = "";
            try {
                e = this.keychain.get(Cl);
            } catch  {
                e = ca(), await this.keychain.set(Cl, e);
            }
            return fC(e, "base16");
        }
        getSymKey(e) {
            return this.keychain.get(e);
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var EC = Object.defineProperty, vC = Object.defineProperties, AC = Object.getOwnPropertyDescriptors, Tl = Object.getOwnPropertySymbols, IC = Object.prototype.hasOwnProperty, NC = Object.prototype.propertyIsEnumerable, fa = (t, e, s)=>e in t ? EC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, _C = (t, e)=>{
        for(var s in e || (e = {}))IC.call(e, s) && fa(t, s, e[s]);
        if (Tl) for (var s of Tl(e))NC.call(e, s) && fa(t, s, e[s]);
        return t;
    }, SC = (t, e)=>vC(t, AC(e)), Et = (t, e, s)=>fa(t, typeof e != "symbol" ? e + "" : e, s);
    class TC extends Pf {
        constructor(e, s){
            super(e, s), this.logger = e, this.core = s, Et(this, "messages", new Map), Et(this, "messagesWithoutClientAck", new Map), Et(this, "name", yb), Et(this, "version", bb), Et(this, "initialized", !1), Et(this, "storagePrefix", ds), Et(this, "init", async ()=>{
                if (!this.initialized) {
                    this.logger.trace("Initialized");
                    try {
                        const n = await this.getRelayerMessages();
                        typeof n < "u" && (this.messages = n);
                        const r = await this.getRelayerMessagesWithoutClientAck();
                        typeof r < "u" && (this.messagesWithoutClientAck = r), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
                            type: "method",
                            method: "restore",
                            size: this.messages.size
                        });
                    } catch (n) {
                        this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(n);
                    } finally{
                        this.initialized = !0;
                    }
                }
            }), Et(this, "set", async (n, r, i)=>{
                this.isInitialized();
                const o = $t(r);
                let a = this.messages.get(n);
                if (typeof a > "u" && (a = {}), typeof a[o] < "u") return o;
                if (a[o] = r, this.messages.set(n, a), i === Ci.inbound) {
                    const c = this.messagesWithoutClientAck.get(n) || {};
                    this.messagesWithoutClientAck.set(n, SC(_C({}, c), {
                        [o]: r
                    }));
                }
                return await this.persist(), o;
            }), Et(this, "get", (n)=>{
                this.isInitialized();
                let r = this.messages.get(n);
                return typeof r > "u" && (r = {}), r;
            }), Et(this, "getWithoutAck", (n)=>{
                this.isInitialized();
                const r = {};
                for (const i of n){
                    const o = this.messagesWithoutClientAck.get(i) || {};
                    r[i] = Object.values(o);
                }
                return r;
            }), Et(this, "has", (n, r)=>{
                this.isInitialized();
                const i = this.get(n), o = $t(r);
                return typeof i[o] < "u";
            }), Et(this, "ack", async (n, r)=>{
                this.isInitialized();
                const i = this.messagesWithoutClientAck.get(n);
                if (typeof i > "u") return;
                const o = $t(r);
                delete i[o], Object.keys(i).length === 0 ? this.messagesWithoutClientAck.delete(n) : this.messagesWithoutClientAck.set(n, i), await this.persist();
            }), Et(this, "del", async (n)=>{
                this.isInitialized(), this.messages.delete(n), this.messagesWithoutClientAck.delete(n), await this.persist();
            }), this.logger = ct(e, this.name), this.core = s;
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
        }
        get storageKeyWithoutClientAck() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name + "_withoutClientAck";
        }
        async setRelayerMessages(e) {
            await this.core.storage.setItem(this.storageKey, Jo(e));
        }
        async setRelayerMessagesWithoutClientAck(e) {
            await this.core.storage.setItem(this.storageKeyWithoutClientAck, Jo(e));
        }
        async getRelayerMessages() {
            const e = await this.core.storage.getItem(this.storageKey);
            return typeof e < "u" ? Xo(e) : void 0;
        }
        async getRelayerMessagesWithoutClientAck() {
            const e = await this.core.storage.getItem(this.storageKeyWithoutClientAck);
            return typeof e < "u" ? Xo(e) : void 0;
        }
        async persist() {
            await this.setRelayerMessages(this.messages), await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var kC = Object.defineProperty, OC = Object.defineProperties, PC = Object.getOwnPropertyDescriptors, kl = Object.getOwnPropertySymbols, RC = Object.prototype.hasOwnProperty, xC = Object.prototype.propertyIsEnumerable, ga = (t, e, s)=>e in t ? kC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Rn = (t, e)=>{
        for(var s in e || (e = {}))RC.call(e, s) && ga(t, s, e[s]);
        if (kl) for (var s of kl(e))xC.call(e, s) && ga(t, s, e[s]);
        return t;
    }, Ol = (t, e)=>OC(t, PC(e)), kt = (t, e, s)=>ga(t, typeof e != "symbol" ? e + "" : e, s);
    class $C extends Rf {
        constructor(e, s){
            super(e, s), this.relayer = e, this.logger = s, kt(this, "events", new vn.EventEmitter), kt(this, "name", Eb), kt(this, "queue", new Map), kt(this, "publishTimeout", W.toMiliseconds(W.ONE_MINUTE)), kt(this, "initialPublishTimeout", W.toMiliseconds(W.ONE_SECOND * 15)), kt(this, "needsTransportRestart", !1), kt(this, "publish", async (n, r, i)=>{
                var o, a, c, l, d;
                this.logger.debug("Publishing Payload"), this.logger.trace({
                    type: "method",
                    method: "publish",
                    params: {
                        topic: n,
                        message: r,
                        opts: i
                    }
                });
                const h = i?.ttl || Cb, u = i?.prompt || !1, f = i?.tag || 0, g = i?.id || dn().toString(), w = jn(Bi().protocol), m = {
                    id: g,
                    method: i?.publishMethod || w.publish,
                    params: Rn({
                        topic: n,
                        message: r,
                        ttl: h,
                        prompt: u,
                        tag: f,
                        attestation: i?.attestation
                    }, i?.tvf)
                }, A = `Failed to publish payload, please try again. id:${g} tag:${f}`;
                try {
                    We((o = m.params) == null ? void 0 : o.prompt) && ((a = m.params) == null || delete a.prompt), We((c = m.params) == null ? void 0 : c.tag) && ((l = m.params) == null || delete l.tag);
                    const v = new Promise(async (P)=>{
                        const j = ({ id: b })=>{
                            var R;
                            ((R = m.id) == null ? void 0 : R.toString()) === b.toString() && (this.removeRequestFromQueue(b), this.relayer.events.removeListener(De.publish, j), P());
                        };
                        this.relayer.events.on(De.publish, j);
                        const G = is(new Promise((b, R)=>{
                            this.rpcPublish(m, i).then(b).catch((U)=>{
                                this.logger.warn(U, U?.message), R(U);
                            });
                        }), this.initialPublishTimeout, `Failed initial publish, retrying.... id:${g} tag:${f}`);
                        try {
                            await G, this.events.removeListener(De.publish, j);
                        } catch (b) {
                            this.queue.set(g, {
                                request: m,
                                opts: i,
                                attempt: 1
                            }), this.logger.warn(b, b?.message);
                        }
                    });
                    this.logger.trace({
                        type: "method",
                        method: "publish",
                        params: {
                            id: g,
                            topic: n,
                            message: r,
                            opts: i
                        }
                    }), await is(v, this.publishTimeout, A);
                } catch (v) {
                    if (this.logger.debug("Failed to Publish Payload"), this.logger.error(v), (d = i?.internal) != null && d.throwOnFailedPublish) throw v;
                } finally{
                    this.queue.delete(g);
                }
            }), kt(this, "publishCustom", async (n)=>{
                var r, i, o, a, c;
                this.logger.debug("Publishing custom payload"), this.logger.trace({
                    type: "method",
                    method: "publishCustom",
                    params: n
                });
                const { payload: l, opts: d = {} } = n, { attestation: h, tvf: u, publishMethod: f, prompt: g, tag: w, ttl: m = W.FIVE_MINUTES } = d, A = d.id || dn().toString(), v = jn(Bi().protocol), P = f || v.publish, j = {
                    id: A,
                    method: P,
                    params: Rn(Ol(Rn({}, l), {
                        ttl: m,
                        prompt: g,
                        tag: w,
                        attestation: h
                    }), u)
                }, G = `Failed to publish custom payload, please try again. id:${A} tag:${w}`;
                try {
                    We((r = j.params) == null ? void 0 : r.prompt) && ((i = j.params) == null || delete i.prompt), We((o = j.params) == null ? void 0 : o.tag) && ((a = j.params) == null || delete a.tag);
                    const b = new Promise(async (R)=>{
                        const U = ({ id: M })=>{
                            var Y;
                            ((Y = j.id) == null ? void 0 : Y.toString()) === M.toString() && (this.removeRequestFromQueue(M), this.relayer.events.removeListener(De.publish, U), R());
                        };
                        this.relayer.events.on(De.publish, U);
                        const N = is(new Promise((M, Y)=>{
                            this.rpcPublish(j, d).then(M).catch((O)=>{
                                this.logger.warn(O, O?.message), Y(O);
                            });
                        }), this.initialPublishTimeout, `Failed initial custom payload publish, retrying.... method:${P} id:${A} tag:${w}`);
                        try {
                            await N, this.events.removeListener(De.publish, U);
                        } catch (M) {
                            this.queue.set(A, {
                                request: j,
                                opts: d,
                                attempt: 1
                            }), this.logger.warn(M, M?.message);
                        }
                    });
                    this.logger.trace({
                        type: "method",
                        method: "publish",
                        params: {
                            id: A,
                            payload: l,
                            opts: d
                        }
                    }), await is(b, this.publishTimeout, G);
                } catch (b) {
                    if (this.logger.debug("Failed to Publish Payload"), this.logger.error(b), (c = d?.internal) != null && c.throwOnFailedPublish) throw b;
                } finally{
                    this.queue.delete(A);
                }
            }), kt(this, "on", (n, r)=>{
                this.events.on(n, r);
            }), kt(this, "once", (n, r)=>{
                this.events.once(n, r);
            }), kt(this, "off", (n, r)=>{
                this.events.off(n, r);
            }), kt(this, "removeListener", (n, r)=>{
                this.events.removeListener(n, r);
            }), this.relayer = e, this.logger = ct(s, this.name), this.registerEventListeners();
        }
        get context() {
            return bt(this.logger);
        }
        async rpcPublish(e, s) {
            this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
                type: "message",
                direction: "outgoing",
                request: e
            });
            const n = await this.relayer.request(e);
            return this.relayer.events.emit(De.publish, Rn(Rn({}, e), s)), this.logger.debug("Successfully Published Payload"), n;
        }
        removeRequestFromQueue(e) {
            this.queue.delete(e);
        }
        checkQueue() {
            this.queue.forEach(async (e, s)=>{
                var n;
                const r = e.attempt + 1;
                this.queue.set(s, Ol(Rn({}, e), {
                    attempt: r
                })), this.logger.warn({}, `Publisher: queue->publishing: ${e.request.id}, tag: ${(n = e.request.params) == null ? void 0 : n.tag}, attempt: ${r}`), await this.rpcPublish(e.request, e.opts), this.logger.warn({}, `Publisher: queue->published: ${e.request.id}`);
            });
        }
        registerEventListeners() {
            this.relayer.core.heartbeat.on(sr.pulse, ()=>{
                if (this.needsTransportRestart) {
                    this.needsTransportRestart = !1, this.relayer.events.emit(De.connection_stalled);
                    return;
                }
                this.checkQueue();
            }), this.relayer.on(De.message_ack, (e)=>{
                this.removeRequestFromQueue(e.id.toString());
            });
        }
    }
    var UC = Object.defineProperty, DC = (t, e, s)=>e in t ? UC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, xn = (t, e, s)=>DC(t, typeof e != "symbol" ? e + "" : e, s);
    class LC {
        constructor(){
            xn(this, "map", new Map), xn(this, "set", (e, s)=>{
                const n = this.get(e);
                this.exists(e, s) || this.map.set(e, [
                    ...n,
                    s
                ]);
            }), xn(this, "get", (e)=>this.map.get(e) || []), xn(this, "exists", (e, s)=>this.get(e).includes(s)), xn(this, "delete", (e, s)=>{
                if (typeof s > "u") {
                    this.map.delete(e);
                    return;
                }
                if (!this.map.has(e)) return;
                const n = this.get(e);
                if (!this.exists(e, s)) return;
                const r = n.filter((i)=>i !== s);
                if (!r.length) {
                    this.map.delete(e);
                    return;
                }
                this.map.set(e, r);
            }), xn(this, "clear", ()=>{
                this.map.clear();
            });
        }
        get topics() {
            return Array.from(this.map.keys());
        }
    }
    var MC = Object.defineProperty, BC = Object.defineProperties, FC = Object.getOwnPropertyDescriptors, Pl = Object.getOwnPropertySymbols, jC = Object.prototype.hasOwnProperty, WC = Object.prototype.propertyIsEnumerable, ma = (t, e, s)=>e in t ? MC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, fr = (t, e)=>{
        for(var s in e || (e = {}))jC.call(e, s) && ma(t, s, e[s]);
        if (Pl) for (var s of Pl(e))WC.call(e, s) && ma(t, s, e[s]);
        return t;
    }, So = (t, e)=>BC(t, FC(e)), _e = (t, e, s)=>ma(t, typeof e != "symbol" ? e + "" : e, s);
    class qC extends Uf {
        constructor(e, s){
            super(e, s), this.relayer = e, this.logger = s, _e(this, "subscriptions", new Map), _e(this, "topicMap", new LC), _e(this, "events", new vn.EventEmitter), _e(this, "name", Tb), _e(this, "version", kb), _e(this, "pending", new Map), _e(this, "cached", []), _e(this, "initialized", !1), _e(this, "storagePrefix", ds), _e(this, "subscribeTimeout", W.toMiliseconds(W.ONE_MINUTE)), _e(this, "initialSubscribeTimeout", W.toMiliseconds(W.ONE_SECOND * 15)), _e(this, "clientId"), _e(this, "batchSubscribeTopicsLimit", 500), _e(this, "init", async ()=>{
                this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), await this.restore()), this.initialized = !0;
            }), _e(this, "subscribe", async (n, r)=>{
                var i;
                this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({
                    type: "method",
                    method: "subscribe",
                    params: {
                        topic: n,
                        opts: r
                    }
                });
                try {
                    const o = Bi(r), a = {
                        topic: n,
                        relay: o,
                        transportType: r?.transportType
                    };
                    (i = r?.internal) != null && i.skipSubscribe || this.pending.set(n, a);
                    const c = await this.rpcSubscribe(n, o, r);
                    return typeof c == "string" && (this.onSubscribe(c, a), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({
                        type: "method",
                        method: "subscribe",
                        params: {
                            topic: n,
                            opts: r
                        }
                    })), c;
                } catch (o) {
                    throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(o), o;
                }
            }), _e(this, "unsubscribe", async (n, r)=>{
                this.isInitialized(), typeof r?.id < "u" ? await this.unsubscribeById(n, r.id, r) : await this.unsubscribeByTopic(n, r);
            }), _e(this, "isSubscribed", (n)=>new Promise((r)=>{
                    r(this.topicMap.topics.includes(n));
                })), _e(this, "isKnownTopic", (n)=>new Promise((r)=>{
                    r(this.topicMap.topics.includes(n) || this.pending.has(n) || this.cached.some((i)=>i.topic === n));
                })), _e(this, "on", (n, r)=>{
                this.events.on(n, r);
            }), _e(this, "once", (n, r)=>{
                this.events.once(n, r);
            }), _e(this, "off", (n, r)=>{
                this.events.off(n, r);
            }), _e(this, "removeListener", (n, r)=>{
                this.events.removeListener(n, r);
            }), _e(this, "start", async ()=>{
                await this.onConnect();
            }), _e(this, "stop", async ()=>{
                await this.onDisconnect();
            }), _e(this, "restart", async ()=>{
                await this.restore(), await this.onRestart();
            }), _e(this, "checkPending", async ()=>{
                if (this.pending.size === 0 && (!this.initialized || !this.relayer.connected)) return;
                const n = [];
                this.pending.forEach((r)=>{
                    n.push(r);
                }), await this.batchSubscribe(n);
            }), _e(this, "registerEventListeners", ()=>{
                this.relayer.core.heartbeat.on(sr.pulse, async ()=>{
                    await this.checkPending();
                }), this.events.on(At.created, async (n)=>{
                    const r = At.created;
                    this.logger.info(`Emitting ${r}`), this.logger.debug({
                        type: "event",
                        event: r,
                        data: n
                    }), await this.persist();
                }), this.events.on(At.deleted, async (n)=>{
                    const r = At.deleted;
                    this.logger.info(`Emitting ${r}`), this.logger.debug({
                        type: "event",
                        event: r,
                        data: n
                    }), await this.persist();
                });
            }), this.relayer = e, this.logger = ct(s, this.name), this.clientId = "";
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
        }
        get length() {
            return this.subscriptions.size;
        }
        get ids() {
            return Array.from(this.subscriptions.keys());
        }
        get values() {
            return Array.from(this.subscriptions.values());
        }
        get topics() {
            return this.topicMap.topics;
        }
        get hasAnyTopics() {
            return this.topicMap.topics.length > 0 || this.pending.size > 0 || this.cached.length > 0 || this.subscriptions.size > 0;
        }
        hasSubscription(e, s) {
            let n = !1;
            try {
                n = this.getSubscription(e).topic === s;
            } catch  {}
            return n;
        }
        reset() {
            this.cached = [], this.initialized = !0;
        }
        onDisable() {
            this.values.length > 0 && (this.cached = this.values), this.subscriptions.clear(), this.topicMap.clear();
        }
        async unsubscribeByTopic(e, s) {
            const n = this.topicMap.get(e);
            await Promise.all(n.map(async (r)=>await this.unsubscribeById(e, r, s)));
        }
        async unsubscribeById(e, s, n) {
            this.logger.debug("Unsubscribing Topic"), this.logger.trace({
                type: "method",
                method: "unsubscribe",
                params: {
                    topic: e,
                    id: s,
                    opts: n
                }
            });
            try {
                const r = Bi(n);
                await this.restartToComplete({
                    topic: e,
                    id: s,
                    relay: r
                }), await this.rpcUnsubscribe(e, s, r);
                const i = Re("USER_DISCONNECTED", `${this.name}, ${e}`);
                await this.onUnsubscribe(e, s, i), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({
                    type: "method",
                    method: "unsubscribe",
                    params: {
                        topic: e,
                        id: s,
                        opts: n
                    }
                });
            } catch (r) {
                throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(r), r;
            }
        }
        async rpcSubscribe(e, s, n) {
            var r, i;
            const o = await this.getSubscriptionId(e);
            if ((r = n?.internal) != null && r.skipSubscribe) return o;
            (!n || n?.transportType === ke.relay) && await this.restartToComplete({
                topic: e,
                id: e,
                relay: s
            });
            const a = {
                method: jn(s.protocol).subscribe,
                params: {
                    topic: e
                }
            };
            this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
                type: "payload",
                direction: "outgoing",
                request: a
            });
            const c = (i = n?.internal) == null ? void 0 : i.throwOnFailedPublish;
            try {
                if (n?.transportType === ke.link_mode) return setTimeout(()=>{
                    (this.relayer.connected || this.relayer.connecting) && this.relayer.request(a).catch((h)=>this.logger.warn(h));
                }, W.toMiliseconds(W.ONE_SECOND)), o;
                const l = new Promise(async (h)=>{
                    const u = (f)=>{
                        f.topic === e && (this.events.removeListener(At.created, u), h(f.id));
                    };
                    this.events.on(At.created, u);
                    try {
                        const f = await is(new Promise((g, w)=>{
                            this.relayer.request(a).catch((m)=>{
                                this.logger.warn(m, m?.message), w(m);
                            }).then(g);
                        }), this.initialSubscribeTimeout, `Subscribing to ${e} failed, please try again`);
                        this.events.removeListener(At.created, u), h(f);
                    } catch  {}
                }), d = await is(l, this.subscribeTimeout, `Subscribing to ${e} failed, please try again`);
                if (!d && c) throw new Error(`Subscribing to ${e} failed, please try again`);
                return d ? o : null;
            } catch (l) {
                if (this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(De.connection_stalled), c) throw l;
            }
            return null;
        }
        async rpcBatchSubscribe(e) {
            if (!e.length) return;
            const s = e[0].relay, n = {
                method: jn(s.protocol).batchSubscribe,
                params: {
                    topics: e.map((r)=>r.topic)
                }
            };
            this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
                type: "payload",
                direction: "outgoing",
                request: n
            });
            try {
                await await is(new Promise((r)=>{
                    this.relayer.request(n).catch((i)=>this.logger.warn(i)).then(r);
                }), this.subscribeTimeout, "rpcBatchSubscribe failed, please try again");
            } catch  {
                this.relayer.events.emit(De.connection_stalled);
            }
        }
        async rpcBatchFetchMessages(e) {
            if (!e.length) return;
            const s = e[0].relay, n = {
                method: jn(s.protocol).batchFetchMessages,
                params: {
                    topics: e.map((i)=>i.topic)
                }
            };
            this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
                type: "payload",
                direction: "outgoing",
                request: n
            });
            let r;
            try {
                r = await await is(new Promise((i, o)=>{
                    this.relayer.request(n).catch((a)=>{
                        this.logger.warn(a), o(a);
                    }).then(i);
                }), this.subscribeTimeout, "rpcBatchFetchMessages failed, please try again");
            } catch  {
                this.relayer.events.emit(De.connection_stalled);
            }
            return r;
        }
        rpcUnsubscribe(e, s, n) {
            const r = {
                method: jn(n.protocol).unsubscribe,
                params: {
                    topic: e,
                    id: s
                }
            };
            return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
                type: "payload",
                direction: "outgoing",
                request: r
            }), this.relayer.request(r);
        }
        onSubscribe(e, s) {
            this.setSubscription(e, So(fr({}, s), {
                id: e
            })), this.pending.delete(s.topic);
        }
        onBatchSubscribe(e) {
            e.length && e.forEach((s)=>{
                this.setSubscription(s.id, fr({}, s)), this.pending.delete(s.topic);
            });
        }
        async onUnsubscribe(e, s, n) {
            this.events.removeAllListeners(s), this.hasSubscription(s, e) && this.deleteSubscription(s, n), await this.relayer.messages.del(e);
        }
        async setRelayerSubscriptions(e) {
            await this.relayer.core.storage.setItem(this.storageKey, e);
        }
        async getRelayerSubscriptions() {
            return await this.relayer.core.storage.getItem(this.storageKey);
        }
        setSubscription(e, s) {
            this.logger.debug("Setting subscription"), this.logger.trace({
                type: "method",
                method: "setSubscription",
                id: e,
                subscription: s
            }), this.addSubscription(e, s);
        }
        addSubscription(e, s) {
            this.subscriptions.set(e, fr({}, s)), this.topicMap.set(s.topic, e), this.events.emit(At.created, s);
        }
        getSubscription(e) {
            this.logger.debug("Getting subscription"), this.logger.trace({
                type: "method",
                method: "getSubscription",
                id: e
            });
            const s = this.subscriptions.get(e);
            if (!s) {
                const { message: n } = F("NO_MATCHING_KEY", `${this.name}: ${e}`);
                throw new Error(n);
            }
            return s;
        }
        deleteSubscription(e, s) {
            this.logger.debug("Deleting subscription"), this.logger.trace({
                type: "method",
                method: "deleteSubscription",
                id: e,
                reason: s
            });
            const n = this.getSubscription(e);
            this.subscriptions.delete(e), this.topicMap.delete(n.topic, e), this.events.emit(At.deleted, So(fr({}, n), {
                reason: s
            }));
        }
        async persist() {
            await this.setRelayerSubscriptions(this.values), this.events.emit(At.sync);
        }
        async onRestart() {
            if (this.cached.length) {
                const e = [
                    ...this.cached
                ], s = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
                for(let n = 0; n < s; n++){
                    const r = e.splice(0, this.batchSubscribeTopicsLimit);
                    await this.batchSubscribe(r);
                }
            }
            this.events.emit(At.resubscribed);
        }
        async restore() {
            try {
                const e = await this.getRelayerSubscriptions();
                if (typeof e > "u" || !e.length) return;
                if (this.subscriptions.size && !e.every((s)=>{
                    var n;
                    return s.topic === ((n = this.subscriptions.get(s.id)) == null ? void 0 : n.topic);
                })) {
                    const { message: s } = F("RESTORE_WILL_OVERRIDE", this.name);
                    throw this.logger.error(s), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(s);
                }
                this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({
                    type: "method",
                    method: "restore",
                    subscriptions: this.values
                });
            } catch (e) {
                this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
            }
        }
        async batchSubscribe(e) {
            e.length && (await this.rpcBatchSubscribe(e), this.onBatchSubscribe(await Promise.all(e.map(async (s)=>So(fr({}, s), {
                    id: await this.getSubscriptionId(s.topic)
                })))));
        }
        async batchFetchMessages(e) {
            if (!e.length) return;
            this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);
            const s = await this.rpcBatchFetchMessages(e);
            s && s.messages && (await mg(W.toMiliseconds(W.ONE_SECOND)), await this.relayer.handleBatchMessageEvents(s.messages));
        }
        async onConnect() {
            await this.restart(), this.reset();
        }
        onDisconnect() {
            this.onDisable();
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
        async restartToComplete(e) {
            !this.relayer.connected && !this.relayer.connecting && (this.cached.push(e), await this.relayer.transportOpen());
        }
        async getClientId() {
            return this.clientId || (this.clientId = await this.relayer.core.crypto.getClientId()), this.clientId;
        }
        async getSubscriptionId(e) {
            return $t(e + await this.getClientId());
        }
    }
    var HC = Object.defineProperty, Rl = Object.getOwnPropertySymbols, VC = Object.prototype.hasOwnProperty, KC = Object.prototype.propertyIsEnumerable, wa = (t, e, s)=>e in t ? HC(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, xl = (t, e)=>{
        for(var s in e || (e = {}))VC.call(e, s) && wa(t, s, e[s]);
        if (Rl) for (var s of Rl(e))KC.call(e, s) && wa(t, s, e[s]);
        return t;
    }, Ee = (t, e, s)=>wa(t, typeof e != "symbol" ? e + "" : e, s);
    class zC extends xf {
        constructor(e){
            super(e), Ee(this, "protocol", "wc"), Ee(this, "version", 2), Ee(this, "core"), Ee(this, "logger"), Ee(this, "events", new vn.EventEmitter), Ee(this, "provider"), Ee(this, "messages"), Ee(this, "subscriber"), Ee(this, "publisher"), Ee(this, "name", Ab), Ee(this, "transportExplicitlyClosed", !1), Ee(this, "initialized", !1), Ee(this, "connectionAttemptInProgress", !1), Ee(this, "relayUrl"), Ee(this, "projectId"), Ee(this, "packageName"), Ee(this, "bundleId"), Ee(this, "hasExperiencedNetworkDisruption", !1), Ee(this, "pingTimeout"), Ee(this, "heartBeatTimeout", W.toMiliseconds(W.THIRTY_SECONDS + W.FIVE_SECONDS)), Ee(this, "reconnectTimeout"), Ee(this, "connectPromise"), Ee(this, "reconnectInProgress", !1), Ee(this, "requestsInFlight", []), Ee(this, "connectTimeout", W.toMiliseconds(W.ONE_SECOND * 15)), Ee(this, "request", async (s)=>{
                var n, r;
                this.logger.debug("Publishing Request Payload");
                const i = s.id || dn().toString();
                await this.toEstablishConnection();
                try {
                    this.logger.trace({
                        id: i,
                        method: s.method,
                        topic: (n = s.params) == null ? void 0 : n.topic
                    }, "relayer.request - publishing...");
                    const o = `${i}:${((r = s.params) == null ? void 0 : r.tag) || ""}`;
                    this.requestsInFlight.push(o);
                    const a = await this.provider.request(s);
                    return this.requestsInFlight = this.requestsInFlight.filter((c)=>c !== o), a;
                } catch (o) {
                    throw this.logger.debug(`Failed to Publish Request: ${i}`), o;
                }
            }), Ee(this, "resetPingTimeout", ()=>{
                xi() && (clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(()=>{
                    var s, n, r, i;
                    try {
                        this.logger.debug({}, "pingTimeout: Connection stalled, terminating..."), (i = (r = (n = (s = this.provider) == null ? void 0 : s.connection) == null ? void 0 : n.socket) == null ? void 0 : r.terminate) == null || i.call(r);
                    } catch (o) {
                        this.logger.warn(o, o?.message);
                    }
                }, this.heartBeatTimeout));
            }), Ee(this, "onPayloadHandler", (s)=>{
                this.onProviderPayload(s), this.resetPingTimeout();
            }), Ee(this, "onConnectHandler", ()=>{
                this.logger.warn({}, "Relayer connected 🛜"), this.startPingTimeout(), this.events.emit(De.connect);
            }), Ee(this, "onDisconnectHandler", ()=>{
                this.logger.warn({}, "Relayer disconnected 🛑"), this.requestsInFlight = [], this.onProviderDisconnect();
            }), Ee(this, "onProviderErrorHandler", (s)=>{
                this.logger.fatal(`Fatal socket error: ${s.message}`), this.events.emit(De.error, s), this.logger.fatal("Fatal socket error received, closing transport"), this.transportClose();
            }), Ee(this, "registerProviderListeners", ()=>{
                this.provider.on(Tt.payload, this.onPayloadHandler), this.provider.on(Tt.connect, this.onConnectHandler), this.provider.on(Tt.disconnect, this.onDisconnectHandler), this.provider.on(Tt.error, this.onProviderErrorHandler);
            }), this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? ct(e.logger, this.name) : Hr(Kr({
                level: e.logger || vb
            })), this.messages = new TC(this.logger, e.core), this.subscriber = new qC(this, this.logger), this.publisher = new $C(this, this.logger), this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || Zh, eg() ? this.packageName = Sc() : tg() && (this.bundleId = Sc()), this.provider = {};
        }
        async init() {
            this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([
                this.messages.init(),
                this.subscriber.init()
            ]), this.initialized = !0, this.transportOpen().catch((e)=>this.logger.warn(e, e?.message));
        }
        get context() {
            return bt(this.logger);
        }
        get connected() {
            var e, s, n;
            return ((n = (s = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : s.socket) == null ? void 0 : n.readyState) === 1 || !1;
        }
        get connecting() {
            var e, s, n;
            return ((n = (s = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : s.socket) == null ? void 0 : n.readyState) === 0 || this.connectPromise !== void 0 || !1;
        }
        async publish(e, s, n) {
            this.isInitialized(), await this.publisher.publish(e, s, n), await this.recordMessageEvent({
                topic: e,
                message: s,
                publishedAt: Date.now(),
                transportType: ke.relay
            }, Ci.outbound);
        }
        async publishCustom(e) {
            this.isInitialized(), await this.publisher.publishCustom(e);
        }
        async subscribe(e, s) {
            var n, r, i;
            this.isInitialized(), (!(s != null && s.transportType) || s?.transportType === "relay") && await this.toEstablishConnection();
            const o = typeof ((n = s?.internal) == null ? void 0 : n.throwOnFailedPublish) > "u" ? !0 : (r = s?.internal) == null ? void 0 : r.throwOnFailedPublish;
            let a = ((i = this.subscriber.topicMap.get(e)) == null ? void 0 : i[0]) || "", c;
            const l = (d)=>{
                d.topic === e && (this.subscriber.off(At.created, l), c());
            };
            return await Promise.all([
                new Promise((d)=>{
                    c = d, this.subscriber.on(At.created, l);
                }),
                new Promise(async (d, h)=>{
                    a = await this.subscriber.subscribe(e, xl({
                        internal: {
                            throwOnFailedPublish: o
                        }
                    }, s)).catch((u)=>{
                        o && h(u);
                    }) || a, d();
                })
            ]), a;
        }
        async unsubscribe(e, s) {
            this.isInitialized(), await this.subscriber.unsubscribe(e, s);
        }
        on(e, s) {
            this.events.on(e, s);
        }
        once(e, s) {
            this.events.once(e, s);
        }
        off(e, s) {
            this.events.off(e, s);
        }
        removeListener(e, s) {
            this.events.removeListener(e, s);
        }
        async transportDisconnect() {
            this.provider.disconnect && (this.hasExperiencedNetworkDisruption || this.connected) ? await is(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(()=>this.onProviderDisconnect()) : this.onProviderDisconnect();
        }
        async transportClose() {
            this.transportExplicitlyClosed = !0, await this.transportDisconnect();
        }
        async transportOpen(e) {
            if (!this.subscriber.hasAnyTopics) {
                this.logger.info("Starting WS connection skipped because the client has no topics to work with.");
                return;
            }
            if (this.connectPromise ? (this.logger.debug({}, "Waiting for existing connection attempt to resolve..."), await this.connectPromise, this.logger.debug({}, "Existing connection attempt resolved")) : (this.connectPromise = new Promise(async (s, n)=>{
                await this.connect(e).then(s).catch(n).finally(()=>{
                    this.connectPromise = void 0;
                });
            }), await this.connectPromise), !this.connected) throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`);
        }
        async restartTransport(e) {
            this.logger.debug({}, "Restarting transport..."), !this.connectionAttemptInProgress && (this.relayUrl = e || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
        }
        async confirmOnlineStateOrThrow() {
            if (!await bl()) throw new Error("No internet connection detected. Please restart your network and try again.");
        }
        async handleBatchMessageEvents(e) {
            if (e?.length === 0) {
                this.logger.trace("Batch message events is empty. Ignoring...");
                return;
            }
            const s = e.sort((n, r)=>n.publishedAt - r.publishedAt);
            this.logger.debug(`Batch of ${s.length} message events sorted`);
            for (const n of s)try {
                await this.onMessageEvent(n);
            } catch (r) {
                this.logger.warn(r, "Error while processing batch message event: " + r?.message);
            }
            this.logger.trace(`Batch of ${s.length} message events processed`);
        }
        async onLinkMessageEvent(e, s) {
            const { topic: n } = e;
            if (!s.sessionExists) {
                const r = Me(W.FIVE_MINUTES), i = {
                    topic: n,
                    expiry: r,
                    relay: {
                        protocol: "irn"
                    },
                    active: !1
                };
                await this.core.pairing.pairings.set(n, i);
            }
            this.events.emit(De.message, e), await this.recordMessageEvent(e, Ci.inbound);
        }
        async connect(e) {
            await this.confirmOnlineStateOrThrow(), e && e !== this.relayUrl && (this.relayUrl = e, await this.transportDisconnect()), this.connectionAttemptInProgress = !0, this.transportExplicitlyClosed = !1;
            let s = 1;
            for(; s < 6;){
                try {
                    if (this.transportExplicitlyClosed) break;
                    this.logger.debug({}, `Connecting to ${this.relayUrl}, attempt: ${s}...`), await this.createProvider(), await new Promise(async (n, r)=>{
                        const i = ()=>{
                            r(new Error("Connection interrupted while trying to connect"));
                        };
                        this.provider.once(Tt.disconnect, i), await is(new Promise((o, a)=>{
                            this.provider.connect().then(o).catch(a);
                        }), this.connectTimeout, `Socket stalled when trying to connect to ${this.relayUrl}`).catch((o)=>{
                            r(o);
                        }).finally(()=>{
                            this.provider.off(Tt.disconnect, i), clearTimeout(this.reconnectTimeout);
                        }), await new Promise(async (o, a)=>{
                            const c = ()=>{
                                r(new Error("Connection interrupted while trying to subscribe"));
                            };
                            this.provider.once(Tt.disconnect, c), await this.subscriber.start().then(o).catch(a).finally(()=>{
                                this.provider.off(Tt.disconnect, c);
                            });
                        }), this.hasExperiencedNetworkDisruption = !1, n();
                    });
                } catch (n) {
                    await this.subscriber.stop();
                    const r = n;
                    this.logger.warn({}, r.message), this.hasExperiencedNetworkDisruption = !0;
                } finally{
                    this.connectionAttemptInProgress = !1;
                }
                if (this.connected) {
                    this.logger.debug({}, `Connected to ${this.relayUrl} successfully on attempt: ${s}`);
                    break;
                }
                await new Promise((n)=>setTimeout(n, W.toMiliseconds(s * 1))), s++;
            }
        }
        startPingTimeout() {
            var e, s, n, r, i;
            if (xi()) try {
                (s = (e = this.provider) == null ? void 0 : e.connection) != null && s.socket && ((i = (r = (n = this.provider) == null ? void 0 : n.connection) == null ? void 0 : r.socket) == null || i.on("ping", ()=>{
                    this.resetPingTimeout();
                })), this.resetPingTimeout();
            } catch (o) {
                this.logger.warn(o, o?.message);
            }
        }
        async createProvider() {
            this.provider.connection && this.unregisterProviderListeners();
            const e = await this.core.crypto.signJWT(this.relayUrl);
            this.provider = new Ta(new Xu(og({
                sdkVersion: ha,
                protocol: this.protocol,
                version: this.version,
                relayUrl: this.relayUrl,
                projectId: this.projectId,
                auth: e,
                useOnCloseEvent: !0,
                bundleId: this.bundleId,
                packageName: this.packageName
            }))), this.registerProviderListeners();
        }
        async recordMessageEvent(e, s) {
            const { topic: n, message: r } = e;
            await this.messages.set(n, r, s);
        }
        async shouldIgnoreMessageEvent(e) {
            const { topic: s, message: n } = e;
            if (!n || n.length === 0) return this.logger.warn(`Ignoring invalid/empty message: ${n}`), !0;
            if (!await this.subscriber.isKnownTopic(s)) return this.logger.warn(`Ignoring message for unknown topic ${s}`), !0;
            const r = this.messages.has(s, n);
            return r && this.logger.warn(`Ignoring duplicate message: ${n}`), r;
        }
        async onProviderPayload(e) {
            if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({
                type: "payload",
                direction: "incoming",
                payload: e
            }), ka(e)) {
                if (!e.method.endsWith(Ib)) return;
                const s = e.params, { topic: n, message: r, publishedAt: i, attestation: o } = s.data, a = {
                    topic: n,
                    message: r,
                    publishedAt: i,
                    transportType: ke.relay,
                    attestation: o
                };
                this.logger.debug("Emitting Relayer Payload"), this.logger.trace(xl({
                    type: "event",
                    event: s.id
                }, a)), this.events.emit(s.id, a), await this.acknowledgePayload(e), await this.onMessageEvent(a);
            } else Oa(e) && this.events.emit(De.message_ack, e);
        }
        async onMessageEvent(e) {
            await this.shouldIgnoreMessageEvent(e) || (await this.recordMessageEvent(e, Ci.inbound), this.events.emit(De.message, e));
        }
        async acknowledgePayload(e) {
            const s = Pr(e.id, !0);
            await this.provider.connection.send(s);
        }
        unregisterProviderListeners() {
            this.provider.off(Tt.payload, this.onPayloadHandler), this.provider.off(Tt.connect, this.onConnectHandler), this.provider.off(Tt.disconnect, this.onDisconnectHandler), this.provider.off(Tt.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
        }
        async registerEventListeners() {
            let e = await bl();
            Qy(async (s)=>{
                e !== s && (e = s, s ? await this.transportOpen().catch((n)=>this.logger.error(n, n?.message)) : (this.hasExperiencedNetworkDisruption = !0, await this.transportDisconnect(), this.transportExplicitlyClosed = !1));
            }), this.core.heartbeat.on(sr.pulse, async ()=>{
                if (!this.transportExplicitlyClosed && !this.connected && sb()) try {
                    await this.confirmOnlineStateOrThrow(), await this.transportOpen();
                } catch (s) {
                    this.logger.warn(s, s?.message);
                }
            });
        }
        async onProviderDisconnect() {
            clearTimeout(this.pingTimeout), this.events.emit(De.disconnect), this.connectionAttemptInProgress = !1, !this.reconnectInProgress && (this.reconnectInProgress = !0, await this.subscriber.stop(), this.subscriber.hasAnyTopics && (this.transportExplicitlyClosed || (this.reconnectTimeout = setTimeout(async ()=>{
                await this.transportOpen().catch((e)=>this.logger.error(e, e?.message)), this.reconnectTimeout = void 0, this.reconnectInProgress = !1;
            }, W.toMiliseconds(Nb)))));
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
        async toEstablishConnection() {
            if (await this.confirmOnlineStateOrThrow(), !this.connected) {
                if (this.connectPromise) {
                    await this.connectPromise;
                    return;
                }
                await this.connect();
            }
        }
    }
    function GC(t, e) {
        return t === e || Number.isNaN(t) && Number.isNaN(e);
    }
    function $l(t) {
        return Object.getOwnPropertySymbols(t).filter((e)=>Object.prototype.propertyIsEnumerable.call(t, e));
    }
    function Ul(t) {
        return t == null ? t === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(t);
    }
    const YC = "[object RegExp]", JC = "[object String]", XC = "[object Number]", ZC = "[object Boolean]", Dl = "[object Arguments]", QC = "[object Symbol]", eE = "[object Date]", tE = "[object Map]", sE = "[object Set]", nE = "[object Array]", rE = "[object Function]", iE = "[object ArrayBuffer]", To = "[object Object]", oE = "[object Error]", aE = "[object DataView]", cE = "[object Uint8Array]", lE = "[object Uint8ClampedArray]", dE = "[object Uint16Array]", hE = "[object Uint32Array]", uE = "[object BigUint64Array]", pE = "[object Int8Array]", fE = "[object Int16Array]", gE = "[object Int32Array]", mE = "[object BigInt64Array]", wE = "[object Float32Array]", yE = "[object Float64Array]";
    function bE() {}
    function Ll(t) {
        if (!t || typeof t != "object") return !1;
        const e = Object.getPrototypeOf(t);
        return e === null || e === Object.prototype || Object.getPrototypeOf(e) === null ? Object.prototype.toString.call(t) === "[object Object]" : !1;
    }
    function CE(t, e, s) {
        return Er(t, e, void 0, void 0, void 0, void 0, s);
    }
    function Er(t, e, s, n, r, i, o) {
        const a = o(t, e, s, n, r, i);
        if (a !== void 0) return a;
        if (typeof t == typeof e) switch(typeof t){
            case "bigint":
            case "string":
            case "boolean":
            case "symbol":
            case "undefined":
                return t === e;
            case "number":
                return t === e || Object.is(t, e);
            case "function":
                return t === e;
            case "object":
                return kr(t, e, i, o);
        }
        return kr(t, e, i, o);
    }
    function kr(t, e, s, n) {
        if (Object.is(t, e)) return !0;
        let r = Ul(t), i = Ul(e);
        if (r === Dl && (r = To), i === Dl && (i = To), r !== i) return !1;
        switch(r){
            case JC:
                return t.toString() === e.toString();
            case XC:
                {
                    const c = t.valueOf(), l = e.valueOf();
                    return GC(c, l);
                }
            case ZC:
            case eE:
            case QC:
                return Object.is(t.valueOf(), e.valueOf());
            case YC:
                return t.source === e.source && t.flags === e.flags;
            case rE:
                return t === e;
        }
        s = s ?? new Map;
        const o = s.get(t), a = s.get(e);
        if (o != null && a != null) return o === e;
        s.set(t, e), s.set(e, t);
        try {
            switch(r){
                case tE:
                    {
                        if (t.size !== e.size) return !1;
                        for (const [c, l] of t.entries())if (!e.has(c) || !Er(l, e.get(c), c, t, e, s, n)) return !1;
                        return !0;
                    }
                case sE:
                    {
                        if (t.size !== e.size) return !1;
                        const c = Array.from(t.values()), l = Array.from(e.values());
                        for(let d = 0; d < c.length; d++){
                            const h = c[d], u = l.findIndex((f)=>Er(h, f, void 0, t, e, s, n));
                            if (u === -1) return !1;
                            l.splice(u, 1);
                        }
                        return !0;
                    }
                case nE:
                case cE:
                case lE:
                case dE:
                case hE:
                case uE:
                case pE:
                case fE:
                case gE:
                case mE:
                case wE:
                case yE:
                    {
                        if (typeof Buffer < "u" && Buffer.isBuffer(t) !== Buffer.isBuffer(e) || t.length !== e.length) return !1;
                        for(let c = 0; c < t.length; c++)if (!Er(t[c], e[c], c, t, e, s, n)) return !1;
                        return !0;
                    }
                case iE:
                    return t.byteLength !== e.byteLength ? !1 : kr(new Uint8Array(t), new Uint8Array(e), s, n);
                case aE:
                    return t.byteLength !== e.byteLength || t.byteOffset !== e.byteOffset ? !1 : kr(new Uint8Array(t), new Uint8Array(e), s, n);
                case oE:
                    return t.name === e.name && t.message === e.message;
                case To:
                    {
                        if (!(kr(t.constructor, e.constructor, s, n) || Ll(t) && Ll(e))) return !1;
                        const c = [
                            ...Object.keys(t),
                            ...$l(t)
                        ], l = [
                            ...Object.keys(e),
                            ...$l(e)
                        ];
                        if (c.length !== l.length) return !1;
                        for(let d = 0; d < c.length; d++){
                            const h = c[d], u = t[h];
                            if (!Object.hasOwn(e, h)) return !1;
                            const f = e[h];
                            if (!Er(u, f, h, t, e, s, n)) return !1;
                        }
                        return !0;
                    }
                default:
                    return !1;
            }
        } finally{
            s.delete(t), s.delete(e);
        }
    }
    function EE(t, e) {
        return CE(t, e, bE);
    }
    var vE = Object.defineProperty, Ml = Object.getOwnPropertySymbols, AE = Object.prototype.hasOwnProperty, IE = Object.prototype.propertyIsEnumerable, ya = (t, e, s)=>e in t ? vE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Bl = (t, e)=>{
        for(var s in e || (e = {}))AE.call(e, s) && ya(t, s, e[s]);
        if (Ml) for (var s of Ml(e))IE.call(e, s) && ya(t, s, e[s]);
        return t;
    }, pt = (t, e, s)=>ya(t, typeof e != "symbol" ? e + "" : e, s);
    class Sn extends $f {
        constructor(e, s, n, r = ds, i = void 0){
            super(e, s, n, r), this.core = e, this.logger = s, this.name = n, pt(this, "map", new Map), pt(this, "version", _b), pt(this, "cached", []), pt(this, "initialized", !1), pt(this, "getKey"), pt(this, "storagePrefix", ds), pt(this, "recentlyDeleted", []), pt(this, "recentlyDeletedLimit", 200), pt(this, "init", async ()=>{
                this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o)=>{
                    this.getKey && o !== null && !We(o) ? this.map.set(this.getKey(o), o) : Oy(o) ? this.map.set(o.id, o) : Py(o) && this.map.set(o.topic, o);
                }), this.cached = [], this.initialized = !0);
            }), pt(this, "set", async (o, a)=>{
                this.isInitialized(), this.map.has(o) ? await this.update(o, a) : (this.logger.debug("Setting value"), this.logger.trace({
                    type: "method",
                    method: "set",
                    key: o,
                    value: a
                }), this.map.set(o, a), await this.persist());
            }), pt(this, "get", (o)=>(this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({
                    type: "method",
                    method: "get",
                    key: o
                }), this.getData(o))), pt(this, "getAll", (o)=>(this.isInitialized(), o ? this.values.filter((a)=>Object.keys(o).every((c)=>EE(a[c], o[c]))) : this.values)), pt(this, "update", async (o, a)=>{
                this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({
                    type: "method",
                    method: "update",
                    key: o,
                    update: a
                });
                const c = Bl(Bl({}, this.getData(o)), a);
                this.map.set(o, c), await this.persist();
            }), pt(this, "delete", async (o, a)=>{
                this.isInitialized(), this.map.has(o) && (this.logger.debug("Deleting value"), this.logger.trace({
                    type: "method",
                    method: "delete",
                    key: o,
                    reason: a
                }), this.map.delete(o), this.addToRecentlyDeleted(o), await this.persist());
            }), this.logger = ct(s, this.name), this.storagePrefix = r, this.getKey = i;
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
        }
        get length() {
            return this.map.size;
        }
        get keys() {
            return Array.from(this.map.keys());
        }
        get values() {
            return Array.from(this.map.values());
        }
        addToRecentlyDeleted(e) {
            this.recentlyDeleted.push(e), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
        }
        async setDataStore(e) {
            await this.core.storage.setItem(this.storageKey, e);
        }
        async getDataStore() {
            return await this.core.storage.getItem(this.storageKey);
        }
        getData(e) {
            const s = this.map.get(e);
            if (!s) {
                if (this.recentlyDeleted.includes(e)) {
                    const { message: r } = F("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e}`);
                    throw this.logger.error(r), new Error(r);
                }
                const { message: n } = F("NO_MATCHING_KEY", `${this.name}: ${e}`);
                throw this.logger.error(n), new Error(n);
            }
            return s;
        }
        async persist() {
            await this.setDataStore(this.values);
        }
        async restore() {
            try {
                const e = await this.getDataStore();
                if (typeof e > "u" || !e.length) return;
                if (this.map.size) {
                    const { message: s } = F("RESTORE_WILL_OVERRIDE", this.name);
                    throw this.logger.error(s), new Error(s);
                }
                this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({
                    type: "method",
                    method: "restore",
                    value: this.values
                });
            } catch (e) {
                this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
            }
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var NE = Object.defineProperty, _E = (t, e, s)=>e in t ? NE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, pe = (t, e, s)=>_E(t, typeof e != "symbol" ? e + "" : e, s);
    class SE {
        constructor(e, s){
            this.core = e, this.logger = s, pe(this, "name", Ob), pe(this, "version", Pb), pe(this, "events", new Pa), pe(this, "pairings"), pe(this, "initialized", !1), pe(this, "storagePrefix", ds), pe(this, "ignoredPayloadTypes", [
                Is
            ]), pe(this, "registeredMethods", []), pe(this, "init", async ()=>{
                this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = !0, this.logger.trace("Initialized"));
            }), pe(this, "register", ({ methods: n })=>{
                this.isInitialized(), this.registeredMethods = [
                    ...new Set([
                        ...this.registeredMethods,
                        ...n
                    ])
                ];
            }), pe(this, "create", async (n)=>{
                this.isInitialized();
                const r = ca(), i = await this.core.crypto.setSymKey(r), o = Me(W.FIVE_MINUTES), a = {
                    protocol: Xh
                }, c = {
                    topic: i,
                    expiry: o,
                    relay: a,
                    active: !1,
                    methods: n?.methods
                }, l = dl({
                    protocol: this.core.protocol,
                    version: this.core.version,
                    topic: i,
                    symKey: r,
                    relay: a,
                    expiryTimestamp: o,
                    methods: n?.methods
                });
                return this.events.emit(an.create, c), this.core.expirer.set(i, o), await this.pairings.set(i, c), await this.core.relayer.subscribe(i, {
                    transportType: n?.transportType,
                    internal: n?.internal
                }), {
                    topic: i,
                    uri: l
                };
            }), pe(this, "pair", async (n)=>{
                this.isInitialized();
                const r = this.core.eventClient.createEvent({
                    properties: {
                        topic: n?.uri,
                        trace: [
                            Qt.pairing_started
                        ]
                    }
                });
                this.isValidPair(n, r);
                const { topic: i, symKey: o, relay: a, expiryTimestamp: c, methods: l } = ll(n.uri);
                r.props.properties.topic = i, r.addTrace(Qt.pairing_uri_validation_success), r.addTrace(Qt.pairing_uri_not_expired);
                let d;
                if (this.pairings.keys.includes(i)) {
                    if (d = this.pairings.get(i), r.addTrace(Qt.existing_pairing), d.active) throw r.setError(gs.active_pairing_already_exists), new Error(`Pairing already exists: ${i}. Please try again with a new connection URI.`);
                    r.addTrace(Qt.pairing_not_expired);
                }
                const h = c || Me(W.FIVE_MINUTES), u = {
                    topic: i,
                    relay: a,
                    expiry: h,
                    active: !1,
                    methods: l
                };
                this.core.expirer.set(i, h), await this.pairings.set(i, u), r.addTrace(Qt.store_new_pairing), n.activatePairing && await this.activate({
                    topic: i
                }), this.events.emit(an.create, u), r.addTrace(Qt.emit_inactive_pairing), this.core.crypto.keychain.has(i) || await this.core.crypto.setSymKey(o, i), r.addTrace(Qt.subscribing_pairing_topic);
                try {
                    await this.core.relayer.confirmOnlineStateOrThrow();
                } catch  {
                    r.setError(gs.no_internet_connection);
                }
                try {
                    await this.core.relayer.subscribe(i, {
                        relay: a
                    });
                } catch (f) {
                    throw r.setError(gs.subscribe_pairing_topic_failure), f;
                }
                return r.addTrace(Qt.subscribe_pairing_topic_success), u;
            }), pe(this, "activate", async ({ topic: n })=>{
                this.isInitialized();
                const r = Me(W.FIVE_MINUTES);
                this.core.expirer.set(n, r), await this.pairings.update(n, {
                    active: !0,
                    expiry: r
                });
            }), pe(this, "ping", async (n)=>{
                this.isInitialized(), await this.isValidPing(n), this.logger.warn("ping() is deprecated and will be removed in the next major release.");
                const { topic: r } = n;
                if (this.pairings.keys.includes(r)) {
                    const i = await this.sendRequest(r, "wc_pairingPing", {}), { done: o, resolve: a, reject: c } = on();
                    this.events.once(Ae("pairing_ping", i), ({ error: l })=>{
                        l ? c(l) : a();
                    }), await o();
                }
            }), pe(this, "updateExpiry", async ({ topic: n, expiry: r })=>{
                this.isInitialized(), await this.pairings.update(n, {
                    expiry: r
                });
            }), pe(this, "updateMetadata", async ({ topic: n, metadata: r })=>{
                this.isInitialized(), await this.pairings.update(n, {
                    peerMetadata: r
                });
            }), pe(this, "getPairings", ()=>(this.isInitialized(), this.pairings.values)), pe(this, "disconnect", async (n)=>{
                this.isInitialized(), await this.isValidDisconnect(n);
                const { topic: r } = n;
                this.pairings.keys.includes(r) && (await this.sendRequest(r, "wc_pairingDelete", Re("USER_DISCONNECTED")), await this.deletePairing(r));
            }), pe(this, "formatUriFromPairing", (n)=>{
                this.isInitialized();
                const { topic: r, relay: i, expiry: o, methods: a } = n, c = this.core.crypto.keychain.get(r);
                return dl({
                    protocol: this.core.protocol,
                    version: this.core.version,
                    topic: r,
                    symKey: c,
                    relay: i,
                    expiryTimestamp: o,
                    methods: a
                });
            }), pe(this, "sendRequest", async (n, r, i)=>{
                const o = ts(r, i), a = await this.core.crypto.encode(n, o), c = hr[r].req;
                return this.core.history.set(n, o), this.core.relayer.publish(n, a, c), o.id;
            }), pe(this, "sendResult", async (n, r, i)=>{
                const o = Pr(n, i), a = await this.core.crypto.encode(r, o), c = (await this.core.history.get(r, n)).request.method, l = hr[c].res;
                await this.core.relayer.publish(r, a, l), await this.core.history.resolve(o);
            }), pe(this, "sendError", async (n, r, i)=>{
                const o = kd(n, i), a = await this.core.crypto.encode(r, o), c = (await this.core.history.get(r, n)).request.method, l = hr[c] ? hr[c].res : hr.unregistered_method.res;
                await this.core.relayer.publish(r, a, l), await this.core.history.resolve(o);
            }), pe(this, "deletePairing", async (n, r)=>{
                await this.core.relayer.unsubscribe(n), await Promise.all([
                    this.pairings.delete(n, Re("USER_DISCONNECTED")),
                    this.core.crypto.deleteSymKey(n),
                    r ? Promise.resolve() : this.core.expirer.del(n)
                ]);
            }), pe(this, "cleanup", async ()=>{
                const n = this.pairings.getAll().filter((r)=>ss(r.expiry));
                await Promise.all(n.map((r)=>this.deletePairing(r.topic)));
            }), pe(this, "onRelayEventRequest", async (n)=>{
                const { topic: r, payload: i } = n;
                switch(i.method){
                    case "wc_pairingPing":
                        return await this.onPairingPingRequest(r, i);
                    case "wc_pairingDelete":
                        return await this.onPairingDeleteRequest(r, i);
                    default:
                        return await this.onUnknownRpcMethodRequest(r, i);
                }
            }), pe(this, "onRelayEventResponse", async (n)=>{
                const { topic: r, payload: i } = n, o = (await this.core.history.get(r, i.id)).request.method;
                return o === "wc_pairingPing" ? this.onPairingPingResponse(r, i) : this.onUnknownRpcMethodResponse(o);
            }), pe(this, "onPairingPingRequest", async (n, r)=>{
                const { id: i } = r;
                try {
                    this.isValidPing({
                        topic: n
                    }), await this.sendResult(i, n, !0), this.events.emit(an.ping, {
                        id: i,
                        topic: n
                    });
                } catch (o) {
                    await this.sendError(i, n, o), this.logger.error(o);
                }
            }), pe(this, "onPairingPingResponse", (n, r)=>{
                const { id: i } = r;
                setTimeout(()=>{
                    ps(r) ? this.events.emit(Ae("pairing_ping", i), {}) : es(r) && this.events.emit(Ae("pairing_ping", i), {
                        error: r.error
                    });
                }, 500);
            }), pe(this, "onPairingDeleteRequest", async (n, r)=>{
                const { id: i } = r;
                try {
                    this.isValidDisconnect({
                        topic: n
                    }), await this.deletePairing(n), this.events.emit(an.delete, {
                        id: i,
                        topic: n
                    });
                } catch (o) {
                    await this.sendError(i, n, o), this.logger.error(o);
                }
            }), pe(this, "onUnknownRpcMethodRequest", async (n, r)=>{
                const { id: i, method: o } = r;
                try {
                    if (this.registeredMethods.includes(o)) return;
                    const a = Re("WC_METHOD_UNSUPPORTED", o);
                    await this.sendError(i, n, a), this.logger.error(a);
                } catch (a) {
                    await this.sendError(i, n, a), this.logger.error(a);
                }
            }), pe(this, "onUnknownRpcMethodResponse", (n)=>{
                this.registeredMethods.includes(n) || this.logger.error(Re("WC_METHOD_UNSUPPORTED", n));
            }), pe(this, "isValidPair", (n, r)=>{
                var i;
                if (!ft(n)) {
                    const { message: a } = F("MISSING_OR_INVALID", `pair() params: ${n}`);
                    throw r.setError(gs.malformed_pairing_uri), new Error(a);
                }
                if (!ky(n.uri)) {
                    const { message: a } = F("MISSING_OR_INVALID", `pair() uri: ${n.uri}`);
                    throw r.setError(gs.malformed_pairing_uri), new Error(a);
                }
                const o = ll(n?.uri);
                if (!((i = o?.relay) != null && i.protocol)) {
                    const { message: a } = F("MISSING_OR_INVALID", "pair() uri#relay-protocol");
                    throw r.setError(gs.malformed_pairing_uri), new Error(a);
                }
                if (!(o != null && o.symKey)) {
                    const { message: a } = F("MISSING_OR_INVALID", "pair() uri#symKey");
                    throw r.setError(gs.malformed_pairing_uri), new Error(a);
                }
                if (o != null && o.expiryTimestamp && W.toMiliseconds(o?.expiryTimestamp) < Date.now()) {
                    r.setError(gs.pairing_expired);
                    const { message: a } = F("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
                    throw new Error(a);
                }
            }), pe(this, "isValidPing", async (n)=>{
                if (!ft(n)) {
                    const { message: i } = F("MISSING_OR_INVALID", `ping() params: ${n}`);
                    throw new Error(i);
                }
                const { topic: r } = n;
                await this.isValidPairingTopic(r);
            }), pe(this, "isValidDisconnect", async (n)=>{
                if (!ft(n)) {
                    const { message: i } = F("MISSING_OR_INVALID", `disconnect() params: ${n}`);
                    throw new Error(i);
                }
                const { topic: r } = n;
                await this.isValidPairingTopic(r);
            }), pe(this, "isValidPairingTopic", async (n)=>{
                if (!Be(n, !1)) {
                    const { message: r } = F("MISSING_OR_INVALID", `pairing topic should be a string: ${n}`);
                    throw new Error(r);
                }
                if (!this.pairings.keys.includes(n)) {
                    const { message: r } = F("NO_MATCHING_KEY", `pairing topic doesn't exist: ${n}`);
                    throw new Error(r);
                }
                if (ss(this.pairings.get(n).expiry)) {
                    await this.deletePairing(n);
                    const { message: r } = F("EXPIRED", `pairing topic: ${n}`);
                    throw new Error(r);
                }
            }), this.core = e, this.logger = ct(s, this.name), this.pairings = new Sn(this.core, this.logger, this.name, this.storagePrefix);
        }
        get context() {
            return bt(this.logger);
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
        registerRelayerEvents() {
            this.core.relayer.on(De.message, async (e)=>{
                const { topic: s, message: n, transportType: r } = e;
                if (this.pairings.keys.includes(s) && r !== ke.link_mode && !this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(n))) try {
                    const i = await this.core.crypto.decode(s, n);
                    ka(i) ? (this.core.history.set(s, i), await this.onRelayEventRequest({
                        topic: s,
                        payload: i
                    })) : Oa(i) && (await this.core.history.resolve(i), await this.onRelayEventResponse({
                        topic: s,
                        payload: i
                    }), this.core.history.delete(s, i.id)), await this.core.relayer.messages.ack(s, n);
                } catch (i) {
                    this.logger.error(i);
                }
            });
        }
        registerExpirerEvents() {
            this.core.expirer.on(xt.expired, async (e)=>{
                const { topic: s } = Yd(e.target);
                s && this.pairings.keys.includes(s) && (await this.deletePairing(s, !0), this.events.emit(an.expire, {
                    topic: s
                }));
            });
        }
    }
    var TE = Object.defineProperty, kE = (t, e, s)=>e in t ? TE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, ze = (t, e, s)=>kE(t, typeof e != "symbol" ? e + "" : e, s);
    class OE extends Of {
        constructor(e, s){
            super(e, s), this.core = e, this.logger = s, ze(this, "records", new Map), ze(this, "events", new vn.EventEmitter), ze(this, "name", Rb), ze(this, "version", xb), ze(this, "cached", []), ze(this, "initialized", !1), ze(this, "storagePrefix", ds), ze(this, "init", async ()=>{
                this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((n)=>this.records.set(n.id, n)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
            }), ze(this, "set", (n, r, i)=>{
                if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({
                    type: "method",
                    method: "set",
                    topic: n,
                    request: r,
                    chainId: i
                }), this.records.has(r.id)) return;
                const o = {
                    id: r.id,
                    topic: n,
                    request: {
                        method: r.method,
                        params: r.params || null
                    },
                    chainId: i,
                    expiry: Me(W.THIRTY_DAYS)
                };
                this.records.set(o.id, o), this.persist(), this.events.emit(Wt.created, o);
            }), ze(this, "resolve", async (n)=>{
                if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({
                    type: "method",
                    method: "update",
                    response: n
                }), !this.records.has(n.id)) return;
                const r = await this.getRecord(n.id);
                typeof r.response > "u" && (r.response = es(n) ? {
                    error: n.error
                } : {
                    result: n.result
                }, this.records.set(r.id, r), this.persist(), this.events.emit(Wt.updated, r));
            }), ze(this, "get", async (n, r)=>(this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({
                    type: "method",
                    method: "get",
                    topic: n,
                    id: r
                }), await this.getRecord(r))), ze(this, "delete", (n, r)=>{
                this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({
                    type: "method",
                    method: "delete",
                    id: r
                }), this.values.forEach((i)=>{
                    if (i.topic === n) {
                        if (typeof r < "u" && i.id !== r) return;
                        this.records.delete(i.id), this.events.emit(Wt.deleted, i);
                    }
                }), this.persist();
            }), ze(this, "exists", async (n, r)=>(this.isInitialized(), this.records.has(r) ? (await this.getRecord(r)).topic === n : !1)), ze(this, "on", (n, r)=>{
                this.events.on(n, r);
            }), ze(this, "once", (n, r)=>{
                this.events.once(n, r);
            }), ze(this, "off", (n, r)=>{
                this.events.off(n, r);
            }), ze(this, "removeListener", (n, r)=>{
                this.events.removeListener(n, r);
            }), this.logger = ct(s, this.name);
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
        }
        get size() {
            return this.records.size;
        }
        get keys() {
            return Array.from(this.records.keys());
        }
        get values() {
            return Array.from(this.records.values());
        }
        get pending() {
            const e = [];
            return this.values.forEach((s)=>{
                if (typeof s.response < "u") return;
                const n = {
                    topic: s.topic,
                    request: ts(s.request.method, s.request.params, s.id),
                    chainId: s.chainId
                };
                return e.push(n);
            }), e;
        }
        async setJsonRpcRecords(e) {
            await this.core.storage.setItem(this.storageKey, e);
        }
        async getJsonRpcRecords() {
            return await this.core.storage.getItem(this.storageKey);
        }
        getRecord(e) {
            this.isInitialized();
            const s = this.records.get(e);
            if (!s) {
                const { message: n } = F("NO_MATCHING_KEY", `${this.name}: ${e}`);
                throw new Error(n);
            }
            return s;
        }
        async persist() {
            await this.setJsonRpcRecords(this.values), this.events.emit(Wt.sync);
        }
        async restore() {
            try {
                const e = await this.getJsonRpcRecords();
                if (typeof e > "u" || !e.length) return;
                if (this.records.size) {
                    const { message: s } = F("RESTORE_WILL_OVERRIDE", this.name);
                    throw this.logger.error(s), new Error(s);
                }
                this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
                    type: "method",
                    method: "restore",
                    records: this.values
                });
            } catch (e) {
                this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
            }
        }
        registerEventListeners() {
            this.events.on(Wt.created, (e)=>{
                const s = Wt.created;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    record: e
                });
            }), this.events.on(Wt.updated, (e)=>{
                const s = Wt.updated;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    record: e
                });
            }), this.events.on(Wt.deleted, (e)=>{
                const s = Wt.deleted;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    record: e
                });
            }), this.core.heartbeat.on(sr.pulse, ()=>{
                this.cleanup();
            });
        }
        cleanup() {
            try {
                this.isInitialized();
                let e = !1;
                this.records.forEach((s)=>{
                    W.toMiliseconds(s.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${s.id}`), this.records.delete(s.id), this.events.emit(Wt.deleted, s, !1), e = !0);
                }), e && this.persist();
            } catch (e) {
                this.logger.warn(e);
            }
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var PE = Object.defineProperty, RE = (t, e, s)=>e in t ? PE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, st = (t, e, s)=>RE(t, typeof e != "symbol" ? e + "" : e, s);
    class xE extends Df {
        constructor(e, s){
            super(e, s), this.core = e, this.logger = s, st(this, "expirations", new Map), st(this, "events", new vn.EventEmitter), st(this, "name", $b), st(this, "version", Ub), st(this, "cached", []), st(this, "initialized", !1), st(this, "storagePrefix", ds), st(this, "init", async ()=>{
                this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((n)=>this.expirations.set(n.target, n)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
            }), st(this, "has", (n)=>{
                try {
                    const r = this.formatTarget(n);
                    return typeof this.getExpiration(r) < "u";
                } catch  {
                    return !1;
                }
            }), st(this, "set", (n, r)=>{
                this.isInitialized();
                const i = this.formatTarget(n), o = {
                    target: i,
                    expiry: r
                };
                this.expirations.set(i, o), this.checkExpiry(i, o), this.events.emit(xt.created, {
                    target: i,
                    expiration: o
                });
            }), st(this, "get", (n)=>{
                this.isInitialized();
                const r = this.formatTarget(n);
                return this.getExpiration(r);
            }), st(this, "del", (n)=>{
                if (this.isInitialized(), this.has(n)) {
                    const r = this.formatTarget(n), i = this.getExpiration(r);
                    this.expirations.delete(r), this.events.emit(xt.deleted, {
                        target: r,
                        expiration: i
                    });
                }
            }), st(this, "on", (n, r)=>{
                this.events.on(n, r);
            }), st(this, "once", (n, r)=>{
                this.events.once(n, r);
            }), st(this, "off", (n, r)=>{
                this.events.off(n, r);
            }), st(this, "removeListener", (n, r)=>{
                this.events.removeListener(n, r);
            }), this.logger = ct(s, this.name);
        }
        get context() {
            return bt(this.logger);
        }
        get storageKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
        }
        get length() {
            return this.expirations.size;
        }
        get keys() {
            return Array.from(this.expirations.keys());
        }
        get values() {
            return Array.from(this.expirations.values());
        }
        formatTarget(e) {
            if (typeof e == "string") return ag(e);
            if (typeof e == "number") return cg(e);
            const { message: s } = F("UNKNOWN_TYPE", `Target type: ${typeof e}`);
            throw new Error(s);
        }
        async setExpirations(e) {
            await this.core.storage.setItem(this.storageKey, e);
        }
        async getExpirations() {
            return await this.core.storage.getItem(this.storageKey);
        }
        async persist() {
            await this.setExpirations(this.values), this.events.emit(xt.sync);
        }
        async restore() {
            try {
                const e = await this.getExpirations();
                if (typeof e > "u" || !e.length) return;
                if (this.expirations.size) {
                    const { message: s } = F("RESTORE_WILL_OVERRIDE", this.name);
                    throw this.logger.error(s), new Error(s);
                }
                this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({
                    type: "method",
                    method: "restore",
                    expirations: this.values
                });
            } catch (e) {
                this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
            }
        }
        getExpiration(e) {
            const s = this.expirations.get(e);
            if (!s) {
                const { message: n } = F("NO_MATCHING_KEY", `${this.name}: ${e}`);
                throw this.logger.warn(n), new Error(n);
            }
            return s;
        }
        checkExpiry(e, s) {
            const { expiry: n } = s;
            W.toMiliseconds(n) - Date.now() <= 0 && this.expire(e, s);
        }
        expire(e, s) {
            this.expirations.delete(e), this.events.emit(xt.expired, {
                target: e,
                expiration: s
            });
        }
        checkExpirations() {
            this.core.relayer.connected && this.expirations.forEach((e, s)=>this.checkExpiry(s, e));
        }
        registerEventListeners() {
            this.core.heartbeat.on(sr.pulse, ()=>this.checkExpirations()), this.events.on(xt.created, (e)=>{
                const s = xt.created;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    data: e
                }), this.persist();
            }), this.events.on(xt.expired, (e)=>{
                const s = xt.expired;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    data: e
                }), this.persist();
            }), this.events.on(xt.deleted, (e)=>{
                const s = xt.deleted;
                this.logger.info(`Emitting ${s}`), this.logger.debug({
                    type: "event",
                    event: s,
                    data: e
                }), this.persist();
            });
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
    }
    var $E = Object.defineProperty, UE = (t, e, s)=>e in t ? $E(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Le = (t, e, s)=>UE(t, typeof e != "symbol" ? e + "" : e, s);
    class DE extends Lf {
        constructor(e, s, n){
            super(e, s, n), this.core = e, this.logger = s, this.store = n, Le(this, "name", Db), Le(this, "abortController"), Le(this, "isDevEnv"), Le(this, "verifyUrlV3", Mb), Le(this, "storagePrefix", ds), Le(this, "version", Jh), Le(this, "publicKey"), Le(this, "fetchPromise"), Le(this, "init", async ()=>{
                var r;
                this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && W.toMiliseconds((r = this.publicKey) == null ? void 0 : r.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
            }), Le(this, "register", async (r)=>{
                if (!nr() || this.isDevEnv) return;
                const i = window.location.origin, { id: o, decryptedId: a } = r, c = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${i}&id=${o}&decryptedId=${a}`;
                try {
                    const l = _s.getDocument(), d = this.startAbortTimer(W.ONE_SECOND * 5), h = await new Promise((u, f)=>{
                        const g = ()=>{
                            window.removeEventListener("message", m), l.body.removeChild(w), f("attestation aborted");
                        };
                        this.abortController.signal.addEventListener("abort", g);
                        const w = l.createElement("iframe");
                        w.src = c, w.style.display = "none", w.addEventListener("error", g, {
                            signal: this.abortController.signal
                        });
                        const m = (A)=>{
                            if (A.data && typeof A.data == "string") try {
                                const v = JSON.parse(A.data);
                                if (v.type === "verify_attestation") {
                                    if (jo(v.attestation).payload.id !== o) return;
                                    clearInterval(d), l.body.removeChild(w), this.abortController.signal.removeEventListener("abort", g), window.removeEventListener("message", m), u(v.attestation === null ? "" : v.attestation);
                                }
                            } catch (v) {
                                this.logger.warn(v);
                            }
                        };
                        l.body.appendChild(w), window.addEventListener("message", m, {
                            signal: this.abortController.signal
                        });
                    });
                    return this.logger.debug("jwt attestation", h), h;
                } catch (l) {
                    this.logger.warn(l);
                }
                return "";
            }), Le(this, "resolve", async (r)=>{
                if (this.isDevEnv) return "";
                const { attestationId: i, hash: o, encryptedId: a } = r;
                if (i === "") {
                    this.logger.debug("resolve: attestationId is empty, skipping");
                    return;
                }
                if (i) {
                    if (jo(i).payload.id !== a) return;
                    const l = await this.isValidJwtAttestation(i);
                    if (l) {
                        if (!l.isVerified) {
                            this.logger.warn("resolve: jwt attestation: origin url not verified");
                            return;
                        }
                        return l;
                    }
                }
                if (!o) return;
                const c = this.getVerifyUrl(r?.verifyUrl);
                return this.fetchAttestation(o, c);
            }), Le(this, "fetchAttestation", async (r, i)=>{
                this.logger.debug(`resolving attestation: ${r} from url: ${i}`);
                const o = this.startAbortTimer(W.ONE_SECOND * 5), a = await fetch(`${i}/attestation/${r}?v2Supported=true`, {
                    signal: this.abortController.signal
                });
                return clearTimeout(o), a.status === 200 ? await a.json() : void 0;
            }), Le(this, "getVerifyUrl", (r)=>{
                let i = r || Tr;
                return Bb.includes(i) || (this.logger.info(`verify url: ${i}, not included in trusted list, assigning default: ${Tr}`), i = Tr), i;
            }), Le(this, "fetchPublicKey", async ()=>{
                try {
                    this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
                    const r = this.startAbortTimer(W.FIVE_SECONDS), i = await fetch(`${this.verifyUrlV3}/public-key`, {
                        signal: this.abortController.signal
                    });
                    return clearTimeout(r), await i.json();
                } catch (r) {
                    this.logger.warn(r);
                }
            }), Le(this, "persistPublicKey", async (r)=>{
                this.logger.debug("persisting public key to local storage", r), await this.store.setItem(this.storeKey, r), this.publicKey = r;
            }), Le(this, "removePublicKey", async ()=>{
                this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
            }), Le(this, "isValidJwtAttestation", async (r)=>{
                const i = await this.getPublicKey();
                try {
                    if (i) return this.validateAttestation(r, i);
                } catch (a) {
                    this.logger.error(a), this.logger.warn("error validating attestation");
                }
                const o = await this.fetchAndPersistPublicKey();
                try {
                    if (o) return this.validateAttestation(r, o);
                } catch (a) {
                    this.logger.error(a), this.logger.warn("error validating attestation");
                }
            }), Le(this, "getPublicKey", async ()=>this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey()), Le(this, "fetchAndPersistPublicKey", async ()=>{
                if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
                this.fetchPromise = new Promise(async (i)=>{
                    const o = await this.fetchPublicKey();
                    o && (await this.persistPublicKey(o), i(o));
                });
                const r = await this.fetchPromise;
                return this.fetchPromise = void 0, r;
            }), Le(this, "validateAttestation", (r, i)=>{
                const o = sy(r, i.publicKey), a = {
                    hasExpired: W.toMiliseconds(o.exp) < Date.now(),
                    payload: o
                };
                if (a.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), new Error("JWT attestation expired");
                return {
                    origin: a.payload.origin,
                    isScam: a.payload.isScam,
                    isVerified: a.payload.isVerified
                };
            }), this.logger = ct(s, this.name), this.abortController = new AbortController, this.isDevEnv = Ua(), this.init();
        }
        get storeKey() {
            return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
        }
        get context() {
            return bt(this.logger);
        }
        startAbortTimer(e) {
            return this.abortController = new AbortController, setTimeout(()=>this.abortController.abort(), W.toMiliseconds(e));
        }
    }
    var LE = Object.defineProperty, ME = (t, e, s)=>e in t ? LE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Fl = (t, e, s)=>ME(t, typeof e != "symbol" ? e + "" : e, s);
    class BE extends Mf {
        constructor(e, s){
            super(e, s), this.projectId = e, this.logger = s, Fl(this, "context", Fb), Fl(this, "registerDeviceToken", async (n)=>{
                const { clientId: r, token: i, notificationType: o, enableEncrypted: a = !1 } = n, c = `${jb}/${this.projectId}/clients`;
                await fetch(c, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        client_id: r,
                        type: o,
                        token: i,
                        always_raw: a
                    })
                });
            }), this.logger = ct(s, this.context);
        }
    }
    var FE = Object.defineProperty, jl = Object.getOwnPropertySymbols, jE = Object.prototype.hasOwnProperty, WE = Object.prototype.propertyIsEnumerable, ba = (t, e, s)=>e in t ? FE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, gr = (t, e)=>{
        for(var s in e || (e = {}))jE.call(e, s) && ba(t, s, e[s]);
        if (jl) for (var s of jl(e))WE.call(e, s) && ba(t, s, e[s]);
        return t;
    }, qe = (t, e, s)=>ba(t, typeof e != "symbol" ? e + "" : e, s);
    class qE extends Bf {
        constructor(e, s, n = !0){
            super(e, s, n), this.core = e, this.logger = s, qe(this, "context", qb), qe(this, "storagePrefix", ds), qe(this, "storageVersion", Wb), qe(this, "events", new Map), qe(this, "shouldPersist", !1), qe(this, "init", async ()=>{
                if (!Ua()) try {
                    const r = {
                        eventId: kc(),
                        timestamp: Date.now(),
                        domain: this.getAppDomain(),
                        props: {
                            event: "INIT",
                            type: "",
                            properties: {
                                client_id: await this.core.crypto.getClientId(),
                                user_agent: zd(this.core.relayer.protocol, this.core.relayer.version, ha)
                            }
                        }
                    };
                    await this.sendEvent([
                        r
                    ]);
                } catch (r) {
                    this.logger.warn(r);
                }
            }), qe(this, "createEvent", (r)=>{
                const { event: i = "ERROR", type: o = "", properties: { topic: a, trace: c } } = r, l = kc(), d = this.core.projectId || "", h = Date.now(), u = gr({
                    eventId: l,
                    timestamp: h,
                    props: {
                        event: i,
                        type: o,
                        properties: {
                            topic: a,
                            trace: c
                        }
                    },
                    bundleId: d,
                    domain: this.getAppDomain()
                }, this.setMethods(l));
                return this.telemetryEnabled && (this.events.set(l, u), this.shouldPersist = !0), u;
            }), qe(this, "getEvent", (r)=>{
                const { eventId: i, topic: o } = r;
                if (i) return this.events.get(i);
                const a = Array.from(this.events.values()).find((c)=>c.props.properties.topic === o);
                if (a) return gr(gr({}, a), this.setMethods(a.eventId));
            }), qe(this, "deleteEvent", (r)=>{
                const { eventId: i } = r;
                this.events.delete(i), this.shouldPersist = !0;
            }), qe(this, "setEventListeners", ()=>{
                this.core.heartbeat.on(sr.pulse, async ()=>{
                    this.shouldPersist && await this.persist(), this.events.forEach((r)=>{
                        W.fromMiliseconds(Date.now()) - W.fromMiliseconds(r.timestamp) > Hb && (this.events.delete(r.eventId), this.shouldPersist = !0);
                    });
                });
            }), qe(this, "setMethods", (r)=>({
                    addTrace: (i)=>this.addTrace(r, i),
                    setError: (i)=>this.setError(r, i)
                })), qe(this, "addTrace", (r, i)=>{
                const o = this.events.get(r);
                o && (o.props.properties.trace.push(i), this.events.set(r, o), this.shouldPersist = !0);
            }), qe(this, "setError", (r, i)=>{
                const o = this.events.get(r);
                o && (o.props.type = i, o.timestamp = Date.now(), this.events.set(r, o), this.shouldPersist = !0);
            }), qe(this, "persist", async ()=>{
                await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = !1;
            }), qe(this, "restore", async ()=>{
                try {
                    const r = await this.core.storage.getItem(this.storageKey) || [];
                    if (!r.length) return;
                    r.forEach((i)=>{
                        this.events.set(i.eventId, gr(gr({}, i), this.setMethods(i.eventId)));
                    });
                } catch (r) {
                    this.logger.warn(r);
                }
            }), qe(this, "submit", async ()=>{
                if (!this.telemetryEnabled || this.events.size === 0) return;
                const r = [];
                for (const [i, o] of this.events)o.props.type && r.push(o);
                if (r.length !== 0) try {
                    if ((await this.sendEvent(r)).ok) for (const i of r)this.events.delete(i.eventId), this.shouldPersist = !0;
                } catch (i) {
                    this.logger.warn(i);
                }
            }), qe(this, "sendEvent", async (r)=>{
                const i = this.getAppDomain() ? "" : "&sp=desktop";
                return await fetch(`${Vb}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${ha}${i}`, {
                    method: "POST",
                    body: JSON.stringify(r)
                });
            }), qe(this, "getAppDomain", ()=>Kd().url), this.logger = ct(s, this.context), this.telemetryEnabled = n, n ? this.restore().then(async ()=>{
                await this.submit(), this.setEventListeners();
            }) : this.persist();
        }
        get storageKey() {
            return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
        }
    }
    var HE = Object.defineProperty, Wl = Object.getOwnPropertySymbols, VE = Object.prototype.hasOwnProperty, KE = Object.prototype.propertyIsEnumerable, Ca = (t, e, s)=>e in t ? HE(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, ql = (t, e)=>{
        for(var s in e || (e = {}))VE.call(e, s) && Ca(t, s, e[s]);
        if (Wl) for (var s of Wl(e))KE.call(e, s) && Ca(t, s, e[s]);
        return t;
    }, Se = (t, e, s)=>Ca(t, typeof e != "symbol" ? e + "" : e, s);
    let zE = class hu extends _f {
        constructor(e){
            var s;
            super(e), Se(this, "protocol", Yh), Se(this, "version", Jh), Se(this, "name", da), Se(this, "relayUrl"), Se(this, "projectId"), Se(this, "customStoragePrefix"), Se(this, "events", new vn.EventEmitter), Se(this, "logger"), Se(this, "heartbeat"), Se(this, "relayer"), Se(this, "crypto"), Se(this, "storage"), Se(this, "history"), Se(this, "expirer"), Se(this, "pairing"), Se(this, "verify"), Se(this, "echoClient"), Se(this, "linkModeSupportedApps"), Se(this, "eventClient"), Se(this, "initialized", !1), Se(this, "logChunkController"), Se(this, "on", (a, c)=>this.events.on(a, c)), Se(this, "once", (a, c)=>this.events.once(a, c)), Se(this, "off", (a, c)=>this.events.off(a, c)), Se(this, "removeListener", (a, c)=>this.events.removeListener(a, c)), Se(this, "dispatchEnvelope", ({ topic: a, message: c, sessionExists: l })=>{
                if (!a || !c) return;
                const d = {
                    topic: a,
                    message: c,
                    publishedAt: Date.now(),
                    transportType: ke.link_mode
                };
                this.relayer.onLinkMessageEvent(d, {
                    sessionExists: l
                });
            });
            const n = this.getGlobalCore(e?.customStoragePrefix);
            if (n) try {
                return this.customStoragePrefix = n.customStoragePrefix, this.logger = n.logger, this.heartbeat = n.heartbeat, this.crypto = n.crypto, this.history = n.history, this.expirer = n.expirer, this.storage = n.storage, this.relayer = n.relayer, this.pairing = n.pairing, this.verify = n.verify, this.echoClient = n.echoClient, this.linkModeSupportedApps = n.linkModeSupportedApps, this.eventClient = n.eventClient, this.initialized = n.initialized, this.logChunkController = n.logChunkController, n;
            } catch (a) {
                console.warn("Failed to copy global core", a);
            }
            this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || Zh, this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
            const r = Kr({
                level: typeof e?.logger == "string" && e.logger ? e.logger : ub.logger,
                name: da
            }), { logger: i, chunkLoggerController: o } = Hd({
                opts: r,
                maxSizeInBytes: e?.maxLogBlobSizeInBytes,
                loggerOverride: e?.logger
            });
            this.logChunkController = o, (s = this.logChunkController) != null && s.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async ()=>{
                var a, c;
                (a = this.logChunkController) != null && a.downloadLogsBlobInBrowser && ((c = this.logChunkController) == null || c.downloadLogsBlobInBrowser({
                    clientId: await this.crypto.getClientId()
                }));
            }), this.logger = ct(i, this.name), this.heartbeat = new Yu, this.crypto = new CC(this, this.logger, e?.keychain), this.history = new OE(this, this.logger), this.expirer = new xE(this, this.logger), this.storage = e != null && e.storage ? e.storage : new Ju(ql(ql({}, pb), e?.storageOptions)), this.relayer = new zC({
                core: this,
                logger: this.logger,
                relayUrl: this.relayUrl,
                projectId: this.projectId
            }), this.pairing = new SE(this, this.logger), this.verify = new DE(this, this.logger, this.storage), this.echoClient = new BE(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new qE(this, this.logger, e?.telemetryEnabled), this.setGlobalCore(this);
        }
        static async init(e) {
            const s = new hu(e);
            await s.initialize();
            const n = await s.crypto.getClientId();
            return await s.storage.setItem(Sb, n), s;
        }
        get context() {
            return bt(this.logger);
        }
        async start() {
            this.initialized || await this.initialize();
        }
        async getLogsBlob() {
            var e;
            return (e = this.logChunkController) == null ? void 0 : e.logsToBlob({
                clientId: await this.crypto.getClientId()
            });
        }
        async addLinkModeSupportedApp(e) {
            this.linkModeSupportedApps.includes(e) || (this.linkModeSupportedApps.push(e), await this.storage.setItem(El, this.linkModeSupportedApps));
        }
        async initialize() {
            this.logger.trace("Initialized");
            try {
                await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem(El) || [], this.initialized = !0, this.logger.info("Core Initialization Success");
            } catch (e) {
                throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
            }
        }
        getGlobalCore(e = "") {
            try {
                if (this.isGlobalCoreDisabled()) return;
                const s = `_walletConnectCore_${e}`, n = `${s}_count`;
                return globalThis[n] = (globalThis[n] || 0) + 1, globalThis[n] > 1 && console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[n]} times.`), globalThis[s];
            } catch (s) {
                console.warn("Failed to get global WalletConnect core", s);
                return;
            }
        }
        setGlobalCore(e) {
            var s;
            try {
                if (this.isGlobalCoreDisabled()) return;
                const n = `_walletConnectCore_${((s = e.opts) == null ? void 0 : s.customStoragePrefix) || ""}`;
                globalThis[n] = e;
            } catch (n) {
                console.warn("Failed to set global WalletConnect core", n);
            }
        }
        isGlobalCoreDisabled() {
            try {
                return typeof process < "u" && hb.DISABLE_GLOBAL_CORE === "true";
            } catch  {
                return !0;
            }
        }
    };
    const GE = zE, uu = "wc", pu = 2, fu = "client", za = `${uu}@${pu}:${fu}:`, ko = {
        name: fu,
        logger: "error"
    }, Hl = "WALLETCONNECT_DEEPLINK_CHOICE", YE = "proposal", Vl = "Proposal expired", JE = "session", $n = W.SEVEN_DAYS, XE = "engine", Ge = {
        wc_sessionPropose: {
            req: {
                ttl: W.FIVE_MINUTES,
                prompt: !0,
                tag: 1100
            },
            res: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1101
            },
            reject: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1120
            },
            autoReject: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1121
            }
        },
        wc_sessionSettle: {
            req: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1102
            },
            res: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1103
            }
        },
        wc_sessionUpdate: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1104
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1105
            }
        },
        wc_sessionExtend: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1106
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1107
            }
        },
        wc_sessionRequest: {
            req: {
                ttl: W.FIVE_MINUTES,
                prompt: !0,
                tag: 1108
            },
            res: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1109
            }
        },
        wc_sessionEvent: {
            req: {
                ttl: W.FIVE_MINUTES,
                prompt: !0,
                tag: 1110
            },
            res: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1111
            }
        },
        wc_sessionDelete: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1112
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1113
            }
        },
        wc_sessionPing: {
            req: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1114
            },
            res: {
                ttl: W.ONE_DAY,
                prompt: !1,
                tag: 1115
            }
        },
        wc_sessionAuthenticate: {
            req: {
                ttl: W.ONE_HOUR,
                prompt: !0,
                tag: 1116
            },
            res: {
                ttl: W.ONE_HOUR,
                prompt: !1,
                tag: 1117
            },
            reject: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1118
            },
            autoReject: {
                ttl: W.FIVE_MINUTES,
                prompt: !1,
                tag: 1119
            }
        }
    }, Oo = {
        min: W.FIVE_MINUTES,
        max: W.SEVEN_DAYS
    }, Zt = {
        idle: "IDLE",
        active: "ACTIVE"
    }, ZE = {
        eth_sendTransaction: {
            key: ""
        },
        eth_sendRawTransaction: {
            key: ""
        },
        wallet_sendCalls: {
            key: ""
        },
        solana_signTransaction: {
            key: "signature"
        },
        solana_signAllTransactions: {
            key: "transactions"
        },
        solana_signAndSendTransaction: {
            key: "signature"
        },
        sui_signAndExecuteTransaction: {
            key: "digest"
        },
        sui_signTransaction: {
            key: ""
        },
        hedera_signAndExecuteTransaction: {
            key: "transactionId"
        },
        hedera_executeTransaction: {
            key: "transactionId"
        },
        near_signTransaction: {
            key: ""
        },
        near_signTransactions: {
            key: ""
        },
        tron_signTransaction: {
            key: "txID"
        },
        xrpl_signTransaction: {
            key: ""
        },
        xrpl_signTransactionFor: {
            key: ""
        },
        algo_signTxn: {
            key: ""
        },
        sendTransfer: {
            key: "txid"
        },
        stacks_stxTransfer: {
            key: "txId"
        },
        polkadot_signTransaction: {
            key: ""
        },
        cosmos_signDirect: {
            key: ""
        }
    }, QE = "request", ev = [
        "wc_sessionPropose",
        "wc_sessionRequest",
        "wc_authRequest",
        "wc_sessionAuthenticate"
    ], tv = "wc", sv = "auth", nv = "authKeys", rv = "pairingTopics", iv = "requests", so = `${tv}@${1.5}:${sv}:`, Ei = `${so}:PUB_KEY`;
    var ov = Object.defineProperty, av = Object.defineProperties, cv = Object.getOwnPropertyDescriptors, Kl = Object.getOwnPropertySymbols, lv = Object.prototype.hasOwnProperty, dv = Object.prototype.propertyIsEnumerable, Ea = (t, e, s)=>e in t ? ov(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Ie = (t, e)=>{
        for(var s in e || (e = {}))lv.call(e, s) && Ea(t, s, e[s]);
        if (Kl) for (var s of Kl(e))dv.call(e, s) && Ea(t, s, e[s]);
        return t;
    }, nt = (t, e)=>av(t, cv(e)), x = (t, e, s)=>Ea(t, typeof e != "symbol" ? e + "" : e, s);
    class hv extends qf {
        constructor(e){
            super(e), x(this, "name", XE), x(this, "events", new Pa), x(this, "initialized", !1), x(this, "requestQueue", {
                state: Zt.idle,
                queue: []
            }), x(this, "sessionRequestQueue", {
                state: Zt.idle,
                queue: []
            }), x(this, "emittedSessionRequests", new wg({
                limit: 500
            })), x(this, "requestQueueDelay", W.ONE_SECOND), x(this, "expectedPairingMethodMap", new Map), x(this, "recentlyDeletedMap", new Map), x(this, "recentlyDeletedLimit", 200), x(this, "relayMessageCache", []), x(this, "pendingSessions", new Map), x(this, "init", async ()=>{
                this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({
                    methods: Object.keys(Ge)
                }), this.initialized = !0, setTimeout(async ()=>{
                    await this.processPendingMessageEvents(), this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
                }, W.toMiliseconds(this.requestQueueDelay)));
            }), x(this, "connect", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                const n = nt(Ie({}, s), {
                    requiredNamespaces: s.requiredNamespaces || {},
                    optionalNamespaces: s.optionalNamespaces || {}
                });
                await this.isValidConnect(n), n.optionalNamespaces = Iy(n.requiredNamespaces, n.optionalNamespaces), n.requiredNamespaces = {};
                const { pairingTopic: r, requiredNamespaces: i, optionalNamespaces: o, sessionProperties: a, scopedProperties: c, relays: l } = n;
                let d = r, h, u = !1;
                try {
                    if (d) {
                        const b = this.client.core.pairing.pairings.get(d);
                        this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."), u = b.active;
                    }
                } catch (b) {
                    throw this.client.logger.error(`connect() -> pairing.get(${d}) failed`), b;
                }
                if (!d || !u) {
                    const { topic: b, uri: R } = await this.client.core.pairing.create({
                        internal: {
                            skipSubscribe: !0
                        }
                    });
                    d = b, h = R;
                }
                if (!d) {
                    const { message: b } = F("NO_MATCHING_KEY", `connect() pairing topic: ${d}`);
                    throw new Error(b);
                }
                const f = await this.client.core.crypto.generateKeyPair(), g = Ge.wc_sessionPropose.req.ttl || W.FIVE_MINUTES, w = Me(g), m = nt(Ie(Ie({
                    requiredNamespaces: i,
                    optionalNamespaces: o,
                    relays: l ?? [
                        {
                            protocol: Xh
                        }
                    ],
                    proposer: {
                        publicKey: f,
                        metadata: this.client.metadata
                    },
                    expiryTimestamp: w,
                    pairingTopic: d
                }, a && {
                    sessionProperties: a
                }), c && {
                    scopedProperties: c
                }), {
                    id: ks()
                }), A = Ae("session_connect", m.id), { reject: v, resolve: P, done: j } = on(g, Vl), G = ({ id: b })=>{
                    b === m.id && (this.client.events.off("proposal_expire", G), this.pendingSessions.delete(m.id), this.events.emit(A, {
                        error: {
                            message: Vl,
                            code: 0
                        }
                    }));
                };
                return this.client.events.on("proposal_expire", G), this.events.once(A, ({ error: b, session: R })=>{
                    this.client.events.off("proposal_expire", G), b ? v(b) : R && P(R);
                }), await this.sendProposeSession({
                    proposal: m,
                    publishOpts: {
                        internal: {
                            throwOnFailedPublish: !0
                        },
                        tvf: {
                            correlationId: m.id
                        }
                    }
                }), await this.setProposal(m.id, m), {
                    uri: h,
                    approval: j
                };
            }), x(this, "pair", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                try {
                    return await this.client.core.pairing.pair(s);
                } catch (n) {
                    throw this.client.logger.error("pair() failed"), n;
                }
            }), x(this, "approve", async (s)=>{
                var n, r, i;
                const o = this.client.core.eventClient.createEvent({
                    properties: {
                        topic: (n = s?.id) == null ? void 0 : n.toString(),
                        trace: [
                            Ms.session_approve_started
                        ]
                    }
                });
                try {
                    this.isInitialized(), await this.confirmOnlineStateOrThrow();
                } catch (N) {
                    throw o.setError(ur.no_internet_connection), N;
                }
                try {
                    await this.isValidProposalId(s?.id);
                } catch (N) {
                    throw this.client.logger.error(`approve() -> proposal.get(${s?.id}) failed`), o.setError(ur.proposal_not_found), N;
                }
                try {
                    await this.isValidApprove(s);
                } catch (N) {
                    throw this.client.logger.error("approve() -> isValidApprove() failed"), o.setError(ur.session_approve_namespace_validation_failure), N;
                }
                const { id: a, relayProtocol: c, namespaces: l, sessionProperties: d, scopedProperties: h, sessionConfig: u } = s, f = this.client.proposal.get(a);
                this.client.core.eventClient.deleteEvent({
                    eventId: o.eventId
                });
                const { pairingTopic: g, proposer: w, requiredNamespaces: m, optionalNamespaces: A } = f;
                let v = (r = this.client.core.eventClient) == null ? void 0 : r.getEvent({
                    topic: g
                });
                v || (v = (i = this.client.core.eventClient) == null ? void 0 : i.createEvent({
                    type: Ms.session_approve_started,
                    properties: {
                        topic: g,
                        trace: [
                            Ms.session_approve_started,
                            Ms.session_namespaces_validation_success
                        ]
                    }
                }));
                const P = await this.client.core.crypto.generateKeyPair(), j = w.publicKey, G = await this.client.core.crypto.generateSharedKey(P, j), b = Ie(Ie(Ie({
                    relay: {
                        protocol: c ?? "irn"
                    },
                    namespaces: l,
                    controller: {
                        publicKey: P,
                        metadata: this.client.metadata
                    },
                    expiry: Me($n)
                }, d && {
                    sessionProperties: d
                }), h && {
                    scopedProperties: h
                }), u && {
                    sessionConfig: u
                }), R = ke.relay;
                v.addTrace(Ms.subscribing_session_topic);
                try {
                    await this.client.core.relayer.subscribe(G, {
                        transportType: R,
                        internal: {
                            skipSubscribe: !0
                        }
                    });
                } catch (N) {
                    throw v.setError(ur.subscribe_session_topic_failure), N;
                }
                v.addTrace(Ms.subscribe_session_topic_success);
                const U = nt(Ie({}, b), {
                    topic: G,
                    requiredNamespaces: m,
                    optionalNamespaces: A,
                    pairingTopic: g,
                    acknowledged: !1,
                    self: b.controller,
                    peer: {
                        publicKey: w.publicKey,
                        metadata: w.metadata
                    },
                    controller: P,
                    transportType: ke.relay
                });
                await this.client.session.set(G, U), v.addTrace(Ms.store_session);
                try {
                    await this.sendApproveSession({
                        sessionTopic: G,
                        proposal: f,
                        pairingProposalResponse: {
                            relay: {
                                protocol: c ?? "irn"
                            },
                            responderPublicKey: P
                        },
                        sessionSettleRequest: b,
                        publishOpts: {
                            internal: {
                                throwOnFailedPublish: !0
                            },
                            tvf: {
                                correlationId: a
                            }
                        }
                    }), v.addTrace(Ms.session_approve_publish_success);
                } catch (N) {
                    throw this.client.logger.error(N), this.client.session.delete(G, Re("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(G), N;
                }
                return this.client.core.eventClient.deleteEvent({
                    eventId: v.eventId
                }), await this.client.core.pairing.updateMetadata({
                    topic: g,
                    metadata: w.metadata
                }), await this.deleteProposal(a), await this.client.core.pairing.activate({
                    topic: g
                }), await this.setExpiry(G, Me($n)), {
                    topic: G,
                    acknowledged: ()=>Promise.resolve(this.client.session.get(G))
                };
            }), x(this, "reject", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                try {
                    await this.isValidReject(s);
                } catch (o) {
                    throw this.client.logger.error("reject() -> isValidReject() failed"), o;
                }
                const { id: n, reason: r } = s;
                let i;
                try {
                    i = this.client.proposal.get(n).pairingTopic;
                } catch (o) {
                    throw this.client.logger.error(`reject() -> proposal.get(${n}) failed`), o;
                }
                i && await this.sendError({
                    id: n,
                    topic: i,
                    error: r,
                    rpcOpts: Ge.wc_sessionPropose.reject
                }), await this.deleteProposal(n);
            }), x(this, "update", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                try {
                    await this.isValidUpdate(s);
                } catch (h) {
                    throw this.client.logger.error("update() -> isValidUpdate() failed"), h;
                }
                const { topic: n, namespaces: r } = s, { done: i, resolve: o, reject: a } = on(), c = ks(), l = dn().toString(), d = this.client.session.get(n).namespaces;
                return this.events.once(Ae("session_update", c), ({ error: h })=>{
                    h ? a(h) : o();
                }), await this.client.session.update(n, {
                    namespaces: r
                }), await this.sendRequest({
                    topic: n,
                    method: "wc_sessionUpdate",
                    params: {
                        namespaces: r
                    },
                    throwOnFailedPublish: !0,
                    clientRpcId: c,
                    relayRpcId: l
                }).catch((h)=>{
                    this.client.logger.error(h), this.client.session.update(n, {
                        namespaces: d
                    }), a(h);
                }), {
                    acknowledged: i
                };
            }), x(this, "extend", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                try {
                    await this.isValidExtend(s);
                } catch (c) {
                    throw this.client.logger.error("extend() -> isValidExtend() failed"), c;
                }
                const { topic: n } = s, r = ks(), { done: i, resolve: o, reject: a } = on();
                return this.events.once(Ae("session_extend", r), ({ error: c })=>{
                    c ? a(c) : o();
                }), await this.setExpiry(n, Me($n)), this.sendRequest({
                    topic: n,
                    method: "wc_sessionExtend",
                    params: {},
                    clientRpcId: r,
                    throwOnFailedPublish: !0
                }).catch((c)=>{
                    a(c);
                }), {
                    acknowledged: i
                };
            }), x(this, "request", async (s)=>{
                this.isInitialized();
                try {
                    await this.isValidRequest(s);
                } catch (m) {
                    throw this.client.logger.error("request() -> isValidRequest() failed"), m;
                }
                const { chainId: n, request: r, topic: i, expiry: o = Ge.wc_sessionRequest.req.ttl } = s, a = this.client.session.get(i);
                a?.transportType === ke.relay && await this.confirmOnlineStateOrThrow();
                const c = ks(), l = dn().toString(), { done: d, resolve: h, reject: u } = on(o, "Request expired. Please try again.");
                this.events.once(Ae("session_request", c), ({ error: m, result: A })=>{
                    m ? u(m) : h(A);
                });
                const f = "wc_sessionRequest", g = this.getAppLinkIfEnabled(a.peer.metadata, a.transportType);
                if (g) return await this.sendRequest({
                    clientRpcId: c,
                    relayRpcId: l,
                    topic: i,
                    method: f,
                    params: {
                        request: nt(Ie({}, r), {
                            expiryTimestamp: Me(o)
                        }),
                        chainId: n
                    },
                    expiry: o,
                    throwOnFailedPublish: !0,
                    appLink: g
                }).catch((m)=>u(m)), this.client.events.emit("session_request_sent", {
                    topic: i,
                    request: r,
                    chainId: n,
                    id: c
                }), await d();
                const w = {
                    request: nt(Ie({}, r), {
                        expiryTimestamp: Me(o)
                    }),
                    chainId: n
                };
                return await Promise.all([
                    new Promise(async (m)=>{
                        await this.sendRequest({
                            clientRpcId: c,
                            relayRpcId: l,
                            topic: i,
                            method: f,
                            params: w,
                            expiry: o,
                            throwOnFailedPublish: !0,
                            tvf: this.getTVFParams(c, w)
                        }).catch((A)=>u(A)), this.client.events.emit("session_request_sent", {
                            topic: i,
                            request: r,
                            chainId: n,
                            id: c
                        }), m();
                    }),
                    new Promise(async (m)=>{
                        var A;
                        if (!((A = a.sessionConfig) != null && A.disableDeepLink)) {
                            const v = await ug(this.client.core.storage, Hl);
                            await lg({
                                id: c,
                                topic: i,
                                wcDeepLink: v
                            });
                        }
                        m();
                    }),
                    d()
                ]).then((m)=>m[2]);
            }), x(this, "respond", async (s)=>{
                this.isInitialized(), await this.isValidRespond(s);
                const { topic: n, response: r } = s, { id: i } = r, o = this.client.session.get(n);
                o.transportType === ke.relay && await this.confirmOnlineStateOrThrow();
                const a = this.getAppLinkIfEnabled(o.peer.metadata, o.transportType);
                ps(r) ? await this.sendResult({
                    id: i,
                    topic: n,
                    result: r.result,
                    throwOnFailedPublish: !0,
                    appLink: a
                }) : es(r) && await this.sendError({
                    id: i,
                    topic: n,
                    error: r.error,
                    appLink: a
                }), this.cleanupAfterResponse(s);
            }), x(this, "ping", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow();
                try {
                    await this.isValidPing(s);
                } catch (r) {
                    throw this.client.logger.error("ping() -> isValidPing() failed"), r;
                }
                const { topic: n } = s;
                if (this.client.session.keys.includes(n)) {
                    const r = ks(), i = dn().toString(), { done: o, resolve: a, reject: c } = on();
                    this.events.once(Ae("session_ping", r), ({ error: l })=>{
                        l ? c(l) : a();
                    }), await Promise.all([
                        this.sendRequest({
                            topic: n,
                            method: "wc_sessionPing",
                            params: {},
                            throwOnFailedPublish: !0,
                            clientRpcId: r,
                            relayRpcId: i
                        }),
                        o()
                    ]);
                } else this.client.core.pairing.pairings.keys.includes(n) && (this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."), await this.client.core.pairing.ping({
                    topic: n
                }));
            }), x(this, "emit", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(s);
                const { topic: n, event: r, chainId: i } = s, o = dn().toString(), a = ks();
                await this.sendRequest({
                    topic: n,
                    method: "wc_sessionEvent",
                    params: {
                        event: r,
                        chainId: i
                    },
                    throwOnFailedPublish: !0,
                    relayRpcId: o,
                    clientRpcId: a
                });
            }), x(this, "disconnect", async (s)=>{
                this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(s);
                const { topic: n } = s;
                if (this.client.session.keys.includes(n)) await this.sendRequest({
                    topic: n,
                    method: "wc_sessionDelete",
                    params: Re("USER_DISCONNECTED"),
                    throwOnFailedPublish: !0
                }), await this.deleteSession({
                    topic: n,
                    emitEvent: !1
                });
                else if (this.client.core.pairing.pairings.keys.includes(n)) await this.client.core.pairing.disconnect({
                    topic: n
                });
                else {
                    const { message: r } = F("MISMATCHED_TOPIC", `Session or pairing topic not found: ${n}`);
                    throw new Error(r);
                }
            }), x(this, "find", (s)=>(this.isInitialized(), this.client.session.getAll().filter((n)=>Sy(n, s)))), x(this, "getPendingSessionRequests", ()=>this.client.pendingRequest.getAll()), x(this, "authenticate", async (s, n)=>{
                var r;
                this.isInitialized(), this.isValidAuthenticate(s);
                const i = n && this.client.core.linkModeSupportedApps.includes(n) && ((r = this.client.metadata.redirect) == null ? void 0 : r.linkMode), o = i ? ke.link_mode : ke.relay;
                o === ke.relay && await this.confirmOnlineStateOrThrow();
                const { chains: a, statement: c = "", uri: l, domain: d, nonce: h, type: u, exp: f, nbf: g, methods: w = [], expiry: m } = s, A = [
                    ...s.resources || []
                ], { topic: v, uri: P } = await this.client.core.pairing.create({
                    methods: [
                        "wc_sessionAuthenticate"
                    ],
                    transportType: o
                });
                this.client.logger.info({
                    message: "Generated new pairing",
                    pairing: {
                        topic: v,
                        uri: P
                    }
                });
                const j = await this.client.core.crypto.generateKeyPair(), G = bi(j);
                if (await Promise.all([
                    this.client.auth.authKeys.set(Ei, {
                        responseTopic: G,
                        publicKey: j
                    }),
                    this.client.auth.pairingTopics.set(G, {
                        topic: G,
                        pairingTopic: v
                    })
                ]), await this.client.core.relayer.subscribe(G, {
                    transportType: o
                }), this.client.logger.info(`sending request to new pairing topic: ${v}`), w.length > 0) {
                    const { namespace: I } = As(a[0]);
                    let T = Tm(I, "request", w);
                    yi(A) && (T = Om(T, A.pop())), A.push(T);
                }
                const b = m && m > Ge.wc_sessionAuthenticate.req.ttl ? m : Ge.wc_sessionAuthenticate.req.ttl, R = {
                    authPayload: {
                        type: u ?? "caip122",
                        chains: a,
                        statement: c,
                        aud: l,
                        domain: d,
                        version: "1",
                        nonce: h,
                        iat: new Date().toISOString(),
                        exp: f,
                        nbf: g,
                        resources: A
                    },
                    requester: {
                        publicKey: j,
                        metadata: this.client.metadata
                    },
                    expiryTimestamp: Me(b)
                }, U = {
                    eip155: {
                        chains: a,
                        methods: [
                            ...new Set([
                                "personal_sign",
                                ...w
                            ])
                        ],
                        events: [
                            "chainChanged",
                            "accountsChanged"
                        ]
                    }
                }, N = {
                    requiredNamespaces: {},
                    optionalNamespaces: U,
                    relays: [
                        {
                            protocol: "irn"
                        }
                    ],
                    pairingTopic: v,
                    proposer: {
                        publicKey: j,
                        metadata: this.client.metadata
                    },
                    expiryTimestamp: Me(Ge.wc_sessionPropose.req.ttl),
                    id: ks()
                }, { done: M, resolve: Y, reject: O } = on(b, "Request expired"), C = ks(), y = Ae("session_connect", N.id), E = Ae("session_request", C), k = async ({ error: I, session: T })=>{
                    this.events.off(E, D), I ? O(I) : T && Y({
                        session: T
                    });
                }, D = async (I)=>{
                    var T, V, K;
                    if (await this.deletePendingAuthRequest(C, {
                        message: "fulfilled",
                        code: 0
                    }), I.error) {
                        const he = Re("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
                        return I.error.code === he.code ? void 0 : (this.events.off(y, k), O(I.error.message));
                    }
                    await this.deleteProposal(N.id), this.events.off(y, k);
                    const { cacaos: ae, responder: oe } = I.result, ne = [], ie = [];
                    for (const he of ae){
                        await Fc({
                            cacao: he,
                            projectId: this.client.core.projectId
                        }) || (this.client.logger.error(he, "Signature verification failed"), O(Re("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
                        const { p: Ue } = he, Ft = yi(Ue.resources), Ts = [
                            Zo(Ue.iss)
                        ], Zs = Ui(Ue.iss);
                        if (Ft) {
                            const Tn = jc(Ft), Mu = Wc(Ft);
                            ne.push(...Tn), Ts.push(...Mu);
                        }
                        for (const Tn of Ts)ie.push(`${Tn}:${Zs}`);
                    }
                    const de = await this.client.core.crypto.generateSharedKey(j, oe.publicKey);
                    let Te;
                    ne.length > 0 && (Te = {
                        topic: de,
                        acknowledged: !0,
                        self: {
                            publicKey: j,
                            metadata: this.client.metadata
                        },
                        peer: oe,
                        controller: oe.publicKey,
                        expiry: Me($n),
                        requiredNamespaces: {},
                        optionalNamespaces: {},
                        relay: {
                            protocol: "irn"
                        },
                        pairingTopic: v,
                        namespaces: fl([
                            ...new Set(ne)
                        ], [
                            ...new Set(ie)
                        ]),
                        transportType: o
                    }, await this.client.core.relayer.subscribe(de, {
                        transportType: o
                    }), await this.client.session.set(de, Te), v && await this.client.core.pairing.updateMetadata({
                        topic: v,
                        metadata: oe.metadata
                    }), Te = this.client.session.get(de)), (T = this.client.metadata.redirect) != null && T.linkMode && (V = oe.metadata.redirect) != null && V.linkMode && (K = oe.metadata.redirect) != null && K.universal && n && (this.client.core.addLinkModeSupportedApp(oe.metadata.redirect.universal), this.client.session.update(de, {
                        transportType: ke.link_mode
                    })), Y({
                        auths: ae,
                        session: Te
                    });
                };
                this.events.once(y, k), this.events.once(E, D);
                let B;
                try {
                    if (i) {
                        const I = ts("wc_sessionAuthenticate", R, C);
                        this.client.core.history.set(v, I);
                        const T = await this.client.core.crypto.encode("", I, {
                            type: Xr,
                            encoding: qs
                        });
                        B = di(n, v, T);
                    } else await Promise.all([
                        this.sendRequest({
                            topic: v,
                            method: "wc_sessionAuthenticate",
                            params: R,
                            expiry: s.expiry,
                            throwOnFailedPublish: !0,
                            clientRpcId: C
                        }),
                        this.sendRequest({
                            topic: v,
                            method: "wc_sessionPropose",
                            params: N,
                            expiry: Ge.wc_sessionPropose.req.ttl,
                            throwOnFailedPublish: !0,
                            clientRpcId: N.id
                        })
                    ]);
                } catch (I) {
                    throw this.events.off(y, k), this.events.off(E, D), I;
                }
                return await this.setProposal(N.id, N), await this.setAuthRequest(C, {
                    request: nt(Ie({}, R), {
                        verifyContext: {}
                    }),
                    pairingTopic: v,
                    transportType: o
                }), {
                    uri: B ?? P,
                    response: M
                };
            }), x(this, "approveSessionAuthenticate", async (s)=>{
                const { id: n, auths: r } = s, i = this.client.core.eventClient.createEvent({
                    properties: {
                        topic: n.toString(),
                        trace: [
                            en.authenticated_session_approve_started
                        ]
                    }
                });
                try {
                    this.isInitialized();
                } catch (m) {
                    throw i.setError(pr.no_internet_connection), m;
                }
                const o = this.getPendingAuthRequest(n);
                if (!o) throw i.setError(pr.authenticated_session_pending_request_not_found), new Error(`Could not find pending auth request with id ${n}`);
                const a = o.transportType || ke.relay;
                a === ke.relay && await this.confirmOnlineStateOrThrow();
                const c = o.requester.publicKey, l = await this.client.core.crypto.generateKeyPair(), d = bi(c), h = {
                    type: Is,
                    receiverPublicKey: c,
                    senderPublicKey: l
                }, u = [], f = [];
                for (const m of r){
                    if (!await Fc({
                        cacao: m,
                        projectId: this.client.core.projectId
                    })) {
                        i.setError(pr.invalid_cacao);
                        const G = Re("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
                        throw await this.sendError({
                            id: n,
                            topic: d,
                            error: G,
                            encodeOpts: h
                        }), new Error(G.message);
                    }
                    i.addTrace(en.cacaos_verified);
                    const { p: A } = m, v = yi(A.resources), P = [
                        Zo(A.iss)
                    ], j = Ui(A.iss);
                    if (v) {
                        const G = jc(v), b = Wc(v);
                        u.push(...G), P.push(...b);
                    }
                    for (const G of P)f.push(`${G}:${j}`);
                }
                const g = await this.client.core.crypto.generateSharedKey(l, c);
                i.addTrace(en.create_authenticated_session_topic);
                let w;
                if (u?.length > 0) {
                    w = {
                        topic: g,
                        acknowledged: !0,
                        self: {
                            publicKey: l,
                            metadata: this.client.metadata
                        },
                        peer: {
                            publicKey: c,
                            metadata: o.requester.metadata
                        },
                        controller: c,
                        expiry: Me($n),
                        authentication: r,
                        requiredNamespaces: {},
                        optionalNamespaces: {},
                        relay: {
                            protocol: "irn"
                        },
                        pairingTopic: o.pairingTopic,
                        namespaces: fl([
                            ...new Set(u)
                        ], [
                            ...new Set(f)
                        ]),
                        transportType: a
                    }, i.addTrace(en.subscribing_authenticated_session_topic);
                    try {
                        await this.client.core.relayer.subscribe(g, {
                            transportType: a
                        });
                    } catch (m) {
                        throw i.setError(pr.subscribe_authenticated_session_topic_failure), m;
                    }
                    i.addTrace(en.subscribe_authenticated_session_topic_success), await this.client.session.set(g, w), i.addTrace(en.store_authenticated_session), await this.client.core.pairing.updateMetadata({
                        topic: o.pairingTopic,
                        metadata: o.requester.metadata
                    });
                }
                i.addTrace(en.publishing_authenticated_session_approve);
                try {
                    await this.sendResult({
                        topic: d,
                        id: n,
                        result: {
                            cacaos: r,
                            responder: {
                                publicKey: l,
                                metadata: this.client.metadata
                            }
                        },
                        encodeOpts: h,
                        throwOnFailedPublish: !0,
                        appLink: this.getAppLinkIfEnabled(o.requester.metadata, a)
                    });
                } catch (m) {
                    throw i.setError(pr.authenticated_session_approve_publish_failure), m;
                }
                return await this.client.auth.requests.delete(n, {
                    message: "fulfilled",
                    code: 0
                }), await this.client.core.pairing.activate({
                    topic: o.pairingTopic
                }), this.client.core.eventClient.deleteEvent({
                    eventId: i.eventId
                }), {
                    session: w
                };
            }), x(this, "rejectSessionAuthenticate", async (s)=>{
                this.isInitialized();
                const { id: n, reason: r } = s, i = this.getPendingAuthRequest(n);
                if (!i) throw new Error(`Could not find pending auth request with id ${n}`);
                i.transportType === ke.relay && await this.confirmOnlineStateOrThrow();
                const o = i.requester.publicKey, a = await this.client.core.crypto.generateKeyPair(), c = bi(o), l = {
                    type: Is,
                    receiverPublicKey: o,
                    senderPublicKey: a
                };
                await this.sendError({
                    id: n,
                    topic: c,
                    error: r,
                    encodeOpts: l,
                    rpcOpts: Ge.wc_sessionAuthenticate.reject,
                    appLink: this.getAppLinkIfEnabled(i.requester.metadata, i.transportType)
                }), await this.client.auth.requests.delete(n, {
                    message: "rejected",
                    code: 0
                }), await this.deleteProposal(n);
            }), x(this, "formatAuthMessage", (s)=>{
                this.isInitialized();
                const { request: n, iss: r } = s;
                return hh(n, r);
            }), x(this, "processRelayMessageCache", ()=>{
                setTimeout(async ()=>{
                    if (this.relayMessageCache.length !== 0) for(; this.relayMessageCache.length > 0;)try {
                        const s = this.relayMessageCache.shift();
                        s && await this.onRelayMessage(s);
                    } catch (s) {
                        this.client.logger.error(s);
                    }
                }, 50);
            }), x(this, "cleanupDuplicatePairings", async (s)=>{
                if (s.pairingTopic) try {
                    const n = this.client.core.pairing.pairings.get(s.pairingTopic), r = this.client.core.pairing.pairings.getAll().filter((i)=>{
                        var o, a;
                        return ((o = i.peerMetadata) == null ? void 0 : o.url) && ((a = i.peerMetadata) == null ? void 0 : a.url) === s.peer.metadata.url && i.topic && i.topic !== n.topic;
                    });
                    if (r.length === 0) return;
                    this.client.logger.info(`Cleaning up ${r.length} duplicate pairing(s)`), await Promise.all(r.map((i)=>this.client.core.pairing.disconnect({
                            topic: i.topic
                        }))), this.client.logger.info("Duplicate pairings clean up finished");
                } catch (n) {
                    this.client.logger.error(n);
                }
            }), x(this, "deleteSession", async (s)=>{
                var n;
                const { topic: r, expirerHasDeleted: i = !1, emitEvent: o = !0, id: a = 0 } = s, { self: c } = this.client.session.get(r);
                await this.client.core.relayer.unsubscribe(r), await this.client.session.delete(r, Re("USER_DISCONNECTED")), this.addToRecentlyDeleted(r, "session"), this.client.core.crypto.keychain.has(c.publicKey) && await this.client.core.crypto.deleteKeyPair(c.publicKey), this.client.core.crypto.keychain.has(r) && await this.client.core.crypto.deleteSymKey(r), i || this.client.core.expirer.del(r), this.client.core.storage.removeItem(Hl).catch((l)=>this.client.logger.warn(l)), this.getPendingSessionRequests().forEach((l)=>{
                    l.topic === r && this.deletePendingSessionRequest(l.id, Re("USER_DISCONNECTED"));
                }), r === ((n = this.sessionRequestQueue.queue[0]) == null ? void 0 : n.topic) && (this.sessionRequestQueue.state = Zt.idle), o && this.client.events.emit("session_delete", {
                    id: a,
                    topic: r
                });
            }), x(this, "deleteProposal", async (s, n)=>{
                if (n) try {
                    const r = this.client.proposal.get(s);
                    this.client.core.eventClient.getEvent({
                        topic: r.pairingTopic
                    })?.setError(ur.proposal_expired);
                } catch  {}
                await Promise.all([
                    this.client.proposal.delete(s, Re("USER_DISCONNECTED")),
                    n ? Promise.resolve() : this.client.core.expirer.del(s)
                ]), this.addToRecentlyDeleted(s, "proposal");
            }), x(this, "deletePendingSessionRequest", async (s, n, r = !1)=>{
                await Promise.all([
                    this.client.pendingRequest.delete(s, n),
                    r ? Promise.resolve() : this.client.core.expirer.del(s)
                ]), this.addToRecentlyDeleted(s, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i)=>i.id !== s), r && (this.sessionRequestQueue.state = Zt.idle, this.client.events.emit("session_request_expire", {
                    id: s
                }));
            }), x(this, "deletePendingAuthRequest", async (s, n, r = !1)=>{
                await Promise.all([
                    this.client.auth.requests.delete(s, n),
                    r ? Promise.resolve() : this.client.core.expirer.del(s)
                ]);
            }), x(this, "setExpiry", async (s, n)=>{
                this.client.session.keys.includes(s) && (this.client.core.expirer.set(s, n), await this.client.session.update(s, {
                    expiry: n
                }));
            }), x(this, "setProposal", async (s, n)=>{
                this.client.core.expirer.set(s, Me(Ge.wc_sessionPropose.req.ttl)), await this.client.proposal.set(s, n);
            }), x(this, "setAuthRequest", async (s, n)=>{
                const { request: r, pairingTopic: i, transportType: o = ke.relay } = n;
                this.client.core.expirer.set(s, r.expiryTimestamp), await this.client.auth.requests.set(s, {
                    authPayload: r.authPayload,
                    requester: r.requester,
                    expiryTimestamp: r.expiryTimestamp,
                    id: s,
                    pairingTopic: i,
                    verifyContext: r.verifyContext,
                    transportType: o
                });
            }), x(this, "setPendingSessionRequest", async (s)=>{
                const { id: n, topic: r, params: i, verifyContext: o } = s, a = i.request.expiryTimestamp || Me(Ge.wc_sessionRequest.req.ttl);
                this.client.core.expirer.set(n, a), await this.client.pendingRequest.set(n, {
                    id: n,
                    topic: r,
                    params: i,
                    verifyContext: o
                });
            }), x(this, "sendRequest", async (s)=>{
                const { topic: n, method: r, params: i, expiry: o, relayRpcId: a, clientRpcId: c, throwOnFailedPublish: l, appLink: d, tvf: h, publishOpts: u = {} } = s, f = ts(r, i, c);
                let g;
                const w = !!d;
                try {
                    const v = w ? qs : mt;
                    g = await this.client.core.crypto.encode(n, f, {
                        encoding: v
                    });
                } catch (v) {
                    throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${n} failed`), v;
                }
                let m;
                if (ev.includes(r)) {
                    const v = $t(JSON.stringify(f)), P = $t(g);
                    m = await this.client.core.verify.register({
                        id: P,
                        decryptedId: v
                    });
                }
                const A = Ie(Ie({}, Ge[r].req), u);
                if (A.attestation = m, o && (A.ttl = o), a && (A.id = a), this.client.core.history.set(n, f), w) {
                    const v = di(d, n, g);
                    await globalThis.Linking.openURL(v, this.client.name);
                } else A.tvf = nt(Ie({}, h), {
                    correlationId: f.id
                }), l ? (A.internal = nt(Ie({}, A.internal), {
                    throwOnFailedPublish: !0
                }), await this.client.core.relayer.publish(n, g, A)) : this.client.core.relayer.publish(n, g, A).catch((v)=>this.client.logger.error(v));
                return f.id;
            }), x(this, "sendProposeSession", async (s)=>{
                const { proposal: n, publishOpts: r } = s, i = ts("wc_sessionPropose", n, n.id);
                this.client.core.history.set(n.pairingTopic, i);
                const o = await this.client.core.crypto.encode(n.pairingTopic, i, {
                    encoding: mt
                }), a = $t(JSON.stringify(i)), c = $t(o), l = await this.client.core.verify.register({
                    id: c,
                    decryptedId: a
                });
                await this.client.core.relayer.publishCustom({
                    payload: {
                        pairingTopic: n.pairingTopic,
                        sessionProposal: o
                    },
                    opts: nt(Ie({}, r), {
                        publishMethod: "wc_proposeSession",
                        attestation: l
                    })
                });
            }), x(this, "sendApproveSession", async (s)=>{
                const { sessionTopic: n, pairingProposalResponse: r, proposal: i, sessionSettleRequest: o, publishOpts: a } = s, c = Pr(i.id, r), l = await this.client.core.crypto.encode(i.pairingTopic, c, {
                    encoding: mt
                }), d = ts("wc_sessionSettle", o, a?.id), h = await this.client.core.crypto.encode(n, d, {
                    encoding: mt
                });
                this.client.core.history.set(n, d), await this.client.core.relayer.publishCustom({
                    payload: {
                        sessionTopic: n,
                        pairingTopic: i.pairingTopic,
                        sessionProposalResponse: l,
                        sessionSettlementRequest: h
                    },
                    opts: nt(Ie({}, a), {
                        publishMethod: "wc_approveSession"
                    })
                });
            }), x(this, "sendResult", async (s)=>{
                const { id: n, topic: r, result: i, throwOnFailedPublish: o, encodeOpts: a, appLink: c } = s, l = Pr(n, i);
                let d;
                const h = c && typeof globalThis?.Linking < "u";
                try {
                    const g = h ? qs : mt;
                    d = await this.client.core.crypto.encode(r, l, nt(Ie({}, a || {}), {
                        encoding: g
                    }));
                } catch (g) {
                    throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${r} failed`), g;
                }
                let u, f;
                try {
                    u = await this.client.core.history.get(r, n);
                    const g = u.request;
                    try {
                        f = this.getTVFParams(n, g.params, i);
                    } catch (w) {
                        this.client.logger.warn(`sendResult() -> getTVFParams() failed: ${w?.message}`);
                    }
                } catch (g) {
                    throw this.client.logger.error(`sendResult() -> history.get(${r}, ${n}) failed`), g;
                }
                if (h) {
                    const g = di(c, r, d);
                    await globalThis.Linking.openURL(g, this.client.name);
                } else {
                    const g = u.request.method, w = Ge[g].res;
                    w.tvf = nt(Ie({}, f), {
                        correlationId: n
                    }), o ? (w.internal = nt(Ie({}, w.internal), {
                        throwOnFailedPublish: !0
                    }), await this.client.core.relayer.publish(r, d, w)) : this.client.core.relayer.publish(r, d, w).catch((m)=>this.client.logger.error(m));
                }
                await this.client.core.history.resolve(l);
            }), x(this, "sendError", async (s)=>{
                const { id: n, topic: r, error: i, encodeOpts: o, rpcOpts: a, appLink: c } = s, l = kd(n, i);
                let d;
                const h = c && typeof globalThis?.Linking < "u";
                try {
                    const f = h ? qs : mt;
                    d = await this.client.core.crypto.encode(r, l, nt(Ie({}, o || {}), {
                        encoding: f
                    }));
                } catch (f) {
                    throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${r} failed`), f;
                }
                let u;
                try {
                    u = await this.client.core.history.get(r, n);
                } catch (f) {
                    throw this.client.logger.error(`sendError() -> history.get(${r}, ${n}) failed`), f;
                }
                if (h) {
                    const f = di(c, r, d);
                    await globalThis.Linking.openURL(f, this.client.name);
                } else {
                    const f = u.request.method, g = a || Ge[f].res;
                    this.client.core.relayer.publish(r, d, g);
                }
                await this.client.core.history.resolve(l);
            }), x(this, "cleanup", async ()=>{
                const s = [], n = [];
                this.client.session.getAll().forEach((r)=>{
                    let i = !1;
                    ss(r.expiry) && (i = !0), this.client.core.crypto.keychain.has(r.topic) || (i = !0), i && s.push(r.topic);
                }), this.client.proposal.getAll().forEach((r)=>{
                    ss(r.expiryTimestamp) && n.push(r.id);
                }), await Promise.all([
                    ...s.map((r)=>this.deleteSession({
                            topic: r
                        })),
                    ...n.map((r)=>this.deleteProposal(r))
                ]);
            }), x(this, "onProviderMessageEvent", async (s)=>{
                !this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(s) : await this.onRelayMessage(s);
            }), x(this, "onRelayEventRequest", async (s)=>{
                this.requestQueue.queue.push(s), await this.processRequestsQueue();
            }), x(this, "processRequestsQueue", async ()=>{
                if (this.requestQueue.state === Zt.active) {
                    this.client.logger.info("Request queue already active, skipping...");
                    return;
                }
                for(this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0;){
                    this.requestQueue.state = Zt.active;
                    const s = this.requestQueue.queue.shift();
                    if (s) try {
                        await this.processRequest(s);
                    } catch (n) {
                        this.client.logger.warn(n);
                    }
                }
                this.requestQueue.state = Zt.idle;
            }), x(this, "processRequest", async (s)=>{
                const { topic: n, payload: r, attestation: i, transportType: o, encryptedId: a } = s, c = r.method;
                if (!this.shouldIgnorePairingRequest({
                    topic: n,
                    requestMethod: c
                })) switch(c){
                    case "wc_sessionPropose":
                        return await this.onSessionProposeRequest({
                            topic: n,
                            payload: r,
                            attestation: i,
                            encryptedId: a
                        });
                    case "wc_sessionSettle":
                        return await this.onSessionSettleRequest(n, r);
                    case "wc_sessionUpdate":
                        return await this.onSessionUpdateRequest(n, r);
                    case "wc_sessionExtend":
                        return await this.onSessionExtendRequest(n, r);
                    case "wc_sessionPing":
                        return await this.onSessionPingRequest(n, r);
                    case "wc_sessionDelete":
                        return await this.onSessionDeleteRequest(n, r);
                    case "wc_sessionRequest":
                        return await this.onSessionRequest({
                            topic: n,
                            payload: r,
                            attestation: i,
                            encryptedId: a,
                            transportType: o
                        });
                    case "wc_sessionEvent":
                        return await this.onSessionEventRequest(n, r);
                    case "wc_sessionAuthenticate":
                        return await this.onSessionAuthenticateRequest({
                            topic: n,
                            payload: r,
                            attestation: i,
                            encryptedId: a,
                            transportType: o
                        });
                    default:
                        return this.client.logger.info(`Unsupported request method ${c}`);
                }
            }), x(this, "onRelayEventResponse", async (s)=>{
                const { topic: n, payload: r, transportType: i } = s, o = (await this.client.core.history.get(n, r.id)).request.method;
                switch(o){
                    case "wc_sessionPropose":
                        return this.onSessionProposeResponse(n, r, i);
                    case "wc_sessionSettle":
                        return this.onSessionSettleResponse(n, r);
                    case "wc_sessionUpdate":
                        return this.onSessionUpdateResponse(n, r);
                    case "wc_sessionExtend":
                        return this.onSessionExtendResponse(n, r);
                    case "wc_sessionPing":
                        return this.onSessionPingResponse(n, r);
                    case "wc_sessionRequest":
                        return this.onSessionRequestResponse(n, r);
                    case "wc_sessionAuthenticate":
                        return this.onSessionAuthenticateResponse(n, r);
                    default:
                        return this.client.logger.info(`Unsupported response method ${o}`);
                }
            }), x(this, "onRelayEventUnknownPayload", (s)=>{
                const { topic: n } = s, { message: r } = F("MISSING_OR_INVALID", `Decoded payload on topic ${n} is not identifiable as a JSON-RPC request or a response.`);
                throw new Error(r);
            }), x(this, "shouldIgnorePairingRequest", (s)=>{
                const { topic: n, requestMethod: r } = s, i = this.expectedPairingMethodMap.get(n);
                return !i || i.includes(r) ? !1 : !!(i.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
            }), x(this, "onSessionProposeRequest", async (s)=>{
                const { topic: n, payload: r, attestation: i, encryptedId: o } = s, { params: a, id: c } = r;
                try {
                    const l = this.client.core.eventClient.getEvent({
                        topic: n
                    });
                    this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), l?.setError(gs.proposal_listener_not_found)), this.isValidConnect(Ie({}, r.params));
                    const d = a.expiryTimestamp || Me(Ge.wc_sessionPropose.req.ttl), h = Ie({
                        id: c,
                        pairingTopic: n,
                        expiryTimestamp: d,
                        attestation: i,
                        encryptedId: o
                    }, a);
                    await this.setProposal(c, h);
                    const u = await this.getVerifyContext({
                        attestationId: i,
                        hash: $t(JSON.stringify(r)),
                        encryptedId: o,
                        metadata: h.proposer.metadata
                    });
                    l?.addTrace(Qt.emit_session_proposal), this.client.events.emit("session_proposal", {
                        id: c,
                        params: h,
                        verifyContext: u
                    });
                } catch (l) {
                    await this.sendError({
                        id: c,
                        topic: n,
                        error: l,
                        rpcOpts: Ge.wc_sessionPropose.autoReject
                    }), this.client.logger.error(l);
                }
            }), x(this, "onSessionProposeResponse", async (s, n, r)=>{
                const { id: i } = n;
                if (ps(n)) {
                    const { result: o } = n;
                    this.client.logger.trace({
                        type: "method",
                        method: "onSessionProposeResponse",
                        result: o
                    });
                    const a = this.client.proposal.get(i);
                    this.client.logger.trace({
                        type: "method",
                        method: "onSessionProposeResponse",
                        proposal: a
                    });
                    const c = a.proposer.publicKey;
                    this.client.logger.trace({
                        type: "method",
                        method: "onSessionProposeResponse",
                        selfPublicKey: c
                    });
                    const l = o.responderPublicKey;
                    this.client.logger.trace({
                        type: "method",
                        method: "onSessionProposeResponse",
                        peerPublicKey: l
                    });
                    const d = await this.client.core.crypto.generateSharedKey(c, l);
                    this.pendingSessions.set(i, {
                        sessionTopic: d,
                        pairingTopic: s,
                        proposalId: i,
                        publicKey: c
                    });
                    const h = await this.client.core.relayer.subscribe(d, {
                        transportType: r
                    });
                    this.client.logger.trace({
                        type: "method",
                        method: "onSessionProposeResponse",
                        subscriptionId: h
                    }), await this.client.core.pairing.activate({
                        topic: s
                    });
                } else if (es(n)) {
                    await this.deleteProposal(i);
                    const o = Ae("session_connect", i);
                    if (this.events.listenerCount(o) === 0) throw new Error(`emitting ${o} without any listeners, 954`);
                    this.events.emit(o, {
                        error: n.error
                    });
                }
            }), x(this, "onSessionSettleRequest", async (s, n)=>{
                const { id: r, params: i } = n;
                try {
                    this.isValidSessionSettleRequest(i);
                    const { relay: o, controller: a, expiry: c, namespaces: l, sessionProperties: d, scopedProperties: h, sessionConfig: u } = n.params, f = [
                        ...this.pendingSessions.values()
                    ].find((m)=>m.sessionTopic === s);
                    if (!f) return this.client.logger.error(`Pending session not found for topic ${s}`);
                    const g = this.client.proposal.get(f.proposalId), w = nt(Ie(Ie(Ie({
                        topic: s,
                        relay: o,
                        expiry: c,
                        namespaces: l,
                        acknowledged: !0,
                        pairingTopic: f.pairingTopic,
                        requiredNamespaces: g.requiredNamespaces,
                        optionalNamespaces: g.optionalNamespaces,
                        controller: a.publicKey,
                        self: {
                            publicKey: f.publicKey,
                            metadata: this.client.metadata
                        },
                        peer: {
                            publicKey: a.publicKey,
                            metadata: a.metadata
                        }
                    }, d && {
                        sessionProperties: d
                    }), h && {
                        scopedProperties: h
                    }), u && {
                        sessionConfig: u
                    }), {
                        transportType: ke.relay
                    });
                    await this.client.session.set(w.topic, w), await this.setExpiry(w.topic, w.expiry), await this.client.core.pairing.updateMetadata({
                        topic: f.pairingTopic,
                        metadata: w.peer.metadata
                    }), this.client.events.emit("session_connect", {
                        session: w
                    }), this.events.emit(Ae("session_connect", f.proposalId), {
                        session: w
                    }), this.pendingSessions.delete(f.proposalId), this.deleteProposal(f.proposalId, !1), this.cleanupDuplicatePairings(w), await this.sendResult({
                        id: n.id,
                        topic: s,
                        result: !0
                    });
                } catch (o) {
                    await this.sendError({
                        id: r,
                        topic: s,
                        error: o
                    }), this.client.logger.error(o);
                }
            }), x(this, "onSessionSettleResponse", async (s, n)=>{
                const { id: r } = n;
                ps(n) ? (await this.client.session.update(s, {
                    acknowledged: !0
                }), this.events.emit(Ae("session_approve", r), {})) : es(n) && (await this.client.session.delete(s, Re("USER_DISCONNECTED")), this.events.emit(Ae("session_approve", r), {
                    error: n.error
                }));
            }), x(this, "onSessionUpdateRequest", async (s, n)=>{
                const { params: r, id: i } = n;
                try {
                    const o = `${s}_session_update`, a = dr.get(o);
                    if (a && this.isRequestOutOfSync(a, i)) {
                        this.client.logger.warn(`Discarding out of sync request - ${i}`), this.sendError({
                            id: i,
                            topic: s,
                            error: Re("INVALID_UPDATE_REQUEST")
                        });
                        return;
                    }
                    this.isValidUpdate(Ie({
                        topic: s
                    }, r));
                    try {
                        dr.set(o, i), await this.client.session.update(s, {
                            namespaces: r.namespaces
                        }), await this.sendResult({
                            id: i,
                            topic: s,
                            result: !0
                        });
                    } catch (c) {
                        throw dr.delete(o), c;
                    }
                    this.client.events.emit("session_update", {
                        id: i,
                        topic: s,
                        params: r
                    });
                } catch (o) {
                    await this.sendError({
                        id: i,
                        topic: s,
                        error: o
                    }), this.client.logger.error(o);
                }
            }), x(this, "isRequestOutOfSync", (s, n)=>n.toString().slice(0, -3) < s.toString().slice(0, -3)), x(this, "onSessionUpdateResponse", (s, n)=>{
                const { id: r } = n, i = Ae("session_update", r);
                if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
                ps(n) ? this.events.emit(Ae("session_update", r), {}) : es(n) && this.events.emit(Ae("session_update", r), {
                    error: n.error
                });
            }), x(this, "onSessionExtendRequest", async (s, n)=>{
                const { id: r } = n;
                try {
                    this.isValidExtend({
                        topic: s
                    }), await this.setExpiry(s, Me($n)), await this.sendResult({
                        id: r,
                        topic: s,
                        result: !0
                    }), this.client.events.emit("session_extend", {
                        id: r,
                        topic: s
                    });
                } catch (i) {
                    await this.sendError({
                        id: r,
                        topic: s,
                        error: i
                    }), this.client.logger.error(i);
                }
            }), x(this, "onSessionExtendResponse", (s, n)=>{
                const { id: r } = n, i = Ae("session_extend", r);
                if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
                ps(n) ? this.events.emit(Ae("session_extend", r), {}) : es(n) && this.events.emit(Ae("session_extend", r), {
                    error: n.error
                });
            }), x(this, "onSessionPingRequest", async (s, n)=>{
                const { id: r } = n;
                try {
                    this.isValidPing({
                        topic: s
                    }), await this.sendResult({
                        id: r,
                        topic: s,
                        result: !0,
                        throwOnFailedPublish: !0
                    }), this.client.events.emit("session_ping", {
                        id: r,
                        topic: s
                    });
                } catch (i) {
                    await this.sendError({
                        id: r,
                        topic: s,
                        error: i
                    }), this.client.logger.error(i);
                }
            }), x(this, "onSessionPingResponse", (s, n)=>{
                const { id: r } = n, i = Ae("session_ping", r);
                setTimeout(()=>{
                    if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners 2176`);
                    ps(n) ? this.events.emit(Ae("session_ping", r), {}) : es(n) && this.events.emit(Ae("session_ping", r), {
                        error: n.error
                    });
                }, 500);
            }), x(this, "onSessionDeleteRequest", async (s, n)=>{
                const { id: r } = n;
                try {
                    this.isValidDisconnect({
                        topic: s,
                        reason: n.params
                    }), await Promise.all([
                        new Promise((i)=>{
                            this.client.core.relayer.once(De.publish, async ()=>{
                                i(await this.deleteSession({
                                    topic: s,
                                    id: r
                                }));
                            });
                        }),
                        this.sendResult({
                            id: r,
                            topic: s,
                            result: !0
                        }),
                        this.cleanupPendingSentRequestsForTopic({
                            topic: s,
                            error: Re("USER_DISCONNECTED")
                        })
                    ]).catch((i)=>this.client.logger.error(i));
                } catch (i) {
                    this.client.logger.error(i);
                }
            }), x(this, "onSessionRequest", async (s)=>{
                var n, r, i;
                const { topic: o, payload: a, attestation: c, encryptedId: l, transportType: d } = s, { id: h, params: u } = a;
                try {
                    await this.isValidRequest(Ie({
                        topic: o
                    }, u));
                    const f = this.client.session.get(o), g = await this.getVerifyContext({
                        attestationId: c,
                        hash: $t(JSON.stringify(ts("wc_sessionRequest", u, h))),
                        encryptedId: l,
                        metadata: f.peer.metadata,
                        transportType: d
                    }), w = {
                        id: h,
                        topic: o,
                        params: u,
                        verifyContext: g
                    };
                    await this.setPendingSessionRequest(w), d === ke.link_mode && (n = f.peer.metadata.redirect) != null && n.universal && this.client.core.addLinkModeSupportedApp((r = f.peer.metadata.redirect) == null ? void 0 : r.universal), (i = this.client.signConfig) != null && i.disableRequestQueue ? this.emitSessionRequest(w) : (this.addSessionRequestToSessionRequestQueue(w), this.processSessionRequestQueue());
                } catch (f) {
                    await this.sendError({
                        id: h,
                        topic: o,
                        error: f
                    }), this.client.logger.error(f);
                }
            }), x(this, "onSessionRequestResponse", (s, n)=>{
                const { id: r } = n, i = Ae("session_request", r);
                if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
                ps(n) ? this.events.emit(Ae("session_request", r), {
                    result: n.result
                }) : es(n) && this.events.emit(Ae("session_request", r), {
                    error: n.error
                });
            }), x(this, "onSessionEventRequest", async (s, n)=>{
                const { id: r, params: i } = n;
                try {
                    const o = `${s}_session_event_${i.event.name}`, a = dr.get(o);
                    if (a && this.isRequestOutOfSync(a, r)) {
                        this.client.logger.info(`Discarding out of sync request - ${r}`);
                        return;
                    }
                    this.isValidEmit(Ie({
                        topic: s
                    }, i)), this.client.events.emit("session_event", {
                        id: r,
                        topic: s,
                        params: i
                    }), dr.set(o, r);
                } catch (o) {
                    await this.sendError({
                        id: r,
                        topic: s,
                        error: o
                    }), this.client.logger.error(o);
                }
            }), x(this, "onSessionAuthenticateResponse", (s, n)=>{
                const { id: r } = n;
                this.client.logger.trace({
                    type: "method",
                    method: "onSessionAuthenticateResponse",
                    topic: s,
                    payload: n
                }), ps(n) ? this.events.emit(Ae("session_request", r), {
                    result: n.result
                }) : es(n) && this.events.emit(Ae("session_request", r), {
                    error: n.error
                });
            }), x(this, "onSessionAuthenticateRequest", async (s)=>{
                var n;
                const { topic: r, payload: i, attestation: o, encryptedId: a, transportType: c } = s;
                try {
                    const { requester: l, authPayload: d, expiryTimestamp: h } = i.params, u = await this.getVerifyContext({
                        attestationId: o,
                        hash: $t(JSON.stringify(i)),
                        encryptedId: a,
                        metadata: l.metadata,
                        transportType: c
                    }), f = {
                        requester: l,
                        pairingTopic: r,
                        id: i.id,
                        authPayload: d,
                        verifyContext: u,
                        expiryTimestamp: h
                    };
                    await this.setAuthRequest(i.id, {
                        request: f,
                        pairingTopic: r,
                        transportType: c
                    }), c === ke.link_mode && (n = l.metadata.redirect) != null && n.universal && this.client.core.addLinkModeSupportedApp(l.metadata.redirect.universal), this.client.events.emit("session_authenticate", {
                        topic: r,
                        params: i.params,
                        id: i.id,
                        verifyContext: u
                    });
                } catch (l) {
                    this.client.logger.error(l);
                    const d = i.params.requester.publicKey, h = await this.client.core.crypto.generateKeyPair(), u = this.getAppLinkIfEnabled(i.params.requester.metadata, c), f = {
                        type: Is,
                        receiverPublicKey: d,
                        senderPublicKey: h
                    };
                    await this.sendError({
                        id: i.id,
                        topic: r,
                        error: l,
                        encodeOpts: f,
                        rpcOpts: Ge.wc_sessionAuthenticate.autoReject,
                        appLink: u
                    });
                }
            }), x(this, "addSessionRequestToSessionRequestQueue", (s)=>{
                this.sessionRequestQueue.queue.push(s);
            }), x(this, "cleanupAfterResponse", (s)=>{
                this.deletePendingSessionRequest(s.response.id, {
                    message: "fulfilled",
                    code: 0
                }), setTimeout(()=>{
                    this.sessionRequestQueue.state = Zt.idle, this.processSessionRequestQueue();
                }, W.toMiliseconds(this.requestQueueDelay));
            }), x(this, "cleanupPendingSentRequestsForTopic", ({ topic: s, error: n })=>{
                const r = this.client.core.history.pending;
                r.length > 0 && r.filter((i)=>i.topic === s && i.request.method === "wc_sessionRequest").forEach((i)=>{
                    const o = i.request.id, a = Ae("session_request", o);
                    if (this.events.listenerCount(a) === 0) throw new Error(`emitting ${a} without any listeners`);
                    this.events.emit(Ae("session_request", i.request.id), {
                        error: n
                    });
                });
            }), x(this, "processSessionRequestQueue", ()=>{
                if (this.sessionRequestQueue.state === Zt.active) {
                    this.client.logger.info("session request queue is already active.");
                    return;
                }
                const s = this.sessionRequestQueue.queue[0];
                if (!s) {
                    this.client.logger.info("session request queue is empty.");
                    return;
                }
                try {
                    this.emitSessionRequest(s);
                } catch (n) {
                    this.client.logger.error(n);
                }
            }), x(this, "emitSessionRequest", (s)=>{
                if (this.emittedSessionRequests.has(s.id)) {
                    this.client.logger.warn({
                        id: s.id
                    }, `Skipping emitting \`session_request\` event for duplicate request. id: ${s.id}`);
                    return;
                }
                this.sessionRequestQueue.state = Zt.active, this.emittedSessionRequests.add(s.id), this.client.events.emit("session_request", s);
            }), x(this, "onPairingCreated", (s)=>{
                if (s.methods && this.expectedPairingMethodMap.set(s.topic, s.methods), s.active) return;
                const n = this.client.proposal.getAll().find((r)=>r.pairingTopic === s.topic);
                n && this.onSessionProposeRequest({
                    topic: s.topic,
                    payload: ts("wc_sessionPropose", nt(Ie({}, n), {
                        requiredNamespaces: n.requiredNamespaces,
                        optionalNamespaces: n.optionalNamespaces,
                        relays: n.relays,
                        proposer: n.proposer,
                        sessionProperties: n.sessionProperties,
                        scopedProperties: n.scopedProperties
                    }), n.id),
                    attestation: n.attestation,
                    encryptedId: n.encryptedId
                });
            }), x(this, "isValidConnect", async (s)=>{
                if (!ft(s)) {
                    const { message: l } = F("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(s)}`);
                    throw new Error(l);
                }
                const { pairingTopic: n, requiredNamespaces: r, optionalNamespaces: i, sessionProperties: o, scopedProperties: a, relays: c } = s;
                if (We(n) || await this.isValidPairingTopic(n), !By(c)) {
                    const { message: l } = F("MISSING_OR_INVALID", `connect() relays: ${c}`);
                    throw new Error(l);
                }
                if (!We(r) && ls(r) !== 0) {
                    const l = "requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";
                    [
                        "fatal",
                        "error",
                        "silent"
                    ].includes(this.client.logger.level) ? console.warn(l) : this.client.logger.warn(l), this.validateNamespaces(r, "requiredNamespaces");
                }
                if (!We(i) && ls(i) !== 0 && this.validateNamespaces(i, "optionalNamespaces"), We(o) || this.validateSessionProps(o, "sessionProperties"), !We(a)) {
                    this.validateSessionProps(a, "scopedProperties");
                    const l = Object.keys(r || {}).concat(Object.keys(i || {}));
                    if (!Object.keys(a).every((d)=>l.includes(d.split(":")[0]))) throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(a)}, required/optional namespaces: ${JSON.stringify(l)}`);
                }
            }), x(this, "validateNamespaces", (s, n)=>{
                const r = My(s, "connect()", n);
                if (r) throw new Error(r.message);
            }), x(this, "isValidApprove", async (s)=>{
                if (!ft(s)) throw new Error(F("MISSING_OR_INVALID", `approve() params: ${s}`).message);
                const { id: n, namespaces: r, relayProtocol: i, sessionProperties: o, scopedProperties: a } = s;
                this.checkRecentlyDeleted(n), await this.isValidProposalId(n);
                const c = this.client.proposal.get(n), l = Io(r, "approve()");
                if (l) throw new Error(l.message);
                const d = wl(c.requiredNamespaces, r, "approve()");
                if (d) throw new Error(d.message);
                if (!Be(i, !0)) {
                    const { message: h } = F("MISSING_OR_INVALID", `approve() relayProtocol: ${i}`);
                    throw new Error(h);
                }
                if (We(o) || this.validateSessionProps(o, "sessionProperties"), !We(a)) {
                    this.validateSessionProps(a, "scopedProperties");
                    const h = new Set(Object.keys(r));
                    if (!Object.keys(a).every((u)=>h.has(u.split(":")[0]))) throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(a)}, approved namespaces: ${Array.from(h).join(", ")}`);
                }
            }), x(this, "isValidReject", async (s)=>{
                if (!ft(s)) {
                    const { message: i } = F("MISSING_OR_INVALID", `reject() params: ${s}`);
                    throw new Error(i);
                }
                const { id: n, reason: r } = s;
                if (this.checkRecentlyDeleted(n), await this.isValidProposalId(n), !jy(r)) {
                    const { message: i } = F("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(r)}`);
                    throw new Error(i);
                }
            }), x(this, "isValidSessionSettleRequest", (s)=>{
                if (!ft(s)) {
                    const { message: l } = F("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${s}`);
                    throw new Error(l);
                }
                const { relay: n, controller: r, namespaces: i, expiry: o } = s;
                if (!Gh(n)) {
                    const { message: l } = F("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
                    throw new Error(l);
                }
                const a = Ry(r, "onSessionSettleRequest()");
                if (a) throw new Error(a.message);
                const c = Io(i, "onSessionSettleRequest()");
                if (c) throw new Error(c.message);
                if (ss(o)) {
                    const { message: l } = F("EXPIRED", "onSessionSettleRequest()");
                    throw new Error(l);
                }
            }), x(this, "isValidUpdate", async (s)=>{
                if (!ft(s)) {
                    const { message: c } = F("MISSING_OR_INVALID", `update() params: ${s}`);
                    throw new Error(c);
                }
                const { topic: n, namespaces: r } = s;
                this.checkRecentlyDeleted(n), await this.isValidSessionTopic(n);
                const i = this.client.session.get(n), o = Io(r, "update()");
                if (o) throw new Error(o.message);
                const a = wl(i.requiredNamespaces, r, "update()");
                if (a) throw new Error(a.message);
            }), x(this, "isValidExtend", async (s)=>{
                if (!ft(s)) {
                    const { message: r } = F("MISSING_OR_INVALID", `extend() params: ${s}`);
                    throw new Error(r);
                }
                const { topic: n } = s;
                this.checkRecentlyDeleted(n), await this.isValidSessionTopic(n);
            }), x(this, "isValidRequest", async (s)=>{
                if (!ft(s)) {
                    const { message: c } = F("MISSING_OR_INVALID", `request() params: ${s}`);
                    throw new Error(c);
                }
                const { topic: n, request: r, chainId: i, expiry: o } = s;
                this.checkRecentlyDeleted(n), await this.isValidSessionTopic(n);
                const { namespaces: a } = this.client.session.get(n);
                if (!ml(a, i)) {
                    const { message: c } = F("MISSING_OR_INVALID", `request() chainId: ${i}`);
                    throw new Error(c);
                }
                if (!Wy(r)) {
                    const { message: c } = F("MISSING_OR_INVALID", `request() ${JSON.stringify(r)}`);
                    throw new Error(c);
                }
                if (!Vy(a, i, r.method)) {
                    const { message: c } = F("MISSING_OR_INVALID", `request() method: ${r.method}`);
                    throw new Error(c);
                }
                if (o && !Yy(o, Oo)) {
                    const { message: c } = F("MISSING_OR_INVALID", `request() expiry: ${o}. Expiry must be a number (in seconds) between ${Oo.min} and ${Oo.max}`);
                    throw new Error(c);
                }
            }), x(this, "isValidRespond", async (s)=>{
                var n;
                if (!ft(s)) {
                    const { message: o } = F("MISSING_OR_INVALID", `respond() params: ${s}`);
                    throw new Error(o);
                }
                const { topic: r, response: i } = s;
                try {
                    await this.isValidSessionTopic(r);
                } catch (o) {
                    throw (n = s?.response) != null && n.id && this.cleanupAfterResponse(s), o;
                }
                if (!qy(i)) {
                    const { message: o } = F("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i)}`);
                    throw new Error(o);
                }
            }), x(this, "isValidPing", async (s)=>{
                if (!ft(s)) {
                    const { message: r } = F("MISSING_OR_INVALID", `ping() params: ${s}`);
                    throw new Error(r);
                }
                const { topic: n } = s;
                await this.isValidSessionOrPairingTopic(n);
            }), x(this, "isValidEmit", async (s)=>{
                if (!ft(s)) {
                    const { message: a } = F("MISSING_OR_INVALID", `emit() params: ${s}`);
                    throw new Error(a);
                }
                const { topic: n, event: r, chainId: i } = s;
                await this.isValidSessionTopic(n);
                const { namespaces: o } = this.client.session.get(n);
                if (!ml(o, i)) {
                    const { message: a } = F("MISSING_OR_INVALID", `emit() chainId: ${i}`);
                    throw new Error(a);
                }
                if (!Hy(r)) {
                    const { message: a } = F("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(r)}`);
                    throw new Error(a);
                }
                if (!Ky(o, i, r.name)) {
                    const { message: a } = F("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(r)}`);
                    throw new Error(a);
                }
            }), x(this, "isValidDisconnect", async (s)=>{
                if (!ft(s)) {
                    const { message: r } = F("MISSING_OR_INVALID", `disconnect() params: ${s}`);
                    throw new Error(r);
                }
                const { topic: n } = s;
                await this.isValidSessionOrPairingTopic(n);
            }), x(this, "isValidAuthenticate", (s)=>{
                const { chains: n, uri: r, domain: i, nonce: o } = s;
                if (!Array.isArray(n) || n.length === 0) throw new Error("chains is required and must be a non-empty array");
                if (!Be(r, !1)) throw new Error("uri is required parameter");
                if (!Be(i, !1)) throw new Error("domain is required parameter");
                if (!Be(o, !1)) throw new Error("nonce is required parameter");
                if ([
                    ...new Set(n.map((c)=>As(c).namespace))
                ].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
                const { namespace: a } = As(n[0]);
                if (a !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
            }), x(this, "getVerifyContext", async (s)=>{
                const { attestationId: n, hash: r, encryptedId: i, metadata: o, transportType: a } = s, c = {
                    verified: {
                        verifyUrl: o.verifyUrl || Tr,
                        validation: "UNKNOWN",
                        origin: o.url || ""
                    }
                };
                try {
                    if (a === ke.link_mode) {
                        const d = this.getAppLinkIfEnabled(o, a);
                        return c.verified.validation = d && new URL(d).origin === new URL(o.url).origin ? "VALID" : "INVALID", c;
                    }
                    const l = await this.client.core.verify.resolve({
                        attestationId: n,
                        hash: r,
                        encryptedId: i,
                        verifyUrl: o.verifyUrl
                    });
                    l && (c.verified.origin = l.origin, c.verified.isScam = l.isScam, c.verified.validation = l.origin === new URL(o.url).origin ? "VALID" : "INVALID");
                } catch (l) {
                    this.client.logger.warn(l);
                }
                return this.client.logger.debug(`Verify context: ${JSON.stringify(c)}`), c;
            }), x(this, "validateSessionProps", (s, n)=>{
                Object.values(s).forEach((r, i)=>{
                    if (r == null) {
                        const { message: o } = F("MISSING_OR_INVALID", `${n} must contain an existing value for each key. Received: ${r} for key ${Object.keys(s)[i]}`);
                        throw new Error(o);
                    }
                });
            }), x(this, "getPendingAuthRequest", (s)=>{
                const n = this.client.auth.requests.get(s);
                return typeof n == "object" ? n : void 0;
            }), x(this, "addToRecentlyDeleted", (s, n)=>{
                if (this.recentlyDeletedMap.set(s, n), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
                    let r = 0;
                    const i = this.recentlyDeletedLimit / 2;
                    for (const o of this.recentlyDeletedMap.keys()){
                        if (r++ >= i) break;
                        this.recentlyDeletedMap.delete(o);
                    }
                }
            }), x(this, "checkRecentlyDeleted", (s)=>{
                const n = this.recentlyDeletedMap.get(s);
                if (n) {
                    const { message: r } = F("MISSING_OR_INVALID", `Record was recently deleted - ${n}: ${s}`);
                    throw new Error(r);
                }
            }), x(this, "isLinkModeEnabled", (s, n)=>{
                var r, i, o, a, c, l, d, h, u;
                return !s || n !== ke.link_mode ? !1 : ((i = (r = this.client.metadata) == null ? void 0 : r.redirect) == null ? void 0 : i.linkMode) === !0 && ((a = (o = this.client.metadata) == null ? void 0 : o.redirect) == null ? void 0 : a.universal) !== void 0 && ((l = (c = this.client.metadata) == null ? void 0 : c.redirect) == null ? void 0 : l.universal) !== "" && ((d = s?.redirect) == null ? void 0 : d.universal) !== void 0 && ((h = s?.redirect) == null ? void 0 : h.universal) !== "" && ((u = s?.redirect) == null ? void 0 : u.linkMode) === !0 && this.client.core.linkModeSupportedApps.includes(s.redirect.universal) && typeof globalThis?.Linking < "u";
            }), x(this, "getAppLinkIfEnabled", (s, n)=>{
                var r;
                return this.isLinkModeEnabled(s, n) ? (r = s?.redirect) == null ? void 0 : r.universal : void 0;
            }), x(this, "handleLinkModeMessage", ({ url: s })=>{
                if (!s || !s.includes("wc_ev") || !s.includes("topic")) return;
                const n = Tc(s, "topic") || "", r = decodeURIComponent(Tc(s, "wc_ev") || ""), i = this.client.session.keys.includes(n);
                i && this.client.session.update(n, {
                    transportType: ke.link_mode
                }), this.client.core.dispatchEnvelope({
                    topic: n,
                    message: r,
                    sessionExists: i
                });
            }), x(this, "registerLinkModeListeners", async ()=>{
                var s;
                if (Ua() || Js() && (s = this.client.metadata.redirect) != null && s.linkMode) {
                    const n = globalThis?.Linking;
                    if (typeof n < "u") {
                        n.addEventListener("url", this.handleLinkModeMessage, this.client.name);
                        const r = await n.getInitialURL();
                        r && setTimeout(()=>{
                            this.handleLinkModeMessage({
                                url: r
                            });
                        }, 50);
                    }
                }
            }), x(this, "getTVFParams", (s, n, r)=>{
                var i, o, a;
                if (!((i = n.request) != null && i.method)) return {};
                const c = {
                    correlationId: s,
                    rpcMethods: [
                        n.request.method
                    ],
                    chainId: n.chainId
                };
                try {
                    const l = this.extractTxHashesFromResult(n.request, r);
                    c.txHashes = l, c.contractAddresses = this.isValidContractData(n.request.params) ? [
                        (a = (o = n.request.params) == null ? void 0 : o[0]) == null ? void 0 : a.to
                    ] : [];
                } catch (l) {
                    this.client.logger.warn("Error getting TVF params", l);
                }
                return c;
            }), x(this, "isValidContractData", (s)=>{
                var n;
                if (!s) return !1;
                try {
                    const r = s?.data || ((n = s?.[0]) == null ? void 0 : n.data);
                    if (!r.startsWith("0x")) return !1;
                    const i = r.slice(2);
                    return /^[0-9a-fA-F]*$/.test(i) ? i.length % 2 === 0 : !1;
                } catch  {}
                return !1;
            }), x(this, "extractTxHashesFromResult", (s, n)=>{
                var r;
                try {
                    if (!n) return [];
                    const i = s.method, o = ZE[i];
                    if (i === "sui_signTransaction") return [
                        hm(n.transactionBytes)
                    ];
                    if (i === "near_signTransaction") return [
                        Dc(n)
                    ];
                    if (i === "near_signTransactions") return n.map((c)=>Dc(c));
                    if (i === "xrpl_signTransactionFor" || i === "xrpl_signTransaction") return [
                        (r = n.tx_json) == null ? void 0 : r.hash
                    ];
                    if (i === "polkadot_signTransaction") return [
                        db({
                            transaction: s.params.transactionPayload,
                            signature: n.signature
                        })
                    ];
                    if (i === "algo_signTxn") return Ns(n) ? n.map((c)=>Lc(c)) : [
                        Lc(n)
                    ];
                    if (i === "cosmos_signDirect") return [
                        pm(n)
                    ];
                    if (i === "wallet_sendCalls") return fm(n);
                    if (typeof n == "string") return [
                        n
                    ];
                    const a = n[o.key];
                    if (Ns(a)) return i === "solana_signAllTransactions" ? a.map((c)=>dm(c)) : a;
                    if (typeof a == "string") return [
                        a
                    ];
                } catch (i) {
                    this.client.logger.warn("Error extracting tx hashes from result", i);
                }
                return [];
            });
        }
        async processPendingMessageEvents() {
            try {
                const e = this.client.session.keys, s = this.client.core.relayer.messages.getWithoutAck(e);
                for (const [n, r] of Object.entries(s))for (const i of r)try {
                    await this.onProviderMessageEvent({
                        topic: n,
                        message: i,
                        publishedAt: Date.now()
                    });
                } catch  {
                    this.client.logger.warn(`Error processing pending message event for topic: ${n}, message: ${i}`);
                }
            } catch (e) {
                this.client.logger.warn("processPendingMessageEvents failed", e);
            }
        }
        isInitialized() {
            if (!this.initialized) {
                const { message: e } = F("NOT_INITIALIZED", this.name);
                throw new Error(e);
            }
        }
        async confirmOnlineStateOrThrow() {
            await this.client.core.relayer.confirmOnlineStateOrThrow();
        }
        registerRelayerEvents() {
            this.client.core.relayer.on(De.message, (e)=>{
                this.onProviderMessageEvent(e);
            });
        }
        async onRelayMessage(e) {
            const { topic: s, message: n, attestation: r, transportType: i } = e, { publicKey: o } = this.client.auth.authKeys.keys.includes(Ei) ? this.client.auth.authKeys.get(Ei) : {
                publicKey: void 0
            };
            try {
                const a = await this.client.core.crypto.decode(s, n, {
                    receiverPublicKey: o,
                    encoding: i === ke.link_mode ? qs : mt
                });
                ka(a) ? (this.client.core.history.set(s, a), await this.onRelayEventRequest({
                    topic: s,
                    payload: a,
                    attestation: r,
                    transportType: i,
                    encryptedId: $t(n)
                })) : Oa(a) ? (await this.client.core.history.resolve(a), await this.onRelayEventResponse({
                    topic: s,
                    payload: a,
                    transportType: i
                }), this.client.core.history.delete(s, a.id)) : await this.onRelayEventUnknownPayload({
                    topic: s,
                    payload: a,
                    transportType: i
                }), await this.client.core.relayer.messages.ack(s, n);
            } catch (a) {
                this.client.logger.error(a);
            }
        }
        registerExpirerEvents() {
            this.client.core.expirer.on(xt.expired, async (e)=>{
                const { topic: s, id: n } = Yd(e.target);
                if (n && this.client.pendingRequest.keys.includes(n)) return await this.deletePendingSessionRequest(n, F("EXPIRED"), !0);
                if (n && this.client.auth.requests.keys.includes(n)) return await this.deletePendingAuthRequest(n, F("EXPIRED"), !0);
                s ? this.client.session.keys.includes(s) && (await this.deleteSession({
                    topic: s,
                    expirerHasDeleted: !0
                }), this.client.events.emit("session_expire", {
                    topic: s
                })) : n && (await this.deleteProposal(n, !0), this.client.events.emit("proposal_expire", {
                    id: n
                }));
            });
        }
        registerPairingEvents() {
            this.client.core.pairing.events.on(an.create, (e)=>this.onPairingCreated(e)), this.client.core.pairing.events.on(an.delete, (e)=>{
                this.addToRecentlyDeleted(e.topic, "pairing");
            });
        }
        isValidPairingTopic(e) {
            if (!Be(e, !1)) {
                const { message: s } = F("MISSING_OR_INVALID", `pairing topic should be a string: ${e}`);
                throw new Error(s);
            }
            if (!this.client.core.pairing.pairings.keys.includes(e)) {
                const { message: s } = F("NO_MATCHING_KEY", `pairing topic doesn't exist: ${e}`);
                throw new Error(s);
            }
            if (ss(this.client.core.pairing.pairings.get(e).expiry)) {
                const { message: s } = F("EXPIRED", `pairing topic: ${e}`);
                throw new Error(s);
            }
        }
        async isValidSessionTopic(e) {
            if (!Be(e, !1)) {
                const { message: s } = F("MISSING_OR_INVALID", `session topic should be a string: ${e}`);
                throw new Error(s);
            }
            if (this.checkRecentlyDeleted(e), !this.client.session.keys.includes(e)) {
                const { message: s } = F("NO_MATCHING_KEY", `session topic doesn't exist: ${e}`);
                throw new Error(s);
            }
            if (ss(this.client.session.get(e).expiry)) {
                await this.deleteSession({
                    topic: e
                });
                const { message: s } = F("EXPIRED", `session topic: ${e}`);
                throw new Error(s);
            }
            if (!this.client.core.crypto.keychain.has(e)) {
                const { message: s } = F("MISSING_OR_INVALID", `session topic does not exist in keychain: ${e}`);
                throw await this.deleteSession({
                    topic: e
                }), new Error(s);
            }
        }
        async isValidSessionOrPairingTopic(e) {
            if (this.checkRecentlyDeleted(e), this.client.session.keys.includes(e)) await this.isValidSessionTopic(e);
            else if (this.client.core.pairing.pairings.keys.includes(e)) this.isValidPairingTopic(e);
            else if (Be(e, !1)) {
                const { message: s } = F("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${e}`);
                throw new Error(s);
            } else {
                const { message: s } = F("MISSING_OR_INVALID", `session or pairing topic should be a string: ${e}`);
                throw new Error(s);
            }
        }
        async isValidProposalId(e) {
            if (!Fy(e)) {
                const { message: s } = F("MISSING_OR_INVALID", `proposal id should be a number: ${e}`);
                throw new Error(s);
            }
            if (!this.client.proposal.keys.includes(e)) {
                const { message: s } = F("NO_MATCHING_KEY", `proposal id doesn't exist: ${e}`);
                throw new Error(s);
            }
            if (ss(this.client.proposal.get(e).expiryTimestamp)) {
                await this.deleteProposal(e);
                const { message: s } = F("EXPIRED", `proposal id: ${e}`);
                throw new Error(s);
            }
        }
    }
    class uv extends Sn {
        constructor(e, s){
            super(e, s, YE, za), this.core = e, this.logger = s;
        }
    }
    let pv = class extends Sn {
        constructor(e, s){
            super(e, s, JE, za), this.core = e, this.logger = s;
        }
    };
    class fv extends Sn {
        constructor(e, s){
            super(e, s, QE, za, (n)=>n.id), this.core = e, this.logger = s;
        }
    }
    class gv extends Sn {
        constructor(e, s){
            super(e, s, nv, so, ()=>Ei), this.core = e, this.logger = s;
        }
    }
    class mv extends Sn {
        constructor(e, s){
            super(e, s, rv, so), this.core = e, this.logger = s;
        }
    }
    class wv extends Sn {
        constructor(e, s){
            super(e, s, iv, so, (n)=>n.id), this.core = e, this.logger = s;
        }
    }
    var yv = Object.defineProperty, bv = (t, e, s)=>e in t ? yv(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Po = (t, e, s)=>bv(t, typeof e != "symbol" ? e + "" : e, s);
    class Cv {
        constructor(e, s){
            this.core = e, this.logger = s, Po(this, "authKeys"), Po(this, "pairingTopics"), Po(this, "requests"), this.authKeys = new gv(this.core, this.logger), this.pairingTopics = new mv(this.core, this.logger), this.requests = new wv(this.core, this.logger);
        }
        async init() {
            await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
        }
    }
    var Ev = Object.defineProperty, vv = (t, e, s)=>e in t ? Ev(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, fe = (t, e, s)=>vv(t, typeof e != "symbol" ? e + "" : e, s);
    let Av = class gu extends Wf {
        constructor(e){
            super(e), fe(this, "protocol", uu), fe(this, "version", pu), fe(this, "name", ko.name), fe(this, "metadata"), fe(this, "core"), fe(this, "logger"), fe(this, "events", new vn.EventEmitter), fe(this, "engine"), fe(this, "session"), fe(this, "proposal"), fe(this, "pendingRequest"), fe(this, "auth"), fe(this, "signConfig"), fe(this, "on", (n, r)=>this.events.on(n, r)), fe(this, "once", (n, r)=>this.events.once(n, r)), fe(this, "off", (n, r)=>this.events.off(n, r)), fe(this, "removeListener", (n, r)=>this.events.removeListener(n, r)), fe(this, "removeAllListeners", (n)=>this.events.removeAllListeners(n)), fe(this, "connect", async (n)=>{
                try {
                    return await this.engine.connect(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "pair", async (n)=>{
                try {
                    return await this.engine.pair(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "approve", async (n)=>{
                try {
                    return await this.engine.approve(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "reject", async (n)=>{
                try {
                    return await this.engine.reject(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "update", async (n)=>{
                try {
                    return await this.engine.update(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "extend", async (n)=>{
                try {
                    return await this.engine.extend(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "request", async (n)=>{
                try {
                    return await this.engine.request(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "respond", async (n)=>{
                try {
                    return await this.engine.respond(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "ping", async (n)=>{
                try {
                    return await this.engine.ping(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "emit", async (n)=>{
                try {
                    return await this.engine.emit(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "disconnect", async (n)=>{
                try {
                    return await this.engine.disconnect(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "find", (n)=>{
                try {
                    return this.engine.find(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "getPendingSessionRequests", ()=>{
                try {
                    return this.engine.getPendingSessionRequests();
                } catch (n) {
                    throw this.logger.error(n.message), n;
                }
            }), fe(this, "authenticate", async (n, r)=>{
                try {
                    return await this.engine.authenticate(n, r);
                } catch (i) {
                    throw this.logger.error(i.message), i;
                }
            }), fe(this, "formatAuthMessage", (n)=>{
                try {
                    return this.engine.formatAuthMessage(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "approveSessionAuthenticate", async (n)=>{
                try {
                    return await this.engine.approveSessionAuthenticate(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), fe(this, "rejectSessionAuthenticate", async (n)=>{
                try {
                    return await this.engine.rejectSessionAuthenticate(n);
                } catch (r) {
                    throw this.logger.error(r.message), r;
                }
            }), this.name = e?.name || ko.name, this.metadata = ng(e?.metadata), this.signConfig = e?.signConfig;
            const s = typeof e?.logger < "u" && typeof e?.logger != "string" ? e.logger : Hr(Kr({
                level: e?.logger || ko.logger
            }));
            this.core = e?.core || new GE(e), this.logger = ct(s, this.name), this.session = new pv(this.core, this.logger), this.proposal = new uv(this.core, this.logger), this.pendingRequest = new fv(this.core, this.logger), this.engine = new hv(this), this.auth = new Cv(this.core, this.logger);
        }
        static async init(e) {
            const s = new gu(e);
            return await s.initialize(), s;
        }
        get context() {
            return bt(this.logger);
        }
        get pairing() {
            return this.core.pairing.pairings;
        }
        async initialize() {
            this.logger.trace("Initialized");
            try {
                await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success");
            } catch (e) {
                throw this.logger.info("SignClient Initialization Failure"), this.logger.error(e.message), e;
            }
        }
    };
    const zl = "error", Iv = "wss://relay.walletconnect.org", Nv = "wc", _v = "universal_provider", hi = `${Nv}@2:${_v}:`, mu = "https://rpc.walletconnect.org/v1/", wu = "generic", Sv = `${mu}bundler`, Kn = "call_status", Tv = 86400, Ga = {
        DEFAULT_CHAIN_CHANGED: "default_chain_changed"
    };
    function Ya(t) {
        return t == null || typeof t != "object" && typeof t != "function";
    }
    function yu(t) {
        return Object.getOwnPropertySymbols(t).filter((e)=>Object.prototype.propertyIsEnumerable.call(t, e));
    }
    function bu(t) {
        return t == null ? t === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(t);
    }
    const kv = "[object RegExp]", Cu = "[object String]", Eu = "[object Number]", vu = "[object Boolean]", Au = "[object Arguments]", Ov = "[object Symbol]", Pv = "[object Date]", Rv = "[object Map]", xv = "[object Set]", $v = "[object Array]", Uv = "[object ArrayBuffer]", Dv = "[object Object]", Lv = "[object DataView]", Mv = "[object Uint8Array]", Bv = "[object Uint8ClampedArray]", Fv = "[object Uint16Array]", jv = "[object Uint32Array]", Wv = "[object Int8Array]", qv = "[object Int16Array]", Hv = "[object Int32Array]", Vv = "[object Float32Array]", Kv = "[object Float64Array]";
    function Ja(t) {
        return ArrayBuffer.isView(t) && !(t instanceof DataView);
    }
    function zv(t, e) {
        return qn(t, void 0, t, new Map, e);
    }
    function qn(t, e, s, n = new Map, r = void 0) {
        const i = r?.(t, e, s, n);
        if (i != null) return i;
        if (Ya(t)) return t;
        if (n.has(t)) return n.get(t);
        if (Array.isArray(t)) {
            const o = new Array(t.length);
            n.set(t, o);
            for(let a = 0; a < t.length; a++)o[a] = qn(t[a], a, s, n, r);
            return Object.hasOwn(t, "index") && (o.index = t.index), Object.hasOwn(t, "input") && (o.input = t.input), o;
        }
        if (t instanceof Date) return new Date(t.getTime());
        if (t instanceof RegExp) {
            const o = new RegExp(t.source, t.flags);
            return o.lastIndex = t.lastIndex, o;
        }
        if (t instanceof Map) {
            const o = new Map;
            n.set(t, o);
            for (const [a, c] of t)o.set(a, qn(c, a, s, n, r));
            return o;
        }
        if (t instanceof Set) {
            const o = new Set;
            n.set(t, o);
            for (const a of t)o.add(qn(a, void 0, s, n, r));
            return o;
        }
        if (typeof Buffer < "u" && Buffer.isBuffer(t)) return t.subarray();
        if (Ja(t)) {
            const o = new (Object.getPrototypeOf(t)).constructor(t.length);
            n.set(t, o);
            for(let a = 0; a < t.length; a++)o[a] = qn(t[a], a, s, n, r);
            return o;
        }
        if (t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer) return t.slice(0);
        if (t instanceof DataView) {
            const o = new DataView(t.buffer.slice(0), t.byteOffset, t.byteLength);
            return n.set(t, o), cn(o, t, s, n, r), o;
        }
        if (typeof File < "u" && t instanceof File) {
            const o = new File([
                t
            ], t.name, {
                type: t.type
            });
            return n.set(t, o), cn(o, t, s, n, r), o;
        }
        if (t instanceof Blob) {
            const o = new Blob([
                t
            ], {
                type: t.type
            });
            return n.set(t, o), cn(o, t, s, n, r), o;
        }
        if (t instanceof Error) {
            const o = new t.constructor;
            return n.set(t, o), o.message = t.message, o.name = t.name, o.stack = t.stack, o.cause = t.cause, cn(o, t, s, n, r), o;
        }
        if (typeof t == "object" && Gv(t)) {
            const o = Object.create(Object.getPrototypeOf(t));
            return n.set(t, o), cn(o, t, s, n, r), o;
        }
        return t;
    }
    function cn(t, e, s = t, n, r) {
        const i = [
            ...Object.keys(e),
            ...yu(e)
        ];
        for(let o = 0; o < i.length; o++){
            const a = i[o], c = Object.getOwnPropertyDescriptor(t, a);
            (c == null || c.writable) && (t[a] = qn(e[a], a, s, n, r));
        }
    }
    function Gv(t) {
        switch(bu(t)){
            case Au:
            case $v:
            case Uv:
            case Lv:
            case vu:
            case Pv:
            case Vv:
            case Kv:
            case Wv:
            case qv:
            case Hv:
            case Rv:
            case Eu:
            case Dv:
            case kv:
            case xv:
            case Cu:
            case Ov:
            case Mv:
            case Bv:
            case Fv:
            case jv:
                return !0;
            default:
                return !1;
        }
    }
    function Yv(t, e) {
        return zv(t, (s, n, r, i)=>{
            if (typeof t == "object") switch(Object.prototype.toString.call(t)){
                case Eu:
                case Cu:
                case vu:
                    {
                        const o = new t.constructor(t?.valueOf());
                        return cn(o, t), o;
                    }
                case Au:
                    {
                        const o = {};
                        return cn(o, t), o.length = t.length, o[Symbol.iterator] = t[Symbol.iterator], o;
                    }
                default:
                    return;
            }
        });
    }
    function Gl(t) {
        return Yv(t);
    }
    function Yl(t) {
        return t !== null && typeof t == "object" && bu(t) === "[object Arguments]";
    }
    function Jl(t) {
        return typeof t == "object" && t !== null;
    }
    function Jv() {}
    function Xv(t) {
        return Ja(t);
    }
    function Zv(t) {
        if (typeof t != "object" || t == null) return !1;
        if (Object.getPrototypeOf(t) === null) return !0;
        if (Object.prototype.toString.call(t) !== "[object Object]") {
            const s = t[Symbol.toStringTag];
            return s == null || !Object.getOwnPropertyDescriptor(t, Symbol.toStringTag)?.writable ? !1 : t.toString() === `[object ${s}]`;
        }
        let e = t;
        for(; Object.getPrototypeOf(e) !== null;)e = Object.getPrototypeOf(e);
        return Object.getPrototypeOf(t) === e;
    }
    function Qv(t) {
        if (Ya(t)) return t;
        if (Array.isArray(t) || Ja(t) || t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer) return t.slice(0);
        const e = Object.getPrototypeOf(t), s = e.constructor;
        if (t instanceof Date || t instanceof Map || t instanceof Set) return new s(t);
        if (t instanceof RegExp) {
            const n = new s(t);
            return n.lastIndex = t.lastIndex, n;
        }
        if (t instanceof DataView) return new s(t.buffer.slice(0));
        if (t instanceof Error) {
            const n = new s(t.message);
            return n.stack = t.stack, n.name = t.name, n.cause = t.cause, n;
        }
        if (typeof File < "u" && t instanceof File) return new s([
            t
        ], t.name, {
            type: t.type,
            lastModified: t.lastModified
        });
        if (typeof t == "object") {
            const n = Object.create(e);
            return Object.assign(n, t);
        }
        return t;
    }
    function eA(t, ...e) {
        const s = e.slice(0, -1), n = e[e.length - 1];
        let r = t;
        for(let i = 0; i < s.length; i++){
            const o = s[i];
            r = va(r, o, n, new Map);
        }
        return r;
    }
    function va(t, e, s, n) {
        if (Ya(t) && (t = Object(t)), e == null || typeof e != "object") return t;
        if (n.has(e)) return Qv(n.get(e));
        if (n.set(e, t), Array.isArray(e)) {
            e = e.slice();
            for(let i = 0; i < e.length; i++)e[i] = e[i] ?? void 0;
        }
        const r = [
            ...Object.keys(e),
            ...yu(e)
        ];
        for(let i = 0; i < r.length; i++){
            const o = r[i];
            let a = e[o], c = t[o];
            if (Yl(a) && (a = {
                ...a
            }), Yl(c) && (c = {
                ...c
            }), typeof Buffer < "u" && Buffer.isBuffer(a) && (a = Gl(a)), Array.isArray(a)) if (typeof c == "object" && c != null) {
                const d = [], h = Reflect.ownKeys(c);
                for(let u = 0; u < h.length; u++){
                    const f = h[u];
                    d[f] = c[f];
                }
                c = d;
            } else c = [];
            const l = s(c, a, o, t, e, n);
            l != null ? t[o] = l : Array.isArray(a) || Jl(c) && Jl(a) ? t[o] = va(c, a, s, n) : c == null && Zv(a) ? t[o] = va({}, a, s, n) : c == null && Xv(a) ? t[o] = Gl(a) : (c === void 0 || a !== void 0) && (t[o] = a);
        }
        return t;
    }
    function tA(t, ...e) {
        return eA(t, ...e, Jv);
    }
    var sA = Object.defineProperty, nA = Object.defineProperties, rA = Object.getOwnPropertyDescriptors, Xl = Object.getOwnPropertySymbols, iA = Object.prototype.hasOwnProperty, oA = Object.prototype.propertyIsEnumerable, Zl = (t, e, s)=>e in t ? sA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, ui = (t, e)=>{
        for(var s in e || (e = {}))iA.call(e, s) && Zl(t, s, e[s]);
        if (Xl) for (var s of Xl(e))oA.call(e, s) && Zl(t, s, e[s]);
        return t;
    }, aA = (t, e)=>nA(t, rA(e));
    function Iu(t, e, s) {
        var n;
        const r = As(t);
        return ((n = e.rpcMap) == null ? void 0 : n[r.reference]) || `${mu}?chainId=${r.namespace}:${r.reference}&projectId=${s}`;
    }
    function cA(t) {
        return t.includes(":") ? t.split(":")[1] : t;
    }
    function Nu(t) {
        return t.map((e)=>`${e.split(":")[0]}:${e.split(":")[1]}`);
    }
    function lA(t, e) {
        const s = Object.keys(e.namespaces).filter((r)=>r.includes(t));
        if (!s.length) return [];
        const n = [];
        return s.forEach((r)=>{
            const i = e.namespaces[r].accounts;
            n.push(...i);
        }), n;
    }
    function Ql(t) {
        return Object.fromEntries(Object.entries(t).filter(([e, s])=>{
            var n, r;
            return ((n = s?.chains) == null ? void 0 : n.length) && ((r = s?.chains) == null ? void 0 : r.length) > 0;
        }));
    }
    function pi(t = {}, e = {}) {
        const s = Ql(ed(t)), n = Ql(ed(e));
        return tA(s, n);
    }
    function ed(t) {
        var e, s, n, r, i;
        const o = {};
        if (!ls(t)) return o;
        for (const [a, c] of Object.entries(t)){
            const l = eo(a) ? [
                a
            ] : c.chains, d = c.methods || [], h = c.events || [], u = c.rpcMap || {}, f = Wn(a);
            o[f] = aA(ui(ui({}, o[f]), c), {
                chains: cs(l, (e = o[f]) == null ? void 0 : e.chains),
                methods: cs(d, (s = o[f]) == null ? void 0 : s.methods),
                events: cs(h, (n = o[f]) == null ? void 0 : n.events)
            }), (ls(u) || ls(((r = o[f]) == null ? void 0 : r.rpcMap) || {})) && (o[f].rpcMap = ui(ui({}, u), (i = o[f]) == null ? void 0 : i.rpcMap));
        }
        return o;
    }
    function td(t) {
        return t.includes(":") ? t.split(":")[2] : t;
    }
    function sd(t) {
        const e = {};
        for (const [s, n] of Object.entries(t)){
            const r = n.methods || [], i = n.events || [], o = n.accounts || [], a = eo(s) ? [
                s
            ] : n.chains ? n.chains : Nu(n.accounts);
            e[s] = {
                chains: a,
                methods: r,
                events: i,
                accounts: o
            };
        }
        return e;
    }
    function Ro(t) {
        return typeof t == "number" ? t : t.includes("0x") ? parseInt(t, 16) : (t = t.includes(":") ? t.split(":")[1] : t, isNaN(Number(t)) ? t : Number(t));
    }
    function dA(t) {
        try {
            const e = JSON.parse(t);
            return typeof e == "object" && e !== null && !Array.isArray(e);
        } catch  {
            return !1;
        }
    }
    const _u = {}, zn = (t)=>_u[t], xo = (t, e)=>{
        _u[t] = e;
    };
    var hA = Object.defineProperty, nd = Object.getOwnPropertySymbols, uA = Object.prototype.hasOwnProperty, pA = Object.prototype.propertyIsEnumerable, rd = (t, e, s)=>e in t ? hA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, id = (t, e)=>{
        for(var s in e || (e = {}))uA.call(e, s) && rd(t, s, e[s]);
        if (nd) for (var s of nd(e))pA.call(e, s) && rd(t, s, e[s]);
        return t;
    };
    const od = "eip155", fA = [
        "atomic",
        "flow-control",
        "paymasterService",
        "sessionKeys",
        "auxiliaryFunds"
    ], gA = (t)=>t && t.startsWith("0x") ? BigInt(t).toString(10) : t, $o = (t)=>t && t.startsWith("0x") ? t : `0x${BigInt(t).toString(16)}`, ad = (t)=>Object.keys(t).filter((e)=>fA.includes(e)).reduce((e, s)=>(e[s] = mA(t[s]), e), {}), mA = (t)=>typeof t == "string" && dA(t) ? JSON.parse(t) : t, wA = (t, e, s)=>{
        const { sessionProperties: n = {}, scopedProperties: r = {} } = t, i = {};
        if (!ls(r) && !ls(n)) return;
        const o = ad(n);
        for (const a of s){
            const c = gA(a);
            if (!c) continue;
            i[$o(c)] = o;
            const l = r?.[`${od}:${c}`];
            if (l) {
                const d = l?.[`${od}:${c}:${e}`];
                i[$o(c)] = id(id({}, i[$o(c)]), ad(d || l));
            }
        }
        for (const [a, c] of Object.entries(i))Object.keys(c).length === 0 && delete i[a];
        return Object.keys(i).length > 0 ? i : void 0;
    };
    var yA = Object.defineProperty, bA = (t, e, s)=>e in t ? yA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, CA = (t, e, s)=>bA(t, e + "", s);
    let Uo;
    class Xa {
        constructor(e){
            CA(this, "storage"), this.storage = e;
        }
        async getItem(e) {
            return await this.storage.getItem(e);
        }
        async setItem(e, s) {
            return await this.storage.setItem(e, s);
        }
        async removeItem(e) {
            return await this.storage.removeItem(e);
        }
        static getStorage(e) {
            return Uo || (Uo = new Xa(e)), Uo;
        }
    }
    var EA = Object.defineProperty, vA = Object.defineProperties, AA = Object.getOwnPropertyDescriptors, cd = Object.getOwnPropertySymbols, IA = Object.prototype.hasOwnProperty, NA = Object.prototype.propertyIsEnumerable, ld = (t, e, s)=>e in t ? EA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, _A = (t, e)=>{
        for(var s in e || (e = {}))IA.call(e, s) && ld(t, s, e[s]);
        if (cd) for (var s of cd(e))NA.call(e, s) && ld(t, s, e[s]);
        return t;
    }, SA = (t, e)=>vA(t, AA(e));
    async function TA(t, e) {
        const s = As(t.result.capabilities.caip345.caip2), n = t.result.capabilities.caip345.transactionHashes, r = await Promise.allSettled(n.map((h)=>kA(s.reference, h, e))), i = r.filter((h)=>h.status === "fulfilled").map((h)=>h.value).filter((h)=>h);
        r.filter((h)=>h.status === "rejected").forEach((h)=>console.warn("Failed to fetch transaction receipt:", h.reason));
        const o = !i.length || i.some((h)=>!h), a = i.every((h)=>h?.status === "0x1"), c = i.every((h)=>h?.status === "0x0"), l = i.some((h)=>h?.status === "0x0");
        let d;
        return o ? d = 100 : a ? d = 200 : c ? d = 500 : l && (d = 600), {
            id: t.result.id,
            version: t.request.version,
            atomic: t.request.atomicRequired,
            chainId: t.request.chainId,
            capabilities: t.result.capabilities,
            receipts: i,
            status: d
        };
    }
    async function kA(t, e, s) {
        return await s(parseInt(t)).request(ts("eth_getTransactionReceipt", [
            e
        ]));
    }
    async function OA({ sendCalls: t, storage: e }) {
        const s = await e.getItem(Kn);
        await e.setItem(Kn, SA(_A({}, s), {
            [t.result.id]: {
                request: t.request,
                result: t.result,
                expiry: Me(Tv)
            }
        }));
    }
    async function PA({ resultId: t, storage: e }) {
        const s = await e.getItem(Kn);
        if (s) {
            delete s[t], await e.setItem(Kn, s);
            for(const n in s)ss(s[n].expiry) && delete s[n];
            await e.setItem(Kn, s);
        }
    }
    async function RA({ resultId: t, storage: e }) {
        const s = await e.getItem(Kn), n = s?.[t];
        if (n && !ss(n.expiry)) return n;
        await PA({
            resultId: t,
            storage: e
        });
    }
    var xA = Object.defineProperty, $A = Object.defineProperties, UA = Object.getOwnPropertyDescriptors, dd = Object.getOwnPropertySymbols, DA = Object.prototype.hasOwnProperty, LA = Object.prototype.propertyIsEnumerable, Aa = (t, e, s)=>e in t ? xA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Do = (t, e)=>{
        for(var s in e || (e = {}))DA.call(e, s) && Aa(t, s, e[s]);
        if (dd) for (var s of dd(e))LA.call(e, s) && Aa(t, s, e[s]);
        return t;
    }, Lo = (t, e)=>$A(t, UA(e)), tn = (t, e, s)=>Aa(t, typeof e != "symbol" ? e + "" : e, s);
    class MA {
        constructor(e){
            tn(this, "name", "eip155"), tn(this, "client"), tn(this, "chainId"), tn(this, "namespace"), tn(this, "httpProviders"), tn(this, "events"), tn(this, "storage"), this.namespace = e.namespace, this.events = zn("events"), this.client = zn("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain()), this.storage = Xa.getStorage(this.client.core.storage);
        }
        async request(e) {
            switch(e.request.method){
                case "eth_requestAccounts":
                    return this.getAccounts();
                case "eth_accounts":
                    return this.getAccounts();
                case "wallet_switchEthereumChain":
                    return await this.handleSwitchChain(e);
                case "eth_chainId":
                    return parseInt(this.getDefaultChain());
                case "wallet_getCapabilities":
                    return await this.getCapabilities(e);
                case "wallet_getCallsStatus":
                    return await this.getCallStatus(e);
                case "wallet_sendCalls":
                    return await this.sendCalls(e);
            }
            return this.namespace.methods.includes(e.request.method) ? await this.client.request(e) : this.getHttpProvider().request(e.request);
        }
        updateNamespace(e) {
            this.namespace = Object.assign(this.namespace, e);
        }
        setDefaultChain(e, s) {
            this.httpProviders[e] || this.setHttpProvider(parseInt(e), s);
            const n = this.chainId;
            this.chainId = parseInt(e), this.events.emit(Ga.DEFAULT_CHAIN_CHANGED, {
                currentCaipChainId: `${this.name}:${e}`,
                previousCaipChainId: `${this.name}:${n}`
            });
        }
        requestAccounts() {
            return this.getAccounts();
        }
        getDefaultChain() {
            if (this.chainId) return this.chainId.toString();
            if (this.namespace.defaultChain) return this.namespace.defaultChain;
            const e = this.namespace.chains[0];
            if (!e) throw new Error("ChainId not found");
            return e.split(":")[1];
        }
        createHttpProvider(e, s) {
            const n = s || Iu(`${this.name}:${e}`, this.namespace, this.client.core.projectId);
            if (!n) throw new Error(`No RPC url provided for chainId: ${e}`);
            return new Ta(new Od(n, zn("disableProviderPing")));
        }
        setHttpProvider(e, s) {
            const n = this.createHttpProvider(e, s);
            n && (this.httpProviders[e] = n);
        }
        createHttpProviders() {
            const e = {};
            return this.namespace.chains.forEach((s)=>{
                var n;
                const r = parseInt(cA(s));
                e[r] = this.createHttpProvider(r, (n = this.namespace.rpcMap) == null ? void 0 : n[s]);
            }), e;
        }
        getAccounts() {
            const e = this.namespace.accounts;
            return e ? [
                ...new Set(e.filter((s)=>s.split(":")[1] === this.chainId.toString()).map((s)=>s.split(":")[2]))
            ] : [];
        }
        getHttpProvider(e) {
            const s = e || this.chainId;
            return this.httpProviders[s] || (this.httpProviders = Lo(Do({}, this.httpProviders), {
                [s]: this.createHttpProvider(s)
            }), this.httpProviders[s]);
        }
        async handleSwitchChain(e) {
            var s, n;
            let r = e.request.params ? (s = e.request.params[0]) == null ? void 0 : s.chainId : "0x0";
            r = r.startsWith("0x") ? r : `0x${r}`;
            const i = parseInt(r, 16);
            if (this.isChainApproved(i)) this.setDefaultChain(`${i}`);
            else if (this.namespace.methods.includes("wallet_switchEthereumChain")) await this.client.request({
                topic: e.topic,
                request: {
                    method: e.request.method,
                    params: [
                        {
                            chainId: r
                        }
                    ]
                },
                chainId: (n = this.namespace.chains) == null ? void 0 : n[0]
            }), this.setDefaultChain(`${i}`);
            else throw new Error(`Failed to switch to chain 'eip155:${i}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
            return null;
        }
        isChainApproved(e) {
            return this.namespace.chains.includes(`${this.name}:${e}`);
        }
        async getCapabilities(e) {
            var s, n, r, i, o;
            const a = (n = (s = e.request) == null ? void 0 : s.params) == null ? void 0 : n[0], c = ((i = (r = e.request) == null ? void 0 : r.params) == null ? void 0 : i[1]) || [];
            if (!a) throw new Error("Missing address parameter in `wallet_getCapabilities` request");
            const l = this.client.session.get(e.topic), d = ((o = l?.sessionProperties) == null ? void 0 : o.capabilities) || {}, h = `${a}${c.join(",")}`, u = d?.[h];
            if (u) return u;
            let f;
            try {
                f = wA(l, a, c);
            } catch (w) {
                console.warn("Failed to extract capabilities from session", w);
            }
            if (f) return f;
            const g = await this.client.request(e);
            try {
                await this.client.session.update(e.topic, {
                    sessionProperties: Lo(Do({}, l.sessionProperties || {}), {
                        capabilities: Lo(Do({}, d || {}), {
                            [h]: g
                        })
                    })
                });
            } catch (w) {
                console.warn("Failed to update session with capabilities", w);
            }
            return g;
        }
        async getCallStatus(e) {
            var s, n, r;
            const i = this.client.session.get(e.topic), o = (s = i.sessionProperties) == null ? void 0 : s.bundler_name;
            if (o) {
                const l = this.getBundlerUrl(e.chainId, o);
                try {
                    return await this.getUserOperationReceipt(l, e);
                } catch (d) {
                    console.warn("Failed to fetch call status from bundler", d, l);
                }
            }
            const a = (n = i.sessionProperties) == null ? void 0 : n.bundler_url;
            if (a) try {
                return await this.getUserOperationReceipt(a, e);
            } catch (l) {
                console.warn("Failed to fetch call status from custom bundler", l, a);
            }
            const c = await RA({
                resultId: (r = e.request.params) == null ? void 0 : r[0],
                storage: this.storage
            });
            if (c) try {
                return await TA(c, this.getHttpProvider.bind(this));
            } catch (l) {
                console.warn("Failed to fetch call status from stored send calls", l, c);
            }
            if (this.namespace.methods.includes(e.request.method)) return await this.client.request(e);
            throw new Error("Fetching call status not approved by the wallet.");
        }
        async getUserOperationReceipt(e, s) {
            var n;
            const r = new URL(e), i = await fetch(r, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ts("eth_getUserOperationReceipt", [
                    (n = s.request.params) == null ? void 0 : n[0]
                ]))
            });
            if (!i.ok) throw new Error(`Failed to fetch user operation receipt - ${i.status}`);
            return await i.json();
        }
        getBundlerUrl(e, s) {
            return `${Sv}?projectId=${this.client.core.projectId}&chainId=${e}&bundler=${s}`;
        }
        async sendCalls(e) {
            var s, n, r;
            const i = await this.client.request(e), o = (s = e.request.params) == null ? void 0 : s[0], a = i?.id, c = i?.capabilities || {}, l = (n = c?.caip345) == null ? void 0 : n.caip2, d = (r = c?.caip345) == null ? void 0 : r.transactionHashes;
            return !a || !l || !(d != null && d.length) || await OA({
                sendCalls: {
                    request: o,
                    result: i
                },
                storage: this.storage
            }), i;
        }
    }
    var BA = Object.defineProperty, FA = (t, e, s)=>e in t ? BA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, Un = (t, e, s)=>FA(t, typeof e != "symbol" ? e + "" : e, s);
    class jA {
        constructor(e){
            Un(this, "name", wu), Un(this, "client"), Un(this, "httpProviders"), Un(this, "events"), Un(this, "namespace"), Un(this, "chainId"), this.namespace = e.namespace, this.events = zn("events"), this.client = zn("client"), this.chainId = this.getDefaultChain(), this.name = this.getNamespaceName(), this.httpProviders = this.createHttpProviders();
        }
        updateNamespace(e) {
            this.namespace.chains = [
                ...new Set((this.namespace.chains || []).concat(e.chains || []))
            ], this.namespace.accounts = [
                ...new Set((this.namespace.accounts || []).concat(e.accounts || []))
            ], this.namespace.methods = [
                ...new Set((this.namespace.methods || []).concat(e.methods || []))
            ], this.namespace.events = [
                ...new Set((this.namespace.events || []).concat(e.events || []))
            ], this.httpProviders = this.createHttpProviders();
        }
        requestAccounts() {
            return this.getAccounts();
        }
        request(e) {
            return this.namespace.methods.includes(e.request.method) ? this.client.request(e) : this.getHttpProvider(e.chainId).request(e.request);
        }
        setDefaultChain(e, s) {
            this.httpProviders[e] || this.setHttpProvider(e, s);
            const n = this.chainId;
            this.chainId = e, this.events.emit(Ga.DEFAULT_CHAIN_CHANGED, {
                currentCaipChainId: `${this.name}:${e}`,
                previousCaipChainId: `${this.name}:${n}`
            });
        }
        getDefaultChain() {
            if (this.chainId) return this.chainId;
            if (this.namespace.defaultChain) return this.namespace.defaultChain;
            const e = this.namespace.chains[0];
            if (!e) throw new Error("ChainId not found");
            return e.split(":")[1];
        }
        getNamespaceName() {
            const e = this.namespace.chains[0];
            if (!e) throw new Error("ChainId not found");
            return As(e).namespace;
        }
        getAccounts() {
            const e = this.namespace.accounts;
            return e ? [
                ...new Set(e.filter((s)=>s.split(":")[1] === this.chainId.toString()).map((s)=>s.split(":")[2]))
            ] : [];
        }
        createHttpProviders() {
            var e, s;
            const n = {};
            return (s = (e = this.namespace) == null ? void 0 : e.accounts) == null || s.forEach((r)=>{
                var i, o;
                const a = As(r), c = (o = (i = this.namespace) == null ? void 0 : i.rpcMap) == null ? void 0 : o[`${a.namespace}:${a.reference}`];
                n[a.reference] = this.createHttpProvider(r, c);
            }), n;
        }
        getHttpProvider(e) {
            const s = As(e).reference, n = this.httpProviders[s];
            if (typeof n > "u") throw new Error(`JSON-RPC provider for ${e} not found`);
            return n;
        }
        setHttpProvider(e, s) {
            const n = this.createHttpProvider(e, s);
            n && (this.httpProviders[e] = n);
        }
        createHttpProvider(e, s) {
            const n = s || Iu(e, this.namespace, this.client.core.projectId);
            if (!n) throw new Error(`No RPC url provided for chainId: ${e}`);
            return new Ta(new Od(n, zn("disableProviderPing")));
        }
    }
    var WA = Object.defineProperty, qA = Object.defineProperties, HA = Object.getOwnPropertyDescriptors, hd = Object.getOwnPropertySymbols, VA = Object.prototype.hasOwnProperty, KA = Object.prototype.propertyIsEnumerable, Ia = (t, e, s)=>e in t ? WA(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s
        }) : t[e] = s, mr = (t, e)=>{
        for(var s in e || (e = {}))VA.call(e, s) && Ia(t, s, e[s]);
        if (hd) for (var s of hd(e))KA.call(e, s) && Ia(t, s, e[s]);
        return t;
    }, fi = (t, e)=>qA(t, HA(e)), Ot = (t, e, s)=>Ia(t, typeof e != "symbol" ? e + "" : e, s);
    let zA = class Su {
        constructor(e){
            Ot(this, "client"), Ot(this, "namespaces"), Ot(this, "optionalNamespaces"), Ot(this, "sessionProperties"), Ot(this, "scopedProperties"), Ot(this, "events", new Pa), Ot(this, "rpcProviders", {}), Ot(this, "session"), Ot(this, "providerOpts"), Ot(this, "logger"), Ot(this, "uri"), Ot(this, "disableProviderPing", !1), this.providerOpts = e, this.logger = typeof e?.logger < "u" && typeof e?.logger != "string" ? e.logger : Hr(Kr({
                level: e?.logger || zl
            })), this.disableProviderPing = e?.disableProviderPing || !1;
        }
        static async init(e) {
            const s = new Su(e);
            return await s.initialize(), s;
        }
        async request(e, s, n) {
            const [r, i] = this.validateChain(s);
            if (!this.session) throw new Error("Please call connect() before request()");
            return await this.getProvider(r).request({
                request: mr({}, e),
                chainId: `${r}:${i}`,
                topic: this.session.topic,
                expiry: n
            });
        }
        sendAsync(e, s, n, r) {
            const i = new Date().getTime();
            this.request(e, n, r).then((o)=>s(null, Pr(i, o))).catch((o)=>s(o, void 0));
        }
        async enable() {
            if (!this.client) throw new Error("Sign Client not initialized");
            return this.session || await this.connect({
                namespaces: this.namespaces,
                optionalNamespaces: this.optionalNamespaces,
                sessionProperties: this.sessionProperties,
                scopedProperties: this.scopedProperties
            }), await this.requestAccounts();
        }
        async disconnect() {
            var e;
            if (!this.session) throw new Error("Please call connect() before enable()");
            await this.client.disconnect({
                topic: (e = this.session) == null ? void 0 : e.topic,
                reason: Re("USER_DISCONNECTED")
            }), await this.cleanup();
        }
        async connect(e) {
            if (!this.client) throw new Error("Sign Client not initialized");
            if (this.setNamespaces(e), this.cleanupPendingPairings(), !e.skipPairing) return await this.pair(e.pairingTopic);
        }
        async authenticate(e, s) {
            if (!this.client) throw new Error("Sign Client not initialized");
            this.setNamespaces(e), await this.cleanupPendingPairings();
            const { uri: n, response: r } = await this.client.authenticate(e, s);
            n && (this.uri = n, this.events.emit("display_uri", n));
            const i = await r();
            if (this.session = i.session, this.session) {
                const o = sd(this.session.namespaces);
                this.namespaces = pi(this.namespaces, o), await this.persist("namespaces", this.namespaces), this.onConnect();
            }
            return i;
        }
        on(e, s) {
            this.events.on(e, s);
        }
        once(e, s) {
            this.events.once(e, s);
        }
        removeListener(e, s) {
            this.events.removeListener(e, s);
        }
        off(e, s) {
            this.events.off(e, s);
        }
        get isWalletConnect() {
            return !0;
        }
        async pair(e) {
            const { uri: s, approval: n } = await this.client.connect({
                pairingTopic: e,
                requiredNamespaces: this.namespaces,
                optionalNamespaces: this.optionalNamespaces,
                sessionProperties: this.sessionProperties,
                scopedProperties: this.scopedProperties
            });
            s && (this.uri = s, this.events.emit("display_uri", s));
            const r = await n();
            this.session = r;
            const i = sd(r.namespaces);
            return this.namespaces = pi(this.namespaces, i), await this.persist("namespaces", this.namespaces), await this.persist("optionalNamespaces", this.optionalNamespaces), this.onConnect(), this.session;
        }
        setDefaultChain(e, s) {
            try {
                if (!this.session) return;
                const [n, r] = this.validateChain(e);
                this.getProvider(n).setDefaultChain(r, s);
            } catch (n) {
                if (!/Please call connect/.test(n.message)) throw n;
            }
        }
        async cleanupPendingPairings(e = {}) {
            try {
                this.logger.info("Cleaning up inactive pairings...");
                const s = this.client.pairing.getAll();
                if (!Ns(s)) return;
                for (const n of s)e.deletePairings ? this.client.core.expirer.set(n.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(n.topic);
                this.logger.info(`Inactive pairings cleared: ${s.length}`);
            } catch (s) {
                this.logger.warn("Failed to cleanup pending pairings", s);
            }
        }
        abortPairingAttempt() {
            this.logger.warn("abortPairingAttempt is deprecated. This is now a no-op.");
        }
        async checkStorage() {
            this.namespaces = await this.getFromStore("namespaces") || {}, this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.session && this.createProviders();
        }
        async initialize() {
            this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
        }
        async createClient() {
            var e, s;
            if (this.client = this.providerOpts.client || await Av.init({
                core: this.providerOpts.core,
                logger: this.providerOpts.logger || zl,
                relayUrl: this.providerOpts.relayUrl || Iv,
                projectId: this.providerOpts.projectId,
                metadata: this.providerOpts.metadata,
                storageOptions: this.providerOpts.storageOptions,
                storage: this.providerOpts.storage,
                name: this.providerOpts.name,
                customStoragePrefix: this.providerOpts.customStoragePrefix,
                telemetryEnabled: this.providerOpts.telemetryEnabled
            }), this.providerOpts.session) try {
                this.session = this.client.session.get(this.providerOpts.session.topic);
            } catch (n) {
                throw this.logger.error("Failed to get session", n), new Error(`The provided session: ${(s = (e = this.providerOpts) == null ? void 0 : e.session) == null ? void 0 : s.topic} doesn't exist in the Sign client`);
            }
            else {
                const n = this.client.session.getAll();
                this.session = n[0];
            }
            this.logger.trace("SignClient Initialized");
        }
        createProviders() {
            if (!this.client) throw new Error("Sign Client not initialized");
            if (!this.session) throw new Error("Session not initialized. Please call connect() before enable()");
            const e = [
                ...new Set(Object.keys(this.session.namespaces).map((s)=>Wn(s)))
            ];
            xo("client", this.client), xo("events", this.events), xo("disableProviderPing", this.disableProviderPing), e.forEach((s)=>{
                if (!this.session) return;
                const n = lA(s, this.session);
                if (n?.length === 0) return;
                const r = Nu(n), i = pi(this.namespaces, this.optionalNamespaces), o = fi(mr({}, i[s]), {
                    accounts: n,
                    chains: r
                });
                s === "eip155" ? this.rpcProviders[s] = new MA({
                    namespace: o
                }) : this.rpcProviders[s] = new jA({
                    namespace: o
                });
            });
        }
        registerEventListeners() {
            if (typeof this.client > "u") throw new Error("Sign Client is not initialized");
            this.client.on("session_ping", (e)=>{
                var s;
                const { topic: n } = e;
                n === ((s = this.session) == null ? void 0 : s.topic) && this.events.emit("session_ping", e);
            }), this.client.on("session_event", (e)=>{
                var s;
                const { params: n, topic: r } = e;
                if (r !== ((s = this.session) == null ? void 0 : s.topic)) return;
                const { event: i } = n;
                if (i.name === "accountsChanged") {
                    const o = i.data;
                    o && Ns(o) && this.events.emit("accountsChanged", o.map(td));
                } else if (i.name === "chainChanged") {
                    const o = n.chainId, a = n.event.data, c = Wn(o), l = Ro(o) !== Ro(a) ? `${c}:${Ro(a)}` : o;
                    this.onChainChanged({
                        currentCaipChainId: l
                    });
                } else this.events.emit(i.name, i.data);
                this.events.emit("session_event", e);
            }), this.client.on("session_update", ({ topic: e, params: s })=>{
                var n, r;
                if (e !== ((n = this.session) == null ? void 0 : n.topic)) return;
                const { namespaces: i } = s, o = (r = this.client) == null ? void 0 : r.session.get(e);
                this.session = fi(mr({}, o), {
                    namespaces: i
                }), this.onSessionUpdate(), this.events.emit("session_update", {
                    topic: e,
                    params: s
                });
            }), this.client.on("session_delete", async (e)=>{
                var s;
                e.topic === ((s = this.session) == null ? void 0 : s.topic) && (await this.cleanup(), this.events.emit("session_delete", e), this.events.emit("disconnect", fi(mr({}, Re("USER_DISCONNECTED")), {
                    data: e.topic
                })));
            }), this.on(Ga.DEFAULT_CHAIN_CHANGED, (e)=>{
                this.onChainChanged(fi(mr({}, e), {
                    internal: !0
                }));
            });
        }
        getProvider(e) {
            return this.rpcProviders[e] || this.rpcProviders[wu];
        }
        onSessionUpdate() {
            Object.keys(this.rpcProviders).forEach((e)=>{
                var s;
                this.getProvider(e).updateNamespace((s = this.session) == null ? void 0 : s.namespaces[e]);
            });
        }
        setNamespaces(e) {
            const { namespaces: s = {}, optionalNamespaces: n = {}, sessionProperties: r, scopedProperties: i } = e;
            this.optionalNamespaces = pi(s, n), this.sessionProperties = r, this.scopedProperties = i;
        }
        validateChain(e) {
            const [s, n] = e?.split(":") || [
                "",
                ""
            ];
            if (!this.namespaces || !Object.keys(this.namespaces).length) return [
                s,
                n
            ];
            if (s && !Object.keys(this.namespaces || {}).map((o)=>Wn(o)).includes(s)) throw new Error(`Namespace '${s}' is not configured. Please call connect() first with namespace config.`);
            if (s && n) return [
                s,
                n
            ];
            const r = Wn(Object.keys(this.namespaces)[0]), i = this.rpcProviders[r].getDefaultChain();
            return [
                r,
                i
            ];
        }
        async requestAccounts() {
            const [e] = this.validateChain();
            return await this.getProvider(e).requestAccounts();
        }
        async onChainChanged({ currentCaipChainId: e, previousCaipChainId: s, internal: n = !1 }) {
            if (!this.namespaces) return;
            const [r, i] = this.validateChain(e);
            i && (this.updateNamespaceChain(r, i), n ? (this.events.emit("chainChanged", i), this.emitAccountsChangedOnChainChange({
                namespace: r,
                currentCaipChainId: e,
                previousCaipChainId: s
            })) : this.getProvider(r).setDefaultChain(i), await this.persist("namespaces", this.namespaces));
        }
        emitAccountsChangedOnChainChange({ namespace: e, currentCaipChainId: s, previousCaipChainId: n }) {
            var r, i;
            try {
                if (n === s) return;
                const o = (i = (r = this.session) == null ? void 0 : r.namespaces[e]) == null ? void 0 : i.accounts;
                if (!o) return;
                const a = o.filter((c)=>c.includes(`${s}:`)).map(td);
                if (!Ns(a)) return;
                this.events.emit("accountsChanged", a);
            } catch (o) {
                this.logger.warn("Failed to emit accountsChanged on chain change", o);
            }
        }
        updateNamespaceChain(e, s) {
            if (!this.namespaces) return;
            const n = this.namespaces[e] ? e : `${e}:${s}`, r = {
                chains: [],
                methods: [],
                events: [],
                defaultChain: s
            };
            this.namespaces[n] ? this.namespaces[n] && (this.namespaces[n].defaultChain = s) : this.namespaces[n] = r;
        }
        onConnect() {
            this.createProviders(), this.events.emit("connect", {
                session: this.session
            });
        }
        async cleanup() {
            this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, await this.deleteFromStore("namespaces"), await this.deleteFromStore("optionalNamespaces"), await this.deleteFromStore("sessionProperties"), this.session = void 0, this.cleanupPendingPairings({
                deletePairings: !0
            }), await this.cleanupStorage();
        }
        async persist(e, s) {
            var n;
            const r = ((n = this.session) == null ? void 0 : n.topic) || "";
            await this.client.core.storage.setItem(`${hi}/${e}${r}`, s);
        }
        async getFromStore(e) {
            var s;
            const n = ((s = this.session) == null ? void 0 : s.topic) || "";
            return await this.client.core.storage.getItem(`${hi}/${e}${n}`);
        }
        async deleteFromStore(e) {
            var s;
            const n = ((s = this.session) == null ? void 0 : s.topic) || "";
            await this.client.core.storage.removeItem(`${hi}/${e}${n}`);
        }
        async cleanupStorage() {
            var e;
            try {
                if (((e = this.client) == null ? void 0 : e.session.length) > 0) return;
                const s = await this.client.core.storage.getKeys();
                for (const n of s)n.startsWith(hi) && await this.client.core.storage.removeItem(n);
            } catch (s) {
                this.logger.warn("Failed to cleanup storage", s);
            }
        }
    }, sn = null;
    let ms, Lr, GA, YA, Pt, Tu, JA, XA;
    ns = {
        getSIWX () {
            return _.state.siwx;
        },
        async initializeIfEnabled (t = p.getActiveCaipAddress()) {
            const e = _.state.siwx;
            if (!(e && t)) return;
            const [s, n, r] = t.split(":");
            if (p.checkIfSupportedNetwork(s, `${s}:${n}`)) try {
                if (_.state.remoteFeatures?.emailCapture) {
                    const o = p.getAccountData(s)?.user;
                    await ue.open({
                        view: "DataCapture",
                        data: {
                            email: o?.email ?? void 0
                        }
                    });
                    return;
                }
                if (sn && await sn, (await e.getSessions(`${s}:${n}`, r)).length) return;
                await ue.open({
                    view: "SIWXSignMessage"
                });
            } catch (i) {
                console.error("SIWXUtil:initializeIfEnabled", i), le.sendEvent({
                    type: "track",
                    event: "SIWX_AUTH_ERROR",
                    properties: this.getSIWXEventProperties(i)
                }), await H._getClient()?.disconnect().catch(console.error), te.reset("Connect"), rs.showError("A problem occurred while trying initialize authentication");
            }
        },
        async requestSignMessage () {
            const t = _.state.siwx, e = J.getPlainAddress(p.getActiveCaipAddress()), s = ni(), n = H._getClient();
            if (!t) throw new Error("SIWX is not enabled");
            if (!e) throw new Error("No ActiveCaipAddress found");
            if (!s) throw new Error("No ActiveCaipNetwork or client found");
            if (!n) throw new Error("No ConnectionController client found");
            try {
                const r = await t.createMessage({
                    chainId: s.caipNetworkId,
                    accountAddress: e
                }), i = r.toString();
                L.getConnectorId(s.chainNamespace) === S.CONNECTOR_ID.AUTH && te.pushTransactionStack({});
                const a = await n.signMessage(i);
                await t.addSession({
                    data: r,
                    message: i,
                    signature: a
                }), p.setLastConnectedSIWECaipNetwork(s), ue.close(), le.sendEvent({
                    type: "track",
                    event: "SIWX_AUTH_SUCCESS",
                    properties: this.getSIWXEventProperties()
                });
            } catch (r) {
                (!ue.state.open || te.state.view === "ApproveTransaction") && await ue.open({
                    view: "SIWXSignMessage"
                }), rs.showError("Error signing message"), le.sendEvent({
                    type: "track",
                    event: "SIWX_AUTH_ERROR",
                    properties: this.getSIWXEventProperties(r)
                }), console.error("SWIXUtil:requestSignMessage", r);
            }
        },
        async cancelSignMessage () {
            try {
                const t = this.getSIWX();
                if (t?.getRequired?.()) {
                    const s = p.getLastConnectedSIWECaipNetwork();
                    if (s) {
                        const n = await t?.getSessions(s?.caipNetworkId, J.getPlainAddress(p.getActiveCaipAddress()) || "");
                        n && n.length > 0 ? await p.switchActiveNetwork(s) : await H.disconnect();
                    } else await H.disconnect();
                } else ue.close();
                ue.close(), le.sendEvent({
                    event: "CLICK_CANCEL_SIWX",
                    type: "track",
                    properties: this.getSIWXEventProperties()
                });
            } catch (t) {
                console.error("SIWXUtil:cancelSignMessage", t);
            }
        },
        async getAllSessions () {
            const t = this.getSIWX(), e = p.getAllRequestedCaipNetworks(), s = [];
            return await Promise.all(e.map(async (n)=>{
                const r = await t?.getSessions(n.caipNetworkId, J.getPlainAddress(p.getActiveCaipAddress()) || "");
                r && s.push(...r);
            })), s;
        },
        async getSessions (t) {
            const e = _.state.siwx;
            let s = t?.address;
            if (!s) {
                const r = p.getActiveCaipAddress();
                s = J.getPlainAddress(r);
            }
            let n = t?.caipNetworkId;
            return n || (n = p.getActiveCaipNetwork()?.caipNetworkId), e && s && n ? e.getSessions(n, s) : [];
        },
        async isSIWXCloseDisabled () {
            const t = this.getSIWX();
            if (t) {
                const e = te.state.view === "ApproveTransaction", s = te.state.view === "SIWXSignMessage";
                if (e || s) return t.getRequired?.() && (await this.getSessions()).length === 0;
            }
            return !1;
        },
        async authConnectorAuthenticate ({ authConnector: t, chainId: e, socialUri: s, preferredAccountType: n, chainNamespace: r }) {
            const i = ns.getSIWX(), o = ni();
            if (!i || !r.includes(S.CHAIN.EVM) || _.state.remoteFeatures?.emailCapture) {
                const h = await t.connect({
                    chainId: e,
                    socialUri: s,
                    preferredAccountType: n
                });
                return {
                    address: h.address,
                    chainId: h.chainId,
                    accounts: h.accounts
                };
            }
            const a = `${r}:${e}`, c = await i.createMessage({
                chainId: a,
                accountAddress: "<<AccountAddress>>"
            }), l = {
                accountAddress: c.accountAddress,
                chainId: c.chainId,
                domain: c.domain,
                uri: c.uri,
                version: c.version,
                nonce: c.nonce,
                notBefore: c.notBefore,
                statement: c.statement,
                resources: c.resources,
                requestId: c.requestId,
                issuedAt: c.issuedAt,
                expirationTime: c.expirationTime,
                serializedMessage: c.toString()
            }, d = await t.connect({
                chainId: e,
                socialUri: s,
                siwxMessage: l,
                preferredAccountType: n
            });
            return l.accountAddress = d.address, l.serializedMessage = d.message || "", d.signature && d.message && await ns.addEmbeddedWalletSession(l, d.message, d.signature), p.setLastConnectedSIWECaipNetwork(o), {
                address: d.address,
                chainId: d.chainId,
                accounts: d.accounts
            };
        },
        async addEmbeddedWalletSession (t, e, s) {
            if (sn) return sn;
            const n = ns.getSIWX();
            return n ? (sn = n.addSession({
                data: t,
                message: e,
                signature: s
            }).finally(()=>{
                sn = null;
            }), sn) : Promise.resolve();
        },
        async universalProviderAuthenticate ({ universalProvider: t, chains: e, methods: s }) {
            const n = ns.getSIWX(), r = ni(), i = new Set(e.map((l)=>l.split(":")[0]));
            if (!n || i.size !== 1 || !i.has("eip155")) return !1;
            const o = await n.createMessage({
                chainId: ni()?.caipNetworkId || "",
                accountAddress: ""
            }), a = await t.authenticate({
                nonce: o.nonce,
                domain: o.domain,
                uri: o.uri,
                exp: o.expirationTime,
                iat: o.issuedAt,
                nbf: o.notBefore,
                requestId: o.requestId,
                version: o.version,
                resources: o.resources,
                statement: o.statement,
                chainId: o.chainId,
                methods: s,
                chains: [
                    o.chainId,
                    ...e.filter((l)=>l !== o.chainId)
                ]
            });
            rs.showLoading("Authenticating...", {
                autoClose: !1
            });
            const c = {
                ...a.session.peer.metadata,
                name: a.session.peer.metadata.name,
                icon: a.session.peer.metadata.icons?.[0],
                type: "WALLET_CONNECT"
            };
            if (p.setAccountProp("connectedWalletInfo", c, Array.from(i)[0]), a?.auths?.length) {
                const l = a.auths.map((d)=>{
                    const h = t.client.formatAuthMessage({
                        request: d.p,
                        iss: d.p.iss
                    });
                    return {
                        data: {
                            ...d.p,
                            accountAddress: d.p.iss.split(":").slice(-1).join(""),
                            chainId: d.p.iss.split(":").slice(2, 4).join(":"),
                            uri: d.p.aud,
                            version: d.p.version || o.version,
                            expirationTime: d.p.exp,
                            issuedAt: d.p.iat,
                            notBefore: d.p.nbf
                        },
                        message: h,
                        signature: d.s.s,
                        cacao: d
                    };
                });
                try {
                    await n.setSessions(l), r && p.setLastConnectedSIWECaipNetwork(r), le.sendEvent({
                        type: "track",
                        event: "SIWX_AUTH_SUCCESS",
                        properties: ns.getSIWXEventProperties()
                    });
                } catch (d) {
                    throw console.error("SIWX:universalProviderAuth - failed to set sessions", d), le.sendEvent({
                        type: "track",
                        event: "SIWX_AUTH_ERROR",
                        properties: ns.getSIWXEventProperties(d)
                    }), await t.disconnect().catch(console.error), d;
                } finally{
                    rs.hide();
                }
            }
            return !0;
        },
        getSIWXEventProperties (t) {
            const e = p.state.activeChain;
            if (!e) throw new Error("SIWXUtil:getSIWXEventProperties - namespace is required");
            return {
                network: p.state.activeCaipNetwork?.caipNetworkId || "",
                isSmartAccount: Lt(e) === Cs.ACCOUNT_TYPES.SMART_ACCOUNT,
                message: t ? J.parseError(t) : void 0
            };
        },
        async clearSessions () {
            const t = this.getSIWX();
            t && await t.setSessions([]);
        }
    };
    ms = {
        EIP155: S.CHAIN.EVM,
        CONNECTOR_TYPE_WALLET_CONNECT: "WALLET_CONNECT",
        CONNECTOR_TYPE_INJECTED: "INJECTED",
        CONNECTOR_TYPE_ANNOUNCED: "ANNOUNCED",
        CONNECTOR_TYPE_AUTH: "AUTH"
    };
    Lr = {
        NetworkImageIds: {
            1: "ba0ba0cd-17c6-4806-ad93-f9d174f17900",
            42161: "3bff954d-5cb0-47a0-9a23-d20192e74600",
            43114: "30c46e53-e989-45fb-4549-be3bd4eb3b00",
            56: "93564157-2e8e-4ce7-81df-b264dbee9b00",
            250: "06b26297-fe0c-4733-5d6b-ffa5498aac00",
            10: "ab9c186a-c52f-464b-2906-ca59d760a400",
            137: "41d04d42-da3b-4453-8506-668cc0727900",
            5e3: "e86fae9b-b770-4eea-e520-150e12c81100",
            295: "6a97d510-cac8-4e58-c7ce-e8681b044c00",
            11155111: "e909ea0a-f92a-4512-c8fc-748044ea6800",
            84532: "a18a7ecd-e307-4360-4746-283182228e00",
            1301: "4eeea7ef-0014-4649-5d1d-07271a80f600",
            130: "2257980a-3463-48c6-cbac-a42d2a956e00",
            10143: "0a728e83-bacb-46db-7844-948f05434900",
            100: "02b53f6a-e3d4-479e-1cb4-21178987d100",
            9001: "f926ff41-260d-4028-635e-91913fc28e00",
            324: "b310f07f-4ef7-49f3-7073-2a0a39685800",
            314: "5a73b3dd-af74-424e-cae0-0de859ee9400",
            4689: "34e68754-e536-40da-c153-6ef2e7188a00",
            1088: "3897a66d-40b9-4833-162f-a2c90531c900",
            1284: "161038da-44ae-4ec7-1208-0ea569454b00",
            1285: "f1d73bb6-5450-4e18-38f7-fb6484264a00",
            7777777: "845c60df-d429-4991-e687-91ae45791600",
            42220: "ab781bbc-ccc6-418d-d32d-789b15da1f00",
            8453: "7289c336-3981-4081-c5f4-efc26ac64a00",
            1313161554: "3ff73439-a619-4894-9262-4470c773a100",
            2020: "b8101fc0-9c19-4b6f-ec65-f6dfff106e00",
            2021: "b8101fc0-9c19-4b6f-ec65-f6dfff106e00",
            80094: "e329c2c9-59b0-4a02-83e4-212ff3779900",
            2741: "fc2427d1-5af9-4a9c-8da5-6f94627cd900",
            "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "a1b58899-f671-4276-6a5e-56ca5bd59700",
            "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z": "a1b58899-f671-4276-6a5e-56ca5bd59700",
            EtWTRABZaYq6iMfeYKouRu166VU2xqa1: "a1b58899-f671-4276-6a5e-56ca5bd59700",
            "000000000019d6689c085ae165831e93": "0b4838db-0161-4ffe-022d-532bf03dba00",
            "000000000933ea01ad0ee984209779ba": "39354064-d79b-420b-065d-f980c4b78200",
            "00000008819873e925422c1ff0f99f7c": "b3406e4a-bbfc-44fb-e3a6-89673c78b700"
        },
        ConnectorImageIds: {
            [S.CONNECTOR_ID.COINBASE]: "0c2840c3-5b04-4c44-9661-fbd4b49e1800",
            [S.CONNECTOR_ID.COINBASE_SDK]: "0c2840c3-5b04-4c44-9661-fbd4b49e1800",
            [S.CONNECTOR_ID.SAFE]: "461db637-8616-43ce-035a-d89b8a1d5800",
            [S.CONNECTOR_ID.LEDGER]: "54a1aa77-d202-4f8d-0fb2-5d2bb6db0300",
            [S.CONNECTOR_ID.WALLET_CONNECT]: "ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400",
            [S.CONNECTOR_ID.INJECTED]: "07ba87ed-43aa-4adf-4540-9e6a2b9cae00"
        },
        ConnectorNamesMap: {
            [S.CONNECTOR_ID.INJECTED]: "Browser Wallet",
            [S.CONNECTOR_ID.WALLET_CONNECT]: "WalletConnect",
            [S.CONNECTOR_ID.COINBASE]: "Coinbase",
            [S.CONNECTOR_ID.COINBASE_SDK]: "Coinbase",
            [S.CONNECTOR_ID.LEDGER]: "Ledger",
            [S.CONNECTOR_ID.SAFE]: "Safe"
        }
    };
    Ye = {
        getCaipTokens (t) {
            if (!t) return;
            const e = {};
            return Object.entries(t).forEach(([s, n])=>{
                e[`${ms.EIP155}:${s}`] = n;
            }), e;
        },
        isLowerCaseMatch (t, e) {
            return t?.toLowerCase() === e?.toLowerCase();
        },
        getActiveNamespaceConnectedToAuth () {
            const t = p.state.activeChain;
            return S.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((e)=>L.getConnectorId(e) === S.CONNECTOR_ID.AUTH && e === t);
        },
        withRetry ({ conditionFn: t, intervalMs: e, maxRetries: s }) {
            let n = 0;
            return new Promise((r)=>{
                async function i() {
                    return n += 1, await t() ? r(!0) : n >= s ? r(!1) : (setTimeout(i, e), null);
                }
                i();
            });
        },
        userChainIdToChainNamespace (t) {
            if (typeof t == "number") return S.CHAIN.EVM;
            const [e] = t.split(":");
            return e;
        },
        getOtherAuthNamespaces (t) {
            return t ? S.AUTH_CONNECTOR_SUPPORTED_CHAINS.filter((n)=>n !== t) : [];
        },
        getConnectorStorageInfo (t, e) {
            const n = $.getConnections()[e] ?? [];
            return {
                hasDisconnected: $.isConnectorDisconnected(t, e),
                hasConnected: n.some((r)=>Ye.isLowerCaseMatch(r.connectorId, t))
            };
        }
    };
    GA = {
        extractVersion (t) {
            if (!t || typeof t != "string") return null;
            const e = /(?:[~^>=<]+\s*)?(?<version>\d+(?:\.\d+){0,2})(?:-[a-zA-Z]+\.\d+)?/u;
            return t.match(e)?.groups?.version || null;
        },
        checkSDKVersion (t) {
            this.extractVersion(t);
        },
        isValidVersion (t) {
            return typeof t == "string" && /^\d+\.\d+\.\d+$/u.test(t);
        },
        isOlder (t, e) {
            const s = this.extractVersion(t), n = this.extractVersion(e);
            if (!s || !n) return !1;
            function r(a) {
                const c = a.split(".").map(Number);
                for(; c.length < 3;)c.push(0);
                return c;
            }
            const i = r(s), o = r(n);
            for(let a = 0; a < Math.max(i.length, o.length); a += 1){
                const c = i[a] || 0, l = o[a] || 0;
                if (c < l) return !0;
                if (c > l) return !1;
            }
            return !1;
        }
    };
    YA = new AbortController;
    Pt = {
        EmbeddedWalletAbortController: YA,
        UniversalProviderErrors: {
            UNAUTHORIZED_DOMAIN_NOT_ALLOWED: {
                message: "Unauthorized: origin not allowed",
                alertErrorKey: "ORIGIN_NOT_ALLOWED"
            },
            JWT_VALIDATION_ERROR: {
                message: "JWT validation error: JWT Token is not yet valid",
                alertErrorKey: "JWT_TOKEN_NOT_VALID"
            },
            INVALID_KEY: {
                message: "Unauthorized: invalid key",
                alertErrorKey: "INVALID_PROJECT_ID"
            }
        },
        ALERT_ERRORS: {
            SWITCH_NETWORK_NOT_FOUND: {
                code: "APKT001",
                displayMessage: "Network Not Found",
                debugMessage: "The specified network is not recognized. Please ensure it is included in the `networks` array of your `createAppKit` configuration."
            },
            ORIGIN_NOT_ALLOWED: {
                code: "APKT002",
                displayMessage: "Invalid App Configuration",
                debugMessage: ()=>`The origin ${yr() ? window.origin : "unknown"} is not in your allow list. Please update your allowed domains at https://dashboard.reown.com.`
            },
            IFRAME_LOAD_FAILED: {
                code: "APKT003",
                displayMessage: "Network Error: Wallet Load Failed",
                debugMessage: ()=>"Failed to load the embedded wallet. This may be due to network issues or server downtime. Please check your network connection and try again shortly. Contact support if the issue persists."
            },
            IFRAME_REQUEST_TIMEOUT: {
                code: "APKT004",
                displayMessage: "Wallet Request Timeout",
                debugMessage: ()=>"The request to the embedded wallet timed out. Please check your network connection and try again shortly. Contact support if the issue persists."
            },
            UNVERIFIED_DOMAIN: {
                code: "APKT005",
                displayMessage: "Unverified Domain",
                debugMessage: ()=>"Embedded wallet load failed. Ensure your domain is verified in https://dashboard.reown.com."
            },
            JWT_TOKEN_NOT_VALID: {
                code: "APKT006",
                displayMessage: "Session Expired",
                debugMessage: "Your session is invalid or expired. Please check your system’s date and time settings, then reconnect."
            },
            INVALID_PROJECT_ID: {
                code: "APKT007",
                displayMessage: "Invalid Project ID",
                debugMessage: "The specified project ID is invalid. Please visit https://dashboard.reown.com to obtain a valid project ID."
            },
            PROJECT_ID_NOT_CONFIGURED: {
                code: "APKT008",
                displayMessage: "Project ID Missing",
                debugMessage: "No project ID is configured. You can create and configure a project ID at https://dashboard.reown.com."
            },
            SERVER_ERROR_APP_CONFIGURATION: {
                code: "APKT009",
                displayMessage: "Server Error",
                debugMessage: (t)=>`Unable to fetch App Configuration. ${t}. Please check your network connection and try again shortly. Contact support if the issue persists.`
            },
            RATE_LIMITED_APP_CONFIGURATION: {
                code: "APKT010",
                displayMessage: "Rate Limited",
                debugMessage: "You have been rate limited while retrieving App Configuration. Please wait a few minutes and try again. Contact support if the issue persists."
            }
        },
        ALERT_WARNINGS: {
            LOCAL_CONFIGURATION_IGNORED: {
                debugMessage: (t)=>`[Reown Config Notice] ${t}`
            },
            INACTIVE_NAMESPACE_NOT_CONNECTED: {
                code: "APKTW001",
                displayMessage: "Inactive Namespace Not Connected",
                debugMessage: (t, e)=>`An error occurred while connecting an inactive namespace ${t}: "${e}"`
            },
            INVALID_EMAIL: {
                code: "APKTW002",
                displayMessage: "Invalid Email Address",
                debugMessage: "Please enter a valid email address"
            }
        }
    };
    Tu = {
        TOKEN_ADDRESSES_BY_SYMBOL: {
            USDC: {
                8453: af.asset,
                84532: cf.asset
            }
        },
        getTokenSymbolByAddress (t) {
            if (!t) return;
            const [e] = Object.entries(Tu.TOKEN_ADDRESSES_BY_SYMBOL).find(([s, n])=>Object.values(n).includes(t)) ?? [];
            return e;
        }
    };
    JA = {
        createLogger (t, e = "error") {
            const s = Kr({
                level: e
            }), { logger: n } = Hd({
                opts: s
            });
            return n.error = (...r)=>{
                for (const i of r)if (i instanceof Error) {
                    t(i, ...r);
                    return;
                }
                t(void 0, ...r);
            }, n;
        }
    };
    XA = "rpc.walletconnect.org";
    function ud(t, e) {
        const s = new URL("https://rpc.walletconnect.org/v1/");
        return s.searchParams.set("chainId", t), s.searchParams.set("projectId", e), s.toString();
    }
    let Mo;
    Mo = [
        "near:mainnet",
        "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        "eip155:1101",
        "eip155:56",
        "eip155:42161",
        "eip155:7777777",
        "eip155:59144",
        "eip155:324",
        "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
        "eip155:5000",
        "solana:4sgjmw1sunhzsxgspuhpqldx6wiyjntz",
        "eip155:80084",
        "eip155:5003",
        "eip155:100",
        "eip155:8453",
        "eip155:42220",
        "eip155:1313161555",
        "eip155:17000",
        "eip155:1",
        "eip155:300",
        "eip155:1313161554",
        "eip155:1329",
        "eip155:84532",
        "eip155:421614",
        "eip155:11155111",
        "eip155:8217",
        "eip155:43114",
        "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
        "eip155:999999999",
        "eip155:11155420",
        "eip155:80002",
        "eip155:97",
        "eip155:43113",
        "eip155:137",
        "eip155:10",
        "eip155:1301",
        "eip155:80094",
        "eip155:80069",
        "eip155:560048",
        "eip155:31",
        "eip155:2818",
        "eip155:57054",
        "eip155:911867",
        "eip155:534351",
        "eip155:1112",
        "eip155:534352",
        "eip155:1111",
        "eip155:146",
        "eip155:130",
        "eip155:1284",
        "eip155:30",
        "eip155:2810",
        "bip122:000000000019d6689c085ae165831e93",
        "bip122:000000000933ea01ad0ee984209779ba"
    ];
    Mn = {
        extendRpcUrlWithProjectId (t, e) {
            let s = !1;
            try {
                s = new URL(t).host === XA;
            } catch  {
                s = !1;
            }
            if (s) {
                const n = new URL(t);
                return n.searchParams.has("projectId") || n.searchParams.set("projectId", e), n.toString();
            }
            return t;
        },
        isCaipNetwork (t) {
            return "chainNamespace" in t && "caipNetworkId" in t;
        },
        getChainNamespace (t) {
            return this.isCaipNetwork(t) ? t.chainNamespace : S.CHAIN.EVM;
        },
        getCaipNetworkId (t) {
            return this.isCaipNetwork(t) ? t.caipNetworkId : `${S.CHAIN.EVM}:${t.id}`;
        },
        getDefaultRpcUrl (t, e, s) {
            const n = t.rpcUrls?.default?.http?.[0];
            return Mo.includes(e) ? ud(e, s) : n || "";
        },
        extendCaipNetwork (t, { customNetworkImageUrls: e, projectId: s, customRpcUrls: n }) {
            const r = this.getChainNamespace(t), i = this.getCaipNetworkId(t), o = t.rpcUrls?.default?.http?.[0], a = this.getDefaultRpcUrl(t, i, s), c = t?.rpcUrls?.chainDefault?.http?.[0] || o, l = n?.[i]?.map((u)=>u.url) || [], d = [
                ...l,
                ...a ? [
                    a
                ] : []
            ], h = [
                ...l
            ];
            return c && !h.includes(c) && h.push(c), {
                ...t,
                chainNamespace: r,
                caipNetworkId: i,
                assets: {
                    imageId: Lr.NetworkImageIds[t.id],
                    imageUrl: e?.[t.id]
                },
                rpcUrls: {
                    ...t.rpcUrls,
                    default: {
                        http: d
                    },
                    chainDefault: {
                        http: h
                    }
                }
            };
        },
        extendCaipNetworks (t, { customNetworkImageUrls: e, projectId: s, customRpcUrls: n }) {
            return t.map((r)=>Mn.extendCaipNetwork(r, {
                    customNetworkImageUrls: e,
                    customRpcUrls: n,
                    projectId: s
                }));
        },
        getViemTransport (t, e, s) {
            const n = [];
            return s?.forEach((r)=>{
                n.push(ti(r.url, r.config));
            }), Mo.includes(t.caipNetworkId) && n.push(ti(ud(t.caipNetworkId, e), {
                fetchOptions: {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                }
            })), t?.rpcUrls?.default?.http?.forEach((r)=>{
                n.push(ti(r));
            }), nc(n);
        },
        extendWagmiTransports (t, e, s) {
            if (Mo.includes(t.caipNetworkId)) {
                const n = this.getDefaultRpcUrl(t, t.caipNetworkId, e);
                return nc([
                    s,
                    ti(n)
                ]);
            }
            return s;
        },
        getUnsupportedNetwork (t) {
            return {
                id: t.split(":")[1],
                caipNetworkId: t,
                name: S.UNSUPPORTED_NETWORK_NAME,
                chainNamespace: t.split(":")[0],
                nativeCurrency: {
                    name: "",
                    decimals: 0,
                    symbol: ""
                },
                rpcUrls: {
                    default: {
                        http: []
                    }
                }
            };
        },
        getCaipNetworkFromStorage (t) {
            const e = $.getActiveCaipNetworkId(), s = p.getAllRequestedCaipNetworks(), n = Array.from(p.state.chains?.keys() || []), r = e?.split(":")[0], i = r ? n.includes(r) : !1, o = s?.find((c)=>c.caipNetworkId === e);
            return i && !o && e ? this.getUnsupportedNetwork(e) : o || t || s?.[0];
        }
    };
    ZA = {
        ACCOUNT_TABS: [
            {
                label: "Tokens"
            },
            {
                label: "Activity"
            }
        ],
        VIEW_DIRECTION: {
            Next: "next",
            Prev: "prev"
        },
        DEFAULT_CONNECT_METHOD_ORDER: [
            "email",
            "social",
            "wallet"
        ],
        ANIMATION_DURATIONS: {
            HeaderText: 120
        },
        VIEWS_WITH_LEGAL_FOOTER: [
            "Connect",
            "ConnectWallets",
            "OnRampTokenSelect",
            "OnRampFiatSelect",
            "OnRampProviders"
        ],
        VIEWS_WITH_DEFAULT_FOOTER: [
            "Networks"
        ]
    };
    vr = {
        filterOutDuplicatesByRDNS (t) {
            const e = _.state.enableEIP6963 ? L.state.connectors : [], s = $.getRecentWallets(), n = e.map((a)=>a.info?.rdns).filter(Boolean), r = s.map((a)=>a.rdns).filter(Boolean), i = n.concat(r);
            if (i.includes("io.metamask.mobile") && J.isMobile()) {
                const a = i.indexOf("io.metamask.mobile");
                i[a] = "io.metamask";
            }
            return t.filter((a)=>!(a?.rdns && i.includes(String(a.rdns)) || !a?.rdns && e.some((l)=>l.name === a.name)));
        },
        filterOutDuplicatesByIds (t) {
            const e = L.state.connectors.filter((a)=>a.type === "ANNOUNCED" || a.type === "INJECTED"), s = $.getRecentWallets(), n = e.map((a)=>a.explorerId), r = s.map((a)=>a.id), i = n.concat(r);
            return t.filter((a)=>!i.includes(a?.id));
        },
        filterOutDuplicateWallets (t) {
            const e = this.filterOutDuplicatesByRDNS(t);
            return this.filterOutDuplicatesByIds(e);
        },
        markWalletsAsInstalled (t) {
            const { connectors: e } = L.state, { featuredWalletIds: s } = _.state, n = e.filter((o)=>o.type === "ANNOUNCED").reduce((o, a)=>(a.info?.rdns && (o[a.info.rdns] = !0), o), {});
            return t.map((o)=>({
                    ...o,
                    installed: !!o.rdns && !!n[o.rdns ?? ""]
                })).sort((o, a)=>{
                const c = Number(a.installed) - Number(o.installed);
                if (c !== 0) return c;
                if (s?.length) {
                    const l = s.indexOf(o.id), d = s.indexOf(a.id);
                    if (l !== -1 && d !== -1) return l - d;
                    if (l !== -1) return -1;
                    if (d !== -1) return 1;
                }
                return 0;
            });
        },
        getConnectOrderMethod (t, e) {
            const s = t?.connectMethodsOrder || _.state.features?.connectMethodsOrder, n = e || L.state.connectors;
            if (s) return s;
            const { injected: r, announced: i } = vi.getConnectorsByType(n, ee.state.recommended, ee.state.featured), o = r.filter(vi.showConnector), a = i.filter(vi.showConnector);
            return o.length || a.length ? [
                "wallet",
                "email",
                "social"
            ] : ZA.DEFAULT_CONNECT_METHOD_ORDER;
        },
        isExcluded (t) {
            const e = !!t.rdns && ee.state.excludedWallets.some((n)=>n.rdns === t.rdns), s = !!t.name && ee.state.excludedWallets.some((n)=>Ye.isLowerCaseMatch(n.name, t.name));
            return e || s;
        },
        markWalletsWithDisplayIndex (t) {
            return t.map((e, s)=>({
                    ...e,
                    display_index: s
                }));
        }
    };
    vi = {
        getConnectorsByType (t, e, s) {
            const { customWallets: n } = _.state, r = $.getRecentWallets(), i = vr.filterOutDuplicateWallets(e), o = vr.filterOutDuplicateWallets(s), a = t.filter((h)=>h.type === "MULTI_CHAIN"), c = t.filter((h)=>h.type === "ANNOUNCED"), l = t.filter((h)=>h.type === "INJECTED"), d = t.filter((h)=>h.type === "EXTERNAL");
            return {
                custom: n,
                recent: r,
                external: d,
                multiChain: a,
                announced: c,
                injected: l,
                recommended: i,
                featured: o
            };
        },
        showConnector (t) {
            const e = t.info?.rdns, s = !!e && ee.state.excludedWallets.some((r)=>!!r.rdns && r.rdns === e), n = !!t.name && ee.state.excludedWallets.some((r)=>Ye.isLowerCaseMatch(r.name, t.name));
            return !(t.type === "INJECTED" && (t.name === "Browser Wallet" && (!J.isMobile() || J.isMobile() && !e && !H.checkInstalled()) || s || n) || (t.type === "ANNOUNCED" || t.type === "EXTERNAL") && (s || n));
        },
        getIsConnectedWithWC () {
            return Array.from(p.state.chains.values()).some((s)=>L.getConnectorId(s.namespace) === S.CONNECTOR_ID.WALLET_CONNECT);
        },
        getConnectorTypeOrder ({ recommended: t, featured: e, custom: s, recent: n, announced: r, injected: i, multiChain: o, external: a, overriddenConnectors: c = _.state.features?.connectorTypeOrder ?? [] }) {
            const d = [
                {
                    type: "walletConnect",
                    isEnabled: !0
                },
                {
                    type: "recent",
                    isEnabled: n.length > 0
                },
                {
                    type: "injected",
                    isEnabled: [
                        ...i,
                        ...r,
                        ...o
                    ].length > 0
                },
                {
                    type: "featured",
                    isEnabled: e.length > 0
                },
                {
                    type: "custom",
                    isEnabled: s && s.length > 0
                },
                {
                    type: "external",
                    isEnabled: a.length > 0
                },
                {
                    type: "recommended",
                    isEnabled: t.length > 0
                }
            ].filter((g)=>g.isEnabled), h = new Set(d.map((g)=>g.type)), u = c.filter((g)=>h.has(g)).map((g)=>({
                    type: g,
                    isEnabled: !0
                })), f = d.filter(({ type: g })=>!u.some(({ type: m })=>m === g));
            return Array.from(new Set([
                ...u,
                ...f
            ].map(({ type: g })=>g)));
        },
        sortConnectorsByExplorerWallet (t) {
            return [
                ...t
            ].sort((e, s)=>e.explorerWallet && s.explorerWallet ? (e.explorerWallet.order ?? 0) - (s.explorerWallet.order ?? 0) : e.explorerWallet ? -1 : s.explorerWallet ? 1 : 0);
        },
        getAuthName ({ email: t, socialUsername: e, socialProvider: s }) {
            return e ? s && s === "discord" && e.endsWith("0") ? e.slice(0, -1) : e : t.length > 30 ? `${t.slice(0, -3)}...` : t;
        },
        async fetchProviderData (t) {
            try {
                if (t.name === "Browser Wallet" && !J.isMobile()) return {
                    accounts: [],
                    chainId: void 0
                };
                if (t.id === S.CONNECTOR_ID.AUTH) return {
                    accounts: [],
                    chainId: void 0
                };
                const [e, s] = await Promise.all([
                    t.provider?.request({
                        method: "eth_accounts"
                    }),
                    t.provider?.request({
                        method: "eth_chainId"
                    }).then((n)=>Number(n))
                ]);
                return {
                    accounts: e,
                    chainId: s
                };
            } catch (e) {
                return console.warn(`Failed to fetch provider data for ${t.name}`, e), {
                    accounts: [],
                    chainId: void 0
                };
            }
        },
        getFilteredCustomWallets (t) {
            const e = $.getRecentWallets(), s = L.state.connectors.map((o)=>o.info?.rdns).filter(Boolean), n = e.map((o)=>o.rdns).filter(Boolean), r = s.concat(n);
            if (r.includes("io.metamask.mobile") && J.isMobile()) {
                const o = r.indexOf("io.metamask.mobile");
                r[o] = "io.metamask";
            }
            return t.filter((o)=>!r.includes(String(o?.rdns)));
        },
        hasWalletConnector (t) {
            return L.state.connectors.some((e)=>e.id === t.id || e.name === t.name);
        },
        isWalletCompatibleWithCurrentChain (t) {
            const e = p.state.activeChain;
            return e && t.chains ? t.chains.some((s)=>{
                const n = s.split(":")[0];
                return e === n;
            }) : !0;
        },
        getFilteredRecentWallets () {
            return $.getRecentWallets().filter((s)=>!vr.isExcluded(s)).filter((s)=>!this.hasWalletConnector(s)).filter((s)=>this.isWalletCompatibleWithCurrentChain(s));
        },
        getCappedRecommendedWallets (t) {
            const { connectors: e } = L.state, { customWallets: s, featuredWalletIds: n } = _.state, r = e.find((v)=>v.id === "walletConnect"), i = e.filter((v)=>v.type === "INJECTED" || v.type === "ANNOUNCED" || v.type === "MULTI_CHAIN");
            if (!r && !i.length && !s?.length) return [];
            const o = Ho.isEmailEnabled(), a = Ho.isSocialsEnabled(), c = i.filter((v)=>v.name !== "Browser Wallet"), l = n?.length || 0, d = s?.length || 0, h = c.length || 0, u = o ? 1 : 0, f = a ? 1 : 0, g = l + d + h + u + f, m = Math.max(0, 4 - g);
            return m <= 0 ? [] : vr.filterOutDuplicateWallets(t).slice(0, m);
        }
    };
    const Ai = globalThis, Za = Ai.ShadowRoot && (Ai.ShadyCSS === void 0 || Ai.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Qa = Symbol(), pd = new WeakMap;
    let ku = class {
        constructor(e, s, n){
            if (this._$cssResult$ = !0, n !== Qa) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
            this.cssText = e, this.t = s;
        }
        get styleSheet() {
            let e = this.o;
            const s = this.t;
            if (Za && e === void 0) {
                const n = s !== void 0 && s.length === 1;
                n && (e = pd.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet).replaceSync(this.cssText), n && pd.set(s, e));
            }
            return e;
        }
        toString() {
            return this.cssText;
        }
    };
    let Vt, QA, fd;
    Vt = (t)=>new ku(typeof t == "string" ? t : t + "", void 0, Qa);
    Hs = (t, ...e)=>{
        const s = t.length === 1 ? t[0] : e.reduce((n, r, i)=>n + ((o)=>{
                if (o._$cssResult$ === !0) return o.cssText;
                if (typeof o == "number") return o;
                throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
            })(r) + t[i + 1], t[0]);
        return new ku(s, t, Qa);
    };
    QA = (t, e)=>{
        if (Za) t.adoptedStyleSheets = e.map((s)=>s instanceof CSSStyleSheet ? s : s.styleSheet);
        else for (const s of e){
            const n = document.createElement("style"), r = Ai.litNonce;
            r !== void 0 && n.setAttribute("nonce", r), n.textContent = s.cssText, t.appendChild(n);
        }
    };
    fd = Za ? (t)=>t : (t)=>t instanceof CSSStyleSheet ? ((e)=>{
            let s = "";
            for (const n of e.cssRules)s += n.cssText;
            return Vt(s);
        })(t) : t;
    let e1, t1, s1, n1, r1, i1, no, gd, o1, a1, Or, md;
    ({ is: e1, defineProperty: t1, getOwnPropertyDescriptor: s1, getOwnPropertyNames: n1, getOwnPropertySymbols: r1, getPrototypeOf: i1 } = Object);
    no = globalThis;
    gd = no.trustedTypes;
    o1 = gd ? gd.emptyScript : "";
    a1 = no.reactiveElementPolyfillSupport;
    Or = (t, e)=>t;
    Na = {
        toAttribute (t, e) {
            switch(e){
                case Boolean:
                    t = t ? o1 : null;
                    break;
                case Object:
                case Array:
                    t = t == null ? t : JSON.stringify(t);
            }
            return t;
        },
        fromAttribute (t, e) {
            let s = t;
            switch(e){
                case Boolean:
                    s = t !== null;
                    break;
                case Number:
                    s = t === null ? null : Number(t);
                    break;
                case Object:
                case Array:
                    try {
                        s = JSON.parse(t);
                    } catch  {
                        s = null;
                    }
            }
            return s;
        }
    };
    Ou = (t, e)=>!e1(t, e);
    md = {
        attribute: !0,
        type: String,
        converter: Na,
        reflect: !1,
        useDefault: !1,
        hasChanged: Ou
    };
    Symbol.metadata ??= Symbol("metadata"), no.litPropertyMetadata ??= new WeakMap;
    let Bn = class extends HTMLElement {
        static addInitializer(e) {
            this._$Ei(), (this.l ??= []).push(e);
        }
        static get observedAttributes() {
            return this.finalize(), this._$Eh && [
                ...this._$Eh.keys()
            ];
        }
        static createProperty(e, s = md) {
            if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
                const n = Symbol(), r = this.getPropertyDescriptor(e, n, s);
                r !== void 0 && t1(this.prototype, e, r);
            }
        }
        static getPropertyDescriptor(e, s, n) {
            const { get: r, set: i } = s1(this.prototype, e) ?? {
                get () {
                    return this[s];
                },
                set (o) {
                    this[s] = o;
                }
            };
            return {
                get: r,
                set (o) {
                    const a = r?.call(this);
                    i?.call(this, o), this.requestUpdate(e, a, n);
                },
                configurable: !0,
                enumerable: !0
            };
        }
        static getPropertyOptions(e) {
            return this.elementProperties.get(e) ?? md;
        }
        static _$Ei() {
            if (this.hasOwnProperty(Or("elementProperties"))) return;
            const e = i1(this);
            e.finalize(), e.l !== void 0 && (this.l = [
                ...e.l
            ]), this.elementProperties = new Map(e.elementProperties);
        }
        static finalize() {
            if (this.hasOwnProperty(Or("finalized"))) return;
            if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Or("properties"))) {
                const s = this.properties, n = [
                    ...n1(s),
                    ...r1(s)
                ];
                for (const r of n)this.createProperty(r, s[r]);
            }
            const e = this[Symbol.metadata];
            if (e !== null) {
                const s = litPropertyMetadata.get(e);
                if (s !== void 0) for (const [n, r] of s)this.elementProperties.set(n, r);
            }
            this._$Eh = new Map;
            for (const [s, n] of this.elementProperties){
                const r = this._$Eu(s, n);
                r !== void 0 && this._$Eh.set(r, s);
            }
            this.elementStyles = this.finalizeStyles(this.styles);
        }
        static finalizeStyles(e) {
            const s = [];
            if (Array.isArray(e)) {
                const n = new Set(e.flat(1 / 0).reverse());
                for (const r of n)s.unshift(fd(r));
            } else e !== void 0 && s.push(fd(e));
            return s;
        }
        static _$Eu(e, s) {
            const n = s.attribute;
            return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
        }
        constructor(){
            super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
        }
        _$Ev() {
            this._$ES = new Promise((e)=>this.enableUpdating = e), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e)=>e(this));
        }
        addController(e) {
            (this._$EO ??= new Set).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
        }
        removeController(e) {
            this._$EO?.delete(e);
        }
        _$E_() {
            const e = new Map, s = this.constructor.elementProperties;
            for (const n of s.keys())this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
            e.size > 0 && (this._$Ep = e);
        }
        createRenderRoot() {
            const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
            return QA(e, this.constructor.elementStyles), e;
        }
        connectedCallback() {
            this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e)=>e.hostConnected?.());
        }
        enableUpdating(e) {}
        disconnectedCallback() {
            this._$EO?.forEach((e)=>e.hostDisconnected?.());
        }
        attributeChangedCallback(e, s, n) {
            this._$AK(e, n);
        }
        _$ET(e, s) {
            const n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
            if (r !== void 0 && n.reflect === !0) {
                const i = (n.converter?.toAttribute !== void 0 ? n.converter : Na).toAttribute(s, n.type);
                this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
            }
        }
        _$AK(e, s) {
            const n = this.constructor, r = n._$Eh.get(e);
            if (r !== void 0 && this._$Em !== r) {
                const i = n.getPropertyOptions(r), o = typeof i.converter == "function" ? {
                    fromAttribute: i.converter
                } : i.converter?.fromAttribute !== void 0 ? i.converter : Na;
                this._$Em = r;
                const a = o.fromAttribute(s, i.type);
                this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
            }
        }
        requestUpdate(e, s, n, r = !1, i) {
            if (e !== void 0) {
                const o = this.constructor;
                if (r === !1 && (i = this[e]), n ??= o.getPropertyOptions(e), !((n.hasChanged ?? Ou)(i, s) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, n)))) return;
                this.C(e, s, n);
            }
            this.isUpdatePending === !1 && (this._$ES = this._$EP());
        }
        C(e, s, { useDefault: n, reflect: r, wrapped: i }, o) {
            n && !(this._$Ej ??= new Map).has(e) && (this._$Ej.set(e, o ?? s ?? this[e]), i !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ??= new Set).add(e));
        }
        async _$EP() {
            this.isUpdatePending = !0;
            try {
                await this._$ES;
            } catch (s) {
                Promise.reject(s);
            }
            const e = this.scheduleUpdate();
            return e != null && await e, !this.isUpdatePending;
        }
        scheduleUpdate() {
            return this.performUpdate();
        }
        performUpdate() {
            if (!this.isUpdatePending) return;
            if (!this.hasUpdated) {
                if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
                    for (const [r, i] of this._$Ep)this[r] = i;
                    this._$Ep = void 0;
                }
                const n = this.constructor.elementProperties;
                if (n.size > 0) for (const [r, i] of n){
                    const { wrapped: o } = i, a = this[r];
                    o !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, i, a);
                }
            }
            let e = !1;
            const s = this._$AL;
            try {
                e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((n)=>n.hostUpdate?.()), this.update(s)) : this._$EM();
            } catch (n) {
                throw e = !1, this._$EM(), n;
            }
            e && this._$AE(s);
        }
        willUpdate(e) {}
        _$AE(e) {
            this._$EO?.forEach((s)=>s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
        }
        _$EM() {
            this._$AL = new Map, this.isUpdatePending = !1;
        }
        get updateComplete() {
            return this.getUpdateComplete();
        }
        getUpdateComplete() {
            return this._$ES;
        }
        shouldUpdate(e) {
            return !0;
        }
        update(e) {
            this._$Eq &&= this._$Eq.forEach((s)=>this._$ET(s, this[s])), this._$EM();
        }
        updated(e) {}
        firstUpdated(e) {}
    };
    Bn.elementStyles = [], Bn.shadowRootOptions = {
        mode: "open"
    }, Bn[Or("elementProperties")] = new Map, Bn[Or("finalized")] = new Map, a1?.({
        ReactiveElement: Bn
    }), (no.reactiveElementVersions ??= []).push("2.1.2");
    let ec, wd, ji, yd, Pu, Vs, Ru, c1, En, Mr, Br, tc, l1, Bo, wr, bd, Cd, nn, Ed, vd, xu, $u, Ad, gn;
    ec = globalThis;
    wd = (t)=>t;
    ji = ec.trustedTypes;
    yd = ji ? ji.createPolicy("lit-html", {
        createHTML: (t)=>t
    }) : void 0;
    Pu = "$lit$";
    Vs = `lit$${Math.random().toFixed(9).slice(2)}$`;
    Ru = "?" + Vs;
    c1 = `<${Ru}>`;
    En = document;
    Mr = ()=>En.createComment("");
    Br = (t)=>t === null || typeof t != "object" && typeof t != "function";
    tc = Array.isArray;
    l1 = (t)=>tc(t) || typeof t?.[Symbol.iterator] == "function";
    Bo = `[ 	
\f\r]`;
    wr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    bd = /-->/g;
    Cd = />/g;
    nn = RegExp(`>|${Bo}(?:([^\\s"'>=/]+)(${Bo}*=${Bo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    Ed = /'/g;
    vd = /"/g;
    xu = /^(?:script|style|textarea|title)$/i;
    $u = (t)=>(e, ...s)=>({
                _$litType$: t,
                strings: e,
                values: s
            });
    fI = $u(1);
    gI = $u(2);
    Zn = Symbol.for("lit-noChange");
    He = Symbol.for("lit-nothing");
    Ad = new WeakMap;
    gn = En.createTreeWalker(En, 129);
    function Uu(t, e) {
        if (!tc(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
        return yd !== void 0 ? yd.createHTML(e) : e;
    }
    const d1 = (t, e)=>{
        const s = t.length - 1, n = [];
        let r, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = wr;
        for(let a = 0; a < s; a++){
            const c = t[a];
            let l, d, h = -1, u = 0;
            for(; u < c.length && (o.lastIndex = u, d = o.exec(c), d !== null);)u = o.lastIndex, o === wr ? d[1] === "!--" ? o = bd : d[1] !== void 0 ? o = Cd : d[2] !== void 0 ? (xu.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = nn) : d[3] !== void 0 && (o = nn) : o === nn ? d[0] === ">" ? (o = r ?? wr, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? nn : d[3] === '"' ? vd : Ed) : o === vd || o === Ed ? o = nn : o === bd || o === Cd ? o = wr : (o = nn, r = void 0);
            const f = o === nn && t[a + 1].startsWith("/>") ? " " : "";
            i += o === wr ? c + c1 : h >= 0 ? (n.push(l), c.slice(0, h) + Pu + c.slice(h) + Vs + f) : c + Vs + (h === -2 ? a : f);
        }
        return [
            Uu(t, i + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")),
            n
        ];
    };
    class Fr {
        constructor({ strings: e, _$litType$: s }, n){
            let r;
            this.parts = [];
            let i = 0, o = 0;
            const a = e.length - 1, c = this.parts, [l, d] = d1(e, s);
            if (this.el = Fr.createElement(l, n), gn.currentNode = this.el.content, s === 2 || s === 3) {
                const h = this.el.content.firstChild;
                h.replaceWith(...h.childNodes);
            }
            for(; (r = gn.nextNode()) !== null && c.length < a;){
                if (r.nodeType === 1) {
                    if (r.hasAttributes()) for (const h of r.getAttributeNames())if (h.endsWith(Pu)) {
                        const u = d[o++], f = r.getAttribute(h).split(Vs), g = /([.?@])?(.*)/.exec(u);
                        c.push({
                            type: 1,
                            index: i,
                            name: g[2],
                            strings: f,
                            ctor: g[1] === "." ? u1 : g[1] === "?" ? p1 : g[1] === "@" ? f1 : ro
                        }), r.removeAttribute(h);
                    } else h.startsWith(Vs) && (c.push({
                        type: 6,
                        index: i
                    }), r.removeAttribute(h));
                    if (xu.test(r.tagName)) {
                        const h = r.textContent.split(Vs), u = h.length - 1;
                        if (u > 0) {
                            r.textContent = ji ? ji.emptyScript : "";
                            for(let f = 0; f < u; f++)r.append(h[f], Mr()), gn.nextNode(), c.push({
                                type: 2,
                                index: ++i
                            });
                            r.append(h[u], Mr());
                        }
                    }
                } else if (r.nodeType === 8) if (r.data === Ru) c.push({
                    type: 2,
                    index: i
                });
                else {
                    let h = -1;
                    for(; (h = r.data.indexOf(Vs, h + 1)) !== -1;)c.push({
                        type: 7,
                        index: i
                    }), h += Vs.length - 1;
                }
                i++;
            }
        }
        static createElement(e, s) {
            const n = En.createElement("template");
            return n.innerHTML = e, n;
        }
    }
    function Qn(t, e, s = t, n) {
        if (e === Zn) return e;
        let r = n !== void 0 ? s._$Co?.[n] : s._$Cl;
        const i = Br(e) ? void 0 : e._$litDirective$;
        return r?.constructor !== i && (r?._$AO?.(!1), i === void 0 ? r = void 0 : (r = new i(t), r._$AT(t, s, n)), n !== void 0 ? (s._$Co ??= [])[n] = r : s._$Cl = r), r !== void 0 && (e = Qn(t, r._$AS(t, e.values), r, n)), e;
    }
    class h1 {
        constructor(e, s){
            this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
        }
        get parentNode() {
            return this._$AM.parentNode;
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        u(e) {
            const { el: { content: s }, parts: n } = this._$AD, r = (e?.creationScope ?? En).importNode(s, !0);
            gn.currentNode = r;
            let i = gn.nextNode(), o = 0, a = 0, c = n[0];
            for(; c !== void 0;){
                if (o === c.index) {
                    let l;
                    c.type === 2 ? l = new Qr(i, i.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(i, c.name, c.strings, this, e) : c.type === 6 && (l = new g1(i, this, e)), this._$AV.push(l), c = n[++a];
                }
                o !== c?.index && (i = gn.nextNode(), o++);
            }
            return gn.currentNode = En, r;
        }
        p(e) {
            let s = 0;
            for (const n of this._$AV)n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, s), s += n.strings.length - 2) : n._$AI(e[s])), s++;
        }
    }
    class Qr {
        get _$AU() {
            return this._$AM?._$AU ?? this._$Cv;
        }
        constructor(e, s, n, r){
            this.type = 2, this._$AH = He, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
        }
        get parentNode() {
            let e = this._$AA.parentNode;
            const s = this._$AM;
            return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
        }
        get startNode() {
            return this._$AA;
        }
        get endNode() {
            return this._$AB;
        }
        _$AI(e, s = this) {
            e = Qn(this, e, s), Br(e) ? e === He || e == null || e === "" ? (this._$AH !== He && this._$AR(), this._$AH = He) : e !== this._$AH && e !== Zn && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : l1(e) ? this.k(e) : this._(e);
        }
        O(e) {
            return this._$AA.parentNode.insertBefore(e, this._$AB);
        }
        T(e) {
            this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
        }
        _(e) {
            this._$AH !== He && Br(this._$AH) ? this._$AA.nextSibling.data = e : this.T(En.createTextNode(e)), this._$AH = e;
        }
        $(e) {
            const { values: s, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Fr.createElement(Uu(n.h, n.h[0]), this.options)), n);
            if (this._$AH?._$AD === r) this._$AH.p(s);
            else {
                const i = new h1(r, this), o = i.u(this.options);
                i.p(s), this.T(o), this._$AH = i;
            }
        }
        _$AC(e) {
            let s = Ad.get(e.strings);
            return s === void 0 && Ad.set(e.strings, s = new Fr(e)), s;
        }
        k(e) {
            tc(this._$AH) || (this._$AH = [], this._$AR());
            const s = this._$AH;
            let n, r = 0;
            for (const i of e)r === s.length ? s.push(n = new Qr(this.O(Mr()), this.O(Mr()), this, this.options)) : n = s[r], n._$AI(i), r++;
            r < s.length && (this._$AR(n && n._$AB.nextSibling, r), s.length = r);
        }
        _$AR(e = this._$AA.nextSibling, s) {
            for(this._$AP?.(!1, !0, s); e !== this._$AB;){
                const n = wd(e).nextSibling;
                wd(e).remove(), e = n;
            }
        }
        setConnected(e) {
            this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
        }
    }
    class ro {
        get tagName() {
            return this.element.tagName;
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        constructor(e, s, n, r, i){
            this.type = 1, this._$AH = He, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String), this.strings = n) : this._$AH = He;
        }
        _$AI(e, s = this, n, r) {
            const i = this.strings;
            let o = !1;
            if (i === void 0) e = Qn(this, e, s, 0), o = !Br(e) || e !== this._$AH && e !== Zn, o && (this._$AH = e);
            else {
                const a = e;
                let c, l;
                for(e = i[0], c = 0; c < i.length - 1; c++)l = Qn(this, a[n + c], s, c), l === Zn && (l = this._$AH[c]), o ||= !Br(l) || l !== this._$AH[c], l === He ? e = He : e !== He && (e += (l ?? "") + i[c + 1]), this._$AH[c] = l;
            }
            o && !r && this.j(e);
        }
        j(e) {
            e === He ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
        }
    }
    class u1 extends ro {
        constructor(){
            super(...arguments), this.type = 3;
        }
        j(e) {
            this.element[this.name] = e === He ? void 0 : e;
        }
    }
    class p1 extends ro {
        constructor(){
            super(...arguments), this.type = 4;
        }
        j(e) {
            this.element.toggleAttribute(this.name, !!e && e !== He);
        }
    }
    class f1 extends ro {
        constructor(e, s, n, r, i){
            super(e, s, n, r, i), this.type = 5;
        }
        _$AI(e, s = this) {
            if ((e = Qn(this, e, s, 0) ?? He) === Zn) return;
            const n = this._$AH, r = e === He && n !== He || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== He && (n === He || r);
            r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
        }
        handleEvent(e) {
            typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
        }
    }
    class g1 {
        constructor(e, s, n){
            this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = n;
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        _$AI(e) {
            Qn(this, e);
        }
    }
    const m1 = ec.litHtmlPolyfillSupport;
    m1?.(Fr, Qr), (ec.litHtmlVersions ??= []).push("3.3.3");
    const w1 = (t, e, s)=>{
        const n = s?.renderBefore ?? e;
        let r = n._$litPart$;
        if (r === void 0) {
            const i = s?.renderBefore ?? null;
            n._$litPart$ = r = new Qr(e.insertBefore(Mr(), i), i, void 0, s ?? {});
        }
        return r._$AI(t), r;
    };
    const sc = globalThis;
    Ii = class extends Bn {
        constructor(){
            super(...arguments), this.renderOptions = {
                host: this
            }, this._$Do = void 0;
        }
        createRenderRoot() {
            const e = super.createRenderRoot();
            return this.renderOptions.renderBefore ??= e.firstChild, e;
        }
        update(e) {
            const s = this.render();
            this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = w1(s, this.renderRoot, this.renderOptions);
        }
        connectedCallback() {
            super.connectedCallback(), this._$Do?.setConnected(!0);
        }
        disconnectedCallback() {
            super.disconnectedCallback(), this._$Do?.setConnected(!1);
        }
        render() {
            return Zn;
        }
    };
    Ii._$litElement$ = !0, Ii.finalized = !0, sc.litElementHydrateSupport?.({
        LitElement: Ii
    });
    const y1 = sc.litElementPolyfillSupport;
    y1?.({
        LitElement: Ii
    });
    (sc.litElementVersions ??= []).push("4.2.2");
    let b1, Wi, C1, E1, v1, A1, I1, N1, _1, S1, _a, Id, ys;
    b1 = {
        black: "#202020",
        white: "#FFFFFF",
        white010: "rgba(255, 255, 255, 0.1)",
        accent010: "rgba(9, 136, 240, 0.1)",
        accent020: "rgba(9, 136, 240, 0.2)",
        accent030: "rgba(9, 136, 240, 0.3)",
        accent040: "rgba(9, 136, 240, 0.4)",
        accent050: "rgba(9, 136, 240, 0.5)",
        accent060: "rgba(9, 136, 240, 0.6)",
        accent070: "rgba(9, 136, 240, 0.7)",
        accent080: "rgba(9, 136, 240, 0.8)",
        accent090: "rgba(9, 136, 240, 0.9)",
        accent100: "rgba(9, 136, 240, 1.0)",
        accentSecondary010: "rgba(199, 185, 148, 0.1)",
        accentSecondary020: "rgba(199, 185, 148, 0.2)",
        accentSecondary030: "rgba(199, 185, 148, 0.3)",
        accentSecondary040: "rgba(199, 185, 148, 0.4)",
        accentSecondary050: "rgba(199, 185, 148, 0.5)",
        accentSecondary060: "rgba(199, 185, 148, 0.6)",
        accentSecondary070: "rgba(199, 185, 148, 0.7)",
        accentSecondary080: "rgba(199, 185, 148, 0.8)",
        accentSecondary090: "rgba(199, 185, 148, 0.9)",
        accentSecondary100: "rgba(199, 185, 148, 1.0)",
        productWalletKit: "#FFB800",
        productAppKit: "#FF573B",
        productCloud: "#0988F0",
        productDocumentation: "#008847",
        neutrals050: "#F6F6F6",
        neutrals100: "#F3F3F3",
        neutrals200: "#E9E9E9",
        neutrals300: "#D0D0D0",
        neutrals400: "#BBB",
        neutrals500: "#9A9A9A",
        neutrals600: "#6C6C6C",
        neutrals700: "#4F4F4F",
        neutrals800: "#363636",
        neutrals900: "#2A2A2A",
        neutrals1000: "#252525",
        semanticSuccess010: "rgba(48, 164, 107, 0.1)",
        semanticSuccess020: "rgba(48, 164, 107, 0.2)",
        semanticSuccess030: "rgba(48, 164, 107, 0.3)",
        semanticSuccess040: "rgba(48, 164, 107, 0.4)",
        semanticSuccess050: "rgba(48, 164, 107, 0.5)",
        semanticSuccess060: "rgba(48, 164, 107, 0.6)",
        semanticSuccess070: "rgba(48, 164, 107, 0.7)",
        semanticSuccess080: "rgba(48, 164, 107, 0.8)",
        semanticSuccess090: "rgba(48, 164, 107, 0.9)",
        semanticSuccess100: "rgba(48, 164, 107, 1.0)",
        semanticError010: "rgba(223, 74, 52, 0.1)",
        semanticError020: "rgba(223, 74, 52, 0.2)",
        semanticError030: "rgba(223, 74, 52, 0.3)",
        semanticError040: "rgba(223, 74, 52, 0.4)",
        semanticError050: "rgba(223, 74, 52, 0.5)",
        semanticError060: "rgba(223, 74, 52, 0.6)",
        semanticError070: "rgba(223, 74, 52, 0.7)",
        semanticError080: "rgba(223, 74, 52, 0.8)",
        semanticError090: "rgba(223, 74, 52, 0.9)",
        semanticError100: "rgba(223, 74, 52, 1.0)",
        semanticWarning010: "rgba(243, 161, 63, 0.1)",
        semanticWarning020: "rgba(243, 161, 63, 0.2)",
        semanticWarning030: "rgba(243, 161, 63, 0.3)",
        semanticWarning040: "rgba(243, 161, 63, 0.4)",
        semanticWarning050: "rgba(243, 161, 63, 0.5)",
        semanticWarning060: "rgba(243, 161, 63, 0.6)",
        semanticWarning070: "rgba(243, 161, 63, 0.7)",
        semanticWarning080: "rgba(243, 161, 63, 0.8)",
        semanticWarning090: "rgba(243, 161, 63, 0.9)",
        semanticWarning100: "rgba(243, 161, 63, 1.0)"
    };
    Wi = {
        core: {
            backgroundAccentPrimary: "#0988F0",
            backgroundAccentCertified: "#C7B994",
            backgroundWalletKit: "#FFB800",
            backgroundAppKit: "#FF573B",
            backgroundCloud: "#0988F0",
            backgroundDocumentation: "#008847",
            backgroundSuccess: "rgba(48, 164, 107, 0.20)",
            backgroundError: "rgba(223, 74, 52, 0.20)",
            backgroundWarning: "rgba(243, 161, 63, 0.20)",
            textAccentPrimary: "#0988F0",
            textAccentCertified: "#C7B994",
            textWalletKit: "#FFB800",
            textAppKit: "#FF573B",
            textCloud: "#0988F0",
            textDocumentation: "#008847",
            textSuccess: "#30A46B",
            textError: "#DF4A34",
            textWarning: "#F3A13F",
            borderAccentPrimary: "#0988F0",
            borderSecondary: "#C7B994",
            borderSuccess: "#30A46B",
            borderError: "#DF4A34",
            borderWarning: "#F3A13F",
            foregroundAccent010: "rgba(9, 136, 240, 0.1)",
            foregroundAccent020: "rgba(9, 136, 240, 0.2)",
            foregroundAccent040: "rgba(9, 136, 240, 0.4)",
            foregroundAccent060: "rgba(9, 136, 240, 0.6)",
            foregroundSecondary020: "rgba(199, 185, 148, 0.2)",
            foregroundSecondary040: "rgba(199, 185, 148, 0.4)",
            foregroundSecondary060: "rgba(199, 185, 148, 0.6)",
            iconAccentPrimary: "#0988F0",
            iconAccentCertified: "#C7B994",
            iconSuccess: "#30A46B",
            iconError: "#DF4A34",
            iconWarning: "#F3A13F",
            glass010: "rgba(255, 255, 255, 0.1)",
            zIndex: "9999"
        },
        dark: {
            overlay: "rgba(0, 0, 0, 0.50)",
            backgroundPrimary: "#202020",
            backgroundInvert: "#FFFFFF",
            textPrimary: "#FFFFFF",
            textSecondary: "#9A9A9A",
            textTertiary: "#BBBBBB",
            textInvert: "#202020",
            borderPrimary: "#2A2A2A",
            borderPrimaryDark: "#363636",
            borderSecondary: "#4F4F4F",
            foregroundPrimary: "#252525",
            foregroundSecondary: "#2A2A2A",
            foregroundTertiary: "#363636",
            iconDefault: "#9A9A9A",
            iconInverse: "#FFFFFF"
        },
        light: {
            overlay: "rgba(230 , 230, 230, 0.5)",
            backgroundPrimary: "#FFFFFF",
            borderPrimaryDark: "#E9E9E9",
            backgroundInvert: "#202020",
            textPrimary: "#202020",
            textSecondary: "#9A9A9A",
            textTertiary: "#6C6C6C",
            textInvert: "#FFFFFF",
            borderPrimary: "#E9E9E9",
            borderSecondary: "#D0D0D0",
            foregroundPrimary: "#F3F3F3",
            foregroundSecondary: "#E9E9E9",
            foregroundTertiary: "#D0D0D0",
            iconDefault: "#9A9A9A",
            iconInverse: "#202020"
        }
    };
    C1 = {
        1: "4px",
        2: "8px",
        10: "10px",
        3: "12px",
        4: "16px",
        6: "24px",
        5: "20px",
        8: "32px",
        16: "64px",
        20: "80px",
        32: "128px",
        64: "256px",
        128: "512px",
        round: "9999px"
    };
    E1 = {
        0: "0px",
        "01": "2px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        12: "48px",
        14: "56px",
        16: "64px",
        20: "80px",
        32: "128px",
        64: "256px"
    };
    v1 = {
        regular: "KHTeka",
        mono: "KHTekaMono"
    };
    A1 = {
        regular: "400",
        medium: "500"
    };
    I1 = {
        h1: "50px",
        h2: "44px",
        h3: "38px",
        h4: "32px",
        h5: "26px",
        h6: "20px",
        large: "16px",
        medium: "14px",
        small: "12px"
    };
    N1 = {
        "h1-regular-mono": {
            lineHeight: "50px",
            letterSpacing: "-3px"
        },
        "h1-regular": {
            lineHeight: "50px",
            letterSpacing: "-1px"
        },
        "h1-medium": {
            lineHeight: "50px",
            letterSpacing: "-0.84px"
        },
        "h2-regular-mono": {
            lineHeight: "44px",
            letterSpacing: "-2.64px"
        },
        "h2-regular": {
            lineHeight: "44px",
            letterSpacing: "-0.88px"
        },
        "h2-medium": {
            lineHeight: "44px",
            letterSpacing: "-0.88px"
        },
        "h3-regular-mono": {
            lineHeight: "38px",
            letterSpacing: "-2.28px"
        },
        "h3-regular": {
            lineHeight: "38px",
            letterSpacing: "-0.76px"
        },
        "h3-medium": {
            lineHeight: "38px",
            letterSpacing: "-0.76px"
        },
        "h4-regular-mono": {
            lineHeight: "32px",
            letterSpacing: "-1.92px"
        },
        "h4-regular": {
            lineHeight: "32px",
            letterSpacing: "-0.32px"
        },
        "h4-medium": {
            lineHeight: "32px",
            letterSpacing: "-0.32px"
        },
        "h5-regular-mono": {
            lineHeight: "26px",
            letterSpacing: "-1.56px"
        },
        "h5-regular": {
            lineHeight: "26px",
            letterSpacing: "-0.26px"
        },
        "h5-medium": {
            lineHeight: "26px",
            letterSpacing: "-0.26px"
        },
        "h6-regular-mono": {
            lineHeight: "20px",
            letterSpacing: "-1.2px"
        },
        "h6-regular": {
            lineHeight: "20px",
            letterSpacing: "-0.6px"
        },
        "h6-medium": {
            lineHeight: "20px",
            letterSpacing: "-0.6px"
        },
        "lg-regular-mono": {
            lineHeight: "16px",
            letterSpacing: "-0.96px"
        },
        "lg-regular": {
            lineHeight: "18px",
            letterSpacing: "-0.16px"
        },
        "lg-medium": {
            lineHeight: "18px",
            letterSpacing: "-0.16px"
        },
        "md-regular-mono": {
            lineHeight: "14px",
            letterSpacing: "-0.84px"
        },
        "md-regular": {
            lineHeight: "16px",
            letterSpacing: "-0.14px"
        },
        "md-medium": {
            lineHeight: "16px",
            letterSpacing: "-0.14px"
        },
        "sm-regular-mono": {
            lineHeight: "12px",
            letterSpacing: "-0.72px"
        },
        "sm-regular": {
            lineHeight: "14px",
            letterSpacing: "-0.12px"
        },
        "sm-medium": {
            lineHeight: "14px",
            letterSpacing: "-0.12px"
        }
    };
    _1 = {
        "ease-out-power-2": "cubic-bezier(0.23, 0.09, 0.08, 1.13)",
        "ease-out-power-1": "cubic-bezier(0.12, 0.04, 0.2, 1.06)",
        "ease-in-power-2": "cubic-bezier(0.92, -0.13, 0.77, 0.91)",
        "ease-in-power-1": "cubic-bezier(0.88, -0.06, 0.8, 0.96)",
        "ease-inout-power-2": "cubic-bezier(0.77, 0.09, 0.23, 1.13)",
        "ease-inout-power-1": "cubic-bezier(0.88, 0.04, 0.12, 1.06)"
    };
    S1 = {
        xl: "400ms",
        lg: "200ms",
        md: "125ms",
        sm: "75ms"
    };
    _a = {
        colors: b1,
        fontFamily: v1,
        fontWeight: A1,
        textSize: I1,
        typography: N1,
        tokens: {
            core: Wi.core,
            theme: Wi.dark
        },
        borderRadius: C1,
        spacing: E1,
        durations: S1,
        easings: _1
    };
    Id = "--apkt";
    ys = {
        createCSSVariables (t) {
            const e = {}, s = {};
            function n(i, o, a = "") {
                for (const [c, l] of Object.entries(i)){
                    const d = a ? `${a}-${c}` : c;
                    l && typeof l == "object" && Object.keys(l).length ? (o[c] = {}, n(l, o[c], d)) : typeof l == "string" && (o[c] = `${Id}-${d}`);
                }
            }
            function r(i, o) {
                for (const [a, c] of Object.entries(i))c && typeof c == "object" ? (o[a] = {}, r(c, o[a])) : typeof c == "string" && (o[a] = `var(${c})`);
            }
            return n(t, e), r(e, s), {
                cssVariables: e,
                cssVariablesVarPrefix: s
            };
        },
        assignCSSVariables (t, e) {
            const s = {};
            function n(r, i, o) {
                for (const [a, c] of Object.entries(r)){
                    const l = o ? `${o}-${a}` : a, d = i[a];
                    c && typeof c == "object" ? n(c, d, l) : typeof d == "string" && (s[`${Id}-${l}`] = d);
                }
            }
            return n(t, e), s;
        },
        createRootStyles (t, e) {
            const s = {
                ..._a,
                tokens: {
                    ..._a.tokens,
                    theme: t === "light" ? Wi.light : Wi.dark
                }
            }, { cssVariables: n } = ys.createCSSVariables(s), r = ys.assignCSSVariables(n, s), i = ys.generateW3MVariables(e), o = ys.generateW3MOverrides(e), a = ys.generateScaledVariables(e), c = ys.generateBaseVariables(r), l = {
                ...r,
                ...c,
                ...i,
                ...o,
                ...a
            }, d = ys.applyColorMixToVariables(e, l), h = {
                ...l,
                ...d
            };
            return `:root {${Object.entries(h).map(([f, g])=>`${f}:${g.replace("/[:;{}</>]/g", "")};`).join("")}}`;
        },
        generateW3MVariables (t) {
            if (!t) return {};
            const e = {};
            return e["--w3m-font-family"] = t["--w3m-font-family"] || "KHTeka", e["--w3m-accent"] = t["--w3m-accent"] || "#0988F0", e["--w3m-color-mix"] = t["--w3m-color-mix"] || "#000", e["--w3m-color-mix-strength"] = `${t["--w3m-color-mix-strength"] || 0}%`, e["--w3m-font-size-master"] = t["--w3m-font-size-master"] || "10px", e["--w3m-border-radius-master"] = t["--w3m-border-radius-master"] || "4px", e;
        },
        generateW3MOverrides (t) {
            if (!t) return {};
            const e = {};
            if (t["--w3m-accent"]) {
                const s = t["--w3m-accent"];
                e["--apkt-tokens-core-iconAccentPrimary"] = s, e["--apkt-tokens-core-borderAccentPrimary"] = s, e["--apkt-tokens-core-textAccentPrimary"] = s, e["--apkt-tokens-core-backgroundAccentPrimary"] = s;
            }
            return t["--w3m-font-family"] && (e["--apkt-fontFamily-regular"] = t["--w3m-font-family"]), t["--w3m-z-index"] && (e["--apkt-tokens-core-zIndex"] = `${t["--w3m-z-index"]}`), e;
        },
        generateScaledVariables (t) {
            if (!t) return {};
            const e = {};
            if (t["--w3m-font-size-master"]) {
                const s = parseFloat(t["--w3m-font-size-master"].replace("px", ""));
                e["--apkt-textSize-h1"] = `${Number(s) * 5}px`, e["--apkt-textSize-h2"] = `${Number(s) * 4.4}px`, e["--apkt-textSize-h3"] = `${Number(s) * 3.8}px`, e["--apkt-textSize-h4"] = `${Number(s) * 3.2}px`, e["--apkt-textSize-h5"] = `${Number(s) * 2.6}px`, e["--apkt-textSize-h6"] = `${Number(s) * 2}px`, e["--apkt-textSize-large"] = `${Number(s) * 1.6}px`, e["--apkt-textSize-medium"] = `${Number(s) * 1.4}px`, e["--apkt-textSize-small"] = `${Number(s) * 1.2}px`;
            }
            if (t["--w3m-border-radius-master"]) {
                const s = parseFloat(t["--w3m-border-radius-master"].replace("px", ""));
                e["--apkt-borderRadius-1"] = `${Number(s)}px`, e["--apkt-borderRadius-2"] = `${Number(s) * 2}px`, e["--apkt-borderRadius-3"] = `${Number(s) * 3}px`, e["--apkt-borderRadius-4"] = `${Number(s) * 4}px`, e["--apkt-borderRadius-5"] = `${Number(s) * 5}px`, e["--apkt-borderRadius-6"] = `${Number(s) * 6}px`, e["--apkt-borderRadius-8"] = `${Number(s) * 8}px`, e["--apkt-borderRadius-16"] = `${Number(s) * 16}px`, e["--apkt-borderRadius-20"] = `${Number(s) * 20}px`, e["--apkt-borderRadius-32"] = `${Number(s) * 32}px`, e["--apkt-borderRadius-64"] = `${Number(s) * 64}px`, e["--apkt-borderRadius-128"] = `${Number(s) * 128}px`;
            }
            return e;
        },
        generateColorMixCSS (t, e) {
            if (!t?.["--w3m-color-mix"] || !t["--w3m-color-mix-strength"]) return "";
            const s = t["--w3m-color-mix"], n = t["--w3m-color-mix-strength"];
            if (!n || n === 0) return "";
            const r = Object.keys(e || {}).filter((o)=>{
                const a = o.includes("-tokens-core-background") || o.includes("-tokens-core-text") || o.includes("-tokens-core-border") || o.includes("-tokens-core-foreground") || o.includes("-tokens-core-icon") || o.includes("-tokens-theme-background") || o.includes("-tokens-theme-text") || o.includes("-tokens-theme-border") || o.includes("-tokens-theme-foreground") || o.includes("-tokens-theme-icon"), c = o.includes("-borderRadius-") || o.includes("-spacing-") || o.includes("-textSize-") || o.includes("-fontFamily-") || o.includes("-fontWeight-") || o.includes("-typography-") || o.includes("-duration-") || o.includes("-ease-") || o.includes("-path-") || o.includes("-width-") || o.includes("-height-") || o.includes("-visual-size-") || o.includes("-modal-width") || o.includes("-cover");
                return a && !c;
            });
            return r.length === 0 ? "" : ` @supports (background: color-mix(in srgb, white 50%, black)) {
      :root {
        ${r.map((o)=>{
                const a = e?.[o] || "";
                return a.includes("color-mix") || a.startsWith("#") || a.startsWith("rgb") ? `${o}: color-mix(in srgb, ${s} ${n}%, ${a});` : `${o}: color-mix(in srgb, ${s} ${n}%, var(${o}-base, ${a}));`;
            }).join("")}
      }
    }`;
        },
        generateBaseVariables (t) {
            const e = {}, s = t["--apkt-tokens-theme-backgroundPrimary"];
            s && (e["--apkt-tokens-theme-backgroundPrimary-base"] = s);
            const n = t["--apkt-tokens-core-backgroundAccentPrimary"];
            return n && (e["--apkt-tokens-core-backgroundAccentPrimary-base"] = n), e;
        },
        applyColorMixToVariables (t, e) {
            const s = {};
            if (e?.["--apkt-tokens-theme-backgroundPrimary"] && (s["--apkt-tokens-theme-backgroundPrimary"] = "var(--apkt-tokens-theme-backgroundPrimary-base)"), e?.["--apkt-tokens-core-backgroundAccentPrimary"] && (s["--apkt-tokens-core-backgroundAccentPrimary"] = "var(--apkt-tokens-core-backgroundAccentPrimary-base)"), !t?.["--w3m-color-mix"] || !t["--w3m-color-mix-strength"]) return s;
            const n = t["--w3m-color-mix"], r = t["--w3m-color-mix-strength"];
            if (!r || r === 0) return s;
            const i = Object.keys(e || {}).filter((o)=>{
                const a = o.includes("-tokens-core-background") || o.includes("-tokens-core-text") || o.includes("-tokens-core-border") || o.includes("-tokens-core-foreground") || o.includes("-tokens-core-icon") || o.includes("-tokens-theme-background") || o.includes("-tokens-theme-text") || o.includes("-tokens-theme-border") || o.includes("-tokens-theme-foreground") || o.includes("-tokens-theme-icon") || o.includes("-tokens-theme-overlay"), c = o.includes("-borderRadius-") || o.includes("-spacing-") || o.includes("-textSize-") || o.includes("-fontFamily-") || o.includes("-fontWeight-") || o.includes("-typography-") || o.includes("-duration-") || o.includes("-ease-") || o.includes("-path-") || o.includes("-width-") || o.includes("-height-") || o.includes("-visual-size-") || o.includes("-modal-width") || o.includes("-cover");
                return a && !c;
            });
            return i.length === 0 || i.forEach((o)=>{
                const a = e?.[o] || "";
                o.endsWith("-base") || (o === "--apkt-tokens-theme-backgroundPrimary" || o === "--apkt-tokens-core-backgroundAccentPrimary" ? s[o] = `color-mix(in srgb, ${n} ${r}%, var(${o}-base))` : a.includes("color-mix") || a.startsWith("#") || a.startsWith("rgb") ? s[o] = `color-mix(in srgb, ${n} ${r}%, ${a})` : s[o] = `color-mix(in srgb, ${n} ${r}%, var(${o}-base, ${a}))`);
            }), s;
        }
    };
    ({ cssVariablesVarPrefix: T1 } = ys.createCSSVariables(_a));
    mI = function(t, ...e) {
        return Hs(t, ...e.map((s)=>Vt(typeof s == "function" ? s(T1) : s)));
    };
    let ln, mn, os, Kt, qi;
    const ws = {
        "KHTeka-500-woff2": "https://fonts.reown.com/KHTeka-Medium.woff2",
        "KHTeka-400-woff2": "https://fonts.reown.com/KHTeka-Regular.woff2",
        "KHTeka-300-woff2": "https://fonts.reown.com/KHTeka-Light.woff2",
        "KHTekaMono-400-woff2": "https://fonts.reown.com/KHTekaMono-Regular.woff2",
        "KHTeka-500-woff": "https://fonts.reown.com/KHTeka-Light.woff",
        "KHTeka-400-woff": "https://fonts.reown.com/KHTeka-Regular.woff",
        "KHTeka-300-woff": "https://fonts.reown.com/KHTeka-Light.woff",
        "KHTekaMono-400-woff": "https://fonts.reown.com/KHTekaMono-Regular.woff"
    };
    function Hi(t, e = "dark") {
        ln && document.head.removeChild(ln), ln = document.createElement("style"), ln.textContent = ys.createRootStyles(e, t), document.head.appendChild(ln);
    }
    wI = function(t, e = "dark") {
        if (qi = t, mn = document.createElement("style"), os = document.createElement("style"), Kt = document.createElement("style"), mn.textContent = Gn(t).core.cssText, os.textContent = Gn(t).dark.cssText, Kt.textContent = Gn(t).light.cssText, document.head.appendChild(mn), document.head.appendChild(os), document.head.appendChild(Kt), Hi(t, e), Sa(e), !t?.["--w3m-font-family"]) for (const [s, n] of Object.entries(ws)){
            const r = document.createElement("link");
            r.rel = "preload", r.href = n, r.as = "font", r.type = s.includes("woff2") ? "font/woff2" : "font/woff", r.crossOrigin = "anonymous", document.head.appendChild(r);
        }
        Sa(e);
    };
    function Sa(t = "dark") {
        os && Kt && ln && (t === "light" ? (Hi(qi, t), os.removeAttribute("media"), Kt.media = "enabled") : (Hi(qi, t), Kt.removeAttribute("media"), os.media = "enabled"));
    }
    function k1(t) {
        if (qi = t, mn && os && Kt && (mn.textContent = Gn(t).core.cssText, os.textContent = Gn(t).dark.cssText, Kt.textContent = Gn(t).light.cssText, t?.["--w3m-font-family"])) {
            const e = t["--w3m-font-family"];
            mn.textContent = mn.textContent?.replace("font-family: KHTeka", `font-family: ${e}`), os.textContent = os.textContent?.replace("font-family: KHTeka", `font-family: ${e}`), Kt.textContent = Kt.textContent?.replace("font-family: KHTeka", `font-family: ${e}`);
        }
        if (ln) {
            const e = Kt?.media === "enabled" ? "light" : "dark";
            Hi(t, e);
        }
    }
    function Gn(t) {
        const e = !!t?.["--w3m-font-family"];
        return {
            core: Hs`
      ${e ? Hs`` : Hs`
            @font-face {
              font-family: 'KHTeka';
              src:
                url(${Vt(ws["KHTeka-400-woff2"])}) format('woff2'),
                url(${Vt(ws["KHTeka-400-woff"])}) format('woff');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: 'KHTeka';
              src:
                url(${Vt(ws["KHTeka-300-woff2"])}) format('woff2'),
                url(${Vt(ws["KHTeka-300-woff"])}) format('woff');
              font-weight: 300;
              font-style: normal;
            }

            @font-face {
              font-family: 'KHTekaMono';
              src:
                url(${Vt(ws["KHTekaMono-400-woff2"])}) format('woff2'),
                url(${Vt(ws["KHTekaMono-400-woff"])}) format('woff');
              font-weight: 400;
              font-style: normal;
            }

            @font-face {
              font-family: 'KHTeka';
              src:
                url(${Vt(ws["KHTeka-400-woff2"])}) format('woff2'),
                url(${Vt(ws["KHTeka-400-woff"])}) format('woff');
              font-weight: 400;
              font-style: normal;
            }
          `}

      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --apkt-modal-width: 370px;

        --apkt-visual-size-inherit: inherit;
        --apkt-visual-size-sm: 40px;
        --apkt-visual-size-md: 55px;
        --apkt-visual-size-lg: 80px;

        --apkt-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --apkt-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --apkt-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --apkt-width-network-sm: 36px;
        --apkt-width-network-md: 48px;
        --apkt-width-network-lg: 86px;

        --apkt-duration-dynamic: 0ms;
        --apkt-height-network-sm: 40px;
        --apkt-height-network-md: 54px;
        --apkt-height-network-lg: 96px;
      }
    `,
            dark: Hs`
      :root {
      }
    `,
            light: Hs`
      :root {
      }
    `
        };
    }
    let Ni, Dn;
    yI = Hs`
  div,
  span,
  iframe,
  a,
  img,
  form,
  button,
  label,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    backface-visibility: hidden;
  }

  :host {
    font-family: var(--apkt-fontFamily-regular);
  }
`;
    bI = Hs`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
    outline: none;
    border: none;
    text-decoration: none;
    transition:
      background-color var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      color var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      border var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      box-shadow var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      width var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      height var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      transform var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      opacity var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      scale var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2),
      border-radius var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2);
    will-change:
      background-color, color, border, box-shadow, width, height, transform, opacity, scale,
      border-radius;
  }

  a:active:not([disabled]),
  button:active:not([disabled]) {
    scale: 0.975;
    transform-origin: center;
  }

  button:disabled {
    cursor: default;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`;
    Ni = {
        hexStringToNumber (t) {
            const e = t.startsWith("0x") ? t.slice(2) : t;
            return parseInt(e, 16);
        },
        numberToHexString (t) {
            return `0x${t.toString(16)}`;
        },
        async getUserInfo (t) {
            const [e, s] = await Promise.all([
                Ni.getAddresses(t),
                Ni.getChainId(t)
            ]);
            return {
                chainId: s,
                addresses: e
            };
        },
        async getChainId (t) {
            const e = await t.request({
                method: "eth_chainId"
            });
            return Number(e);
        },
        async getAddress (t) {
            const [e] = await t.request({
                method: "eth_accounts"
            });
            return e;
        },
        async getAddresses (t) {
            return await t.request({
                method: "eth_accounts"
            });
        },
        async addEthereumChain (t, e) {
            const s = e.rpcUrls.chainDefault?.http || [];
            await t.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: Ni.numberToHexString(e.id),
                        rpcUrls: [
                            ...s
                        ],
                        chainName: e.name,
                        nativeCurrency: {
                            name: e.nativeCurrency.name,
                            decimals: e.nativeCurrency.decimals,
                            symbol: e.nativeCurrency.symbol
                        },
                        blockExplorerUrls: [
                            e.blockExplorers?.default.url
                        ],
                        iconUrls: [
                            Lr.NetworkImageIds[e.id]
                        ]
                    }
                ]
            });
        }
    };
    Dn = {
        ACCOUNT_INDEXES: {
            PAYMENT: 0,
            ORDINAL: 1
        }
    };
    function ir(t) {
        return {
            formatters: void 0,
            fees: void 0,
            serializers: void 0,
            ...t
        };
    }
    const Nd = ir({
        id: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        name: "Solana",
        network: "solana-mainnet",
        nativeCurrency: {
            name: "Solana",
            symbol: "SOL",
            decimals: 9
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        },
        blockExplorers: {
            default: {
                name: "Solscan",
                url: "https://solscan.io"
            }
        },
        testnet: !1,
        chainNamespace: "solana",
        caipNetworkId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        deprecatedCaipNetworkId: "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"
    }), _d = ir({
        id: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
        name: "Solana Devnet",
        network: "solana-devnet",
        nativeCurrency: {
            name: "Solana",
            symbol: "SOL",
            decimals: 9
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        },
        blockExplorers: {
            default: {
                name: "Solscan",
                url: "https://solscan.io"
            }
        },
        testnet: !0,
        chainNamespace: "solana",
        caipNetworkId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
        deprecatedCaipNetworkId: "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K"
    });
    ir({
        id: "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
        name: "Solana Testnet",
        network: "solana-testnet",
        nativeCurrency: {
            name: "Solana",
            symbol: "SOL",
            decimals: 9
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        },
        blockExplorers: {
            default: {
                name: "Solscan",
                url: "https://solscan.io"
            }
        },
        testnet: !0,
        chainNamespace: "solana",
        caipNetworkId: "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"
    });
    ir({
        id: "000000000019d6689c085ae165831e93",
        caipNetworkId: "bip122:000000000019d6689c085ae165831e93",
        chainNamespace: "bip122",
        name: "Bitcoin",
        nativeCurrency: {
            name: "Bitcoin",
            symbol: "BTC",
            decimals: 8
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        }
    });
    ir({
        id: "000000000933ea01ad0ee984209779ba",
        caipNetworkId: "bip122:000000000933ea01ad0ee984209779ba",
        chainNamespace: "bip122",
        name: "Bitcoin Testnet",
        nativeCurrency: {
            name: "Bitcoin",
            symbol: "BTC",
            decimals: 8
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        },
        testnet: !0
    });
    ir({
        id: "00000008819873e925422c1ff0f99f7c",
        caipNetworkId: "bip122:00000008819873e925422c1ff0f99f7c",
        chainNamespace: "bip122",
        name: "Bitcoin Signet",
        nativeCurrency: {
            name: "Bitcoin",
            symbol: "BTC",
            decimals: 8
        },
        rpcUrls: {
            default: {
                http: [
                    "https://rpc.walletconnect.org/v1"
                ]
            }
        },
        testnet: !0
    });
    const O1 = {
        solana: [
            "solana_signMessage",
            "solana_signTransaction",
            "solana_requestAccounts",
            "solana_getAccounts",
            "solana_signAllTransactions",
            "solana_signAndSendTransaction"
        ],
        eip155: [
            "eth_accounts",
            "eth_requestAccounts",
            "eth_sendRawTransaction",
            "eth_sign",
            "eth_signTransaction",
            "eth_signTypedData",
            "eth_signTypedData_v3",
            "eth_signTypedData_v4",
            "eth_sendTransaction",
            "personal_sign",
            "wallet_switchEthereumChain",
            "wallet_addEthereumChain",
            "wallet_getPermissions",
            "wallet_requestPermissions",
            "wallet_registerOnboarding",
            "wallet_watchAsset",
            "wallet_scanQRCode",
            "wallet_getCallsStatus",
            "wallet_showCallsStatus",
            "wallet_sendCalls",
            "wallet_getCapabilities",
            "wallet_grantPermissions",
            "wallet_revokePermissions",
            "wallet_getAssets"
        ],
        bip122: [
            "sendTransfer",
            "signMessage",
            "signPsbt",
            "getAccountAddresses"
        ]
    }, Gt = {
        RPC_ERROR_CODE: {
            USER_REJECTED: 5e3,
            USER_REJECTED_METHODS: 5002
        },
        getMethodsByChainNamespace (t) {
            return O1[t] || [];
        },
        createDefaultNamespace (t) {
            return {
                methods: this.getMethodsByChainNamespace(t),
                events: [
                    "accountsChanged",
                    "chainChanged"
                ],
                chains: [],
                rpcMap: {}
            };
        },
        applyNamespaceOverrides (t, e) {
            if (!e) return {
                ...t
            };
            const s = {
                ...t
            }, n = new Set;
            if (e.methods && Object.keys(e.methods).forEach((r)=>n.add(r)), e.chains && Object.keys(e.chains).forEach((r)=>n.add(r)), e.events && Object.keys(e.events).forEach((r)=>n.add(r)), e.rpcMap && Object.keys(e.rpcMap).forEach((r)=>{
                const [i] = r.split(":");
                i && n.add(i);
            }), n.forEach((r)=>{
                s[r] || (s[r] = this.createDefaultNamespace(r));
            }), e.methods && Object.entries(e.methods).forEach(([r, i])=>{
                s[r] && (s[r].methods = i);
            }), e.chains && Object.entries(e.chains).forEach(([r, i])=>{
                s[r] && (s[r].chains = i);
            }), e.events && Object.entries(e.events).forEach(([r, i])=>{
                s[r] && (s[r].events = i);
            }), e.rpcMap) {
                const r = new Set;
                Object.entries(e.rpcMap).forEach(([i, o])=>{
                    const [a, c] = i.split(":");
                    !a || !c || !s[a] || (s[a].rpcMap || (s[a].rpcMap = {}), r.has(a) || (s[a].rpcMap = {}, r.add(a)), s[a].rpcMap[c] = o);
                });
            }
            return s;
        },
        createNamespaces (t, e) {
            const s = t.reduce((n, r)=>{
                const { id: i, chainNamespace: o, rpcUrls: a } = r, c = a.default.http[0];
                n[o] || (n[o] = this.createDefaultNamespace(o));
                const l = `${o}:${i}`, d = n[o];
                switch(d.chains.push(l), l){
                    case Nd.caipNetworkId:
                        d.chains.push(Nd.deprecatedCaipNetworkId);
                        break;
                    case _d.caipNetworkId:
                        d.chains.push(_d.deprecatedCaipNetworkId);
                        break;
                }
                return d?.rpcMap && c && (d.rpcMap[i] = c), n;
            }, {});
            return this.applyNamespaceOverrides(s, e);
        },
        resolveReownName: async (t)=>{
            const e = await _r.resolveName(t);
            return (Object.values(e?.addresses) || [])[0]?.address || !1;
        },
        getChainsFromNamespaces (t = {}) {
            return Object.values(t).flatMap((e)=>{
                const s = e.chains || [], n = e.accounts.map((r)=>{
                    const [i, o] = r.split(":");
                    return `${i}:${o}`;
                });
                return Array.from(new Set([
                    ...s,
                    ...n
                ]));
            });
        },
        isSessionEventData (t) {
            return typeof t == "object" && t !== null && "id" in t && "topic" in t && "params" in t && typeof t.params == "object" && t.params !== null && "chainId" in t.params && "event" in t.params && typeof t.params.event == "object" && t.params.event !== null;
        },
        isUserRejectedRequestError (t) {
            try {
                if (typeof t == "object" && t !== null) {
                    const e = t, s = typeof e.code == "number", n = s && e.code === Gt.RPC_ERROR_CODE.USER_REJECTED_METHODS, r = s && e.code === Gt.RPC_ERROR_CODE.USER_REJECTED;
                    return n || r;
                }
                return !1;
            } catch  {
                return !1;
            }
        },
        isOriginAllowed (t, e, s) {
            for (const n of [
                ...e,
                ...s
            ])if (n.includes("*")) {
                const i = `^${n.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\\\*/gu, ".*")}$`;
                if (new RegExp(i, "u").test(t)) return !0;
            } else try {
                if (new URL(n).origin === t) return !0;
            } catch  {
                if (n === t) return !0;
            }
            return !1;
        },
        listenWcProvider ({ universalProvider: t, namespace: e, onConnect: s, onDisconnect: n, onAccountsChanged: r, onChainChanged: i, onDisplayUri: o }) {
            s && t.on("connect", ()=>{
                const a = Gt.getWalletConnectAccounts(t, e);
                s(a);
            }), n && t.on("disconnect", ()=>{
                n();
            }), r && t.on("accountsChanged", (a)=>{
                try {
                    const c = t.session?.namespaces?.[e]?.accounts || [], l = t.rpcProviders?.[e]?.getDefaultChain(), d = a.map((h)=>{
                        const u = c.find((w)=>w.includes(`${e}:${l}:${h}`));
                        if (!u) return;
                        const { chainId: f, chainNamespace: g } = it.parseCaipAddress(u);
                        return {
                            address: h,
                            chainId: f,
                            chainNamespace: g
                        };
                    }).filter((h)=>h !== void 0);
                    d.length > 0 && r(d);
                } catch (c) {
                    console.warn("Failed to parse accounts for namespace on accountsChanged event", e, a, c);
                }
            }), i && t.on("chainChanged", (a)=>{
                i(a);
            }), o && t.on("display_uri", (a)=>{
                o(a);
            });
        },
        getWalletConnectAccounts (t, e) {
            const s = new Set, n = t?.session?.namespaces?.[e]?.accounts?.map((r)=>it.parseCaipAddress(r)).filter(({ address: r })=>s.has(r.toLowerCase()) ? !1 : (s.add(r.toLowerCase()), !0));
            return n && n.length > 0 ? n : [];
        }
    };
    class P1 {
        constructor(e){
            this.namespace = e.namespace;
        }
        async syncConnections(e) {
            switch(this.namespace){
                case S.CHAIN.EVM:
                    await this.syncEVMConnections(e);
                    break;
                case S.CHAIN.SOLANA:
                    await this.syncSolanaConnections(e);
                    break;
                case S.CHAIN.BITCOIN:
                    await this.syncBitcoinConnections(e);
                    break;
                default:
                    throw new Error(`Unsupported chain namespace: ${this.namespace}`);
            }
        }
        async syncEVMConnections({ connectors: e, caipNetworks: s, universalProvider: n, onConnection: r, onListenProvider: i }) {
            await Promise.all(e.filter((o)=>{
                const { hasDisconnected: a, hasConnected: c } = Ye.getConnectorStorageInfo(o.id, this.namespace);
                return !a && c;
            }).map(async (o)=>{
                if (o.id === S.CONNECTOR_ID.WALLET_CONNECT) {
                    const a = Gt.getWalletConnectAccounts(n, this.namespace), c = s.find((l)=>l.chainNamespace === this.namespace && l.id.toString() === a[0]?.chainId?.toString());
                    a.length > 0 && r({
                        connectorId: o.id,
                        accounts: a.map((l)=>({
                                address: l.address
                            })),
                        caipNetwork: c
                    });
                } else {
                    const { accounts: a, chainId: c } = await vi.fetchProviderData(o);
                    if (a.length > 0 && c) {
                        const l = s.find((d)=>d.chainNamespace === this.namespace && d.id.toString() === c.toString());
                        r({
                            connectorId: o.id,
                            accounts: a.map((d)=>({
                                    address: d
                                })),
                            caipNetwork: l
                        }), o.provider && o.id !== S.CONNECTOR_ID.AUTH && o.id !== S.CONNECTOR_ID.WALLET_CONNECT && i(o.id, o.provider);
                    }
                }
            }));
        }
        async syncSolanaConnections({ connectors: e, caipNetwork: s, universalProvider: n, onConnection: r, onListenProvider: i }) {
            await Promise.all(e.filter((o)=>{
                const { hasDisconnected: a, hasConnected: c } = Ye.getConnectorStorageInfo(o.id, this.namespace);
                return !a && c;
            }).map(async (o)=>{
                if (o.id === S.CONNECTOR_ID.WALLET_CONNECT) {
                    const a = Gt.getWalletConnectAccounts(n, this.namespace);
                    a.length > 0 && r({
                        connectorId: o.id,
                        accounts: a.map((c)=>({
                                address: c.address
                            })),
                        caipNetwork: s
                    });
                } else {
                    const a = await o.connect({
                        chainId: s?.id
                    });
                    a && (r({
                        connectorId: o.id,
                        accounts: [
                            {
                                address: a
                            }
                        ],
                        caipNetwork: s
                    }), i(o.id, o.provider));
                }
            }));
        }
        async syncBitcoinConnections({ connectors: e, caipNetwork: s, universalProvider: n, onConnection: r, onListenProvider: i }) {
            await Promise.all(e.filter((o)=>{
                const { hasDisconnected: a, hasConnected: c } = Ye.getConnectorStorageInfo(o.id, this.namespace);
                return !a && c;
            }).map(async (o)=>{
                if (o.id === S.CONNECTOR_ID.WALLET_CONNECT) {
                    const h = Gt.getWalletConnectAccounts(n, this.namespace);
                    h.length > 0 && r({
                        connectorId: o.id,
                        accounts: h.map((u)=>({
                                address: u.address
                            })),
                        caipNetwork: s
                    });
                    return;
                }
                const a = await o.connect();
                let l = (await o.getAccountAddresses())?.map((h)=>J.createAccount(S.CHAIN.BITCOIN, h.address, h.purpose || "payment", h.publicKey, h.path));
                if (l && l.length > 1 && (l = [
                    {
                        namespace: S.CHAIN.BITCOIN,
                        publicKey: l[Dn.ACCOUNT_INDEXES.PAYMENT]?.publicKey ?? "",
                        path: l[Dn.ACCOUNT_INDEXES.PAYMENT]?.path ?? "",
                        address: l[Dn.ACCOUNT_INDEXES.PAYMENT]?.address ?? "",
                        type: "payment"
                    },
                    {
                        namespace: S.CHAIN.BITCOIN,
                        publicKey: l[Dn.ACCOUNT_INDEXES.ORDINAL]?.publicKey ?? "",
                        path: l[Dn.ACCOUNT_INDEXES.ORDINAL]?.path ?? "",
                        address: l[Dn.ACCOUNT_INDEXES.ORDINAL]?.address ?? "",
                        type: "ordinal"
                    }
                ]), !(o.chains.find((h)=>h.id === s?.id) || o.chains[0])) throw new Error("The connector does not support any of the requested chains");
                a && (i(o.id, o.provider), r({
                    connectorId: o.id,
                    accounts: l.map((h)=>({
                            address: h.address,
                            type: h.type,
                            publicKey: h.publicKey,
                            path: h.path
                        })),
                    caipNetwork: s
                }));
            }));
        }
        getConnection({ address: e, connectorId: s, connections: n, connectors: r }) {
            if (s) {
                const o = n.find((l)=>Ye.isLowerCaseMatch(l.connectorId, s));
                if (!o) return null;
                const a = r.find((l)=>Ye.isLowerCaseMatch(l.id, o.connectorId)), c = e ? o.accounts.find((l)=>Ye.isLowerCaseMatch(l.address, e)) : o.accounts[0];
                return {
                    ...o,
                    account: c,
                    connector: a
                };
            }
            const i = n.find((o)=>o.accounts.length > 0 && r.some((a)=>Ye.isLowerCaseMatch(a.id, o.connectorId)));
            if (i) {
                const [o] = i.accounts, a = r.find((c)=>Ye.isLowerCaseMatch(c.id, i.connectorId));
                return {
                    ...i,
                    account: o,
                    connector: a
                };
            }
            return null;
        }
    }
    const Ar = {
        ERROR_CODE_UNRECOGNIZED_CHAIN_ID: 4902,
        ERROR_CODE_DEFAULT: 5e3,
        ERROR_INVALID_CHAIN_ID: 32603,
        DEFAULT_ALLOWED_ANCESTORS: [
            "http://localhost:*",
            "https://localhost:*",
            "http://127.0.0.1:*",
            "https://127.0.0.1:*",
            "https://*.pages.dev",
            "https://*.vercel.app",
            "https://*.ngrok-free.app",
            "https://secure-mobile.walletconnect.com",
            "https://secure-mobile.walletconnect.org"
        ]
    };
    class Du {
        constructor({ provider: e, namespace: s }){
            this.id = S.CONNECTOR_ID.WALLET_CONNECT, this.name = Lr.ConnectorNamesMap[S.CONNECTOR_ID.WALLET_CONNECT], this.type = "WALLET_CONNECT", this.imageId = Lr.ConnectorImageIds[S.CONNECTOR_ID.WALLET_CONNECT], this.getCaipNetworks = p.getCaipNetworks.bind(p), this.caipNetworks = this.getCaipNetworks(), this.provider = e, this.chain = s;
        }
        get chains() {
            return this.getCaipNetworks();
        }
        async connectWalletConnect() {
            if (!await this.authenticate()) {
                const s = this.getCaipNetworks(), n = _.state.universalProviderConfigOverride, r = Gt.createNamespaces(s, n);
                await this.provider.connect({
                    optionalNamespaces: r
                });
            }
            return {
                clientId: await this.provider.client.core.crypto.getClientId(),
                session: this.provider.session
            };
        }
        async disconnect() {
            await this.provider.disconnect();
        }
        async authenticate() {
            const e = this.chains.map((s)=>s.caipNetworkId);
            return ns.universalProviderAuthenticate({
                universalProvider: this.provider,
                chains: e,
                methods: R1
            });
        }
    }
    const R1 = [
        "eth_accounts",
        "eth_requestAccounts",
        "eth_sendRawTransaction",
        "eth_sign",
        "eth_signTransaction",
        "eth_signTypedData",
        "eth_signTypedData_v3",
        "eth_signTypedData_v4",
        "eth_sendTransaction",
        "personal_sign",
        "wallet_switchEthereumChain",
        "wallet_addEthereumChain",
        "wallet_getPermissions",
        "wallet_requestPermissions",
        "wallet_registerOnboarding",
        "wallet_watchAsset",
        "wallet_scanQRCode",
        "wallet_getCallsStatus",
        "wallet_sendCalls",
        "wallet_getCapabilities",
        "wallet_grantPermissions",
        "wallet_revokePermissions",
        "wallet_getAssets"
    ], x1 = [
        S.CONNECTOR_ID.AUTH,
        S.CONNECTOR_ID.WALLET_CONNECT
    ];
    class $1 {
        constructor(e){
            this.availableConnectors = [], this.availableConnections = [], this.providerHandlers = {}, this.eventListeners = new Map, this.getCaipNetworks = (s)=>p.getCaipNetworks(s), this.getConnectorId = (s)=>L.getConnectorId(s), e && this.construct(e), e?.namespace && (this.connectionManager = new P1({
                namespace: e.namespace
            }));
        }
        construct(e) {
            this.projectId = e.projectId, this.namespace = e.namespace, this.adapterType = e.adapterType;
        }
        get connectors() {
            return this.availableConnectors;
        }
        get connections() {
            return this.availableConnections;
        }
        get networks() {
            return this.getCaipNetworks(this.namespace);
        }
        onAuthConnected({ accounts: e, chainId: s }) {
            const n = this.getCaipNetworks().filter((r)=>r.chainNamespace === this.namespace).find((r)=>r.id.toString() === s?.toString());
            e && n && this.addConnection({
                connectorId: S.CONNECTOR_ID.AUTH,
                accounts: e,
                caipNetwork: n
            });
        }
        setAuthProvider(e) {
            e.onConnect(this.onAuthConnected.bind(this)), e.onSocialConnected(this.onAuthConnected.bind(this)), this.addConnector({
                id: S.CONNECTOR_ID.AUTH,
                type: "AUTH",
                name: S.CONNECTOR_NAMES.AUTH,
                provider: e,
                imageId: Lr.ConnectorImageIds[S.CONNECTOR_ID.AUTH],
                chain: this.namespace,
                chains: []
            });
        }
        addConnector(...e) {
            const s = new Set;
            this.availableConnectors = [
                ...e,
                ...this.availableConnectors
            ].filter((n)=>s.has(n.id) ? !1 : (s.add(n.id), !0)), this.emit("connectors", this.availableConnectors);
        }
        addConnection(...e) {
            const s = new Set;
            this.availableConnections = [
                ...e,
                ...this.availableConnections
            ].filter((n)=>s.has(n.connectorId.toLowerCase()) ? !1 : (s.add(n.connectorId.toLowerCase()), !0)), this.emit("connections", this.availableConnections);
        }
        deleteConnection(e) {
            this.availableConnections = this.availableConnections.filter((s)=>!Ye.isLowerCaseMatch(s.connectorId, e)), this.emit("connections", this.availableConnections);
        }
        clearConnections(e = !1) {
            this.availableConnections = [], e && this.emit("connections", this.availableConnections);
        }
        setStatus(e, s) {
            p.setAccountProp("status", e, s);
        }
        on(e, s) {
            this.eventListeners.has(e) || this.eventListeners.set(e, new Set), this.eventListeners.get(e)?.add(s);
        }
        off(e, s) {
            const n = this.eventListeners.get(e);
            n && n.delete(s);
        }
        removeAllEventListeners() {
            this.eventListeners.forEach((e)=>{
                e.clear();
            });
        }
        emit(e, s) {
            const n = this.eventListeners.get(e);
            n && n.forEach((r)=>r(s));
        }
        async connectWalletConnect(e) {
            try {
                return {
                    clientId: (await this.getWalletConnectConnector().connectWalletConnect()).clientId
                };
            } catch (s) {
                throw Gt.isUserRejectedRequestError(s) ? new Ud(s) : s;
            }
        }
        async switchNetwork(e) {
            const { caipNetwork: s, providerType: n } = e;
            if (!e.provider) return;
            const r = "provider" in e.provider ? e.provider.provider : e.provider;
            if (n === "WALLET_CONNECT") {
                r.setDefaultChain(s.caipNetworkId);
                return;
            }
            if (r && n === "AUTH") {
                const i = r, o = Lt(s.chainNamespace);
                await i.switchNetwork({
                    chainId: s.caipNetworkId
                });
                const a = await i.getUser({
                    chainId: s.caipNetworkId,
                    preferredAccountType: o
                });
                this.emit("switchNetwork", a);
            }
        }
        getWalletConnectConnector() {
            const e = this.connectors.find((s)=>s instanceof Du);
            if (!e) throw new Error("WalletConnectConnector not found");
            return e;
        }
        onConnect(e, s) {
            if (e.length > 0) {
                const { address: n, chainId: r } = J.getAccount(e[0]), i = this.getCaipNetworks().filter((a)=>a.chainNamespace === this.namespace).find((a)=>a.id.toString() === r?.toString()), o = this.connectors.find((a)=>a.id === s);
                n && (this.emit("accountChanged", {
                    address: n,
                    chainId: r,
                    connector: o
                }), this.addConnection({
                    connectorId: s,
                    accounts: e.map((a)=>{
                        const { address: c } = J.getAccount(a);
                        return {
                            address: c
                        };
                    }),
                    caipNetwork: i
                }));
            }
        }
        onAccountsChanged(e, s, n = !0) {
            if (e.length > 0) {
                const { address: r } = J.getAccount(e[0]), i = this.connectionManager?.getConnection({
                    connectorId: s,
                    connections: this.connections,
                    connectors: this.connectors
                });
                r && Ye.isLowerCaseMatch(this.getConnectorId(S.CHAIN.EVM), s) && this.emit("accountChanged", {
                    address: r,
                    chainId: i?.caipNetwork?.id,
                    connector: i?.connector
                }), this.addConnection({
                    connectorId: s,
                    accounts: e.map((o)=>{
                        const { address: a } = J.getAccount(o);
                        return {
                            address: a
                        };
                    }),
                    caipNetwork: i?.caipNetwork
                });
            } else n && this.onDisconnect(s);
        }
        onDisconnect(e) {
            this.removeProviderListeners(e), this.deleteConnection(e), Ye.isLowerCaseMatch(this.getConnectorId(S.CHAIN.EVM), e) && this.emitFirstAvailableConnection(), this.connections.length === 0 && this.emit("disconnect");
        }
        onChainChanged(e, s) {
            const n = typeof e == "string" && e.startsWith("0x") ? Ni.hexStringToNumber(e).toString() : e.toString(), r = this.connectionManager?.getConnection({
                connectorId: s,
                connections: this.connections,
                connectors: this.connectors
            }), i = this.getCaipNetworks().filter((o)=>o.chainNamespace === this.namespace).find((o)=>o.id.toString() === n);
            r && this.addConnection({
                connectorId: s,
                accounts: r.accounts,
                caipNetwork: i
            }), Ye.isLowerCaseMatch(this.getConnectorId(S.CHAIN.EVM), s) && this.emit("switchNetwork", {
                chainId: n
            });
        }
        listenProviderEvents(e, s) {
            if (x1.includes(e)) return;
            const n = (o)=>this.onAccountsChanged(o, e), r = (o)=>this.onChainChanged(o, e), i = ()=>this.onDisconnect(e);
            this.providerHandlers[e] || (s.on("disconnect", i), s.on("accountsChanged", n), s.on("chainChanged", r), this.providerHandlers[e] = {
                provider: s,
                disconnect: i,
                accountsChanged: n,
                chainChanged: r
            });
        }
        removeProviderListeners(e) {
            if (this.providerHandlers[e]) {
                const { provider: s, disconnect: n, accountsChanged: r, chainChanged: i } = this.providerHandlers[e];
                s.removeListener("disconnect", n), s.removeListener("accountsChanged", r), s.removeListener("chainChanged", i), this.providerHandlers[e] = null;
            }
        }
        emitFirstAvailableConnection() {
            const e = this.connectionManager?.getConnection({
                connections: this.connections,
                connectors: this.connectors
            });
            if (e) {
                const [s] = e.accounts;
                this.emit("accountChanged", {
                    address: s?.address,
                    chainId: e.caipNetwork?.id,
                    connector: e.connector
                });
            }
        }
    }
    class U1 extends $1 {
        async setUniversalProvider(e) {
            if (!this.namespace) throw new Error("UniversalAdapter:setUniversalProvider - namespace is required");
            return this.addConnector(new Du({
                provider: e,
                caipNetworks: this.getCaipNetworks(),
                namespace: this.namespace
            })), Promise.resolve();
        }
        async connect(e) {
            return Promise.resolve({
                id: "WALLET_CONNECT",
                type: "WALLET_CONNECT",
                chainId: Number(e.chainId),
                provider: this.provider,
                address: ""
            });
        }
        async disconnect() {
            try {
                await this.getWalletConnectConnector().disconnect(), this.emit("disconnect");
            } catch (e) {
                console.warn("UniversalAdapter:disconnect - error", e);
            }
            return {
                connections: []
            };
        }
        syncConnections() {
            return Promise.resolve();
        }
        async getAccounts({ namespace: e }) {
            const n = this.provider?.session?.namespaces?.[e]?.accounts?.map((r)=>{
                const [, , i] = r.split(":");
                return i;
            }).filter((r, i, o)=>o.indexOf(r) === i) || [];
            return Promise.resolve({
                accounts: n.map((r)=>J.createAccount(e, r, e === "bip122" ? "payment" : "eoa"))
            });
        }
        async syncConnectors() {
            return Promise.resolve();
        }
        async getBalance(e) {
            if (!(e.caipNetwork && me.BALANCE_SUPPORTED_CHAINS.includes(e.caipNetwork?.chainNamespace)) || e.caipNetwork?.testnet) return {
                balance: "0.00",
                symbol: e.caipNetwork?.nativeCurrency.symbol || ""
            };
            const n = p.getAccountData();
            if (n?.balanceLoading && e.chainId === p.state.activeCaipNetwork?.id) return {
                balance: n?.balance || "0.00",
                symbol: n?.balanceSymbol || ""
            };
            const i = (await p.fetchTokenBalance()).find((o)=>o.chainId === `${e.caipNetwork?.chainNamespace}:${e.chainId}` && o.symbol === e.caipNetwork?.nativeCurrency.symbol);
            return {
                balance: i?.quantity.numeric || "0.00",
                symbol: i?.symbol || e.caipNetwork?.nativeCurrency.symbol || ""
            };
        }
        async signMessage(e) {
            const { provider: s, message: n, address: r } = e;
            if (!s) throw new Error("UniversalAdapter:signMessage - provider is undefined");
            let i = "";
            return p.state.activeCaipNetwork?.chainNamespace === S.CHAIN.SOLANA ? i = (await s.request({
                method: "solana_signMessage",
                params: {
                    message: tr.encode(new TextEncoder().encode(n)),
                    pubkey: r
                }
            }, p.state.activeCaipNetwork?.caipNetworkId)).signature : i = await s.request({
                method: "personal_sign",
                params: [
                    n,
                    r
                ]
            }, p.state.activeCaipNetwork?.caipNetworkId), {
                signature: i
            };
        }
        async estimateGas() {
            return Promise.resolve({
                gas: BigInt(0)
            });
        }
        async sendTransaction() {
            return Promise.resolve({
                hash: ""
            });
        }
        walletGetAssets(e) {
            return Promise.resolve({});
        }
        async writeContract() {
            return Promise.resolve({
                hash: ""
            });
        }
        emitFirstAvailableConnection() {}
        parseUnits() {
            return 0n;
        }
        formatUnits() {
            return "0";
        }
        async getCapabilities() {
            return Promise.resolve({});
        }
        async grantPermissions() {
            return Promise.resolve({});
        }
        async revokePermissions() {
            return Promise.resolve("0x");
        }
        async syncConnection() {
            return Promise.resolve({
                id: "WALLET_CONNECT",
                type: "WALLET_CONNECT",
                chainId: 1,
                provider: this.provider,
                address: ""
            });
        }
        async switchNetwork(e) {
            const { caipNetwork: s } = e, n = this.getWalletConnectConnector();
            if (s.chainNamespace === S.CHAIN.EVM) try {
                await n.provider?.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId: rc(s.id)
                        }
                    ]
                });
            } catch (r) {
                if (r.code === Ar.ERROR_CODE_UNRECOGNIZED_CHAIN_ID || r.code === Ar.ERROR_INVALID_CHAIN_ID || r.code === Ar.ERROR_CODE_DEFAULT || r?.data?.originalError?.code === Ar.ERROR_CODE_UNRECOGNIZED_CHAIN_ID) try {
                    await n.provider?.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: rc(s.id),
                                rpcUrls: [
                                    s?.rpcUrls.chainDefault?.http
                                ],
                                chainName: s.name,
                                nativeCurrency: s.nativeCurrency,
                                blockExplorerUrls: [
                                    s.blockExplorers?.default.url
                                ]
                            }
                        ]
                    });
                } catch  {
                    throw new Error("Chain is not supported");
                }
            }
            n.provider.setDefaultChain(s.caipNetworkId);
        }
        getWalletConnectProvider() {
            return this.connectors.find((n)=>n.type === "WALLET_CONNECT")?.provider;
        }
    }
    const D1 = [
        "email",
        "socials",
        "swaps",
        "onramp",
        "activity",
        "reownBranding",
        "multiWallet",
        "emailCapture",
        "payWithExchange",
        "payments",
        "reownAuthentication"
    ], gi = {
        email: {
            apiFeatureName: "social_login",
            localFeatureName: "email",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>{
                if (!t?.config) return !1;
                const e = t.config;
                return !!t.isEnabled && e.includes("email");
            },
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.email : !!t
        },
        socials: {
            apiFeatureName: "social_login",
            localFeatureName: "socials",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>{
                if (!t?.config) return !1;
                const e = t.config;
                return t.isEnabled && e.length > 0 ? e.filter((s)=>s !== "email") : !1;
            },
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.socials : typeof t == "boolean" ? t ? me.DEFAULT_REMOTE_FEATURES.socials : !1 : t
        },
        swaps: {
            apiFeatureName: "swap",
            localFeatureName: "swaps",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>{
                if (!t?.config) return !1;
                const e = t.config;
                return t.isEnabled && e.length > 0 ? e : !1;
            },
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.swaps : typeof t == "boolean" ? t ? me.DEFAULT_REMOTE_FEATURES.swaps : !1 : t
        },
        onramp: {
            apiFeatureName: "onramp",
            localFeatureName: "onramp",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>{
                if (!t?.config) return !1;
                const e = t.config;
                return t.isEnabled && e.length > 0 ? e : !1;
            },
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.onramp : typeof t == "boolean" ? t ? me.DEFAULT_REMOTE_FEATURES.onramp : !1 : t
        },
        activity: {
            apiFeatureName: "activity",
            localFeatureName: "history",
            returnType: !1,
            isLegacy: !0,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.activity : !!t
        },
        reownBranding: {
            apiFeatureName: "reown_branding",
            localFeatureName: "reownBranding",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: (t)=>t === void 0 ? me.DEFAULT_REMOTE_FEATURES.reownBranding : !!t
        },
        emailCapture: {
            apiFeatureName: "email_capture",
            localFeatureName: "emailCapture",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>t.isEnabled && (t.config ?? []),
            processFallback: (t)=>!1
        },
        multiWallet: {
            apiFeatureName: "multi_wallet",
            localFeatureName: "multiWallet",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: ()=>me.DEFAULT_REMOTE_FEATURES.multiWallet
        },
        payWithExchange: {
            apiFeatureName: "fund_from_exchange",
            localFeatureName: "payWithExchange",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: ()=>me.DEFAULT_REMOTE_FEATURES.payWithExchange
        },
        payments: {
            apiFeatureName: "payments",
            localFeatureName: "payments",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: ()=>me.DEFAULT_REMOTE_FEATURES.payments
        },
        reownAuthentication: {
            apiFeatureName: "reown_authentication",
            localFeatureName: "reownAuthentication",
            returnType: !1,
            isLegacy: !1,
            isAvailableOnBasic: !1,
            processApi: (t)=>!!t.isEnabled,
            processFallback: (t)=>typeof t > "u" ? me.DEFAULT_REMOTE_FEATURES.reownAuthentication : !!t
        }
    }, L1 = {
        localSettingsOverridden: new Set,
        getApiConfig (t, e) {
            return e?.find((s)=>s.id === t);
        },
        addWarning (t, e) {
            if (t !== void 0) {
                const s = gi[e], n = s.isLegacy ? `"features.${s.localFeatureName}" (now "${e}")` : `"features.${e}"`;
                this.localSettingsOverridden.add(n);
            }
        },
        processFeature (t, e, s, n, r) {
            const i = gi[t], o = e[i.localFeatureName];
            if (r && !i.isAvailableOnBasic) return !1;
            if (n) {
                const a = this.getApiConfig(i.apiFeatureName, s);
                return a?.config === null ? this.processFallbackFeature(t, o) : a?.config ? (o !== void 0 && this.addWarning(o, t), this.processApiFeature(t, a)) : !1;
            }
            return this.processFallbackFeature(t, o);
        },
        processApiFeature (t, e) {
            return gi[t].processApi(e);
        },
        processFallbackFeature (t, e) {
            return gi[t].processFallback(e);
        },
        async fetchRemoteFeatures (t) {
            const e = t.basic ?? !1, s = t.features || {};
            this.localSettingsOverridden.clear();
            let n = null, r = !1;
            try {
                n = await ee.fetchProjectConfig(), r = n != null;
            } catch (o) {
                console.warn("[Reown Config] Failed to fetch remote project configuration. Using local/default values.", o);
            }
            const i = r && !e ? me.DEFAULT_REMOTE_FEATURES : me.DEFAULT_REMOTE_FEATURES_DISABLED;
            try {
                for (const o of D1){
                    const a = this.processFeature(o, s, n, r, e);
                    Object.assign(i, {
                        [o]: a
                    });
                }
            } catch (o) {
                return console.warn("[Reown Config] Failed to process the configuration from Cloud. Using default values.", o), me.DEFAULT_REMOTE_FEATURES;
            }
            if (r && this.localSettingsOverridden.size > 0) {
                const o = `Your local configuration for ${Array.from(this.localSettingsOverridden).join(", ")} was ignored because a remote configuration was successfully fetched. Please manage these features via your project dashboard on dashboard.reown.com.`;
                vt.open({
                    debugMessage: Pt.ALERT_WARNINGS.LOCAL_CONFIGURATION_IGNORED.debugMessage(o)
                }, "warning");
            }
            return i;
        }
    };
    class M1 {
        constructor(e){
            this.chainNamespaces = [], this.features = {}, this.remoteFeatures = {}, this.reportedAlertErrors = {}, this.getCaipNetwork = (s, n)=>{
                if (s) {
                    const r = p.getCaipNetworks(s)?.find((a)=>a.id === n);
                    if (r) return r;
                    const i = p.getNetworkData(s)?.caipNetwork;
                    return i || p.getRequestedCaipNetworks(s).filter((a)=>a.chainNamespace === s)?.[0];
                }
                return p.state.activeCaipNetwork || this.defaultCaipNetwork;
            }, this.getCaipNetworkId = ()=>{
                const s = this.getCaipNetwork();
                if (s) return s.id;
            }, this.getCaipNetworks = (s)=>p.getCaipNetworks(s), this.getActiveChainNamespace = ()=>p.state.activeChain, this.setRequestedCaipNetworks = (s, n)=>{
                p.setRequestedCaipNetworks(s, n);
            }, this.getApprovedCaipNetworkIds = ()=>p.getAllApprovedCaipNetworkIds(), this.getCaipAddress = (s)=>p.state.activeChain === s || !s ? p.state.activeCaipAddress : p.state.chains.get(s)?.accountState?.caipAddress, this.setClientId = (s)=>{
                se.setClientId(s);
            }, this.getProvider = (s)=>xe.getProvider(s), this.getProviderType = (s)=>xe.getProviderId(s), this.getPreferredAccountType = (s)=>Lt(s), this.setCaipAddress = (s, n, r = !1)=>{
                p.setAccountProp("caipAddress", s, n, r), p.setAccountProp("address", J.getPlainAddress(s), n, r);
            }, this.setBalance = (s, n, r)=>{
                p.setAccountProp("balance", s, r), p.setAccountProp("balanceSymbol", n, r);
            }, this.setProfileName = (s, n)=>{
                p.setAccountProp("profileName", s, n);
            }, this.setProfileImage = (s, n)=>{
                p.setAccountProp("profileImage", s, n);
            }, this.setUser = (s, n)=>{
                p.setAccountProp("user", s, n);
            }, this.resetAccount = (s)=>{
                p.resetAccount(s);
            }, this.setCaipNetwork = (s)=>{
                p.setActiveCaipNetwork(s);
            }, this.setCaipNetworkOfNamespace = (s, n)=>{
                p.setChainNetworkData(n, {
                    caipNetwork: s
                });
            }, this.setStatus = (s, n)=>{
                p.setAccountProp("status", s, n), L.isConnected() ? $.setConnectionStatus("connected") : $.setConnectionStatus("disconnected");
            }, this.getAddressByChainNamespace = (s)=>p.getAccountData(s)?.address, this.setConnectors = (s)=>{
                const n = [
                    ...L.state.allConnectors,
                    ...s
                ];
                L.setConnectors(n);
            }, this.setConnections = (s, n)=>{
                $.setConnections(s, n), H.setConnections(s, n);
            }, this.fetchIdentity = (s)=>se.fetchIdentity(s), this.getReownName = (s)=>_r.getNamesForAddress(s), this.getConnectors = ()=>L.getConnectors(), this.getConnectorImage = (s)=>Bd.getConnectorImage(s), this.getConnections = (s)=>this.remoteFeatures.multiWallet ? ki.getConnectionsData(s).connections : (vt.open(S.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.DEFAULT, "info"), []), this.getRecentConnections = (s)=>this.remoteFeatures.multiWallet ? ki.getConnectionsData(s).recentConnections : (vt.open(S.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.DEFAULT, "info"), []), this.switchConnection = async (s)=>{
                if (!this.remoteFeatures.multiWallet) {
                    vt.open(S.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.DEFAULT, "info");
                    return;
                }
                await H.switchConnection(s);
            }, this.deleteConnection = (s)=>{
                if (!this.remoteFeatures.multiWallet) {
                    vt.open(S.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.DEFAULT, "info");
                    return;
                }
                $.deleteAddressFromConnection(s), H.syncStorageConnections();
            }, this.setConnectedWalletInfo = (s, n)=>{
                const r = xe.getProviderId(n), i = s ? {
                    ...s,
                    type: r
                } : void 0;
                p.setAccountProp("connectedWalletInfo", i, n);
            }, this.getIsConnectedState = ()=>!!p.state.activeCaipAddress, this.addAddressLabel = (s, n, r)=>{
                const i = p.getAccountData(r)?.addressLabels || {};
                p.setAccountProp("addressLabels", {
                    ...i,
                    [s]: n
                }, r);
            }, this.removeAddressLabel = (s, n)=>{
                const r = p.getAccountData(n)?.addressLabels || {};
                p.setAccountProp("addressLabels", {
                    ...r,
                    [s]: void 0
                }, n);
            }, this.getAddress = (s)=>{
                const n = s || p.state.activeChain;
                return p.getAccountData(n)?.address;
            }, this.setApprovedCaipNetworksData = (s)=>p.setApprovedCaipNetworksData(s), this.resetNetwork = (s)=>{
                p.resetNetwork(s);
            }, this.addConnector = (s)=>{
                L.addConnector(s);
            }, this.resetWcConnection = ()=>{
                H.resetWcConnection();
            }, this.setAddressExplorerUrl = (s, n)=>{
                p.setAccountProp("addressExplorerUrl", s, n);
            }, this.setSmartAccountDeployed = (s, n)=>{
                p.setAccountProp("smartAccountDeployed", s, n);
            }, this.setPreferredAccountType = (s, n)=>{
                p.setAccountProp("preferredAccountType", s, n);
            }, this.setEIP6963Enabled = (s)=>{
                _.setEIP6963Enabled(s);
            }, this.handleUnsafeRPCRequest = ()=>{
                if (this.isOpen()) {
                    if (this.isTransactionStackEmpty()) return;
                    this.redirect("ApproveTransaction");
                } else this.open({
                    view: "ApproveTransaction"
                });
            }, this.options = e, this.version = e.sdkVersion, this.caipNetworks = this.extendCaipNetworks(e), this.chainNamespaces = this.getChainNamespacesSet(e.adapters, this.caipNetworks), this.defaultCaipNetwork = this.extendDefaultCaipNetwork(e), this.chainAdapters = this.createAdapters(e.adapters), this.readyPromise = this.initialize(e), GA.checkSDKVersion(e.sdkVersion);
        }
        getChainNamespacesSet(e, s) {
            const n = e?.map((i)=>i.namespace).filter((i)=>!!i);
            if (n?.length) return [
                ...new Set(n)
            ];
            const r = s?.map((i)=>i.chainNamespace);
            return [
                ...new Set(r)
            ];
        }
        async initialize(e) {
            if (this.initializeProjectSettings(e), this.initControllers(e), await this.initChainAdapters(), this.sendInitializeEvent(e), _.state.enableReconnect ? (await this.syncExistingConnection(), await this.syncAdapterConnections()) : await this.unSyncExistingConnection(), this.remoteFeatures = await L1.fetchRemoteFeatures(e), _.setRemoteFeatures(this.remoteFeatures), this.remoteFeatures.onramp && Go.setOnrampProviders(this.remoteFeatures.onramp), (_.state.remoteFeatures?.email || Array.isArray(_.state.remoteFeatures?.socials) && _.state.remoteFeatures?.socials.length > 0) && await this.checkAllowedOrigins(), _.state.features?.reownAuthentication || _.state.remoteFeatures?.reownAuthentication) {
                const { ReownAuthentication: s } = await _i(async ()=>{
                    const { ReownAuthentication: r } = await import("./features-BHoQ7UAq.js");
                    return {
                        ReownAuthentication: r
                    };
                }, __vite__mapDeps([0,1,2])), n = _.state.siwx;
                n instanceof s || (n && console.warn("ReownAuthentication option is enabled, SIWX configuration will be overridden."), _.setSIWX(new s));
            }
        }
        async openSend(e) {
            const s = e.namespace || p.state.activeChain, n = this.getCaipAddress(s), r = this.getCaipNetwork(s)?.id;
            if (!n) throw new Error("openSend: caipAddress not found");
            if (r?.toString() !== e.chainId.toString()) {
                const i = p.getCaipNetworkById(e.chainId, s);
                if (!i) throw new Error(`openSend: caipNetwork with chainId ${e.chainId} not found`);
                await this.switchNetwork(i, {
                    throwOnFailure: !0
                });
            }
            try {
                const i = Tu.getTokenSymbolByAddress(e.assetAddress);
                i && await ee.fetchTokenImages([
                    i
                ]);
            } catch  {}
            return await ue.open({
                view: "WalletSend",
                data: {
                    send: e
                }
            }), new Promise((i, o)=>{
                const a = ce.subscribeKey("hash", (d)=>{
                    d && (l(), i({
                        hash: d
                    }));
                }), c = ue.subscribe((d)=>{
                    d.open || (l(), o(new Error("Modal closed")));
                }), l = this.createCleanupHandler([
                    a,
                    c
                ]);
            });
        }
        toModalOptions() {
            function e(n) {
                return n?.view === "Swap";
            }
            function s(n) {
                return n?.view === "WalletSend";
            }
            return {
                isSwap: e,
                isSend: s
            };
        }
        async checkAllowedOrigins() {
            try {
                const e = await ee.fetchAllowedOrigins();
                if (!J.isClient()) return;
                const s = window.location.origin;
                Gt.isOriginAllowed(s, e, Ar.DEFAULT_ALLOWED_ANCESTORS) || vt.open(Pt.ALERT_ERRORS.ORIGIN_NOT_ALLOWED, "error");
            } catch (e) {
                if (!(e instanceof Error)) return;
                switch(e.message){
                    case "RATE_LIMITED":
                        vt.open(Pt.ALERT_ERRORS.RATE_LIMITED_APP_CONFIGURATION, "error");
                        break;
                    case "SERVER_ERROR":
                        {
                            const s = e.cause instanceof Error ? e.cause : e;
                            vt.open({
                                displayMessage: Pt.ALERT_ERRORS.SERVER_ERROR_APP_CONFIGURATION.displayMessage,
                                debugMessage: Pt.ALERT_ERRORS.SERVER_ERROR_APP_CONFIGURATION.debugMessage(s.message)
                            }, "error");
                            break;
                        }
                }
            }
        }
        createCleanupHandler(e) {
            return ()=>{
                e.forEach((s)=>{
                    try {
                        s();
                    } catch  {}
                });
            };
        }
        sendInitializeEvent(e) {
            const { ...s } = e;
            delete s.adapters, delete s.universalProvider, le.sendEvent({
                type: "track",
                event: "INITIALIZE",
                properties: {
                    ...s,
                    networks: e.networks.map((n)=>n.id),
                    siweConfig: {
                        options: e.siweConfig?.options || {}
                    }
                }
            });
        }
        initControllers(e) {
            this.initializeOptionsController(e), this.initializeChainController(e), this.initializeThemeController(e), this.initializeConnectionController(e), this.initializeConnectorController();
        }
        initializeThemeController(e) {
            e.themeMode && It.setThemeMode(e.themeMode), e.themeVariables && It.setThemeVariables(e.themeVariables);
        }
        initializeChainController(e) {
            if (!this.connectionControllerClient || !this.networkControllerClient) throw new Error("ConnectionControllerClient and NetworkControllerClient must be set");
            p.initialize(e.adapters ?? [], this.caipNetworks, {
                connectionControllerClient: this.connectionControllerClient,
                networkControllerClient: this.networkControllerClient
            });
            const s = this.getDefaultNetwork();
            s && p.setActiveCaipNetwork(s);
        }
        initializeConnectionController(e) {
            H.initialize(e.adapters ?? []), H.setWcBasic(e.basic ?? !1);
        }
        initializeConnectorController() {
            L.initialize(this.chainNamespaces);
        }
        initializeProjectSettings(e) {
            _.setProjectId(e.projectId), _.setSdkVersion(e.sdkVersion);
        }
        initializeOptionsController(e) {
            _.setDebug(e.debug !== !1), _.setEnableWalletGuide(e.enableWalletGuide !== !1), _.setEnableWallets(e.enableWallets !== !1), _.setEIP6963Enabled(e.enableEIP6963 !== !1), _.setEnableNetworkSwitch(e.enableNetworkSwitch !== !1), _.setEnableReconnect(e.enableReconnect !== !1), _.setEnableMobileFullScreen(e.enableMobileFullScreen === !0), _.setEnableAuthLogger(e.enableAuthLogger !== !1), _.setCustomRpcUrls(e.customRpcUrls), _.setEnableEmbedded(e.enableEmbedded), _.setAllWallets(e.allWallets), _.setIncludeWalletIds(e.includeWalletIds), _.setExcludeWalletIds(e.excludeWalletIds), _.setFeaturedWalletIds(e.featuredWalletIds), _.setTokens(e.tokens), _.setTermsConditionsUrl(e.termsConditionsUrl), _.setPrivacyPolicyUrl(e.privacyPolicyUrl), _.setCustomWallets(e.customWallets), _.setFeatures(e.features), _.setAllowUnsupportedChain(e.allowUnsupportedChain), _.setUniversalProviderConfigOverride(e.universalProviderConfigOverride), _.setPreferUniversalLinks(e.experimental_preferUniversalLinks), _.setDefaultAccountTypes(e.defaultAccountTypes);
            const s = this.getDefaultMetaData();
            if (!e.metadata && s && (e.metadata = s), _.setMetadata(e.metadata), _.setDisableAppend(e.disableAppend), _.setEnableEmbedded(e.enableEmbedded), _.setSIWX(e.siwx), this.features = _.state.features ?? {}, !e.projectId) {
                vt.open(Pt.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED, "error");
                return;
            }
            if (e.adapters?.find((r)=>r.namespace === S.CHAIN.EVM) && e.siweConfig) {
                if (e.siwx) throw new Error("Cannot set both `siweConfig` and `siwx` options");
                _.setSIWX(e.siweConfig.mapToSIWX());
            }
        }
        getDefaultMetaData() {
            return J.isClient() ? {
                name: document.getElementsByTagName("title")?.[0]?.textContent || "",
                description: document.querySelector('meta[property="og:description"]')?.content || "",
                url: window.location.origin,
                icons: [
                    document.querySelector('link[rel~="icon"]')?.href || ""
                ]
            } : null;
        }
        setUnsupportedNetwork(e) {
            const s = this.getActiveChainNamespace();
            if (s) {
                const n = Mn.getUnsupportedNetwork(`${s}:${e}`);
                p.setActiveCaipNetwork(n);
            }
        }
        getDefaultNetwork() {
            return Mn.getCaipNetworkFromStorage(this.defaultCaipNetwork);
        }
        extendCaipNetwork(e, s) {
            return Mn.extendCaipNetwork(e, {
                customNetworkImageUrls: s.chainImages,
                projectId: s.projectId
            });
        }
        extendCaipNetworks(e) {
            return Mn.extendCaipNetworks(e.networks, {
                customNetworkImageUrls: e.chainImages,
                customRpcUrls: e.customRpcUrls,
                projectId: e.projectId
            });
        }
        extendDefaultCaipNetwork(e) {
            const s = e.networks.find((r)=>r.id === e.defaultNetwork?.id);
            return s ? Mn.extendCaipNetwork(s, {
                customNetworkImageUrls: e.chainImages,
                customRpcUrls: e.customRpcUrls,
                projectId: e.projectId
            }) : void 0;
        }
        async disconnectConnector(e, s) {
            try {
                this.setLoading(!0, e);
                let n = {
                    connections: []
                };
                const r = this.getAdapter(e);
                return (p.state.chains.get(e)?.accountState?.caipAddress || !_.state.enableReconnect) && r?.disconnect && (n = await r.disconnect({
                    id: s
                })), this.setLoading(!1, e), n;
            } catch (n) {
                throw this.setLoading(!1, e), new Error(`Failed to disconnect chains: ${n.message}`);
            }
        }
        createClients() {
            this.connectionControllerClient = {
                connectWalletConnect: async ()=>{
                    const e = p.state.activeChain, s = this.getAdapter(e), n = this.getCaipNetwork(e)?.id, r = H.getConnections(e), i = this.remoteFeatures.multiWallet, o = r.length > 0;
                    if (!s) throw new Error("Adapter not found");
                    const a = await s.connectWalletConnect(n);
                    (!o || !i) && this.close(), this.setClientId(a?.clientId || null), $.setConnectedNamespaces([
                        ...p.state.chains.keys()
                    ]), await this.syncWalletConnectAccount(), await ns.initializeIfEnabled();
                },
                connectExternal: async (e)=>{
                    const s = await this.onConnectExternal(e);
                    return await this.connectInactiveNamespaces(e, s), s ? {
                        address: s.address
                    } : void 0;
                },
                reconnectExternal: async ({ id: e, info: s, type: n, provider: r })=>{
                    const i = p.state.activeChain, o = this.getAdapter(i);
                    if (!i) throw new Error("reconnectExternal: namespace not found");
                    if (!o) throw new Error("reconnectExternal: adapter not found");
                    o?.reconnect && (await o?.reconnect({
                        id: e,
                        info: s,
                        type: n,
                        provider: r,
                        chainId: this.getCaipNetwork()?.id
                    }), $.addConnectedNamespace(i), this.syncConnectedWalletInfo(i));
                },
                disconnectConnector: async (e)=>{
                    await this.disconnectConnector(e.namespace, e.id);
                },
                disconnect: async (e)=>{
                    const { id: s, chainNamespace: n, initialDisconnect: r } = e || {}, i = n || p.state.activeChain, o = L.getConnectorId(i), a = s === S.CONNECTOR_ID.AUTH || o === S.CONNECTOR_ID.AUTH, c = s === S.CONNECTOR_ID.WALLET_CONNECT || o === S.CONNECTOR_ID.WALLET_CONNECT;
                    try {
                        const l = Array.from(p.state.chains.keys());
                        let d = n ? [
                            n
                        ] : l;
                        (c || a) && (d = l);
                        const h = d.map(async (g)=>{
                            const w = L.getConnectorId(g), m = s || w, A = await this.disconnectConnector(g, m);
                            A && (a && $.deleteConnectedSocialProvider(), A.connections.forEach((v)=>{
                                $.addDisconnectedConnectorId(v.connectorId, g);
                            })), r && this.onDisconnectNamespace({
                                chainNamespace: g,
                                closeModal: !1
                            });
                        }), u = await Promise.allSettled(h);
                        ce.resetSend(), H.resetWcConnection(), ns.getSIWX()?.signOutOnDisconnect && await ns.clearSessions(), L.setFilterByNamespace(void 0), H.syncStorageConnections();
                        const f = u.filter((g)=>g.status === "rejected");
                        if (f.length > 0) throw new Error(f.map((g)=>g.reason.message).join(", "));
                        le.sendEvent({
                            type: "track",
                            event: "DISCONNECT_SUCCESS",
                            properties: {
                                namespace: n || "all"
                            }
                        });
                    } catch (l) {
                        throw new Error(`Failed to disconnect chains: ${l.message}`);
                    }
                },
                checkInstalled: (e)=>e ? e.some((s)=>!!window.ethereum?.[String(s)]) : !!window.ethereum,
                signMessage: async (e)=>{
                    const s = p.state.activeChain, n = this.getAdapter(p.state.activeChain);
                    if (!s) throw new Error("signMessage: namespace not found");
                    if (!n) throw new Error("signMessage: adapter not found");
                    const r = this.getAddress(s);
                    if (!r) throw new Error("signMessage: address not found");
                    return (await n?.signMessage({
                        message: e,
                        address: r,
                        provider: xe.getProvider(s)
                    }))?.signature || "";
                },
                sendTransaction: async (e)=>{
                    const s = e.chainNamespace;
                    if (!s) throw new Error("sendTransaction: namespace not found");
                    if (me.SEND_SUPPORTED_NAMESPACES.includes(s)) {
                        const n = this.getAdapter(s);
                        if (!n) throw new Error("sendTransaction: adapter not found");
                        const r = xe.getProvider(s);
                        return (await n?.sendTransaction({
                            ...e,
                            caipNetwork: this.getCaipNetwork(),
                            provider: r
                        }))?.hash || "";
                    }
                    return "";
                },
                estimateGas: async (e)=>{
                    const s = e.chainNamespace;
                    if (s === S.CHAIN.EVM) {
                        const n = this.getAdapter(s);
                        if (!n) throw new Error("estimateGas: adapter is required but got undefined");
                        const r = xe.getProvider(s), i = this.getCaipNetwork();
                        if (!i) throw new Error("estimateGas: caipNetwork is required but got undefined");
                        return (await n?.estimateGas({
                            ...e,
                            provider: r,
                            caipNetwork: i
                        }))?.gas || 0n;
                    }
                    return 0n;
                },
                getEnsAvatar: async ()=>{
                    const e = p.state.activeChain;
                    if (!e) throw new Error("getEnsAvatar: namespace is required but got undefined");
                    const s = this.getAddress(e);
                    if (!s) throw new Error("getEnsAvatar: address not found");
                    return await this.syncIdentity({
                        address: s,
                        chainId: Number(this.getCaipNetwork()?.id),
                        chainNamespace: e
                    }), p.getAccountData()?.profileImage || !1;
                },
                getEnsAddress: async (e)=>await Gt.resolveReownName(e),
                writeContract: async (e)=>{
                    const s = p.state.activeChain, n = this.getAdapter(s);
                    if (!s) throw new Error("writeContract: namespace is required but got undefined");
                    if (!n) throw new Error("writeContract: adapter is required but got undefined");
                    const r = this.getCaipNetwork(), i = this.getCaipAddress(), o = xe.getProvider(s);
                    if (!r || !i) throw new Error("writeContract: caipNetwork or caipAddress is required but got undefined");
                    return (await n?.writeContract({
                        ...e,
                        caipNetwork: r,
                        provider: o,
                        caipAddress: i
                    }))?.hash;
                },
                parseUnits: (e, s)=>{
                    const n = this.getAdapter(p.state.activeChain);
                    if (!n) throw new Error("parseUnits: adapter is required but got undefined");
                    return n?.parseUnits({
                        value: e,
                        decimals: s
                    }) ?? 0n;
                },
                formatUnits: (e, s)=>{
                    const n = this.getAdapter(p.state.activeChain);
                    if (!n) throw new Error("formatUnits: adapter is required but got undefined");
                    return n?.formatUnits({
                        value: e,
                        decimals: s
                    }) ?? "0";
                },
                getCapabilities: async (e)=>{
                    const s = this.getAdapter(p.state.activeChain);
                    if (!s) throw new Error("getCapabilities: adapter is required but got undefined");
                    return await s?.getCapabilities(e);
                },
                grantPermissions: async (e)=>{
                    const s = this.getAdapter(p.state.activeChain);
                    if (!s) throw new Error("grantPermissions: adapter is required but got undefined");
                    return await s?.grantPermissions(e);
                },
                revokePermissions: async (e)=>{
                    const s = this.getAdapter(p.state.activeChain);
                    if (!s) throw new Error("revokePermissions: adapter is required but got undefined");
                    return s?.revokePermissions ? await s.revokePermissions(e) : "0x";
                },
                walletGetAssets: async (e)=>{
                    const s = this.getAdapter(p.state.activeChain);
                    if (!s) throw new Error("walletGetAssets: adapter is required but got undefined");
                    return await s?.walletGetAssets(e) ?? {};
                },
                updateBalance: (e)=>{
                    const s = this.getAddress(e), n = this.getCaipNetwork(e);
                    !n || !s || this.updateNativeBalance(s, n?.id, e);
                }
            }, this.networkControllerClient = {
                switchCaipNetwork: async (e)=>await this.switchCaipNetwork(e),
                getApprovedCaipNetworksData: async ()=>this.getApprovedCaipNetworksData()
            }, H.setClient(this.connectionControllerClient);
        }
        async onConnectExternal(e) {
            const s = p.state.activeChain, n = e.chain || s, r = this.getAdapter(n);
            let i = !0;
            if (e.type === ms.CONNECTOR_TYPE_AUTH && S.AUTH_CONNECTOR_SUPPORTED_CHAINS.some((h)=>L.getConnectorId(h) === S.CONNECTOR_ID.AUTH) && e.chain !== s && (i = !1), e.chain && e.chain !== s && !e.caipNetwork) {
                const l = this.getCaipNetworks().find((d)=>d.chainNamespace === e.chain);
                l && i && this.setCaipNetwork(l);
            }
            if (!n) throw new Error("connectExternal: namespace not found");
            if (!r) throw new Error("connectExternal: adapter not found");
            const o = this.getCaipNetwork(n), a = e.caipNetwork || o, c = await r.connect({
                id: e.id,
                address: e.address,
                info: e.info,
                type: e.type,
                provider: e.provider,
                socialUri: e.socialUri,
                chainId: e.caipNetwork?.id || o?.id,
                rpcUrl: e.caipNetwork?.rpcUrls?.default?.http?.[0] || o?.rpcUrls?.default?.http?.[0]
            });
            if (c) return $.addConnectedNamespace(n), this.syncProvider({
                ...c,
                chainNamespace: n
            }), this.setStatus("connected", n), this.syncConnectedWalletInfo(n), $.removeDisconnectedConnectorId(e.id, n), {
                address: c.address,
                connectedCaipNetwork: a
            };
        }
        async connectInactiveNamespaces(e, s) {
            const n = e.type === ms.CONNECTOR_TYPE_AUTH, r = Ye.getOtherAuthNamespaces(s?.connectedCaipNetwork?.chainNamespace), i = p.state.activeCaipNetwork, o = this.getAdapter(i?.chainNamespace), a = xe.getProvider(i?.chainNamespace);
            n && (await Promise.all(r.map(async (c)=>{
                try {
                    const l = xe.getProvider(c), d = this.getCaipNetwork(c);
                    await this.getAdapter(c)?.connect({
                        ...e,
                        provider: l,
                        socialUri: void 0,
                        chainId: d?.id,
                        rpcUrl: d?.rpcUrls?.default?.http?.[0]
                    }) && ($.addConnectedNamespace(c), $.removeDisconnectedConnectorId(e.id, c), this.setStatus("connected", c), this.syncConnectedWalletInfo(c));
                } catch (l) {
                    vt.warn(Pt.ALERT_WARNINGS.INACTIVE_NAMESPACE_NOT_CONNECTED.displayMessage, Pt.ALERT_WARNINGS.INACTIVE_NAMESPACE_NOT_CONNECTED.debugMessage(c, l instanceof Error ? l.message : void 0), Pt.ALERT_WARNINGS.INACTIVE_NAMESPACE_NOT_CONNECTED.code);
                }
            })), i && await o?.switchNetwork({
                caipNetwork: i,
                provider: a,
                providerType: e.type
            }));
        }
        getApprovedCaipNetworksData() {
            if (xe.getProviderId(p.state.activeChain) === ms.CONNECTOR_TYPE_WALLET_CONNECT) {
                const s = this.universalProvider?.session?.namespaces;
                return {
                    supportsAllNetworks: this.universalProvider?.session?.peer?.metadata.name === "MetaMask Wallet",
                    approvedCaipNetworkIds: this.getChainsFromNamespaces(s)
                };
            }
            return {
                supportsAllNetworks: !0,
                approvedCaipNetworkIds: []
            };
        }
        async switchCaipNetwork(e) {
            const s = e.chainNamespace;
            if (this.getAddressByChainNamespace(e.chainNamespace)) {
                const r = xe.getProvider(s), i = xe.getProviderId(s);
                if (e.chainNamespace === p.state.activeChain) await this.getAdapter(s)?.switchNetwork({
                    caipNetwork: e,
                    provider: r,
                    providerType: i
                });
                else if (this.setCaipNetwork(e), i === ms.CONNECTOR_TYPE_WALLET_CONNECT) this.syncWalletConnectAccount();
                else {
                    const o = this.getAddressByChainNamespace(s);
                    o && this.syncAccount({
                        address: o,
                        chainId: e.id,
                        chainNamespace: s
                    });
                }
            } else this.setCaipNetwork(e);
        }
        getChainsFromNamespaces(e = {}) {
            return Object.values(e).flatMap((s)=>{
                const n = s.chains || [], r = s.accounts.map((i)=>{
                    const { chainId: o, chainNamespace: a } = it.parseCaipAddress(i);
                    return `${a}:${o}`;
                });
                return Array.from(new Set([
                    ...n,
                    ...r
                ]));
            });
        }
        createAdapters(e) {
            return this.createClients(), this.chainNamespaces.reduce((s, n)=>{
                const r = e?.find((i)=>i.namespace === n);
                return r ? (r.construct({
                    namespace: n,
                    projectId: this.options?.projectId,
                    networks: this.caipNetworks?.filter(({ chainNamespace: i })=>i === n)
                }), s[n] = r) : s[n] = new U1({
                    namespace: n,
                    networks: this.getCaipNetworks()
                }), s;
            }, {});
        }
        async initChainAdapter(e) {
            this.onConnectors(e), this.listenAdapter(e), await this.chainAdapters?.[e].syncConnectors(this.options, this), await this.createUniversalProviderForAdapter(e);
        }
        async initChainAdapters() {
            await Promise.all(this.chainNamespaces.map(async (e)=>{
                await this.initChainAdapter(e);
            }));
        }
        onConnectors(e) {
            this.getAdapter(e)?.on("connectors", this.setConnectors.bind(this));
        }
        listenAdapter(e) {
            const s = this.getAdapter(e);
            if (!s) return;
            const n = $.getConnectionStatus();
            _.state.enableReconnect === !1 ? this.setStatus("disconnected", e) : n === "connected" ? this.setStatus("connecting", e) : n === "disconnected" ? ($.clearAddressCache(), this.setStatus(n, e)) : this.setStatus(n, e), s.on("switchNetwork", ({ address: r, chainId: i })=>{
                const o = this.getCaipNetworks().find((l)=>l.id.toString() === i.toString() || l.caipNetworkId.toString() === i.toString()), a = p.state.activeChain === e, c = p.state.chains.get(e)?.accountState?.address;
                if (o) {
                    const l = a && r ? r : c;
                    l && this.syncAccount({
                        address: l,
                        chainId: o.id,
                        chainNamespace: e
                    });
                } else this.setUnsupportedNetwork(i);
            }), s.on("disconnect", ()=>{
                const r = this.remoteFeatures.multiWallet, i = Array.from(H.state.connections.values()).flat();
                this.onDisconnectNamespace({
                    chainNamespace: e,
                    closeModal: !r || i.length === 0
                });
            }), s.on("connections", (r)=>{
                this.setConnections(r, e);
            }), s.on("pendingTransactions", ()=>{
                const r = this.getAddress(e), i = p.state.activeCaipNetwork;
                !r || !i?.id || this.updateNativeBalance(r, i.id, i.chainNamespace);
            }), s.on("accountChanged", ({ address: r, chainId: i, connector: o })=>{
                this.handlePreviousConnectorConnection(o);
                const a = p.state.activeChain === e;
                o?.provider && (this.syncProvider({
                    id: o.id,
                    type: o.type,
                    provider: o?.provider,
                    chainNamespace: e
                }), this.syncConnectedWalletInfo(e));
                const c = p.getNetworkData(e)?.caipNetwork?.id, l = i || c;
                a && l ? this.syncAccount({
                    address: r,
                    chainId: l,
                    chainNamespace: e
                }) : !a && l ? (this.syncAccountInfo(r, l, e), this.syncBalance({
                    address: r,
                    chainId: l,
                    chainNamespace: e
                })) : this.syncAccountInfo(r, i, e), $.addConnectedNamespace(e);
            });
        }
        async handlePreviousConnectorConnection(e) {
            const s = e?.chain, n = e?.id, r = L.getConnectorId(s), i = _.state.remoteFeatures?.multiWallet, a = s && n && r && r !== n && !i;
            try {
                a && await H.disconnect({
                    id: r,
                    namespace: s
                });
            } catch (c) {
                console.warn("Error disconnecting previous connector", c);
            }
        }
        async createUniversalProviderForAdapter(e) {
            await this.getUniversalProvider(), this.universalProvider && await this.chainAdapters?.[e]?.setUniversalProvider?.(this.universalProvider);
        }
        async syncExistingConnection() {
            await Promise.allSettled(this.chainNamespaces.map((e)=>this.syncNamespaceConnection(e)));
        }
        async unSyncExistingConnection() {
            try {
                await Promise.allSettled(this.chainNamespaces.map((e)=>H.disconnect({
                        namespace: e,
                        initialDisconnect: !0
                    })));
            } catch (e) {
                console.error("Error disconnecting existing connections:", e);
            }
        }
        async reconnectWalletConnect() {
            await this.syncWalletConnectAccount();
            const e = this.getAddress();
            this.getCaipAddress() || $.deleteRecentWallet();
            const s = $.getRecentWallet();
            le.sendEvent({
                type: "track",
                event: "CONNECT_SUCCESS",
                address: e,
                properties: {
                    method: J.isMobile() ? "mobile" : "qrcode",
                    name: s?.name || "Unknown",
                    reconnect: !0,
                    view: te.state.view,
                    walletRank: s?.order
                }
            });
        }
        async syncNamespaceConnection(e) {
            try {
                e === S.CHAIN.EVM && J.isSafeApp() && L.setConnectorId(S.CONNECTOR_ID.SAFE, e);
                const s = L.getConnectorId(e);
                switch(this.setStatus("connecting", e), s){
                    case S.CONNECTOR_ID.WALLET_CONNECT:
                        await this.reconnectWalletConnect();
                        break;
                    case S.CONNECTOR_ID.AUTH:
                        break;
                    default:
                        await this.syncAdapterConnection(e);
                }
            } catch (s) {
                console.warn("AppKit couldn't sync existing connection", s), this.setStatus("disconnected", e);
            }
        }
        onDisconnectNamespace(e) {
            const { chainNamespace: s, closeModal: n } = e || {};
            p.resetAccount(s), p.resetNetwork(s), $.removeConnectedNamespace(s);
            const r = Array.from(p.state.chains.keys());
            (s ? [
                s
            ] : r).forEach((o)=>$.addDisconnectedConnectorId(L.getConnectorId(o) || "", o)), L.removeConnectorId(s), xe.resetChain(s), this.setUser(null, s), this.setStatus("disconnected", s), this.setConnectedWalletInfo(null, s), n !== !1 && ue.close();
        }
        async syncAdapterConnections() {
            await Promise.allSettled(this.chainNamespaces.map((e)=>{
                const s = this.getAdapter(e), n = this.getCaipAddress(e), r = this.getCaipNetwork(e);
                return s?.syncConnections({
                    connectToFirstConnector: !n,
                    caipNetwork: r
                });
            }));
        }
        async syncAdapterConnection(e) {
            const s = this.getAdapter(e), n = this.getCaipNetwork(e), r = L.getConnectorId(e), o = L.getConnectors(e).find((a)=>a.id === r);
            try {
                if (!s || !o) throw new Error(`Adapter or connector not found for namespace ${e}`);
                if (!n?.id) throw new Error("CaipNetwork not found");
                const a = await s?.syncConnection({
                    namespace: e,
                    id: o.id,
                    chainId: n.id,
                    rpcUrl: n?.rpcUrls?.default?.http?.[0]
                });
                a ? (this.syncProvider({
                    ...a,
                    chainNamespace: e
                }), await this.syncAccount({
                    ...a,
                    chainNamespace: e
                }), this.setStatus("connected", e), le.sendEvent({
                    type: "track",
                    event: "CONNECT_SUCCESS",
                    address: a.address,
                    properties: {
                        method: "browser",
                        name: o.info?.name || o.name || "Unknown",
                        reconnect: !0,
                        view: te.state.view,
                        walletRank: void 0
                    }
                })) : this.setStatus("disconnected", e);
            } catch  {
                this.onDisconnectNamespace({
                    chainNamespace: e,
                    closeModal: !1
                });
            }
        }
        async syncWalletConnectAccount() {
            const e = Object.keys(this.universalProvider?.session?.namespaces || {}), s = this.chainNamespaces.map(async (n)=>{
                const r = this.getAdapter(n);
                if (!r) return;
                const i = this.universalProvider?.session?.namespaces?.[n]?.accounts || [], o = p.state.activeCaipNetwork?.id, a = i.find((c)=>{
                    const { chainId: l } = it.parseCaipAddress(c);
                    return l === o?.toString();
                }) || i[0];
                if (a) {
                    const c = it.validateCaipAddress(a), { chainId: l, address: d } = it.parseCaipAddress(c);
                    if (xe.setProviderId(n, ms.CONNECTOR_TYPE_WALLET_CONNECT), this.caipNetworks && p.state.activeCaipNetwork && r.namespace !== S.CHAIN.EVM) {
                        const h = r.getWalletConnectProvider({
                            caipNetworks: this.getCaipNetworks(),
                            provider: this.universalProvider,
                            activeCaipNetwork: p.state.activeCaipNetwork
                        });
                        xe.setProvider(n, h);
                    } else xe.setProvider(n, this.universalProvider);
                    L.setConnectorId(S.CONNECTOR_ID.WALLET_CONNECT, n), $.addConnectedNamespace(n), await this.syncAccount({
                        address: d,
                        chainId: l,
                        chainNamespace: n
                    });
                } else e.includes(n) && this.setStatus("disconnected", n);
                this.syncConnectedWalletInfo(n), await p.setApprovedCaipNetworksData(n);
            });
            await Promise.all(s);
        }
        syncProvider({ type: e, provider: s, id: n, chainNamespace: r }) {
            xe.setProviderId(r, e), xe.setProvider(r, s), L.setConnectorId(n, r);
        }
        async syncAccount(e) {
            const s = e.chainNamespace === p.state.activeChain, n = p.getCaipNetworkByNamespace(e.chainNamespace, e.chainId), { address: r, chainId: i, chainNamespace: o } = e, { chainId: a } = $.getActiveNetworkProps(), c = i || a, l = p.state.activeCaipNetwork?.name === S.UNSUPPORTED_NETWORK_NAME, d = p.getNetworkProp("supportsAllNetworks", o);
            if (this.setStatus("connected", o), !(l && !d) && c) {
                let h = this.getCaipNetworks().find((w)=>w.id.toString() === c.toString()), u = this.getCaipNetworks().find((w)=>w.chainNamespace === o);
                if (!d && !h && !u) {
                    const w = this.getApprovedCaipNetworkIds() || [], m = w.find((v)=>it.parseCaipNetworkId(v)?.chainId === c.toString()), A = w.find((v)=>it.parseCaipNetworkId(v)?.chainNamespace === o);
                    h = this.getCaipNetworks().find((v)=>v.caipNetworkId === m), u = this.getCaipNetworks().find((v)=>v.caipNetworkId === A || "deprecatedCaipNetworkId" in v && v.deprecatedCaipNetworkId === A);
                }
                const f = h || u;
                f?.chainNamespace === p.state.activeChain ? _.state.enableNetworkSwitch && !_.state.allowUnsupportedChain && p.state.activeCaipNetwork?.name === S.UNSUPPORTED_NETWORK_NAME ? p.showUnsupportedChainUI() : this.setCaipNetwork(f) : s || n && this.setCaipNetworkOfNamespace(n, o), this.syncConnectedWalletInfo(o);
                const g = this.getAddress(o);
                Ye.isLowerCaseMatch(r, g) || this.syncAccountInfo(r, f?.id, o), s ? await this.syncBalance({
                    address: r,
                    chainId: f?.id,
                    chainNamespace: o
                }) : await this.syncBalance({
                    address: r,
                    chainId: n?.id,
                    chainNamespace: o
                }), this.syncIdentity({
                    address: r,
                    chainId: i,
                    chainNamespace: o
                });
            }
        }
        async syncAccountInfo(e, s, n) {
            const r = this.getCaipAddress(n), i = s || r?.split(":")[1];
            if (!i) return;
            const o = `${n}:${i}:${e}`;
            this.setCaipAddress(o, n, !0), await this.syncIdentity({
                address: e,
                chainId: i,
                chainNamespace: n
            });
        }
        async syncReownName(e, s) {
            try {
                const n = await this.getReownName(e);
                if (n[0]) {
                    const r = n[0];
                    this.setProfileName(r.name, s);
                } else this.setProfileName(null, s);
            } catch  {
                this.setProfileName(null, s);
            }
        }
        syncConnectedWalletInfo(e) {
            const s = L.getConnectorId(e), n = xe.getProviderId(e);
            if (n === ms.CONNECTOR_TYPE_ANNOUNCED || n === ms.CONNECTOR_TYPE_INJECTED) {
                if (s) {
                    const i = this.getConnectors().find((o)=>{
                        const a = o.id === s, c = o.info?.rdns === s, l = o.connectors?.some((d)=>d.id === s || d.info?.rdns === s);
                        return a || c || !!l;
                    });
                    if (i) {
                        const { info: o, name: a, imageUrl: c } = i, l = c || this.getConnectorImage(i);
                        this.setConnectedWalletInfo({
                            name: a,
                            icon: l,
                            ...o
                        }, e);
                    }
                }
            } else if (n === ms.CONNECTOR_TYPE_WALLET_CONNECT) {
                const r = xe.getProvider(e);
                r?.session && this.setConnectedWalletInfo({
                    ...r.session.peer.metadata,
                    name: r.session.peer.metadata.name,
                    icon: r.session.peer.metadata.icons?.[0]
                }, e);
            } else if (s && (s === S.CONNECTOR_ID.COINBASE_SDK || s === S.CONNECTOR_ID.COINBASE)) {
                const r = this.getConnectors().find((c)=>c.id === s), i = r?.name || "Coinbase Wallet", o = r?.imageUrl || this.getConnectorImage(r), a = r?.info;
                this.setConnectedWalletInfo({
                    ...a,
                    name: i,
                    icon: o
                }, e);
            }
        }
        async syncBalance(e) {
            !Pd.getNetworksByNamespace(this.getCaipNetworks(), e.chainNamespace).find((n)=>n.id.toString() === e.chainId?.toString()) || !e.chainId || await this.updateNativeBalance(e.address, e.chainId, e.chainNamespace);
        }
        async ready() {
            await this.readyPromise;
        }
        async updateNativeBalance(e, s, n) {
            const r = this.getAdapter(n), i = p.getCaipNetworkByNamespace(n, s);
            if (r) {
                const o = await r.getBalance({
                    address: e,
                    chainId: s,
                    caipNetwork: i,
                    tokens: this.options.tokens
                });
                return this.setBalance(o.balance, o.symbol, n), o;
            }
        }
        async initializeUniversalAdapter() {
            const e = JA.createLogger((n, ...r)=>{
                n && this.handleAlertError(n), console.error(...r);
            }), s = {
                projectId: this.options?.projectId,
                metadata: {
                    name: this.options?.metadata ? this.options?.metadata.name : "",
                    description: this.options?.metadata ? this.options?.metadata.description : "",
                    url: this.options?.metadata ? this.options?.metadata.url : "",
                    icons: this.options?.metadata ? this.options?.metadata.icons : [
                        ""
                    ]
                },
                logger: e
            };
            _.setManualWCControl(!!this.options?.manualWCControl), this.universalProvider = this.options.universalProvider ?? await zA.init(s), _.state.enableReconnect === !1 && this.universalProvider.session && await this.universalProvider.disconnect(), this.listenWalletConnect();
        }
        listenWalletConnect() {
            this.universalProvider && this.chainNamespaces.forEach((e)=>{
                Gt.listenWcProvider({
                    universalProvider: this.universalProvider,
                    namespace: e,
                    onDisplayUri: (s)=>{
                        H.setUri(s);
                    },
                    onConnect: (s)=>{
                        const { address: n } = J.getAccount(s[0]);
                        H.finalizeWcConnection(n);
                    },
                    onDisconnect: ()=>{
                        p.state.noAdapters && this.resetAccount(e), H.resetWcConnection();
                    },
                    onChainChanged: (s)=>{
                        const n = p.state.activeChain, r = n && L.state.activeConnectorIds[n] === S.CONNECTOR_ID.WALLET_CONNECT;
                        if (n === e && (p.state.noAdapters || r)) {
                            const i = this.getCaipNetworks().find((a)=>a.id.toString() === s.toString() || a.caipNetworkId.toString() === s.toString()), o = this.getCaipNetwork();
                            if (!i) {
                                this.setUnsupportedNetwork(s);
                                return;
                            }
                            o?.id.toString() !== i?.id.toString() && o?.chainNamespace === i?.chainNamespace && this.setCaipNetwork(i);
                        }
                    },
                    onAccountsChanged: (s)=>{
                        const n = p.state.activeChain, r = n && L.state.activeConnectorIds[n] === S.CONNECTOR_ID.WALLET_CONNECT;
                        if (n === e && (p.state.noAdapters || r)) {
                            const i = s?.[0];
                            i && this.syncAccount({
                                address: i.address,
                                chainId: i.chainId,
                                chainNamespace: i.chainNamespace
                            });
                        }
                    }
                });
            });
        }
        createUniversalProvider() {
            return !this.universalProviderInitPromise && J.isClient() && this.options?.projectId && (this.universalProviderInitPromise = this.initializeUniversalAdapter()), this.universalProviderInitPromise;
        }
        async getUniversalProvider() {
            if (!this.universalProvider) try {
                await this.createUniversalProvider();
            } catch (e) {
                le.sendEvent({
                    type: "error",
                    event: "INTERNAL_SDK_ERROR",
                    properties: {
                        errorType: "UniversalProviderInitError",
                        errorMessage: e instanceof Error ? e.message : "Unknown",
                        uncaught: !1
                    }
                }), console.error("AppKit:getUniversalProvider - Cannot create provider", e);
            }
            return this.universalProvider;
        }
        getDisabledCaipNetworks() {
            const e = p.getAllApprovedCaipNetworkIds(), s = p.getAllRequestedCaipNetworks();
            return J.sortRequestedNetworks(e, s).filter((r)=>p.isCaipNetworkDisabled(r));
        }
        handleAlertError(e) {
            const s = Object.entries(Pt.UniversalProviderErrors).find(([, { message: a }])=>e.message.includes(a)), [n, r] = s ?? [], { message: i, alertErrorKey: o } = r ?? {};
            if (n && i && !this.reportedAlertErrors[n]) {
                const a = Pt.ALERT_ERRORS[o];
                a && (vt.open(a, "error"), this.reportedAlertErrors[n] = !0);
            }
        }
        getAdapter(e) {
            if (e) return this.chainAdapters?.[e];
        }
        createAdapter(e) {
            if (!e) return;
            const s = e.namespace;
            if (!s) return;
            this.createClients();
            const n = e;
            n.namespace = s, n.construct({
                namespace: s,
                projectId: this.options?.projectId,
                networks: this.caipNetworks?.filter(({ chainNamespace: r })=>r === s)
            }), this.chainNamespaces.includes(s) || this.chainNamespaces.push(s), this.chainAdapters && (this.chainAdapters[s] = n);
        }
        async open(e) {
            await this.injectModalUi(), e?.uri && H.setUri(e.uri);
            const { isSwap: s, isSend: n } = this.toModalOptions();
            return s(e) ? ue.open({
                ...e,
                data: {
                    swap: e.arguments
                }
            }) : n(e) && e.arguments ? this.openSend(e.arguments) : ue.open(e);
        }
        async close() {
            await this.injectModalUi(), ue.close();
        }
        setLoading(e, s) {
            ue.setLoading(e, s);
        }
        async disconnect(e) {
            await H.disconnect({
                namespace: e
            });
        }
        getSIWX() {
            return _.state.siwx;
        }
        getError() {
            return "";
        }
        getChainId() {
            return p.state.activeCaipNetwork?.id;
        }
        async switchNetwork(e, { throwOnFailure: s = !1 } = {}) {
            const n = this.getCaipNetworks().find((r)=>r.id === e.id);
            if (!n) {
                vt.open(Pt.ALERT_ERRORS.SWITCH_NETWORK_NOT_FOUND, "error");
                return;
            }
            await p.switchActiveNetwork(n, {
                throwOnFailure: s
            });
        }
        getWalletProvider() {
            return p.state.activeChain ? xe.state.providers[p.state.activeChain] : null;
        }
        getWalletProviderType() {
            return xe.getProviderId(p.state.activeChain);
        }
        subscribeProviders(e) {
            return xe.subscribeProviders(e);
        }
        getThemeMode() {
            return It.state.themeMode;
        }
        getThemeVariables() {
            return It.state.themeVariables;
        }
        setThemeMode(e) {
            It.setThemeMode(e), Sa(It.state.themeMode);
        }
        setTermsConditionsUrl(e) {
            _.setTermsConditionsUrl(e);
        }
        setPrivacyPolicyUrl(e) {
            _.setPrivacyPolicyUrl(e);
        }
        setThemeVariables(e) {
            It.setThemeVariables(e), k1(It.state.themeVariables);
        }
        subscribeTheme(e) {
            return It.subscribe(e);
        }
        subscribeConnections(e) {
            return this.remoteFeatures.multiWallet ? H.subscribe(e) : (vt.open(S.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.DEFAULT, "info"), ()=>{});
        }
        getWalletInfo(e) {
            return e ? p.state.chains.get(e)?.accountState?.connectedWalletInfo : p.getAccountData()?.connectedWalletInfo;
        }
        getAccount(e) {
            const s = e || p.state.activeChain, n = L.getAuthConnector(s), r = p.getAccountData(s), i = $.getConnectedConnectorId(p.state.activeChain), o = H.getConnections(s);
            if (!s) throw new Error("AppKit:getAccount - namespace is required");
            const a = o.flatMap((c)=>c.accounts.map(({ address: l, type: d, publicKey: h })=>J.createAccount(s, l, d || "eoa", h)));
            if (r) return {
                allAccounts: a,
                caipAddress: r.caipAddress,
                address: J.getPlainAddress(r.caipAddress),
                isConnected: !!r.caipAddress,
                status: r.status,
                embeddedWalletInfo: n && i === S.CONNECTOR_ID.AUTH ? {
                    user: r.user ? {
                        ...r.user,
                        username: $.getConnectedSocialUsername()
                    } : void 0,
                    authProvider: r.socialProvider || "email",
                    accountType: Lt(s),
                    isSmartAccountDeployed: !!r.smartAccountDeployed
                } : void 0
            };
        }
        subscribeAccount(e, s) {
            const n = ()=>{
                const r = this.getAccount(s);
                r && e(r);
            };
            s ? p.subscribeChainProp("accountState", n, s) : p.subscribe(n), L.subscribe(n);
        }
        subscribeNetwork(e) {
            return p.subscribe(({ activeCaipNetwork: s })=>{
                e({
                    caipNetwork: s,
                    chainId: s?.id,
                    caipNetworkId: s?.caipNetworkId
                });
            });
        }
        subscribeWalletInfo(e, s) {
            return s ? p.subscribeChainProp("accountState", (n)=>e(n?.connectedWalletInfo), s) : p.subscribeChainProp("accountState", (n)=>e(n?.connectedWalletInfo));
        }
        subscribeShouldUpdateToAddress(e) {
            p.subscribeChainProp("accountState", (s)=>e(s?.shouldUpdateToAddress));
        }
        subscribeCaipNetworkChange(e) {
            p.subscribeKey("activeCaipNetwork", e);
        }
        getState() {
            return Es.state;
        }
        getRemoteFeatures() {
            return _.state.remoteFeatures;
        }
        subscribeState(e) {
            return Es.subscribe(e);
        }
        subscribeRemoteFeatures(e) {
            return _.subscribeKey("remoteFeatures", e);
        }
        showErrorMessage(e) {
            rs.showError(e);
        }
        showSuccessMessage(e) {
            rs.showSuccess(e);
        }
        getEvent() {
            return {
                ...le.state
            };
        }
        subscribeEvents(e) {
            return le.subscribe(e);
        }
        replace(e) {
            te.replace(e);
        }
        redirect(e) {
            te.push(e);
        }
        popTransactionStack(e) {
            te.popTransactionStack(e);
        }
        isOpen() {
            return ue.state.open;
        }
        isTransactionStackEmpty() {
            return te.state.transactionStack.length === 0;
        }
        static getInstance() {
            return this.instance;
        }
        updateFeatures(e) {
            _.setFeatures(e);
        }
        updateRemoteFeatures(e) {
            _.setRemoteFeatures(e);
        }
        updateOptions(e) {
            const n = {
                ..._.state || {},
                ...e
            };
            _.setOptions(n);
        }
        setConnectMethodsOrder(e) {
            _.setConnectMethodsOrder(e);
        }
        setWalletFeaturesOrder(e) {
            _.setWalletFeaturesOrder(e);
        }
        setCollapseWallets(e) {
            _.setCollapseWallets(e);
        }
        setSocialsOrder(e) {
            _.setSocialsOrder(e);
        }
        getConnectMethodsOrder() {
            return vr.getConnectOrderMethod(_.state.features, L.getConnectors());
        }
        addNetwork(e, s) {
            if (this.chainAdapters && !this.chainAdapters[e]) throw new Error(`Adapter for namespace ${e} doesn't exist`);
            const n = this.extendCaipNetwork(s, this.options);
            this.getCaipNetworks().find((r)=>r.id === n.id) || p.addNetwork(n);
        }
        removeNetwork(e, s) {
            if (this.chainAdapters && !this.chainAdapters[e]) throw new Error(`Adapter for namespace ${e} doesn't exist`);
            this.getCaipNetworks().find((r)=>r.id === s) && p.removeNetwork(e, s);
        }
    }
    let Sd = !1;
    class Lu extends M1 {
        async open(e) {
            L.isConnected() || await super.open(e);
        }
        async close() {
            if (await super.close(), this.options.manualWCControl) {
                const e = p.getAccountData(this.activeChainNamespace)?.address;
                H.finalizeWcConnection(e);
            }
        }
        async syncIdentity(e) {
            return Promise.resolve();
        }
        async syncBalance(e) {
            return Promise.resolve();
        }
        async injectModalUi() {
            if (!Sd && J.isClient()) {
                if (await _i(()=>import("./basic-NAOEwdJw.js"), __vite__mapDeps([3,4,1,2])), await _i(()=>import("./w3m-modal-BDhOjW1y.js"), __vite__mapDeps([5,4,1,2])), !document.querySelector("w3m-modal")) {
                    const s = document.createElement("w3m-modal");
                    !_.state.disableAppend && !_.state.enableEmbedded && document.body.insertAdjacentElement("beforeend", s);
                }
                Sd = !0;
            }
        }
    }
    const B1 = "1.8.7";
    function F1(t) {
        return new Lu({
            ...t,
            basic: !0,
            sdkVersion: `html-core-${B1}`
        });
    }
    CI = Object.freeze(Object.defineProperty({
        __proto__: null,
        AppKit: Lu,
        createAppKit: F1
    }, Symbol.toStringTag, {
        value: "Module"
    }));
});
export { gI as $, He as A, xa as B, Mn as C, bI as D, Zn as E, Ou as F, ni as G, Ye as H, jd as I, Lt as J, Ii as K, Hs as L, ue as M, Pd as N, _ as O, it as P, wI as Q, te as R, ns as S, It as T, Oe as U, yI as V, Cs as W, Je as X, Xe as Y, Na as Z, T1 as _, vt as a, Bt as a0, ee as b, yn as c, Ut as d, Bd as e, se as f, p as g, H as h, L as i, vi as j, S as k, me as l, ZA as m, J as n, Ks as o, le as p, cp as q, X as r, Q as s, rs as t, $ as u, Xp as v, vr as w, fI as x, CI as y, mI as z, __tla };
