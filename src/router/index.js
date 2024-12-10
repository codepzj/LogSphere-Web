import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/Home/index.vue';
import Login from '@/views/Login/login.vue'
import Register from "@/views/Login/register.vue";
import Test from "@/views/Test/index.vue"
import Dashboard from "@/views/Dashboard/index.vue"


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
    path: "/test",
    name: "Test",
    component: Test,
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
