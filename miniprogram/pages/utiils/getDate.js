function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
  
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
     
    return [year, month, day].map(formatNumber).join('/')
}
function formatDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
     
    return day
}

function formatTimeDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
     
    return [year, month, day].map(formatNumber).join('-')
}

function formatTime3(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
  
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
     
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}
  
  
  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    formatTimeDate:formatTimeDate,
    formatTime3:formatTime3
  }