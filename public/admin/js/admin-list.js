var active;
layui.use('table', function () {
    var table = layui.table;
    //第一个实例
    let map = new Map();
    var tableIns = table.render({
        id : 'adminlist?page=1&limit=10',
        elem: '.layui-table',
        url: 'adminlist' ,//数据接口
        page: true, //开启分页
        cols: [
            [ //表头
                {
                    field: '',
                    title: '',
                    type: 'checkbox'
                }, {
                    field: 'name',
                    title: '用户名',
                }, {
                    field: 'email',
                    title: '电子邮箱',

                }, {
                    field: 'status',
                    title: '状态',
                    event: 'reset',
                    templet: function (d) {
                        return `<button class='layui-btn layui-btn-primary layui-btn-xs normal'>重置密码</button>` ;
                    }
                }, {
                    field: 'unlock',
                    title: '删除',
                    event: 'delete',
                    templet: function (d) {

                        return `<button class='layui-btn layui-btn-xs '>删除</button>`;
                    }
                },
            ]
        ]
    });
    table.on('checkbox(adminlist)', function (obj) {
        if (obj.type == 'all' && obj.checked) {
            for (let i = 0; i < ids.length; i++) {
                map.set(ids[i], true);
            }
        } else if (obj.type == 'all' && !obj.checked)
            map = new Map();
        else{
            map.set(obj.data.id, obj.checked);
        }
            
    });
    var $ = layui.$;
    active = {
        reload: function(){
            //执行重载
            table.reload('adminlist?page=1&limit=10', {
                url:'adminlist',
                where: {
                    key: $('#searchvalue').val()
                }
            });
        }
    };
    table.on('tool(adminlist)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'reset') { //查看
            var layerindex = layer.confirm(`确认重置吗?`, {
                icon: 3,
                title: '提示'
            }, function (i) {
                $.ajax({
                    url: './resetPwd',
                    method:'POST',
                    dataType:'JSON',
                    data: {
                        id:data.id,
                    },
                    success:function (data) {
                        layer.alert(data.msg);
                        if(data.code == 0)
                            active.reload();
                    },
                    error:function (error) {
                    }
                })
                layer.close(layerindex);
            });

        }
        if (layEvent === 'delete') { //查看
            var layerindex = layer.confirm(`确认解除删除吗?`, {
                icon: 3,
                title: '提示'
            }, function (i) {
                $.ajax({
                    url: './deladmins',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: data.id,
                    },
                    success: function (data) {
                        layer.alert(data.msg);
                        if(data.code == 0)
                            active.reload();
                    },
                    error: function (error) {}
                })
                layer.close(layerindex);
            });

        }
    });
    $('#delete').on('click', function () {
        var layerindex = layer.confirm(`确认删除吗?`, {
            icon: 3,
            title: '提示'
        }, function (i) {
            const arr = [];
            for (const [key, value] of map) {
                if (value)
                    arr.push(key);
            }
            $.ajax({
                url: './deladmins',
                method:'POST',
                dataType:'JSON',
                data: {
                    id: arr.join(','),
                },
                success:function (data) {
                    layer.alert(data.msg);
                    if(data.code == 0)
                        active.reload();
                    
                },
                error:function (error) {}
            });
            layer.close(layerindex);
        });
    });
    $('.layui-form .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $('.layui-table-page').on('click', function (e) {
        ids = [];
        map = new Map();
    })

}); 
