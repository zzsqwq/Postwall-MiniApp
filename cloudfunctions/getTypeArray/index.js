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
  if(!event.reject) {
      return await db.collection("typeList").get();
  }
  else {
      return await db.collection("RejectList").get();
  }
  
}
