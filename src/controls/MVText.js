import './MVText.css';
import _ from 'lodash';

import React, { useState } from 'react';

import { chainClasses } from '../utils';

function MVText(props) {

    const [state, setState] = useState({text: props.value, submitted: true, id: props.id || _.uniqueId('text')});

    var filter = null;
    if (props.filter) 
        filter = new RegExp(props.filter);

    // Style (custom color)
    var style = {};
    if (props.color) {
        style['--outline-color'] = props.color;
    }

    function onChange(e) {
        var v = e.target.value;
        if (filter) {
            let m = filter.exec(v)
            v = m? m[0] : state.text;
        }
        setState(s => ({...s, submitted: false, text: v}));
        if(props.onChange) {
            props.onChange(v);
        }
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') {
            if (props.onSubmit) {
                props.onSubmit(state.text);
            }
            setState(s => ({...s, submitted: true}));
        }
    }

    const waitSubmit = (props.onSubmit && !state.submitted);

    return (
    <span className='mv-text'>
        {props.children? <label htmlFor={state.id} className='mv-textlabel'>{props.children}</label> : <></>}
        <input type='text' id={state.id} className={chainClasses('mv-control mv-textfield', waitSubmit? 'mv-submit-wait' : '')} 
            style={style} size={props.size} value={state.text}
            onChange={onChange} onKeyDown={onKeyDown}
        />
    </span>);
}

export default MVText;