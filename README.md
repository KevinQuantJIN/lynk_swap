# Lynk Swap

Lynk Swap is an omnichain decentralized exchange (DEX) developed as a project of the Chainlink 2024 Hackathon. This project aims to facilitate the most flexible DEX trading across all chains. It supports four unique modes of operation:

1. **1-N Swap**: This mode allows users to exchange assets from one chain to multiple chains at the optimal price. The distribution of assets across different chains is determined based on an arbitrage-free assumption. This mode can be considered as an omnichain DEX aggregator.

2. **1-1 Swap**: This mode enables users to swap a token from one chain to a specific token on another designated chain.

3. **N-1 Swap**: This mode allows users to consolidate assets from multiple chains into a single chain. It's useful for fund aggregation.

4. **N-N Swap**: This mode is the ultimate form of an omnichain DEX, enabling users to swap assets from multiple chains to other assets on multiple chains. For example, if you have USDC on several chains and want to convert them all to ETH without caring on which chain the ETH will end up, focusing only on the best price, this mode is ideal for you.

The demo development is based on the Uniswap V2 constant product market maker (CPMM) algorithm. Currently, we have completed demo development for the 1-N Swap and 1-1 Swap. The N-N Swap is our ultimate product goal.

## Development

### Demo Implementation
To be filled

### Algorithms Used

Lynk Swap leverages the Constant Product Market Maker (CPMM) algorithm, a fundamental principle behind Uniswap V2, to facilitate decentralized exchanges. Currently, our demo uses Uniswap V2, but we plan to support Uniswap V3 in the future.

Additionally, Lynk Swap incorporates an advanced aggregation algorithm to determine the optimal exchange amounts. The 1-N Swap algorithm is designed to distribute assets from one chain to multiple chains at the best price. This algorithm operates under the arbitrage-free assumption, ensuring that the prices across different chains are equalized to prevent arbitrage opportunities. 

For the future N-N Swap mode, Lynk Swap aims to extend this aggregation algorithm to handle multiple assets across multiple chains, optimizing the overall swap process by balancing liquidity and achieving the best exchange rates across a diverse set of chains.

### Supported Chains

Lynk Swap currently supports the following blockchain networks:

- Ethereum (ETH)
- Polygon (MATIC)
- Base (BASE)
- Avalanche (AVAX)

In the future, Lynk Swap plans to support more blockchain networks, including additional EVM compatible chains and even non-EVM chains. This expansion will further enhance the interoperability and reach of the platform.

Cross-chain functionality in Lynk Swap is implemented using the Chainlink Cross-Chain Interoperability Protocol (CCIP), which ensures secure and efficient interactions between different blockchain networks.


## Chainlink Function Used

### Cross-Chain Interoperability Protocol (CCIP)

### Automation

### Oracle


## 1-N Swap Algorithm

In the 1-N swap algorithm, the goal is to exchange assets from one chain to multiple chains at the optimal price. The distribution of assets across different chains is determined based on an arbitrage-free assumption. Below is the detailed derivation of the equilibrium condition for the 1-N swap algorithm.

### Simplified Case: One-to-Two Chains

#### Given Conditions

We have two chains, each with a separate liquidity pool (LP) for the ETH:USDT pair. Let's denote these chains as Chain A and Chain B. 

Chain A uses the Uniswap V2 CFMM model, represented by the equation $x_1 \cdot y_1 = a$, where $x_1$ is the amount of ETH and $y_1$ is the amount of USDT. 

Chain B also uses the Uniswap V2 CFMM model, represented by the equation $x_2 \cdot y_2 = b$, where $x_2$ is the amount of ETH and $y_2$ is the amount of USDT. 

We want to swap $k$ ETH for USDT at the best price. The $k$ ETH will be divided into two parts: $\alpha k$ ETH will be swapped on Chain A using the $x_1 \cdot y_1 = a$ pool, and $(1-\alpha)k$ ETH will be swapped on Chain B using the $x_2 \cdot y_2 = b$ model.

The goal is to optimize $\alpha$ to maximize the amount of USDT received in return.

#### Problem Statement

Given:
- Two chains with liquidity pools for the ETH:USDT pair.
- Chain A and B follows the Uniswap V2 CFMM model.
- The total amount of ETH to swap is $k$.

Determine:
- The optimal value of $\alpha$ that maximizes the amount of USDT received when swapping $k$ ETH across both chains.

