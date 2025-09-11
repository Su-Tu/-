<template>
  <view class="custom-search" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view>
      <view class="options">
        <view class="option" :class="{ active: cur_nav === 1 }" @tap="cur_nav = 1"><text>游戏</text></view>
        <view class="option" :class="{ active: cur_nav === 2 }" @tap="cur_nav = 2"><text>动漫</text></view>
      </view>
    </view>
    <view class="search-box">
      <input placeholder="请输入想要搜索的内容" class="search" cursor-color="black" />
    </view>
  </view>
</template>


<script setup lang="ts">
import { ref } from 'vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
let cur_nav = ref(1)
</script>


<style scoped>
.custom-search {
  display: flex;
  box-sizing: border-box;
  height: 190rpx;
  justify-content: space-around;
  align-items: center;
}

.options {
  display: flex;
  list-style: none;
  justify-content: space-around;
}

.option {
  font-size: 35rpx;
  font-weight: 700;
}

.option:nth-child(2) {
  padding-left: 40rpx;
}

.search-box {
  background-color: rgb(240, 240, 240);
  width: 60%;
  height: 70rpx;
  border-radius: 30rpx;
}

.search {
  position: relative;
  padding-left: 60rpx;
  height: 100%;
  font-size: 30rpx;
}

.active {
  color: rgb(48, 127, 217);
}

.search::before {
  content: "";
  position: absolute;
  left: 10px;
  /* 调整图标的水平位置 */
  top: 50%;
  transform: translateY(-50%);
  width: 30rpx;
  /* 图标宽度 */
  height: 30rpx;
  /* 图标高度 */
  background-image: url('http://110.41.37.38:3000/images/search.png');
  /* 替换为实际的搜索图标链接 */
  background-size: cover;
}
</style>