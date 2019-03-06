        layui.use(['form','layer'], function(){
          $ = layui.jquery;
          var form = layui.form
          ,layer = layui.layer,
          id = window.location.search.substring(window.location.search.indexOf('=') + 1);
          (function () {
              $.ajax({
                  url: 'inforitem',
                  method:'GET',
                  dataType:'JSON',
                  data: {
                      id: id
                  },
                  success:function (data) {
                        $('.applicant').val(data.name);
                        $('.phonenumber').val(data.phonenumber);
                        $('.space').val(data.space == 0 ? '投影区域':'众创套件');
                        $('.organizer').val(data.organizer);
                        $('.title').val(data.title);
                        $('.content').val(data.content);
                        let str = '',
                            date = new Date(data.time * 1000);
                        str = `<p> ${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}</p> `;
                        $('.time').html(str);
                        $('.layui-unselect').click();
                        $('.layui-form-selected dd')[data.status].click();
                        $('.reason').val(data.reason);
                        str = ``;
                        if(data.picture){
                            data.picture = data.picture.split(',');
                            for (let i = 0; i < data.picture.length; i++) {
                                const element = data.picture[i];
                                str += `<img src=/images/${element} style='width: 100%;margin-bottom:10px;' />`;
                            }
                        }
                        else{
                            str = `<span style="font-family:Helvetica Neue;line-height: 40px; font-size:14px;color:rgb(84, 84, 84);">未上传图片</span>`;
                        }
                        
                        $('.picture').html(str);
                    },

                  error:function (err) {
                      console.log(err);
                  }
              })
          })();

          //监听提交
          
        $('#submit').click(function () {
            let ajaxjson = {
                url : './review',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    id: id,
                    reason: $('#reason').val(),
                    status: $('#status').val(),
                },
                success: function (data) {
                    alert(data.msg);
                    if (data.code == 1 && IsPC()) {
                        window.location = './infor-list.html';
                    }

                },
                error: function (error) {}
            };
            $.ajax(ajaxjson);
        })


        });

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}