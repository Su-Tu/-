import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/types';
import { ref } from 'vue'

export const useServerConfig = defineStore('server', () => {
  const ip = ref<string>('luostir.top') 
  const serverUrl = ref<string>(`https://${ip.value}`)
  return { 
   ip,serverUrl
  }
})


export const tokenStore = defineStore('token', () => {
  const userToken = ref<string | null>(null) //token 
  function setToken(val:string){
    userToken.value = val
  }
  
  function clearUserInfo(){
     userToken.value = null
  }
  return {
   userToken,setToken,clearUserInfo
  }
},{
  // 持久化配置（需安装 pinia-plugin-persistedstate）
  persist: {
    storage: {
      getItem(key: string): string | null {
        return uni.getStorageSync(key)
      },
      setItem(key: string, value: string) {
        uni.setStorageSync(key, value)
      }
    }
  }
})

export const userStore = defineStore('user', () => {
  const userInfo =ref<UserInfo>({
    name: "请登录",
    avatarImage:`${useServerConfig().serverUrl}/images/public/default.jpg`,
    attention: 0,
    fan: 0,
    praise: 0,
    signature:"请写下你的航标",
    bgImage:`${useServerConfig().serverUrl}/images/public/StarSky.jpg`
   })
   const avatarColor = ref([])
   const textColor = ref([255,255,255])
   function setUserInfo(val:UserInfo){
    userInfo.value = val
  }
  function setAvatarColor(val:any){
    avatarColor.value = val
  }
  function setTextColor(val:any){
    textColor.value = val 
  }
  
  function clearUserInfo(){
    userInfo.value = {
      name: "请登录",
      avatarImage:`${useServerConfig().serverUrl}/images/public/default.jpg`,
      attention: 0,
      fan: 0,
      praise: 0,
      signature:"请写下你的航标",
      bgImage:`${useServerConfig().serverUrl}/images/public/StarSky.jpg`
     }
     
     avatarColor.value = []
     textColor.value = [255,255,255]
  }
  return {
    userInfo,avatarColor,clearUserInfo,setUserInfo,setAvatarColor,setTextColor,textColor
  }
})
