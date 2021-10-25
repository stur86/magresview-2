import MagresViewSidebar from './MagresViewSidebar';

import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';

import MVFile from '../../controls/MVFile';
import MVBox from '../../controls/MVBox';
import MVCheckBox from '../../controls/MVCheckBox';
import MVListSelect, { MVListSelectOption } from '../../controls/MVListSelect';
import viewerSingleton from '../viewer/ViewerSingleton';

import React, { useState } from 'react';

import _ from 'lodash';

// Accepted file formats
const file_formats = ['.cif', '.xyz', '.magres', '.cell'];

function MVSidebarLoad(props) {

    const [ state, setState ] = useState({
        load_as_mol: false,
        current: null,
        load_message: '',
        load_message_status: null
    });

    const viewer = viewerSingleton.instance;

    let models = [];
    if (viewer) {
        models = viewerSingleton.instance.model_list;
    }

    // Methods
    function loadModel(f) {
        var params = {
            molecularCrystal: state.load_as_mol
        };
        viewerSingleton.loadFile(f, params, (success) => {
            // Check success
            var msg = '';
            var err = false;
            _.map(success, (v, n) => {
                if (v !== 0) {
                    msg += 'Error parsing file ' + n + ': ' + v + '\n';
                    err = true;
                }
            });
            if (msg === '') {
                msg = 'All files parsed successfully!'
            }

            setState({
                ...state,
                current: viewerSingleton.instance._current_mname,
                load_message: msg, 
                load_message_status: err? 'error' : 'success'
            });
        });       
    }

    function showModel(m) {
        viewerSingleton.instance.displayModel(m);
        setState({
            ...state,
            current: viewerSingleton.instance._current_mname
        });
    }

    function deleteModel(m) {
        viewerSingleton.instance.deleteModel(m);

        var models = viewerSingleton.instance.model_list;
        if (state.current === m && models.length > 0) {
            // Display a different one
            viewerSingleton.instance.displayModel(models[0]);
        }
        setState({
            ...state,
            current: viewerSingleton.instance._current_mname
        });
    }

    function makeModelOption(m, i) {

        var model_icon;
        if (m === state.current) {
            model_icon = <AiFillEye size={22}/>;
        }
        else {
            model_icon = <AiOutlineEyeInvisible size={22} onClick={() => {showModel(m);}} />
        }

        return (<MVListSelectOption key={i} value={m} icon={model_icon}>
            {m}
            <MdDeleteForever style={{color: 'var(--err-color-2)'}} size={22} onClick={() => {deleteModel(m)}} />
        </MVListSelectOption>);
    }

    return (<MagresViewSidebar show={props.show} title='Load file'>
        <p>
            <MVFile filetypes={file_formats.join(',')} onSelect={loadModel} notext={true} multiple={true}/>
            <MVCheckBox onCheck={(v) => {setState({...state, load_as_mol: v})}}>Load as molecular crystal</MVCheckBox>
        </p>
        <h4>Models:</h4>
        <MVListSelect>
            {models.map(makeModelOption)}
        </MVListSelect>
        <span className='sep-1' />
        <MVBox status={state.load_message_status} onClose={() => {setState({...state, load_message_status: ''})}}>
            {state.load_message}
        </MVBox>
    </MagresViewSidebar>);
}

export default MVSidebarLoad;