module.exports = {
    reshook: function(err, callback, errorCallback){
        if(err){
            errorCallback();
        }else{
            callback();
        }
    }
};