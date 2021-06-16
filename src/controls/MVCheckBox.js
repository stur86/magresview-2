import './MVCheckBox.css';
import _ from 'lodash';

import { useState, useEffect } from 'react';

function MVCheckBox(props) {

    const [state, setState] = useState({id: null, checked: false});

    useEffect(() => {
        const id = _.uniqueId('checkbox');
        setState((s) => ({...s, id: id}));
    }, []);

    var style = {};
    if (props.color) {
        style['--check-color'] = props.color;
    }

    var checked = state.checked;
    if ('checked' in props) {
        checked = props.checked;
    }
    
    var onCheck = ((x) => setState({...state, checked: x}));
    if ('onCheck' in props) {
        onCheck = props.onCheck;
    }

    return (
        <span className='mv-control mv-checkbox' style={style} title={props.title}>
            <input id={state.id} type='checkbox' checked={checked} onChange={(e) => onCheck(e.target.checked)}/>
            <label htmlFor={state.id}/>{props.children}
        </span>
    );
}

export default MVCheckBox;

/* 
            <span className="MVCheckbox">
                <input id={this.props.id} type="checkbox" checked={this.props.checked}/>
                <label htmlFor={this.props.id}></label>{this.props.label}
            </span> */