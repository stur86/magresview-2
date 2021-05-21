import './MagresViewApp.css';
import { useState } from 'react';
import MagresViewContext from './MagresViewContext';

function MagresViewApp() {

    var contextValue = {
        app: null
    }

    return (
        <MagresViewContext.Provider value={contextValue}>
            <div className='mv-main-app'>
                <div className='test'>
                    
                </div>
            </div>
        </MagresViewContext.Provider>
    );
}

export default MagresViewApp;