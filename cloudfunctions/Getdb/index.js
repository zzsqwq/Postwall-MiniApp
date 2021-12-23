// 云函数入口文件
const cloud = require('qq-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database();

  return await db.collection("postwall").where({
    post_done : false,
    post_user_openid : event.user_openid
  }).get()
}
