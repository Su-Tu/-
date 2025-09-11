<template>
  <view class="nav">
    <ul class="nav-bar">
      <li v-for="item in list" :key="item.id" class="nav-option" @tap="changePage(item.page)">
        <image :src="item.imgUrl" class="image-control" />
        <view>
          <text>{{ item.text }}</text>
        </view>
      </li>
    </ul>
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
  page: string;
}


const list = ref<Item[]>([
  { id: 1, imgUrl: `http://${ip}:3000/images/public/nav_imgs/zhanbu01.png`, text: "占卜", page: '/pages/divination/index' },
  { id: 2, imgUrl: `http://${ip}:3000/images/public/nav_imgs/yulu.png`, text: "语录", page: '/pages/yulu/index' },
  { id: 3, imgUrl: `http://${ip}:3000/images/public/nav_imgs/bizhi01.png`, text: "壁纸", page: '/pages/bizhi/index' },
])

function changePage(page: string) {
  uni.navigateTo({
    url: page,
  })
  console.log(page);

}

</script>


<style scoped>
.nav {
  margin-top: 30rpx;
}

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
  width: 100rpx;
  height: 100rpx
}
</style>