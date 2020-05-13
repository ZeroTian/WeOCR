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
        img_src: "../../images/ocr.png",
      },
      {
        id: 1,
        name: "翻译",
        tab: "翻译",
        img_src: "../../images/translate.png",
      },
      {
        id: 2,
        name: "银行卡识别",
        tab: "识别",
        img_src: "../../images/bank-card.png",
      },
      {
        id: 3,
        name: "PDF导出",
        tab: "导出",
        img_src: "../../images/pdf-merger.png",
      },
    ],

    active: 0,

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
      count: 9,
      sourceType: ['albumn'],

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
          tempFilePaths = [];

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
            res.eventChannel.emit('indexToAlbumn', { pictures: tempFilePaths, active: self.data.active })
          },
        })
      },

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})