//logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad: function () {
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        this.setData({
            logs: (qq.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
    onPullDownRefresh() {
        qq.stopPullDownRefresh({
            success : res => {
                console.log(res)
            }
        })
    }
})
