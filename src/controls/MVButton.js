import './MVButton.css';
import React from 'react';

function MVButton(props) {
    return (
    <div className='mv-control'>
        <button {...props} className='mv-control mv-button'>
            {props.children}
        </button>
    </div>);
}

export default MVButton;