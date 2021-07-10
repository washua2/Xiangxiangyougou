// 引入 用来发送请求的方法
import { request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单数据
    rightContent:[],
    //左侧菜单的高亮
    currentIndex:0,
    //返回顶部
    scrollTop:0,

  },
  //接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取本地存储中的数据（小程序中也有本地存储）
    const Cates=wx.getStorageSync("cates")
    //判断
    if (!Cates) {
      //不存在 发送请求
      this.getCates()
    }else{
      //有旧 的数据 定义过期时间 
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates()
      }else{
        //使用旧的请求
        this.Cates=Cates.data
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      let rightContent=this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
      }
    }
  },
  

   //获取分类数据
   async getCates(){
    // request({url:"/categories"}).then(res=>{
    // })
    //使用es7的async await 来发送请求
    
    const res =await request({url:"/categories"});
       this.Cates=res.data.message;
     //把接口数据存入到本地存储中
     wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
     //构造左侧的大菜单数据
     let leftMenuList=this.Cates.map(v=>v.cat_name);
     //构造左侧的商品数据
     let rightContent=this.Cates[0].children
     this.setData({
       leftMenuList,
       rightContent
     })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
      const {index}=e.currentTarget.dataset
      //构造左侧的商品数据
      let rightContent=this.Cates[index].children
      this.setData({
        currentIndex:index,
        rightContent,
        //每次点击设置回到顶部为0
        scrollTop:0
      })

       
       
  }

 
})