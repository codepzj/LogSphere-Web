<template>
  <n-config-provider>
    <n-message-provider>
      <div class="px-4">
        <n-layout>
          <n-layout-header><Navbar v-if="showNavBar"></Navbar></n-layout-header>
          <n-layout-content content-style="padding: 24px;">
            <div v-if="showSideBar">
              <n-space vertical>
                <n-layout has-sider>
                  <n-layout-sider
                    bordered
                    collapse-mode="width"
                    :collapsed-width="64"
                    :collapsed="collapsed"
                    :width="240"
                    show-trigger
                    @collapse="collapsed = true"
                    @expand="collapsed = false"
                  >
                    <Sidebar></Sidebar>
                  </n-layout-sider>
                  <n-layout class="ml-8">
                    <router-view></router-view>
                  </n-layout>
                </n-layout>
              </n-space>
            </div>

            <div class="w-full" v-else>
              <router-view></router-view>
            </div>
          </n-layout-content>
          <n-layout-footer class="fixed bottom-0 left-0">
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
import { watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const NavName = ["Register", "Login"];
const SideName = ["Register", "Login", "Profile"];
const showNavBar = ref(false);
const showSideBar = ref(false);
const collapsed = ref(false);

const screenWidth = ref(window.innerWidth);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

watch(
  () => route.name,
  name => {
    const isRL = NavName.includes(name);
    const isRR = SideName.includes(name);
    showNavBar.value = !isRL;
    showSideBar.value = !isRR;
  }
);

watch(screenWidth, width => {
  collapsed.value = width < 768;
});
</script>
<style lang="scss">
@use "styles/main.scss" as *;
</style>
