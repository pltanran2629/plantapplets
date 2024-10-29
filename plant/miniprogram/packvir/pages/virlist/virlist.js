var Data=require("../../../utils/getUrl.js")
var firstcome=0
var sortorder=0
// var timecal=require("../../../utils/timecal.js")
Page({
  data: {
    ordertext:"养护时间",
    virlist:[],
    touchstarty:0,
    touchendy:0,
    open:true,
    openid:null,
    sysScroll:true,
    ismodel:false,
    content:'',
    success:false,
    introduct:false,
    introductfir:false
  },
return(){
  wx.navigateBack({
    delta: 1,
  })
},
touchstart(e){
  this.setData({
    touchstarty:e.changedTouches[0].pageY
  })
},
touchend(e){
  this.setData({
    touchendy:e.changedTouches[0].pageY
  })
  if(this.data.touchendy-this.data.touchstarty>20&&this.data.touchendy-this.data.touchstarty<100){
    this.setData({
      open:true,
      openid:e.currentTarget.dataset.myvirid,
      sysScroll:false
    })
  }
  console.log(this.data.touchendy-this.data.touchstarty)
  if(this.data.touchendy-this.data.touchstarty<-20&&this.data.touchendy-this.data.touchstarty>-100){
    this.setData({
      open:false,
      openid:null,
      sysScroll:true
    })
  }
},
deletplant(e){
  if(this.data.open){
  this.setData({
    ismodel:true
  })
  if(e.currentTarget.dataset.mature==0){
    this.setData({
      content:"你是否要删除该植物？"
    })
  }else{
    this.setData({
      content:"你是否要删除该植物以及所有数据？"
    })
  }
}
},
close(){
  this.setData({
    ismodel:false
  })
},
  sure(){
   var that=this
   wx.request({
     url:Data.getUrl+ '/virtualPlant/removeGarden',
     data:{
      myVirtualId:that.data.openid
     },
     header:{
       "token":wx.getStorageSync('token')
     },
     method:"POST",
     success(res){
       console.log(res)
       that.setData({
        ismodel:false,
        success:true,
        sysScroll:true
       })
       var timer=setTimeout(function(){
         that.setData({
        success:false
         })
       },600)
       that.onLoad()
       let pages = getCurrentPages();  
       for(var i=0;i<pages.length-1;i++){
       if(pages[i].route=="pages/index/index"||pages[i].route=="packvir/pages/virlist/virlist"){
       let beforePage = pages[i];
       beforePage.onLoad();
    }}
      
     }
   })
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
    var that=this;
    if(wx.getStorageSync('newuser')&&firstcome==1){
    that.setData({
      introduct:true,
      introductfir:true
    })}
    wx.request({
      url: Data.getUrl+'/virtualPlant/queryVirtualList',
     header:{
       "token":wx.getStorageSync('token')
     },
     data:{
       sort:sortorder
     },
     method:"POST",
     success(res){
      //  console.log(res.data.data)
       for(var i=0;i<res.data.data.length;i++){
         res.data.data[i].createTime= res.data.data[i].createTime.split(" ")[0];
       }
       that.setData({
         virlist:res.data.data
       })
       for(var i=0;i<that.data.virlist.length;i++){
         that.setData({
           ['virlist['+i+'].canwater']:false,
           ['virlist['+i+'].canfer']:false,
           ["virlist["+i+"].watertimer"]:{hou:'',min:'',sec:''},
           ["virlist["+i+"].fertimer"]:{hou:'',min:'',sec:''},
         })
       }
       console.log(that.data.virlist)
         that.severalCountDown()
         that.severalCountDownfer()
     }
    })
  },
  changeorder(){
    var that=this
     if(sortorder==0){
       sortorder=1
      that.setData({
        ordertext:"成熟率"
      })
     }
     else{sortorder=0
      that.setData({
        ordertext:"养护时间"
      })
    }
    wx.request({
      url: Data.getUrl+'/virtualPlant/queryVirtualList',
     header:{
       "token":wx.getStorageSync('token')
     },
     data:{
       sort:sortorder
     },
     method:"POST",
     success(res){
      //  console.log(res.data.data)
       for(var i=0;i<res.data.data.length;i++){
         res.data.data[i].createTime= res.data.data[i].createTime.split(" ")[0];
       }
       that.setData({
         virlist:res.data.data
       })
       for(var i=0;i<that.data.virlist.length;i++){
         that.setData({
           ['virlist['+i+'].canwater']:false,
           ['virlist['+i+'].canfer']:false,
           ["virlist["+i+"].watertimer"]:{hou:'',min:'',sec:''},
           ["virlist["+i+"].fertimer"]:{hou:'',min:'',sec:''},
         })
       }
       console.log(that.data.virlist)
         that.severalCountDown()
         that.severalCountDownfer()
     }
    })
  },
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  severalCountDown: function () {
    var that = this;
    var time = 0;
    var obj = {};
    var timeList = that.data.virlist;
    //遍历数组，计算每个item的倒计时秒数
    timeList.forEach(function (item,index) {
      var endTime = new Date(item.nextWater.replace(/-/g, "/")).getTime();//结束时间时间戳
      var currentTime = new Date().getTime();//当前时间时间戳
      time = (endTime - currentTime) / 1000;
      // 如果活动未结束
      if (time > 0) {
        var hou = parseInt(time / (60 * 60));
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
        that.setData({
          ['virlist['+index+'].watertimer']:obj,
          ['virlist['+index+'].canwater']:false
        })
      } else { //活动已结束
        obj = {
          hou: "00",
          min: "00",
          sec: "00"
        }
        that.setData({
          ['virlist['+index+'].watertimer']:obj,
          ['virlist['+index+'].canwater']:true
        })
        clearTimeout(that.data.timeIntervalSeveral); //清除定时器
      }
      item.time = obj;
    })
    var timeIntervalSeveral = setTimeout(that.severalCountDown, 1000);
    that.setData({
      timeIntervalSeveral,
    })
  },
  severalCountDownfer: function () {
    var that = this;
    var time = 0;
    var obj = {};
    var timeList = that.data.virlist;
    //遍历数组，计算每个item的倒计时秒数
    timeList.forEach(function (item,index) {
      var endTime = new Date(item.nextFertilizer.replace(/-/g, "/")).getTime();//结束时间时间戳
      var currentTime = new Date().getTime();//当前时间时间戳
      time = (endTime - currentTime) / 1000;
      // 如果活动未结束
      if (time > 0) {
        var hou = parseInt(time / (60 * 60));
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
        that.setData({
          ['virlist['+index+'].fertimer']:obj,
          ['virlist['+index+'].canfer']:false
        })
      } else { //活动已结束
        obj = {
          hou: "00",
          min: "00",
          sec: "00"
        }
        that.setData({
          ['virlist['+index+'].fertimer']:obj,
          ['virlist['+index+'].canfer']:true
        })
        clearTimeout(that.data.timeIntervalSeveralfer); //清除定时器
      }
      item.time = obj;
    })
    var timeIntervalSeveralfer = setTimeout(that.severalCountDownfer, 1000);
    that.setData({
      timeIntervalSeveralfer,
    })
  },
  tovir(e){
   wx.setStorageSync('myvirtualid', e.currentTarget.dataset.myvirid)
   var pages=getCurrentPages()
   pages[pages.length-2].onLoad()
   wx.navigateBack({
     delta: 1,
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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