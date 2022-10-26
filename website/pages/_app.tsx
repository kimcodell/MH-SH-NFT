import type { AppProps } from 'next/app'
import MetamaskProvider from '@contexts/metamaskContext'
import KaikasProvider from '@contexts/kaikasContext';
import WalletProvider from '@contexts/walletContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <MetamaskProvider>
        <KaikasProvider>
          <Component {...pageProps} />
        </KaikasProvider>
      </MetamaskProvider>
    </WalletProvider>
  );
}

export default MyApp
