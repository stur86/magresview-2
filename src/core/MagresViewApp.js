import './themes.css';
import '../controls/controls.css';
import './MagresViewApp.css';
import React, { useEffect, useRef } from 'react';

import { chainClasses } from '../utils';
import MagresViewHeader from './MagresViewHeader';
import { useAppInterface } from './store';

import MVSidebarLoad from './sidebars/MVSidebarLoad';
import MVSidebarSelect from './sidebars/MVSidebarSelect';
import MVSidebarMS from './sidebars/MVSidebarMS';
import MVSidebarEFG from './sidebars/MVSidebarEFG';

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
                <div id='mv-appwindow' className='mv-background'/>
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