import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import React, { useContext } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';

function MVSidebarMS(props) {

    const [mvc] = useContext(MVStoreContext);

    var has_ms = false;
    if (props.show) {
        has_ms = mvc.ms.hasData;
    }

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        {has_ms? 
         (<div className='mv-sidebar-block'>
             <MVCheckBox onCheck={(v) => { mvc.ms.setEllipsoids(v); }} checked={mvc.ms.hasEllipsoids}>Ellipsoids</MVCheckBox>
             <MVRange min={0.01} max={0.2} step={0.005} value={mvc.ms.ellipsoidScale} onChange={(s) => { mvc.ms.setEllipsoids(mvc.ms.hasEllipsoids, s); }}>Ellipsoid scale</MVRange>
         </div>): 
         <div className='mv-warning-noms'>No MS data found</div>}
    </MagresViewSidebar>);
}

export default MVSidebarMS;