import MagresViewSidebar from './MagresViewSidebar';

import React, { useState } from 'react';

function MVSidebarSelect(props) {

    const [state, setState] = useState();


    return (<MagresViewSidebar show={props.show} title='Select and display'>
        
    </MagresViewSidebar>);
}

export default MVSidebarSelect;