const app = getApp()
var util = require('../../utiils/getDate.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
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

    goIntoAct:function(e){
        console.log(e)
        var i = e.currentTarget.dataset.index
        console.log(i)
        console.log(this.data.actList[i])
        wx.setStorageSync('adminActivity', this.data.actList[i])
        wx.navigateTo({
            url: '/pages/admin/actAdmin_main/actAdmin_main',
        })
    },

    getAct(){
        var temp = []
        var act_list_info = []
        var that = this
        wx.cloud.database().collection('user').doc(app.globalData.userInfo._id).get({
            success:function(r){
                temp = r.data.activityList
                console.log(temp)
                for(var i = 0;i<temp.length;i++){
                    if(temp[i].act_state == -1){
                        console.log(temp[i])
                        wx.cloud.database().collection("project").doc(temp[i].act_id).get({
                            success:function(res){
                                console.log(res.data)
                                var nowTime = util.formatTime(new Date())
                                var endTime = util.formatTime(res.data.projectEndDate)
                                var actTemp = res.data
                                if(nowTime>endTime){
                                    //活动已结束
                                    actTemp.state = 1
                                    console.log(actTemp)
                                }else{
                                    actTemp.state = 0
                                    console.log(actTemp)
                                }
                                act_list_info.push(actTemp)
                                console.log(act_list_info)
                                that.setData({
                                    actList:act_list_info
                                })
                            }
                        })
                    }
                }
            }
        })
        
        
        
        
        
        
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getAct()
        
        
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