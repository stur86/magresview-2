import './MVButton.css';
import React from 'react';

function MVButton(props) {
    return (<button {...props} className='mv-control mv-button'>
        {props.children}
    </button>);
}

export default MVButton;