import './MagresViewApp.css';
import { useState } from 'react';
import { chainClasses } from './utils';
import MagresViewContext from './MagresViewContext';

function MagresViewApp() {

    var [theme, setTheme] = useState('dark');

    var contextValue = {
        app: null,
        theme: theme,
        setTheme: setTheme
    };

    return (
        <MagresViewContext.Provider value={contextValue}>
            <div className={chainClasses('mv-main-app', 'theme-' + theme)}>
                <div className='test'>
                    
                </div>
            </div>
        </MagresViewContext.Provider>
    );
}

export default MagresViewApp;