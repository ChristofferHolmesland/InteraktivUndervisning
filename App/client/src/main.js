import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSocketIO from "vue-socket.io";

// TODO make a solution based on env file
let connection = ["http://192.168.137.1:8081", "http://localhost:8081", "https://interaktivundervisning.ux.uis.no"]

Vue.use(BootstrapVue);
Vue.use(
	new VueSocketIO({
		debug: process.env.NODE_ENV === "production" ? false : true,
		connection: connection[1],
		vuex: {
			store
		}
	})
);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount("#app");
