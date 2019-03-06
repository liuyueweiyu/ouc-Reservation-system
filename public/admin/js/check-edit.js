

layui.use(['form','layer'], function(){
    $ = layui.jquery;
    var form = layui.form
        ,layer = layui.layer;

    //自定义验证规则
    form.verify({
        studentid:function (value) {
            if (value.length == 0)
                return '输入不能为空';
            if (!/^[A-Za-z0-9]{3,11}$/.test(value))
                return '不能包含特殊符号或字符过长';
        },
        nikename: function(value){
            if (value.length == 0)
                return '输入不能为空';
            if(value.length > 10){
                return '昵称不得多于10个字符啊';
            }
        }
    });
    const query = getQueryVariable(window.location.search.substring(1));
    for (var key in query) {
        if (key != 'id') {
            layui.jquery('#L_' + key).val(decodeURI(query[key]));
        }
    }
    //监听提交
    form.on('submit(add)', function(data){
        console.log(data);
        //发异步，把数据
        $.ajax({
            url: '../updatedb',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: query.id,
                form: 'checkinfor',
                name: data.field.name,
                studentid: data.field.studentid,
            },
            success: function (data) {
                layer.alert(data.msg, {
                    icon: 6
                }, function () {
                    if(data.code == 0){
                        var index = parent.layer.getFrameIndex(window.name);
                        //关闭当前frame
                        window.parent.active.reload();
                        parent.layer.close(index);
                    }
                    // 获得frame索引
                });
            },
            error: function (error) {}
        })



        
        return false;
    });
        
        
});