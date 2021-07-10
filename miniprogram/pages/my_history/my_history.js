// pages/history/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    tabs: [{
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ]
  },
  onShow() {
    const history = wx.getStorageSync("history") || [];
    this.setData({
      history
    });

  },
  handleTabsItemChange(e) {
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    //判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else {
      // 1 获取被点击的标题索引
      const {
        index
      } = e.detail;
      // 2 修改源数组
      let {
        tabs
      } = this.data;
      tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
      // 3 赋值到data中
      this.setData({
        tabs
      })
    }

  },
  del(e){
    const {index}=e.currentTarget.dataset
    let history = wx.getStorageSync("history");
    let that = this;
    wx.showModal({
      title: '删除订单',
      content: '删除该足迹将不可恢复',
      showCancel: true,
      cancelText: "取消",
      confirmText: "确认",
      success: function (res) {
        if (res.cancel) {

        } else {
          //点击确定
          history.splice(index, 1);
          wx.setStorageSync("history", history)
          that.setData({
            history
          })
        }
      },
      fail(res) {}, //接口调用失败的回调函数
    })
  }
})