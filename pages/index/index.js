const app = getApp()

Page({
  data: {
    content: 'Multi OCR',
    fun: [{
      id: 0,
      name: "扫描",
      en_name: 'scan',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/ocr.png',
    },
    {
      id: 1,
      name: "翻译",
      en_name: 'translate',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/translate.png',
    },
    {
      id: 2,
      name: "表格识别",
      en_name: 'exportExcle',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/excel.jpg',
    },
    {
      id: 3,
      name: "卡片识别",
      en_name: 'identify',
      fileID: 'cloud://ocr-qaq.6f63-ocr-qaq-1302036835/icon/bank-card.png',
    },
    ],

    active: 0,

  },

  // 进行页面的初始化操作
  onLoad: function () {
    let self = this;

    // 使分享按钮可用
    wx.showShareMenu({
      withShareTicket: true
    })

  },

  // 当导航栏被点击是改变active的值
  onNavbarTap: function (e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },

  // 当点击相册中选图的按钮时
  onChooseImageAlbumn: function () {
    chooseImageFile(this, 4, ['album'], "../albumn/albumn");
  },

  // 当点击微信中选图的按钮时
  onChooseWeChatAlbumn: function () {
    chooseImageFile(this, 4, ['wechat'], "../albumn/albumn");
  },

  // 当点击相册中选图的按钮时 
  onChooseCameraAlbumn: function () {
    chooseImageFile(this, 4, ['camera'], "../albumn/albumn");
  },
})


// 选择相册图片或拍照图片
function chooseImageFile(self, count, sourceType, navigateTo) {
  if(sourceType[0] == 'album' || sourceType[0] == 'camera' ){
    chooseImage(count, sourceType, navigateTo);
  }else if(sourceType[0] == 'wechat'){
    chooseMessageFile(count, navigateTo);
  }
  
  // 选择手机相册图片或拍照图片
  function chooseImage(count, sourceType, navigateTo) {
    wx.chooseImage({
      count: count,
      sourceType: sourceType,

      success: res => {
        navigate(res.tempFilePaths, navigateTo);
      },
    });
  }

  // 选择微信图片
  function chooseMessageFile(count, navigateTo) {
    wx.chooseMessageFile({
      count: count,
      type: 'image',

      success: res => {
        let tempFilePaths = [];
        res.tempFiles.forEach(element => {
          tempFilePaths.push(element.path);
        })
        navigate(tempFilePaths, navigateTo);
      },
    });
  }

  // 进行导航操作
  function navigate(tempFilePaths, path) {
    wx.navigateTo({
      url: path,
      event: {
        albumnToIndex: function (data) {
          console.log(data.feedback);
        },
      },
      success: function (res) {
        let pictures = [];
        tempFilePaths.forEach(element => {
          pictures.push({
            images: element,
            isChoose: '',
          });
        });
        res.eventChannel.emit('indexToAlbumn', {
          pictures: pictures,
          active: self.data.active
        });
      },
    });
  }
}