import React from "react";
import "./index.scss";

class Turn extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            left: 0,
            liwidth:[40,20,20],
            index:0,
            interval:0,
            bannerWidth:600
        }
        
    }

    componentDidMount(){        
        this.begin();
        if (document.body.clientWidth < 1920) {
            console.log(document.body.clientWidth)
            this.setState({
                bannerWidth: 427
            })
        }
    }

    begin(){
        const id = setInterval(() => {
            this.animate();
            this.setState({
                index: (this.state.index + 1) % 3
            })
        }, 4500);

    }

    changeBanner(index){
        const width = this.state.bannerWidth;
        if (this.state.left % width != 0)
            return;
        const liwidth = [20,20,20];
        let begin = 0,
            end = 0,
            id = 0,
            factor = 1;
        liwidth[index] = 40;
        if (this.state.index == index)
            return;
        if (this.state.index > index)
            factor = -1;
        end = Math.abs(index - this.state.index) * 20;
        let neww = [20, 20, 20];
        neww[index] = 40;
        this.setState({
            liwidth: neww
        })
        id = setInterval(()=> {
            if (begin++ == end) {
                if (this.state.left % width*3 == 0)
                    this.setState({
                        left: 0
                    })
                clearInterval(id);
            }
            else{
                this.setState({
                    index,
                    left: this.state.left - width/20 * factor,
                })
            }
        }, 10);
    }

    animate(){
        const width = this.state.bannerWidth;
        let id, begin = 0;
        id = setInterval(()=> {
            if (begin++ == 20) {
                if (this.state.left % width*3 == 0)
                    this.setState({
                        left: 0,
                        index: -this.state.left / width
                    })
                this.setState({
                    index: -this.state.left / width
                })
                clearInterval(id);
            }
            else{
                let neww = this.state.liwidth.map((v,i)=>{
                    if(i == this.state.index)
                        return 40;
                    return 20;
                })
                this.setState({
                    left: this.state.left - width/20,
                    liwidth:neww
                })
            }
        }, 10);
    }
    render(){
        return (
            <div className="left">
                <div className="box">
                    <ul style={{left:this.state.left+'px'}}>
                        <li><h2>奇思妙想在这里萌芽</h2><img src={require('./1.png')} /></li>
                        <li><h2>分工合作在这里实现</h2><img src={require('./2.png')} /></li>
                        <li><h2>团队合作在这里诞生</h2><img src={require('./3.png')} /></li>
                        <li><h2>奇思妙想在这里萌芽</h2><img src={require('./1.png')} /></li>
                    </ul>
                    <ol className="spot">
                        <div>
                            {this.state.liwidth.map((value,index)=>{
                                return <li key={index} onClick={this.changeBanner.bind(this,index)} style={{width:value+'px'}}></li>;
                            })}
                        </div>
                    </ol>
                </div>
            </div>
        )
    }
}

export default Turn;