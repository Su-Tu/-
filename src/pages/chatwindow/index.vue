<template>
  <view class="chatwindow">
    <view class="type-box" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="iconfont icon-arrow-left" @tap="backPage"></view>
      <view class="type" style="flex:1;text-align: center;">
        <text>{{ chatOption.chatName }}</text>
      </view>
    </view>

    <!-- 聊天区域 start -->
    <scroll-view scroll-y class="content-box" style="flex: 1;padding-bottom: 150rpx;">
      <block v-for="it in chatOption.chatBlock" :key="it.time">
        <view class="myblock" v-if="it.TalkPeople === '嗷'">
          <view class="mytalkbox"><text>{{ it.TalkContent }}</text></view>
          <image
            :src="`http://${ip}:3000/images/qianlianwanhua.jpg`"
            mode="scaleToFill"
            class="myavatar-control"
          />
        </view>
        <view class="otherblock" v-if="it.TalkPeople != '嗷'">
          <image
            :src="chatOption.avatarUrl"
            mode="scaleToFill"
            class="otheravatar-control"
          />
          <view class="othertalkbox"><text>{{ it.TalkContent }}</text></view>
        </view>
      </block>
    </scroll-view>
    <!-- 聊天区域 end -->

    <!-- 输入区域 start -->
    <view 
      class="bottom-area" 
      :style="{ 
        bottom: keyboardHeight > 0 ? keyboardHeight + 'px' : 0,
        paddingBottom: keyboardHeight > 0 ? 0 : safeAreaInsets?.bottom + 'px'
      }"
    >
      <input 
        type="text" 
        class="Input-box" 
        v-model="message"
        :adjust-position="false"
        @blur="handleBlur"
      >
      <button class="Button-box" @tap="sendMsg">发送</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, getCurrentInstance, ref ,onUnmounted} from 'vue'
import type { ChatOption } from '@/types/types';
import { useServerConfig } from '@/stores';
const { ip } = useServerConfig();
const { safeAreaInsets } = uni.getSystemInfoSync()

let message = ref('')
let chatOption = ref<ChatOption>({
  avatarUrl: '',
  chatName: '',
  chatBlock: [],
  noRead: 89,
})


function backPage() {
  uni.navigateBack()
}


function sendMsg(){
  chatOption.value.chatBlock.push({
    TalkPeople: '嗷',
    TalkContent: message.value,
    time: Date.now().toString(),
  })
  message.value = ''
}

let keyboardHeight = ref(0)
let keyboardListener = ref<any>(null)


// 处理输入框失焦
const handleBlur = () => {
  keyboardHeight.value = 0
}

// 在组件卸载时清理监听器
onUnmounted(() => {
  if (keyboardListener.value) {
    keyboardListener.value.remove()
  }
})

onMounted(() => {
  const instance = getCurrentInstance()?.proxy
  const eventChannel = instance?.getOpenerEventChannel();
  eventChannel?.on('chatOption', (res: ChatOption) => {
    console.log('接收到数据');
    chatOption.value = res
  })

  uni.onKeyboardHeightChange(res => {
    keyboardHeight.value = res.height
    console.log('键盘高度变化:', res.height)
  })
})
</script>

<style scoped>
.chatwindow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
}

.type-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx;
  background-color: rgb(245, 245, 245);
  height: 200rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toTop {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
}

.type {
  font-size: 30rpx;
  font-weight: 700;
  color: black;
}

.content-box {
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  padding: 0 40rpx;
  padding-top: 30rpx;
  background-color: #fff;
}

.myblock {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 35rpx;
}

.otherblock{
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 35rpx;
}

.mytalkbox{
  position: relative;
  width: fit-content;
  box-sizing: border-box;
  padding: 10rpx;
  max-width: 60%;
  min-height: 65rpx;
  height: fit-content;
  background-color: rgb(240, 240, 240);
  font-size: 30rpx;
  border-radius: 15rpx;
  color: black;
}
.mytalkbox:after{
  position: absolute;
  top: 50%;
  right:0%;
  transform: translate(100%,-50%);
  content: '';
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 10rpx solid rgb(240, 240, 240);
}

.othertalkbox{
  position: relative;
  width: fit-content;
  box-sizing: border-box;
  padding: 10rpx;
  max-width: 60%;
  min-height: 65rpx;
  height: fit-content;
  background-color: rgb(240, 240, 240);
  font-size: 30rpx;
  border-radius: 15rpx;
  color: black;
}
.othertalkbox::before{
  position: absolute;
  top: 50%;
  left:0%;
  transform: translate(-100%,-50%);
  content: '';
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-right: 10rpx solid rgb(240, 240, 240);
}

.myavatar-control{
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  margin-left: 20rpx;
  vertical-align: middle;
}
.otheravatar-control{
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  vertical-align: middle;
}

.bottom-area {
  position: fixed;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: rgb(245, 245, 245);
  padding: 0 40rpx;
  padding-top: 20rpx;
  height: 150rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.Input-box{
  width: 0rpx;
  flex: 1;
  background-color: #fff;
  height: 50rpx;
  padding: 5rpx 20rpx;
  border-radius: 15rpx;
}

.Button-box{
  width: 120rpx;
  height: 50rpx;
  margin-left: 20rpx;
  font-size: 30rpx;
  line-height: 50rpx;
  background-color: rgb(97, 159, 206);
}

</style>