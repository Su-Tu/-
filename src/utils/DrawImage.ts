import { type ComponentInternalInstance } from "vue";
// 获取图片信息
export const getImageInfo = (src: string): Promise<{ width: number, height: number, path: string }> => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => resolve(res),
      fail: reject
    })
  })
}
// 获取图片像素信息
export const getImageData = (canvasId: string, x: number, y: number, width: number, height: number, instance: ComponentInternalInstance | null): Promise<Uint8ClampedArray> => {
  return new Promise((resolve, reject) => {
    uni.canvasGetImageData({
      canvasId,
      x,
      y,
      width,
      height,
      success: (res: any) => resolve(res.data),
      fail: reject
    }, instance) //注意点1： 这里的instance一定要写，否则在自定义组件中使用该方法会报错，提示画布为空，因为没有这个实例，该方法是不会根据canvasId在当前实例中查找画布的
  })
}
// 创建画布上下位文
export const InitCanvas = (canvasId: string, instance: ComponentInternalInstance | null): Promise<UniNamespace.CanvasContext> => {
  return new Promise((resolve, reject) => {
    resolve(uni.createCanvasContext(canvasId, instance)) // 注意点2： 这里的instance一定要写，否则在自定义组件中使用该方法会报错，提示画布为空，因为没有这个实例，该方法是不会根据canvasId在当前实例中查找画布的
  })
}

export const getImageColor = (data: Uint8ClampedArray | number[]): string => {
  return `rgba(${data[0]}, ${data[1]}, ${data[2]}, 1)`;
};

// 计算像素平均值
export const getPixelAverage = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {

  let [r, g, b] = [0, 0, 0];
  const total: number = width * height;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const index = (width * row + col) * 4;
      r += data[index];     // R 值
      g += data[index + 1]; // G 值
      b += data[index + 2]; // B 值
    }
  }

  const averageR = Math.round(r / total);
  const averageG = Math.round(g / total);
  const averageB = Math.round(b / total);

  // console.log([averageR, averageG, averageB, 255]);

  return new Uint8ClampedArray([averageR, averageG, averageB, 255]);
};

/**
 * 颜色盒子类
 *
 * @param {Array} colorRange    [[rMin, rMax],[gMin, gMax], [bMin, bMax]] 颜色范围
 * @param {any} total   像素总数, imageData / 4
 * @param {any} data    像素数据集合
 */
class ColorBox {
  colorRange: unknown[];
  total: number;
  data: Uint8ClampedArray;
  volume: number;
  rank: number;
  constructor(colorRange: any[], total: number, data: Uint8ClampedArray) {
    this.colorRange = colorRange;
    this.total = total;
    this.data = data;
    this.volume = (colorRange[0][1] - colorRange[0][0]) * (colorRange[1][1] - colorRange[1][0]) * (colorRange[2][1] - colorRange[2][0]);
    this.rank = total * this.volume;
  }
  getColor() {
    const total = this.total;
    const data = this.data;
    let redCount = 0,
      greenCount = 0,
      blueCount = 0;

    for (let i = 0; i < total; i++) {
      redCount += data[i * 4];
      greenCount += data[i * 4 + 1];
      blueCount += data[i * 4 + 2];
    }
    return [redCount / total, greenCount / total, blueCount / total];
  }
}

// 获取切割边
const getCutSide = (colorRange: number[][]) => {   // r:0,g:1,b:2
  const arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(colorRange[i][1] - colorRange[i][0]);
  }
  return arr.indexOf(Math.max(arr[0], arr[1], arr[2]));
}

// 切割颜色范围
const cutRange = (colorRange: number[][], colorSide: number, cutValue: any) => {
  const arr1: number[][] = [];
  const arr2: number[][] = [];
  colorRange.forEach(function (item) {
    arr1.push(item.slice());
    arr2.push(item.slice());
  })
  arr1[colorSide][1] = cutValue;
  arr2[colorSide][0] = cutValue;

  return [arr1, arr2];
}

// 找到出现次数为中位数的颜色
const __quickSort = (arr: any[]): any => {
  if (arr.length <= 1) {
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].count <= pivot.count) {
      left.push(arr[i]);
    }
    else {
      right.push(arr[i]);
    }
  }
  return __quickSort(left).concat([pivot], __quickSort(right));
}

const getMedianColor = (colorCountMap: Record<string, number>, total: number) => {

  const arr = [];
  for (const key in colorCountMap) {
    arr.push({
      color: parseInt(key),
      count: colorCountMap[key]
    })
  }

  const sortArr = __quickSort(arr);
  let medianCount = 0;
  const medianIndex = Math.floor(sortArr.length / 2)

  for (let i = 0; i <= medianIndex; i++) {
    medianCount += sortArr[i].count;
  }

  return {
    color: parseInt(sortArr[medianIndex].color),
    count: medianCount
  }
}

