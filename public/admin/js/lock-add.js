layui.use('laydate', function () {
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#single' //指定元素
    });
    laydate.render({
        elem: '#begin' //指定元素
    });
    laydate.render({
        elem: '#end' //指定元素
    });
});

layui.use('form', function () {
    var form = layui.form,
        $ = layui.jquery;
    form.on('select(lock-mothed)', function (data) {
        if(data.value == 1){
            $('#muti').attr('style','');
            $('.single').attr('style','display:none;')
        }
        else{
            $('.single').attr('style','');
            $('#muti').attr('style', 'display:none;')
        }
    });
    
    
    form.on('submit(add)', function(data){
        console.log(data);
        let send = {};
        if (data.field.lockmethed == 0){
            send = {
                type:0,
                single: new Date(data.field.single)/1000,
                time:data.field.time,
                space:data.field.space
            }
        }
        else{
            send = {
                type:1,
                begin:new Date(data.field.begin)/1000,
                end:new Date(data.field.end)/1000,
                day:data.field.day,
                time:data.field.time,
                space:data.field.space
            }
        }
        Object.assign(send,{
            title:data.field.title,
            content:data.field.content,
            organizer:data.field.organizer
        })
        //发异步，把数据提交给php
        $.ajax({
            url:'./lock',
            method: 'POST',
            dataType: 'JSON',
            data: send,
            success: function (data) {
                if(data.code == 2){
                    const date = new Date(data.time*1000);
                    layer.alert(`${date.getMonth()+1}月${date.getDate()}${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}${date.space == 0?'投影区域':'众创组件'}已被预约`);
                }
                else
                    layer.alert(data.msg);
            },
            error: function (error) {}
        })



        
        return false;
    });
        
});