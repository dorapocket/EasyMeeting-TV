<template>
<div style="backgroud-color:black;width:100%;height:100%;">
    <video id="video" autoplay></video>
        <div style="position:absolute;margin:30px;padding:30px;display:flex;flex-direction:column;right:10px;bottom:10px;background-color:#00000099;color:white;border-radius:8px;"> 
      <h1 style="color:white;margin-bottom:0px;">投屏码:{{code}}</h1>
      <div><div style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:green;margin-right:5px;"></div>已连接</div>
    </div>
</div>
</template>
<style>
#video{
    width:100%;
    height:100%;
    background-color:black;
    position: absolute;
    top:0px;
    left:0px;
}
</style>
<script>
export default {
    props:['code'],
}
</script>