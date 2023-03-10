import { providers } from "ethers";

export const config = {
  provider: new providers.JsonRpcProvider("https://mainnet.aurora.dev"),
  chainID: "1313161554",
  explorer: "https://explorer.aurora.dev",
};
