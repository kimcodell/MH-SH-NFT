import { KaikasProvider } from '@utils/types/types';
import Caver from "caver-js";
import { useCallback, useEffect, useState } from "react";
import { useKaikasDispatch, useKaikasSelector } from '@contexts/kaikasContext';

const KlaytnNetworkVersion = { cypress: 8217, baobab: 1001 };

export default function useKaikas () {
  const state = useKaikasSelector();
  const {selectedAddress} = state;
  const dispatch = useKaikasDispatch();

  const [klaytn, setKlaytn] = useState<KaikasProvider>();
  const [caver, setCaver] = useState<Caver>();

  console.log(
    'selected address :', state.selectedAddress,
    'is installed :', state.isInstalled,
    'is connected :',state.isConnected,
    'is locked :', state.isLocked,
    'current network :', state.currentNetwork,
  );

  const connect = useCallback(async () => {
    if (!klaytn) return;
    try {
      await klaytn.enable();
      dispatch({type: 'SET_IS_CONNECTED', data: true});
      dispatch({type: 'SET_WALLET_ADDRESS', data: klaytn.selectedAddress});
      return klaytn.selectedAddress;
    } catch (error) {
      dispatch({type: 'SET_IS_CONNECTED', data: false});
      console.error(error);
    }
  }, [dispatch, klaytn]);

  const deployContract = useCallback(async (params: {abi: any; bytecode: string; args: any[]}) => {
    if (!caver || !selectedAddress) return;
    const {abi, bytecode, args} = params;
    const contract = new caver.klay.Contract(abi);

    const result = await contract
      .deploy({ data: bytecode, arguments: [...args] })
      .send({ from: selectedAddress, gas: 8000000 }, function (error, transactionHash) {
        console.log({ error, transactionHash });
      })
      .catch(console.error);

    return result;
  }, [caver, selectedAddress]);

  const callContract = useCallback(async (params: {
    abi: {
      constant?: boolean;
      name: string;
      type: string;
      inputs: { type: string; name: string }[];
      outputs?: { type: string; name: string }[];
    };
    value?: any;
    args: any[];
    contractAddress: string;}) => {
      if (!caver || !klaytn) return;
      const { abi, args, contractAddress, value } = params;

      const data = caver.klay.abi.encodeFunctionCall(abi, [...args]);
      const from = klaytn.selectedAddress;
      console.log({ contractAddress, from, value, data });
      const gas = await caver.rpc.klay.estimateGas({ to: contractAddress, from, input: data }).catch((err) => {
        console.error(err);
        return '8000000';
      });
      console.log({ gas });
      const response = await caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from,
        to: contractAddress,
        gas,
        data,
        value,
      });
      return response;
  }, [caver, klaytn])

  useEffect(() => {
    const klaytn = window.klaytn;
    if (klaytn && typeof klaytn !== 'undefined') {
      const dispatchNetwork = (klaytn: KaikasProvider) => {
        if (klaytn.networkVersion === KlaytnNetworkVersion.cypress) {
          dispatch({type:'SET_NETWORK', data: 'Klaytn Mainnet'});
        }
        if (klaytn.networkVersion === KlaytnNetworkVersion.baobab) {
          dispatch({type:'SET_NETWORK', data: 'Klaytn Testnet'});
        }
      }

      klaytn.autoRefreshOnNetworkChange = false;
      const caver = new Caver((klaytn) as any);
      setKlaytn(klaytn);
      setCaver(caver);

      dispatchNetwork(klaytn);

      klaytn.on('accountsChanged', (accounts: string[]) => {
        dispatch({type: 'SET_WALLET_ADDRESS', data: accounts[0]})
      })

      klaytn.on('networkChanged', () => {
        dispatchNetwork(klaytn);
      })

      dispatch({type: 'SET_IS_INSTALLED', data: true});
      (async () => {
        dispatch({type: 'SET_IS_LOCKED', data: !(await klaytn._kaikas.isUnlocked())});
      })();
    } else {
      dispatch({type: 'SET_IS_INSTALLED', data: false});
      dispatch({type: 'SET_IS_LOCKED', data: true});
      dispatch({type: 'SET_IS_CONNECTED', data: false});
    }
  }, [dispatch])

  return {
    ...state,
    klaytn,
    caver,
    connect,
    deployContract,
    callContract,
  };
}