import Events from './events';

function viewsListener(state) {

    let app = state.app_viewer;

    // Aliases
    let sel = state.sel_selected_view;
    let displ = state.sel_displayed_view? state.sel_displayed_view : state.app_default_displayed;

    // Assign new selection
    if (sel !== app.selected)
        app.selected = sel;
    if (displ !== app.displayed)
        app.displayed = displ;

    // We now update all visualizations that may be changed as a result of this
    return  [{}, 
                [Events.SEL_LABELS, Events.CSCALE,
                 Events.MS_ELLIPSOIDS, Events.MS_LABELS, 
                 Events.EFG_ELLIPSOIDS, Events.EFG_LABELS]
            ];
}

export { viewsListener };