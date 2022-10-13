// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempVoiceFilePath;
let sum = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '请问您有什么疑问吗？'
    },
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    scrollHeight: '100vh',
    inputBottom: 0,
    //获取文本
    txt:"",
    //最后的值
    last_txt:"",
    //语音
    voiceHidden:false,
    voiceItems:{bindtap:'sendVoice',txt:'长按录音'},
    voice:'',
    icon_voice:"icon_voice",
    //录音
    voicePic:"/images/big_voice.png",
    voiceing_txt:"长按录音",
    startTime:0,
    stopTime:0,

  },

  //获取输入框文本
  txt:function(e){
      this.setData({
          txt:e.detail.value
      })
  },
//录音开始
startVoice(e){
    this.setData({
        voicePic:"/images/big_voiceing.png",
        voiceing_txt:"松开发送..."
    })
    console.log(e)
    this.data.startTime = e.timeStamp
    const options = {
        duration: 10000,//指定录音的时长，单位 ms
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 96000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      }
      //开始录音
      recorderManager.start(options);
      recorderManager.onStart(() => {
        console.log('recorder start')
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
      })
},
//录音结束
stopVoice(e){
    console.log(e)
    this.setData({
        voicePic:"/images/big_voice.png",
        voiceing_txt:"长按录音"
    })
    this.data.stopTime = e.timeStamp
    if((this.data.stopTime - this.data.startTime) >= 1000){
        this.data.startTime = 0
        this.data.stopTime = 0
        recorderManager.stop();
        recorderManager.onStop((res) => {
        this.tempVoiceFilePath = res.tempFilePath;
        console.log('停止录音', res)
        // const { tempFilePath } = res
        msgList.push({
            speaker: 'customer',
            contentType: 'voice',
            content: this.tempVoiceFilePath,
            dur_Time:parseInt(res.duration/1000)
        })
        inputVal = '';
        this.setData({
            msgList,
            inputVal,
        });

    })
        console.log("1秒")
    }else{
        wx.showToast({
            title:'发送语音不能少于1秒!',
            icon:'none'    
        })
    }
},
//播放录音
playVoice:function(e){
    innerAudioContext.autoplay = true
    innerAudioContext.src = e.currentTarget.dataset.value,
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
        wx.showToast({
            title: '语音播放中',
            icon:'none',
            duration:3000
        })
    })
    innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
    })
    
},
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var last_mag = wx.getStorageSync('last_mag')
    var dfImage,dfTxt;
    sum = sum+1;
    console.log(sum)
    if(sum > 1){
        dfImage = "/images/off_msg.png"
        dfTxt = "你已成功报名志愿活动“大山村“美丽乡村·幸福家园”志愿服务活动”，请耐心等待面试通知。"
    }else{
        dfImage = app.globalData.userInfo.friend[0].pic
        dfTxt = "请问您有什么疑问吗？"
    }
    initData(this);
    this.setData({
        'msgList[0].content':dfTxt,
        cusHeadIcon: app.globalData.userInfo.avatarUrl,
        serHeadIcon:dfImage,
        icon_voice:this.data.icon_voice,
        last_mag:last_mag
    });


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //语音上拉菜单
  btn_voice:function(){
    this.data.voiceHidden = true
    this.setData({
        voiceHidden:this.data.voiceHidden,
        icon_voice:"icon_voice1",
    })
  },
  //点击空白隐藏
  voice_null_hidden:function(){
    let state = this.data.voiceHidden
    if(state == true){
        this.data.voiceHidden = false
        this.setData({
            voiceHidden:this.data.voiceHidden,
            icon_voice:"icon_voice",
        })
    }
  },
//发送图片
btn_pic:function(){
    var that = this
    wx.chooseImage({
        count: 4,  
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
            // success
            console.log(res)
            var temp = res.tempFiles
            for(var i = 0;i<temp.length;i++){
                if(temp[i].size <= 2000000){ //限制上传图片大小为2M,所有图片少于2M才能上传
                    if(temp.length > 3){
                        wx.showToast({
                            title:'上传图片不能超过3张!',
                            icon:'none'    
                        })
                    }else{
                        msgList.push({
                            speaker: 'customer',
                            contentType: 'img',
                            content: temp[i].path
                        })
                        inputVal = '';
                        that.setData({
                            msgList,
                            inputVal
                        });
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
    
   
},
  
//发送视频
btn_video:function(){
    let that = this
    //1.拍摄视频或从手机相册中选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back',//默认拉起的是前置或者后置摄像头，默认back
      compressed: true,//是否压缩所选择的视频文件
      success: function(res){
        console.log(res)
        // let tempFilePath = res.tempFilePath//选择定视频的临时文件路径（本地路径）
        // let duration = res.duration //选定视频的时间长度
        // let height = res.height //返回选定视频的高度
        // let width = res.width //返回选中视频的宽度
        if(res.size > 20000000){
          wx.showToast({
            title: '上传的视频大小超限，超出20MB,请重新上传',
            //image: '',//自定义图标的本地路径，image的优先级高于icon
            icon:'none'
          })
        }else{
            msgList.push({
                speaker: 'customer',
                contentType: 'video',
                content: res.tempFilePath
            })
            inputVal = '';
            that.setData({
                msgList,
                inputVal,
                videoImg:res.thumbTempFilePath
            });
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

},

  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function(e) {
    var txt = this.data.txt
    msgList.push({
        speaker: 'customer',
        contentType: 'text',
        content: txt
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });


  },

  /**
   * 退回上一页
   */
  toBackClick: function() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length-2]
    console.log("上一页")
    prevPage.setData({
        msg:"[视频]"
    })
    wx.navigateBack({
        delta:1
    })
  }

})
