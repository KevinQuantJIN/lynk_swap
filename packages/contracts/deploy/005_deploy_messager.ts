import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { keccak256, stringToBytes } from "viem";
import { getRouter } from "../utils/network";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await hre.getChainId();
  const router = getRouter(chainId);

  const uniRouter = await get("UniswapV2Router02");

  await deploy("LynkMessager", {
    from: deployer,
    args: [],
    proxy: {
      proxyContract: "ERC1967Proxy",
      proxyArgs: ["{implementation}", "{data}"],
      execute: {
        init: {
          methodName: "initialize",
          args: [router, uniRouter.address],
        },
      },
      upgradeFunction: {
        methodName: "upgradeToAndCall",
        upgradeArgs: ["{implementation}", "{data}"],
      },
      checkProxyAdmin: false,
    },
    deterministicDeployment: keccak256(stringToBytes("LynkMessager")),
    log: true,
  });
};
export default func;
func.tags = ["LynkMessager"];
