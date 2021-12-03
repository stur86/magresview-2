import './controls.css';
import './MVSelect.css';

import React, { cloneElement } from 'react';

function MVSelect(props) {

    // Gather the options
    const options = props.children.filter((c) => c.type === 'option');

    const onSelect = props.onSelect || (() => {});

    return (
        <select className='mv-control mv-select' onSelect={onSelect}>
            {options.map((o, i) => cloneElement(o, {key: i, selected: (o.props.value === props.selected)}))}            
        </select>
    );
}

export default MVSelect;