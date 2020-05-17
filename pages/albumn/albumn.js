const app = getApp()

Page({


  data: {
    pictures: [],
    isIphoneX: app.globalData.isIphoneX,
    // 共有多少列
    size: 3,
    listData: [],
    extraNodes: [
      // {
      // 	type: "destBefore",
      // 	dragId: "destBefore0",
      // 	destKey: 0,
      // 	slot: "before",
      // 	fixed: true
      // },
      // {
      // 	type: "destAfter",
      // 	dragId: "destAfter0",
      // 	destKey: 0,
      // 	slot: "after",
      // 	fixed: true
      // },
      // {
      // 	type: "after",
      // 	dragId: "plus",
      // 	slot: "plus",
      // 	fixed: true
      // }
    ],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    // 处于那一个功能
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
      if (active <= 2 && id !== '') {
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
      } else if (active > 2 && id !== '') {
        // wx.navigateTo({
        //   url: "../preImg/preImg",
        // // 一个事件的监听器可以随时接听事件是否被调用
        // event: {
        //   // 接收来自preview_img的数据
        //   preToAlbumn: function (data) {
        //     console.log(data.feedback);
        //   },

        //   },
        //   success: function (res) {
        //     // 通过eventChannel向被打开页面传送图片
        //     res.eventChannel.emit('albumnToPre', { pictures: self.data.pictures, id: id, active: self.data.active, })
        //   },
        // })
        let pictures = [];
        self.data.pictures.forEach(element => {
          pictures.push(element.images);
        });

        wx.previewImage({
          urls: pictures,
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
    animationScan.translate(15, -60).rotateZ(180).opacity(1).step();
    animationChoose.translate(-37.5, -45).rotateZ(180).opacity(1).step();
    animationDelete.translate(-63, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-37.5, 45).rotateZ(180).opacity(1).step();
    animationCloud.translate(15, 60).rotateZ(180).opacity(1).step();
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
    let self = this;

    self.data.pictures.forEach(element => {
      wx.getFileSystemManager().readFile({
        filePath: element.images, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
          console.log(res.data)
        }
      })
    });
  },


  // gray: function (e) {
  //   let self = this;


  //   // 图像处理

  //   for (let i = 0; i < self.data.pictures.length; i++) {

  //     if (self.data.pictures[i].isChoose && self.data.chooseB) {

  //       wx.getImageInfo({
  //         src: self.data.pictures[i].images,
  //         success: function (res) {

  //           setTimeout(() => {

  //           }, 10000);

  //           // 在canvas上使用px
  //           self.setData({
  //             img_w: res.width,
  //             img_h: res.height,
  //           })

  //           let img_w = res.width,
  //             img_h = res.height,
  //             cvs = wx.createCanvasContext("gray", self);

  //           cvs.drawImage(self.data.pictures[i].images, 0, 0, img_w, img_h);
  //           cvs.draw(false, function () {
  //             // 获得像素点
  //             wx.canvasGetImageData({
  //               canvasId: 'gray',
  //               x: 0,
  //               y: 0,
  //               width: img_w,
  //               height: img_h,
  //               success: (res) => {
  //                 const data = convertToGrayscale(res.data)
  //                 wx.canvasPutImageData({
  //                   canvasId: 'grayOut',
  //                   data: data,
  //                   x: 0,
  //                   y: 0,
  //                   width: img_w,
  //                   height: img_h,
  //                   success: (res) => {
  //                     // 将画布上的图转为图片
  //                     wx.canvasToTempFilePath({
  //                       canvasId: "grayOut",
  //                       success: (res) => {
  //                         // wx.previewImage({
  //                         //   urls: [res.tempFilePath],
  //                         // })
  //                         self.data.pictures[i].images = res.tempFilePath;
  //                         self.data.pictures[i].isChoose = false;
  //                       }
  //                     })
  //                   },
  //                   fail: (err) => {
  //                     console.error(err)
  //                   }
  //                 })
  //               },
  //               fail: (err) => {
  //                 console.error(err)
  //               }
  //             })
  //           });
  //         },
  //       })
  //     }
  //   }
  //   self.setData({
  //     pictures: self.data.pictures,
  //   })

  //   if (self.data.chooseB) {
  //     wx.showToast({
  //       title: '处理中...',
  //       icon: 'loading',
  //       duration: 1000,
  //       mask: true
  //     })
  //     self.drag.init();
  //   }

  // },


  choose: function (e) {
    let self = this,
      chooseB = !self.data.chooseB;

    self.setData({
      chooseB: chooseB,
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


})

// 转为灰度图片
// function convertToGrayscale(data) {
//   let g = 0
//   for (let i = 0; i < data.length; i += 4) {
//     g = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11)
//     data[i] = g
//     data[i + 1] = g
//     data[i + 2] = g
//   }
//   return data
// }