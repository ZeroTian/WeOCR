// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    isGitHub: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
              })
            }
          });
        } else {
          that.setData({
            isHide: true
          });
        }
      }
    });

  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false,
        userInfo: e.detail.userInfo
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您拒绝了授权',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  CopyLink: function(e){
    let self = this;

    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          self.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        self.setData({
          starCount: self.coutNum(10),
          forksCount: self.coutNum(19),
          visitTotal: self.coutNum(30)
        })
      }
    }
    
    if(!self.data.isGitHub){
      wx.setClipboardData({
        data: "https://github.com/ZeroTian/WeOCR",
      })
    }
    
    self.setData({
      isGitHub: !self.data.isGitHub,
    })

    
  },

  coutNum: function (e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },

  statementCopy: function(e){
    wx.setClipboardData({
      data: "https://www.color-ui.com/",
    })
  },

  showQrcode: function(e){
    wx.showToast({
      title: '感谢打赏!',
      icon: 'none',
    })
  }

})
