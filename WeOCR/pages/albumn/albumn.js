Page({


  data: {
    pictures: [],
    active: '',
  },


  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();``

    // 持续监听事件 可以获取来自Index的图片地址
    eventChannel.on('indexToAlbumn', function (data) {
        self.setData({
          pictures: data.pictures,
          active: data.active,
        })
    })
  },


  // 当点击图片时可以对图片进行操作: 图片的缩放, 图片的裁剪
  onTapImg: function (e) {
    let self = this,
      // 当前点击的图片的id是多少
      id = e.currentTarget.dataset.id,
      active = self.data.active;
    
    // 实现图片的剪切或预览
    if(active <= 2){
      wx.navigateTo({
        url: "../shear/shear",
        // 一个事件的监听器可以随时接听事件是否被调用
        event: {
          // 接收来自preview_img的数据
          preToAlbumn: function (data) {
            console.log(data.feedback);
          },
  
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送图片
          res.eventChannel.emit('albumnToPre', { pictures: self.data.pictures, id: id, active: active, })
        },
      })
    }else{
      wx.navigateTo({
        url: "../preview_img/preview_img",
        // 一个事件的监听器可以随时接听事件是否被调用
        event: {
          // 接收来自preview_img的数据
          preToAlbumn: function (data) {
            console.log(data.feedback);
          },
  
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送图片
          res.eventChannel.emit('albumnToPre', { pictures: self.data.pictures, id: id, active: self.data.active, })
        },
      })
      
    }

  },


  // 将数据传输给index页面
  backIndex: function (e) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 调用事件fromAlbumn
    eventChannel.emit('albumnToIndex', { data: "要反馈的信息" })
  },


})

