import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import React, { useContext } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';

function MVSidebarMS(props) {

    const [mvc] = useContext(MVStoreContext);

    var has_ms = false;
    if (props.show) {
        has_ms = mvc.ms.hasData;
    }

    function setLabels(v) {
        let labels_on = (v !== 'none');
        mvc.ms.setLabels(labels_on, v);
    }

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        {has_ms? 
         (<div className='mv-sidebar-block'>
             <MVCheckBox onCheck={(v) => { mvc.ms.setEllipsoids(v); }} checked={mvc.ms.hasEllipsoids}>Ellipsoids</MVCheckBox>
             <MVRange min={0.01} max={0.5} step={0.005} value={mvc.ms.ellipsoidScale}
                      onChange={(s) => { mvc.ms.setEllipsoids(mvc.ms.hasEllipsoids, s); }} disabled={!mvc.ms.hasEllipsoids} noState>Ellipsoid scale</MVRange>
             <MVButton onClick={() => { mvc.ms.setEllipsoids(mvc.ms.hasEllipsoids, 0); }}>Set auto scale</MVButton>
             <MVRadioGroup label='Show labels' onSelect={setLabels} selected={mvc.ms.labelsContent} name='selec_mode_radio' noState>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='iso'>Isotropy (ppm)</MVRadioButton>
                <MVRadioButton value='aniso'>Anisotropy (ppm)</MVRadioButton>
                <MVRadioButton value='asymm'>Asymmetry</MVRadioButton>
             </MVRadioGroup>
         </div>): 
         <div className='mv-warning-noms'>No MS data found</div>}
    </MagresViewSidebar>);
}

export default MVSidebarMS;