/* eslint-disable no-undef */
const expect = require('chai').expect;
const calc = require('./index');
const pipe = require('pipe-functions');
const fs = require('fs');

describe('bbb5 logic', function () {

  it('calc distance between pixels', function () {
    const pixelsSet = getSetOfPixels([100, 100, 100, 100]);
    expect(calc.calcDistanceBetween(...pixelsSet)).to.equal(0);

    const pixelsSet1 = getSetOfPixels([1, 1, 2, 2]);
    expect(calc.calcDistanceBetween(...pixelsSet1)).to.equal(2);

    const pixelsSet2 = getSetOfPixels([1, 1, 3, 3]);
    expect(calc.calcDistanceBetween(...pixelsSet2)).to.equal(4);

    const pixelsSet3 = getSetOfPixels([1, 1, 4, 4]);
    expect(calc.calcDistanceBetween(...pixelsSet3)).to.equal(6);
  });

  it('string to bitmap', function () {
    const stringBitmap = '10\n01';
    expect(calc.stringToBitmap(stringBitmap)).to.deep.equal([[1, 0], [0, 1]])
  });

  it('bitmapToPixelsList', function () {
    const bitmap = [[1, 0], [0, 1]];
    expect(calc.bitmapToPixelsList(bitmap)).to.deep.equal([
      { i: 1, j: 1, v: 1},
      { i: 1, j: 2, v: 0},
      { i: 2, j: 1, v: 0},
      { i: 2, j: 2, v: 1}
    ])

    const bitmap2 = [[1], [0], [0], [1]];
    expect(calc.bitmapToPixelsList(bitmap2)).to.deep.equal([
      { i: 1, j: 1, v: 1 },
      { i: 2, j: 1, v: 0 },
      { i: 3, j: 1, v: 0 },
      { i: 4, j: 1, v: 1 }
    ])

    const bitmap3 = [[1]];
    expect(calc.bitmapToPixelsList(bitmap3)).to.deep.equal([
      { i: 1, j: 1, v: 1 }
    ])
  });

  it('get nearest white pixel', function () {
    let pixel;
    let pixelsList;

    // distance 0
    pixel = calc.getPixel(1, 1);
    pixelsList = calc.bitmapStringToPixelsList('10\n00');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({ i: 1, j: 1, v: 0 });

    // diagonal case
    pixel = calc.getPixel(1, 1);
    pixelsList = calc.bitmapStringToPixelsList('000\n000\n001');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({i: 3, j: 3, v: 4});

    // the same line case
    pixel = calc.getPixel(1, 1);
    pixelsList = calc.bitmapStringToPixelsList('10\n00\n01');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({ i: 1, j: 1, v: 0 });

    pixel = calc.getPixel(1, 2);
    pixelsList = calc.bitmapStringToPixelsList('10\n00\n01');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({ i: 1, j: 1, v: 1 });

    pixel = calc.getPixel(2, 2);
    pixelsList = calc.bitmapStringToPixelsList('100\n000\n001');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({ i: 1, j: 1, v: 2 });

    pixel = calc.getPixel(3, 3);
    pixelsList = calc.bitmapStringToPixelsList('100\n000\n001');
    expect(calc.getNearestWhitePixel(pixel, pixelsList)).to.deep.equal({ i: 3, j: 3, v: 0 });
  })

  it('get list of nearest pixels', function () {
    expect(calc.bitmapStringToOutputString('00\n01')).to.equal("2 1\n1 0");

    expect(calc.bitmapStringToOutputString('000\n000\n001')).to.equal("4 3 2\n3 2 1\n2 1 0");

    expect(calc.bitmapStringToOutputString('100\n000\n001')).to.equal("0 1 2\n1 2 1\n2 1 0");

    expect(calc.bitmapStringToOutputString('001\n010\n100')).to.equal('2 1 0\n1 0 1\n0 1 2');

    expect(calc.bitmapStringToOutputString('0001\n0011\n0110')).to.equal('3 2 1 0\n2 1 0 0\n1 0 0 1');
  });

  it('handle input data', function () {
    expect(calc.processInputData('argument', 'sample/input2.txt')).to.
      equal("3 2 1 0\n2 1 0 0\n1 0 0 1\n\n3 2 1\n2 1 0\n1 0 0\n2 1 1\n2 1 0\n1 0 0\n2 1 1\n2 1 0\n1 0 0\n2 1 1");
  });
});

function getSetOfPixels (positions) {
  const pixels =[];
  for(let i = 0; i < positions.length; i+=2) {
    pixels.push(calc.getPixel(positions[i], positions[i + 1]))
  }
  return pixels;
}