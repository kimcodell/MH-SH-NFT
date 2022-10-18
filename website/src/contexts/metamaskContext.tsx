import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { MetamaskNetworkType } from '@utils/types/types';

interface State {
  isInstalled: boolean;
  isLocked: boolean;
  isConnected: boolean;
  currentNetwork: MetamaskNetworkType | null;
  selectedAddress: string | null;
}

type Action =
  | {type: 'SET_IS_INSTALLED', data: boolean}
  | {type: 'SET_IS_LOCKED', data: boolean}
  | {type: 'SET_IS_CONNECTED', data: boolean}
  | {type: 'SET_NETWORK', data: MetamaskNetworkType}
  | {type: 'SET_WALLET_ADDRESS', data: string};

const initialMetamask: State = {
  isInstalled: false,
  isLocked: true,
  isConnected: false,
  selectedAddress: null,
  currentNetwork: null,
}


const MetamaskStateContext = createContext<State>(initialMetamask);
const MetamaskDispatchContext = createContext<Dispatch<Action> | null>(null);

const metamaskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_IS_INSTALLED':
      return {...state, isInstalled: action.data};
    case 'SET_IS_LOCKED':
      return {...state, isLocked: action.data};
    case 'SET_IS_CONNECTED':
      return {...state, isConnected: action.data};
    case 'SET_WALLET_ADDRESS':
      return {...state, selectedAddress: action.data}
    case 'SET_NETWORK':
      return {...state, currentNetwork: action.data};
    default:
      throw new Error('no action :' + action);
  }
}

interface MetamaskProviderProps {
  children : ReactNode;
}

export default function MetamaskProvider ({children}: MetamaskProviderProps) {
  const [value, dispatch] = useReducer(metamaskReducer, initialMetamask);

  return (
  <MetamaskStateContext.Provider value={value}>
    <MetamaskDispatchContext.Provider value={dispatch}>
      {children}
    </MetamaskDispatchContext.Provider>
  </MetamaskStateContext.Provider>
  )
}

export const useMetamaskSelector =() => {
  const state = useContext(MetamaskStateContext);
  return state;
}

export const useMetamaskDispatch = () => {
  const dispatch = useContext(MetamaskDispatchContext);
  if (!dispatch) throw new Error('metamask dispatch is null')
  return dispatch;
}