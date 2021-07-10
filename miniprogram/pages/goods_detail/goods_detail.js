import {
  request
} from "../../request/index.js"

// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  //全局商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options
    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id)
    //判断用户是否登录
    const denlu = wx.getStorageSync("denlu");
    if (denlu == '') {
      this.handleGetUserInfo()
    }

  },
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    })
    //获取历史记录
    let history = [];
    history = wx.getStorageSync("history") || []
    this.GoodsInfo = res.data.message
    history.push(this.GoodsInfo);
    wx.setStorageSync("history", history);

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.data.message.pics
      },
      isCollect
    })
  },
  //点击轮播图 放大预览
  handlePrevewImage(e) {
    //构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    //接受传递过来的图片Url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    })
  },
  //加入购物车
  handleCartAdd() {
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    //判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else {
      //获取缓存中的购物车 数组
      let cart = wx.getStorageSync("cart") || [];
      //判断 商品对象是否存在购物数组中
      let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
      if (index == -1) {
        //不存在 第一次添加
        this.GoodsInfo.num = 1;
        this.GoodsInfo.checked = true;
        this.GoodsInfo.flag = true;
        cart.push(this.GoodsInfo);
      } else {
        //已经存在
        cart[index].num++;
      }
      //  把购物车重新添加回缓存中
      wx.setStorageSync("cart", cart)
      //弹窗显示
      wx.showToast({
        title: '加入成功',
        icon: "success",
        mask: true
      })
    }

  },
  //点击收藏图标
  handleCollect() {
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    //判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else {
      let isCollect = false;
      // 获取缓存中的商品收藏数组
      let collect = wx.getStorageSync("collect") || [];
      // 判断该商品是否被收藏过
      let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
      // 当index！=-1表示 已经收藏过 
      if (index !== -1) {
        // 能找到 已经收藏过了  在数组中删除该商品
        collect.splice(index, 1);
        isCollect = false;
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true
        });

      } else {
        // 没有收藏过
        collect.push(this.GoodsInfo);
        isCollect = true;
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true
        });
      }
      // 把数组存入到缓存中
      wx.setStorageSync("collect", collect);
      // 修改data中的属性  isCollect
      this.setData({
        isCollect
      })
    }

  },
  //点击支付
  submit() {
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    //判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else {
      let cart = wx.getStorageSync("cart") || [];
      this.GoodsInfo.num = 1;
      this.GoodsInfo.flag = false;
      //通过判断
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
      //重新添加回缓存中
      wx.setStorageSync("cart", cart)
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    }

  },
  //让用户登录
  handleGetUserInfo() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

})