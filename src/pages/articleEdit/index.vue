<template>
  <view class="page">
    <!-- 顶部详情区 start-->
    <view class="type-box" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="iconfont icon-arrow-left" @tap="backPage"></view>
      <view class="type" style="flex:1;text-align: center;">
        <text>发布帖子</text>
      </view>
    </view>
    <!-- 顶部详情区 end-->
    <scroll-view scroll-y class="content-wrapper" enable-flex>
      <view class="title">
        <view style="min-width: 40px;">
          <text>标题</text>
        </view>
        <input type="text" placeholder="请输入标题" v-model="form.title" style=" padding-left: 10rpx;font-weight: 700;"/>
        <view class="submit-btn" @tap="publishArticle">发布</view>
      </view>
      <view class="area">
        <view style="min-width: 40px;"><text>标签:</text></view>
        <!-- <view class="selectArea"><text>{{ area }}</text></view> -->
        <picker @change="bindChange" :value="value" :range="areas">
          <view class="selectArea">{{ areas[value] }}</view>
        </picker>
      </view>
      <view class="cover">
        <view><text>封面</text></view>
        <view style="position: relative;" @tap="uploadCover">
          <image
          :src="form.coverUrl"
          mode="aspectFit"
          :class="form.coverUrl===''? 'img-area': 'cover-img'"
        />
        <view style="position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);color: #ccc;" v-if="form.coverUrl===''"><text>点击添加</text></view>
        </view>
      </view>

      <!-- 工具栏：包含格式化按钮 -->
      <view class="toolbar" @tap="format">
        <!-- 加粗按钮，.bold是否为true -->
        <view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
        <!-- 斜体按钮 -->
        <view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
        <!-- 下划线按钮 -->
        <view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>

        <!-- 文本对齐按钮：左对齐，center，justify排除百度小程序兼容性 -->
        <!-- 左对齐按钮，判断是否选中 -->
        <view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align"
        data-value="left"></view>
        <!-- 中心对齐按钮 -->
        <view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-fuhao-juzhongduiqi" data-name="align"
        data-value="center"></view>
        <!-- 右对齐按钮 -->
        <view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align"
        data-value="right"></view>
        <!-- 两端对齐按钮 -->
        <view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-wendang-zuoyouduiqi" data-name="align"
        data-value="justify"></view>

        <!-- 撤销和重做按钮，分别调用undo和redo函数 -->
        <view class="iconfont icon-weibiaoti545" @tap="undo"></view>
        <view class="iconfont icon-zhongzuo" @tap="redo"></view>

        <!-- 缩进和增加缩进，分别设置data-value="-1"和"+1" -->
        <view class="iconfont icon-waisuojin" data-name="indent" data-value="-1"></view>
        <view class="iconfont icon-neisuojin" data-name="indent" data-value="+1"></view>
        <!-- 标题按钮，设置为标题1格式 -->
        <view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-H-" data-name="header"
        :data-value="1"></view>
        <!-- 图片插入按钮，调用insertImage函数 -->
        <view class="iconfont icon-addpicture" @tap="insertImage"></view>
        <!-- 清除内容按钮，调用clear函数 -->
        <view class="iconfont icon-huishou" @tap="clear"></view>
      </view>

      <!-- 富文本编辑器 -->
      <editor id="editor" class="ql-container" :placeholder="placeholder" show-img-size show-img-toolbar show-img-resize="true"
        @statuschange="onStatusChange" @ready="onEditorReady" @input="updateContent" :adjust-position="false"
      ></editor>
  </scroll-view>
  
 
  </view>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useServerConfig } from '@/stores';
const { serverUrl} = useServerConfig();
import { http,upload } from '@/utils/http';




const formats = ref({
  bold:false,
  italic:false,
  underline:false,
  align:'left',
  header:0,
})
const placeholder = ref('请输入信息...')
const editorCtx = ref(null)
const form = ref({
  title:'',
  coverUrl:'',
  xiangQing:''
})
const { safeAreaInsets } = uni.getSystemInfoSync()



function backPage() {
  uni.navigateBack()
}

