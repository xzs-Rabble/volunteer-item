const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        peopleList:[
            {
                user_name:"刘一",
                user_grade:4,
                user_severtime:389,
                user_phone:"10086100861",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },
            {
                user_name:"陈二",
                user_grade:1,
                user_severtime:7,
                user_phone:"20086100861",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },
            {
                user_name:"张三",
                user_grade:6,
                user_severtime:1003,
                user_phone:"11451411451",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },
            {
                user_name:"李四",
                user_grade:3,
                user_severtime:256,
                user_phone:"15678902222",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },
            {
                user_name:"王五",
                user_grade:2,
                user_severtime:13,
                user_phone:"11366227455",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },
            {
                user_name:"赵六",
                user_grade:2,
                user_severtime:34,
                user_phone:"11186883886",
                user_pic:"/images/default.png",
                act_name:"法治惠乡村，扶智促振兴——法律诊所志愿项目",
                state:0,//0代表报名，1代表录取，-1代表面试失败
                checked:false
            },

        ],
        checkedIds:[false,false,false,false,false,false], // 选中的id列表,
        checkedAll:false,
        //点击选中的用户信息
        checkUser:{},
        checkUser_state:false,
    },

    //导出表格
    exportExcel(){
        let that = this
        wx.showModal({
            title:'提示',
            content:'确认导出吗？',
            success(result){
                if(result.confirm){
                    wx.showLoading({
                        title: '正在加载...',
                    })
                    console.log('请求获取')
                    wx.cloud.callFunction({
                        name:'exportExcel',
                        data:{
                            data:that.data.peopleList
                        }
                    }).then(res=>{
                        console.log(res)
                        let fileID = res.result.fileID
                        wx.cloud.getTempFileURL({
                            fileList:[fileID],
                            success:r1=>{
                                that.setData({
                                    fileUrl:r1.fileList[0].tempFileURL
                                })
                                wx.downloadFile({
                                    url: r1.fileList[0].tempFileURL,
                                    success:function(r2){
                                        const filePath = r2.tempFilePath
                                        wx.openDocument({
                                          filePath: filePath,
                                        })
                                    }
                                })
                            }
                        })   
                    })
                    wx.hideLoading({
                        success: (cg) => {
                          wx.showToast({
                              title: '导出成功',
                          })
                        },
                    })
                }
            }
        })
    },

    //点击查看用户信息
    btn_userInfo:function(e){
        console.log(e)
        let id = e.currentTarget.dataset.i;
        this.setData({
            checkUser_state:true,
            checkUser:this.data.peopleList[id],
        })
    },
    //点击空白隐藏
    hidden_info:function(){
        this.setData({
            checkUser_state:false
        })
    },

// 复选框change事件
    checkboxChange(e) { 
        console.log(e)
        let id = e.currentTarget.dataset.index;
        if(this.data.checkedIds[id] == false){
            this.data.checkedIds[id] = true
        }else{
            this.data.checkedIds[id] = false
        }
        console.log(this.data.checkedIds)
        
        
    },

    // 全选框
      selectAll(e){ 
        console.log(e)
        if (e.detail.value[0] ==="all") {
          console.log("全部选中");
          for(var i=0;i<this.data.peopleList.length;i++){
              if(this.data.peopleList[i].state==0){
                this.data.checkedIds[i] = true
              }
          }
          this.setData({
            checkedIds:this.data.checkedIds,
            peopleList:this.data.peopleList.map(item=>{item.checked = true;return item;})
          })
        }else { // 直接清空列表
          console.log("清空");
          this.setData({
            checkedIds:[false,false,false,false,false,false],
            peopleList:this.data.peopleList.map(item=>{item.checked = false;return item;})
          });
        }
        console.log(this.data.checkedIds);
      },

    //拷贝手机号
    copy:function(e){
        console.log(e)
        var temp = e.currentTarget.dataset.phone
        wx.setClipboardData({
          data: temp,
          success(res){
              wx.getClipboardData({
                success:function(r){
                    wx.showToast({
                      title: '复制成功',
                      icon:"none",
                    })
                }
              })
          }
        })
    },

    //录取
    admit:function(){
        
        var allNull = true //默认全空
        var that = this
        wx.showModal({
            title:'提示',
            content:'确认录取吗？',
            success(r1){
                if(r1.confirm){
                    for(var i=0;i<that.data.checkedIds.length;i++){
                        if(that.data.checkedIds[i]==true){
                            allNull = false
                            that.data.peopleList[i].state = 1
                            that.data.checkedIds[i] = false
                            var temp = that.data.peopleList[i]
                            console.log(temp)
                            wx.cloud.callFunction({
                                name:'updateAct',
                                data:{
                                    actid:"f6e08a64627f264a02ffea6e2488f7c0",
                                    user_id:"robot",
                                    user_name:temp.user_name,
                                    user_phone:temp.user_phone,
                                    sever_time:temp.user_severtime,
                                    user_grade:temp.user_grade
                                }
                            }).then(r=>{
                                console.log("成功")
                                
                                
                            })
                        }
                    }
                    console.log(that.data.peopleList)
                    
                    if(allNull==true){
                        wx.showToast({
                          title: '人员不能为空',
                          icon:'none'
                        })
                    }else{
                        wx.showToast({
                            title: '录取成功！',
                        })
                        that.setData({
                            peopleList:that.data.peopleList
                        })
                    }
                }
            }
          })
        
    },

    refuse:function(){
        var allNull = true //默认全空
        var that = this
        wx.showModal({
            title:'提示',
            content:'确认拒绝吗？',
            success(r1){
                if(r1.confirm){
                    for(var i=0;i<that.data.checkedIds.length;i++){
                        if(that.data.checkedIds[i]==true){
                            allNull = false
                            that.data.peopleList[i].state = -1
                            that.data.checkedIds[i] = false
                        }
                    }
                    console.log(that.data.peopleList)
                    if(allNull==true){
                        wx.showToast({
                          title: '人员不能为空',
                          icon:'none'
                        })
                    }else{
                        wx.showToast({
                            title: '拒绝成功',
                        })
                        that.setData({
                            peopleList:that.data.peopleList
                        })
                    }
                    
                }
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