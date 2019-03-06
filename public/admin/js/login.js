if (self != top) {
    parent.window.location.replace(window.location.href);
}

const key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;
$(function () {
    layui.use('form', function () {
        var form = layui.form;
        //监听提交
        form.on('submit(login)', function (data) {
            const username = data.field.username,
                  localStorage = window.localStorage;
            let password = data.field.password;
            if (!localStorage.getItem(password)){
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(key);
                password = encrypt.encrypt(password);
                localStorage.setItem(data.field.password,password);
            }
            else
                password = localStorage.getItem(password);
            $.ajax({
                url: './login',
                method:'POST',
                dataType: 'text',
                data : {
                    username,
                    password
                },
                success:function (data) {
                    alert(data);
                    
                    if(data === '登录成功!'){
                        window.location = './home';
                    }
                        
                },
                error:function (err) {
                    alert('登陆失败！');
                }
            })
            return false;
        });
    });
})
