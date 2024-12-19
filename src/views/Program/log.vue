<template>
  <div>
    <n-data-table
      size="small"
      :columns="columns"
      :data="formData"
      :pagination="pagination"
    />
  </div>
</template>

<script setup>
import { getAllRecordsByWebsitID } from "@/api/trackAPI";
import { useRoute,onBeforeRouteUpdate } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const formData = ref([]);
const pagination = ref({
  pageSize: 50,
});
const getRecords = async (websiteId) => {
  const data = await getAllRecordsByWebsitID(websiteId);
  formData.value = data.data;
  console.log(formData.value);
};
const columns = ref([
  {
    title: "ID",
    key: "ID",
    width: 100,
  },
  {
    title: "type",
    key: "type",
    width: 100,
  },
  {
    title: "visitorId",
    key: "visitorId",
    width: 200,
  },
  {
    title: "url",
    key: "url",
    width: 300,
  },
  {
    title: "referrer",
    key: "referrer",
    width: 200,
  },
  {
    title: "screen",
    key: "screen",
    width: 100,
  },
  {
    title: "language",
    key: "language",
    width: 100,
  },
  {
    title: "userAgent",
    key: "userAgent",
    width: 300,
  },
  {
    title: "timestamp",
    key: "timestamp",
    width: 150,
  },
  {
    title: "stayDuration",
    key: "stayDuration",
    width: 150,
  },
  {
    title: "website_id",
    key: "website_id",
    width: 350,
  },
]);
onMounted(() => {
  getRecords(route.params.websiteId);
});

onBeforeRouteUpdate((to, from, next) => {
  if (to.name === from.name) getRecords(to.params.websiteId)
  next()
});
</script>

<style lang="scss" scoped></style>
