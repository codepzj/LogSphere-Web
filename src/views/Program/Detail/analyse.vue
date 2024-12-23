<template>
  <div class="container mx-auto p-4">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <div
        class="p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300 ease-in-out"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-3">页面浏览量</h3>
        <p class="text-3xl font-bold text-blue-600">{{ views }}</p>
      </div>
      <div
        class="p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300 ease-in-out"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-3">访客数量</h3>
        <p class="text-3xl font-bold text-green-600">{{ visitors }}</p>
      </div>
      <div
        class="p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300 ease-in-out"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          平均页面停留时长
        </h3>
        <p class="text-3xl font-bold text-yellow-600">
          {{ pageDuration.toFixed(2) }} 秒
        </p>
      </div>
    </div>

    <!-- Collapsible Section for Location Info -->
    <div class="mb-6">
      <div
        class="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-md hover:shadow-lg cursor-pointer"
        @click="toggleCollapse('location')"
      >
        <span class="text-lg font-semibold text-gray-800">地理位置分布</span>
        <svg
          :class="activeCollapse === 'location' ? 'transform rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
      <div
        v-show="activeCollapse === 'location'"
        class="mt-4 p-4 bg-gray-50 rounded-md shadow-sm"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(location, country) in sortedLocationInfo"
            :key="country"
            class="p-3 bg-white rounded-md shadow-md"
          >
            <p class="font-medium text-gray-700">{{ location.country }}:</p>
            <p class="text-sm text-gray-500">
              {{ location.count }} 次浏览 ({{
                (location.ratio * 100).toFixed(2)
              }}%)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Section for Referrer Info -->
    <div class="mb-6">
      <div
        class="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-md hover:shadow-lg cursor-pointer"
        @click="toggleCollapse('referrer')"
      >
        <span class="text-lg font-semibold text-gray-800">来源信息</span>
        <svg
          :class="activeCollapse === 'referrer' ? 'transform rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
      <div
        v-show="activeCollapse === 'referrer'"
        class="mt-4 p-4 bg-gray-50 rounded-md shadow-sm"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(referrer, index) in sortedReferrerInfo"
            :key="index"
            class="p-3 bg-white rounded-md shadow-md"
          >
            <p class="font-medium text-gray-700">
              {{ referrer.Domain || "直接访问" }}:
            </p>
            <p class="text-sm text-gray-500">
              {{ referrer.Count }} 次浏览 ({{
                (referrer.Ratio * 100).toFixed(2)
              }}%)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Section for Page Access Info -->
    <div class="mb-6">
      <div
        class="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-md hover:shadow-lg cursor-pointer"
        @click="toggleCollapse('page')"
      >
        <span class="text-lg font-semibold text-gray-800">页面访问情况</span>
        <svg
          :class="activeCollapse === 'page' ? 'transform rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
      <div
        v-show="activeCollapse === 'page'"
        class="mt-4 p-6 bg-gray-50 rounded-md shadow-sm"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="(page, path) in sortedPageInfo"
            :key="path"
            class="p-4 bg-white rounded-md shadow-md"
          >
            <p class="font-medium text-gray-700">
              <a
                :href="websiteURL + path"
                target="_blank"
                class="text-blue-500 hover:underline"
              >
                {{ decodeURIComponent(websiteURL + path) }}
              </a>
            </p>
            <p class="text-sm text-gray-500">
              {{ page.count }} 次浏览 ({{ (page.ratio * 100).toFixed(2) }}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAnalyse } from "@/api/trackAPI";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { findURLByWebsiteID } from "@/api/programAPI";

const route = useRoute();

const websiteURL = ref("");
const views = ref(0);
const visitors = ref(0);
const pageDuration = ref(0);
const deviceInfo = ref({
  desktop: { count: 0, ratio: 0 },
  laptop: { count: 0, ratio: 0 },
  mobile: { count: 0, ratio: 0 },
});
const locationInfo = ref({});
const referrerInfo = ref([]);
const pageInfo = ref({});

const activeCollapse = ref(""); // 当前展开的折叠项

const getgraphData = async () => {
  const data = await getAnalyse(route.params.websiteId);

  views.value = data.data.views;
  visitors.value = data.data.visitors;
  pageDuration.value = data.data.pageDuration;
  deviceInfo.value = data.data.deviceInfo;
  locationInfo.value = data.data.locationInfo;
  referrerInfo.value = data.data.referrerInfo;
  pageInfo.value = data.data.pageInfo;

  // After data is fetched, sort the data
  if (locationInfo.value && referrerInfo.value && pageInfo.value) sortData();
};

const findDomain = async () => {
  const data = await findURLByWebsiteID(route.params.websiteId);
  websiteURL.value = data.data.url;
};

// Sorting function
const sortData = () => {
  sortedLocationInfo.value = Object.entries(locationInfo.value)
    .map(([key, value]) => ({ country: key, ...value }))
    .sort((a, b) => b.count - a.count);

  sortedReferrerInfo.value = referrerInfo.value.sort(
    (a, b) => b.Count - a.Count
  );

  sortedPageInfo.value = Object.entries(pageInfo.value)
    .sort(([, a], [, b]) => b.count - a.count)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

const sortedLocationInfo = ref([]);
const sortedReferrerInfo = ref([]);
const sortedPageInfo = ref([]);

// Toggle collapse visibility
const toggleCollapse = section => {
  activeCollapse.value = activeCollapse.value === section ? "" : section;
};

onMounted(() => {
  getgraphData();
  findDomain();
});
</script>

<style scoped>
/* 可以根据需要调整按钮样式 */
</style>
