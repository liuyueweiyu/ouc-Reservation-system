import "./index.scss";
import verify from '../../../src/script/verify';
class Infor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            applicant:'',
            title:'',
            content:'',
            errapplicant: '',
            errtitle: '',
            errcontent:''
        }
    }

    componentDidMount(){

    }
    changeState(type, e) {
        this.setState({
            [type]: e.target.value
        });
    }
    blur(i, e) {
        let maxlen = [30,20, 100],
            statetype = ['applicant', 'title','content'],
            msg = verify.checkStr(e.target.value,maxlen[i]),
            errtype = 'err' + statetype[i];
        if (msg != '') {
            const old = this.state[statetype[i]];
            this.setState({
                [statetype[i]]: '',
                [errtype]: msg
            });
            const that = this;
            setTimeout(() => {
                that.setState({
                    [statetype[i]]: old,
                    [errtype]: ''
                });
            }, 1000);
        }

    }
    submit(e){
        e.preventDefault();
        const maxlen = [30, 20, 100],
              statetype = ['applicant', 'title', 'content'];
        let msg;
        for(let i = 0;i < 3;i++){
            msg = verify.checkStr(this.state[statetype[i]], maxlen[i]);
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
                organizer:this.state.applicant,
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
                <p className='label'>活动主办方：</p>
                <input className='input' maxLength={30}  placeholder={this.state.errapplicant == '' ? '请输入活动主办方':this.state.errapplicant}  onBlur={this.blur.bind(this,0)} onChange={this.changeState.bind(this,'applicant')} value={this.state.applicant} type='text' ></input>
                <p className='label'>申请主题：</p>
                <input className='input' maxLength={20} type='text' placeholder={this.state.errtitle == '' ? '请输入申请主题':this.state.errtitle}  onBlur={this.blur.bind(this,1)} onChange={this.changeState.bind(this,'title')} value={this.state.title}></input>
                <p className='label'>申请内容：</p>
                <textarea maxLength={100}  placeholder={this.state.errcontent == '' ? '请输入申请内容':this.state.errcontent}  onBlur={this.blur.bind(this,2)} onChange={this.changeState.bind(this,'content')} value={this.state.content} className='input textaera'></textarea>
               <button onClick={this.submit.bind(this)} className='botton'>立即申请</button>
            </div>
        );
    }
}

export default Infor;