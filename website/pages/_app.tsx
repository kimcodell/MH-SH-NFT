import type { AppProps } from 'next/app'
import MetamaskProvider from '@contexts/metamaskContext'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
    </MetamaskProvider>
  );
}

export default MyApp
