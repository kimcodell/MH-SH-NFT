import { useCallback } from 'react';
import { useEffect } from 'react';
import useMetamask from '@hooks/useMetamask';
import useKaikas from '@hooks/useKaikas';
import { useWalletDispatch, useWalletSelector } from '@contexts/walletContext';
export default function useWallet() {
  const state = useWalletSelector();
  const {currentNetwork, currentWalletAddress} = state;
  const dispatch = useWalletDispatch();

  const {currentNetwork: kaikasNetwork, selectedAddress: kaikasAddress, connect: connectKaikas} = useKaikas();
  const {currentNetwork: metamaskNetwork, selectedAddress: metamaskAddress, connect: connectMetamask} = useMetamask();

  useEffect(() => {
    if (currentNetwork?.includes('Klaytn')) {
      dispatch({type: 'SET_WALLET_ADDRESS', data: kaikasAddress || ''});
    } else if (currentNetwork?.includes('Ethereum')) {
      dispatch({type: 'SET_WALLET_ADDRESS', data: metamaskAddress || ''});
    } else {
      dispatch({type: 'SET_WALLET_ADDRESS', data: metamaskAddress || ''});
    }

  }, [dispatch, currentNetwork, kaikasAddress, metamaskAddress]);

  const connect = useCallback(async () => {
    if (currentNetwork?.includes('Klaytn')) {
      if (currentNetwork !== kaikasNetwork) {
        console.log('지갑 네트워크와 선택된 네트워크가 일치하지 않습니다.');
        throw new Error('지갑 네트워크와 선택된 네트워크가 일치하지 않습니다.');
      }
      const address = await connectKaikas();
      return address;
    } else {
      if (currentNetwork !== metamaskNetwork) {
        console.log('지갑 네트워크와 선택된 네트워크가 일치하지 않습니다.');
        throw new Error('지갑 네트워크와 선택된 네트워크가 일치하지 않습니다.');
      }
      const address = await connectMetamask();
      return address;
    }
  }, [currentNetwork, connectKaikas, connectMetamask, kaikasNetwork, metamaskNetwork]);

  return {...state, connect};
}