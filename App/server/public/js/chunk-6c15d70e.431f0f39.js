(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c15d70e"],{1354:function(t,o,n){"use strict";var e=n("281b"),i=n.n(e);i.a},"281b":function(t,o,n){},"7b94":function(t,o,n){"use strict";n.r(o);var e=function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",{staticClass:"Client"},[n("h1",[t._v("This is the client page")]),n("b-container",[n("b-row",[n("b-col",{attrs:{cols:"12",lg:"4"}},[n("JoinRoom")],1)],1)],1)],1)},i=[],c=(n("cadf"),n("551c"),n("097d"),n("56d7")),r=function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("b-container",{staticClass:"jumbotron",attrs:{id:"JoinRoom"}},[n("b-row",{attrs:{"align-h":"center"}},[n("b-col",{staticClass:"text-center mb-5",attrs:{cols:"12"}},[n("h1",[t._v("Quick join room!")])])],1),n("b-row",{attrs:{"align-h":"center"}},[n("b-col",{staticClass:"text-center mb-5",attrs:{cols:"12"}},[n("b-form-input",{attrs:{type:"text",placeholder:"Enter room id!"},model:{value:t.roomId,callback:function(o){t.roomId=o},expression:"roomId"}})],1)],1),n("b-row",{attrs:{"align-h":"center"}},[n("b-col",{staticClass:"text-center",attrs:{cols:"12"}},[n("b-button",{attrs:{size:"lg",variant:"primary"},on:{click:t.quickJoin}},[t._v("Join")])],1)],1)],1)},a=[],s={name:"joinRoom",data:function(){return{roomId:""}},methods:{quickJoin:function(){console.log("tried to quickjoin with this room ID: "+this.roomId)}}},l=s,u=n("2877"),m=Object(u["a"])(l,r,a,!1,null,null,null);m.options.__file="JoinRoom.vue";var b=m.exports,d={name:"client",data:function(){return{socket:c["dataBus"].socket}},components:{JoinRoom:b},created:function(){this.socket.emit("clientStarted")}},f=d,h=(n("1354"),Object(u["a"])(f,e,i,!1,null,"f031aaba",null));h.options.__file="Client.vue";o["default"]=h.exports}}]);