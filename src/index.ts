import { Client, Events, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { config } from "../config/config";
import connectDB from "./database/connect";
import { toUpperCase } from "./utils/utils";

export interface CommandCollectionClient extends Client {
  commands?: Collection<any, any>;
}

const client: CommandCollectionClient = new Client({
  intents: config.client.intents,
});
client.commands = new Collection();

console.log("Starting Bot");

// load command
try {
  console.log("Loading Commands Started ");
  const commandsPath = path.join(__dirname, "commands");
  for (const file of fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"))) {
    const commandPath = path.join(commandsPath, file);
    const { default: command } = require(commandPath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`${command.data.name} Loaded`);
    } else {
      console.log(
        `[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`
      );
    }
  }
  console.log("Loading Commands Completed");
} catch (error) {
  console.log("Loading Commands Failed", error);
}

// load events-handlers/listeners
try {
  console.log("Loading Event-Handlers/Listeners Started ");
  const eventsPath = path.join(__dirname, "events");

  for (const file of fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"))) {
    const eventFilePath = path.join(eventsPath, file);
    const { default: event } = require(eventFilePath);

    if ("name" in event && "execute" in event && "once" in event) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`Listener Added For Event ${event.name}`);
    } else {
      console.log(
        `[WARNING] The Event at ${eventFilePath} is missing a required "name" or "execute" property.`
      );
    }
  }
  console.log("Loading Event-Handlers/Listeners Completed");
} catch (error) {
  console.log("Loading Event-Handlers/Listeners Failed", error);
}

(async () => {
  await connectDB();
  console.log("Connected to DB");
  client.login(config.client.discord_bot_token);
  console.log("Logged in to discord");
})().catch((err) => {
  if (err instanceof Error) {
    console.log(err.message);
  } else {
    console.log(err);
  }
});
