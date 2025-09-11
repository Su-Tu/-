<template>
  <view class="left-setting-box" @tap="hide" :class="{ showBox: !isHide }">
    <view class="setting" @tap.stop :class="{ hide: isHide, show: !isHide }">
      <view class="options" :style="{ paddingTop: safeAreaInsets?.top + 'px' }" @tap="toWhere" >
        <view v-for="it in options" :key="it.option" class="option" >
          <view style="display:flex;align-items: center;">
            <view :class="'iconfont ' + it.icon" :data-option="it.option" :data-path="it.path"></view>
            <view class="option-text" ><text :data-option="it.option" :data-path="it.path">{{ it.option }}</text></view>
          </view>
          <view class="hr-style"></view>
        </view>
      </view>
    </view>
  </view>
</template>


<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import emitter from '@/utils/emitter'
import {upload,http} from '@/utils/http'
import { userStore } from '@/stores';
import type { UserInfo } from '@/types/types';
let options = [
  { option: '编辑信息', icon: 'icon-bianji', path: '/pages/MsgEdit/index' }, 
  { option: '切换背景', icon: 'icon-qiehuan', path: '' }, 
  { option: '发布文章', icon: 'icon-qianming', path: '/pages/articleEdit/index'},
  { option: '退出登录', icon: 'icon-tuichu', path: '/pages/Login/index' },
  
]
const { safeAreaInsets } = uni.getSystemInfoSync()
const isHide = ref(true)
emitter.on('showLeftSetting', (value) => {
  isHide.value = value as boolean
})
const hide = (e:any) => {
  console.log(e.target);
  isHide.value = true
}


// #region 导航选项处理
const toWhere = (e:any) => {
  console.log(e.target.dataset);
  
  
  const { option, path } = e.target.dataset
  if(!option) return
  if(path !=""){
    uni.navigateTo( {
      url: path, 
    })
  }else if(option=="切换背景"){
    uploadImg()
  }
}
// #endregion

// #region 切换背景
const uploadImg = async () => {
  const res = await uni.chooseImage({
    count:1,
    sourceType:['album','camera']
  })  
  const imagePath = res.tempFilePaths[0]
  const res1 = await upload({
    url:'/user/bg',
    filePath:imagePath,
    name:'bg',
    formData:{
      oldBg:userStore().userInfo.bgImage,
    }
  })
  userStore().setTextColor((res1.result as any).textColor)
  console.log(res1.message);
  http({
    url: '/user/info',
    method: 'GET'
  }).then((res) => {
    console.log(res.result);
    const newUserinfo = (res.result as any )[0];
    newUserinfo.bgImage = `${newUserinfo.bgImage}?t=${Date.now()}`
    userStore().setUserInfo(newUserinfo as UserInfo)
  })
}
// #endregion


onUnmounted(() => {
  emitter.off('showLeftSetting')
})

</script>


<style scoped>
/*
左侧设置
start
*/

.left-setting-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 0.3s ease-in-out;
}

.setting {
  width: 60%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  transition: all 0.3s ease-in-out;
  transform: translateX(-100%);
}

.options {
  width: 100%;
  height: 100%;
  margin-top: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  box-sizing: border-box;
}

.option {
  margin-bottom: 40rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.option-text {
  padding-left: 30rpx;
}

.hr-style {
  width: 100%;
  height: 1px;
  margin-top: 20rpx;
  background-color: #ccc;
}

.hide {
  transform: translateX(-100%);
}

.show {
  transform: translateX(0%);
}

.showBox {
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>