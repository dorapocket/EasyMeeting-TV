<template>
  <div id="app" style="width:100%;height:100%">
    <Backgrounds v-show="displayPage=='background'" :imageUrl="backgroundImage" :code="code" :wxacode="wxacode" :acts="activities" :roomInfo="meetingRoom">
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
    displayPage:'regist',
    registType:'loading',
    stream:new MediaStream(),
    wxacode:'',
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
    var interval = setInterval(()=>{
          this.$http.get('/device/validDeviceToken',{}).then(res=>{
      if(res.data.code==200){
        localStorage.setItem("token",res.data.token);
        that.displayPage="background";
        that.registType="loading";
        clearInterval(interval)
        this.$http.get("/wechat/getDeviceWxaCode",{})
      .then(function(response){
        that.wxacode = response.data.data;
      })
      .catch(function(error){
        console.error(error);
      })
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
that.registType="first";clearInterval(interval)
        }else{
          that.registType="timeout";
        }
        
      }
    });
    },5000)

  },
};
</script>