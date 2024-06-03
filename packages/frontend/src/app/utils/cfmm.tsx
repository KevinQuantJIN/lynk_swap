export const cfmm = (x: bigint, y: bigint, xIn: bigint): bigint => {
    return y - (y * x) / (x + xIn) ;
  };