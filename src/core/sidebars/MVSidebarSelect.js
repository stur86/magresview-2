import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import React, { useState, useContext } from 'react';

function MVSidebarSelect(props) {

    // const [state, setState] = useState();
    const mvc = useContext(MVStoreContext);


    return (<MagresViewSidebar show={props.show} title='Select and display'>
        
    </MagresViewSidebar>);
}

export default MVSidebarSelect;