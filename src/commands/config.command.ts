import { ICommand } from "../types/command.type";
import {
  createEmbedFieldWithText,
  createMessageWithEmbed,
  createSlashCommand,
} from "../utils/discord.util";
import { db } from "..";
import { config as configTable } from "../db/schema";
import { MessageReplyOptions, GuildBasedChannel } from "discord.js";
import { saveOrUpdateConfig } from "../lib/db.lib";
import { eq } from "drizzle-orm";

type Args = {
  type?: string;
  value?: unknown;
};

const ConfigCommand: ICommand<Args> = {
  command: "config",
  async run(message, args): Promise<void> {
    if (message.member.id !== message.member.guild.ownerId) {
      throw new Error("Usuario no autorizado para usar el comando");
    }

    const [config, ..._] = await db
      .select()
      .from(configTable)
      .where(eq(configTable.guildId, message.member.guild.id))
      .limit(1);

    let response: MessageReplyOptions;

    switch (args.type) {
      case "anuncio": {
        const channel = args.value as GuildBasedChannel;
        if (!channel) {
          throw new Error("Debe mencionar un canal para guardar.");
        }
        await saveOrUpdateConfig(
          {
            guildId: message.member.guild.id,
            announceChannelId: channel.id,
          },
          !config
        );
        response = createMessageWithEmbed("Configuración guardada");
        break;
      }
      default: {
        if (!config) {
          throw new Error("Aun no guardaste una configuración inicial");
        }
        response = createMessageWithEmbed("Configuración", [
          createEmbedFieldWithText(
            "Canal de anuncios",
            `<#${config.announceChannelId}>`
          ),
        ]);
      }
    }

    await message.reply(response!);
  },
  slashCommand: createSlashCommand("config", "comando para configurar", [
    {
      type: "string",
      name: "acción",
      description: "anuncio",
    },
    {
      type: "channel",
      name: "canal",
      description: "Menciona el canal para anuncios",
    },
  ]),
  slashArgsParser: (args) => {
    return {
      type: args.find((a) => a.name === "acción")?.value as string,
      value: args.find((a) => a.name === "canal")?.channel,
    };
  },
  argsParser(args: any) {
    return args;
  },
};

export default ConfigCommand;
