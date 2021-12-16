// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]



Page({
  data: {
    imageList: [],
    submitList: []
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
    submitList = this.data.submitList
    var i = 0
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
      async function uploadfiles() {
        // await qq.cloud.uploadFile( {
        //   cloudPath : timestamp + '/' + i + imageList[i].slice(-4),
        //   filePath : imageList[i]
        // })
        // .then(res => {
        //   submitList.push(res.fileID)
        //   if (i != imageList.length -1 ) {
        //     i = i + 1
        //     uploadfiles()
        //   }
        // })
        // .catch(res => console.error(res))
        for(let i=0;i<imageList.length;i++) {
          await qq.cloud.uploadFile({
            cloudPath : timestamp + '/' + i + imageList[i].slice(-4),
            filePath : imageList[i]
          })
          .then( res => {submitList.push(res.fileID)})
          .catch( res => {console.error(res)})
        }
    }

    uploadfiles().then( res => {
        console.log("submitList is :", submitList, submitList.length)
        console.log("imageList is :", imageList, imageList.length)
      }).catch(res => console.error(res))

    // uploadfiles().then( res=> {
    //   console.log("submitList is :", submitList, submitList.length)
    //   console.log("imageList is :", imageList, imageList.length)
    // }
    // ).catch(res => console.error(res))
    // for(let i=0;i<imageList.length;i++) {
    //     qq.cloud.uploadFile({
    //       cloudPath : timestamp + '/' + i + imageList[i].slice(-4),
    //       filePath : imageList[i]
    //     })
    //     .then( res => {submitList.push(res.fileID)})
    //     .catch( res => {console.error(res)})
    // }
    // while(submitList.length != imageList.length) {
    //   console.log("submitlist length:",submitList.length)
    //   tmp ++
    //   if (tmp > 100) break;
    // }
    // this.setData( {
    //   submitList : submitList
    // })
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
        image_list : submitList
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
      success: res => {
        console.log(res)
        imageList = imageList.concat(res.tempFilePaths)
        console.log(res.tempFilePaths)
        that.setData({
        imageList: imageList
        })
      }
    })
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

