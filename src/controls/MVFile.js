import './MVFile.css';

import React from 'react';

function MVFile(props) {

    function onChange(e) {
        if (props.onSelect) {
            var files = e.target.files;
            if (files.length > 0) {
                props.onSelect(files);
            }
        }
    }

    return (
        <input className='mv-control mv-file' type='file' accept={props.filetypes} onChange={onChange}/>
    );
}

export default MVFile;