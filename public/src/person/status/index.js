import './index.scss';

export default ({status})=>{
    let color,str;
    switch (status) {
        case 0:
            str = '正常';
            color = 'rgb(50,149,217)';
            break;
        case 1:
            str = '待激活';
            color = '#FFB900';
            break;
        case 2:
        case 3:
            str = '被锁定';
            color = '#FF5622';
        default:
            break;
    }
    return (
        <h3 className='status'>经检测，你的账号状态为  <span style={{color:color}} >{str}</span>   状态。</h3>
    );
}