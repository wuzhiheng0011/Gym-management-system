// app.js
App({
    globalData: {
        openid: null // 初始化为 null
      },
  onLaunch() {
    // 展示本地存储能力
    wx.cloud.init({
        env: 'jianshen-6gwt8d3h38f26ee1',
        traceUser: true,
        fail: err => {
          console.error('云开发环境初始化失败', err)
          
        }
      })
      
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
 
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
