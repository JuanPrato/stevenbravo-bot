import { db } from "..";
import { users } from "../db/schema";

export async function saveOrUpdateUserEmail(
  userId: string,
  mail: string
): Promise<void> {
  await db.insert(users).values({
    mail,
    userId,
  });
}
