import "./index.scss";
import TimeHelper from "../../../src/script/time";
class Time extends React.Component {
    constructor(props){
        super(props);
        const objlist = [],
            now = new Date(),
            begin = new Date().setHours(8, 0, 0, 0).valueOf() / 1000;
        let days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        days = days.slice(now.getDay() - 1).concat(days.slice(0, now.getDay() - 1))
        for (let i = 0; i < 7; i++) {
            objlist.push({
                time: begin + i * 86400,
                day: [
                    [0, 0],
                    [0, 0],
                    [0, 0]
                ]
            })
        }
        this.state = {
            select:0,
            selectlist:[],
            list: objlist,
            days,
            dayindex:0,
            daytimeindex: 0,
            daytime:['上午','下午','晚上'],
            hegiht: window.innerHeight
        }
    }
    
    componentDidMount() {
        const that = this;
        $.ajax({
            url: '../user/list',
            method:'GET',
            dataType:'JSON',
            success:function (data) {
                const list = data.data,
                    objlist = that.state.list,
                    now = new Date(),
                    begin = new Date().setHours(8, 0, 0, 0).valueOf() / 1000;

                for (let i = 0; i < list.length; i++) {
                    const element = list[i],
                        day = Math.floor((element.time - begin) / 86400),
                        time = (element.time - begin) % 86400;
                    let timestr;
                    switch (time) {
                        case 0:timestr = 0;break;
                        case 14400: timestr = 1;break;
                        default:timestr = 2 ;break;
                    }
                    if(element.status == 0){
                        if (objlist[day].day[timestr][element.space] == 0)
                            objlist[day].day[timestr][element.space] = 2;
                        else
                            objlist[day].day[timestr][element.space]++;
                    }
                    else{
                        objlist[day].day[timestr][element.space] = 1;
                    }
                }
                that.setState({
                    list:objlist
                });
                that.props.setSpaces(objlist[0].day[0]);
            }
        })

     }

    closeSelect(){
        this.setState({
            select: 0,
            selectlist: []
        })
    }

    chooseDayItem(time,i){
        this.props.setTime(time);
        console.log(this.state.list[i].day[this.state.daytimeindex])
        this.props.setSpaces(this.state.list[i].day[this.state.daytimeindex]);
        this.setState({
            select:0,
            dayindex:i
        })
    }

    chooseDay(){
        this.setState({
            select:1,
            selectlist: this.state.list
        })
    }
    chooseDaytime(){
        this.setState({
            select:2,
            selectlist: this.state.daytime
        })
    }

    chooseDaytimeItem(i) {
        const space = [0, 14400, 36000];
        this.props.setTime(this.state.list[this.state.dayindex].time + space[i]);
        this.props.setSpaces(this.state.list[this.state.dayindex].day[i]);
        this.setState({
            select:0,
            daytimeindex: i
        })
    }

    nextStage(){
        if(this.props.islogin == 0){
            alert('尚未登录!');
            window.location = './login-mobile.html';
            return;
        }
        if (this.props.status != 0) {
            alert('请检查用户状态!');
            return;
        }
        if (this.props.isuppic != 1) {
            alert('有预约结束并未上传图片!');
            return;
        }
        const value = this.state.list[this.state.dayindex].day[this.state.daytimeindex];
        if (value[0] == 1 && value[1] == 1) {
            alert('当前时间段已被预约!');
            return;
        }
        this.props.next();
    }

    touch(e){
        if(this.state.select != 0)
            e.preventDefault();
    }

    render(){
        const value = this.state.list[this.state.dayindex].day[this.state.daytimeindex];
        return (
            <div className='time' onTouchStart={this.touch.bind(this)}>
               {
                   this.state.select != 0 &&
                   <div className='select'>
                        <ul className='selectlist' style={{top:`calc(${this.state.hegiht}px - ${this.state.select != 1 ? '20.8rem':'41.6rem'})`}}>
                            {this.state.selectlist.map((v,i)=>{
                                if (this.state.select != 1)
                                    return (
                                        <li key={i} onClick={this.chooseDaytimeItem.bind(this,i)} className='selectitem'>{v}</li>
                                    );
                                else
                                    return (
                                        <li key={i} onClick={this.chooseDayItem.bind(this,v.time,i)} className='selectitem'>{TimeHelper.getDatetr(v.time)}</li>
                                    );
                            })}
                            <li onClick={this.closeSelect.bind(this)} className='selectitem selectback'>取消</li>
                        </ul>
                    </div>
               }
               <div className='item' onClick={this.chooseDay.bind(this)}>
                    <span className='sub'>日期：</span>
                    {TimeHelper.getDatetr(this.props.time)}
                    <img className='turndown' src={require('./turn-down.png')}></img>
               </div>
               <div className='item'  onClick={this.chooseDaytime.bind(this)}>
                    <span className='sub'>时间段：</span>
                    {this.state.daytime[this.state.daytimeindex]}
                    <img className='turndown' src={require('./turn-down.png')}></img>
               </div>
                <div className='item'>
                    <span className='sub'>状态：</span>
                    <span className={value[0] == 1 && value[1] == 1 ? 'done' : (value[0] > 1 && value[1] > 1 ? 'check' : (((value[0] > 1 || value[1] > 1) && (value[0] == 1 || value[1] == 1)) ? 'check' : 'can'))}>

                    
                    {
                        value[0] == 1 && value[1] == 1 ? '已预约' : (value[0] > 1 && value[1] > 1 ? '等待审核中' : (((value[0] > 1 || value[1] > 1) && (value[0] == 1 || value[1] == 1)) ? '等待审核中' : '可预约'))
                    }
                    </span>
               </div>
               <button className='botton' onClick={this.nextStage.bind(this)}>下一步</button>
            </div>
        );
    }
}

export default Time;