import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BigNumber, ethers } from "ethers";
import { DateTime, Duration } from "luxon";
import { config, ResponseStatus } from "../../config/config";
import createResponseEmbed from "../embeds/responseEmbed";
import { createOrUpdate } from "../utils/db-utils";
import {
  getAddressfromUserId,
  getFaucetHasBalance,
  isEligibleForFund,
  transferFunds,
} from "../utils/faucet-utils";
import { interactionResponse, setInteraction } from "../utils/interactionResponse";
import { convertMilliSecondsToHMS, toUpperCase, validateInput } from "../utils/utils";

export default {
  data: new SlashCommandBuilder()
    .setName("faucet")
    .setDescription("Send Testnet funds")
    .addStringOption((option) => {
      const choices = Object.keys(config.networks).map((name) => ({
        name: toUpperCase(name),
        value: name,
      }));
      return option
        .setName("chain")
        .setDescription("Chain for which funds is requested")
        .setRequired(true)
        .addChoices(...choices);
    })
    .addStringOption((option) => {
      const choices = [];
      Object.entries(config.networks).map((e) => {
        Object.entries(e[1].tokens).map((name) => {
          choices.push({
            name: toUpperCase(name[0]),
            value: name[0],
          });
        });
      });
      return option
        .setName("token")
        .setDescription("Requested Token for Testnet")
        .setRequired(true)
        .addChoices(...choices);
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    setInteraction(interaction);
    await interactionResponse(ResponseStatus.INITIAL, {
      title: "Request Received ⌛",
      text: `Your request is been processed. Please wait ⌛`,
    });
    await new Promise((r) => setTimeout(r, 2000));
    const chain = (interaction.options.getString("chain") as string) ?? "Invalid chain";
    const token = (interaction.options.getString("token") as string) ?? "Invalid token";

    if (!validateInput(chain, token)) {
      await interactionResponse(ResponseStatus.ERROR, {
        title: "InValid Network-Chain Pair ❌",
        text: `Fund Requested for pair: ${chain}-${token}`,
      });
      return;
    }

    const { id } = interaction.user;
    const userAddress: string | null = await getAddressfromUserId(id);
    const { isEligible, timeLeft } = await isEligibleForFund(userAddress, chain, token);

    if (isEligible) {
      const faucetBalance: BigNumber = await getFaucetHasBalance(chain, token);
      const transferAmount: BigNumber = ethers.utils.parseEther(
        config.networks[chain].tokens[token].amount.toString()
      );

      if (faucetBalance.gt(transferAmount)) {
        const { transaction: txn, provider } = await transferFunds(userAddress, chain, token);
        await createOrUpdate(interaction.user.id, userAddress, chain, token);

        if (!txn || !txn.hash) {
          await interactionResponse(ResponseStatus.ERROR, {
            title: "Request Failed ❌",
            text: `No Transaction Details found`,
          });
        }
        const transaction = await provider?.getTransaction(txn.hash);
        // console.log("transaction", transaction);

        let txFields = {
          chain,
          token,
          transferAmount: ethers.utils.formatEther(transferAmount),
          fromAddress: txn.from,
          toAddress: txn.to,
          status: "pending 🔄",
          transactionHash: txn.hash,
          blockExplorer: `${config.networks[chain].explorer}${txn.hash}`,
        };
        // console.log("txEm", txFields);
        await interactionResponse(ResponseStatus.PRATIAL_SUCCESS, {
          title: "Transaction sent to Network ✅ ⌛",
          fields: txFields,
        });

        const transactionRes: ethers.providers.TransactionReceipt = await transaction.wait();
        // console.log("transactionRes", transactionRes);

        txFields = {
          ...txFields,
          status: transactionRes.status == 1 ? "success ✅" : "failed ❌",
        };

        // console.log("txEm 2", txFields);
        await interactionResponse(
          transactionRes.status == 1 ? ResponseStatus.SUCCESS : ResponseStatus.ERROR,
          {
            title:
              transactionRes.status == 1
                ? "Request Processed Succesfully ✅ ✅"
                : "Request Failed ❌",
            fields: txFields,
          }
        );
      } else {
        await interactionResponse(ResponseStatus.ERROR, {
          title: "Insufficient Fund ❌",
          text: `Not Enough Funds to Transfer : ${chain}-${token} \nFaucet Balance : ${ethers.utils.formatEther(
            faucetBalance
          )} \nRequested Amount : ${ethers.utils.formatEther(transferAmount)}`,
        });
      }
    } else {
      const resFields = {
        chain,
        token,
        amount: `${config.networks[chain].tokens[token].amount.toString()}`,
        timeLeft: `${convertMilliSecondsToHMS(timeLeft)} Left`,
      };
      await interactionResponse(ResponseStatus.INFO, {
        title: "User CoolDown Period is Active ℹ️",
        fields: resFields,
      });
    }
  },
};
