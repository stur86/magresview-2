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
 * Copy something to the clipboard
 * 
 * @param  {String} data Content to copy
 */
function copyContents(data) {
    navigator.clipboard.writeText(data);
}


export { CallbackMerger, Enum, getColorScale, mergeOnly, saveContents, 
         saveImage, copyContents };