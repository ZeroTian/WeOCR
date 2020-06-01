const app = getApp()

Page({


  data: {
    pictures: [],
    TabCur: 0,
    scrollLeft: 0,
    isCheck: false,
    windowH: '',
    windowW: '',
    CustomBar: app.globalData.CustomBar,
    isIphoneX: app.globalData.isIphoneX,
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
    size: 3,
    listData: [],
    extraNodes: [
    ],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    animPlus: {},
    animScan: {},
    animChoose: {},
    animDelete: {},
    animInput: {},
    animCloud: {},
    windowH: '',
    windowW: '',
    img_h: '',
    img_w: '',
    chooseB: '',
    canNext: false,
    canPre: false,
    page: 1,
  },


  onLoad(options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    wx.showLoading({
      title: '请稍候...',
    })

    eventChannel.on("albumnToResult_find", data => {
      let pictures = data.pictures,
        listData = [],
        total = pictures[self.data.TabCur].result.total;

      if (total > 21) {
        self.data.canNext = true;
      }

      pictures[self.data.TabCur].result.hits.forEach(element => {
        listData.push({ images: element.previewURL })
      });

      setTimeout(() => {
        wx.getImageInfo({
          src: pictures[self.data.TabCur].images,
          success: res => {
            let scale = res.width / res.height,
              proportion = res.width / self.data.windowW;
            self.setData({
              pictures: pictures,
              img_height: self.data.windowW / scale,
              img_width: self.data.windowW,
              proportion: proportion,
              listData: listData,
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
      listData = [],
      total = self.data.pictures[e.currentTarget.dataset.id].result.total,
      canNext = false;

    if (total > 21) {
      canNext = true;
    }

    self.data.pictures[e.currentTarget.dataset.id].result.hits.forEach(element => {
      listData.push({ images: element.previewURL })
    });

    // scrollLeft: 向左移动的距离
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      isCheck: false,
      stv: {
        offsetX: 0,
        offsetY: 0,
        zoom: false,
        distance: 0,
        scale: 1,
      },
      listData: listData,
      canNext: canNext,
      canPre: false,
      page: 1,
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


  onTapImg(e) {


    let self = this,
      drag = self.selectComponent('#drag'),
      id = drag.getIndex();
    wx.setClipboardData({
      data: self.data.pictures[self.data.TabCur].result.hits[id].pageURL,
    })
  },


  tapDragImg(e) {
    let self = this,
      drag = self.selectComponent('#drag'),
      pictures = [];

    for (let i = 0; i < e.detail.pictures.length; i++) {
      pictures.push(e.detail.pictures[i].data);
    }

    self.setData({
      pictures: pictures,
    })

    drag.init()

  },


  // 将数据传输给index页面
  backIndex(e) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 调用事件fromAlbumn
    eventChannel.emit('albumnToIndex', { data: "要反馈的信息" })
  },


  sortEnd(e) {
    let self = this,
      drag = self.selectComponent('#drag');

    self.setData({
      listData: e.detail.listData
    });

    drag.init();
  },


  change(e) {
    // console.log("change", e.detail.pictures)
  },


  itemClick(e) {
    // console.log(e);
  },


  add(e) {
  },


  scroll(e) {
    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })
  },


  // 页面滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },


  indexTap: function (e) {
    let self = this;

    wx.navigateBack({
      delta: 99,
    })
  },


  prePageTap: function (e) {
    let self = this,
      pictures = self.data.pictures,
      page = self.data.page,
      canPre = false;

    if (self.data.canPre && self.data.isCheck) {
      wx.showLoading({
        title: '正在请求...'
      })
      let url = pictures[self.data.TabCur].request_url + "&page=" + (--page),
        listData = []
      wx.request({
        url: url,
        success: res => {
          res.data.hits.forEach(element => {
            listData.push({ images: element.previewURL })
          });
          if (page != 1) {
            canPre = true;
          }
          self.setData({
            listData: listData,
            page: page,
            canPre: canPre,
          })
          setTimeout(() => {
            if (self.data.isCheck) {
              wx.hideLoading();
              let drag = self.selectComponent('#drag');
              drag.init();
            }
          }, 50);
        },
        fail: res => {
          wx.showToast({
            title: '网速太差, 请重试',
            icon: 'none',
          })
        }
      })
    }
  },


  nextPageTap: function (e) {
    let self = this,
      pictures = self.data.pictures,
      page = self.data.page,
      canNext = false;

    if (self.data.canNext && self.data.isCheck) {
      wx.showLoading({
        title: '正在请求...'
      })
      let url = pictures[self.data.TabCur].request_url + "&page=" + (++page),
        listData = []
      wx.request({
        url: url,
        success: res => {
          res.data.hits.forEach(element => {
            listData.push({ images: element.previewURL })
          });
          if (21 * page < pictures[self.data.TabCur].result.total) {
            canNext = true;
          }
          self.setData({
            listData: listData,
            page: page,
            canNext: canNext,
            canPre: true,
          })
          setTimeout(() => {
            if (self.data.isCheck) {
              wx.hideLoading();
              let drag = self.selectComponent('#drag');
              drag.init();
            }
          }, 50);
        },
        fail: res => {
          wx.showToast({
            title: '网速太差, 请重试',
            icon: 'none',
          })
        }
      })
    }
  },


  checkTap: function (e) {
    let self = this,
      isCheck = '',
      canNext = false;
    isCheck = !self.data.isCheck
    if (21 * self.data.page < self.data.pictures[self.data.TabCur].result.total) {
      canNext = true;
    }
    self.setData({
      isCheck: isCheck,
      canNext: canNext,
    })
    setTimeout(() => {
      if (isCheck && pictures[TabCur].result.total != 0) {
        let drag = self.selectComponent('#drag');
        drag.init();
      }
    }, 50);
  },
})
