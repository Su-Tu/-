<template>
  <view style="width:100%;height: calc(100vh - 100px);display: flex;flex: 1;flex-direction: column;">
    <view class="title">
      <text>占卜解读</text>
    </view>
    <scroll-view scroll-y style="flex: 1;height: 0;overflow: auto;" :show-scrollbar="false"  :enhanced="true">
      <view v-for="(it,index) in result.cardReadings" :key="index" class="card-box" style="display: flex;">
        <view style="align-self: center;">
          <image
            :src="images[index].url"
            mode="widthFix"
            class="img-control"
          />
        </view>
        <view style="padding-left: 10rpx;">
          <view>
            <text class="pre-word">{{ it.meanings['位置含义'] }}</text>
          </view>
          <view>
            <text class="pre-word">{{ it.meanings['基础含义'] }}</text>
          </view>
          <view>
            <text class="pre-word">{{ it.meanings['牌面含义'] }}</text>
          </view>
        </view>
      </view>
      <view class="card-box" v-show="result.overallReading !=''">
        <view style="width: 100%;text-align: center;font-size: 35rpx;font-weight: 700;">
          <text style="color: rgb(240, 207, 75);">整体解读</text>
        </view>
        <text class="pre-word">{{ result.overallReading }}</text>
      </view>
      <view class="card-box" v-show="result.conclusion != ''">
        <view style="width: 100%;text-align: center;font-size: 35rpx;font-weight: 700;">
          <text style="color: rgb(240, 207, 75);">占卜结论</text>
        </view>
        <text class="pre-word">{{ result.conclusion }}</text>
      </view>
      <view class="card-box" v-show="result.advices.length != 0">
        <view style="width: 100%;text-align: center;font-size: 35rpx;font-weight: 700;">
          <text style="color: rgb(240, 207, 75);">建议</text>
        </view>
        <view v-for="(it,index) in result.advices" :key="index">
          <text class="pre-word">{{ it }}</text>
        </view>
      </view>
      <view class="card-box" style="text-align: center;" v-show="result.verse != ''">
        <view style="width: 100%;text-align: center;font-size: 35rpx;font-weight: 700;">
          <text style="color: rgb(240, 207, 75);">谶语</text>
        </view>
        <text class="pre-word">{{ result.verse }}</text>
      </view>
    </scroll-view>
  </view>
</template>




<script setup lang="ts">
import { ref ,computed} from 'vue';
import emitter from '@/utils/emitter';
// const { safeAreaInsets } = uni.getSystemInfoSync()
const result = computed(() => res.value)
const images = ref<any>([])
const res = ref<any>({
  cardReadings: [],
  overallReading: '',
  conclusion: '',
  advices: [],
  verse: ''
})

emitter.on('getResult', (val:any) => {
  console.log("触发函数");
  res.value = val[0].data
  images.value = val[1]
})





</script>



<style scoped>
.title {
  position: relative;
  width: 100%;
  text-align: center;
  padding-left: 5rpx;
  padding-top: 20rpx;
  letter-spacing: 3rpx;
  margin-bottom: 40rpx;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
}

.title::before {
  content: '';
  position: absolute;
  left: 30%;
  top: 50%;
  transform: translate(-100%, -50%);
  width: 90rpx;
  height: 54rpx;
  background-image: url('http://192.168.123.82:3000/images/zhanbu/leftdecoration.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.title::after {
  content: '';
  position: absolute;
  right: 30%;
  top: 50%;
  transform: translate(100%, -50%);
  width: 90rpx;
  height: 54rpx;
  background-image: url('http://192.168.123.82:3000/images/zhanbu/rightdecoration.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.pretation-box {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: white;
}

.card-box {
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: rgba(157, 115, 191, 0.5);
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}

.img-control {
  width: 150rpx;
}

.pre-word {
  /* color: rgb(70, 45, 113); */
  color:#fff;
  font-weight: 700;
  padding-left: 20rpx;
  white-space: normal;
  word-wrap: break-word;
  vertical-align: middle;
}
</style>