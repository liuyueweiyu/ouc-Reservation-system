import './index.scss';
import TimeHelper from "../../script/time";
class Disorder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            page:1,
            list:[],
            count:0
        }
    }

    componentDidMount() {
        this.getlist(this.state.page);
    }

    getlist(page){
        const that = this;
        $.ajax({
            url: '../user/reservationlist',
            method: 'GET',
            data: {
                page: page,
                disorder: 1
            },
            dataType: 'JSON',
            success: function (data) {
                if (data.code != 0) {
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

    changePage(i){
        if(this.state.page*10 >= this.state.count && i == 1 || this.state.page == 1 && i == -1){
            return;
        }
        this.getlist(this.state.page + 1 * i);
    }


    render(){
        return (
            <div className='disorder'>
                    
                    <h3>违章记录</h3>
                    <div className='table'>
                        <table className='list'>
                            <tbody>
                                <tr>
                                    <th width='176'>违章时间</th>
                                    <th width='176'>违章区域</th>
                                    <th>违章原因</th>
                                </tr>
                                {
                                    this.state.list.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td>{TimeHelper.getTimestr(v.time)}</td>
                                                <td>{v.space == 0 ?'投影区域':'众创组件'}</td>
                                                <td>{v.reason}</td>
                                            </tr>
                                        )
                                    })
                                }
                                
                                </tbody>

                            </table>
                            <div className='page'>
                                <img className='pageimg' onClick={this.changePage.bind(this,-1)} src={require('./left.png')} />
                                <a className='current'>{this.state.page}</a>
                                <img className='pageimg'  onClick={this.changePage.bind(this,1)} src={require('./right.png')} />
                            </div>
                    </div>

                </div>
        )
    }

}

export default Disorder;