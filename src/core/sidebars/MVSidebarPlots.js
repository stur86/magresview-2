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

import './MVSidebarPlots.css';

import MagresViewSidebar from './MagresViewSidebar';

import MVFile from '../../controls/MVFile';
import MVButton from '../../controls/MVButton';
import MVCheckBox from '../../controls/MVCheckBox';
import MVText from '../../controls/MVText';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';

import { usePlotsInterface } from '../store';

function MVSidebarPlots(props) {

    const pltint = usePlotsInterface();
    const formats = '.png,.jpg,.jpeg';

    function setMinX(v) {
        pltint.setRange(v);
    }

    function setMaxX(v) {
        pltint.setRange(null, v);
    }

    function setMinY(v) {
        pltint.setRange(v, null, 'y');
    }

    function setMaxY(v) {
        pltint.setRange(null, v, 'y');
    }

    return (<MagresViewSidebar show={props.show} title="Spectral plots">
        
        <div className='mv-sidebar-block'>
            <MVRadioGroup label='Plot mode' selected={pltint.mode} onSelect={(v) => {pltint.mode = v}}>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='bars-1d'>1D, bars</MVRadioButton>
                <MVRadioButton value='line-1d'>1D, Lorentzian broadening</MVRadioButton>
            </MVRadioGroup>
        </div>
        <div className='mv-sidebar-block'>
            Background spectrum image
            <MVFile filetypes={formats} onSelect={(f) => { pltint.loadBkgImage(f); }} notext={false} multiple={false}/>
            <MVButton onClick={() => { pltint.clearBkgImage(); }}>Clear image</MVButton>
        </div>
        <div className='mv-sidebar-grid'>
            <MVCheckBox checked={pltint.showAxes} onCheck={(v) => { pltint.showAxes = v; }}>Show axes</MVCheckBox>
            <MVCheckBox checked={pltint.showGrid} onCheck={(v) => { pltint.showGrid = v; }}>Show grid</MVCheckBox>
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-row' style={{alignItems: 'center'}}>
        X range: &nbsp;
            <MVText size='5' value={pltint.rangeX[0]} onChange={setMinX} filter='[\-]*[0-9]*(?:\.[0-9]*)?' /> &nbsp; to &nbsp; 
            <MVText size='5' value={pltint.rangeX[1]} onChange={setMaxX} filter='[\-]*[0-9]*(?:\.[0-9]*)?' />
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-row' style={{alignItems: 'center'}}>
        Y range: &nbsp;
            <MVText size='5' value={pltint.rangeY[0]} onChange={setMinY} filter='[\-]*[0-9]*(?:\.[0-9]*)?' /> &nbsp; to &nbsp; 
            <MVText size='5' value={pltint.rangeY[1]} onChange={setMaxY} filter='[\-]*[0-9]*(?:\.[0-9]*)?' />
        </div>
        <span className='sep-1' />
        <div className='mv-sidebar-row' style={{alignItems: 'center'}}>
        Peak width: &nbsp;
            <MVText size='5' value={pltint.peakW} onChange={(v) => { pltint.peakW = v; }} filter='[\-]*[0-9]*(?:\.[0-9]*)?' /> ppm
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarPlots;
