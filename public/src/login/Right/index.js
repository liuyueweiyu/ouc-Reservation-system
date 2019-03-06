import './index.scss';
import Inputbox from '../../component/inputbox';
import Button from '../../component/button';
import Link from '../../component/link';
import '../../../admin/js/jsencrypt.min';
import verify from '../../script/verify';
class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            forget:0,
            checkcode: '',
            studentid:'',
            password:'',
            code:'',
            forgetid:'',
            forgetemail:'',
            err:[0,0]
        }
        this.changeInput = this.changeInput.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        if(this.state.forget == 0)
            this.changeCode();
    }

    changeCode(){
        let canvas,context;
        canvas = document.getElementById("canvas1");
        context = canvas.getContext('2d');
        canvas.width = 163;
        canvas.height = 100;
        context.beginPath();
        context.fillStyle = colorRandom(); //显示验证码区域的背景色
        context.rect(0, 0, 169, 63);
        context.fill();
        let code = ''
        for(let i = 0;i<4;i++){ 
            context.font =( Math.random()*20+18)+"px 微软雅黑";//数字随机大小
            context.fillStyle = colorRandom();//数字颜色
            const number = parseInt(Math.random() * 9);
            code += number.toString();
            context.fillText(number, 3+40*i,40);   //0-9的随机数
        }
        /*定义函数生成随机颜色*/
        function colorRandom(){
            let r = Math.floor(Math.random()*256);
            let g = Math.floor(Math.random()*256);
            let b = Math.floor(Math.random()*256);
            return "rgb("+ r + ","+ g +","+ b+")";
        }
        this.setState({
            checkcode:code
        });
    }


    changeInput(e){
        this.setState({
            [e.target.dataset.statekey]:e.target.value
        })
    }

    submit(e){
        e.preventDefault();
        let type = ['checkStudentid', 'checkPassword'],
            statetype = ['studentid', 'password'];
        for (let i = 0; i < type.length; i++) {
            let msg = verify[type[i]](this.state[statetype[i]]);
            if(msg != ''){
                alert(msg);
                return;
            }
        }
            

        if(this.state.checkcode != this.state.code){
            alert('验证码错误!');
            return;
        }
        let password = this.state.password;
        const key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;
        if (!localStorage.getItem(password)) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(key);
            password = encrypt.encrypt(password);
            localStorage.setItem(this.state.password, password);
        } else
            password = localStorage.getItem(password);
        $.ajax({
            url: '../user/login',
            method:'POST',
            data:{
                studentid: this.state.studentid,
                password: password,
                code: this.state.code,
            },
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if(data.code == 0)
                    window.location = './index.html';
            },
            error:function (data) {
                // console.log('err:',data)
            }
        })
    }

    blur(i, e) {
        let type = ['checkStudentid', 'checkPassword'],
            statetype = ['studentid', 'password'],
            err = this.state.err,
            msg = verify[type[i]](e.target.value);
        if (msg != '') {
            const old = this.state[statetype[i]];
            err[i] = 1;
            this.setState({
                [statetype[i]]: msg,
                err: err
            });
            setTimeout(() => {
                this.setState({
                    [statetype[i]]: old,
                    err: [0, 0]
                });
            }, 1000);
        }

    }

    changeForget(e){
        e.preventDefault();
        this.setState({
            forgetid:e.target.value
        })
    }

    changeForgetEmail(e){
        e.preventDefault();
        this.setState({
            forgetemail:e.target.value
        })
    }

    toforget(){
        this.setState({
            forget:1
        })
    }

    forget(){
        $.ajax({
            url: '../user/forget',
            method:'POST',
            data:{
                studentid: this.state.forgetid,
                email:this.state.forgetemail
            },
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if(data.code == 0){
                    window.location.reload();
                }
            }
        })
    }

    render(){
        return (
            <div className="right">
                {this.state.forget == 0 &&
                    <form className='login'>
                        <h2 className="subtitle">欢迎预约</h2>
                        <Inputbox  blur={this.blur.bind(this,0)} err={this.state.err[0]}  value={this.state.studentid}  statekey='studentid'  change={this.changeInput} role='text' text='学号' />
                        <Inputbox  blur={this.blur.bind(this,1)} err={this.state.err[1]}  value={this.state.password}   statekey='password'  change={this.changeInput} role='password' text='密码' />
                        <div className='code'>
                            <Inputbox  statekey='code' value={this.state.code}  change={this.changeInput} role='text'  text='验证码' />
                            <canvas id="canvas1" onClick={this.changeCode.bind(this)} height='63' width='169'></canvas>
                        </div>
                        <div className='links clearfloat'>
                            <Link text='没有账号?'_href='./register.html' />
                            <Link text='忘记密码' click={this.toforget.bind(this)} />
                        </div>
                        
                        <Button submit={this.submit} text='登录' />
                    </form>
                }
                {this.state.forget == 1 && 
                    <div className='login forget'>
                        <h2 className="subtitle">忘记密码</h2>
                        <label className='lable'>请输入学号：</label>
                        <input type='text' onChange={this.changeForget.bind(this)} />
                        <label style={{marginTop:'4px'}}>请输入邮箱：</label>
                        <input className='input' type='text' onChange={this.changeForgetEmail.bind(this)} />
                        <Button submit={this.forget.bind(this)} text='找回密码' />
                    </div>
                }
            </div>
        )
    }
}

export default Login;