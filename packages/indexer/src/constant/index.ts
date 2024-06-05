import 'viem/chains';
import { avalancheFuji, baseSepolia, polygonAmoy } from 'viem/chains';
export const MAIN_ROUTER = {
  address: '0xE1901Fb3AaAE7Fd8ae51d3e1CE4F22789d528297',
  startBlock: 6026589,
  url: 'https://eth-sepolia.g.alchemy.com/v2/GeyJkWjbGCIX-LvZ_asME_e7zE_Xw5xp',
};

export const MESSAGERS = [
  {
    chain: polygonAmoy,
    address: '0x1BFD855bd9189c4E21E9dE85B260e5DBF5916732',
    startBlock: 7790109,
    url: 'https://polygon-amoy.g.alchemy.com/v2/8neUVmdL42VERd0MY6t8J__EV-GstV2K',
  },
  {
    chain: baseSepolia,
    address: '0x389E45FAB2316a51Fa95169ddaAf6b3237FaD0C5',
    startBlock: 10792247,
    url: 'https://base-sepolia.g.alchemy.com/v2/Q7ZYlNxpU5M7bMDW0NOa6s1qTavmeXHD',
  },
  {
    chain: avalancheFuji,
    address: '0xf8C14506a9f5DEc750211d173894d1999ca35dC4',
    startBlock: 33672787,
    url: 'https://avalanche-fuji.infura.io/v3/be4b457f0235441483b446d32c0046e2',
  },
];
