/**
 * n x m
 * i/n lines, j/m columns
 *
 */

exports.calcDistanceToNearest = () => 'TODO';


exports.getNearestWhitePixel = (pixel, bitmap) => {

}

/**
 * Changes string (input) representation of bitmap to array of arrays
 *
 * in:
 * 01
 * 10
 *
 * out:
 * [
 *   [0, 1]
 *   [1. 0]
 * ]
 */
exports.stringToBitmap = (bitmapString) => {
    const bitmap = [];
    const splitBitmapString = bitmapString.split(/\n/);

    splitBitmapString.forEach(row => {
        bitmap.push(row.split('').map(v => parseInt(v)))
    });
    return bitmap;
}

/**
 * |i1-i2|+|j1-j2|p
 * @param {*} pixel1
 * @param {*} pixel2
 */
exports.calcDistanceBetween = (pixel1, pixel2) => {
    return Math.abs(pixel1.i - pixel2.i) + Math.abs(pixel1.j - pixel2.j);
}

exports.getPixel = (i, j) => {
    return {i, j}
}