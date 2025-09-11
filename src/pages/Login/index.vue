<template>
  <view class="page" 
  @touchstart="touch.TouchStart"  
  @touchend="touch.TouchEnd" 
  @mouseup="touch.TouchEnd" 
  @mouseend="touch.TouchEnd">
    <view class="bg" :style="{backgroundImage:`url(${serverUrl}/images/public/login/xiadie04.jpg)`}"></view>
    <view class="topbar" :style="{paddingTop:safeAreaInsets?.top+'px'}">
      <view class="iconfont icon-arrow-left" @tap="backPage"></view>
    </view>
    <view class="rotate-box" :style="{transformOrigin: 'left center', transform:`translate(-50%,-50%) rotateY(${rotateY}deg)`}">
      <!-- #region login -->
      <view class="login" >
        <view class="logo"><text style="font-family:Splashing ink;">漫天地</text></view>
        
        <view class="user">
          <view class="iconfont icon-yonghu login-icon"></view>
          <input type="nickname" placeholder="请输入用户名" class="userInput" v-model="loginName" :disabled="rotateY!=0">
        </view>

        <view class="password">
          <view class="iconfont icon-mima login-icon"></view>
          <input type="text" :password="true" placeholder="请输入密码" class="passwordInput" v-model="loginPwd" :disabled="rotateY!=0">
        </view>
        <view style="text-align: right;padding-right: 20rpx;margin-bottom: 40rpx;"><text style="color: rgb(202, 152, 227);font-size: 24rpx;text-decoration: underline;">忘记密码？</text></view>

        <view style="text-align: center;">
          <button class="login-button" hover-class="" @tap="login" :disabled="rotateY!=0">登录</button>
          <text style="font-size: 24rpx;color:black">还没有账户？<text style="color: rgb(202, 152, 227);text-decoration: underline;" @tap="toRegister">&nbsp;前往注册</text></text>
        </view>
      </view>
      <!-- #endregion login -->
      <!-- #region register -->
      <view class="register">
        <view class="logo"><text style="font-family:Splashing ink;">漫天地</text></view>

        <view class="user">
          <view class="iconfont icon-yonghu login-icon"></view>
          <input type="nickname" placeholder="请输入用户名" class="userInput" v-model="registerName" :disabled="rotateY===0">
        </view>

        <view class="password">
          <view class="iconfont icon-mima login-icon"></view>
          <input type="text" :password="true" placeholder="请输入密码" class="passwordInput" v-model="registerPwd" :disabled="rotateY===0">
        </view>

        <view class="passwordAgain">
          <input type="text" :password="true" placeholder="请再输入一次密码" class="passwordInput" v-model="registerPwdAgain" :disabled="rotateY===0">
        </view>

        <view style="text-align: center;">
          <button class="login-button" hover-class="" @tap="register" :disabled="rotateY===0">注册</button>
          <text style="font-size: 24rpx;color:black">已有账户？<text style="color: rgb(202, 152, 227);text-decoration: underline;" @tap="toLogin">&nbsp;前往登录</text></text>
        </view>
      </view>
      <!-- #endregion -->
    </view>
    <view class="rightBottom-icon"></view>
    <view class="decoration" :style="{backgroundImage:`url(${serverUrl}/images/public/login/die.png);`}"></view>
  </view>
  

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { userStore ,useServerConfig,tokenStore} from '@/stores'
import { http } from '@/utils/http'
import Touch from '@/utils/TouchEvent'
const { safeAreaInsets } = uni.getSystemInfoSync()
const {serverUrl} = useServerConfig()
let rotateY = ref(0)


function backPage() {
  uni.navigateBack()
}

const toRegister = () => {
  rotateY.value = -90
}

const toLogin = () => {
  rotateY.value = 0
}

// #region 检测用户的左拉和右拉事件
const touch = new Touch()
touch.setOnTouchEnd((type)=>{
  if(type === "left") {
    rotateY.value = 0
  }
  if(type === "right") {
    rotateY.value = -90
  }
})
// #endregion


let loginName = ref<string>('')
let loginPwd = ref<string>('')
let registerName = ref<string>('')
let registerPwd = ref<string>('')
let registerPwdAgain = ref<string>('')

//  #region 检测用户的输入逻辑
// 密码检验，至少包含一个数字，一个字母和一个特殊字符，长度不少于8位
const checkPwd = (pwd: string) => {
  const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/
  return reg.test(pwd)
}
// 用户名检验，长度至少为1，可以是中文，英文，数字
const checkName = (name: string) => {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  return reg.test(name)
}
// #endregion



