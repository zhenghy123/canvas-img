import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
  path: "/",
  name: "ImgCropper",
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/ImgCropper.vue")
}];

const router = new VueRouter({
  routes
});

export default router;