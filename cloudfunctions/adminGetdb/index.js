// 云函数入口文件
const cloud = require('qq-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  const {
    OPENID,
    APPID,
    ENV
  } = cloud.getQQContext()

  const db = cloud.database();

  if(!event.reverse) {
    return await db.collection("postwall").where({
      post_done : false,
    }).get()
  }
  else {
    let curDate3 = new Date( new Date() - 3*24*3600*1000)
    const _ = db.command
    if(!event.skip_num) {
      return await db.collection("postwall").where({
        post_done : true,
        post_user_done : false,
        post_date : _.gte(curDate3)
      }).orderBy("post_date","desc").get()
    }
    else {
      return await db.collection("postwall").where({
        post_done : true,
        post_user_done : false,
        post_date : _.gte(curDate3)
      }).orderBy("post_date","desc").skip(event.skip_num).get()
    }
  }
  
}
