<template>
  <div v-if="resource">
    <div class="flex justify-between space-x-[1em]">
      <n-card class="border-2 shadow-sm">
        <n-statistic label="CPU占用率" tabular-nums>
          <n-number-animation
            ref="numberAnimationInstRef"
            :from="Start"
            :to="resource.cpu"
          />
          <template #suffix> % </template>
        </n-statistic>
      </n-card>
      <n-card class="border-2 shadow-sm">
        <n-statistic label="内存占用率" tabular-nums>
          <n-number-animation
            ref="numberAnimationInstRef"
            :from="Start"
            :to="resource.memory"
          />
          <template #suffix> % </template>
        </n-statistic>
      </n-card>
      <n-card class="border-2 shadow-sm">
        <n-statistic label="磁盘占用率" tabular-nums>
          <n-number-animation
            ref="numberAnimationInstRef"
            :from="Start"
            :to="resource.disk"
          />
          <template #suffix> % </template>
        </n-statistic>
      </n-card>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-between space-x-[1em]">
      <n-card v-for="index in 3" :key="index" class="border-2 shadow-sm">
        <n-skeleton text :repeat="3" />
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getSystemUsage } from "@/api/systemAPI";

const resource = ref(null);
const numberAnimationInstRef = ref(null);
onMounted(async () => {
  const data = await getSystemUsage();
  resource.value = data.data;
});

const Start = ref(0);
</script>
