import React from 'react';
import './index.scss';
import Button from  '../../component/button';
import TimeHelper from '../../script/time';
import verify from '../../script/verify';

class Infor extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            organizer:'',
            title:'',
            content:'',
            err:[0,0,0]
        }
    }

    changeInput(type,e){
        this.setState({
            [type]:e.target.value
        })
    }

    check(i,e){
        const lens = [30,20,100],
              types = ['organizer','title','content'],
              msg = verify.checkStr(this.state[types[i]], lens[i]);
        if(msg!=''){
            let old = this.state[types[i]],
                arr = this.state.err;
            arr[i] = 1;
            this.setState({
                [types[i]]:msg,
                err: arr
            })
            setTimeout(() => {
                this.setState({
                    [types[i]]: old,
                    err: [0,0,0]
                })
            }, 1000);
        }
    }

    submit(e){
        e.preventDefault();
        const maxlen = [30, 20, 100],
            statetype = ['organizer', 'title', 'content'];
        for(let i = 0;i < 3;i++){
            let msg = verify.checkStr(this.state[statetype[i]], maxlen[i]);
            if (msg != ''){
                alert(msg);
                return;
            }
        }
        $.ajax({
            url:'../user/reservation',
            method:'POST',
            data:{
                time:this.props.time,
                space:this.props.space,
                organizer:this.state.organizer,
                title:this.state.title,
                content:this.state.content
            },
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if(data.code == 0)
                    window.location.reload();
            }
        })
    }

    render(){
        return (
            <div className='infor'>
                <h2 className="choosetime">
                    现选择的时间：{TimeHelper.getTimestr(this.props.time)}
                    <a onClick={this.props.back} className='back'>返回</a>
                </h2>
                <form className='inforform clearfloat'>
                    <li><label>活动主办方：</label>
                    <input onBlur={this.check.bind(this,0)} className={this.state.err[0] == 1?'inforinput warning':'inforinput'} onChange={this.changeInput.bind(this,'organizer')} value={this.state.organizer} placeholder='请输入活动主办方' /></li>
                    <li><label>申请主题：</label>
                    <input onBlur={this.check.bind(this,1)}  className={this.state.err[1] == 1?'inforinput warning':'inforinput'}  onChange={this.changeInput.bind(this,'title')} value={this.state.title} placeholder='请输入申请主题' /></li>
                    <li><label className='inforlabel'   >申请内容：</label>
                    <textarea className='infortext' style={this.state.err[2] == 1?{color:'red'}:{}} onBlur={this.check.bind(this,2)}  onChange={this.changeInput.bind(this,'content')} className='infortext' value={this.state.content} placeholder='请输入申请内容'></textarea></li>
                </form>
                <Button text='立即预约' submit={this.submit.bind(this)}/>
            </div>
        );
    }
}

export default Infor;