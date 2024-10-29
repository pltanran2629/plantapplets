import tool from '../../utils/tool.js'
var Data = require('../../utils/getUrl.js')
var period = require('../../utils/datacal.js')
var phase = require("../../utils/phase.js")
var firstcome = 0
Page({
  data: {
    startX: 0,
    endY: 0,
    currentindex: 0,
    animationData: '',
    totalnum: 0,
    datas: [],
    animarr: ['', '', ''],
    searanim: "",
    searresult: [],
    isshowsear: false,
    introduct: false,
    introductfir: false,
    introductsec: false,
    searchcontent: ''
  },
  toplantdetail(e) {
    wx.setStorageSync('plantdiaryid', e.currentTarget.dataset.diaryid)
    wx.setStorageSync('plantdiaryname', e.currentTarget.dataset.diaryname)
    this.setData({
      isshowsear: false
    })
    this.clearAnimation('.centopsecondtext', function () {})
    // console.log(this.data.isshowsear)
    wx.navigateTo({
      url: '../../packreal/pages/plantdiary/plantdiary',
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
        introduct: false,
        introductsec: false
      })
    }

  },
  onLoad: function (options) {
    firstcome++
    wx.setStorageSync('realgardenfrom', '')
    this.clearAnimation('.centopsecondtext', function () {})
    var that = this;

    that.setData({
      datas: [],
      currentindex: 0,
      animarr: ['', '', ''],
      isshowsear: false
    })
    wx.request({
      url: Data.getUrl + '/realPlant/queryRealPlant',
      method: "POST",
      header: {
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        var data = res.data.data.realPlantList;
        console.log(res)
        for (var i = 0; i < data.length; i++) {
          data[i].growthStage = phase.phase(data[i].growthStage)
          data[i].lastTime = data[i].lastTime.split(' ')[0]
          data[i].lastTime = period.getDaysBetween(data[i].lastTime)
          if (data[i].sunlightSimple == null) {
            data[i].sunlightSimple = '暂无'
          }
          if (data[i].wateringSimple == null) {
            data[i].wateringSimple = '暂无'
          }
          if (data[i].temp == null) {
            data[i].temp = '暂无'
          }
        }
        that.setData({
          totalnum: res.data.data.realPlantNum,
          datas: data,
        })
        if (wx.getStorageSync('newuser') && firstcome == 1) {
          that.setData({
            introduct: true,
            introductfir: true,
          })
        }
        // console.log(that.data.datas)
      }
    })
  },
  onReady: function () {
  },
  onShow: function () {
    // this.onLoad() 刷新页面栈
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  moveStart(e) {
    var startY = e.changedTouches[0].pageY;
    this.setData({
      startY: startY
    });
  },
  moveItem(e) {
    var that = this
    var endY = e.changedTouches[0].pageY;
    that.setData({
      endY: endY
    });
    var moveY = that.data.endY - that.data.startY;
    if (moveY > 20) {
      // that.change()
      that.down();
    }
    if (moveY < -20) {
      // that.change()
      that.up();
    }
  },

  functionpro() {
    new Promise((resolve, reject) => {
      this.change()
    })
  },
  down() {
    var that = this;
    that.functionpro();
    that.animate('.cenbotbg', [{
        translateY: "9%",
        translateX: '-50%',
        opacity: 0.8
      },
      {
        translateY: "18%",
        translateX: '-50%',
        opacity: 0.6
      },
      {
        translateY: "27%",
        translateX: '-50%',
        opacity: 0.4
      },
      {
        translateY: "36%",
        translateX: '-50%',
        opacity: 0.2
      },
      {
        translateY: "45%",
        translateX: '-50%',
        opacity: 0
      },
    ], 300, function () {
      that.clearAnimation('.cenbotbg', function () {})
      var newindex = that.data.currentindex
      newindex++;
      // 循环播放
      // var datalength = that.data.datas
      // if (newindex == datalength.length - 2) {
      //   that.setData({
      //     datas: that.data.datas.concat(datalength)
      //   })}
      that.setData({
        currentindex: newindex
      })
    })
  },
  change() {
    var that = this
    var anim = wx.createAnimation({
      duration: 300,
      transformOrigin: "50% 50%",
      timingFunction: 'linear'
    })
    anim.translateX('-50%').top('6vh').scale(1).backgroundColor("#4ABC78").step()
    var anim1 = wx.createAnimation({
      duration: 300,
      transformOrigin: "50% 50%",
      timingFunction: 'linear'
    })
    anim1.translateX('-50%').top('0vh').scale(0.85).backgroundColor("#34A562").step()
    var animarr = []
    var nowindex = that.data.currentindex
    animarr.push('')
    for (var i = 0; i < nowindex; i++) {
      animarr.push('')
    }
    animarr.push(anim.export())
    animarr.push(anim1.export())
    that.setData({
      animarr: animarr,
    })
  },
  up() {
    var that = this
    if (that.data.currentindex > 0) {
      var changeindex = that.data.currentindex
      var anim = wx.createAnimation({
        duration: 0,
        transformOrigin: "50% 50%",
        timingFunction: 'linear'
      })
      anim.translateX('-50%').top('-6vh').scale(0.7).backgroundColor("#227A46").step()
      var anim1 = wx.createAnimation({
        duration: 0,
        transformOrigin: "50% 50%",
        timingFunction: 'linear'
      })
      anim1.translateX('-50%').top('0vh').scale(0.85).backgroundColor("#34A562").step()
      var animarr = []
      animarr.push('')
      changeindex--;
      for (var i = 0; i < changeindex; i++) {
        animarr.push('')
      }
      animarr.push(anim1.export())
      animarr.push(anim.export())
      that.setData({
        currentindex: changeindex,
        animarr: animarr,
      })
    }
  },
  add() {
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
              wx.setStorageSync('realgardenfrom', "index")
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              wx.navigateTo({
                url: '../../packreal/pages/addnewplant/addnewplant',
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
              wx.setStorageSync('realgardenfrom', "index")
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              wx.navigateTo({
                url: '../../packreal/pages/addnewplant/addnewplant',
              })
            }
          })
        }
      }
    })
  },
  inputfocus() {
    //伸长动画
    // this.animate('.centopsecondtext', [{
    //     width: "45vw"
    //   },
    //   {
    //     width: "50vw"
    //   },
    //   // {width:"55vw" },
    // ], 5, function () {
    //   this.searchinput(this.data.searchcontent)
    // }.bind(this))
    this.searchinput(this.data.searchcontent)
  },
  inputblur(e) {
    // this.clearAnimation('.centopsecondtext', function () {})
    this.setData({
      isshowsear: false
    })
  },
  search(e) {
    var that = this
    that.setData({
      searchcontent: e.detail.value
    })
    tool.debounce(this.searchinput(e.detail.value),40) 
  },
  searchinput(item) {
    var that = this
    wx.request({
      url: Data.getUrl + '/realPlant/search',
      header: {
        "token": wx.getStorageSync('token')
      },
      data: {
        searchName: item
      },
      success: (res) => {
        if (res.data.data.length > 0) {
          that.setData({
            searresult: res.data.data,
            isshowsear: true
          })
        }
        else{
          that.setData({
            isshowsear: false
          })
          wx.showToast({
            title: '暂无该植物，快去添加植物吧',
            icon:'none',
            duration:1500
          })
        }
      }
    })
  },
  onShareAppMessage: function () {

  }
})