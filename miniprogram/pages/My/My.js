const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        quit_state:false,
    },

    //跳转个人信息界面
    btn_index:function(){
        wx.navigateTo({
            url: '/pages/userInfo/userInfo',
        })
    },
    //跳转管理员界面
    btn_admin:function(){
        wx.navigateTo({
            url: '/pages/admin/admin_interface/admin_interface',
        })
    },
    //跳转活动界面
    btn_activity:function(){
        wx.navigateTo({
            url: '/pages/admin/actAdmin/actAdmin',
        })
    },
    //跳转设置界面
    btn_system:function(){
        wx.navigateTo({
            url: '/pages/My-next/My-next',
        })
    },

    //获取用户的授权信息
    getUserInfo(){
        var that = this;
        wx.getUserProfile({
          desc: '获取您的头像、昵称、地区',
          success:(res) =>{
            var user = res.userInfo

            //全局变量——用户信息
            app.globalData.userInfo = user

            //云开发——用户数据库
            //判断之前是否已经授权注册过了
            wx.cloud.callFunction({
                name:"selectUserInfo",
                data:{
                    _id:null,
                    _openid: app.globalData.openid,
                }
            }).then(r=>{
                    console.log(r.result.data.length)
                    if(r.result.data.length == 0){
                        console.log("有无记录："+ r.result.data.length)
                        //添加记录
                        wx.cloud.database().collection('user').add({
                            data:{
                                avatarUrl:user.avatarUrl,
                                nickName:user.nickName,
                                activityList:[],
                                activity_status:0,
                                friend:[],
                                user:{},
                                userInfo_state:false,
                                Service_time:0,
                                user_integral:0,
                                credit_score:100,
                                user_grade:1,
                                user_identity:0
                            },
                            success(result){
                                console.log(result._id)
                                wx.cloud.callFunction({
                                    name:"selectUserInfo",
                                    data:{
                                        _id:result._id,
                                        _openid:null
                                    }
                                }).then(res1=>{
                                    that.setData({
                                        userInfo:res1.result.data[0]
                                    })
                                    wx.cloud.database().collection('user_interal_list').add({
                                        data:{
                                            daySum:0,
                                            isDaySignIn:true,
                                            isTask:[0,0,0,0,0],
                                            lastTime:new Date(),
                                            signinArr:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
                                        },
                                    })
                                    wx.showToast({
                                    title: '登录成功',
                                    })
                                })
                            }
                        })       
                    }else{
                        console.log("有无记录(注册过)："+ r.result.data.length)
                        that.setData({
                            quit_state:false,
                            userInfo:r.result.data[0]
                        })
                        wx.showToast({
                            title: '登录成功',
                        })
                    }
            })
            
            
          }
        })
        
    },

    btn_getmoney:function(){
        wx.navigateTo({
          url: '/pages/sign_in/sign_in',
        })
    },
    btn_shop:function(){
        wx.navigateTo({
          url: '/pages/shop/shop',
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
        this.setData({
            userInfo:result.result.data[0]
        })
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(options) {
        
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
        this.renewUserInfo()
        //更新当前页面数据
        this.setData({
            userInfo: app.globalData.userInfo
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