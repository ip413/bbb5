/**
 * n x m
 * i lines, j columns
 * @returns
 */

exports.calcDistanceToNearest = () => 'TODO';

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