import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { NetworkType } from '@utils/types/types';

interface State {
  currentNetwork: NetworkType | null;
  currentWalletAddress: string | null;
}

type Action = {type: 'SET_NETWORK', data: NetworkType} | {type: 'SET_WALLET_ADDRESS', data: string};

const initialState: State = {
  currentWalletAddress: null,
  currentNetwork: null,
}


const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

const walletReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_WALLET_ADDRESS':
      return {...state, currentWalletAddress: action.data}
    case 'SET_NETWORK':
      return {...state, currentNetwork: action.data};
    default:
      throw new Error('no action :' + action);
  }
}

interface KaikasProviderProps {
  children : ReactNode;
}

export default function WalletProvider ({children}: KaikasProviderProps) {
  const [value, dispatch] = useReducer(walletReducer, initialState);

  return (
  <StateContext.Provider value={value}>
    <DispatchContext.Provider value={dispatch}>
      {children}
    </DispatchContext.Provider>
  </StateContext.Provider>
  )
}

export const useWalletSelector =() => {
  const state = useContext(StateContext);
  return state;
}

export const useWalletDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error('Wallet dispatch is null')
  return dispatch;
}