Component({
    data: {
        selected : 0,
        color: "#7F8389",
        selectedColor: "#0097E6",
        backgroundColor: "#FFFFFF",
        list : [ {
            "pagePath": "/pages/index/index",
            "iconPath": "/images/tabbar/icon-home.png",
            "selectedIconPath": "/images/tabbar/icon-home-selected.png",
            "text": "提交订单"
        },
            {
                "pagePath": "/pages/test/index",
                "iconPath": "/images/tabbar/icon-log.png",
                "selectedIconPath": "/images/tabbar/icon-log-selected.png",
                "text": "相关与反馈"
            }]
    },
    attached() {
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({url})
            this.setData({
                selected: data.index
            })
        }
    },
});
