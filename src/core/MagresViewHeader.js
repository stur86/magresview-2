import './MagresViewHeader.css';
import logo from '../icons/logo.svg';
import { FaSun, FaMoon, FaRegFolderOpen } from 'react-icons/fa';

import React, { useContext } from 'react';
import  MagresViewContext from './MagresViewContext';
import MVCustomSelect from '../controls/MVCustomSelect';
import { MVCustomSelectOption } from '../controls/MVCustomSelect';
import MVIcon from '../icons/MVIcon';

function ThemeSwitcher() {

    var mvc = useContext(MagresViewContext);

    console.log('[ThemeSwitcher]: ', mvc);

    const other = {
        dark: 'light',
        light: 'dark'
    };

    return (<div id='mv-themeswitch' onClick={() => {console.log(mvc); mvc.setProperty('theme', other[mvc.theme]); }}>
        <div id='mv-themeicons' className={mvc.theme}>
            <FaMoon id='mv-themedark'/>
            <FaSun id='mv-themelight'/>
        </div>
    </div>);
}

function MagresViewHeader() {

    let mvc = useContext(MagresViewContext);

    console.log('[MagresViewHeader]: ', mvc);

    function switchPanel(v) {
        console.log(v, mvc);
        mvc.setProperty('panel', v);
    }

    return (<header className='mv-header'>
        <div className='mv-header-left'>
            <img src={logo} alt='MagresView logo' id='mv-header-logo'></img>
            <h3 id='mv-header-title'>
                <span style={{color: 'var(--ms-color-2)'}}>M</span>agres<span style={{color: 'var(--efg-color-2)'}}>V</span>iew 2.0
            </h3>
        </div>
        <div className='mv-header-right'>
            <MVCustomSelect onSelect={switchPanel}>
                <MVCustomSelectOption value='load' icon={<FaRegFolderOpen />}>Load file</MVCustomSelectOption>
                <MVCustomSelectOption value='ms' icon={<MVIcon icon='ms' color='var(--ms-color-3)'/>}>Magnetic Shielding</MVCustomSelectOption>
                <MVCustomSelectOption value='efg' icon={<MVIcon icon='efg' color='var(--efg-color-3)'/>}>Electric Field Gradient</MVCustomSelectOption>
                <MVCustomSelectOption value='dip' icon={<MVIcon icon='dip' color='var(--dip-color-3)'/>}>Dipolar Couplings</MVCustomSelectOption>
                <MVCustomSelectOption value='jcoup' icon={<MVIcon icon='jcoup' color='var(--jcoup-color-3)'/>}>J Couplings</MVCustomSelectOption>
            </MVCustomSelect>            
            <span className='mv-hor-sep-3'></span>
            <ThemeSwitcher />
        </div>
    </header>);
}

export default MagresViewHeader;