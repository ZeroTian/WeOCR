const app = getApp()

Page({
  data: {
    content: '图册',
    pictures: [],
    isIphoneX: app.globalData.isIphoneX,
    listData: [],
    extraNodes: [
    ],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    active: '',
    isPopping: true,
    animMenu: {},
    animScan: {},
    animChoose: {},
    animErase: {},
    animNone1: {},
    animNone2: {},
    windowH: '',
    windowW: '',
    img_h: '',
    img_w: '',
    chooseB: '',
  },


  onLoad() {
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
          windowH: windowHeight,
          windowW: windowWidth,
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
  onTapImg() {

    let self = this,
      id = self.drag.getIndex(),
      active = self.data.active;

    if (!self.data.chooseB) {
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
  backIndex() {
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


  change() {
    // console.log("change", e.detail.pictures)
  },


  itemClick() {
    // console.log(e);
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
  menu: function () {
    if (this.data.isPopping) {
      this.pop();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },


  //弹出动画
  pop: function () {
    let self = this,
      menu = createAnimation(),
      scan = createAnimation(),
      choose = createAnimation(),
      erase = createAnimation(),
      none1 = createAnimation(),
      none2 = createAnimation()

    menuIconAnimation(menu, 180);
    childrenIconAnimation(self, scan, 40, -160, 1, 180);
    childrenIconAnimation(self, choose, -100, -120, 1, 180);
    childrenIconAnimation(self, erase, -168, 0, 1, 180);
    childrenIconAnimation(self, none1, -100, 120, 1, 180);
    childrenIconAnimation(self, none2, 40, 160, 1, 180);

    this.setData({
      animMenu: menu.export(),
      animScan: scan.export(),
      animChoose: choose.export(),
      animErase: erase.export(),
      animNone1: none1.export(),
      animNone2: none2.export(),
    })
  },


  //收回动画
  takeback: function () {
    let self = this,
      menu = createAnimation(),
      scan = createAnimation(),
      choose = createAnimation(),
      erase = createAnimation(),
      none1 = createAnimation(),
      none2 = createAnimation()

    menuIconAnimation(menu, 0);
    childrenIconAnimation(self, scan, 0, 0, 0, 0);
    childrenIconAnimation(self, choose, 0, 0, 0, 0);
    childrenIconAnimation(self, erase, 0, 0, 0, 0);
    childrenIconAnimation(self, none1, 0, 0, 0, 0);
    childrenIconAnimation(self, none2, 0, 0, 0, 0);

    this.setData({
      animMenu: menu.export(),
      animScan: scan.export(),
      animChoose: choose.export(),
      animErase: erase.export(),
      animNone1: none1.export(),
      animNone2: none2.export(),
      chooseB: false,
    })
  },

  // 当点击扫描图标时
  scan() {
    let self = this;

    if (self.data.active == 0) {
      let url = 'https://www.universitydog.cn/scan',
        name = 'scan',
        header = {
          "Content-Type": "text/html",
          'accept': 'application/json',
        };

      promiseThen(mutlUploadFile(self.data.pictures, url, name, header), '../result/result_scan/result_scan', 'albumnToResult_scan');

    } else if (self.data.active == 1) {
      let url = 'https://www.universitydog.cn/translatescan',
        name = 'translatescan',
        header = {
          "Content-Type": "text/html",
          'accept': 'application/json',
        };

      promiseThen(mutlUploadFile(self.data.pictures, url, name, header), '../result/result_translate/result_translate', 'albumnToResult_translate');

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
      })
      promiseThen(picpromise, '../result/result_form/result_form', 'albumnToResult_form');
    }
  },


  choose: function () {
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


  erase: function () {
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


  none: function () {
    wx.showToast({
      title: '功能待开发...',
      icon: 'none',
    })
  },


})

// 菜单键的动画
function menuIconAnimation(animation, rotateZ) {
  animationRotate(animation, rotateZ);
  animationStep(animation);
}


// 子项的动画
function childrenIconAnimation(self, animation, x, y, opacity, rotateZ) {
  animationTranslate(self, animation, x, y, opacity);
  animationRotate(animation, rotateZ);
  animationStep(animation);
}

// 绕Z旋转动画
function animationRotate(animation, rotateZ) {
  animation.rotateZ(rotateZ);
}

// 平移动画
function animationTranslate(self, animation, x, y, opacity) {
  animation.translate(x * self.data.windowW / 750, y * self.data.windowW / 750).opacity(opacity);
}

// 动画结束
function animationStep(animation) {
  animation.step();
}

// 创建动画
function createAnimation() {
  return wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  });
}

// 承诺完成后执行的内容
function promiseThen(promise, path, emitName) {
  promise.then((result) => {
    wx.hideLoading();
    navigate(path, emitName, result);
  }).catch((res) => {
    console.log(res);
    wx.showToast({
      title: "出现了一个错误\n请重试",
      icon: "none"
    });
  });

  // 导航到某个页面 
  function navigate(path, emitName, pictures) {
    wx.navigateTo({
      url: path,
      success: res => {
        res.eventChannel.emit(emitName, { pictures: pictures });
      }
    });
  }
}

// 上传多张照片
function mutlUploadFile(pictures, url, name, header) {
  let postpromise = new Promise(function (resolve, reject) {
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