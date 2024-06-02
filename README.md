# lynk_swap

## Overview

Lynk Swap is an omnichain decentralized exchange (DEX) developed as a project of the Chainlink 2024 Hackathon. This project aims to facilitate the most flexible DEX trading across all chains. It supports four unique modes of operation:

1. **1-N Swap**: This mode allows users to exchange assets from one chain to multiple chains at the optimal price. The distribution of assets across different chains is determined based on an arbitrage-free assumption. This mode can be considered as an omnichain DEX aggregator.

2. **1-1 Swap**: This mode enables users to swap a token from one chain to a specific token on another designated chain.

3. **N-1 Swap**: This mode allows users to consolidate assets from multiple chains into a single chain. It's useful for fund aggregation.

4. **N-N Swap**: This mode is the ultimate form of an omnichain DEX, enabling users to swap assets from multiple chains to other assets on multiple chains. For example, if you have USDC on several chains and want to convert them all to ETH without caring on which chain the ETH will end up, focusing only on the best price, this mode is ideal for you.

The demo development is based on the Uniswap V2 constant product market maker (CPMM) algorithm. Currently, we have completed demo development for the 1-N Swap and 1-1 Swap. The N-N Swap is our ultimate product goal.

## Project Components

1. **Introduction**
    - Project Overview
    - Key Features

2. **Technical Architecture**
    - System Design
    - Smart Contract Details
    - Security Considerations

3. **Modes of Operation**
    - 1-N Swap
    - 1-1 Swap
    - N-1 Swap
    - N-N Swap

4. **Development**
    - Demo Implementation
    - Algorithms Used (e.g., CPMM)
    - Supported Chains

5. **Future Plans**
    - N-N Swap Development
    - Additional Features and Enhancements

6. **Conclusion**
    - Summary
    - Potential Impact

7. **Appendices**
    - Glossary of Terms
    - References and Resources

