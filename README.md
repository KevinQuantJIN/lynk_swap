# lynk Swap

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
### 1-N Swap Algorithm Equilibrium Condition

In the 1-N swap algorithm, the goal is to exchange assets from one chain to multiple chains at the optimal price. The distribution of assets across different chains is determined based on an arbitrage-free assumption. Below is the detailed derivation of the equilibrium condition for the 1-N swap algorithm.

#### Given Equations

We start with the following initial conditions:
$\ \frac{a}{(x_1 + \alpha k)^2} = \frac{b}{(x_2 + \beta k)^2} = \frac{c}{(x_3 + (1 - \alpha - \beta)k)^2} $

Where:
- $a, b, c$ are the constants representing the respective token amounts.
- $x_1, x_2, x_3$ are the initial amounts of tokens on chains 1, 2, and 3 respectively.
- $\alpha, \beta$ are the fractions of $k$ distributed to chains 1 and 2 respectively.
- $k$ is the total amount to be distributed.
- $( 1 - \alpha - \beta$ is the fraction of $k$ distributed to chain 3.

#### Step-by-Step Derivation

##### Step 1: Define the Equilibrium Condition

The equilibrium condition can be written as:
$\ A = \frac{a}{(x_1 + \alpha k)^2} = \frac{b}{(x_2 + \beta k)^2} = \frac{c}{(x_3 + (1 - \alpha - \beta)k)^2} $

##### Step 2: Equate the Expressions

We equate the expressions for the equilibrium condition:
$\ \frac{a}{(x_1 + \alpha k)^2} = \frac{b}{(x_2 + \beta k)^2} = \frac{c}{(x_3 + (1 - \alpha - \beta)k)^2} $

##### Step 3: Solve for $A$

Let:
$\ A = \frac{a}{(x_1 + \alpha k)^2}$
$\ A = \frac{b}{(x_2 + \beta k)^2}$
$\ A = \frac{c}{(x_3 + (1 - \alpha - \beta)k)^2}$

##### Step 4: Rearrange to Isolate $k$

Rearrange each equation to isolate $k$:
$\ (x_1 + \alpha k)^2 = \frac{a}{A} $
$\ (x_2 + \beta k)^2 = \frac{b}{A} $
$\ (x_3 + (1 - \alpha - \beta)k)^2 = \frac{c}{A} $

##### Step 5: Solve for $\alpha$, $\beta$, and $k$

Solving these equations simultaneously will yield the values of $\alpha$, $\beta$, and $k$ that satisfy the equilibrium condition:
$\ \alpha = \frac{\sqrt{\frac{a}{A}} - x_1}{k} $
$\ \beta = \frac{\sqrt{\frac{b}{A}} - x_2}{k} $
$\ 1 - \alpha - \beta = \frac{\sqrt{\frac{c}{A}} - x_3}{k} $

##### Step 6: Ensure No Arbitrage

To ensure no arbitrage, the sum of the fractions must equal 1:
$\ \alpha + \beta + (1 - \alpha - \beta) = 1 $

#### Conclusion

The above steps outline the derivation of the equilibrium condition for the 1-N swap algorithm, ensuring that the swap is performed at optimal prices with no arbitrage opportunities.



3. **Modes of Operation**
    - 1-N Swap
    - 1-1 Swap
    - N-1 Swap
    - N-N Swap

4. **Development**
    - Demo Implementation
    - Algorithms Used
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

