(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[935],{6677:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/exam/[id]",function(){return n(5149)}])},648:function(e,t,n){"use strict";n.d(t,{YR:function(){return l},qz:function(){return x},DT:function(){return o},TW:function(){return m},qE:function(){return h},Ch:function(){return j},Ow:function(){return w},Wc:function(){return p},dB:function(){return f}});var a=n(6154),r=n(5885),i=n(3454);let s=new r.Z,c=a.Z.create({baseURL:"https://test.tuanm.dev/v1/api",headers:{"X-Api-Key":i.env.SERVER_API_KEY}}),u=a.Z.create({baseURL:"https://test.tuanm.dev/v1/api"});u.interceptors.request.use(e=>{let t=s.get("token");return t&&(e.headers.Authorization="Bearer ".concat(t)),e});var d={private:c,default:{...u,clearToken:()=>{s.remove("token")}}};async function l(e,t){let{token:n}=(await d.default.post("/authenticate",{username:e,password:t})).data||{};return n&&s.set("token",n),!!n}async function o(e,t,n){let a=new FormData;for(let r of(a.append("audio",t),a.append("subscription",e),n))a.append(r.skill,new Blob([JSON.stringify(r)],{type:"application/json"}));return(await d.default.put("/test/new",a,{headers:{Authorization:d.default.defaults.headers.Authorization,"Content-Type":"multipart/form-data"}})).data}async function h(){return(await d.default.get("/users")).data}function x(){d.default.clearToken()}async function f(e){return(await d.default.get("/exam/".concat(e,"/test/writing"))).data}async function m(e,t){await d.default.post("/exam/".concat(e,"/evaluate/writing"),{point:t})}async function j(e){return(await d.default.get("/exam/".concat(e,"/result"))).data}async function p(e){return(await d.default.get("/exam/".concat(e,"/answer/writing"))).data}async function w(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return(await d.default.get("/exam/not-graded?page=".concat(e,"&size=").concat(t))).data}},5149:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return c}});var a=n(5893),r=n(648),i=n(1163),s=n(7294);function c(){var e,t,n,c;let u=(0,i.useRouter)(),[d,l]=(0,s.useState)(),[o,h]=(0,s.useState)();(0,s.useEffect)(()=>{let{id:e}=u.query||{},t=Number(e);t&&(l(t),(0,r.Ch)(t).then(h).catch(e=>{alert(e.message),u.back()}))},[u]);let x=()=>{alert("Not implemented yet!")},f={border:"solid 1px black"};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("h1",{children:["Exam #",d]}),o&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h2",{children:"Examinee"}),(0,a.jsxs)("table",{style:f,children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Username"}),(0,a.jsx)("td",{children:o.examinee.username})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Full Name"}),(0,a.jsx)("td",{children:"".concat(null===(e=o.examinee)||void 0===e?void 0:e.firstName," ").concat(null===(t=o.examinee)||void 0===t?void 0:t.lastName)})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Email"}),(0,a.jsx)("td",{children:null===(n=o.examinee)||void 0===n?void 0:n.email})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Phone Number"}),(0,a.jsx)("td",{children:null===(c=o.examinee)||void 0===c?void 0:c.phoneNumber})]})]}),(0,a.jsx)("h2",{children:"Result"}),(0,a.jsxs)("table",{style:f,children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Reading"}),(0,a.jsx)("td",{children:o.reading})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Listening"}),(0,a.jsx)("td",{children:o.listening})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Writing"}),(0,a.jsx)("td",{children:o.writing})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Examiner"}),(0,a.jsx)("td",{children:o.examiner})]})]}),(0,a.jsx)("hr",{}),(0,a.jsx)("button",{onClick:x,children:"Save"})]})]})}}},function(e){e.O(0,[774,7,888,179],function(){return e(e.s=6677)}),_N_E=e.O()}]);