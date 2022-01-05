import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { useMSInterface } from '../store';
import { chainClasses } from '../../utils';

import React, { useState } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';
import MVModal from '../../controls/MVModal';

function MVReferenceTable(props) {

    return (<MVModal title='References for chemical shifts, by element (ppm)' display={props.display} onClose={props.close}>
        {props.msInterface.referenceList.map(([el, ref]) => {
            return (<div>{el} => {ref}</div>);
        })}
    </MVModal>);
}


function MVSidebarMS(props) {

    const [ state, setState ] = useState({
        showRefTable: false
    });

    const msint = useMSInterface();

    console.log('[MVSidebarMS rendered]');

    var has_ms = false;
    if (props.show) {
        has_ms = msint.hasData;
    }

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        <div className={chainClasses('mv-sidebar-block', has_ms? '' : 'hidden')}>
             <MVCheckBox onCheck={(v) => { msint.hasEllipsoids = v; }} checked={msint.hasEllipsoids}>Ellipsoids</MVCheckBox>
             <MVRange min={0.01} max={0.5} step={0.005} value={msint.ellipsoidScale}
                      onChange={(s) => { msint.ellipsoidScale = s; }} disabled={!msint.hasEllipsoids} noState>Ellipsoid scale</MVRange>
             <MVButton onClick={() => { msint.ellipsoidScale = 0; }} disabled={!msint.hasEllipsoids}>Set auto scale</MVButton>
             <MVRadioGroup label='Show labels' onSelect={(v) => { msint.labelsMode = v; }} selected={msint.labelsMode} name='ms_label_radio'>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='iso'>Isotropy (ppm)</MVRadioButton>
                <MVRadioButton value='aniso'>Anisotropy (ppm)</MVRadioButton>
                <MVRadioButton value='asymm'>Asymmetry</MVRadioButton>
             </MVRadioGroup>
             <MVRadioGroup label='Use color scale' onSelect={(v) => { msint.cscaleMode = v; }} selected={msint.cscaleMode} name='ms_cscale_radio'>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='iso'>Isotropy (ppm)</MVRadioButton>
                <MVRadioButton value='aniso'>Anisotropy (ppm)</MVRadioButton>
                <MVRadioButton value='asymm'>Asymmetry</MVRadioButton>
             </MVRadioGroup>
             <MVButton onClick={() => { setState({...state, showRefTable: true}) }}>Set References</MVButton>
             <MVReferenceTable display={state.showRefTable} close={() => { setState({...state, showRefTable: false}) }} msInterface={msint}/>
          </div>
         <div className={chainClasses('mv-warning-noms', has_ms? 'hidden': '')}>No MS data found</div>
    </MagresViewSidebar>);
}

export default MVSidebarMS;