import './MVRadioButton.css';
import _ from 'lodash';

import React, { cloneElement, useState } from 'react';

function MVRadioGroup(props) {

    const [ state, setState ] = useState({index: 0});

    function onChange(v, i) {
        console.log(v, i);
        setState(s => ({...s, index: i}));
        if (props.onSelect) {
            props.onSelect(v, i);
        }
    }

    // Separate specifically the MVRadioButton children
    const children = _.filter(props.children, (c) => {
        return (c.type.name === 'MVRadioButton');
    }).map((c, i) => cloneElement(c, {key: i, 
                                      index: i, 
                                      name: props.name, 
                                      checked: (i === state.index),
                                      onChange: () => {onChange(c.props.value, i)}}
                                )
        );

    return(<span className='mv-control mv-radiogroup' title={props.title}>
        {props.label? <span className="mv-radiogroup-label" style={props.labelStyle}>{props.label}</span> : null}
        {children}
    </span>);
}

function MVRadioButton(props) {
    return (<span className='mv-control mv-radio' title={props.title}>
        <input id={props.id} name={props.name} type="radio" checked={props.checked} onChange={props.onChange}/>
        <label htmlFor={props.id}></label>{props.children}
    </span>);
}

export { MVRadioGroup };
export default MVRadioButton;