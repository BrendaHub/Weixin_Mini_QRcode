var express = require('express')
var router = express.Router()
var fs = require('fs');
var path = require('path');

var createQrCode = require('../utils/qrcode.js');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/fs', function (req, res) {
    fs.readFile(path.join(__dirname, "./wx.jpg"), function(err, originBuffer) {
        if (err) {
            console.log('err', err);
        }    
        // console.log(Buffer.isBuffer(originBuffer));  // true  图片buffer
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': "attachment; filename=test.jpg"
        });
        res.end(Buffer.from(originBuffer))
        // res.send('Birds home page')
    })

})
// define the about route
router.get('/', function (req, res) {
    res.render('home')
})


router.get('/qrcode', function (req, res) {
    var params = req.query || {}
    try {
        createQrCode.create(params).then(response => {
            /**
             * response 是可读流、接口返回的
             * res  是可写流、即将返回的数据
             * pipe 将流通过管道流入到可写流
             */

            // 2. 可读文件流操作方法
            // 微信第一种方法返回的是 可读可写流
            let fileName = "attachment; filename=" + "code=" + req.query.sourceCode + "_source=" + encodeURI(req.query.source) + ".jpg"

            // 设置文件格式
            // 解决方法 https://www.designedbyaturtle.co.uk/how-to-force-the-download-of-a-file-with-http-headers-and-php/?tdsourcetag=s_pctim_aiomsg
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': (fileName),
            });
            response.pipe(res)
            /*            // 创建一个可写流文件
                               var fileWriter=fs.createWriteStream('05.png');
                               // response 为一个可读流
                               // 将可读流插入到可写流管道中
                               response.pipe(fileWriter) */



            /*             response.on('data', function(resData) {
                            fileWriter.write(resData, function(err) {
                                console.log('err', err);
                            })
                        }).on('end', function(){
            
                        }) */


        });
    } catch (e) {
        console.log('e', e);

    }
})


module.exports = router