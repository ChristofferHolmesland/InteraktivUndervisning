(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9da1e07a"],{"4dd8":function(t,e,s){},aa70:function(t,e,s){"use strict";var n=s("4dd8"),o=s.n(n);o.a},fab8:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"host"},[s("h1",[t._v("This is the host page")]),s("p",[t._v("Connected to the server via socket.io and sent message back. Recieved this message: "+t._s(t.msg))])])},o=[],c=(s("cadf"),s("551c"),s("097d"),s("8055"),s("56d7")),a={name:"Host",data:function(){return{msg:"",socket:c["dataBus"].socket}},created:function(){this.socket.emit("hostStarted")},mounted:function(){var t=this;this.socket.on("hostResponse",function(){t.msg="socket io connection working",t.socket.emit("hostRequest","Client connected")})}},i=a,d=(s("aa70"),s("2877")),u=Object(d["a"])(i,n,o,!1,null,"5986c26a",null);u.options.__file="Host.vue";e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-9da1e07a.bc77e3cb.js.map