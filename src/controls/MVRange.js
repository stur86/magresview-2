import './MVRange.css';
import './MVText.css'; 

import _ from 'lodash';

import React, { useState } from 'react';

function MVRange(props) {

    // Range definition
    var min = 'min' in props? props.min : 0;
    var max = 'max' in props? props.max : 100;
    var step = 'step' in props? props.step : 1;

    var in_val = ('value' in props? props.value : min);

    const [state, setState] = useState({
        id: _.uniqueId('range'), 
        value: in_val,
        text_value: in_val.toString()
    });

    // Style (custom color)
    var style = {};

    const filter = new RegExp('[0-9]*(?:[.][0-9]*)?');

    function toNumber(v) {
        v = parseFloat(v);
        v = Math.min(v, max);
        v = Math.max(v, min);
        return v;
    }

    function onTextChange(e) {
        var v = e.target.value;
        if (filter) {
            let m = filter.exec(v)
            v = m? m[0] : state.text;
        }
        onInput(v);
    }

    function onInput(v) {
        var vn = toNumber(v);

        if (props.onChange) {
            props.onChange(vn);
        }

        setState({
            ...state,
            value: vn,
            text_value: v.toString()
        });
    }

    return (
        <div className='mv-control'>
            {props.children? <label htmlFor={state.id} className='mv-rangelabel'>{props.children}</label> : <></>}            
            <span className='mv-control mv-range'>
                <input className='mv-range-slider' type='range' id={state.id} onInput={(e) => onInput(e.target.value)}
                 min={min} max={max} step={step} value={state.value}/>
                <input type='text' className={'mv-control mv-range-text'} 
                    style={style} size={4} value={state.text_value}
                    onChange={onTextChange}
                />
            </span>
        </div>);
}

export default MVRange;