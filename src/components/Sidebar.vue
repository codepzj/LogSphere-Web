<template>
  <n-menu :options="menuOptions" default-expand-all />
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { useMessage, NIcon } from "naive-ui";
import { RouterLink } from "vue-router";
import { findProgramsByID } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());
const message = useMessage();
// 定义响应式变量
const menuOptions = ref([
  {
    label: () =>
      h(RouterLink, { to: { name: "Home" } }, { default: () => "首页" }),
    key: "Home",
    icon: renderIcon("meteor-icons:home"),
  },
  {
    label: "项目",
    key: "Program",
    icon: renderIcon("solar:programming-linear"),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            { to: { name: "ProgramCreate" } },
            { default: () => "创建项目" }
          ),
        key: "ProgramCreate",
        icon: renderIcon("formkit:add"),
      },
      // 这个子菜单项会被动态填充
      {
        label: () =>
          h(
            RouterLink,
            { to: { name: "Program" } },
            { default: () => "项目列表" }
          ),
        key: "ProgramList",
        children: [], // 这里会根据项目数据动态填充子菜单
        // 设置展开属性
        expand: false, // 确保 Program 菜单项本身是可展开的
        icon: renderIcon("icon-park-outline:list"),
      },
    ],
  },
]);

function renderIcon(name) {
  return () => h(Icon, { icon: name });
}

// 获取项目数据并更新菜单
const getPrograms = async id => {
  try {
    const { data } = await findProgramsByID(id);
    const programLinks = data.map(program => ({
      label: program.name, // 以项目名称为菜单项的标题
      key: program.website_id,
      icon: renderIcon("mdi:web"),
      children: [
        // 每个项目下面有两个子菜单
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "Analyse",
                  params: { websiteId: program.website_id },
                },
              },
              { default: () => "分析" }
            ),
          key: `${program.website_id}_Analyse`,
          icon: renderIcon("bx:analyse"),
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "Script",
                  params: { websiteId: program.website_id },
                },
              },
              { default: () => "脚本" }
            ),
          icon: renderIcon("carbon:script"),
          key: `${program.website_id}_Script`,
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: { name: "Log", params: { websiteId: program.website_id } },
              },
              { default: () => "日志" }
            ),
          icon: renderIcon("icon-park-outline:log"),
          key: `${program.website_id}_Log`,
        },
      ],
    }));

    // 动态更新 "ProgramList" 子菜单
    const programListMenu = menuOptions.value
      .find(item => item.key === "Program")
      ?.children.find(item => item.key === "ProgramList");
    if (programListMenu) {
      programListMenu.children = programLinks; // 将项目数据添加为 ProgramList 的子菜单项
    }
  } catch (error) {
    message.error("获取项目数据失败");
    console.error(error);
  }
};

// 组件挂载后获取数据
onMounted(() => {
  if (userInfo.value?.account_id) {
    getPrograms(userInfo.value.account_id);
  }
});
</script>
