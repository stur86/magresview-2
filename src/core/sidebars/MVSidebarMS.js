import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import React, { useState, useContext } from 'react';

function MVSidebarMS(props) {

    const [ state, setState ] = useState({});

    const mvc = useContext(MVStoreContext);

    var ms_data = null;
    if (props.show) {
        let m = mvc.current_model;
        if (m) {
            ms_data = m.getArray('ms');
        }
    }

    console.log(ms_data);

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        {ms_data? 
         <span></span>: 
         <div className='mv-warning-noms'>No MS data found</div>}
    </MagresViewSidebar>);
}

export default MVSidebarMS;