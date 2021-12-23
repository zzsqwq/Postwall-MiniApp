App({
        data : {
            is_admin : false,
            user_openid : ""
        },
        async getUserOpenid() {
            await qq.cloud.callFunction({
                name : 'getOpenid',
                data: {
                    a : 1 // 此处填入了某种方式获取得到的 Buffer 数据，可以是 request 下来的，可以是读文件读出来的等等
                },
            }).then( res => {
                console.log(res)
                // this.setData({
                //     user_openid : res.result.openid
                // })
                this.data.user_openid = res.result.openid
                console.log(this.data.user_openid)

                const db = qq.cloud.database();
                db.collection("adminList").get().then( res => {
                    let adminList = res.data
                    console.log(adminList)
                    for(var i=0;i<adminList.length;i++) {
                        if(adminList[i].open_id == this.data.user_openid) {
                            this.data.is_admin = true
                            break;
                        }
                    }
                }).then( res => {
                    console.log(this.data.is_admin)
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

            this.getUserOpenid();

        },
        onShow() {

        },
        onHide() {

        },
        onError(msg) {
            console.log(msg)
        },
        globalData: "I am global data",
    }
)