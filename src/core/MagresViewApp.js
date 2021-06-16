import './themes.css';
import '../controls/controls.css';
import './MagresViewApp.css';
import { useState } from 'react';
import { chainClasses } from '../utils';
import MagresViewContext from './MagresViewContext';
import MagresViewHeader from './MagresViewHeader';
import MagresViewSidebar from './MagresViewSidebar';

import MVButton from '../controls/MVButton';
import MVCheckBox from '../controls/MVCheckBox';
import MVRadioButton, { MVRadioGroup } from '../controls/MVRadioButton';

const defaultState = {
    theme: 'dark',
    panel: null
};

function MagresViewApp() {

    var [state, setState] = useState(defaultState);

    var contextValue = {
        app: null,
        setProperty: (name, value) => {
            var newstate = {...state};
            newstate[name] = value;
            setState(newstate);
        },
        ...state
    };

    return (
        <MagresViewContext.Provider value={contextValue}>
            <div className={chainClasses('mv-main-app', 'theme-' + state.theme)}>
                <MagresViewHeader />
                <MagresViewSidebar show={state.panel === 'load'}>
                    Thing
                </MagresViewSidebar>
                <MagresViewSidebar title='Magnetic Shielding' show={state.panel === 'ms'}>
                    <div className='mv-flex-vgrid'>
                        <MVButton onClick={() => {alert('Clicked');}}>Enabled button</MVButton>
                        <div className='mv-flex-hgrid'>
                            <MVButton disabled>Disabled button 1</MVButton>
                            <MVButton disabled>Disabled button 2</MVButton>
                        </div>
                        <MVCheckBox>Click me</MVCheckBox>
                        <MVRadioGroup label='Selection' onSelect={(v, i) => {console.log(i + ' ' + v)}}>
                            <MVRadioButton id='t1' value='The thing'>Thing</MVRadioButton>
                            <MVRadioButton id='t2' value='The other thing'>Other thing</MVRadioButton>
                        </MVRadioGroup>
                    </div>
                </MagresViewSidebar>
                <div className='mv-background'>
                </div>
            </div>
        </MagresViewContext.Provider>
    );
}

export default MagresViewApp;