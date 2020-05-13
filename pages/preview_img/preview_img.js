Page({
  data: {
    pictures: [],
    cur_pic: '',
    id: '',
    windowH: '',
    windowW: '',
    img_h: '',
    img_w: '',
    old_width: '',
    old_height: '',
    scale: '',
    distance: '',
    tool: false,
    x: '',
    y: '',
  },


  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 持续监听事件 可以获取来自albumn的图片地址
    eventChannel.on('albumnToPre', function (data) {
      self.setData({
        pictures: data.pictures,
        id: data.id,
      })
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

  },


  onReady: function () {
    let self = this,
      cur_pic = self.data.pictures[self.data.id].images;

    self.setData({
      cur_pic: cur_pic,
    })

    wx.getImageInfo({
      src: cur_pic,
      success: function (msg) {
        let img_w = msg.width,
          img_h = msg.height,
          windowW = self.data.windowW,
          windowH = self.data.windowH,
          scale = img_w / img_h,
          window_scale = windowW / windowH;

        if (scale > window_scale) {
          self.setData({
            img_w: windowW,
            img_h: windowW / scale,
            old_width: windowW,
            old_height: windowW / scale,
          })
        } else {
          self.setData({
            img_w: windowH * scale,
            img_h: windowH,
            old_width: windowH * scale,
            old_height: windowH,
          })
        }
      }
    })

  },


  // 触控缩放
  onStart: function (res) {
    let self = this;

    if (res.touches.length == 2) {
      let _x = res.touches[1].pageX - res.touches[0].pageX,
        _y = res.touches[1].pageY - res.touches[0].pageY,
        distance = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
      self.setData({
        distance: distance
      })
    }

  },

  onMove: function (res) {
    let self = this;

    if (res.touches.length == 2) {
      let _x = res.touches[1].pageX - res.touches[0].pageX,
        _y = res.touches[1].pageY - res.touches[0].pageY,
        newdistance = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2)),
        img_h = self.data.img_h,
        img_w = self.data.img_w,
        old_width = self.data.old_width,
        distance = self.data.distance,
        end_distance = newdistance - distance,
        move_size = 1 + end_distance * 0.001,
        size = img_w / old_width;

      if (size <= 4 && size >= 0.5) {
        self.setData({
          img_h: img_h * move_size,
          img_w: img_w * move_size,
        })
      } else if (size < 5 && size > 4 && move_size < 1) {
        self.setData({
          img_h: img_h * move_size,
          img_w: img_w * move_size,
        })
      } else if (size > 0.25 && size < 0.5 && move_size > 1) {
        self.setData({
          img_h: img_h * move_size,
          img_w: img_w * move_size,
        })
      }

    }

  },


  onTap: function (e) {
    let tool = !tool;

    self.setData({
      tool: tool,
    })
  },


  // 将数据传输给albumn页面
  backIndex: function (e) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    // 调用事件fromPreview_img
    eventChannel.emit('preToAlbumn', { feedback: "要反馈的信息" })
  },


})