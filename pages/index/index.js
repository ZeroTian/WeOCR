const app = getApp()

Page({
  data: {
    content: 'Multi OCR',
    fun: [{
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
      name: "表格识别",
      tab: "识别",
      en_name: 'exportExcle',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/excel.jpg',
      img_src: '',
    },
    {
      id: 3,
      name: "银行卡识别",
      tab: "识别",
      en_name: 'identify',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/bank-card.png',
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

  },

  onNavbarTap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
  },

  onChooseImageAlbumn: function (e) {
    let self = this;

    wx.chooseImage({
      count: 4,
      sourceType: ['album'],

      success: res => {
        let tempFilePaths = res.tempFilePaths,
          pictures = [];

        wx.navigateTo({
          url: "../albumn/albumn",
          event: {
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({
                images: element,
                isChoose: '',
              })
            });
            res.eventChannel.emit('indexToAlbumn', {
              pictures: pictures,
              active: self.data.active
            })
          },
        })
      },
    })

  },


  onChooseWeChatAlbumn: function (e) {
    let self = this;

    wx.chooseMessageFile({
      count: 4,
      type: 'image',

      success: res => {
          tempFiles = res.tempFiles,
          tempFilePaths = [],
          pictures = [];

        tempFiles.forEach(element => {
          tempFilePaths.push(element.path);
        });

        wx.navigateTo({
          url: "../albumn/albumn",
          event: {
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({
                images: element
              })
            });
            res.eventChannel.emit('indexToAlbumn', {
              pictures: pictures,
              active: self.data.active
            })
          },
        })
      },

    })
  },


  onChooseCameraAlbumn: function (e) {
    let self = this;

    wx.chooseImage({
      count: 4,
      sourceType: ['camera'],

      success: res => {
        let tempFilePaths = res.tempFilePaths,
          pictures = [];

        wx.navigateTo({
          url: "../albumn/albumn",
          event: {
            albumnToIndex: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({
                images: element
              })
            });
            res.eventChannel.emit('indexToAlbumn', {
              pictures: pictures,
              active: self.data.active
            })
          },
        })
      },
    })

  },


})