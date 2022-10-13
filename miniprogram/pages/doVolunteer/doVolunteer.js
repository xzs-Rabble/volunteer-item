// pages/doVolunteer/doVolunteer.js
var util = require('../utiils/getDate.js')
var searchInput = '' //输入搜索框内容
var confirmInput = '' // 搜索后的搜索框内容
var region = '' //获取地区内容
var projectkind =''
var provinces = [] //获取地区信息
var multiIndex= [0,0,0] //存放 多列选择器下标
var multiArray=[] //存放省/市/区
var cate=''; //用来保存picker组件选中的类别名称
var cateid='';//用来保存picker组件选中的类别id
var sort=''; //用来保存picker组件选中的排序名称
var sortid='';//用来保存picker组件选中的排序id
Page({
    /**
     * 页面的初始数据
     */
    data: {
        multiArray:[], //multiArray代表显示的[省,市,区]数组
        multiIndex:[0,0,0], //multiIndex代表滑动后定位的下标数组
        projectList:[], //存放活动数据
        search_list:[], //存放输入框内的输入的文字
        flag: true, //判断交易 求物切换点击事件 是否执行 防止连续二次点击
        searchFlag:true,//判断搜索是否执行 防止二次点击事件
        tableName : "project", //数据库表名
        bd : wx.cloud.database, //数据库
        cateArray:[
          {id:'1', cate:'社区服务'},{id:'2',cate:'敬老助残'},{id:'3', cate:'教育'},{id:'4',cate:'三下乡'},{id:'5', cate:'疫情防控'},{id:'6', cate:'扶贫'}],
        cateIndex:0,
        sortArray:[
          {id:'1', sort:'浏览人数最多'},{id:'2',sort:'开始时间先后'}],
        sortIndex:0,
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

    //展示所有活动点击事件
    all(){
      setTimeout(() => {
        wx.showToast({
          title: 'loading'
        });
        setTimeout(() => {
          wx.hideToast();
        }, 300)
      }, 0);
      wx.cloud.database().collection('project').get()
      .then(res => {//请求成功
          console.log('请求成功',res.data)
          for(var a = 0; a< res.data.length;a++){
            res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
            res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
          }
          this.setData({
              projectList:res.data
          })
      })
      .catch(err => {//请求失败
          console.log('请求失败',err)
      })
    },
    getCityInfo: function(){
      wx.showLoading({
        title: 'Loading...',
      })
      setTimeout(() => {
        this.setData({
          searchFlag: true
        })
      }, 300)
      const db = wx.cloud.database()
      //因为数据库只存有一个总的数据字典，所以指定它的ID直接获取数据
      var that = this
      db.collection('cityDataArr').doc('34586bfd627de3a201fcbe2858091ed0').get({
        success: res => {
          wx.hideLoading();
          if (res.data){
            //获取云数据库数据
            var temp = res.data.data;
            provinces =temp;
            //初始化更新数据
            that.setData({
              provinces: temp,
              multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
              multiIndex: [0, 0, 0],
              
            })
          }
        },
        fail: err => {
          wx.hideLoading();
          console.error(err)
        }
      })     
    },
    //点击地区确定点击事件
    bindMultiPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      console.log(provinces[e.detail.value[0]],provinces[e.detail.value[1]].citys,provinces[e.detail.value[0]].citys[e.detail.value[1]].areas[e.detail.value[2]])
      region = provinces[e.detail.value[0]].citys[e.detail.value[1]].areas[e.detail.value[2]].name
      this.setData({
        multiIndex: e.detail.value
      })
      console.log(region)
      this.loadProjectRegionInformation()
      
    },
    //滑动
    bindMultiPickerColumnChange: function(e){
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      //更新滑动的第几列e.detail.column的数组下标值e.detail.value
      data.multiIndex[e.detail.column] = e.detail.value;
      //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
      if (e.detail.column == 0){
        data.multiIndex = [e.detail.value,0,0];
      } else if (e.detail.column == 1){
        //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
        data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
      } else if (e.detail.column == 2) {
        //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
        data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
      }
      var temp = this.data.provinces;
      data.multiArray[0] = temp;
      if ((temp[data.multiIndex[0]].citys).length > 0){
        //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
        data.multiArray[1] = temp[data.multiIndex[0]].citys;
        var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
        //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
        data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
      }else{
        //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
        data.multiArray[1] = [];
        data.multiArray[2] = [];
      }
      //data.multiArray = [temp, temp[data.multiIndex[0]].citys, temp[data.multiIndex[0]].citys[data.multiIndex[1]].areas];
      //setData更新数据
      this.setData(data);
    },
    ///先对cate与cateid进行初始化picker组件的默认值
    //如果用户没有点击按钮选择类别时，才能将cate的值设置为组件中的默认值
    getcateInfo:function(){
      var cindex=this.data.cateIndex
      cate=this.data.cateArray[cindex].cate
      cateid=this.data.cateArray[cindex].id
    },
    // 活动类型确定事件
    bindCatePickerChange: function (e){
    var cname=this.data.cateArray[e.detail.value].cate;
    var cid=this.data.cateArray[e.detail.value].id;
    cate=cname;
    cateid=cid
    projectkind =cate
    console.log('cate:',projectkind)
    console.log('乔丹选的是', cname)

    this.loadProjectCateInformation()
    //下面重新赋值必须有，页面显示的信息才会改为刚刚选中的值
    this.setData({
      cateIndex: e.detail.value,     
    }) 
    },
    add: function (e) {
      projectkind=cate;
      console.log("活动类别："+projectkind)
    },
    //排序确定事件
    getsortInfo:function(){
      var cindex=this.data.sortIndex
      sort=this.data.sortArray[cindex].sort
      sortid=this.data.sortArray[cindex].id
    },
    bindsortPickerChange: function (e){
      var sname=this.data.sortArray[e.detail.value].sort;
   
    var sid=this.data.sortArray[e.detail.value].id;
    sort=sname;
    sortid=sid
    console.log('sort:',sort)
    console.log('选的是', sname)
    //下面重新赋值必须有，页面显示的信息才会改为刚刚选中的值
    this.setData({
      sortIndex: e.detail.value,     
    }) 
    var sortname=sort;
    console.log("排序类别："+sortname)
    
    if(sort == "浏览人数最多")[
      console.log(111111111),
      this.locadProjectAttentionInformation()

    ]
    else if(sort == "开始时间先后")[
      console.log(2222222),
      this.loadProjectDateInformation()
    ]
    },
    // add: function (e) {
    //   var sortname=sort;
    //   console.log("排序类别："+sortname)
    // },





    //搜索输入框 获取输入框数据
    searchInput(e){
        searchInput = e.detail.value
        confirmInput = ''
    },

    //确定搜索内容
    searchTap() {
        this.setData({
            searchFlag: false
          })
          confirmInput = searchInput
          this.loadProjectInformation()
          setTimeout(() => {
            this.setData({
              searchFlag: true
            })
          }, 300)
    },
    //加载地区数据
    loadProjectInformation(){
      console.log("11111")
      console.log(confirmInput)
      this.setData({
        projectList:[]
      })
      var db = wx.cloud.database()
      const _ =db.command

      db.collection("project")
      .where(_.or([{
        projectName: db.RegExp({
          regexp: confirmInput,
          options: 'm'
        })
      }, {
        projectDecs: db.RegExp({
          regexp: confirmInput,
          options: 'm'
        })
      }
    ]))
      .get()
      .then(res => {
        console.log('请求成功',res.data)
        for(var a = 0; a< res.data.length;a++){
          res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
          res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
        }
        this.setData({
          projectList:res.data
          
        })

       wx.stopPullDownRefresh()
       wx.hideLoading()
        })
    },
    //加载地区数据
    loadProjectRegionInformation(){
      this.setData({
        projectList:[]
      })
      var db = wx.cloud.database()
      const _ =db.command
      db.collection("project")
      .where({
        projectLocal:region
      })
      .get()
      .then(res => {
        console.log('请求成功',res.data)
        for(var a = 0; a< res.data.length;a++){
          res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
          res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
        }
        this.setData({
          projectList:res.data
        })
       wx.stopPullDownRefresh()
       wx.hideLoading()
        })
    },
    //加载类型数据
    loadProjectCateInformation(){
      console.log("11111")
      console.log(confirmInput)
      this.setData({
        projectList:[]
      })
      var db = wx.cloud.database()
      const _ =db.command
      db.collection("project")
      .where({
        projectKind:projectkind
      })
      .get()
      .then(res => {
        console.log('请求成功',res.data)
        for(var a = 0; a< res.data.length;a++){
          res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
          res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
        }
        this.setData({
          projectList:res.data
          
        })
       wx.stopPullDownRefresh()
       wx.hideLoading()
        })
    },

    //加载时间排序数据
    loadProjectDateInformation()
    {
      var db = wx.cloud.database()
      db.collection("project")
      .orderBy('projectStartDate','desc')
      .get()
      .then(res => {
        console.log('请求成功',res.data)
        for(var a = 0; a< res.data.length;a++){
          res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
          res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
        }
        console.log(res)
        this.setData({
          projectList:res.data
        })
       wx.stopPullDownRefresh()
       wx.hideLoading()
        })
    },
    //按照浏览人数数量排序
    locadProjectAttentionInformation(){
      var db = wx.cloud.database()
      db.collection("project")
      .orderBy('projectAttention','desc')
      .get()
      .then(res => {
        console.log('请求成功',res.data)
        for(var a = 0; a< res.data.length;a++){
          res.data[a].projectStartDate = res.data[a].projectStartDate.toLocaleDateString();
          res.data[a].projectEndDate = res.data[a].projectEndDate.toLocaleDateString();
        }
        console.log(res)
        this.setData({
          projectList:res.data
        })
       wx.stopPullDownRefresh()
       wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
            // wx.cloud.database().collection('project').get()
            // .then(res => {//请求成功
            //     console.log('请求成功',res.data)
            //     for(var a = 0; a< res.data.length;a++){
            //       res.data[a].projectStartDate = util.formatTime(res.data[a].projectStartDate);
            //       console.log(res.data[a].projectStartDate)
            //       res.data[a].projectEndDate = util.formatTime(res.data[a].projectEndDate)
                  
            //     }
            //     this.setData({
            //         projectList:res.data
                    
            //     })
            // })
            // .catch(err => {//请求失败
            //     console.log('请求失败',err)
            // })  
            // this.getCityInfo();   
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
      wx.cloud.database().collection('project').get()
            .then(res => {//请求成功
                console.log('请求成功',res.data)
                for(var a = 0; a< res.data.length;a++){
                    res.data[a].projectStartDate = util.formatTime(res.data[a].projectStartDate);
                    console.log(res.data[a].projectStartDate)
                    res.data[a].projectEndDate = util.formatTime(res.data[a].projectEndDate)
                }
                this.setData({
                    projectList:res.data
                    
                })
            })
            .catch(err => {//请求失败
                console.log('请求失败',err)
            })  
            this.getCityInfo();   
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