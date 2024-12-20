<template>
  <div class="overflow-x-auto">
    <n-data-table
      size="small"
      :columns="columns"
      :data="formData"
      :pagination="pagination"
      class="min-w-full bg-white shadow-md rounded-lg"
    />
  </div>
</template>

<script setup>
import { getAllRecordsByWebsitID } from "@/api/trackAPI";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute();
const formData = ref([]);
const pagination = ref({
  pageSize: 10,
});
const getRecords = async (websiteId) => {
  const data = await getAllRecordsByWebsitID(websiteId);
  formData.value = data.data;
  console.log(formData.value);
};

const columns = ref([
  { title: "ID", key: "ID", width: 100, fixed: "left" },
  { title: "Type", key: "type", width: 150, fixed: "left" },
  { title: "Visitor ID", key: "visitorId", width: 200 },
  { title: "URL", key: "url", width: 300 },
  { title: "Referrer", key: "referrer", width: 200 },
  { title: "Screen", key: "screen", width: 100 },
  { title: "Language", key: "language", width: 100 },
  { title: "User Agent", key: "userAgent", width: 300 },
  { title: "Timestamp", key: "timestamp", width: 150 },
  { title: "Stay Duration", key: "stayDuration", width: 150 },
  { title: "Website ID", key: "website_id", width: 350 },
  { title: "IP Address", key: "ip_addr", width: 150, fixed: "right" },
  { title: "Location", key: "location", width: 150, fixed: "right" },
]);

onMounted(() => {
  getRecords(route.params.websiteId);
});

onBeforeRouteUpdate((to, from, next) => {
  if (to.name === from.name) getRecords(to.params.websiteId);
  next();
});
</script>

<style lang="scss" scoped>

</style>
