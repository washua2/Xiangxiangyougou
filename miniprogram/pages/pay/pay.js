import {
  request
} from "../../request/index.js";
import {
  requestPayment
} from "../../utils/asyncWx"
Page({
  data: {
     //缓存中的地址
     address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  //模拟订单
  modeOrder: {},
  //判断支付数据还是购物车数据
  isCart: "",
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    let carts = wx.getStorageSync("cart") || [];
    //
    carts = carts.filter(v => !v.flag);

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let isCart='';
    if (carts == '') {
      // 过滤后的购物车数组
      this.isCart = true
      wx.setStorageSync("isCart",true)
      cart = cart.filter(v => v.checked);
      cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      })
    } else {
      this.isCart = false
      wx.setStorageSync("isCart",false)
      //支付的数据
      cart = carts;
      cart.forEach(v => {
        totalPrice = v.goods_price;
        totalNum = 1;
      })
    }
    //过滤后的支付数组
    this.setData({
      address
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  //点击支付
  async handleOrderPay() {
    try {
      //判断收货地址
      const {
        address
        
      } = this.data;
      if (!address.userName) {
        wx.showToast({
          title: '您还没有选择收货地址',
          icon: 'none'
        })
        return;
      }
      const {
        totalPrice
      } = this.data
      if (totalPrice === 0) {
        wx.showToast({
          title: '商品错误,请重新选择',
          icon: "none",
          mask: true
        })
        return
      } else {

        const token = wx.getStorageSync("token");
        //创建订单
        //准备请求头参数
        const header = {
          Authorization: token
        }
        // 3.2 准备 请求体参数
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address.all;
        const cart = this.data.cart;
        let goods = [];
        cart.forEach(v => goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        }))
        const orderParams = {
          order_price,
          consignee_addr,
          goods
        };
        // 准备发送请求 创建订单 获取订单编号
        const res = await request({
          url: "/my/orders/create",
          method: "POST",
          data: orderParams,
          header
        });
        const {
          order_number
        } = res.data.message
        const {
          create_time
        } = res.data.message
        //模拟订单
        const create_times = new Date(create_time * 1000).toLocaleString()
        this.modeOrder.order_num = order_number;
        this.modeOrder.order_time = create_times;
        this.modeOrder.status = 1;
        //控制输出订单的次数
        wx.setStorageSync("isTime",true)
        //预支付
        const ress = await request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          header,
          data: {
            order_number
          }
        })
        const {
          pay
        } = ress.data.message
        //支付 暂无权限
        const result = await requestPayment(pay);
      }

    } catch (err) {
      setTimeout(() => {
        //手动删除缓存中 支付的订单
        let newCart = wx.getStorageSync("cart");
        //模拟订单数据
        let modeCart = {
          ...newCart.filter(v => v.checked)
        };
        modeCart.modeOrder = this.modeOrder
        let modeCartList = wx.getStorageSync('modeCart') || [];
        if (modeCartList == '') {
          modeCartList.push(modeCart);
          wx.setStorageSync("modeCart", modeCartList);
        } else {
          let modeCartListStory = wx.getStorageSync('modeCart')
          modeCartListStory.push(modeCart);
          wx.setStorageSync("modeCart", modeCartListStory);
        }
        //清除数据
        if (this.isCart) {
          newCart = newCart.filter(v => !v.checked && v.flag);
          wx.setStorageSync("cart", newCart);
        }

        //支付操作 跳转到订单
        wx.navigateTo({
          url: '/pages/order/order',
        })
      }, 1000)

    }
  },
  onUnload() {
    //清除支付返回后的数据
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v => v.flag);
    wx.setStorageSync("cart", newCart);
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
  },



})