import { defineStore } from "pinia";
import { RouterLink } from "vue-router";
import { findProgramsByID } from "@/api/programAPI";
import { ref, h } from "vue";
import { Icon } from "@iconify/vue";
export const programStore = defineStore("useProgramStore", () => {
  const menuRef = ref(null);
  const selectedKey = ref("");
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
          collapsed: true,
          children: [], // 这里会根据项目数据动态填充子菜单
          icon: renderIcon("icon-park-outline:list"),
        },
      ],
    },
    {
      label: () =>
        h(
          RouterLink,
          { to: { name: "UserManage" } },
          { default: () => "用户管理" }
        ),
      key: "UserManage",
      icon: renderIcon("bx:user"),
    },
    {
      label: () =>
        h(
          RouterLink,
          { to: { name: "System" } },
          { default: () => "系统占用" }
        ),
      key: "System",
      icon: renderIcon("hugeicons:system-update-02"),
    },
    {
      label: () =>
        h(RouterLink, { to: { name: "Test" } }, { default: () => "测试页面" }),
      key: "Test",
      icon: renderIcon("grommet-icons:test"),
    },
  ]);

  function renderIcon(name) {
    return () => h(Icon, { icon: name });
  }

  const setSelectedKey = key => {
    selectedKey.value = key;
    menuRef.value?.showOption(key);
  };

  // 获取项目数据并更新菜单
  const getChildPrograms = async id => {
    try {
      const { data } = await findProgramsByID(id);
      const programLinks = data.map(program => ({
        label: program.name, // 以项目名称为菜单项的标题
        key: `ProgramDetail_${program.website_id}`,
        icon: renderIcon("mdi:web"),
        children: [
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
            key: `Analyse_${program.website_id}`,
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
            key: `Script_${program.website_id}`,
          },
          {
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    name: "Log",
                    params: { websiteId: program.website_id },
                  },
                },
                { default: () => "日志" }
              ),
            icon: renderIcon("icon-park-outline:log"),
            key: `Log_${program.website_id}`,
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
      console.error(error);
    }
  };
  return {
    menuRef,
    selectedKey,
    menuOptions,
    setSelectedKey,
    getChildPrograms,
  };
});
