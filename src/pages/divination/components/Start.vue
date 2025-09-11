<template>
  <view>
    <view class="title">
      <image :src="`http://${ip}:3000/images/zhanbu/zhanbu_title.png`" mode="widthFix" />
    </view>
    <view class="cards">
      <view class="card" v-for="i in 5"
        :style="{ transform: `translateX(50%) rotate(${-60 + 20 * i}deg)`, zIndex: i === 3 ? 3 : i > 4 ? 1 : 2 }"
        :key="i">
        <image :src="`http://${ip}:3000/images/zhanbu/card.png`" mode="widthFix" class="img-control" />
      </view>
    </view>
    <view class="tip">
      <view>
        <text>来到这里，你心中大概有所困惑</text>
      </view>
      <view>
        <text>塔罗或许能给你答案</text>
      </view>
    </view>
    <view class="box-style" @tap="emit('be-change', 'play')">
      <text>开始</text>
    </view>
  </view>
</template>


<script setup lang="ts">
import { defineEmits } from 'vue';
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig()
const emit = defineEmits(['be-change']);

</script>



<style scoped>
.title {
  width: 80%;
  margin: 20px auto;
}

.cards {
  position: relative;
  width: 50%;
  margin: 0 auto;
}

.card {
  position: absolute;
  transform-origin: center bottom;
}

.img-control {
  width: 200rpx;
}

.tip {
  position: absolute;
  bottom: 13%;
  left: 50%;
  transform: translateX(-50%);
  letter-spacing: 3rpx;
  font-size: 29rpx;
  color: white;
  text-align: center;
  width: fit-content;
}

.tip view {
  margin-bottom: 20rpx;
}

.box-style {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  text-align: center;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 100rpx;
  background-color: rgba(212, 185, 89, 0.41);
  box-shadow: 0px 0px 4px 8px rgba(252, 227, 0, 0.26),
    inset 0px 0px 10px rgba(255, 235, 59, 0.38);
  animation: flash 2s infinite alternate;
}

@keyframes flash {
  0% {
    box-shadow: 0px 0px 4px 8px rgba(252, 227, 0, 0.26),
      inset 0px 0px 10px rgba(255, 235, 59, 0.38);
    opacity: 0.8;
  }

  50% {
    box-shadow: 0px 0px 8px 12px rgba(252, 227, 0, 0.26),
      inset 0px 0px 15px rgba(255, 235, 59, 0.38);
    opacity: 1;
  }

  100% {
    box-shadow: 0px 0px 4px 8px rgba(252, 227, 0, 0.26),
      inset 0px 0px 10px rgba(255, 235, 59, 0.38);
    opacity: 0.8;
  }
}
</style>