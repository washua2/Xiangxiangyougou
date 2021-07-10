// 引入 用来发送请求的方法
import { request} from "../../request/index.js"

Page({
  data: {
    //轮播图
    swiperList:[],
    //导航
    cateList:[],
    //楼层
    floorList:[]
  },
  onLoad(options) {
      // //1.发送异步请求获取轮播图数据
      // wx.request({
      //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      //   success:(res)=>{
      //     console.log(res.data.message);
      //     this.setData({
      //       swiperList:res.data.message
      //     })
      //   }
      // })
      this.getSwiperList()
      this.getCateList()
      this.getFloorList()
  },
  //获取轮播图数据
   getSwiperList(){
    request({url:"/home/swiperdata"}).then(res=>{
      this.setData({
        swiperList:res.data.message
      })
      this.swiper()
    })
  },
  //获取 导航数据
  getCateList(){
    request({url:"/home/catitems"}).then(res=>{
      this.setData({
        cateList:res.data.message
      })

    })
  },
  //获取楼层
  getFloorList(){
    request({url:"/home/floordata"}).then(res=>{
      this.setData({
        floorList:res.data.message
      })
      this.jump()

    })
  },
  //内容跳转
  jump(){
    const {floorList}=this.data
    let product_list=[]
    floorList.forEach(v=>{
      product_list.push(v.product_list)
    })
    product_list.forEach(v=>{
      v.forEach(r=>{
        r.navigator_url= r.navigator_url.replace("goods_list","goods_list/goods_list")
      })
    })
    this.setData({
      floorList
    })
  },
  swiper(){
    const {swiperList}=this.data
    swiperList.forEach(v=>{
      v.navigator_url=v.navigator_url.replace("main","goods_detail")
    })
    this.setData({
      swiperList
    })
  }

 
})