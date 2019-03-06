const decrypt = require('../Utils/RSA-Decrypt.js'),
      path = require('path'),
      session = require('express-session'),
      md5 = require('md5');
      sqlhelper = require('../Utils/SqlHelper.js'),
      webconfig = require('../config/web.config.js'),
      mailhelper = require('../Utils/Mailhelper.js');
async function register(req,res) {
    const body = req.body;
    delete body['err[]'];
    let code;
    try {
        if (body.password == '')
            throw {code:1,msg:'密码为空!'};
        let data = await sqlhelper.selectTableCount('checkinfor', `where studentid='${body.studentid}' and name='${body.name}'`);
        if(data == 0)
            throw {code:1,msg:'暂无数据!'};
        data = await sqlhelper.selectTableCount('users', `where studentid='${body.studentid}'`);
        if(data != 0)
            throw {code:1,msg:'该账户已注册!'}
        const password = md5(decrypt(body.password));
        code = require('md5')(Math.random());
        data = await sqlhelper.insertItem('users',Object.assign(body,{password,code}));
        const mailOptions = {
            from: 'itstudio@stu.ouc.edu.cn',
            to: req.body.email,
            subject: '激活用户',
            text: '',
            html: `<h1>点击链接激活,如果激活失败请尝试复制链接后从浏览器中打开...<a href='${webconfig.IP}/active'?id=${data.insertId}&&code=${code}'>http://it.ouc.edu.cn/create/active?id=${data.insertId}&&code=${code}</a></h1>`
        }
        await mailhelper.sendMail(mailOptions);
        res.send({
            code: 0,
            msg: '注册成功!'
        });
    } catch (error) {
        res.send({
            code: 1,
            msg: error.msg||'未知错误!'
        });
    }
}

async function login(req,res) {
    const body = req.body;
    try {
        if (body.password == '')
            throw {code:1,msg:'密码为空!'};
        const password = md5(decrypt(body.password));
        let data = await sqlhelper.selectTableItem('users', ` where studentid='${body.studentid}' `, ['id','name','password']);
        if(data.length == 0)
            throw {code:1,msg:'账户不存在!'};
        if(data[0].password != password)
            throw {code:1,msg:'密码错误!'};
        req.session.user = data[0].id;
        req.session.username = data[0].name;
        res.send({
            code: 0,
            msg: '登录成功!'
        })
    } catch (error) {
        res.send({
            code: 1,
            msg: error.msg || '未知错误!'
        });
    }
}   
function logout(req,res) {
    req.session.user = null;
    req.session.username = null;
    res.send({
        code: 0,
        msg: '登出成功!'
    })
}
module.exports = {
    register,
    login,
    logout
}