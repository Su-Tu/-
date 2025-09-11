http://localhost:3000/images<template>
  <view class="introduce-box">
    <h1 class="title">动漫介绍</h1>
    <view class="hr-style"></view>
    <view class="intro-options">
      <view class="intro-option" :style="getGradientStyle(it)" v-for="it in card" :key="it.id">
        <h1 class="option-title">{{ it.title }}</h1>
        <view class="img-box">
          <image :src="it.imgurl" mode="widthFix" class="img-control" @load="LoadImage(it, `canvas-${it.id}`)"
            :style="getImageStyle(it)" />
        </view>
      </view>
    </view>
  </view>
  <canvas canvas-id="canvas-1" style="width: 300px;height: 150px;" v-if="card[0].isView"></canvas>
  <canvas canvas-id="canvas-2" style="width: 300px;height: 150px;" v-if="card[1].isView"></canvas>
</template>



<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { getImageInfo, getImageColor, getImageData, getPixelAverage, themeColor } from '@/utils/DrawImage';
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig()
interface Card {
  id: number;
  title: string;
  imgurl: string;
  gradientColors: string[];
  shadowColor: string;
  isView: boolean;
}

let card = ref<Card[]>([
  {
    id: 1,
    title: "故事",
    imgurl: `http://${ip}:3000/images/story.jpg`,
    gradientColors: [],
    shadowColor: "",
    isView: true,
  },
  {
    id: 2,
    title: "人设",
    imgurl: `http://${ip}:3000/images/character.jpg`,
    gradientColors: [],
    shadowColor: "",
    isView: true,
  }
])

const instance = getCurrentInstance()
const LoadImage = async (it: Card, canvasId: string) => {
  try {
    const { path } = await getImageInfo(it.imgurl)
    console.log(path);
    
    await themeColor({ canvasId, instance, img: path, width: 300, height: 150 }, 2, async (res) => {
      it.gradientColors = [getImageColor(res[0]), getImageColor(res[1])];
      const ccData = await getImageData(canvasId, 150, 75, 50, 50, instance)
      it.shadowColor = getImageColor(getPixelAverage(ccData, 50, 50))
      it.isView = false;
    });
  } catch (e) {
    console.log(e);
  }

}
// 动态生成渐变样式
const getGradientStyle = (item: Card) => {
  if (!item.gradientColors || item.gradientColors.length === 0) return {};
  return {
    background: `linear-gradient(45deg, ${item.gradientColors[0]}, ${item.gradientColors[1]})`,
  };
};

const getImageStyle = (item: Card) => {
  if (item.shadowColor === '') return {};
  return {
    boxShadow: `2px 4px 20px 10px ${item.shadowColor}`
  }
}

</script>


<style scoped>
.introduce-box {
  margin-top: 50rpx;
  padding-left: 60rpx;
}


.title {
  font-weight: 700;
  font-family: 微软雅黑;
  padding-left: 20rpx;
}

.hr-style {
  width: 90%;
  border-bottom: 1px solid rgba(166, 166, 166, 0.5);
  /* 设置底部边框模拟分割线 */
  margin: 10px 0;
  /* 上下外边距 */
  height: 0;
  /* 自身高度设为0 */
}

.intro-options {
  display: flex;
  width: 90%;
  justify-content: space-around;
}

.intro-option {
  width: 40%;
  height: 300rpx;
  overflow-y: hidden;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.option-title {
  font-family: 黑体;
  padding-left: 20rpx;
  padding-top: 10rpx;
  color: rgba(0, 0, 0, 0.7);
}

.img-box {
  display: flex;
  width: 100%;
  height: 90%;
  padding-left: 40rpx;
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: flex-end;

}

.img-control {
  width: 90%;
  box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
  border-radius: 10px 0 10px 0;
}
</style>