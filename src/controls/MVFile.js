import './MVFile.css';
import { chainClasses } from '../utils';

import React from 'react';

function MVFile(props) {

    function onChange(e) {
        if (props.onSelect) {
            var files = e.target.files;
            if (files.length > 0) {
                props.onSelect(files);
            }
        }
        e.target.value = null;
    }

    return (
        <input className={chainClasses('mv-control', 'mv-file', props.notext? 'hide-text' : null)} type='file' accept={props.filetypes} onChange={onChange}/>
    );
}

export default MVFile;