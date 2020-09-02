const app = getApp()

var API_MAP={
  'bank_card_number': '银行卡号',
  'bank_name': '所属银行',
  'BabyBirthday': '出生日期',
  'BabyName': '姓名',
  'BabySex': '性别',
  'Code': '编号',
  'FatherName': '父亲名字',
  'MotherName': '母亲名字',
  'ValidDate': '有效日期',
  'Sex': '性别',
  'NameChn': 'NameChn',
  'Birthday': '生日',
  'NameEng': '英文名字',
  'CardNum': '身份证号',
  'Address': '地址',
  'BirthAddress': '出生地',
  'Birthday': '生日',
  'CardNo': '编号',
  'Name': '姓名',
  'Nation': '民族',
  'Relationship': '关系',
  'Sex': '性别',
  'FAX': '传真',
  'TEL': '电话',
  'NAME': '姓名',
  'TITLE': '标题',
  'MOBILE': '手机',
  'PC': 'PC',
  'COMPANY': '公司',
  'URL': '网址',
  'EMAIL': '邮箱',
  'ADDR': '地址',
  'success': '识别是否成功',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictures: [],
    CustomBar: app.globalData.CustomBar,
    windowH: '',
    windowW: '',
    data: [],
    checked_data: [],
  },

  onLoad: function (options) {
    let self = this,
      eventChannel = self.getOpenerEventChannel();

    wx.showLoading({
      title: '请稍候...',
    })

    eventChannel.on("albumnToResult_cardInfo", data => {
      let pictures = data.pictures,
        result_data = [];
      let i = 0
      pictures.forEach(element => {
        result_data.push('获取的结果：' )
        let j = 0
        for(let key in element.result){
          if (element.result[key] != '' && element.result[key] != 'true' && key != 'words_result_num'){
            if (j != 0){
              result_data[i] += '，' + element.result[key]
            }else{
              result_data[i] += element.result[key]
            }
            j++
          }
        }
        i++
      });

      self.setData({
        pictures: pictures,
        result_data: result_data,
        cardType: data.cardType
      })
      wx.hideLoading();

    })

    wx.getSystemInfo({
      success: res => {
        self.setData({
          windowH: res.windowHeight,
          windowW: res.windowWidth,
        })
      },
    })
  },

  indexTap: function(e){
    wx.navigateBack({
      delta: 99,
    })
  },

  showModal(e) {
    let data = [], 
      tran = ''
    for(let key in this.data.pictures[e.currentTarget.dataset.target].result){
      if(key != 'words_result_num'){
        if (key in API_MAP){
          tran = API_MAP[key]
        }
        else{
          tran = key
        }
        data.push([tran, this.data.pictures[e.currentTarget.dataset.target].result[key]])
      }
    }

    this.setData({
      modalItem: e.currentTarget.dataset.target,
      modalImage: this.data.pictures[e.currentTarget.dataset.target].images,
      targetModal: e.currentTarget.dataset.target,
      data: data,
    })
  },

  hideModal(e) {
    hideModal(this);
  },

  shareSubmit(e){
    let self = this,
      result = '',
      i = 0
    self.data.result_data.forEach(element => {
      if (self.data.checked_data[i] == true){
        result += element + '\n'
      }
      i++
    });
    wx.setClipboardData({
      data: result,
    })
    hideModal(self)
  },

  starSubmit(e){
    
  },

  saveSubmit(e){
    let self = this,
      openid = ''
    wx.showLoading({
      title: "正在处理..."
    })
    let promise = new Promise(function (resolve, reject) {
      wx.getStorage({
        key:'app_openid',//获取key值
        success: function(res) {
          openid = res.data
          resolve(openid)
        },
      })
    }).then(openid => {
      let i = 0
      self.data.pictures.forEach(element => {
        if (self.data.checked_data[i] == true){
          if (element.result.success == 'true'){
            wx.request({
              url:'https://www.universitydog.cn/cardBag/save',
              data:{
                'uid': openid,
                'json': element.result,
                'cardType': self.data.cardType,
              },
              method: 'GET',
              header: {
                "content-type": 'application/json'
              },
              fail: res => {
                console.log(res)
              }
            })
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '不能保存未识别成功的内容',
              icon: 'none',
            })
          }
        }
        i++
      })
      wx.hideLoading();
      hideModal(self);
      }).catch(res => {})
    },

    formSubmit: function(e) {
      let self = this,
        pictures = self.data.pictures,
        i = 0

      for(let key in pictures[self.data.targetModal].result){
        if (key != 'words_result_num'){
          pictures[self.data.targetModal].result[key] = e.detail.value["item"+i]
          i++
        }
      }
      
      let result_data = []
      i = 0
      pictures.forEach(element => {
        result_data.push('获取的结果：' )
        let j = 0
        for(let key in element.result){
          if (element.result[key] != '' && element.result[key] != 'true' && key != 'words_result_num'){
            if (j != 0){
              result_data[i] += '，' + element.result[key]
            }else{
              result_data[i] += element.result[key]
            }
            j++
          }
        }
        i++
    });

    self.setData({
      pictures: pictures,
      result_data: result_data,
    })
  },

  share: function (e) {
    let self = this
    self.setData({
      bottomModal: 'share',
    })
  },

  star: function(e){
    let self = this
    self.setData({
      bottomModal: 'star',
    })
  },

  save: function(e){
    let self = this
    self.setData({
      bottomModal: 'save',
    })
  },

  checkboxTap:function(e){
    let self = this,
      checked_data = self.data.checked_data
    if (checked_data[e.currentTarget.dataset.value] == null){
      checked_data[e.currentTarget.dataset.value] = true
    }else{
      checked_data[e.currentTarget.dataset.value] = !checked_data[e.currentTarget.dataset.value]
    }
    self.setData({
      checked_data: checked_data,
    })
    
  }
})

function hideModal(self) {
  self.setData({
    modalItem: null,
    bottomModal: null,
    checked_data: [],
  });
}
