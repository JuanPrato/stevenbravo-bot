import { client } from "../app";
import { Events, TextChannel } from "discord.js";
import { createEmbedWithText } from "../utils/discord.util";
import { db } from "..";
import { config as configTable } from "../db/schema";
import { eq } from "drizzle-orm";

function channelIsTextChannel(c: any): c is TextChannel {
  return true;
}

client.on(Events.GuildMemberAdd, async (member) => {
  const [config, ..._] = await db
    .select()
    .from(configTable)
    .where(eq(configTable.guildId, member.guild.id));
  console.log("New member");
  if (!config || !config.announceChannelId) return;

  const announceChannel: TextChannel = (await client.channels.fetch(
    config.announceChannelId
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
