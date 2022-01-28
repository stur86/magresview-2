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

import './MVSidebarFiles.css';

import MagresViewSidebar from './MagresViewSidebar';

import MVButton from '../../controls/MVButton';
import MVCustomSelect, { MVCustomSelectOption } from '../../controls/MVCustomSelect';
import MVIcon from '../../icons/MVIcon';

import { useFilesInterface } from '../store';
import { saveContents } from '../../utils';

const saveFile = (c, fn) => { saveContents('data:,' + c, fn); }

function MVSidebarFiles(props) {

    const fileint = useFilesInterface();

    return (<MagresViewSidebar title='Report files' show={props.show}>
        <div className='mv-sidebar-block'>
            <h3>File type:</h3>
            <MVCustomSelect selected={fileint.fileType} onSelect={(v) => { fileint.fileType = v; }}>
                <MVCustomSelectOption value='ms' icon={<MVIcon icon='ms' color='var(--ms-color-3)'/>}>MS table</MVCustomSelectOption>
                <MVCustomSelectOption value='efg' icon={<MVIcon icon='efg' color='var(--efg-color-3)'/>}>EFG table</MVCustomSelectOption>
            </MVCustomSelect>
            <MVButton onClick={() => { saveFile(fileint.generateFile(), fileint.fileName); }} disabled={!fileint.fileValid}>Save file</MVButton>
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarFiles;