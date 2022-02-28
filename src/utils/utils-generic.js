import _ from 'lodash';
import colormap from 'colormap';
import ColorScale from 'color-scales';

/*
 * Merges together all the outputs of multiple async processes into a single
 * argument to pass to a callback, according the outputs are in Object form.
 */
class CallbackMerger {
    
    constructor(n, callback) {
        this._callback = callback;
        this._n = n;

        this._arg = {};
    }

    call(arg) {
        
        if (this._n <= 0) {
            throw Error('CallbackMerger has completed its iterations');
        }

        _.merge(this._arg, arg);
        this._n -= 1;
        if (this._n === 0) {
            this._callback(this._arg);
        }
    }
}

/**
 * A custom class that acts like an Enum type
 */
class Enum {

    constructor(values={}) {

        if (Array.isArray(values)) {
            values = _.fromPairs(values.map((x, i) => [x, i]));
        }

        for (let key in values) {
            let v = values[key];

            Object.defineProperty(this, key, {
                get: () => v
            });
        }
    }

}

/**
 * Average atom position for a ModelView
 * 
 * @param  {ModelView} mview    ModelView to compute the average position for
 * 
 * @return {float[]}            Average position
 */
function averagePosition(mview) {

    const positions = mview.map((a) => a.xyz);
    let average = positions.reduce((x, s) => x.map((v, i) => v+s[i]), 
                                   [0, 0, 0]);
    average = average.map((x) => x/positions.length);

    return average;
}


/**
 * Center the camera on the displayed atoms (with a custom shift)
 * 
 * @param  {CrystVis} app   Reference to the visualizer app
 */
function centerDisplayed(app) {
    const pos = averagePosition(app.displayed);
    app.centerCamera(pos, [-0.05, 0]);
}

/**
 * Return a color scale with a specified map and number of intermediate
 * shades
 * 
 * @param  {Number} min    Smallest value of the range mapping to the color scale
 * @param  {Number} max    Largest value of the range
 * @param  {String} scale  Name of the scale (from package colormap; default is 'jet')
 * @param  {Number} shades Number of shades
 * 
 * @return {ColorScale}    Color scale
 */
function getColorScale(min=0, max=1, scale='jet', shades=10) {
    
    let colors = colormap({
        colormap: scale,
        nshades: shades,
        format: 'hex',
        alpha: 1
    });

    // If min and max are equal we get an error so fix that
    max = (max === min)? max+1e-8 : max;

    let cscale = new ColorScale(min, max, colors, 1.0);

    return cscale;
}

/**
 * Merge the values from an object into another, but without creating
 * new values if they were absent to begin with.
 * 
 * @param  {Object} a The object to update
 * @param  {Object} b The object containing the updated values
 * 
 * @return {Object}   The updated object
 */
function mergeOnly(a, b) {

    let c = {};

    for (let k in a) {
        c[k] = (k in b)? b[k] : a[k];
    }

    return c;
}

/**
 * Make a single row of an ASCII table with a fixed field width
 * 
 * @param  {Array}  values      Values to include in the row
 * @param  {Number} width       Width of each field of the row
 * @param  {Number} precision   Digits used for numerical values
 * 
 * @return {String}        Compiled row
 */
function tableRow(values, width=20, precision=5) {
    return values.reduce((s, v) => {        
        if (Number.isFinite(v) && !Number.isInteger(v)) {
            v = v.toFixed(precision);
        }
        else {
            v = v.toString();
        }
        const ns = width-v.length;
        return s + ' '.repeat(ns > 0? ns : 0) + v;
    }, '') + '\n';
}

/**
 * Download a file
 * 
 * @param  {String} data     The data content of the file, must be a valid data URL
 * @param  {[type]} filename The name of the file to download
 */
function saveContents(data, filename) {

    const download = document.createElement('a');
    download.setAttribute('download', filename);
    download.setAttribute('href', data);
    download.click();
}

/**
 * Download a PNG screenshot from data take from a Canvas
 * 
 * @param  {String} data     Data URL retrieved with the .toDataURL() method
 * @param  {[type]} filename Filename to save
 */
function saveImage(data, filename='image.png') {
    data = data.replace('image/png', 'image/octet-stream');
    saveContents(data, filename);
}

/**
 * Load an image from a file, return a promise
 * 
 * @param  {File}   file    File with the image to load
 * 
 * @return {Promise}        Promise that gets fulfilled once the image is loaded; resolves with an HTMLImageElement containing the image
 */
function loadImage(file) {

    let reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = ((e) => { 
            // Make it into a data URL
            var img = new Image();
            img.src = e.target.result;
            img.decode().then(() => {
                resolve(img);
            });
        });
        reader.readAsDataURL(file);
    });
}

/**
 * Copy something to the clipboard
 * 
 * @param  {String} data Content to copy
 */
function copyContents(data) {
    navigator.clipboard.writeText(data);
}


export { CallbackMerger, Enum, getColorScale, mergeOnly, 
         saveContents, averagePosition, centerDisplayed,
         saveImage, loadImage, saveContents, copyContents, tableRow };
