// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

const app = getApp()
Page({
    data: {
        imageList: [],
        is_admin : "",
        type_array : ["提问","吐槽","表白","寻物","寻人"],
        type_index : 0,
        submitList: [],
        post_type_value : "",
        post_title_value : "",
        post_text_value : "",
        contact_qq_value : "",
        contact_wechat_value : "",
        contact_tel_value : "",
        adminer_list : [],
        admin_barlist : [
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/images/tabbar/icon-home.png",
                "selectedIconPath": "/images/tabbar/icon-home-selected.png",
                "text": "提交订单"
            },
            {
                "pagePath": "/pages/admin/admin",
                "iconPath": "/images/tabbar/icon-admin.png",
                "selectedIconPath": "/images/tabbar/icon-admin-selected.png",
                "text":"审核与发布"
            },
            {
                "pagePath": "/pages/logs/logs",
                "iconPath": "/images/tabbar/icon-log.png",
                "selectedIconPath": "/images/tabbar/icon-log-selected.png",
                "text": "相关与反馈"
            }
        ]
    },
    setAdminBar() {
        console.log(typeof this.getTabBar === 'function')
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            console.log("function!")
            this.getTabBar().setData({
                list : this.data.admin_barlist,
            })
            console.log(this.getTabBar().data)
        }
    },
    checkAdmin() {
        const db = qq.cloud.database();
        const that = this
        db.collection("adminList").get().then( res => {
            let adminList = res.data;
            console.log("adminList",adminList)
        })
    },
    getTypeArray() {
      qq.cloud.callFunction( {
          name : "getTypeArray",
          data : {

          }
      }).then( res => {
          console.log(res)
          this.setData( {
              type_array : res.result.data[0].typelist
          })
      })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            type_index: e.detail.value
        })
    },
    onLoad(options) {
        qq.showShareMenu({
        showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        qq.cloud.init({
            env: 'postwall-4gy7eykl559a475a',
            traceUser: true
        });
        this.getTypeArray();
        this.setData({
            is_admin : app.data.is_admin
        })
        //this.getUserOpenid();

        //this.checkAdmin();

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
        console.log('form发生了fresh reset事件')

        const ImageList = this.data.imageList
        const submitList = this.data.submitList
        
        ImageList.splice(0,ImageList.length)
        submitList.splice(0,submitList.length)

        this.setData({
            post_type_value : "",
            post_title_value : "",
            post_text_value : "",
            contact_qq_value : "",
            contact_wechat_value : "",
            contact_tel_value : "",
            imageList : ImageList,
            submitList : submitList
        })
        
        qq.stopPullDownRefresh({
            success : res => {
                qq.showToast({
                    title: '页面已刷新',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
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
        console.log(this.data.post_type_value)
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        let submit_data = e.detail.value
        let submit_type = this.data.type_array[submit_data.post_type]
        let submitList = this.data.submitList
        let imageList = this.data.imageList
        if(!submit_type || !submit_data.post_title || !submit_data.post_text) {
            let content = "您的"
            console.log("type:",submit_type)
            console.log("title:",submit_data.post_title)
            console.log("text:",submit_data.post_text)
            if(!submit_type) {
                content = content + "投稿类型" + "、"
            }
            if(!submit_data.post_title) {
                content = content + "投稿标题" + "、"
            }
            if(!submit_data.post_text) {
                content = content + "投稿内容" + "、"
            }
            content = content.slice(0,-1) + "未填写"
            qq.showModal({
                title: '投稿内容不全!',
                content: content,
                showCancel : false,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return ;
        }
        var i = 0
        var timestamp = Date.parse(new Date())
        timestamp = timestamp / 1000

        async function uploadfiles() {
            let upload_num = 1;
            qq.showLoading({
                title : "订单投递中，请稍作等待",
                mask : true
            })
            for (let i = 0; i < imageList.length; i++) {
                await qq.cloud.uploadFile({
                    cloudPath: timestamp + '/' + i + imageList[i].slice(-4),
                    filePath: imageList[i]
                }).then(res => {
                    console.log(res.fileID)
                    submitList.push(res.fileID)
                }).catch(res => {
                        console.error(res)
                    })
                // await uploadtask.onProgressUpdate( (res) => {
                //     console.log('上传进度', res.progress)
                //
                //     qq.showLoading({
                //         title: '正在上传数据，请勿退出'
                //     })
                //
                // } )

            }
        }

        uploadfiles()
            .then(res => {
                const db = qq.cloud.database()
                db.collection("postwall").add({
                    data: {
                        post_time: timestamp,
                        post_type: submit_type,
                        post_title: submit_data.post_title,
                        post_text: submit_data.post_text,
                        post_contact_qq: submit_data.post_contact_qq,
                        post_contact_wechat: submit_data.post_contact_wechat,
                        post_contact_tel: submit_data.post_contact_tel,
                        post_user_openid : app.data.user_openid,
                        post_user_done : false,
                        post_done: false,
                        post_date: new Date(),
                        image_list: submitList
                    }
                })
                    .then(res => {
                        submitList.length = 0;
                        console.log(res)
                    })
                    .catch(res => {
                        console.error(res)
                    })
            })
            .then(res => {
                qq.hideLoading();
                qq.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 1000
                })
            })
            .catch(res => console.error(res))
    },
    formReset() {
        console.log('form发生了reset事件')
        const ImageList = this.data.imageList
        const submitList = this.data.submitList

        ImageList.splice(0,ImageList.length)
        submitList.splice(0,submitList.length)

        this.setData({
            imageList : ImageList,
            submitList : submitList
        })
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
            sourceType: ['album', 'camera'],
            sizeType: ['original', 'compressed'],
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
        const current = e.target.dataset.index

        qq.previewImage({
            urls: [this.data.imageList[current]]
        })
    },

    deleteImage(e) {
        var imgs = this.data.imageList;
        var index = e.target.dataset.index;
        console.log(index);
        imgs.splice(index, 1);
        this.setData({
            imageList: imgs
        })
    }
})