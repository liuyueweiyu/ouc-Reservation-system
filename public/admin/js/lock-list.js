layui.use('table', function () {
    var table = layui.table;
    //第一个实例
    let map = new Map();
    let ids = [];
    var tableIns = table.render({
        id : 'locklist',
        elem: '.layui-table',
        // url: '/' + window.location.href.split('/')[3] + '/admin/inforlist?id=1&type=0', //数据接口
        url: './inforlist?id=1&type=0',
        page: true, //开启分页
        cols: [
            [ //表头
                
                {
                    field:'',
                    title:'',
                    type:'checkbox'
                }, {
                    field: 'name',
                    title: '申请人',
                }, {
                    field: 'title',
                    title: '申请主题',
                }, {
                    field: 'organizer',
                    title: '主办方',
                }, {
                    field: 'content',
                    title: '申请内容',
                }, {
                    field: 'space',
                    title: '区域',
                    templet:function (d) {
                        return d.space === 0?'投影区域':'众创套件';
                    }
                }, {
                    field: 'time',
                    title: '锁定时间',
                    templet:function (d) {
                        ids.push(d.id);
                        let date = new Date(d.time * 1000);
                        return `${date.getFullYear()+1}年${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}  `;
                    }
                }, {
                    field: 'unlock',
                    title: '解锁',
                    event: 'unlock',
                    templet: function (d) {
                        
                        return `<button class='layui-btn layui-btn-xs '>解锁</button>`;
                    }
                },
            ]
        ]
    });
    var $ = layui.$, active = {
        reload: function(){
            //执行重载
            table.reload('locklist', {
                // url: '/' + window.location.href.split('/')[3] + '/admin/inforlist?id=1',
                url: './inforlist?id=1',
                where: {
                    key: $('#searchvalue').val()
                }
            });
        }
    };
    table.on('checkbox(locklist)', function (obj) {
        if(obj.type == 'all' && obj.checked){
            for (let i = 0; i < ids.length; i++) {
                map.set(ids[i],true);
            }
        }
        else if(obj.type == 'all' && !obj.checked)
            map = new Map();
        else
            map.set(obj.data.id,obj.checked);
    });

    table.on('tool(locklist)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'unlock') { //查看
            var layerindex = layer.confirm(`确认解除锁定吗?`, {
                icon: 3,
                title: '提示'
            }, function (i) {
                $.ajax({
                    url: './unlock',
                    method:'POST',
                    dataType:'JSON',
                    data: {
                        id:data.id,
                    },
                    success:function (data) {
                        layer.alert(data.msg);
                        if (data.code == 0)
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
                url: './unlock',
                method:'POST',
                dataType:'JSON',
                data: {
                    id: arr.join(','),
                },
                success:function (data) {
                    layer.alert(data.msg);
                    if (data.code == 0)
                        active.reload();
                    
                },
                error:function (error) {}
            });
            layer.close(layerindex);
        });
    });
    $('.layui-table-page').on('click', function (e) {
        ids = [];
        map = new Map();
    })
}); 
