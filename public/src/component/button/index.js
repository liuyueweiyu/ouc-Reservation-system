import React from 'react';
import "./index.scss";

class Button extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
            <button className="button" onClick={this.props.submit}>{this.props.text}</button>
        )
    }
}


export default Button;