// #region 登录请求
const login = async () => {
  if(!checkName(loginName.value)) {
    uni.showToast({
      title: '用户名格式错误',
      icon: 'none'
    })
    return
  }
  if(!checkPwd(loginPwd.value)) {
    uni.showToast({
      title: '密码格式错误',
      icon: 'none'
    })
  }
  try{
    const res = await http({
    url: `/user/login`,
    method: 'POST',
    data: {
      name: loginName.value,
      password: loginPwd.value
    }
  })
  tokenStore().setToken((res.result as any).token)
  const userinfo = await http({
      url: `/user/info`,
      method: 'GET'
  })
  userStore().setUserInfo((userinfo.result as any)[0])
  userStore().setAvatarColor((userinfo.result as any)[1].color)  
  userStore().setTextColor((userinfo.result as any)[1].textColor)
  uni.showModal({
    title: '登录成功',
    content: '欢迎回来',
    success: () => {
      uni.navigateBack()
    }
  })
  }catch(err){
    console.log(err);
    uni.showToast({
      title: '登录失败',
      icon: 'none'
    })
  }

}
// #endregion


// #region 注册请求
const register = () => {
  if(!checkName(registerName.value)) {
    uni.showToast({
      title: '用户名格式错误',
      icon: 'none'
    })
    return
  }
  if(!checkPwd(registerPwd.value)) {
    uni.showToast({
      title: '密码格式错误',
      icon: 'none'
    })
    return
  }
  if(registerPwd.value !== registerPwdAgain.value) {
    uni.showToast({
      title: '两次密码不一致',
      icon: 'none'
    })
    return
  }
  http({
    url: `/user/register`,
    method: 'POST',
    data: {
      name: registerName.value,
      password: registerPwd.value
    }
  }).then((res) => {
    registerName.value = ''
    registerPwd.value = ''
    registerPwdAgain.value = ''
    uni.showToast({
      title: '注册成功',
      icon: 'success',
    })
  })
}
// #endregion
</script>

<style scoped>
.page{
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: rgba(249, 238, 254,0.5);
  z-index: 1;
}


.bg{
  width: 100%;
  height: 600rpx;
  position: fixed;
  border-radius: 0 0 20% 20%;
  z-index: -1;
  top: 0;
  left: 0;
 
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.topbar{
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin-top: 20rpx;
  padding: 0 40rpx;
}


.rightBottom-icon{
  width: 600rpx;
  height: 600rpx;
  position: absolute;
  z-index: -1;
  bottom:0;
  right:0;
  transform: translate(50%,50%);
  border-radius: 50%;
  background-color: rgb(236, 227, 247);
}


.rotate-box{
  width: 600rpx;
  height: 800rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transition: transform 0.5s ease-in-out;
  transform-style: preserve-3d;

}


.login {
  width: 600rpx;
  height: 800rpx;
  position: absolute;
  display: flex;
  flex-direction: column;
  transform-origin: left center;
  top: 0%;
  left: 0%;
  transform: rotateY(0deg);
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 0 10rpx rgba(0,0,0,0.1);
}

.register{
  width: 600rpx;
  height: 800rpx;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0%;
  left: 0%;
  transform-origin: left center;
  transform:  translateX(100%) rotateY(90deg);
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 0 10rpx rgba(0,0,0,0.1);
}

.logo{
  width: 100%;
  background: linear-gradient(to right, rgb(202, 152, 227), rgb(249, 238, 254)); 
  background-clip: text;
  color: transparent;
  font-size: 80rpx;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  box-sizing: border-box;
  padding: 20rpx 40rpx;
  margin-bottom: 40rpx;
}


.user{
  display: flex;
  align-items: center;
  width: 90%;
  height: 70rpx;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10rpx;
  margin: 0 auto;
  padding: 0 40rpx;
  padding-left: 5px;
  margin-bottom: 40rpx;
}
.password{
  display: flex;
  align-items: center;
  width: 90%;
  height: 70rpx;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10rpx;
  margin: 0 auto;
  padding: 0 40rpx;
  padding-left: 5px;
  /* margin-bottom: 40rpx; */
}
.passwordAgain{
  display: flex;
  align-items: center;
  width: 90%;
  height: 70rpx;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10rpx;
  margin: 0 auto;
  padding: 0 40rpx;
  padding-left: 5px;
  margin-top: 40rpx;
   margin-bottom: 40rpx;
}

.userInput,.passwordInput{
  padding-left: 20rpx;
  font-size: 25rpx;
}

.login-button{
  width: 90%;
  height: 80rpx;
  line-height: 80rpx;
  color: rgb(202, 152, 227);
  background-color: rgb(67, 56, 116);
}

.decoration{
  width: 300rpx;
  height: 300rpx;
  position: absolute;
  transform: translate(25%,25%);
  z-index: -1;
  bottom:0;
  right: 0;
  background-size: contain;
  background-repeat: no-repeat;
  /* background-position: center */
}

.login-icon{
  box-sizing: border-box;
  color:rgb(202, 152, 227);
  font-size: 35rpx;
  height: 50rpx;
  padding-top: 3px;
  padding-right: 8px;
  padding-left: 3px;
  border-right: 1px solid #ccc;
}

</style>