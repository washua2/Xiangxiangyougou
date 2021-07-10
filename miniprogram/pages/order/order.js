import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    new_orders: [],
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],

  },

  onShow(option) {
    //判断是否有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return;
    }
    //获取当前的页面栈
    let pages = getCurrentPages();
    let currentPage = '';
    //数组中索引最大就是当前的页面
    currentPage = pages[pages.length - 1];
    const {
      type
    } = currentPage.options

    const header = {
      Authorization: token
    }
    if (type == null) {
      this.changeTitleByIndex(0)
      this.getOrders(1, header)
    } else {
      //获取订单信息
     
this.getOrders(type, header)

      //根据type值 激活和选中标题
      this.changeTitleByIndex(type - 1)
    }




  },

  //获取订单
  async getOrders(type, header) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type,
        header
      }
    })
    //获取模拟订单数据
    let orders = wx.getStorageSync('modeCart') || []
    let isCart = wx.getStorageSync("isCart");
    let arr = []
    let i = ""
    orders.forEach(v => {
      i = Object.values(v)
    })
    for (let j in i) {
      i[j].goods_state = 2
      arr.push(i[j]);
    }
    let leng = arr.length
    let newArr = [];
    let new_orders = wx.getStorageSync("new_orders") || []
    newArr = arr.splice(leng - 1, leng)
    arr = arr.splice(0, leng - 1)
    let isTime=wx.getStorageSync("isTime")
    if(isTime){
       arr.forEach(v => {
      if (v.flag == isCart) {
        v.modeCart = newArr
        new_orders.push(v)
      }
      wx.setStorageSync("isTime",false)
    })
    }
   
    wx.setStorageSync("new_orders", new_orders)
    if (type == 1) {
      this.setData({
        new_orders
      })
    }

  },
  //自动激活选中
  changeTitleByIndex(index) {
    let result = wx.getStorageSync('new_orders') || []
    let new_orders = [];
    result.forEach(v => {
      if (v.goods_state === index + 1) {
        new_orders.push(v)
      } else {
        new_orders = []
      }
    })
    this.setData({
      new_orders
    })
    // 修改tabs的值
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },

  // 根据标题索引来激活选中 标题数组
  handleTabsItemChange(e) {
    //获取索引值
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index)
    //重新发送请求
    this.getOrders(index + 1)
  },
  //删除订单
  del(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let that = this;
    wx.showModal({
      title: '删除订单',
      content: '确定要删除该订单？',
      showCancel: true,
      cancelText: "取消",
      confirmText: "确认",
      success: function (res) {
        if (res.cancel) {

        } else {
          //点击确定
          let new_orders = wx.getStorageSync("new_orders") || []
          new_orders.splice(index, 1);
          wx.setStorageSync("new_orders", new_orders)
          that.setData({
            new_orders
          })
        }
      },
      fail(res) {}, //接口调用失败的回调函数
    })
  },


})