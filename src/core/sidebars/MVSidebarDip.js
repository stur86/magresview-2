import './MVSidebarDip.css';

import MagresViewSidebar from './MagresViewSidebar';

import React from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import useDipInterface from '../store/interfaces/DipInterface';


function MVSidebarDip(props) {

    const dipint = useDipInterface();

    return (<MagresViewSidebar show={props.show} title='Dipolar couplings'>
        <div className='mv-sidebar-block'>
            <MVCheckBox color='var(--dip-color-3)' onCheck={(v) => { dipint.isOn = v; }} checked={ dipint.isOn } >Show dipolar couplings</MVCheckBox>            
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarDip;