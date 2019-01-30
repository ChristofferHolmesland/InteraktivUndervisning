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
      path: "/client/user-profile",
      name: "userProfile",
      component: () =>
        import("./views/UserProfile.vue")
    },
    {
      path: "/client/quiz/:quizCode",
      props: true,
      name: "clientQuiz",
      component: () =>
        import("./views/ClientQuiz.vue")
    },
    {
      path: "/admin",
      name: "admin",
      component: () =>
        import("./views/Admin.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import("./views/Login.vue")
    },
    {
      path: "/401",
      name: "401",
      component: () =>
        import("./views/fourZeroOne.vue")
    },
    {
      path: "*",
      name: "404",
      component: () =>
        import("./views/fourZeroFour.vue")
    },
  ]
});
