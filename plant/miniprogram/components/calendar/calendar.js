Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spot: {
      type: Array,
      value: []
    },
    defaultTime: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [], //日历主体渲染数组
    selectDay: {}, //选中时间
    open: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // !日期格式化
    formatTime (time, format) {
      if (!format) {
        return this.getDateDiff(time)
      } else {
        return this.getDate(time, format)
      }
    },
    formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    getDate (time, format) {
      let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'], returnArr = [], date = new Date(time)
      returnArr.push(date.getFullYear())
      returnArr.push(this.formatNumber(date.getMonth() + 1))
      returnArr.push(this.formatNumber(date.getDate()))
      returnArr.push(this.formatNumber(date.getHours()))
      returnArr.push(this.formatNumber(date.getMinutes()))
      returnArr.push(this.formatNumber(date.getSeconds()))
      for (let i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
      }
      return format
    },
    getDateDiff (time) {
      let r = ''
      let ft = new Date(time), nt = new Date(), nd = new Date(nt)
      nd.setHours(23)
      nd.setMinutes(59)
      nd.setSeconds(59)
      nd.setMilliseconds(999)
      let d = parseInt((nd - ft) / 86400000)
      switch (true) {
        case d === 0:
          let t = parseInt(nt / 1000) - parseInt(ft / 1000)
          switch (true) {
            case t < 60:
              r = '刚刚'
              break
            case t < 3600:
              r = parseInt(t / 60) + '分钟前'
              break
            default:
              r = parseInt(t / 3600) + '小时前'
          }
          break
        case d === 1:
          r = '昨天'
          break
        case d === 2:
          r = '前天'
          break
        case d > 2 && d < 30:
          r = d + '天前'
          break
        default:
          r = this.getDate(time, 'Y-M-D')
      }
      return r
    },
    //!日期选择-picker
    handleMonthPicker (e) {
      let arr = e.detail.value.split('-'), year = parseInt(arr[0]), month = parseInt(arr[1])
      this.setMonth(year, month)
    },
    //!上一个月
    handleLastMonth () {
      let lastMonth = new Date(this.data.selectDay.year, this.data.selectDay.month - 2), year = lastMonth.getFullYear(), month = lastMonth.getMonth() + 1
      this.setMonth(year, month)
    },
    //!下一个月
    handleNextMonth () {
      let nextMonth = new Date(this.data.selectDay.year, this.data.selectDay.month), year = nextMonth.getFullYear(), month = nextMonth.getMonth() + 1
      this.setMonth(year, month)
    },
    //!设置月份
    setMonth (setYear, setMonth, setDay) {
      if (this.data.selectDay.year !== setYear || this.data.selectDay.month !== setMonth) {
        let day = Math.min(new Date(setYear, setMonth, 0).getDate(), this.data.selectDay.day), time = new Date(setYear, setMonth - 1, setDay ? setDay : day), data = { selectDay: { year: setYear, month: setMonth, day: setDay ? setDay : day, dateString: this.formatTime(time, 'Y-M-D') } }
        if (!setDay) {
          data.open = true
        }
        this.setData(data)
        this.initCalendar(setYear, setMonth)
        this.setSpot()
        this.triggerEvent('change', this.data.selectDay)
      }
    },
    //!展开收起
    handleToggleChange () {
      this.setData({ open: !this.data.open })
      this.triggerEvent('aaa', { a: 0 })
      this.initCalendar()
      this.setSpot()
    },
    //!设置日历底下是否展示小圆点
    setSpot () {
      let timeArr = this.data.spot.map(item => {
        return this.formatTime(item, 'Y-M-D')
      })
      this.data.dateList.forEach(item => {
        if (timeArr.indexOf(item.dateString) !== -1) {
          item.spot = true
        } else {
          item.spot = false
        }
      })
      this.setData({ dateList: this.data.dateList })
    },
    //!日历主体的渲染方法
    initCalendar (setYear = this.data.selectDay.year, setMonth = this.data.selectDay.month) {
      let dateList = [] //需要遍历的日历数组数据
      let now = new Date(setYear, setMonth - 1) //当前月份的1号
      let startWeek = now.getDay() //1号对应的星期
      let dayNum = new Date(setYear, setMonth, 0).getDate() //当前月有多少天
      let forNum = Math.ceil((startWeek + dayNum) / 7) * 7 //当前月跨越的周数的总天数
      if (this.data.open) {
        //展开状态，需要渲染完整的月份
        for (let i = 0; i < forNum; i++) {
          let now2 = new Date(now);
           //now2.setDate(i - startWeek + 2);//从星期一开始
          now2.setDate(i - startWeek + 1); //从星期日开始
          let obj = { day: now2.getDate(), month: now2.getMonth() + 1, year: now2.getFullYear(), dateString: this.formatTime(now2, 'Y-M-D') }
          dateList[i] = obj
        }
      } else {
        //非展开状态，只需要渲染当前周
        for (let i = 0; i < 14; i++) {
          let now2 = new Date(now)
          //当前周的7天
           //now2.setDate(Math.ceil((this.data.selectDay.day + startWeek) / 7) * 7 - 6 - startWeek + i + 1)//从星期一开始
          now2.setDate(Math.ceil((this.data.selectDay.day + startWeek) / 7) * 7 - 6 - startWeek + i)//从星期日开始
          let obj = { day: now2.getDate(), month: now2.getMonth() + 1, year: now2.getFullYear(), dateString: this.formatTime(now2, 'Y-M-D') }
          dateList[i] = obj
        }
      }
      this.setData({ dateList: dateList })
    },
    //!选中日期
    handleDateSelect (e) {
      let year = e.currentTarget.dataset.year, month = e.currentTarget.dataset.month, day = e.currentTarget.dataset.day, dateString = e.currentTarget.dataset.dateString, selectDay = { year: year, month: month, day: day, dateString: dateString }
      if (this.data.selectDay.year !== year || this.data.selectDay.month !== month) {
        this.setMonth(year, month, day)
      } else if (this.data.selectDay.day !== day) {
        this.setData({ selectDay: selectDay })
        this.triggerEvent('change', this.data.selectDay)
      }
    },
  },
  lifetimes: {
    attached () {
      let now = this.data.defaultTime ? new Date(this.data.defaultTime) : new Date()
      let selectDay = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), dateString: this.formatTime(now, 'Y-M-D') }
      this.setMonth(selectDay.year, selectDay.month, selectDay.day)
    }
  },
  observers: {
    spot: function (spot) {
      this.setSpot()
    }
  }
})
