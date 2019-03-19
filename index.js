/**
 * 模块依赖
 */
const express = require("express"),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    fs = require("fs"),
    path = require('path'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    router = require('./Router.js')

const app = express(),
    upload = multer({
        dest: '/tmp/'
    });
try{
	app
	    /**
	     * 设置中间件
	     */
		.all('*', function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "http://localhost:8080");
			res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
			res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Credentials", true);
			res.header("X-Powered-By", ' 3.2.1')
			if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
			else next();
		})
	    .use(morgan('short')) //日志
	    .use(express.static(path.join(__dirname, 'public'))) //设置静态文件
	    .use(bodyParser.urlencoded({
	        extended: false
	    })) // 创建 application/x-www-form-urlencoded 编码解析
	    .use(upload.array('image', 5))    //图片上传，并设置最大上传数量为12，单个文件用single
	    .use(cookieParser('keyboard cat'))  //cookie
	    .use(session({                      //session
	        secret: 'keyboard cat',
	        resave: false,
	        saveUninitialized: true,
	    }))
	    .use(function (req,res,next) {      //验证登陆
	        if (/^\/admin.*/.test(req.path) && req.path != '/admin/login' && !req.session.login) {  //验证管理员登陆
	            res.send(require('./Utils/JSScript').ADMIN_WITHOUT_LOGIN);
	            return;
			}
			if (/^\/user.*/.test(req.path)  && !req.session.user) { //验证用户登陆
				if (req.path != '/user/register' 
				&& req.path != '/user/login' 
				&& req.path != '/user/list'
				&& req.path != '/user/forget'
				) {
					res.send({code:1,msg:'尚未登录!'});
					return;
				}
			}
	        next();
	    })
	    .use('/', router)                   //分发路由
	    .listen(9012);
}
catch(e){
	console.log(e);
}
