// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
    data: {
        imageList: [],
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
            qq.cloud.callFunction({
                name : 'getOpenid',
                data: {
                    a : 1 // 此处填入了某种方式获取得到的 Buffer 数据，可以是 request 下来的，可以是读文件读出来的等等
                },
            }).then( res => {
                now_openid = res.result.openid;
                console.log(now_openid)
                for(var i=0;i<adminList.length;i++) {
                    if(now_openid == adminList[i].open_id) {
                        that.setAdminBar();
                        break;
                    }
                }
            })

        })
    },
    onLoad(options) {
        qq.cloud.init({
            env: 'postwall-4gy7eykl559a475a',
            traceUser: true
        })

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
        submit_data = e.detail.value
        submitList = this.data.submitList
        imageList = this.data.imageList
        var i = 0
        var timestamp = Date.parse(new Date())
        timestamp = timestamp / 1000

        async function uploadfiles() {
            for (let i = 0; i < imageList.length; i++) {
                await qq.cloud.uploadFile({
                    cloudPath: timestamp + '/' + i + imageList[i].slice(-4),
                    filePath: imageList[i]
                })
                    .then(res => {
                        submitList.push(res.fileID)
                    })
                    .catch(res => {
                        console.error(res)
                    })
            }
        }

        uploadfiles()
            .then(res => {
                console.log("submitList is :", submitList, submitList.length)
                console.log("imageList is :", imageList, imageList.length)
            })
            .then(res => {
                const db = qq.cloud.database()
                db.collection("postwall").add({
                    data: {
                        post_time: timestamp,
                        post_type: submit_data.post_type,
                        post_title: submit_data.post_title,
                        post_text: submit_data.post_text,
                        post_contact_qq: submit_data.post_contact_qq,
                        post_contact_wechat: submit_data.post_contact_wechat,
                        post_contact_tel: submit_data.post_contact_tel,
                        post_done: false,
                        post_data: new Date(),
                        image_list: submitList
                    }
                })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(res => {
                        console.error(res)
                    })
            })
            .then(res => {
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