<template>
  <view class="page">
    <CustomNav />
    <Contents />
  </view>
</template>

<script lang="ts" setup>
import CustomNav from './components/CustomNav.vue';
import Contents from './components/Contents.vue';



</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>