import './controls.css';
import './MVModal.css';

import React from 'react';
import { IconContext } from 'react-icons';
import { IoClose } from 'react-icons/io5';

import { chainClasses } from '../utils';

import MVButton from './MVButton';

function MVModal(props) {

    const onAccept = props.onAccept || (() => {});
    const onClose = props.onClose || (() => {});

    return(
        <div className={chainClasses('mv-control mv-modal-overlay', props.display? '' : 'mv-modal-hidden')}>
            <div className='mv-control mv-modal'>
                <div className='mv-modal-title'>
                    {props.title} 
                    <IconContext.Provider value={{color: 'var(--fwd-color-1)'}}>
                        <IoClose size={22} onClick={onClose}/>
                    </IconContext.Provider>
                </div>
                {props.children}
                <div className='mv-modal-footer'>
                    <MVButton onClick={onAccept}>OK</MVButton>
                    <MVButton onClick={onClose}>Cancel</MVButton>
                </div>
            </div>
        </div>
    );
}

export default MVModal;