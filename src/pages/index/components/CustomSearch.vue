<template>
  <view class="custom-search" :style="{ paddingTop: safeAreaInsets?.top +'px' }">
    <view class="search-box">
      <input placeholder="请输入想要搜索的内容" class="search" cursor-color="black" />
    </view>
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>


<style scoped>
.custom-search {
  padding-top: 20px;
  margin-top: 20px;
  margin-bottom: 20rpx;
}

.search-box {
  background-color: rgb(240, 240, 240);
  width: 90%;
  height: 60rpx;
  margin-left: 40rpx;
  border-radius: 30rpx;
}

.search {
  position: relative;
  padding-left: 60rpx;
  height: 100%;
  font-size: 12px;
}

.search::before {
  content: "";
  position: absolute;
  left: 10px;
  /* 调整图标的水平位置 */
  top: 50%;
  transform: translateY(-50%);
  width: 25rpx;
  /* 图标宽度 */
  height: 25rpx;
  /* 图标高度 */
  background-image: url('http://luostir.top/images/search.png');
  /* 替换为实际的搜索图标链接 */
  background-size: cover;
}
</style>