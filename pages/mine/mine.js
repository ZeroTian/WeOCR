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
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    isGitHub: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    authorization(this);
  },

  githubInfo: function (e) {
    let self = this;
    if (!self.data.isGitHub) {
      numDisplay(self, 0, 20);
      setClipboard(e.currentTarget.dataset.link);
    }
    self.setData({
      isGitHub: !self.data.isGitHub,
    })
  },

  statementCopy: function (e) {
    setClipboard("https://www.color-ui.com/");
  },

  showQrcode: function (e) {
    wx.showToast({
      title: '感谢打赏!',
      icon: 'none',
    })
  }
})

// 设置剪切板
function setClipboard(content) {
  wx.setClipboardData({
    data: content,
  });
}

// 一个动画的数字跳动效果
function numDisplay(self, i, j) {
  if (i < j) {
    setTimeout(function () {
      self.setData({
        starCount: i,
        forksCount: i,
        visitTotal: i
      })
      numDisplay(self, ++i, j);
    }, j)
  } else {
    self.setData({
      starCount: formatNum(10),
      forksCount: formatNum(19),
      visitTotal: formatNum(30)
    })
  }
}

// 对数字进行简单的转换
function formatNum(num) {
  if (num > 1000 && num < 10000) {
    num = (num / 1000).toFixed(1) + 'k';
  }
  if (num > 10000) {
    num = (num / 10000).toFixed(1) + 'W';
  }
  return num;
}

// 获取用户信息进行授权
function authorization(self) {
  self.authorize = self.selectComponent("#authorization");
  self.authorize.isAuthorize('userInfo', () => {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo;
              self.setData({
                userInfo: res.userInfo,
              });
              app.globalData.userInfo = res.userInfo
            }
          });
        }
      }
    });
  });
}

