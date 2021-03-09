<template>
  <div class="registWrapper">
    <div class="hy bigtitle">欢迎使用EasyMeeting投屏端</div>
    <div class="hy subtitle">{{ msg }}</div>
      <a-icon class="loadingspin" v-if="loading" type="loading" style="font-size: 5em" spin />
    <img
      v-if="imageReady&&(registType == 'first'||registType=='timeout')"
      :src="imageUrl"
      style="
        width: auto;
        height: auto;
        max-width: 15%;
        border-radius: 50%;
        margin: 60px;
      "
      alt=""
    />
    <div class="hy subtitle2" v-if="registType == 'first'||registType=='timeout'">{{ codeMsg }}</div>
  </div>
</template>
<style>
.loadingspin {
  
  color: white;
  margin-top: 50px;
}
.registWrapper {
  width: 100%;
  height: 100%;
  background-color: #1890ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.txtcenter {
  text-align: center;
  width: 100%;
}
.hy {
  font-family: "HY-55S";
}
.bigtitle {
  color: white;
  font-size: 3em;
  margin-bottom: 80px;
}
.subtitle {
  color: white;
  font-size: 2em;
}
.subtitle2 {
  color: white;
  font-size: 1.5em;
}
</style>
<script>
/* eslint-disable */
import { LoadingOutlined } from "@ant-design/icons-vue";
import io from "socket.io-client";
import {h} from 'vue';
import { message } from "ant-design-vue";
let regSocket;
let config = require("../config.json");
let regStat = false;
export default {

  props: {
    registType: String,
  },
  computed: {
    msg: function () {
      console.log(this.$props.registType);
      switch (this.$props.registType) {
        case "loading":
          return "设备联网中，请稍后";
        case "neterr":
          this.loading = false;
          return "网络错误，请检查网络后重启设备";
        case "first":
          regStat = false;
          this.creatRegSession();
          return "感谢使用本产品，这是您第一次使用，请扫码进行绑定！";
        case "timeout":
          regStat = false;
          this.creatRegSession();
          return "您已经许久没有使用过本产品了，请重新扫码绑定！";
      }
    },
  },
  data: () => ({
    loading: true,
    codeMsg: "二维码加载中",
    imageReady: false,
    imageUrl: "",
  }),
  methods: {
    creatRegSession: function () {
      let that = this;
      regSocket = io.connect(config.regSocketUrl);
      regSocket.on("connect", () => {
        message.success("已连接注册服务器");
        console.log("已连接注册服务器");
      });
      regSocket.on("disconnect", () => {
        if (regStat == false) {
          message.error("和注册服务器的连接断开");
          console.error("连接断开");
          that.codeMsg="连接断开，请检查网络";
          that.loading = false;
          that.imageReady=false;
        }
      });
      regSocket.on("REG_IMAGE_READY", function (url) {
        if (url) {
          console.log(url);
          let baseUrl = config.baseURL;
          that.imageUrl = baseUrl + url;
          that.imageReady = true;
          that.loading = false;
          that.codeMsg = "请使用微信扫描小程序码绑定设备";
        }
      });
      regSocket.on("INIT_COMPLETE",function(obj){
        regStat=true;
        if(obj.token){
          console.log("reset token",obj.token);
          localStorage.setItem("token",obj.token);
          that.imageReady = true;
          that.codeMsg = "绑定成功，即将进入主页";
          regSocket.disconnect();
          setTimeout(function(){
            location.reload();
          },5000);
        }
      });
    },
  },
}
</script>