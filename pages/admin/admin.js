//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        isAdmin: "",
        userOpenid: "",
        hasUserInfo: false,
        canIUse: qq.canIUse('button.open-type.getUserInfo'),
        rejectReasons: ["政治", "色情", "侮辱他人", "暴力、辱骂他人", "未经允许使用他人照片", "重复"],
        postList: [],
        allPostList: [],
        allPostNum: 0,
        photoArray: new Array(10).fill("").map(() => new Array(10).fill("")),
        selectCounter: new Array(10).fill(0),
        isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false)) // true is selected
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    async loadDatabase() {
        let functionName = this.data.isAdmin === true ? "adminGetdb" : "Getdb"
        console.log("loadDatabase functionName is ", functionName)
        return await qq.cloud.callFunction({
            name: functionName,
            data: {
                user_openid: this.data.userOpenid
            }
        }).then(res => {
            this.setData({
                allPostList: res.result.data,
                allPostNum: res.result.data.length,
            })
        })
    },
    async loadPostList() {
        return await this.loadDatabase().then(() => {
            // Set postList
            let tempList = this.data.allPostList.slice(0, 9).reverse()
            for (let i = 0; i < tempList.length; i++) {
                tempList[i].open = false
                if (!tempList[i].post_reject) {
                    tempList[i].post_reject = false
                }
            }
            this.setData({
                postList: tempList
            })

            // Download image files in cloud
            let tasks = []
            for (let i = 0; i < this.data.postList.length; i++) {
                let imageList = this.data.postList[i].image_list
                for (let j = 0; j < imageList.length; j++) {
                    let task = qq.cloud.downloadFile({
                        fileID: this.data.postList[i].image_list[j]
                    }).then(res => {
                        this.data.photoArray[i][j] = res.tempFilePath;
                    })
                    tasks.push(task)
                }
            }
            return Promise.all(tasks).then(responses => {
                qq.hideLoading();
            }).catch(error => {
                console.log("Load orders error, maybe download files error, error msg: ", error)
                qq.hideLoading();
                this.refresh()
            })

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
    async isPostListChanged() {
        let isDelta = false
        // await to make sure update isDelta
        await this.updateUserStatus().then(res => {
            let functionName = this.data.isAdmin === true ? "adminGetdb" : "Getdb";
            return qq.cloud.callFunction({
                name: functionName,
                data: {
                    user_openid: this.data.userOpenid
                }
            }).then(res => {
                let newLength = 0
                let oldLength = 0
                for (let i = 0; i < res.result.data.length; i++) {
                    newLength += res.result.data[i].image_list.length
                }
                for (let i = 0; i < this.data.allPostList.length; i++) {
                    oldLength += this.data.allPostList[i].image_list.length
                }
                if (!this.data.allPostList || newLength !== oldLength || res.result.data.length !== this.data.allPostList.length) {
                    isDelta = true
                }
            }).catch(error => {
                console.error("isPostList function error, ", error)
            })
        })
        console.log("isDelta is ", isDelta)
        return isDelta
    },
    onLoad() {
        this.getRejectArray()
    },
    onShow() {
        // Hide red dot on admin page
        qq.hideTabBarRedDot({
                index: 1
            }
        )
        // If allPostList has changed, refresh
        this.isPostListChanged().then(res => {
            console.log("Post list changed res", res)
            if (res) {
                this.refresh()
            }
        }).catch(error => {
            console.error("onShow function check refresh error,", error)
        })
    },
    refresh() {
        this.getRejectArray()
        this.setData({
            selectCounter: new Array(10).fill(0),
            isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false))
        })
        qq.showLoading({
            title: "正在加载订单",
            mask: true
        })
        this.loadPostList().then(() => {
            qq.stopPullDownRefresh({
                success: res => {
                    qq.showToast({
                        title: '刷新成功',
                        icon: 'success',
                        duration: 500
                    })
                }
            })
        }).catch(error => {
            console.log("Refresh error, ", error)
            qq.stopPullDownRefresh({
                success: res => {
                    qq.showToast({
                        title: '刷新异常',
                        icon: 'none',
                        duration: 500
                    })
                }
            })
        })
    }
    ,
    onPullDownRefresh(options) {
        this.refresh();
    }
    ,
    onReady(options) {
    }
    ,
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
    ,
    previewAvatar(e) {
        const current = e.target.dataset.src
        userinfo = app.globalData.userInfo
        console.log(e)
        qq.previewImage({
            urls: [userinfo.avatarUrl]
        })
    }
    ,
    previewImg(e) {
        const id = e.target.dataset.id;
        const index = e.target.dataset.index;
        qq.previewImage({
            current: this.data.postList[id].image_list[index],
            urls: this.data.postList[id].image_list
        })
    }
    ,
    kindToggle(e) {
        const postId = e.currentTarget.id;
        const id = e.target.dataset.id
        const postList = this.data.postList
        const post = postList[id]
        if (post.post_reject && !post.notify_count) {
            post.notify_count = true
            let rejectContent = "您的订单由于涉及 " + post.post_reject + " 等原因被拒绝发送，请修改后重新提交。\n\n您是否需要删除该订单？您也可以通过左滑删除订单。"
            qq.showModal({
                title: "订单已被拒发",
                content: rejectContent,
                cancelText: "否",
                confirmText: "是",
                success: res => {
                    if (res.confirm) {
                        this.deleteOnePost(id)
                    }
                }
            })
        } else {
            for (let i = 0, len = postList.length; i < len; ++i) {
                if (postList[i]._id === postId) {
                    postList[i].open = !postList[i].open
                } else {
                    postList[i].open = false
                }
            }
        }
        this.setData({
            postList: postList
        })
    }
    ,
    selectImg(e) {
        const index = e.currentTarget.dataset.item
        const id = e.currentTarget.id
        let isSelected = this.data.isSelected
        let selectCounter = this.data.selectCounter
        isSelected[index][id] = !isSelected[index][id]
        if (isSelected[index][id] === true) {
            selectCounter[index]++;
        } else {
            selectCounter[index]--;
        }
        this.setData({
            isSelected: isSelected,
            selectCounter: selectCounter
        })
    }
    ,
    toQzone() {
        let medias = []
        const isSelected = this.data.isSelected
        let now_index = 1
        let next_index = 0
        let post_detail = ""
        for (let i = 0; i < isSelected.length; i++) {
            for (let j = 0; j < isSelected[i].length; j++) {
                if (isSelected[i][j]) {
                    medias.push({
                        type: 'photo',
                        path: this.data.photoArray[i][j]
                    })
                }
            }
        }
        for (let i = 0; i < this.data.selectCounter.length; i++) {
            if (this.data.selectCounter[i] !== 0) {
                next_index = now_index + this.data.selectCounter[i] - 1;
                if (this.data.selectCounter[i] !== 1) {
                    post_detail += "P" + now_index + "-" + next_index + ":[" + this.data.postList[i].post_type + "]" + this.data.postList[i].post_title + "\n";
                    now_index = next_index + 1;
                } else {
                    post_detail += "P" + now_index + ":[" + this.data.postList[i].post_type + "]" + this.data.postList[i].post_title + "\n";
                    now_index = next_index + 1;
                }
            }
        }
        qq.openQzonePublish({
            footnote: '胶州实高自助贴贴墙',
            path: 'pages/index/index',
            text: post_detail,
            media: medias
        })

        this.setData({
            selectCounter: new Array(10).fill(0),
            isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false))
        })
    }
    ,

    /**
     * 显示删除按钮
     */
    showDeleteButton: function (e) {
        let productIndex = e.currentTarget.dataset.productindex
        this.setXmove(productIndex, -130)
    }
    ,

    /**
     * 隐藏删除按钮
     */
    hideDeleteButton: function (e) {
        let productIndex = e.currentTarget.dataset.productindex

        this.setXmove(productIndex, 0)
    }
    ,

    /**
     * 设置movable-view位移
     */
    setXmove: function (productIndex, xmove) {
        let postList = this.data.postList
        postList[productIndex].xmove = xmove
        this.setData({
            postList: postList
        })
    }
    ,

    /**
     * 处理movable-view移动事件
     */
    handleMovableChange: function (e) {
        if (e.detail.source === 'friction') {
            if (e.detail.x < -60) {
                this.showDeleteButton(e)
            } else {
                this.hideDeleteButton(e)
            }
        } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
            this.hideDeleteButton(e)
        }
    }
    ,

    /**
     * 处理touchstart事件
     */
    handleTouchStart(e) {
        this.startX = e.touches[0].pageX
    }
    ,

    /**
     * 处理touchend事件
     */
    handleTouchEnd(e) {
        if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -60) {
            this.showDeleteButton(e)
        } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 60) {
            this.showDeleteButton(e)
        } else {
            this.hideDeleteButton(e)
        }
    }
    ,

    /**
     * 删除产品
     */
    handleDeleteProduct: async function ({currentTarget: {dataset: {id}}}) {
        this.deleteOnePost(id)
    }
    ,
    handleRejectProduct: function ({currentTarget: {dataset: {id}}}) {
        this.rejectOnePost(id)
    }
    ,
    // Update database when delete a post
    deleteOnePost(id) {
        const db = qq.cloud.database()
        const isAdmin = this.data.isAdmin
        const userOpenid = this.data.userOpenid
        let post = this.data.postList[id]
        // Admin delete is different
        if (isAdmin === true && post.post_user_openid !== userOpenid) {
            db.collection("postwall").doc(post._id).update({
                data: {
                    post_done: true
                }
            }).then(res => {
                qq.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 500
                })
            })
        } else {
            db.collection("postwall").doc(post._id).update({
                data: {
                    post_done: true,
                    post_user_done: true
                }
            }).then(res => {
                qq.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 500
                })
            })
        }
        this.deleteAndUpdatePage(id)
    },
    rejectOnePost(id) {
        const isAdmin = this.data.isAdmin
        let post = this.data.postList[id]
        qq.showActionSheet({
            itemList: this.data.rejectReasons,
            success: res => {
                const db = qq.cloud.database();
                if (isAdmin === true) {
                    db.collection("postwall").doc(post._id).update({
                        data: {
                            post_done: true,
                            post_reject: this.data.rejectReasons[res.tapIndex]
                        }
                    }).then(res => {
                        qq.showToast({
                            title: '拒发成功',
                            icon: 'success',
                            duration: 500
                        })
                    })
                }
                this.deleteAndUpdatePage(id)
            }
        })

    },
    deleteAndUpdatePage(id) {
        let postList = this.data.postList
        postList.splice(id, 1)
        this.data.photoArray.splice(id, 1)
        this.data.selectCounter.splice(id, 1);
        this.data.isSelected.splice(id, 1)
        this.setData({
            postList: postList,
            selectCounter: this.data.selectCounter,
            photoArray: this.data.photoArray,
            isSelected: this.data.isSelected
        })
        this.setData({
            allPostNum: this.data.allPostNum - 1
        })
    }
    ,

    navigate_to_recent() {
        qq.navigateTo({
            url: "/pages/recently/recently"
        })
    }
    ,

    getRejectArray() {
        qq.cloud.callFunction({
            name: "getTypeArray",
            data: {
                reject: true
            }
        }).then(res => {
            this.setData({
                rejectReasons: res.result.data[0].rejectlist
            })
        })
    }
    ,
    publishAll() {
        for (let i = 0; i < this.data.postList.length; i++) {
            let data_ = this.data.postList[i];
            for (let j = 0; j < data_.image_list.length; j++) {
                if (!this.data.isSelected[i][j]) {
                    this.data.isSelected[i][j] = true;
                    this.data.selectCounter[i]++;
                }
            }
        }
        this.toQzone();
    }
    ,

    deleteAll() {
        let postList = this.data.postList
        const isAdmin = this.data.isAdmin
        const userOpenid = this.data.userOpenid
        const db = qq.cloud.database()

        let deleteTasks = []
        for (let i = 0; i < postList.length; i++) {
            let post = postList[i]
            if (isAdmin && post.post_user_openid !== userOpenid) {
                let task = db.collection("postwall").doc(post._id).update({
                    data: {
                        post_done: true
                    }
                }).then(res => {
                    postList.splice(i, 1)
                }).catch(error => {
                    console.error(error)
                })
                deleteTasks.push(task)
            } else {
                let task = db.collection("postwall").doc(post._id).update({
                    data: {
                        post_done: true,
                        post_user_done: true
                    }
                }).then(res => {
                    postList.splice(i, 1)
                }).catch(error => {
                    console.error(error)
                })
                deleteTasks.push(task)
            }
        }
        Promise.all(deleteTasks).then(responses => {
            console.log("Delete all products.", responses)
            qq.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 500
            })
        }).catch(error => {
            console.error("Delete product error!", error)
            qq.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 500
            })
        })
        this.setData({
            postList: postList,
        })
        this.refresh();
    }
    ,
})

module.exports = {


}