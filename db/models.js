module.exports = {
    article: {
        title: {type: String, required: true},
        content: {type: String, required: true},
        created_time: {type: Date, default: Date.now}
    }
};