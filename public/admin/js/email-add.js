layui.use(['form', 'layer'], function () {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer;
    //监听提交
    console.log($('#updatepwd'))
    $('#updatepwd').click(function () {
        $.ajax({
            url: './add',
            method: 'POST',
            dataType: 'JSON',
            data: {
                name: $('#L_name').val(),
                email: $('#L_email').val()
            },
            success: function (data) {
                alert(data.msg);
                if(data.code == 0){
                    var index = parent.layer.getFrameIndex(window.name);
                    //关闭当前frame
                    window.parent.active.reload();
                    parent.layer.close(index);
                }
            },
            error: function (error) {}
        })
    })
});