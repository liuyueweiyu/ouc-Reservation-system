const express = require('express'),
      router = express.Router(),
      AdminHelper = require('./Admin/index.js'),
      test = require('./Utils/test.js')
      UserHelper = require('./Users/index.js');

/**
 * 分发路由
 */
router
    .get('/', function (req, res) {
        if (req.session.login) {
            res.send("你好，欢迎" + req.session.username);
        } else {
            res.send("你还没有登录");
        }
    })
    .get('/test', function (req, res) {
        res.send('text');
    });

/**
 * 管理员路由
 */
router.route('/admin/login')
      .get(AdminHelper.login.view)
      .post(AdminHelper.login.action);
router.get('/admin/home',AdminHelper.home.view);
router.get('/admin/userlist',AdminHelper.list.getUserlist)
      .get('/admin/checklist',AdminHelper.list.getChecklist)
      .get('/admin/adminlist',AdminHelper.list.getAdminlist)
      .get('/admin/emaillist',AdminHelper.list.getEmaillist)
      .get('/admin/inforlist',AdminHelper.reservation.getlist)
      .get('/admin/inforitem',AdminHelper.reservation.getitem)
      .post('/admin/review',AdminHelper.reservation.review)
      .post('/admin/resetPwd',AdminHelper.infor.resetPwd)
      .post('/admin/infor', AdminHelper.infor.getInfor)
      .post('/admin/updateinfor',AdminHelper.infor.updateInfor)
      .post('/admin/unlock',AdminHelper.locks.unlock)
      .post('/admin/lock',AdminHelper.locks.lock)
      .post('/admin/addcheck',AdminHelper.checks.add)
      .post('/admin/delcheck',AdminHelper.checks.delcheck)
      .post('/admin/deladmins', AdminHelper.admin.delAdmink)
      .post('/admin/delemails',AdminHelper.admin.delEmails)
      .post('/admin/add',AdminHelper.admin.add)
      .get('/admin/status',AdminHelper.admin.getStatu)
      .post('/user/register',UserHelper.sign.register)
      .post('/user/login',UserHelper.sign.login)
      .get('/user/list', UserHelper.reservation.getlist)
      .get('/user/infor',UserHelper.infor.infor)
      .post('/user/updateinfor',UserHelper.update.submitinfor)
      .post('/user/updatepwd', UserHelper.update.submitpwd)
      .get('/user/reservationlist', UserHelper.reservation.getUserBooklist)
      .get('/user/checklog', UserHelper.update.checklogin)
      .post('/user/reservation', UserHelper.reservation.addreservation)
      .post('/file_upload', UserHelper.upimage.upimage)
      .get('/user/logout', UserHelper.sign.logout)
      .get('/active',UserHelper.update.active)
      .post('/user/forget', UserHelper.update.forget)
      .get('/test/',test.test)
router.post('/updatedb/',AdminHelper.update.Update);
    

module.exports = router;