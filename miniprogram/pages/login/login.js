// pages/login/index.js
Page({
  handleGetUserInfo() {
    wx.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别",
      success: res => {
        const {
          rawData
        } = res
        wx.setStorageSync("userinfo", rawData);
        wx.navigateBack({
          delta: 1
        })
        wx.setStorageSync("denlu", true);
        wx.showToast({
          title: '登录成功',
          icon: "none"
        })
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          title: '您拒绝了请求',
          icon: "none"
        })
        return;
      }
    })


  }
})