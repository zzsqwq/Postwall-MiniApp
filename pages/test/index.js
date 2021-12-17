// index.js
Page({
    data: {
        tmp_path: "tmp"
    },
    onLoad(options) {
        // Do some initialize when page load.
    },
    onReady() {
        // Do something when page ready.
        this.drawBall()
    },
    drawBall() {
        const context = qq.createCanvasContext('submit-canvas');
        const that = this;

        context.arc(100, 100, 30, 0, 2 * Math.PI);
        context.clip();
        context.restore();
        //绘制文字
        context.setTextAlign('center')
        context.setFillStyle('#fff')
        context.fillText("测试看看", 100, 180)//用户昵称
        context.setFontSize(16)
        context.stroke()

        context.draw()
        qq.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 670,
            height: 800,
            canvasId: 'submit-canvas',
            success: function (res) {
                console.log(res.tempFilePath);
                that.setData({
                    tmp_path: res.tempFilePath
                })
            }
        })
    },
    test() {
        console.log(this.data.tmp_path)
    },
    onShow() {
        // Do something when page show.
    },
    onHide() {
        // Do something when page hide.
    },
    onUnload() {
        clearInterval(this.interval)
        // Do something when page close.
    },
    onPullDownRefresh() {
        // Do something when pull down.
    },
    onReachBottom() {
        // Do something when page reach bottom.
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    onAddToFavorites: function (res) {
        // return custom favorite data.
    },
    onPageScroll() {
        // Do something when page scroll
    },
    onResize() {
        // Do something when page resize
    },
    onTabItemTap(item) {
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
    },
    // Event handler.
})
