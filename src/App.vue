<template>
  <n-config-provider>
    <n-message-provider>
      <div class="px-4">
        <n-layout>
          <n-layout-header><Navbar v-if="showNavBar"></Navbar></n-layout-header>
          <n-layout-content content-style="padding: 24px;">
            <div class="flex" v-if="showSideBar">
              <div class="w-1/5">
                <Sidebar></Sidebar>
              </div>
              <div class="w-4/5">
                <router-view></router-view>
              </div>
            </div>

            <div class="w-full" v-else>
              <router-view></router-view>
            </div>
          </n-layout-content>
          <n-layout-footer class="fixed bottom-0 right-0">
            <span class="px-8"
              ><strong>本站是开源项目Logsphere的演示站</strong>
            </span>
          </n-layout-footer>
        </n-layout>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const RLName = ["Register", "Login"];
const showNavBar = ref(false);
const showSideBar = ref(false);
watch(
  () => route.name,
  (name) => {
    const isRL = RLName.includes(name);
    showNavBar.value = !isRL;
    showSideBar.value = !isRL;
  }
);
</script>
<style lang="scss">
@use "styles/main.scss" as *;
</style>
