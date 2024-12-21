<template>
  <div class="container mx-auto p-6 max-w-3xl">
    <!-- 说明文本 -->
    <div class="text-2xl font-semibold text-red-600 mb-4">
      请插入以下脚本到你的页面中：
    </div>

    <!-- 显示 scriptUrl -->
    <div
      class="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
      :title="scriptUrl"
    >
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-500">脚本代码</span>
        <button
          @click="copyToClipboard"
          class="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          复制
        </button>
      </div>
      <div
        class="bg-gray-100 border-2 border-gray-300 rounded-md shadow-sm break-words whitespace-pre-wrap text-sm font-mono text-blue-600"
      >
        <div>{{ scriptUrl }}</div>
      </div>
    </div>

    <!-- 当前路由参数 -->
    <div class="mt-8">
      <p class="text-lg font-medium text-gray-700">当前路由参数：</p>
      <pre
        class="p-4 bg-gray-200 text-sm rounded-md shadow-sm text-gray-800 whitespace-pre-wrap flex items-center"
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
