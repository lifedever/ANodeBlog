var Config = {
    site: {
        title: 'Wincn开发网',
        description: '开源、分享，专注开发，用Coding创造财富',
        version: '1.0.3',
        duoshuo: {
            short_name: 'gefangshuai'   // 请将这里替换成自己的
        }
    },
    db: {
        cookieSecret: 'blogbynodesecret',
        name: 'blog',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
    },
    constant: {
        flash: {
            success: 'success',
            error: 'error'
        }
    },
    article: {
        pageSize: 10,
        types: ['原创', '分享']
    },
    wx: {
        load: true,
        noSkill: "没有此技能，请关注网站: http://wincn.net了解更多!"
    },
    tl: {
        api: 'http://www.tuling123.com/openapi/api',
        key: '080cb4400d17375660c8b49e25994125'
    }
};
module.exports = Config;