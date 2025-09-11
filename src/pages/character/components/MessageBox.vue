<template>
  <scroll-view scroll-y class="message-box">
    <view v-for="it in msgList" :key="it.chatName" @tap="toChatWindow(it)">
      <view class="msg-box">
        <view class="img-background">
          <image :src="it.avatarUrl" mode="scaleToFill" class="img-control" />
        </view>
        <view class="msg-content">
          <view><text class="title">{{ it.chatName }}</text></view>
          <view><text class="content">{{ it.chatBlock[it.chatBlock.length - 1].TalkContent }}</text></view>
        </view>
        <view class="msg-time">
          <view>
            <text>{{ it.chatBlock[it.chatBlock.length - 1].time }}</text>
          </view>
          <view class="box-style" v-if="<number>it.noRead >= 1">
            <text>{{ <number>it.noRead > 99 ? '99+' : it.noRead }}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import type { ChatOption } from '@/types/types';
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig();

let msgList = ref<ChatOption[]>([
  { chatName: '尼尔多隆玛', avatarUrl: `http://${ip}:3000/images/avatar/actar01.jpg`, chatBlock: [{ TalkPeople: '尼尔多隆玛', TalkContent: '我说乘着西风出发！！', time: '2023-07-21' },{TalkPeople:'嗷',TalkContent:'你好',time:'2025-07-08'}], noRead: 2 },
  { chatName: '爱上火车', avatarUrl: `http://${ip}:3000/images/avatar/actar02.png`, chatBlock: [{ TalkPeople: '爱上火车', TalkContent: '火车上有着最年代的故事', time: '2025-05-03' }], noRead: 7 },
  { chatName: '星空鱼白', avatarUrl: `http://${ip}:3000/images/avatar/actar03.png`, chatBlock: [{ TalkPeople: '星空鱼白', TalkContent: '满船清梦压星河', time: '2023-08-21' }], noRead: 101 },
  { chatName: '梦末', avatarUrl: `http://${ip}:3000/images/avatar/actar04.png`, chatBlock: [{ TalkPeople: '梦末', TalkContent: '来一场世界上最殉烈的恋爱', time: '2023-08-21' }], noRead: 89 },
  { chatName: '茸雪', avatarUrl: `http://${ip}:3000/images/avatar/actar05.png`, chatBlock: [{ TalkPeople: '茸雪', TalkContent: '哥哥还记得那间木屋吗', time: '2023-08-21' }], noRead: 3 },
  { chatName: '莲华', avatarUrl: `http://${ip}:3000/images/avatar/actar06.png`, chatBlock: [{ TalkPeople: '莲华', TalkContent: '世界是一个巨大的万花筒', time: '2023-08-21' }], noRead: 1 },
  { chatName: '青鸟', avatarUrl: `http://${ip}:3000/images/avatar/actar07.png`, chatBlock: [{ TalkPeople: '青鸟', TalkContent: '寂寞梧桐深院锁清秋', time: '2023-08-21' }], noRead: 78 },
  { chatName: '银', avatarUrl: `http://${ip}:3000/images/avatar/actar08.png`, chatBlock: [{ TalkPeople: '银', TalkContent: '夏天的风里，我如流萤躁动', time: '2023-08-21' }], noRead: 3 },
  { chatName: '亚托莉', avatarUrl: `http://${ip}:3000/images/avatar/actar09.png`, chatBlock: [{ TalkPeople: '亚托莉', TalkContent: '时间啊，停止吧，你是多么美丽！', time: '2023-08-21' }], noRead: 88 },
])
function toChatWindow(item: ChatOption) {
  uni.navigateTo({
    url: '/pages/chatwindow/index',
    success: (res) => {
      console.log('跳转成功');
      res.eventChannel.emit('chatOption', item)
    },
  })
}

</script>



<style scoped>
.message-box {
  width: 100%;
  height: 77vh;
  margin-top: 20rpx;
  border-radius: 15rpx;
  background-color: rgb(250, 250, 250);
}


.msg-box {
  display: flex;
  width: 90%;
  height: 120rpx;
  border-radius: 20rpx;
  margin-top: 20rpx;
  margin-left: 25rpx;
  padding-left: 20rpx;
  background-color: #fff;
  justify-content: flex-start;
  align-items: center;
}

.img-background {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgb(238, 238, 238);
  text-align: center;
}

.img-control {
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 24rpx;
  align-self: self-start;
  flex: 1;
  color: rgb(201, 201, 201);
  padding-right: 50rpx;
  padding-top: 15rpx;
}

.box-style {
  width: fit-content;
  height: 30rpx;
  padding-left: 10rpx;
  padding-right: 10rpx;
  padding-top: 5rpx;
  padding-bottom: 5rpx;
  text-align: center;
  margin-top: 20rpx;
  border-radius: 20rpx;
  color: black;
  background-color: rgb(89, 170, 255);
}
</style>