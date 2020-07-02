Page({

  data: {
    content:'选择图片',
    active: '',
    windowW: '',
  },
  
  onLoad: function (options) {
    let self = this;

    self.setData({
      active: options.active,
    })
    
    wx.getSystemInfo({
      success: res => {
        self.setData({
          windowW: res.windowWidth,
        })
      },
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
          url: "../muchMore/muchMore",
          event: {
            moreToChooseImg: function (data) {
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
            res.eventChannel.emit('chooseImgToMore', {
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
        let self = this,
          tempFiles = res.tempFiles,
          tempFilePaths = [],
          pictures = [];

        tempFiles.forEach(element => {
          tempFilePaths.push(element.path);
        });

        wx.navigateTo({
          url: "../muchMore/muchMore",
          event: {
            moreToChooseImg: function (data) {
              console.log(data.feedback);
            },

          },
          success: function (res) {
            tempFilePaths.forEach(element => {
              pictures.push({
                images: element
              })
            });
            res.eventChannel.emit('chooseImgToMore', {
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
            moreToChooseImg: function (data) {
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