<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div></div>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
    <!-- <el-table mb-1 :data="[]" />
    <el-pagination :total="100" /> -->
  </el-config-provider>
</template>

<style scoped></style>
