var active;
layui.use('table', function () {
    var table = layui.table,
        map = new Map();
    let ids = [];
    //第一个实例
    var tableIns = table.render({
        id : 'checklist',
        elem: '.layui-table',
        url: 'checklist' ,//数据接口
        page: true, //开启分页
        cols: [
            [ //表头
                {
                    field: '',
                    title: '',
                    type: 'checkbox'
                },
                {
                    field: 'studentid',
                    title: '学号',
                }, {
                    field: 'name',
                    title: '姓名',

                }, {
                    field: 'status',
                    title: '编辑',
                    event: 'edit',
                    templet: function (d) {
                        ids.push(d.id);
                        return `<button class='layui-btn layui-btn-primary layui-btn-xs normal'>编辑</button>`;
                    }
                },
                {
                    field: 'status',
                    title: '删除',
                    event: 'delete',
                    templet: function (d) {
                        return `<button class='layui-btn layui-btn-primary layui-btn-xs normal'>删除</button>`;
                    }
                }
            ]
        ]
    });
    var $ = layui.$;
    active = {
        reload: function(){
            //执行重载
            
            table.reload('checklist', {
                url:'checklist',
                where: {
                    key: $('#searchvalue').val()
                }
            });
        }
    };

    
    table.on('checkbox(checklist)', function (obj) {
        if (obj.type == 'all' && obj.checked) {
            for (let i = 0; i < ids.length; i++) {
                map.set(ids[i], true);
            }
        } else if (obj.type == 'all' && !obj.checked)
            map = new Map();
        else
            map.set(obj.data.id, obj.checked);
    });


    table.on('tool(checklist)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'edit') { //查看
            x_admin_show('添加用户', `./check-edit.html?id=${data.id}&&name=${data.name}&&studentid=${data.studentid}`, 600, 400);
        }
        if (layEvent === 'delete') { //查看
            var layerindex = layer.confirm(`确认删除吗?`, {
                icon: 3,
                title: '提示'
            }, function (i) {
                $.ajax({
                    url: './delcheck',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: data.id,
                    },
                    success: function (data) {
                        layer.alert(data.msg);
                        if (data.code == 0)
                            active.reload();
                    },
                    error: function (error) {}
                })
                layer.close(layerindex);
            });
            
        }
    });
    $('.layui-form .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $('#delete').on('click',function () {
         var layerindex = layer.confirm(`确认解除锁定吗?`, {
             icon: 3,
             title: '提示'
         }, function (i) {
             const arr = [];
             for (const [key, value] of map) {
                 if (value)
                     arr.push(key);
             }
             $.ajax({
                 url: './delcheck',
                 method: 'POST',
                 dataType: 'JSON',
                 data: {
                     id: arr.join(','),
                 },
                 success: function (data) {
                    alert(data.msg);
                    if(data.code == 0)
                        window.location = './check-list.html';
                 },
                 error: function (error) {}
             });
             layer.close(layerindex);
         });
    })
    $('.layui-table-page').on('click', function (e) {
        console.log(map);
        ids = [];
        map = new Map();
    })
}); 
