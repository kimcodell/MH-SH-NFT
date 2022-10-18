import { MetaMaskEthereumProvider } from "./types";

declare global {
  interface Window {
    ethereum?: MetaMaskEthereumProvider;
    klaytn?: any;
  }
}