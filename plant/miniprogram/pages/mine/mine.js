// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:''
  },
  onLoad: function (options) {
    if(!wx.getStorageSync('avatarUrl')){
      this.setData({
        avatar:'https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png@1280w_1l_2o_100sh.png',
        nickname:'游客'
      })
    }
    else{
    this.setData({
      avatar:wx.getStorageSync('avatarUrl'),
      nickname:wx.getStorageSync('nickname')
    })
    }
  },
  aboutus(){
    wx.navigateTo({
      url: '../aboutus/aboutus',
    })
  },
  record(){
    wx.navigateTo({
      url: '../record/record',
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })}
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