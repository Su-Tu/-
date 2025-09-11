<template>
  <view class="page">
    <!-- 顶部详情区 start-->
    <view class="type-box" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="iconfont icon-arrow-left" @tap="backPage"></view>
      <view class="type" style="flex:1;text-align: center;">
        <text>{{ detailOption.type }}</text>
      </view>
    </view>
    <!-- 顶部详情区 end-->

    <!-- 内容区 start -->
    <scroll-view scroll-y class="content-box" :style="{ paddingBottom: 150 + 'rpx' }" :show-scrollbar="false"  :enhanced="true">
      <!-- 作者信息 start -->
      <view class="author-box">
        <view>
          <image :src="detailOption.author_avatar" mode="scaleToFill" class="img-control" />
          <text class="text-control">{{ detailOption.author }}</text>
        </view>
        <view class="attention">
          <text>+ 关注</text>
        </view>
      </view>
      <!-- 作者信息 end -->

      <!-- 标题 start -->
      <view class="title">
        <text class="h1-style">{{ detailOption.title }}</text>
      </view>
      <!-- 标题 end -->
      
        <view class="post-content">
          <uv-parse :content="detailOption.content" :tagStyle="{img:'max-width:100%;height:auto'}"></uv-parse>
        </view>
    

      <!-- 底部评论区 start-->
      <view class="comment-area">
        <view class="h2-style"><text>评论</text></view>
        <view style="margin-top: 30rpx;">
          <block class="comment-box" v-for="it in detailOption.commentList" :key="it.author">
            <view>
              <image :src="it.avatarUrl" mode="scaleToFill" class="img-control" />
              <text class="text-control">{{ it.author }}</text>
            </view>
            <view class="comment-text">
              <text>{{ it.content }}</text>
            </view>
            <view class="comment-msg">
              <view><text>{{ it.time }}</text></view>
              <view style="display: flex;">
                <view class="iconfont icon-dianzan1" @tap="changeCommentPraise(it)" :class="{ active: it.isPraise }">
                </view>
                <text>{{ it.praise }}</text>
              </view>
            </view>
          </block>
        </view>
      </view>
      <!-- 底部评论区 end -->
    </scroll-view>
    <!-- 内容区 end -->

    <!-- 底部指示区start -->
    <view class="bottom-area" 
    :style="{ paddingBottom: InputBottom>0? 0: safeAreaInsets?.bottom + 'px' ,
    bottom:InputBottom > 0?InputBottom+'px':0}">
      <view>
        <input type="text" class="Input-box" placeholder="请输入你的评论" 
        v-model="Text"
        @focus="isInput = true" 
        :adjust-position="false" 
        @blur="handleBlur"
        :style="{flex:isInput?1:0,width:isInput?'490rpx':'290rpx' }"
        >
      </view>
      <view v-if="isInput">
        <button class="button-style" @tap="sendComment">发送</button>
      </view>
      <view style="display: flex;" v-if="!isInput" :style="{transition:'all 0.3s ease',opacity:isInput?0:1}">
        <view class="iconfont icon-pinglun bottom-icon"></view>
        <text style="font-size: 25rpx;">{{ 10 }}</text>
      </view>
      <view style="display: flex;" @tap="changePraise" 
      :class="{ active: isPraise }"  
      v-if="!isInput" 
      :style="{transition:'all 0.3s ease',opacity:isInput?0:1}">
        <view class="iconfont icon-dianzan1 bottom-icon"></view>
        <text style="font-size: 25rpx;">{{ detailOption.praise }}</text>
      </view>
      <view style="display: flex;" @tap="changeAttention" 
      :class="{ active: isAttention }"  
      v-if="!isInput" 
      :style="{transition:'all 0.3s ease',opacity:isInput?0:1}">
        <view class="iconfont icon-ego-heart bottom-icon"></view>
        <text style="font-size: 25rpx;">{{ detailOption.attention }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import type { DetailOption } from '@/types/types'
import { useServerConfig } from "@/stores";
const { ip } = useServerConfig()
const { safeAreaInsets } = uni.getSystemInfoSync();
let isPraise = ref(false)
let isAttention = ref(false)
let isInput = ref(false)
let Text = ref('')
let InputBottom = ref(0)
let detailOption = ref<DetailOption>({
  type:'帖子',
  id: 0,
  title: '',
  author: '',
  time: '',
  author_avatar: ``,
  attention: 0,
  praise: 0,
  content: '',
  commentList: []
})


function changeCommentPraise(item: any) {
  item.isPraise = !item.isPraise
  if (item.isPraise) {
    item.praise += 1
  }
  else {
    item.praise -= 1
  }
}

function changePraise() {
  isPraise.value = !isPraise.value
  if (isPraise.value) {
    detailOption.value.praise += 1
  } else {
    detailOption.value.praise -= 1
  }

}

function changeAttention() {
  isAttention.value = !isAttention.value
  if (isAttention.value) {
    detailOption.value.attention += 1
  } else {
    detailOption.value.attention -= 1
  }
}


onMounted(() => {
  const instance = getCurrentInstance()?.proxy
  const eventChannel = instance?.getOpenerEventChannel();
  eventChannel?.on('detailOption', async (res: any) => {
    console.log('接收到数据');
    
    const content = await JSON.parse(res.data.result[0].content)
    detailOption.value = {
      ...res.data.result[0],
      content: content,
      type:res.type,
    }
  })
  uni.onKeyboardHeightChange((res)=>{
    InputBottom.value = res.height
  })
})

function backPage() {
  uni.navigateBack()
}

function createRandomID() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return `${timestamp}${randomNum}`;
}


