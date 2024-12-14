import axios from "axios";
import { createDiscreteApi } from "naive-ui";
import router from "@/router";

const { message } = createDiscreteApi(["message"]);

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
});

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    if (error.status === 401) {
      message.error("登录状态已过期");
      router.push("/login");
      return;
    }
    return Promise.reject(error);
  }
);

export { request };
