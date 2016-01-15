module.exports = {
    article: {
        title: {type: String, required: true},
        content: {type: String, required: true},
        created_time: {type: Date, default: Date.now}
    },
    user: {
        username: {type: String, required: true},// 用户名
        email: {type: String},  // 邮箱
        website: {type: String},    // 个人网站
        address: {type: String},    // 所在地点
        github: {type: String}, // github
        signature: {type: String}   // 个人签名
    }
};