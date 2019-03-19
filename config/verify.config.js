function checkEmail(value) {
    if(value.length >= 50)
        return '长度过长';
    const boo = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
    return boo ? undefined : '邮箱格式不正确';
}

function checkName(value,min = 2) {
    if (value.length == 0)
        return '输入不能为空';
    if (value.length > value) {
        return `不得多于${value}个字符`;
    }
    if (value.length < min) {
        return `不得少于${min}个字符`;
    }
    return /^[a-zA-Z0-9]+$/.test(value) ? undefined : '不得含有特殊字符';
}
function checkStr(value,maxlen) {
    if(value.length == 0)
        return '输入不能为空';
    if(value.length > maxlen)
        return `输入字符串不能超过${maxlen}个字符`;
    return /^[^*$#<>]+$/.test(value) ? undefined : '含有特殊字符';
}

function checkNumber(value) {
    if (!value)
        return '输入不能为空';
    return isNaN(value) ? '请输入数字' : undefined;
}

function checkPhone(value) {
    return /^1[345789]\d{9}$/.test(value) ? undefined : '电话号码错误';
}
function testPro(keys, values) {
    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        let res = this[element](values[i])        
        if (res != undefined)
            return res;
    }
    return undefined;
}
const base = {
    id: function (value) {
        return checkNumber(value);
    },
    name: function (value) {
        return checkName(value);
    },
    test: function (keys, values) {
        return testPro.bind(this)(keys, values);
    }
}

const admins = {
    email: function (value) {
        return checkEmail(value);
    },
    ranks:function (ranks) {
        if(ranks !== 0 && ranks !== 1)
            return '权限错误'
        return;
    },
    password:function () {
        return;
    }
}
Object.assign(admins,base);

const checkinfor = Object.assign({}, admins, {
    studentid:function (value) {
            return /^[A-Za-z0-9]{3,11}$/.test(value) ? undefined : '不能包含特殊符号或字符过长';
    },
    name:function (value) {
        return value.length == 0 || value.length > 10 ? '非法字符' : undefined;
    }
});

const emails= Object.assign({},admins);
delete emails.rank;

const users = {
    status : function (value) {
        return value > 3 || value < 0 ? '状态错误' : undefined;
    },
    phonenumber : function (value) {
        return checkPhone(value);
    },
    password: function () {
        return;
    },
    studentid:function (value) {
        return /^[A-Za-z0-9]{3,11}$/.test(value) ? undefined : '不能包含特殊符号或字符过长';
    },
    code:function (value) {
        return;
    }
}

Object.assign(users, emails,{
    name: function (value) {
        if(value.length == 0)
            return '姓名不能为空!';
        if(value.length >= 10)
            return '不能超过十个字符!';
        return /[^\x00-\xff]/.test(value) ? undefined:'不能含有特殊字符';
    }
});

const infor = (Object.assign({},base));

Object.assign(infor,{
    applicant:function (value) {
        return checkNumber(value);
    },
    space:function (value) {
        return value != 1 && value != 0 ? '参数错误' : undefined;
    },
    organizer:function (value) {
        return checkStr(value,30);
    },
    title:function (value) {
        return checkStr(value,20);
    },
    send:function (value) {
        return value != 1 && value != 0 ? '参数错误' : undefined;
    },
    content:function (value) {
        return checkStr(value,100);
    },
    time:function (value) {
        return isNaN(value)?'时间错误!':undefined;
    },
    status:function (value) {
        return checkNumber(value);
    },
    reason:function (value) {
        if(value.length >50)
            return '长度不能超过50!';
        return;
    },
    picture:function (value) {
        return checkStr(value,250);
    }
});
delete infor.name;


let locks = {
    space:function (value) {
        if(value!== 1||value!==0)
            return '参数错误!';
        return;        
    }
}
locks = Object.assign(locks, checkinfor);
delete locks.inforid;

module.exports = {
    admins,
    checkinfor,
    emails,
    users,
    infor,
    locks
}