var Data=require("../../utils/getUrl.js")
var firstcome=0;
var vh=0
var vw=0
Page({
  data: {
    activetab: 0,
    virshowpic: false,
    canvashidden:true, 
    realshowpic:false,
    cardimageurl:"",
    anim:"",
    realLock:[],
    realUnlock:[],
    virLock:[],
    virUnlock:[],
    vircard:{},
    realcard:{},
    introduct:false,
    introductfir:false,
   isshowreturn:false,
   returnpath:""
  },
  realgar() {
    this.setData({
      activetab: 1
    })
    wx.setStorageSync('colactivetab', 1)
  },
  virgar() {
    this.setData({
      activetab: 0
    })
    wx.setStorageSync('colactivetab', 0)
  },
  introduct(){
   var that=this
   that.setData({
    introduct:false,
    introductfir:false
  })
  },
  tovirtualpage(e){
    wx.setStorageSync('myvirtualid', e.currentTarget.dataset.myvirtualid)
    wx.navigateTo({
      url: '../../packvir/pages/virtual/virtual',
    })
  },
  toplantdiary(e){
    wx.setStorageSync('plantdiaryid', e.currentTarget.dataset.diaryid)
    wx.setStorageSync('colactivetab', 1)
    wx.navigateTo({
      url: '../../packreal/pages/plantdiary/plantdiary',
    })
  },
  return(){
    if(this.data.returnpath=='virtual'){
      wx.navigateTo({
        url: '../../packvir/pages/virtual/virtual',
      })
    }
    if(this.data.returnpath=='real'){
      wx.navigateTo({
        url: '../../packreal/pages/plantdiary/plantdiary',
      })
    }
  },
  onLoad: function (options) {
    firstcome++
    var that=this;
    if(wx.getStorageSync('newuser')&&firstcome==1){
      that.setData({
        introduct:true,
        introductfir:true
      })
    }
    that.setData({
      isshowreturn:false,
      returnpath:""
    })
   if(wx.getStorageSync('colfrom')=="virtual"){
     that.setData({
       isshowreturn:true,
       returnpath:"virtual"
     })
   }
   if(wx.getStorageSync('colfrom')=="real"){
    that.setData({
      isshowreturn:true,
      returnpath:"real"
    })
  }
    wx.request({
      url:Data.getUrl+ '/collection/myCollection',
      header:{
        "token":wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
        that.setData({
          activetab: wx.getStorageSync('colactivetab'),
          realLock:res.data.data.realPlantList.realLock,
          realUnlock:res.data.data.realPlantList.realUnlock,
          virLock:res.data.data.virtualPlantList.virtualLock,
          virUnlock:res.data.data.virtualPlantList.virtualUnlock
        })
        wx.setStorageSync('colfrom', '')
        console.log(that.data.virUnlock)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  virshowpic(e) {
    var that = this;
   wx.request({
     url:Data.getUrl+ '/collection/download',
     data:{
      cId:e.currentTarget.dataset.cid
     },
     header:{
       "token":wx.getStorageSync('token')
     },
     success(res){
       console.log(res)
       that.setData({
      virshowpic: true,
      vircard:res.data.data
       })
     }
   })
    
    // var anim=wx.createAnimation({
    //   delay: 0,
    //   duration:1000
    // }).opacity(0.5).step()
    // that.setData({
    //   anim:anim.export()
    // })
  },
  
  realshowpic(e){
    var that = this
    wx.request({
      url: Data.getUrl+'/collection/download',
      header:{
        "token":wx.getStorageSync('token')
      },
      data:{
        cId:e.currentTarget.dataset.cid
      },
      success(res){
         that.setData({
           realshowpic: true,
           realcard:res.data.data
         })
      }
    })
  },
  closemodel() {
    var that = this
    that.setData({
      virshowpic: false,
      realshowpic:false,
    })
  },
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: (f) => {
          console.log(f);
          console.log(f.windowHeight)
          vh = f.windowHeight / 100;
          vw = f.windowWidth / 100;
          console.log(vw)
          resolve();
        },
        fail: (err) => {
          resolve();
        },
      });
    });
  },
  drawImageByLoad(canvas, ctx, url, x, y, w, h) {
    return new Promise((resolve, reject) => {
      // 背景图
      let img = canvas.createImage();
      img.src = url;
      img.onload = () => {
        ctx.drawImage(img, x*vw, y * vh,w*vw, h * vh); // url x y w h
        resolve();
      };
    });
  },
  setFontSizeByFont(ctx, fontszie) {
    ctx.font = `normal ${fontszie}px Arial, Verdana, Tahoma, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif`;
  },
  saveimage() {
    var that = this;
    that.setData({
      canvashidden:false
    })
    that.getSystemInfo();
    const query = wx.createSelectorQuery();
    query
      .select('#cavansId')
      .fields({
        node: true,
        size: true
      })
      .exec(async (res) => {
        // console.log(33, res);
        const canvas = res[0].node;
        this.canvas = canvas;
        let ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        console.log(dpr)
        console.log(res[0].width)
        canvas.width = res[0].width*dpr;
        canvas.height = res[0].height*dpr;
        console.log(canvas.width)
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/bgimagezhao.png', 0, 0, 100, 100);
        if(that.data.activetab==0){
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/virgreenbg.png', 7.1, 23.5, 85.5, 53);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/virgreengonghu.png', 20.5, 29, 59, 40);
        await this.drawImageByLoad(canvas, ctx, that.data.vircard.plantImg, 20, 44, 60, 25);
       }
       else{
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/realgreenbg.png', 7.1, 23.5, 85.5, 53);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/realgreengonghu.png', 20.5, 39, 59, 30);
        await this.drawImageByLoad(canvas, ctx, that.data.realcard.plantImg, 20, 31, 60, 25); 
       }
        await this.drawImageByLoad(canvas,ctx,'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/name.png',35,70,30,4.3)
        ctx.save();
        ctx.fillStyle = '#fff';
        this.setFontSizeByFont(ctx, 3.5*vw );
        ctx.textAlign = 'center'
        if(that.data.activetab==0){
        ctx.fillText(that.data.vircard.name,50*vw ,72.5*vh )}
        else{
          ctx.fillText(that.data.realcard.name,50*vw ,72.5*vh )
        }
       wx.canvasToTempFilePath({
         canvas: this.canvas,
         success(res){
           console.log(res);
           wx.saveImageToPhotosAlbum({
             filePath: res.tempFilePath,
             success: function (res) {
               console.log(res)
              that.setData({
                canvashidden:true
              })
              wx.showToast({
                title: "保存图片成功！",
                duration: 2000
              })
            }
           })
         }
       })
      })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})