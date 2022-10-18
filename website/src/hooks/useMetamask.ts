import { MetamaskNetworkType } from '@utils/types/types';
import { MetaMaskEthereumProvider } from './../utils/types/types';
import { useMetamaskDispatch, useMetamaskSelector } from "@contexts/metamaskContext";
import { useCallback, useEffect, useState } from "react";
import Web3 from 'web3';

const CHAINID = {
  'Ethereum Mainnet': '0x1',
  'Ethereum Testnet': '0x5',
  'Polygon Mainnet': '0x89',
  'Polygon Testnet': '0x13881',
};

export default function useMetamask () {
  const state = useMetamaskSelector();
  const dispatch = useMetamaskDispatch();

  const [ethereum, setEthereum] = useState<MetaMaskEthereumProvider>();
  const [web3, setWeb3] = useState<Web3>();

  console.log('selected address :', state.selectedAddress, 'is installed :', state.isInstalled, 'is connected :',state.isConnected,'is locked :', state.isLocked)

  const connect = useCallback(async () => {
    if (!ethereum) return;
    try {
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      if (!accounts || accounts.length === 0) {
        dispatch({type: 'SET_IS_CONNECTED', data: false});
        return;
      }
      dispatch({type: 'SET_WALLET_ADDRESS', data: accounts[0]});
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

  const deployContract = useCallback(async () => {

  }, []);

  const callContract = useCallback(async () => {

  }, [])

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum && typeof ethereum !== 'undefined') {
      const web3 = new Web3((ethereum) as any);
      console.log('web3.givenProvider', web3.givenProvider, web3.currentProvider);
      setEthereum(ethereum);
      setWeb3(web3);
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
  };
}