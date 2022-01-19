import MagresViewSidebar from './MagresViewSidebar';

import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';

import MVFile from '../../controls/MVFile';
import MVBox from '../../controls/MVBox';
import MVCheckBox from '../../controls/MVCheckBox';
import MVListSelect, { MVListSelectOption } from '../../controls/MVListSelect';
import { useAppInterface } from '../store';

import React, { useState } from 'react';

import _ from 'lodash';

// Accepted file formats
const file_formats = ['.cif', '.xyz', '.magres', '.cell'];

function MVSidebarLoad(props) {

    const [ state, setState ] = useState({
        load_message: '',
        load_message_status: null,
        list_selected: ''
    });

    const appint = useAppInterface();
    const models = appint.models;

    console.log('[MVSidebarLoad rendered]');

    // Methods
    function loadModel(f) {

        appint.load(f, (success) => {
            // Check success
            let msg = '';
            let err = false;
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
                load_message: msg, 
                load_message_status: err? 'error' : 'success'
            });
        });
    }

    function makeModelOption(m, i) {

        let model_icon;        
        if (m === appint.currentModelName) {
            model_icon = <AiFillEye size={22}/>;
        }
        else {
            model_icon = <AiOutlineEyeInvisible size={22} onClick={() => { appint.display(m); }} />
        }

        return (<MVListSelectOption key={i} value={m} icon={model_icon}>
            {m}
            <MdDeleteForever style={{color: 'var(--err-color-2)'}} size={22} onClick={() => { appint.delete(m); }} />
        </MVListSelectOption>);
    }

    return (<MagresViewSidebar show={props.show} title='Load file'>
        <div className='mv-sidebar-block'>
            <MVFile filetypes={file_formats.join(',')} onSelect={loadModel} notext={true} multiple={true}/>
            <MVCheckBox onCheck={(v) => { appint.loadAsMol = v }} checked={appint.loadAsMol}>Load as molecular crystal</MVCheckBox>
            <MVCheckBox onCheck={(v) => { appint.useNMRIsotopes = v }} checked={appint.useNMRIsotopes}>Use only NMR active isotopes</MVCheckBox>
        </div>
        <h4>Models:</h4>
        <MVListSelect selected={state.list_selected} onSelect={(v) => { setState({...state, list_selected: v}); }}>
            {models.map(makeModelOption)}
        </MVListSelect>
        <span className='sep-1' />
        <MVBox status={state.load_message_status} onClose={() => {setState({...state, load_message_status: ''})}}>
            {state.load_message}
        </MVBox>
    </MagresViewSidebar>);
}

export default MVSidebarLoad;