var Data = require("../../../utils/getUrl.js")
var firstcome = 0
var loadwaterflag = false
var loadferflag = false
var vw = 0
var vh = 0
Page({
  data: {
    taskopen: false,
    task: " ",
    wateranim: true,
    tree: false,
    bottle: false,
    shutree: false,
    waterbool: false,
    feranim: true,
    tree1: false,
    soil: false,
    soilone: false,
    msg: {},
    watertimer: '',
    waterdjs: {
      hour: "00",
      min: "00",
      sec: "00"
    },
    canwater: true,
    nowwater: 0,
    fertimer: '',
    ferdjs: {
      hour: "00",
      min: "00",
      sec: "00"
    },
    canfer: true,
    nowfer: 0,
    introduct: false,
    introductfir: false,
    introductsec: false,
    unlock: false,
    successplant: false,
    virshowpic: false,
    vircard: "",
    canvashidden:false
  },
  ar() {
    wx.navigateTo({
      url: 'plugin://kivicube-slam/scene?id=' + this.data.msg.arUrl,
    })
  },
  tasktext() {
    this.setData({
      taskopen: !this.data.taskopen,
    })
  },
  watering() {
    if(loadwaterflag==false&&this.data.canwater==true&& (this.data.nowwater < this.data.msg.totalWater)){
      wx.showToast({
        icon:'none',
        title: '施肥完成才可以浇水哦~',
        duration:1500
      })
    }
    if (this.data.canwater && (this.data.nowwater < this.data.msg.totalWater) && loadwaterflag) {
      loadferflag = false
      wx.setStorageSync('action', "water")
      var wateranim = this.data.wateranim
      if (wateranim) {
        this.setData({
          wateranim: false,
          tree: true,
          nowwater: this.data.nowwater + 1
        })
      } else return false;
    }
  },
  bottlestart() {
    this.setData({
      bottle: true
    })
  },
  bottleend() { //水滴动画结束
    this.setData({
      waterbool: true,
    })
    setTimeout(() => {
      this.setData({
        bottle: false,
        tree: false,
        shutree: true,
        waterbool: false,
      })
    }, 500)
  },
  toknow() {
    wx.setStorageSync('identify', this.data.msg.plantBasic.plantBasic.name)
    wx.navigateTo({
      url: '../../pages/plantknow/plantknow',
    })
  },
  treeend() {
    var that = this
    that.setData({
      tree: false,
      shutree: false,
      wateranim: true,
      feranim: true,
      tree1: false,
      soil: false,
      soilone: false
    })
    if ((wx.getStorageSync('action') == "water") && that.data.canwater) {
      wx.request({
        url: Data.getUrl + '/virtualPlant/water',
        method: "POST",
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          myVirtualId: wx.getStorageSync('myvirtualid')
        },
        success(res) {
          console.log(res)
          res.data.data.maturityRate = Number(res.data.data.maturityRate * 100).toFixed(0);
          that.setData({
            msg: res.data.data,
            nowwater: res.data.data.nowWater,
            nowfer: res.data.data.nowFertilizer,
          })
          if (that.data.msg.maturityRate == 100) {
            that.setData({
              successplant: true
            })
          }
          let pages = getCurrentPages();
          for (var i = 0; i < pages.length - 1; i++) {
            if (pages[i].route == "pages/index/index" || pages[i].route == "packvir/pages/virlist/virlist" || pages[i].route == "pages/piccollect/piccollect") {
              let beforePage = pages[i];
              beforePage.onLoad();
            }
          }
          loadferflag = true
          that.countwatertime()
        }
      })
    }
    if ((wx.getStorageSync('action') == "fer") && that.data.canfer) {
      wx.request({
        url: Data.getUrl + '/virtualPlant/fertilize',
        method: "POST",
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          myVirtualId: wx.getStorageSync('myvirtualid')
        },
        success(res) {
          console.log(res)
          res.data.data.maturityRate = Number(res.data.data.maturityRate * 100).toFixed(0);
          that.setData({
            msg: res.data.data,
            nowfer: res.data.data.nowFertilizer,
            nowwater: res.data.data.nowWater
          })
          if (that.data.msg.maturityRate == 100) {
            that.setData({
              successplant: true
            })
          }
          let pages = getCurrentPages();
          for (var i = 0; i < pages.length - 1; i++) {
            if (pages[i].route == "pages/index/index" || pages[i].route == "packvir/pages/virlist/virlist") {
              let beforePage = pages[i];
              beforePage.onLoad();
            }
          }
          loadwaterflag = true
          that.countfertime()
        }
      })
    }

  },
  fertilizer() {
    if(loadferflag==false&&this.data.canfer==true && (this.data.nowfer < this.data.msg.totalFertilizer) ){
      wx.showToast({
        icon:'none',
        title: '浇水完成才可以施肥哦~',
        duration:1500
      })
    }
    if (this.data.canfer && (this.data.nowfer < this.data.msg.totalFertilizer) && loadferflag) {
      loadwaterflag = false
      wx.setStorageSync('action', "fer")
      var feranim = this.data.feranim
      if (feranim) {
        this.setData({
          feranim: false,
          tree1: true,
          nowfer: this.data.nowfer + 1
        })
      }
    } else return false;
  },
  ferstart() {
    this.setData({
      soil: true
    })
  },
  ferend() {
    this.setData({
      soilone: true,
    })
    setTimeout(() => {
      this.setData({
        soil: false,
        tree: false,
        shutree: true,
        soilone: false,
      })
    }, 500)
  },
  return () {
    wx.navigateBack({
      delta: 1,
    })
  },
  tovirlist() {
    wx.navigateTo({
      url: '../virlist/virlist',
    })
  },
  tocol() {
    var that = this
    that.setData({
      unlock: false,
      successplant: false,
      virshowpic: false
    })
    if (that.data.msg.maturityRate < 100) {
      that.setData({
        unlock: true
      })
    } else {
      wx.request({
        url: Data.getUrl + '/collection/queryCId',
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          plantId: that.data.msg.plantBasic.plantBasic.id,
          cType: 0
        },
        success: (res) => {
          console.log(res)
          wx.request({
            url: Data.getUrl + '/collection/download',
            header: {
              "token": wx.getStorageSync('token')
            },
            data: {
              cId: res.data.data
            },
            success: (res) => {
              console.log(res)
              that.setData({
                vircard: res.data.data,
                virshowpic: true
              })
            }
          })
        }
      })
    }
  },
  close() {
    this.setData({
      unlock: false,
      successplant: false,
      virshowpic: false
    })
  },
  introduct() {
    var that = this
    if (that.data.introductfir) {
      that.setData({
        introductfir: false,
        introductsec: true
      })
    } else if (that.data.introductsec) {
      that.setData({

        introductsec: false,
        introduct: false
      })
    }
  },
  onLoad(options) {
    loadwaterflag = false
    loadferflag = false
    firstcome++
    var that = this;
    if (wx.getStorageSync('newuser') && firstcome == 1) {
      that.setData({
        introduct: true,
        introductfir: true
      })
    }
    var pages = getCurrentPages()
    console.log(pages)
    wx.request({
      url: Data.getUrl + '/virtualPlant/queryMyVirtual',
      header: {
        "token": wx.getStorageSync('token')
      },
      method: "POST",
      data: {
        myVirtualId: wx.getStorageSync('myvirtualid')
      },
      success(res) {
        console.log(res)
        res.data.data.maturityRate = Number(res.data.data.maturityRate * 100).toFixed(0);
        that.setData({
            msg: res.data.data,
            nowwater: res.data.data.nowWater,
            nowfer: res.data.data.nowFertilizer
          }),
          that.countwatertime(),
          that.countfertime()
      }
    })
  },
  countwatertime() {
    var that = this;
    //  that.setData({
    //    canwater:false
    //  })
    that.setData({
      watertimer: setInterval(function () {
        var lefttime = parseInt((new Date(that.data.msg.nextWater.replace(/-/g, "/")).getTime() - new Date().getTime()))
        if (lefttime <= 0) {
          loadwaterflag = true
          that.setData({
            canwater: true
          })
          clearInterval(that.data.watertimer);
          return;
        }
        var h = parseInt(lefttime / 1000 / 3600 % 24); //小时
        var m = parseInt(lefttime / 1000 / 60 % 60); //分钟
        var s = parseInt(lefttime / 1000 % 60); //当前的秒

        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m;
        s < 10 ? s = "0" + s : s;
        that.setData({
          canwater: false,
          waterdjs: {
            hour: h,
            min: m,
            sec: s
          }
        })
      }, 1000)
    })
  },
  countfertime() {
    console.log("zhixing")
    var that = this;
    that.setData({
      fertimer: setInterval(function () {
        var lefttime = parseInt((new Date(that.data.msg.nextFertilizer.replace(/-/g, "/")).getTime() - new Date().getTime()))
        if (lefttime <= 0) {
          loadferflag = true
          that.setData({
            canfer: true
          })
          clearInterval(that.data.fertimer);
          return;
        }
        var h = parseInt(lefttime / 1000 / 3600 % 24); //小时
        var m = parseInt(lefttime / 1000 / 60 % 60); //分钟
        var s = parseInt(lefttime / 1000 % 60); //当前的秒

        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m;
        s < 10 ? s = "0" + s : s;
        that.setData({
          canfer: false,
          ferdjs: {
            hour: h,
            min: m,
            sec: s
          }
        })
      }, 1000)
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

        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/virgreenbg.png', 7.1, 23.5, 85.5, 53);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/virgreengonghu.png', 20.5, 29, 59, 40);
        await this.drawImageByLoad(canvas, ctx, that.data.vircard.plantImg, 20, 44, 60, 25);
        await this.drawImageByLoad(canvas, ctx, 'https://hotpotman.oss-cn-beijing.aliyuncs.com/basic/name.png', 35, 70, 30, 4.3)
        ctx.save();
        ctx.fillStyle = '#fff';
        this.setFontSizeByFont(ctx, 3.5 * vw);
        ctx.textAlign = 'center'
        ctx.fillText(that.data.vircard.name, 50 * vw, 72.5 * vh)
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