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

import './MVSidebarEFG.css';

import MagresViewSidebar from './MagresViewSidebar';
import { useEFGInterface } from '../store';
import { chainClasses } from '../../utils';

import React from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';

function MVSidebarEFG(props) {

    const efgint = useEFGInterface();

    console.log('[MVSidebarEFG rendered]');

    var has_efg = false;
    if (props.show) {
        has_efg = efgint.hasData;
    }

    return (<MagresViewSidebar show={props.show} title='Electric Field Gradient'>
        <div className={chainClasses('mv-sidebar-block', has_efg? '' : 'hidden')}>
             <MVCheckBox onCheck={(v) => { efgint.hasEllipsoids = v; }} checked={ efgint.hasEllipsoids } color={'var(--efg-color-2)'}>Ellipsoids</MVCheckBox>
             <MVRange min={0.1} max={10.0} step={0.05} value={efgint.ellipsoidScale} color={'var(--efg-color-2)'}
                      onChange={(s) => { efgint.ellipsoidScale = s; }} disabled={!efgint.hasEllipsoids}>Ellipsoid scale</MVRange>
             <MVButton onClick={() => { efgint.ellipsoidScale = 0; }} disabled={!efgint.hasEllipsoids}>Set auto scale</MVButton>
             <MVRadioGroup label='Show labels' onSelect={(v) => { efgint.labelsMode = v; }} selected={efgint.labelsMode} name='efg_label_radio' color={'var(--efg-color-2)'}>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='aniso'>Anisotropy (au)</MVRadioButton>
                <MVRadioButton value='asymm'>Asymmetry</MVRadioButton>
                <MVRadioButton value='Q'>Quadrupole Coupling (kHz)</MVRadioButton>
             </MVRadioGroup>
             <MVRadioGroup label='Use color scale' onSelect={(v) => { efgint.colorScaleType = v; }} selected={ efgint.colorScaleType } disabled={!efgint.colorScaleAvailable}
                           name='efg_cscale_radio' color={'var(--efg-color-2)'}>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='efg_aniso'>Anisotropy</MVRadioButton>
                <MVRadioButton value='efg_asymm'>Asymmetry</MVRadioButton>
                <MVRadioButton value='efg_Q'>Quadrupole Coupling</MVRadioButton>
             </MVRadioGroup>
        </div>
        <div className={chainClasses('mv-warning-noms', has_efg? 'hidden' : '')}>No EFG data found</div>
    </MagresViewSidebar>);
}

export default MVSidebarEFG;