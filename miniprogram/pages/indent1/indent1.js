// pages/indent1/indent1.js
var util = require('../utiils/getDate.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        
    },

//订单详情
indentInfo:function(e){
    console.log(e)
    var i = e.currentTarget.dataset.index
    console.log(i)
    wx.setStorageSync('indent', this.data.list[i])
    wx.navigateTo({
        url: '/pages/indent/indent',
    })
},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var arr = wx.getStorageSync('buyArr')
        this.data.list = wx.getStorageSync('buyArr')
        var time = util.formatTime3(new Date())
        wx.setStorageSync('nowtime', time)
        console.log(arr)
        this.setData({
            list:arr,
            time:time
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})