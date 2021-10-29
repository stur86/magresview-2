import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import React, { useState, useContext } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';

function MVSidebarMS(props) {

    const [ state, setState ] = useState({});

    const mvc = useContext(MVStoreContext);

    var has_ms = false;
    if (props.show) {
        has_ms = mvc.ms.hasData;
    }

    function showEllipsoids(v) {
        if (v) {
            mvc.ms.addEllipsoids(0.08);
        }
        else {
            mvc.ms.removeEllipsoids();
        }
    }

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        {has_ms? 
         (<p>
             <MVCheckBox onCheck={showEllipsoids} checked={mvc.ms.hasEllipsoids}>Ellipsoids</MVCheckBox>
         </p>): 
         <div className='mv-warning-noms'>No MS data found</div>}
    </MagresViewSidebar>);
}

export default MVSidebarMS;