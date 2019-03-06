import React from 'react';

import './index.scss';
import Button from '../../component/button';
import TimeHelper from '../../script/time';

class Time extends React.Component{

    constructor(props){
        super(props);
        
        
        const objlist = [],
              now = new Date(),
              begin = new Date().setHours(8, 0, 0, 0).valueOf() / 1000;
        let days = ['周一','周二','周三','周四','周五','周六','周日'];
        days = days.slice(now.getDay() - 1).concat(days.slice(0, now.getDay() - 1))
        for (let i = 0; i < 7; i++) {
            objlist.push({
                time:begin+i*86400,
                day:[[0,0],[0,0],[0,0]]
            })
        }

        this.state = {
            list: objlist,
            days
        };
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
                })               
            }
        })

     }


    next(){
        if(this.props.login == 0){
            alert('请先登录!');
            window.location = './login.html';
            return;
        }
        if(this.props.status != 0){
            alert('请检查用户状态!');
            return;
        }
        if (this.props.isuppic != 1) {
            alert('有预约结束并未上传图片!');
            return;
        }
        const period = [0, 14400, 21600],
              obj = this.state.list[this.props.select[0]];
        this.props.nextStage({
            time : obj.time + period[this.props.select[1]],
            space: obj.day[this.props.select[1]]
        })
    }
    render(){
        return (
            <div className="time">
                <h2 className="choosetime"><span>现可预约的时间：</span>{this.state.list.length == 0?'': TimeHelper.getDatetr(this.state.list[0].time)}-{this.state.list.length == 0?'': TimeHelper.getDatetr(this.state.list[6].time)}</h2>
                <div className='timecontainer'>
                    {this.state.list.map((v,i)=>{
                        return(
                            <div className='day' key={i}>
                                <h4>{TimeHelper.getDatetr(v.time) + ' ' + this.state.days[i]}</h4>
                                <ul>
                                    {v.day.map((value,index)=>{
                                        return (
                                            <li 
                                            key={index} 
                                            className={(value[0] == 1 && value[1] == 1 ?'done':(value[0] > 1 && value[1] > 1 ? 'check': (((value[0] > 1|| value[1] > 1) && (value[0] == 1|| value[1] == 1))?'check' :'can')))
                                            + ((this.props.select[0] == i && this.props.select[1] == index) ? ' select':'')}
                                            onClick={this.props.selectTime.bind(this,i,index,value[0] == 1 && value[1] == 1)}>
                                                {index == 0?'上午':index == 1?'下午':'晚上'} 
                                                <p>{value[0] == 1 && value[1] == 1 ?'已预约':(value[0] > 1 && value[1] > 1 ? '等待审核中':(((value[0] > 1|| value[1] > 1) && (value[0] == 1|| value[1] == 1))?'等待审核中' :'可预约'))}</p>
                                            </li>
                                        )
                                    })}

                                </ul>
                            </div>
                        );
                    })}
                </div>
                <Button submit={this.next.bind(this)} text='下一步' />
            </div>
        )
    }
}

export default Time;