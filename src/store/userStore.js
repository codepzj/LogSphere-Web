import { defineStore } from "pinia";

const userStore = defineStore(
  "useUserStore",
  () => {
    const userInfo = ref({});
    // 判断用户是否登录
    const isLogin = computed(() => Object.keys(userInfo.value).length !== 0);
    const setUserAvatar = (avatarPath) => {
      userInfo.value.avatar = avatarPath
    }
    const setUserInfo = info => {
      userInfo.value = info;
    };

    return {
      userInfo,
      isLogin,
      setUserAvatar,
      setUserInfo,
    };
  },
  {
    persist: true,
  }
);

export { userStore };
