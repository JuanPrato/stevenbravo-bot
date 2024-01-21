import {
  APIEmbedField,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { User, getAllRoles } from "../lib/db.lib";
import { mainGuild } from "../caches/guild.cache";
import { client } from "../app";

export const createSlashCommand = (
  commandName: string,
  description: string,
  options?: {
    type: "mention" | "string" | "role";
    name: string;
    description?: string;
    required?: boolean;
  }[]
) => {
  const c = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(description);

  for (const option of options || []) {
    switch (option.type) {
      case "mention":
        c.addMentionableOption((o) =>
          o
            .setName(option.name)
            .setDescription(option.description || "-")
            .setRequired(option.required || false)
        );
        break;
      case "string":
        c.addStringOption((o) =>
          o
            .setName(option.name)
            .setDescription(option.description || "-")
            .setRequired(option.required || false)
        );
        break;
      case "role":
        c.addRoleOption((o) =>
          o
            .setName(option.name)
            .setDescription(option.description || "-")
            .setRequired(option.required || false)
        );
    }
  }
  return c;
};

export const createMessageWithEmbed = (text: string) => {
  return {
    embeds: [createEmbedWithText(text)],
  };
};

export const createEmbedWithText = (title: string) => {
  return new EmbedBuilder().setTitle(title).setColor(Colors.DarkRed);
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
