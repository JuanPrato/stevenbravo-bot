import { client } from "../app";
import { commands } from "../caches/commands.cache";
import { mainGuild } from "../caches/guild.cache";
import { getRoleByPlan, saveOrUpdateUser } from "../lib/db.lib";
import { emailRegex } from "../lib/regex.lib";
import { checkForPlan } from "../lib/wix.lib";
import { ICommandException, isAnswerable } from "../types/command.type";

// Text based command handler
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.inGuild()) return;

  const prefix: string = process.env.PREFIX ?? "-";
  if (!message.content.startsWith(prefix)) return;

  const commandName = message.content.slice(prefix.length).split(" ")[0];
  const command = commands.get(commandName);

  if (command === null || command === undefined) return;

  let args = message.content.split(" ");
  args.shift();

  try {
    if (command.argsParser !== undefined) {
      args = command.argsParser(args);
    }
    if (isAnswerable(message)) {
      await command.run(message, args);
    }
  } catch (e) {
    await message.reply((e as ICommandException).message);
  }
});

// Register mail
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.channel.isDMBased()) return;

  const guild = client.guilds.cache.get(mainGuild.id);

  await guild?.members.fetch();

  const userId = message.author.id;
  const member = guild?.members.cache.get(userId);

  if (!member) return;

  const mail = message.content;

  if (!emailRegex.test(mail)) {
    await message.reply(`${mail} no es un mail valido`);
    return;
  }

  const { plan, memberId } = await checkForPlan(mail);

  if (!plan || !memberId) return;

  await saveOrUpdateUser(userId, mail, memberId);

  await message.reply(
    `El mail: ${mail} fue asociado al usuario ${message.author}`
  );

  const roleId = await getRoleByPlan(plan);

  if (!roleId) return;

  const role = guild?.roles.cache.get(roleId);

  if (!role) return;

  await member.roles.add(role);
});
