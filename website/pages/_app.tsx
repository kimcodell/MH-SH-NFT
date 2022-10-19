import type { AppProps } from 'next/app'
import MetamaskProvider from '@contexts/metamaskContext'
import KaikasProvider from '@contexts/kaikasContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <KaikasProvider>
        <Component {...pageProps} />
      </KaikasProvider>
    </MetamaskProvider>
  );
}

export default MyApp
