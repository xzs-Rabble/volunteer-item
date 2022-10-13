// app.js

var util = require("pages/utiils/util.js");
App({
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env: "？？？",
    });

    //获取用户openid
    var that = this;
    wx.cloud.callFunction({
      name: "get_openid",
      success(res) {
        console.log(res);
        that.globalData.openid = res.result.openid;
        console.log("app里面的openid:" + that.globalData.openid);

        //查找数据库用户表中是否有这个用户记录
        wx.cloud
          .database()
          .collection("user")
          .where({
            _openid: res.result.openid,
          })
          .get({
            success(result) {
              console.log("app的js用户信息：" + result.data[0]);
              that.globalData.userInfo = result.data[0];
              that.globalData.openid = result.data[0]._openid;
            },
          });
      },
    });

    //聊天
    that.http_session = "";
    return (that.promise = new Promise(function (resolve) {
      // that.webS_url = 'ws://192.168.199.147:7041';//填你请求的地址
      // that.httpUrl = 'http://192.168.199.147:7051'//填你请求的测试
      wx.login({
        success: function (res) {
          var data = {
            code: res.code,
          };
          if (res.code) {
            //发起网络请求
            var url = that.httpUrl + "/v1/user/login.do";
            util.request(
              url,
              "POST",
              data,
              "",
              function (res) {
                console.log(res);
                that.http_session = res.data.body;
                resolve(that.http_session);
              },
              function (err) {
                console.log(err);
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    }));
  },
  globalData: {
    userInfo: null,
    user_interal_list: null,
    openid: null,
  },
  // 提交formid
  form_id_bg: function (formId) {
    console.log("form_id_bg执行了");
    let url = this.httpUrl + "/v1/formid/saveFormid.do";
    this.promise.then(function (http_session) {
      let data = {
        session: http_session,
        // minipid: '10000',
        formId: formId,
      };
      util.request(url, "post", data, "", function (res) {});
    });
  },
  onShow: function (even) {
    var e;
    // if (even.referrerInfo.extraData && even.referrerInfo.extraData.foo) {
    //   e = even.referrerInfo.extraData.foo
    // }
    if (e && e.appid) {
      this.appid = e.appid;
    }
  },
});
