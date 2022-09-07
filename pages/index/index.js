// index.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

const app = getApp()
Page({
    data: {
        imageList: [],
        isAdmin: "",
        userOpenid: "",
        postTypeArray: ["提问", "吐槽", "表白", "寻物", "寻人"],
        chosenTypeIndex: 0,
        lastSubmitTime: 0,
        submitList: [],
        post_type_value: "提问",
        post_type_blur_value: "提问",
        post_title_value: "",
        post_title_blur_value: "",
        post_text_value: "",
        post_text_blur_value: "",
        contact_qq_value: "",
        contact_qq_blur_value: "",
        contact_wechat_value: "",
        contact_wechat_blur_value: "",
        contact_tel_value: "",
        contact_tel_blur_value: "",
    },
    getTypeArray() {
        qq.cloud.callFunction({
            name: "getTypeArray",
        }).then(res => {
            this.setData({
                postTypeArray: res.result.data[0].typelist
            })
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            chosenTypeIndex: e.detail.value,
            post_type_value: this.data.postTypeArray[e.detail.value],
            post_type_blur_value: this.data.postTypeArray[e.detail.value]
        })
    },
    // Async to update userOpenid and isAdmin info
    async updateUserStatus() {
        // 多层 Promise 最终只 await 最外层的 Promise 即可
        return await qq.cloud.callFunction({
            name: 'getOpenid',
        }).then(res => {
            console.log("Get openid res", res)
            this.data.userOpenid = res.result.openid
            const db = qq.cloud.database()
            // return important!!!!
            return db.collection("adminList").get().then(res => {
                    let adminList = res.data
                    console.log("adminList is ", adminList)
                    this.data.isAdmin = false
                    for (let i = 0; i < adminList.length; i++) {
                        if (adminList[i].open_id === this.data.userOpenid) {
                            this.data.isAdmin = true
                            break;
                        }
                    }
                    console.log("The user isAdmin is ", this.data.isAdmin)
                    console.log("The user openid is ", this.data.userOpenid)

                    this.setData({
                        isAdmin: this.data.isAdmin,
                        userOpenid: this.data.userOpenid
                    })
                }
            )
        }).catch(error => {
            console.error("updateUserStatus error, ", error)
        })
    },
    async onLoad(options) {
        const updateManager = qq.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log("Has update ", res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            qq.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用加载？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            console.error("New version update failed.");
            qq.showToast({
                title: '新版本更新失败',
                icon: 'none',
                duration: 500
            })
        })


        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })

        this.getTypeArray()

        await this.updateUserStatus()

        let fs = qq.getFileSystemManager();
        fs.readdir({
            dirPath: `${qq.env.USER_DATA_PATH}`,
            success: (res) => {
                res.files.forEach((file) => {
                    // console.log(val)
                    if (file.substr(file.length - 3) === 'png') {
                        fs.unlink({
                            filePath: qq.env.USER_DATA_PATH + '/' + file,
                            success: (res) => {
                                const logger = qq.getRealtimeLogManager()
                                logger.info("removed ", file)
                            },
                            fail: (res) => {
                                console.error(res)
                            }

                        })
                    }
                })
            }
        })
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
    refresh() {
        const ImageList = this.data.imageList
        const submitList = this.data.submitList
        ImageList.splice(0, ImageList.length)
        submitList.splice(0, submitList.length)
        this.getTypeArray()
        this.setData({
            post_type_value: "提问",
            post_type_blur_value: "提问",
            post_title_value: "",
            post_title_blur_value: "",
            post_text_value: "",
            post_text_blur_value: "",
            contact_qq_value: "",
            contact_qq_blur_value: "",
            contact_wechat_value: "",
            contact_wechat_blur_value: "",
            contact_tel_value: "",
            contact_tel_blur_value: "",
            imageList: ImageList,
            submitList: submitList
        })
    },
    onPullDownRefresh() {
        this.refresh()
        qq.stopPullDownRefresh({
            success: res => {
                qq.showToast({
                    title: '页面已刷新',
                    icon: 'success',
                    duration: 500
                })
            }
        })
    },
    async uploadFilesToCloud() {
        const timestamp = new Date().getTime() / 1000
        let imageList = this.data.imageList
        let submitList = this.data.submitList
        let uploadTasks = []
        for (let i = 0; i < imageList.length; i++) {
            let task = qq.cloud.uploadFile({
                cloudPath: timestamp + '/' + i + imageList[i].slice(-4),
                filePath: imageList[i]
            }).then(res => {
                console.log(res.fileID)
                submitList.push(res.fileID)
            }).catch(res => {
                console.error(res)
            })
            uploadTasks.push(task)
        }
        return await Promise.all(uploadTasks).then(responses => {
            console.log("uploadTasks responses is ", responses)
        })

    },
    /**
     * @brief submit a post
     * @param event the event
     * @param action 0 is formsubmit, 1 is blur submit
     */
    submitPost(event, action) {
        let postData = ""
        if (action === 0) {
            postData = event.detail.value
        }
        let postType = ""
        let postTitle = ""
        let postText = ""
        let postContactQQ = ""
        let postContactWechat = ""
        let postContactTel = ""
        let submitList = this.data.submitList
        switch (action) {
            // formsubmit
            case 0: {
                postType = this.data.postTypeArray[postData.post_type]
                postTitle = postData.post_title
                postText = postData.post_text
                postContactQQ = postData.post_contact_qq
                postContactWechat = postData.post_contact_wechat
                postContactTel = postData.post_contact_tel
                break;
            }
            // blur submit
            case 1: {
                postType = this.data.post_type_blur_value
                postTitle = this.data.post_title_blur_value
                postText = this.data.post_text_blur_value
                postContactQQ = this.data.contact_qq_blur_value
                postContactWechat = this.data.contact_wechat_blur_value
                postContactTel = this.data.contact_tel_blur_value
                break;
            }
            default: {
                console.error("unknown action")
                break;
            }

        }
        if (!postType || !postTitle || !postText) {
            let content = "您的"
            if (!postType) {
                content = content + "投稿类型" + "、"
            }
            if (!postTitle) {
                content = content + "投稿标题" + "、"
            }
            if (!postText) {
                content = content + "投稿内容" + "、"
            }
            content = content.slice(0, -1) + "未填写"
            qq.showModal({
                title: '投稿内容不全!',
                content: content,
                showCancel: false,
            })
            return;
        }
        const timestamp = new Date().getTime() / 1000
        qq.showLoading({
            title: "订单投递中，请稍作等待",
            mask: true
        })
        this.uploadFilesToCloud().then(res => {
            const db = qq.cloud.database()
            return db.collection("postwall").add({
                data: {
                    post_time: timestamp,
                    post_type: postType,
                    post_title: postTitle,
                    post_text: postText,
                    post_contact_qq: postContactQQ,
                    post_contact_wechat: postContactWechat,
                    post_contact_tel: postContactTel,
                    post_user_openid: this.data.userOpenid,
                    post_user_done: false,
                    post_done: false,
                    post_date: new Date(),
                    image_list: submitList
                }
            })
        }).then(res => {
            submitList.slice(0, submitList.length)
            qq.hideLoading();
            qq.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 500
            })
            qq.showTabBarRedDot({
                index: 1,
            })
        })
            .catch(error => console.error(error))

        let submitEndTime = new Date().getTime()
        this.setData({
            lastSubmitTime: submitEndTime / 1000
        })
    },
    submitChecker(event, action) {
        let lastSubmitTime = this.data.lastSubmitTime
        let submitBeginTime = new Date().getTime()/1000

        // 小于 20s
        let duration = Math.ceil(Math.abs(lastSubmitTime - submitBeginTime))
        let timeContent = "请等待 " + (20 - duration) + "s 后才可继续提交"
        if (lastSubmitTime !== 0 && duration < 20) {
            qq.showModal({
                title: '您的提交频率过快',
                content: timeContent,
                showCancel: false,
            })
            return;
        }

        qq.showModal({
            title: "投稿确认提示",
            content: "请确认投稿内容中不包含暴力、谩骂、引战、色情、政治等信息。\n\n如内容涉及他/她人个人信息、肖像等请征得对方同意。\n\n可在查看订单页面删除已发订单。",
            confirmText: "是",
            confirmColor: "#00CAFC",
            cancelText: "否",
            cancelColor: "#FF0000",
            success: (res) => {
                if (res.confirm) {
                    this.submitPost(event, action)
                }
            }
        })
    },
    formSubmit(e) {
        this.submitChecker(e, 0)
    },
    bindSubmit(e) {
        this.submitChecker(e, 1)
    },
    formReset() {
        const ImageList = this.data.imageList
        const submitList = this.data.submitList

        ImageList.splice(0, ImageList.length)
        submitList.splice(0, submitList.length)

        this.setData({
            imageList: ImageList,
            submitList: submitList
        })
    },
    bindReset() {
        const ImageList = this.data.imageList
        const submitList = this.data.submitList
        ImageList.splice(0, ImageList.length)
        submitList.splice(0, submitList.length)
        this.setData({
            post_type_value: "提问",
            post_type_blur_value: "提问",
            post_title_value: "",
            post_title_blur_value: "",
            post_text_value: "",
            post_text_blur_value: "",
            contact_qq_value: "",
            contact_qq_blur_value: "",
            contact_wechat_value: "",
            contact_wechat_blur_value: "",
            contact_tel_value: "",
            contact_tel_blur_value: "",
            imageList: ImageList,
            submitList: submitList
        })
    },
    chooseImage: function () {
        let imageList = this.data.imageList
        qq.chooseImage({
            sourceType: ['album', 'camera'],
            sizeType: ['original', 'compressed'],
            count: 9 - imageList.length,
            success: res => {
                console.log(res)
                imageList = imageList.concat(res.tempFilePaths)
                this.setData({
                    imageList: imageList
                })
            }
        })
    },
    previewImage(e) {
        const current = e.target.dataset.index
        qq.previewImage({
            current: this.data.imageList[current],
            urls: this.data.imageList
        })
    },

    deleteImage(e) {
        let imageList = this.data.imageList
        let index = e.target.dataset.index
        console.log("Delete image index is ", index)
        imageList.splice(index, 1)
        this.setData({
            imageList: imageList
        })
    },

    input_title_blur(e) {
        this.setData({
            post_title_blur_value: e.detail.value
        })
    },

    input_text_blur(e) {
        this.setData({
            post_text_blur_value: e.detail.value
        })
    },

    contact_qq_blur(e) {
        this.setData({
            contact_qq_blur_value: e.detail.value
        })
    },

    contact_wechat_blur(e) {
        this.setData({
            contact_wechat_blur_value: e.detail.value
        })
    },

    contact_tel_blur(e) {
        this.setData({
            contact_tel_blur_value: e.detail.value
        })
    }
})