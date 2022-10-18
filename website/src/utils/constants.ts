
export const METAMASK_NETWORK_INTERFACE = {
  'Ethereum Mainnet': {},
  'Ethereum Testnet': {},
  'Polygon Mainnet': {
    chainId: '0x89',
    rpcUrls: ['https://polygon-rpc.com/'],
    chainName: 'Matic Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.matic.network'],
  },
  'Polygon Testnet': {
    chainId: '0x13881',
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com'],
  },
};
