var util = require('../utiils/getDate.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        state:"报名进行中>",
        state_txt:"报名",
        //报名状态：false为可以报名，true为不能报名
        btn_state:false,
        //背景色
        bg_color:"#f9be00",
        bg_color_txt:"#f9be00",
        //字体色
        font_color:"#ffffff",
        btn_txt_color:"#000000",
        //用户个人信息填了没
        user_state:false,
        //当前活动id
        activityId:"",
        //当前活动报名人数
        people:0,
        //订阅活动模板ID
        tempIds_state:false,
    },

    //报名活动
    btn_signup(){
        var that = this
        if(that.data.btn_state == false){
            wx.showModal({
              title:'提示',
              content:'确认报名吗?',
              success(r){
                if(r.confirm){
                    if(that.data.user_state == true){
                        let userInfo = app.globalData.userInfo
                        console.log(userInfo)
                        wx.cloud.callFunction({
                            name:'updateUserAct',
                            data:{
                                docid:userInfo._id,
                                actid:that.data.activityId,
                                act_state:0
                            }
                        }).then(r1=>{
                            
                            wx.cloud.callFunction({
                                name:'updateAct',
                                data:{
                                    actid:that.data.activityId,
                                    user_id:userInfo._id,
                                    user_name:userInfo.user.auth_name,
                                    user_phone:userInfo.user.phone,
                                    sever_time:userInfo.Service_time,
                                    user_grade:userInfo.user_grade
                                }
                            }).then(r=>{
                                console.log('2222')
                                that.data.state_txt = "已报名"
                                that.data.bg_color_txt = "#dedede"
                                that.data.btn_txt_color = "#757575"
                                that.data.btn_state = true
                                that.data.people = that.data.people + 1
                                that.setData({
                                    state_txt:that.data.state_txt,
                                    bg_color_txt:that.data.bg_color_txt,
                                    btn_txt_color:that.data.btn_txt_color,
                                    people:that.data.people
                                })
                                wx.showToast({
                                    title: '报名成功',
                                })
                            })
                            
                        })
                        
                    }else{
                        wx.showModal({
                            title:'报名失败',
                            content:'未填写用户信息',
                            confirmText:'去填写',
                            success(res){
                                if(res.confirm){
                                    console.log("去填写")
                                    wx.navigateTo({
                                        url: '/pages/userInfo/userInfo',
                                    })
                                }
                            }
                        })
                    }
                }
              }
            })
        }
    },

    //订阅消息
    subTap: function () {
        let that = this
        if(that.data.tempIds_state == false){
            wx.requestSubscribeMessage({
                tmplIds: ['tQh1gd8jBCmmsqRD-AjpFwkt7zg7frudnVTGAB1EKIQ'],
                success(res){
                    console.log(res)
                    wx.showToast({
                      title: '订阅成功！',
                    })
                    that.setData({
                        tempIds_state:true
                    })
                }
            })
        }else{
            wx.showToast({
              title: '您已经订阅！',
              icon:'none'
            })
        }
        
    },

    btn_toMsg:function(){
        
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
        var actInfo = wx.getStorageSync('presentAct')
        this.data.people = actInfo.people.length
        this.data.activityId = actInfo._id
        console.log(actInfo)
        var nowTime = util.formatTime(new Date())
        console.log(nowTime)
        var id = app.globalData.userInfo._id
        console.log(id)
        if(nowTime > actInfo.projectStartDate){
            console.log(actInfo.projectStartDate)
            this.data.state = "报名已截止>"
            this.data.state_txt = "报名已截止"
            this.data.bg_color_txt = "#dedede"
            this.data.bg_color = "#dedede"
            this.data.font_color = "#757575"
            this.data.btn_txt_color = "#757575"
            this.data.btn_state = true
        }else{
            wx.cloud.database().collection('user').where({
                _id:id
            }).get({
                success:(res)=>{
                    //赋予用户基本信息是否填写
                    this.data.user_state = res.data[0].userInfo_state
                    var list = res.data[0].activityList
                    console.log(list.length)
                    if(list.length != 0){
                        for(var i=0;i<list.length;i++){
                            if(list[i].act_id == actInfo._id){
                                this.data.state_txt = "已报名"
                                this.data.bg_color_txt = "#dedede"
                                this.data.btn_txt_color = "#757575"
                                this.data.btn_state = true
                                this.setData({
                                    state_txt:this.data.state_txt,
                                    bg_color_txt:this.data.bg_color_txt,
                                    btn_txt_color:this.data.btn_txt_color
                                })
                                break;
                            }
                        }
                    }
                    
                }
            })
        }
        this.setData({
            actInfo:actInfo,
            people:this.data.people,
            state:this.data.state,
            state_txt:this.data.state_txt,
            bg_color:this.data.bg_color,
            bg_color_txt:this.data.bg_color_txt,
            font_color:this.data.font_color,
            btn_txt_color:this.data.btn_txt_color
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