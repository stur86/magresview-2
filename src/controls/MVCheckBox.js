import './MVCheckBox.css';
import _ from 'lodash';

import React, { useMemo } from 'react';

function MVCheckBox(props) {

    const id = useMemo(() => _.uniqueId('checkbox'), []);

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