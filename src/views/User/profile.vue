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
          v-model:file-list="fileList"
          max="1"
          action="http://127.0.0.1:8080/user/avatar-upload"
          @finish="handleFinish"
          @remove="handleRemove"
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
import { ref, watch } from "vue";
import { useMessage } from "naive-ui";
import { UserEditProfile } from "@/api/userAPI.js";
const store = userStore();
const { userInfo } = storeToRefs(store);
const message = useMessage();
const model = ref({
  account_id: 0,
  nickname: "",
  avatar: "",
  role: 0,
});

const fileList = ref([]);

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
const editProfile = async () => {
  console.log(model.value);
  const data = await UserEditProfile(model.value);
  if (!data.code) {
    store.setUserProfile(model.value);
    message.success(data.msg);
    console.log(userInfo.value);
  } else {
    message.error(data.msg);
  }
};

// 处理图片上传后的回调事件
const handleFinish = ({ event }) => {
  const response = JSON.parse(event.target.response);
  if (!response.code) {
    const avatarPath =
      import.meta.env.VITE_PUBLIC_PATH + "user/" + response.data.filename;
    model.value.avatar = avatarPath;
    console.log(model.value);
    message.success(response.msg);
  } else {
    message.error(response.msg);
  }
};

const handleRemove = () => {
  model.value.avatar = ""; // 清空 avatar
  fileList.value = [];
  message.success("头像已删除");
};
onMounted(() => {
  const { account_id, nickname, role, avatar } = userInfo.value;
  model.value = { account_id, nickname, role, avatar };
  console.log(model.value);
});

watch(
  () => model.value.avatar,
  avatarPath => {
    console.log(avatarPath);
    fileList.value.url = avatarPath;
    fileList.value = [
      {
        status: "finished",
        url: avatarPath,
      },
    ];
  }
);
</script>
