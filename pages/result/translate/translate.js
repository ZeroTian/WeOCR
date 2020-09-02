const app = getApp();

const utils = require('../../../utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '文本翻译',
    windowH: '',
    windowW: '',
    CustomBar: app.globalData.CustomBar,
    translate: {
      language: [
        '自动检测', '中文', '英文', '粤语', '文言文', '日语', '韩语', '法语', '西班牙语', '泰语', '阿拉伯语', '俄语', '葡萄牙语', '德语', '意大利语', '希腊语', '荷兰语', '波兰语', '保加利亚语', '爱沙尼亚语', '丹麦语', '芬兰语', '捷克语', '罗马尼亚语', '斯洛文尼亚语', '瑞典语', '匈牙利语', '繁体中文', '越南语'
      ],
      slanguage: [
        'auto', 'zh', 'en', 'yue', 'wyw', 'jp', 'kor', 'fra', 'spa', 'th', 'ara', 'ru', 'pt', 'de', 'it', 'el', 'nl', 'pl', 'bul', 'est', 'dan', 'fin', 'cs', 'rom', 'slo', 'swe', 'hu', 'cht', 'vie'
      ],
      from: 0,
      to: 2,
    },
    translate_from: '',
    translate_to: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;

    wx.getSystemInfo({
      success: res => {
        self.setData({
          windowH: res.windowHeight,
          windowW: res.windowWidth,
        })
      },
    })

  },


  bindFromChange: function (e) {
    let self = this,
      translate = self.data.translate;

    translate.from = e.detail.value;
    self.setData({
      translate: translate
    })
  },


  bindToChange: function (e) {
    let self = this,
      translate = self.data.translate;

    translate.to = e.detail.value;
    self.setData({
      translate: translate,
    })
  },


  fromBlur: function (e) {
    let self = this;

    self.setData({
      translate_from: e.detail.value,
    })

  },


  copyFrom: function (e) {
    let self = this;

    wx.setClipboardData({
      data: self.data.translate_from,
    })

  },


  toBlur: function (e) {
    let self = this;

    self.setData({
      translate_to: e.detail.value,
    })

  },


  copyTo: function (e) {
    let self = this;

    wx.setClipboardData({
      data: self.data.translate_to,
    })

  },
  
  translateSubmit: function (e) {
    wx.showLoading({
      title: "正在翻译..."
    })

    let self = this,
      translate_to = '',
      to = self.data.translate.slanguage[self.data.translate.to],
      q = self.data.translate_from.split("\n").join('\r')

    wx.request({
      url: 'https://www.universitydog.cn/textTranslate',
      data: {
        to: to,
        q: q,
      },

      success: res => {
        wx.hideLoading();
        translate_to += res.data.result;

        self.setData({
          translate_to: translate_to,
          translate_data: res.data,
        })
    
      },
      fail: res => {
        wx.hideLoading();
        
        wx.showToast({
          title: '请求超时, 请检查网络.',
          icon: 'none',
        })
      }
    })
  }
})