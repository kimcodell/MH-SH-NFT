export type MetamaskNetworkType = 'Ethereum Mainnet' | 'Ethereum Testnet' | 'Polygon Mainnet' | 'Polygon Testnet';
export type KaikasNetworkType = 'Klaytn Mainnet' | 'Klaytn Testnet';
export type NetworkType = MetamaskNetworkType | KaikasNetworkType;

export interface MetaMaskProvider {
  isMetaMask?: boolean;
  request(params: any): Promise<unknown>;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
  isConnected(): boolean;
}

export interface KaikasProvider {
  isKaikas: boolean;
  on: (eventName: string, callback: (params?: any) => void) => void;
  enable: () => Promise<Array<string>>;
  sendAsync: (options: any, callback: (err: any, result: any) => void) => Promise<void>;
  autoRefreshOnNetworkChange: boolean;
  selectedAddress: string;
  networkVersion: number;
  _kaikas: {
    isEnabled: () => boolean;
    isApproved: () => Promise<boolean>;
    isUnlocked: () => Promise<boolean>;
  };
}