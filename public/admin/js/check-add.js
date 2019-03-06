layui.use(['form','layer'], function(){
    var $ = layui.jquery;
    var form = layui.form;
          //监听提交
    form.on('submit(add)', function(data){
        var wb; //读取完成的数据
        var rABS = false; //是否将文件读取为二进制字符串;
        var obj = $("#upfile")[0];
        if (!obj.files)return;
        var f = obj.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (rABS) {
                wb = XLSX.read(btoa(fixdata(data)), { //手动转化
                    type: 'base64'
                });
            } else {
                wb = XLSX.read(data, {
                    type: 'binary'
                });
            }
            //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
            //wb.Sheets[Sheet名]获取第一个Sheet的数据
            const studentid = [],name = [];
            res = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                studentid.push(element.studentid);
                name.push(element.name);
            }
            $.ajax({
                url: './addcheck',
                data: {
                    name: name.join(),
                    studentid:studentid.join()
                },
                method:'POST',
                dataType:'JSON',
                success:function (data) {
                    alert(data['msg']);
                    if(data.code == 0){
                        var index = parent.layer.getFrameIndex(window.name);
                        //关闭当前frame
                        window.parent.active.reload();
                        parent.layer.close(index);
                    }

                }
            })
        };
        if (rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
        function fixdata(data) { //文件流转BinaryString
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }
        return false;
    });
          
});


// function importf(obj) { //导入
//     let res;
//     if (!obj.files) {
//         return;
//     }
//     var f = obj.files[0];
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         var data = e.target.result;
//         if (rABS) {
//             wb = XLSX.read(btoa(fixdata(data)), { //手动转化
//                 type: 'base64'
//             });
//         } else {
//             wb = XLSX.read(data, {
//                 type: 'binary'
//             });
//         }
//         //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
//         //wb.Sheets[Sheet名]获取第一个Sheet的数据
//         res = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
//         return res;
//     };
//     if (rABS) {
//         reader.readAsArrayBuffer(f);
//     } else {
//         reader.readAsBinaryString(f);
//     }
//     // return res;
// }

