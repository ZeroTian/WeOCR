// pages/order/order.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    content: '我的收藏',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.orderShow()
  },
 
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
 
  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },
 
  tabChange: function (e) {
    this.setData({ currtab: e.detail.current })
    this.orderShow()
  },
 
  orderShow: function () {
    let that = this
    that.alreadyShow();
  },
  alreadyShow: function(){
    this.setData({
      alreadyOrder: [{ name: "图四", state: "已收藏", time: "2018-09-30 14:00",url: "../../images/bad0.png", money: "132" }, { name: "图五", state: "已收藏", time: "2018-10-12 18:00", url: "../../images/bad3.jpg", money: "205" }]
    })
  }
})