<template>
  <n-card title="创建项目" class="w-1/2 md:w-1/3">
    <div class="flex justify-center">
      <n-button @click="showModal = true">
        <n-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
            />
          </svg>
        </n-icon>
      </n-button>
    </div>
  </n-card>
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>创建项目</div>
    </template>
    <n-form ref="formRef" :model="model">
      <n-form-item path="name" label="站点名称">
        <n-input v-model:value="model.name" placeholder="请输入站点名称" />
      </n-form-item>
      <n-form-item path="domain" label="域名">
        <n-input v-model:value="model.domain" placeholder="请输入域名" />
      </n-form-item>
      <n-form-item path="secure" label="是否启用https">
        <n-switch v-model:value="model.secure" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="handleSubmit">提交</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import { createProgram } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { programStore } from "@/store/programStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const { userInfo } = storeToRefs(userStore());

// Message hook from naive-ui
const message = useMessage();

// Reactive model for form data
const showModal = ref(false);
const model = reactive({
  name: "",
  domain: "",
  secure: true,
  account_id: userInfo.value["account_id"],
});

// Handle form submission
const handleSubmit = async () => {
  const data = await createProgram(model);
  if (data.code === 0) {
    message.success("创建项目成功");
    await programStore().getChildPrograms(userInfo.value.account_id);
    showModal.value = false;
    router.push({
      name: "Script",
      params: { websiteId: data.data.website_id },
    });
  } else {
    message.error("创建项目失败");
  }
};
</script>
