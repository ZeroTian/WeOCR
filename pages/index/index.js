//获取应用实例
const app = getApp()

Page({


  /**
   * 页面的初始数据
   */
  data: {
    fun: [
      {
        id: 0,
        name: "扫描",
        tab: "扫描",
        img_src: "https://6f63-ocr-qaq-1302036835.tcb.qcloud.la/icon/ocr.png?sign=c4fd717403677313aa4dc69e5d3fcca2&t=1589383819",
      },
      {
        id: 1,
        name: "翻译",
        tab: "翻译",
        img_src: "https://6f63-ocr-qaq-1302036835.tcb.qcloud.la/icon/translate.png?sign=620b8a537954fdd2272d82e0cee10b6f&t=1589383847",
      },
      {
        id: 2,
        name: "银行卡识别",
        tab: "识别",
        img_src: "https://6f63-ocr-qaq-1302036835.tcb.qcloud.la/icon/bank-card.png?sign=ec4a7a98b4f1daeaa84f4775061e9a4d&t=1589383869",
      },
      {
        id: 3,
        name: "PDF导出",
        tab: "导出",
        img_src: "https://6f63-ocr-qaq-1302036835.tcb.qcloud.la/icon/pdf-merger.png?sign=24761ac6d4d97bed058cc7b621606853&t=1589383896",
      },
    ],

    active: 0,

  },


  onLoad: function (e) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },


  // 上方功能选择框的滑动
  onNavbarTap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
  },

  // 图片的选择事件
  onChooseImageAlbumn: function (e) {
    let self = this;

    wx.chooseImage({
      count: 100,
      sourceType: ['album'],

      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths,
          pictures = [];

        // 导向照片集合页面
        wx.navigateTo({
          url: "../albumn/albumn",
          // 一个事件的监听器可以随时接听事件是否被调用
          event: {
            // 接收来自Albumn的数据
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({ images: element })
            });
            // 通过eventChannel向被打开页面传送图片
            res.eventChannel.emit('indexToAlbumn', { pictures: pictures, active: self.data.active })
          },
        })
      },
    })

  },


  onChooseWeChatAlbumn: function (e) {
    let self = this;

    wx.chooseMessageFile({
      count: 100,
      type: 'image',

      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        let self = this,
          tempFiles = res.tempFiles,
          tempFilePaths = [],
          pictures = [];

        tempFiles.forEach(element => {
          tempFilePaths.push(element.path);
        });

        // 导向照片集合页面
        wx.navigateTo({
          url: "../albumn/albumn",
          // 一个事件的监听器可以随时接听事件是否被调用
          event: {
            // 接收来自Albumn的数据
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({ images: element })
            });
            // 通过eventChannel向被打开页面传送图片
            res.eventChannel.emit('indexToAlbumn', { pictures: pictures, active: self.data.active })
          },
        })
      },

    })
  },


  onChooseCameraAlbumn: function (e) {
    let self = this;

    wx.chooseImage({
      count: 100,
      sourceType: ['camera'],

      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths,
          pictures = [];

        // 导向照片集合页面
        wx.navigateTo({
          url: "../albumn/albumn",
          // 一个事件的监听器可以随时接听事件是否被调用
          event: {
            // 接收来自Albumn的数据
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({ images: element })
            });
            // 通过eventChannel向被打开页面传送图片
            res.eventChannel.emit('indexToAlbumn', { pictures: pictures, active: self.data.active })
          },
        })
      },
    })

  },


})