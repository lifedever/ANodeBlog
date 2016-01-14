var Config = {
    site: {
        title: 'A Blog build by NodeJS+Express'
    },
    db:{
    	cookieSecret: 'blogbynodesecret',
    	name: 'blog',
    	host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
    }
};

module.exports = Config;