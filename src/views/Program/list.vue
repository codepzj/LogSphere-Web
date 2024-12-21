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
              <n-button
                @click="
                  $router.push({
                    name: 'Analyse',
                    params: { websiteId: card.website_id },
                  })
                "
                >Views</n-button
              >
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
import { findProgramsByID } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

// 从 Pinia store 获取用户信息
const { userInfo } = storeToRefs(userStore());

// 定义响应式变量
const isLoading = ref(true);
const cardList = ref([]);

// 获取项目列表数据
const getCardList = async id => {
  const data = await findProgramsByID(id);
  console.log(data);
  cardList.value = data.data;
  isLoading.value = false;
  console.log(cardList.value);
};

// 组件挂载后获取数据
onMounted(() => {
  console.log(userInfo.value);
  console.log(Object.keys(userInfo.value));
  getCardList(userInfo.value["account_id"]);
});
</script>

<style lang="css"></style>