// #region 编辑器初始化
const onEditorReady = () => {
  uni.createSelectorQuery().select('#editor').context((res:any) => {
    editorCtx.value = res.context
    if(form.value.xiangQing && editorCtx.value!= null) {
      (editorCtx.value as any).setContents({
        html: form.value.xiangQing
      })
    }
  }).exec()
}
// #endregion

// #region 设置富文本的格式化功能
const format = (e:any)=> {
  const {name,value} = e.target.dataset
  if(!name)return
  if(editorCtx.value!= null){
    (editorCtx.value as any).format(name,value)
  }
}
// #endregion

// #region 更新格式化状态
// 意思就是当用户选中某一段文字的时候，会触发onStatusChange函数，
// 这个函数会获取到当前选中的文字的格式化状态，然后将这个状态赋值给formats.value，
// 然后工具栏中的各种按钮就会根据这个状态来判断是否选中，从而显示不同的样式，让用户能够清楚知道当前的操作状态。
const onStatusChange = (e:any)=> {
  const format = e.detail //获取格式化状态
  formats.value = format
}
// #endregion

// #region 撤销操作
const undo = ()=>{
  if(editorCtx.value == null)return
  (editorCtx.value as any).undo()
}
// #endregion

// #region 重做操作
const redo = ()=>{
  if(editorCtx.value == null)return
  (editorCtx.value as any).redo()
}
// #endregion

// #region 清空编辑器操作
const clear = ()=>{
  uni.showModal({
    title:'清空编辑器',
    content:'确定清空编辑器内容吗？',
    success: (res)=>{
      if(res.confirm) {
        if(editorCtx.value == null)return
        (editorCtx.value as any).clear({success:()=>console.log('清空成功')}
        )
      }
    }
  })
}
// #endregion

// #region 获取编辑器内容
const updateContent = (e:any)=>{
  const content = e.detail //获取编辑器内容
  form.value.xiangQing = content.html
  // console.log(form.value.xiangQing);
}
// #endregion



const uploadedImages = ref<Set<string>>(new Set());

  
// #region 插入图片
const insertImage = async ()=>{
  try{
    const res = await uni.chooseImage({
      count:1,
      sourceType:['album','camera']
    });
    const filePath = res.tempFilePaths[0]
    uni.showLoading({title:'上传中...'});

    const uploadRes = await upload({
      url:`${serverUrl}/api/upload`,
      filePath:filePath,
      name:'post'
    })

    console.log(uploadRes);
    
    const serverImageUrl = (uploadRes as any).result.url
    
    // 记录已经上传的图片
    uploadedImages.value.add(serverImageUrl);

    // 插入图片到编辑器中
    if(editorCtx.value == null)return
    (editorCtx.value as any).insertImage({
      src:serverImageUrl,
      alt:'图像',
      success:()=>{
        console.log('插入成功')
      },
      fail:(err:any)=>{
        console.log('插入失败',err);
      }
    })
    uni.hideLoading()

  }catch(err){
    uni.hideLoading()
    console.log('上传失败'+err);
    uni.showToast({
      title:'上传失败',
      icon:'error'
    })
  }
}
// #endregion

// #region发布文章
const publishArticle = async ()=>{


  if(form.value.xiangQing === ''){
    uni.showToast({
      title:'内容不能为空',
      icon:'none'
    })
    return
  }else if(form.value.title === ''){
    uni.showToast({
      title:'标题不能为空',
      icon:'none'
    })
    return
  }else if(form.value.coverUrl === ''){
    uni.showToast({
      title:'封面不能为空',
      icon:'none'
    })
    return
  }
  try{
    uni.showLoading({title:'发布中...'})
    const usedImages = filterImage(form.value.xiangQing);
    usedImages.push(form.value.coverUrl);
    // 选出需要删除的图片
    const deleteImages = Array.from(uploadedImages.value).filter(url => !usedImages.includes(url));
    const time = new Date();
    // 提交内容和删除无用图片
    const res = await http({
      url:`${serverUrl}/community/uploadPost`,
      method:'POST',
      header: {
        'Content-Type': 'application/json' // 确保设置了这个
      },
      data:{
        title:form.value.title,
        area:areas[value.value],
        coverImage:form.value.coverUrl,
        time:`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`,
        content:form.value.xiangQing,
        deleteImages,
      }
    })
    console.log(res.message);
    

    // 更新已经上传的图片
    usedImages.forEach(url => {
      uploadedImages.value.add(url);
    });
    deleteImages.forEach(url => {
      uploadedImages.value.delete(url);
    });
    uni.hideLoading()
    uni.showToast({
      title:'发布成功',
      icon:'success'
    })
   
  }catch(err){
    uni.hideLoading()
    uni.showToast({
      title:'发布失败',
      icon:'error'
    })
    console.log('发布失败'+err);
  }
}
// #endregion

