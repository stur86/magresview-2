import './MVSidebarMS.css';

import MagresViewSidebar from './MagresViewSidebar';
import { useMSInterface } from '../store';

import React, { useContext } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';
import MVButton from '../../controls/MVButton';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';

function MVSidebarMS(props) {

    // const [mvc] = useContext(MVStoreContext);
    const msint = useMSInterface();

    var has_ms = false;
    if (props.show) {
        has_ms = msint.hasData;
    }

    return (<MagresViewSidebar show={props.show} title='Magnetic Shielding'>
        {has_ms? 
         (<div className='mv-sidebar-block'>
             <MVCheckBox onCheck={(v) => { msint.hasEllipsoids = v; }} checked={msint.hasEllipsoids}>Ellipsoids</MVCheckBox>
             <MVRange min={0.01} max={0.5} step={0.005} value={msint.ellipsoidScale}
                      onChange={(s) => { msint.ellipsoidScale = s; }} disabled={!msint.hasEllipsoids} noState>Ellipsoid scale</MVRange>
             <MVButton onClick={() => { msint.ellipsoidScale = 0; }} disabled={!msint.hasEllipsoids}>Set auto scale</MVButton>
             <MVRadioGroup label='Show labels' onSelect={(v) => { msint.labelsMode = v; }} selected={msint.labelsMode} name='ms_label_radio' noState>
                <MVRadioButton value='none'>None</MVRadioButton>
                <MVRadioButton value='iso'>Isotropy (ppm)</MVRadioButton>
                <MVRadioButton value='aniso'>Anisotropy (ppm)</MVRadioButton>
                <MVRadioButton value='asymm'>Asymmetry</MVRadioButton>
             </MVRadioGroup>
             {/* <MVRadioGroup label='Use color scale' onSelect={(v) => { mvc.ms.setColorScale(v); }} selected={mvc.ms.colorScaleContent} name='ms_cscale_radio' noState> */}
             {/*    <MVRadioButton value='none'>None</MVRadioButton> */}
             {/*    <MVRadioButton value='iso'>Isotropy (ppm)</MVRadioButton> */}
             {/*    <MVRadioButton value='aniso'>Anisotropy (ppm)</MVRadioButton> */}
             {/*    <MVRadioButton value='asymm'>Asymmetry</MVRadioButton> */}
             {/* </MVRadioGroup> */}
          </div>): 
         <div className='mv-warning-noms'>No MS data found</div>}
    </MagresViewSidebar>);
}

export default MVSidebarMS;