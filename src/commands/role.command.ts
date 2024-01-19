import { Role } from "discord.js";
import { ICommand } from "../types/command.type";
import {
  createEmbedFieldWithText,
  createEmbedWithText,
  createMessageWithEmbed,
  createSlashCommand,
} from "../utils/discord.util";
import {
  addRoleToPlan,
  deleteRoleByPlan,
  editRolePlan,
  getAllRoles,
} from "../lib/db.lib";

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
  if (typeof type === "undefined") return true;
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
        if (!args.planId)
          throw new Error("Al agregar el id del plan es obligatorio");
        await addRoleToPlan(args.role.id, args.planId);
        break;
      }
      case Types.MODIFY: {
        if (!args.planId)
          throw new Error("Al editar el id del plan es obligatorio");
        await editRolePlan(args.role.id, args.planId);
        break;
      }
      case Types.REMOVE: {
        if (!args.planId) throw new Error("Al borrar debe especificar el plan");
        await deleteRoleByPlan(args.planId);
        break;
      }
      default: {
        const roles = await getAllRoles();
        await message.reply({
          embeds: [
            createEmbedWithText(`ROLES:`).addFields(
              roles.map((rol) =>
                createEmbedFieldWithText(rol.planId || "-", `<@&${rol.roleId}>`)
              )
            ),
          ],
        });
        return;
      }
    }
    await message.reply(
      createMessageWithEmbed(`OPERACIÓN: ${args.type} realizada con éxito`)
    );
  },
  slashCommand: createSlashCommand(
    "rol",
    "Comando usado para modificar los roles",
    [
      {
        type: "string",
        name: "acción",
      },
      {
        type: "role",
        name: "rol",
      },
      {
        type: "string",
        name: "plan",
        description: "Id del plan",
      },
    ]
  ),
  slashArgsParser: (args) => {
    const type = args.find((a) => a.name === "acción")?.value;
    if (!isType(type)) {
      throw new Error("Acción invalida");
    }
    return {
      type,
      role: args.find((a) => a.name === "rol")?.role as Role,
      planId: args.find((a) => a.name === "plan")?.value as string | undefined,
    };
  },
  argsParser(args: any) {
    return args;
  },
};

export default RoleCommand;
