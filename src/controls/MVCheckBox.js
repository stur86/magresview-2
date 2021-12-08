import './MVCheckBox.css';

import React from 'react';

import { useId } from '../utils';

function MVCheckBox(props) {

    const id = useId('checkbox');

    var style = {};
    if (props.color) {
        style['--check-color'] = props.color;
    }

    const onCheck = props.onCheck || (() => {});

    return (
        <span className='mv-control mv-checkbox' style={style} title={props.title}>
            <input id={id} type='checkbox' checked={props.checked} onChange={(e) => onCheck(e.target.checked)}/>
            <label htmlFor={id}/>{props.children}
        </span>
    );
}

export default MVCheckBox;