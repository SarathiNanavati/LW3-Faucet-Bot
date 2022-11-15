import { REST, Routes } from "discord.js";
import path from "path";
import { config } from "../config/config";
import fs from "fs";

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

for (const file of fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"))) {
  const commandPath = path.join(commandsPath, file);
  const { default: command } = require(commandPath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.client.discord_bot_token!);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(config.client.clientId!, config.client.guildId!),
      {
        body: commands,
      }
    );

    console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.stack);
    } else {
      console.log(error);
    }
  }
})();
