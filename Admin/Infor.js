// var update = require('../Utils/UpdateDB');
const sqlhelper = require('../Utils/SqlHelper');


async function resetPwd(req,res){     //重置密码
    let data;
    try {
        data = await sqlhelper.updateItem('admins',{
            password: require('md5')('OUCIT123')
        },req.body.id)
        res.send(JSON.stringify({
            code: 0 ,
            msg:'重置成功，密码为OUCIT123'
        }))
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }))
    }
}

async function getInfor(req,res) {    //获取管理员信息
    let data;
    try {
        data = await sqlhelper.selectTableItem('admins','where id='+req.session.login,['id','email','name']);
        res.send(JSON.stringify({
            code:0,
            data: data[0]
        }));
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }));
    }
}

function updateInfor(req,res) {     //更新管理员信息

    if(req.body.password)
        req.body.password = require('md5')(require('../Utils/RSA-Decrypt')(req.body.password));
    try {
        sqlhelper.updateItem('admins', req.body, req.session.login);
        res.send(JSON.stringify({
            code: 0,
            msg:'修改成功!'
        }));
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }));
    }
    
}

module.exports = {
    resetPwd,
    getInfor,
    updateInfor
}