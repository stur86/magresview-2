import './MVCheckBox.css';
import _ from 'lodash';

import React, { useState } from 'react';

function MVCheckBox(props) {

    const [state, setState] = useState({id: _.uniqueId('checkbox'), checked: ('checked' in props? props.checked : false)});

    var style = {};
    if (props.color) {
        style['--check-color'] = props.color;
    }

    function onCheck(v) {
        setState(s => ({...s, checked: v}));
        if (props.onCheck) {
            props.onCheck(v);
        }
    }    

    return (
        <span className='mv-control mv-checkbox' style={style} title={props.title}>
            <input id={state.id} type='checkbox' checked={state.checked} onChange={(e) => onCheck(e.target.checked)}/>
            <label htmlFor={state.id}/>{props.children}
        </span>
    );
}

export default MVCheckBox;