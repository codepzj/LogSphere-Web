<template>
  <n-avatar round>
    {{ value }}
  </n-avatar>
</template>

<script setup>
import { ref } from "vue";
const value = ref(666);
</script>
