import { Colors, EmbedBuilder, Role } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { db } from "..";
import { users as usersTable } from "../db/schema";

const ExampleCommand: ICommand = {
  command: "example",
  async run(message: IAnswerable): Promise<void> {
    const users = await db.select().from(usersTable);

    await message.reply(
      `${users.reduce<string>(
        (acc, user) => acc + `\n <@${user.userId}> ${user.mail}`,
        ""
      )}`
    );
  },
  slashCommand: createSlashCommand("example", "example command"),
  slashArgsParser: (args) => {
    return args.map((a) => a.value) as string[];
  },
  argsParser(args: any) {
    return args;
  },
};

export default ExampleCommand;
