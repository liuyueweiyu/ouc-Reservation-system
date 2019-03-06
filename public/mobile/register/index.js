import "./index.scss";
import "../../admin/js/jsencrypt.min"
import verify from '../../src/script/verify';
class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            studentid:'',
            phonenumber:'',
            email:'',
            password:'',
            errname:'',
            errstudentid:'',
            errphonenumber:'',
            errpassword:'',
            erremail:'',
        }
    }
    changeState(type,e){
        this.setState({
            [type]:e.target.value
        });
    }
    blur(i, e) {
        let type = ['checkStudentid', 'checkName', 'checkPhone', 'checkEmail', 'checkPassword'],
            statetype = ['studentid', 'name', 'phonenumber', 'email', 'password'],
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

    submit(e){
        console.log(e);
        e.preventDefault();
        let type = ['checkStudentid', 'checkName', 'checkPhone', 'checkEmail', 'checkPassword'],
            statetype = ['studentid','name','phonenumber','email','password'];
        for (let i = 0; i < type.length; i++) {
            let msg = verify[type[i]](this.state[statetype[i]]);
            if(msg != ''){
                alert(msg);
                return;
            }
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
        let datas = {
            name : this.state.name,
            studentid:this.state.studentid,
            phonenumber:this.state.phonenumber,
            password :password,
            email:this.state.email
        }
        $.ajax({
            url: '../user/register',
            method:'POST',
            data: datas,
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if(data.code == 0)
                    window.location = './login-mobile.html';
            },
            error:function (data) {
                console.log('err:',data)
            }
        })
    }

    render(){
        return (
            <div className='register'>
                <h1 className='title'>众创空间自主预约系统</h1>
                <form className='form'>
                    <h2 className='subtitle'>注册</h2>
                        <input placeholder={this.state.errstudentid == '' ? '学号':this.state.errstudentid}  onBlur={this.blur.bind(this,0)} onChange={this.changeState.bind(this,'studentid')} value={this.state.studentid} className='item-input' type='text'></input>
                        <input placeholder={this.state.errname == '' ? '姓名':this.state.errname}  onBlur={this.blur.bind(this,1)} onChange={this.changeState.bind(this,'name')} className='item-input' value={this.state.name} type='text'></input>
                        <input placeholder={this.state.errphonenumber == '' ? '电话号码':this.state.errphonenumber}  onBlur={this.blur.bind(this,2)} onChange={this.changeState.bind(this,'phonenumber')} value={this.state.phonenumber} className='item-input' type='text'></input>
                        <input placeholder={this.state.erremail == '' ? '邮箱':this.state.erremail}  onBlur={this.blur.bind(this,3)} onChange={this.changeState.bind(this,'email')} className='item-input' value={this.state.email} type='email'></input>
                        <input placeholder={this.state.errpassword == '' ? '密码':this.state.errpassword}  onBlur={this.blur.bind(this,4)} onChange={this.changeState.bind(this,'password')} className='item-input' value={this.state.password} type='password'></input>
                    <div className='item'>
                        <a href='./login-mobile.html' className='link'>已有账号？</a>
                    </div>
                    <div className='item'>
                        <button onClick={this.submit.bind(this)} className='button'>立即注册</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;