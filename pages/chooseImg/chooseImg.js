Page({

  data: {

    active: '',

  },

  
  onLoad: function (options) {
    let self = this;

    self.setData({
      active: options.active,
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
          url: "../muchMore/muchMore",
          // 一个事件的监听器可以随时接听事件是否被调用
          event: {
            // 接收来自Albumn的数据
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
            // 通过eventChannel向被打开页面传送图片
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
          url: "../muchMore/muchMore",
          // 一个事件的监听器可以随时接听事件是否被调用
          event: {
            // 接收来自Albumn的数据
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
            // 通过eventChannel向被打开页面传送图片
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
            // 通过eventChannel向被打开页面传送图片
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