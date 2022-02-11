/**
 * MagresView 2.0
 *
 * A web interface to visualize and interact with computed NMR data in the Magres
 * file format.
 *
 * Author: Simone Sturniolo
 *
 * Copyright 2022 Science and Technology Facilities Council
 * This software is distributed under the terms of the MIT License
 * Please refer to the file LICENSE for the text of the license
 * 
 */

import './MVSidebarEuler.css';

import { useRef, useEffect } from 'react';

import MagresViewSidebar from './MagresViewSidebar';
import { useEulerInterface } from '../store';
import { saveContents, copyContents } from '../../utils';

import MVSwitch from '../../controls/MVSwitch';
import MVButton from '../../controls/MVButton';
import MVCustomSelect, { MVCustomSelectOption } from '../../controls/MVCustomSelect';
import { FaCopy } from 'react-icons/fa';

function MVSidebarEuler(props) {

    const eulint = useEulerInterface();

    console.log('[MVSidebarEuler rendered]');

    const intRef = useRef();
    intRef.current = eulint;

    useEffect(() => {
        let eulint = intRef.current;

        // Only keep events bound when this sidebar is visible!
        if (props.show) {
            eulint.bind();
        }
        else {
            eulint.unbind();
        }

    }, [props.show]);

    const otherTensor = {
        ms: 'efg',
        efg: 'ms'
    };

    // Round values
    let a = eulint.alpha;
    let b = eulint.beta;
    let c = eulint.gamma;

    if (a !== 'N/A') {
        // It's a number
        a = a.toFixed(2);
        b = b.toFixed(2);
        c = c.toFixed(2);
    }

    const hasSel = (eulint.atomA && eulint.atomB);

    return (<MagresViewSidebar show={props.show} title='Euler angles'>
        <p>
            Left (right) click on atoms to pick atom A (B). Choose with the 
            switches below which NMR tensor you care about for each, and
            the Euler angles between them will be automatically printed out.
        </p>
        <div className='mv-sidebar-block'>
            <h3>Atom A</h3>
            <div className='mv-euler-agrid'>
                <span className='header'>Label:</span>
                <span>{eulint.atomLabelA}</span>
                <div className='mv-euler-agrid-switch'>
                    <span>MS</span>
                    <MVSwitch on={ eulint.tensorA === 'efg' } onClick={() => { eulint.tensorA = otherTensor[eulint.tensorA]; }} 
                              colorFalse='var(--ms-color-2)' colorTrue='var(--efg-color-2)'/>
                    <span>EFG</span>
                </div>
            </div>
        </div>
        <div className='mv-sidebar-block'>
            <h3>Atom B</h3>
            <div className='mv-euler-agrid'>
                <span className='header'>Label:</span>
                <span>{eulint.atomLabelB}</span>
                <div className='mv-euler-agrid-switch'>
                    <span>MS</span>
                    <MVSwitch on={ eulint.tensorB === 'efg' } onClick={() => { eulint.tensorB = otherTensor[eulint.tensorB]; }} 
                              colorFalse='var(--ms-color-2)' colorTrue='var(--efg-color-2)'/>
                    <span>EFG</span>
                </div>
            </div>
        </div>
        <div className='mv-sidebar-block'>
            <h3>Convention</h3>
            <MVCustomSelect selected={eulint.convention} onSelect={(v) => { eulint.convention = v; }}>
                <MVCustomSelectOption value='zyz'>ZYZ</MVCustomSelectOption>
                <MVCustomSelectOption value='zxz'>ZXZ</MVCustomSelectOption>
            </MVCustomSelect>
        </div>
        <div className='mv-sidebar-block'>
            <h3>Angles</h3>
            <table className='mv-eul-results'>
                <thead>
                    <tr>
                        <td>Alpha</td>
                        <td>Beta</td>
                        <td>Gamma</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{a}&deg;</td>
                        <td>{b}&deg;</td>
                        <td>{c}&deg;</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-block'>
            <MVButton onClick={() => { copyContents(eulint.txtReport()); }} disabled={!hasSel}><FaCopy />&nbsp;Copy to clipboard</MVButton>            
        </div>
        <div className='mv-sidebar-block'>
            <MVButton onClick={() => { saveContents('data:,' + eulint.txtSelfAngleTable(), 'eulerTable.txt'); }}  disabled={!(eulint.hasMSData && eulint.hasEFGData)}>
                Download table of MS-to-EFG angles
            </MVButton>            
        </div>

    </MagresViewSidebar>);
}

export default MVSidebarEuler;