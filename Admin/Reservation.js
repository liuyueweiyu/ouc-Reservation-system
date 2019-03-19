const sqlhelper = require('../Utils/SqlHelper'),
      mailhelper = require('../Utils/Mailhelper.js');
async function getlist(req,res) {    //获取预约列表
    if (isNaN(req.query.page) || isNaN(req.query.limit)){
        res.send(JSON.stringify({
            "code": 1,
            "msg": "非法请求",
            "count": 0,
            "data": []
        }));
        return;
    }
    const page = req.query.page,
          pageSize = req.query.limit,
          key = req.query.key,
          id = req.query.id,
          type = Number(req.query.type);
    let result = {},
        filter = !isNaN(key) && key >= 0 && key <= 3;
    
    let filterstr = `Where send = ${type}  ${filter?'And status='+key:''} ${id?'And applicant='+id:''}  ${type=="1"?'AND time<'+Math.floor(new Date()/1000)+86400*7:''}`;
    try {
        result.count = await sqlhelper.selectTableCount('infor',filterstr);
        if (result.count == 0) {
            result = {
                code: 1,
                "msg": "暂无数据!",
                "count": 0,
                "data": []
            }
            res.send(JSON.stringify(result));
        }
        filter = `WHERE send = ${type}   And infor.applicant = users.id  ${id?'And infor.applicant='+id:''} ${type=="1"?'AND infor.time<'+(Number(Math.floor(new Date()/1000)+86400*7)):''} ${filter?'And infor.status='+key:''} And infor.id ORDER BY id DESC LIMIT ${(page - 1) * pageSize},${pageSize}`;
        result.data = await sqlhelper.selectTableItemFromTwoTable(['infor', 'users'], filter, ['infor.*', 'users.name', 'users.phonenumber'])
        result.code = 0;
        result.msg = '发送成功!';
        res.send(JSON.stringify(result));
    } catch (error) {
        result = {
            code: 1,
            "msg": "查询出错!",
            "count": 0,
            "data": []
        }

        res.send(JSON.stringify(result));
    }
}
async function getitem(req,res) {     //获取预约项目
    const id = req.query.id;
    if (!id || isNaN(id)) {
        res.send(JSON.stringify({
            "code": 1,
            "msg": "非法请求",
        }));
    }
    try {
        let data = await sqlhelper.selectTableItemFromTwoTable(['infor', 'users'], `WHERE infor.applicant = users.id And infor.id = ${id}`, ['infor.*', 'users.name', 'users.phonenumber']);
        res.send(JSON.stringify(data[0]));
    } catch (error) {
        res.send(JSON.stringify({
            "code": 1,
            "msg": "查询出错",
        }));
    }
}
async function review(req, res) {     //管理员审核预约
    const id = req.body.id;
    let item = {},
        response = {},
        email  = '',
        mailOptions = {};
    try {
        if(req.body.status == 1){   //预约通过
            item = await sqlhelper.selectTableItemFromTwoTable(['infor', 'users'], `WHERE infor.applicant = users.id And infor.id = ${id}`, ['infor.space','infor.time', 'users.name', 'users.phonenumber','users.email']);
            item = item[0];
            email = item.email;
            //确认是否被预约了
            let count = await sqlhelper.selectTableCount('infor', `where space=${item.space} and time = ${item.time} and (status= 1 ${req.body.check== 1? 'or status = 3':''})`);
            if(count != 0)
                throw {code:1,msg:'当前区域已被预约'};
            //更新
            await sqlhelper.updateItem('infor', {
                status : 1,
                reason :req.body.reason
            },id);
            //查找收件人列表
            let data = await sqlhelper.selectTableItem('emails', undefined, ['email']);
            //发邮件
            const emaillist = [];
            for (let i = 0; i < data.length; i++) {
                emaillist.push(data[i].email);
            }
            emaillist.push(email);
            const date = new Date(item.time * 1000),
                str = `${date.getMonth()+1}月${date.getDate()}日${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}`;
            mailOptions = {
                from: 'itstudio@stu.ouc.edu.cn',
                to: emaillist.join(','),
                subject: '众创空间预约',
                text: '',
                html: `<h1>你好，${item.name}申请在${str}使用众创空间${item.space == 0?'投影区域':'众创套件'}已得到管理员同意</h1>`
            }
            await mailhelper.sendMail(mailOptions);
        }
        else{
            await sqlhelper.updateItem('infor',{
                status: req.body.status, 
                reason : req.body.reason, 
            }, req.body.id);
            if (req.body.status != 0){
                let data = await sqlhelper.selectTableItem('users', `where id = (select applicant from infor where id = ${req.body.id})`, ['email']);
                mailOptions = {
                    from: 'itstudio@stu.ouc.edu.cn',
                    to: [data[0].email],
                    subject: '众创空间预约',
                    text: '',
                    html: `<h1>你好，您的预约申请被${req.body.status == 2?'拒绝':'设置成违规'}!</h1>
                        <p>理由为${req.body.reason}</p>`
                }
                await mailhelper.sendMail(mailOptions);
            }
            
        }
        
        response = {
            code: 0,
            msg: '操作成功!'
        }
        res.send(JSON.stringify(response));
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify({
            code:1,
            msg:code.msg || '未知错误!'
        }))
    }
}


module.exports = {
    getlist,
    getitem,
    review
}