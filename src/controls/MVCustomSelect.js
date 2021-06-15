import './MVCustomSelect.css';
import _ from 'lodash';
import { useState, cloneElement, useEffect } from 'react';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MVIcon from '../icons/MVIcon';

function MVCustomSelectOption(props) {

    const onClick = props.onClick || (() => {});
    const ic = props.iconColor || '#ffffff';

    return (
        <div className='mv-control mv-cselect-opt' onClick={onClick}>
            {props.icon? <MVIcon icon={props.icon} color={ic}/> : <span></span>}
            {props.children}
        </div>
    );
}

function MVCustomSelect(props) {

    const [ state, setState ] = useState({
        index: 0,
        showdrop: false
    });

    const onSelect = props.onSelect || (() => {});    

    // Gather the options
    var options = _.filter(props.children, (c, i) => {
        return (c.type.name === 'MVCustomSelectOption');
    });
    const values = options.map((o) => (o.props.value));

    // Translation?
    var tstyle = {
        transform: 'translateY(calc(var(--cselect-opt-height)*' + options.length/2.0 + '))'
    };

    function setIndex(i) {
        setState({
            index: i, 
            showdrop: false
        });
        onSelect(values[i]);
    }

    // On creation, select first element
    useEffect(() => {
        onSelect(values[state.index]);
    });

    return (
        <div style={tstyle} className='mv-control mv-cselect' onMouseLeave={() => { setState({...state, showdrop: false})}}>
            <div className='mv-control mv-cselect-main' onClick={() => { setState({...state, showdrop: true})}}>
                {options[state.index]}
                <span className='mv-cselect-main-caret'><FontAwesomeIcon icon={faCaretDown}/></span>
            </div>
            <div className='mv-control mv-cselect-ddown' style={{visibility: (state.showdrop? 'visible' : 'hidden')}}>
                {options.map((o, i) => {
                    return cloneElement(o, {key: i, onClick: () => { setIndex(i)}});
                })}
            </div>
        </div>   
    );
}

export { MVCustomSelectOption };
export default MVCustomSelect;