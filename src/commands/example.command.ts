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
      `USUARIOS:
      ${users.reduce<string>(
        (acc, user) => acc + `<@${user.userId}> ${user.mail}\n`,
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
