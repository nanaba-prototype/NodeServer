exports.GetCurrentDate = function () {
    return new Date()
}

exports.GetCurrentDateStr = function (date) {
    if(date == null) {
        date = new Date()
    }
    return date.toISOString()
}

exports.GetCurrentDateSec = function (date) {
    if(date == null) {
        date = new Date()
    }
    return date.getTime() / 1000;
}