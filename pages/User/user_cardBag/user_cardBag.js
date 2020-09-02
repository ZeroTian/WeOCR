Page({

  data: {
    content: '我的卡包',
    card_list: ['银行卡', '名片', '户口本', '身份证', '营业执照', '护照', '港澳通行证', '台湾通行证', ],
    card_enName_map: ['BankCards', 'BusinessCards', 'HouseHolds', 'Ids', 'BusinessLicenses', 'Passports', 'Vkms', 'Taiwans'],
    cardInfo: {},
    tap: false,
    tapType: '',
  },

  onLoad: function (options) {
    let promise = new Promise(function (resolve, reject) {
      wx.getStorage({
        key:'app_openid',//获取key值
        success: function(res) {
          let openid = res.data
          resolve(openid)
        },
      })
    }).then(openid => {
      wx.request({
        url: 'https://www.universitydog.cn/cardBag/getAll',
        data: {
          uid: openid,
        },
        method: 'GET',
        success: res => {
          for(let key1 in res.data){
            let list = []
            for(let key2 in res.data[key1]){
              list.push(res.data[key1][key2])
            }
            res.data[key1] = list
          }
          this.setData({
            cardInfo: res.data,
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    }).catch( res => {} )
  },

  cardTypeTap: function(e){
    var self = this,
      tapType = self.data.card_enName_map[e.currentTarget.dataset.value],
      tap = ''
    if (self.data.tapType == tapType){
      tap = !self.data.tap
    }else{
      tap = true
    }
    self.setData({
      tap: tap,
      tapType: tapType,
    })
    console.log()
  }
})