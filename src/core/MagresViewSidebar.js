import './MagresViewSidebar.css';
import { chainClasses } from '../utils';

function MagresViewSidebar(props) {
    return (<div className={chainClasses('mv-sidebar', props.show? 'open' : '')}>
        {props.title? <h2>{props.title}</h2> : null}
        {props.children}
    </div>);
}

export default MagresViewSidebar;