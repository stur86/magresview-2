import './MVCheckBox.css';
import _ from 'lodash';

import { useState, useEffect } from 'react';

function MVCheckBox(props) {

    const [state, setState] = useState({id: null, checked: ('checked' in props? props.checked : false)});

    useEffect(() => {
        const id = _.uniqueId('checkbox');
        setState((s) => ({...s, id: id}));
    }, []);

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