function  getNextDay(year, month, day, n) {
    let nextYear = year,
        nextMonth = month,
        nextDay = day;
    const rel = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //月份对应日期表
    if (year % 400 == 0 || year % 4 == 0 && year % 100 != 0) //闰年
        rel[1] += 1;
    if (day > rel[month - 1] || day <= 0) //非法检查
        return 'Day无效!';
    if (month > 12 || month <= 0)
        return 'Month无效!';
    if (year < 1815 || year > 2050)
        return 'Year无效!';

    //隔一天判断
    if (day + n > rel[month - 1]) { //判断是否跨月份
        if (month == 12) //判断是否跨年份
            nextMonth = 1, nextYear++;
        else
            nextMonth++;
        nextDay = (day + n) % rel[month - 1]; //若跨月份，日期不能单纯直接上加
    } else
        nextDay += n; //不是特殊情况
    return `${nextMonth}月${nextDay}日` //返回'yyyy.mm.dd'格式
}

function getTimestr(value) {
    const date = new Date(value * 1000);
    return `${date.getMonth()+1}月${date.getDate()}日 ${date.getHours() == 8?'上午':date.getHours() == 12?'下午':'晚上'}  `;
}

function getDatetr(value) {
    const date = new Date(value * 1000);
    return `${date.getMonth()+1}月${date.getDate()}日`;
}

function getDay(number) {
    switch (number) {
        case 1:
            return '周一';
        case 2:
            return '周二';
        case 3:
            return '周三';
        case 4:
            return '周四';
        case 5:
            return '周五';
        case 6:
            return '周六';
        case 7:
            return '周日';
        default:
            break;
    }
}

export default {
    getNextDay,
    getDay,
    getTimestr,
    getDatetr
}