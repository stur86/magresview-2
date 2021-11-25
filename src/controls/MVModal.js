import './controls.css';
import './MVModal.css';

import React from 'react';

import { chainClasses } from '../utils';

function MVModal(props) {

    return(
        <div className={chainClasses('mv-control mv-modal-overlay', props.display? '' : 'mv-modal-hidden')}>
            <div className='mv-control mv-modal'>
                {props.children}
            </div>
        </div>
    );
}

export default MVModal;