export type MetamaskNetworkType = 'Ethereum Mainnet' | 'Ethereum Testnet' | 'Polygon Mainnet' | 'Polygon Testnet';
export type KaikaNetworkType = 'Klaytn Mainnet' | 'Klaytn Testnet';
export type NetworkType = MetamaskNetworkType | KaikaNetworkType;

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  request(params: any): Promise<any>;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
}