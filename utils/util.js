const { user } = require("./api")

const app = getApp()
const $http = app.http
const $api = app.api

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getLocation = (cb) => {
  wx.getLocation({
    type: 'gcj02',
    success: (location) => {
      app.globalData.mapLocation = location
      app.qqmapsdk.reverseGeocoder({
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }, success: (res) => {
          if (typeof cb === 'function') cb(res)
          let userInfo = wx.getStorageSync('user');
          console.log(userInfo);
          let addParam = {
            address: `fifth_1.0.2_${res.result.address}`,
            packageName: 'wx.fifth.friendtrack',
            lat: location.latitude + '',
            lon: location.longitude + '',
            userid: userInfo.id,
            username: userInfo.name
          }
          // temp for audit test
          // if (res.message == 'query ok' && userInfo)
          if (res.message == 'query ok') {
            $http.askFor(userInfo ? $api.location.add : $api.location.addNoAuth, addParam).then((data) => {}) // 用户登录则上传位置信息
          }
        }, fail: (res) => {}
      });
    }, complete: () => {}
  })
}

const getCurrentPage = () => {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let url = currentPage.route; //当前页面url
  return url
}

module.exports = {
  formatTime: formatTime,
  getLocation: getLocation,
  getCurrentPage: getCurrentPage
}