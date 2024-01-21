import { orders } from "@wix/pricing-plans";
import { wixClient } from "..";
import { SortOrder } from "@wix/pricing-plans/build/cjs/src/pricing-plans-v2-order.universal";
import { User, getUsers } from "./db.lib";
import { updateUsersRoles } from "../utils/discord.util";

export async function checkRoles() {
  try {
    const users = await getUsers();

    const membersId = users.map((user) => user.wixId);

    let wixOrders = await getOrders(membersId);

    if (!wixOrders) return;

    const rolesToUpdate = new Map<string, User[]>();

    fillMapWithOrders(rolesToUpdate, wixOrders, users);

    let offset = wixOrders.pagingMetadata?.count || 0;

    while ((wixOrders.pagingMetadata as any).hasNext) {
      wixOrders = await getOrders(membersId, offset);
      fillMapWithOrders(rolesToUpdate, wixOrders, users);
      offset += wixOrders.pagingMetadata?.count || 1;
    }
    await updateUsersRoles(rolesToUpdate);
  } catch (err) {
    console.error(err as any);
  }
}

function fillMapWithOrders(
  map: Map<string, User[]>,
  wixOrders: orders.ListOrdersResponse &
    orders.ListOrdersResponseNonNullableFields,
  users: User[]
) {
  wixOrders.orders.reduce<Map<string, User[]>>((acc, order) => {
    if (!order.planName) return acc;
    if (!acc.has(order.planName)) {
      acc.set(order.planName, []);
    }

    const u = users.find((u) => u.wixId === order.buyer?.memberId);

    if (!u) return acc;

    acc.get(order.planName)!.push(u);

    return acc;
  }, map);
}

async function getOrders(membersId: string[], offset: number = 0) {
  return wixClient.orders.managementListOrders({
    paymentStatuses: [orders.PaymentStatus.PAID],
    orderStatuses: [orders.OrderStatus.ACTIVE],
    buyerIds: membersId,
    sorting: {
      fieldName: "_createdDate",
      order: SortOrder.DESC,
    },
    offset,
  });
}

export async function checkForPlan(email: string) {
  const members = await wixClient.members
    .queryMembers()
    .eq("loginEmail", email)
    .find();

  const member = members.items[0];

  if (!member || !member._id) {
    throw new Error(`No se encontró cuenta asociada al mail ${email}`);
  }

  const ordersResponse = await wixClient.orders.managementListOrders({
    buyerIds: [member._id],
    orderStatuses: [orders.OrderStatus.ACTIVE],
    limit: 1,
  });

  const order = ordersResponse.orders[0];

  if (!order) return {};

  return {
    plan: order.planName,
    memberId: member._id,
  };
}
