const sqlhelper = require('../Utils/SqlHelper');
async function infor(req,res) {       //查询学生信息
    const id = req.session.user;
    if(isNaN(id))
        res.send(JSON.stringify({
            code: 1,
            msg: '查询出错!'
        }))
    try {
        let data =await sqlhelper.selectTableItem('users', 'where id='+id,['id','name','status','email','phonenumber']);
        data = Object.assign(data[0],{code:0,msg:'查询成功'});
        res.send(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({
            code: 1,
            msg: '查询出错!'
        }))
    }
}


module.exports = {
    infor
}