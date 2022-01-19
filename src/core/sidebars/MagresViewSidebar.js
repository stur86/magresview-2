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

import { chainClasses } from '../../utils';

function MagresViewSidebar(props) {
    return (<div className={chainClasses('mv-sidebar', props.show? 'open' : '')}>
        {props.title? <h2>{props.title}</h2> : null}
        {props.children}
    </div>);
}

export default MagresViewSidebar;