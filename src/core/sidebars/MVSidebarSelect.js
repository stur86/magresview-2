import './MVSidebarSelect.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVText from '../../controls/MVText';

import React, { useState, useContext } from 'react';

// function MVSelectTable(props) {
// 
//     // Create list of elements
//     var atoms = props.atoms || [];
//     var tab_elems = [];
//     for (var i = 0; i < Math.min(atoms.length, 50); ++i) {
//         tab_elems.push(<span key={i+'A'}>{atoms[i].element + ' ' + atoms[i].index + ' ' + atoms[i].ijk}</span>);
//         tab_elems.push(<span key={i+'S'}>T</span>);
//         tab_elems.push(<span key={i+'D'}>T</span>);
//     }
// 
//     return (<div className='mv-atomselect-table mv-control'>
//         <span key='hA' className='mv-at-header'>Atom</span>
//         <span key='hS' className='mv-at-header'>S</span>
//         <span key='hD' className='mv-at-header'>D</span>
//         {tab_elems}
//     </div>);
// }

function MVSidebarSelect(props) {

    const [ state, setState ] = useState({mode: 'atom', n: 1, r: 2.0});
    const mvc = useContext(MVStoreContext);

    // Getting these for the selection table (only if sidebar is visible, 
    // wasteful otherwise)
    // var model_atoms = [];
    // if (props.show && mvc.app && mvc.app.model)
    //     model_atoms = mvc.app.model.atoms;

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
            <MVCheckBox checked={mvc.select.highlighted} onCheck={(v) => { mvc.select.highlighted = v }}>Highlight selected</MVCheckBox>        
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
    </MagresViewSidebar>);
}

export default MVSidebarSelect;