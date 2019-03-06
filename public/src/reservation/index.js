import React from 'react';
import './index.scss';
import 'core-js/es6/map';
import 'core-js/es6/set';
import Title from '../component/title';
import Time from './time';
import Space from './space';
import Infor from './infor';
import Footer from '../component/footer';

class Reservervation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            login:0,
            stage:0,
            select:[0,0],
            period: {},
            space:-1,
            status:-1,
            isuppic:1
        }
    }

    selectTime(i,j,flag){
        if(!flag)
            this.setState({
                select:[i,j]
            })
    }

    selectSpace(space){
        if(space == -1){
            alert('请选择场地!')
            return;
        }
        this.setState({
            space: space,
            stage:2
        })
    }

    toSelectSpace(obj){
        this.setState({
            stage:1,
            period: obj
        })
    }

    toBack(){
        this.setState({
            stage:this.state.stage-1
        })
    }
    

    componentDidMount(){
        const that = this;
        $.ajax({
            url:'../user/checklog',
            method:'GET',
            dataType:'JSON',
            success:function (data) {
                if(data.code == 0 || data.code == 2){
                    that.setState({
                        login: 1,
                    })
                }
                that.setState({
                    status: data.status
                })
                if (data.code == 2) {
                    that.setState({
                        isuppic: 2,
                    })
                }
            }
        })
    }

    render(){
        return (
            <React.Fragment>
                <Title is={1} login={this.state.login} newstyle={{background:'rgb(241,244,249)',paddingBottom:'30px'}} />
                {this.state.stage == 0 && <Time isuppic={this.state.isuppic} status={this.state.status} login={this.state.login} select={this.state.select} selectTime={this.selectTime.bind(this)} nextStage={this.toSelectSpace.bind(this)}/>}
                {this.state.stage == 1 && <Space period={this.state.period} selectSpace={this.selectSpace.bind(this)} back={this.toBack.bind(this)} space={this.state.space} />}
                {this.state.stage == 2 && <Infor time={this.state.period.time} space={this.state.space} back={this.toBack.bind(this)}  />}
                <Footer />
            </React.Fragment>
        )

    }
}

export default Reservervation;