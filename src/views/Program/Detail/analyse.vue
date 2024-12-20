<template>
  <div class="container mx-auto p-4">
    <!-- 概览信息 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <n-card class="p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300" :hoverable="true">
        <h3 class="text-lg font-semibold mb-2">页面浏览量</h3>
        <p class="text-2xl font-bold">{{ views }}</p>
      </n-card>
      <n-card class="p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300" :hoverable="true">
        <h3 class="text-lg font-semibold mb-2">访客数量</h3>
        <p class="text-2xl font-bold">{{ visitors }}</p>
      </n-card>
      <n-card class="p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300" :hoverable="true">
        <h3 class="text-lg font-semibold mb-2">平均页面停留时长</h3>
        <p class="text-2xl font-bold">{{ pageDuration.toFixed(2) }} 秒</p>
      </n-card>
    </div>

    <!-- 设备信息 -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-2">设备信息</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <n-card v-for="(device, key) in deviceInfo" :key="key" class="p-3 shadow-md rounded-md hover:shadow-xl transition duration-300">
          <h4 class="font-medium">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</h4>
          <p class="text-lg">{{ device.count }} 次浏览 ({{ (device.ratio * 100).toFixed(2) }}%)</p>
        </n-card>
      </div>
    </div>

    <!-- 地理位置信息 -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-2">地理位置分布</h3>
      <div v-for="(location, country) in locationInfo" :key="country" class="bg-gray-100 p-3 rounded-md mb-2">
        <p class="font-medium">{{ country }}:</p>
        <p>{{ location.count }} 次浏览 ({{ (location.ratio * 100).toFixed(2) }}%)</p>
      </div>
    </div>

    <!-- 来源信息 -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-2">来源信息</h3>
      <div v-for="(referrer, index) in referrerInfo" :key="index" class="bg-gray-100 p-3 rounded-md mb-2">
        <p class="font-medium">{{ referrer.Domain || '直接访问' }}:</p>
        <p>{{ referrer.Count }} 次浏览 ({{ (referrer.Ratio * 100).toFixed(2) }}%)</p>
      </div>
    </div>

    <!-- 页面访问统计 -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-2">页面访问情况</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <n-card v-for="(page, path) in pageInfo" :key="path" class="p-3 shadow-md rounded-md hover:shadow-xl transition duration-300">
          <p class="font-medium">{{ path }}:</p>
          <p>{{ page.count }} 次浏览 ({{ (page.ratio * 100).toFixed(2) }}%)</p>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAnalyse } from "@/api/trackAPI";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { NCard, NTag } from "naive-ui";

const route = useRoute();

const views = ref(0);
const visitors = ref(0);
const pageDuration = ref(0);
const deviceInfo = ref({
  desktop: { count: 0, ratio: 0 },
  laptop: { count: 0, ratio: 0 },
  mobile: { count: 0, ratio: 0 }
});
const locationInfo = ref({});
const referrerInfo = ref([]);
const pageInfo = ref({});

const getgraphData = async () => {
  const data = await getAnalyse(route.params.websiteId);

  views.value = data.data.views;
  visitors.value = data.data.visitors;
  pageDuration.value = data.data.pageDuration;
  deviceInfo.value = data.data.deviceInfo;
  locationInfo.value = data.data.locationInfo; // locationInfo 可能有多个国家
  referrerInfo.value = data.data.referrerInfo;
  pageInfo.value = data.data.pageInfo;
};

onMounted(() => {
  getgraphData();
});
</script>