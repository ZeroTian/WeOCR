App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "ocr-qaq",
        traceUser: true,
      })
    }

    wx.login({
      success: res => {
        if(res.code){
          wx.request({
            url: 'https://www.universitydog.cn/getKey',
            method:'GET',
            data:{
              js_code:res.code,
            },
            success:function(res){
              wx.setStorageSync('app_openid', res.data.openid);
              wx.setStorageSync('sessionKey', res.data.session_key)
            }
          })
        }else{
          console.log("登陆失败");
        }
      }
    })

    // 用来存储一些全局数据
    this.globalData = {
      userInfo: null
    };


    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
