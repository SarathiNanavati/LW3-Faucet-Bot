import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { BigNumber, Wallet, providers, ethers, utils, Contract, Transaction } from "ethers";
import { config } from "../../config/config";
const ERC20_ABI = require("erc-20-abi");

const { networks, web3Config } = config;

export const getSigner = async (chain: string): Promise<Wallet> => {
  let signer: Wallet;

  if (chain === "alfajores") {
    const provider: CeloProvider = new CeloProvider(networks[chain].nodeRpcURL);
    await provider.ready;
    signer = new CeloWallet(web3Config.supplierPrivateKey, provider);
  } else {
    const provider: providers.StaticJsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(
      networks[chain].nodeRpcURL,
      networks[chain].chainId
    );
    signer = new ethers.Wallet(web3Config.supplierPrivateKey, provider);
  }
  return signer;
};

export const getContract = async (signer: Wallet, address: string): Promise<Contract> => {
  return new ethers.Contract(address, ERC20_ABI, signer);
};

export const getBalance = async (chain: string, token: string): Promise<BigNumber> => {
  const signer: Wallet = await getSigner(chain);

  if (networks[chain].tokens[token].nativeToken) {
    return await signer.provider.getBalance(signer.address);
  } else {
    const contract: Contract = await getContract(
      signer,
      networks[chain].tokens[token].contractAddress
    );
    return await contract.balanceOf(signer.address);
  }
};

export const transferNativeToken = async (
  address: string,
  chain: string,
  token: string
): Promise<{
  transaction: Transaction | undefined;
  provider: ethers.providers.Provider | undefined;
}> => {
  const signer: Wallet = await getSigner(chain);
  const tx: providers.TransactionResponse = await signer.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(networks[chain].tokens[token].amount.toString()),
  });

  return { transaction: tx, provider: signer.provider };
};

export const transferToken = async (
  address: string,
  chain: string,
  token: string
): Promise<{
  transaction: Transaction | undefined;
  provider: ethers.providers.Provider | undefined;
}> => {
  const signer: Wallet = await getSigner(chain);
  const contract: Contract = await getContract(
    signer,
    networks[chain].tokens[token].contractAddress
  );

  const tx = await contract.transfer(
    address,
    ethers.utils.parseEther(networks[chain].tokens[token].amount.toString())
  );

  return { transaction: tx, provider: signer.provider };
};
