//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        is_admin : "",
        user_openid : "",
        hasUserInfo: false,
        canIUse: qq.canIUse('button.open-type.getUserInfo'),
        tmp_img: "",
        convert_img : [],
        datalist: [],
        total_data_list : [],
        base64str : " ",
        readytosend : new Array(100).fill(false),
        readyPictures : new Array(100).fill(" "),
        now_pages : 0,
        rowscount : new Array(10).fill(0),
        chooseornot : []
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    loadDataBase : function () {
        const db = qq.cloud.database();
        let function_name = this.data.is_admin === true ? "adminGetdb" : "Getdb";
        let getDatabase = async () => {
            return await qq.cloud.callFunction( {
                name : function_name,
                data : {
                    user_openid : app.data.user_openid,
                    reverse : true,
                    skip_num : this.data.now_pages * 9
                }
            }).then(res => {
                this.setData({
                    total_data_list : res.result.data,
                    datalist: res.result.data.slice(0, 9)
                })
                // console.log("datalist:", this.data.datalist)
                let tmp_list = this.data.datalist
                for (let i = 0; i < this.data.datalist.length; i++) {
                    tmp_list[i].open = false
                }
                this.setData({
                    datalist: tmp_list
                })
            }).then(res => console.log(this.data.datalist))
        }
        getDatabase()
            .then(async res => {
                const that = this
                const str = this.data.base64str
                // console.log("test datalist:", this.data.datalist.length)
                let total_length = 0;
                for (let i = 0; i < this.data.datalist.length; i++) {
                    total_length += this.data.datalist[i].image_list.length - 1;
                }
                for (let i = 0; i < this.data.datalist.length; i++) {
                    // await qq.cloud.callFunction({
                    qq.cloud.callFunction({
                        name: "drawPostwall",
                        data: this.data.datalist[i]
                    }).then(res => {

                        //console.log("python function return res",res.result)
                        let userImageBase64 = 'data:image/png;base64,' + res.result.replace(/[\"]/g,'')
                        // console.log("base64", userImageBase64)
                        userImageBase64 = userImageBase64.replace(/[\r\n\"]/g, '')
                        let imageList = that.data.datalist[i].image_list
                        var imgPath = qq.env.USER_DATA_PATH  + '/' + that.data.datalist[i]._id + '.png';
                        var fs = qq.getFileSystemManager();
                        let j_counter = 1;
                        fs.writeFileSync(imgPath, res.result, "base64");
                        imageList.unshift(imgPath)
                        that.setData({
                            base64str: userImageBase64
                        })
                        that.data.readyPictures[i * 10] = imgPath;
                        for (let j = 1; j < that.data.datalist[i].image_list.length; j++) {
                            qq.cloud.downloadFile({
                                fileID: that.data.datalist[i].image_list[j]
                            }).then(res => {
                                // console.log("test tempfile", res.tempFilePath)
                                that.data.readyPictures[i * 10 + j] = res.tempFilePath;
                                // console.log("i:",i,"and",that.data.datalist.length-1)
                                // console.log("j:",j,"and",that.data.datalist[i].image_list.length-1)
                                j_counter = j_counter + 1;
                                if (j_counter === total_length) {
                                    qq.showToast({
                                        title: '加载结束',
                                        icon: 'success',
                                        duration: 300
                                    })
                                }
                            }).catch(res => {
                                console.error("download file error!", res)
                            })
                        }
                    })
                }
            })

    },

    onLoad: function () {


        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })

        // init chooseornot
        let a = this.data.chooseornot
        for(let i=0;i<10;i++) {
            let b = [];
            for(let j=0;j<10;j++) {
                b[j] = false
            }
            a[i] = b;
        }
        this.setData({
            chooseornot : a
        })

        qq.cloud.init({
            env: 'postwall-4gy7eykl559a475a',
            traceUser: true
        })

        this.setData({
            is_admin : app.data.is_admin
        })

        app.userAdminReadyCallback = () => {
            this.setData( {
                is_admin : app.data.is_admin
            })
        }

        app.userOpenidReadyCallback = () => {
            this.setData({
                user_openid : app.data.user_openid
            })
        }

        //     .then( res => {
        //     for(let i = 0; i < this.data.datalist.length; i++) {
        //         for(let j=1;j<this.data.datalist[i].image_list.length;j++) {
        //             qq.cloud.downloadFile({
        //                 fileID: this.data.datalist[i].image_list[j]
        //             }).then(res => {
        //                 console.log("test tempfile", res.tempFilePath)
        //                 this.data.readyPictures[i*10+j] = res.tempFilePath;
        //             }).catch(res => {
        //                 console.error("download file error!")
        //             })
        //         }
        //     }
        // })

    },
    onShow: function() {
        const db = qq.cloud.database();
        qq.hideTabBarRedDot({
                index : 1
            }
        )
        let function_name = this.data.is_admin === true ? "adminGetdb" : "Getdb";
        let if_delta = false;
        let getDatabase = async () => {
            return await qq.cloud.callFunction( {
                name : function_name,
                data : {
                    user_openid : app.data.user_openid,
                    reverse : true,
                }
            }).then(res => {
                // console.log("total_data_list is :",this.data.total_data_list)
                // console.log("res result length",res.result.data.length)
                if(!this.data.total_data_list || res.result.data.length !== this.data.total_data_list.length) {
                    if_delta = true;
                }
            })
        }

        getDatabase().then( res => {
                console.log("if_delta is :",if_delta)
                if (if_delta) {
                    this.loadDataBase();
                }
            }
        )
    },
    onPullDownRefresh(options) {

        app.getUserOpenid()

        this.setData({
            is_admin : app.data.is_admin
        })

        console.log("test refresh")
        this.loadDataBase()
        this.setData({
            readytosend : new Array(100).fill(false),
            rowscount : new Array(10).fill(0),
        })

        a = this.data.chooseornot
        for(var i=0;i<10;i++) {
            var b = []
            for(var j=0;j<10;j++) {
                b[j] = false
            }
            a[i] = b
        }
        this.setData({
            chooseornot : a
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
    },
    onReady(options) {
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    previewAvatar(e) {
        const current = e.target.dataset.src
        userinfo = app.globalData.userInfo
        console.log(e)
        qq.previewImage({
            current: userinfo.avatarUrl,
            urls: [userinfo.avatarUrl]
        })
    },
    previewImg(e) {
        const img_id = e.target.dataset.id;
        const img_index = e.target.dataset.index;
        console.log(e);
        qq.previewImage({
            urls : [this.data.datalist[img_id].image_list[img_index]]
        })
    },
    kindToggle(e) {
        //console.log(e.currentTarget)
        //this.convertAllCanvas()
        const id = e.currentTarget.id
        const list = this.data.datalist
        for (let i = 0, len = list.length; i < len; ++i) {
            if (list[i]._id === id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            datalist: list
        })
        // qq.reportAnalytics('click_view_programmatically', {})
    },
    selectImg(e) {
        const index = parseInt(e.currentTarget.dataset.item)
        const id = parseInt(e.currentTarget.id)
        this_data = this.data.chooseornot
        let row_counter = this.data.rowscount
        console.log("index", index)
        console.log("id", id)
        console.log("index+id", index*10+id)
        this_data[index][id] = !this_data[index][id]
        if(this_data[index][id] == true) {
            this.data.readytosend[index*10+id] = true;
            row_counter[index]++;
        }else {
            this.data.readytosend[index*10+id] = false;
            row_counter[index]--;
        }
        //console.log(this.data.readytosend)
        this.setData({
            chooseornot : this_data,
            rowscount : row_counter
        })
    },
    toQzone() {
        let medias = []
        let now_index = 1
        let next_index = 0
        let post_detail = ""
        for(let i=0;i<100;i++) {
            if(this.data.readytosend[i] === true) {
                medias.push({
                    type : 'photo',
                    path : this.data.readyPictures[i]
                })
                index = parseInt(i/10)
                console.log(index,this.data.rowscount[index])
            }
        }
        for(let i=0;i<10;i++) {
            console.log(this.data.rowscount[i])
            if(this.data.rowscount[i] !== 0) {
                next_index = now_index + this.data.rowscount[i] - 1;
                if(this.data.rowscount[i] !== 1) {
                    post_detail += "P" + now_index + "-" + next_index + ":[" + this.data.datalist[i].post_type + "]" + this.data.datalist[i].post_title + "\n";
                    now_index = next_index + 1;
                }
                else
                {
                    post_detail += "P" + now_index +  ":[" + this.data.datalist[i].post_type + "]" + this.data.datalist[i].post_title + "\n";
                    now_index = next_index + 1;
                }
            }
        }
        console.log(medias)
        qq.openQzonePublish({
            footnote: '自助贴贴墙',
            path: 'pages/index/index',
            text: post_detail,
            media: medias
        })

        this.setData({
            readytosend : new Array(100).fill(false),
            rowscount : new Array(10).fill(0),
        })

        a = this.data.chooseornot
        for(var i=0;i<10;i++) {
            var b = []
            for(var j=0;j<10;j++) {
                b[j] = false
            }
            a[i] = b
        }
        this.setData({
            chooseornot : a
        })
    },

    /**
     * 显示删除按钮
     */
    showDeleteButton: function (e) {
        let productIndex = e.currentTarget.dataset.productindex
        this.setXmove(productIndex, -65)
    },

    /**
     * 隐藏删除按钮
     */
    hideDeleteButton: function (e) {
        let productIndex = e.currentTarget.dataset.productindex

        this.setXmove(productIndex, 0)
    },

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
        console.log(this.data.datalist)
    },

    /**
     * 处理movable-view移动事件
     */
    handleMovableChange: function (e) {
        if (e.detail.source === 'friction') {
            if (e.detail.x < -30) {
                this.showDeleteButton(e)
            } else {
                this.hideDeleteButton(e)
            }
        } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
            this.hideDeleteButton(e)
        }
    },

    /**
     * 处理touchstart事件
     */
    handleTouchStart(e) {
        this.startX = e.touches[0].pageX
    },

    /**
     * 处理touchend事件
     */
    handleTouchEnd(e) {
        if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
            this.showDeleteButton(e)
        } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
            this.showDeleteButton(e)
        } else {
            this.hideDeleteButton(e)
        }
    },

    /**
     * 删除产品
     */
    handleDeleteProduct: function ({ currentTarget: { dataset: { id } } }) {
        let productList = this.data.datalist
        // let productIndex = productList.findIndex(item => item.id === id)
        let productIndex = id;
        const db = qq.cloud.database();
        if((this.data.is_admin === true) && (productList[productIndex].post_user_openid !== app.data.user_openid)) {
            db.collection("postwall").doc(productList[productIndex]._id).update({
                data : {
                    post_done : false
                }
            }).then(res => {
                console.log(res);
                qq.showToast({
                    title: '恢复成功',
                    icon: 'success',
                    duration: 500
                })
                productList.splice(productIndex, 1)
                this.setData({
                    datalist : productList
                })
                if (productList[productIndex]) {
                    this.setXmove(productIndex, 0)
                }
            })
        }
        else {
            db.collection("postwall").doc(productList[productIndex]._id).update({
                data : {
                    post_done : false,
                    post_user_done: false
                }
            }).then(res => {
                if (productList[productIndex]) {
                    this.setXmove(productIndex, 0)
                }
                console.log(res);
                qq.showToast({
                    title: '恢复成功',
                    icon: 'success',
                    duration: 500
                })
                productList.splice(productIndex, 1)
                this.setData({
                    datalist : productList
                })
            })
        }
    },

    /**
     * slide-delete 删除产品
     */
    handleSlideDelete({ detail: { id } }) {
        let slideProductList = this.data.slideProductList
        let productIndex = slideProductList.findIndex(item => item.id === id)

        slideProductList.splice(productIndex, 1)

        this.setData({
            slideProductList
        })
    },
    navigate_to_back() {
        qq.navigateBack({
            delta : 1
        })
    },
    next_page() {
        console.log("now page is :",this.data.now_pages)
        this.setData({
            now_pages : this.data.now_pages + 1
        })
        this.loadDataBase()

    }

})