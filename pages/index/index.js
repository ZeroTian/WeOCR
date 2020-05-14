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
        en_name: 'scan',
        fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/ocr.png',
        img_src: '',
      },
      {
        id: 1,
        name: "翻译",
        tab: "翻译",
        en_name: 'translate',
        fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/translate.png',
        img_src: '',
      },
      {
        id: 2,
        name: "银行卡识别",
        tab: "识别",
        en_name: 'identify',
        fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/bank-card.png',
        img_src: '',
      },
      {
        id: 3,
        name: "PDF导出",
        tab: "导出",
        en_name: 'exportPDF',
        fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/pdf-merger.png',
        img_src: '',
      },
    ],


    active: 0,

  },


  onLoad: function (e) {
    let self = this,
      fun = self.data.fun,
      fileList = [],
      tempFileURL = [];

    wx.showShareMenu({
      withShareTicket: true
    })

    fun.forEach(element => {
      fileList.push(element.fileID);
    });

    wx.cloud.getTempFileURL({
      fileList: fileList,
      success: function (res) {
        fileList = res.fileList;
        fileList.forEach(element => {
          tempFileURL.push(element.tempFileURL)
        });

        for(var i = 0; i<tempFileURL.length; i++){
          fun[i].img_src = tempFileURL[i];
        }
        
        self.setData({
          fun: fun,
        })
      }
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