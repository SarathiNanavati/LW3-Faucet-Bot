// initial response with text
// error response with text
// partial process running respinse with details
// success response with details
// info response with text

import { ChatInputCommandInteraction } from "discord.js";
import { ResponseStatus } from "../../config/config";
import createResponseEmbed from "../embeds/responseEmbed";

let interactionInstance: ChatInputCommandInteraction = null;
export const setInteraction = (interaction: ChatInputCommandInteraction): void => {
  interactionInstance = interaction;
};

export const interactionResponse = async (
  responseStatus: ResponseStatus,
  args: any
): Promise<void> => {
  const responseEmbed = createResponseEmbed(responseStatus, args.title, args);

  if (interactionInstance.replied || interactionInstance.deferred) {
    await interactionInstance.editReply({ embeds: [responseEmbed] });
  } else {
    await interactionInstance.reply({ embeds: [responseEmbed] });
  }
};
