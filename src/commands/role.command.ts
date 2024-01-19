import { Role } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { db } from "..";
import { users as usersTable } from "../db/schema";

enum Types {
  ADD = "agregar",
  REMOVE = "eliminar",
  MODIFY = "modificar",
}

type Args = {
  type: Types;
  role: Role;
  planId?: string;
};

function isType(type: any): type is Types {
  if (typeof type !== "string") return false;
  return type === Types.ADD || type === Types.REMOVE || type === Types.MODIFY;
}

const RoleCommand: ICommand<Args> = {
  command: "rol",
  async run(message, args): Promise<void> {
    if (message.member.guild.ownerId !== message.member.id) {
      await message.reply("No estas autorizado para utilizar este comando");
      return;
    }

    switch (args.type) {
      case Types.ADD: {
      }
    }
  },
  slashCommand: createSlashCommand(
    "rol",
    "Comando usado para modificar los roles"
  ),
  slashArgsParser: (args) => {
    const type = args.find((a) => a.name === "acción")?.value;
    if (!isType(type)) {
      throw new Error("Acción invalida");
    }
    return {
      type,
      role: args.find((a) => a.name === "role")?.role as Role,
      planId: args.find((a) => a.name === "plan")?.value as string | undefined,
    };
  },
  argsParser(args: any) {
    return args;
  },
};

export default RoleCommand;
