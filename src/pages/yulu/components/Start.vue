<template>
  <view class="options">
    <view v-for="it in OptionList" class="option" :key="it" :class="{ active: cur_option === it }"
      @tap="cur_option = it">
      <text class="word-control">{{ it }}</text>
    </view>
  </view>
  <!-- <view class="hr-style"></view> -->
</template>


<script setup lang="ts">
import { ref } from 'vue'
let OptionList: string[] = ['动漫', '游戏', '自定义']
let cur_option = ref<string>('动漫')
</script>


<style scoped>
.options {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 40rpx;
  margin-top: 30rpx;
}

.option {
  margin-left: 40rpx;
}

.word-control {
  font-size: 28rpx;
  font-weight: 700;
}

.active {
  color: rgb(48, 127, 217);
  background: linear-gradient(to right, rgb(66, 143, 228) 0%, rgb(66, 143, 228) 50%, transparent 50%, transparent 100%) no-repeat;
  background-size: 50% 3px;
  /* 控制下划线的宽度和高度 */
  background-position: 60% 100%;
  /* 将下划线定位在文本底部 */
  padding-bottom: 5px;
  /* 调整下划线与文本的间距 */
}

.hr-style {
  margin-top: 30rpx;
  width: 90%;
  margin-left: 40rpx;
  height: 2px;
  background-color: rgb(230, 230, 230);
}
</style>