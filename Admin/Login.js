const decrypt = require('../Utils/RSA-Decrypt.js'),
      path = require('path'),
      session = require('express-session'),
      md5 = require('md5');

const sqlhelper = require('../Utils/SqlHelper');

function view(req,res) {
    res.sendFile(path.resolve('public/admin/login.html'));
}

async function action(req,res) {
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.send('输入不能为空!');
        return;
    }
    password = decrypt(password);
    if(username.length > 10 || password.length > 18){
        res.send('非法输入!');
        return;
    }
    password = md5(password);
    username = encodeURIComponent(username);
    try {
        data = await sqlhelper.selectTableItem('admins', `where name = '${username}'`, ['password']);
        if(data.length == 0)
            res.send('不存在该用户!');
        else if(data[0].password != password)
            res.send('密码错误!');
        else{
            req.session.login = data[0].id;
            req.session.adminname = username;
            res.send('登录成功!')
        }
    } catch (error) {
        console.log(error);
        res.send('未知错误!');
    }
}

module.exports = {
    view,
    action
}