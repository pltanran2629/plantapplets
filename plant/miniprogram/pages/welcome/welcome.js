// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 topage(){
  if(wx.getStorageSync('nickname') != "" && wx.getStorageSync('avatarUrl') != ""){
    wx.setStorageSync('newuser', false)//修改
      wx.switchTab({
        url: '../index/index',
      })
    }
    else{
      wx.setStorageSync('newuser', true)
      wx.navigateTo({
        url: '../guide/guide',
      })
    }
},
  onLoad: function (options) {

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