<template>
  <div class="text-xl my-4">用户编辑资料</div>
  <hr />
  <div class="my-4">
    <n-form :model="model" label-placement="left">
      <n-form-item path="nickname" label="昵称" class="w-1/2">
        <n-input v-model:value="model.nickname" />
      </n-form-item>
      <n-form-item path="role" label="头像">
        <n-upload
          list-type="image-card"
          max="1"
          action="http://127.0.0.1:8080/user/avatar-upload"
          @finish="handleFinish"
          >点击上传</n-upload
        >
      </n-form-item>
      <n-form-item path="nickname" label="角色">
        <n-select v-model:value="model.role" :options="options" />
      </n-form-item>
      <div class="flex justify-center">
        <n-button class="w-20" @click="editProfile">更新</n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useMessage } from "naive-ui";
const store = userStore();
const { userInfo } = storeToRefs(store);
const message = useMessage();
const model = ref({
  nickname: "",
  avatar: "",
  role: 0,
});
const options = [
  {
    label: "管理员",
    value: 0,
  },
  {
    label: "普通用户",
    value: 1,
  },
  {
    label: "游客",
    value: 2,
  },
];
const editProfile = () => {
  console.log(model.value);
};
const handleFinish = ({ event }) => {
  const response = JSON.parse(event.target.response);
  if (!response.code) {
    const avatarPath = "uploads/user/" + response.data.filename;
    store.setUserAvatar(avatarPath);
    message.success(response.msg);
  } else {
    message.error(response.msg);
  }
};
onMounted(() => {
  const { nickname, role, avatar } = userInfo.value;
  model.value = { nickname, role, avatar };
});
</script>
