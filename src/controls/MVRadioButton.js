import './MVRadioButton.css';
import _ from 'lodash';

import React, { cloneElement, useState } from 'react';

function MVRadioGroup(props) {

    // Which children are buttons?
    var children = _.filter(props.children, (c) => {
        return (c.type.name === 'MVRadioButton');
    });

    const [ state, setState ] = useState({index: 0, 
        _uids: children.map((c, i) => c.props.id || _.uniqueId(props.name + '_radio_' + i))});

    function onChange(v, i) {
        setState(s => ({...s, index: i}));
        if (props.onSelect) {
            props.onSelect(v, i);
        }
    }

    // Clone the MVRadioButton children
    children = children.map((c, i) => cloneElement(c, {key: i, 
                                      index: i, 
                                      id: state._uids[i],
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