<template>
  <n-menu class="w-1/5" :options="menuOptions" @update:value="handleUpdateValue" />
</template>

<script>
import { useMessage } from "naive-ui";
import { defineComponent, h } from "vue";
import { RouterLink } from "vue-router";

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
            params: {
              lang: "zh-CN",
            },
          },
        },
        { default: () => "回家" }
      ),
    key: "go-back-home",
  },
];

export default defineComponent({
  setup() {
    const message = useMessage();
    return {
      menuOptions,
      handleUpdateValue(key, item) {
        message.info(`[onUpdate:value]: ${JSON.stringify(key)}`);
        message.info(`[onUpdate:value]: ${JSON.stringify(item)}`);
      },
    };
  },
});
</script>
