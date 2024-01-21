import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: text("userId").notNull().primaryKey(),
  mail: text("mail").notNull(),
  wixId: text("wixId").notNull().unique(),
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
