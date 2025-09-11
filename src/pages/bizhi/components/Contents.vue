<template>
  <view class="content-box">
    <scroll-view scroll-y class="scroll-box">
      <view class="waterfall-box">
        <view class="col-item" v-for="(col,index) in waterfall.colList" :key="index">
          <view v-for="(it,it_index) in col" :key="it_index" class="item"> 
            <image :src="it.url" mode="widthFix" class="img-control" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>


<script setup lang="ts">
import { reactive, onMounted} from 'vue'
import { useServerConfig } from '@/stores';
import { getImageInfo } from '@/utils/DrawImage';
const {ip} = useServerConfig();

let itemList = reactive([
  {
    url: `http://${ip}:3000/images/community/bengtie.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/daheita.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/zhigengniao.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/kelala.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/tibao.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/jingliu.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/wandi.jpg`,
  },
  {
    url: `http://${ip}:3000/images/community/danheng.jpg`,
  }
])

let waterfall = reactive({
  columns: 2, // 列数
  columnHeights: [] as number[], // 每列的高度
  colList: [] as any[] // 每列的元素列表
})

function InitWaterfall() {
for (let i = 0; i < waterfall.columns; i++) {
  waterfall.columnHeights.push(0)
  waterfall.colList.push([])
}
}

function SetWaterfall() {
  itemList.forEach( async(item, index) => {
    try{
      let { height } = await getImageInfo(item.url)
      let minIndex = waterfall.columnHeights.indexOf(Math.min(...waterfall.columnHeights))
      waterfall.columnHeights[minIndex] += height
      waterfall.colList[minIndex].push(item)
    }catch(e){
      console.log(e) 
    }
  })
}
onMounted(() => {
  InitWaterfall()
  SetWaterfall()
})

</script>



<style scoped>
.content-box {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  margin-top: 30rpx;
}

.scroll-box {
  flex:1;
  height: 0;
  overflow: auto;
}

.waterfall-box {
 display: flex;
 align-items: flex-start;
}

.col-item{
  flex: 1;
  width: 0;
  padding: 20rpx;
}

.item {
  margin-bottom: 50rpx;
  border-radius: 20rpx;
  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.5);
}

.img-control {
  width: 100%;
  border-radius: 20rpx;
  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.4);
}
</style>