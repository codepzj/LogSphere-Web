<template>
  <div class="text-xl text-red-600 mb-8">请插入这段脚本到你的页面中</div>
  <div>{{ scriptUrl }}</div>
  <!-- 可以打印查看 route.params -->
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

// 定义一个 ref 来保存 scriptUrl
const scriptUrl = ref(null);
// 获取当前路由对象
const route = useRoute();

// 在组件挂载后获取并设置 scriptUrl
onMounted(() => {
  scriptUrl.value = `<scrip` 
    +`t data-website-id="${route.params.websiteId}" src="${location.origin}/js/track.js">
    </s` +`cript>`;
});
</script>

<style lang="scss" scoped>
/* Your styles here */
</style>
