<template>
  <view  class="comment-nav-box" 
      @touchstart="touch.TouchStart" 
      @touchend="touch.TouchEnd"
      @mousedown="touch.TouchStart"
      @mouseup="touch.TouchEnd"
      :style="{transform: `translateY(${translateY}px)`}"
    >
      <view class="nav">
        <view class="nav-bar">
          <view v-for="(item, index) in list" :key="item.id" class="nav-option" @tap="changeArea(index)"
            :class="{ NavActive: currentArea === index }">
            <image :src="item.imgUrl" class="nav-image-control" />
            <view class="word-control">
              <text>{{ item.text }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="options">
          <view v-for="(it, index) in orderTypes" class="option" :class="{ active: currentOrder === index }" :key="it"
            @tap="change(index)"><text>{{ it }}</text>
          </view>
           <view class="iconfont icon-shuaxin" :class="{reload:isreload}" @tap="reload"></view>
      </view>
      <scroll-view :scroll-y="canScroll" class="scroll-box"  @scroll="onScroll" @scrolltoupper="scrollTop=0" @scrolltolower="loadMore">
        <view class="waterfall-page">
          <view class="waterfallPageColumn"  v-for="(item,index) in waterfall.columnList" :key="index" ref="column">
            <view class="waterfall-page-item" v-for="(it,pIndex) in item" :key="pIndex" @tap="toDetail(it.id)" :style="{backgroundColor:`rgb(${it.themeColor})`}">
              <view>
                <image :src="it.coverImage" mode="widthFix" class="image-control" />
                <view class="msg">
                  <view class="msg1">
                    <view v-if="it.type !== '' && it.type !== null" class="type" :class="it.type === '活动' ? 'type1' : 'type2'">
                      <text style="text-wrap: nowrap;">{{ it.type }}</text>
                    </view>
                    <view class="title">
                      <text>{{ it.title }}</text>
                    </view>
                  </view>
                  <view class="userName">
                    <text v-if="it.author !== ''" style="font-size: 24rpx;">{{ it.author }}</text>
                    <view style="display: flex;">
                      <text style="padding-right:10rpx;">{{ it.praise }}</text>
                      <view class="iconfont icon-ego-heart"></view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="isLoading || isInit" class="loading"><text>加载中...</text></view>
      </scroll-view>
    </view>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted ,watch} from 'vue'
import {http} from '@/utils/http'
import { getImageInfo } from '@/utils/DrawImage';
import Touch from '@/utils/TouchEvent'
import { useServerConfig } from '@/stores';
const { serverUrl} = useServerConfig();
let orderTypes: string[] = ['最新', '关注']

interface Item {
  id: number;
  imgUrl: string;
  text: string;
}
const list: Item[] = [
  { id: 1, imgUrl: `${serverUrl}/images/public/nav_imgs/liuying.png`, text: "崩铁" },
  { id: 2, imgUrl: `${serverUrl}/images/public/nav_imgs/hutao.png`, text: "原神" },
  { id: 3, imgUrl: `${serverUrl}/images/public/nav_imgs/jinxi.png`, text: "鸣潮" },
  { id: 4, imgUrl: `${serverUrl}/images/public/nav_imgs/amiya.png`, text: "明日方舟" },
]


// #region 切换区域
let currentArea = ref(0)
function changeArea(index: number) {
  currentArea.value = index
}
// #endregion


// #region 创建瀑布流式布局
let waterfall = reactive({
  columnList: [] as any[],
  columnHeight: [] as number[],
  columnNum: 2, // 定义几列
})


// 初始化瀑布流布局
async function InitWaterfall() {
  for(let i =0;i<waterfall.columnNum;i++) {
    waterfall.columnList.push([])
    waterfall.columnHeight.push(0)
  }
 
}

// 计算瀑布流布局
let itemList = ref<any[]>([])
async function SetWaterfall() {
  console.log(itemList.value);
  try{
    // 这里不能使用foreach，因为foreach是异步的，会导致异步请求的结果顺序不一致，导致布局不一致
    for(let i = 0 ;i<itemList.value.length;i++) {
      let { height } = await getImageInfo(itemList.value[i].coverImage)
      let columnIndex = waterfall.columnHeight.indexOf(Math.min(...waterfall.columnHeight))
      waterfall.columnList[columnIndex].push(itemList.value[i])
      waterfall.columnHeight[columnIndex] += height
      // console.log("NO"+i,columnIndex,itemList.value[i],height,waterfall.columnHeight[columnIndex]);
    }
  }catch(err){
    console.log(err);
  }
  
}
// #endregion

// #region 切换排序规则
let currentOrder = ref(0)
function change(index: number) {
  currentOrder.value = index
}
// #endregion

// #region 跳转到详情页面
function toDetail(id:any) {
  uni.navigateTo({
    url: '/pages/showDetail/index',
    success: (res) => {
      console.log('跳转成功');
      uni.request({
        url:`${serverUrl}/community/getPostInfo`,
        method:'GET',
        data:{
          id,
        },
        success:(result)=>{
          console.log(result);
          res.eventChannel.emit('detailOption', {data:result.data,type:'帖子'})
      }});
     
    },
  })
}
// #endregion

// #region 检测用户的下拉和上拉事件
const translateY = ref(0)
const touch = new Touch()
touch.setOnTouchEnd((type)=>{
  const absDiffY = Math.abs(touch.GetTouchInfo().endY-touch.GetTouchInfo().startY)
  if(type === "up") {
    translateY.value = Math.max(Math.min(translateY.value,translateY.value-absDiffY),-200)
  }else if(type === "down"){
    if(scrollTop.value !=0) return
    translateY.value = Math.min(Math.max(translateY.value,translateY.value+absDiffY),0)
  }
})





