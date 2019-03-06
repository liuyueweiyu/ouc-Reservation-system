import './index.scss';

export default ({newstyle,login,is})=>{
    console.log(login)
    return (
        <h1 className='title' style={JSON.stringify(newstyle)==''?{}:newstyle}>
            众创空间自主预约系统

            {is == 1 && 
                <a className='toperson' href={login == 1 ? './person.html':'./login.html'}>
                    <img src={require('./person.png')} />
                    <p>{login == 1 ? '个人中心' : '登录'}</p>
                </a>
            }
            
        </h1>
    )
}