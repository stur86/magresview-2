import './controls.css';
import './MVListSelect.css';
import _ from 'lodash';

import React, { useState, cloneElement, useEffect, useRef } from 'react';

import { chainClasses } from '../utils';

function MVListSelectOption(props) {

    const onClick = props.onClick || (() => {});

    return (
        <div className={chainClasses('mv-control', 'mv-lselect-opt', props.selected? 'mv-lselected': null)} 
             onClick={onClick}>
            {props.icon? props.icon : <span></span>}
            {props.children}
        </div>
    );
}

function MVListSelect(props) {

    const [ state, setState ] = useState({
        index: 0,
    });

    // Gather the options
    const options = _.filter(props.children, (c, i) => {
        return (c.type.name === 'MVListSelectOption');
    });
    const values = options.map((o) => (o.props.value));

    const onSelect = props.onSelect || (() => {});  
    const effectCallback = useRef((i) => { onSelect(values[i]);});

    useEffect(() => {
        effectCallback.current(state.index);
    }, [state.index]);

    return (
        <div className='mv-control mv-lselect' title={props.title}>
            {options.map((o, i) => {
                return cloneElement(o, {key: i, selected: (i === state.index),
                                        onClick: () => { setState({...state, index: i})}});
            })}
        </div>
    );
}


export { MVListSelectOption };
export default MVListSelect;