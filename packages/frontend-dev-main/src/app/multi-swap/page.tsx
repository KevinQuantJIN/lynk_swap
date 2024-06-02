"use client"
import { useState, useEffect } from 'react';
import { ConnectButton } from 'thirdweb/react';
import { computeRouterValues } from '../utils/routerAlgo';
import { getContract, prepareContractCall, sendTransaction,resolveMethod, toWei } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";
import UserInput from '../components/userInput';
import CalculationResult from '../components/calculationResult';
import ActionButtons from '../components/actionButtons';
import { createWallet } from "thirdweb/wallets";
import { approve } from "thirdweb/extensions/erc20";


export default function MultiSwap() {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('DAI');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(5);
  const [toAmountFuji, setToAmountFuji] = useState('');
  const [toAmountMumbai, setToAmountMumbai] = useState('');
  const [toAmountBase, setToAmountBase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alpha, setAlpha] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [gamma, setGamma] = useState<number | null>(null);

  // Define the contract
  const contract = getContract({ 
    client, 
    chain: defineChain(11155111), 
    address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05"
  });

  const swapContract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0xE1901Fb3AaAE7Fd8ae51d3e1CE4F22789d528297"
  });

  const handleApprove = async () => {
    try {
      const wallet = createWallet("io.metamask");
      const account = await wallet.connect({ client });

      // Address of the wallet to allow transfers from
      const spenderAddress = account.address; // Assuming you want to allow the connected account
      // The number of tokens to give as allowance
      const amountToApprove = BigInt(1) * BigInt(1e18); // Convert to Wei
      const transaction = approve({
        contract,
        spender: swapContract.address,
        amount: amountToApprove.toString()
      })
      const transactionResult = await sendTransaction({
        transaction,
        account,
      });
      alert('Approval successful');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed');
    }
  };

  const handleSwap = async () => {
    // Example values for x and y
    const k = BigInt(Number(amount) * 1e+18);
    const slip = 1 - slippage / 100;
    const alphaAmount = alpha * Number(k) * slip;
    const betaAmount = beta * Number(k) * slip ;
    const gammaAmount = gamma * Number(k) * slip ;
    
    try {
      const wallet = createWallet("io.metamask");
      const account = await wallet.connect({ client });

      const transaction = prepareContractCall({
        contract: swapContract,
        method: "function swap(address tokenIn, address tokenOut, uint256 amountA, uint256 minA, uint256 amountB, uint256 minB, uint256 amountC, uint256 minC)",
        params: ["0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05", "0x762223f2D957dD59625d74b9f85f21F3EDeb1946", BigInt(alphaAmount) , toWei(toAmountMumbai),BigInt(betaAmount) ,toWei(toAmountBase),BigInt(gammaAmount),toWei(toAmountFuji)]

      })
      console.log(["0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05", "0x762223f2D957dD59625d74b9f85f21F3EDeb1946", alphaAmount , toWei(toAmountMumbai),BigInt(betaAmount*1e18) ,toWei(toAmountBase),BigInt(gammaAmount*1e18),toWei(toAmountFuji)])
      const transactionResult = await sendTransaction({
        transaction,
        account,
      });
      alert('Swap successful');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Swap failed');
    }
  };


  useEffect(() => {
    if (amount) {
      async function fetchAndCompute() {
        setIsLoading(true);
        try {
          const k = Number(amount)*1e18; // Assuming amount is in ETH and needs to be converted to Wei
          const { alpha, beta, gamma } = await computeRouterValues(k);
          setAlpha(alpha);
          setBeta(beta);
          setGamma(gamma);
        } catch (error) {
          console.error("Error in fetchAndCompute:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAndCompute();
    }
  }, [amount, slippage]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-screen-lg p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Multi-Swap</h1>
        <ConnectButton
          client={client}
          appMetadata={{
            name: "My Cross-Chain Aggregator",
            url: "https://example.com",
          }}
        />
      </header>

      <main className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-lg">
        <UserInput
          fromToken={fromToken}
          setFromToken={setFromToken}
          amount={amount}
          setAmount={setAmount}
          slippage={slippage}
          setSlippage={setSlippage}
          toToken={toToken}
          setToToken={setToToken}
        />
        <CalculationResult
          amountIn={amount}
          slippage={slippage}
          alpha={alpha}
          beta={beta}
          gamma={gamma}
          isLoading={isLoading}
          setToAmountFuji={setToAmountFuji}
          setToAmountMumbai={setToAmountMumbai}
          setToAmountBase={setToAmountBase}
        />
        <ActionButtons
          handleApprove={handleApprove}
          handleSwap={handleSwap}
        />
      </main>

      <footer className="w-full max-w-screen-lg p-4 mt-8 text-center">
        <p className="text-sm text-gray-400">© 2024 Multi-Swap. All rights reserved.</p>
      </footer>
    </div>
  );
}