Component({
  data: {
    selected: '',
    color: "#000000",
    selectedColor: "#1A7C31",
    list: [{
      pagePath: "../index/index",
      iconPath: "../image/tabbar/tab1.png",
      selectedIconPath: "../image/tabbar/tab1s.png",
      text: "虚拟花园"
    }, {
      pagePath: "../realgarden/realgarden",
      iconPath: "../image/tabbar/tab2.png",
      selectedIconPath: "../image/tabbar/tab2s.png",
      text: "真实花园"
    },{
      pagePath: "../piccollect/piccollect",
      iconPath: "../image/tabbar/tab3.png",
      selectedIconPath: "../image/tabbar/tab3s.png",
      text: "植物图鉴"
    },
    {
      pagePath: "../mine/mine",
      iconPath: "../image/tabbar/tab4.png",
      selectedIconPath: "../image/tabbar/tab4s.png",
      text: "个人中心"
    }
  ],
  animationData:[]
  },
  attached() {
    
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      console.log(data)
      // var that=this
      // var anim=wx.createAnimation({
      //   duration:200,
      //   timingFunction:'linear'
      // })
      // anim.translateY('0.5vh').step();
      // var animarr=new Array(5).fill('')
      // animarr[data.index]=anim.export()
      //  console.log(animarr)
      //  console.log(that.data.selected)
      // that.setData({
      //   animationData:animarr
      // })
      const url = data.path
      wx.switchTab({url})
    }
  }
})