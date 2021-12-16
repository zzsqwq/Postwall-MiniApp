// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]



Page({
  data: {
    imageList: [],
  },
  onLoad(options) {
    qq.cloud.init({
      env: 'postwall-4gy7eykl559a475a',
      traceUser: true
    })

    const db = qq.cloud.database();

    db.collection('books').where(
      {
        publishInfo: {
          country: 'test'
        }
      }
    ).get({
      success: function(res) {
        console.log(res)
      },
      // fail: function(res) {
      //   console.log("failed! res:",res)
      // }
    })
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
    submit_data = e.detail.value
    const db = qq.cloud.database()
    db.collection("postwall").add( {
      data: {
        post_type : submit_data.post_type,
        post_title : submit_data.post_title,
        post_text : submit_data.post_text,
        post_contact_qq : submit_data.post_contact_qq,
        post_contact_wechat : submit_data.post_contact_wechat,
        post_contact_tel : submit_data.post_contact_tel,
        post_done : false,
        post_data : new Date(),
        image_list : imageList
      }
    })
    .then(res => {console.log(res)})
    .catch(res => {console.error(res)})

    qq.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1000
    })
  },
  formReset() {
    console.log('form发生了reset事件')
    // qq.showToast(
    //   {
    //     title: '清空成功',
    //     icon: 'success',
    //     duration: 500
    //   }
    // )
  },
  chooseImage: function () {
    const that = this
    imageList = this.data.imageList
    qq.chooseImage({
      sourceType: ['album','camera'],
      sizeType: ['original','compressed'],
      count: 9 - imageList.length,
      success: async res => {
        console.log(res)
        imageList = imageList.concat(res.tempFilePaths)
        // console.log(res.tempFilePaths)
        //image_list = imageList
        console.log(res.tempFilePaths[0])
        // qq.cloud.uploadFile( {
        //   cloudPath: "1.png",

        //   filePath: res.tempFilePaths[0],

        //   success : res => {
        //     console.log('photo upload success, resid is ',res.fileID),
        //     image_list.push(res.fileID)
        //     // that.setData( {
        //     //   imageList : image_list
        //     // })
        //     //console.log("imagelist: ", image_list)
        //   }
        // }
        // )
        //console.log("imagelist: ",image_list)
        that.setData({
           imageList: image_list
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

