<template>
  <n-upload list-type="image-card" v-model:file-list="fileList" max="1">点击上传</n-upload>
  <n-button @click="output">点击</n-button>
</template>

<script setup>
const fileList = ref([]);
const output = () => {
  console.log(fileList.value);
};
</script>
