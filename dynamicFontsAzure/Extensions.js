"use strict";
const chalk = require("chalk");
const dateFormat = require("dateformat");
var packageInfo = require('./package.json');
var appSetting = require('./appsetting.json');
var rowIndex = -1;
module.exports = {
    log: log,
};
function log(message, ...params) {
    if (rowIndex >= process.stdout['rows'] - 1 || rowIndex == -1) {
        console.log('\x1Bc');
        try {
            process.stdout['cursorTo'](0, 0);
        }
        catch (e) { }
        rowIndex = 0;
        console.log("dynamicFonts " + chalk.green("v%s"), packageInfo.version);
        console.log("====================");
        console.log("服務端口: " + chalk.yellow("%d"), appSetting.port);
        console.log("====================");
        rowIndex = 4;
    }
    var temp = ["%s\t" + message].concat([dateFormat(new Date(), "yyyy/mm/dd HH:MM:ss")].concat(params));
    console.log.apply(null, temp);
    rowIndex++;
}
//# sourceMappingURL=Extensions.js.map