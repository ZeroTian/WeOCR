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
    animDownload: {},
    animChoose: {},
    animDelete: {},
    animInput: {},
    animCloud: {},
    windowH: '',
    windowW: '',
    img_h: '',
    img_w: '',
    chooseB: '',
    quality: 80,
    isQuality: false,
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
    eventChannel.on('chooseImgToMore', function (data) {

      if (data.active == -4) {
        let pictures = [];

        data.pictures.forEach(element => {
          // picture是引用类型所以一个更改所有的值都被更改了
          // 将picture的定义放在循环内部
          let picture = { images: '', isChoose: '', quality: 80, };
          picture.images = element.images;
          picture.isChoose = element.isChoose;
          pictures.push(picture);
        });

        data.pictures = pictures;

      }

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
    eventChannel.emit('moreToChooseImg', { data: "要反馈的信息" })
  },


  sortEnd(e) {
    this.setData({
      pictures: e.detail.listData
    });

    this.drag.init();
  },


  change(e) {
  },


  itemClick(e) {
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
    var animationDownload = wx.createAnimation({
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
    animationDownload.translate(15, -60).rotateZ(180).opacity(1).step();
    animationChoose.translate(-37.5, -45).rotateZ(180).opacity(1).step();
    animationDelete.translate(-63, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-37.5, 45).rotateZ(180).opacity(1).step();
    animationCloud.translate(15, 60).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animDownload: animationDownload.export(),
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
    var animationDownload = wx.createAnimation({
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
    animationDownload.translate(0, 0).rotateZ(0).opacity(0).step();
    animationChoose.translate(0, 0).rotateZ(0).opacity(0).step();
    animationDelete.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    animationCloud.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animDownload: animationDownload.export(),
      animChoose: animationChoose.export(),
      animDelete: animationDelete.export(),
      animInput: animationInput.export(),
      animCloud: animationCloud.export(),
      chooseB: false,
      isQuality: false,
    })
  },

  download: function (e) {
    let self = this,
      active = self.data.active;

    // 当功能为发现素材时
    if (active == -1) {
      self.data.pictures.forEach(element => {
        wx.getFileSystemManager().readFile({
          filePath: element.images,
          encoding: 'base64',
          success: res => {
            console.log(res.data)
          }
        })
      });
    }
    // 当功能为裁剪图片时不做任何处理直接保存图片到相册
    else if (active == -2) {
      let pictures = self.data.pictures;

      if (self.data.chooseB) {
        let chooseNum = [];

        for (let i = 0; i < self.data.pictures.length; i++) {
          if (self.data.pictures[i].isChoose && self.data.chooseB) {
            chooseNum.push(i);
          }
        }

        self.authorize = self.selectComponent("#authorization");
        self.authorize.isAuthorize('writePhotosAlbum', () => {

          chooseNum.forEach(element => {
            wx.saveImageToPhotosAlbum({
              filePath: element.images,
            })

          });

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);

        })
      } else {

        self.authorize = self.selectComponent("#authorization");
        self.authorize.isAuthorize('writePhotosAlbum', () => {

          pictures.forEach(element => {
            wx.saveImageToPhotosAlbum({
              filePath: element.images,
            })

          });

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            wx.navigateBack();
          }, 2000);

        })

      }

    }
    // 当功能为pdf导出时
    else if (active == -3) {
      self.data.pictures.forEach(element => {
        wx.getFileSystemManager().readFile({
          filePath: element.images,
          encoding: 'base64',
          success: res => {
            console.log(res.data)
          }
        })
      });
    }
    // 当功能为图片压缩时
    else if (active == -4) {
      let pictures = self.data.pictures;

      if (self.data.chooseB) {
        let compressNum = [];

        for (let i = 0; i < self.data.pictures.length; i++) {
          if (self.data.pictures[i].isChoose && self.data.chooseB) {
            compressNum.push(i);
          }
        }

        self.authorize = self.selectComponent("#authorization");
        self.authorize.isAuthorize('writePhotosAlbum', () => {

          compressNum.forEach(element => {
            wx.compressImage({
              src: pictures[element].images,
              quality: pictures[element].quality,
              success: (res) => {

                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                })

              },
            })
          });

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            wx.navigateBack();
          }, 2000);

        })
      } else {

        self.authorize = self.selectComponent("#authorization");
        self.authorize.isAuthorize('writePhotosAlbum', () => {

          pictures.forEach(element => {
            wx.compressImage({
              src: element.images,
              quality: element.quality,
              success: (res) => {

                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                })

              },
            })
          });

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            wx.navigateBack();
          }, 2000);

        })

      }

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


  quality: function (e) {
    let self = this;

    self.setData({
      isQuality: !self.data.isQuality,
    })

  },

  changeQuality: function (e) {
    let self = this,
      pictures = self.data.pictures;

    if (self.data.chooseB) {
      let qualityNum = [];

      for (let i = 0; i < pictures.length; i++) {
        if (pictures[i].isChoose && self.data.chooseB) {
          qualityNum.push(i);
        }
      }

      qualityNum.forEach(element => {
        pictures[element].quality = e.detail.value;
      });

    } else {

      pictures.forEach(element => {
        element.quality = e.detail.value;
      });

    }

  },


  none: function (e) {
  },


})
