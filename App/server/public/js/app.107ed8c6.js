(function(e){function t(t){for(var r,o,s=t[0],c=t[1],u=t[2],i=0,d=[];i<s.length;i++)o=s[i],a[o]&&d.push(a[o][0]),a[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);p&&p(t);while(d.length)d.shift()();return l.push.apply(l,u||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],r=!0,o=1;o<n.length;o++){var s=n[o];0!==a[s]&&(r=!1)}r&&(l.splice(t--,1),e=c(c.s=n[0]))}return e}var r={},o={app:0},a={app:0},l=[];function s(e){return c.p+"js/"+({}[e]||e)+"."+{"chunk-0fa64a8d":"fc2d7a35","chunk-2d0e95df":"e4659b0a","chunk-78369a40":"5846f8d5","chunk-7b4939be":"e0a87380"}[e]+".js"}function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n={"chunk-0fa64a8d":1,"chunk-78369a40":1,"chunk-7b4939be":1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise(function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-0fa64a8d":"591aa189","chunk-2d0e95df":"31d6cfe0","chunk-78369a40":"07874014","chunk-7b4939be":"591aa189"}[e]+".css",a=c.p+r,l=document.getElementsByTagName("link"),s=0;s<l.length;s++){var u=l[s],i=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(i===r||i===a))return t()}var d=document.getElementsByTagName("style");for(s=0;s<d.length;s++){u=d[s],i=u.getAttribute("data-href");if(i===r||i===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||a,l=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");l.request=r,delete o[e],p.parentNode.removeChild(p),n(l)},p.href=a;var f=document.getElementsByTagName("head")[0];f.appendChild(p)}).then(function(){o[e]=0}));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var l=new Promise(function(t,n){r=a[e]=[t,n]});t.push(r[2]=l);var u,i=document.createElement("script");i.charset="utf-8",i.timeout=120,c.nc&&i.setAttribute("nonce",c.nc),i.src=s(e),u=function(t){i.onerror=i.onload=null,clearTimeout(d);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src,l=new Error("Loading chunk "+e+" failed.\n("+r+": "+o+")");l.type=r,l.request=o,n[1](l)}a[e]=void 0}};var d=setTimeout(function(){u({type:"timeout",target:i})},12e4);i.onerror=i.onload=u,document.head.appendChild(i)}return Promise.all(t)},c.m=e,c.c=r,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t){return e[t]}.bind(null,r));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],i=u.push.bind(u);u.push=t,u=u.slice();for(var d=0;d<u.length;d++)t(u[d]);var p=i;l.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},1:function(e,t){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var r=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[e.localeLoaded?n("div",[n("b-navbar",{attrs:{toggleable:"md",type:"dark",variant:"info"}},[n("b-navbar-toggle",{attrs:{target:"nav_collapse"}}),n("b-navbar-brand",{attrs:{href:"#"}},[e._v("Interaktiv Undervisning")]),n("b-collapse",{attrs:{"is-nav":"",id:"nav_collapse"}},[n("b-navbar-nav",[n("b-nav-item",{attrs:{href:"#"}},[e._v("Link")]),n("b-nav-item",{attrs:{href:"#",disabled:""}},[e._v("Disabled")])],1),n("b-navbar-nav",{staticClass:"ml-auto"},[n("b-nav-item-dropdown",{attrs:{text:e.locale.lang,right:""}},e._l(e.localeList,function(t){return n("b-dropdown-item-button",{key:t,attrs:{id:t,value:"{{localeItem}}"},on:{click:e.localeChange},model:{value:e.selectLocale,callback:function(t){e.selectLocale=t},expression:"selectLocale"}},[e._v(e._s(t))])}),1),e.loggedIn?n("b-nav-item-dropdown",{attrs:{right:""}},[n("template",{slot:"button-content"},[n("em",[e._v(e._s(e.locale.user))])]),n("b-dropdown-item",{attrs:{href:"#"}},[e._v(e._s(e.locale.profile))]),n("b-dropdown-item",{attrs:{href:"#"}},[e._v(e._s(e.locale.signOut))])],2):e._e(),e.loggedIn?e._e():n("b-nav-item",{on:{click:e.signInRedirect}},[e._v(e._s(e.locale.signIn))])],1)],1)],1),n("router-view")],1):n("div")])},a=[],l={name:"App",data:function(){return{localeLoaded:!1,locale:O.locale["App"],localeList:O.localeList,socket:O.socket,selectLocale:"",user:{username:String,loggedIn:Boolean},test:!1}},created:function(){},mounted:function(){var e=this;O.$on("localeLoaded",function(){e.locale=O.locale["App"],e.localeList=O.localeList,e.localeLoaded=!0})},methods:{localeChange:function(e){this.socket.emit("getTextRequest",e.path[0].id)},signInRedirect:function(){this.$router.push("/login")}}},s=l,c=n("2877"),u=Object(c["a"])(s,o,a,!1,null,null,null);u.options.__file="App.vue";var i=u.exports,d=n("8c4f"),p=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home"},[r("img",{attrs:{alt:"Vue logo",src:n("cf05")}}),r("HelloWorld",{attrs:{msg:"Welcome to Your Vue.js App"}})],1)},f=[],v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"hello"},[n("h1",[e._v(e._s(e.msg))]),e._m(0),n("h3",[e._v("Installed CLI Plugins")]),e._m(1),n("h3",[e._v("Essential Links")]),e._m(2),n("h3",[e._v("Ecosystem")]),e._m(3)])},h=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",[e._v("\n    For a guide and recipes on how to configure / customize this project,"),n("br"),e._v("\n    check out the\n    "),n("a",{attrs:{href:"https://cli.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("vue-cli documentation")]),e._v(".\n  ")])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ul",[n("li",[n("a",{attrs:{href:"https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel",target:"_blank",rel:"noopener"}},[e._v("babel")])]),n("li",[n("a",{attrs:{href:"https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint",target:"_blank",rel:"noopener"}},[e._v("eslint")])])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ul",[n("li",[n("a",{attrs:{href:"https://vuejs.org",target:"_blank",rel:"noopener"}},[e._v("Core Docs")])]),n("li",[n("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("Forum")])]),n("li",[n("a",{attrs:{href:"https://chat.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("Community Chat")])]),n("li",[n("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank",rel:"noopener"}},[e._v("Twitter")])]),n("li",[n("a",{attrs:{href:"https://news.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("News")])])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ul",[n("li",[n("a",{attrs:{href:"https://router.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("vue-router")])]),n("li",[n("a",{attrs:{href:"https://vuex.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("vuex")])]),n("li",[n("a",{attrs:{href:"https://github.com/vuejs/vue-devtools#vue-devtools",target:"_blank",rel:"noopener"}},[e._v("vue-devtools")])]),n("li",[n("a",{attrs:{href:"https://vue-loader.vuejs.org",target:"_blank",rel:"noopener"}},[e._v("vue-loader")])]),n("li",[n("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank",rel:"noopener"}},[e._v("awesome-vue")])])])}],g={name:"HelloWorld",props:{msg:String}},m=g,b=(n("ac44"),Object(c["a"])(m,v,h,!1,null,"078f8618",null));b.options.__file="HelloWorld.vue";var _=b.exports,k={name:"home",components:{HelloWorld:_}},y=k,w=Object(c["a"])(y,p,f,!1,null,null,null);w.options.__file="Home.vue";var j=w.exports;r["a"].use(d["a"]);var L=new d["a"]({mode:"history",base:"/",routes:[{path:"/",name:"home",component:j},{path:"/client",name:"client",component:function(){return n.e("chunk-0fa64a8d").then(n.bind(null,"7b94"))}},{path:"/host",name:"host",component:function(){return n.e("chunk-7b4939be").then(n.bind(null,"fab8"))}},{path:"/login",name:"login",component:function(){return n.e("chunk-78369a40").then(n.bind(null,"a55b"))}},{path:"*",name:"404",component:function(){return n.e("chunk-2d0e95df").then(n.bind(null,"8cdb"))}}]}),x=n("9f7b"),E=(n("f9e3"),n("2dd8"),n("8055")),C=n.n(E);n.d(t,"dataBus",function(){return O}),r["a"].use(x["a"]),r["a"].config.productionTip=!1;var O=new r["a"];O.socket=C()("localhost:80"),O.locale={},O.localeList=[],O.localeLoaded=!1,O.socket.emit("getTextRequest","no"),O.socket.on("getTextResponse",function(e){O.locale=e.locale,O.localeList=e.localeList,O.localeLoaded=!0,O.$emit("localeLoaded")}),new r["a"]({router:L,render:function(e){return e(i)}}).$mount("#app")},ac44:function(e,t,n){"use strict";var r=n("fd32"),o=n.n(r);o.a},cf05:function(e,t,n){e.exports=n.p+"img/logo.82b9c7a5.png"},fd32:function(e,t,n){}});
//# sourceMappingURL=app.107ed8c6.js.map