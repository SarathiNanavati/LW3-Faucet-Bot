import { Duration } from "luxon";
import { GatewayIntentBits } from "discord.js";

export const config: ConfigMapping = {
  client: {
    id: "<DISCORD_BOT_ID>",
    token: "MTAzOTE2ODYxNzk2ODgzMjUzMg.GjKvOJ.VWOovbtAjrOeDsWPsPc7-6cZ-agQ1nl7PkCnpU",
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
    ],
  },
  networks: {
    goerli: {
      chainId: 5,
      tokens: {
        eth: {
          chainNative: true,
          amount: 0.1,
          coolDownPeriod: Duration.fromObject({ minutes: 60 }),
        },
        link: {
          chainNative: false,
          contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
          amount: 1,
          coolDownPeriod: Duration.fromObject({ minutes: 60 }),
        },
      },
      explorer: "https://goerli.etherscan.io/tx/",
    },
    mumbai: {
      chainId: 80001,
      tokens: {
        matic: {
          chainNative: true,
          amount: 0.1,
          coolDownPeriod: Duration.fromObject({ minutes: 60 }),
        },
      },
      explorer: "https://mumbai.polygonscan.com/tx/",
    },
    alfajores: {
      chainId: 44787,
      tokens: {
        CELO: {
          chainNative: true,
          amount: 0.1,
          coolDownPeriod: Duration.fromObject({ minutes: 60 }),
        },
      },
      explorer: "https://explorer.celo.org/alfajores/tx/",
    },
  },
};

export type ConfigMapping = {
  client: ClientConfig;
  networks: NetworkConfig;
};

export type ClientConfig = {
  id: string;
  token: string;
  intents: GatewayIntentBits[];
};

export type NetworkConfig = {
  [name: string]: NetworkMapping;
};

export type NetworkMapping = {
  tokens: TokenMapping;
  chainId: number;
  explorer: string;
};

export type TokenMapping = {
  [name: string]: Token;
};

export type Token = {
  chainNative: boolean;
  contractAddress?: string;
  amount: number;
  coolDownPeriod: Duration;
};
