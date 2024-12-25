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
              <div>
                <n-button
                  @click="
                    $router.push({
                      name: 'Analyse',
                      params: { websiteId: card.website_id },
                    })
                  "
                  >详情</n-button
                >
                <n-button @click="deleteProgram(card.website_id)"
                  >删除</n-button
                >
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

// 获取项目列表数据
const getCardList = async id => {
  const data = await findProgramsByID(id);
  cardList.value = data.data;
  isLoading.value = false;
};

const deleteProgram = async websiteId => {
  const data = await deleteProgramByID(websiteId);
  if (!data.code) {
    getCardList(userInfo.value["account_id"]);
    programStore().getChildPrograms(userInfo.value["account_id"]);
    message.success("项目删除成功");
  } else {
    message.error("项目删除失败");
  }
};

// 组件挂载后获取数据
onMounted(() => {
  getCardList(userInfo.value["account_id"]);
});
</script>

<style lang="css"></style>
