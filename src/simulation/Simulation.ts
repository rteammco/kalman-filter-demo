const matrix = require('matrix-js');

export function testMatrixJS(): void {
  const m1 = matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);
  const m2 = matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);

  const m3 = m1.mul(m2);

  console.log({ m1, m2, m3 });
}
