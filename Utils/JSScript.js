
module.exports = {
    ADMIN_WITHOUT_LOGIN:`<script>alert('尚未登陆!');window.location = 'http://it.ouc.edu.cn/'  + window.location.href.split('/')[3] + '/admin/login';</script>`,
    USER_WITHOUT_LOGIN: `<script>alert('尚未登陆!');window.location = 'http://it.ouc.edu.cn/'  + window.location.href.split('/')[3] + '/dist/login.html';</script>`,
}
