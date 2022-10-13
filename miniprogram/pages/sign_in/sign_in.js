var util = require('../utiils/getDate.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //日历列表的差值
    arrDiff:0,
    //判断今天是否已经签到
    isSignin:false,
    //签到后改变的样式
    afterSignin_name:"date-head2",
    //签到文本
    btn_txt:"签到",
    //统计30天已经签到的日期，0为为签到，1为已签到
    // signinArr:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // signinSum:0,
    //签到按钮是否被禁用
    btn_disabled:false,
    //按钮颜色、背景颜色
    btn_color:["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    btn_bg_color:["#ffc935","#ffc935","#ffc935","#ffc935","#ffc935"],
    //5个积分任务包含的要求、积分、按钮文本、是否已领取、按钮是否被禁用
    tasknumArr:[3,5,7,14,28],
    taskArr:[10,20,50,100,200],
    taskBtn:["","","","",""],
    isTask:[0,0,0,0,0],
    after_task_btn:[false,false,false,false,false],
    // 日历
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    // 当前维度
    latitude: "",
    // 当前精度
    longitude: "",
    yesDate: [20200501, 20200511, 20200512, 20200508],  //此处应该是接口返回的数据，先模拟了一个
    signinNow: false
  },
  
  
  // 已签到日期
  yesdate() {
    let t = this;
    let dateArr = t.data.dateArr;
    var temp = false;
    for (var i = 0; i < dateArr.length; i++) {
        if(Object.keys(dateArr[i]).length  == 0 && temp == false){
            t.data.arrDiff = t.data.arrDiff+1
        }else{
            temp = true
        }
    }
    
  },
  // 日历
  dateInit: function (setYear, setMonth) {
    let t = this;
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth() //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1 < 10 ? '0' + String(i - startWeek + 1) : String(i - startWeek + 1);
        obj = {
          isToday: '' + year + ((month + 1) < 10 ? "0" + (month + 1) : (month + 1)) + num,
          dateNum: num,
          weight: 5,
          choose: false
        }
        
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    t.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      t.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      t.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    };
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    let t = this;
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = t.data.month - 2 < 0 ? t.data.year - 1 : t.data.year;
    let month = t.data.month - 2 < 0 ? 11 : t.data.month - 2;
    t.setData({
      year: year,
      month: (month + 1)
    })
    t.dateInit(year, month);
    t.yesdate()
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    let t = this;
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = t.data.month > 11 ? t.data.year + 1 : t.data.year;
    let month = t.data.month > 11 ? 0 : t.data.month;
    t.setData({
      year: year,
      month: (month + 1)
    })
    t.dateInit(year, month);
    t.yesdate()
  },

  //签到
  signin:function(){
    var that = this;
    //如果当日没有签到
    if(this.data.userIntegral.isDaySignIn == false){
        var time = util.formatDate(new Date())-1+this.data.arrDiff
        console.log(time)
        this.data.userIntegral.signinArr[time] = 1
        wx.cloud.callFunction({
            name:"updateIntegral",
            data:{
                time:time,
                _openid:app.globalData.openid,
                status:true,
                isTask:null,
                arr:this.data.userIntegral.signinArr
            }
        }).then(r=>{
            console.log(r)
        })   
    }
    console.log(time)
    this.renewShow();
    this.setData({
        nowDay: time+1,
        isSignin:true,
        btn_disabled:true,
        btn_txt:"今日已签到"
    })
    wx.showToast({
      title: '积分+10',
    })

    //添加积分
    wx.cloud.callFunction({
        name:"getIntegral",
        data:{
            _openid:app.globalData.openid,
            num:10
        }
    }).then(r=>{
        //加10积分
        app.globalData.userInfo.user_integral = app.globalData.userInfo.user_integral+10
        that.setData({
            userInfo : app.globalData.userInfo,
            'userIntegral.daySum':5
        })
        console.log(r)
    })
  },

  //获取积分任务奖励按钮
  getReward:function(e){
    var that = this
    var i = e.currentTarget.dataset.id;
    console.log(i)
    wx.cloud.callFunction({
        name:"selectIntegral",
        data:{
            _openid:app.globalData.openid
        }
    }).then(r=>{
        //判断奖励是否已领取
        if(r.result.data[0].isTask[i] ==1){
            this.setData({
                ['taskBtn['+i+']']:"已完成",
                ['btn_bg_color['+i+']']:"#ffffff", 
                ['btn_color['+i+']']:"#c6c3c3",
                ['after_task_btn['+i+']']:true
            })
        }else{
            //添加积分
            wx.cloud.callFunction({
                name:"getIntegral",
                data:{
                    _openid:app.globalData.openid,
                    num:this.data.taskArr[i]
                }
            }).then(r=>{
                //加10\20\50\100\200积分
                app.globalData.userInfo.user_integral = app.globalData.userInfo.user_integral+this.data.taskArr[i]
                this.setData({
                    userInfo : app.globalData.userInfo
                })
                console.log(r)
                this.data.userIntegral.isTask[i] = 1
                wx.cloud.callFunction({
                    name:"updateIntegral",
                    data:{
                        _openid:app.globalData.openid,
                        isTask:this.data.userIntegral.isTask
                    }
                })
                that.setData({
                    ['taskBtn['+i+']']:"已完成",
                    ['btn_bg_color['+i+']']:"#ffffff", 
                    ['btn_color['+i+']']:"#c6c3c3",
                    ['after_task_btn['+i+']']:true,
                    userIntegral : this.data.userIntegral
                })
            })
            
            wx.showToast({
                title: '积分+'+this.data.taskArr[i],
            })
        }
    })
    
    
  },
  renewShow:function(){
    //获取用户数据库
    let t = this;
    var temp = app.globalData.user_interal_list;
    console.log(temp)
    wx.cloud.callFunction({
        name:"selectIntegral",
        data:{
            _openid:app.globalData.openid
        }
    }).then(r1=>{
        console.log(r1)
        var nowTime = util.formatTimeDate(new Date())
        console.log(nowTime)
        var lastTime = util.formatTimeDate(new Date(r1.result.data[0].lastTime))
        console.log(lastTime)
        //说明今天或者昨天、以前已经签到了
        if(r1.result.data[0].isDaySignIn == true){
            //判断今天比用户最后一次签到的时间大
            if(nowTime > lastTime){
                //未签到,只改签到状态
                wx.cloud.callFunction({
                    name:"updateIntegral",
                    data:{
                        time:null,
                        isTask:null,
                        _openid:app.globalData.openid,
                        status:false
                    }
                })
                temp.isDaySignIn = false
                this.setData({
                    userIntegral:temp,
                    btn_txt:"签到",
                    btn_disabled:false
                })
            }else{
                this.setData({
                    userIntegral:temp,
                    btn_txt:"今日已签到",
                    btn_disabled:true
                })
            }

        }
        app.globalData.user_interal_list = r1.result.data[0]
        console.log(r1.result.data[0])
        t.setData({
            userIntegral:r1.result.data[0],
            userInfo:app.globalData.userInfo
        })
        console.log(t.data.userIntegral)

        for(var i=0;i<this.data.tasknumArr.length;i++){
            //判断奖励是否已领取
            if(r1.result.data[0].isTask[i]==1){
                this.setData({
                    ['taskBtn['+i+']']:"已完成",
                    ['btn_bg_color['+i+']']:"#ffffff", 
                    ['btn_color['+i+']']:"#c6c3c3",
                    ['after_task_btn['+i+']']:true
                })
            }
            //累计签到的天数>任务要求,且未领取奖励
            else if(r1.result.data[0].daySum>=this.data.tasknumArr[i]){
                this.setData({
                    ['taskBtn['+i+']']:"领取",
                    ['btn_bg_color['+i+']']:"#ff8800", 
                })
            }else{
                this.setData({
                    ['taskBtn['+i+']']:[r1.result.data[0].daySum+'/'+this.data.tasknumArr[i]],
                    ['after_task_btn['+i+']']:true
                })
            }
        }
    })

    
        
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1 < 10 ? "0" + String(now.getMonth() + 1) : now.getMonth() + 1;
    t.dateInit();
    t.setData({
      year: year,
      month: Number(month),
      isToday: '' + year + month + now.getDate()
    });
    t.yesdate()
    
    //标记当前待日期
    if(this.data.isSignin == false){
        var time = util.formatDate(new Date())
        this.setData({
            nowDay: time+t.data.arrDiff
        })
    }
    this.renewShow();

    
    
    

    
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
    this.renewShow();
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