#### Constraints
- $0 \leq \alpha \leq 1$
- $\alpha k$ ETH swapped on Chain A.
- $(1-\alpha)k$ ETH swapped on Chain B.

#### Optimization
To optimize the value of $\alpha$ to get the highest amount of USDT in return when swapping $k$ ETH into USDT across two different chains (Chain A and Chain B) using CFMM, we'll need to calculate the USDT received from each chain based on how much ETH is swapped there.

Given:

1. For Chain A (using Uniswap V2 model):

   $x_1 \times y_1 = a$

   After swapping $\alpha \times k$ ETH for USDT:

   $\(x_1 + \alpha \times k) \times (y_1 - USDT_A) = a$

2. For Chain B:

   $x_2 \times y_2 = b$

   After swapping $(1 - \alpha) \times k$ ETH for USDT:

   $\(x_2 + (1 - \alpha) \times k) \times (y_2 - USDT_B) = b$

Solving for USDT Received:

For each chain, the change in the USDT balance after the transaction can be derived from the constant product formula.

On Chain A:

$`y_1 - USDT_A = \frac{a}{x_1 + \alpha \times k}`$

$`USDT_A = y_1 - \frac{a}{x_1 + \alpha \times k}`$

On Chain B:

$`y_2 - USDT_B = \frac{b}{x_2 + (1 - \alpha) \times k}`$

$`USDT_B = y_2 - \frac{b}{x_2 + (1 - \alpha) \times k}`$

Total USDT Received:

The total USDT received from both chains when splitting the ETH is:

$`Total USDT = USDT_A + USDT_B`$

$`Total USDT = \left( y_1 - \frac{a}{x_1 + \alpha \times k} \right) + \left( y_2 - \frac{b}{x_2 + (1 - \alpha) \times k} \right)`$

Optimization Problem:

Maximize Total USDT with respect to $`\alpha`$:

$$\max_\alpha \left( \left( y_1 - \frac{a}{x_1 + \alpha \times k} \right) + \left( y_2 - \frac{b}{x_2 + (1 - \alpha) \times k} \right) \right)$$

You can solve this optimization problem by finding the first derivative and using the zero condition. It turns out that the optimal condition is that the prices of the two pools after the exchange are equal, which aligns with the no-arbitrage assumption in finance.

The equilibrium condition is as follows:

$$ \frac{y_1 - \text{USDT}_a}{x_1 + \alpha k} = \frac{y_2 - \text{USDT}_b}{x_2 + (1 - \alpha) k} $$

and we get:

$$  \frac{a}{(x_1 + \alpha k)^2} = \frac{b}{(x_2 + (1 - \alpha) k)^2} $$


### Expansion: from Two to Multiple Chains

Based on the equilibrium condition, which is the no-arbitrage condition of equal prices, we can derive that in the case of three chains, the equilibrium condition follows:

$$ 
\frac{a}{(x_1 + \alpha k)^2} = \frac{b}{(x_2 + \beta k)^2} = \frac{c}{(x_3 + (1 - \alpha - \beta)k)^2} 
$$

Where:
- $a, b, c$ are the constants for each chain's liquidity pool.
- $x_1, x_2, x_3$ are the initial amounts of tokens on chains 1, 2, and 3 respectively.
- $\alpha, \beta$ are the fractions of $k$ distributed to chains 1 and 2 respectively.
- $k$ is the total amount to be distributed.
- $( 1 - \alpha - \beta)$ is the fraction of $k$ distributed to chain 3.


Therefore, we can derive that in the case of an infinite number of chains, the equilibrium condition follows:

$$
\frac{a_1}{(x_1 + \alpha_1 k)^2} = \frac{a_2}{(x_2 + \alpha_2 k)^2} = \frac{a_3}{(x_3 + \alpha_3 k)^2} = \ldots = \frac{a_n}{(x_n + \alpha_n k)^2}
$$

Where:
- $a_i$ is the constant for the $i$-th chain's liquidity pool.
- $x_i$ is the initial amount of tokens on the $i$-th chain.
- $\alpha_i$ is the fraction of $k$ distributed to the $i$-th chain.
- $k$ is the total amount to be distributed.
- $\sum_{i=1}^{\infty} \alpha_i = 1$ ensures that the total distribution fractions sum up to 1.

In this scenario, each chain $i$ will have its liquidity pool adjusted according to the fraction $\alpha_i$ of the total amount $k$ being distributed. The equilibrium condition maintains the no-arbitrage principle across an infinite number of chains, ensuring that the price remains equal across all chains.





