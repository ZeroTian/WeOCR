const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictures: [],
    CustomBar: app.globalData.CustomBar,
    windowH: '',
    windowW: '',

  },

  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    wx.showLoading({
      title: '请稍候...',
    })

    eventChannel.on("albumnToResult_landmark", data => {
      let pictures = data.pictures;
      self.setData({
        pictures: pictures,
      })
      wx.hideLoading();

      console.log(pictures)

    })

    wx.getSystemInfo({
      success: res => {
        self.setData({
          windowH: res.windowHeight,
          windowW: res.windowWidth,
        })
      },
    })
  },
})