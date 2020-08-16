const utils = require('../../utils.js');

Page({

  data: {
    content:'选择图片',
    active: '',
    windowW: '',
  },
  
  onLoad: function (options) {
    let self = this;

    self.setData({
      active: options.active,
    })
    
    wx.getSystemInfo({
      success: res => {
        self.setData({
          windowW: res.windowWidth,
        })
      },
    })
  },


  onChooseImageAlbumn: function (e) {
    utils.chooseImageFile(this, 4, ['album'], "../muchMore/muchMore", 'chooseImgToMore');
  },


  onChooseWeChatAlbumn: function (e) {
    utils.chooseImageFile(this, 4, ['wechat'], "../muchMore/muchMore", 'chooseImgToMore');
  },


  onChooseCameraAlbumn: function (e) {
    utils.chooseImageFile(this, 4, ['camera'], "../muchMore/muchMore", 'chooseImgToMore');
  },
})