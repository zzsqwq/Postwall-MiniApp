// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
  data: {
    imageList: [],
  },
  onLoad(options) {
    // Do some initialize when page load.
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
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
  onAddToFavorites: function(res) {
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
  viewTap() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    qq.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1000
    })
  },
  formReset() {
    console.log('form发生了reset事件')
  },
  chooseImage:function () {
    const that = this
    imageList = this.data.imageList
    qq.chooseImage({
      sourceType: ['album','camera'],
      sizeType: ['original','compressed'],
      count: 9 - imageList.length,
      success(res) {
        console.log(res);
        imageList = imageList.concat(res.tempFilePaths);
        console.log(res.tempFilePaths);
        that.setData({
          imageList: imageList
        })
      }
    }
    )
  },
  previewImage(e) {
    console.log(this.data.imageList)
    const current = e.target.dataset.src

    qq.previewImage({
      current,
      urls: this.data.imageList
    })
  },
  deleteImage(e) {
    var imgs = this.data.imageList;
    var index = e.target.dataset.index;
    console.log(index);
    imgs.splice(index,1);
    this.setData( {
      imageList : imgs
    })
  }
})

