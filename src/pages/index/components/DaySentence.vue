<template>
  <view class="day-sentence">
    <view class="title">每日一句</view>
    <view class="hr-style"></view>
    <view class="word-card" :style="getGradientStyle">
      <view class="img-box">
        <canvas canvas-id="sentence" v-if="isView"></canvas>
        <image :src="sentence.imgurl" class="img-control" mode="widthFix" @load="LoadImage(sentence.imgurl)"
          :style="getImageStyle" />
      </view>
      <view class="word">
        <text>{{ sentence.word }}</text>
        <view style="text-align: right;">
          <text>——{{ sentence.animateName }}</text>
        </view>
      </view>
    </view>
  </view>

</template>


<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import { getImageInfo, getImageData, getImageColor, getPixelAverage, themeColor } from '@/utils/DrawImage'
import { useServerConfig } from '@/stores';
const {ip} = useServerConfig()
let isView = ref<boolean>(true)
let gradientColors = ref<string[]>([])
let shadowColor = ref<string>('')
const insatnce = getCurrentInstance()
interface Sentence {
  imgurl: string;
  word: string;
  animateName: string;
}
const sentence = ref<Sentence>({
  imgurl: `http://${ip}:3000/images/xiaozi.jpg`,
  word: "只要那一抹笑容尚存，我便心无旁骛",
  animateName: "声之形"
})

const LoadImage = async (url: string) => {
  try {
    const { path } = await getImageInfo(url)
    await themeColor({ canvasId: "sentence", instance: insatnce, img: path, width: 300, height: 150 }, 2, async (res) => {
      gradientColors.value = [getImageColor(res[0]), getImageColor(res[1])];
      const ccData = await getImageData("sentence", 150, 75, 50, 50, insatnce)
      shadowColor.value = getImageColor(getPixelAverage(ccData, 50, 50))
      isView.value = false;
    })
  } catch (e) {
    console.log(e)
  }
}

const getGradientStyle = computed(() => {
  if (gradientColors.value.length === 0) return {};
  return {
    background: `linear-gradient(45deg, ${gradientColors.value[0]}, ${gradientColors.value[1]})`,
  };
});

const getImageStyle = computed(() => {
  if (shadowColor.value === '') return {};
  return {
    boxShadow: `2px 4px 20px 4px ${shadowColor.value}`
  }
})
</script>



<style scoped>
.day-sentence {
  margin-top: 40rpx;
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
  margin: 10px 0;
  height: 0;
}

.word-card {
  width: 90%;
  border: 1px solid rgba(166, 166, 166, 0.5);
  border-radius: 20px 20px 0px 0px;
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.3);
  /* background: linear-gradient(45deg, rgb(239, 242, 235), rgb(214, 238, 226)); */
}

.img-box {
  margin-top: 10rpx;
  margin-left: 30rpx;
  width: 90%;
  /* box-shadow: 2px 4px 20px 4px rgba(0, 186, 173, 0.3); */
  border-radius: 20px;
  box-sizing: border-box;
}

.img-control {
  width: 100%;
  border-radius: 20px;
  /* filter: saturate(110%); */
}

.word {
  width: 90%;
  padding-top: 30rpx;
  padding-left: 40rpx;
  padding-bottom: 30rpx;
  font-family: 华文楷体;
  font-weight: 700;
}
</style>