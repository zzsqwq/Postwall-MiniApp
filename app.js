App({
        data : {
            is_admin : false,
            user_openid : ""
        },
        onLaunch() {
            qq.cloud.init({
                env: 'postwall-4gy7eykl559a475a',
                traceUser: true
            });

            console.log("cloud env init finished!")

            version = qq.getEnvVersion()

            if(version !== 'release') {
                qq.setEnableDebug({
                    enableDebug: true
                })
            }
            
            qq.setEnableDebug({
                enableDebug: true,
                success: () => {
                    console.log("enable debug successful!")
                },
                fail: (e) => {
                    console.error("enable debug error.", e)
                }
            })
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