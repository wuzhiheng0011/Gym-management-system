// pages/customer/index.js
Page({
    data: {
        backgroundImageUrl: '',
      scheduleData: [
        {
          day: '周一',
          courses: [
            { time: '9:00-10:00', classname: '', last: '',booked:false },
          { time: '10:30-11:30', classname: '', last: '',booked:false },
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周二',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周三',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周四',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周五',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周六',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        },
        {
          day: '周日',
          courses: [
            { time: '9:00-10:00', classname: '', last: '' ,booked:false},
          { time: '10:30-11:30', classname: '', last: '' ,booked:false},
          { time: '14:00-15:00', classname: '', last: '' ,booked:false},
          { time: '16:30-17:30', classname: '', last: '' ,booked:false}
          ]
        }
      ]
    },
    onLoad: function () {
        this.fetchClassData();
        const fileID = 'cloud://jianshen-6gwt8d3h38f26ee1.6a69-jianshen-6gwt8d3h38f26ee1-1332587989/images/background2.jpg'; 
  
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
    
      fetchClassData: async function () {
        const db = wx.cloud.database();
        const days = this.data.scheduleData.map(item => item.day);
    
        try {
          const scheduleData = await Promise.all(
            days.map(async (day) => {
              const res = await db.collection('class').where({ day }).get();
              const classData = res.data;
    
              const courses = this.data.scheduleData.find(item => item.day === day).courses;
              const updatedCourses = courses.map(course => {
                const matchedClass = classData.find(classItem => classItem.time === course.time);
                return {
                  time: course.time,
                  classname: matchedClass ? matchedClass.classname : '',
                  last: matchedClass ? matchedClass.last : ''
                };
              });
    
    
              return {
                day,
                courses: updatedCourses
              };
    
    
            })
          );
    
    
          this.setData({ scheduleData });
    
    
    
        } catch (err) {
          console.error('获取课表数据失败', err);
          wx.showToast({
            title: '获取课表失败',
            icon: 'none'
          });
        }
      },
      bookCourse: async function(event) {
        const { dayIndex, courseIndex } = event.currentTarget.dataset;
        const scheduleData = this.data.scheduleData;
        const course = scheduleData[dayIndex].courses[courseIndex];
    
        if (course.last <= 0) {
          wx.showToast({
            title: '预约失败，名额已满',
            icon: 'none'
          });
          return;
        }
    
        wx.showLoading({ title: '预约中...' });
    
        try {
          const db = wx.cloud.database();
          // 更新数据库
          await db.collection('class').where({
            day: scheduleData[dayIndex].day,
            time: course.time
          }).update({
            data: {
              last: db.command.inc(-1)
            }
          });
    
          // 更新本地数据
          scheduleData[dayIndex].courses[courseIndex].last--;
          scheduleData[dayIndex].courses[courseIndex].booked = true;
          this.setData({ scheduleData });
    
          wx.hideLoading();
          wx.showToast({
            title: '预约成功',
            icon: 'success'
          });
    
        } catch (err) {
          console.error('预约失败', err);
          wx.hideLoading();
          wx.showToast({
            title: '预约失败',
            icon: 'none'
          });
        }
      },
    
    
      cancelBooking: async function(event) {
        const { dayIndex, courseIndex } = event.currentTarget.dataset;
        const scheduleData = this.data.scheduleData;
        const course = scheduleData[dayIndex].courses[courseIndex];
    
    
        wx.showLoading({ title: '取消中...' });
    
        try {
            const db = wx.cloud.database();
            // 更新数据库
            await db.collection('class').where({
              day: scheduleData[dayIndex].day,
              time: course.time
            }).update({
              data: {
                last: db.command.inc(1)
              }
            });
    
          // 更新本地数据
          scheduleData[dayIndex].courses[courseIndex].last++;
          scheduleData[dayIndex].courses[courseIndex].booked = false;
          this.setData({ scheduleData });
    
          wx.hideLoading();
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          });
        } catch (err) {
          console.error('取消预约失败', err);
          wx.hideLoading();
          wx.showToast({
            title: '取消预约失败',
            icon: 'none'
          });
        }
    
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
  
  
  
  