import './MVIcon.css';

import { ReactComponent as MSIcon } from './ms.svg';
import { ReactComponent as EFGIcon } from './efg.svg';
import { ReactComponent as DipIcon } from './dip.svg';
import { ReactComponent as JcoupIcon } from './jcoup.svg';

const icons = {
    ms: MSIcon,
    efg: EFGIcon,
    dip: DipIcon,
    jcoup: JcoupIcon
};

function MVIcon(props) {

    const Icon = icons[props.icon];
    const color = (props.color || '#ffffff');

    return (
        <Icon className='mv-icon' style={{'--path-fill': color}} {...props}/>
        );
}

export default MVIcon;