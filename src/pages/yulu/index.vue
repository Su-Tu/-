<template>
  <view class="page"> 
    <Start />
    <Content />
  </view>
</template>

<script lang="ts" setup>
import Start from './components/Start.vue';
import Content from './components/Content.vue';

</script>

<style scoped>
.page{
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>