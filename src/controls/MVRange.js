import './MVRange.css';
import './MVText.css'; 

import _ from 'lodash';

import React, { useState, useRef, useEffect, useMemo } from 'react';

import { chainClasses, floatRegExp } from '../utils';
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

    const [state, setState] = useState({
        text_value: in_val.toString(),
        text_submitted: true
    });

    // Style (custom color)
    var style = {};
    if (props.color) {
        style['--outline-color'] = props.color;
    }

//     // Range changes
//     function onRangeChange(e) {
//         let v = e.target.value;
//         v = toNumber(v);
// 
//         if (props.onChange) {
//             props.onChange(v);
//         }
// 
//         setState({
//             ...state,
//             value: v,
//             text_value: v.toString(),
//             text_submitted: true
//         });
//     }
// 
//     // Text changes
//     function onTextChange(e) {
//         let v = e.target.value;
//         if (filter) {
//             let m = filter.exec(v)
//             v = m? m[0] : state.text;
//         }
//         setState({
//             ...state,
//             text_value: v,
//             text_submitted: false
//         });
//     }
// 
//     // Text is submitted
//     function onTextSubmit(e) {
//         if (e.key === 'Enter') {
//             onRangeChange(e);
//         }
//     }
// 
//     let value = props.noState? in_val : state.value;
//     
//     // Here we handle the updating when the value change comes from the outside    
//     let stateRef = useRef();
//     stateRef.current = [state, setState];
// 
//     useEffect(() => {
//         let [state, setState] = stateRef.current;
//         setState({
//             ...state,
//             text_value: value.toString(),
//             text_submitted: true
//         })
//     }, [value]);


    return (
        <div className='mv-control'>
            {props.children? <label htmlFor={id} className='mv-rangelabel'>{props.children}</label> : <></>}            
            <span className='mv-control mv-range' style={style}>
                <input className='mv-range-slider' type='range' id={id} onInput={() => {}}
                 min={min} max={max} step={step} value={in_val} disabled={props.disabled}/>
                <input type='text' className={chainClasses('mv-control mv-range-text', state.text_submitted? '': 'mv-submit-wait')} 
                    size={4} value={state.text_value} onChange={() => {}}
                    onKeyDown={() => {}} disabled={props.disabled}
                />
            </span>
        </div>);
}

export default MVRange;