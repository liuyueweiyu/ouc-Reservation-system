import './index.scss';

import React from "react";
import Title from "../component/title";
import Left from "./Left";
import Right from "./Right";
import Footer from "../component/footer";

export default ()=>{
    return (
        <React.Fragment>
            <Title /> 
            <div className='container'>
                <Left />
                <Right />
            </div>
            <Footer />
        </React.Fragment>
    );
}