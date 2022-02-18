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

import './MagresViewHeader.css';
import logo from '../icons/logo.svg';
import { FaSun, FaMoon, FaRegFolderOpen, FaMousePointer, FaFile, FaBan } from 'react-icons/fa';

import React from 'react';
import MVCustomSelect, { MVCustomSelectOption } from '../controls/MVCustomSelect';
import MVIcon from '../icons/MVIcon';
import { useAppInterface } from './store';

function ThemeSwitcher() {

    const appint = useAppInterface();

    const other = {
        dark: 'light',
        light: 'dark'
    };

    return (<div id='mv-themeswitch' onClick={() => { appint.theme = other[appint.theme]; }}>
        <div id='mv-themeicons' className={appint.theme}>
            <FaMoon id='mv-themedark'/>
            <FaSun id='mv-themelight'/>
        </div>
    </div>);
}

function MagresViewHeader() {

    const appint = useAppInterface();

    return (<header className='mv-header'>
        <div className='mv-header-left'>
            <img src={logo} alt='MagresView logo' id='mv-header-logo'></img>
            <h3 id='mv-header-title'>
                <span style={{color: 'var(--ms-color-2)'}}>M</span>agres<span style={{color: 'var(--efg-color-2)'}}>V</span>iew 2.0
            </h3>
        </div>
        <div className='mv-header-right'>
            <MVCustomSelect onSelect={(v) => { appint.sidebar = v; }} selected={appint.sidebar}>
                <MVCustomSelectOption value='load' icon={<FaRegFolderOpen />}>Load file</MVCustomSelectOption>
                <MVCustomSelectOption value='select' icon={<FaMousePointer />}>Select and display</MVCustomSelectOption>
                <MVCustomSelectOption value='ms' icon={<MVIcon icon='ms' color='var(--ms-color-3)'/>}>Magnetic Shielding</MVCustomSelectOption>
                <MVCustomSelectOption value='efg' icon={<MVIcon icon='efg' color='var(--efg-color-3)'/>}>Electric Field Gradient</MVCustomSelectOption>
                <MVCustomSelectOption value='dip' icon={<MVIcon icon='dip' color='var(--dip-color-3)'/>}>Dipolar Couplings</MVCustomSelectOption>
                <MVCustomSelectOption value='jcoup' icon={<MVIcon icon='jcoup' color='var(--jcoup-color-3)'/>}>J Couplings</MVCustomSelectOption>
                <MVCustomSelectOption value='euler' icon={<MVIcon icon='euler' color='var(--bkg-color-3)'/>}>Euler Angles</MVCustomSelectOption>
                <MVCustomSelectOption value='files' icon={<FaFile />}>Report files</MVCustomSelectOption>
                <MVCustomSelectOption value='none' icon={<FaBan />}>No sidebar</MVCustomSelectOption>
            </MVCustomSelect>            
            <span className='mv-hor-sep-3'></span>
            <ThemeSwitcher />
        </div>
    </header>);
}

export default MagresViewHeader;