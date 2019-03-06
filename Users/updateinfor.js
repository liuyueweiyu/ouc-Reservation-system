const decrypt  = require('../Utils/RSA-Decrypt'),
      sqlhelper = require('../Utils/SqlHelper'),
      webconfig = require('../config/web.config.js'),
      mailhelper = require('../Utils/Mailhelper.js');
async function submitinfor(req,res) {     
    let code;
    try {
        if (req.body.emailflag != '0'){
            let data = await sqlhelper.updateItem('users', {
                phonenumber: req.body.phonenumber,
                email: req.body.email
            },req.session.user);
            res.send(JSON.stringify({
                code: 1,
                msg: '修改成功！'
            }))
        }
        else{
            code = require('md5')(Math.random());
            let data = await sqlhelper.updateItem('users', {
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                status: 1,
                code
            }, req.session.user);
            const mailOptions = {
                from: 'itstudio@stu.ouc.edu.cn',
                to: req.body.email,
                subject: '激活用户',
                text: '',
                html: `<h1>点击链接激活,如果激活失败请尝试复制链接后从浏览器中打开...<a href='${webconfig.IP}/active'?id=${req.session.user}&&code=${code}'>${webconfig.IP}/active?id=${req.session.user}&&code=${code}</a></h1>`
            }
            mailhelper.sendMail(mailOptions);
            res.send(JSON.stringify({
                code: 0,
                msg: '修改成功！请去邮箱激活用户！'
            }))
        }
        
    } catch (error) {
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg||'修改失败请重试!'
        }))
    }    
}
async function submitpwd(req,res) {
    
    try {
        if (req.body.session == '')
            throw { code: 1,msg: '密码不能为空!' }
        let data = await  sqlhelper.updateItem('users', {
            password: require('md5')(decrypt(req.body.password))
        },req.session.user);
        res.send(JSON.stringify({code: 0,data}))
    } catch (error) {
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg || '未知错误'
        }))
    }
}

async function checklogin(req,res) {
    let response = {};
    if(req.session.user == undefined){
        res.send(JSON.stringify({
            code:1,
            msg:'尚未登陆'
        }))
    }
    else{
        try {
            let data = await sqlhelper.selectTableItem('users', `where id=${req.session.user}`,['status']);
            response = {
                code: 0,
                msg: '登陆',
                status: data[0].status
            }
            data = await sqlhelper.selectTableCount('infor', ` where applicant=${req.session.user} and time < ${Math.floor(new Date().valueOf()/1000)} and status = 1 and picture is NULL`);
            if (data != 0) {
                Object.assign(response, {
                    code: 2,
                    msg: '有预约结束并未上传图片!'
                })

            }
            res.send(JSON.stringify(response));
        } catch (error) {
            res.send(JSON.stringify({
                code: 1,
                msg: '查询出错'
            }))
        }
    }
}

async function active(req,res) {
    const id = req.query.id,
          code = req.query.code;
    try {
        if (isNaN(id)|| code == '')
            throw {code:1,msg :'参数错误'};
        let data = await sqlhelper.selectTableItem('users', ` where id = ${id}`,['status','code']);
        if(data.length == 0)
            throw {code:1,msg :'用户不存在!'};
        if(data[0].code != code)
            throw {code:1,msg :'非法激活!'};
        if (data[0].status % 2 == 0)
            throw {code:1,msg :'当前用户已激活!'};
        await sqlhelper.updateItem('users',{status:data[0].status - 1},id);
        res.send(`
            <p>激活成功,3秒后跳至首页...</p>
            <script>
                setTimeout(function(){
                    window.location = '${webconfig.IP}/dist/index.html';
                },3000);
            </script>
        `)
    } catch (error) {
        res.send(JSON.stringify({
            code:1,
            msg : error.msg
        }))
    }    
}

async function forget(req,res) {
    const studentid = req.body.studentid;
    try {
        let data = await sqlhelper.selectTableItem('users',` where studentid = '${studentid}'`,['email']);
        if(data.length == 0)
            throw { code: 0,msg: '学号不存在!' }
        else if (data[0].email != req.body.email)
            throw { code: 0,msg: '与预留邮箱不符合!' }
        else{
            pwd = Math.random().toString(36).substr(2);
            console.log(pwd);
            await sqlhelper.updateItem('users',{ password: require('md5')(pwd)},undefined ,` where studentid = '${studentid}'`);
            const mailOptions = {
                from: 'itstudio@stu.ouc.edu.cn',
                to: data[0].email,
                subject: '重置密码',
                text: '',
                html: `<h1>密码重置成功!重置密码为:${pwd}</h1>`
            }
            mailhelper.sendMail(mailOptions);
            res.send(JSON.stringify({
                code: 0,
                msg: '重置成功，重置密码已发送至默认邮箱!'
            }))
        }
    } catch (error) {
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg || '未知错误!'
        }))
    }
}

module.exports = {
    submitinfor,
    submitpwd,
    checklogin,
    active,
    forget
}