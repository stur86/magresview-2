import './MVBox.css';
import React from 'react';
import { GrFormClose } from 'react-icons/gr';

import { chainClasses } from '../utils';

function MVBox(props) {

    const status_class = (props.status)? 'mv-box-' + props.status : '';
    const onClose = props.onClose || (() => {});

    return (<div className={chainClasses('mv-control', 'mv-box', status_class)}>
        <div className='mv-box-header'><GrFormClose onClick={onClose} size={22}/></div>
        {props.children}
    </div>);
}

export default MVBox;