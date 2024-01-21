import { client } from "../app";
import { startSchedulerToCheckRoles } from "../utils/timers.util";

// START SCHEDULER
client.once("ready", async (c) => {
  startSchedulerToCheckRoles();
});
