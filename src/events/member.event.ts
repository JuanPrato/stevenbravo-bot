import { client } from "../app";
import { Events, TextChannel } from "discord.js";
import { createEmbedWithText } from "../utils/discord.util";

function channelIsTextChannel(c: any): c is TextChannel {
  return true;
}

client.on(Events.GuildMemberAdd, async (member) => {
  console.log("New member");
  const announceChannel: TextChannel = (await client.channels.fetch(
    process.env.ANNOUNCE_CHANNEL_ID!
  )) as TextChannel;
  await announceChannel.send({
    content: `${member}`,
    embeds: [
      createEmbedWithText(
        `Por favor enviar un mensaje directo con tu mail con el compraste tu suscripción.`
      ),
    ],
  });
});
