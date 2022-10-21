import { ButtonShort } from "@components/ButtonShort";
import useKaikas from "@hooks/useKaikas";
import useMetamask from "@hooks/useMetamask";
import { METAMASK_NETWORK_INTERFACE } from "@utils/constants";
import ethereumContractABI from "@utils/contracts/metamask/abi";
import ethereumContractBytecode from "@utils/contracts/metamask/bytecode";
import type { NextPage } from "next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import * as IPFS from 'ipfs-core'
import type {IPFS as IIPFS} from 'ipfs-core'

const Home: NextPage = () => {
  const { connect, deployContract, switchNetwork, callContract, selectedAddress } = useMetamask();
  const {} = useKaikas();
  useEffect(() => {
    connect();
  }, [connect]);

  const [ipfs, setIpfs] = useState<IIPFS | null>(null);

  useEffect(() => {
    if (!ipfs) {
      (async () => {
        await IPFS.create()
          .then(ipfs => setIpfs(ipfs))
          .catch(console.error);
      })();
    }
  }, [ipfs]);

  const onDeploy = useCallback(async () => {
    if (!selectedAddress) return;
    const result = await deployContract({
      abi: ethereumContractABI,
      bytecode: ethereumContractBytecode,
      args: ["MH ♥️ SH NFT", "MST"],
      from: selectedAddress,
    });
    console.log(result);
  }, [selectedAddress, deployContract]);

  const onMint = useCallback(async () => {
    if (!selectedAddress) return;
    const result = await callContract({
      abi: ethereumContractABI,
      contractAddress: "0xaCC16981e75BD26e6725F066eC5a2C42b35E8807",
      args: [selectedAddress, ""],
      from: selectedAddress,
      methodName: "mint",
    });
    console.log(result);
  }, [selectedAddress, callContract]);

  const onSwitchNetwork = useCallback(async () => {
    await switchNetwork("Polygon Testnet", METAMASK_NETWORK_INTERFACE["Polygon Testnet"]);
  }, [switchNetwork]);

  const [imageUrl, setImageUrl] = useState('');

  const onUploadImageIPFS = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file || !ipfs) return;
    const result = await ipfs.add(file);
    console.log('result', result);
    setImageUrl('https://ipfs.io/ipfs/' + result.path);
  }, [ipfs])

  return (
    <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px', alignItems: 'flex-start', margin: '50px 20vw'}}>
        <ButtonShort label="네트워크 변경" onClick={onSwitchNetwork}/>
        <ButtonShort label="Deploy" onClick={onDeploy} />
        <ButtonShort label="Mint" onClick={onMint} />
        <input type="file" accept="image/png, image/jpg, image/jpeg, image/gif" onChange={onUploadImageIPFS} />
        {imageUrl && <a href={imageUrl} target='blank'>{imageUrl}</a>}
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
