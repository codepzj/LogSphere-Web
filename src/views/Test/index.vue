<template>
  <n-config-provider theme="darkTheme">
    <n-card>
      <n-space>
        <n-button @click="theme = darkTheme"> 深色 </n-button>
        <n-button @click="theme = null"> 浅色 </n-button>
      </n-space>
    </n-card>
  </n-config-provider>
</template>

<script>
import { darkTheme } from "naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    return {
      darkTheme,
      theme: ref(null),
    };
  },
});
</script>
