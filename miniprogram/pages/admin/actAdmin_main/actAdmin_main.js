// pages/admin/actAdmin_main/actAdmin_main.js
var util = require('../../utiils/getDate.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        font_color:"#ffffff",
        bg_color:"#f9be00",
        //选项卡
        currentData : 0,
        //持续时间选择
        dateList:["1","2","3","4","5","6","7","8","9","10","11","12","13","14"],
        //地区
        
    },

    //更改组织
    updateOrgan:function(){
        wx.showActionSheet({
          itemList: ['北京市某某大学','广州市某某大学','广州市志愿服务团体'],
          success:function(res){
              console.log(res.tapIndex)
          }
        })
    },

    //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;

    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{

      that.setData({
        currentData: e.target.dataset.current
      })
    }
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
        var actInfo = wx.getStorageSync('adminActivity')
        console.log(actInfo)
        var time1 = new Date(actInfo.projectStartDate)
        var time2 = new Date(actInfo.projectEndDate)
        var bmTime = util.formatTimeDate(time1)
        var hdTime = util.formatTimeDate(time2)
        if(actInfo.state == 1){
            this.data.bg_color = "#dedede"
            this.data.font_color = "#757575"
        }
        this.setData({
            bg_color:this.data.bg_color,
            font_color:this.data.font_color,
            actInfo:actInfo,
            bmTime:bmTime,
            hdTime:hdTime,
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