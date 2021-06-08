import './MagresViewSidebar.css';
import { chainClasses } from '../utils';

function MagresViewSidebar(props) {
    return (<div className={chainClasses('mv-sidebar', props.show? 'open' : '')}>
    </div>);
}

export default MagresViewSidebar;