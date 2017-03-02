const store = {
    getMessage: function(callback) {
        setTimeout(function() {
            callback('you are a monkey')
        }, 300)
    }
}

module.exports = store
