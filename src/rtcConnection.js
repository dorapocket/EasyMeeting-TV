import io from "socket.io-client";
const rtcServer="http://192.168.31.90:65534/rtc";
export function rtc(config) {
  let { peerConnection, socket, player, that } = config;
  console.log(that);
  //remoteStream=new Proxy(remoteStream,{

  //});
  peerConnection = new RTCPeerConnection();
  peerConnection.onicecandidate = function(e) {
    console.log(e);
    if (e.candidate) {
      socket.emit("RTC_Candidate_Exchange", {
        iceCandidate: event.candidate,
      });
    }
  };
  peerConnection.addEventListener("iceconnectionstatechange", (e) => {
    console.log("iceconnectionstatechange", e);
  });
  peerConnection.addEventListener("connectionstatechange", (event) => {
    console.log("RTC State Change:", peerConnection.connectionState, event);
  });

  peerConnection.onaddstream = (event) => {
    player = document.getElementById("video");
    player.srcObject = event.stream;
    console.log("onaddstream");
  };
  peerConnection.ontrack = () => {
    console.log("ontrack");
  };
  peerConnection.onconnectionstatechange = function(event) {
    console.log("iceconnectionstatechange", event, peerConnection);
    if (peerConnection.connectionState == "connected") {
      that.displayPage = 'projector';
    }
    if (peerConnection.connectionState == "failed") {
      that.displayPage = 'background';
    }
    if (peerConnection.connectionState == "disconnected") {
      that.displayPage = 'background';
    }
  };

    
    socket = io.connect(rtcServer);
    socket.on("connect", function() {
      
    });
    // FIXME: 测试用接受token
    socket.on('TEST_TOKEN_TV',token=>{
      console.log(token);
    })
    socket.on("VERIFY",()=>{
      console.log("正在验证身份");
      socket.emit('VERIFY_FEEDBACK',localStorage.getItem('Token'));
    });
    socket.on("VERIFY_RESPONCE",(obj)=>{
      if(obj.code==200){
        console.log("身份验证成功");
        that.displayPage="background";
        socket.emit("TV_GETINFO",{
          code:localStorage.getItem("projCode") || "",
          token:localStorage.getItem("Token") || "",
        });
      }else{
        console.log("身份验证失败");
        that.displayPage="regist";
        console.error(obj.msg);
      }
    });

    socket.on('TV_INFO_FEEDBACK',obj=>{
      console.log("获取信息成功",obj);
      peerConnection.setConfiguration(obj.iceConfig);
      that.code = obj.projCode || "获取投屏码失败";
      localStorage.setItem("projCode", obj.projCode.toUpperCase());
      that.meetingRoom=obj.meetingRoom;
      that.activities=obj.activities;
      that.backgroundImage=obj.background;
    });


    socket.on("NEW_CLIENT_JOIN", (data) => {
      console.log("A new Client join, username: " + data.username);
    });
    socket.on("RTC_Client_Offer_To_TV", async (data) => {
      console.log("RTC_Client_Offer_To_TV");
      if (data.offer) {
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("RTC_TV_Answer_To_Server", { answer: answer });
      }
    });
    socket.on("disconnect", function() {
      console.warn("Disconnected.");
      that.code = "与服务器链接失败";
    });
    socket.on("RTC_Candidate_Exchange", async (message) => {
      if (message.iceCandidate) {
        try {
          await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    });
}
