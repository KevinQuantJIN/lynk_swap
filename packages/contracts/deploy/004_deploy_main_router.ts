import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { keccak256, stringToBytes } from "viem";
import { getRouter } from "../utils/network";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await hre.getChainId();
  const router = getRouter(chainId);

  await deploy("LynkSwapRouter", {
    from: deployer,
    args: [],
    proxy: {
      proxyContract: "ERC1967Proxy",
      proxyArgs: ["{implementation}", "{data}"],
      execute: {
        init: {
          methodName: "initialize",
          // chain selector
          // a for amoy, b for base sepolia, c for fuji
          args: [router, "16281711391670634445", "10344971235874465080", "14767482510784806043"],
        },
      },
      upgradeFunction: {
        methodName: "upgradeToAndCall",
        upgradeArgs: ["{implementation}", "{data}"],
      },
      checkProxyAdmin: false,
    },
    deterministicDeployment: keccak256(stringToBytes("LynkSwapRouter")),
    log: true,
  });
};
export default func;
func.tags = ["MainRouter"];
