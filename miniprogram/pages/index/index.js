var util = require('../utiils/getDate.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
        'https://p.ananas.chaoxing.com/star3/origin/63b180884ae0170408cc2872b7e2c3b5.jpeg',
        'https://p.ananas.chaoxing.com/star3/origin/64ed6a5fdb85485a7fd8a5d6e35adfce.jpeg',
        'https://p.ananas.chaoxing.com/star3/origin/e08b26cdb004dfb6fcdf836e9c165e5f.jpeg'
      ],
      autoplay: true,      //是否自动切换
      interval: 3000,       //自动切换时间间隔
      duration: 1000,       //滑动动画时长
      inputShowed: false,
      inputVal: ""

  },

    //跳转到活动信息页面
    jumpActInfo:function(e){
        console.log(e)
        var i = e.currentTarget.dataset.index
        console.log(i)
        wx.setStorageSync('presentAct', this.data. projectList[i])
        wx.navigateTo({
            url: '/pages/activity_info/activity_info',
        })
    },

    //跳转到官方界面
    guanfang:function(){
        wx.navigateTo({
            url: '/pages/index-next/index-next',
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.cloud.database().collection('project').orderBy('projectAttention','desc')
    .get()
    .then(res=>{
        console.log("按热度排序")
        for(var a = 0; a< res.data.length;a++){
            res.data[a].projectStartDate = util.formatTime(res.data[a].projectStartDate);
            res.data[a].projectEndDate = util.formatTime(res.data[a].projectEndDate)
        }
        this.setData({
            projectList:res.data
            
        })

    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})