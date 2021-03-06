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
let connections = [
	"http://localhost:8082",
	"http://localhost:8081",
	"http://localhost:8083",
	"https://interaktivundervisning.ux.uis.no"
];
let connection = "";
switch (process.env.NODE_ENV) {
	case "test":
		connection = connections[0];
		break;
	case "dev":
		connection = connections[1];
		break;
	case "production":
		connection = connections[2];
		break;
	case "unix-production":
		connection = connections[3];
		break;
}

Vue.use(BootstrapVue);

let debugStatus = true;
let debugOptions = {
	production: false,
	"unix-production": false
};

if (debugOptions.hasOwnProperty(process.env.NODE_ENV)) {
	debugStatus = debugOptions[process.env.NODE_ENV];
}

Vue.use(
	new VueSocketIO({
		debug: debugStatus,
		connection: connection,
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
