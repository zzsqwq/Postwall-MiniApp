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
        allPostNum: [],
        readyToSend: new Array(100).fill(false),
        readyPictures: new Array(100).fill(""),
        selectCounter: new Array(10).fill(0),
        selectTag: new Array(10).fill(false).map(() => new Array(10).fill(false)) // true is selected
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    async loadDatabase() {
        let functionName = this.data.isAdmin === true ? "adminGetdb" : "Getdb"
        return await qq.cloud.callFunction({
            name: functionName,
            data: {
                userOpenid: this.data.userOpenid
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
                if(!tempList[i].post_reject) {
                    tempList[i].post_reject = false
                }
            }
            this.setData({
                postList: tempList
            })

            // Download image files in cloud
            let tasks = []
            qq.showLoading({
                title: "正在加载订单",
                mask: true
            })
            for (let i = 0; i < this.data.postList.length; i++) {
                let imageList = this.data.postList[i].image_list
                for (let j = 0; j < imageList.length; j++) {
                    let task = qq.cloud.downloadFile({
                        fileID: this.data.postList[i].image_list[j]
                    }).then(res => {
                        this.data.readyPictures[i * 10 + j] = res.tempFilePath;
                    })
                    tasks.push(task)
                }
            }
            return Promise.all(tasks).then(responses => {
                qq.hideLoading();
                qq.showToast({
                    title: '订单加载完毕',
                    icon: 'success',
                    duration: 500
                })
            }).catch(error => {
                console.log("Load orders error, maybe download files error, error msg: ", error)
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
            console.log("get openid res", res)
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
                    userOpenid: this.data.userOpenid
                }
            }).then(res => {
                let newLength = 0
                let oldLength = 0
                for(let i=0;i<res.result.data.length;i++) {
                    newLength += res.result.data[i].image_list.length
                }
                for(let i=0;i<this.data.allPostList.length;i++) {
                    oldLength += this.data.allPostList[i].image_list.length
                }
                if (!this.data.allPostList || newLength !== oldLength || res.result.data.length !== this.data.allPostList.length) {
                    isDelta = true
                }
            }).catch(error => {
                console.error("isPostList function error, ", error)
            })
        })
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
    async refresh() {
        this.getRejectArray()
        this.setData({
            readyToSend: new Array(100).fill(false),
            selectCounter: new Array(10).fill(0),
            selectTag: new Array(10).fill(false).map(() => new Array(10).fill(false))
        })
        await this.isPostListChanged().then( res => {
            if(res) {
                return this.loadPostList()
            }
        }).then( () => {
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
        //console.log(e.currentTarget)
        //this.convertAllCanvas()
        const id = e.currentTarget.id
        const list = this.data.postList

        console.log(e)
        if (list[e.target.dataset.id].post_reject && !list[e.target.dataset.id].notify_count) {
            list[e.target.dataset.id].notify_count = true
            console.log("list !")
            let reject_content = "您的订单由于涉及 " + list[e.target.dataset.id].post_reject + " 等原因被拒绝发送，请修改后重新提交。\n\n您是否需要删除该订单？您也可以通过左滑删除订单。"
            qq.showModal({
                title: "订单已被拒发",
                content: reject_content,
                cancelText: "否",
                confirmText: "是",
                success: res => {
                    if (res.confirm) {
                        const db = qq.cloud.database();
                        let productList = this.data.postList
                        // let productIndex = productList.findIndex(item => item.id === id)
                        let productIndex = e.target.dataset.id;
                        db.collection("postwall").doc(productList[productIndex]._id).update({
                            data: {
                                post_done: true,
                                post_user_done: true
                            }
                        }).then(res => {
                            if (productList[productIndex]) {
                                this.setXmove(productIndex, 0)
                            }
                            console.log(res);
                            qq.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 500
                            })
                            productList.splice(productIndex, 1)
                            this.setData({
                                postList: productList
                            })
                            this.setData({
                                allPostNum: this.data.allPostNum - 1
                            })
                        })
                    }
                }
            })
        } else {
            for (let i = 0, len = list.length; i < len; ++i) {
                if (list[i]._id === id) {
                    list[i].open = !list[i].open
                } else {
                    list[i].open = false
                }
            }
        }
        this.setData({
            postList: list
        })
        // qq.reportAnalytics('click_view_programmatically', {})
    }
    ,
    selectImg(e) {
        const index = parseInt(e.currentTarget.dataset.item)
        const id = parseInt(e.currentTarget.id)
        let this_data = this.data.selectTag
        let row_counter = this.data.selectCounter
        console.log("index", index)
        console.log("id", id)
        console.log("index+id", index * 10 + id)
        this_data[index][id] = !this_data[index][id]
        if (this_data[index][id] === true) {
            this.data.readyToSend[index * 10 + id] = true;
            row_counter[index]++;
        } else {
            this.data.readyToSend[index * 10 + id] = false;
            row_counter[index]--;
        }
        //console.log(this.data.readyToSend)
        this.setData({
            selectTag: this_data,
            selectCounter: row_counter
        })
    }
    ,
    toQzone() {
        let medias = []
        let now_index = 1
        let next_index = 0
        let post_detail = ""
        for (let i = 0; i < this.data.readyToSend.length; i++) {
            let orderIndex = parseInt(i / 10)
            if (this.data.readyToSend[i] === true) {
                medias.push({
                    type: 'photo',
                    path: this.data.readyPictures[i]
                })
                console.log(orderIndex, this.data.selectCounter[orderIndex])
            }
        }
        for (let i = 0; i < this.data.selectCounter.length; i++) {
            console.log(this.data.selectCounter[i])
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
            readyToSend: new Array(100).fill(false),
            selectCounter: new Array(10).fill(0),
            selectTag: new Array(10).fill(false).map(() => new Array(10).fill(false))
        })
        console.log(this.data.selectTag)
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
        let productList = this.data.postList
        // console.log(typeof productList)
        // console.log(productList)
        // console.log(xmove, "and ",productIndex)
        productList[productIndex].xmove = xmove
        this.setData({
            postList: productList
        })
        // console.log(this.data.postList)
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
        let productList = this.data.postList
        // let productIndex = productList.findIndex(item => item.id === id)
        let productIndex = id;
        const db = qq.cloud.database();
        if ((this.data.isAdmin === true) && (productList[productIndex].post_userOpenid !== this.data.userOpenid)) {
            db.collection("postwall").doc(productList[productIndex]._id).update({
                data: {
                    post_done: true
                }
            }).then(res => {
                console.log(res);
                qq.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 500
                })
            })
        } else {
            db.collection("postwall").doc(productList[productIndex]._id).update({
                data: {
                    post_done: true,
                    post_user_done: true
                }
            }).then(res => {
                if (productList[productIndex]) {
                    this.setXmove(productIndex, 0)
                }
                console.log(res);
                qq.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 500
                })
            })
        }
        productList.splice(productIndex, 1)
        this.data.readyToSend.splice(productIndex * 10, 10)
        this.data.readyPictures.splice(productIndex * 10, 10)
        this.data.selectCounter.splice(productIndex, 1);
        this.data.selectTag.splice(productIndex, 1)
        this.setData({
            postList: productList,
            selectCounter: this.data.selectCounter,
            readyToSend: this.data.readyToSend,
            readyPicutures: this.data.readyPictures,
            selectTag: this.data.selectTag
        })
        if (productList[productIndex]) {
            this.setXmove(productIndex, 0)
        }
        this.setData({
            allPostNum: this.data.allPostNum - 1
        })

    }
    ,

    /**
     * slide-delete 删除产品
     */
    handleSlideDelete({detail: {id}}) {
        let slideProductList = this.data.slideProductList
        let productIndex = slideProductList.findIndex(item => item.id === id)

        slideProductList.splice(productIndex, 1)

        this.setData({
            slideProductList
        })
    }
    ,

    handleRejectProduct: function ({currentTarget: {dataset: {id}}}) {
        let productList = this.data.postList
        // let productIndex = productList.findIndex(item => item.id === id)
        let productIndex = id;

        qq.showActionSheet({
            itemList: this.data.rejectReasons,
            success: res => {
                console.log(res)
                const db = qq.cloud.database();
                if ((this.data.isAdmin === true) && (productList[productIndex].post_userOpenid !== this.data.userOpenid)) {
                    db.collection("postwall").doc(productList[productIndex]._id).update({
                        data: {
                            post_done: true,
                            post_reject: this.data.rejectReasons[res.tapIndex]
                        }
                    }).then(res => {
                        console.log(res);
                        qq.showToast({
                            title: '拒发成功',
                            icon: 'success',
                            duration: 500
                        })
                    })
                } else {
                    db.collection("postwall").doc(productList[productIndex]._id).update({
                        data: {
                            post_done: true,
                            post_user_done: true
                        }
                    }).then(res => {
                        if (productList[productIndex]) {
                            this.setXmove(productIndex, 0)
                        }
                        console.log(res);
                        qq.showToast({
                            title: '拒发成功',
                            icon: 'success',
                            duration: 500
                        })
                    })
                }
                productList.splice(productIndex, 1)
                this.data.readyToSend.splice(productIndex * 10, 10)
                this.data.readyPictures.splice(productIndex * 10, 10)
                this.data.selectCounter.splice(productIndex, 1);
                this.data.selectTag.splice(productIndex, 1)
                this.setData({
                    postList: productList,
                    selectCounter: this.data.selectCounter,
                    readyToSend: this.data.readyToSend,
                    readyPicutures: this.data.readyPictures,
                    selectTag: this.data.selectTag
                })
                if (productList[productIndex]) {
                    this.setXmove(productIndex, 0)
                }
                this.setData({
                    allPostNum: this.data.allPostNum - 1
                })
            }
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
            console.log(res)
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
                if (!this.data.readyToSend[i * 10 + j]) {
                    this.data.readyToSend[i * 10 + j] = true;
                    this.data.selectCounter[i]++;
                }
            }
        }
        this.toQzone();
    }
    ,

    deleteAll() {
        let productList = this.data.postList
        const isAdmin = this.data.isAdmin
        const userOpenid = this.data.userOpenid
        const db = qq.cloud.database()

        let deleteTasks = []
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i]
            if (isAdmin && product.post_userOpenid !== userOpenid) {
                let task = db.collection("postwall").doc(product._id).update({
                    data: {
                        post_done: true
                    }
                }).then(res => {
                    productList.splice(i, 1)
                }).catch(error => {
                    console.error(error)
                })
                deleteTasks.push(task)
            } else {
                let task = db.collection("postwall").doc(product._id).update({
                    data: {
                        post_done: true,
                        post_user_done: true
                    }
                }).then(res => {
                    productList.splice(i, 1)
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
            postList: productList,
        })
        this.refresh();
    }
    ,
})
