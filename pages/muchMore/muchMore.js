const utils = require('../../utils.js');

const app = getApp()

Page({

  data: {
    content: '图册',
    isIphoneX: app.globalData.isIphoneX,
    size: 3,
    pageMetaScrollTop: 0,
    scrollTop: 0,
    isPopping: true,
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
          windowH: windowHeight,
          windowW: windowWidth,
        })
      },
    })

    eventChannel.on('chooseImgToMore', function (data) {
      if (data.active == -4) {
        let pictures = [];
        data.pictures.forEach(element => {
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

  onTapImg(e) {
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

  scroll(e) {
    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },

  //点击弹出
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.pop();
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
  pop: function () {
    let self = this,
      menu = utils.animation.createAnimation(),
      anim1 = utils.animation.createAnimation(),
      anim2 = utils.animation.createAnimation(),
      anim3 = utils.animation.createAnimation(),
      anim4 = utils.animation.createAnimation(),
      anim5 = utils.animation.createAnimation()
    utils.animation.menuIconAnimation(menu, 180);
    utils.animation.childrenIconAnimation(self, anim1, 40, -160, 1, 180);
    utils.animation.childrenIconAnimation(self, anim2, -100, -120, 1, 180);
    utils.animation.childrenIconAnimation(self, anim3, -168, 0, 1, 180);
    utils.animation.childrenIconAnimation(self, anim4, -100, 120, 1, 180);
    utils.animation.childrenIconAnimation(self, anim5, 40, 160, 1, 180);
    self.setData({
      animMenu: menu.export(),
      anim1: anim1.export(),
      anim2: anim2.export(),
      anim3: anim3.export(),
      anim4: anim4.export(),
      anim5: anim5.export(),
    })
  },

  //收回动画
  takeback: function () {
    let self = this,
      menu = utils.animation.createAnimation(),
      anim1 = utils.animation.createAnimation(),
      anim2 = utils.animation.createAnimation(),
      anim3 = utils.animation.createAnimation(),
      anim4 = utils.animation.createAnimation(),
      anim5 = utils.animation.createAnimation()
    utils.animation.menuIconAnimation(menu, 0);
    utils.animation.childrenIconAnimation(self, anim1, 0, 0, 0, 0);
    utils.animation.childrenIconAnimation(self, anim2, 0, 0, 0, 0);
    utils.animation.childrenIconAnimation(self, anim3, 0, 0, 0, 0);
    utils.animation.childrenIconAnimation(self, anim4, 0, 0, 0, 0);
    utils.animation.childrenIconAnimation(self, anim5, 0, 0, 0, 0);
    self.setData({
      animMenu: menu.export(),
      anim1: anim1.export(),
      anim2: anim2.export(),
      anim3: anim3.export(),
      anim4: anim4.export(),
      anim5: anim5.export(),
      chooseB: false,
      isQuality: false,
    })
  },

  download: function (e) {
    let self = this,
      active = self.data.active;
    // 当功能为发现素材时
    if (active == -1) {
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
                    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general' + "?access_token=" + access_token,
                    data: {
                      image: image,
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: res => {
                      flag++;

                      let keyword = '',
                        request_url = "",
                        API_KEY = "12867126-c7615fc9c532fe59e7ea7ac27";
                      if (res.data.result.length > 0) {
                        keyword = res.data.result[0].keyword;
                      }
                      request_url = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(keyword) + "&lang=zh&per_page=21";
                      wx.request({
                        url: "https://www.universitydog.cn/find",
                        header: {
                          "content-type": 'application/json'
                        },
                        data: {
                          request_url: request_url,
                        },
                        method: 'GET',
                        success: res => {
                          results.push({
                            images: element.images,
                            result: res.data,
                            request_url: request_url
                          })
                          if (flag == self.data.pictures.length) {
                            resolve(results)
                          }
                        },
                      })
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
          url: '../result/result_find/result_find',
          success: res => {
            res.eventChannel.emit('albumnToResult_find', { pictures: result })
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
      // self.data.pictures.forEach(element => {
      //   wx.getFileSystemManager().readFile({
      //     filePath: element.images,
      //     encoding: 'base64',
      //     success: res => {
      //       console.log(res.data)
      //     }
      //   })
      // });
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
    // 当功能为识别果蔬时
    else if (active == -5) {
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
                    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient' + "?access_token=" + access_token,
                    data: {
                      image: image,
                      top_num: 3,
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
          url: '../result/result_fav/result_fav',
          success: res => {
            res.eventChannel.emit('albumnToResult_fav', { pictures: result })
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
    // 当功能为识别地标时
    else if (active == -6) {
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
                    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/landmark' + "?access_token=" + access_token,
                    data: {
                      image: image,
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
          url: '../result/result_landmark/result_landmark',
          success: res => {
            res.eventChannel.emit('albumnToResult_landmark', { pictures: result })
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
    // 当功能为识别银行卡时
    else if (active == -7) {
      utils.identify_card(this, 1)
    }
    // 当功能为识别名片时
    else if (active == -9) {
      utils.identify_card(this, 3)
    }
    // 当功能为识别户口本时
    else if (active == -10) {
      utils.identify_card(this, 7)
    }
    // 当功能为识别身份证时
    else if (active == -11) {
      utils.identify_card(this, 0)
    }
    // 当功能为识别营业执照时
    else if (active == -12) {
      utils.identify_card(this, 2)
    }
    // 当功能为识别护照时
    else if (active == -13) {
      utils.identify_card(this, 4)
    }
    // 当功能为识别港澳通行证时
    else if (active == -14) {
      utils.identify_card(this, 5)
    }
    // 当功能为识别台湾通行证时
    else if (active == -15) {
      utils.identify_card(this, 6)
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


  erase: function (e) {
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
    wx.showToast({
      title: '功能待开发...',
      icon: 'none',
    })
  },
})
