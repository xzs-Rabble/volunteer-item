const app = getApp()
let sum = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //用户好友列表
        friendList:[],
        last_msg:"让我想想",
        newMsg:true,
    },

    btn_offMsg:function(e){
        console.log(e)
        let id = e.currentTarget.dataset.i;
        wx.setStorageSync('offMsg', id)
        this.setData({
            newMsg:false,
        })
        wx.navigateTo({
            url: '/pages/msg_interface/msg_interface',
        })
    },

    btn_toMsg:function(e){
        wx.navigateTo({
            url: '/pages/msg_interface/msg_interface',
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
        sum = sum+1;
        this.data.friendList = app.globalData.userInfo.friend
        // let pages = getCurrentPages();
        // let currPage = pages[pages.length-1];
        if(sum > 0){
            this.setData({
                friendList:this.data.friendList,
                last_msg:"[视频]"
            })
        }else{
            this.setData({
                friendList:this.data.friendList,
                last_msg:""
            })
        }
        
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