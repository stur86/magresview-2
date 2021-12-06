import './MVText.css';
import _ from 'lodash';

import React, { useState, useMemo } from 'react';

import { chainClasses } from '../utils';

function MVText(props) {

    const [submitted, setSubmitted] = useState(true);
    const id = useMemo(() => _.uniqueId('text'), []);

    var filter = null;
    if (props.filter)
        filter = new RegExp(props.filter);

    // Style (custom color)
    var style = {};
    if (props.color) {
        style['--outline-color'] = props.color;
    }

    const waitSubmit = (props.onSubmit && !submitted);

    function onChange(e) {
        var v = e.target.value;
        if (filter) {
            let m = filter.exec(v)
            v = m? m[0] : props.value;
        }
        setSubmitted(false);
        if(props.onChange)
            props.onChange(v);
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') {
            if (waitSubmit)
                props.onSubmit(props.value);
            setSubmitted(true);
        }
    }

    return (
    <span className='mv-text' style={style} title={props.title}>
        {props.children? <label htmlFor={id} className='mv-textlabel'>{props.children}</label> : <></>}
        <input type='text' id={id} className={chainClasses('mv-control mv-textfield', waitSubmit? 'mv-submit-wait' : '')} 
            size={props.size} value={props.value}
            onChange={onChange} onKeyDown={onKeyDown}
            disabled={props.disabled}
        />
    </span>);
}

export default MVText;