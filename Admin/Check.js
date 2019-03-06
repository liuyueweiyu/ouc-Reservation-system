const sqlhelper = require('../Utils/SqlHelper');
async function add(req,res) {
    let data;
    try {
        data = await sqlhelper.insertItems('checkinfor',req.body);
        res.send(JSON.stringify({
            code: 0,
            msg: "添加成功！",
        }));
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            res.send(JSON.stringify({
                code: 1,
                msg: "导入已存在的学生，学号为" + error.message.match(/entry '(.*)' for/)[1]
            }))
        } else
            res.send(JSON.stringify({
                code: error.code,
                msg: error.msg || '未知错误!'
            }))
    }
}
async function delcheck(req,res) {
    let ids = req.body.id,
        data;
    try {
        data = await sqlhelper.deleteItems('checkinfor', ids);
        res.send(JSON.stringify({
            code: 0,
            msg: '删除成功!'
        }))
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }))
    }
    
}


module.exports = {
    add,
    delcheck
}