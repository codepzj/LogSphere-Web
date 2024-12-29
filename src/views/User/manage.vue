<template>
  <n-data-table
    v-if="userAccountInfo"
    :columns="columns"
    :data="userAccountInfo"
    :pagination="true"
    :bordered="false"
  />
</template>

<script setup>
import { NButton, useMessage } from "naive-ui";
import { h } from "vue";
import { ref } from "vue";
import { getAllUser } from "@/api/userAPI";
const userAccountInfo = ref(null);
const message = useMessage();
function createColumns({ play }) {
  return [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "创建于",
      key: "created_at",
    },
    {
      title: "更新于",
      key: "updated_at",
    },
    {
      title: "昵称",
      key: "nickname",
    },
    {
      title: "账号",
      key: "account",
    },
    {
      title: "密码",
      key: "password",
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => play(row),
          },
          { default: () => "Play" }
        );
      },
    },
  ];
}

const columns = createColumns({
  play(row) {
    message.info(`Play ${row.title}`);
  },
});
onMounted(async () => {
  const data = await getAllUser();
  userAccountInfo.value = data.data;
});
</script>
