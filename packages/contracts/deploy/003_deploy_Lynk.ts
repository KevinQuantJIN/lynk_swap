import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { keccak256, stringToBytes } from "viem";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;

  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Lynk", {
    from: deployer,
    args: [],
    deterministicDeployment: keccak256(stringToBytes("Lynk")),
    log: true,
  });
};
export default func;
func.tags = ["Lynk"];
