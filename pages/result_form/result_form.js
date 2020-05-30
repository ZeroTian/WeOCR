const app = getApp();


Page({
  data: {
    pictures: '',
    TabCur: 0,
    scrollLeft: 0,
    isCheck: false,
    windowH: '',
    windowW: '',
    CustomBar: app.globalData.CustomBar,
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
    },
    img_width: '',
    img_height: '',
    proportion: '',
    chooseStack: [],
    selectResult: '',
  },


  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    wx.showLoading({
      title: '请稍候...',
    })

    eventChannel.on("albumnToResult_form", data => {
      let pictures = [];
      data.pictures.forEach(element => {
        pictures.push({
          images: element.images,
          result: JSON.parse(element.result.result.result_data),
        })
      });
      console.log(pictures[0].result)

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
    let self = this;

    // scrollLeft: 向左移动的距离
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      isCheck: false,
      chooseStack: [],
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
    pictures[self.data.TabCur].result.forms[0].body[e.currentTarget.dataset.id].boxChoosed = !pictures[self.data.TabCur].result.forms[0].body[e.currentTarget.dataset.id].boxChoosed;
    if (pictures[self.data.TabCur].result.forms[0].body[e.currentTarget.dataset.id].boxChoosed) {
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
      let { clientX, clientY } = e.touches[0];
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
      let { clientX, clientY } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let { stv } = this.data;
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


  copyTap: function (e) {
    let self = this;

    wx.setClipboardData({
      data: self.data.selectResult,
    })

  },


  backTap: function (e) {
    let self = this,
      chooseStack = self.data.chooseStack;

    if (!self.data.isCheck && chooseStack.length != 0) {
      let pictures = self.data.pictures;
      pictures[self.data.TabCur].result.forms[0].body[chooseStack.pop()].boxChoosed = false;

      self.setData({
        pictures: pictures,
        chooseStack: chooseStack,
      })

    }

  },


  clearTap: function (e) {
    let self = this;

    if (!self.data.isCheck && self.data.chooseStack.length != 0) {
      let pictures = self.data.pictures;

      pictures[self.data.TabCur].result.forms[0].body.forEach(element => {
        element.boxChoosed = false;
      });

      self.setData({
        pictures: pictures,
        chooseStack: [],
      })

    }
  },


  checkTap: function (e) {
    let self = this,
      selectResult = '',
      chNum = 0;

    self.setData({
      isCheck: !self.data.isCheck,
    })

    if (self.data.isCheck) {
      self.data.pictures[self.data.TabCur].result.forms[0].body.forEach(element => {
        if (element.boxChoosed) {
          selectResult += element.word + "\n";
          chNum++;
        }
      });

      if (chNum == 0) {
        self.data.pictures[self.data.TabCur].result.forms[0].body.forEach(element => {
          if(element.word != ''){
            selectResult += element.word + "\n";
          }
        });
      }

      self.setData({
        selectResult: selectResult,
      })

    }
  },


  fromBlur: function (e) {
    let self = this;

    self.setData({
      translate_from: e.detail.value,
    })

  },

})