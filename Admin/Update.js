const sqlhelper = require('../Utils/SqlHelper');
async function Update(req,res) {
    const body = req.body;
    let form  = body.form,id = Number(body.id);
    delete body.form;
    delete body.id;
    console.log(body)
    try {
        await sqlhelper.updateItem(form, body, id);
        res.send({
            code: 0,
            msg: '更新成功!'
        })
    } catch (error) {
        console.log(error)
        res.send({
            code: 1,
            err: error.msg || '未知错误'
        })
    }
}
module.exports = {
    Update
}