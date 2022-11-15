import { GatewayIntentBits } from "discord.js";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export enum ResponseStatus {
  INITIAL = "INITIAL",
  ERROR = "ERROR",
  PRATIAL_SUCCESS = "PRATIAL_SUCCESS",
  SUCCESS = "SUCCESS",
  INFO = "INFO",
}

export const config: ConfigMapping = {
  web3Config: {
    supplierPrivateKey: process.env.PRIVATE_KEY,
  },
  client: {
    clientId: process.env.APPLICATION_CLIENT_ID,
    guildId: process.env.SERVER_GUILD_ID,
    discord_bot_token: process.env.DISCORD_BOT_TOKEN,
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
          nativeToken: true,
          amount: 0.1,
          coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
        },
        link: {
          nativeToken: false,
          contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
          amount: 1,
          coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
        },
      },
      explorer: "https://goerli.etherscan.io/tx/",
      nodeRpcURL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    },
    mumbai: {
      chainId: 80001,
      tokens: {
        matic: {
          nativeToken: true,
          amount: 1,
          coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
        },
        link: {
          nativeToken: false,
          contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
          amount: 1,
          coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
        },
      },
      explorer: "https://mumbai.polygonscan.com/tx/",
      nodeRpcURL: "https://matic-mumbai.chainstacklabs.com",
    },
    alfajores: {
      chainId: 44787,
      tokens: {
        celo: {
          nativeToken: true,
          amount: 0.1,
          coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
        },
      },
      explorer: "https://explorer.celo.org/alfajores/tx/",
      nodeRpcURL: "https://alfajores-forno.celo-testnet.org",
    },
  },
  database: {
    mongoDbUserName: process.env.MONGODB_USER_NAME,
    mongoDbPassword: process.env.MONGODB_PASSWORD,
    mongoDbClusterName: process.env.MONGODB_CLUSTER_NAME,
    mongoDbDatabaseName: process.env.MONGODB_DATABASE_NAME,
    mongoDbQueryString: process.env.MONGODB_QUERY_STRING,
  },
  responseConfig: {
    INITIAL: {
      color: 0xffbf00,
    },
    ERROR: {
      color: 0xff3333,
    },
    PRATIAL_SUCCESS: {
      color: 0xacdaac,
    },
    SUCCESS: {
      color: 0x5cb85c,
    },
    INFO: {
      color: 0x5bc0de,
    },
  },
};

export type ConfigMapping = {
  client: ClientConfig;
  networks: NetworkConfig;
  database: DatabaseConfig;
  web3Config: Web3Config;
  responseConfig: ResponseConfig;
};

export type ResponseConfig = {
  [status: string]: ResponseMapping;
};

export type ResponseMapping = {
  color: number;
};

export type Web3Config = {
  supplierPrivateKey: string;
};

export type ClientConfig = {
  clientId: string;
  guildId: string;
  discord_bot_token: string;
  intents: GatewayIntentBits[];
};

export type NetworkConfig = {
  [name: string]: NetworkMapping;
};

export type NetworkMapping = {
  tokens: TokenMapping;
  chainId: number;
  explorer: string;
  nodeRpcURL: string;
};

export type TokenMapping = {
  [name: string]: Token;
};

export type Token = {
  nativeToken: boolean;
  contractAddress?: string;
  amount: number;
  coolDownPeriodInMilliSeconds: number;
};

export type DatabaseConfig = {
  mongoDbUserName: string;
  mongoDbPassword: string;
  mongoDbClusterName: string;
  mongoDbDatabaseName: string;
  mongoDbQueryString: string;
};
