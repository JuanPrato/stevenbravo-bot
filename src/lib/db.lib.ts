import { eq } from "drizzle-orm";
import { db } from "..";
import { roles, users } from "../db/schema";

export async function saveOrUpdateUserEmail(
  userId: string,
  mail: string
): Promise<void> {
  await db.insert(users).values({
    mail,
    userId,
  });
}

export async function getAllRoles() {
  return db.select().from(roles);
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

export async function deletePlanByRole(role: string) {
  await db.delete(roles).where(eq(roles.roleId, role));
}
