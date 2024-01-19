import { client } from "../app";
import { CronJob } from "cron";

export function setBetScheduler() {
  const job = new CronJob("0 1 0 * * *", async function () {});
  job.start();
}
