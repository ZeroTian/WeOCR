Page({
  data: {
    historyData: [],
    content: '我的历史',
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    let self = this
    new Promise(function (resolve, reject) {
      wx.getStorage({
        key:'app_openid',//获取key值
        success: function(res) {
          let openid = res.data
          resolve(openid)
        },
      })
    }).then(openid => {
      let result = []
      wx.request({
        url: 'https://www.universitydog.cn/getHistoryInfo?openid=' + openid,
        method: 'GET',
        success: res => {
          for(var key in res.data){
            let item = res.data[key]
            item.result = JSON.parse(res.data[key].result)
            let str = ''
            item.result.words_result.forEach(element => {
              str += element['words'] + ' '
            });
            item.result = str
            result.push(item)
          }
          self.setData({
            historyData: result,
          })
          wx.hideLoading()
        },
      })
    }).catch(() => {})
  },
})