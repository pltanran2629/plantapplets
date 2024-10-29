// components/returnbtn/returnbtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
  return(){
    let pages = getCurrentPages();   //获取小程序页面栈
    let beforePage = pages[pages.length -2];
    beforePage.onLoad();
    wx.navigateBack({
      delta: 1,
    })
  }
  }
})
