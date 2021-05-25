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
        <div style="font-size: 2vw">{{date}}</div>
        <div style="font-size: 3vw">{{time}}</div>
        <div></div>
      </div>
      <div class="codeArea">
        <div style="font-size: 2vw">投屏码</div>
        <div id="projCode">{{code}}</div>
        <img
          id="QR"
          :src="wxacodeBase64"
          alt=""
        />
        <div style="margin-top: 20px; margin-bottom: 50px">
          扫码预约/抢占会议室、查看使用情况等
        </div>
      </div>
    </div>
    <div class="centerModal" style="width: 60%">
      <div class="titleArea">{{roomInfo.name}}</div>
      <div class="posArea">{{roomInfo.pos}}</div>
      <div class="usageArea">
      <!--<div style="align-self:flex-start;margin:0px 0px 20px 70px;font-size:2vw;">
          会议室安排
      </div>-->
          <table style="width:80%;margin-top:0px">
            <tr style="padding:0px 5px;border-bottom:2px solid white;">
              <th class="arrangeHead">时间</th>
              <th class="arrangeHead">主题</th>
              <th class="arrangeHead">发起人</th>
            </tr>
            <tr v-for="item in formatActs" :key="item.aid" class="row">
              <td class="arrangeBody">{{item.time}}</td>
              <td class="arrangeBody">{{item.theme}}
              </td>
              <td class="arrangeBody">{{item.sponsor}}
              </td>
            </tr>
          </table>
          <h2 v-if="formatActs.length==0" style="margin-top:30%;wodth:100%;text-align:center;color:white
           ">暂无安排
    </h2>
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
      <img class="backgroundImgs" :src="imageUrl[1]" alt="img1" />
      <img class="backgroundImgs" :src="imageUrl[2]" alt="img2" />
      <img class="backgroundImgs" :src="imageUrl[3]" alt="img3" />
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
.posArea {
  width: 100%;
  height: 8%;
  color: white;
  padding: 10px;
  font-size: 1.5vw;
  text-align: center;
}
#QR {
  width: 50%;
  margin-top: 70px;
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
/* eslint-disable */
//https://www.bing.com/HPImageArchive.aspx?format=js&idx=3&n=1
import Carousel from "ant-design-vue/lib/carousel";
let d=new Date();
    function dateFormat(fmt, date){
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}
export default {
  components: { Carousel },
  props:['code','acts','roomInfo',"imageUrl","wxacode"],
  data: () => ({
      date:dateFormat('YYYY年mm月dd日',d),
  time:dateFormat('HH:MM',d),
  }),
  computed:{
    formatActs:function(){
      let acts=this.$props.acts||[];
      acts.sort(function sort(a,b){return a.time_begin-b.time_begin});
      let result=[];
      for(let act of acts){
        let b=new Date(act.time_begin);
        let e=new Date(act.time_end);
        result.push({
          time:dateFormat('YYYY年mm月dd日 HH:MM',b)+'-'+dateFormat('HH:MM',e),
          theme:act.theme,
          sponsor:act.sponsor,
        });
      }
      return result;
    },
    wxacodeBase64:function(){
      return "data:image/png;base64,"+this.$props.wxacode
    }
  },
  mounted:function(){
    let that=this;
    setInterval(function(){
      that.time=dateFormat('HH:MM',new Date());
      that.date=dateFormat('YYYY年mm月dd日',new Date());
    },1000);
    
  },
  methods:{
  }
};
</script>