// 切割颜色盒子
const cutBox = (colorBox: { colorRange: number[][]; total: number; data: Uint8ClampedArray }) => {

  const colorRange = colorBox.colorRange;
  const cutSide = getCutSide(colorRange);
  const colorCountMap: Record<string, number> = {};
  const total = colorBox.total;
  const data = colorBox.data;

  // 统计出各个值的数量
  for (let i = 0; i < total; i++) {
    const color = data[i * 4 + cutSide];

    if (colorCountMap[color]) {
      colorCountMap[color] += 1;
    }
    else {
      colorCountMap[color] = 1;
    }
  }

  const medianColor = getMedianColor(colorCountMap, total);
  const cutValue = medianColor.color;
  const cutCount = medianColor.count;
  const newRange = cutRange(colorRange, cutSide, cutValue);
  const box1 = new ColorBox(newRange[0], cutCount, data.slice(0, cutCount * 4));
  const box2 = new ColorBox(newRange[1], total - cutCount, data.slice(cutCount * 4));
  return [box1, box2];
}

// 队列切割
const queueCut = (queue: any[], num: number) => {
  while (queue.length < num) {
    queue.sort((a: { rank: number }, b: { rank: number }) => {
      return a.rank - b.rank
    });
    const colorBox = queue.pop();
    const result = cutBox(colorBox);
    queue = queue.concat(result);
  }
  return queue.slice(0, num)
}

// 颜色去重
const colorFilter = (colorArr: number[][], difference: number) => {
  for (let i = 0; i < colorArr.length; i++) {
    for (let j = i + 1; j < colorArr.length; j++) {
      if (Math.abs(colorArr[i][0] - colorArr[j][0]) < difference && Math.abs(colorArr[i][1] - colorArr[j][1]) < difference && Math.abs(colorArr[i][2] - colorArr[j][2]) < difference) {
        colorArr.splice(j, 1)
        j--
      }
    }
  }
  return colorArr
}

// 色差调整
const colorDifference = (imageData: Uint8ClampedArray): number => {
  const total = imageData.length / 4;
  let rSum = 0, gSum = 0, bSum = 0;
  let rSquaredSum = 0, gSquaredSum = 0, bSquaredSum = 0;

  // 计算 RGB 的均值和方差
  for (let i = 0; i < total; i++) {
    const r = imageData[i * 4];
    const g = imageData[i * 4 + 1];
    const b = imageData[i * 4 + 2];

    rSum += r;
    gSum += g;
    bSum += b;

    rSquaredSum += r * r;
    gSquaredSum += g * g;
    bSquaredSum += b * b;
  }

  const rMean = rSum / total;
  const gMean = gSum / total;
  const bMean = bSum / total;

  const rVariance = (rSquaredSum / total) - (rMean * rMean);
  const gVariance = (gSquaredSum / total) - (gMean * gMean);
  const bVariance = (bSquaredSum / total) - (bMean * bMean);

  // 综合 RGB 方差，计算动态 difference
  const avgVariance = (rVariance + gVariance + bVariance) / 3;
  const difference = Math.sqrt(avgVariance) * 0.25; // 调整系数可以根据需求修改

  return Math.floor(difference);
};


/**
* 提取颜色
* @param colorNumber 提取最大颜色数量
* @param img 需要提取的图片
* @param difference 图片颜色筛选精准度
* @param callback 回调函数
* @param instance 组件实例
* @param canvasId 画布id
*/
export const themeColor = async (canvasMsg: { canvasId: string, img: string, instance: ComponentInternalInstance | null, width?: number, height?: number }, colorNumber: number, callback: (arg0: number[][]) => void) => {
  try {
    const { canvasId, img, instance } = canvasMsg;
    let { width, height } = canvasMsg;
    const ctx = await InitCanvas(canvasId, instance)
    if (width === undefined) {
      width = 300
    }
    if (height === undefined) {
      height = 150
    }
    let imageData: Uint8ClampedArray = new Uint8ClampedArray([])
    ctx.drawImage(img, 0, 0, width, height);
    ctx.draw(false, async () => {
      imageData = await getImageData(canvasId, 0, 0, width, height, instance);
      const total = imageData.length / 4;

      let rMin = 255,
        rMax = 0,
        gMin = 255,
        gMax = 0,
        bMin = 255,
        bMax = 0;

      // 获取范围
      for (let i = 0; i < total; i++) {
        const red = imageData[i * 4];
        const green = imageData[i * 4 + 1];
        const blue = imageData[i * 4 + 2];

        if (red < rMin) {
          rMin = red;
        }

        if (red > rMax) {
          rMax = red;
        }

        if (green < gMin) {
          gMin = green;
        }

        if (green > gMax) {
          gMax = green;
        }

        if (blue < bMin) {
          bMin = blue;
        }

        if (blue > bMax) {
          bMax = blue;
        }
      }
      const colorRange = [[rMin, rMax], [gMin, gMax], [bMin, bMax]];
      const colorBox = new ColorBox(colorRange, total, imageData);
      const colorBoxArr = queueCut([colorBox], colorNumber);
      let colorArr = [];

      for (let j = 0; j < colorBoxArr.length; j++) {
        colorBoxArr[j].total && colorArr.push(colorBoxArr[j].getColor())
      }
      const difference = colorDifference(imageData);
      console.log(canvasId, difference);

      colorArr = colorFilter(colorArr, difference)
      // 将颜色取整
      for (let i = 0; i < colorArr.length; i++) {
        for (let j = 0; j < 3; j++) {
          colorArr[i][j] = Math.round(colorArr[i][j])
        }
      }
      console.log(colorArr.length);
      // console.log(colorArr);

      callback(colorArr);
    })
  } catch (e) {
    console.log(e);
  }
}


