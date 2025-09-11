import type { TouchEvent } from "@uni-helper/uni-app-types";

type TouchType = "up" | "down" | "left" | "right" | "";
type TouchCallback = (touchType: TouchType) => void;
type TouchInfo = {
  startX: number;
  startY: number; 
  endX: number; 
  endY: number;
  touchType: TouchType;
}
class Touch {
  private touchInfo: TouchInfo;
  private onTouchEndCallback: TouchCallback | null;

  constructor() {
    this.touchInfo = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      touchType: ""
    }
    this.onTouchEndCallback = null;
  }

  // 设置触摸结束回调
  /**
   * @description: 设置触摸结束回调
   * @param {TouchCallback} callback
   * @return {*}
   */
  setOnTouchEnd(callback: TouchCallback) {
    this.onTouchEndCallback = callback;
  }

  TouchStart(e: TouchEvent) {
    const { clientY, clientX } = e.changedTouches[0];
    if(clientX && clientY){
       this.touchInfo.startX = clientX;
       this.touchInfo.startY = clientY;
    }
   
  }

  TouchEnd(e: TouchEvent) {
    const { clientY, clientX } = e.changedTouches[0];
    this.touchInfo.endX = clientX as number;
    this.touchInfo.endY = clientY as number;
    const diffX = this.touchInfo.endX - this.touchInfo.startX;
    const diffY = this.touchInfo.endY - this.touchInfo.startY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    if (absDiffY > 20 && absDiffX < absDiffY) {
      this.touchInfo.touchType = diffY > 0 ? "down" : "up";
    } else if (absDiffX > 20 && absDiffY < absDiffX) {
      this.touchInfo.touchType = diffX > 0 ? "left" : "right";
    }

    // 触发回调（如果存在）
    if (this.onTouchEndCallback) {
      this.onTouchEndCallback(this.touchInfo.touchType);
    }
  }

  // 获取触摸信息
  /**
   * @description: 获取触摸信息
   * @return {TouchInfo}
   */
  GetTouchInfo() {
    return this.touchInfo;
  }
}

export default Touch;