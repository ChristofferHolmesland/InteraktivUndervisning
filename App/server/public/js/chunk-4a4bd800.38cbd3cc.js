(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4a4bd800"],{4797:function(t,e,s){"use strict";var o=s("9bf3"),r=s.n(o);r.a},"90c9":function(t,e,s){"use strict";const o=s("f338");function r(t){if(t)return n(t)}function n(t){for(const e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},r.prototype.parse=function(t){return this._parser=t,this},r.prototype.responseType=function(t){return this._responseType=t,this},r.prototype.serialize=function(t){return this._serializer=t,this},r.prototype.timeout=function(t){if(!t||"object"!==typeof t)return this._timeout=t,this._responseTimeout=0,this;for(const e in t)switch(e){case"deadline":this._timeout=t.deadline;break;case"response":this._responseTimeout=t.response;break;default:console.warn("Unknown timeout option",e)}return this},r.prototype.retry=function(t,e){return 0!==arguments.length&&!0!==t||(t=1),t<=0&&(t=0),this._maxRetries=t,this._retries=0,this._retryCallback=e,this};const i=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];r.prototype._shouldRetry=function(t,e){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{const o=this._retryCallback(t,e);if(!0===o)return!0;if(!1===o)return!1}catch(s){console.error(s)}if(e&&e.status&&e.status>=500&&501!=e.status)return!0;if(t){if(t.code&&~i.indexOf(t.code))return!0;if(t.timeout&&"ECONNABORTED"==t.code)return!0;if(t.crossDomain)return!0}return!1},r.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},r.prototype.then=function(t,e){if(!this._fullfilledPromise){const t=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise((e,s)=>{t.on("error",s),t.on("abort",()=>{const t=new Error("Aborted");t.code="ABORTED",t.status=this.status,t.method=this.method,t.url=this.url,s(t)}),t.end((t,o)=>{t?s(t):e(o)})})}return this._fullfilledPromise.then(t,e)},r.prototype["catch"]=function(t){return this.then(void 0,t)},r.prototype.use=function(t){return t(this),this},r.prototype.ok=function(t){if("function"!==typeof t)throw Error("Callback required");return this._okCallback=t,this},r.prototype._isResponseOK=function(t){return!!t&&(this._okCallback?this._okCallback(t):t.status>=200&&t.status<300)},r.prototype.get=function(t){return this._header[t.toLowerCase()]},r.prototype.getHeader=r.prototype.get,r.prototype.set=function(t,e){if(o(t)){for(const e in t)this.set(e,t[e]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},r.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},r.prototype.field=function(t,e){if(null===t||void 0===t)throw new Error(".field(name, val) name can not be empty");if(this._data)throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");if(o(t)){for(const e in t)this.field(e,t[e]);return this}if(Array.isArray(e)){for(const s in e)this.field(t,e[s]);return this}if(null===e||void 0===e)throw new Error(".field(name, val) val can not be empty");return"boolean"===typeof e&&(e=""+e),this._getFormData().append(t,e),this},r.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},r.prototype._auth=function(t,e,s,o){switch(s.type){case"basic":this.set("Authorization",`Basic ${o(`${t}:${e}`)}`);break;case"auto":this.username=t,this.password=e;break;case"bearer":this.set("Authorization",`Bearer ${t}`);break}return this},r.prototype.withCredentials=function(t){return void 0==t&&(t=!0),this._withCredentials=t,this},r.prototype.redirects=function(t){return this._maxRedirects=t,this},r.prototype.maxResponseSize=function(t){if("number"!==typeof t)throw TypeError("Invalid argument");return this._maxResponseSize=t,this},r.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},r.prototype.send=function(t){const e=o(t);let s=this._header["content-type"];if(this._formData)throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");if(e&&!this._data)Array.isArray(t)?this._data=[]:this._isHost(t)||(this._data={});else if(t&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(e&&o(this._data))for(const o in t)this._data[o]=t[o];else"string"==typeof t?(s||this.type("form"),s=this._header["content-type"],this._data="application/x-www-form-urlencoded"==s?this._data?`${this._data}&${t}`:t:(this._data||"")+t):this._data=t;return!e||this._isHost(t)?this:(s||this.type("json"),this)},r.prototype.sortQuery=function(t){return this._sort="undefined"===typeof t||t,this},r.prototype._finalizeQueryString=function(){const t=this._query.join("&");if(t&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+t),this._query.length=0,this._sort){const t=this.url.indexOf("?");if(t>=0){const e=this.url.substring(t+1).split("&");"function"===typeof this._sort?e.sort(this._sort):e.sort(),this.url=this.url.substring(0,t)+"?"+e.join("&")}}},r.prototype._appendQueryString=(()=>{console.trace("Unsupported")}),r.prototype._timeoutError=function(t,e,s){if(this._aborted)return;const o=new Error(`${t+e}ms exceeded`);o.timeout=e,o.code="ECONNABORTED",o.errno=s,this.timedout=!0,this.abort(),this.callback(o)},r.prototype._setTimeouts=function(){const t=this;this._timeout&&!this._timer&&(this._timer=setTimeout(()=>{t._timeoutError("Timeout of ",t._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(()=>{t._timeoutError("Response timeout of ",t._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},"9bf3":function(t,e,s){},"9d96":function(t,e){function s(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(t=>{s.prototype[t]=function(...e){return this._defaults.push({fn:t,args:e}),this}}),s.prototype._setDefaults=function(t){this._defaults.forEach(e=>{t[e.fn].apply(t,e.args)})},t.exports=s},a079:function(t,e,s){"use strict";e.type=(t=>t.split(/ *; */).shift()),e.params=(t=>t.split(/ *; */).reduce((t,e)=>{const s=e.split(/ *= */),o=s.shift(),r=s.shift();return o&&r&&(t[o]=r),t},{})),e.parseLinks=(t=>t.split(/ *, */).reduce((t,e)=>{const s=e.split(/ *; */),o=s[0].slice(1,-1),r=s[1].split(/ *= */)[1].slice(1,-1);return t[r]=o,t},{})),e.cleanHeader=((t,e)=>{return delete t["content-type"],delete t["content-length"],delete t["transfer-encoding"],delete t["host"],e&&(delete t["authorization"],delete t["cookie"]),t})},a55b:function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("Buttons")},r=[],n=(s("cadf"),s("551c"),s("097d"),function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"buttons"}},[s("button",{attrs:{id:"anonymousButton"},on:{click:t.displayAnonymousText}},[t._v(t._s(t.text.anonymousText))]),s("button",{attrs:{id:"feideButton"},on:{click:t.displayFeideText}},[t._v("Feide")]),s("div",{staticClass:"textinformation"},t._l(t.getLoginTerms,function(e){return s("ul",{key:e},[s("li",[t._v(t._s(e))])])}),0),t.feideLogin?s("label",[s("input",{attrs:{type:"checkbox"},on:{click:t.termsStateChanged}}),t._v(t._s(t.text.acceptText))]):t._e(),s("form",{attrs:{action:"{{computedAction}}",method:"POST"}},[s("button",{attrs:{id:"loginButton",disabled:!t.termsApproved,type:"submit"}},[t._v(t._s(t.text.loginText))])])])}),i=[],a=s("56d7"),u=(s("db82"),{name:"Buttons",data:function(){return{feideLogin:!1,socket:a["dataBus"].socket,text:a["dataBus"].text.Buttons,termsApproved:!0,Login:!1,actionLink:""}},methods:{displayAnonymousText:function(){this.termsApproved=!0,this.feideLogin=!1,this.socket.emit("loginRequest",{loginType:this.feideLogin})},displayFeideText:function(){this.termsApproved=!1,this.feideLogin=!0,this.socket.emit("loginRequest",{loginType:this.feideLogin})},termsStateChanged:function(){this.termsApproved=!this.termsApproved}},mounted:function(){this.socket.on("loginResponse",function(t){console.log(this.actionLink),this.actionLink=t.actionLink,console.log(this.actionLink)})},computed:{getLoginTerms:function(){return this.feideLogin?this.text.feideList:this.text.anonymousList},computedAction:function(){return this.actionLink}}}),h=u,c=s("2877"),p=Object(c["a"])(h,n,i,!1,null,null,null);p.options.__file="Buttons.vue";var l=p.exports,d={name:"Login",data:function(){return{}},components:{Buttons:l}},f=d,y=(s("4797"),Object(c["a"])(f,o,r,!1,null,"166dbaf6",null));y.options.__file="Login.vue";e["default"]=y.exports},db82:function(t,e,s){let o;"undefined"!==typeof window?o=window:"undefined"!==typeof self?o=self:(console.warn("Using browser-only version of superagent in non-browser environment"),o=this);const r=s("7297"),n=s("90c9"),i=s("f338"),a=s("ff21"),u=s("9d96");function h(){}const c=e=t.exports=function(t,s){return"function"==typeof s?new e.Request("GET",t).end(s):1==arguments.length?new e.Request("GET",t):new e.Request(t,s)};e.Request=b,c.getXHR=(()=>{if(!(!o.XMLHttpRequest||o.location&&"file:"==o.location.protocol&&o.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}throw Error("Browser-only version of superagent could not find XHR")});const p="".trim?t=>t.trim():t=>t.replace(/(^\s*|\s*$)/g,"");function l(t){if(!i(t))return t;const e=[];for(const s in t)d(e,s,t[s]);return e.join("&")}function d(t,e,s){if(null!=s)if(Array.isArray(s))s.forEach(s=>{d(t,e,s)});else if(i(s))for(const o in s)d(t,`${e}[${o}]`,s[o]);else t.push(encodeURIComponent(e)+"="+encodeURIComponent(s));else null===s&&t.push(encodeURIComponent(e))}function f(t){const e={},s=t.split("&");let o,r;for(let n=0,i=s.length;n<i;++n)o=s[n],r=o.indexOf("="),-1==r?e[decodeURIComponent(o)]="":e[decodeURIComponent(o.slice(0,r))]=decodeURIComponent(o.slice(r+1));return e}function y(t){const e=t.split(/\r?\n/),s={};let o,r,n,i;for(let a=0,u=e.length;a<u;++a)r=e[a],o=r.indexOf(":"),-1!==o&&(n=r.slice(0,o).toLowerCase(),i=p(r.slice(o+1)),s[n]=i);return s}function m(t){return/[\/+]json($|[^-\w])/.test(t)}function _(t){this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||"undefined"===typeof this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;let e=this.xhr.status;1223===e&&(e=204),this._setStatusProperties(e),this.header=this.headers=y(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&t._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function b(t,e){const s=this;this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",()=>{let t,e=null,o=null;try{o=new _(s)}catch(r){return e=new Error("Parser is unable to parse the response"),e.parse=!0,e.original=r,s.xhr?(e.rawResponse="undefined"==typeof s.xhr.responseType?s.xhr.responseText:s.xhr.response,e.status=s.xhr.status?s.xhr.status:null,e.statusCode=e.status):(e.rawResponse=null,e.status=null),s.callback(e)}s.emit("response",o);try{s._isResponseOK(o)||(t=new Error(o.statusText||"Unsuccessful HTTP response"))}catch(n){t=n}t?(t.original=e,t.response=o,t.status=o.status,s.callback(t,o)):s.callback(null,o)})}function w(t,e,s){const o=c("DELETE",t);return"function"==typeof e&&(s=e,e=null),e&&o.send(e),s&&o.end(s),o}c.serializeObject=l,c.parseString=f,c.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},c.serialize={"application/x-www-form-urlencoded":l,"application/json":JSON.stringify},c.parse={"application/x-www-form-urlencoded":f,"application/json":JSON.parse},a(_.prototype),_.prototype._parseBody=function(t){let e=c.parse[this.type];return this.req._parser?this.req._parser(this,t):(!e&&m(this.type)&&(e=c.parse["application/json"]),e&&t&&(t.length||t instanceof Object)?e(t):null)},_.prototype.toError=function(){const t=this.req,e=t.method,s=t.url,o=`cannot ${e} ${s} (${this.status})`,r=new Error(o);return r.status=this.status,r.method=e,r.url=s,r},c.Response=_,r(b.prototype),n(b.prototype),b.prototype.type=function(t){return this.set("Content-Type",c.types[t]||t),this},b.prototype.accept=function(t){return this.set("Accept",c.types[t]||t),this},b.prototype.auth=function(t,e,s){1===arguments.length&&(e=""),"object"===typeof e&&null!==e&&(s=e,e=""),s||(s={type:"function"===typeof btoa?"basic":"auto"});const o=t=>{if("function"===typeof btoa)return btoa(t);throw new Error("Cannot use basic auth, btoa is not a function")};return this._auth(t,e,s,o)},b.prototype.query=function(t){return"string"!=typeof t&&(t=l(t)),t&&this._query.push(t),this},b.prototype.attach=function(t,e,s){if(e){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t,e,s||e.name)}return this},b.prototype._getFormData=function(){return this._formData||(this._formData=new o.FormData),this._formData},b.prototype.callback=function(t,e){if(this._shouldRetry(t,e))return this._retry();const s=this._callback;this.clearTimeout(),t&&(this._maxRetries&&(t.retries=this._retries-1),this.emit("error",t)),s(t,e)},b.prototype.crossDomainError=function(){const t=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain=!0,t.status=this.status,t.method=this.method,t.url=this.url,this.callback(t)},b.prototype.buffer=b.prototype.ca=b.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},b.prototype.pipe=b.prototype.write=(()=>{throw Error("Streaming is not supported in browser version of superagent")}),b.prototype._isHost=function(t){return t&&"object"===typeof t&&!Array.isArray(t)&&"[object Object]"!==Object.prototype.toString.call(t)},b.prototype.end=function(t){this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=t||h,this._finalizeQueryString(),this._end()},b.prototype._end=function(){if(this._aborted)return this.callback(Error("The request has been aborted even before .end() was called"));const t=this,e=this.xhr=c.getXHR();let s=this._formData||this._data;this._setTimeouts(),e.onreadystatechange=(()=>{const s=e.readyState;if(s>=2&&t._responseTimeoutTimer&&clearTimeout(t._responseTimeoutTimer),4!=s)return;let o;try{o=e.status}catch(r){o=0}if(!o){if(t.timedout||t._aborted)return;return t.crossDomainError()}t.emit("end")});const o=(e,s)=>{s.total>0&&(s.percent=s.loaded/s.total*100),s.direction=e,t.emit("progress",s)};if(this.hasListeners("progress"))try{e.onprogress=o.bind(null,"download"),e.upload&&(e.upload.onprogress=o.bind(null,"upload"))}catch(r){}try{this.username&&this.password?e.open(this.method,this.url,!0,this.username,this.password):e.open(this.method,this.url,!0)}catch(n){return this.callback(n)}if(this._withCredentials&&(e.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof s&&!this._isHost(s)){const t=this._header["content-type"];let e=this._serializer||c.serialize[t?t.split(";")[0]:""];!e&&m(t)&&(e=c.serialize["application/json"]),e&&(s=e(s))}for(const i in this.header)null!=this.header[i]&&this.header.hasOwnProperty(i)&&e.setRequestHeader(i,this.header[i]);this._responseType&&(e.responseType=this._responseType),this.emit("request",this),e.send("undefined"!==typeof s?s:null)},c.agent=(()=>new u),["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(t=>{u.prototype[t.toLowerCase()]=function(e,s){const o=new c.Request(t,e);return this._setDefaults(o),s&&o.end(s),o}}),u.prototype.del=u.prototype["delete"],c.get=((t,e,s)=>{const o=c("GET",t);return"function"==typeof e&&(s=e,e=null),e&&o.query(e),s&&o.end(s),o}),c.head=((t,e,s)=>{const o=c("HEAD",t);return"function"==typeof e&&(s=e,e=null),e&&o.query(e),s&&o.end(s),o}),c.options=((t,e,s)=>{const o=c("OPTIONS",t);return"function"==typeof e&&(s=e,e=null),e&&o.send(e),s&&o.end(s),o}),c["del"]=w,c["delete"]=w,c.patch=((t,e,s)=>{const o=c("PATCH",t);return"function"==typeof e&&(s=e,e=null),e&&o.send(e),s&&o.end(s),o}),c.post=((t,e,s)=>{const o=c("POST",t);return"function"==typeof e&&(s=e,e=null),e&&o.send(e),s&&o.end(s),o}),c.put=((t,e,s)=>{const o=c("PUT",t);return"function"==typeof e&&(s=e,e=null),e&&o.send(e),s&&o.end(s),o})},f338:function(t,e,s){"use strict";function o(t){return null!==t&&"object"===typeof t}t.exports=o},ff21:function(t,e,s){"use strict";const o=s("a079");function r(t){if(t)return n(t)}function n(t){for(const e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.get=function(t){return this.header[t.toLowerCase()]},r.prototype._setHeaderProperties=function(t){const e=t["content-type"]||"";this.type=o.type(e);const s=o.params(e);for(const o in s)this[o]=s[o];this.links={};try{t.link&&(this.links=o.parseLinks(t.link))}catch(r){}},r.prototype._setStatusProperties=function(t){const e=t/100|0;this.status=this.statusCode=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.redirect=3==e,this.clientError=4==e,this.serverError=5==e,this.error=(4==e||5==e)&&this.toError(),this.created=201==t,this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.forbidden=403==t,this.notFound=404==t,this.unprocessableEntity=422==t}}}]);
//# sourceMappingURL=chunk-4a4bd800.38cbd3cc.js.map