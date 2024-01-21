import {
  APIEmbedField,
  ApplicationCommandOptionBase,
  Colors,
  EmbedBuilder,
  RestOrArray,
  SlashCommandBuilder,
} from "discord.js";
import { User, getAllRoles } from "../lib/db.lib";
import { mainGuild } from "../caches/guild.cache";
import { client } from "../app";

function createOption<T extends ApplicationCommandOptionBase>(
  o: T,
  option: Option
): T {
  return o
    .setName(option.name)
    .setDescription(option.description || "-")
    .setRequired(option.required || false);
}

type Option = {
  type: "mention" | "string" | "role" | "channel";
  name: string;
  description?: string;
  required?: boolean;
};

export const createSlashCommand = (
  commandName: string,
  description: string,
  options?: Option[]
) => {
  const c = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(description);

  for (const option of options || []) {
    switch (option.type) {
      case "mention":
        c.addMentionableOption((o) => createOption(o, option));
        break;
      case "string":
        c.addStringOption((o) => createOption(o, option));
        break;
      case "role":
        c.addRoleOption((o) => createOption(o, option));
        break;
      case "channel":
        c.addChannelOption((o) => createOption(o, option));
        break;
    }
  }
  return c;
};

export const createMessageWithEmbed = (
  text: string,
  fields?: RestOrArray<APIEmbedField>
) => {
  return {
    embeds: [createEmbedWithText(text, fields)],
  };
};

export const createEmbedWithText = (
  title: string,
  fields?: RestOrArray<APIEmbedField>
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(Colors.DarkRed)
    .setFields(...(fields || []));
};

export const createEmbedFieldWithText = (
  title: string,
  text: string
): APIEmbedField => {
  return {
    name: title,
    value: text,
  };
};

export const updateUsersRoles = async (plans: Map<string, User[]>) => {
  const roles = await getAllRoles();

  const guild = client.guilds.cache.get(mainGuild.id);
  await guild?.roles.fetch();
  await guild?.members.fetch();

  Array.from(plans.entries()).forEach(([planName, roleUsers]) => {
    const roleId = roles.find((role) => role.planId === planName)?.roleId;
    if (!roleId) return;

    const role = guild?.roles.cache.get(roleId);

    if (!role) return;

    role.members
      ?.filter((m) => !roleUsers.some((ru) => ru.userId === m.id))
      .forEach((u) => u.roles.remove(roleId));

    roleUsers.forEach(async (ru) => {
      const member = guild?.members.cache.get(ru.userId);
      if (!member) return;

      if (role.members.has(member.id)) {
        return;
      }
      member?.roles.add(roleId).catch(console.error);
    });
  });
};
