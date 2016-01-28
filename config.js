var Config = {
    site: {
        title: 'Wincn开发网',
        description: '开源、分享，专注开发，用Coding创造财富',
        version: '1.0.2',
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
    }
};
module.exports = Config;