
const pipe = require('pipe-functions');
const fs = require('fs');

const RUNNING_AS_SCRIPT = require.main === module;
const OUTPUT_TO_FILE = true;
const usageMsg = `
Usage:
cat sample/input1.txt | node ./src/index.js
node ./src/index.js sample/input1.txt
`;

/**
 * @example
 * in:
 * 'argument',
 * 'sample/input-02.txt'
 *
 * out:
 * 3 2 1 0
 * 2 1 0 0
 * 1 0 0 1
 *
 * 3 2 1
 * 2 1 0
 * 1 0 0
 * 2 1 1
 * [...]
 */
exports.processInputData = (type, data) => {
    let rawInput;
    if(type === 'argument') {
        rawInput = fs.readFileSync(data, {encoding: 'utf-8'});
    }

    if(type === 'stdin') {
        rawInput = data;
    }

    const output = exports.batchBitmapStringToOutputString(...splitRawInputToCases(rawInput));

    if (RUNNING_AS_SCRIPT) {
        if(OUTPUT_TO_FILE) {
            fs.writeFileSync(`./output/${Date.now()}.txt`, output);
        }
        process.stdout.write(output + '\n');
    }
    return output;
}


exports.batchBitmapStringToOutputString = (...rest) => {
    let output = '';
    rest.forEach((bitmapString, index) => {
        const bitmapsSeparator = index === rest.length - 1 ? '' : '\n\n';
        output += this.bitmapStringToOutputString(bitmapString) + bitmapsSeparator;
    })
    return output;
}

/**
 * @example
 * in:
 * '0001\n0011\n0110'
 *
 * out:
 * '3210\n2100\n1001'
 */
exports.bitmapStringToOutputString = (bitmapString) => {
    return pipe(bitmapString,
        this.bitmapStringToPixelsList,
        this.getListOfNearestPixels,
        this.pixelsListToString);
}

/**
 * @example
 * in:
 * { i: 1, j: 2, v: 0 },
 * [
 *   { i: 1, j: 1, v: 1 },
 *   { i: 1, j: 2, v: 0 },
 *   { i: 2, j: 1, v: 0 },
 *   { i: 2, j: 2, v: 0 },
 *   { i: 3, j: 1, v: 0 },
 *   { i: 3, j: 2, v: 1 }
 * ]
 *
 * out:
 * { i: 1, j: 1, v: 1 }
 */
exports.getNearestWhitePixel = (pixel, pixelsList) => {
    // pixel itself is white, so distance is 0
    if(pixel.v === 1) {
        return this.getPixel(pixel.i, pixel.j, 0);
    }

    // if closest neighbors have some white pixels,
    // we don't need to check whole bitmap
    // double sqrt seems to works best on random data
    const neighborsCircleSize = Math.sqrt(Math.sqrt(pixelsList.length));
    const neighbors = pixelsList.filter(toPixel => {
        if (Math.abs(toPixel.i - pixel.i) < neighborsCircleSize &&
            Math.abs(toPixel.j - pixel.j) < neighborsCircleSize) {
                return true;
            }
    });
    const foundInNeighbors = iterateAllPixels(pixel, neighbors);
    if (foundInNeighbors) {
        return foundInNeighbors;
    }

    // check whole bitmap
    return iterateAllPixels(pixel, pixelsList)
}

/**
 * @example
 * in:
 * [
 *   { i: 1, j: 1, v: 0 },
 *   { i: 1, j: 2, v: 0 },
 *   { i: 2, j: 1, v: 0 },
 *   { i: 2, j: 2, v: 1 }
 * ]
 *
 * out:
 * [
 *   { i: 1, j: 1, v: 2 },
 *   { i: 1, j: 2, v: 1 },
 *   { i: 2, j: 1, v: 1 },
 *   { i: 2, j: 2, v: 0 }
 * ]
 */
