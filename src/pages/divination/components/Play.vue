<template>
  <view style="display: flex;flex-direction: column;width: 100%;height:calc(100vh - 100px);;">
  <view>
    <view class="cards">
      <view v-for=" (it,index) in cards" class="card" :style="
        {
          '--rotate':(-84 + 7 * (index + 1)+'deg'),
          '--translate-x':60 + '%',
          '--translate-y':50 + '%',
          '--z-index':index,
        }" 
        :class="{ selected: selectedCardIndex === index ,shuffleAnimation:isShuffling }"
        @tap="handleCardClick(index)"
        :key="index">
        <image :src="`http://${ip}:3000/images/zhanbu/card.png`" mode="widthFix" class="img-control" />
      </view>
    </view>
    <view class="divination-options" v-if="iswash === false">
      <view class="title">
        <text>选择占卜类型</text>
      </view>
      <view class="options">
        <button class="button-style" :class="{ isSelect: divitype === 1 }" @tap="divitype = 1">单张牌占卜</button>
        <button class="button-style" :class="{ isSelect: divitype === 3 }" @tap="divitype = 3">三张牌占卜</button>
      </view>
    </view>
    <view class="area-box" v-if="iswash === false">
      <view class="area-bg">
        <image :src="`http://${ip}:3000/images/zhanbu/textarea.png`"  mode="scaleToFill" class="bg-img-control" />
        <textarea v-model="textWord" placeholder="请在这里输入你想要占卜的内容(不超过六十字)"
          placeholder-style="color:rgb(193, 212, 252)"></textarea>
      </view>
    </view>
    <view class="selected-cards" v-if="iswash === true">
      <view v-for="(it, index) in selected_cards" :key="index" :class="{ actived: selectNum > index }"
        class="selected-card">
        <image :src="it.url" mode="widthFix" class="img-control"
          :class="{ reversedCard: it.orientation === 'Reversed' }" />
        <view class="selected-card-word">
          <view><text>{{ it.name }}</text></view>
          <view><text>{{ it.orientation }}</text></view>
        </view>
      </view>
    </view>

    <view class="wash-card">
      <button :disabled="textWord === '' || divitype === 0 || selectNum != 0" class="button-style" @tap="startShuffle"
        v-if="!(textWord === '' || divitype === 0 || selectNum != 0)">开始洗牌</button>
    </view>

    <view class="inter-card">
      <button v-if="selectNum >= divitype" class="button-style" @tap="toInterpretation">解读牌面</button>
    </view>
  </view>
</view>
</template>


<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import {httpStream} from '@/utils/http'
import emitter from '@/utils/emitter';
import { useServerConfig } from '@/stores';
const { ip } = useServerConfig()
const emit = defineEmits(['be-change']);
interface Card {
  id: number;
  name: string;
  orientation: 'Upright' | 'Reversed';
  url: string;
}
let divitype = ref(0);  // 选择哪一种牌阵
let textWord = ref('');  // 用户输入的文本
let iswash = ref(false)  // 判断是否已经经历过第一次洗牌，用来定义布局
let selected = ref(false)  // 判断是否已经抽牌

let selectNum = ref(0)   // 记录选择的牌数
let selected_cards = ref<Card[]>([])  // 已经选择的牌

const cards = ref<Card[]>(
  Array.from({ length: 22 }, (_, index) => ({
    id: index,
    name: [
      '愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', '力量', '隐士',
      '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳',
      '审判', '世界'
    ][index],
    url: [
      `http://${ip}:3000/images/zhanbu/cards/fool.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/magician.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/priestess.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/empress.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/emperor.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/hierophant.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/lovers.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/chariot.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/strength.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/hermit.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/wheel.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/justice.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/hangedMan.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/death.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/temperance.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/devil.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/tower.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/star.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/moon.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/sun.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/judgement.jpg`,
      `http://${ip}:3000/images/zhanbu/cards/world.jpg`
    ][index],
    orientation: 'Upright',
  }))
);  // 初始化卡牌数组



const selectedCardIndex = ref<number | null>(null); // 记录当前选中的卡牌索引
const isShuffling = ref(false); //记录每一次的洗牌状态

// 处理卡牌点击事件
function handleCardClick(index: number): void {
  if (!selected.value) {
    console.log("还没洗牌");
    return;
  }
  if (selectedCardIndex.value === index && selectNum.value < divitype.value) {
    cards.value.splice(index, 1);
    selectedCardIndex.value = null;
    selectNum.value++;
    return;
  }
  else if (selectNum.value >= divitype.value) {
    return;
  }
  else {
    selectedCardIndex.value = index;
    return;
  }
}


