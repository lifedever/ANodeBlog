module.exports = {
    reshook: function(req, res, next, error, callback, errorCallback){
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