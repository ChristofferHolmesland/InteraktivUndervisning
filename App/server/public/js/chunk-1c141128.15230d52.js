(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1c141128"],{8839:function(t,e,n){},a55b:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Buttons")},o=[],s=(n("cadf"),n("551c"),n("097d"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"buttons"}},[n("button",{attrs:{id:"anonymousButton"},on:{click:t.displayAnonymousText}},[t._v(t._s(t.text.anonymousText))]),n("button",{attrs:{id:"feideButton"},on:{click:t.displayFeideText}},[t._v("Feide")]),n("div",{staticClass:"textinformation"},t._l(t.getLoginTerms,function(e){return n("ul",{key:e},[n("li",[t._v(t._s(e))])])}),0),t.feideLogin?n("label",[n("input",{attrs:{type:"checkbox"},on:{click:t.termsStateChanged}}),t._v(t._s(t.text.acceptText))]):t._e(),n("form",{ref:"submitForm",attrs:{action:"/login/anonymous",method:"POST"}},[n("button",{attrs:{disabled:!t.termsApproved,type:"submit"}},[t._v(t._s(t.text.loginText))])])])}),u=[],a=n("56d7"),r={name:"Buttons",data:function(){return{feideLogin:!1,socket:a["dataBus"].socket,text:a["dataBus"].text.Buttons,termsApproved:!0,Login:!1}},methods:{displayAnonymousText:function(){this.termsApproved=!0,this.feideLogin=!1,this.socket.emit("loginRequest",{loginType:this.feideLogin})},displayFeideText:function(){this.termsApproved=!1,this.feideLogin=!0,this.socket.emit("loginRequest",{loginType:this.feideLogin})},termsStateChanged:function(){this.termsApproved=!this.termsApproved}},mounted:function(){var t=this;this.socket.on("loginResponse",function(e){t.$refs.submitForm.action=e.actionLink})},computed:{getLoginTerms:function(){return this.feideLogin?this.text.feideList:this.text.anonymousList}}},c=r,d=n("2877"),l=Object(d["a"])(c,s,u,!1,null,null,null);l.options.__file="Buttons.vue";var f=l.exports,m={name:"Login",data:function(){return{}},components:{Buttons:f}},p=m,h=(n("ab49"),Object(d["a"])(p,i,o,!1,null,"5f5b5b05",null));h.options.__file="Login.vue";e["default"]=h.exports},ab49:function(t,e,n){"use strict";var i=n("8839"),o=n.n(i);o.a}}]);
//# sourceMappingURL=chunk-1c141128.15230d52.js.map