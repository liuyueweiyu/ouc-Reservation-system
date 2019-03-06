const key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;
layui.use(['form','layer'], function(){
          $ = layui.jquery;
          var form = layui.form
          ,layer = layui.layer;
          (function () {
              $.ajax({
                  url:'./infor',
                  method:'POST',
                  dataType:'JSON',
                  success:function (data) { 
                      if(data.code == 0){
                        data = data.data;
                        $('#L_username').val(data.name);
                        $('#L_email').val(data.email);
                        $('#L_pass').val('');
                      }
                      else
                        alert(data.msg);
                      if(data.code == 2){
                          window.location = './login';
                      }
                  },
                  error:function (err) {
                      console.log(err);
                  }
              })
          })();
          //自定义验证规则
          form.verify({
            nikename: function(value){
              if(value.length < 5){
                return '工号不得少于5个字符';
              }
            }
            ,pass: [/(.+){0,12}$/, '密码必须6到12位']
            ,repass: function(value){
                if($('#L_pass').val()!=$('#L_repass').val()){
                    return '两次密码不一致';
                }
            }
          });
          $('#updatepwd').on('click', function () {
              $('#pwd').attr('style', '');
              $('#repwd').attr('style', '');
              $('#updatepwd').attr('style', 'display:none;');
          })
          //监听提交
          form.on('submit(add)', function(data){
            console.log(data);
            //发异步，把数据提交给php
            let send = {
                name: data.field.username,
                email: data.field.email,

            };
            if(data.field.pass != ''){
                localStorage = window.localStorage;
                let password = data.field.pass;
                if (!localStorage.getItem(password)){
                    let encrypt = new JSEncrypt();
                    encrypt.setPublicKey(key);
                    password = encrypt.encrypt(password);
                    localStorage.setItem(data.field.password,password);
                }
                else
                    password = localStorage.getItem(password);
                send.password = password;
            }         
            
            $.ajax({
                url: './updateinfor',
                method: 'POST',
                dataType: 'JSON',
                data: send,
                success: function (data) {
                    layer.alert(data.msg);
                },
                error: function (error) {}
            })
            return false;
          });
          
          
        });