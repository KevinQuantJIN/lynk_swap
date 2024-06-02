import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { keccak256, stringToBytes, zeroAddress } from "viem";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("UniswapV2Factory", {
    from: deployer,
    args: [zeroAddress],
    deterministicDeployment: keccak256(stringToBytes("UniswapV2Factory")),
    log: true,
  });
};
export default func;
func.tags = ["UniswapV2Factory", "Uniswap"];
