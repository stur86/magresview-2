/**
 * MagresView 2.0
 *
 * A web interface to visualize and interact with computed NMR data in the Magres
 * file format.
 *
 * Author: Simone Sturniolo
 *
 * Copyright 2022 Science and Technology Facilities Council
 * This software is distributed under the terms of the MIT License
 * Please refer to the file LICENSE for the text of the license
 * 
 */

import './MagresViewSidebar.css';

import React from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';

import { chainClasses } from '../../utils';
import { useAppInterface } from '../store';

function MagresViewSidebar(props) {

    const appint = useAppInterface();

    return (<div className={chainClasses('mv-sidebar', props.show? 'open' : '')}>
        <div className='mv-sidebar-title'>
            {props.title? <h2>{props.title}</h2> : null}            
            <FaAngleDoubleRight className='mv-sidebar-hide' onClick={() => { appint.sidebar = 'none'; }} />
        </div>
        {props.children}
    </div>);
}

export default MagresViewSidebar;