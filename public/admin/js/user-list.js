layui.use('table', function () {
    var table = layui.table;
    //第一个实例
    var tableIns = table.render({
        id : 'userlist',
        elem: '.layui-table',
        url: 'userlist' ,//数据接口
        page: true, //开启分页
        cols: [
            [ //表头
                {
                    field: 'name',
                    title: '用户名',
                }, {
                    field: 'email',
                    title: '电子邮箱',

                }, {
                    field: 'status',
                    title: '状态',
                    event: 'freeze',
                    templet: function (d) {
                        var str,classname ;
                        switch (d.status) {
                            case 0:
                                str = '正常';classname='layui-btn-primary';break;
                            case 1:
                                str = '待激活';classname='layui-btn-warm';break;
                            case 2:;
                            case 3:
                                str = '冻结';classname='layui-btn-danger';break;
                            default:
                                str = '信息出错';classname='';break;
                        }
                        return `<button class='layui-btn ${classname} layui-btn-xs '>${str}</button>`;
                    }
                },
            ]
        ]
    });
    var $ = layui.$, active = {
        reload: function(){
            //执行重载
            table.reload('userlist', {
                url:'userlist',
                where: {
                    key: $('#searchvalue').val()
                }
            });
        }
    };
    $.ajax({
        url:'./login',
        method:'GET',
        success:function (data) {
            console.log(data);
        },
        error:function (err) {
            console.log(err)
        }
    })
    table.on('tool(userlist)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'freeze') { //查看
            var layerindex = layer.confirm(`确认${data.status >= 2?'解冻':'冻结'}吗?`, {
                icon: 3,
                title: '提示'
            }, function (i) {
                $.ajax({
                    url:'../updatedb',
                    method:'POST',
                    dataType:'JSON',
                    data: {
                        id:data.id,
                        form:'users',
                        status: data.status >= 2 ? data.status - 2 : data.status + 2
                        // col:"status",
                        // value: data.status >= 2 ? data.status - 2 : data.status+2,
                        // type:1
                    },
                    success:function (data) {
                        
                        active.reload();
                    },
                    error:function (error) {
                    }
                })
                layer.close(layerindex);
            });

        } 
    });
    $('.layui-form .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

}); 
