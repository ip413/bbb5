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
 * @example
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
 * @example
 * in:
 *  [
 *    [1, 0],
 *    [0, 1]
 *  ]
 *
 * out:
 * [
 *    { i: 1, j: 1, v: 1},
 *    { i: 1, j: 2, v: 0},
 *    { i: 2, j: 1, v: 0},
 *    { i: 2, j: 2, v: 1}
 * ]
 */
exports.bitmapToPixelsList = (bitmap) => {
    const list = [];
    for (let i = 0; i < bitmap.length; i++) {
        for (let j = 0; j < bitmap[0].length; j++) {
            list.push(this.getPixel(i+1, j+1, bitmap[i][j]))
        }
    }

    return list;
}

/**
 * |i1-i2|+|j1-j2|p
 * @param {*} pixel1
 * @param {*} pixel2
 */
exports.calcDistanceBetween = (pixel1, pixel2) => {
    return Math.abs(pixel1.i - pixel2.i) + Math.abs(pixel1.j - pixel2.j);
}

exports.getPixel = (i, j, v = 0) => {
    return {i, j, v}
}