import "./index.scss";
import verify from "../../script/verify";

class Input extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <input 
                        data-statekey={this.props.statekey} 
                        onChange={this.props.change} 
                        type={this.props.role} 
                        style={this.props.width==''?{}:{width:this.props.width}} 
                        className={this.props.err?'inputbox warning':'inputbox' }
                        onBlur = {this.props.blur}
                        placeholder={this.props.err ? this.props.value: this.props.text}
                        value = {this.props.err ? '' :this.props.value || ''}
                ></input>;
    }
}

export default Input;