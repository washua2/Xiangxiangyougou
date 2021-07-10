import { request} from "../../request/index.js"
import {login} from "../../utils/asyncWx";

Page({
  //获取用户信息
 async handleGetUserInfo(e) {
    //获取信息
    const {
      encryptedData,
      rawData,
      iv,
      signature
    } = e.detail;
    //获取小程序登录后的code
    const {code}=await login();
   
    //获取需要的数据
    const loginParams = {
      encryptedData,
      rawData,
      iv,
      signature,
      code
    };
    //发送请求获取用户的token
    let res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
     // 4 把token存入缓存中 同时跳转回上一个页面
   const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
     wx.setStorageSync("token", token);
     wx.navigateBack({
       delta: 1,
     })
  }
})