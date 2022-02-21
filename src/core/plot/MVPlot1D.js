import { Line } from '@nivo/line'

import MVModal from '../../controls/MVModal';
import { usePlotsInterface } from '../store';


function MVPlot1D(props) {

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


    const msmall = 20;
    const mlarge = 50;

    const image = pltint.bkgImage;

    let width = 400;
    let height = 300;

    if (image) {
        width = image.width;
        height = image.height;
    }

    function imgLayer() {

        if (image) {
            return (<g transform={'translate(-' + mlarge + ',-' + msmall + ')'}>
                <image href={image.url} />
            </g>);
        }

        return null;
    }

    return (<MVModal title="Spectral 1D plot" display={props.display}
        noFooter={true} resizable={true} draggable={true} onClose={() => { pltint.show = false; }}>
        <div style={{backgroundColor: 'white', color: 'black'}}>
        {props.display?
            <Line
            pointSize={15}
            width={width}
            height={height} 
            data={data}
            margin={{
                top: msmall,
                bottom: mlarge,
                right: msmall,
                left: mlarge
            }}
            xScale={{
                type: 'linear',
                min: 1
            }}
            yScale={{
                type: 'linear',
                max: 6
            }}
            isInteractive={true}
            onMouseMove={(e) => {console.log(e)}}
            pointLabelYOffset={12}
            layers={[imgLayer, 'grid', 'markers', 'axes', 'areas', 'crosshair', 
            'lines', 'points', 'slices', 'mesh', 'legends']}
            />           
        : null }
        </div>
    </MVModal>);
}

export default MVPlot1D;