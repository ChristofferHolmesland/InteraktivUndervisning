(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7b4939be"],{"190d":function(t,e,s){"use strict";var n=s("e82d"),o=s.n(n);o.a},e82d:function(t,e,s){},fab8:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"host"},[s("h1",[t._v("This is the host page")]),s("p",[t._v("Connected to the server via socket.io and sent message back. Recieved this message: "+t._s(t.msg))])])},o=[],c=(s("cadf"),s("551c"),s("097d"),s("8055"),s("56d7")),i={name:"Host",data:function(){return{msg:"",socket:c["dataBus"].socket}},created:function(){this.socket.emit("hostStarted")},mounted:function(){var t=this;this.socket.on("hostResponse",function(){t.msg="socket io connection working",t.socket.emit("hostRequest","Client connected")})}},a=i,u=(s("190d"),s("2877")),d=Object(u["a"])(a,n,o,!1,null,"02017794",null);d.options.__file="Host.vue";e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-7b4939be.e0a87380.js.map