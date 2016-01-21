var Config = {
    site: {
        title: 'Wincn.net',
        version: '1.0.0'
    },
    db:{
    	cookieSecret: 'blogbynodesecret',
    	name: 'blog',
    	host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
        //url: 'mongodb://192.241.226.198:27017/blog'
    },
    constant: {
        flash:{
            success: 'success',
            error: 'error'
        }
    }
};

module.exports = Config;