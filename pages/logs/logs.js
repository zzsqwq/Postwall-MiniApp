//logs.js
const util = require('../../utils/util.js')

const app = getApp()

Page({
    data: {
        logs: [],
        appInstance: app,
        navigate: [{
            url: "/pages/privacy/privacy",
            type: "navigate",
            text: "隐私说明",
            color: "#5677fc"
        },
            {
                url: "/pages/changelog/changelog",
                type: "navigate",
                text: "更新日志",
                color: "#5677fc"
            }
        ]
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
