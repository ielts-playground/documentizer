(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[411],{5499:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/review",function(){return n(9968)}])},648:function(e,t,n){"use strict";n.d(t,{YR:function(){return l},qz:function(){return h},DT:function(){return d},TW:function(){return m},qE:function(){return f},Ch:function(){return w},Ow:function(){return x},Wc:function(){return _},dB:function(){return p}});var a=n(6154),s=n(5885),r=n(3454);let c=new s.Z,o=a.Z.create({baseURL:"https://server.ietlsmastersource.com/v1/api",headers:{"X-Api-Key":r.env.SERVER_API_KEY}}),i=a.Z.create({baseURL:"https://server.ietlsmastersource.com/v1/api"});i.interceptors.request.use(e=>{let t=c.get("token");return t&&(e.headers.Authorization="Bearer ".concat(t)),e});var u={private:o,default:{...i,clearToken:()=>{c.remove("token")}}};async function l(e,t){let{token:n}=(await u.default.post("/authenticate",{username:e,password:t})).data||{};return n&&c.set("token",n),!!n}async function d(e,t,n){let a=new FormData;for(let s of(a.append("audio",t),a.append("subscription",e),n))a.append(s.skill,new Blob([JSON.stringify(s)],{type:"application/json"}));return(await u.default.put("/test/new",a,{headers:{Authorization:u.default.defaults.headers.Authorization,"Content-Type":"multipart/form-data"}})).data}async function f(){return(await u.default.get("/users")).data}function h(){u.default.clearToken()}async function p(e){return(await u.default.get("/exam/".concat(e,"/test/writing"))).data}async function m(e,t){await u.default.post("/exam/".concat(e,"/evaluate/writing"),{point:t})}async function w(e){return(await u.default.get("/exam/".concat(e,"/result"))).data}async function _(e){return(await u.default.get("/exam/".concat(e,"/answer/writing"))).data}async function x(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return(await u.default.get("/exam/not-graded?page=".concat(e,"&size=").concat(t))).data}},2213:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var a=n(5893),s=n(648),r=n(1163),c=n(7294),o=n(8747),i=n.n(o);function u(e){let t=(0,r.useRouter)(),[n,o]=(0,c.useState)(!0);return(0,c.useEffect)(()=>{let n=encodeURIComponent(window.location.pathname);(0,s.qE)().then(n=>{e.successUrl&&t.push(e.successUrl),o(!1),e.onSuccess&&e.onSuccess(n)}).catch(()=>{var a;t.push("".concat(null!==(a=e.fallbackUrl)&&void 0!==a?a:"/log-in","?redirect=").concat(n))})}),(0,a.jsx)(a.Fragment,{children:n&&(0,a.jsx)("div",{className:i().container})})}},9968:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return l}});var a=n(5893),s=n(648),r=n(1163),c=n(7294),o=n(6918),i=n.n(o),u=n(2213);function l(){let e=(0,r.useRouter)(),[t,n]=(0,c.useState)(void 0),[o,l]=(0,c.useState)(1),[d,f]=(0,c.useState)(20),[h,p]=(0,c.useState)(!1);(0,c.useEffect)(()=>{h&&(0,s.Ow)(o-1,d).then(e=>{n(e)}).catch(()=>{})},[o,h]);let m=()=>{l(e=>Math.max(e-1,1))},w=()=>{let e=Math.ceil((null==t?void 0:t.total)/d),a=Math.min(o+1,e);(0,s.Ow)(a-1,d).then(e=>{n(e),l(a)}).catch(()=>{})},_=t=>{e.push("/review/writing/".concat(t))};return(0,a.jsxs)("div",{className:i().container,children:[(0,a.jsx)(u.Z,{onSuccess:()=>p(!0)}),(0,a.jsxs)("span",{className:i().header,children:[(0,a.jsx)("h2",{children:"LIST OF EXAMS"}),(0,a.jsx)("h2",{className:i().home,onClick:()=>{e.push("/home")},children:"HOME"})]}),(0,a.jsx)("span",{className:i().list,children:(0,a.jsx)("span",{children:(()=>{let e=(null==t?void 0:t.examIds)||[];return e.map(e=>(0,a.jsxs)("h3",{className:i().option,onClick:()=>_(e.examId),children:["#",e.examId," of ",e.userName]},e.examId))})()})}),(0,a.jsx)("span",{className:i().footer,children:(()=>{let e=Math.ceil((null==t?void 0:t.total)/d);return(0,a.jsxs)("div",{children:[(0,a.jsx)("button",{disabled:1===o,onClick:m,children:"Previous"}),(0,a.jsxs)("span",{children:["Page ",o," of ",e]}),(0,a.jsx)("button",{disabled:o===e,onClick:w,children:"Next"})]})})()})]})}},8747:function(e){e.exports={container:"styles_container__dVA4Z"}},6918:function(e){e.exports={container:"styles_container__JCO64",header:"styles_header__4fUwb",home:"styles_home__GpKeE",option:"styles_option__76BR8",footer:"styles_footer__w63cs"}}},function(e){e.O(0,[7,774,888,179],function(){return e(e.s=5499)}),_N_E=e.O()}]);