import './controls.css';
import './MVModal.css';

import React, { useEffect, useReducer } from 'react';
import { IconContext } from 'react-icons';
import { IoClose } from 'react-icons/io5';

import { chainClasses } from '../utils';

import MVButton from './MVButton';

function modalReducer(state, action={}) {
    switch(action.type) {
        case 'dragstart': 
            state = {
                ...state,
                is_drag: true,
                x0: action.x0,
                y0: action.y0
            };
            break;
        case 'move':
            state = {
                ...state,
                dx: action.dx-state.x0,
                dy: action.dy-state.y0
            };
            break;
        case 'dragend': 
            state = {
                ...state,
                is_drag: false,
                x0: null,
                y0: null
            };
            break;
        default: 
            break;
    }

    return state;
}

function MVModal(props) {

    const [state, dispatch] = useReducer(modalReducer, {
        dx: 0,
        dy: 0,
        x0: null,
        y0: null,
        is_drag: false
    });

    const onAccept = props.onAccept || (() => {});
    const onClose = props.onClose || (() => {});

    function onTitleMouseDown(e) {

        if (props.draggable && e.button === 0) {
            dispatch({
                type: 'dragstart',
                x0: e.clientX-state.dx,
                y0: e.clientY-state.dy
            });
        }
    }

    useEffect(() => {

        if (state.is_drag) {
            document.onmousemove = (e) => {
                dispatch({
                    type: 'move',
                    dx: e.clientX,
                    dy: e.clientY
                });                
            }

            document.onmouseup = (e) => {
                dispatch({
                    type: 'dragend'
                });
            }
        }
        else {
            document.onmousemove = null;
            document.onmouseup = null;
        }

    }, [state.is_drag]);

    const modalStyle = {
        transform: 'translate(' + state.dx + 'px, ' + state.dy + 'px)'
    };

    const hasOverlay = props.hasOverlay;

    if (!hasOverlay && !props.display) {
        modalStyle['display'] = 'none';
    }

    let modal = (<div className={chainClasses('mv-control mv-modal', props.draggable? 'mv-modal-draggable' : '', 
                                              props.resizable? 'mv-modal-resizable' : '')} style={modalStyle}>
        <div className='mv-modal-title' onMouseDown={onTitleMouseDown}>
            {props.title} 
            <IconContext.Provider value={{color: 'var(--fwd-color-1)'}}>
                <IoClose size={22} onClick={onClose}/>
            </IconContext.Provider>
        </div>
        <div className='mv-modal-content'>
            {props.children}                
        </div>
        {props.noFooter? <></> :
            <div className='mv-modal-footer'>
                <MVButton onClick={onAccept}>OK</MVButton>
                <MVButton onClick={onClose}>Cancel</MVButton>
            </div>
        }
    </div>);

    if (hasOverlay) {
        modal = (<div className={chainClasses('mv-control mv-modal-overlay', props.display? '' : 'mv-modal-hidden')}>
            {modal}
        </div>);
    }

    return modal;
}

export default MVModal;