<template>
  <view class="content-boxes">
    <scroll-view scroll-y class="scroll-box">
      <view class="content-box">
        <view v-for="(col,index) in waterfall.colList" class="col" :key="index" >
          <view v-for="(it,it_index) in col" :key="it_index" class="item" :style="getGradientStyle(it)">
            <canvas :canvas-id="`canvas-${it.id}`" v-if="it.isView" style="z-index: -1;opacity: 0;"></canvas>
            <image :src="it.imgurl" mode="widthFix" class="img-control" @load="ImageLoad(it)"
              :style="getImageStyle(it)" />
            <view class="text-box">
            <view>
              <text>{{ it.word }}</text>
            </view>
            <view style="text-align: right;">
              <text v-if="it.animateName != ''">——《{{ it.animateName }}》</text>
              <text v-if="it.author != ''">——{{ it.author }}</text>
            </view>
          </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, reactive, onMounted} from 'vue';
import { getImageInfo, getImageData, getImageColor, themeColor, getPixelAverage } from '@/utils/DrawImage'
import type { WordCard } from '@/types/types'
import { useServerConfig } from '@/stores';
const { ip } = useServerConfig()
const constance = getCurrentInstance();
let wordList = ref<WordCard[]>([
  {
    id: 1,

    imgurl: `http://${ip}:3000/images/xiadie.jpg`,
    word: `只要那一抹笑容尚存，我便心无旁骛`,
    animateName: `声之形`,
    author: ``,
    gradientColors: [],
    shadowColor: ``,
    isView: true,
  },
  {
    id: 2,

    imgurl: `http://${ip}:3000/images/weiwenhuaming.jpg`,
    word: `只要那一抹笑容尚存，我便心无旁骛`,
    animateName: `声之形`,
    author: ``,
    gradientColors: [],
    shadowColor: ``,
    isView: true,
  },
  {
    id: 3,

    imgurl: `http://${ip}:3000/images/xiaozi.jpg`,
    word: `只要那一抹笑容尚存，我便心无旁骛`,
    animateName: `声之形`,
    author: ``,
    gradientColors: [],
    shadowColor: ``,
    isView: true,
  },
  {
    id: 4,

    imgurl: `http://${ip}:3000/images/wandi.jpg`,
    word: `只要那一抹笑容尚存，我便心无旁骛`,
    animateName: `声之形`,
    author: ``,
    gradientColors: [],
    shadowColor: ``,
    isView: true,
  },
  {
    id: 5,

    imgurl: `http://${ip}:3000/images/jingliu.jpg`,
    word: `只要那一抹笑容尚存，我便心无旁骛`,
    animateName: `声之形`,
    author: ``,
    gradientColors: [],
    shadowColor: ``,
    isView: true,
  }
]);
let waterfall = reactive({
colList:[] as any[],
colNum:2,
colHeight:[] as number[]
})

function InitWaterfall(){
  for(let i = 0; i < waterfall.colNum; i++){
    waterfall.colList.push([]);
    waterfall.colHeight.push(0); 
  }
}

function SetWaterfall(){
  wordList.value.forEach(async item => {
    try{
      let { height } = await getImageInfo(item.imgurl);
    let minIndex = waterfall.colHeight.indexOf(Math.min(...waterfall.colHeight));
    waterfall.colList[minIndex].push(item);
    waterfall.colHeight[minIndex] += height;
    }catch(error){
      console.log(error) 
    }
  });
}

onMounted(()=>{
  InitWaterfall();
  SetWaterfall();
})


// 处理图片加载完成事件
const ImageLoad = async (item: WordCard) => {
  try {
    // 获取图片信息
    const { path } = await getImageInfo(item.imgurl);
    await themeColor({ canvasId: `canvas-${item.id}`, instance: constance, img: path, width: 300, height: 150 }, 2, async (res) => {
      item.gradientColors = [getImageColor(res[0]), getImageColor(res[1])];
      const ccData = await getImageData(`canvas-${item.id}`, 150, 75, 50, 50, constance)
      item.shadowColor = getImageColor(getPixelAverage(ccData, 50, 50))
      item.isView = false;
    })
  } catch (error) {
    console.error('Failed to process image for item:', item.id, error);
  }
};

// 动态生成渐变样式
const getGradientStyle = (item: WordCard) => {
  if (!item.gradientColors || item.gradientColors.length === 0) return {};
  return {
    background: `linear-gradient(45deg, ${item.gradientColors[0]}, ${item.gradientColors[1]})`,
  };
};

const getImageStyle = (item: WordCard) => {
  if (item.shadowColor === '') return {};
  return {
    boxShadow: `2px 4px 20px 5px ${item.shadowColor}`
  }
}
</script>

<style scoped>
.content-boxes {
  display: flex;
  flex:1;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 100px);
  margin-top: 40rpx;
  background-color: rgb(244, 244, 244);
}

.scroll-box {
 flex:1;
 height: 0;
 overflow: auto;
}

.content-box {
 display: flex;
 align-items: flex-start;
}

.col {
  flex:1;
  width: 0;
  padding: 20rpx;

}

.item{
  border: 1px solid rgba(166, 166, 166, 0.5);
  border-radius: 20px 20px 0px 0px;
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.3);
  margin-bottom: 20rpx;
}

.img-control {

  width: 90%;
  margin-top: 10rpx;
  margin-left: 15rpx;
  border-radius: 20px;
}

.text-box {
  /* position: absolute; */
  width: 90%;
  padding-top: 20rpx;
  padding-left: 20rpx;
  padding-bottom: 20rpx;
  font-size: 25rpx;
  font-family: 华文楷体;
  font-weight: 700;
}
</style>