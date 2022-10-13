// pages/shop/shop.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        first:false,
        select: 0,
        height: 0,
        sortList: [
          {name: '全部商品'},
          {name: '百货'},
          {name: '食品'},
          {name: '洗护'},
          {name: '家装'},
          {name: '数码'},
          {name: '手机'},
          {name: '医药'},
        ],
        totalList:[],
        tempList:[],
        buyComm:[],
        userinfo:{},
        money:0,
    },

buy(e){
    var that = this
    var temp = e.currentTarget.dataset
    console.log(temp)
    var myMoney = that.data.userinfo.user_integral
    if(myMoney >= temp.price){
        wx.showModal({
            title:'提示',
            content:'确认兑换吗？',
            success:function(res){
                if(res.confirm){
                    console.log("确认")
                    wx.cloud.database().collection("user").where({
                        _openid:app.globalData.openid,
                    }).update({
                        data:{  
                            user_integral: myMoney-temp.price
                        }
                    }).then(r=>{
                        console.log("兑换成功")
                        wx.showToast({
                            title: '兑换成功',
                        })
                        var arr = that.data.tempList[temp.index]
                        console.log(arr)
                        that.data.buyComm.push(arr)
                        console.log(that.data.buyComm)
                        that.data.userinfo.user_integral = myMoney-temp.price
                        that.setData({
                            userInfo:that.data.userinfo
                        })
                    })
                }else{
                    console.log("取消")
                }
            }
          })
    
          
    }else{
        wx.showToast({
          title: '积分不足',
          icon:'error'
        })
    }
    
    
},

// 触发tab导航栏
  activeTab(e) {
    if(e==0){
        var index = e
        console.log(e)
    }else{
        console.log(e)
        var index = e.currentTarget.dataset.index
    }
    this.setData({
      select: index
    })
    this.generalEv(index)
    this.watchHeight()
  },

  // 滑动swiper
  activeSw(e) {
    if(e==0){
        var index = e
        console.log(e)
    }else{
        console.log(e)
        var index = e.detail.current
    }
    this.setData({
      select: index
    })
    this.generalEv(index)
    this.watchHeight()
  },

  // 监听swiper高度
  watchHeight() {
    var query = wx.createSelectorQuery()
    query.select('.box').boundingClientRect((res) => {
      this.setData({
        height: parseInt(res.height)
      })
    }).exec()
  },

  // 初始化值
  generalEv(e) {
    console.log(e)
    if(e==0){
        this.getPic()
        console.log(this.data.totalList)
        this.setData({
            placeList: this.data.totalList
        })
    }else{
        switch(e){
            case 1:
                this.getcommByType(e)
                break;
            case 2:
                this.getcommByType(e)
                break;
            case 3:
                this.getcommByType(e)
                break;
            case 4:
                this.getcommByType(e)
                break;
            case 5:
                this.getcommByType(e)
                break;
            case 6:
                this.getcommByType(e)
                break;
            case 7:
                this.getcommByType(e)
                break;
        }
    }
    
    // 回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  onReachBottom: function () {
    this.setData({
      placeList: this.data.totalList
    })
    this.watchHeight()
  },

  //根据种类获取商品
  getcommByType:function(e){
    this.data.tempList = []
    for(var i = 0;i<this.data.totalList.length;i++){
        if(this.data.sortList[e].name == this.data.totalList[i].type){
            this.data.tempList.push(this.data.totalList[i])
            console.log(this.data.tempList)
        }
    }
    this.setData({
        placeList: this.data.tempList
    })
  },

  //更新志愿积分
  renewUserInfo:function(){
    wx.cloud.callFunction({
        name:"selectUserInfo",
        data:{
            _id:null,
            _openid: app.globalData.openid,
        }
    }).then(result=>{
        this.data.money = result.result.data[0].user_integral
        this.data.userinfo = result.result.data[0]
        this.setData({
            userInfo:result.result.data[0]
        })
    })
  },

  //订单页面
  indent:function(){
    wx.setStorageSync('buyArr', this.data.buyComm)
    wx.navigateTo({
        url: '/pages/indent1/indent1',
    })
  },

  //获取商品
  getPic:function(){
    wx.cloud.database().collection('commodity').get().then(res=>{
        console.log("获取全部商品"+res)
        this.data.tempList =[]
        this.data.tempList = res.data
        this.data.totalList = res.data
        if(this.data.first == false){
            this.data.first = true
            this.setData({
                placeList: res.data
            })
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
        this.getPic()

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.renewUserInfo()
        this.watchHeight()
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