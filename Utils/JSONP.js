function test(req,res) {
     // 这一步JSONP必备
     var _callback = req.query.callback;
     // 这个responseData是后台要传回给前台的数据
     var responseData = {
         email: 'example@163.com',
         name: 'jaxu'
     };
     if (_callback) {
         // 这两步设置发送也是NODE.JS发送JSONP必备
         res.type('text/javascript');
         res.send(_callback + '(' + JSON.stringify(responseData) + ')');
     } else {
         res.json(responseData);
     }
}

module.exports = {
    test
}