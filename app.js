App({
        data : {
            is_admin : false,
            user_openid : ""
        },
        async getUserOpenid() {
            console.log("get userid")
            await qq.cloud.callFunction({
                name : 'getOpenid',
            }).then( res => {
                console.log(res)
                // this.setData({
                //     user_openid : res.result.openid
                // })s
                this.data.user_openid = res.result.openid
                console.log(this.data.user_openid)

                const db = qq.cloud.database();
                db.collection("adminList").get().then( res => {
                        let adminList = res.data
                        let i = 0
                        console.log(adminList)
                        this.data.is_admin = false
                        for (i = 0; i < adminList.length; i++) {
                            if (adminList[i].open_id === this.data.user_openid) {
                                this.data.is_admin = true
                                break;
                            }
                        }
                    }
                ).then( res => {
                    console.log("is_admin is : ",this.data.is_admin)

                    // 由于 db query 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if(this.userAdminReadyCallback) {
                        this.userAdminReadyCallback()
                    }

                    if(this.userOpenidReadyCallback) {
                        this.userOpenidReadyCallback()
                    }
                })
                // for(var i=0;i<adminList.length;i++) {
                //     if(now_openid == adminList[i].open_id) {
                //         that.setAdminBar();
                //         break;
                //     }
                // }
            })
        },
        onLaunch() {
            qq.cloud.init({
                env: 'postwall-4gy7eykl559a475a',
                traceUser: true
            });

            version = qq.getEnvVersion()

            // if(version !== 'release') {
            //     qq.setEnableDebug({
            //         enableDebug: true
            //     })
            // }
            
            qq.setEnableDebug({
                enableDebug: true,
                success: () => {
                    console.log("enable debug!")
                },
                fail: (e) => {
                    console.log("enable debug error.", e)
                }
            })

            this.getUserOpenid();

        },
        onShow() {
            const updateManager = qq.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
                qq.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })

            updateManager.onUpdateFailed(function () {
                // 新版本下载失败
            })

        },
        onHide() {

        },
        onError(msg) {
            console.log(msg)
        },
        globalData: "I am global data",
    }
)