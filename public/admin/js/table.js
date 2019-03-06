//获取table内容并转成二维数组（支持colspan和rowspan）
function getTabArray(tabId) {
    var data = [];
    var trs = document.querySelectorAll(tabId + ' tr');
    if(trs.length == 0) {
        return data;
    }
    //填充数组
    for (let i = 0; i < trs.length - 1; i++) {
        const element = trs[i];
        data[i] = [];
        for (let j = 0; j < element.childNodes.length - 1; j++) {
            const x = element.childNodes[j];
            data[i][j] = element.childNodes[j].innerText;
        }

    }

    return data;
}