// #region 选出富文本中的图片
const filterImage = (htmlContent:string)=>{
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls:string[] = [];
  let match ;
  while((match = imgRegex.exec(htmlContent))){
    urls.push(match[1])
  }
  return urls;
}
// #endregion

// #region 上传封面
const uploadCover = async ()=>{
  try{
    const res = await uni.chooseImage({
      count:1,
      sourceType:['album','camera']
    });
    const filePath = res.tempFilePaths[0]
    uni.showLoading({title:'上传中...'});

    const uploadRes = await upload({
      url:`${serverUrl}/api/upload`,
      filePath:filePath,
      name:'post'
    })
    // 上传图片到服务器中，并获取服务器返回的url
    // const uploadRes = await uni.uploadFile({
    //   url:`${serverUrl}/api/upload`,    
    //   filePath:filePath,
    //   name:'post'
    // })
    console.log(uploadRes.result);
    const serverImageUrl = (uploadRes.result as any).url
    uploadedImages.value.add(serverImageUrl);
    form.value.coverUrl = serverImageUrl;
    uni.hideLoading()
  }catch(err:any){
    uni.hideLoading()
    uni.showToast({
      title:'上传失败',
      icon:'error'
    })
    console.log(err);
  }
}
// #endregion

// #region 选择标签
const areas = ['崩铁', '原神', '鸣潮', '明日方舟', '壁纸',' 语录', '动漫']
const value = ref(0)
function bindChange(e:any) {
  value.value = e.detail.value;
  console.log('选择的标签是：', areas[value.value]);
}
// #endregion


</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}


.type {
  font-size: 30rpx;
  font-weight: 700;
  color: black;
}

.type-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx;
  background-color: rgb(245, 245, 245);
  height: 200rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.area{
  display: flex;
  justify-content: flex-start;
  position: relative;
  margin: 0 30rpx;
  margin-bottom: 30rpx;

}

.selectArea {
 font-weight: 700;
  padding-left: 50rpx;
}


.title{
  display: flex;
  justify-content: space-between;
  margin: 0 30rpx;
  margin-bottom: 30rpx;
}



.cover{
  display: flex;
  justify-content: flex-start;
  max-height: 200rpx;
  margin: 0 30rpx;
  margin-bottom: 30rpx;
  
}
.cover-img {
  width: 400rpx;

  max-height: 200rpx;
}
.img-area{
  /* position: relative; */
  width:400rpx;
  height: 200rpx;
  margin-left: 20rpx;
  border-radius: 10rpx;
  border: 1px solid #ccc;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 20rpx;
}

.toolbar .iconfont {
  text-align: center;
  flex: 0 0 10%;
  margin: 5px;
  transition: color 0.3s, transform 0.3s;
  cursor: pointer;
}

.toolbar .ql-active {
  color: #497749;
  font-weight: bold;
}

.ql-container {
  box-sizing: border-box;
  padding: 12px 15px;
  width: 100%;
  min-height: 50vh;
  height: 0;
  flex: 1;
  
  background: #fff;
  margin-top: 30rpx;
  font-size: 16px;
  line-height: 1.5;
  border: 1rpx solid #f2f2f2;
  border-radius: 15rpx;
}

/* 添加提交按钮样式 */
.submit-btn {
 
  /* margin: 30rpx auto; */
  width: 20%;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  background-color: #398de0;
  color: white;
  border-radius: 40rpx;
  font-size: 32rpx;
}

</style>


