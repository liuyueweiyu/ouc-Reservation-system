import 'raf/polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import { render } from "react-dom";
import Person from "../person";
render(
    <Person />,
    document.getElementById('root')
);
