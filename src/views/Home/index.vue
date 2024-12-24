<template>
  <div class="p-6 rounded-lg shadow-md mb-6">
    <!-- 项目技术栈 -->
    <h3 class="text-2xl font-semibold mb-4">项目技术栈</h3>
    <p class="text-lg mb-4">
      本项目使用了以下技术栈，确保了高效、灵活的开发和部署：
    </p>
    <div class="flex flex-wrap gap-4 mb-6">
      <n-button
        class="px-3 py-1 rounded-full text-sm font-medium"
        >Vue</n-button
      >
      <n-button
        class="px-3 py-1 rounded-full text-sm font-medium"
        >Gin</n-button
      >
      <n-button
        class="px-3 py-1 rounded-full text-sm font-medium"
        >WebSocket</n-button
      >
      <n-button
        class="px-3 py-1 rounded-full text-sm font-medium"
        >Nginx</n-button
      >
      <n-button
        class="px-3 py-1 rounded-full text-sm font-medium"
        >Docker</n-button
      >
    </div>

    <!-- Logsphere 介绍 -->
    <div class="text-lg mb-4">
      <strong>Logsphere</strong>
      是一款专注于用户行为分析的日志管理系统。它通过采集用户在应用中的行为数据，帮助团队实时了解用户需求，识别潜在的产品问题，并优化用户体验。该系统的核心功能包括：
    </div>

    <ul class="list-disc pl-6 mb-4">
      <li>
        <strong>实时日志采集：</strong>
        记录用户的每一项操作，包括页面浏览、按钮点击等行为。
      </li>
      <li>
        <strong>数据可视化：</strong>
        将日志数据转化为易于理解的图表和报表，帮助团队快速决策。
      </li>
      <li>
        <strong>行为分析：</strong>
        通过用户行为分析，发现产品使用中的痛点，进而进行针对性优化。
      </li>
      <li>
        <strong>提升产品迭代效率：</strong>
        通过数据驱动的方式，快速调整产品功能，提升用户满意度。
      </li>
    </ul>

    <div class="text-lg mb-4">
      Logsphere
      不仅帮助团队更好地理解用户需求，还能够通过数据优化产品决策。通过对用户行为的深度挖掘，团队可以在实际操作中发现潜在的问题并快速反馈，提升整体的用户体验，进而加速产品的迭代和优化。
    </div>

    <!-- 技术栈图标 -->
    <div class="mt-4 text-center">
      <img
        class="mx-auto"
        src="https://skillicons.dev/icons?i=vue,go,nginx,docker"
        alt="技术栈图标"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
