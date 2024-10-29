var Data = require("../../../utils/getUrl.js");
var scienceName = ''
var diaryContent = ''
var inputcontent = ''
Page({
  data: {
    sysScroll: true,
    photourl: '',
    selectphase: null,
    dateString: "",
    plantname: '',
    isshowmodel: false,
    phase: [{
      phasename: '幼苗期',
      phasenameano: "（种子阶段）",
      phasedetail: '从第一片真叶到花蕾显现为幼苗期。在正常温度条件下，种子发芽后生根抽叶成为幼苗一般为45～50天。'
    }, {
      phasename: '生长期',
      phasenameano: "",
      phasedetail: '这个阶段，植物会迅速长出叶子和茎，这将支持未来花朵或果实的生长。'
    }, {
      phasename: '结果期',
      phasenameano: "",
      phasedetail: '果实的可食部分，除肉质的果皮以外，还有胎座组织及心室的隔壁组织，从子房发育膨大成为一个食用的果实，可分为细胞分裂期及细胞膨大期。'
    }]
  },
  showphase(e) {
    var that = this;
    that.setData({
      selectphase: e.currentTarget.dataset.index
    })
  },
  dateChange(e) {
    console.log("日期是", e.detail.dateString)
    this.setData({
      dateString: e.detail.dateString
    })
  },
  onfocus: function () {
    this.setData({
      sysScroll: false
    })
  },
  onblur: function (e, param, inst) {
    this.setData({
      sysScroll: true
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.uploadFile({
      filePath: wx.getStorageSync('takepic'),
      name: 'uploadFiles',
      url: 'https://greenpath.top/realPlant/upload',
      header: {
        "token": wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(typeof (res.data))
        var imagepath = JSON.parse(res.data)
        console.log(imagepath.data[0])
        that.setData({
          photourl: imagepath.data[0]
        })
        wx.setStorageSync('takepic', imagepath.data[0])
        if (wx.getStorageSync('realgardenfrom') == 'index') {
          wx.request({
            url: Data.getUrl + '/realPlant/identify',
            header: {
              "token": wx.getStorageSync('token')
            },
            data: {
              imgUrl: that.data.photourl
            },
            success: (res) => {
              console.log(res)
              if (res.data.data != null) {
                if (res.data.data.length > 0) {
                  scienceName = res.data.data[0].name
                  that.setData({
                    plantname: res.data.data[0].name
                  })
                }else{
                  scienceName = ''
                  that.setData({
                    plantname: ''
                  })
                }
              } else {
                scienceName = ''
                that.setData({
                  plantname: ''
                })
              }
            }
          })
        }
      }
    })

    if (wx.getStorageSync('realgardenfrom') == 'plantdiary') {
      that.setData({
        plantname: wx.getStorageSync('plantdiaryname')
      })
    }
    //  if(wx.getStorageSync('realgardenfrom')=='index'){
    //      wx.request({
    //        url: Data.getUrl+'/realPlant/identify',
    //        header:{
    //          "token":wx.getStorageSync('token')
    //        },
    //        data:{
    //         imgUrl:that.data.photourl
    //        },
    //        success:(res)=>{
    //          console.log(res)
    //          scienceName=res.data.data[0].name
    //          that.setData({
    //            plantname:res.data.data[0].name
    //          })
    //        }
    //      })
    //  }
  },
  chooseagain() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['拍照', '选择本地文件'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success(res) {
              console.log(res)
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              _this.onLoad();
            }
          })
        }
        if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              wx.setStorageSync('takepic', res.tempFilePaths[0])
              _this.onLoad();
            }
          })
        }
      }
    })
  },
  remarkInputAction(e) {
    diaryContent = e.detail.value
  },
  getInputValue(e) {
    inputcontent = e.detail.value
  },
  submitinforma() {
    var that = this
    if (wx.getStorageSync('realgardenfrom') == 'index') {
      var isedit;
      if (scienceName == inputcontent) {
        isedit = 0
      } else isedit = 1
      var plantnameri;
      if (inputcontent) {
        plantnameri = inputcontent
      } else plantnameri = that.data.plantname
      wx.request({
        url: Data.getUrl + '/realPlant/addDiary',
        header: {
          "token": wx.getStorageSync('token'),
        },
        method: "POST",
        data: {
          isEdit: isedit,
          scienceName: scienceName,
          plantName: plantnameri,
          plantImg: wx.getStorageSync('takepic'),
          growthStage: that.data.selectphase + 1,
          createTime: that.data.dateString + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
          diaryContent: diaryContent
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 0) {
            that.setData({
              isshowmodel: true
            })
            let pages = getCurrentPages();
            //获取小程序页面栈
            for (var i = 0; i < pages.length - 1; i++) {
              console.log(pages[i])
              if (pages[i].route == "pages/index/index" || pages[i].route == "pages/realgarden/realgarden") {
                let beforePage = pages[i];
                beforePage.onLoad();
              }
            }
            setTimeout(function () {
              that.setData({
                isshowmodel: false
              })
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
          }
        }
      })
    }
    if (wx.getStorageSync('realgardenfrom') == 'plantdiary') {
      wx.request({
        url: Data.getUrl + '/realPlant/addRecord',
        header: {
          'token': wx.getStorageSync('token')
        },
        method: "POST",
        data: {
          diaryId: parseInt(wx.getStorageSync('plantdiaryid')),
          plantImg: wx.getStorageSync('takepic'),
          growthStage: that.data.selectphase + 1,
          recordTime: that.data.dateString + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
          recordContent: diaryContent
        },
        success: (res) => {
          console.log(res)
          wx.setStorageSync('realgardenfrom', 'plantdiary1')
          if (res.data.status == 0) {
            console.log(555)

            that.setData({
              isshowmodel: true
            })
            let pages = getCurrentPages(); //获取小程序页面栈
            let beforePage = pages[pages.length - 2];
            beforePage.onLoad();
            setTimeout(function () {
              that.setData({
                isshowmodel: false
              })
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
          }
        }
      })
    }

  },
  return () {
    let pages = getCurrentPages(); //获取小程序页面栈
    let beforePage = pages[pages.length - 2];
    beforePage.onLoad();
    wx.navigateBack({
      delta: 1,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})