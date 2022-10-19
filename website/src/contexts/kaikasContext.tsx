import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { KaikasNetworkType } from '@utils/types/types';

interface State {
  isInstalled: boolean;
  isLocked: boolean;
  isConnected: boolean;
  currentNetwork: KaikasNetworkType | null;
  selectedAddress: string | null;
}

type Action =
  | {type: 'SET_IS_INSTALLED', data: boolean}
  | {type: 'SET_IS_LOCKED', data: boolean}
  | {type: 'SET_IS_CONNECTED', data: boolean}
  | {type: 'SET_NETWORK', data: KaikasNetworkType}
  | {type: 'SET_WALLET_ADDRESS', data: string};

const initialKaikas: State = {
  isInstalled: false,
  isLocked: true,
  isConnected: false,
  selectedAddress: null,
  currentNetwork: null,
}


const KaikasStateContext = createContext<State>(initialKaikas);
const KaikasDispatchContext = createContext<Dispatch<Action> | null>(null);

const KaikasReducer = (state: State, action: Action): State => {
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

interface KaikasProviderProps {
  children : ReactNode;
}

export default function KaikasProvider ({children}: KaikasProviderProps) {
  const [value, dispatch] = useReducer(KaikasReducer, initialKaikas);

  return (
  <KaikasStateContext.Provider value={value}>
    <KaikasDispatchContext.Provider value={dispatch}>
      {children}
    </KaikasDispatchContext.Provider>
  </KaikasStateContext.Provider>
  )
}

export const useKaikasSelector =() => {
  const state = useContext(KaikasStateContext);
  return state;
}

export const useKaikasDispatch = () => {
  const dispatch = useContext(KaikasDispatchContext);
  if (!dispatch) throw new Error('Kaikas dispatch is null')
  return dispatch;
}