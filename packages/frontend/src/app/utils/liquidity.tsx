import { createThirdwebClient, getContract,readContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";
const networks = {
  sepolia: {
    chainId: 11155111,
    pairAddress: "0xe98a7f9175538553e63f9387d4ac53179927310a",
  },
  amoy: {
    chainId: 80002, 
    pairAddress: "0x2129964645e427fc29a1ba3712feee2267126918",
  },
  base_sepolia: {
    chainId: 84532,
    pairAddress: "0xcc092721e2b4ec1fcc5e596482d7d619fed316e9",
  },
  avax_fuji: {
    chainId: 43113,
    pairAddress: "0xe903FBFB39293A6EC99E1d3983BDC417691f7138",
  },
};

export const getReserves = async (network: string) => {
    
    try {
      const networkInfo = networks[network];
      if (!networkInfo) {
        throw new Error(`Unsupported network: ${network}`);
      }
  
      const contract = getContract({
        client,
        chain: defineChain(networkInfo.chainId),
        address: networkInfo.pairAddress,
      });
  
      const data = await readContract({ 
        contract, 
        method: resolveMethod("getReserves"), 
        params: [] 
      })
        console.log(`Reserves for ${network}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching reserves for ${network}:`, error);
      throw error;
    }
  };
  
  export const getAllReserves = async () => {
    const results = await Promise.all(
      Object.keys(networks).map(async (network) => {
        try {
          const reserves = await getReserves(network);
          return { network, reserves };
        } catch (error) {
          console.error(`Error fetching reserves for ${network}:`, error);
          return { network, reserves: null, error: error.message };
        }
      })
    );
  
    return results;
  };