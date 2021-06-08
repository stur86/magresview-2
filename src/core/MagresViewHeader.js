import './MagresViewHeader.css';
import logo from '../logo.svg';
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useContext } from 'react';
import  MagresViewContext from './MagresViewContext';

function ThemeSwitcher() {

    var mvc = useContext(MagresViewContext);

    const icons = {
        dark: faMoon,
        light: faSun
    };

    const other = {
        dark: 'light',
        light: 'dark'
    };

    return (<div id='mv-themeswitch'>
        <FontAwesomeIcon icon={icons[mvc.theme]} onClick={() => { mvc.setProperty('theme', other[mvc.theme]); }}/>
    </div>);
}

function MagresViewHeader() {
    return (<header className='mv-header'>
        <div className='mv-header-left'>
            <img src={logo} alt='MagresView logo' id='mv-header-logo'></img>
            <h3 id='mv-header-title'>
                <span style={{color: 'var(--ms-color-2)'}}>M</span>agres<span style={{color: 'var(--efg-color-2)'}}>V</span>iew 2.0
            </h3>
        </div>
        <div className='mv-header-right'>
            <ThemeSwitcher />
        </div>
    </header>);
}

export default MagresViewHeader;