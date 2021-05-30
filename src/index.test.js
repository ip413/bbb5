/* eslint-disable no-undef */
const expect = require('chai').expect;
const fs = require('fs');
const calc = require('./index');

describe('bbb5 logic', function () {

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
    expect(calc.processInputData('argument', 'sample/input-02.txt')).to.
      equal(fs.readFileSync('sample/output-02.txt', {encoding: 'utf-8'}));
  });
});

describe.skip('bbb5 performance: ones', function () {
  it('ones 100', function () {
    expect(calc.processInputData('argument', 'sample/input-03-many-ones-10x10-100.txt')).to.
      equal(fs.readFileSync('sample/output-03-many-ones-10x10-100.txt', { encoding: 'utf-8' }));
  });

  it('ones 10k', function () {
    expect(calc.processInputData('argument', 'sample/input-04-many-ones-100x100-10000.txt')).to.
      equal(fs.readFileSync('sample/output-04-many-ones-100x100-10000.txt', { encoding: 'utf-8' }));
  });

  it('ones 33k', function () {
    expect(calc.processInputData('argument', 'sample/input-05-many-ones-182x182-33124.txt')).to.
      equal(fs.readFileSync('sample/output-05-many-ones-182x182-33124.txt', { encoding: 'utf-8' }));
  }).timeout(30000);
})

describe.skip('bbb5 performance: zeros', function () {
  it('zeros 100', function () {
    expect(calc.processInputData('argument', 'sample/input-06-many-zeros-10x10-100.txt')).to.
      equal(fs.readFileSync('sample/output-06-many-zeros-10x10-100.txt', { encoding: 'utf-8' }));
  });

  it('zeros 10k', function () {
    expect(calc.processInputData('argument', 'sample/input-07-many-zeros-100x100-10000.txt')).to.
      equal(fs.readFileSync('sample/output-07-many-zeros-100x100-10000.txt', { encoding: 'utf-8' }));
  });

  it('zeros 33k', function () {
    expect(calc.processInputData('argument', 'sample/input-08-many-zeros-182x182-33124.txt')).to.
      equal(fs.readFileSync('sample/output-08-many-zeros-182x182-3312433124.txt', { encoding: 'utf-8' }));
  }).timeout(30000);
})

describe.skip('bbb5 performance: random', function () {
  it('random 100', function () {
    expect(calc.processInputData('argument', 'sample/input-09-random-10x10-100.txt')).to.
      equal(fs.readFileSync('sample/output-09-random-10x10-100.txt', { encoding: 'utf-8' }));
  });

  it('random 10k', function () {
    expect(calc.processInputData('argument', 'sample/input-10-random-100x100-10000.txt')).to.
      equal(fs.readFileSync('sample/output-10-random-100x100-10000.txt', { encoding: 'utf-8' }));
  }).timeout(3000);

  it('random 33k', function () {
    expect(calc.processInputData('argument', 'sample/input-11-random-182x182-33124.txt')).to.
      equal(fs.readFileSync('sample/output-11-random-182x182-33124.txt', { encoding: 'utf-8' }));
  }).timeout(30000);
})