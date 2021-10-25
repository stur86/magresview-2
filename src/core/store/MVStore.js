import React, { createContext, useReducer } from 'react';
import MVReducer, { MVInitialState } from './MVReducer';
import MVInterface from './MVInterface';


function MVStore({children}) {

    const [state, dispatch] = useReducer(MVReducer, MVInitialState);
    const mvinterface = new MVInterface(state, dispatch);

    console.log('Updated store: ' + state.visualizer);

    return (
        <MVStoreContext.Provider value={mvinterface}>
            {children}
        </MVStoreContext.Provider>
    )

};

export const MVStoreContext = createContext(MVInitialState);
export default MVStore;