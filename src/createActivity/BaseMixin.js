var moment = require('moment');

var BaseMixin = {
    _formatDate: function(date) {
        return date ? moment(date).format('YYYY-MM-DD') : '';
    },
    
    _save: function(key) {
        return function(value) {
            var partial = {};
            partial[key] = String(value);
            this.setState(partial);
        }.bind(this)
    }
}

module.exports = BaseMixin;