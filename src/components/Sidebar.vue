<template>
  <n-menu :options="menuOptions" default-expand-all />
</template>

<script setup>
import { onMounted } from "vue";

import { userStore } from "@/store/userStore";
import { programStore } from "@/store/programStore";

import { storeToRefs } from "pinia";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());
const { menuOptions } = storeToRefs(programStore());

// 组件挂载后获取数据
onMounted(() => {
  if (userInfo.value?.account_id) {
    programStore().getChildPrograms(userInfo.value.account_id);
  }
});
</script>
