import './controls.css';
import './MVListSelect.css';
import _ from 'lodash';

import React, { cloneElement, useEffect, useRef } from 'react';

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

    // Gather the options
    const options = props.children.filter((c) => c.type === MVListSelectOption);
    const values = options.map((o) => (o.props.value));

    const selected = values.findIndex((v) => (v === props.selected));
    const onSelect = props.onSelect || (() => {});

    return (
        <div className='mv-control mv-lselect' title={props.title}>
            {options.map((o, i) => {
                return cloneElement(o, {key: i, selected: (i === selected),
                                        onClick: () => { onSelect(values[i]); }});
            })}
        </div>
    );
}


export { MVListSelectOption };
export default MVListSelect;