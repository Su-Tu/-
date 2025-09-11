<template>
  <view>
    <view class="nav-box">
      <view v-for="it in options" :key="it.name">
        <image :src="it.url" mode="scaleToFill" class="img-control" />
        <text class="option"> {{ it.name }}</text>
      </view>
    </view>
  </view>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig();
// const { safeAreaInsets } = uni.getSystemInfoSync()
let options = ref([{
  name: '评论',
  url: `http://${ip}:3000/images/pinglun.png`
},
{
  name: '关注的人',
  url: `http://${ip}:3000/images/guanzhu.png`
},
{
  name: '赞',
  url: `http://${ip}:3000/images/zan.png`
}


])


</script>



<style scoped>
.nav-box {
  height: 100rpx;
  box-sizing: border-box;
  background-color: rgb(250, 250, 250);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.img-control {
  width: 40rpx;
  height: 40rpx;
  vertical-align: text-bottom;
  padding-right: 12rpx;
}

.option {
  font-size: 28rpx;
  font-weight: 700;
}
</style>