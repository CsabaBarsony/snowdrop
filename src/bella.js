const bella = {
    prop: function(value) {
        function gettersetter(value) {
            const callbacks = []

            function prop() {
                if(arguments.length) {
                    const newValue = bella.immutable.clone(arguments[0])
                    const oldValue = bella.immutable.clone(value)
                    value = bella.immutable.clone(newValue)
                    callbacks.forEach(c => {
                        c(newValue, oldValue)
                    })
                }
                return value
            }

            prop.toJSON = function() {
                return value
            }

            prop.on = function(callback) {
                callbacks.push(callback)
            }

            return prop
        }

        return gettersetter(bella.immutable.clone(value))
    },
    immutable: {
        clone: function(original) {
            return JSON.parse(JSON.stringify(original))
        },
        push: function(original, item) {
            return [].concat(original, item)
        },
        pop: function(original) {
            return original.slice(0, -1)
        },
        shift: function(original) {
            return original.slice(1)
        },
        unshift: function(original, item) {
            return [].concat(item, original)
        },
        sort: function(original, compareFunction) {
            return original.concat().sort(compareFunction)
        },
        reverse: function(original) {
            return original.concat().reverse()
        },
        splice: function(original, start, deleteCount) {
            const _len = arguments.length
            const items = Array(_len > 3 ? _len - 3 : 0)
            for (let _key = 3; _key < _len; _key++) {
                items[_key - 3] = arguments[_key]
            }
            return [].concat(original.slice(0, start), items, original.slice(start + deleteCount))
        },
        remove: function(original, index) {
            return original.slice(0, index).concat(original.slice(index + 1))
        }
    },
    ajax: {
        get: function(url, callback){
            const xhr = new XMLHttpRequest()

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const response = xhr.response ? JSON.parse(xhr.response) : null
                        callback(true, response)
                    }
                    else if (xhr.status === 404) {
                        callback(false, xhr.status)
                    }
                    else {
                        console.error('ajax get error')
                    }
                }
            }
            xhr.open('GET', url)
            xhr.send()
        },
        post: function(url, data, callback){
            const xhr = new XMLHttpRequest()

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const response = xhr.response ? JSON.parse(xhr.response) : null
                        callback(true, response)
                    }
                    else if(xhr.status === 404) {
                        callback(false, xhr.status)
                    }
                    else {
                        console.error('ajax post error')
                    }
                }
            }
            xhr.open('POST', url)
            xhr.setRequestHeader('Content-type', 'application/json')
            xhr.send(JSON.stringify(data))
        }
    }
}

module.exports = bella
