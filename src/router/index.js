import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home/index.vue";
import Login from "@/views/User/login.vue";
import Register from "@/views/User/register.vue";
import Profile from "@/views/User/profile.vue";
import Test from "@/views/Test/index.vue";
import Dashboard from "@/views/Dashboard/index.vue";
import { userStore } from "@/store/userStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLogin } = userStore();

  const nextRoute = ["Login", "Register"];

  if (nextRoute.indexOf(to.name) >= 0) {
    next();
    return;
  }

  // 前往的不是登录注册页面
  if (!isLogin) {
    if (to.name === "Login") {
      // 避免跳转登录页循环重定向
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});
export default router;
