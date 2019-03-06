import "./index.scss";
import "../../admin/js/jsencrypt.min"
import verify from '../../src/script/verify';
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            studentid:'',
            password:'',
            code:'',
            errstudentid:'',
            errpassword:'',
        }
    }
    componentDidMount(){
        this.changeCode();
    }
    changeState(type, e) {
        this.setState({
            [type]: e.target.value
        });
    }
    blur(i, e) {
        let type = ['checkStudentid', 'checkPassword'],
            statetype = ['studentid', 'password'],
            msg = verify[type[i]](e.target.value),
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
    changeCode() {
        let canvas, context;
        canvas = document.getElementById("canvas1");
        context = canvas.getContext('2d');
        canvas.width = 70;
        canvas.height = 27;
        context.beginPath();
        context.fillStyle = colorRandom(); //显示验证码区域的背景色
        context.rect(0, 0, 70, 27);
        context.fill();
        let code = ''
        for (let i = 0; i < 4; i++) {
            console.log(Math.floor((Math.random() * 10 + 8)))
            console.log((Math.random() * 20 + 18));
            
            context.font = (Math.random() * 10 + 8) + "px 微软雅黑"; //数字随机大小
            context.fillStyle = colorRandom(); //数字颜色
            const number = parseInt(Math.random() * 9);
            code += number.toString();
            context.fillText(number, 5 + 16 * i, 20); //0-9的随机数
        }
        /*定义函数生成随机颜色*/
        function colorRandom() {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        this.setState({
            checkcode: code
        });
    }

    submit(e) {
        e.preventDefault();
        let type = ['checkStudentid', 'checkPassword'],
            statetype = ['studentid', 'password'];
        for (let i = 0; i < type.length; i++) {
            let msg = verify[type[i]](this.state[statetype[i]]);
            if (msg != '') {
                alert(msg);
                return;
            }
        }


        if (this.state.checkcode != this.state.code) {
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
            method: 'POST',
            data: {
                studentid: this.state.studentid,
                password: password,
                code: this.state.code,
            },
            dataType: 'JSON',
            success: function (data) {
                alert(data.msg); 
                if (data.code == 0)
                    window.location = './reservation-mobile.html';
            },
            error: function (data) {
                // console.log('err:',data)
            }
        })
    }
    render(){
        return (
            <div className='login'>
                <h1 className='title'>众创空间自主预约系统</h1>
                <form className='form'>
                    <h2 className='subtitle'>欢迎预约</h2>
                    <input placeholder={this.state.errstudentid == '' ? '学号':this.state.errstudentid}  onBlur={this.blur.bind(this,0)} onChange={this.changeState.bind(this,'studentid')} value={this.state.studentid} className='item-input' type='text'></input>
                    <input placeholder={this.state.errpassword == '' ? '密码':this.state.errpassword}  onBlur={this.blur.bind(this,1)} onChange={this.changeState.bind(this,'password')} className='item-input' value={this.state.password} type='password'></input>
                    <div className='item'>
                        <input  value={this.state.code} onChange={this.changeState.bind(this,'code')} placeholder='验证码' className='item-input code clearmargin' type='text'></input>
                        <canvas className='canvas'  id="canvas1" onClick={this.changeCode.bind(this)} style={{width:'7rem',height:'2.7rem'}}></canvas>
                    </div>
                    <div className='item'>
                        <a href='./register-mobile.html' className='link'>还没注册？</a>
                    </div>
                    <div className='item'>
                        <button onClick={this.submit.bind(this)} className='button'>登录</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;