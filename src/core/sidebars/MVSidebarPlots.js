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

import MVButton from '../../controls/MVButton';
import MVModal from '../../controls/MVModal';


import { usePlotsInterface } from '../store';

function MVSidebarPlots(props) {

    const pltint = usePlotsInterface();

    return (<MagresViewSidebar show={props.show} title="Spectral plots">
        
        <div className='mv-sidebar-block'>
            <MVButton onClick={() => { pltint.show = true; }}>Show 1D plot</MVButton>
        </div>

        <MVModal title="Spectral 1D plot" display={pltint.show}>
            Thing
        </MVModal>        
    </MagresViewSidebar>);
}

export default MVSidebarPlots;
