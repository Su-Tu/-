<template>
  <view class="MyMsg-box" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <image class="background-image" :src="userInfo.bgImage" mode="scaleToFill" />
    <view class="background-image"  style=" background-color: rgba(0,0,0,0.5);"></view>
    <view class="MyMsg-box-nav" >
      <view class="setting-option" @tap="isShow">
        <view v-for="i in 3" :key="i" class="line"></view>
      </view>
      <view class="Avatar">
        <image :src="userInfo.avatarImage" mode="scaleToFill" class="img-control-1" @tap="toMsgEdit" :style="{boxShadow: `2px 4px 10px 2px rgba(${color[0]}, 0.8)`}"/>
        <view class="username" :style="{color:`rgb(${textColor})`}">
          <text>{{ userInfo.name }}</text>
        </view>
      </view>
      <view class="person-msg" :style="{color:`rgb(${textColor})`,fontWeight:700}">
        <view><text>关注&nbsp;{{ userInfo.attention }}</text></view>
        <view><text>粉丝&nbsp;{{ userInfo.fan }}</text></view>
        <view><text>获赞&nbsp;{{ userInfo.praise }}</text></view>
        <view class="border-style" @tap="emit('sign-in')"><text>签到</text></view>
      </view>
      <view class="signature-box">
        <view class="signature">
          <input type="text" class="signature-word" v-model="signature" :placeholder="isFocus?'请输入你的签名':sign" @blur="sendSignature" placeholder-style="color:#fff;" @focus="isFocus=true"/>
          <view class="iconfont icon-qianming"></view>
        </view>
      </view>
    </view>
  </view>

</template>


<script setup lang="ts">
import {  defineEmits,computed,ref} from "vue";
import {http} from "@/utils/http";
import emitter from "@/utils/emitter";
import { userStore} from "@/stores";



const emit = defineEmits(["sign-in"])
const { safeAreaInsets } = uni.getSystemInfoSync()
const userInfo = computed(() => userStore().userInfo)
const color = computed(() => userStore().avatarColor)
const textColor = computed(() => userStore().textColor)
const sign = computed(() => userStore().userInfo.signature)
const signature = ref('')
const isFocus = ref(false)
const isShow = () => {
  emitter.emit("showLeftSetting", false)
}

const toMsgEdit = () => {
  uni.navigateTo({ 
    url: "/pages/MsgEdit/index", 
  })
}

const sendSignature = async () => {
  isFocus.value = false
uni.showModal({
  title: '提示',
  content: '是否保存该签名',
  success:async (res)=> {
    if (res.confirm) {
      if(signature.value === "" || signature.value === sign.value) {
        uni.showToast({
          title: '签名为空或一致',
          icon:'none'
        })
        return
      }
      const res1 = await http({
        url: `/user/signature`,
        method: "POST",
        data:{
          signature:signature.value,
        }
      })
    if(res1.code === 0) {
      uni.showToast({
        title: '签名保存成功',
        icon: 'success'  
      })
      userStore().setUserInfo({...userInfo.value,signature:signature.value})
    }
    } else if (res.cancel) {
      signature.value =''
      console.log('用户点击取消')
    }
  }
})



 

}



</script>



<style scoped>
/* 
个人信息 
start
*/
.MyMsg-box {
  position: relative;
  height: fit-content;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.MyMsg-box-nav {
  /* margin-top: 20px; */
  z-index: 1;
}

.setting-option {
  padding-top: 30rpx;
  padding-left: 40rpx;
}

.line {
  width: 40rpx;
  height: 5rpx;
  background-color: #fff;
  margin-bottom: 8rpx;
}

.img-control-1 {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
}

.Avatar {
  text-align: center;
  font-size: 35rpx;
  color: #fff;
  padding-top: 30rpx;
}

.username {
  padding-top: 15rpx;
  font-weight: 700;
}

.person-msg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  padding-top: 20rpx;
  font-size: 27rpx;
  font-family: 思源黑体;
}

.border-style {
  width: 90rpx;
  height: 45rpx;
  text-align: center;
  align-self: flex-start;
  line-height: 1.9;
  font-size: 22rpx;
  font-weight: 700;
  border-radius: 20rpx;
  color: rgb(42, 130, 228);
  background-color: #fff;
}

.signature-box {
  margin-top: 20rpx;
  margin-left: 20rpx;
  width: 95%;
  height: 90rpx;
  font-size: 25rpx;
  color: #fff;
  background-color: rgba(56, 56, 56, 0.64);
  border-radius: 35rpx;
}

.img-control-2 {
  width: 30rpx;
  height: 30rpx;
  padding-left: 30rpx;
  vertical-align: text-bottom;
}

.signature {
  display: flex;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  width: 90%;
}

.signature-word {
  width: 90%;
  font-size: 22rpx;
  text-align: center;
  padding-left: 60rpx;
  letter-spacing: 3rpx;
  color: #fff;
}




/*end*/
</style>