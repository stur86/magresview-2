import './themes.css';
import '../controls/controls.css';
import './MagresViewApp.css';
import React, { useEffect, useRef, useContext } from 'react';

import { chainClasses } from '../utils';
import MagresViewHeader from './MagresViewHeader';
import MVStore, { MVStoreContext } from './store';

import MVSidebarLoad from './sidebars/MVSidebarLoad';
import MVSidebarSelect from './sidebars/MVSidebarSelect';

function MagresViewPage() {

    const mvc = useContext(MVStoreContext);
    const mvcRef = useRef();
    mvcRef.current = mvc;

    useEffect(() => {
        mvcRef.current.init('#mv-appwindow');
    }, []);

    return (<div className={chainClasses('mv-main-page', 'theme-' + mvc.theme)}>
                <MagresViewHeader />
                <MVSidebarLoad show={mvc.panel === 'load'} />
                <MVSidebarSelect show={mvc.panel === 'select'} />
                <div id='mv-appwindow' className='mv-background'/>
            </div>);
}

function MagresViewApp() {

    return (
        <div className='mv-main-app'>
            <MVStore>
                <MagresViewPage />
            </MVStore>
        </div>
    );
}

export default MagresViewApp;