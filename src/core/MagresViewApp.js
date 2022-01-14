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

import './themes.css';
import '../controls/controls.css';
import './MagresViewApp.css';
import React, { useEffect, useRef } from 'react';

import { chainClasses } from '../utils';
import { useAppInterface } from './store';

import MagresViewHeader from './MagresViewHeader';
import MagresViewScreenshot from './MagresViewScreenshot';

import MVSidebarLoad from './sidebars/MVSidebarLoad';
import MVSidebarSelect from './sidebars/MVSidebarSelect';
import MVSidebarMS from './sidebars/MVSidebarMS';
import MVSidebarEFG from './sidebars/MVSidebarEFG';
import MVSidebarDip from './sidebars/MVSidebarDip';
import MVSidebarEuler from './sidebars/MVSidebarEuler';

function MagresViewPage() {

    let appint = useAppInterface();

    const appRef = useRef(appint);

    useEffect(() => {
        appRef.current.initialise('#mv-appwindow');
    }, []);

    return (<div className={chainClasses('mv-main-page', 'theme-' + appint.theme )}>
                <MagresViewHeader />
                <MVSidebarLoad show={appint.sidebar === 'load'} />
                <MVSidebarSelect show={appint.sidebar === 'select'} />
                <MVSidebarMS show={appint.sidebar === 'ms'} />
                <MVSidebarEFG show={appint.sidebar === 'efg'} />
                <MVSidebarDip show={appint.sidebar === 'dip'} />
                <MVSidebarEuler show={appint.sidebar === 'euler'} />
                <div id='mv-appwindow' className='mv-background'/>
                <MagresViewScreenshot />
            </div>);
}

function MagresViewApp() {

    return (
        <div className='mv-main-app'>
            <MagresViewPage />
        </div>
    );
}

export default MagresViewApp;