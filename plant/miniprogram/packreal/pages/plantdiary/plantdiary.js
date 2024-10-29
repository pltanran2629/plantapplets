var Data = require("../../../utils/getUrl.js");
var phase = require('../../../utils/phase.js')
var period = require('../../../utils/datacal.js')
var flag = 0
var firstcome = 0
var vh = 0
var vw = 0
Page({
  data: {
    open: false,
    jindun: 0.4,
    diarybasic: {},
    record: [],
    diaryopen: false,
    diaryid: 0,
    touchstartx: 0,
    touchendx: 0,
    modelshowdelplant: false,
    modelshowdeldia: false,
    modelcontent: '',
    success: false,
    introduct: false,
    introductfir: false,
    introductsec: false,
    introductthird: false,
    touchstarty: 0,
    touchendy: 0,
    realshowpic: false,
    canvashidden: false
  },
  startouch(e) {
    this.setData({
      touchstartx: e.changedTouches[0].pageX,
      touchstarty: e.changedTouches[0].pageY
    })
  },
  endtouch(e) {
    // console.log(e.changedTouches[0].pageX) 
    this.setData({
      touchendx: e.changedTouches[0].pageX,
      touchendy: e.changedTouches[0].pageY
    })
    //左滑
    console.log(e)
    if ((this.data.touchstartx - this.data.touchendx > 20) && (Math.abs(this.data.touchstarty - this.data.touchendy) < 40)) {
      this.setData({
        diaryopen: true,
        diaryid: e.currentTarget.dataset.diaryid
      })
      console.log(this.data.diaryid)
    }
    if ((this.data.touchstartx - this.data.touchendx < -20) && (Math.abs(this.data.touchstarty - this.data.touchendy) < 40)) {
      this.setData({
        diaryopen: false,
        diaryid: null
      })
    }

  },
  open() {
    var that = this;
    that.setData({
      open: !that.data.open
    })
  },
  addnewphase() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['拍照', '选择图库图片'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success(res) {
              wx.setStorageSync('realgardenfrom', "plantdiary")
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              wx.navigateTo({
                url: '../addnewplant/addnewplant',
              })
            }
          })
        }
        if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              wx.setStorageSync('realgardenfrom', "plantdiary")
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              wx.navigateTo({
                url: '../addnewplant/addnewplant',
              })
            }
          })
        }
      }
    })
  },
  introduct() {
    var that = this;
    if (that.data.introductfir) {
      that.setData({
        introductfir: false,
        introductsec: true
      })
    } else if (that.data.introductsec) {
      that.setData({
        introductsec: false,
        introductthird: true
      })
    } else if (that.data.introductthird) {
      that.setData({
        introductthird: false,
        introduct: false
      })
    }
  },
  colpage() {
    var that = this
    if (that.data.diarybasic.taskProgress == 1) {
      wx.request({
        url: Data.getUrl + '/collection/queryCId',
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          cType: 1,
          plantId: that.data.diarybasic.plantId
        },
        success: (res2) => {
          console.log(res2)
          wx.request({
            url: Data.getUrl + '/collection/download',
            data: {
              cId: res2.data.data
            },
            header: {
              "token": wx.getStorageSync('token')
            },
            success: (res1) => {
              that.setData({
                realshowpic: true,
                realcard: res1.data.data
              })
            }
          })
        }
      })
    }else if(that.data.diarybasic.taskProgress <1&&that.data.diarybasic.taskProgress >0){
      wx.showToast({
        title: '未解锁图鉴，需继续完成任务哦~',
        icon:"none",
        duration:1500
      })
    }else{
      wx.showToast({
        title: '暂无任务哦~',
        icon:"none",
        duration:1500
      })
    }
  },
  closemodel1() {
    console.log(111)
    this.setData({
      realshowpic: false
    })
  },
  onLoad: function (options) {
    firstcome++
    var that = this;
    if (wx.getStorageSync('newuser') && firstcome == 1) {
      that.setData({
        introduct: true,
        introductfir: true
      })
    }
    wx.request({
      url: Data.getUrl + '/realPlant/queryRecords',
      header: {
        "token": wx.getStorageSync('token')
      },
      method: "POST",
      data: {
        diaryId: wx.getStorageSync('plantdiaryid')
      },
      success: (res) => {
        console.log(res)
        var diarybasic = res.data.data.diaryBasic
        diarybasic.growthStage = phase.phase(diarybasic.growthStage)
        diarybasic.createTime = diarybasic.createTime.split(' ')[0]
        var record = res.data.data.recordList
        for (var i = 0; i < record.length; i++) {
          record[i].growthStage = phase.phase(record[i].growthStage)
          record[i].recordTime = record[i].recordTime.split(' ')[0]
        }

        that.setData({
          diarybasic: diarybasic,
          maintenance: res.data.data.maintenance,
          record: record
        })
        if (wx.getStorageSync('realgardenfrom') == 'plantdiary1') {
          console.log("记录了")
          flag = 1
          let pages = getCurrentPages(); //获取小程序页面栈
          console.log(pages)
          let beforePage = pages[pages.length - 3];
          beforePage.onLoad();
          wx.setStorageSync('realgardenfrom', '')
        }
      }
    })
  },
  return () {
    // let pages = getCurrentPages();   //获取小程序页面栈
    // let beforePage = pages[pages.length -2];
    // beforePage.onLoad();
    wx.navigateBack({
      delta: 1,
    })
  },
  preimage(e) {
    var imgUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  deletdiary() {
    var that = this
    if (that.data.diaryopen) {
      that.setData({
        modelshowdeldia: true,
        modelcontent: "你确定删除该条植物日记吗？"
      })
    }
  },
  deletplant() {
    this.setData({
      modelshowdelplant: true,
      modelcontent: "你确定删除该植物吗？"
    })
  },
  closemodel() {
    this.setData({
      modelshowdelplant: false,
      modelshowdeldia: false
    })
  },
  delsure() {
    var that = this
    if (that.data.modelshowdelplant) {
      wx.request({
        url: Data.getUrl + '/realPlant/removeDiary',
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          diaryId: that.data.diarybasic.diaryId
        },
        method: "POST",
        success(res) {
          console.log(res)
          that.setData({
            modelshowdelplant: false,
            success: true
          })
          var timer = setTimeout(function () {
            that.setData({
              success: false
            })
            let pages = getCurrentPages(); //获取小程序页面栈
            console.log(pages)
            for (var i = 0; i < pages.length - 1; i++) {
              if (pages[i].route == "pages/index/index" || pages[i].route == "pages/realgarden/realgarden") {
                let beforePage = pages[i];
                beforePage.onLoad();
              }
            }
            wx.navigateBack({
              delta: 1,
            })
          }, 600)
        }
      })
    }
    if (that.data.modelshowdeldia) {
      wx.request({
        url: Data.getUrl + '/realPlant/removeRecord',
        data: {
          recordId: that.data.diaryid
        },
        header: {
          "token": wx.getStorageSync('token')
        },
        method: "POST",
        success(res) {
          console.log(res)
          that.setData({
            modelshowdeldia: false,
            success: true
          })
          var timer = setTimeout(function () {
            that.setData({
              success: false
            })
            let pages = getCurrentPages(); //获取小程序页面栈
            console.log(pages)
            for (var i = 0; i < pages.length - 1; i++) {
              if (pages[i].route == "pages/realgarden/realgarden") {
                let beforePage = pages[i];
                beforePage.onLoad();
              }
            }
          }, 600)
          that.onLoad()
        }
      })
    }
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
        ctx.drawImage(img, x * vw, y * vh, w * vw, h * vh); // url x y w h
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
      canvashidden: false
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
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        console.log(canvas.width)
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/bgimagezhao.png', 0, 0, 100, 100);

        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/realgreenbg.png', 7.1, 23.5, 85.5, 53);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/realgreengonghu.png', 20.5, 39, 59, 30);
        await this.drawImageByLoad(canvas, ctx, that.data.realcard.plantImg, 20, 31, 60, 25);

        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/name.png', 35, 70, 30, 4.3)
        ctx.save();
        ctx.fillStyle = '#fff';
        this.setFontSizeByFont(ctx, 3.5 * vw);
        ctx.textAlign = 'center'

        ctx.fillText(that.data.realcard.name, 50 * vw, 72.5 * vh)

        wx.canvasToTempFilePath({
          canvas: this.canvas,
          success(res) {
            console.log(res);
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log(res)
                that.setData({
                  canvashidden: true
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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