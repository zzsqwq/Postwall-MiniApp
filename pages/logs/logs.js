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
    onShareAppMessage() {
        // return custom share data when user share.
    },
    onPullDownRefresh() {
        qq.stopPullDownRefresh({
            success: res => {
                qq.showToast({
                    title: '页面已刷新',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    }
})
