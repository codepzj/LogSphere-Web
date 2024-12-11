<template>
  <n-message-provider>
    <Navbar v-show='!($route.name in ["Login","Register"])'></Navbar>
    <router-view></router-view>
  </n-message-provider>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
<style lang="scss">
@use "styles/main.scss" as *;
</style>
