import { useEffect, useState } from 'react';
import Image from 'next/image';
import avaxLogo from '../../../public/avax.png';
import baseLogo from '../../../public/base.png';
import polygonLogo from '../../../public/polygon.png';
import { cfmm } from '../utils/cfmm';  // Ensure this path is correct
import { getReserves } from '../utils/liquidity';

interface CalculationResultProps {
  amountIn: string;
  slippage: number;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  isLoading: boolean;
  setToAmountFuji: (value: string) => void;
  setToAmountMumbai: (value: string) => void;
  setToAmountBase: (value: string) => void;
}

const CalculationResult: React.FC<CalculationResultProps> = ({
  amountIn,
  slippage,
  alpha,
  beta,
  gamma,
  isLoading,
  setToAmountFuji,
  setToAmountMumbai,
  setToAmountBase,
}) => {
  const [reserves, setReserves] = useState({
    amoy: { x: BigInt(0), y: BigInt(0) },
    base: { x: BigInt(0), y: BigInt(0) },
    fuji: { x: BigInt(0), y: BigInt(0) }
  });
  const [toAmountFuji, updateToAmountFuji] = useState<string>('');
  const [toAmountBase, updateToAmountBase] = useState<string>('');
  const [toAmountMumbai, updateToAmountMumbai] = useState<string>('');
  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const amoyReserves = await getReserves('amoy');
        const baseReserves = await getReserves('base_sepolia');
        const fujiReserves = await getReserves('avax_fuji');

        setReserves({
          amoy: { x: amoyReserves[1], y: amoyReserves[0] },
          base: { x: baseReserves[1], y: baseReserves[0] },
          fuji: { x: fujiReserves[1], y: fujiReserves[0] }
        });
      } catch (error) {
        console.error("Error fetching reserves:", error);
      }
    };

    fetchReserves();
  }, []);

  const [routerInfo, setRouterInfo] = useState<{
    amoy: { percentage: string, amount: string, amount_out: string },
    base: { percentage: string, amount: string, amount_out: string },
    fuji: { percentage: string, amount: string, amount_out: string }
  } | null>(null);

  useEffect(() => {
    if (amountIn && alpha !== null && beta !== null && gamma !== null) {
      const k = BigInt(Number(amountIn) * 1e+18);
      const slip = 1 - slippage / 100;
      const alphaAmount = alpha * Number(k) * slip;
      const betaAmount = beta * Number(k) * slip ;
      const gammaAmount = gamma * Number(k) * slip ;
      const amoyAmount = cfmm(reserves.amoy.x, reserves.amoy.y, BigInt(alphaAmount));
      const baseAmount = cfmm(reserves.base.x, reserves.base.y, BigInt(betaAmount));
      const fujiAmount = cfmm(reserves.fuji.x, reserves.fuji.y, BigInt(gammaAmount));
        console.log(amoyAmount)
      setRouterInfo({
        amoy: { percentage: (alpha * 100).toFixed(2) + '%', amount: (Number(alphaAmount) / 1e18).toFixed(4), amount_out: (Number(amoyAmount) / 1e18).toFixed(10) },
        base: { percentage: (beta * 100).toFixed(2) + '%', amount: (Number(betaAmount) / 1e18).toFixed(4), amount_out: (Number(baseAmount) / 1e18).toFixed(10)  },
        fuji: { percentage: (gamma * 100).toFixed(2) + '%', amount: (Number(gammaAmount) / 1e18).toFixed(4), amount_out: (Number(fujiAmount) / 1e18).toFixed(10)  }
      });

      setToAmountFuji((Number(fujiAmount) / 1e18).toFixed(2));
      setToAmountMumbai((Number(amoyAmount) / 1e18).toFixed(2));
      setToAmountBase((Number(baseAmount) / 1e18).toFixed(2));
      

    }
  }, [amountIn, slippage, alpha, beta, gamma, reserves, setToAmountFuji, setToAmountMumbai, setToAmountBase]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div> {/* You can define a CSS loader for better UX */}
          <p className="ml-4 text-gray-300">Calculating...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Router Information</label>
            <div className="bg-zinc-700 p-2 rounded-lg text-white">
              {routerInfo && (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Chain</th>
                      <th>Percentage</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Amoy</td>
                      <td>{routerInfo.amoy.percentage}</td>
                      <td>{routerInfo.amoy.amount}</td>
                    </tr>
                    <tr>
                      <td>Base Sepolia</td>
                      <td>{routerInfo.base.percentage}</td>
                      <td>{routerInfo.base.amount}</td>
                    </tr>
                    <tr>
                      <td>Fuji</td>
                      <td>{routerInfo.fuji.percentage}</td>
                      <td>{routerInfo.fuji.amount}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">To (Fuji)</label>
            <div className="flex items-center bg-zinc-700 p-2 rounded-lg">
              <Image src={avaxLogo} alt="Avax Logo" width={24} height={24} className="mr-2" />
              <input 
                type="text" 
                value={routerInfo?.fuji.amount_out || ''} 
                readOnly 
                className="bg-transparent text-white p-2 w-full rounded-lg"
                placeholder="Calculated amount on Fuji"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">To (Amoy)</label>
            <div className="flex items-center bg-zinc-700 p-2 rounded-lg">
              <Image src={polygonLogo} alt="Polygon Logo" width={24} height={24} className="mr-2" />
              <input 
                type="text" 
                value={routerInfo?.amoy.amount_out || ''} 
                readOnly 
                className="bg-transparent text-white p-2 w-full rounded-lg"
                placeholder="Calculated amount on Amoy"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">To (Base)</label>
            <div className="flex items-center bg-zinc-700 p-2 rounded-lg">
              <Image src={baseLogo} alt="Base Logo" width={24} height={24} className="mr-2" />
              <input 
                type="text" 
                value={routerInfo?.base.amount_out || ''} 
                readOnly 
                className="bg-transparent text-white p-2 w-full rounded-lg"
                placeholder="Calculated amount on Base"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CalculationResult;