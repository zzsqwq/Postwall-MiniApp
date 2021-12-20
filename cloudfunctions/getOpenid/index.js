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
  } = await cloud.getQQContext()

  return {
    event,
    openid : OPENID,
    appid : APPID,
    env : cloud.DYNAMIC_CURRENT_ENV
  }
}
