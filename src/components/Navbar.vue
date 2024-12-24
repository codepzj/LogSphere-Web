<template>
  <div class="px-4 py-2">
    <n-grid
      x-gap="12"
      cols="10"
      item-responsive
      responsive="screen"
      class="flex items-center"
    >
      <n-gi span="6">
        <router-link :to="{ name: 'Home' }">
          <div class="flex items-center">
            <img src="/vite.svg" alt="Logsphere" />
            <span class="text-l font-bold ml-1.5">Logsphere</span>
          </div>
        </router-link>
      </n-gi>
      <n-gi span="4">
        <div class="flex justify-end items-center px-4">
          <div @click="changeTheme" class="mr-4">
            <Icon icon="proicons:dark-theme" class="size-6" />
          </div>
          <div v-if="Object.keys(userInfo).length">
            <n-dropdown :options="dropdownOptions" @select="handleSelect">
              <div class="flex items-center">
                <n-avatar :src="userInfo.avatar" round></n-avatar>&nbsp;
                <span>{{ userInfo.nickname }}</span>
              </div>
            </n-dropdown>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { darkTheme } from "naive-ui";
import { getUserInfo, UserClearStatus } from "@/api/userAPI";

// 声明event为changeTheme
const emit = defineEmits(["changeTheme"]);

const store = userStore();
const { userInfo } = storeToRefs(store);
const { setUserInfo } = store;

const message = useMessage();
const router = useRouter();
const theme = ref(null);

const dropdownOptions = [
  { label: "用户资料", key: "profile" },
  { label: "退出登录", key: "logout" },
];
const changeTheme = () => {
  theme.value = theme.value === null ? darkTheme : null;
  console.log(theme.value);

  emit("changeTheme", theme.value);
};
const clearLoginStatus = () => {
  setUserInfo({});
  UserClearStatus();
};

const handleSelect = key => {
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

// 多端同步用户数据
const updateUserInfo = async () => {
  const data = await getUserInfo(userInfo.value.account_id);
  store.setUserInfo(data.data);
};

onMounted(() => {
  updateUserInfo();
});
</script>

<style lang="scss"></style>
