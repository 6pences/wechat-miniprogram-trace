var bmap = require('../../lib/bmap-wx.min.js');
Page({
    data: {
        sugData: ''
    },
    bindKeyInput: function(e) {
        var that = this;
        if (e.detail.value === '') {
            that.setData({
                sugData: ''
            });
            return;
        }
        var BMap = new bmap.BMapWX({
            ak: 'uGLScSa3TZjBqzGY5Zy1GuFFAtBy2N0I'
        });
        var fail = function(data) {
            console.log(data)
        };
        var success = function(data) {
            var sugData = '';
            for(var i = 0; i < data.result.length; i++) {
                sugData = sugData + data.result[i].name + '\n';
            }
            that.setData({
                sugData: sugData
            });
        }
        BMap.suggestion({
            query: e.detail.value,
            region: '北京',
            city_limit: true,
            fail: fail,
            success: success
        });
    }
})