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

            let version = qq.getEnvVersion()

            if(version !== 'release') {
                qq.setEnableDebug({
                    enableDebug: true,
                    success: () => {
                        console.log("enable debug successful!")
                    },
                    fail: (e) => {
                        console.error("enable debug error.", e)
                    }
                })
            }
        },
        onError(msg) {
            console.log(msg)
        },
        globalData: "I am global data",
        version: 'v1.3.1',
        versionDesc: 'version v1.3.1'
    }
)