import React from 'react';
import './index.scss';
import TimeHelper from '../../script/time';
import Button from '../../component/button';

class Space extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            space: this.props.period.space[this.props.space] == 1 ? -1 : this.props.space
        }
    }

    changeSpace(i){
        if(this.props.period.space[i] != 1)
            this.setState({
                space:i
            });
    }

    

    render(){
        const period = this.props.period;
        return (
            <div className='space'>  
                <p className='subtitle'>
                    <span>现可预约的区域：</span>
                    {TimeHelper.getTimestr(period.time)}
                    <a onClick={this.props.back} className='back'>返回</a>
                </p>
                <div className='choose'>
                    <div onClick={this.changeSpace.bind(this,1)} className={(period.space[1] == 1 ? 'spaceitem ban':'spaceitem') + (this.state.space == 1 ? ' choosed':'')}>
                        <h4>Mblock创客套件 </h4>
                        <div className='img'>
                            <img className='first' src={require('./create.png')} />
                        </div>
                        {
                            period.space[1] > 1 && 
                            <p><span className='warning'>!</span> 已有{ period.space[1]-1}人正在预约</p>
                        }
                        
                    </div>
                    <div  onClick={this.changeSpace.bind(this,0)}  className={(period.space[0] == 1 ? 'spaceitem ban':'spaceitem' ) + (this.state.space == 0 ? ' choosed':'')}>
                        <h4>演讲台</h4>
                        <div className='img'>
                            <img className='last' src={require('./film.png')} />
                        </div>
                        {
                            period.space[0] > 1 && 
                            <p><span className='warning'>!</span> 已有{ period.space[0]-1}人正在预约</p>
                        }
                        
                    </div>
                </div>
                <Button submit={this.props.selectSpace.bind(this,this.state.space)} text='下一步' />
            </div>
        )}
}



export default Space;