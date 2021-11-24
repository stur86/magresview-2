import './MVSidebarSelect.css';

import MagresViewSidebar from './MagresViewSidebar';
import { useSelInterface } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVText from '../../controls/MVText';

import React, { useEffect, useRef } from 'react';

function MVSidebarSelect(props) {

    const selint = useSelInterface();

    console.log('[MVSidebarLoad rendered]');

    function selectMode(v) {
        selint.selection_mode = v;
    }

    function setR(v) {
        selint.selection_sphere_r = v;
    }

    function setN(v) {
        selint.selection_bond_n = v;
    }

    const selRef = useRef();
    selRef.current = selint;

    useEffect(() => {
        selRef.current.selection_on = props.show;
    }, [props.show]);

    return (<MagresViewSidebar show={props.show} title='Select and display'>
        <div className='mv-sidebar-block'>
            <MVCheckBox checked={selint.highlight_selected} onCheck={(v) => { selint.highlight_selected = v }} noState>Highlight selected</MVCheckBox>        
            <span className='sep-1' />
            <MVRadioGroup label='Selection mode' onSelect={selectMode} selected={selint.selection_mode} name='selec_mode_radio' noState>
                <MVRadioButton value='atom'>Atom</MVRadioButton>
                <MVRadioButton value='element'>Element</MVRadioButton>
                <MVRadioButton value='sphere'>Sphere, radius =&nbsp;
                    <MVText size='5' value={selint.selection_sphere_r} filter='[0-9]*(?:\.[0-9]*)?' onChange={setR} onSubmit={setR} />&nbsp;  &#8491;
                </MVRadioButton>
                <MVRadioButton value='molecule'>Molecule</MVRadioButton>
                <MVRadioButton value='bonds'>Bonds, max distance = &nbsp;
                    <MVText size='3' value={selint.selection_bond_n} filter='[0-9]*' onChange={setN} onSubmit={setN} />
                </MVRadioButton>
            </MVRadioGroup>
        </div>
        <div className='mv-sidebar-block'>
            <MVButton onClick={() => { selint.displayed = selint.selected }}>Display selected</MVButton>
            <span className='sep-1' />
            <MVButton onClick={() => { selint.displayed = null }}>Reset displayed</MVButton>
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarSelect;