import './MVRange.css';
import './MVText.css'; 

import _ from 'lodash';

import React, { useState, useRef, useEffect, useMemo } from 'react';

import { chainClasses, regularExpressions } from '../utils';
import MVText from './MVText';

function MVRange(props) {

    // Range definition
    const min = 'min' in props? props.min : 0;
    const max = 'max' in props? props.max : 100;
    const step = 'step' in props? props.step : 1;

    function toNumber(v) {
        v = parseFloat(v);
        v = Math.min(v, max);
        v = Math.max(v, min);
        v = Math.round(v/step)*step;
        return v;
    }

    const in_val = (props.value != null? toNumber(props.value) : min);
    const id = useMemo(() => _.uniqueId('range'), []);

    const [text, setText] = useState(in_val.toString());

    // Style (custom color)
    var style = {};
    if (props.color) {
        style['--outline-color'] = props.color;
        style['--thumb-color'] = props.color;
    }

    function acceptValue(v) {
        v = toNumber(v);

        if (props.onChange)
            props.onChange(v);
    }

    let stateRef = useRef();
    stateRef.current = [text, setText];

    // Update the text value if the props one changed and if necessary
    useEffect(() => {
        const [text, setText] = stateRef.current;

        if (parseFloat(text) !== in_val)
            setText(in_val.toString());
    }, [in_val]);


    return (
        <div className='mv-control'>
            {props.children? <label htmlFor={id} className='mv-rangelabel'>{props.children}</label> : <></>}            
            <span className='mv-control mv-range' style={style}>
                <input className='mv-range-slider' type='range' id={id} onInput={(e) => { acceptValue(e.target.value); }}
                 min={min} max={max} step={step} value={in_val} disabled={props.disabled}/>
                <MVText size={4} filter={regularExpressions.float} value={text} onChange={setText} onSubmit={acceptValue} disabled={props.disabled}/>
            </span>
        </div>);
}

export default MVRange;