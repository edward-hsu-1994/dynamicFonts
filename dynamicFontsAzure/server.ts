import express = require('express');
import Fontmin = require('fontmin');
import bodyParser = require('body-parser');
import chalk = require('chalk');

var packageInfo = require( './package.json');
var appSetting = require('./appsetting.json');
var extensions = require('./Extensions');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('wwwroot'));


var originTemp = appSetting.cors.map(x => x.protocol.map(y => y + "://" + x.host));
var origin = [];
for (var i = 0; i < originTemp.length; i++) {
    for (var j = 0; j < originTemp[i].length; j++) {
        origin.push(originTemp[i][j]);
    }
}

var route = express.Router();
route.post('/font/:fontName', (request, response) => {
    extensions.log("%s 要求產生字體 %s", request.ip, request.params.fontName);
    
    response.setHeader("Access-Control-Allow-Origin", origin.join(', '));

    if (!request.body.text || !request.params.fontName) {
        extensions.log("%s 遺漏參數", request.ip);
    }
    extensions.log("%s 開始產生字體檔案 %s", request.ip, request.params.fontName);

    var font = new Fontmin()
        .src('fonts/' + request.params.fontName + '.*')//取出字體
        .use(Fontmin.otf2ttf())
        .use(Fontmin.glyph({//擷取
            text: request.body.text
                .split('')
                .filter((v, i, a) => a.indexOf(v) === i && a[i].charCodeAt(0) >= 32)
                .join('')
        }))

    font.run(function (err, files) {
        if (err) {
            throw err;
        }
        extensions.log("%s 字體檔案產生成功 %s", request.ip, request.params.fontName);

        response.attachment('dynamic.ttf');
        files[0].pipe(response);
    });;
});
app.use('/api', route);


try {
    app.listen(process.env.port || appSetting.port);
    extensions.log("服務已啟動");   
} catch (e) {
    extensions.log(chalk.red("服務啟動失敗"));
    console.error(e);
}