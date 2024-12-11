<template>
  <div class="flex justify-center" v-if="isLoading">
    <n-spin size="large" />
  </div>
  <div v-else>
    <div class="grid gap-4 grid-cols-4 mt-auto" v-if="cardList.length">
      <div v-for="card in cardList" :key="card.id">
        <n-card :title="card.name" size="medium" class="rounded-lg">
          <div>{{ card.domain }}</div>
          <div class="flex justify-end"><n-button>Views</n-button></div>
        </n-card>
      </div>
    </div>
    <div class="h-screen flex justify-center items-center" v-else>
      <n-gradient-text type="info" class="text-xl">
        啥都没有呢，去创建项目吧
      </n-gradient-text>
    </div>
  </div>
</template>
<script>
import { onMounted } from "vue";
import { findProgramsByID } from "@/api/programAPI";
import { userStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export default {
  setup() {
    const { accountID } = storeToRefs(userStore());
    const isLoading = ref(true);
    const cardList = ref([]);
    const getCardList = async id => {
      const data = await findProgramsByID(id);
      cardList.value = data.data;
      isLoading.value = false;
      console.log(cardList.value);
    };
    onMounted(() => {
      accountID.value !== ""
        ? getCardList(accountID.value)
        : useRouter().push({ name: "Login" });
    });
    return {
      isLoading,
      cardList,
    };
  },
};
</script>
<style lang=""></style>
