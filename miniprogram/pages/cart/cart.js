import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    //缓存中的地址
    address: {},
    //缓存中的购物车数据
    cart: [],
    //全选
    allChecked: false,
    //总价格 总数量
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
   
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v => v.flag);
  

    
    this.setCart(cart)

  },
  //商品选中
  handeItemChange(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let {
      cart
    } = this.data
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked
    //重新设置购物车数据
    this.setCart(cart)

  },
  //设置购物车状态 重新计算数据
  setCart(cart) {
    //设置全选
    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    });
    //判断数组是否为空
    allChecked = cart.length !== 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart)

  },
  //全选功能
  handleItemAllCheck() {
    //获取data数据
    let {
      cart,
      allChecked
    } = this.data;
    //修改值
    allChecked = !allChecked
    //循环数组修改选中状态
    cart.forEach(v => v.checked = allChecked);
    //修改后的值重新 存进缓存中
    this.setCart(cart);
  },
  //商品数量的编辑
  handleItemNumEdit(e) {
    //获取传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到需要修改的id
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1);
            this.setCart(cart);
          } else if (res.cancel) {
          }
        }

      })
    } else {
      //修改数量
      cart[index].num += operation;
      //设置回缓存中
      this.setCart(cart)
    }

  },
  //点击结算
  handlePay() {
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    //判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else {
       //购物车订单判断
    let isPrice = wx.setStorageSync("isPrice", true);
      const {
        totalNum
      } = this.data;
      if (totalNum === 0) {
        wx.showToast({
          title: '您还没有选购商品',
          icon: 'none'
        })
        return;
      }
      //跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    }


  }


})