import './index.scss';
import Status from './status';
import Editor from './editor';
import Reservation from './reservation';
import Button from '../component/button/';
import compressImage from '../script/compressImg';
import Disorder from './disorder';
// import { BrowserRouter } from 'react-router-dom'
class Person extends React.Component{
    constructor(props){
        super(props);
        const stage = window.location.search.slice(window.location.search.indexOf('=')+1) || 0;
        this.state = {
            stage: 0,
            detail :{},
            images :[],
            imgurls:[],
            layer:0
        }
    }

    changeStage(i){
        this.setState({
            stage:i
        });
    }

    componentDidMount(){
        const that = this;
        $.ajax({
            url:'../user/infor',
            method:'GET',
            dataType:'JSON',
            success:function (data) {
                if(data.code != 0){
                    alert(data.msg);
                    window.location = './login.html';
                    return;
                }
                that.setState({
                    id:data.id,
                    name:data.name,
                    status:data.status,
                    email:data.email,
                    phonenumber:data.phonenumber
                });
            }
            
        })
    }

    changeFile(e){
        let ua = navigator.userAgent.toLowerCase(),
            url = '',
            that = this;
        
        if (/msie/.test(ua)) {
            url = e.target.value;
        } else {
            url = window.URL.createObjectURL(e.target.files[0]);
        }

        compressImage(e.target.files[0], (data) => {
            that.setState({
                images: that.state.images.concat(url),
                imgurls: that.state.imgurls.concat(data)
            })
        },function () {
            alert('上传出错!');
        })
    }

    removeImage(i,e){

        const images = this.state.images,
              imgurls = this.state.imgurls;

        this.setState({
            images:images.slice(0,i).concat(images.slice(i+1)),
            imgurls: imgurls.slice(0, i).concat(imgurls.slice(i + 1)),
        })
    }

    submitImg(){
        if(this.state.imgurls == 0){
            alert('请选择图片!');
            return;
        }
        const formData = new FormData();
        const that = this;
        for (let i = 0; i < this.state.imgurls.length; i++) {
            formData.append('image', this.state.imgurls[i]);
        }
        formData.append('id',this.state.layer);
        $.ajax({
            url: '../file_upload',
            method:'POST',
            dataType:'JSON',
            processData: false,
            contentType: false,
            data: formData,
            success:function (data) {
                alert(data.msg);
                if(data.code == 0){
                    that.closeLayer(false);

                    window.location = './person.html?stage=2'
                }
            }
        })
    }

    closeLayer(flag){
        
        if(flag && this.state.images.length != 0){
            const flag = !confirm('确认关闭?');
            if(flag)
                return;
        }
        this.setState({
            layer:0,
            images:[],
            imgurls:[]
        })
    }

    openLayer(i){
        this.setState({
            layer:i
        })
    }

    logout(){
        $.ajax({
            url: '../user/logout',
            method:'GET',
            dataType:'JSON',
            success:function (data) {
                alert(data.msg);
                window.location = './index.html';
            }
        })
    }

    render(){
        return  (
            <BrowserRouter>
                {
                    this.state.layer != 0 && 
                    <div className='layer'>
                        <div className='box'>
                            <div className='clearfloat'>
                                <span>请选择上传的图片（至多五张）</span>    
                                <img src={require('./back.png')} className='back'  onClick={this.closeLayer.bind(this,true)} />   
                            </div>
                            <div className='upimgs'>
                                {this.state.images.map((v,i)=>{
                                    return (
                                        <div className='imageitem' key={i} style={{backgroundImage:`url(${v})`}}>
                                            <img className='close' onClick={this.removeImage.bind(this,i)}  src={require('./back.png')}  />
                                        </div>
                                    )
                                    
                                })}
                                {
                                    this.state.images.length != 5 &&
                                    <label className='imageitem up'>
                                        <input type='file' accept='image/*' onChange={this.changeFile.bind(this)} />
                                    </label>
                                }
                            </div>
                            <div style={{textAlign: 'center'}}><Button submit={this.submitImg.bind(this)}  text='上传图片'  /></div>
                        </div>
                    </div>        
                }
                <h1 className='title'>众创空间自主预约系统 <span>你好，{this.state.name}</span></h1>
                <div className='container clearfloat'>
                    <nav className='nav'>
                        <ul>
                            <li className='navitem' onClick={this.changeStage.bind(this,0)}><a className={this.state.stage != 0?'':'select'}>账号状态</a></li>
                            <li className='navitem' onClick={this.changeStage.bind(this,1)}><a className={this.state.stage != 1?'':'select'}>修改信息</a></li>
                            <li className='navitem' onClick={this.changeStage.bind(this,2)}><a className={this.state.stage != 2?'':'select'}>查看预约记录</a></li>
                            <li className='navitem' onClick={this.changeStage.bind(this,3)}><a className={this.state.stage != 3?'':'select'}>查看违规记录</a></li>
                            <li className='navitem' onClick={this.logout.bind(this)}><a>注销登陆</a></li>
                            <li className='navitem'><a href='./index.html'> 返回首页</a></li>
                        </ul>
                    </nav>
                    <div className='main'>
                        <div className='content'>
                            {this.state.stage == 0 && <Status  status={this.state.status} />}
                            {this.state.stage == 1 && <Editor email={this.state.email} phonenumber={this.state.phonenumber} />}
                            {this.state.stage == 3 && <Disorder />}
                            {this.state.stage == 2 && <Reservation openLayer={this.openLayer.bind(this)}/>}
                            {/* {this.state.stage == 4 && <Detail detail={this.state.detail} />} */}
                        </div>
                        <footer className='footer'>Copyright @2018 爱特工作室</footer>
                    </div>
                </div>
            </BrowserRouter>
        )
    }

}

export default Person;