/** 
 * Listener for when cell/axes visibility is changed
 */

function cellListener(state) {
    const app = state.app_viewer;

    if (app) { 
        const model = app.model;
        if (model) {
            console.log(model);
            model.box.visible = state.sel_show_cell;
            model.axes.visible = state.sel_show_cell;
        }
    }

    return {};
}

export { cellListener };