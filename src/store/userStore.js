import { defineStore } from "pinia";

const userStore = defineStore(
  "useUserStore",
  () => {
    const userInfo = ref({});
    // 判断用户是否登录
    const isLogin = computed(() => Object.keys(userInfo.value).length !== 0);
    const setUserProfile = ({ nickname, role, avatar }) => {
      userInfo.value = { ...userInfo.value, nickname, role, avatar };
    };
    const setUserInfo = info => {
      userInfo.value = info;
    };

    return {
      userInfo,
      isLogin,
      setUserProfile,
      setUserInfo,
    };
  },
  {
    persist: true,
  }
);

export { userStore };
