import Vue from 'vue'
import 'ant-design-vue/dist/antd.css';
import App from './App'
import axios from "axios";
import Antd,{message} from 'ant-design-vue';
const config=require("./config.json");

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false



let baseURL = config.baseURL;
if (baseURL !== "") {
  console.warn("Server info:", baseURL);
  axios.defaults.baseURL = baseURL;
}
axios.defaults.timeout=5000;
var noAuth=[];
axios.interceptors.request.use(config=>{
  if(noAuth.indexOf(config.url)==-1){
    const token = localStorage.getItem("token")||'';
    console.log('current Token:',token);
    token && (config.headers.Authorization = token);
  }
  return config;
},error=>{
  console.error(error);
  Promise.error(error);
});

axios.interceptors.response.use(response => {
    return response;
},error => {
  if (error.response&&error.response.status) {
    switch (error.response.status) {
      case 400:
        message.error(error.response.data.msg);
        break;
      // 401: 未登录
      case 401:
        message.error(error.response.data.msg);
        break;

      // 403: token过期
      case 403:
        message.error(error.response.data.msg);
        // 清除token
        break;

      // 404请求不存在
      case 404:
        message.error("您的请求不存在，请和管理员联系！");
        break;
      // 其他错误，直接抛出错误提示
      default:
        message.error(error.response.data.message.msg);
    }
    return Promise.reject(error);
  }else{
    message.error("请求超时，请检查网络连接后继续！");
    return Promise.reject(error);
  }
})

Vue.use(Antd);
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
