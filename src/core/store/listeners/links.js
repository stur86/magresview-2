import { addPrefix } from '../utils';

import { dipColor, jcColor } from './colors';
import { getLinkLabel } from '../utils';


function makeCalculateLinksListener(name) {

    // Factory for a function that will be used for both DIP and JCOUP with
    // minimal differences, with the goal of calculating which atoms are the
    // 'targets' to which we're drawing links to. Must precede a call to 
    // updateViews so that the ghosts get visualised or hidden as needed
    
    const pre_on = addPrefix(name, 'links_on');
    const pre_ca = addPrefix(name, 'central_atom');
    const pre_r = addPrefix(name, 'radius');
    const pre_homo = addPrefix(name, 'homonuclear');

    const pre_view = addPrefix(name, 'view');
    
    function listener(state) {

        let app = state.app_viewer;
        let model = app.model;

        if (!model) {
            // Can happen if we're running with an empty visualiser.
            return {};
        }

        let ghostreqs = {
            ...state.sel_ghosts_requests
        };

        // Targets?
        const on = state[pre_on];
        const catom = state[pre_ca];
        const r = state[pre_r];
        const hn = state[pre_homo];

        let linkview;

        if (on && catom) {

            let query = { sphere: [catom, r] };
            if (hn) {
                query = {
                    '$and': [
                        query,
                        { elements: [catom.element] }
                    ]
                };
            }


            linkview = model.find(query);
            ghostreqs[name] = linkview;
        }        
        else {
            linkview = model.view([]);
            // Cancel previous ghosts, if present
            delete(ghostreqs[name]);
        }

        return {
            [pre_view]: linkview,
            sel_ghosts_requests: ghostreqs
        };
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

    // These we keep inside this enclosed variable, as a way to keep track for
    // when we delete them
    let current_link_names = [];
    
    function listener(state) {

        let app = state.app_viewer;
        let linkview = state[pre_view];

        const catom = state[pre_ca];
        const radius = state[pre_r];
        const on = state[pre_on];
        const sphere = state[pre_sph];

        const model = app.model;


        if (!model) {
            // Nothing to do
            return {};
        }

        // First, cleaning up old visualisation
        current_link_names.forEach((name) => { model.removeGraphics(name); });

        // Now creating a new one
        current_link_names = [];
        if (on && catom && linkview) {
            linkview.atoms.forEach((a2, i) => {

                if (a2 === catom)
                    return;

                const lname = name + '_link_' + i;
                const label = getLinkLabel(catom, a2, name);

                if (label === '') {
                    // No coupling found
                    return;
                }

                model.addLink(catom, a2, lname, label, {
                    color: color,
                    dashed: true,
                    onOverlay: true
                });
                current_link_names.push(lname);
            });
        }

        // Now the sphere
        if (on && catom && sphere) {
            model.addSphere(catom.xyz, radius, name + '_sphere', {
                opacity: 0.25,
                showAxes: false,
                showCircles: true
            });
        }
        else {
            model.removeGraphics(name + '_sphere');
        }

        return {};
    }

    return listener;

}

const dipCalculateLinksListener = makeCalculateLinksListener('dip');
const dipDisplayLinksListener = makeDisplayLinksListener('dip', dipColor);

const jcCalculateLinksListener = makeCalculateLinksListener('jc');
const jcDisplayLinksListener = makeDisplayLinksListener('jc', jcColor);


export { dipCalculateLinksListener, dipDisplayLinksListener, 
         jcCalculateLinksListener, jcDisplayLinksListener };