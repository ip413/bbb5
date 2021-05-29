/**
 * n x m
 * i/n lines, j/m columns
 *
 */

const pipe = require('pipe-functions');
const fs = require('fs');

exports.calcDistanceToNearest = () => 'TODO';
// Data from input file or stdin
let rawInput;
const usageMsg = `
Usage:
cat sample/input1.txt | node ./src/index.js
node ./src/index.js sample/input1.txt
`;


main();

function main() {

    // If no STDIN and no arguments
    if (process.stdin.isTTY && process.argv.length <= 2) {
        process.stderr.write('Argument with file path, or stdin data required.');
        process.stdout.write(usageMsg);
        process.exit(1);
    }
    // If no STDIN but arguments given
    else if (process.stdin.isTTY && process.argv.length > 2) {
        handleInput('argument', process.argv[2]);
    }
    // read from STDIN
    else {
        let data = '';
        process.stdin.on('readable', () => {
            data += process.stdin.read() || '';
        });
        process.stdin.on('end', () => {
            handleInput('stdin', data);
        });
    }
}

function handleInput(type, data) {
    if(type === 'argument') {
        rawInput = fs.readFileSync(data, {encoding: 'utf-8'});
    }

    if(type === 'stdin') {
        rawInput = data;
    }

    console.log('input', rawInput);
}


exports.getNearestWhitePixel = (pixel, pixelsList) => {
    const distanceList = [];
    const lastSmallestDistance = {distance: undefined, position: undefined};

    // calculating distance for each pixel
    pixelsList.forEach(toPixel => {
        if(toPixel.v === 1) {
            const distance = this.calcDistanceBetween(pixel, toPixel);
            distanceList.push(distance);
        } else {
            distanceList.push(-1);
        }
    });

    // finding smallest distance
    distanceList.forEach((distance, i) => {
        if (lastSmallestDistance.distance === undefined && distance > -1) {
            lastSmallestDistance.distance = distance;
            lastSmallestDistance.position = i;
            return;
        }

        if (lastSmallestDistance.distance !== undefined && distance < lastSmallestDistance.distance && distance > -1) {
            lastSmallestDistance.distance = distance;
            lastSmallestDistance.position = i;
        }


    });

    const targetPixel = pixelsList[lastSmallestDistance.position];
    return this.getPixel(targetPixel.i, targetPixel.j, lastSmallestDistance.distance);
}

exports.getListOfNearestPixels = (pixelsList) => {
    const nearestPixelsList = [];

    pixelsList.forEach(pixel => {
        // console.log(pixel)
        nearestPixelsList.push({origin: pixel, nearestPixel: this.getNearestWhitePixel(pixel, pixelsList)});
        console.log(nearestPixelsList);
    })

    return nearestPixelsList.map(v => {
        return {i: v.origin.i, j: v.origin.j, v: v.nearestPixel.v}
    })
}

exports.pixelsListToString = (pixelsList) => {
    // console.log()
    let string = '';

    pixelsList.map((v, index) => {
        string += v.v

        if (pixelsList[index + 1] && v.i < pixelsList[index + 1].i) {
            string += '\n';
        }

    });

    return string;
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

exports.bitmapStringToPixelsList = (bitmapString) => {
    return pipe(bitmapString, this.stringToBitmap, this.bitmapToPixelsList);
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