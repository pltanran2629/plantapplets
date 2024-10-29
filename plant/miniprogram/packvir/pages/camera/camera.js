import {
  AsyncTask
} from '../../../utils/asynctask.js'
var base64str = '';
var sendcout = 0
var socketOpen = false;
var flag = false
let listener
const cameraReady = new AsyncTask()
let sockettask = {}
Page({
  data: {
    stop: null
  },
  onLoad: function (options) {
    base64str = '';
    sendcout = 0; //几张
    flag = false
    socketOpen = false;
    wx.getSystemInfo({
      success: (result) => {
        if (result.platform == 'devtools') {
          setTimeout(() => {
            this.test()
          }, 1500)
        }
      },
    })
    this.connectso()
    this.catchimage()
  },
  test() {
    cameraReady.resolve()
  },
  connectso: function () {
    sockettask = wx.connectSocket({
      url: 'wss://greenpath.top/webSocket',
      // protocols: ['protocol1'],
      header: {
        "token": wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res)
        flag = true
      }
    })
  },
  catchimage: function () {
    var that = this
    sockettask.onOpen((result) => {
      socketOpen = true;
      console.log(result)
      console.log("已经打开");
      var store = new Array();
      var ncount = 0
      cameraReady.promise.then(() => {
        const context = wx.createCameraContext()
        listener = context.onCameraFrame((frame) => {
          console.log(88)
          ncount++;
          if (frame && ncount > 50 && flag) {
            if (ncount % 60 == 0) {
              ncount = 0
              var data = new Uint8Array(frame.data);
              var clamped = new Uint8ClampedArray(data);
              wx.canvasPutImageData({
                data: clamped,
                canvasId: 'firstCanvas',
                x: 0,
                y: 0,
                width: frame.width,
                height: frame.height,
                success(res) {
                  wx.canvasToTempFilePath({
                    canvasId: 'firstCanvas',
                    x: 0,
                    y: 0,
                    width: frame.width,
                    height: frame.height,
                    destWidth: frame.width,
                    destHeight: frame.height,
                    fileType: 'png',
                    quality: 0.5,
                    success(res1) {
                      wx.getFileSystemManager().readFile({
                        filePath: res1.tempFilePath, //选择图片返回的相对路径
                        encoding: 'base64', //编码格式
                        success: res => {
                          base64str = res.data
                          var obj = {
                            image: 'data:image/png;base64,' + base64str
                          }
                          var json = JSON.stringify(obj);
                          sendcout++;
                          sockettask.onClose(
                            (res) => {
                              console.log(res)
                            }
                          )
                          sockettask.send({
                            data: json,
                            success: (res) => {
                              console.log(res)
                            },
                            fail: (res) => {
                              console.log(res)
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
        listener.start()
        this.setData({
          stop: setTimeout(this.unsuccess, 14000)
        })
      })
      sockettask.onMessage(function (msg) {
        var result = JSON.parse(msg.data)
        console.log(result);
        if (result.status == 0 && result.data.length > 0) {
          wx.setStorageSync('identify', result.data[0].name)
          socketOpen = false
          flag = false
          clearTimeout(that.data.stop)
          sockettask.close({
            code: (res) => {
              console.log(res)
            },
            success: (res) => {
              console.log(res)
            },
            fail: (res) => {
              console.log(res)
            }
          })
          listener.stop({})
          wx.redirectTo({
            url: '../../pages/plantknow/plantknow',
          })
        }
      })
    })
  },
  unsuccess() {
    listener.stop({
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log('error' + res)
      }
    })
    wx.showToast({
      title: '识别失败',
      icon: "error",
      duration: 1500
    })
    sockettask.close({
      code: (res) => {
        console.log(res)
      },
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
    socketOpen = false
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1500)
  },
  return () {
    wx.navigateBack({
      delta: 1,
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload() {
    var that = this
    console.log(555)
    if (socketOpen && listener) {
      listener.stop((res) => {
        console.log(res)
      })
      clearTimeout(that.data.stop)
      console.log(socketOpen)
      sockettask.close({
        code: (res) => {
          console.log(res)
        },
        success: (res) => {
          console.log(res)
        },
        fail: (res) => {
          console.log(res)
        }
      })
      socketOpen = false
      flag = false
    }
  }
})