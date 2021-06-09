import './MVCustomSelect.css';
import _ from 'lodash';
import { useState, cloneElement } from 'react';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MVCustomSelectOption(props) {

    const onClick = props.onClick || (() => {});

    return (
        <div className='mv-control mv-cselect-opt' onClick={onClick}>{props.children}</div>
    );
}

function MVCustomSelect(props) {

    const [ state, setState ] = useState({
        index: 0,
        showdrop: false
    });

    // Gather the options
    var options = _.filter(props.children, (c, i) => {
        return (c.type.name === 'MVCustomSelectOption');
    });

    // Translation?
    var tstyle = {
        transform: 'translateY(calc(var(--cselect-opt-height)*' + options.length/2.0 + '))'
    };

    function setIndex(i) {
        setState({
            index: i, 
            showdrop: false
        });
    }

    return (
        <div style={tstyle} className='mv-control mv-cselect' onMouseLeave={() => { setState({...state, showdrop: false})}}>
            <div className='mv-control mv-cselect-main' onClick={() => { setState({...state, showdrop: true})}}>
                {options[state.index]}
                <span className='mv-cselect-main-caret'><FontAwesomeIcon icon={faCaretDown}/></span>
            </div>
            <div className='mv-control mv-cselect-ddown' style={{visibility: (state.showdrop? 'visible' : 'hidden')}}>
                {options.map((o, i) => {
                    return cloneElement(o, {onClick: () => { setIndex(i)}});
                })}
            </div>
        </div>   
    );
}

export { MVCustomSelectOption };
export default MVCustomSelect;