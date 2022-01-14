import './MVSidebarDip.css';

import MagresViewSidebar from './MagresViewSidebar';

import React, { useEffect, useRef } from 'react';

import MVCheckBox from '../../controls/MVCheckBox';
import MVRange from '../../controls/MVRange';
import { useDipInterface } from '../store';


function MVSidebarDip(props) {

    const dipint = useDipInterface();

    console.log('[MVSidebarDip rendered]');

    const intRef = useRef();
    intRef.current = dipint;

    useEffect(() => {
        let dipint = intRef.current;

        // Only keep events bound when this sidebar is visible!
        if (props.show && dipint.isOn) {
            dipint.bind();
        }
        else {
            dipint.unbind();
        }

    }, [props.show, dipint.isOn]);

    return (<MagresViewSidebar show={props.show} title='Dipolar couplings'>
        <div className='mv-sidebar-block'>
            <MVCheckBox color='var(--dip-color-3)' onCheck={(v) => { dipint.isOn = v; }} checked={ dipint.isOn } >Show dipolar couplings</MVCheckBox>
        </div>
        <div className='mv-sidebar-block'>
            <p>
                Click on an atom to show all dipolar couplings in a radius.
                (Note: to avoid performance issues, changing the radius of selection has effect only from the next click)
            </p>
             <MVRange min={1.0} max={20.0} step={0.05} value={dipint.radius} color={'var(--dip-color-3)'}
                      onChange={(s) => { dipint.radius = s; }}>Selection radius</MVRange>
             <MVCheckBox color='var(--dip-color-3)' onCheck={(v) => { dipint.showSphere = v; }} checked={ dipint.showSphere } >Show radius as a sphere</MVCheckBox>                        
             <MVCheckBox color='var(--dip-color-3)' onCheck={(v) => { dipint.homonuclearOnly = v; }} checked={ dipint.homonuclearOnly } >Show only homonuclear couplings</MVCheckBox>                        
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarDip;