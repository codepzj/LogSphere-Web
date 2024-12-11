<template>
  <n-message-provider>
    <Navbar></Navbar>
    <router-view></router-view>
  </n-message-provider>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
<style lang="scss">
@use "styles/main.scss" as *;
</style>
