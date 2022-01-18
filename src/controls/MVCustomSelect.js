import './controls.css';
import './MVCustomSelect.css';

import React, { useState, cloneElement, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';

import { chainClasses } from '../utils';

function MVCustomSelectOption(props) {

    const onClick = props.onClick || (() => {});

    return (
        <div className='mv-control mv-cselect-opt' onClick={onClick}>
            {props.icon? props.icon : <span></span>}
            {props.children}
        </div>
    );
}

function MVCustomSelect(props) {

    const [ show, setShow ] = useState(false);

    // Gather the options
    const options = props.children.filter((c) => c.type === MVCustomSelectOption);
    const values = options.map((o) => (o.props.value));

    // Translation?
    let tstyle = {};    
    
    const selected = values.findIndex((v) => (v === props.selected));
    const onSelect = props.onSelect || (() => {});

    // If disabled while open, must close
    useEffect(() => {
        if (props.disabled)
            setShow(false);
    }, [props.disabled]);

    return (
        <div style={tstyle} className={chainClasses('mv-control', 'mv-cselect', show? null : 'mv-cselect-closed', 
                                                    props.disabled? 'mv-cselect-disabled' : null )} 
            onMouseLeave={(e) => { setShow(false); }} title={props.title}>
            <div className='mv-control mv-cselect-main' onClick={() => { setShow(true && (!props.disabled)); }}>
                {options[selected]}
                <span className='mv-cselect-main-caret'><FaCaretDown /></span>
            </div>
            <div className='mv-control mv-cselect-ddown'>
                {options.map((o, i) => {
                    return cloneElement(o, {key: i, onClick: () => { setShow(false); onSelect(values[i]); }});
                })}
            </div>
        </div>
    );
}

export { MVCustomSelectOption };
export default MVCustomSelect;