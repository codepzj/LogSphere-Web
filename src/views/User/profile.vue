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
          :max="1"
          :custom-request="uploadUserAvatar"
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
import { uploadAvatar, UserEditProfile } from "@/api/userAPI.js";
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

const uploadUserAvatar = async ({ file }) => {
  const data = await uploadAvatar(file);
  if (!data.code) {
    model.value.avatar = import.meta.env.VITE_PUBLIC_PATH + data.data.filename;
    message.success(data.msg);
  } else {
    message.error(data.msg);
  }
};

const handleRemove = () => {
  model.value.avatar = ""; // 清空 avatar
  fileList.value = [];
  message.success("头像已删除");
};

const editProfile = async () => {
  const data = await UserEditProfile(model.value);
  if (!data.code) {
    store.setUserProfile(model.value);
    message.success(data.msg);
  } else {
    message.error(data.msg);
  }
};

onMounted(() => {
  const { account_id, nickname, role, avatar } = userInfo.value;
  model.value = { account_id, nickname, role, avatar };
});

watch(
  () => model.value.avatar,
  avatarPath => {
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
