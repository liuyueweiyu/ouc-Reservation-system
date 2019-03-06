import 'raf/polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import { render } from "react-dom";
import Register from "../register";
render(
    <Register />,
    document.getElementById('root')
);
