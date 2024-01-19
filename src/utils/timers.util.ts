import { checkRoles } from "../lib/wix.lib";

export async function startSchedulerToCheckRoles() {
  await checkRoles();
  setInterval(() => {
    checkRoles().catch(console.error);
  }, 1000 * 60 * 60 * 3);
}
