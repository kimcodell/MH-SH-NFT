import { ButtonShort } from "@components/atoms/ButtonShort";
import useKaikas from "@hooks/useKaikas";
import useMetamask from "@hooks/useMetamask";
import { METAMASK_NETWORK_INTERFACE } from "@utils/constants";
import ethereumContractABI from "@utils/contracts/metamask/abi";
import ethereumContractBytecode from "@utils/contracts/metamask/bytecode";
import type { NextPage } from "next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import * as IPFS from 'ipfs-core'
import type {IPFS as IIPFS} from 'ipfs-core'
import Modal from "@components/atoms/Modal";
import { useWalletDispatch } from "@contexts/walletContext";
import useWallet from "@hooks/useWallet";

const Home: NextPage = () => {
  const walletDispatch = useWalletDispatch();

  const { currentNetwork, currentWalletAddress, connect } = useWallet();
  const { deployContract, switchNetwork, callContract, selectedAddress, currentNetwork: metamaskNetwork } = useMetamask();
  const { currentNetwork: kaikasNetwork, callContract: callKlaytnContract } = useKaikas();

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

  const onConnect = useCallback(async () => {
    const address = await connect();
    setTimeout(() => {
      setInputAddress(address || 'null');
    }, 500);
  }, [connect]);

  const [imageUrl, setImageUrl] = useState('');

  const onUploadImageIPFS = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file || !ipfs) return;
    const result = await ipfs.add(file);
    console.log('result', result);
    setImageUrl('https://ipfs.io/ipfs/' + result.path);
  }, [ipfs]);

  const [inputAddress, setInputAddress] = useState('');

  const onMintEtherERC20 = async () => {
    const result = await callContract({
      abi: [{
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }],
      methodName: 'mint',
      contractAddress: '0x98698E8b812031368791A2Da7cE61e4553bdFe39',
      args: [10000],
      from: currentWalletAddress || '',
    });
    console.log('result', result);
  };

  const onMintEtherERC721 = async () => {
    const result = await callContract({
      abi: [{
				inputs: [
					{
						internalType: "uint256",
						name: "applyAmount",
						type: "uint256"
					}
				],
				name: "mintMutipleToken",
				stateMutability: "nonpayable",
				outputs: [],
				type: "function"
			}],
      args: [100],
      contractAddress: '0x9716d2dE63E594995A5453ba1994e67E63FCaB20',
      methodName: 'mintMutipleToken',
      from: currentWalletAddress || '',
    });
    console.log('result', result);
  };

  const onMintPolygonERC20 = async () => {
    const result = await callContract({
      abi: [{
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }],
      methodName: 'mint',
      contractAddress: '0x1f3606e66ED4692D23D6E4AB996fb73D3B4cEAe7',
      args: [1000000],
      from: currentWalletAddress || '',
    });
    console.log('result', result);
  }

  const onMintPolygonERC721 = async () => {
    const result = await callContract({
      abi: [{
				inputs: [
					{
						internalType: "uint256",
						name: "applyAmount",
						type: "uint256"
					}
				],
				name: "mintMutipleToken",
				stateMutability: "nonpayable",
				outputs: [],
				type: "function"
			}],
      args: [100],
      contractAddress: '0x5BA6BE5Bdcd5cF38C2BFB29509Baa427548A783B',
      methodName: 'mintMutipleToken',
      from: currentWalletAddress || '',
    });
    console.log('result', result);
  }

  const onMintKlaytnCampaign = useCallback(async () => {
    const result = await callKlaytnContract({
      abi: {
        constant: false,
        inputs: [
          {
            name: "addresses",
            type: "address[]"
          },
          {
            name: "amounts",
            type: "uint256[]"
          }
        ],
        name: "mintTo",
        outputs: [],
        type: "function"
      },
      contractAddress: '0xfF95e7b249CDC80c9e081F27eE110fB7253bF709',
      args: [
        ['0x4842923020fB0732F395C99bE5F49831199BB03C'],
        ['13'],
      ],
    });
    console.log('result', result);
  }, [callKlaytnContract]);

  useEffect(() => {
    console.log('초기화');
    setInputAddress('');
  }, [currentNetwork, currentWalletAddress, metamaskNetwork, kaikasNetwork])

  return (
    <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px', alignItems: 'flex-start', margin: '50px 20vw'}}>
        <form onChange={(e: ChangeEvent<HTMLFormElement>) => {
          console.log(e.target.value);
          walletDispatch({type: 'SET_NETWORK', data: e.target.value})
          }}>
          <input type='radio' value='Klaytn Mainnet' name="Network"/>
          <input type='radio' value='Klaytn Testnet' name="Network"/>
          <input type='radio' value='Ethereum Mainnet' name="Network"/>
          <input type='radio' value='Ethereum Testnet' name="Network"/>
          <input type='radio' value='Polygon Mainnet' name="Network"/>
          <input type='radio' value='Polygon Testnet' name="Network"/>
        </form>
        <div>currentNetwork : {currentNetwork}</div>
        <div>currentWallet : {currentWalletAddress}</div>


        <ButtonShort label="Connect" onClick={onConnect}/>
        <div>inputAddress : {inputAddress}</div>
        <ButtonShort label="네트워크 변경" onClick={onSwitchNetwork}/>
        <ButtonShort label="Deploy" onClick={onDeploy} />
        <ButtonShort label="Mint" onClick={onMint} />
        <input type="file" accept="image/png, image/jpg, image/jpeg, image/gif" onChange={onUploadImageIPFS} />
        {imageUrl && <a href={imageUrl} target='blank'>{imageUrl}</a>}
        {/* <Modal open><>123123</></Modal> */}

        {/* <ButtonShort label="민팅 클레이튼 토큰" onClick={onMintKlaytnKIP7}/> */}
        <ButtonShort label="민팅 이더리움 토큰" onClick={onMintEtherERC20}/>
        <ButtonShort label="민팅 폴리곤 토큰" onClick={onMintPolygonERC20}/>

        <ButtonShort label="민팅 클레이튼 NFT" onClick={onMintKlaytnCampaign}/>
        <ButtonShort label="민팅 이더리움 NFT" onClick={onMintEtherERC721}/>
        <ButtonShort label="민팅 폴리곤 NFT" onClick={onMintPolygonERC721}/>
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
