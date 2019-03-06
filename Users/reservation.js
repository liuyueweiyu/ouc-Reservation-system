const sqlhelper = require('../Utils/SqlHelper'),
      webconfig = require('../config/web.config.js'),
      mailhelper = require('../Utils/Mailhelper.js');
function getTimestr(value) {
    const date = new Date(value * 1000);
    return `${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}  `;
}
async function getlist(req,res) {     //获取最近7天的预约情况
    const now = new Date(),
          begin = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`).valueOf() / 1000,
          end = begin + 604800;
    let response = {},
        filter = `where time >= ${begin} and time < ${end} and status != 2`;
        sendmsg = [];
    try {
        let data = await sqlhelper.selectTableItem('infor', filter, ['id', 'time', 'space', 'status','send']);
        response = {code:1,data:data};
        data = await sqlhelper.selectTableItem('admins','where ranks = 1',['email']);
        let email = [];
        for (let i = 0; i < data.length; i++) {
            email[i] = data[i].email;
        }
        let to = email.join(',');
        for (const iterator of response.data) { //获取待发送邮件的列表
            if (iterator.send == 0)
                sendmsg.push({
                    from: 'itstudio@stu.ouc.edu.cn',
                    to,
                    subject: '预约情况',
                    text: '',
                    html: `<h1>您好，有新的预约，请登录后查看<a href='${webconfig.IP}/admin/login?${iterator.id}'></a>${webconfig.IP}/admin/login?${iterator.id}</h1>`
                })
        }
        await sqlhelper.updateItemByFilter('infor',{send:1},`where time >= ${begin} and time < ${end}`);
        //管理员邮箱列表
        data = await sqlhelper.selectTableItem('emails',undefined ,['email']);
        email = [];
         for (let i = 0; i < data.length; i++) {
             email.push( data[i].email);
         }
        to = email.join(',');
         for (const iterator of response.data) { //获取待发送邮件的列表
             if (iterator.send == 0)
                 sendmsg.push({
                     from: 'itstudio@stu.ouc.edu.cn',
                     to,
                     subject: '众创空间预约',
                     text: '',
                     html: `<h1>你好，爱特工作室申请在${getTimestr(iterator.time)}使用众创空间${iterator.space == 0?'投影区域':'众创套件'}已得到管理员同意</h1>`
                 })
         }
         let spacing = [];
         for (let i = 0,len = sendmsg.length; i < len; i++) {
             spacing[i] = Math.floor(120000 * (Math.random() + i));
         }
        await mailhelper.sendMails(sendmsg,spacing);
        res.send(response);
    } catch (error) {
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg || '未知错误!'
        }))
    }
}

async function getUserBooklist(req,res) {     //获取用户的预约列表/违规列表
    const page = req.query.page|| 1,
          id = req.session.user,
          pageSize = 10,
          result = {
            code:0
          };
    try {
        let data = await sqlhelper.selectTableItem('infor', ` where applicant =  ${id}  ${req.query.disorder == undefined?'':'And status = 3'}  ORDER BY id DESC LIMIT ${(page - 1) * pageSize},${pageSize} `);
        result.data = data;
        result.count = await sqlhelper.selectTableCount('infor', `where applicant =  ${id}  ${req.query.disorder == undefined?'':'And status = 3'}`);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg || '未知错误!'
        }))
    }
}

async function addreservation(req,res) {      //预约
    const body = req.body;
    try {
        //确认用户状态
        let data = await sqlhelper.selectTableItem('users', ` where id= ${req.session.user}`,['status']),newinfor ;
        if(data[0].status != 0)
            throw { code: 1,msg:'请检查用户状态!'};
        //确认用户是否预约的场地是否被预约了
        data = await sqlhelper.selectTableCount('infor', `where time=${body.time} and space=${body.space} and ( status = 1 or status = 3 )`);
        if(data != 0)
            throw { code: 1,msg:'当前区域已被预约!'};
        //添加数据
        data = await sqlhelper.insertItem('infor', Object.assign(body, {applicant: req.session.user}));
        newinfor = data.insertId
        data = await sqlhelper.selectTableItem('admins', ` where ranks=1`,['email']);
        const email = [];
        for (let i = 0; i < data.length; i++) {
            email[i] = data[i].email;
        }
        const mailOptions = {
            from: 'itstudio@stu.ouc.edu.cn',
            to: email.join(','),
            subject: '预约情况',
            text: '',
            html: `<h1>您好，有新的预约，请登录后查看<a href='${webconfig.IP}/admin/login?${newinfor}'>${webconfig.IP}/admin/login?${newinfor}</a></h1>`
        }
        await mailhelper.sendMail(mailOptions);
        res.send(JSON.stringify({
            code: 0,
            msg: '预约成功!'
        }))
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify({
            code: 1,
            msg: error.msg || '未知错误!'
        }))
    }
}

module.exports = {
    getlist,
    getUserBooklist,
    addreservation
}