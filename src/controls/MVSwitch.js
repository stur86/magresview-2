import './MVSwitch.css';
import { chainClasses } from '../utils';

function MVSwitch(props) {

    const style = {
        '--color-true': props.colorTrue || 'var(--ok-color-2)',
        '--color-false': props.colorFalse || 'var(--err-color-2)'
    };

    const onClick = props.onClick || (() => {});

    return (<div className={chainClasses('mv-control mv-switch', props.on? 'mv-switch-true' : 'mv-switch-false')} 
        style={style} onClick={onClick}>
        <div className='mv-switch-thumb'></div>
    </div>);
}

export default MVSwitch;