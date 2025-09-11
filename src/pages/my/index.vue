<template>
  <view class="whole">
    <MyMsg @sign-in="SignIn" />
    <OptionsNav />
    <LeftSetting />
    <Pop v-model:visible="signIn" :option="{
      title: '',
      contentIconStyle: { color: 'rgb(141, 193, 73)' }
    }" />
  </view>

</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import MyMsg from "./components/MyMsg.vue";
import { tokenStore ,useServerConfig,userStore} from "@/stores";
import {http} from "@/utils/http";
import OptionsNav from "./components/OptionsNav.vue";
import LeftSetting from "./components/LeftSetting.vue";
import Pop from "@/components/Pop.vue";
const {serverUrl} = useServerConfig()
let signIn = ref(false);
function SignIn() {
  signIn.value = true;
}

async function getInfo(){
  if(tokenStore().userToken!='') {
      const userinfo = await http({
        url: `${serverUrl}/user/info`,
         method: 'GET'
      })
      console.log(userinfo.result);
      
      userStore().setUserInfo((userinfo.result as any)[0])
      userStore().setAvatarColor((userinfo.result as any)[1].color)  
      userStore().setTextColor((userinfo.result as any)[1].textColor)
  }
}

onMounted(() => {
  getInfo()
})

</script>

<style scoped>
.whole {
  height: 100vh;
  overflow-y: hidden;
}
</style>