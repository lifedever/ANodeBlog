var Config = {
    site: {
        title: 'Wincn.net',
        description: '秉承开源、分享精神，专注技术开发领域，用Coding创造财富',
        version: '1.0.1'
    },
    db:{
    	cookieSecret: 'blogbynodesecret',
    	name: 'blog',
    	host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
    },
    constant: {
        flash:{
            success: 'success',
            error: 'error'
        }
    }
};
module.exports = Config;