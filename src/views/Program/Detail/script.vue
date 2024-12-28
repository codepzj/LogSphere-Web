<template>
  <div class="container mx-auto p-6 max-w-3xl">
    <!-- 说明文本 -->
    <div class="text-2xl font-semibold text-red-400 mb-4">
      请插入以下脚本到你的页面中：
    </div>

    <!-- 显示 scriptUrl -->
    <div
      class="p-6 rounded-lg bg-orange-100 border-solid border-2 border-orange-200 text-black"
      :title="scriptUrl"
    >
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg">脚本代码</span>
        <button
          @click="copyToClipboard"
          class="px-3 py-1 text-xs bg-white rounded-md"
        >
          复制
        </button>
      </div>

      <div>{{ scriptUrl }}</div>
    </div>

    <!-- 当前路由参数 -->
    <div class="mt-8">
      <p class="text-lg font-medium">当前路由参数：</p>
      <pre
        class="p-4 bg-orange-100 border-solid border-2 border-orange-200 text-sm rounded-md text-black flex items-center"
      >
        <code>{{ `websiteId: ${route.params.websiteId}` }}</code>
      </pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";

// 定义一个 ref 来保存 scriptUrl
const scriptUrl = ref(null);
// 获取当前路由对象
const route = useRoute();
const message = useMessage();
const copyToClipboard = () => {
  navigator.clipboard
    .writeText(scriptUrl.value)
    .then(() => {
      message.success("脚本已复制到剪贴板！");
    })
    .catch(err => {
      message.error("复制失败，请手动复制！");
    });
};
// 在组件挂载后获取并设置 scriptUrl
onMounted(() => {
  scriptUrl.value =
    `<scrip` +
    `t data-website-id="${route.params.websiteId}" src="${location.origin}/js/track.js">
    </s` +
    `cript>`;
});
</script>

<style scoped>
/* Add any extra styles if needed */
</style>
