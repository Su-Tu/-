<template>
  <view>
    <swiper class="swiper-box" @change="change" :current="current" :indicator-dots="false" :autoplay="true">
      <swiper-item v-for="(item, index) in info" :key="index">
        <view class="swiper-item" :style="{ backgroundImage: 'url(' + item.url + ')' }">
        </view>
      </swiper-item>
    </swiper>
    <view class="custom-indicator">
      <view v-for="(item, index) in info" :key="index" class="indicator-item" :class="{ active: current === index }">
      </view>
    </view>
  </view>
</template>


<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useServerConfig } from '@/stores'
const {ip} = useServerConfig()
let current = ref(0)

let info = ref([
  {
    url: `http://${ip}:3000/images/community/Swiper_imgs/hutao01.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/Swiper_imgs/yao.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/Swiper_imgs/xishui.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/Swiper_imgs/yuan.jpg`,
  },
])

function change(e: any) {
  current.value = e.detail.current
}
</script>


<style scoped>
.swiper-box {
  padding-top: 30rpx;
  height: 200px;
}

.swiper-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

}

.custom-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-300%);
}

.indicator-item {
  width: 20px;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.3);
  margin: 0 5px;
  transition: background-color 0.3s ease;
}

.indicator-item.active {
  background-color: rgba(75, 173, 234, 0.9);
}
</style>