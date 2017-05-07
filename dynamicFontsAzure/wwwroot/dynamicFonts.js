var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var activeText = {};
function addCloudFonts(...names) {
    for (var i = 0; i < names.length; i++)
        activeText[names[i]] = "";
}
var isFirst = true;
function loadFonts(...fonts) {
    return __awaiter(this, void 0, void 0, function* () {
        var allElement = document.body.getElementsByTagName("*");
        if (fonts.length == 0) {
            fonts = [];
            for (var font in activeText)
                fonts.push(font);
        }
        var textTable = {}; //要取得的字元
        for (var i = 0; i < fonts.length; i++)
            textTable[fonts[i]] = "";
        for (var i = 0; i < allElement.length; i++) {
            var fontFamily = (window.getComputedStyle(allElement.item(i)).getPropertyValue('font-family') || "")
                .split(',').map(x => x.trim()).filter(x => fonts.indexOf(x) > -1);
            if (fontFamily.length == 0)
                continue;
            if (allElement[i].tagName == "INPUT" || allElement[i].tagName == "TEXTAREA") {
                for (var j = 0; j < fontFamily.length; j++) {
                    textTable[fontFamily[j]] += allElement[i].value;
                }
            }
            else {
                for (var j = 0; j < fontFamily.length; j++) {
                    textTable[fontFamily[j]] += allElement.item(i).innerText;
                }
            }
        }
        if (isFirst) {
            for (var i = 0; i < fonts.length; i++) {
                activeText[fonts[i]] = "";
            }
            isFirst = false;
        }
        for (var font in activeText) {
            for (var i = 0; i < activeText[font].length; i++) {
                var regex = escapeRegExp(activeText[font][i]);
                textTable[font] = textTable[font].replace(new RegExp(regex, "g"), "");
            }
            textTable[font] = textTable[font].split('').filter((v, i, a) => a.indexOf(v) === i && a[i].charCodeAt(0) >= 32).join('');
        }
        return new Promise((resolve, reject) => {
            var ok = {};
            for (let font in textTable)
                ok[font] = false;
            for (let font in textTable) {
                if (textTable[font].length == 0)
                    continue;
                loadSignleFont(font, textTable[font])
                    .then(() => {
                    ok[font] = true;
                    let check = true;
                    for (let font2 in textTable) {
                        if (!ok[font2])
                            continue;
                    }
                    activeText[font] += textTable[font];
                    resolve();
                });
            }
        });
    });
}
function loadSignleFont(font, text) {
    return __awaiter(this, void 0, void 0, function* () {
        var allElement = document.body.getElementsByTagName("*");
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", location.origin + "/api/font/" + font, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.responseType = "blob";
            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4)
                    return;
                if (xhr.status == 200) {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(xhr.response);
                    reader.onloadend = function () {
                        var style = document.createElement("style");
                        style.innerHTML = '@font-face {' +
                            '   font-family: "' + font + '";' +
                            '   src: url(' + reader.result + ') format("truetype");font-style:normal;' +
                            '}';
                        document.head.appendChild(style);
                        resolve();
                    };
                }
                else {
                    reject(null);
                }
            };
            xhr.send(JSON.stringify({
                text: text
            }));
        });
    });
}
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
//# sourceMappingURL=dynamicFonts.js.map