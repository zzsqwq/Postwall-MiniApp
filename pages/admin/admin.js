//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        is_admin: "",
        user_openid: "",
        hasUserInfo: false,
        canIUse: qq.canIUse('button.open-type.getUserInfo'),
        tmp_img: "",
        convert_img: [],
        reject_array: ["政治", "色情", "侮辱他人", "暴力、辱骂他人", "未经允许使用他人照片", "重复"],
        datalist: [],
        total_data_list: [],
        total_num: [],
        orderObjects: [],
        base64str: " ",
        readytosend: new Array(100).fill(false),
        readyPictures: new Array(100).fill(" "),
        rowscount: new Array(10).fill(0),
        chooseornot: []
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    loadDataBase: function () {
        const db = qq.cloud.database()
        let functionName = this.data.is_admin === true ? "adminGetdb" : "Getdb"
        let getDatabase = async () => {
            return await qq.cloud.callFunction({
                name: functionName,
                data: {
                    user_openid: app.data.user_openid
                }
            }).then(res => {
                this.setData({
                    total_data_list: res.result.data,
                    total_num: res.result.data.length,
                    datalist: res.result.data.slice(0, 9).reverse()
                })
                // console.log("datalist:", this.data.datalist)
                let tempList = this.data.datalist
                for (let i = 0; i < this.data.datalist.length; i++) {
                    tempList[i].open = false
                }
                this.setData({
                    datalist: tempList
                })
            }).then(res => console.log(this.data.datalist))
        }
        getDatabase()
            .then(async res => {
                    let tasks = []
                    qq.showLoading({
                        title: "正在加载订单",
                        mask: true
                    })
                    for (let i = 0; i < this.data.datalist.length; i++) {
                        let imageList = this.data.datalist[i].image_list
                        for (let j = 0; j < imageList.length; j++) {
                            let task = qq.cloud.downloadFile({
                                fileID: this.data.datalist[i].image_list[j]
                            }).then(res => {
                                this.data.readyPictures[i * 10 + j] = res.tempFilePath;
                            })
                            tasks.push(task)
                        }
                    }
                    Promise.all(tasks).then(responses => {
                        qq.hideLoading();
                        qq.showToast({
                            title: '订单加载完毕',
                            icon: 'success',
                            duration: 1000
                        })
                    }).catch(error => {
                        console.log("Load orders error, maybe download files error, error msg: ", error)
                        this.Refresh()
                    })
                }
            )
    },
    onLoad: function () {

        this.getRejectArray();

        // init chooseornot
        let a = this.data.chooseornot
        for (let i = 0; i < 10; i++) {
            let b = [];
            for (let j = 0; j < 10; j++) {
                b[j] = false
            }
            a[i] = b;
        }
        this.setData({
            chooseornot: a
        })

        qq.cloud.init({
            env: 'postwall-4gy7eykl559a475a',
            traceUser: true
        })

        this.setData({
            is_admin: app.data.is_admin
        })

        app.userAdminReadyCallback = () => {
            this.setData({
                is_admin: app.data.is_admin
            })
        }

        app.userOpenidReadyCallback = () => {
            this.setData({
                user_openid: app.data.user_openid
            })
        }

    }

    ,
    onShow: function () {
        const db = qq.cloud.database();
        qq.hideTabBarRedDot({
                index: 1
            }
        )
        let function_name = this.data.is_admin === true ? "adminGetdb" : "Getdb";
        let if_delta = false;
        let getDatabase = async () => {
            return await qq.cloud.callFunction({
                name: function_name,
                data: {
                    user_openid: app.data.user_openid
                }
            }).then(res => {
                // console.log("total_data_list is :",this.data.total_data_list)
                // console.log("res result length",res.result.data.length)
                if (!this.data.total_data_list || res.result.data.length !== this.data.total_data_list.length) {
                    if_delta = true;
                }
            })
        }

        getDatabase().then(res => {
                console.log("if_delta is :", if_delta)
                if (if_delta) {
                    this.Refresh()
                }
            }
        )
    }
    ,
    Refresh() {
        app.getUserOpenid()

        this.setData({
            is_admin: app.data.is_admin
        })

        this.getRejectArray();

        this.loadDataBase()
        this.setData({
            readytosend: new Array(100).fill(false),
            rowscount: new Array(10).fill(0),
        })

        a = this.data.chooseornot
        for (var i = 0; i < 10; i++) {
            var b = []
            for (var j = 0; j < 10; j++) {
                b[j] = false
            }
            a[i] = b
        }
        this.setData({
            chooseornot: a
        })

        qq.stopPullDownRefresh({
            success: res => {
                qq.showToast({
                    title: '刷新成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    }
    ,
    onPullDownRefresh(options) {
        this.Refresh();
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
            current: userinfo.avatarUrl,
            urls: [userinfo.avatarUrl]
        })
    }
    ,
    previewImg(e) {
        const img_id = e.target.dataset.id;
        const img_index = e.target.dataset.index;
        console.log(e);
        qq.previewImage({
            urls: [this.data.datalist[img_id].image_list[img_index]]
        })
    }
    ,
    kindToggle(e) {
        //console.log(e.currentTarget)
        //this.convertAllCanvas()
        const id = e.currentTarget.id
        const list = this.data.datalist

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
                        let productList = this.data.datalist
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
                                datalist: productList
                            })
                            this.setData({
                                total_num: this.data.total_num - 1
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
            datalist: list
        })
        // qq.reportAnalytics('click_view_programmatically', {})
    }
    ,
    selectImg(e) {
        const index = parseInt(e.currentTarget.dataset.item)
        const id = parseInt(e.currentTarget.id)
        let this_data = this.data.chooseornot
        let row_counter = this.data.rowscount
        console.log("index", index)
        console.log("id", id)
        console.log("index+id", index * 10 + id)
        this_data[index][id] = !this_data[index][id]
        if (this_data[index][id] === true) {
            this.data.readytosend[index * 10 + id] = true;
            row_counter[index]++;
        } else {
            this.data.readytosend[index * 10 + id] = false;
            row_counter[index]--;
        }
        //console.log(this.data.readytosend)
        this.setData({
            chooseornot: this_data,
            rowscount: row_counter
        })
    }
    ,
    toQzone() {
        let medias = []
        let now_index = 1
        let next_index = 0
        let post_detail = ""
        for (let i = 0; i < this.data.readytosend.length; i++) {
            let orderIndex = parseInt(i/10)
            if (this.data.readytosend[i] === true) {
                medias.push({
                    type: 'photo',
                    path: this.data.readyPictures[i]
                })
                console.log(orderIndex, this.data.rowscount[orderIndex])
            }
        }
        for (let i = 0; i < this.data.rowscount.length; i++) {
            console.log(this.data.rowscount[i])
            if (this.data.rowscount[i] !== 0) {
                next_index = now_index + this.data.rowscount[i] - 1;
                if (this.data.rowscount[i] !== 1) {
                    post_detail += "P" + now_index + "-" + next_index + ":[" + this.data.datalist[i].post_type + "]" + this.data.datalist[i].post_title + "\n";
                    now_index = next_index + 1;
                } else {
                    post_detail += "P" + now_index + ":[" + this.data.datalist[i].post_type + "]" + this.data.datalist[i].post_title + "\n";
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

        a = new Array(10).fill(false).map( () => new Array(10).fill(false))
        this.setData({
            readytosend: new Array(100).fill(false),
            rowscount: new Array(10).fill(0),
            chooseornot: a
        })
        console.log(this.data.chooseornot)
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
        let productList = this.data.datalist
        // console.log(typeof productList)
        // console.log(productList)
        // console.log(xmove, "and ",productIndex)
        productList[productIndex].xmove = xmove
        this.setData({
            datalist: productList
        })
        // console.log(this.data.datalist)
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
        let productList = this.data.datalist
        // let productIndex = productList.findIndex(item => item.id === id)
        let productIndex = id;
        const db = qq.cloud.database();
        if ((this.data.is_admin === true) && (productList[productIndex].post_user_openid !== app.data.user_openid)) {
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
        this.data.readytosend.splice(productIndex*10, 10)
        this.data.readyPictures.splice(productIndex*10, 10)
        this.data.rowscount.splice(productIndex, 1);
        this.data.chooseornot.splice(productIndex, 1)
        this.setData({
            datalist: productList,
            rowscount: this.data.rowscount,
            readytosend: this.data.readytosend,
            readyPicutures: this.data.readyPictures,
            chooseornot: this.data.chooseornot
        })
        if (productList[productIndex]) {
            this.setXmove(productIndex, 0)
        }
        this.setData({
            total_num: this.data.total_num - 1
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
        let productList = this.data.datalist
        // let productIndex = productList.findIndex(item => item.id === id)
        let productIndex = id;

        qq.showActionSheet({
            itemList: this.data.reject_array,
            success: res => {
                console.log(res)
                const db = qq.cloud.database();
                if ((this.data.is_admin === true) && (productList[productIndex].post_user_openid !== app.data.user_openid)) {
                    db.collection("postwall").doc(productList[productIndex]._id).update({
                        data: {
                            post_done: true,
                            post_reject: this.data.reject_array[res.tapIndex]
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
                this.data.readytosend.splice(productIndex*10, 10)
                this.data.readyPictures.splice(productIndex*10, 10)
                this.data.rowscount.splice(productIndex, 1);
                this.data.chooseornot.splice(productIndex, 1)
                this.setData({
                    datalist: productList,
                    rowscount: this.data.rowscount,
                    readytosend: this.data.readytosend,
                    readyPicutures: this.data.readyPictures,
                    chooseornot: this.data.chooseornot
                })
                if (productList[productIndex]) {
                    this.setXmove(productIndex, 0)
                }
                this.setData({
                    total_num: this.data.total_num - 1
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
                reject_array: res.result.data[0].rejectlist
            })
        })
    }
    ,

    publishAll() {
        for (let i = 0; i < this.data.datalist.length; i++) {
            let data_ = this.data.datalist[i];
            for (let j = 0; j < data_.image_list.length; j++) {
                if(!this.data.readytosend[i*10+j]) {
                    this.data.readytosend[i * 10 + j] = true;
                    this.data.rowscount[i]++;
                }
            }
        }
        this.toQzone();
    }
    ,

    deleteAll() {
        let productList = this.data.datalist
        const isAdmin = this.data.is_admin
        const userOpenid = app.data.user_openid
        const db = qq.cloud.database()

        let deleteTasks = []
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i]
            if (isAdmin && product.post_user_openid !== userOpenid) {
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
            console.error("Delete product error!")
            qq.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 500
            })
        })
        this.setData({
            datalist: productList,
        })
        this.Refresh();
    }
    ,
})
