http:localhost:3000/images<template>
  <view class="nav">
    <view class="nav-bar">
      <view v-for="(item, index) in list" :key="item.id" class="nav-option" @tap="change(index)"
        :class="{ active: current === index }">
        <image :src="item.imgUrl" class="image-control" />
        <view class="word-control">
          <text>{{ item.text }}</text>
        </view>
      </view>
    </view>
  </view>

</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig()
interface Item {
  id: number;
  imgUrl: string;
  text: string;
}

let current = ref(0)

const list: Item[] = [
  { id: 1, imgUrl: `http://${ip}:3000/images/public/nav_imgs/hutao.png`, text: "原神" },
  { id: 2, imgUrl: `http://${ip}:3000/images/public/nav_imgs/jinxi.png`, text: "鸣潮" },
  { id: 3, imgUrl: `http://${ip}:3000/images/public/nav_imgs/liuying.png`, text: "崩铁" },
  { id: 4, imgUrl: `http://${ip}:3000/images/public/nav_imgs/amiya.png`, text: "明日方舟" },
]

function change(index: number) {
  current.value = index
}

</script>


<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-around;
}

.nav-option {
  text-align: center;
  font-size: 12px;
  font-family: 微软雅黑;
  font-weight: 700;
}

.image-control {
  width: 120rpx;
  height: 120rpx;
  color: rgb(183, 183, 183);

}

.word-control {
  transform: translateY(-50%);
}

.active {
  color: rgb(48, 127, 217);
}
</style>
