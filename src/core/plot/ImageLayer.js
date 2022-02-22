import './ImageLayer.css';

import { useState } from 'react';

import { chainClasses } from '../../utils';

// Size of the markers
const mW = 5;
const mH = 20;

// Click sensitivity radius
const mR2 = Math.pow((mW+mH)/2.0, 2);

function ImageLayer(props) {

    // The state is used to check which, if any, of the indicators is selected
    const [state, setState] = useState(-1);

    const margins = props.margins || {};
    const image = props.image || {};

    // Indicator positions
    const indPos = [
        [margins.left, image.height-margins.bottom],
        [margins.left, margins.top],
        [image.width - margins.right, image.height-margins.bottom]
    ];

    const setMargins = props.setMargins || (() => {});

    // Click detection
    function onClick(e) {

        let x = e.clientX;
        let y = e.clientY;
        let selind = -1;


        if (e.target.nodeName === 'image') {
            // If we clicked on the image, we can get the absolute position in
            // the image's frame
            const brect = e.target.getBoundingClientRect();
            x -= brect.left;
            y -= brect.top;            

            for (let i = 0; i < indPos.length; ++i) {
                let [iPx, iPy] = indPos[i];
                let r2 = Math.pow(x-iPx, 2.0) + Math.pow(y-iPy, 2.0);
                if (r2 <= mR2) {
                    selind = i;
                    break;
                }
            }
        }
        else if (e.target.nodeName === 'rect') {
            // We clicked on an indicator
            const cname = e.target.parentElement.className.baseVal.trim();
            // Which one?
            selind = ['img-margin-origin', 'img-margin-top', 'img-margin-right'].indexOf(cname);
            if (selind >= 0)
                [x, y] = indPos[selind];
            else {
                // Something weird has happened, ignore click
                return;
            }
        }

        if (state < 0) {
            // Nothing's selected; select
            setState(selind);
        }
        else {
            if (selind === -1) {
                // Can't overlap...
                switch(state) {
                    case 0:
                        // Origin
                        setMargins({
                            left: x,
                            bottom: image.height-y
                        });
                        break;
                    case 1:
                        // Top
                        setMargins({
                            top: y
                        });
                        break;
                    case 2:
                        // Right
                        setMargins({
                            right: image.width-x
                        });
                        break;
                    default:
                        break;
                }
            }
            setState(-1);
        }
    }


    return (<g className='img-layer' transform={'translate(-' + margins.left + ',-' + margins.top + ')'} onClick={onClick}>
        <image href={image.url} />
        <g className='img-layer-margins'>
            <g className={chainClasses('img-margin-origin', (state === 0? 'selected' : ''))} transform={'translate(' + indPos[0][0] + ',' + indPos[0][1] + ')'}>
                <rect x={-mW/2.0} y={-mH/2.0} width={mW} height={mH} />
                <rect x={-mH/2.0} y={-mW/2.0} width={mH} height={mW} />
            </g>
            <g className={chainClasses('img-margin-top', (state === 1? 'selected' : ''))} transform={'translate(' + indPos[1][0] + ',' + indPos[1][1] + ')'}>
                <rect x={-mW/2.0} y={0} width={mW} height={mH/1.5} />
                <rect x={-mH/2.0} y={-mW/2.0} width={mH} height={mW} />
            </g>
            <g className={chainClasses('img-margin-right', (state === 2? 'selected' : ''))} transform={'translate(' + indPos[2][0] + ',' + indPos[2][1] + ')'}>
                <rect x={-mW/2.0} y={-mH/2.0} width={mW} height={mH} />
                <rect x={-mH/1.5} y={-mW/2.0} width={mH/1.5} height={mW} />
            </g>
        </g>
    </g>)
}

export default ImageLayer;