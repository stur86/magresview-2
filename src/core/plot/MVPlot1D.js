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

    let width = 400;
    let height = 300;

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

    return (<MVModal title="Spectral 1D plot" display={pltint.show}
        noFooter={true} resizable={true} draggable={true} onClose={() => { pltint.show = false; }}>
        <div style={{backgroundColor: 'white', color: 'black'}}>
        {pltint.show?
            <Line
            enablePoints={false}
            width={width}
            height={height} 
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