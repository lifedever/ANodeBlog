var Config = {
    site: {
        title: '一个博客'
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