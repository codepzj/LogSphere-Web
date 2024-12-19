<template>
  <div>
    <n-menu
      :options="menuOptions"
      @update:value="handleUpdateValue"
      default-expand-all
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import { findProgramsByID } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());
const message = useMessage();

// 定义响应式变量
const menuOptions = ref([
  {
    label: "项目",
    key: "Program",
    children: [
      {
        label: () => h(RouterLink, { to: { name: "ProgramCreate" } }, { default: () => "创建项目" }),
        key: "ProgramCreate",
      },
      {
        label: () => h(RouterLink, { to: { name: "ProgramList" } }, { default: () => "项目列表" }),
        key: "ProgramList",
        children: [], // 这是一个子菜单，后面会根据项目数据动态更新
      },
    ],
  },
]);

// 获取项目数据并更新菜单
const getPrograms = async (id) => {
  const { data } = await findProgramsByID(id);
  const programLinks = data.map((program) => ({
    label: () => h(RouterLink, { to: { name: "Log", params: { websiteId: program.website_id } } }, { default: () => program.name }),
    key: program.website_id,
  }));

  // 动态更新 "ProgramList" 子菜单
  const programListMenu = menuOptions.value.find(item => item.key === "Program")?.children.find(item => item.key === "ProgramList");
  if (programListMenu) {
    programListMenu.children = programLinks; // 将项目数据添加为 ProgramList 的子菜单项
  }
};

// 组件挂载后获取数据
onMounted(() => {
  if (userInfo.value?.account_id) {
    getPrograms(userInfo.value.account_id);
  }
});

// 处理菜单项更新的回调
const handleUpdateValue = (key, item) => {
  message.info(`[onUpdate:value]: ${JSON.stringify(key)}`);
  message.info(`[onUpdate:value]: ${JSON.stringify(item)}`);
};
</script>