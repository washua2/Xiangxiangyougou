// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
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
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
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
      if(index===1){
        const collect = wx.getStorageSync("collect") || [];
        this.setData({
          collect
        })
      }
      if(index===3){
        let history=wx.getStorageSync("history")||[]
        this.setData({
          collect:history
        })
        
      }
    }

  }
})