import React, { createContext, useReducer } from 'react';
import MVReducer, { MVInitialState } from './MVReducer';
import MVInterface from './MVInterface';

const mvinterface = new MVInterface();

/* 
 * This store component acts as a provider to distribute around the interface
 * to all visualisation functionality. We use this method to avoid excessive 
 * re-renders when changing visualizations, and to keep a unique reference to one app.
 *
 * It's important to note the following details:
 * 
 *  - the MVInterface is instantiated as a constant outside of the component.
 *    The component then links the new state and dispatch methods as these are
 *    produced. This is done because some methods of MVInterface call the
 *    dispatch multiple times, and if we re-instantiated MVInterface every time,
 *    besides the (small) useless overhead, we would also have the risk of weird bugs
 *    due to outdated dispatch methods being called
 *    
 *  - The MVInterface is then passed as a value within brackets. This is merely
 *    done to trigger the re-render of everything that consumes it inside the
 *    Provider every time there's a dispatch. Otherwise the value passed would
 *    be a reference and it would look always the same to React
 *
 * 
 */
function MVStore({children}) {

    const [state, dispatch] = useReducer(MVReducer, MVInitialState);
    mvinterface.link(state, dispatch);

    return (
        <MVStoreContext.Provider value={[mvinterface]}>
            {children}
        </MVStoreContext.Provider>
    )

};

export const MVStoreContext = createContext(MVInitialState);
export { mvinterface };
export default MVStore;