import './MVFile.css';

import React from 'react';

function MVFile(props) {

    function onChange(e) {
        if (props.onSelect) {
            props.onSelect(e.target.files);
        }
    }

    return (
        <input className='mv-control mv-file' type='file' accept={props.filetypes} onChange={onChange}/>
    );
}

export default MVFile;