const baseUrl = 'your-backend-api-url' 

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        'content-type': 'application/json' 
      },
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export default {
  login: (code) => request('/login', 'POST', { code }),
  getSchedule: (date) => request(`/schedule?date=${date}`, 'GET'),
  // ... other api functions
}
