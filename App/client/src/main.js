import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import io from "socket.io-client";

Vue.config.productionTip = false;

export const dataBus = new Vue();
dataBus.socket = io("localhost:3000");

dataBus.socket.emit("getTextRequest", {lan: "no"});

dataBus.socket.on("getTextResponse", (data) => {
  dataBus.text = data;
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
