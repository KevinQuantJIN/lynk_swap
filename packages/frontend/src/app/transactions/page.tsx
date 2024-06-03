"use client"
import { useState, useEffect } from 'react';
import { client } from "../client";
import { ConnectButton } from 'thirdweb/react';
import { useActiveAccount } from "thirdweb/react";

interface Detail {
  chainId: BigInt | null;
  fromTokenAddress: string | null;
  fromTokenAmount: BigInt | null;
  toTokenAddress: string | null;
  toTokenAmount: BigInt | null;
  succuss: boolean;
  transaction_hash: string | null;
  Timestamp: string | null;
}

interface Deal {
  messageId: string;
  chainId: BigInt | null;
  fromTokenAddress: string | null;
  fromTokenAmount: BigInt | null;
  toTokenAddress: string | null;
  toTokenAmount: BigInt | null;
  status: string;
  transaction_hash: string | null;
  swapTransactionHash: string;
}

interface Transaction {
  userAddress: string;
  fromTokenAddress: string;
  fromTokenAmount: string;
  fees: string;
  deals: Deal[];
}

const Transactions = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();

  useEffect(() => {
    if (account) {
      fetch(`https://lynkswap-indexer.fly.dev/api/v1/txs?address=${account.address}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setData(data))
        .catch(error => {
          console.error('Fetch error:', error);
          setError(error.message);
        });
    }
  }, [account]);
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <ConnectButton
          client={client}
          appMetadata={{
            name: "My Cross-Chain Aggregator",
            url: "https://example.com",
          }}
        />
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 rounded-lg">
          <thead>
            <tr className="bg-zinc-700">
              <th className="py-3 px-4">User Address</th>
              <th className="py-3 px-4">From Token Address</th>
              <th className="py-3 px-4">From Token Amount</th>
              <th className="py-3 px-4">Fees</th>
              <th className="py-3 px-4">Deals</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, index) => (
              <tr key={index} className="bg-zinc-600 border-b border-zinc-700">
                <td className="py-3 px-4">{transaction.userAddress}</td>
                <td className="py-3 px-4">{transaction.fromTokenAddress}</td>
                <td className="py-3 px-4">{transaction.fromTokenAmount}</td>
                <td className="py-3 px-4">{transaction.fees}</td>
                <td className="py-3 px-4">
                  <table className="min-w-full bg-zinc-800 rounded-lg">
                    <thead>
                      <tr className="bg-zinc-700">
                        <th className="py-2 px-2">Message ID</th>
                        <th className="py-2 px-2">Chain ID</th>
                        <th className="py-2 px-2">From Token Address</th>
                        <th className="py-2 px-2">From Token Amount</th>
                        <th className="py-2 px-2">To Token Address</th>
                        <th className="py-2 px-2">To Token Amount</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Transaction Hash</th>
                        <th className="py-2 px-2">Swap Transaction Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.deals.map((deal, dealIndex) => (
                        <tr key={dealIndex} className="bg-zinc-600 border-b border-zinc-700">
                          <td className="py-2 px-2">{deal.messageId}</td>
                          <td className="py-2 px-2">{deal.chainId?.toString() || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.fromTokenAddress || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.fromTokenAmount?.toString() || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.toTokenAddress || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.toTokenAmount?.toString() || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.status}</td>
                          <td className="py-2 px-2">{deal.transaction_hash || 'N/A'}</td>
                          <td className="py-2 px-2">{deal.swapTransactionHash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;