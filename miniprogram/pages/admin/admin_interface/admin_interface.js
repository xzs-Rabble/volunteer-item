const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        organList:['广州市某某大学','北京市某某大学','广州市志愿服务团体'],
        organName:'广州市某某大学',
    },
    //切换组织
    changeOrgan:function(e){
        this.setData({
            organName:this.data.organList[e.detail.value]
        })
    },

    //跳转到发布活动界面
    btn_addActivity:function(){
        wx.navigateTo({
            url: '/pages/admin/addActivity/addActivity',
        })
    },

    //跳转活动录取界面
    btn_interview:function(){
        wx.navigateTo({
            url: '/pages/admin/admin_interview/admin_interview',
        })
    },

    //跳转活动管理界面
    btn_actAdmin:function(){
        wx.navigateTo({
            url: '/pages/admin/actAdmin/actAdmin',
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
        this.setData({
            userInfo:app.globalData.userInfo
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