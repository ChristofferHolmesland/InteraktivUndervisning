import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import io from "socket.io-client";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

export const dataBus = new Vue();

dataBus.socket = io("localhost:80");
dataBus.locale = {};
dataBus.localeList = [];
dataBus.localeLoaded = false;

dataBus.socket.emit("getLocaleRequest", "no");

dataBus.socket.on("getLocaleResponse", function(data) {
	dataBus.locale = data.locale;
	dataBus.localeList = data.localeList;
	dataBus.localeLoaded = true;
	dataBus.$emit("localeLoaded");
});

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
