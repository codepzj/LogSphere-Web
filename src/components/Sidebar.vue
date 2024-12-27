<template>
  <n-menu
    ref="menuRef"
    :options="menuOptions"
    v-model:value="selectedKey"
    :accordion="true"
    default-expand-all
  />
</template>

<script setup>
import { onMounted } from "vue";

import { userStore } from "@/store/userStore";
import { programStore } from "@/store/programStore";

import { storeToRefs } from "pinia";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());
const { menuRef, selectedKey, menuOptions } = storeToRefs(programStore());

// 组件挂载后获取数据
onMounted(async () => {
  if (userInfo.value?.account_id) {
    await programStore().getChildPrograms(userInfo.value.account_id);
  }
});
</script>
