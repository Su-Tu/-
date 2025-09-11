<template>
  <view class="mask" v-if="visible" @tap="handleMaskClick"></view>
  <view :class="{
    message: mergedOption.type === 'message',
    tip: mergedOption.type === 'tip',
    Input: mergedOption.type === 'Input',
    middleBox: mergedOption.position === 'middle',
    bottomBox: mergedOption.position === 'bottom'
  }" v-if="visible">
    <view class="pop-content" @tap.stop>
      <view class="title" v-if="mergedOption.title !== ''">
        <view :class="'iconfont ' + mergedOption.titleIcon" class="title-icon" :style="mergedOption.titleIconStyle">
        </view>
        <view class="h1-style"><text>{{ mergedOption.title }}</text></view>
      </view>
      <view class="content">
        <view :class="'iconfont ' + mergedOption.contentIcon" class="content-icon"
          :style="mergedOption.contentIconStyle"></view>
        <view class="text-style" v-if="mergedOption.type !== 'Input'"><text>{{ mergedOption.content }}</text></view>

        <input type="text" placeholder="请输入内容" v-model="Text" class="Input-style" v-if="mergedOption.type === 'Input'">

      </view>
      <view class="button-box">
        <view class="cancel-button" v-if="mergedOption.cancelButton.isShow" @tap="handleCancel"
          :style="mergedOption.cancelButton.style">{{ mergedOption.cancelButton.text }}</view>
        <view class="ensure-button" v-if="mergedOption.ensureButton.isShow" @tap="handleConfirm"
          :style="mergedOption.ensureButton.style">{{ mergedOption.ensureButton.text }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';

const emit = defineEmits(['update:visible', 'update:text']);

const props = withDefaults(defineProps<{
  visible: boolean;
  text?: string;
  option?: Partial<{  // 使用 Partial 表示可选覆盖
    type?: 'message' | 'tip' | 'Input';
    position?: 'middle' | 'bottom';
    title?: string;
    titleIcon?: string;
    titleIconStyle: {};
    content?: string;
    contentIcon?: string;
    contentIconStyle?: {};
    cancelButton?: { isShow?: boolean, text?: string, style?: {} };
    ensureButton?: { isShow?: boolean, text?: string, style?: {} };
  }>;
}>(), {
  visible: false,
  text: '',
  option: () => ({}),  // 默认空对象，避免覆盖内部默认值
});

// 合并默认值和传入的 option
const mergedOption = computed(() => ({
  type: 'tip',
  position: 'middle',
  title: '提示',
  titleIcon: 'icon-tishi',
  titleIconStyle: {},
  content: '签到成功',
  contentIcon: 'icon-qiandaochenggong2',
  contentIconStyle: {},
  cancelButton: { isShow: false, text: '取消', style: {} },
  ensureButton: { isShow: false, text: '确定', style: {} },
  ...props.option,  // 传入的 option 覆盖默认值
}));

const Text = ref<string>(props.text)
const handleMaskClick = () => {
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('update:visible', false);
}
const handleConfirm = () => {
  if (Text.value !== undefined && Text.value != '') {
    emit('update:text', Text.value)
  }
  emit('update:visible', false);
};
</script>

<style scoped>
/*遮罩层start*/
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 998;
}

/* 遮罩层end */

/* 弹窗position-style  start */
.middleBox {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 2px 2px 8px 10px rgba(0, 0, 0, 0.2);
  border-radius: 15rpx;
  background-color: #fff;
  z-index: 999;
}


.bottomBox {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 2px 2px 8px 10px rgba(0, 0, 0, 0.2);
  border-radius: 15rpx;
  background-color: #fff;
  z-index: 999;
}

/* 弹窗position-style  end */

.pop-content {
  position: relative;
}

/* 弹窗title-style start */
.title {
  display: flex;
  margin-top: 20rpx;
  justify-content: center;
  align-items: center;
}

.title-icon {
  font-size: 40rpx;
  color: rgb(217, 217, 217);
}

.h1-style {
  padding-left: 20rpx;
  font-size: 32rpx;
  font-weight: 700;
  text-align: center;
}

/* 弹窗title-style end */

/* 弹窗content-style start */
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx 40rpx;
  padding-top: 25rpx;
  text-align: center;
  box-sizing: border-box;
}

.content-icon {
  font-size: 40rpx;
  color: rgb(234, 234, 234);
}

.text-style {
  font-size: 28rpx;
  padding-left: 30rpx;
}

.Input-style {
  background-color: #f5f5f5;
  font-size: 25rpx;
  width: 90%;
  min-height: 60rpx;
  border-radius: 10rpx;
}

/* 弹窗content-style end */

/* 弹窗type-style start */
.message {
  width: 450rpx;
  height: 250rpx;
}

.tip {
  width: 450rpx;
  height: fit-content;
  min-height: 90rpx;

}

.Input {
  width: 100%;
  height: 280rpx;
}

/* 弹窗type-style end */


/* 弹窗button-style start */
.button-box {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.cancel-button,
.ensure-button {
  padding: 10rpx 30rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.ensure-button {
  background-color: rgb(61, 146, 231);
  color: white;
}

/* 弹窗button-style end */
</style>