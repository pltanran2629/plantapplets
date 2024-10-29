// pages/guide/guide.js
var dataurl=require("../../utils/getUrl")
Page({
  data: {
    currentindex:0
  },
  bindGetUserInfo(res){
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
        wx.setStorageSync('nickname', res.userInfo.nickName);
        wx.showLoading({
          title: '正在登录...',
        })
        wx.request({
          url: dataurl.getUrl+'/user/addUserInfo',
          header:{
            "token":wx.getStorageSync("token")
          },
          method:'POST',
          data:{
            avatarUrl:res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          },
          success(res){           
            wx.hideLoading();
             wx.switchTab({
              url: '../index/index',
            })
          }
        })
      },
      fail() {
        wx.showModal({
        title: '通知',
        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
      });
     }
    })
  },
  onLoad: function (options) {
  },
  onSlideChangeEnd(e){
  this.setData({
    currentindex:e.detail.current
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