// 拦截器的设置
import { userStore ,useServerConfig,tokenStore } from "@/stores";

// 基础地址
const baseUrl:string = useServerConfig().serverUrl; 

// 添加拦截器
const httpInterceptor = {
    // 拦截前触发
    invoke(options:UniApp.RequestOptions){
        // console.log('请求拦截器',options);
        
        // 1.非http开头需要拼接地址
        if(!options.url.startsWith('http')){
            options.url = baseUrl + options.url 
        }
        // 2.请求超时，默认60s
        options.timeout = 10000;

        // 3.添加小程序端请求头标识
        options.header = {
            ...options.header,
            'source-client':'miniapp'  
        }
        // 4.添加token请求头标识
        const Store = tokenStore()
        const token = Store.userToken;
        if(token){
            options.header.Authorization = token;
        }
    }
}


// uploadFile 专用拦截器
uni.addInterceptor('request',httpInterceptor)
uni.addInterceptor('uploadFile',httpInterceptor)


// 封装请求方法
interface Data<T>{
    code:number;
    message:string;
    result:T; 
    token:string | null;
}

// #region 用于非流式处理的请求
export const http = <T>(options:UniApp.RequestOptions) =>{
    return new Promise<Data<T>>((resolve,reject)=>{
        uni.request({
            ...options,
            success(res){
              // 更新token的时间
              const newToken = res.header?.['New-Access-Token'];
              console.log('newToken',newToken);
              if (newToken) {
                tokenStore().setToken(newToken); // 更新本地存储
              }
              if(res.statusCode >= 200 && res.statusCode < 300){
                resolve(res.data as Data<T>) 
              } else if(res.statusCode === 401){
                // 401错误，清理用户信息，跳转到登录页
                const Store = userStore()
                Store.clearUserInfo()
                uni.showModal({
                  title: '提示',
                  content: '请前往登录', 
                  success: (res) => {
                    if (res.confirm) {
                        uni.navigateTo({ url: '/pages/Login/index' });
                    }
                  }
                })    
              } else{
                uni.showToast({
                    icon:'none',
                    title:(res.data as Data<T>).message || '请求错误'
                })
              }
            } ,
            fail(err){
                uni.showToast({
                    icon:'none',
                    title:'网络错误，换个网络试试'
                })  
                reject(err)
            }
        })
    })
}
// #endregion


// #region 用于流式处理的请求
export const httpStream = (options:UniApp.RequestOptions) =>{
  return new Promise((resolve,reject)=>{
   const response = uni.request({
      ...options,
      enableChunked: true,
      responseType: "text",
      dataType: "json", // 请求的数据类型
      success:(res)=>{
        const newToken = res.header?.['New-Access-Token'];
        console.log('newToken',newToken);
        if (newToken) {
          tokenStore().setToken(newToken); // 更新本地存储
        }
        if(res.statusCode === 401){
          // 401错误，清理用户信息，跳转到登录页
          const Store = userStore()
          Store.clearUserInfo()
          uni.showModal({
            title: '提示',
            content: '请前往登录', 
            success: (res) => {
              if (res.confirm) {
                  uni.navigateTo({ url: '/pages/Login/index' });
              }
            }
          })    
        } else{
          uni.showToast({
              icon:'none',
              title: '请求错误'
          })
        }
       resolve(res) 
      } ,
      fail:(err)=>{
        reject(err) 
      }
   }) 
   resolve(response)
  })
}


//  #region 用于文件上传的请求
export const upload = <T>(options: UniApp.UploadFileOption) => {
    return new Promise<Data<T>>((resolve, reject) => {
      uni.uploadFile({
        ...options,
        success: (res) => {
          // 更新token的时间
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(res.data));
          } else {
            handleError(res, reject);
          }
        },
        fail: reject
      });
    });
  };

  // 错误处理复用
const handleError = (res: any, reject: (reason?: any) => void) => {
    if (res.statusCode === 401) {
      userStore().clearUserInfo();
      uni.showModal({
        title: '提示',
        content: '请前往登录', 
        success: (res) => {
          if (res.confirm) {
              uni.navigateTo({ url: '/pages/Login/index' });
          }
        }
      })    
    }
    uni.showToast({
      icon: 'none',
      title: res.data?.message || '上传失败'
    });
    reject(res);
  };

// #endregion 