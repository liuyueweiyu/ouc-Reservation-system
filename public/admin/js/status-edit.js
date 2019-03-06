layui.use(['form','layer'], function(){
    $ = layui.jquery;
    var form = layui.form
        ,layer = layui.layer
        , query = getQueryVariable(window.location.search.substring(1));
        //自定义验证规则
    $('.layui-textarea').val(query.reason ? '':query.reason);
    if(query.check == 1){   //违规
        $('.check').html('违规情况');
        $('#content').attr('lay-text','正常|违规');
        $('.layui-form-switch').click();
        if (query.status == 1) {
            $('.layui-form-switch').click();
        }
    }
    else{
        if (query.status == 2) {
            $('.layui-form-switch').click();
        }
    }

    //监听提交
    form.on('submit(add)', function(data){       

        let status = 0;
        if (data.field.status)  
            status = 1;
        else if(query.check == 1)
            status = 3;
        else
            status = 2;
        if (status == query.status && data.field.text == query.reason)
            return false;
        let ajaxjson = {
            url:'./review',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id:query.id,
                reason: data.field.text,
                status,
                disorder: query.check
            },
            success: function (data) {
                alert(data.msg);
                if(data.code == 0){
                    var index = parent.layer.getFrameIndex(window.name);
                    window.parent.active.reload();
                    parent.layer.close(index);
                }
                
            },
            error: function (error) {}
        };
        $.ajax(ajaxjson);
        return false;
    });          
});