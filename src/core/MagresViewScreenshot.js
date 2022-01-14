import './MagresViewScreenshot.css';

import { FaCamera } from 'react-icons/fa';
import useAppInterface from './store/interfaces/AppInterface';
import { saveImage } from '../utils';


function MagresViewScreenshot(props) {

    const appint = useAppInterface();

    function takeScreenshot() {
        let data = appint.viewer.getScreenshotData();
        saveImage(data, 'MagresViewScreenshot.png');
    }

    return (<div className='mv-sshot' onClick={takeScreenshot}>
        <FaCamera />
        <div className='mv-sshot-text'>
            Take a screenshot
        </div>
    </div>);
}

export default MagresViewScreenshot;