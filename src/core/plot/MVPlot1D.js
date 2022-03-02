import _ from 'lodash';

import { Line } from '@nivo/line'

import { useState } from 'react';

import MVModal from '../../controls/MVModal';
import { usePlotsInterface } from '../store';

import ImageLayer from './ImageLayer';

function MVPlot1D(props) {

    // State used for margins
    const [state, setState] = useState({
        top: 20,
        left: 50,
        right: 20,
        bottom: 50
    });

    const pltint = usePlotsInterface();

    const image = pltint.bkgImage;

    let width = 640;
    let height = 480;

    if (image) {
        width = image.width;
        height = image.height;
    }

    function setMargins(data={}) {
        setState({
            ...state,
            ...data
        });
    }

    function imgLayer() {

        if (image) {
            return <ImageLayer image={image} margins={state} setMargins={setMargins} />
        }

        return null;
    }

    let layers = [imgLayer, 'grid', 'markers', 'axes', 'areas', 'crosshair', 
                  'lines', 'points', 'slices', 'mesh', 'legends'];

    if (!pltint.showGrid)
        layers = _.without(layers, 'grid');
 
    if (!pltint.showAxes)
        layers = _.without(layers, 'axes');

    const show = (pltint.mode !== 'none');

    let lineprops = {};
    // Custom mode-dependent properties
    switch (pltint.mode) {
        case 'line-1d':
            lineprops = {
                enablePoints: false                
            }
            break;
        case 'bars-1d':
            lineprops = {
                pointSymbol: ((p) => {
                    return (<rect width={p.size} height={height-(state.top+state.bottom)} color={p.borderColor} 
                                  fill={p.color} strokeWidth={p.borderWidth}></rect>);
                }),
                pointLabelYOffset: 0,
                lineWidth: 0
            };
            break;
        default: 
            break;
    }

    return (<MVModal title="Spectral 1D plot" display={show}
        noFooter={true} resizable={true} draggable={true} onClose={() => { pltint.mode = 'none'; }}>
        <div style={{backgroundColor: 'white', color: 'black'}}>
        {show?
            <Line
            {...lineprops}
            width={width}
            height={height} 
            colors={{ scheme: 'category10' }}
            data={pltint.data}
            margin={state}
            xScale={{
                type: 'linear',
                min: pltint.floatRangeX[0],
                max: pltint.floatRangeX[1]
            }}
            yScale={{
                type: 'linear',
                min: pltint.floatRangeY[0],
                max: pltint.floatRangeY[1]
            }}
            layers={layers}
            />           
        : null }
        </div>
    </MVModal>);
}

export default MVPlot1D;