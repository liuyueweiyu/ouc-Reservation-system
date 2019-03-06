import './index.scss';
import TimeHelper from "../../script/time";

class Reservation extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            list : [],
            files: [],
            page:1,
            count:0,
            detail:-1
        }
    }

    getlist(page){
        const that = this;
        $.ajax({
            url: '../user/reservationlist',
            method: 'GET',
            data: {
                page: page
            },
            dataType: 'JSON',
            success: function (data) {
                if (data.code == 1) {
                    alert(data.msg);
                    window.location = './login.html';
                    return;
                }
                const list = data;
                that.setState({
                    list: list.data,
                    page:page,
                    count: list.count
                });
            }
        })
    }

    componentDidMount(){
        this.getlist(this.state.page);
    }

    upPicture(i,status){
        if(status != 1)
            return;
        if(this.state.list[i].picture == null)
            this.props.openLayer(this.state.list[i].id);
    }

    changePage(i){
        if(this.state.page*10 >= this.state.count && i == 1 || this.state.page == 1 && i == -1){
            return;
        }
        this.getlist(this.state.page + 1 * i);
    }

    detail(i){
        this.setState({
            detail:i
        })
    }

    render(){
        if (this.state.detail == -1) {
            return (
                <div className='reservation'>
                    
                    <h3>预约记录查询</h3>
                    <div className='table'>
                        <table className='list'>
                        <tbody>
                            <tr>
                                <th>主办方</th>
                                <th>申请主题</th>
                                <th>申请内容</th>
                                <th>申请场地</th>
                                <th>申请时间</th>
                                <th>状态</th>
                                <th>查看详情</th>
                                <th>上传图片(5张)</th>
                            </tr>
                            
                                {this.state.list.map((v,i)=>{
                                    let str  = '';
                                    switch (v.status) {
                                        case 0:str = '待审核'; break;
                                        case 1:str = '已通过';break;
                                        case 2:str = '未通过';break;
                                        default:str='已违规'; break;
                                    }
                                    return (
                                        <tr key={i}>
                                            <td>{v.organizer}</td>
                                            <td>{v.title}</td>
                                            <td>{v.content}</td>
                                            <td>{v.space == 0 ?'投影区域':'众创组件'}</td>
                                            <td>{TimeHelper.getTimestr(v.time)}</td>
                                            <td>{str}</td>
                                            <td><a onClick={this.detail.bind(this,i)} className='tdbutton'>查看</a></td>
                                            <td><a onClick={this.upPicture.bind(this,i,v.status)} className='tdbutton'>{v.picture == null || v.picture == '' ? '上传图片':'已上传'}</a></td>
                                        </tr>
                                    )
                                })}
                                
                            </tbody>

                        </table>
                        {
                            this.state.list.length != 0 &&
                            <div className='page'>
                                <img className='pageimg' onClick={this.changePage.bind(this,-1)} src={require('./left.png')} />
                                <a className='current'>{this.state.page}</a>
                                <img className='pageimg'  onClick={this.changePage.bind(this,1)} src={require('./right.png')} />
                            </div>
                        }
                    </div>

                </div>
        )}
        const obj = this.state.list[this.state.detail];
        let str,
            pictures = obj.picture == null || obj.picture == '' ? []: obj.picture.split(',');
        switch (obj.status) {
            case 0:
                str = '待审核';
                break;
            case 1:
                str = '已通过';
                break;
            case 2:
                str = '未通过';
                break;
            default:
                str = '已违规';
                break;
        }
        return (
            <div className='detail'>
                <ol className='detaillist'>
                    <li className='detailitem'>
                        <span className='pro'>主办方:</span>
                        <span className='content'>{obj.applicant}</span>
                    </li>
                    <li className='detailitem'>
                        <span className='pro'>申请主题:</span>
                        <span className='content'>{obj.title}</span>
                    </li>
                    <li className='detailitem'>
                        <span className='pro'>申请场地:</span>
                        <span className='content'>{obj.space == 0 ? '投影区域':'众创套件'}</span>
                    </li>
                    <li className='detailitem'>
                        <span className='pro'>申请时间:</span>
                        <span className='content'>{TimeHelper.getTimestr(obj.time)}</span>

                    </li>
                    <li className='detailitem'>
                    {/*  */}
                        <span className='pro'>申请状态:</span>
                        <span className='content'>{str}</span>
                    </li>
                    <li className='detailitem buttom'>
                        <span className='pro' >备注:</span>
                        <span className='content'>{obj.reason}</span>
                    </li>
                    <li className='detailitem'>
                        <span className='pro'>申请内容:</span>
                        <span className='content'  style={{width:'405px'}}>{obj.content}</span>
                    </li>
                    <li className='detailitem'>
                        <span className='pro'>上传图片:</span>
                        <span className='content img'  style={{width:'405px'}}>
                            {
                                pictures.map((v,i)=>{
                                    return (
                                         <a key={i} ><img src={'./images/'+v} /></a>
                                    );
                                })
                            }
                        </span>
                    </li>
                </ol>
                <img src={require('./back.png')} className='back' onClick={this.detail.bind(this,-1)} /> 
            </div>
        )
    }
}

export default Reservation;