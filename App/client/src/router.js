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
      component: () =>
        import("./views/Client.vue")
    },
    {
      path: "/host",
      name: "host",
      component: () =>
        import("./views/Host.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import("./views/Login.vue")
    },
    {
      path: "*",
      name: "404",
      component: () =>
        import("./views/404.vue")
    }
  ]
});
