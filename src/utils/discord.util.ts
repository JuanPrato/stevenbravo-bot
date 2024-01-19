import {
  APIEmbedField,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

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
