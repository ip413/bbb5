/* eslint-disable no-undef */
const expect = require('chai').expect;
const calc = require('./index');

describe('bbb5', function () {
  it.skip('calcDistanceToNearest', function () {
    expect(calc.calcDistanceToNearest()).to.equal('TODO');
  });

  it('calcDistanceBetween', function () {
    const pixelsSet = getSetOfPixels([100, 100, 100, 100]);
    expect(calc.calcDistanceBetween(...pixelsSet)).to.equal(0);

    const pixelsSet1 = getSetOfPixels([1, 1, 2, 2]);
    expect(calc.calcDistanceBetween(...pixelsSet1)).to.equal(2);

    const pixelsSet2 = getSetOfPixels([1, 1, 3, 3]);
    expect(calc.calcDistanceBetween(...pixelsSet2)).to.equal(4);

    const pixelsSet3 = getSetOfPixels([1, 1, 4, 4]);
    expect(calc.calcDistanceBetween(...pixelsSet3)).to.equal(6);
  });

  it('stringToBitmap', function () {
    const stringBitmap = '10\n01';
    expect(calc.stringToBitmap(stringBitmap)).to.deep.equal([[1, 0], [0, 1]])
  });
});



function getSetOfPixels (positions) {
  const pixels =[];
  for(let i = 0; i < positions.length; i+=2) {
    pixels.push(calc.getPixel(positions[i], positions[i + 1]))
  }
  return pixels;
}
/*
sample, distance 2
1, 0
0, 1
*/


/*
sample, distance 4
1, 0, 0
0, 0, 0
0, 0, 1
*/

/*
sample, distance 6
1, 0, 0, 0
0, 0, 0, 0
0, 0, 0, 0
0, 0, 0, 1
*/