let scrollTop = ref(0)
let canScroll = ref(false)

function onScroll(e:any){
  scrollTop.value = Math.floor(e.detail.scrollTop) 
}

watch(()=>translateY.value,(newVal,oldVal)=>{
 if(newVal === -200){
  canScroll.value = true
 }else{
  canScroll.value = false
 }
})
// #endregion

// #region 挂载完成后初始化数据和布局
let isInit = ref(false)
onMounted(async () => {
  isInit.value = true
  const res = await http({
    url:'/community/initPost',
    method:'GET',
    data:{
      pageSize:10,
      page:1
    }
  })
  itemList.value = await (res.result as any);
  InitWaterfall()
  SetWaterfall()
  isInit.value = false
})
// #endregion

// #region 刷新页面
const isreload = ref(false)
async function reload(){
  if(isreload.value) return
  uni.showLoading({
    title: '加载中',
    mask:false,
  })
  isreload.value = true
  try{
    const res = await  http({
    url:'/community/initPost',
    method:'GET',
    data:{
      pageSize:10,
      page:1 
    }
  })
  itemList.value = await (res.result as any);
  waterfall = {
    columnList: [] as any[],
    columnHeight: [] as number[],
    columnNum: 2,
  }
  InitWaterfall()
  SetWaterfall()
  }catch(err){
    console.log(err);
  }finally{
    uni.hideLoading()
    setTimeout(()=>{
      isreload.value = false
    },1000)
  }
 
}
// #endregion


// #region 加载更多图片
const page = ref(1)
const isLoading = ref(false)
async function loadMore(){
  if(isLoading.value) return 
  isLoading.value = true
  try{
    const res = await http({
    url:'/community/getMorePost',
    method:'GET',
    data:{
      pageSize:10,
      page:page.value + 1
    }
  })
  itemList.value = await (res.result as any);
  console.log("加载成功");
  page.value++;
  SetWaterfall();
  }catch(err){
    console.log(err); 
  }finally{
    isLoading.value = false
  }
}


// #endregion
</script>



<style scoped>
.comment-nav-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  transform: translateY(0);
  transition: transform 0.3s ease-out;
  border-radius: 20rpx;
  box-shadow: 0px -2px 10px 10px rgba(0,0,0,0.3);
  background-color: #fff;
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

.nav-image-control {
  width: 120rpx;
  height: 120rpx;
  color: rgb(183, 183, 183);

}

.word-control {
  transform: translateY(-50%);
}

.NavActive {
  color: rgb(48, 127, 217);
}

.options {
  display: flex;
  width: 30%;
  list-style: none;
  padding-left: 50rpx;
  justify-content: space-around;
}

.option {
  font-weight: 700;
  font-size: 25rpx;
}

.iconfont.icon-shuaxin {
  position: absolute;
  right: 40rpx;
  color: #ccc;
  font-size: 25rpx;
}

.reload {
 animation: load 1s ease-in-out 1 forwards;
}

@keyframes load {
  0% {
    transform: rotate(0deg); 
  }
  100% {
    transform: rotate(360deg); 
  }
  
}


.scroll-box{
  margin-top: 20rpx;
  flex: 1;
  height: 0; /* flex布局中关键设置 */
  overflow-y: auto;
  padding-bottom: 50rpx;
}

.waterfall-page{
  display: flex;
  align-items: flex-start;
}

.waterfallPageColumn {
  flex: 1;
  width: 0;
  padding:0 20rpx;
}

.waterfall-page-item {
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.msg {
  padding: 15rpx;
}

.msg1 {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.type {
  min-width: 80rpx;
  min-height: 35rpx;
  margin-left: 10rpx;
  line-height: 35rpx;
  color: #fff;
  font-size: 20rpx;
  text-align: center;
}

.image-control {
  width: 100%;
  border-radius: 20rpx;
  box-shadow: 2px 4px 8px 4px rgba(0, 0, 0, 0.3);
  /* filter: saturate(110%); */
  /* 这个属性可能会导致图片加载不出来 */
}

.title {
  width: fit-content;
  font-size: 24rpx;
  font-weight: 700;
  padding-left: 10rpx;
}

.userName {
  display: flex;
  padding-right: 20rpx;
  justify-content: space-between;
  padding-left: 10rpx;
  padding-top: 8rpx;
  font-size: 20rpx;
  color: rgb(0, 0, 0);
  font-family: 思源黑体;
}


.type1 {
  width: 60rpx;
  height: 30rpx;
  border-radius: 20rpx;
  background-color: rgb(42, 130, 228);
}

.type2 {
  width: fit-content;
  padding: 0 10rpx;
  height: 30rpx;
  border-radius: 20rpx;
  background-color: rgb(230, 112, 112);
}

.active {
  color: rgb(48, 127, 217);
  background: linear-gradient(to right, rgb(66, 143, 228) 0%, rgb(66, 143, 228) 60%, transparent 60%, transparent 100%) no-repeat;
  background-size: 50% 3px;
  /* 控制下划线的宽度和高度 */
  background-position: 60% 100%;
  /* 将下划线定位在文本底部 */
  padding-bottom: 4px;
  /* 调整下划线与文本的间距 */
}


.loading{
  width: 100%;
  text-align: center;
  font-size: 25rpx;
  color: #ccc;
}
</style>