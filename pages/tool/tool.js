// pages/tool/tool.js
Page({


  data: {
    content:'小工具'
  },


  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })

  },

})