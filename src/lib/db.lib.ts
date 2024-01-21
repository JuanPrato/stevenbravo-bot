import { eq } from "drizzle-orm";
import { db } from "..";
import { config, roles, users } from "../db/schema";

export type User = typeof users.$inferSelect;
export type SaveConfig = typeof config.$inferInsert;

export async function saveOrUpdateUser(
  userId: string,
  mail: string,
  memberId: string
): Promise<void> {
  await db.insert(users).values({
    mail,
    userId,
    wixId: memberId,
  });
}

export async function getUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function getAllRoles() {
  return db.select().from(roles);
}

export async function getRoleByPlan(planId: string) {
  const results = await db.select().from(roles).where(eq(roles.planId, planId));

  return results[0]?.roleId;
}

export async function addRoleToPlan(role: string, plan: string) {
  await db.insert(roles).values({
    planId: plan,
    roleId: role,
  });
}

export async function editRolePlan(role: string, plan: string) {
  await db
    .update(roles)
    .set({
      roleId: role,
    })
    .where(eq(roles.planId, plan));
}

export async function deleteRoleByPlan(plan: string) {
  await db.delete(roles).where(eq(roles.planId, plan));
}

export async function saveOrUpdateConfig(
  newConfig: SaveConfig,
  isNew?: boolean
) {
  if (isNew) {
    db.insert(config).values(newConfig).catch(console.error);
  } else {
    db.update(config)
      .set({ announceChannelId: newConfig.announceChannelId })
      .where(eq(config.guildId, newConfig.guildId));
  }
}
