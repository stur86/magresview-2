import { addPrefix } from '../utils';

import Events from './events';
import { dipColor } from './colors';
import { getLinkLabel } from '../utils';


function makeCalculateLinksListener(name) {

    // Factory for a function that will be used for both DIP and JCOUP with
    // minimal differences, with the goal of calculating which atoms are the
    // 'targets' to which we're drawing links to. Must precede a call to 
    // updateViews so that the ghosts get visualised or hidden as needed
    
    const pre_on = addPrefix(name, 'links_on');
    const pre_ca = addPrefix(name, 'central_atom');
    const pre_r = addPrefix(name, 'radius');

    const pre_view = addPrefix(name, 'view');
    
    function listener(state) {

        let app = state.app_viewer;
        let model = app.model;
        let ghostreqs = {
            ...state.sel_ghosts_requests
        };

        // Targets?
        const on = state[pre_on];
        const catom = state[pre_ca];
        const r = state[pre_r];

        let linkview;

        if (on && catom) {
            linkview = model.find({
                sphere: [catom, r]
            });
            ghostreqs[name] = linkview;
        }        
        else {
            linkview = model.view([]);
            // Cancel previous ghosts, if present
            delete(ghostreqs[name]);
        }

        return [{
            [pre_view]: linkview,
            sel_ghosts_requests: ghostreqs
        }, [ Events.VIEWS ]];
    }

    return listener;

}

function makeDisplayLinksListener(name, color) {

    // Factory for a function that will be used for both DIP and JCOUP with
    // minimal differences, with the goal of actually drawing the links  

    const pre_on = addPrefix(name, 'links_on');
    const pre_ca = addPrefix(name, 'central_atom');
    const pre_r = addPrefix(name, 'radius');
    const pre_sph = addPrefix(name, 'sphere_show');

    const pre_view = addPrefix(name, 'view');
    const pre_lnames = addPrefix(name, 'link_names');
    
    function listener(state) {

        let app = state.app_viewer;
        let linkview = state[pre_view];
        let lnames = state[pre_lnames];

        const catom = state[pre_ca];
        const radius = state[pre_r];
        const on = state[pre_on];
        const sphere = state[pre_sph];

        const model = app.model;

        if (!model) {
            // Nothing to do
            return [{}, []];
        }

        // First, cleaning up old visualisation
        lnames.forEach((name) => { model.removeGraphics(name); });

        // Now creating a new one
        lnames = [];
        if (on && catom && linkview) {
            linkview.atoms.forEach((a2, i) => {

                if (a2 === catom)
                    return;

                const lname = name + '_link_' + i;
                const label = getLinkLabel(catom, a2, name);
                model.addLink(catom, a2, lname, label, {
                    color: color,
                    dashed: true,
                    onOverlay: true
                });
                lnames.push(lname);
            });
        }

        // Now the sphere
        if (on && catom && sphere) {
            model.addSphere(catom.xyz, radius, name + '_sphere', {
                opacity: 0.1,
                showAxes: false,
                showCircles: false
            });
        }
        else {
            model.removeGraphics(name + '_sphere');
        }

        return [{
            [pre_lnames]: lnames
        }, []];
    }

    return listener;

}

const dipCalculateLinksListener = makeCalculateLinksListener('dip');
const dipDisplayLinksListener = makeDisplayLinksListener('dip', dipColor);

export { dipCalculateLinksListener, dipDisplayLinksListener };