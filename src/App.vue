<template>
  <div style="width:100%;height:100%">
    <Backgrounds v-show="!connectionStatus" :code="code">
    </Backgrounds>
    <Projector v-show="connectionStatus" stream=""></Projector>
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
import {rtc} from './rtcConnection.js';
let socket;
let peerConnection;
let remoteStream = new MediaStream();

let player;
const configuration = {
    iceServers: [
        {
            urls: "turn:turn.lgyserver.top:3478",
            username: "1610198274:dorapocket",
            credential: 'EJMqW3VxFEoxwwT+0p2NOwLFLBQ=',
        },
        { urls: "stun:turn.lgyserver.top:3478" },
    ],
};
export default {
  components:{Backgrounds,Projector},
  data: () => ({
    code: "未连接",
    connectionStatus:false,
    stream:new MediaStream(),
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