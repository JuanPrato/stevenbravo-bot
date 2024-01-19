import { members } from "@wix/members";
import { orders } from "@wix/pricing-plans";
import { wixClient } from "..";
import { SortOrder } from "@wix/pricing-plans/build/cjs/src/pricing-plans-v2-order.universal";

async function memberListOrders() {
  try {
    const response = await wixClient.orders.managementListOrders({
      paymentStatuses: [orders.PaymentStatus.PAID],
      sorting: {
        fieldName: "_createdDate",
        order: SortOrder.DESC,
      },
    });

    const buyers = response.orders.map((order) => {
      return order.buyer?.memberId;
    });

    const membersData = await wixClient.members
      .queryMembers({
        fieldSet: members.Set.EXTENDED,
      })
      .in("_id", buyers)
      .find();
  } catch (err) {
    console.error((err as any).details.applicationError);
  }
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

  if (!order) return null;

  return order.planId;
}
