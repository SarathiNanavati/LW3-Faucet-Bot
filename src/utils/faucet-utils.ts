import { BigNumber, ethers, Transaction, utils } from "ethers";
import { UnderlyingByteSource } from "stream/web";
import { config, Token } from "../../config/config";
import { getUserRequestCoolDown } from "./db-utils";
import { getBalance, transferNativeToken, transferToken } from "./ethers-utils";

export const getAddressfromUserId = async (id: string): Promise<string | null> => {
  // Need to add code to get user's address

  // currently adding address of developer : sarathi.eth
  return "0x438d67e825D31D4a9910241074025B75b08470e1";
};

export const isEligibleForFund = async (
  address: string,
  chain: string,
  token: string
): Promise<{ isEligible: boolean; timeLeft: number }> => {
  const userRequestCoolDown = await getUserRequestCoolDown(address, chain, token);

  if (userRequestCoolDown) {
    const lastRequestedDateTime = new Date(userRequestCoolDown.lastRequestDate).getTime();
    let currentTime = new Date().getTime();
    const coolDownTime = config.networks[chain].tokens[token].coolDownPeriodInMilliSeconds;

    if (lastRequestedDateTime + coolDownTime <= currentTime) {
      return { isEligible: true, timeLeft: 0 };
    } else {
      return {
        isEligible: false,
        timeLeft: lastRequestedDateTime + coolDownTime - currentTime,
      };
    }
  } else {
    return { isEligible: true, timeLeft: 0 };
  }
};

export const getFaucetHasBalance = async (chain: string, token: string): Promise<BigNumber> => {
  return await getBalance(chain, token);
};

export const transferFunds = async (
  address: string,
  chain: string,
  token: string
): Promise<{
  transaction: Transaction | undefined;
  provider: ethers.providers.Provider | undefined;
}> => {
  if (config.networks[chain].tokens[token].nativeToken) {
    return await transferNativeToken(address, chain, token);
  } else {
    return await transferToken(address, chain, token);
  }
};
