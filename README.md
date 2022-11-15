# LW3 Faucet

Project created for LearnWeb3DAO bountie of EarnWeb3.

## Getting started

1.  Run `npm install` to get dependency
2.  Create .env file by copying .env.example and update all parameters mentioned in it .

    ```javascript
    # Discord Parameters
    APPLICATION_CLIENT_ID="<APPLICATION_CLIENT_ID>"
    SERVER_GUILD_ID="<SERVER_GUILD_ID>"
    DISCORD_BOT_TOKEN="<DISCORD_BOT_TOKEN>"

    # Database Parameters
    MONGODB_USER_NAME='<MONGODB_USER_NAME>'
    MONGODB_PASSWORD='<MONGODB_PASSWORD>'
    MONGODB_CLUSTER_NAME='<MONGODB_CLUSTER_NAME>'
    MONGODB_DATABASE_NAME='<MONGODB_DATABASE_NAME>'
    MONGODB_QUERY_STRING='retryWrites=true&w=majority'

    # Web3 Parameters
    PRIVATE_KEY="<PRIVATE_KEY>"
    ```

3.  Update getAddressfromUserId function in file src/utils/faucet-utils.ts file to connect to LW3 application and get users address.

    ```typescript
    export const getAddressfromUserId = async (id: string): Promise<string | null> => {
      // Need to add code to get user's address
      // currently adding address of developer : sarathi.eth
      return "0x438d67e825D31D4a9910241074025B75b08470e1";
    };
    ```

4.  Run `npx ts-node src/deploy-commands.ts` to register the faucet command ;

5.  Run `npx run dev` to start the bot in development mode

6.  Run `npx run start` to start the bot in production mode

## Command Structure

- Token can be requested by running `/faucet <chain> <token>` command
  e.g. `/faucet goerli eth`
- As soon as `/faucet` is typed, menu will appear which will help you to select chain/network and token as shown below
  ![image](https://user-images.githubusercontent.com/56193257/201918496-9ec11829-6c0c-4e56-93a6-270f21386b2e.png) 
  ![image](https://user-images.githubusercontent.com/56193257/201918613-d4136ce5-8548-4839-978b-766ba8001877.png)

## Demo/Screenshot

#### Fund Transfer

###### Transaction Sent, Confirmation Pending

![image](https://user-images.githubusercontent.com/56193257/201907007-9ea25b1d-95bb-438e-a60e-e1bbc8ca3f70.png)

###### Transaction Sent, Confirmation Received

![image](https://user-images.githubusercontent.com/56193257/201905936-bca9f394-ee6e-490d-9549-76449bed9eca.png)

#### Not Enough Fund To Transfer

![image](https://user-images.githubusercontent.com/56193257/201906008-c8d1866b-82e9-430d-a401-56a580aa96ea.png)

#### Not Supported Chain Token Pair

![image](https://user-images.githubusercontent.com/56193257/201906703-d3d0a28b-50ba-4f53-8c7b-d73fdb7ad77e.png)

#### CoolDown Period

![image](https://user-images.githubusercontent.com/56193257/201905799-09446cb8-ae82-436c-b4f1-ba7770ec4f76.png)

#### Request Accepted By Bot

![image](https://user-images.githubusercontent.com/56193257/201906269-80a65ce4-be2e-4891-a879-ddda0f8c84b2.png)

## Supported Chain Details

Below are the list of netork/chain-token supported by default:

- Ethereum Goerli - ETH & LINK
- Polygon Mumbai - MATIC
- Celo Alfajores - CELO

## Features

### Faucet:

- Embeds are used to better UI.
- Cooldowm notification appears to avoid multiple token request by user
- Validations with error messages.
- Same Response will update itself as per process progress.

### Development TechStack

- Written in TypeScript
- Used MongoDB database to hold user's request state.
- Uses the [discord.js](https://discord.js.org/) framework.

## Support

### Adding new chain/token

Update config.ts as per following layout

```javascript
    networks: {
        goerli: {
        chainId: 5,
        tokens: {
            eth: {
                nativeToken: true,
                amount: 0.1,
                coolDownPeriodInMilliSeconds: 24 * 60 * 60 * 1000,
            },
        },
        explorer: "https://goerli.etherscan.io/tx/",
        nodeRpcURL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
    }

```

### Adding new token to chain

Update config.ts as per following layout

```javascript
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
    }
```

### Important Files

#### Config files

- [config/config.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/config/config.ts) Contains entire configuration details required for bot to run

#### Faucet Command File

- [src/commands/faucet.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/commands/faucet.ts) 
    Contains Commands Declaration and Event Handler
- [src/utils/faucet-utils.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/utils/faucet-utils.ts)
    Utility functions for `faucet.ts` file.

#### Embed Builder

-[src/embeds/responseEmbed.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/embeds/responseEmbed.ts)
    Function to create response Embed for Better UI.

#### Ethers files

- [src/utils/ethers-utils.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/utils/ethers-utils.ts)
    Utility Functions to interact with Blockchain Network

#### Database files

- [src/database/connect.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/database/connect.ts)
    Function to connect to Database
    
- [src/database/UserRequestCoolDown.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/database/UserRequestCoolDown.ts)
    UserRequestCoolDown Entity is registered here

- [src/utils/db-utils.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/utils/db-utils.ts)
    Contains Database Utility Functions

#### Events/Listener registration function

- [src/events/clientReady.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/events/clientReady.ts)
- [src/events/interactionCreate.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/utils/interactionResponse.ts)

    Event/Listener Handlers

#### Utility Functions

- [src/utils/utils.ts](https://github.com/SarathiNanavati/LW3-Faucet-Bot/blob/master/src/utils/utils.ts)
    Other Utility Functions
