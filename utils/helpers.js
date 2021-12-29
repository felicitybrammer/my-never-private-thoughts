const format = require('date-fns/format');

module.exports = {
    formatDate(createdAtVal) {
        return format(createdAtVal, 'MMM d, yyyy');
    }
};