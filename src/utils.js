var moment = require('moment');
require('moment/locale/zh-cn');
moment.locale('zh-cn');

var DAY_MILLS = 3600 * 24 * 1000;

// TODO: add unittests

function today() {
    var now = Date.now();
    return now - now % DAY_MILLS;
}

function yesterday() {
    var now = Date.now();
    return now - now % DAY_MILLS - DAY_MILLS;
}

function day(d) {
    return d.getTime() - d.getTime() % DAY_MILLS;
}

function isToday(d) {
    return today() === day(d);
}

function isYesterday(d) {
    return yesterday() === day(d);
}

function humanDate(d) {
    if (isToday(d)) {
        return moment(d).format('Ah:mm');
    }

    if (isYesterday(d)) {
        return `昨天 ${moment(d).format('Ah:mm')}`;
    }

    if (day(d) >= today() - 6 * DAY_MILLS) {
        return moment(date).format('dddd Ah:mm');
    }

    return moment(d).format('YYYY-MM-DD Ah:mm');
}

module.exports = {
    isToday,
    isYesterday,
    humanDate
};
