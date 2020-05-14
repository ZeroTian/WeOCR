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
  },


  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true
    })

    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 持续监听事件 可以获取来自Index的图片地址
    eventChannel.on('indexToAlbumn', function (data) {
      self.setData({
        pictures: data.pictures,
        active: data.active,
      })
    })
  },


  onShow(){
    this.drag = this.selectComponent('#drag');
    this.drag.init();
  },


  // 当点击图片时可以对图片进行操作: 图片的缩放, 图片的裁剪
  onTapImg(e) {

    let self = this,
      id = this.drag.getIndex(),
      active = self.data.active;

    // 实现图片的剪切或预览
    if (active <= 2 && id !== '') {
      wx.navigateTo({
        url: "../cropper/cropper",
        // 一个事件的监听器可以随时接听事件是否被调用
        event: {
          // 接收来自preview_img的数据
          preToAlbumn: function (data) {
            console.log(data.feedback);
          },

        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送图片
          res.eventChannel.emit('albumnToCropper', { pictures: self.data.pictures, id: id, active: active, })
        },
      })
    } else if(active > 2 && id !== '') {
      // wx.navigateTo({
      //   url: "../preImg/preImg",
      //   // 一个事件的监听器可以随时接听事件是否被调用
      //   event: {
      //     // 接收来自preview_img的数据
      //     preToAlbumn: function (data) {
      //       console.log(data.feedback);
      //     },

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
    this.drag = this.selectComponent('#drag');
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


})