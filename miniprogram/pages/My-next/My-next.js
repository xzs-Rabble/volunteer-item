// pages/My-next/My-next.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myStorage:0,
    },
    //注销
    cancellation(){
        wx.showModal({
            title: '慎重提示',
            content: '确定要注销账号吗？',
            cancelText:'确定',
            confirmText:'取消',
            success (res) {
              if (res.confirm) {
                console.log('用户点击取消')
              } else if (res.cancel) {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length-2];
                prevPage.setData({
                    quit_state:true,
                    userInfo:null
                })
                wx.navigateBack({
                    delta: 1,
                })
                wx.showToast({
                  title: '注销成功！',
                })
              }
            }
        })
    },

    //清除缓存
    clearHC:function(){
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定要清除缓存吗？',
            success (result) {
                if(result.confirm){
                    wx.clearStorage({
                        success: (res) => {
                          const r = wx.getStorageInfoSync()
                          that.setData({
                              myStorage:0
                          })
                          wx.showToast({
                            title: '清除成功！',
                          })
                        },
                    })
                }
            }
        })
        
        
        
    },

    //退出登录
    quit(){
        wx.showModal({
            title: '提示',
            content: '确定要退出吗？',
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                    delta: 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
        })
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        const res = wx.getStorageInfoSync()
        this.setData({
            myStorage:res.currentSize
        })
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