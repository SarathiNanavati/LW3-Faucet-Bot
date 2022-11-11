import { Events, CommandInteraction } from "discord.js";
import { CommandCollectionClient } from "..";

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: CommandInteraction) {
    try {
      if (!interaction.isCommand()) return;

      const command = (interaction.client as CommandCollectionClient).commands?.get(
        interaction.commandName
      );
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      await command.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.stack);
      } else {
        console.log(error);
      }
      await interaction.reply("Command Execution Failed");
    }
  },
};
