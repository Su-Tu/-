<template>
  <view class="bg-box">
    <image :src="`http://${ip}:3000/images/zhanbu/bg.jpg`" mode="scaleToFill" class="bg-img" lazy-load/>
    <view class="topbar" :style="{paddingTop:safeAreaInsets?.top+'px'}">
      <view class="iconfont icon-arrow-left" @tap="backPage" style="color: white;"></view>
    </view>
    <Start @be-change="changeComponent" v-if="currentComponent === 'start'"/>
    <Play @be-change="changeComponent" v-show="currentComponent === 'play'"/>
    <Interpretation  v-show="currentComponent==='interpretation'"/>
  </view>


</template>

<script lang="ts" setup>
import Start from './components/Start.vue'
import Play from './components/Play.vue'
import Interpretation from './components/Interpretation.vue'
import { useServerConfig } from '@/stores';
import { ref } from 'vue'
let currentComponent = ref<string>('start')
const {safeAreaInsets} = uni.getSystemInfoSync()
const {ip} = useServerConfig()
function changeComponent(component: string): void {
  currentComponent.value = component
}
function backPage() {
  uni.navigateBack()
}
</script>

<style scoped>
.bg-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bg-img {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -99;
}

.topbar{
  width: 100%;
  height: 130rpx;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 40rpx;
}

</style>