"use client"
import { useEffect, useState } from 'react';
import { getAllReserves } from '../utils/liquidity';

export default function Liquidity() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const reservesData = await getAllReserves();
        setData(reservesData);
      } catch (error) {
        console.error("Error fetching liquidity data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Liquidity Reserves</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-800 rounded-lg">
            <thead>
              <tr className="bg-zinc-700">
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Reserve0</th>
                <th className="py-3 px-4">Reserve1</th>
                <th className="py-3 px-4">Error</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ network, reserves, error }, index) => (
                <tr key={index} className="bg-zinc-600 border-b border-zinc-700">
                  <td className="py-3 px-4">{network}</td>
                  {reserves ? (
                    <>
                      <td className="py-3 px-4">{reserves[0].toString()}</td>
                      <td className="py-3 px-4">{reserves[1].toString()}</td>
                      <td className="py-3 px-4">-</td>
                    </>
                  ) : (
                    <td colSpan={3} className="py-3 px-4">Error: {error}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}