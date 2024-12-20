import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home/index.vue";
import Login from "@/views/User/login.vue";
import Register from "@/views/User/register.vue";
import Profile from "@/views/User/profile.vue";
import Test from "@/views/Test/index.vue";
import Program from "@/views/Program/list.vue";
import ProgramCreate from "@/views/Program/create.vue";
import ProgramDetail from "@/views/Program/detail.vue";
import Log from "@/views/Program/Detail/log.vue";
import { userStore } from "@/store/userStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/program",
    name: "Program",
    component: Program,
  },
  {
    path: "/program/create",
    name: "ProgramCreate",
    component: ProgramCreate,
  },
  {
    path: "/program/detail",
    name: "ProgramDetail",
    component: ProgramDetail,
    children: [
      {
        path: "log/:websiteId",
        name: "Log",
        component: Log,
      },
      {
        path: "script/:websiteId",
        name: "Script",
        component: () => import("@/views/Program/Detail/script.vue"),
      },
      {
        path: "analyse/:websiteId",
        name: "Analyse",
        component: () => import("@/views/Program/Detail/analyse.vue"),
      },
    ],
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      NotSidebar: true, // 登录页面不显示侧边栏
      NotNavbar: true, // 登录页面不显示导航栏
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      NotSidebar: true, // 登录页面不显示侧边栏
      NotNavbar: true, // 登录页面不显示导航栏
    },
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
