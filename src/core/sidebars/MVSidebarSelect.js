import MagresViewSidebar from './MagresViewSidebar';
import { MVStoreContext } from '../store';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRadioButton, { MVRadioGroup } from '../../controls/MVRadioButton';

import React, { useContext } from 'react';

function MVSidebarSelect(props) {

    const mvc = useContext(MVStoreContext);

    return (<MagresViewSidebar show={props.show} title='Select and display'>
        <p>
            <MVCheckBox checked={mvc.select.highlighted} onCheck={(v) => { mvc.select.highlighted = v }}>Highlight selected</MVCheckBox>        

            <MVRadioGroup label='Selection mode' onSelect={console.log} name='selec_mode_radio'>
                <MVRadioButton value='element'>Element</MVRadioButton>
                <MVRadioButton value='sphere'>Sphere</MVRadioButton>
                <MVRadioButton value='molecule'>Molecule</MVRadioButton>
                <MVRadioButton value='bonds'>Bonds</MVRadioButton>
                <MVRadioButton value='custom'>Custom</MVRadioButton>
            </MVRadioGroup>
        </p>
    </MagresViewSidebar>);
}

export default MVSidebarSelect;