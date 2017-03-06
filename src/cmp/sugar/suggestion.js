/**
 * @param {String} text
 * @param {Object} [data]
 * @constructor
 */
function Suggestion(text, data = {}) {
    this.text = text
    this.data = data
}

module.exports = Suggestion
