import './MVSidebarSelect.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVText from '../../controls/MVText';

import React, { useState, useContext } from 'react';

function MVSidebarSelect(props) {

    const [ state, setState ] = useState({mode: 'atom', n: 1, r: 2.0});
    const [mvc] = useContext(MVStoreContext);

    function selectMode(v) {
        mvc.select.set_select(v, state);
        setState({
            ...state,
            mode: v
        });
    }

    function setR(v) {
        setState({
            ...state,
            r: parseFloat(v) || 0.0
        })
    }

    function setN(v) {
        setState({
            ...state,
            n: parseInt(v) || 0
        })
    }

    if (!props.show) {
        // Just no selection possible
        mvc.select.set_select('none');
    }
    else {
        mvc.select.set_select(state.mode, state);
    }

    return (<MagresViewSidebar show={props.show} title='Select and display'>
        <p>
            <MVCheckBox checked={mvc.select.highlighted} onCheck={(v) => { mvc.select.highlighted = v }} noState>Highlight selected</MVCheckBox>        
            <span className='sep-1' />
            <MVRadioGroup label='Selection mode' onSelect={selectMode} name='selec_mode_radio'>
                <MVRadioButton value='atom'>Atom</MVRadioButton>
                <MVRadioButton value='element'>Element</MVRadioButton>
                <MVRadioButton value='sphere'>Sphere, radius =&nbsp;
                    <MVText size='5' value={state.r} filter='[0-9]*(?:\.[0-9]*)?' onChange={setR} onSubmit={setR}/>&nbsp;  &#8491;
                </MVRadioButton>
                <MVRadioButton value='molecule'>Molecule</MVRadioButton>
                <MVRadioButton value='bonds'>Bonds, max distance = &nbsp;
                    <MVText size='3' value={state.n} filter='[0-9]*' onChange={setN} onSubmit={setN} />
                </MVRadioButton>
            </MVRadioGroup>
        </p>
        <p>
            <MVButton onClick={() => { mvc.select.set_display('selected'); }}>Display selected</MVButton>
            <span className='sep-1' />
            <MVButton onClick={() => { mvc.select.set_display(); }}>Reset displayed</MVButton>
        </p>
    </MagresViewSidebar>);
}

export default MVSidebarSelect;