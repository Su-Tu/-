<template>
  <view class="page">
    <CustomSearch />
    <SwiperBanner />
    <CommentArea></CommentArea>
  </view>
</template>

<script lang="ts" setup>
import CustomSearch from './components/CustomSearch.vue';
import SwiperBanner from './components/SwiperBanner.vue';
import CommentArea from './components/CommentArea.vue';



</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

</style>