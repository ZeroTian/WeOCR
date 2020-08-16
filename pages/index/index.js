const utils = require('../../utils.js');

const app = getApp()

Page({
  data: {
    content: 'Multi OCR',
    fun: [{
      id: 0,
      name: "扫描",
      en_name: 'scan',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/ocr.png',
    },
    {
      id: 1,
      name: "翻译",
      en_name: 'translate',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/translate.png',
    },
    {
      id: 2,
      name: "表格识别",
      en_name: 'exportExcle',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/excel.jpg',
    },
    {
      id: 3,
      name: "卡片识别",
      en_name: 'identify',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/bank-card.png',
    },
    ],

    active: 0,

  },

  // 进行页面的初始化操作
  onLoad: function () {
    let self = this;

    // 使分享按钮可用
    wx.showShareMenu({
      withShareTicket: true
    })

  },

  // 当导航栏被点击是改变active的值
  onNavbarTap: function (e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },

  // 当点击相册中选图的按钮时
  onChooseImageAlbumn: function () {
    utils.chooseImageFile(this, 4, ['album'], "../albumn/albumn", 'indexToAlbumn');
  },

  // 当点击微信中选图的按钮时
  onChooseWeChatAlbumn: function () {
    utils.chooseImageFile(this, 4, ['wechat'], "../albumn/albumn", 'indexToAlbumn');
  },

  // 当点击相册中选图的按钮时 
  onChooseCameraAlbumn: function () {
    utils.chooseImageFile(this, 4, ['camera'], "../albumn/albumn", 'indexToAlbumn');
  },
})