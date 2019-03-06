const sqlhelper = require('../Utils/SqlHelper');

async function getlist(req,res,table) {
    try {
        if (isNaN(req.query.page) || isNaN(req.query.limit)) {
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
            key = req.query.key;
        let result = {},
            filter ;
        filter = !key?undefined:"where name LIKE '%"+key +"%'";
        //admin=1,查管理员
        if (table == 'admins') {
            filter = `where ranks = 1 ${!key?'':"  && name LIKE '%"+key +"%'"};`;
        }
        result.count = await sqlhelper.selectTableCount(table, filter);
        filter = (!key ? '' : ` WHERE name LIKE '%${key}%'`) + ` ORDER BY id LIMIT ${(page - 1) * pageSize},${pageSize}`;
        if (table == 'admins') {
            filter = `where ranks=1 ${!key?"":` && name LIKE '%${key}%'`} ORDER BY id LIMIT ${(page - 1) * pageSize},${pageSize} ;`;
        }
        const data = await sqlhelper.selectTableItem(table,filter);
        if (data.length && data[0].password) {
            for (let i = 0; i < data.length; i++) {
                delete data[i].password;
            }
        }
        result.data = data;
        result.code = 0;
        result.msg = '发送成功!';
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error)
        result = {
            code: 1,
            "msg": "查询出错!",
            "count": 0,
            "data": []
        }
        res.send(JSON.stringify(result));
    }

}

function getUserlist(req,res) {
    getlist(req,res,'users');
}

function getChecklist(req, res) {
    getlist(req, res, 'checkinfor');
}

function getAdminlist(req, res) {
    getlist(req, res, 'admins');
}

function getEmaillist(req, res) {
    getlist(req, res, 'emails');
}

module.exports = {
    getUserlist,
    getChecklist,
    getAdminlist,
    getEmaillist,
}