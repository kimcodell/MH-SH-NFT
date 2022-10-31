import { MetamaskNetworkType } from '@utils/types/types';
import { MetaMaskProvider } from './../utils/types/types';
import { useMetamaskDispatch, useMetamaskSelector } from "@contexts/metamaskContext";
import { useCallback, useEffect, useState } from "react";
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const CHAINID = {
  'Ethereum Mainnet': '0x1',
  'Ethereum Testnet': '0x5',
  'Polygon Mainnet': '0x89',
  'Polygon Testnet': '0x13881',
};

const MetamaskChainId = {
  ethereum: 1,
  goerli: 5,
  polygon: 137,
  mumbai: 80001,
}

export default function useMetamask () {
  const state = useMetamaskSelector();
  const dispatch = useMetamaskDispatch();

  const [ethereum, setEthereum] = useState<MetaMaskProvider>();
  const [web3, setWeb3] = useState<Web3>();

  console.log(
    'selected address :', state.selectedAddress,
    'is installed :', state.isInstalled,
    'is connected :',state.isConnected,
    'is locked :', state.isLocked,
    'current network :', state.currentNetwork,
  );

  const connect = useCallback(async () => {
    if (!ethereum) return;
    try {
      const accounts = await ethereum.request({method: 'eth_requestAccounts'}) as string[];
      if (!accounts || accounts.length === 0) {
        dispatch({type: 'SET_IS_CONNECTED', data: false});
        return;
      }
      dispatch({type: 'SET_WALLET_ADDRESS', data: accounts[0]});
      return accounts[0];
    } catch (error) {
      dispatch({type: 'SET_IS_CONNECTED', data: false});
      console.error(error);
    }
  }, [dispatch, ethereum]);

  const switchNetwork = useCallback(async (network: keyof typeof CHAINID, networkInterface: any) => {
    await ethereum?.request({method: 'wallet_switchEthereumChain', params: [{ chainId: CHAINID[network] }]})
      .then(() => {
        dispatch({type: 'SET_NETWORK', data: CHAINID[network] as MetamaskNetworkType});
      })
      .catch((error) => {
        console.error(error);
        if (error.code === 4902) {
          ethereum
            .request({
              method: 'wallet_addEthereumChain',
              params: [networkInterface],
            })
            .then(() => {
              dispatch({type: 'SET_NETWORK', data: CHAINID[network] as MetamaskNetworkType});
            });
        }
      });
    try {
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, ethereum])

  const deployContract = useCallback(async (params: {abi: any; bytecode: string; args: any[]; from: string}) => {
    if (!web3) return;
    const {abi, bytecode, args, from} = params;
    const contract = new web3.eth.Contract(abi);
    const result = await contract.deploy({ data: bytecode, arguments: args }).send({from});
    return result;
  }, [web3]);

  const callContract = useCallback(async (params: {abi: any; contractAddress: string; methodName: string; args: any[]; from: string; value?: string | number | BigNumber}) => {
    if (!web3) return;
    const {abi, contractAddress, methodName, args, from, value} = params;
    const contract = new web3.eth.Contract(abi, contractAddress);
    const method = contract.methods[methodName];
    const gas = await method(...args).estimateGas({from, ...(value ? {value} : {})});
    const result = await method(...args).send({from, gas, ...(value ? {value} : {})});
    return result;
  }, [web3]);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum && typeof ethereum !== 'undefined') {
      const dispatchNetwork = async (web3: Web3) => {
        const chainId = await web3.eth.getChainId();
        let data: MetamaskNetworkType | undefined;
        if (chainId === MetamaskChainId.ethereum) {
          data = 'Ethereum Mainnet';
        }
        if (chainId === MetamaskChainId.goerli) {
          data = 'Ethereum Testnet';
        }
        if (chainId === MetamaskChainId.polygon) {
          data = 'Polygon Mainnet';
        }
        if (chainId === MetamaskChainId.mumbai) {
          data = 'Polygon Testnet';
        }
        if (!data) return;
        dispatch({type: 'SET_NETWORK', data});
      };

      const web3 = new Web3((ethereum) as any);
      setEthereum(ethereum);
      setWeb3(web3);

      dispatchNetwork(web3);

      ethereum.on('chainChanged', () => {
        dispatchNetwork(web3)
      })

      ethereum.on('accountsChanged', (accounts: string[]) => {
        dispatch({type: 'SET_WALLET_ADDRESS', data: accounts[0]});
      })

      dispatch({type: 'SET_IS_INSTALLED', data: true});
      dispatch({type: 'SET_IS_LOCKED', data: false});
    } else {
      dispatch({type: 'SET_IS_INSTALLED', data: false});
      dispatch({type: 'SET_IS_LOCKED', data: true});
      dispatch({type: 'SET_IS_CONNECTED', data: false});
    }
  }, [dispatch])

  return {
    ...state,
    ethereum,
    web3,
    connect,
    switchNetwork,
    deployContract,
    callContract,
  };
}