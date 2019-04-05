import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path: "/client",
			name: "client",
			component: () => import("./views/Client.vue")
		},
		{
			path: "/client/sandbox",
			name: "clientSandbox",
			component: () => import("./views/Sandbox.vue")
		},
		{
			path: "/client/session/:sessionCode",
			props: true,
			name: "clientSession",
			component: () => import("./views/ClientSession.vue")
		},
		{
			path: "/admin",
			name: "admin",
			component: () => import("./views/Admin.vue"),
			alias: ["/admin/session", "/admin/questions", "/admin/sessions"]
		},
		{
			path: "/login",
			name: "login",
			component: () => import("./views/Login.vue")
		},
		{
			path: "/admin/session/:sessionId",
			name: "session",
			props: true,
			component: () => import("./views/Session.vue")
		},
		{
			path: "/client/user-profile",
			name: "userProfile",
			component: () => import("./views/UserProfile.vue")
		},
		{
			path: "/401",
			name: "401",
			component: () => import("./views/fourZeroOne.vue")
		},
		{
			path: "*",
			name: "404",
			component: () => import("./views/fourZeroFour.vue")
		}
	]
});
