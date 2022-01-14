import './MVSidebarEuler.css';

import { useRef, useEffect } from 'react';

import MagresViewSidebar from './MagresViewSidebar';
import { useEulerInterface } from '../store';

import MVSwitch from '../../controls/MVSwitch';

function MVSidebarEuler(props) {

    const eulint = useEulerInterface();

    console.log('[MVSidebarEuler rendered]');

    const intRef = useRef();
    intRef.current = eulint;

    useEffect(() => {
        let eulint = intRef.current;

        // Only keep events bound when this sidebar is visible!
        if (props.show) {
            eulint.bind();
        }
        else {
            eulint.unbind();
        }

    }, [props.show]);

    const otherTensor = {
        ms: 'efg',
        efg: 'ms'
    };

    return (<MagresViewSidebar show={props.show} title='Euler angles'>
        <p>
            Left (right) click on atoms to pick atom A (B). Choose with the 
            switches below which NMR tensor you care about for each, and
            the Euler angles between them will be automatically printed out.
        </p>
        <div className='mv-sidebar-block'>
            <h3>Atom A</h3>
            <div className='mv-euler-agrid'>
                <span className='bold'>Label:</span>
                <span>{eulint.atomLabelA}</span>
                <div className='mv-euler-agrid-switch'>
                    <span>MS</span>
                    <MVSwitch on={ eulint.tensorA === 'efg' } onClick={() => { eulint.tensorA = otherTensor[eulint.tensorA]; }} 
                              colorFalse='var(--ms-color-2)' colorTrue='var(--efg-color-2)'/>
                    <span>EFG</span>
                </div>
            </div>
        </div>
        <div className='mv-sidebar-block'>
            <h3>Atom B</h3>
            <div className='mv-euler-agrid'>
                <span className='bold'>Label:</span>
                <span>{eulint.atomLabelB}</span>
                <div className='mv-euler-agrid-switch'>
                    <span>MS</span>
                    <MVSwitch on={ eulint.tensorB === 'efg' } onClick={() => { eulint.tensorB = otherTensor[eulint.tensorB]; }} 
                              colorFalse='var(--ms-color-2)' colorTrue='var(--efg-color-2)'/>
                    <span>EFG</span>
                </div>
            </div>
        </div>
    </MagresViewSidebar>);
}

export default MVSidebarEuler;