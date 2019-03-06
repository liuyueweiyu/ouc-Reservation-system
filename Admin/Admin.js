const sqlhelper  = require('../Utils/SqlHelper');

async function add(req,res) {
    try {
        let data,obj ;
        if (req.body.admin) {
            obj = {
                password: '092fa043baa794217c35b2d23f1a36c1',
                name: req.body.admin,
                ranks: 1
            };
            data = await sqlhelper.insertItem('admins', obj);
        } else {
            obj = {
                email: req.body.email,
                name: req.body.name
            };
            data = await sqlhelper.insertItem('emails', obj);
        }
        res.send(JSON.stringify({
            code: 0,
            msg: '增加成功' + (req.body.admin ? '，默认密码为OUCIT123' : '')
        }))
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY'){
            res.send(JSON.stringify({
                code: 1,
                msg: '该工号已存在!'
            }));
        }
        else{
            res.send(JSON.stringify({
                code: error.code,
                msg: error.msg || '未知错误!'
            }));
        }
    }
}

async function getStatu(req,res) {
    let id = req.session.login,
          data;
    try {
        data = await sqlhelper.selectTableItem('admins', 'where id=' + id, ['ranks']);
        if(data.length == 0)
            res.send(JSON.stringify({
                code: -1,
                msg:'工号不存在!'
            }))
        else
            res.send(JSON.stringify({
                    code: 0,
                    status:data[0].ranks
                }))
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }))
    }
}

async function delAdmink(req, res) {
    let ids = req.body.id,data;
    try {
        data = await sqlhelper.deleteItems('admins',ids);
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

async function delEmails(req, res) {
    const ids = req.body.id;
    try {
        data = await sqlhelper.deleteItems('emails', ids);
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
    getStatu,
    delAdmink,
    delEmails
}