// pages/order/order.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    content: '我的下载',
    currtab: 0,
    swipertab: [{ name: '已完成', index: 0 }, { name: '未下载', index: 1 }, { name: '已取消', index: 2 }],
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
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
      case 2:
        that.lostShow()
        break
    }
  },
  alreadyShow: function(){
    this.setData({
      alreadyOrder: [{ name: "图片一", state: "下载完成", time: "2018-09-30 14:00-16:00", status: "132", url: "../../images/bad0.png", money: "132" }, { name: "图一点五", state: "下载完成", time: "2018-10-12 18:00", status: "205", url: "../../images/bad3.jpg", money: "205" }]
    })
  },
 
  waitPayShow:function(){
    this.setData({
      waitPayOrder: [{ name: "图片二", state: "未下载", time: "2018-10-14 14:00", status: "0", url: "../../images/bad1.jpg", money: "186" }],
    })
  },
 
  lostShow: function () {
    this.setData({
      lostOrder: [{ name: "图三", state: "已取消", time: "2018-10-4 10:00", status: "22", url: "../../images/bad1.jpg", money: "122" }],
    })
  },
 
  
})