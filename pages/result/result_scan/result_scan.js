const app = getApp();

Page({


  data: {
    pictures: '',
    TabCur: 0,
    scrollLeft: 0,
    check: false,
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
    scanResult: '',
  },


  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    let picpromise = new Promise(function (resolve, reject) {

      eventChannel.on("albumnToResult_scan", data => {
        self.setData({
          pictures: data.pictures,
        })
        resolve(data.pictures);
        reject("读取数据失败");
      })

    })

    picpromise.then((pictures) => {
      let scanResult = "",
        result = JSON.parse(pictures[self.data.TabCur].result);

      result.words_result.forEach(element => {
        scanResult += element.words + '\n'
      });
      self.setData({
        scanResult: scanResult,
      })

    }).catch((res) => {
      wx.showToast({
        title: res,
        icon: 'none',
      })
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
      check: false,
      stv: {
        offsetX: 0,
        offsetY: 0,
        zoom: false,
        distance: 0,
        scale: 1,
      },
    })

    let scanResult = "",
      result = JSON.parse(self.data.pictures[e.currentTarget.dataset.id].result);

    result.words_result.forEach(element => {
      scanResult += element.words + '\n'
    });
    self.setData({
      scanResult: scanResult,
    })

  },


  fromBlur: function (e) {
    let self = this;

    self.setData({
      scanResult: e.detail.value,
    })

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
      data: self.data.scanResult,
    })

  },


  checkTap: function (e) {
    let self = this;

    self.setData({
      check: !self.data.check,
    })

    if (self.data.check) {

      wx.getImageInfo({
        src: self.data.pictures[self.data.TabCur].images,
        success: res => {
          let scale = res.width / res.height
          this.setData({
            img_height: self.data.windowW / scale,
            img_width: self.data.windowW,
          })
        },
      })

    }
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

})