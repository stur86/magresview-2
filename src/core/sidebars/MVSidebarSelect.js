import './MVSidebarSelect.css';

import _ from 'lodash';

import MagresViewSidebar from './MagresViewSidebar';
import { useSelInterface } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVText from '../../controls/MVText';
import MVCustomSelect, { MVCustomSelectOption } from '../../controls/MVCustomSelect';


import React, { useEffect, useRef, useState } from 'react';


function sharedElement(sel) {
    if (sel == null || sel.atoms.length === 0) {
        return null;
    }

    let atoms = sel.atoms;
    let el = atoms[0].element;

    if (atoms.slice(1).reduce((s, a) => (s && a.element === el), true)) {
        return el;
    }
    else {
        return null;
    }
}


function MVIsotopeSelection(props) {

    // Actually unnecessary; we only use it to trigger a re-render
    const [ state, setState ] = useState(1);

    const selint = useSelInterface();
    const selected = selint.selected;
    const el = sharedElement(selected);

    let elData = null;
    let isoConf = null;
    let selOptions = [];
    let currentOption = 0;

    if (el) {
        // Information about that element?
        elData = selected.atoms[0].elementData;
        isoConf = selected.atoms.map((a) => a.isotope);

        // Are they all the same?
        currentOption = isoConf[0].toString();
        if (!isoConf.reduce((s, x) => s && x === isoConf[0], true)) {
            // If not, then we have to add a special option that reproduces this last
            // configuration
            selOptions = [<MVCustomSelectOption key={-1} value={isoConf}>
                {_.join(_.uniq(isoConf))}
            </MVCustomSelectOption>];
            currentOption = isoConf;
        }

        // Generate options
        let keys = Object.keys(elData.isotopes).sort();
        selOptions = selOptions.concat(keys.map((A, i) => (<MVCustomSelectOption key={i} value={A}>
                {A}
            </MVCustomSelectOption>))
        );
    }
    else {
        selOptions = [<MVCustomSelectOption key={0} value={0}>N/A</MVCustomSelectOption>];
    }

    // This component handles specifically just the selection of isotopes
    return (<>
        <h3>Isotope selection</h3>
        <MVCustomSelect disabled={!el} onSelect={(A) => { selint.setIsotope(A); setState(-state); }} selected={currentOption}>{selOptions}</MVCustomSelect>
    </>);
}


function MVSidebarSelect(props) {

    const selint = useSelInterface();

    console.log('[MVSidebarSelect rendered]');

    function selectMode(v) {
        selint.selectionMode = v;
    }

    function setR(v) {
        selint.selectionSphereR = v;
    }

    function setN(v) {
        selint.selectionBondN = v;
    }

    const selRef = useRef();
    selRef.current = selint;

    useEffect(() => {
        let selint = selRef.current;
        selint.selectionOn = props.show;
    }, [props.show, selint.app]); // The dependency on app guarantees this is executed AFTER the app itself is loaded

    return (<MagresViewSidebar show={props.show} title='Select and display'>
        <div className='mv-sidebar-block'>
            <MVCheckBox checked={selint.showCrystLabels} onCheck={(v) => { selint.showCrystLabels = v }}>Show crystallographic labels</MVCheckBox>        
            <MVCheckBox checked={selint.highlightSelected} onCheck={(v) => { selint.highlightSelected = v }}>Highlight selected</MVCheckBox>        
            <span className='sep-1' />
            <MVRadioGroup label='Selection mode' onSelect={selectMode} selected={selint.selectionMode} name='selec_mode_radio'>
                <MVRadioButton value='atom'>Atom</MVRadioButton>
                <MVRadioButton value='element'>Element</MVRadioButton>
                <MVRadioButton value='sphere'>Sphere, radius =&nbsp;
                    <MVText size='5' value={selint.selectionSphereR} filter='[0-9]*(?:\.[0-9]*)?' onChange={setR} onSubmit={setR} />&nbsp;  &#8491;
                </MVRadioButton>
                <MVRadioButton value='molecule'>Molecule</MVRadioButton>
                <MVRadioButton value='bonds'>Bonds, max distance = &nbsp;
                    <MVText size='3' value={selint.selectionBondN} filter='[0-9]*' onChange={setN} onSubmit={setN} />
                </MVRadioButton>
            </MVRadioGroup>
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-block'>
            <div className='mv-sidebar-row'>
                <MVButton onClick={() => { selint.displayed = selint.selected }}>Display selected</MVButton>
                <MVButton onClick={() => { selint.displayed = null }}>Reset displayed</MVButton>                
            </div>
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-block'>
            <MVIsotopeSelection />
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarSelect;