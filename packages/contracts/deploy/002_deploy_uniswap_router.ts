import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { keccak256, stringToBytes, zeroAddress } from "viem";
import { getWETH } from "../utils/network";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const chainId = await hre.getChainId();

  const { deploy, get } = deployments;
  const factory = await get("UniswapV2Factory");

  const weth = getWETH(chainId);

  const { deployer } = await getNamedAccounts();

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factory.address, weth],
    deterministicDeployment: keccak256(stringToBytes("UniswapV2Router02")),
    log: true,
  });
};
export default func;
func.tags = ["UniswapV2Router02", "Uniswap"];
