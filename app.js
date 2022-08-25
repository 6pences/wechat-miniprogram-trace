//app.js
var QQMapWX = require('./lib/qqmap-wx-jssdk.js');
var bMap = require('./lib/bmap-wx.min.js');
const http = require('./utils/http')
const api = require('./utils/api')
// const util = require('./utils/util')

App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取当前版本信息
    wx.getSystemInfo({ success: res => {
      wx.setStorage({
        data: res,
        key: 'appInfo',
      })
      this.globalData.appInfo = res
    } })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        http.askFor(api.user.code2Session,{
          appid: this.globalData.accountInfo.appid,
          secret: this.globalData.accountInfo.terces.split('').reverse().join(''),
          jsCode: res.code}).then(res => {
          wx.setStorage({
            data: res.data.map,
            key: 'users',
          })
        })
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.wxUserInfo']) {
          // 已经授权，可以直接调用 getwxUserInfo 获取头像昵称，不会弹框
          wx.getwxUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.wxUserInfo = res.userInfo

              // 由于 getwxUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.wxUserInfoReadyCallback) {
                this.wxUserInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    accountInfo: { // 小程序信息
      appid: 'wx781ff0138ccdd3aa',
      terces: 'a2b4124d3d0405aba64f23150b4b8bdb'
    },
    basicInfo: { // 基本配置
      appName: '北斗智寻',
      appPackage: 'wx.tenth.friendtrack',
      appVersion: '2',
      appVersionName: '',
      agencyChannel: 'miniProgram',
      appMarket: 'miniProgram',
      application: 'street'
    },
    mapLocation: {}, // 位置信息
    appInfo: {}, // 应用信息
    secret: {
      qqmap: '3BNBZ-7C5EJ-P4DFD-FDOAF-CQZF3-KDFWJ',
      bmap: 't8W5177cNE3fbGg63gBO7NjGnARtN7NV'
    },
    wxUserInfo: null // 微信登录用户数据
  },
  qqmapsdk: new QQMapWX({ key: '3BNBZ-7C5EJ-P4DFD-FDOAF-CQZF3-KDFWJ'}),
  BMap: new bMap.BMapWX({ ak: 't8W5177cNE3fbGg63gBO7NjGnARtN7NV' }),
  http: http,
  api: api
})