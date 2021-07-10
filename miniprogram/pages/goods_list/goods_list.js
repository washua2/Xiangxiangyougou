import {
  request
} from "../../request/index.js"

// pages/goods_list/goods_list.js
Page({
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    activeIndex: 0,
    goodsList: [],
  },
  //接口的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query= options.query||"";
    this.getGoodsList()

  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    });
    //获取商品总条数
    const total = res.data.message.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //结构数据
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  //标题点击事件 从子组件传过来
  handleTabsItemChange(e) {
    //获取索引值
    const {
      index
    } = e.detail
    //修改tabs的值
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  //下拉触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没下一页数据了'
      });
      return
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  }

})