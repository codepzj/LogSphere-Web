<template>
  <n-grid
    x-gap="12"
    cols="10"
    item-responsive
    responsive="screen"
    class="flex items-center"
  >
    <n-gi span="0 s:2">
      <div class="flex items-center">
        <img src="/vite.svg" alt="Logsphere" /><span
          class="text-l font-bold ml-1.5"
          >Logsphere</span
        >
      </div>
    </n-gi>
    <n-gi span="10 s:6">
      <n-menu
        v-model:value="activeKey"
        mode="horizontal"
        :options="menuOptions"
        responsive
        default-size="0.8"
    /></n-gi>
    <n-gi span="0 s:2">
      <div class="flex justify-end px-4" v-if="Object.keys(userInfo).length">
        <n-dropdown :options="dropdownOptions" @select="handleSelect">
          <div class="flex items-center">
            <n-avatar :src="userInfo.avatar" round></n-avatar>&nbsp;
            <span>{{ userInfo.nickname }}</span>
          </div>
        </n-dropdown>
      </div>
    </n-gi>
  </n-grid>
</template>
<script>
import { defineComponent } from "vue";
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import { UserClearStatus } from "@/api/userAPI";
export default defineComponent({
  setup() {
    const store = userStore();
    const { userInfo } = storeToRefs(store);
    const { setUserInfo } = store;
    const message = useMessage();
    const router = useRouter();
    const menuOptions = [
      {
        label: () =>
          h(
            "a",
            {
              href: "/",
              target: "_self",
              rel: "noopenner noreferrer",
            },
            "首页"
          ),
      },
      {
        label: () =>
          h(
            "a",
            {
              href: "/dashboard",
              target: "_self",
              rel: "noopenner noreferrer",
            },
            "仪表盘"
          ),
      },
      {
        label: () =>
          h(
            "a",
            {
              href: "/test",
              target: "_self",
              rel: "noopenner noreferrer",
            },
            "测试页面"
          ),
      },
    ];
    const dropdownOptions = [
      {
        label: "用户资料",
        key: "profile",
      },
      {
        label: "退出登录",
        key: "logout",
      },
    ];
    const clearLoginStatus = () => {
      setUserInfo({});
      UserClearStatus();
    };
    const handleSelect = key => {
      console.log(key);

      switch (key) {
        case "profile":
          console.log("profile");
          router.push({ name: "Profile" });
          break;
        case "logout":
          console.log("logout");
          clearLoginStatus();
          message.info("退出登录");
          router.push({ name: "Login" });
          break;
      }
    };
    return {
      userInfo,
      setUserInfo,
      menuOptions,
      dropdownOptions,
      handleSelect,
    };
  },
});
</script>
<style lang="scss"></style>
