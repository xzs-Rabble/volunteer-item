var util = require('../../utiils/getDate.js')
const db = wx.cloud.database()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image:"/images/addactivity.png",
        myImage:"",
        //活动名称
        act_name:"",
        //组织选择
        organList:['北京市某某大学','广州市某某大学','广州市志愿服务团体'],
        //当前组织
        organ_name:"北京市某某大学",
        //报名截止时间
        date1:util.formatTimeDate(new Date()),
        //活动开始时间
        date3:"",
        //活动截止时间
        date2:"",
        //活动类型下拉框
        select_type:false,
        myType:"未选择",  //已选类型
        typeList:['社区服务','敬老助残','教育','三下乡','疫情防控','扶贫'],
        //电话
        myPhone:"",
        phoneToast:"",
        //活动所在地
        data3:[],
        //持续天数
        myDate:0,
        //活动积分
        myIntergral:0,
        //备注
        myRemark:"",
        //检测有无空值
        state:true,
        btn_color:"#d1d1d1",
        btn_txt_color:"#8e8e8e"
    },

    //封面图片
    chooseImage:function(){
        var that = this
        wx.chooseImage({
            count: 2,  
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function(res){
                // success
                console.log(res)
                var temp = res.tempFiles
                var filePath = res.tempFilePaths[0]
                for(var i = 0;i<temp.length;i++){
                    if(temp[i].size <= 2000000){ //限制上传图片大小为2M,所有图片少于2M才能上传
                        if(temp.length > 1){
                            wx.showToast({
                                title:'上传图片不能超过1张!',
                                icon:'none'    
                            })
                        }else{
                            that.setData({
                                image:filePath
                            })
                        }
                        
                    }else{
                        wx.showToast({
                            title:'上传图片不能大于2M!',
                            icon:'none'    
                        })
                        return 0
                    }
                    
                }
            },
        })
        
        that.btn_huixian()
    },
    cloudFile(path){
        var that = this
        var bmTime = new Date(that.data.date1)
        var hdTime = new Date(that.data.date2)
        console.log(bmTime + "|" + hdTime)
        wx.showLoading({
          title: '发布中...',
          mask:true,
        })
        wx.cloud.uploadFile({
            cloudPath:Date.now() + ".jpg",
            filePath:path
        }).then(res=>{
            console.log("图片上传成功" + res)
            that.data.myImage = res.fileID
            wx.hideLoading({
              success: (r) => {
                  wx.showToast({
                    title: '发布成功',
                  })
              },
            })
            db.collection('project').add({
                data:{
                    city:that.data.data3[0]+that.data.data3[1],
                    continue:that.data.myDate,
                    intergral:that.data.myIntergral,
                    organization:that.data.organ_name,
                    people:[],
                    phone:that.data.myPhone,
                    pic:that.data.myImage,
                    projectAttention:0,
                    projectDecs:that.data.myRemark,
                    projectEndDate:hdTime,
                    projectStartDate:bmTime,
                    projectKind:that.data.myType,
                    projectLocal:that.data.data3[2],
                    projectName:that.data.act_name,
                }
            }).then(r1=>{
                wx.cloud.callFunction({
                    name:'updateUserAct',
                    data:{
                        docid:app.globalData.userInfo._id,
                        actid:r1._id,
                        act_state:-1
                    }
                }).then(r2=>{
                    wx.navigateBack({
                      delta: 1,
                    })
                })
            })
        })
    },

    //活动名称
    actNameAction:function(e){
        let txt = e.detail.value;
        this.data.act_name = txt
        console.log("活动名称:" + this.data.act_name)
        this.btn_huixian()
    },

    //组织选择
    changeOrgan:function(e){
        console.log(e)
        this.setData({
            organ_name:this.data.organList[e.detail.value],
        })
        this.btn_huixian()
    },
    //报名截止时间
    changeBMtime:function(e){
        this.setData({
            date1:e.detail.value
        })
        this.btn_huixian()
    },
    //活动开始时间
    changeHDKStime:function(e){
        this.setData({
            date3:e.detail.value
        })
        this.btn_huixian()
    },
    //活动截止时间
    changeHDJZtime:function(e){
        if(e.detail.value <= this.data.date3){
            wx.showToast({
              title: '截止时间不能小于等于开始时间！',
              icon:'none'
            })
        }else{
            var ks = this.data.date3.split("-")
            var jz = e.detail.value.split("-")
            console.log(parseInt(ks[1]))
            console.log(parseInt(jz[1]))
            if(ks[1] == jz[1]){
                this.data.myDate = parseInt(jz[2])-parseInt(ks[2])
            }else{
                this.data.myDate = 30*(parseInt(jz[1])-parseInt(ks[1]))+parseInt(jz[2])-parseInt(ks[2])
            }
            this.setData({
                date2:e.detail.value
            })
        }
        this.btn_huixian()
        
    },
    //类型下拉
    bindType(){
        this.setData({
            select_type:!this.data.select
        })
    },
    //已选类型下拉
    myTypeSelect(e){
        console.log(e)
        var type = e.currentTarget.dataset.type
        this.setData({
            myType:type,
            select_type:false
        })
        this.btn_huixian()
    },
    //联系方式
    actPhoneAction:function(e){
        var myreg = /^1\d{10}$/;
        var phone = e.detail.value;
        var temp;
        if(!myreg.test(phone)){
            temp = "手机号格式错误"
            this.data.myPhone = ""
        }else{
            temp = ""
            this.data.myPhone = phone
        }
        this.setData({
            phoneToast:temp
        })
        console.log("联系方式:" + this.data.myPhone)
        this.btn_huixian()
    },
    //活动所在地
    changeRegion:function(e){
        console.log(e.detail.value)
        console.log(e.detail.code)
        var tempValue = e.detail.value
        var temp = e.detail.code
        if(temp[1] == "110100" || temp[1] == "120100" || temp[1] == "310100" || temp[1] == "500100" || temp[1] == "810100" || temp[1] == "820100"){
            tempValue[1] = ""
        }
        this.setData({
            data3:tempValue
        })
        this.btn_huixian()
    },
    //活动积分奖励
    intergralAction:function(e){
        var regNum = new RegExp('[0-9]','g');
        var rsNum = regNum.exec(e.detail.value);
        if(!rsNum){
            this.data.myIntergral = 0
            setTimeout(()=>{
                wx.showToast({
                  title: '只能输入数字',
                  icon:'none'
                })
                return "0";
            })
        }else{
            this.data.myIntergral = e.detail.value
        }
        this.btn_huixian()
    },
    //备注
    remarkInputAction:function(e){
        console.log(e.detail.value)
        this.data.myRemark = e.detail.value
    },

    //保存发布数据
    btn_save:function(){
        var that = this
        wx.showModal({
            title:'提示',
            content:'确认发布吗?',
            success(r){
              if(r.confirm){
                that.cloudFile(that.data.image)
                
              }
            }
        })
    },


    //按钮回显
    btn_huixian:function(){
        if(this.data.act_name!=""&& this.data.date3!="" && this.data.date2!="" && this.data.myType!="未选择" && this.data.myPhone!="" && this.data.data3.length>0 && this.data.myIntergral != 0 && this.data.image != "/images/addactivity.png"){
            this.setData({
                state:false,
                btn_color:"#ffbb00",
                btn_txt_color:"#ffffff"
            })
        }else{
            this.setData({
                state:true,
                btn_color:"#d1d1d1",
                btn_txt_color:"#8e8e8e"
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