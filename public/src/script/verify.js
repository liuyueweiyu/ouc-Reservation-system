function checkStudentid(value) {
    if(value.length == 0)
        return '学号不能为空!'
    return /^[A-Za-z0-9]{3,11}$/.test(value) ? '' : '学号格式错误！';
}

function checkPassword(value) {
    if (value.length < 6)
        return '密码不能少于6个字符';
    if (value.length > 18) {
        return `密码不得多于18个字符`;
    }
    return  /^[^*$#<>]+$/.test(value)?'':'密码含有特殊字符';
}


function checkEmail(value) {
    if (value.length >= 50)
        return '电子邮箱长度过长';
    const boo = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
    return boo ? '' : '电子邮箱格式错误';
}

function checkEditorEmail(value) {
    if (value.length >= 50)
        return '长度过长';
    const boo = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
    return boo ? '邮箱修改后需重新验证' : '格式错误';
}

function checkName(value) {
    if (value.length == 0)
        return '姓名输入不能为空';
    if (value.length > 10) {
        return `姓名不得多于10个字符`;
    }
    return /^[^*$#<>]+$/.test(value) ? '' : '姓名不得含有特殊字符';
}

function checkStr(value, maxlen) {
    if (value.length == 0)
        return '输入不能为空';
    if (value.length > maxlen)
        return `输入字符串不能超过${maxlen}个字符`;
    return /^[^*$#<>]+$/.test(value) ? '' : '含有特殊字符';
}

function checkNumber(value) {
    if (!value)
        return '输入不能为空';
    return isNaN(value) ? '请输入数字' : '';
}

function checkPhone(value) {
    return /^1[345789]\d{9}$/.test(value) ? '' : '电话号码格式错误';
}

export default  {
    checkEmail,
    checkName,
    checkNumber,
    checkPhone,
    checkStr,
    checkStudentid,
    checkPassword,
    checkEditorEmail
}