exports.getListOfNearestPixels = (pixelsList) => {
    const nearestPixelsList = [];

    pixelsList.forEach(pixel => {
        nearestPixelsList.push({origin: pixel, nearestPixel: this.getNearestWhitePixel(pixel, pixelsList)});
    })

    return nearestPixelsList.map(v => {
        return {i: v.origin.i, j: v.origin.j, v: v.nearestPixel.v}
    })
}

/**
 *
 * @example
 * in:
 *  [
 *   { i: 1, j: 1, v: 2 },
 *   { i: 1, j: 2, v: 1 },
 *   { i: 2, j: 1, v: 1 },
 *   { i: 2, j: 2, v: 0 }
 * ]
 * out:
 *  "21\n10"
 */
exports.pixelsListToString = (pixelsList) => {
    let string = '';

    pixelsList.map((v, index) => {
        string += v.v + ' ';

        if (pixelsList[index + 1] && v.i < pixelsList[index + 1].i) {
            string = string.trim() + '\n';
        }
    });

    return string.trim();
}

/**
 * @example
 * in:
 * "01\n10"
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
 * @example
 * in:
 * 3, 3, 1
 *
 * out:
 * {i: 3, j: 3, v: 1}
 */
exports.getPixel = (i, j, v = 0) => {
    return {i, j, v}
}

function main() {

    // if module is required by other module, don't read stdin or arguments
    if (!RUNNING_AS_SCRIPT) {
        return;
    }

    // If no STDIN and no arguments
    if (process.stdin.isTTY && process.argv.length <= 2) {
        process.stderr.write('Argument with file path, or stdin data required.');
        process.stdout.write(usageMsg);
        process.exit(1);
    }
    // If no STDIN but arguments given
    else if (process.stdin.isTTY && process.argv.length > 2) {
        exports.processInputData('argument', process.argv[2]);
    }
    // read from STDIN
    else {
        let data = '';
        process.stdin.on('readable', () => {
            data += process.stdin.read() || '';
        });
        process.stdin.on('end', () => {
            exports.processInputData('stdin', data);
        });
    }
}

/**
 * @example
 * in:
 * 2
 * 3 4
 * 0001
 * 0011
 * 0110
 * 2 2
 * 01
 * 10
 *
 * out:
 * 0001
 * 0011
 * 0110
 *
 * 01
 * 10
 */
function splitRawInputToCases(rawInput) {
    const splitInput = rawInput.split('\n');
    const cases = [];

    let inputCase = '';
    let i = 1;
    while (i <= splitInput.length) {
        // if end of input or line with rows and columns info
        if ((splitInput[i] && splitInput[i].includes(' ')) ||
            i == splitInput.length) {
            if (inputCase.length) {
                cases.push((inputCase + '').trim());
                inputCase = '';
            }
        } else {
            inputCase += (splitInput[i] + "\n");
        }
        i++;
    }

    return cases;
}

/**
 * By definition distance = |i1-i2|+|j1-j2|
 * @example
 * in:
 * {i: 1, j: 1}
 * {i: 3, j: 3}
 *
 * out:
 * 4
 */
function calcDistanceBetween(pixel1, pixel2) {
    return Math.abs(pixel1.i - pixel2.i) + Math.abs(pixel1.j - pixel2.j);
}

/**
 * Returns closes pixel from pixels list
 * @example
 * out:
 * {i: 2, j: 3, v: 8}
 */
function iterateAllPixels(pixel, pixelsList) {
    let selectedPixelsList = [];

    let smallestDistancePixel;
    for (let toPixel of pixelsList) {
        if (toPixel.v === 1) {
            const distance = calcDistanceBetween(pixel, toPixel);
            const distancePixel = exports.getPixel(toPixel.i, toPixel.j, distance);

            if (smallestDistancePixel === undefined) {
                smallestDistancePixel = distancePixel;
            }

            if (!!smallestDistancePixel && distance <= smallestDistancePixel.v) {
                selectedPixelsList.push(distancePixel);
                smallestDistancePixel = distancePixel;
                if (distance === 1) {
                    break;
                }
            }
        }
    }

    selectedPixelsList = selectedPixelsList.sort((a, b) => a.v - b.v);
    return selectedPixelsList[0];
}

main();