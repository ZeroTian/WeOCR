const app = getApp()

var mutlUploadFile = function (pictures, url, name, header) {
  var postpromise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: "正在处理..."
    })
    let flag = 0,
      results = [];
    pictures.forEach(element => {
      wx.uploadFile({
        url: url,
        filePath: element.images,
        name: name,
        header: header,
        success(res) {
          flag++;
          results.push({
            images: element.images,
            result: res.data,
          })
          if (flag == pictures.length) {
            resolve(results);
          }
        },
        fail: (res) => {
          flag++;
          if (flag == pictures.length) {
            reject(res);
          }
        },
      })
    })
  })
  return postpromise;
}

Page({


  data: {
    pictures: [],
    isIphoneX: app.globalData.isIphoneX,
    size: 3,
    listData: [],
    extraNodes: [
    ],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    active: '',
    isPopping: true,
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
  },


  onLoad(options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    self.drag = self.selectComponent('#drag');
    self.drag.init();

    wx.showShareMenu({
      withShareTicket: true
    })

    wx.getSystemInfo({
      success: res => {
        const windowHeight = res.windowHeight,
          windowWidth = res.windowWidth;
        self.setData({
          windowH: windowHeight * 2,
          windowW: windowWidth * 2,
        })
      },
    })

    // 持续监听事件 可以获取来自Index的图片地址
    eventChannel.on('indexToAlbumn', function (data) {
      self.setData({
        pictures: data.pictures,
        active: data.active,
      })
    })
  },

  onShow() {
    let self = this;

    self.drag.init();
  },


  // 当点击图片时可以对图片进行操作: 图片的缩放, 图片的裁剪
  onTapImg(e) {

    let self = this,
      id = self.drag.getIndex(),
      active = self.data.active;

    if (!self.data.chooseB) {
      // 实现图片的剪切或预览
      // if (active <= 2 && id !== '') {
      if (id !== '') {
        let pictures = self.data.pictures;
        wx.navigateTo({
          url: "../cropper/cropper",
          events: {
            cropperToAlbumn: function (data) {
              pictures[data.id].images = data.src;

              self.setData({
                pictures: pictures,
              })
            }
          },
          success: function (res) {
            // 通过eventChannel向被打开页面传送图片
            res.eventChannel.emit('albumnToCropper', { pictures: self.data.pictures, id: id, active: active, })
          },
        })
      }
    }
  },


  tapDragImg(e) {
    let self = this,
      pictures = [];

    for (let i = 0; i < e.detail.pictures.length; i++) {
      pictures.push(e.detail.pictures[i].data);
    }

    self.setData({
      pictures: pictures,
    })

    self.drag.init()

  },


  // 将数据传输给index页面
  backIndex(e) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 调用事件fromAlbumn
    eventChannel.emit('albumnToIndex', { data: "要反馈的信息" })
  },


  sortEnd(e) {
    this.setData({
      pictures: e.detail.listData
    });

    this.drag.init();
  },


  change(e) {
    // console.log("change", e.detail.pictures)
  },


  itemClick(e) {
    // console.log(e);
  },


  add(e) {
    let pictures = this.data.pictures;
    pictures.push({
      images: "../../images/Sample/1.jpg",
      fixed: false
    });
    setTimeout(() => {
      this.setData({
        pictures: pictures
      });
      this.drag.init();
    }, 300)
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


  //点击弹出
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },


  //弹出动画
  popp: function () {
    let self = this;
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationScan = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationChoose = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationDelete = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationCloud = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })

    animationPlus.rotateZ(180).step();
    animationScan.translate(30 * self.data.windowW / 750, -120 * self.data.windowW / 750).rotateZ(180).opacity(1).step();
    animationChoose.translate(-75 * self.data.windowW / 750, -90 * self.data.windowW / 750).rotateZ(180).opacity(1).step();
    animationDelete.translate(-126 * self.data.windowW / 750, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-75 * self.data.windowW / 750, 90 * self.data.windowW / 750).rotateZ(180).opacity(1).step();
    animationCloud.translate(30 * self.data.windowW / 750, 120 * self.data.windowW / 750).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animScan: animationScan.export(),
      animChoose: animationChoose.export(),
      animDelete: animationDelete.export(),
      animInput: animationInput.export(),
      animCloud: animationCloud.export(),
    })
  },


  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationScan = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationChoose = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationDelete = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationCloud = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })

    animationPlus.rotateZ(0).step();
    animationScan.translate(0, 0).rotateZ(0).opacity(0).step();
    animationChoose.translate(0, 0).rotateZ(0).opacity(0).step();
    animationDelete.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    animationCloud.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animScan: animationScan.export(),
      animChoose: animationChoose.export(),
      animDelete: animationDelete.export(),
      animInput: animationInput.export(),
      animCloud: animationCloud.export(),
      chooseB: false,
    })
  },


  scan(e) {
    let self = this,
      pictures = [];

    if (self.data.active == 0) {
      let url = 'https://www.universitydog.cn/scan',
        name = 'scan',
        header = {
          "Content-Type": "text/html",
          'accept': 'application/json',
        };

      mutlUploadFile(self.data.pictures, url, name, header).then((result) => {

        wx.hideLoading();

        wx.navigateTo({
          url: '../result_scan/result_scan',
          success: res => {
            res.eventChannel.emit('albumnToResult_scan', { pictures: result })
          }
        })
      }).catch((res) => {
        console.log(res);
        wx.showToast({
          title: "出现了一个错误\n请重试",
          icon: "none"
        })
      })

    } else if (self.data.active == 1) {
      let url = 'https://www.universitydog.cn/translatescan',
        name = 'translatescan',
        header = {
          "Content-Type": "text/html",
          'accept': 'application/json',
        };

      mutlUploadFile(self.data.pictures, url, name, header).then((result) => {

        wx.hideLoading();

        wx.navigateTo({
          url: '../result_translate/result_translate',
          success: res => {
            res.eventChannel.emit('albumnToResult_translate', { pictures: result })
          }
        })
      }).catch((res) => {
        console.log(res);
        wx.showToast({
          title: "出现了一个错误\n请重试",
          icon: "none"
        })
      })

    } else if (self.data.active == 2) {
      let picpromise = new Promise(function (resolve, reject) {
        wx.showLoading({
          title: "正在处理..."
        })

        wx.request({
          url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=tOdCCaGHqBEzp2ojPIfGOvWK&client_secret=3yzHnT8Fw29X0bMyuUa88oNu12k4Dga7',
          method: 'POST',
          success: res => {
            let access_token = res.data.access_token,
              flag = 0,
              results = [];

            self.data.pictures.forEach(element => {
              wx.getFileSystemManager().readFile({
                filePath: element.images,
                encoding: 'base64',
                success: res => {
                  let image = encodeURI(res.data)
                  wx.request({
                    url: 'https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request' + "?access_token=" + access_token,
                    data: {
                      image: image,
                      is_sync: 'true',
                      request_type: 'json',
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: res => {
                      flag++;
                      results.push({
                        images: element.images,
                        result: res.data,
                      })
                      if (flag == self.data.pictures.length) {
                        resolve(results)
                      }
                    },
                    fail: res => {
                      flag++;

                      if (flag == self.data.pictures.length) {
                        reject(res)
                      }
                    }
                  })
                },
                fail: res => {
                  reject(res)
                }
              })
            });
          },
          fail: res => {
            reject(res)
          },
        })
      }).then((result) => {
        wx.hideLoading();
        wx.navigateTo({
          url: '../result_form/result_form',
          success: res => {
            res.eventChannel.emit('albumnToResult_form', { pictures: result })
          }
        })
      }).catch((res) => {
        console.log(res);
        wx.showToast({
          title: "出现了一个错误\n请重试",
          icon: "none"
        })
      })
    } else if (self.data.active == 3) {
      let url = 'https://www.universitydog.cn/bankcard',
        name = 'bankcard',
        header = {
          "Content-Type": "text/html",
          'accept': 'application/json',
        };

      mutlUploadFile(self.data.pictures, url, name, header).then((result) => {

        wx.hideLoading();

        wx.navigateTo({
          url: '../result_bankInfo/result_bankInfo',
          success: res => {
            res.eventChannel.emit('albumnToResult_bankInfo', { pictures: result })
          }
        })
      }).catch((res) => {
        console.log(res);
        wx.showToast({
          title: "出现了一个错误\n请重试",
          icon: "none"
        })
      })
    }

  },


  choose: function (e) {
    let self = this,
      chooseB = !self.data.chooseB,
      pictures = self.data.pictures;

    if (chooseB) {
      pictures.forEach(element => {
        element.isChoose = false;
      });
    }

    self.setData({
      chooseB: chooseB,
      pictures: pictures,
    })

    self.drag.init();

  },


  delete: function (e) {
    let self = this,
      deleteNum = [],
      pictures = self.data.pictures;

    for (let i = 0; i < self.data.pictures.length; i++) {
      if (self.data.pictures[i].isChoose && self.data.chooseB) {
        deleteNum.push(i);
      }
    }

    for (let i = 0; i < deleteNum.length; i++) {
      pictures.splice(deleteNum[i] - i, 1);
    }

    self.setData({
      pictures: pictures,
    })

    self.drag.init();

  },


  none: function (e) {
    wx.showToast({
      title: '功能待开发...',
      icon: 'none',
    })
  },


})