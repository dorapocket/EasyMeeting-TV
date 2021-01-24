import io from "socket.io-client";
export function rtc(config){
let {peerConnection,socket,player,configuration,that}=config;
console.log(that);
//remoteStream=new Proxy(remoteStream,{
  
//});
    peerConnection = new RTCPeerConnection(configuration);
peerConnection.onicecandidate = function (e) {
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
    player = document.getElementById('video');
    player.srcObject = event.stream;
    console.log('onaddstream');
}
peerConnection.ontrack = () => { console.log('ontrack'); }
peerConnection.onconnectionstatechange = function (event) {
    console.log("iceconnectionstatechange", event, peerConnection);
    if (peerConnection.connectionState == "connected") {
        that.connectionStatus=true;
    }
    if (peerConnection.connectionState == "failed") {
        that.connectionStatus=false;
    }
    if (peerConnection.connectionState == "disconnected") {
        that.connectionStatus=false;
    }
};

    if (!socket || !socket.connected) {
        socket = io.connect("http://localhost:65534/rtc");
        socket.on("connect", function () {
          socket.emit("TV_REGISTER");
          console.log("Registing from server...");
        });
        socket.on("TV_REGISTER_SUCCESS", function (config) {
          that.code = config.projCode || "获取投屏码失败";
          console.log("Regist Successful, config:", config);
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
        socket.on("disconnect", function () {
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
}