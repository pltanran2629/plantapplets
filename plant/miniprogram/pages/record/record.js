 var Data=require("../../utils/getUrl.js")
 var firstcome=0
Page({
  data: {
    touchstartx:0,
    touchendx:0,
    open:false,
    moveid:null,
    collist:[],
    ismodel:false,
    deletname:'',
    deletid:null,
    success:false,
    introduct:false,
    introductfir:false,
    touchstarty:0,
    touchendy:0
  },
  return(){
    let pages = getCurrentPages();   //获取小程序页面栈
    let beforePage = pages[pages.length -2];
    beforePage.onLoad();
    wx.navigateBack({
      delta: 1,
    })
  },
  touchstart(e){
  //  console.log(e.changedTouches[0].pageX) 
   this.setData({
     touchstartx:e.changedTouches[0].pageX,
     touchstarty:e.changedTouches[0].pageY,
  
  })
  },
  touchend(e){
    // console.log(e.changedTouches[0].pageX) 
   this.setData({
     touchendx:e.changedTouches[0].pageX,
    touchendy:e.changedTouches[0].pageY
    })
   //左滑
   console.log(e)
   if((this.data.touchstartx-this.data.touchendx>20)&&(Math.abs(this.data.touchstarty-this.data.touchendy)<40)){
     this.setData({
       open:true,
       moveid:e.currentTarget.dataset.id
     })
   }
   if((this.data.touchstartx-this.data.touchendx<-20)&&(Math.abs(this.data.touchstarty-this.data.touchendy)<40)){
    this.setData({
      open:false,
      moveid:null
    })
   }

   },
   introduct(){
     var that=this
    that.setData({
      introduct:false,
      introductfir:false
    })
   },
  onLoad(options) {
    firstcome++
    var that=this
    if(wx.getStorageSync('newuser')&&firstcome==1){
      that.setData({
        introduct:true,
        introductfir:true
      })
    }
    wx.request({
      url:Data.getUrl+ '/user/queryMyStar',
      header:{
        "token":wx.getStorageSync('token')
      },
      method:"POST",
      success(res){
        console.log(res)
        for(var i=0;i<res.data.data;i++){
          res.data.data[i].starTime=res.data.data[i].starTime.split(" ")[0]
        }
        that.setData({
          collist:res.data.data
        })
      }
    })
  },
  deletecol(e){
    if(this.data.open){
    this.setData({
      deletname:e.currentTarget.dataset.name,
      deletid:e.currentTarget.dataset.id,
      ismodel:true
    })
  }
  },
  close(){
   this.setData({
    ismodel:false
   })
  },
  sure(){
   var that=this;
   wx.request({
     url:Data.getUrl+ '/plant/star',
     data:{
      plantId:that.data.deletid,
      star:true
     },
     header:{
       "token":wx.getStorageSync('token')
     },
     method:"POST",
     success(res){
       console.log(res);
      that.setData({
        ismodel:false,
        success:true
      })
      var timer=setTimeout(function(){
        that.setData({
        success:false
        })
      },600)
      that.onLoad()
     }
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  toknow(e){
   wx.setStorageSync('identify', e.currentTarget.dataset.name)
   wx.navigateTo({
     url: '../../packvir/pages/plantknow/plantknow',
   })
  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})