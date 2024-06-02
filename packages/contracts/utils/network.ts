import "dotenv/config";
import { zeroAddress } from "viem";
export function node_url(networkName: string): string {
  if (networkName) {
    const uri = process.env["ETH_NODE_URI_" + networkName.toUpperCase()];
    if (uri && uri !== "") {
      return uri;
    }
  }

  if (networkName === "localhost") {
    // do not use ETH_NODE_URI
    return "http://localhost:8545";
  }

  let uri = process.env.ETH_NODE_URI;
  if (uri) {
    uri = uri.replace("{{networkName}}", networkName);
  }
  if (!uri || uri === "") {
    // throw new Error(`environment variable "ETH_NODE_URI" not configured `);
    return "";
  }
  if (uri.indexOf("{{") >= 0) {
    throw new Error(`invalid uri or network not supported by node provider : ${uri}`);
  }
  return uri;
}

export function getMnemonic(networkName?: string): string {
  if (networkName) {
    const mnemonic = process.env["MNEMONIC_" + networkName.toUpperCase()];
    if (mnemonic && mnemonic !== "") {
      return mnemonic;
    }
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic === "") {
    return "test test test test test test test test test test test junk";
  }
  return mnemonic;
}

export function accounts(networkName?: string): string[] {
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    privateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
  }
  return [privateKey];
}

export function getWETH(chainIdString: string): string {
  const chainId = Number(chainIdString);
  switch (chainId) {
    // sepolia
    case 11155111:
      return "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
    // amoy
    case 80002:
      return "0x52eF3d68BaB452a294342DC3e5f464d7f610f72E";
    // base seplia:
    case 84532:
      return "0x999b45bb215209e567faf486515af43b8353e393";
    // avax fuji
    case 43113:
      return "0x51afAcC997Ac9c3fEC1BbeeDdd2373772C3D96DC";
    default:
      return zeroAddress;
  }
}

export function getRouter(chainIdString: string): string {
  const chainId = Number(chainIdString);
  switch (chainId) {
    // bnb chain
    case 97:
      return "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f";
    // sepolia
    case 11155111:
      return "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
    // arb sepolia
    case 421614:
      return "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165";
    // base sepolia
    case 84532:
      return "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93";
    // op sepolia
    case 11155420:
      return "0x114A20A10b43D4115e5aeef7345a1A71d2a60C57";
    // fujin
    case 43113:
      return "0xF694E193200268f9a4868e4Aa017A0118C9a8177";
    // amoy
    case 80002:
      return "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2";
    default:
      throw Error("unknown network");
  }
}

export function getAggregator(chainIdString: string): string {
  const chainId = Number(chainIdString);
  switch (chainId) {
    // bnb chain
    case 97:
      return "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";
    // arb sepolia
    case 421614:
      return "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165";
    // base sepolia
    case 84532:
      return "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
    // op sepolia
    case 11155420:
      return "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7";
    // fujin
    case 43113:
      return "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
    default:
      throw Error("unknown network");
  }
}
