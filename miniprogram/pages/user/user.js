// pages/user/user.js
Page({

  data: {
    userinfo: {},
    collectNums: 0,
    history:'',
  },
  onShow() {
    const res = wx.getStorageSync("userinfo")
    const collect = wx.getStorageSync("collect") || [];
    const history=wx.getStorageSync("history")
    //收藏数量
    this.setData({
      collectNums:collect.length,
      history:history.length
    })
    //转换类型
    if (res == '') {
      return
    } else {
      let userinfo = JSON.parse(res);
      //设置userinfo的值
      this.setData({
        userinfo,
        collectNums:collect.length
      })
    }


  }
})