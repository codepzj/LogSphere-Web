<template>
  <div class="w-full">
    <div class="flex justify-center" v-if="isLoading">
      <n-spin size="large" />
    </div>
    <div v-else>
      <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-auto"
        v-if="cardList.length"
      >
        <div v-for="card in cardList" :key="card.id">
          <n-card :title="card.name" size="medium" class="rounded-lg">
            <div>{{ card.domain }} {{ card.websiteId }}</div>
            <div class="flex justify-end">
              <div class="space-x-[0.5em]">
                <n-button
                  @click="
                    $router.push({
                      name: 'Analyse',
                      params: { websiteId: card.website_id },
                    })
                  "
                  >详情</n-button
                >
                <n-button @click="handleDelete(card.website_id)">删除</n-button>
              </div>
            </div>
          </n-card>
        </div>
      </div>
      <div class="h-screen flex justify-center items-center" v-else>
        <n-gradient-text type="info" class="text-xl">
          啥都没有呢，去创建项目吧
        </n-gradient-text>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModal" preset="dialog">
    <template #header>
      <div>删除项目</div>
    </template>
    <div class="text-xl text-red-500 my-4">请输入项目名和您的密码</div>
    <div>
      <n-form :model="deleteModel" :rules="rules" ref="formRef">
        <n-form-item path="name" label="项目名">
          <n-input
            v-model:value="deleteModel.name"
            :placeholder="deleteProgramInfo.name"
          />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            type="password"
            v-model:value="deleteModel.password"
            placeholder="请输入密码"
          />
        </n-form-item>
      </n-form>
    </div>
    <template #action>
      <div class="space-x-[0.5em]">
        <n-button @click="confirmDeleteProgram">确认</n-button>
        <n-button @click="cancelDeleteProgram">取消</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { deleteProgramByID, findProgramsByID } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { programStore } from "@/store/programStore";
import { storeToRefs } from "pinia";
import { useMessage } from "naive-ui";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());

// 定义响应式变量
const isLoading = ref(true);
const cardList = ref([]);
const message = useMessage();
const formRef = ref(null);
const showModal = ref(false);
const deleteProgramInfo = ref({});

const deleteModel = ref({
  name: "",
  password: "",
});

// 获取项目列表数据
const getCardList = async id => {
  const data = await findProgramsByID(id);
  cardList.value = data.data;
  isLoading.value = false;
};

// 调用api删除项目
const deleteProgram = async websiteId => {
  const data = await deleteProgramByID(websiteId);
  if (!data.code) {
    getCardList(userInfo.value["account_id"]);
    await programStore().getChildPrograms(userInfo.value["account_id"]);
    message.success("项目删除成功");
  } else {
    message.error("项目删除失败");
  }
};

// 点击删除按钮触发弹框事件，加载删除项目的信息
const handleDelete = websiteId => {
  deleteProgramInfo.value = cardList.value.find(
    card => card.website_id === websiteId
  );
  showModal.value = true;
};
const rules = {
  name: [
    {
      required: true,
      message: "请输入项目名称",
      trigger: ["input", "blur"],
    },
    {
      validator: validateProgramName,
      message: "项目名称错误",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input", "blur"],
    },
    {
      validator: validatePassword,
      message: "密码错误",
      trigger: "blur",
    },
  ],
};

function validateProgramName(rule, value) {
  // 长度为0或者删除项目的名称匹配成功
  return value === deleteProgramInfo.value.name || !value.length;
}
function validatePassword(rule, value) {
  return value === userInfo.value.user_model.password || !value.length;
}

const confirmDeleteProgram = e => {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (!errors) {
      deleteProgram(deleteProgramInfo.value.website_id);
      clearForm();
      showModal.value = false;
    } else {
      message.error("验证失败");
    }
  });
};

const clearForm = () => {
  deleteModel.value = {
    name: "",
    password: "",
  };
  deleteProgramInfo.value = {};
};
const cancelDeleteProgram = () => {
  clearForm();
  showModal.value = false;
};

onMounted(() => {
  getCardList(userInfo.value["account_id"]);
});
</script>

<style lang="css"></style>
