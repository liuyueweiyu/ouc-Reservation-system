var active;
layui.use('table', function () {
    var table = layui.table;
    var $ = layui.$;
    var cols = [
        [ //表头
            {
                field: 'name',
                title: '申请人',
            }, {
                field: 'phonenumber',
                title: '联系方式',
            }, {
                field: 'space',
                title: '申请场地',
                templet: function (d) {
                    return d.space == 0 ? '投影区域' : '众创套件';
                }
            }, {
                field: 'organizer',
                title: '主办方',
            }, {
                field: 'title',
                title: '申请主题',
            }, {
                field: 'content',
                title: '申请内容',

            }, {
                field: 'detail',
                title: '申请时间',
                templet: function (d) {
                    const date = new Date(d.time * 1000);
                    return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}  `;
                }
            }, {
                field: 'status',
                title: '状态',
                event: 'change',
                templet: function (d) {
                    let button1 = '';
                    switch (d.status) {
                        case 0:
                            button1 = '<button class="layui-btn layui-btn-primary  layui-btn-xs">待审核</button> ';
                            break;
                        case 1:
                            button1 = '<button class="layui-btn  layui-btn-normal layui-btn-xs">已通过</button> ';
                            break;
                        case 2:
                            button1 = '<button class="layui-btn layui-btn-warm  layui-btn-xs">未通过</button> ';
                            break;
                        case 3:
                            button1 = '<button class="layui-btn layui-btn-danger layui-btn-xs">已违规</button> ';
                            break;
                        default:
                            break;
                    }

                    return button1;
                }
            }, {
                field: 'more',
                title: '查看详情',
                event: 'more',
                templet: function (d) {
                    return '<button class="layui-btn layui-btn-xs">查看详情</button> ';
                }
            }
        ]
    ];
    if(window.innerWidth < 1000){
        $('.export').prop('outerHTML', '');
        cols = [
            [ //表头
                {
                    field: 'name',
                    title: '申请人',
                    event: 'more',
                },{
                    field: 'space',
                    title: '申请场地',
                    event: 'more',
                    templet: function (d) {
                        return d.space == 0 ? '投影区域' : '众创套件';
                    }
                }, {
                    field: 'detail',
                    event: 'more',
                    title: '申请时间',
                    templet: function (d) {
                        const date = new Date(d.time * 1000);
                        return `${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}  `;
                    }
                }, {
                    field: 'status',
                    title: '状态',
                    event: 'change',
                    width:80,
                    templet: function (d) {
                        let button1 = '';
                        switch (d.status) {
                            case 0:
                                button1 = '<button class="layui-btn layui-btn-primary  layui-btn-xs">待审核</button> ';
                                break;
                            case 1:
                                button1 = '<button class="layui-btn  layui-btn-normal layui-btn-xs">已通过</button> ';
                                break;
                            case 2:
                                button1 = '<button class="layui-btn layui-btn-warm  layui-btn-xs">未通过</button> ';
                                break;
                            case 3:
                                button1 = '<button class="layui-btn layui-btn-danger layui-btn-xs">已违规</button> ';
                                break;
                            default:
                                break;
                        }

                        return button1;
                    }
                }
            ]
        ];
    }

    //第一个实例
    var tableIns = table.render({
        id : 'inforlist',
        elem: '.layui-table',
        url: 'inforlist?type=1' ,//数据接口
        page: true, //开启分页
        cols
    });
    
    active = {
        reload: function(){
            //执行重载
            table.reload('inforlist', {
                url:'inforlist?type=1',
                where: {
                    key: $('.searchvalue').val()
                }
            });
        }
    };
    table.on('tool(inforlist)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'change') { //查看
            let edit,check,
                end = Math.round(new Date() / 1000) > data.time;
            if (end && (data.status == 2||data.status == 0)) {
                layer.alert('预约已失效');
                return;
            }
            if (end)    //已结束
                edit = '设置违规',check=1;
            else
                edit = '审核详情',check=0;
            let wid = 600,hei = 400;
            if (window.innerWidth < 1000)
                wid = 400;
            x_admin_show(edit, `./status-edit.html?id=${data.id}&&check=${check}&&status=${data.status}&&reason=${data.reason}`, wid, hei);
        }
        if(layEvent == 'more'){
            // const url = '/' + window.location.href.split('/')[3] + '/admin/infor-more.html?id=' + data.id;
            const url = './infor-more.html?id=' + data.id;
            window.location = url;
        }
    });
    $('.key').on('click', function () {
        var type = $(this).data('type');
        console.log($('.searchvalue').val());
        
        active[type] ? active[type].call(this) : '';
    });
    $('.export').on('click',function () {
        let data = [[]];
        (()=>{
            var titles = $('table span');
            for (let i = 0; i < 8; i++) {
                data[0][i] = titles[i].innerText;
            }
            var content = $('table td div');
            for (let i = 0; i < content.length; i++) {
                if (i && i % 9 == 8)
                    continue;
                if (i % 9 == 0)
                    data[Math.floor(i / 9 + 1)] = [];
                data[Math.floor(i / 9 + 1)][i % 9] = content[i].innerText;

            }
        })();
        var filename = "预约信息.xlsx"; //文件名称
        var ws_name = "Sheet1"; //Excel第一个sheet的名称
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, ws_name); //将数据添加到工作薄
        XLSX.writeFile(wb, filename); //导出Excel
        return ;
    });
}); 
