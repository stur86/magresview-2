function displayListener(state) {

    const app = state.app_viewer;
    const toDisplay = state.app_model_queued;

    let data = {};

    if (app && toDisplay) {
        app.displayModel(toDisplay);
        data = {
            app_default_displayed: app.displayed,
            app_model_queued: null
        };
    }

    return data;
}

export { displayListener };