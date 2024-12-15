<template>
  <n-message-provider>
    <div class="px-4">
      <n-layout>
        <n-layout-header
          ><Navbar v-show="!$route.meta.NotShowNav"></Navbar
        ></n-layout-header>
        <n-layout-content content-style="padding: 24px;">
          <router-view></router-view>
        </n-layout-content>
        <n-layout-footer class="fixed bottom-0 right-0">
          <span class="px-8"
            ><strong>本站是开源项目Logsphere的演示站</strong>
          </span>
        </n-layout-footer>
      </n-layout>
    </div>
  </n-message-provider>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
<style lang="scss">
@use "styles/main.scss" as *;
</style>
