import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import ethLogo from '../../../public/eth.png';  // Ensure the path is correct

interface UserInputProps {
  fromToken: string;
  setFromToken: Dispatch<SetStateAction<string>>;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  slippage: number;
  setSlippage: Dispatch<SetStateAction<number>>;
  toToken: string;
  setToToken: Dispatch<SetStateAction<string>>;
}

const UserInput: React.FC<UserInputProps> = ({ fromToken, setFromToken, amount, setAmount, slippage, setSlippage, toToken, setToToken }) => (
  <div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">From (Sepolia)</label>
      <div className="flex items-center bg-zinc-700 rounded-lg p-2">
        <Image src={ethLogo} alt="ETH Logo" width={24} height={24} className="mr-2" />
        <select 
          value={fromToken} 
          onChange={(e) => setFromToken(e.target.value)} 
          className="bg-transparent text-white p-2 flex-1"
        >
          <option value="CCIP-BnM">CCIP-BnM</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
          {/* Add more token options here */}
        </select>
        <input 
          type="text" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="bg-transparent text-white p-2 flex-1 text-right"
          placeholder="0.0"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
      <div className="flex items-center bg-zinc-700 rounded-lg p-2">
        <select 
          value={toToken} 
          onChange={(e) => setToToken(e.target.value)} 
          className="bg-transparent text-white p-2 flex-1"
        >
          <option value="LYNK">LYNK</option>
          <option value="USDC">USDC</option>
          <option value="DAI">DAI</option>
          {/* Add more token options here */}
        </select>
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">Slippage</label>
      <div className="flex items-center bg-zinc-700 rounded-lg p-2">
        <input 
          type="number" 
          value={slippage} 
          onChange={(e) => setSlippage(Number(e.target.value))} 
          className="bg-transparent text-white p-2 flex-1"
          placeholder="0.5%"
        />%
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">Select Slippage</label>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => setSlippage(5)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          5%
        </button>
        <button 
          onClick={() => setSlippage(1)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          1%
        </button>
        <button 
          onClick={() => setSlippage(0.5)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          0.5%
        </button>
      </div>
    </div>
  </div>
);

export default UserInput;