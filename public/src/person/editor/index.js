import './index.scss';
import Verify from "../../script/verify";
import '../../../admin/js/jsencrypt.min';

class Editor extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            stage : 0,
            phonenumber: props.phonenumber,
            email:props.email,
            password:'',
            repwd:'',
            phoneerr:'',
            emailerr:'邮箱修改后需重新验证',
            pwderr:'',
            repwderr:'',
            flag:true
        }
        this.checkRepwd = this.checkRepwd.bind(this);
    }

    changeStage(i,e){
        e.preventDefault();
        this.setState({
            stage:i,
            phonenumber:this.props.phonenumber,
            email:this.props.email,
            password:'',
            repwd:'',
            phoneerr:'',
            emailerr: '邮箱修改后需重新验证',
            pwderr:'',
            repwderr:'',
            flag:true
        });
    }

    changeInput(type,e){
        this.setState({
            [type]:e.target.value
        })
    }

    checkRepwd(value){
        return value == this.state.password ? '':'前后两次密码不一致';
    }

    checkInfor(type,value,check){
        const result = check(this.state[value]);
        this.setState({
            [type]: result,
            flag:result==''
        });
    }

    submitInfor(e){
        e.preventDefault();
        if (Verify.checkEmail(this.state.email) != '' || Verify.checkPhone( this.state.phonenumber) != '')
            return;
        
        $.ajax({
            url:'../user/updateinfor',
            method:'POST',
            data:{
                phonenumber:this.state.phonenumber,
                email:this.state.email,
                emailflag: this.state.email == this.props.email ? 1 : 0
            },
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if (data.code == 1) {
                    window.location = './login.html';
                    return;
                }
                if (data.code == 0){
                    window.location.reload();
                }
            }
        })
    }

    submitPassword(e){
        e.preventDefault();
        if(this.state.pwderr != '' || this.state.repwderr != '')
            return;
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
            url: '../user/updatepwd',
            method: 'POST',
            data: {password},
            dataType: 'JSON',
            success: function (data) {
                if (data.code == 0) {
                    alert('尚未登录!');
                    window.location = './login.html';
                    return;
                }
                if(data.status == 0){
                    alert('修改成功!');
                    window.location = './person.html';
                }
                    
                else
                    alert('修改出错!');
                
            }
       
        })
    }

    render(){
        if(this.state.stage == 0){
            return (
                <form className='editor'>
                    <div className='left'>
                        <label>电话:</label>
                        <label>电子邮箱:</label>
                    </div>
                    <div className='center'>
                        <div className='buttons'>
                            <button  className='button' onClick={this.changeStage.bind(this,0)}>编辑信息</button>
                            <button className='button' onClick={this.changeStage.bind(this,1)}>修改密码</button>
                        </div>
                        <input type='text' onBlur={this.checkInfor.bind(this,'phoneerr','phonenumber',Verify.checkPhone)} onChange={this.changeInput.bind(this,'phonenumber')} value={this.state.phonenumber} className='input' />
                        <input type='text' onBlur={this.checkInfor.bind(this,'emailerr','email',Verify.checkEditorEmail)} onChange={this.changeInput.bind(this,'email')} value={this.state.email} className='input' />
                        <button className='submit' onClick={this.submitInfor.bind(this)}>完成</button>
                    </div>
                    <div className='left right'>
                        <label>{this.state.phoneerr}</label>
                        <label>{this.state.emailerr}</label>
                    </div>
                </form>
            )            
        }
        return (
            <form className='editor'>
                <div className='left'>
                    <label>密码:</label>
                    <label>确认密码:</label>
                </div>
                <div className='center'>
                    <div className='buttons'>
                        <button  className='button' onClick={this.changeStage.bind(this,0)}>编辑信息</button>
                        <button className='button' onClick={this.changeStage.bind(this,1)}>修改密码</button>
                    </div>
                    <input type='password' onBlur={this.checkInfor.bind(this,'pwderr','password',Verify.checkPassword)} onChange={this.changeInput.bind(this,'password')} value={this.state.password} className='input' />
                    <input type='password'  onBlur={this.checkInfor.bind(this,'repwderr','repwd',this.checkRepwd)} onChange={this.changeInput.bind(this,'repwd')} value={this.state.repwd} className='input' />
                    <button className='submit' onClick={this.submitPassword.bind(this)}>完成</button>
                </div>
                <div className='left right'>
                    <label>{this.state.pwderr}</label>
                    <label>{this.state.repwderr}</label>
                </div>
            </form>
        );
    }
}

export default Editor;