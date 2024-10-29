import tool from '../../utils/tool.js'
var Data = require("../../utils/getUrl.js");
const datacal = require("../../utils/datacal.js");
var firstcome = 0;
var sortorder = 0
Page({
  data: {
    swiperIndex: 0,
    selected: 2,
    list: 1,
    isshow: false,
    virlist: [],
    collectionNum: 0,
    realPlantNum: 0,
    virPlantNum: 0,
    currentindex: 0,
    introduct: false,
    introductfir: false,
    introductsec: false,
    introductthir: false,
    ordertext: '养护时间',
    searchcontent: ''
  },
  introducts() {
    var that = this
    if (that.data.introductfir) {
      that.setData({
        introductsec: true,
        introductfir: false
      })
    } else if (that.data.introductsec) {
      that.setData({
        introductsec: false,
        introductthir: true
      })
    } else if (that.data.introductthir) {
      that.setData({
        introductthir: false,
        introduct: false,

      })
    }
  },
  onLoad: function (options) {
    firstcome++;
    console.log(firstcome)
    var that = this;
    if (wx.getStorageSync('newuser') && firstcome == 1) {
      that.setData({
        introduct: true,
        introductfir: true
      })
    }
    that.setData({
      selected: 2,
      list: 1,
      isshow: false,
      currentindex: 0
    })
    wx.request({
      url: Data.getUrl + '/virtualPlant/queryVirtualPlant',
      method: "POST",
      data: {
        sort: sortorder
      },
      header: {
        "token": wx.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        var virlist = res.data.data.virtualPlantList
        for (var i = 0; i < virlist.length; i++) {
          virlist[i].createTime = virlist[i].createTime.split(" ")[0]
          virlist[i].createTime = datacal.getDaysBetween(virlist[i].createTime)
          virlist[i].maturityRate = Number(virlist[i].maturityRate * 100).toFixed(0);
          virlist[i].maturityRate += "%"
        }
        that.setData({
          virlist: virlist,
          virPlantNum: res.data.data.virtualPlantNum,
          realPlantNum: res.data.data.realPlantNum,
          collectionNum: res.data.data.collectionNum
        })
        for (var i = 0; i < virlist.length; i++) {
          that.setData({
            ['virlist.[' + i + '].waterfertime']: 0
          })
        }
        that.severalCountDown()
      }
    })
  },
  changeorder() {
    var that = this
    if (sortorder == 0) {
      sortorder = 1
      that.setData({
        ordertext: "成熟率"
      })
    } else {
      sortorder = 0
      that.setData({
        ordertext: "养护时间"
      })
    }
    that.setData({
      isshow: false,
      currentindex: 0
    })
    wx.request({
      url: Data.getUrl + '/virtualPlant/queryVirtualPlant',
      method: "POST",
      data: {
        sort: sortorder
      },
      header: {
        "token": wx.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        var virlist = res.data.data.virtualPlantList
        for (var i = 0; i < virlist.length; i++) {
          virlist[i].createTime = virlist[i].createTime.split(" ")[0]
          virlist[i].createTime = datacal.getDaysBetween(virlist[i].createTime)
          virlist[i].maturityRate = Number(virlist[i].maturityRate * 100).toFixed(0);
          virlist[i].maturityRate += "%"
        }
        that.setData({
          virlist: virlist,
          virPlantNum: res.data.data.virtualPlantNum,
          realPlantNum: res.data.data.realPlantNum,
          collectionNum: res.data.data.collectionNum
        })
        for (var i = 0; i < virlist.length; i++) {
          that.setData({
            ['virlist.[' + i + '].waterfertime']: 0
          })
        }
        that.severalCountDown()
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
    timeList.forEach(function (item, index) {
      var endTime;
      var watendTime = new Date(item.nextWater.replace(/-/g, "/")).getTime(); //结束时间时间戳
      var ferendTime = new Date(item.nextFertilizer.replace(/-/g, "/")).getTime(); //结束时间时间戳
      // console.log(watendTime,ferendTime)
      var currentTime = new Date().getTime(); //当前时间时间戳
      if ((ferendTime >= currentTime) && (watendTime >= currentTime)) {
        if (watendTime > ferendTime)
          endTime = ferendTime;
        else {
          endTime = watendTime
        }
      } else if ((ferendTime >= currentTime) && (watendTime < currentTime)) {
        if (item.remainWater) {
          endTime = watendTime
        } else {
          endTime = ferendTime
        }
      } else if ((watendTime >= currentTime) && (ferendTime < currentTime)) {
        if (item.remainFertilizer) {
          endTime = ferendTime
        } else {
          endTime = watendTime
        }
      } else {
        endTime = currentTime
      }
      // console.log(endTime)
      time = (endTime - currentTime) / 1000;
      // 如果活动未结束
      if (time > 0) {
        var hou = parseInt(time / (60 * 60));
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        that.setData({
          ['virlist[' + index + '].waterfertime']: min + hou * 60 + "min"
        })
      } else { //活动已结束
        that.setData({
          ['virlist[' + index + '].waterfertime']: 0 + 'min'
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
  chooselist(e) {
    var that = this;
    var listid = e.currentTarget.dataset.searid
    if (that.data.list == 1) {
      that.setData({
        selected: 0,
        list: 0
      })
    } else if (that.data.list == 2) {
      that.setData({
        selected: 1,
        list: 0
      })
    } else {
      that.setData({
        list: listid,
        selected: 2,
        searlist: []
      })
    }
  },
  // 轮播图
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  tocamera() {
    wx.navigateTo({
      url: '../../packvir/pages/camera/camera',
    })
  },
  tovirtual(e) {
    wx.setStorageSync('myvirtualid', e.currentTarget.dataset.myvirtualplant)
    wx.navigateTo({
      url: '../../packvir/pages/virtual/virtual',
    })
  },
  searchimg() {
    var that = this;
    this.searchthing(that.data.searchcontent)
  },
  search(e) {
    console.log(Date.now())
    var that = this;
    that.setData({
      searchcontent: e.detail.value
    })
    tool.debounce(this.searchthing(e.detail.value), 40)
  },
  searchthing(item) {
    var that = this
    if (that.data.list == 1) {
      wx.request({
        url: Data.getUrl + '/plant/searchList',
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          plantName: item
        },
        success(res) {
          that.setData({
            searlist: res.data.data
          })
          if (res.data.data.length > 0) {
            console.log(Date.now())
            that.setData({
              isshow: true
            })
          } else {
            that.setData({
              isshow: false
            })
            wx.showToast({
              title: '暂无该植物，换个植物试试呀',
              icon: 'none',
              duration: 1500
            })
          }
        }
      })
    }
    if (that.data.list == 2) {
      wx.request({
        url: Data.getUrl + '/virtualPlant/searchMyVirtual',
        header: {
          "token": wx.getStorageSync('token')
        },
        data: {
          plantName: item
        },
        success(res) {
          that.setData({
            searlist: res.data.data
          })
          if (res.data.data.length > 0) {
            that.setData({
              isshow: true
            })
          } else {
            that.setData({
              isshow: false
            })
            wx.showToast({
              title: '暂无该植物，快去添加植物吧',
              icon: 'none',
              duration: 1500
            })
          }
        }
      })
    }
  },
  onblur() {
    var that = this;
    that.setData({
      isshow: false,
      searlist: []
    })
  },
  topage(e) {
    if (this.data.list == 1) {
      //  console.log(e)
      wx.setStorageSync('identify', e.currentTarget.dataset.knowledgename)
      wx.navigateTo({
        url: '../../packvir/pages/plantknow/plantknow',
      })
      this.setData({
        isshow: false
      })
    } else {
      wx.setStorageSync('myvirtualid', e.currentTarget.dataset.myvirplantid)
      wx.navigateTo({
        url: '../../packvir/pages/virtual/virtual',
      })
      this.setData({
        isshow: false
      })
    }
  },
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(getCurrentPages()[getCurrentPages().length-1].options)
    // this.onLoad()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.changenum()
  },
  changenum() {
    var that = this
    wx.request({
      url: Data.getUrl + '/virtualPlant/queryVirtualPlant',
      method: "POST",
      data: {
        sort: sortorder
      },
      header: {
        "token": wx.getStorageSync('token')
      },
      success(res) {
        that.setData({
          virPlantNum: res.data.data.virtualPlantNum,
          realPlantNum: res.data.data.realPlantNum,
          collectionNum: res.data.data.collectionNum
        })
      }
    })
  },
  onHide: function () {

  }
})