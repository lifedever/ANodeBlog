var Config = {
    site: {
        title: 'A Blog build by NodeJS+Express'
    },
    db:{
    	cookieSecret: 'blogbynodesecret',
    	name: 'blog',
    	host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
    },
    constant: {
        flash:{
            success: 'flash_success_message',
            error: 'flash_error_message'
        }
    }
};

module.exports = Config;