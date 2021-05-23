<template>
  <div id="app" style="width:100%;height:100%">
    <Backgrounds v-show="displayPage=='background'" :imageUrl="backgroundImage" :code="code" :acts="activities" :roomInfo="meetingRoom">
    </Backgrounds>
    <Projector v-show="displayPage=='projector'" stream="" :code="code"></Projector>
    <Regist v-show="displayPage=='regist'" :registType="registType"></Regist>
    <!--<h1 @click="generateCode">{{ code }}</h1>-->
  </div>
</template>
<style>
*{
margin:0;
padding:0;
}
html,body{
  width: 100%;
  height:100%;
}
#app{
  width: 100%;
  height:100%;
}
</style>
<script>
/* eslint-disable */
import Backgrounds from './components/background';
import Projector from './components/projector';
import Regist from './components/regist';
import {rtc} from './rtcConnection.js';
let socket;
let peerConnection;
let remoteStream = new MediaStream();

let player;
const configuration = {};
export default {
  components:{Backgrounds,Projector,Regist},
  data: () => ({
    code: "未连接",
    displayPage:'background',
    registType:'loading',
    stream:new MediaStream(),
    meetingRoom:{},
    activities:[],
    backgroundImage:[],
  }),
  methods: {
  },
  async mounted() {
    let that=this;
    player = document.getElementById("video");
    player.srcObject = remoteStream;
    
    this.$http.get('/device/validDeviceToken',{}).then(res=>{
      if(res.data.code==200){
        localStorage.setItem("token",res.data.token);
        that.displayPage="background";
        that.registType="loading";
        rtc({socket,peerConnection,player,configuration,that});
      }
    }).catch(error=>{
      console.error(error);
      that.displayPage="regist";
      if (!error.response||!error.response.status) {
        
        that.registType="neterr";
      }else{
        const token=localStorage.getItem('token')||'';
        if(token==''){
that.registType="first";
        }else{
          that.registType="timeout";
        }
      }
    });
  },
};
</script>