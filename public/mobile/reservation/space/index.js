import "./index.scss";

class Space extends React.Component {
    constructor(props){
        super(props);
        let space = props.spaces[props.space];
        if(props.spaces[props.space] == 1)
            space = 1- props.space;
        this.state = {
            space
        }

    }
    setSpace(i){
        if(this.props.spaces[i] != 1)
            this.setState({
                space: i
            });
    }
    
    nextStage(){
        this.props.setSpace(this.state.space);
        this.props.next();
    }

    componentDidMount(){

    }
    render(){
        return (
            <div className='space'>
                <div className='choose'>
                    <div className='item' onClick={this.setSpace.bind(this,1)}>
                        <p className={this.props.spaces[1] != 1?'name':'name ban'}>Mblock创客套件</p>
                        <div className={(this.props.spaces[1] == 1 ? 'img ban':'img') + (this.state.space == 1 ? ' select':'')}>
                            <img style={{width:'10.4rem',height:'9.6rem'}} src={require('../../../src/reservation/space/create.png')}/>
                        </div>
                        {
                            this.props.spaces[1] > 1&&
                            <p className='waring '>
                                <span className='logo'>!</span>
                                已有{this.props.spaces[1]-1}人正在预约
                            </p>
                        }
                        
                    </div>
                    <div className='item' style={{float:'right'}} onClick={this.setSpace.bind(this,0)}>
                        <p className={this.props.spaces[0] != 1?'name':'name ban'}>演讲台</p>
                        <div className={(this.props.spaces[0] == 1 ? 'img ban':'img') + (this.state.space == 0 ? ' select':'')}>
                            <img style={{width:'12rem',height:'9.1rem'}} src={require('../../../src/reservation/space/film.png')}/>
                        </div>
                        {
                            this.props.spaces[0] > 1&&
                            <p className='waring '>
                                <span className='logo'>!</span>
                                已有{this.props.spaces[0]-1}人正在预约
                            </p>
                        }
                    </div>
                </div>
               <button onClick={this.nextStage.bind(this)} className='botton'>下一步</button>
            </div>
        );
    }
}

export default Space;