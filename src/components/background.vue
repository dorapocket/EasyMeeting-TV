<template>
  <div
    style="
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div class="centerModal" style="width: 25%">
      <div class="timeArea">
        <div style="font-size: 2vw">2021年01月11日</div>
        <div style="font-size: 3vw">19:20</div>
        <div></div>
      </div>
      <div class="codeArea">
        <div style="font-size: 2vw">投屏码</div>
        <div id="projCode">{{code}}</div>
        <img
          id="QR"
          src="https://res.wx.qq.com/wxdoc/dist/assets/img/WXACode.fa3d686a.png"
          alt=""
        />
        <div style="margin-top: 10px; margin-bottom: 50px">
          扫码预约会议室、查看使用情况等
        </div>
      </div>
    </div>
    <div class="centerModal" style="width: 60%">
      <div class="titleArea">401-会议室</div>
      <div class="usageArea">
      <!--<div style="align-self:flex-start;margin:0px 0px 20px 70px;font-size:2vw;">
          会议室安排
      </div>-->
          <table style="width:80%;margin-top:50px">
            <tr style="padding:5px;border-bottom:2px solid white;">
              <th class="arrangeHead">时间</th>
              <th class="arrangeHead">主题</th>
              <th class="arrangeHead">发起人</th>
            </tr>
            <tr v-for="i in 5" :key="i" class="row">
              <td class="arrangeBody">2020年1月12日 13:00-15:00</td>
              <td class="arrangeBody">TextVQA组会
              </td>
              <td class="arrangeBody">xx
              </td>
            </tr>
          </table>
        </div>
    </div>
    <Carousel
      class="backgroundCarousel"
      autoplay
      :autoplaySpeed="10000"
      effect="fade"
      :speed="3000"
    >
      <img class="backgroundImgs" :src="imageUrl[0]" alt="img0" />
      <img class="backgroundImgs" :src="imageUrl[1]" alt="img0" />
      <img class="backgroundImgs" :src="imageUrl[2]" alt="img0" />
      <img class="backgroundImgs" :src="imageUrl[3]" alt="img0" />
    </Carousel>
  </div>
</template>
<style>
.arrangeBody{
    font-size:1.2vw;
    font-weight:400;
        padding-top:2vh;
}
.arrangeHead{
    font-size:1.3vw;
}
.usageArea {
  padding:4%;
  width: 100%;
  height: 85%;
  color: white;
   align-items: center;
  display: flex;
  flex-direction: column;
}
.titleArea {
  width: 100%;
  height: 15%;
  color: white;
  padding: 20px;
  font-size: 3.5vw;
  text-align: center;
}
#QR {
  width: 50%;
  margin-top: 30px;
}
#projCode {
  font-size: 3.5vw;
  font-weight: 500;
  letter-spacing: 15px;
}
.codeArea {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 75%;
  color: white;
  padding: 20px;
}
.timeArea {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 25%;
  color: white;
  padding: 20px;
}
.centerModal {
  z-index: -5;
  display: flex;
  height: 80%;
  margin-right: 50px;
  background-color: #00000055;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
}
.backgroundCarousel {
  background-color: black;
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100 !important;
}
.backgroundImgs {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  filter: blur(5px) opacity(100%);
}
</style>
<script>
//https://www.bing.com/HPImageArchive.aspx?format=js&idx=3&n=1
import Carousel from "ant-design-vue/lib/carousel";
export default {
  components: { Carousel },
  props:['code'],
  data: () => ({
    imageUrl: [
      "https://api.berryapi.net/?service=App.Bing.Images&size=large",
      "https://api.berryapi.net/?service=App.Bing.Images&size=large",
      "https://api.berryapi.net/?service=App.Bing.Images&size=large",
      "https://api.berryapi.net/?service=App.Bing.Images&size=large",
    ],
  }),
};
</script>