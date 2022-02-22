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

    const data = [{
        id: 'Test',
        data: [
            {
                x: 1,
                y: 1
            },
            {
                x: 2,
                y: 4
            },
            {
                x: 3,
                y: 2
            }
        ]
    }];

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
            pointSize={15}
            width={width}
            height={height} 
            data={data}
            margin={state}
            xScale={{
                type: 'linear',
                min: 1
            }}
            yScale={{
                type: 'linear',
                max: 6
            }}
            pointLabelYOffset={12}
            layers={layers}
            />           
        : null }
        </div>
    </MVModal>);
}

export default MVPlot1D;