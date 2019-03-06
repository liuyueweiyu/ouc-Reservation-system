import React from 'react';
import './index.scss';
import Inputbox from '../../component/inputbox';
import Button from '../../component/button';
import Link from '../../component/link';
import '../../../admin/js/jsencrypt.min';
import verify from '../../script/verify';

class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            studentid : '',
            name : '',
            phonenumber:'',
            email:'',
            password: '',
            err:[0,0,0,0,0]
        }
        this.changeInput = this.changeInput.bind(this);
        this.submit = this.submit.bind(this);
    }

    changeInput(e){
        this.setState({
            [e.target.dataset.statekey]:e.target.value
        })
    }

    submit(e){
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
        let datas = Object.assign({},this.state)
        datas.password = password;
        $.ajax({
            url: '../user/register',
            method:'POST',
            data: datas,
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                if(data.code == 0)
                    window.location = './login.html';
            },
            error:function (data) {
                console.log('err:',data)
            }
        })
    }

    blur(i,e){
        let type = ['checkStudentid', 'checkName', 'checkPhone', 'checkEmail', 'checkPassword'],
            statetype = ['studentid','name','phonenumber','email','password'] ,
            err = this.state.err,
            msg = verify[type[i]](e.target.value);
        if(msg != ''){
            const old = this.state[statetype[i]];
            err[i] = 1;
            
            this.setState({
                [statetype[i]]: msg,
                err:err
            });
            setTimeout(() => {
                this.setState({
                    [statetype[i]]: old,
                    err: [0,0,0,0,0]
                });
            }, 1000);
        }

    }

    render(){
        return (
            <div className="left">
                <form className='register'>
                    <h2 className="subtitle">注册</h2>
                    <Inputbox statekey='studentid' blur={this.blur.bind(this,0)} err={this.state.err[0]} change={this.changeInput} value={this.state.studentid} role='text' text='学号' />
                    <Inputbox statekey='name'  blur={this.blur.bind(this,1)}  err={this.state.err[1]} change={this.changeInput} value={this.state.name}  role='text' text='姓名' />
                    <Inputbox statekey='phonenumber'  blur={this.blur.bind(this,2)}  err={this.state.err[2]} change={this.changeInput} value={this.state.phonenumber}   role='text' text='电话' />
                    <Inputbox statekey='email'  blur={this.blur.bind(this,3)}  err={this.state.err[3]} change={this.changeInput}  role='email'  value={this.state.email}  text='邮箱' />
                    <Inputbox statekey='password' blur={this.blur.bind(this,4)}  err={this.state.err[4]} change={this.changeInput}  value={this.state.password}  role='password' text='密码' />
                    <Link text='已有账号?' _href='./login.html' />
                    <Button submit={this.submit} text='注册' />
                </form>
            </div>
        );
    }
}

export default Form;