<template>
  <view class="navs-box">
    <view v-for="(it, index) in navList" :key="index" class="nav" :class="{ active: cur_nav === it }"
      @tap="cur_nav = it">
      <text>{{ it }}</text>
    </view>
    <view class="search">
      <label for=""></label>
      <view class="search-box" :class="{
        appear: !isShow,
        disappear: !isFall
      }">
        <input type="text" placeholder="niaho" :disabled="isShow" :focus="!isShow" @blur="blur" @focus="isFall = true">
      </view>
      <view @tap="show" class="img-box">
        <image :src="`http://${ip}:3000/images/search.png`" mode="widthFix" class="img-control" />
      </view>
    </view>
  </view>
  <view class="options-box">
    <view v-for="it in optinList" :key="it" class="option" :class="{ active: cur_option === it }"
      @tap="cur_option = it">
      <text>{{ it }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useServerConfig } from "@/stores";
const {ip} = useServerConfig();
let cur_nav = ref('静态壁纸');
let cur_option = ref('热门');
let isShow = ref(true);
let isBlur = ref(false);
let isFall = ref(false);
let navList = ref(["静态壁纸", "动态壁纸"]);
let optinList = ref(['热门', '最新', '随机'])

function show() {
  isShow.value = false;
  isBlur.value = true;
  let id: any = null;
  if (id != null) {
    return
  }
  id = setTimeout(() => {
    isBlur.value = false;
    clearTimeout(id)
  }, 100)
}
function blur() {
  if (!isBlur.value) {
    isFall.value = true;
    setTimeout(() => {
      isShow.value = true;
      isFall.value = false;
    }, 500); // 等待动画完成后再重置状态
  }
}


</script>


<style scoped>
.navs-box {
  width: 85%;
  height: fit-content;
  display: flex;
  justify-content: flex-start;
  margin-top: 30rpx;
  margin-left: 50rpx;
}

.nav {
  padding-left: 20rpx;
  font-size: 30rpx;
  font-weight: 700;

}

.active {
  color: rgb(69, 145, 230);
}

.search {
  flex: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
}

.search-box {
  background-color: rgb(240, 240, 240);
  width: 280rpx;
  height: 50rpx;
  padding-left: 30rpx;
  border-radius: 30rpx;
  font-size: 12px;
  transition: all 0.3s ease-in-out;
  transform: translateX(100%);
  opacity: 0;
}


.img-control {
  position: relative;
  z-index: 2;
  width: 35rpx;
  height: 35rpx;
}

.options-box {
  width: 90%;
  height: 80rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10rpx;
  margin-left: 30rpx;
  border-radius: 20rpx;
  background-color: rgba(237, 235, 235, 0.4);
}

.img-box {
  padding-left: 15rpx;
}

.option {
  padding-left: 50rpx;
  font-size: 27rpx;
  font-weight: 700;
}

.appear {
  animation: bounce 0.5s ease-in-out 1 forwards;
}

.disappear {
  animation: bounce2 0.5s ease-in-out 1 forwards;
}

@keyframes bounce {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }

  50% {
    transform: translateX(50%);
    opacity: 0.5;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce2 {
  0% {
    transform: translateX(0);
    opacity: 1;

  }

  50% {
    transform: translateX(50%);
    opacity: 0.5;
  }

  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>