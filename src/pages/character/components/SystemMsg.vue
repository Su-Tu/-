<template>
  <view>
    <view class="msg-box" v-if="systemMsg.state !== 0">
      <view class="img-background">
        <image :src="`http://${ip}:3000/images/pages_icon/infomation.png`" mode="scaleToFill" class="img-control" />
      </view>
      <view class="msg-content">
        <view><text class="title">{{ systemMsg.title }}</text></view>
        <view><text class="content">{{ systemMsg.content }}</text></view>
      </view>
      <view class="msg-time">
        <text>{{ systemMsg.time }}</text>
      </view>
    </view>
  </view>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import { useServerConfig } from '@/stores';
const { ip } = useServerConfig();
interface SystemMsg {
  title: string;
  time: string;
  content: string;
  state: number;
}
let systemMsg = ref<SystemMsg>({
  title: '系统通知',
  time: '07-18',
  content: '这是一条系统通知，请注意查看。',
  state: 1
})
</script>


<style scoped>
.msg-box {
  display: flex;
  width: 90%;
  height: 120rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
  margin-left: 25rpx;
  padding-left: 20rpx;
  background-color: rgb(250, 250, 250);
  justify-content: flex-start;
  align-items: center;
}

.img-background {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgb(238, 238, 238);
  text-align: center;
  line-height: 3;
}

.img-control {
  width: 35rpx;
  height: 35rpx;
}

.msg-content {
  padding-left: 24rpx;
  flex: 3;
}

.title {
  font-size: 25rpx;
  font-weight: 700;
}

.content {
  color: rgb(201, 201, 201);
  font-size: 23rpx;
}

.msg-time {
  font-size: 24rpx;
  text-align: right;
  align-self: self-start;
  flex: 1;
  color: rgb(201, 201, 201);
  padding-right: 50rpx;
  padding-top: 15rpx;
}
</style>