// 洗牌函数
function shuffleArray(array: Card[]): Card[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    array[i].orientation = Math.random() < 0.5 ? 'Upright' : 'Reversed';
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 开始洗牌动画
function startShuffle(): void {
  if (isShuffling.value) return;
  cards.value = shuffleArray(cards.value);
  isShuffling.value = true;
  iswash.value = true;
  if (selected_cards.value.length != 0) {
    selected_cards.value = [];
  }
  let j: number[] = [];
  while (true) {
    const index = Math.floor(Math.random() * cards.value.length);
    if (j.includes(index)) continue;
    j.push(index);
    selected_cards.value.push(cards.value[index]);
    if (j.length == divitype.value) break;
  }
  selected.value = true;
   setTimeout(() => {
    isShuffling.value = false;
  }, 1000);
}

// #region 开始解读
async function toInterpretation() {
  let cards = []
  for(let i=0;i<selected_cards.value.length;i++){
    cards.push({position:i+1,orientation:selected_cards.value[i].orientation,card:selected_cards.value[i].name})
  }
  const spread = divitype.value===3?'圣三角牌阵':'单张牌阵'
  uni.showLoading({
    title:'请耐心等待...'
  })
  const res:any = await httpStream({
    url:'/divi/access',
    method:'POST',
    data:{
      spread,
      userInput:textWord.value,
      cards
    }
  })
  res.onChunkReceived((e: any) => {
    try {
      // 类型安全转换
      const buffer = e.data instanceof ArrayBuffer ? 
        new Uint8Array(e.data) : 
        new Uint8Array(0);

      // 二进制转字符串
      let str = '';
      for (let i = 0; i < buffer.length; i++) {
        str += String.fromCharCode(buffer[i]);
      }
      const decoder = new TextDecoder('utf-8');
      const txt = decoder.decode(buffer);
      // const txt = decodeURIComponent(escape(str));
      // console.log(txt);
      console.log(txt);
      
      // 结束事件判断
      if (txt.includes('end')) {
        uni.hideLoading();
        return;
      }

      // 错误处理
      if (txt.includes('error')) {
        uni.hideLoading();
        uni.showToast({ title: '出现错误', icon: 'none' });
        return;
      }

      // 数据处理
      const data = JSON.parse(txt);
      emitter.emit('getResult', [data, selected_cards.value]);
      emit('be-change', 'interpretation')
    } catch (err) {
      console.error('数据解析失败:', err);
      uni.hideLoading();
    }
  });
}
// #endregion

</script>


<style scoped>
.cards {
  position: relative;
 
  width: 50%;
  height: 200rpx;
  margin: 0 auto;
}

.card{
  position: absolute;
  transform-origin: center top;
  transition: 
    transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
    opacity 0.3s ease;
  transform: translateX(var(--translate-x)) rotate(var(--rotate)) translateY(var(--translate-y));
}

.card.selected {
  transform: 
    translateX(var(--translate-x)) 
    rotate(var(--rotate)) 
    translateY(calc(var(--translate-y) + 10%));
}

.card.shuffleAnimation {
  animation: shuffle 1s ease-in-out forwards; 
}

@keyframes shuffle {
  0%{
    transform: translateX(var(--translate-x)) rotate(var(--rotate)) translateY(var(--translate-y));
  }
  50%{
    transform: translateX(0%) rotate(180deg) translateY(50%);
  }
  100%{
    transform: translateX(var(--translate-x)) rotate(var(--rotate)) translateY(var(--translate-y));
  }
  
}

.img-control {
  width: 150rpx;
}


.selected-cards {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.reversedCard {
  transform: rotate(180deg);
}

.divination-options {
  width: 100%;
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  top: 40%;
  text-align: center;
}

.title {
  position: relative;
  width: fit-content;
  margin: 20px auto;
  padding-left: 5rpx;
  letter-spacing: 2rpx;
  margin-bottom: 60rpx;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10rpx;
  font-weight: 700;
}

.options {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.button-style {
  width: 250rpx;
  height: 70rpx;
  font-size: 30rpx;
  border-radius: 20rpx;
  background-color: rgb(208, 190, 118);
  color: white;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  width: 90rpx;
  height: 54rpx;
  background-image: url('http://luostir.top/images/zhanbu/leftdecoration.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.title::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
  width: 90rpx;
  height: 54rpx;
  background-image: url('http://luostir.top/images/zhanbu/rightdecoration.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.isSelect {
  background-color: rgb(240, 207, 75);
  color: rgb(68, 42, 114);
  font-weight: 700;
}

.area-box {
  width: 90%;
  height: 300rpx;
  position: absolute;
  top: 55%;
  transform: translateX(-50%);
  left: 50%;
}

textarea {
  width: 85%;
  height: 75%;
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  padding: 30rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  transform: translate(-50%, -50%);
  font-size: 28rpx;
  background-color: rgba(72, 59, 138, 0.6);
}

.area-bg {
  width: 100%;
  height: 100%;
  position: relative;
}

.bg-img-control {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  top: 0;
  left: 0;
}

.wash-card,
.inter-card {
  position: absolute;
  top: 80%;
  transform: translateX(-50%);
  left: 50%;
}

.selected-card-word {
  color: rgb(229, 192, 46);
  border-radius: 10rpx;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
  background-color: rgba(72, 59, 138, 0.6);
}

.selected-card {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.actived {
  opacity: 1;
}
</style>