// pages/address/address.js
Page({

  data: {
    //缓存中的地址
    address: {},
  },
  onShow(){
  let address=wx.getStorageSync('address')
  this.setData({
    address
  })
  },
  //获取收货地址
  handleChooseAddress() {
    //调用微信小程序
    wx.chooseAddress({
      success: (result) => {
        //获取地址信息
        let address = result;
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
        this.setData({
          address,
        })
        // 存入到缓存中
        wx.setStorageSync("address", address);
      },
    })
  }
})