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
    UNIONID,
    ENV
  } = await cloud.getQQContext()

  return {
    event,
    openid : OPENID,
    appid : APPID,
    unionid : UNIONID,
    env : cloud.DYNAMIC_CURRENT_ENV
  }
}
