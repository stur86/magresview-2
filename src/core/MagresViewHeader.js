import './MagresViewHeader.css';
import logo from '../icons/logo.svg';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useContext } from 'react';
import  MagresViewContext from './MagresViewContext';
import MVCustomSelect from '../controls/MVCustomSelect';
import { MVCustomSelectOption } from '../controls/MVCustomSelect';
import MVIcon from '../icons/MVIcon';

function ThemeSwitcher() {

    var mvc = useContext(MagresViewContext);

    const other = {
        dark: 'light',
        light: 'dark'
    };

    return (<div id='mv-themeswitch' onClick={() => { mvc.setProperty('theme', other[mvc.theme]); }}>
        <div id='mv-themeicons' className={mvc.theme}>
            <FaMoon id='mv-themedark'/>
            <FaSun id='mv-themelight'/>
        </div>
    </div>);
}

function MagresViewHeader() {
    var mvc = useContext(MagresViewContext);

    return (<header className='mv-header'>
        <div className='mv-header-left'>
            <img src={logo} alt='MagresView logo' id='mv-header-logo'></img>
            <h3 id='mv-header-title'>
                <span style={{color: 'var(--ms-color-2)'}}>M</span>agres<span style={{color: 'var(--efg-color-2)'}}>V</span>iew 2.0
            </h3>
        </div>
        <div className='mv-header-right'>
            <MVCustomSelect onSelect={(v) => {mvc.setProperty('panel', v)}}>
                <MVCustomSelectOption value='ms' icon={<MVIcon icon='ms' color='var(--ms-color-3)'/>}>Magnetic Shielding</MVCustomSelectOption>
                <MVCustomSelectOption value='efg' icon={<MVIcon icon='efg' color='var(--efg-color-3)'/>}>Electric Field Gradient</MVCustomSelectOption>
                <MVCustomSelectOption value='dip' icon={<MVIcon icon='dip' color='var(--dip-color-3)'/>}>Dipolar Couplings</MVCustomSelectOption>
                <MVCustomSelectOption value='jcoup' icon={<MVIcon icon='jcoup' color='var(--jcoup-color-3)'/>}>J Couplings</MVCustomSelectOption>
            </MVCustomSelect>
            <span style={{marginRight: '50px'}}></span>
            <ThemeSwitcher />
        </div>
    </header>);
}

export default MagresViewHeader;