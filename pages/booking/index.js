// pages/booking/index.js
Page({
    data: {
      coachList: [],
      
    },
  
    onLoad() {
      this.fetchCoachData();
    },
    
  
    fetchCoachData() {
      wx.cloud.database().collection('coach')
        .get()
        .then(res => {
          if (res.data && res.data.length > 0) {
            const promises = res.data.map(coach => this.getCloudStorageUrl(coach.photo));
            Promise.all(promises)
              .then(photoUrls => {
                const coachListWithUrls = res.data.map((coach, index) => ({
                  ...coach,
                  photoUrl: photoUrls[index],
                }));
                this.setData({ coachList: coachListWithUrls });
              })
              .catch(err => {
                console.error('获取图片链接失败', err);
                wx.showToast({
                  title: '获取教练信息失败',
                  icon: 'none',
                });
              });
          } else {
            this.setData({ coachList: [] }); // 设置为空数组，显示“暂无教练信息”
          }
        })
        .catch(err => {
          console.error('获取教练数据失败', err);
          wx.showToast({
            title: '获取教练信息失败',
            icon: 'none',
          });
        });
    },
  
    getCloudStorageUrl(fileID) {
      return wx.cloud.getTempFileURL({
        fileList: [fileID],
      })
        .then(res => res.fileList[0].tempFileURL)
        .catch(err => {
          console.error('获取图片链接失败', err);
          throw err; // 将错误抛出，以便 Promise.all 捕获
        });
    },
  
    contactCoach(event) {
      const phone = event.currentTarget.dataset.phone;
      wx.showModal({
        title: '联系教练',
        content: `是否拨打 ${phone}`,
        success: (res) => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: phone,
            });
          }
        },
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
  