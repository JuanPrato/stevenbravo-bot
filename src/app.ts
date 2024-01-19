import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loaders.util";
import { exit } from "process";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

loadEvents();
loadCommands().catch((e) => {
  console.log(e);
  exit(2);
});
