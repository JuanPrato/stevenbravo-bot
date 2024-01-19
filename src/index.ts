import dotenv from "dotenv";
dotenv.config();

import { exit } from "node:process";
import { client } from "./app";
import { loadSlashCommands } from "./utils/loaders.util";

import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { orders } from "@wix/pricing-plans";
import { members } from "@wix/members";

import { drizzle } from "drizzle-orm/libsql";
import { createClient as createDbClient } from "@libsql/client";

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log("BOT READY");
    import("./events/interaction.event");
    loadSlashCommands(client);
  })
  .catch((e: any) => {
    console.error(`Invalid token=${process.env.TOKEN}`);
    console.log(e);
    exit(1);
  });

export const wixClient = createClient({
  modules: { orders, members },
  auth: ApiKeyStrategy({
    siteId: process.env.SITE_ID!,
    accountId: process.env.ACCOUNT_ID!,
    apiKey: process.env.API_KEY!,
  }),
});

const dbClient = createDbClient({
  url: "file:src/db/database.db",
});

export const db = drizzle(dbClient);
