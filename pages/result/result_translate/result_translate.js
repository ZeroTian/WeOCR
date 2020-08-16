const utils = require('../../../utils.js');

const app = getApp();

Page({
  data: {
    bottomHeight: 100,
    barHeight: 90,
    pictures: '',
    TabCur: 0,
    scrollLeft: 0,
    isTranslate: false,
    windowH: '',
    windowW: '',
    CustomBar: app.globalData.CustomBar,
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false,
      distance: 0,
      scale: 1,
    },
    img_width: '',
    img_height: '',
    proportion: '',
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
    chooseStack: [],
  },


  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    wx.showLoading({
      title: '请稍候...',
    })

    eventChannel.on("albumnToResult_translate", data => {
      let pictures = [];
      data.pictures.forEach(element => {
        pictures.push({
          images: element.images,
          result: JSON.parse(element.result),
        })
      });

      setTimeout(() => {
        wx.getImageInfo({
          src: pictures[self.data.TabCur].images,
          success: res => {
            let scale = res.width / res.height,
              proportion = res.width / self.data.windowW;
            this.setData({
              pictures: pictures,
              img_height: self.data.windowW / scale,
              img_width: self.data.windowW,
              proportion: proportion,
            })

            wx.hideLoading();

          },
        })
      }, 1000);
    })

    wx.showShareMenu({
      withShareTicket: true
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


  tabSelect: function (e) {
    let self = this,
      pictures = self.data.pictures;

    pictures[self.data.TabCur].result.words_result.forEach(element => {
      element.boxChoosed = false;
    });

    // scrollLeft: 向左移动的距离
    this.setData({
      pictures: pictures,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      isTranslate: false,
      chooseStack: [],
      translate_from: '',
      translate_to: '',
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
      stv: {
        offsetX: 0,
        offsetY: 0,
        zoom: false,
        distance: 0,
        scale: 1,
      },


    })

    wx.getImageInfo({
      src: self.data.pictures[e.currentTarget.dataset.id].images,
      success: res => {
        let scale = res.width / res.height,
          proportion = res.width / self.data.windowW;
        this.setData({
          img_height: self.data.windowW / scale,
          img_width: self.data.windowW,
          proportion: proportion,
        })
      },
    })

  },


  tapBox: function (e) {
    let self = this,
      pictures = [],
      chooseStack = self.data.chooseStack;

    pictures = self.data.pictures;
    pictures[self.data.TabCur].result.words_result[e.currentTarget.dataset.id].boxChoosed = !pictures[self.data.TabCur].result.words_result[e.currentTarget.dataset.id].boxChoosed;
    if (pictures[self.data.TabCur].result.words_result[e.currentTarget.dataset.id].boxChoosed) {
      chooseStack.push(e.currentTarget.dataset.id)
    } else {
      chooseStack.pop()
    }
    self.setData({
      pictures: pictures,
      chooseStack: chooseStack,
    })

  },


  touchstartCallback: function (e) {
    //触摸开始

    if (e.touches.length === 1) {
      let {
        clientX,
        clientY
      } = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'stv.distance': distance,
        'stv.zoom': true, //缩放状态
      })
    }

  },


  touchmoveCallback: function (e) {
    //触摸移动中

    if (e.touches.length === 1) {
      //单指移动
      if (this.data.stv.zoom) {
        //缩放状态，不处理单指
        return;
      }
      let {
        clientX,
        clientY
      } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let {
        stv
      } = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });

    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;

      this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }

  },


  touchendCallback: function (e) {
    //触摸结束

    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
    }
  },


  indexTap: function (e) {
    let self = this;

    wx.navigateBack({
      delta: 99,
    })
  },


  backTap: function (e) {
    let self = this,
      chooseStack = self.data.chooseStack;

    if (!self.data.isTranslate && chooseStack.length != 0) {
      let pictures = self.data.pictures;

      pictures[self.data.TabCur].result.words_result[chooseStack.pop()].boxChoosed = false;

      self.setData({
        pictures: pictures,
        chooseStack: chooseStack,
      })

    }

  },


  clearTap: function (e) {
    let self = this;

    if (!self.data.isTranslate && self.data.chooseStack.length != 0) {
      let pictures = self.data.pictures;

      pictures[self.data.TabCur].result.words_result.forEach(element => {
        element.boxChoosed = false;
      });

      self.setData({
        pictures: pictures,
        chooseStack: [],
      })

    }
  },


  translateTap: function (e) {
    let self = this,
      translate_from = '',
      chNum = 0;

    self.setData({
      isTranslate: !self.data.isTranslate,
    })

    if (self.data.isTranslate) {
      self.data.pictures[self.data.TabCur].result.words_result.forEach(element => {
        if (element.boxChoosed) {
          translate_from += element.words + "\n";
          chNum++;
        }
      });

      if (chNum == 0) {
        self.data.pictures[self.data.TabCur].result.words_result.forEach(element => {
          translate_from += element.words + "\n";
        });
      }

      self.setData({
        translate_from: translate_from,
      })

    }
  },


  bindFromChange: function (e) {
    let self = this,
      translate = self.data.translate;

    translate.from = e.detail.value;
    this.setData({
      translate: translate
    })
  },


  bindToChange: function (e) {
    let self = this,
      translate = self.data.translate;

    translate.to = e.detail.value;
    this.setData({
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


  // 将翻译的数据提交给api
  translateSubmit: function (e) {
    wx.showLoading({
      title: "正在翻译..."
    })

    let self = this,
      translate_to = '',
      from = self.data.translate.slanguage[self.data.translate.from],
      to = self.data.translate.slanguage[self.data.translate.to],
      apiPath = 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      appid = '20200530000479202',
      salt = '1435660288',
      password = 'IXbuPnCbYx4OIIDVVnPK',
      q = encodeURI(self.data.translate_from),
      sign = utils.md5(appid + self.data.translate_from + salt + password),
      url = apiPath + '?' + 'q=' + q + '&' + 'from=' + from + '&' + 'to=' + to + '&' + 'appid=' + appid + '&' + 'salt=' + salt + '&' + 'sign=' + sign

    wx.request({
      url: url,
      success: res => {

        wx.hideLoading();

        res.data.trans_result.forEach(element => {
          translate_to += element.dst + '\n';
        });

        self.setData({
          translate_to: translate_to,
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