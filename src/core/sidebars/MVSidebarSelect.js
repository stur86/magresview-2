import './MVSidebarSelect.css';

import MagresViewSidebar from './MagresViewSidebar';
import { useSelInterface } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVSelect from '../../controls/MVSelect';
import MVText from '../../controls/MVText';
import MVModal from '../../controls/MVModal';

import React, { useEffect, useState, useRef } from 'react';


function MVAtomTable(props) {

    const selint = useSelInterface();

    const ddisp = selint.default_displayed;
    const atoms = ddisp? ddisp.atoms : [];

    return (
        <MVModal title={"Isotopes and references"} display={props.display}
        onClose={props.onClose}>
            <table className='mv-atom-table'>
                <thead>
                    <tr>
                        <th>Species</th>
                        <th>Index</th>
                        <th>Label</th>
                        <th>Isotope</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {atoms.map((a, i) => {
                        const edata = a.elementData;
                        const isos = Object.keys(edata.isotopes);
                        return (<tr key={i}>
                            <td>{a.element}</td>
                            <td>{a.index}</td>
                            <td>{a.element + '_' + a.index}</td>
                            <td>
                                <MVSelect>
                                    {isos.map((iso, j) => (
                                        <option key={j} value={iso}>{iso}</option>
                                        ))}
                                </MVSelect>
                            </td>
                            <td>
                                <div className='cell-content'>
                                    <MVText size={6} />&nbsp;ppm
                                </div>
                            </td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </MVModal>
    );
}


function MVSidebarSelect(props) {

    const [state, setState] = useState({atable_show: false});

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

    function closeAtomTable() {
        setState({
            ...state,
            atable_show: false
        });
    }

    return (<MagresViewSidebar show={props.show} title='Select and display'>
        <div className='mv-sidebar-block'>
            <MVCheckBox checked={selint.show_cryst_labels} onCheck={(v) => { selint.show_cryst_labels = v }}>Show crystallographic labels</MVCheckBox>        
            <MVCheckBox checked={selint.highlight_selected} onCheck={(v) => { selint.highlight_selected = v }}>Highlight selected</MVCheckBox>        
            <span className='sep-1' />
            <MVRadioGroup label='Selection mode' onSelect={selectMode} selected={selint.selection_mode} name='selec_mode_radio'>
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
            <span className='sep-1' />
            <MVButton onClick={() => { setState({...state, atable_show: true}) }}>Isotopes and references</MVButton>
        </div>
        <MVAtomTable display={state.atable_show} onClose={closeAtomTable}/>
    </MagresViewSidebar>);
}

export default MVSidebarSelect;