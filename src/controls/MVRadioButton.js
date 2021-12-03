import './MVRadioButton.css';
import _ from 'lodash';

import React, { cloneElement, useMemo } from 'react';

function MVRadioButton(props) {

    const uid = useMemo(() => (_.uniqueId('radiobutton')), []);

    return (<span className='mv-control mv-radio' title={props.title}>
        <input id={uid} name={props.name} type="radio" checked={props.checked} onChange={props.onChange}/>
        <label htmlFor={uid}></label>{props.children}
    </span>);
}

function MVRadioGroup(props) {

    // Which children are buttons?
    const buttons = _.filter(props.children, (c) => c.type === MVRadioButton);
    const values = buttons.map((b) => b.props.value);

    // Find the index of the one we want selected
    const selected = values.findIndex((v) => v === props.selected);
    const onChange = props.onSelect? props.onSelect : (() => {});

    return(<span className='mv-control mv-radiogroup' title={props.title}>
        {props.label? <span className="mv-radiogroup-label" style={props.labelStyle}>{props.label}</span> : null}
        {buttons.map((b, i) => {
            return cloneElement(b, {key: i, 
                index: i, 
                checked: (i === selected), 
                name: props.name, 
                onChange: (e) => { onChange(b.props.value); }
            });
        })}
    </span>);
}

export { MVRadioGroup };
export default MVRadioButton;