var Data=require("../../../utils/getUrl.js")
var firstcome=0
Page({
  data: {
    anim:'',
   plantBasic:{},
   plantmain:{},
   virexist:Boolean,
   isStar:Boolean,
   colsuc:false,
   modelcon:"",
   star:true,
   isgarden:0,
   addgarmodel:false,
   askdel:false,
   introduct:false,
   introductfir:false
  },
  down(){
    var anim=wx.createAnimation({
      delay: 0,
      duration:400
    }).translateY('3vh').step().export()
    this.setData({
      anim:anim,
     
    })
  },
  stay(){
    var anim=wx.createAnimation({
      delay: 0,
      duration:100
    }).translateY('0vh').step().export()
    this.setData({
      anim:anim
    })
  },
  return(){
    wx.navigateBack({
      delta: 1,
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
    var  that=this
    if(wx.getStorageSync('newuser')&&firstcome==1){
      that.setData({
        introduct:true,
        introductfir:true
      })
    }
   wx.request({
     url:Data.getUrl+ '/virtualPlant/search',
     header:{
       "token":wx.getStorageSync('token')
     },
     data:{
      plantName:wx.getStorageSync('identify')
     },
     success(res){
       console.log(res)
       that.setData({
         plantBasic:res.data.data[0].plantBasic,
         plantmain:res.data.data[0].maintenance,
         virexist:res.data.data[0].existVirtual,
         star:res.data.data[0].star,
         isgarden:res.data.data[0].isGarden
        })
     }
   })
  },
  collcateask(e){
 var that=this
    console.log(e)
    if(that.data.star){
      that.setData({
        askdel:true
      })
    }else{
      that.collcate(e)
    }
  },
  collcate(e){
   var that=this
    wx.request({
      url: Data.getUrl+'/plant/star',
      header:{
        "token":wx.getStorageSync('token')
      },
      data:{
        plantId:e.currentTarget.dataset.plantid,
        star:that.data.star
      },
      method:"POST",
      success(res){
        console.log(res)
        if(res.data.data.isStar){
        that.setData({
          colsuc:true,
          modelcon:"收藏成功",
          star:res.data.data.isStar
        })}
        else{
          that.setData({
            askdel:false,
            colsuc:true,
            modelcon:"取消成功",
            star:res.data.data.isStar
          })}
        
        var timer=setTimeout(function(){
          that.setData({
            colsuc:false,
            modelcon:""
          })
        },1000)
      }
    })
  },
  ifaddgar(e){
    var that=this;
  if(that.data.isgarden==0){
    that.addgar(e)
  }
  else{
 that.setData({
  addgarmodel:true
 })
  }
  },
  close(){
    this.setData({
      addgarmodel:false,
      askdel:false
     })
  },
  addgar(e){
    var that=this
    wx.request({
      url:Data.getUrl +'/virtualPlant/addGarden',
      data:{
        plantId:e.currentTarget.dataset.plantid
      },
      header:{
        "token":wx.getStorageSync('token')
      },
      method:"POST",
      success(res){
         console.log(res)
        that.setData({
         addgarmodel:false,
          colsuc:true,
          modelcon:"加入成功"
        })
        wx.setStorageSync('myvirtualid', res.data.data)
        var timer=setTimeout(function(){
          that.setData({
            colsuc:false,
            modelcon:""
          })
          
        },1000)
        let pages = getCurrentPages();  
          for(var i=0;i<pages.length-1;i++){
          if(pages[i].route=="pages/index/index"||pages[i].route=="packvir/pages/virlist/virlist"){
          let beforePage = pages[i];
          beforePage.onLoad();
       }}
          wx.navigateTo({
            url: '../virtual/virtual',
          })
      }
    })
  },
  scanage(){
     wx.redirectTo({
       url: '../camera/camera',
     })
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})