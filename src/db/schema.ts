import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: text("userId").primaryKey(),
  mail: text("mail").notNull(),
});

export const roles = sqliteTable(
  "roles",
  {
    roleId: text("roleId"),
    planId: text("planId"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.planId, table.roleId] }),
  })
);