function handleBlur(){
  let timer:any = null 
  InputBottom.value = 0
  if(timer!=null){
    return
  }
  timer = setTimeout(() => {
    isInput.value = false
    clearTimeout(timer)
  }, 200);
}

function sendComment(){
  if(Text.value==''){
    uni.showToast({
      title: '评论不能为空',
      icon: 'none'
    });
    return;
  }
  let time = new Date()
  detailOption.value.commentList.push({
    content: Text.value,
    author: '嗷',
    avatarUrl: `http://${ip}:3000/images/qianlianwanhua.jpg`,
    praise: 0,
    time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
    isPraise: false,
    id: createRandomID()
  })
  Text.value = ''
  isInput.value = false
}

</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
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
  flex: 1;
  height: 0;
  box-sizing: border-box;
  padding: 0 40rpx;
  background-color: #fff;

}



.img-control {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  vertical-align: middle;
}

.author-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 90rpx;
  margin-top: 30rpx;
  box-sizing: border-box;
}

.text-control {
  font-size: 25rpx;
  padding-left: 15rpx;
  color: #0c0c0c;
}

.attention {
  width: 100rpx;
  height: 45rpx;
  line-height: 45rpx;
  text-align: center;
  border-radius: 10rpx;
  color: white;
  font-size: 23rpx;
  background-color: rgb(101, 174, 217);
}

.title {
  margin-top: 30rpx;
}

.h1-style {
  font-size: 40rpx;
  font-weight: 700;
  color: #0c0c0c;
}

.post-content {
  width: 100%;
  height: fit-content;
  margin-top: 30rpx;
  background-color: #fff;
}

.content-img {
  margin-top: 30rpx;
  width: 100%;
}

.content-text {
  text-indent: 2em;
  line-height: 1.5;
  margin-top: 30rpx;
}

.comment-area {
  width: 100%;
  height: fit-content;
  margin-top: 30rpx;
  background-color: #fff;
}

.bottom-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 40rpx;
  padding-top: 20rpx;
  height: 150rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.Input-box {
  width: 290rpx;
  height: 60rpx;
  padding-left: 30rpx;
  font-size: 30rpx;
  background-color: rgb(240, 240, 240);
  border-radius: 30rpx;
  transition: all 0.3s ease;
}

.button-style{
  width: 150rpx;
  height: 60rpx;
  text-align: center;
  background-color: rgb(101, 174, 217);
  line-height: 60rpx;
}

.bottom-icon {
  font-size: 45rpx;
  padding-right: 10rpx;
}

.active {
  color: rgb(101, 174, 217);
}

.comment-text {
  padding-left: 80rpx;
}

.comment-msg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10rpx;
  color: rgb(222, 222, 222);
  font-size: 25rpx;
  padding-left: 80rpx;
}

.h2-style {
  background: linear-gradient(to right, #ccc 0%, #ccc 100%);
  background-position: 0 100%;
  padding-bottom: 20rpx;
  background-repeat: no-repeat;
  background-size: 100% 1px;
  font-size: 30rpx;
}
</style>