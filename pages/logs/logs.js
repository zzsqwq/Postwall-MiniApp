//logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad: function () {
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
