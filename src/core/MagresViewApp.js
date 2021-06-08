import './themes.css';
import './MagresViewApp.css';
import { useState } from 'react';
import { chainClasses } from '../utils';
import MagresViewContext from './MagresViewContext';
import MagresViewHeader from './MagresViewHeader';

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
                <div className='mv-background'>
                    
                </div>
            </div>
        </MagresViewContext.Provider>
    );
}

export default MagresViewApp;