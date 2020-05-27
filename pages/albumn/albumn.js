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
      // else if (active > 2 && id !== '') {
      //   wx.navigateTo({
      //     url: "../preImg/preImg",
      //   // 一个事件的监听器可以随时接听事件是否被调用
      //   event: {
      //     // 接收来自preview_img的数据
      //     preToAlbumn: function (data) {
      //       console.log(data.feedback);
      //     },

      //     },
      //     success: function (res) {
      //       // 通过eventChannel向被打开页面传送图片
      //       res.eventChannel.emit('albumnToPre', { pictures: self.data.pictures, id: id, active: self.data.active, })
      //     },
      //   })
      //   let pictures = [];
      //   self.data.pictures.forEach(element => {
      //     pictures.push(element.images);
      //   });

      //   wx.previewImage({
      //     urls: pictures,
      //   })
      // }
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
    let self = this,
      pictures = [];
      // 扫描得到的结果

    // self.data.pictures.forEach(element => {
    //   wx.getFileSystemManager().readFile({
    //     filePath: element.images, //选择图片返回的相对路径
    //     encoding: 'base64', //编码格式
    //     success: res => { //成功的回调
    //       // 图片的base64数据
    //       console.log(res.data)
    //       let data = res.data;

    //       wx.request({
    //         url: '',
    //         data: {
    //           pictures: data,
    //         },
    //         success: res => {
    //           console.log(res)
    //         }
    //       })

    //       results.push();

    //     }
    //   })
    // });

    // 根据功能的不同导向不同的页面
    if (self.data.active == 0) {

      // 上传文件
      // self.data.pictures.forEach(element => {
      //   wx.uploadFile({
      //     url: 'http://101.37.87.153:8888/',
      //     filePath: element.images,
      //     name: 'test',
      //     success(res) {
      //       console.log(res.data);

      //       // 将 result 加入到 pictures 中
      //       self.data.pictures.forEach(element => {
      //         pictures.push({
      //           images: element.images,
      //           result: res.data,
      //         })
      //       });
      //     }
      //   })
      // })

      wx.navigateTo({
        url: '../result_scan/result_scan',
        success: res => {
          res.eventChannel.emit('albumnToResult_scan', { pictures: pictures })
        }
      })
    } else if (self.data.active == 1) {
      
      // 上传文件
      // self.data.pictures.forEach(element => {
      //   wx.uploadFile({
      //     url: 'http://101.37.87.153:8888/',
      //     filePath: element.images,
      //     name: 'test',
      //     success(res) {
      //       console.log(res.data);

      //       // 将 result 加入到 pictures 中
      //       self.data.pictures.forEach(element => {
      //         pictures.push({
      //           images: element.images,
      //           result: res.data,
      //         })
      //       });
      //     }
      //   })
      // })

      wx.navigateTo({
        url: '../test/test',
        success: res => {

          // 实验的数据
          pictures.push({
            images: '../../images/01.png',
            result: {
              "log_id": 9211242835512594453,
              "words_result": [
                { "words": "微信小程序 jspdf百度搜索微信小程序百度搜索", "location": { "top": 5, "left": 6, "width": 494, "height": 32 }, "boxChosed": false },
                { "words": "×安全指引微信开放文档×云班课-活动列表", "location": { "top": 6, "left": 583, "width": 494, "height": 28 }, "boxChosed": false },
                { "words": "译百度翻译", "location": { "top": 6, "left": 1180, "width": 137, "height": 28 }, "boxChosed": false },
                { "words": "+", "location": { "top": 4, "left": 1478, "width": 68, "height": 35 }, "boxChosed": false },
                { "words": " dey hn?c-interatim-indevrcla cource id-RD2090D-C09_4509-4041-A00", "location": { "top": 32, "left": 358, "width": 720, "height": 37 }, "boxChoosed": false },
                { "words": " Cmosoteach.cn/web/index.php?c=interaction&m=index&clazz_course_id=ABD2090D-C099-4509-A041-A00DBAF79EC4", "location": { "top": 53, "left": 19, "width": 1159, "height": 25 }, "boxChosed": false },
                { "words": "☆1080", "location": { "top": 46, "left": 1296, "width": 606, "height": 34 }, "boxChosed": false },
                { "words": "应用 Unity3D WPF WeChat GitHub哔哩哔哩(力扣Leet Code)图灵图 Chrome插件(谷歌 ProtonMail一)题库大全w w3school在线教程石墨文档", "location": { "top": 91, "left": 19, "width": 1768, "height": 33 }, "boxChosed": false },
                { "words": "我的班课", "location": { "top": 146, "left": 344, "width": 146, "height": 30 }, "boxChosed": false },
                { "words": "任务中心教学包库管理我的题库口手机投屏", "location": { "top": 143, "left": 669, "width": 625, "height": 33 }, "boxChosed": false },
                { "words": "张永涛退出帮助", "location": { "top": 143, "left": 1382, "width": 180, "height": 29 }, "boxChosed": false },
                { "words": "软件工程18205", "location": { "top": 261, "left": 537, "width": 149, "height": 34 }, "boxChosed": false },
                { "words": "大学英语I(四)", "location": { "top": 303, "left": 538, "width": 118, "height": 24 }, "boxChosed": false },
                { "words": "资源(11)成员(34)活动(7)消息(0)详情", "location": { "top": 357, "left": 570, "width": 511, "height": 29 }, "boxChosed": false },
                { "words": "课堂表现", "location": { "top": 511, "left": 384, "width": 63, "height": 21 }, "boxChosed": false },
                { "words": "根据活动名称搜索", "location": { "top": 591, "left": 359, "width": 140, "height": 31 }, "boxChosed": false },
                { "words": "Q", "location": { "top": 597, "left": 1501, "width": 25, "height": 27 }, "boxChosed": false },
                { "words": "全部活动进行中已结束", "location": { "top": 655, "left": 362, "width": 296, "height": 24 }, "boxChosed": false },
                { "words": "未分组(1)", "location": { "top": 733, "left": 367, "width": 101, "height": 30 }, "boxChosed": false },
                { "words": "03.第三元(nit5)(6)", "location": { "top": 797, "left": 366, "width": 215, "height": 37 }, "boxChosed": false },
                { "words": "进行中Unit5单词测试", "location": { "top": 863, "left": 480, "width": 210, "height": 30 }, "boxChosed": false },
                { "words": "共36道题目共30人作答20-05-078经验", "location": { "top": 909, "left": 471, "width": 412, "height": 34 }, "boxChosed": false },
                { "words": "进行中包作业活动2020-mp1: Cultural shock: True or false?", "location": { "top": 992, "left": 480, "width": 554, "height": 30 }, "boxChosed": false },
                { "words": "共5人参与12020-04-2915经验", "location": { "top": 1032, "left": 417, "width": 339, "height": 36 }, "boxChosed": false },
              ],
              "words_result_num": 24
            }
          })

          res.eventChannel.emit('albumnToResult_scan', { pictures: pictures })
        }
      })
    } else if (self.data.active == 2) {

      // 上传文件
      // self.data.pictures.forEach(element => {
      //   wx.uploadFile({
      //     url: 'http://101.37.87.153:8888/',
      //     filePath: element.images,
      //     name: 'test',
      //     success(res) {
      //       console.log(res.data);

      //       // 将 result 加入到 pictures 中
      //       self.data.pictures.forEach(element => {
      //         pictures.push({
      //           images: element.images,
      //           result: res.data,
      //         })
      //       });
      //     }
      //   })
      // })

    } else if (self.data.active == 3) {
      
      // 上传文件
      // self.data.pictures.forEach(element => {
      //   wx.uploadFile({
      //     url: 'http://101.37.87.153:8888/',
      //     filePath: element.images,
      //     name: 'test',
      //     success(res) {
      //       console.log(res.data);

      //       // 将 result 加入到 pictures 中
      //       self.data.pictures.forEach(element => {
      //         pictures.push({
      //           images: element.images,
      //           result: res.data,
      //         })
      //       });
      //     }
      //   })
      // })

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