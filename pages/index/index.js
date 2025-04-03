// pages/index/index.js
Page({
    data: {
      username: '',
      password: '',
      backgroundImageUrl: '',
      openid: null // 用于存储openid的全局变量
    },
  
    onUsernameInput(e) {
      this.setData({
        username: e.detail.value
      });
    },
  
    onPasswordInput(e) {
      this.setData({
        password: e.detail.value
      });
    },
  
    onLoad: function () {
      const fileID = 'cloud://jianshen-6gwt8d3h38f26ee1.6a69-jianshen-6gwt8d3h38f26ee1-1332587989/images/background1.jpg'; 
  
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: res => {
          this.setData({
            backgroundImageUrl: res.fileList[0].tempFileURL
          });
        },
        fail: err => {
          console.error("获取图片链接失败", err);
        }
      });
  
      wx.getSystemSetting({
        success: (res) => {
          this.setData({
            screenWidth: res.screenWidth,
            screenHeight: res.screenHeight
          });
        }
      });
    },
  
    onLogin() {
        const { username, password } = this.data;
    
        if (!username || !password) {
          wx.showToast({
            title: '用户名和密码不能为空',
            icon: 'none',
            duration: 2000
          });
          return;
        }
    
        const db = wx.cloud.database();
        const customers = db.collection('customers');
    
        customers.where({
          username: username,
          password: password
        }).get().then(res => {
          if (res.data.length > 0) {
            const openid = res.data[0]._openid; 
    
            // 登录成功，将 openid 保存到全局变量
            this.setData({ openid: openid });
            getApp().globalData.openid = openid;
    
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
    
            wx.navigateTo({
              url: '/pages/customer/index'
            });
    
          } else {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(err => {
          console.error('数据库查询失败', err);
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          });
        });
      }
    });
  
  