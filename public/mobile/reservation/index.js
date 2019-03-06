import "./index.scss";
import TimeHelper from "../../src/script/time";
import Time from './time';
import Space from './space';
import Infor from './infor';

class Reservation extends React.Component {
    constructor(props){
        super(props);
        
        // margin: 2.4 rem auto;
        const title = TimeHelper.getDatetr(Math.floor(new Date().valueOf()/1000)) + ' - ' + TimeHelper.getDatetr(Math.floor(new Date().valueOf()/1000 + 6 * 86400));
        this.state = {
            stage:0,
            title,
            time: new Date(new Date().setHours(8, 0, 0, 0)) / 1000,
            space:0,
            spaces:[0,0],
            isuppic:1,
            login:0,
            status:0,
            style: navigator.userAgent.indexOf('iPad') == -1?{}:{position:'static',margin:'2.4rem auto'}
        }
    }
    



    componentDidMount(){
        const that = this;
        $.ajax({
            url:'../user/checklog',
            method:'GET',
            dataType:'JSON',
            success:function (data) {
                if (data.code == 0 || data.code == 2) {
                    that.setState({
                        login: 1,
                    })
                }
                that.setState({
                    status: data.status
                })
                if (data.code == 2) {
                    that.setState({
                        isuppic: 2,
                    })
                }
            }
        })
    }

    back(){         //返回上一个阶段
        this.setState({
            stage : this.state.stage - 1
        })
    }

    setTime(v){    //设置选择时间
        this.setState({
            time:v
        })
    }

    setSpaces(spaces){      //设置一天的哪个时间段
        this.setState({
            spaces
        });
    }

    setStage(i){        //设置选择时间/地点/完善信息
        this.setState({
            stage: i
        })
    }

    setSpace(i) {
        this.setState({
            space: i
        });
    }

   toLogin(){
        if(this.state.login == 0)
            window.location = './login-mobile.html';
        else
            alert('移动端不支持打开个人中心，请使用电脑打开!');
   }

    render(){
        return (
            <div className='reservation'>
                <h1 className='title textbox'>众创空间自主预约系统<img onClick={this.toLogin.bind(this)} className='person textinner' src={require('../../src/component/title/person.png')} /></h1>
                <h2 className='subtitle textbox'>
                    { this.state.stage == 0 && this.state.title}
                    {this.state.stage != 0 && TimeHelper.getDatetr(this.state.time)}
                    {this.state.stage != 0 && <span onClick={this.back.bind(this)} className='back textinner'>返回</span>}
                </h2>
                {this.state.stage == 0 && <Time status={this.state.status} isuppic={this.state.isuppic} islogin={this.state.login} time={this.state.time} setTime={this.setTime.bind(this)} setSpaces={this.setSpaces.bind(this)} next={this.setStage.bind(this,1)}  />}
                {this.state.stage == 1 && <Space setSpace={this.setSpace.bind(this)} space={this.state.space} spaces={this.state.spaces} next={this.setStage.bind(this,2)} />}
                {this.state.stage == 2 && <Infor time={this.state.time} space={this.state.space} />}
                <p className='copyright' style={this.state.style}>Copyright @2018 爱特工作室</p>
            </div>
        );
    }
}

export default Reservation;