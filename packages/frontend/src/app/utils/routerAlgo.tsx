import { getAllReserves } from './liquidity';

export const solveRouterEquation = (k: bigint, x1: bigint, y1: bigint, x2: bigint, y2: bigint, x3: bigint, y3: bigint) => {
  const epsilon = 1n;  // Define a small epsilon for BigInt
  let alpha = 0.5;
  let beta = 0.25;
  let step = 0.001;
  let maxIterations = 100000;
  let iterations = 0;

  while (iterations < maxIterations) {
    const lhs1 = (x1 * y1) / ((x1 + BigInt(alpha * Number(k))) ** 2n);
    const lhs2 = (x2 * y2) / ((x2 + BigInt(beta * Number(k))) ** 2n);
    const lhs3 = (x3 * y3) / ((x3 + BigInt((1 - alpha - beta) * Number(k))) ** 2n);

    if (BigInt(Math.abs(Number(lhs1 - lhs2))) < epsilon && BigInt(Math.abs(Number(lhs2 - lhs3))) < epsilon) {
      return { alpha, beta };
    }

    if (lhs1 > lhs2) {
      alpha -= step;
    } else {
      alpha += step;
    }

    if (lhs2 > lhs3) {
      beta -= step;
    } else {
      beta += step;
    }

    alpha = Math.max(0, Math.min(1, alpha));
    beta = Math.max(0, Math.min(1, beta));

    iterations++;
  }

  throw new Error("Solution not found within the maximum number of iterations");
};

export const computeRouterValues = async (k: number) => {
  const reservesData = await getAllReserves();
  const validReserves = reservesData.filter(reserve => reserve.reserves !== null);

  if (validReserves.length < 3) {
    throw new Error('Not enough valid reserve data to perform calculations.');
  }

  const amoyReserves = validReserves.find(reserve => reserve.network === 'amoy')?.reserves;
  const baseSepoliaReserves = validReserves.find(reserve => reserve.network === 'base_sepolia')?.reserves;
  const fujiReserves = validReserves.find(reserve => reserve.network === 'avax_fuji')?.reserves;

  if (!amoyReserves || !baseSepoliaReserves || !fujiReserves) {
    throw new Error('Missing reserve data for one or more networks.');
  }

  const x1 = amoyReserves[0];
  const y1 = amoyReserves[1];
  const x2 = baseSepoliaReserves[0];
  const y2 = baseSepoliaReserves[1];
  const x3 = fujiReserves[0];
  const y3 = fujiReserves[1];

  const { alpha, beta } = solveRouterEquation(BigInt(k), x1, y1, x2, y2, x3, y3);
  const gamma = 1 - alpha - beta;

  return { alpha, beta, gamma };
};