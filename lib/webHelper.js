module.exports = {
    reshook: function(error, next, callback, errorCallback){
        if(error){
            if(errorCallback){
                errorCallback();
            }else{
                error.status = 500;
                next(error);
            }
        }else{
            callback();
        }
    }
};