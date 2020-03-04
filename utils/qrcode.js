var fs = require('fs');
var request = require('request');
// var wx_conf = require('../config/wx_conf');//微信appid跟appSecret
// console.info(wx_conf.appId + "    " + wx_conf.appSecret)
var AccessToken = {
    grant_type: 'client_credential',
    appid: 'wxbbad491690af0212',//wx_conf.appId,
    secret: '87cea71198666e286feada8be9f62218',//wx_conf.appSecret
}
// 获取小程序凭证-官方文档 https://developers.weixin.qq.com/miniprogram/dev/api/getAccessToken.html
var wx_gettoken_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' + AccessToken.grant_type
//请求二维码的参数  
var postData = {
    path: "pages/index/index?", 
    width: 430
}
var createQrcode = {
    create: function (params) {
        this.params = params
        console.log('fn：create');
        return this.getToken();
    },
    //获取微信的token  
    getToken: function () {
        console.log('fn：getToken');
        var that = this;
        return new Promise((resolve, reject) => {
            console.log('进入Promise方法了');
            request({
                method: 'GET',
                url: wx_gettoken_url + '&appid=' + this.params.appId + '&secret=' + this.params.appSecret
            }, function (err, res, body) {
                if (res) {
                    resolve(that.getQrcode({
                        isSuccess: true,
                        data: JSON.parse(body)
                    }))
                } else {
                    console.log(err);
                    reject({
                        isSuccess: false,
                        data: err
                    });
                }
            })
        })
    },
    //生成二维码  
    //   获取二维码官方凭证
    getQrcode: function (proData) {
        console.log('fn：getQrcode');
        if (proData.isSuccess) {

            var path = postData.path + 'source=' + this.params.source + '&code=' + this.params.sourceCode

            var resquestBody = JSON.stringify(Object.assign({}, postData, {path: path}));
            // API https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html
            
            return request({
                method: 'POST',
                url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + proData.data.access_token, // 第一种方法
                // url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + proData.data.access_token,  // 第三种
                body: resquestBody
            })
            // .pipe(fs.createWriteStream('./public/images/index' + (Math.random() * 100 << 5) + '.png'));//路径自己定义吧  
        } else {
            console.log('Promise请求数据出错');
        }
    }
}
module.exports = createQrcode;//暴露对象，调用create方法既可以创建二维码