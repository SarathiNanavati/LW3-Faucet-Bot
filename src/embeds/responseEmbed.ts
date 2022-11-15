import { EmbedBuilder } from "discord.js";
import { config, ResponseStatus } from "../../config/config";
const { responseConfig } = config;

const createResponseEmbed = (
  responseStatus: ResponseStatus,
  title: string,
  otherARGS: { [key: string]: string }
): EmbedBuilder => {
  // console.log(responseStatus, title, otherARGS);

  const embed = new EmbedBuilder()
    .setThumbnail("https://avatars.githubusercontent.com/u/95990630?v=4")
    .setColor(responseConfig[responseStatus].color)
    .setTitle(title)
    .setTimestamp();

  if (otherARGS.text) {
    embed.addFields({
      name: "Message",
      value: otherARGS.text,
    });
  } else if (otherARGS.fields) {
    const embedFields = Object.entries(otherARGS.fields).map((field) => {
      let name = field[0].replace(/([A-Z])/g, " $1");
      name = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        name,
        value: field[1],
        inline: field[1].length > 40 ? false : true,
      };
    });

    embed.addFields([...embedFields]);
  } else {
    embed.addFields({
      name: "Message",
      value: "No Message to display",
    });
  }
  return embed;
};

export default createResponseEmbed;
