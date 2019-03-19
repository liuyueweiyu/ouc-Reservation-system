const sqlhelper = require('../Utils/SqlHelper');
async function unlock(req,res) {
    let ids = req.body.id,
        data;
    try {
        data = await sqlhelper.deleteItems('infor', ids);
        res.send(JSON.stringify({
            code: 0,
            msg: '解锁成功!'
        }))
    } catch (error) {
        res.send(JSON.stringify({
            code: error.code,
            msg: error.msg || '未知错误!'
        }))
    }
}

function single(body) {
    const single = body.single,
          time = body.time,
          space = body.space,
          spacings = [0,14400,36000],
          values = [];
    if (time != 0) {
        if (space != '0')
            values.push(`${Number(single)+spacings[time-1]},${space-1}`);
        else {
            values.push(`${Number(single)+spacings[time-1]},0`);
            values.push(`${Number(single)+spacings[time-1]},1`);
        }
    } else {
        for (let i = 0; i < spacings.length; i++) {
            const element = spacings[i];
            if (!space)
                values.push(`${Number(single)+element},${space-1}`);
            else {
                values.push(`${Number(single)+element},0`);
                values.push(`${Number(single)+element},1`);
            }
        }
    }
    return values;
}


function muti(body) {
    const values = [];
    const spacing = body.day == 0 ? 86400 : 86400 * 7,
        day = body.day,     //一周的时间段
        end = Number(body.end) + 86400,
        time = Number(body.time),   //一天的三个时间段
        space = body.space;
    let begin = body.day == 0 ? Number(body.begin) : Number(body.begin) + ((day - (new Date(body.begin * 1000)).getDay() + 7) % 7) * 86400,
        _start = Number(begin),
        spacings = [spacing, spacing, spacing],
        flag = 0;
    switch (time) {
        case 0:
            spacings = [0, 14400, 36000];
            // spacings = [14400, 21600, 50400];
            break;
        case 1:
            break;
        case 2:
            _start += 60 * 60 * 4;
            break;
        case 3:
            _start += 60 * 60 * 10;
            break;
        default:
    }

    while (_start < end) {
        if (space != "0")
            values.push(`${_start},${space-1}`);
        else {
            values.push(`${_start},0`);
            values.push(`${_start},1`);
        }
        if (time == 0) {        //一天的三个时段
            _start += spacings[flag];
            if(flag == 2){
                flag = 0;
                if (day != 0) //一周的某一天
                    _start += 6 * 86400;
            }
            else
                flag++;            
        }       
        else{       //一天的某一个时间段
            if (day == 0) //一周的每天
                _start +=  86400;
            else
                _start += 7 * 86400;
        }
    }
    return values;
}

async function lock(req,res) {
    const body =req.body;
    let sql,str,datas = [];
    let id = 1;
        
    if(body.type == 1)
        datas = muti(body),
        str = ` between  ${body.begin} AND ${body.end}`;
    else
        datas = single(body),
        str = `= ${body.single}`;
    try {
        let data = await sqlhelper.selectTableItem('infor', ` where time${str} and (status = 1 or status = 3)`,['space','time']);
        let flag = false;
        for (let i = 0; i < data.length; i++) {
            const element = `${data[i].time},${data[i].space}`;
            if(datas.indexOf(element) != -1){
                flag = {
                    code: 2,
                    time: data[i].time,
                    space: data[i].space
                };
                break;
            }
        }
        if(flag){
            throw flag;
        }
        else{
            const time = [],space = [],
                  obj = {},
                  len = datas.length;
            obj.applicant = new Array(len).fill(id).join();
            obj.organizer = new Array(len).fill(body.organizer).join();
            obj.title = new Array(len).fill(body.title).join();
            obj.content = new Array(len).fill(body.content).join();
            for (let i = 0; i < datas.length; i++) {
                const s = datas[i].split(',');
                time.push(s[0]);
                space.push(s[1]);
            }
            obj.time = time.join();
            obj.space = space.join();
            obj.status = new Array(len).fill(1).join();
            obj.send = new Array(len).fill(0).join();
            try {
                await sqlhelper.insertItems('infor', obj);
                res.send(JSON.stringify({
                    code: 0,
                    msg: '添加成功!'
                }));
            } catch (error) {
                res.send(JSON.stringify({
                    code: 1,
                    msg: '添加失败!'
                }));
            }
        }

    } catch (error) {
        res.send(JSON.stringify(Object.assign({
            code: error.code,
            msg: error.msg || '未知错误!'
        }),error));
    }
}

module.exports = {
    unlock,
    lock
}