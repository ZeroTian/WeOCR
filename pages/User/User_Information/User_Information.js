const app = getApp()

Page({
 
  data: {
    content: '我的信息',
    myinfo: null,
    date: '保密',
  },
 
  onLoad: function (options) {
    let self = this
    self.setData({
      userInfo: app.globalData.userInfo
    })
  },
  
  dateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },


})