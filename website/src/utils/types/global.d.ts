import { KaikasProvider, MetaMaskProvider } from "./types";

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
    klaytn?: KaikasProvider;
  }
}