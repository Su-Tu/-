http://localhost:3000/images<template>
  <view class="my-content" :style="BoxStyle">
    <view class="options">
      <view class="option" @tap="change(1)" :class="{ active: current === 1 }"><text>语录</text></view>
      <view class="option" @tap="change(2)" :class="{ active: current === 2 }"><text>占卜</text></view>
      <view class="option" @tap="change(3)" :class="{ active: current === 3 }"><text>壁纸</text></view>
    </view>
    <scroll-view :scroll-y="true" class="item-list" @scroll="onScroll">
      <view class="items-box">
        <view v-for="(it, index) in items" :key="index" class="item" @tap="toDetail(it)">
          <view class="img-box">
            <!-- <image :src="it.bgUrl" mode="scaleToFill" class="image-control" /> -->
          </view>
          <view class="ani-name">
            <text>{{ it.title }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>




<script setup lang="ts">
import type { DetailOption } from "@/types/types";
import { ref, computed } from "vue";
import { useServerConfig } from "@/stores";
const { ip } = useServerConfig()

let current = ref(1)
let scrollTop = ref(0)
let maxTranslateY = ref(300)
let items = ref<DetailOption[]>([
 
])

function change(num: number) {
  current.value = num
}



function onScroll(e: any) {
  scrollTop.value = e.detail.scrollTop;
}


function toDetail(item: DetailOption) {
  uni.navigateTo({
    url: '/pages/showDetail/index',
    success: (res) => {
      console.log('跳转成功');
      res.eventChannel.emit('detailOption', item)
    },

  })
}


let BoxStyle = computed(() => {
  const translateY = Math.min(scrollTop.value, maxTranslateY.value);
  return {
    transform: `translateY(-${translateY}rpx)`,
  };
})
</script>


<style scoped>
.my-content {
  margin-top: 40rpx;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0rpx 0rpx;
  box-shadow: 0 -4px 2px 0px rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.options {
  display: flex;
  justify-content: flex-start;
  padding-top: 30rpx;
  padding-left: 50rpx;
}

.option {
  margin-left: 15rpx;
  font-size: 28rpx;
  font-family: 思源黑体;
  padding-right: 20rpx;
  font-weight: 700;
  border-right: 2px solid rgb(213, 213, 213);
  color: rgb(183, 183, 183);
}


.item-list {
  width: 100%;
  height: 60vh;
  padding-top: 30rpx;
}

.items-box {
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

}

.item {
  width: 30%;
  height: 350rpx;
  margin-left: 20rpx;
  margin-bottom: 20rpx;
  flex-shrink: 0;
}

.img-box {
  width: 220rpx;
  height: 85%;
  border-radius: 20rpx;
}

.image-control {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}

.ani-name {
  text-align: center;
  font-size: 25rpx;
  height: fit-content;
}

.active {
  color: rgb(48, 127, 217);
  background: linear-gradient(to right, rgb(66, 143, 228) 0%, rgb(66, 143, 228) 50%, transparent 50%, transparent 100%) no-repeat;
  background-size: 50% 3px;
  /* 控制下划线的宽度和高度 */
  background-position: 50% 100%;
  /* 将下划线定位在文本底部 */
  padding-bottom: 5px;
  /* 调整下划线与文本的间距 */
}
</style>