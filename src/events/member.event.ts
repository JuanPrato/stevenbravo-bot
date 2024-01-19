import { client } from "../app";
import { Events, TextChannel } from "discord.js";

let announceChannel: TextChannel | null = null;

function channelIsTextChannel(c: any): c is TextChannel {
  return true;
}

client.channels.fetch(process.env.ANNOUNCE_CHANNEL_ID!).then((c) => {
  if (!channelIsTextChannel(c)) return;
  announceChannel = c;
});

client.on(Events.GuildMemberAdd, async (member) => {
  await announceChannel?.send(
    `${member} por favor enviar un mensaje directo con tu mail con el compraste tu suscripción.`
  );
});
