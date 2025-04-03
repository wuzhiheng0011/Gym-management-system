Page({
    data: {
      name: '',
      vip: '',
      rest: 0,
      loading: true,
      openid: '',
      avatarUrl: '', // 用于存储头像地址 (File ID)
      email: '', // 用于存储邮箱地址
      topBackgroundImageUrl: '', // 顶部背景图URL
    bottomBackgroundImageUrl: '', // 底部背景图URL
      userInfoItems: [
        { label: '姓名', value: '' },
        { label: 'VIP', value: '' },
        { label: '余额', value: 0},
        { label: '邮箱', value: '' }
      ],
      
    },
  
    onLoad: function() {
      this.getUserInfo();
      this.getTopBackgroundImage();  // 获取顶部背景图
    this.getBottomBackgroundImage(); // 获取底部背景图
    },
    getUserInfo: function() {
      const openid = getApp().globalData.openid;
  
      if (!openid) {
        console.error('openid 未定义！');
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index' // 替换成你的登录页面路径
          });
        }, 2000);
        return;
      }
  
      const db = wx.cloud.database();
      const customers = db.collection('customers');
  
      customers.where({
        _openid: openid
      }).get().then(res => {
        this.setData({ loading: false });
        if (res.data.length > 0) {
          const userInfo = res.data[0];
          this.setData({
            name: userInfo.name,
            vip: userInfo.VIP,
            rest: userInfo.rest,
            avatarUrl: userInfo.picture,
            email: userInfo.email,
            userInfoItems: [ // 更新 userInfoItems 数组
              { label: '姓名', value: userInfo.name },
              { label: 'VIP', value: userInfo.VIP },
              { label: '余额', value: userInfo.rest },
              { label: '邮箱', value: userInfo.email }
            ]
          });
        } else {
          console.warn('未找到用户信息', openid);
          wx.showToast({
            title: '未找到用户信息',
            icon: 'none',
            duration: 2000
          });
          // 可以考虑在这里添加跳转到其他页面或者其他处理逻辑
        }
      }).catch(err => {
        this.setData({ loading: false });
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none',
          duration: 2000
        });
      });
    },
    getBottomBackgroundImage: function() {
        wx.cloud.getTempFileURL({
          fileList: ['cloud://jianshen-6gwt8d3h38f26ee1.6a69-jianshen-6gwt8d3h38f26ee1-1332587989/images/background5.jpg'], 
          success: res => {
            if (res.fileList && res.fileList.length > 0 && res.fileList[0].tempFileURL) { 
              this.setData({
                bottomBackgroundImageUrl: res.fileList[0].tempFileURL
              });
            } else {
              console.error('获取背景图片失败，返回结果不正确', res);
              // 设置默认背景图片
              this.setData({
                bottomBackgroundImageUrl: '/images/banner2.jpg' // 替换成你的默认背景图片路径
              });
            }
          },
          fail: err => {
            console.error('获取背景图片失败', err);
            // 设置默认背景图片
            this.setData({
                bottomBackgroundImageUrl: '/images/banner2.jpg' // 替换成你的默认背景图片路径
            });
          }
        });
      },
      getTopBackgroundImage: function() {
        wx.cloud.getTempFileURL({
          fileList: ['cloud://jianshen-6gwt8d3h38f26ee1.6a69-jianshen-6gwt8d3h38f26ee1-1332587989/images/background3.png'], 
          success: res => {
            if (res.fileList && res.fileList.length > 0 && res.fileList[0].tempFileURL) { 
              this.setData({
                topBackgroundImageUrl: res.fileList[0].tempFileURL
              });
            } else {
              console.error('获取背景图片失败，返回结果不正确', res);
              // 设置默认背景图片
              this.setData({
                topBackgroundImageUrl: '/images/banner2.jpg' // 替换成你的默认背景图片路径
              });
            }
          },
          fail: err => {
            console.error('获取背景图片失败', err);
            // 设置默认背景图片
            this.setData({
                topBackgroundImageUrl: '/images/banner2.jpg' // 替换成你的默认背景图片路径
            });
          }
        });
      },
  
    chooseAvatar: function() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const fileSize = res.tempFiles[0].size;
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (fileSize > MAX_SIZE) {
            wx.showToast({
              title: '图片大小不能超过 5MB',
              icon: 'none'
            });
            return;
          }
  
          const tempFilePath = res.tempFilePaths[0];
          const openid = getApp().globalData.openid;
  
          wx.cloud.uploadFile({
            cloudPath: `user_avatars/${openid}.jpg`, // 使用 openid 作为文件名的一部分
            filePath: tempFilePath,
            success: res => {
              // 更新数据库中的 picture 字段
              const db = wx.cloud.database();
              db.collection('customers').where({
                _openid: openid
              }).update({
                data: {
                  picture: res.fileID
                }
              }).then(() => {
                this.setData({
                  avatarUrl: res.fileID // 更新头像地址
                });
                wx.showToast({
                  title: '头像上传成功',
                  icon: 'success'
                });
              }).catch(err => {
                console.error('更新数据库失败', err);
                wx.showToast({
                  title: '头像上传失败',
                  icon: 'none'
                });
              });
            },
            fail: err => {
              console.error('上传文件失败', err);
              wx.showToast({
                title: '头像上传失败',
                icon: 'none'
              });
            }
          });
        }
      });
    },
    goToAppointment() {
        wx.navigateTo({
          url: '/pages/booking/index', // 预约页面
        })
      },
      goToCustomerIndex() {
          wx.navigateTo({
            url: '/pages/customer/index', // 预约课程页面
          })
        },
    
      goToPersonalCenter() {
        wx.navigateTo({
          url: '/pages/personalCenter/index', //  个人中心页面
        })
      },
    
      goToRecharge() {
        wx.navigateTo({
          url: '/pages/recharge/index', // 余额充值页面
        })
      },
    
  });
  