<template>
  <view class="whole-page">
    <view class="img-box">
      <view class="Avatar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
        <image :src="userInfo.avatarImage" mode="scaleToFill" class="img-control-1" @tap="reavatar" :style="{boxShadow: `2px 4px 10px 2px rgba(${color[0]}, 0.8)`}"/>
      </view>
    </view>
    <view class="msg-box">
      <view class="msg" >
        <view style="flex: 1;">
          <text>昵称：</text>
        </view>
        <view>
          <input type="text"  :adjust-position="false" v-model="name" @blur="rename" style="text-align: right;" :placeholder=" isFocus ? '请输入':nickname" @focus="isFocus=true">
        </view>
        <view class="iconfont icon-arrow-right" style="margin-left: 30rpx;color:#ccc"></view>
      </view>
      <!-- <view class="msg">
        <view style="flex: 1;">
          <text></text>
        </view>
        <view>
          <text style="color:#ccc;font-weight: 400;">135*****756</text>
        </view>
        <view class="iconfont icon-arrow-right" style="margin-left: 30rpx;color:#ccc"></view>
      </view> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref,computed} from "vue"
import {http,upload} from "@/utils/http";
import type { UserInfo } from "@/types/types";
import {userStore} from "@/stores";
const { safeAreaInsets } = uni.getSystemInfoSync()
const userInfo = computed(() => userStore().userInfo)
const color = computed(() => userStore().avatarColor)
const nickname = computed(() => userStore().userInfo.name)
let isFocus = ref(false)
let name = ref('')

// #region 修改昵称
const rename  = ()=>{
  isFocus.value = false
  uni.showModal({
    title:'修改昵称',
    content:"是否要修改昵称",
    success(res){
      if(res.confirm){
        if(name.value === ''){
          uni.showToast({
            title:"昵称不能为空",
            icon:"none"
          })
          return
        }
        if(name.value === userInfo.value.name){
          uni.showToast({
            title:"昵称未修改",
            icon:"none"
          })
          return
        }
        http({
          url: '/user/name',
          method: 'POST',
          data: {
            name: name.value
          }
        }).then((res) => {
          userStore().setUserInfo({
            ...userInfo.value,
            name: name.value
          })
        })
      }else if(res.cancel){
        name.value = ''
        console.log("取消修改");
      }
    }
  })
}
// #endregion


// #region 更换头像
const reavatar = async () => {
 const res = await uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
  })
  const filePath = res.tempFilePaths[0]
  const uploadRes =  await upload({
    url: '/user/avatar',
    filePath,
    name:'avatar',
    formData:{
      oldAvatar:userInfo.value.avatarImage
    }
  })
  console.log(uploadRes);
  http({
    url: '/user/info',
    method: 'GET'
  }).then((res) => {
    console.log(res.result);
    const newUserinfo = (res.result as any )[0];
    newUserinfo.avatarImage = `${newUserinfo.avatarImage}?t=${Date.now()}`
    userStore().setUserInfo(newUserinfo as UserInfo)
    userStore().setAvatarColor((res.result as any)[1].color)
  })
}
// #endregion

</script>

<style scoped>
.whole-page {
  background-color: #f1f1f1;
  width: 100%;
  height: 100vh;
}

.img-box {
  width: 100%;
  height: 400rpx;
}

.Avatar {
  position: relative;
  text-align: center;
  font-size: 35rpx;
  color: #fff;
  padding-top: 30rpx;
}

.img-control-1 {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
}

.username {
  padding-top: 15rpx;
  font-weight: 700;
}

.msg-box {
  width: 90%;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 28rpx;
  padding-left: 20rpx;
  padding-right: 10rpx;
  height: fit-content;
  border-radius: 10rpx;
}

.msg {
  display: flex;
  border-radius: 20rpx;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 30rpx;
  padding: 20rpx 25rpx;
  padding-right: 10rpx;
  background-color: #fff;
}

.Avatar::before {
  position: absolute;
  width: 90rpx;
  height: 30rpx;
  border-radius: 10rpx;
  content: "更换头像";
  font-size: 20rpx;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #6cc1e3;
}
</style>