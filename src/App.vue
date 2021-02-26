<template>
  <div style="width:100%;height:100%">
    <Backgrounds v-show="displayPage=='background'" :imageUrl="backgroundImage" :code="code" :acts="activities" :roomInfo="meetingRoom">
    </Backgrounds>
    <Projector v-show="displayPage=='projector'" stream="" :code="code"></Projector>
    <Regist v-show="displayPage=='regist'"></Regist>
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
    stream:new MediaStream(),
    meetingRoom:{},
    activities:[],
    backgroundImage:[],
  }),
  methods: {
  },
  async mounted() {
    let that=this;
    console.log("created");
    player = document.getElementById("video");
    player.srcObject = remoteStream;
    rtc({socket,peerConnection,player,configuration,that});
  },
};
</script>