import './themes.css';
import '../controls/controls.css';
import './MagresViewApp.css';
import React, { useState, useEffect } from 'react';

import { chainClasses } from '../utils';
import MagresViewContext from './MagresViewContext';
import MagresViewHeader from './MagresViewHeader';

import MVButton from '../controls/MVButton';
import MVCheckBox from '../controls/MVCheckBox';
import MVRadioButton, { MVRadioGroup } from '../controls/MVRadioButton';
import MVText from '../controls/MVText';

import MVSidebarLoad from './sidebars/MVSidebarLoad';
import MVSidebarSelect from './sidebars/MVSidebarSelect';

import viewerSingleton from './viewer/ViewerSingleton';


function MagresViewApp() {

    var [state, setState] = useState({
        theme: 'dark', 
        panel: 'load'
    });

    var contextValue = {
        setProperty: (name, value) => {
            setState({...state,
                [name]: value
            });
        },
        ...state
    };

    useEffect(() => {
        viewerSingleton.initialise('#mv-appwindow');
    }, []);

    return (
        <MagresViewContext.Provider value={contextValue}>
            <div className={chainClasses('mv-main-app', 'theme-' + state.theme)}>
                <MagresViewHeader />
                <MVSidebarLoad show={state.panel === 'load'} />
                <MVSidebarSelect show={state.panel === 'select'} />
                {/* <MagresViewSidebar title='Magnetic Shielding' show={state.panel === 'ms'}> */}
                {/*     <div className='mv-flex-vgrid-3'> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <div className='mv-flex-hgrid-1'> */}
                {/*             <MVButton disabled>Disabled button 1</MVButton> */}
                {/*             <MVButton disabled>Disabled button 2</MVButton> */}
                {/*         </div> */}
                {/*         <MVCheckBox>Click me</MVCheckBox> */}
                {/*         <MVRadioGroup label='Selection' onSelect={(v, i) => {console.log(i + ' ' + v)}}> */}
                {/*             <MVRadioButton id='t1' value='The thing'>Thing</MVRadioButton> */}
                {/*             <MVRadioButton id='t2' value='The other thing'>Other thing</MVRadioButton> */}
                {/*         </MVRadioGroup> */}
                {/*         <MVText filter='[a-zA-Z]*' onSubmit={(v) => {console.log(v);}}>Insert a word here</MVText> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*         <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton> */}
                {/*     </div> */}
                {/* </MagresViewSidebar> */}
                <div id='mv-appwindow' className='mv-background'>
                </div>
            </div>
        </MagresViewContext.Provider>
    );
}

export default MagresViewApp;